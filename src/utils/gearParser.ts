import { StemDspMetrics, formatStemMetricsForPrompt } from "./audioAnalyzer";

export interface GearItem {
  shortName: string;
  fullName: string;
}

const KNOWN_PEDAL_ALIASES: Record<string, string> = {
  "ibanez ts9 tube screamer": "Ibanez Tube Screamer TS9",
  "ibanez ts9": "Ibanez Tube Screamer TS9",
  "ts9": "Ibanez Tube Screamer TS9",
  "ibanez ts9dx turbo tube screamer": "Ibanez Tube Screamer TS9DX",
  "ibanez ts9dx": "Ibanez Tube Screamer TS9DX",
  "ts9dx": "Ibanez Tube Screamer TS9DX",
  "boss sd-1 super overdrive": "BOSS SD-1",
  "mxr analog chorus (m234)": "MXR Analog Chorus",
  "mxr classic overdrive (m66)": "MXR Classic Overdrive",
  "caline cp-513 simon super delay": "Simon Super Delay Pedal",
  "caline simon super delay": "Simon Super Delay Pedal",
  "simon super delay": "Simon Super Delay Pedal",
  "sonicake tone group 10-band eq (qds-01)": "Sonicake EQ Pedal",
  "sonicake tone group 10-band (qds-01)": "Sonicake EQ Pedal",
  "sonicake tone group 10-band eq": "Sonicake EQ Pedal",
  "sonicake 10-band eq": "Sonicake EQ Pedal",
  "sonicake 10-band": "Sonicake EQ Pedal",
  "eno ex eq7 7-band eq": "EX 7 Band EQ Pedal",
  "eno ex eq7": "EX 7 Band EQ Pedal",
  "ex 7-band eq": "EX 7 Band EQ Pedal",
  "ex 7-band eq pedal": "EX 7 Band EQ Pedal",
  "ex 7 band eq": "EX 7 Band EQ Pedal",
  "joyo tremolo / jf-09": "JOYO Tremolo",
  "joyo jf-09 tremolo": "JOYO Tremolo",
  "joyo voodoo octave / jf-12": "JOYO Voodoo Octave",
  "joyo jf-12 voodoo octave": "JOYO Voodoo Octave",
  "joyo vintage overdrive / jf-01": "JOYO Vintage Overdrive",
  "joyo jf-01 vintage overdrive": "JOYO Vintage Overdrive",
  "general guitar gadgets octavio / toct": "General Guitar Gadgets Octavio Clone",
  "general guitar gadgets octavio": "General Guitar Gadgets Octavio Clone",
  "dunlop cry baby wah / gcb95": "Dunlop Cry Baby Wah",
  "dunlop gcb95 cry baby wah": "Dunlop Cry Baby Wah",
  "cry baby wah": "Dunlop Cry Baby Wah",
  "joyo dyna compressor / jf-10": "JOYO Dyna Compressor",
  "rowin analog dumbler overdrive / lef-315": "Rowin Analog Dumbler Overdrive",
  "joyo crunch distortion / jf-03": "JOYO Crunch Distortion",
  "rowin tube pusher overdrive": "Rowin Tube Pusher Overdrive / LEF-328",
  "rowin octopus octave": "Rowin Octopus Octave / LEF-3806",
};

export function normalizePedalName(rawName: string, allowedPedals: string[]): string {
  const trimmed = String(rawName || "").trim();
  if (!trimmed) return trimmed;

  const lower = trimmed.toLowerCase();
  const exactMatch = allowedPedals.find((p) => p.toLowerCase() === lower);
  if (exactMatch) return exactMatch;

  const aliasTarget = KNOWN_PEDAL_ALIASES[lower];
  if (aliasTarget) {
    const allowedAlias = allowedPedals.find((p) => p.toLowerCase() === aliasTarget.toLowerCase());
    if (allowedAlias) return allowedAlias;
  }

  // Strip parenthetical or slash model suffixes if base name matches an allowed pedal
  const baseWithoutParen = lower.split(" (")[0].trim();
  const baseWithoutSlash = baseWithoutParen.split(" /")[0].trim();
  for (const candidate of [baseWithoutParen, baseWithoutSlash]) {
    if (KNOWN_PEDAL_ALIASES[candidate]) {
      const target = KNOWN_PEDAL_ALIASES[candidate].toLowerCase();
      const found = allowedPedals.find((p) => p.toLowerCase() === target);
      if (found) return found;
    }
    const foundDirect = allowedPedals.find(
      (p) => p.toLowerCase() === candidate || p.toLowerCase().split(" /")[0].trim() === candidate
    );
    if (foundDirect) return foundDirect;
  }

  return trimmed;
}

