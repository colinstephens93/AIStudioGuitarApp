import { RecipeJson } from "../types/recipe";

export function safeOrder(item: any): number {
  try {
    const val = item?.order;
    const num = parseInt(String(val), 10);
    return isNaN(num) ? 999 : num;
  } catch {
    return 999;
  }
}

export function runRuleChecks(
  recipe: RecipeJson | any,
  selectedGuitar: string,
  selectedAmp: string,
  allowedPedals: string[],
  hasStem: boolean,
  reportFilename?: string | null
): string[] {
  const errors: string[] = [];

  if (!recipe || typeof recipe !== "object") {
    return ["Output was not valid JSON."];
  }

  const rig = recipe.rig_selection || {};
  const signalChain: any[] = Array.isArray(recipe.signal_chain) ? recipe.signal_chain : [];
  const ampSettings: any[] = Array.isArray(recipe.amp_settings) ? recipe.amp_settings : [];
  const fixedPedalSettings: any[] = Array.isArray(recipe.fixed_pedal_settings) ? recipe.fixed_pedal_settings : [];
  const songParts: any[] = Array.isArray(recipe.song_parts) ? recipe.song_parts : [];
  const notes = String(recipe.notes || "");

  const notesLower = notes.toLowerCase();
  const hasStatic = /\bstatic\b/.test(notesLower);
  const hasNotStatic = /\bnot static\b/.test(notesLower) || /\bnot a static\b/.test(notesLower);
  const isStatic = hasStatic && !hasNotStatic;

  const forbiddenNoteWords = ["satisfy", "to pass", "validation", "constraint", "rule check", "strict"];
  if (forbiddenNoteWords.some((word) => notesLower.includes(word))) {
    errors.push("Notes describe how settings were chosen. Cite the sources and state what is not stated in sources.");
  }

  if (notesLower.includes("confirm")) {
    errors.push("Notes claim a source was confirmed. State what the report or sources show instead.");
  }

  // Rig checks
  const rGuitar = String(rig.guitar || "");
  const rAmp = String(rig.amp || "");
  if (!selectedGuitar.includes(rGuitar)) {
    errors.push(`Rig selection guitar '${rGuitar}' does not match the selected guitar.`);
  }
  if (!selectedAmp.includes(rAmp)) {
    errors.push(`Rig selection amp '${rAmp}' does not match the selected amp.`);
  }

  const isCyber = selectedAmp.toLowerCase().includes("cyber-twin");
  const isMarshall = selectedAmp.toLowerCase().includes("marshall dsl40cr");
  const isRevstar = selectedGuitar.toLowerCase().includes("yamaha revstar standard rss20");

  // Notes audit checks
  if (notesLower.includes("stem") && !hasStem && !reportFilename) {
    errors.push("Notes mention a stem, but no stem was supplied. Cite the extractor report by file name instead.");
  }

  if (reportFilename) {
    if (!notesLower.includes(reportFilename.toLowerCase())) {
      errors.push(`Notes must include the exact report file name: ${reportFilename}`);
    }
  }

  if (hasStem) {
    const badPhrases = [
      "no audio",
      "not provided",
      "no stem",
      "web research",
      "web search",
      "live search",
      "live web",
      "empirical data was",
      "no empirical",
    ];
    if (badPhrases.some((phrase) => notesLower.includes(phrase))) {
      errors.push(
        "A stem was supplied. Notes must describe the stem analysis, not say that no audio was provided. Notes must describe the stem analysis; the recipe must not be based only on web search."
      );
    }
  }

  // Measured audit check
  if (hasStem || reportFilename) {
    const audit = recipe.acoustic_audit;
    if (audit && typeof audit === "object") {
      const auditText = Object.values(audit).map((v) => String(v)).join(" ").toLowerCase();
      const hasMeasured = /\d+\s*(?:db|hz|bpm)/i.test(auditText);
      const hasNotMeasured = auditText.includes("not measured");
      if (!(hasMeasured || hasNotMeasured)) {
        errors.push("Acoustic Audit has no measured values. Include dB, Hz, or BPM figures, or write 'not measured' for each value you did not measure.");
      }
    }
  }

  // EQ sign check
  for (const s of ampSettings) {
    const cName = String(s?.control || "");
    const val = String(s?.setting || "").trim();
    if (/\b(?:Hz|kHz)\b/i.test(cName)) {
      if (val.toLowerCase() === "not stated in sources" || val === "0 dB") {
        continue;
      }
      if (!(val.startsWith("+") || val.startsWith("-"))) {
        errors.push(`EQ band ${cName} must show + for a boost or - for a cut: ${val}`);
      }
    }
  }

  for (const pedal of fixedPedalSettings) {
    const pName = String(pedal?.pedal_name || "");
    if (pName.toLowerCase().includes("eq") || pName.toLowerCase().includes("equalizer")) {
      const controls = Array.isArray(pedal?.controls) ? pedal.controls : [];
      for (const c of controls) {
        const cName = String(c?.control || "");
        const val = String(c?.setting || "").trim();
        if (val.toLowerCase() === "not stated in sources" || val === "0 dB") {
          continue;
        }
        if (!(val.startsWith("+") || val.startsWith("-"))) {
          errors.push(`EQ band ${cName} must show + for a boost or - for a cut: ${val}`);
        }
      }
    }
  }

  // Pedal Name Exact Matching
  const allowedPedalsLower = allowedPedals.map((p) => p.toLowerCase());
  const allowedListStr = allowedPedals.join(", ");

  for (const pedal of signalChain) {
    const pName = String(pedal?.pedal_name || "");
    if (pName && !allowedPedalsLower.includes(pName.toLowerCase())) {
      errors.push(`Pedal '${pName}' is not in gear_list.md. Use one of: ${allowedListStr}`);
    }
  }

  for (const pedal of fixedPedalSettings) {
    const pName = String(pedal?.pedal_name || "");
    if (pName && !allowedPedalsLower.includes(pName.toLowerCase())) {
      errors.push(`Pedal '${pName}' is not in gear_list.md. Use one of: ${allowedListStr}`);
    }
  }

  // Song Parts pedal name check
  const nonPedalTokens = new Set(["", "-", "none", "no pedals", "no pedal", "amp only"]);
  const badSongPartPedals: string[] = [];

  for (const part of songParts) {
    const ap = part?.active_pedals;
    const tokens = Array.isArray(ap) ? ap.map((t) => String(t)) : String(ap || "").split(",");
    for (const t of tokens) {
      const name = t.trim();
      if (nonPedalTokens.has(name.toLowerCase())) {
        continue;
      }
      if (!allowedPedalsLower.includes(name.toLowerCase()) && !badSongPartPedals.includes(name)) {
        badSongPartPedals.push(name);
      }
    }
  }
  for (const name of badSongPartPedals) {
    errors.push(`Song Parts pedal '${name}' is not in gear_list.md. Use one of: ${allowedListStr}`);
  }

  // Cyber-Twin checks
  if (isCyber) {
    if (signalChain.length > 0) {
      errors.push("Cyber-Twin must have an empty signal chain.");
    }
    if (fixedPedalSettings.length > 0) {
      errors.push("Cyber-Twin must have empty fixed pedal settings.");
    }
  }

  // Wah check
  if (!isCyber && signalChain.length > 0) {
    const sortedChain = [...signalChain].sort((a, b) => safeOrder(a) - safeOrder(b));
    const wahPresent = sortedChain.some((p) => String(p?.pedal_name || "").toLowerCase().includes("wah"));
    if (wahPresent) {
      const firstPedal = sortedChain[0];
      const firstName = String(firstPedal?.pedal_name || "").toLowerCase();
      if (!firstName.includes("wah") || safeOrder(firstPedal) !== 1) {
        errors.push("Wah pedal must be listed first (order 1) in the signal chain.");
      }
    }
  }

  // Delay check
  let delayTimeSet = false;
  for (const pedal of fixedPedalSettings) {
    const pName = String(pedal?.pedal_name || "").toLowerCase();
    if (pName.includes("delay")) {
      delayTimeSet = true;
      const controls = Array.isArray(pedal?.controls) ? pedal.controls : [];
      let hasClock = false;
      let hasMsNum = false;
      let hasNote = false;

      for (const c of controls) {
        const val = String(c?.setting || "").toLowerCase();
        const cName = String(c?.control || "").toLowerCase();
        const combo = `${cName} ${val}`;

        if (combo.includes("clock") || combo.includes("o'clock") || /\b\d{1,2}:\d{2}\b/.test(combo)) {
          hasClock = true;
        }
        if ((combo.includes("ms") || combo.includes("millisecond")) && /\d/.test(val)) {
          hasMsNum = true;
        }
        if (["note", "1/4", "1/8", "dotted", "quarter", "eighth"].some((kw) => combo.includes(kw))) {
          hasNote = true;
        }
      }

      if (!(hasClock && hasMsNum && hasNote)) {
        errors.push(`Delay pedal '${pedal?.pedal_name}' controls must include a clock position, a numeric millisecond value, and a note value.`);
      }
    }
  }

  if (delayTimeSet) {
    if (!notesLower.includes("bpm") && !notesLower.includes("tempo")) {
      errors.push("Notes must state the tempo and where it came from.");
    }
  }

  // Marshall check
  if (isMarshall) {
    const expectedCore = [
      "Classic Gain Volume",
      "Classic Gain Gain",
      "Classic Gain Mode",
      "Ultra Gain Volume",
      "Ultra Gain Gain",
      "Ultra Gain Mode",
      "Bass",
      "Middle",
      "Treble",
      "Tone Shift",
      "Presence",
      "Resonance",
      "Master Volume I",
      "Master Volume II",
      "Master Select",
      "Power mode",
    ];

    const actualControlsNorm = ampSettings.map((s) =>
      String(s?.control || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    );

    const missingCritical: string[] = [];
    for (const c of expectedCore) {
      const cNorm = c.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!actualControlsNorm.includes(cNorm)) {
        missingCritical.push(c);
      }
    }

    let foundClassic = false;
    let foundUltra = false;
    for (const s of ampSettings) {
      const cName = String(s?.control || "").toLowerCase();
      if (cName.includes("reverb")) {
        if (cName.includes("classic")) foundClassic = true;
        if (cName.includes("ultra")) foundUltra = true;
      }
    }

    if (missingCritical.length > 0) {
      errors.push(`Marshall DSL40CR missing front-panel controls: ${missingCritical.join(", ")}`);
    }

    if (!foundClassic && !foundUltra) {
      errors.push("Marshall DSL40CR is missing both reverbs; only the inactive channel's reverb may be missing.");
    }

    const marshallSwitches = ["classic gain mode", "ultra gain mode", "tone shift", "master select"];
    for (const s of ampSettings) {
      const cName = String(s?.control || "");
      const val = String(s?.setting || "");
      const hasDigit = /\d/.test(val);
      const cNameLower = cName.toLowerCase();

      if (cNameLower === "power mode") {
        const valLower = val.toLowerCase();
        if (!["high", "low"].includes(valLower)) {
          errors.push("Power mode must be High or Low, not a number.");
        }
      } else if (marshallSwitches.includes(cNameLower)) {
        if (/^\s*[-+]?\d+(\.\d+)?\s*$/.test(val)) {
          errors.push(`${cName} is a switch. Write a named position or 'Not stated in sources', not a number.`);
        }
      } else {
        if (!hasDigit) {
          errors.push(`Marshall control '${cName}' must have a numeric setting from 0 to 10 (got: ${val}).`);
        } else {
          const matches = val.match(/-?\d+(?:\.\d+)?/);
          if (matches) {
            const num = parseFloat(matches[0]);
            if (!(num >= 0 && num <= 10)) {
              errors.push(`Marshall control '${cName}' value ${num} is outside the 0 to 10 range.`);
            }
          }
        }
      }
    }
  }

  // Song Parts check
  if (!isCyber) {
    if (songParts.length < 2 && !isStatic) {
      errors.push("Song Parts must have at least two rows, or Notes must justify a static tone.");
    }
    if (songParts.length >= 2 && !isStatic) {
      const pedalsList = songParts.map((p) => {
        const ap = p?.active_pedals;
        return Array.isArray(ap) ? ap.join(", ") : String(ap || "");
      });
      if (new Set(pedalsList).size === 1) {
        errors.push("song_parts rows have identical active_pedals, but 'notes' does not justify a static tone.");
      }
    }
  }

  // Revstar check
  if (isRevstar) {
    for (const pt of songParts) {
      const pickup = String(pt?.pickup_position || "").toLowerCase();
      const hasValid = ["vh5n", "vh5b", "both coils"].some((coil) => pickup.includes(coil));
      const hasPos = /position\s*\d/.test(pickup);
      if (!hasValid || hasPos) {
        errors.push("Revstar pickup must name the coil (VH5n, VH5b, or both coils). Remove selector position numbers unless a source states them.");
        break;
      }
    }
  }

  return errors;
}
