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

const DRIVE_KEYWORDS = ["screamer", "ts9", "sd-1", "overdrive", "silver horse", "pure sky", "fuzz", "ds-1", "distortion", "metal zone", "mt-2", "octavio", "voodoo octave", "octopus", "dumbler", "tube pusher", "crunch"];
const LATE_CHAIN_KEYWORDS = ["chorus", "delay"];

function isFlatZeroDb(val: string): boolean {
  const clean = val.trim().toLowerCase();
  return (
    clean === "0 db" ||
    clean === "0db" ||
    clean === "+0 db" ||
    clean === "-0 db" ||
    clean === "+0db" ||
    clean === "-0db" ||
    clean === "0" ||
    clean === "flat" ||
    clean.startsWith("0 db ") ||
    clean.startsWith("flat (0")
  );
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
  const hasStatic = /\bstatic\b|\bsingle tone throughout\b|\bone tone throughout\b/.test(notesLower);
  const hasNotStatic = /\bnot static\b|\bnot a static\b/.test(notesLower);
  const isStatic = hasStatic && !hasNotStatic;

  const forbiddenNotePhrases = ["satisfy", "to pass", "validation", "constraint", "rule check"];
  if (forbiddenNotePhrases.some((word) => notesLower.includes(word))) {
    errors.push(
      "Notes must not mention validation, constraints, or rule checks. Cite only the musical/technical sources and state which values are estimates."
    );
  }

  // Rig checks
  const rGuitar = String(rig.guitar || "").trim();
  const rAmp = String(rig.amp || "").trim();
  const cleanSelectedGuitar = selectedGuitar.replace(/^-\s*/, "").trim();
  const guitarShort = cleanSelectedGuitar.split(" (")[0].trim().toLowerCase();
  const ampShort = selectedAmp.split(" (")[0].trim().toLowerCase();

  if (
    !rGuitar ||
    (!cleanSelectedGuitar.toLowerCase().includes(rGuitar.toLowerCase()) &&
      !rGuitar.toLowerCase().includes(guitarShort))
  ) {
    errors.push(`Rig selection guitar '${rGuitar}' does not match the selected guitar '${cleanSelectedGuitar}'.`);
  }
  if (
    !rAmp ||
    (!selectedAmp.toLowerCase().includes(rAmp.toLowerCase()) &&
      !rAmp.toLowerCase().includes(ampShort))
  ) {
    errors.push(`Rig selection amp '${rAmp}' does not match the selected amp '${selectedAmp}'.`);
  }

  const isCyber = selectedAmp.toLowerCase().includes("cyber-twin");
  const isMarshall = selectedAmp.toLowerCase().includes("marshall dsl40cr");
  const isBluesJr = selectedAmp.toLowerCase().includes("blues junior");
  const isRevstar = selectedGuitar.toLowerCase().includes("yamaha revstar standard rss20");

  // Notes audit & provenance checks
  if (!hasStem && !reportFilename) {
    const falseStemClaim =
      /\bstem analysis\b|\banalyzed the stem\b|\buploaded stem\b|\bfrom the stem\b/.test(notesLower) &&
      !/\bno (?:audio |guitar )?stem\b|\bstem was not\b|\bno stem or\b/.test(notesLower);
    if (falseStemClaim) {
      errors.push(
        "Notes claim a stem analysis was performed, but no audio stem was uploaded. State that no audio audit was performed and settings are research-based approximations."
      );
    }
  } else if (!hasStem && reportFilename) {
    const falseStemClaim =
      /\bstem analysis\b|\buploaded stem\b/.test(notesLower) &&
      !/\bno (?:audio |guitar )?stem\b/.test(notesLower);
    if (falseStemClaim) {
      errors.push(
        `No raw audio stem file was uploaded; an Empirical Guitar Audio Extractor report was supplied. Do not call it a "stem analysis" in Notes — cite the exact report file name '${reportFilename}' instead.`
      );
    }
  }

  if (reportFilename) {
    if (!notesLower.includes(reportFilename.toLowerCase())) {
      errors.push(`Notes must include the exact extractor report file name: ${reportFilename}`);
    }
  } else {
    if (!notesLower.includes("net-new research")) {
      errors.push(
        "Notes must include the mandatory sourcing line: 'Net-new research — no prior recipes or analyses referenced'."
      );
    }
  }

  if (hasStem) {
    const badStemDenials = [
      "no audio audit",
      "no audio was provided",
      "no audio stem",
      "no stem was provided",
      "stem was not provided",
      "audio was not provided",
      "research-based approximation",
    ];
    if (badStemDenials.some((phrase) => notesLower.includes(phrase))) {
      errors.push(
        "An audio stem was supplied. Notes must describe the stem analysis and must not say that no audio was provided."
      );
    }
  }

  // Measured audit check
  if (hasStem || reportFilename) {
    const audit = recipe.acoustic_audit;
    if (!audit || typeof audit !== "object" || Object.keys(audit).length === 0) {
      errors.push(
        "acoustic_audit must be populated when an audio stem or extractor report is supplied, including measured dB, Hz, and BPM figures (or 'not measured')."
      );
    } else {
      const auditText = Object.values(audit)
        .map((v) => String(v || ""))
        .join(" ")
        .toLowerCase();
      const hasMeasured = /\d+(?:\.\d+)?\s*(?:db|dbfs|hz|khz|bpm)/i.test(auditText);
      const hasNotMeasured = auditText.includes("not measured");
      if (!(hasMeasured || hasNotMeasured)) {
        errors.push(
          "Acoustic Audit has no measured values. Include dB, Hz, and BPM figures, or write 'not measured' for each value you did not measure."
        );
      }
    }
  }

  // EQ sign check
  for (const s of ampSettings) {
    const cName = String(s?.control || "");
    const val = String(s?.setting || "").trim();
    if (/\b(?:Hz|kHz)\b/i.test(cName)) {
      if (val.toLowerCase() === "not stated in sources" || isFlatZeroDb(val)) {
        continue;
      }
      if (!(val.startsWith("+") || val.startsWith("-"))) {
        errors.push(`Amp EQ band '${cName}' must show + for a boost, - for a cut, or '0 dB' for flat (got: '${val}').`);
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
        if (val.toLowerCase() === "not stated in sources" || isFlatZeroDb(val)) {
          continue;
        }
        if (!(val.startsWith("+") || val.startsWith("-"))) {
          errors.push(
            `EQ pedal '${pName}' control '${cName}' must show + for a boost (e.g., '+2 dB'), - for a cut (e.g., '-3 dB'), or '0 dB' for flat (got: '${val}').`
          );
        }
      }
    }
  }

  // Pedal Name Exact Matching
  const allowedPedalsLower = allowedPedals.map((p) => p.toLowerCase());
  const allowedListStr = allowedPedals.join(", ");

  for (const pedal of signalChain) {
    const pName = String(pedal?.pedal_name || "").trim();
    if (pName && !allowedPedalsLower.includes(pName.toLowerCase())) {
      errors.push(`Signal chain pedal '${pName}' is not in gear_list.md. Use exact name from: ${allowedListStr}`);
    }
  }

  for (const pedal of fixedPedalSettings) {
    const pName = String(pedal?.pedal_name || "").trim();
    if (pName && !allowedPedalsLower.includes(pName.toLowerCase())) {
      errors.push(`Fixed pedal settings pedal '${pName}' is not in gear_list.md. Use exact name from: ${allowedListStr}`);
    }
  }

  // Song Parts pedal name check
  const nonPedalTokens = new Set(["", "-", "none", "no pedals", "no pedal", "amp only", "always-on pedals only"]);
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
    errors.push(`Song Parts pedal '${name}' is not in gear_list.md. Use exact name from: ${allowedListStr}`);
  }

  // Cyber-Twin vs External Pedalboard checks
  if (isCyber) {
    if (signalChain.length > 0) {
      errors.push("Fender Cyber-Twin must have an empty signal_chain array [] (Constraint 14).");
    }
    if (fixedPedalSettings.length > 0) {
      errors.push("Fender Cyber-Twin must have an empty fixed_pedal_settings array [] (Constraint 14).");
    }
    if (songParts.length > 0) {
      errors.push("Fender Cyber-Twin must have an empty song_parts array [] because it uses one static configuration (Constraint 14).");
    }
  } else {
    // Non-Cyber-Twin Signal Chain Topology Checks (Constraints 2, 3, 4, 9, 10, 16)
    const sortedChain = [...signalChain].sort((a, b) => safeOrder(a) - safeOrder(b));

    if (sortedChain.length < 3) {
      errors.push(
        "Signal chain must include at least the 3 fixed front-of-chain pedals: 1. Dunlop Cry Baby Wah → 2. Keeley Compressor Plus → 3. EX 7 Band EQ Pedal (or Sonicake EQ Pedal)."
      );
    } else {
      const firstPedal = sortedChain[0];
      const firstName = String(firstPedal?.pedal_name || "").toLowerCase();
      if (!firstName.includes("wah") || safeOrder(firstPedal) !== 1) {
        errors.push("Dunlop Cry Baby Wah must always be listed first (order 1) in signal_chain, even when bypassed (Constraint 2).");
      }

      const secondPedal = sortedChain[1];
      const secondName = String(secondPedal?.pedal_name || "").toLowerCase();
      const secondStatus = String(secondPedal?.status || "").toLowerCase();
      if (!secondName.includes("compressor") || safeOrder(secondPedal) !== 2) {
        errors.push("Compressor pedal (Keeley Compressor Plus) must be at order 2 in signal_chain (Constraint 3 & 9).");
      } else if (!secondStatus.includes("always on")) {
        errors.push("Compressor pedal at order 2 must have status 'always on' (Constraint 3).");
      }

      const thirdPedal = sortedChain[2];
      const thirdName = String(thirdPedal?.pedal_name || "").toLowerCase();
      const thirdStatus = String(thirdPedal?.status || "").toLowerCase();
      if (!thirdName.includes("eq") || safeOrder(thirdPedal) !== 3) {
        errors.push("EQ pedal (EX 7 Band EQ Pedal or Sonicake EQ Pedal) must be at order 3 in signal_chain (Constraint 4, 9 & 10).");
      } else if (!thirdStatus.includes("always on")) {
        errors.push("EQ pedal at order 3 must have status 'always on' (Constraint 4).");
      }

      if (thirdName.includes("sonicake") && !/5\s*khz|8\s*khz|16\s*khz|fizz/i.test(notes)) {
        errors.push(
          "Sonicake EQ Pedal was selected instead of the default EX 7 Band EQ Pedal, so Notes must state why control above 5 kHz (e.g., 8 kHz fizz) is needed (Constraint 10)."
        );
      }

      // Constraint 16: Drive/Distortion/Fuzz must come before Chorus/Delay
      let maxDriveOrder = -1;
      let minLateChainOrder = 9999;
      for (const item of sortedChain.slice(3)) {
        const pName = String(item?.pedal_name || "").toLowerCase();
        const ord = safeOrder(item);
        if (DRIVE_KEYWORDS.some((kw) => pName.includes(kw))) {
          if (ord > maxDriveOrder) maxDriveOrder = ord;
        }
        if (LATE_CHAIN_KEYWORDS.some((kw) => pName.includes(kw))) {
          if (ord < minLateChainOrder) minLateChainOrder = ord;
        }
      }
      if (maxDriveOrder > minLateChainOrder) {
        errors.push(
          "Signal chain order violation (Constraint 16): All drive, overdrive, distortion, and fuzz pedals must be placed BEFORE chorus and delay pedals."
        );
      }

      // Cross-table check: every active (non-bypassed) pedal in signal_chain must be in fixed_pedal_settings
      const fixedNamesLower = new Set(
        fixedPedalSettings.map((p) => String(p?.pedal_name || "").trim().toLowerCase())
      );
      for (const item of sortedChain) {
        const pName = String(item?.pedal_name || "").trim();
        const status = String(item?.status || "").toLowerCase();
        const isBypassed = status === "bypassed" || status.includes("bypassed");
        if (pName && !isBypassed && !fixedNamesLower.has(pName.toLowerCase())) {
          errors.push(
            `Active pedal '${pName}' in signal_chain is missing from fixed_pedal_settings. Provide settings for all active pedals.`
          );
        }
      }
    }
  }

  // Pedal knob notation & Fender Hammertone Fuzz 1-10 check (Constraint 12)
  for (const pedal of fixedPedalSettings) {
    const pName = String(pedal?.pedal_name || "");
    const pLower = pName.toLowerCase();
    const controls = Array.isArray(pedal?.controls) ? pedal.controls : [];

    if (pLower.includes("hammertone fuzz")) {
      for (const c of controls) {
        const cName = String(c?.control || "").toLowerCase();
        const val = String(c?.setting || "").trim();
        if (["fuzz", "level", "tone"].includes(cName)) {
          if (/o'clock|clock|\b\d{1,2}:\d{2}\b/i.test(val)) {
            errors.push(
              `Fender Hammertone Fuzz control '${c?.control}' must use its 1–10 printed numeric scale, not o'clock notation (got: '${val}').`
            );
          } else {
            const m = val.match(/-?\d+(?:\.\d+)?/);
            const num = m ? parseFloat(m[0]) : NaN;
            if (isNaN(num) || num < 1 || num > 10) {
              errors.push(
                `Fender Hammertone Fuzz control '${c?.control}' must be a number from 1 to 10 (got: '${val}').`
              );
            }
          }
        }
      }
    } else if (!pLower.includes("eq") && !pLower.includes("equalizer") && !pLower.includes("wah")) {
      for (const c of controls) {
        const cName = String(c?.control || "").toLowerCase();
        const val = String(c?.setting || "").trim();
        const isSwitch =
          cName.includes("switch") ||
          cName.includes("mode") ||
          cName.includes("toggle") ||
          cName.includes("footswitch") ||
          cName.includes("voice") ||
          cName.includes("voicing");
        if (!isSwitch && /\b\d{1,2}:00\b/.test(val) && !val.toLowerCase().includes("o'clock")) {
          errors.push(
            `Pedal '${pName}' control '${c?.control}' uses time format '${val}'. Write clock positions as 'N o'clock' (e.g., '11 o'clock'), never as '11:00'.`
          );
        }
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
        if (
          [
            "note",
            "1/4",
            "1/8",
            "1/16",
            "1/2",
            "dotted",
            "quarter",
            "eighth",
            "sixteenth",
            "half",
            "triplet",
            "slapback",
          ].some((kw) => combo.includes(kw))
        ) {
          hasNote = true;
        }
      }

      if (!(hasClock && hasMsNum && hasNote)) {
        errors.push(
          `Delay pedal '${pedal?.pedal_name}' Time control must include an o'clock position, a numeric millisecond value, and a rhythmic note value (e.g., '11 o'clock (~498 ms, quarter note at 120 BPM)').`
        );
      }
    }
  }

  if (delayTimeSet) {
    if (!notesLower.includes("bpm") && !notesLower.includes("tempo")) {
      errors.push("When a delay pedal is used, Notes must state the tempo in BPM and where it came from.");
    }
  }

  // Marshall DSL40CR check
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
      errors.push("Marshall DSL40CR is missing both reverbs; include at least Reverb Classic.");
    }

    const marshallSwitches = ["classic gain mode", "ultra gain mode", "tone shift", "master select"];
    for (const s of ampSettings) {
      const cName = String(s?.control || "");
      const val = String(s?.setting || "").trim();
      const hasDigit = /\d/.test(val);
      const cNameLower = cName.toLowerCase().trim();

      if (cNameLower === "power mode") {
        const valLower = val.toLowerCase();
        if (!["high", "low"].includes(valLower)) {
          errors.push("Marshall 'Power mode' must be exactly 'High' or 'Low', not a number or wattage.");
        }
      } else if (cNameLower === "classic gain mode") {
        if (val.toLowerCase() !== "clean") {
          errors.push(
            `Marshall 'Classic Gain Mode' must be 'Clean' per Constraint 1 (got: '${val}'). All drive comes from pedals.`
          );
        }
      } else if (marshallSwitches.includes(cNameLower)) {
        if (/^\s*[-+]?\d+(\.\d+)?\s*$/.test(val)) {
          errors.push(`${cName} is a switch. Write a named position or 'Not stated in sources', not a number.`);
        }
      } else {
        if (!hasDigit) {
          errors.push(`Marshall knob '${cName}' must have a numeric setting from 0 to 10 (got: '${val}').`);
        } else {
          const matches = val.match(/-?\d+(?:\.\d+)?/);
          if (matches) {
            const num = parseFloat(matches[0]);
            if (!(num >= 0 && num <= 10)) {
              errors.push(`Marshall knob '${cName}' value ${num} is outside the 0 to 10 range.`);
            }
          }
        }
      }
    }
  }

  // Fender Blues Junior IV check
  if (isBluesJr) {
    const expectedBluesJrKnobs = ["Volume", "Bass", "Middle", "Treble", "Reverb", "Master"];
    const actualMap = new Map<string, string>();
    for (const s of ampSettings) {
      actualMap.set(String(s?.control || "").trim().toLowerCase(), String(s?.setting || "").trim());
    }

    const missingKnobs = expectedBluesJrKnobs.filter((k) => !actualMap.has(k.toLowerCase()));
    if (missingKnobs.length > 0) {
      errors.push(`Fender Blues Junior IV missing controls: ${missingKnobs.join(", ")}`);
    }

    for (const k of expectedBluesJrKnobs) {
      const val = actualMap.get(k.toLowerCase());
      if (val !== undefined) {
        if (/o'clock|clock/i.test(val)) {
          errors.push(`Fender Blues Junior IV control '${k}' must use the 1–12 numeric scale, not o'clock notation.`);
        } else {
          const m = val.match(/-?\d+(?:\.\d+)?/);
          const num = m ? parseFloat(m[0]) : NaN;
          if (isNaN(num) || num < 1 || num > 12) {
            errors.push(`Fender Blues Junior IV control '${k}' must be a numeric value between 1 and 12 (got: '${val}').`);
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
    const mainPickup = String(rig.pickup_selection || "").toLowerCase();
    const mainHasValid = ["vh5n", "vh5b", "both coils"].some((coil) => mainPickup.includes(coil));
    const mainHasPos = /position\s*\d/.test(mainPickup);
    if (!mainHasValid || mainHasPos) {
      errors.push(
        "Revstar rig_selection.pickup_selection must name the coil (VH5n, VH5b, or both coils) and omit selector position numbers unless a source states them."
      );
    }

    for (const pt of songParts) {
      const pickup = String(pt?.pickup_position || "").trim().toLowerCase();
      if (!pickup || pickup === "—" || pickup === "-") continue;
      const hasValid = ["vh5n", "vh5b", "both coils"].some((coil) => pickup.includes(coil));
      const hasPos = /position\s*\d/.test(pickup);
      if (!hasValid || hasPos) {
        errors.push(
          "Revstar song_parts pickup_position must name the coil (VH5n, VH5b, or both coils). Remove selector position numbers unless a source states them."
        );
        break;
      }
    }
  }

  return errors;
}
