import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const MODEL_NAME = "gemini-3.8-flash";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

function parseJsonSafe(rawText: string): any | null {
  if (!rawText || typeof rawText !== "string") return null;
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Strip markdown code fences if present
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch {}
    }
    // Extract outermost JSON object if surrounded by text
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
      } catch {}
    }
    return null;
  }
}

function extractGroundingSources(response: any): { title: string; uri: string }[] {
  const sources: { title: string; uri: string }[] = [];
  const seen = new Set<string>();
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(chunks)) {
    for (const chunk of chunks) {
      const uri = chunk?.web?.uri;
      const title = chunk?.web?.title || uri;
      if (uri && typeof uri === "string" && !seen.has(uri)) {
        seen.add(uri);
        sources.push({ title: String(title), uri });
      }
    }
  }
  return sources;
}

app.post("/api/generate-recipe", async (req, res) => {
  try {
    const {
      systemInstruction,
      schemaDict,
      specsText,
      userPrompt,
      stemAudio,
      previousRecipeJson,
      validationErrors,
    } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing on server." });
    }

    // Mode A: Targeted Repair Pass when previousRecipeJson and validationErrors are supplied
    if (previousRecipeJson && Array.isArray(validationErrors) && validationErrors.length > 0) {
      console.log(`[Gemini] Running targeted repair pass for ${validationErrors.length} validation error(s)...`);
      const repairPrompt = [
        specsText || "",
        userPrompt,
        "--- PREVIOUS GENERATED JSON (CONTAINS RULE VIOLATIONS) ---",
        JSON.stringify(previousRecipeJson, null, 2),
        "--- SPECIFIC ERRORS TO FIX ---",
        ...validationErrors.map((e: string, idx: number) => `${idx + 1}. ${e}`),
        "",
        "INSTRUCTIONS FOR REPAIR:",
        "1. Fix every listed error above in the JSON while preserving all accurate song research, gear history, and valid settings from the previous JSON.",
        "2. Use ONLY exact pedal names from gear_list.md.",
        "3. CRITICAL: In the 'notes' field, NEVER use words like 'satisfy', 'to pass', 'validation', 'constraint', or 'rule check'. Write 'notes' strictly as a clean musical and technical research summary.",
        "4. Output only the complete corrected JSON object.",
      ].join("\n");

      const repairContents: any[] = [];
      if (stemAudio && stemAudio.base64Data) {
        repairContents.push({
          inlineData: {
            mimeType: stemAudio.mimeType || "audio/mp3",
            data: stemAudio.base64Data,
          },
        });
      }
      repairContents.push(repairPrompt);

      const repairResp = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: repairContents,
        config: {
          systemInstruction: systemInstruction || undefined,
          responseMimeType: "application/json",
          responseSchema: schemaDict || undefined,
          temperature: 0.1,
        },
      });

      const rawText = repairResp.text || "";
      const recipeJson = parseJsonSafe(rawText);
      return res.json({
        rawText,
        recipeJson,
        callPath: "targeted_repair",
      });
    }

    const contents: any[] = [];
    if (stemAudio && stemAudio.base64Data) {
      contents.push({
        inlineData: {
          mimeType: stemAudio.mimeType || "audio/mp3",
          data: stemAudio.base64Data,
        },
      });
    }
    contents.push((specsText || "") + "\n" + userPrompt);

    // 1. Primary Attempt: Single call with Google Search grounding + JSON Schema
    try {
      console.log(`[Gemini] Calling ${MODEL_NAME} with Grounding + JSON Schema...`);
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction: systemInstruction || undefined,
          responseMimeType: "application/json",
          responseSchema: schemaDict || undefined,
          temperature: 0.1,
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text || "";
      const recipeJson = parseJsonSafe(rawText);
      const groundingSources = extractGroundingSources(response);

      if (!recipeJson) {
        throw new Error("Primary response did not parse as valid JSON; triggering two-step fallback.");
      }

      return res.json({
        rawText,
        recipeJson,
        callPath: "single_call",
        groundingSources,
      });
    } catch (apiErr: any) {
      const errorMsg = String(apiErr?.message || "").toLowerCase();
      console.warn("[Gemini] Single-call failed with:", errorMsg);

      const isToolOrSchemaError = [
        "json",
        "schema",
        "grounding",
        "tool",
        "429",
        "quota",
        "resource_exhausted",
        "invalid_argument",
      ].some((kw) => errorMsg.includes(kw));

      if (isToolOrSchemaError) {
        console.log("[Gemini] Executing two-step fallback (Step 1: Research & Audio Audit -> Step 2: Format)...");

        const researchPrompt = [
          specsText || "",
          userPrompt,
          "Perform Step 1 (verify album, release year on Discogs, and cover status) and Step 2 (if audio stem is attached, perform Step 2A Audio Tone Audit with dB/Hz/BPM figures; perform Step 2B era-specific web research on the original guitar, pickups, amp, pedals, and tempo in BPM). Return detailed findings and citations.",
        ].join("\n\n");

        const researchContents: any[] = [];
        if (stemAudio && stemAudio.base64Data) {
          researchContents.push({
            inlineData: {
              mimeType: stemAudio.mimeType || "audio/mp3",
              data: stemAudio.base64Data,
            },
          });
        }
        researchContents.push(researchPrompt);

        let researchText = "";
        let groundingSources: { title: string; uri: string }[] = [];
        try {
          const resp1 = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: researchContents,
            config: {
              systemInstruction: systemInstruction || undefined,
              temperature: 0.1,
              tools: [{ googleSearch: {} }],
            },
          });
          researchText = resp1.text || "";
          groundingSources = extractGroundingSources(resp1);
        } catch (searchToolErr: any) {
          console.warn(
            "[Gemini] Research with googleSearch tool failed, running research without search tool:",
            searchToolErr.message
          );
          const resp1NoTool = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: researchContents,
            config: {
              systemInstruction: systemInstruction || undefined,
              temperature: 0.1,
            },
          });
          researchText = resp1NoTool.text || "";
        }

        const citationsBlock =
          groundingSources.length > 0
            ? "\nGrounded Web Sources:\n" + groundingSources.map((s) => `- ${s.title} (${s.uri})`).join("\n")
            : "";

        // Step 2: Format (including stemAudio so multimodal context is preserved)
        console.log("[Gemini] Formatting recipe with responseSchema...");
        const formatPrompt = [
          specsText || "",
          userPrompt,
          "--- STEP 1 & 2 RESEARCH AND AUDIT FINDINGS ---",
          researchText,
          citationsBlock,
          "Now complete Step 3, Step 4, and Step 5. Output only the required JSON adhering strictly to all constraints in tone_constraints.md.",
        ].join("\n\n");

        const formatContents: any[] = [];
        if (stemAudio && stemAudio.base64Data) {
          formatContents.push({
            inlineData: {
              mimeType: stemAudio.mimeType || "audio/mp3",
              data: stemAudio.base64Data,
            },
          });
        }
        formatContents.push(formatPrompt);

        const resp2 = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: formatContents,
          config: {
            systemInstruction: systemInstruction || undefined,
            responseMimeType: "application/json",
            responseSchema: schemaDict || undefined,
            temperature: 0.1,
          },
        });

        const rawText = resp2.text || "";
        const recipeJson = parseJsonSafe(rawText);

        return res.json({
          rawText,
          recipeJson,
          callPath: "two_call_fallback",
          groundingSources,
        });
      } else {
        throw apiErr;
      }
    }
  } catch (err: any) {
    console.error("[Gemini] Error generating recipe:", err);
    return res.status(500).json({
      error: err?.message || "Failed to generate recipe.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
