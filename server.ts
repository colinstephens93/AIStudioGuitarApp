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

app.post("/api/generate-recipe", async (req, res) => {
  try {
    const { systemInstruction, schemaDict, specsText, userPrompt, stemAudio } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "userPrompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing on server." });
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
      let recipeJson = null;
      try {
        recipeJson = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn("[Gemini] Failed to parse response as JSON directly:", parseErr);
      }

      return res.json({
        rawText,
        recipeJson,
        callPath: "single_call",
      });
    } catch (apiErr: any) {
      const errorMsg = String(apiErr?.message || "").toLowerCase();
      console.warn("[Gemini] Single-call failed with:", errorMsg);

      const isToolOrSchemaError = ["json", "schema", "grounding", "tool", "429", "quota", "resource_exhausted"].some((kw) =>
        errorMsg.includes(kw)
      );

      if (isToolOrSchemaError) {
        console.log("[Gemini] Executing two-step fallback (Step 1: Research -> Step 2: Format)...");

        // Step 1: Research (try with Search tool first; if tool/quota errors, fall back to search-free research)
        const researchPrompt = (specsText || "") + "\n" + userPrompt + "\nPlease research the guitar tone for this track. Return detailed findings and citations.";
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
        } catch (searchToolErr: any) {
          console.warn("[Gemini] Research with googleSearch tool failed, running research without search tool:", searchToolErr.message);
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

        // Step 2: Format
        console.log("[Gemini] Formatting recipe with responseSchema...");
        const formatPrompt = (specsText || "") + "\n" + userPrompt + "\nHere are the research findings:\n" + researchText + "\n\nOutput only the required JSON.";
        const resp2 = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: formatPrompt,
          config: {
            systemInstruction: systemInstruction || undefined,
            responseMimeType: "application/json",
            responseSchema: schemaDict || undefined,
            temperature: 0.1,
          },
        });

        const rawText = resp2.text || "";
        let recipeJson = null;
        try {
          recipeJson = JSON.parse(rawText);
        } catch (parseErr) {
          console.warn("[Gemini] Fallback format step response failed to parse as JSON:", parseErr);
        }

        return res.json({
          rawText,
          recipeJson,
          callPath: "two_call_fallback",
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
