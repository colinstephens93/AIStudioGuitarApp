import { RecipeJson } from "../types/recipe";
import { safeOrder } from "./ruleChecker";

export function generateMarkdownRecipe(recipe: RecipeJson, modelName = "gemini-3.8-flash"): string {
  const meta = recipe.song_metadata || ({} as any);
  const rig = recipe.rig_selection || ({} as any);

  const song = meta.title || "Unknown Song";
  const artist = meta.artist || "Unknown Artist";
  const album = meta.album || "Unknown Album";
  const year = meta.year || "Unknown Year";
  const cover = meta.cover_status || "Unknown";

  const guitar = rig.guitar || "Unknown Guitar";
  const amp = rig.amp || "Unknown Amp";
  const pickup = rig.pickup_selection || "Unknown Pickup";

  const todayStr = new Date().toISOString().split("T")[0];

  const mdLines: string[] = [];
  mdLines.push(`Generated with Gemini ${modelName} on ${todayStr}.\n`);
  mdLines.push(`# ${song} - ${artist}`);
  mdLines.push(`**Album:** ${album} (${year}) | **Cover Status:** ${cover}`);
  mdLines.push(`**Guitar:** ${guitar} | **Pickup Selection:** ${pickup}`);
  mdLines.push(`**Amp:** ${amp}\n`);

  // Acoustic Audit
  const audit = recipe.acoustic_audit;
  if (audit && Object.keys(audit).length > 0) {
    mdLines.push("## Acoustic Audit");
    if (audit.attack_and_dynamics) {
      mdLines.push(`- **Attack & Dynamics:** ${audit.attack_and_dynamics}`);
    }
    if (audit.frequency_profile) {
      mdLines.push(`- **Frequency Profile:** ${audit.frequency_profile}`);
    }
    if (audit.saturation_type) {
      mdLines.push(`- **Saturation Type:** ${audit.saturation_type}`);
    }
    if (audit.modulation) {
      mdLines.push(`- **Modulation:** ${audit.modulation}`);
    }
    mdLines.push("");
  }

  // Signal Chain
  const chain = recipe.signal_chain || [];
  if (chain.length > 0) {
    mdLines.push("## Signal Chain");
    mdLines.push("```");
    const sortedChain = [...chain].sort((a, b) => safeOrder(a) - safeOrder(b));
    for (const p of sortedChain) {
      mdLines.push(`${p.order ?? "?"}. ${p.pedal_name ?? "Unknown"} - ${p.status ?? "Unknown"}`);
    }
    mdLines.push("```\n");
  }

  // Amp Settings
  const ampSets = recipe.amp_settings || [];
  if (ampSets.length > 0) {
    mdLines.push("## Amp Settings");
    mdLines.push("| Control | Setting |");
    mdLines.push("| --- | --- |");
    for (const s of ampSets) {
      mdLines.push(`| ${s.control ?? ""} | ${s.setting ?? ""} |`);
    }
    mdLines.push("");
  }

  // Fixed Pedal Settings
  const fps = recipe.fixed_pedal_settings || [];
  if (fps.length > 0) {
    mdLines.push("## Fixed Pedal Settings");
    for (const p of fps) {
      const pName = p.pedal_name ?? "Unknown";
      mdLines.push(`### ${pName}`);
      mdLines.push("| Control | Setting |");
      mdLines.push("| --- | --- |");
      const controls = p.controls || [];
      for (const c of controls) {
        mdLines.push(`| ${c.control ?? ""} | ${c.setting ?? ""} |`);
      }
      mdLines.push("");
    }
  }

  // Song Parts
  const parts = recipe.song_parts || [];
  if (parts.length > 0) {
    mdLines.push("## Song Parts");
    mdLines.push("| Part Name | Active Pedals | Pickup Position |");
    mdLines.push("| --- | --- | --- |");
    for (const pt of parts) {
      let pVal = pt.active_pedals ?? "";
      if (Array.isArray(pVal)) {
        pVal = pVal.join(", ");
      }
      const pName = pt.part_name ?? "";
      const pPickup = pt.pickup_position ?? "";
      mdLines.push(`| ${pName} | ${pVal} | ${pPickup} |`);
    }
    mdLines.push("");
  }

  // Notes
  const notes = recipe.notes || "";
  if (notes) {
    mdLines.push("## Notes");
    mdLines.push(notes + "\n");
  }

  const verifyMsg = "Verify the album and release year on Discogs before using this recipe.";
  mdLines.push(`**${verifyMsg}**`);

  return mdLines.join("\n");
}