export function normalizeRecipeOutput(
  recipe: any,
  selectedGuitar: string,
  selectedAmp: string,
  allowedPedals: string[]
): any {
  if (!recipe || typeof recipe !== "object") return recipe;

  const normalized = structuredClone(recipe);

  // Normalize rig selection if short name was used
  if (normalized.rig_selection && typeof normalized.rig_selection === "object") {
    const rGuitar = String(normalized.rig_selection.guitar || "").trim();
    const guitarShort = selectedGuitar.replace(/^-\s*/, "").split(" (")[0].trim();
    if (rGuitar && (selectedGuitar.toLowerCase().includes(rGuitar.toLowerCase()) || rGuitar.toLowerCase().includes(guitarShort.toLowerCase()))) {
      normalized.rig_selection.guitar = selectedGuitar.replace(/^-\s*/, "");
    }

    const rAmp = String(normalized.rig_selection.amp || "").trim();
    const ampShort = selectedAmp.split(" (")[0].trim();
    if (rAmp && (selectedAmp.toLowerCase().includes(rAmp.toLowerCase()) || rAmp.toLowerCase().includes(ampShort.toLowerCase()))) {
      normalized.rig_selection.amp = selectedAmp;
    }
  }

  if (Array.isArray(normalized.signal_chain)) {
    normalized.signal_chain = normalized.signal_chain.map((item: any) => ({
      ...item,
      pedal_name: normalizePedalName(item?.pedal_name, allowedPedals),
    }));
  }

  if (Array.isArray(normalized.fixed_pedal_settings)) {
    normalized.fixed_pedal_settings = normalized.fixed_pedal_settings.map((item: any) => ({
      ...item,
      pedal_name: normalizePedalName(item?.pedal_name, allowedPedals),
    }));
  }

  if (Array.isArray(normalized.song_parts)) {
    normalized.song_parts = normalized.song_parts.map((part: any) => {
      const ap = part?.active_pedals;
      if (Array.isArray(ap)) {
        return {
          ...part,
          active_pedals: ap.map((p: any) => normalizePedalName(String(p), allowedPedals)),
        };
      } else if (typeof ap === "string") {
        return {
          ...part,
          active_pedals: ap
            .split(",")
            .map((p) => normalizePedalName(p.trim(), allowedPedals))
            .filter(Boolean),
        };
      }
      return part;
    });
  }

  return normalized;
}

