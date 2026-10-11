export interface GearItem {
  shortName: string;
  fullName: string;
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
      const fullLine = stripped;
      const shortName = fullLine.slice(2).split(" (")[0].trim();
      guitars.push({ shortName, fullName: fullLine });
    } else if (state === 2) {
      if (stripped.startsWith("#") || (stripped.includes("Pedals") && !stripped.includes("Pedals Available"))) {
        state = 0;
        continue;
      }
      if (stripped && !stripped.startsWith("- ")) {
        const fullLine = stripped;
        const shortName = fullLine.split(" (")[0].trim();
        amps.push({ shortName, fullName: fullLine });
      }
    } else if (state === 3) {
      if (stripped.startsWith("- ")) {
        const shortName = stripped.slice(2).split(" (")[0].trim();
        pedals.push(shortName);
      } else if (stripped && pedals.length > 0) {
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
  reportContent?: string | null
): string {
  let prompt = `Song: ${song}\nArtist: ${artist}\nGuitar: ${guitarFullName}\nAmp: ${ampFullName}\n\n`;

  if (!hasStem && !reportContent) {
    prompt += "No audio stem or extractor report was provided. Run Step 2B research only, and state in Notes that no audio audit was performed and that the settings are research-based approximations.\n";
  } else {
    if (hasStem) {
      prompt += "Included is an isolated guitar stem.\n";
    }
    if (reportContent && reportFilename) {
      prompt += `\n--- ${reportFilename} (Empirical Guitar Audio Extractor report) ---\n`;
      prompt += reportContent + "\n";
    }
  }

  prompt += "\nThis is a new, independent request. Do not carry over data from previous runs.";
  return prompt;
}