export function readGearMenus(gearListText: string): {
  guitars: GearItem[];
  amps: GearItem[];
  pedals: string[];
} {
  const guitars: GearItem[] = [];
  const amps: GearItem[] = [];
  const pedals: string[] = [];

  let state = 0; // 1 = Guitars, 2 = Amps, 3 = Pedals

  const lines = gearListText.split(/\r?\n/);
  for (const rawLine of lines) {
    const stripped = rawLine.trim();

    if (stripped.includes("Guitars Available")) {
      state = 1;
      continue;
    } else if (stripped.includes("Amps Available")) {
      state = 2;
      continue;
    } else if (stripped.includes("Pedals Available")) {
      state = 3;
      continue;
    }

    if (state === 1 && stripped.startsWith("- ")) {
      const fullLine = stripped.slice(2).trim();
      const shortName = fullLine.split(" (")[0].trim();
      guitars.push({ shortName, fullName });
    } else if (state === 2) {
      if (stripped.startsWith("## ") || (stripped.includes("Pedals") && !stripped.includes("Pedals Available"))) {
        state = 0;
        continue;
      }
      if (
        stripped &&
        !stripped.startsWith("- ") &&
        !stripped.startsWith("*") &&
        !stripped.startsWith(">")
      ) {
        const cleanLine = stripped.replace(/^###\s+/, "").trim();
        if (cleanLine) {
          const shortName = cleanLine.split(" (")[0].trim();
          amps.push({ shortName, fullName: cleanLine });
        }
      }
    } else if (state === 3) {
      if (stripped.startsWith("- ")) {
        const shortName = stripped.slice(2).split(" (")[0].trim();
        pedals.push(shortName);
      } else if (stripped.startsWith("#") && pedals.length > 0) {
        break;
      }
    }
  }

  return { guitars, amps, pedals };
}

export function loadInstructions(masterFileText: string): {
  systemInstruction: string;
  schemaDict: Record<string, any>;
} {
  const sysInstMatch = masterFileText.match(/Block 1 — System instructions[\s\S]*?```[^\n]*\n([\s\S]*?)```/i);
  if (!sysInstMatch || !sysInstMatch[1]) {
    throw new Error("Could not find Block 1 system instructions fenced code block in ai_tool_system_instructions_master.md");
  }
  const systemInstruction = sysInstMatch[1].trim();

  const schemaMatch = masterFileText.match(/Block 2 — JSON Response Schema[\s\S]*?```json\n([\s\S]*?)```/i);
  if (!schemaMatch || !schemaMatch[1]) {
    throw new Error("Could not find Block 2 JSON Response Schema fenced code block in ai_tool_system_instructions_master.md");
  }
  const schemaText = schemaMatch[1].trim();
  let schemaDict: Record<string, any>;
  try {
    schemaDict = JSON.parse(schemaText);
  } catch (err: any) {
    throw new Error(`Error parsing Block 2 JSON schema from master file: ${err?.message || err}`);
  }

  return { systemInstruction, schemaDict };
}

export function buildDynamicSchema(
  baseSchema: Record<string, any>,
  selectedGuitar: string,
  selectedAmp: string,
  allowedPedals: string[],
  requireAcousticAudit: boolean
): Record<string, any> {
  const schema = structuredClone(baseSchema);
  const props = schema.properties || {};

  // Constrain rig_selection guitar and amp descriptions
  if (props.rig_selection?.properties) {
    const cleanGuitar = selectedGuitar.replace(/^-\s*/, "").trim();
    if (props.rig_selection.properties.guitar) {
      props.rig_selection.properties.guitar.description = `Must be "${cleanGuitar}".`;
    }
    if (props.rig_selection.properties.amp) {
      props.rig_selection.properties.amp.description = `Must be "${selectedAmp}".`;
    }
  }

  // Constrain pedal names to exact gear_list.md enum
  const isCyber = selectedAmp.toLowerCase().includes("cyber-twin");
  if (!isCyber && allowedPedals.length > 0) {
    if (props.signal_chain?.items?.properties?.pedal_name) {
      props.signal_chain.items.properties.pedal_name.enum = [...allowedPedals];
    }
    if (props.fixed_pedal_settings?.items?.properties?.pedal_name) {
      props.fixed_pedal_settings.items.properties.pedal_name.enum = [...allowedPedals];
    }
    if (props.song_parts?.items?.properties?.active_pedals?.items) {
      props.song_parts.items.properties.active_pedals.items.enum = [...allowedPedals, "None"];
    }
  }

  // Require acoustic_audit when stem or report is supplied
  if (requireAcousticAudit && props.acoustic_audit) {
    if (Array.isArray(schema.required) && !schema.required.includes("acoustic_audit")) {
      schema.required.push("acoustic_audit");
    }
  }

  return schema;
}

export const SPEC_FILES_ORDER = [
  "gear_list.md",
  "tone_constraints.md",
  "pedal_controls_usage_reference.md",
  "amp_controls_usage_reference.md",
  "fender_cyber_twin_manual_reference.md",
  "stem_analysis_reference.md",
] as const;

export function buildSpecsText(specFiles: Record<string, string>): string {
  let specsText = "";
  for (const spec of SPEC_FILES_ORDER) {
    const content = specFiles[spec] || "";
    specsText += `\n--- ${spec} ---\n${content}\n`;
  }
  return specsText;
}

export function buildUserPrompt(
  song: string,
  artist: string,
  guitarFullName: string,
  ampFullName: string,
  hasStem: boolean,
  reportFilename?: string | null,
  reportContent?: string | null,
  stemFilename?: string | null,
  stemMetrics?: StemDspMetrics | null
): string {
  const cleanGuitar = guitarFullName.replace(/^-\s*/, "").trim();
  let prompt = `Song: ${song}\nArtist: ${artist}\nGuitar: ${cleanGuitar}\nAmp: ${ampFullName}\n\n`;

  if (!hasStem && !reportContent) {
    prompt +=
      "No audio file or extractor report was provided. Run Step 2B web research only. State in Notes that no audio audit was performed and that the settings are research-based approximations. Include 'Net-new research — no prior recipes or analyses referenced' in Notes.\n";
  } else {
    if (hasStem) {
      prompt += `Included is an uploaded isolated guitar stem audio file (${stemFilename || "stem audio"}). Perform Step 2A Audio Tone Audit and combine it with Step 2B web search.\n`;
      if (stemMetrics && stemFilename) {
        prompt += `\n${formatStemMetricsForPrompt(stemFilename, stemMetrics)}\n`;
      }
      if (!reportContent) {
        prompt += `State "Net-new research — no prior recipes or analyses referenced" in Notes, and summarize the stem analysis findings in Notes.\n`;
      }
    }
    if (reportContent && reportFilename) {
      if (!hasStem) {
        prompt += `An Empirical Guitar Audio Extractor report (${reportFilename}) was provided without a raw audio stem file. Do NOT refer to this as a "stem analysis" in Notes; instead, explicitly cite the exact report filename "${reportFilename}" in Notes and populate acoustic_audit with its measured dB, Hz, and BPM figures.\n`;
      } else {
        prompt += `Both an audio stem and an Empirical Guitar Audio Extractor report (${reportFilename}) were provided. Explicitly cite the exact report filename "${reportFilename}" in Notes.\n`;
      }
      prompt += `\n--- ${reportFilename} (Empirical Guitar Audio Extractor report) ---\n`;
      prompt += reportContent + "\n";
    }
  }

  prompt += "\nThis is a new, independent request. Do not carry over data from previous runs.";
  return prompt;
}
