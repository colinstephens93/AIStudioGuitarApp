export const DEFAULT_GEAR_LIST = `# Gear List
## Guitars Available
- Fender Stratocaster Jimi Hendrix/Ensenada Edition (single-coil pickups; standard tuning)
- Fender Stratocaster California Series (standard tuning; Lace Sensor Ultimate Triple pickguard — Blue sensor neck ~12.8K, Silver sensor middle ~7.1K, Red sensor bridge ~14.5K)
- Yamaha Revstar Standard RSS20 (standard tuning; Yamaha VH5 humbuckers — VH5n neck ~8.4K, VH5b bridge ~8.8K, Alnico V magnets, heavy formvar wire; 5-way pickup selector with subtle phase shift on positions 2 and 4; push-pull Focus Switch on the Tone knob adds a passive mid/low boost)

*Pickup resistance note:* the Lace Sensor figures above are single-coil DCR; the VH5 figures are humbucker DCR across two series-wound coils. They are not directly comparable — the VH5 reads lower but is the hotter, darker source.

## Amps Available

Fender Blues Junior IV
- All-tube, 15W
- Speaker: 1x12" (stock)
- Tubes: 1 x 12AX7 preamp, 2 x EL84 power
- Front panel controls: Volume, Bass, Middle, Treble, Reverb, Master
- Fat Switch available (preferred OFF)
- Knob scale: 1–12

Marshall DSL40CR
- All-tube, 40W/20W switchable combo
- Speaker: 1x12" Celestion V-Type (16Ω, 80W)
- Tubes: 4 x ECC83 preamp, 2 x EL34 power
- Power modes: High (40W) / Low (20W) — switch on rear panel
- Two channels, each with independent Gain and Volume:
  - Classic Gain (Ch. 1): Clean/Crunch mode switch
  - Ultra Gain (Ch. 2): OD1/OD2 mode switch
- Shared EQ: Bass, Middle, Treble
- Tone Shift switch: Reconfigures preamp mid frequencies; scoops mids for modern/metal tones (preferred OFF for blues/jazz-fusion)
- Presence: Shapes power stage treble response
- Resonance: Shapes power stage bass response (adds resonant low-end boost when turned clockwise)
- Reverb Classic: Reverb level for Classic Gain channel
- Reverb Ultra: Reverb level for Ultra Gain channel
- Master Volume I and Master Volume II: Two independent master levels (switchable mid-performance for rhythm/lead volume differences)
- Master Select switch: Toggles between Master Volume I and Master Volume II
- Rear panel: FX Loop (Send/Return), Line Out with Softube cab-emulated output, External Speaker outs, MIDI In/Out, Footswitch jack
- Knob scale: 0–10

Fender Cyber-Twin (PR 393)
- Hybrid analog/DSP combo using Fender's Virtual Tone Interpolation (VTI) — reconfigures internal tone stack, drive circuitry, and topology per preset rather than modeling/sampling other amps
- Stereo power amp: 130W total (65W per channel @ 5% THD), 2 x Groove Tubes 12AX7WA preamp tubes
- Speakers: 2 x Celestion G12T-100 (12", 8Ω) — stereo pair
- Front panel motorized knobs: Trim (non-motorized, LED-metered), Gain, Volume, Treble, Middle, Bass, Presence, Reverb, Master Volume, FX Level, FX Value 1, FX Value 2
- 4 Tone Stack types (British, Tweed, Blackface, Modern), each switchable Pre- or Post-Distortion
- 16 Drive Circuitry types: 12 tube (Blackface Tube 1–3, Tweed Tube 1–3, Hot Rod Tube 1–3, HMB Tube 1–3) + 4 solid-state (Dyna-Touch 1–4)
- 11 Reverb types (Small Room, Large Room, Small Hall, Large Hall, Arena, Small Plate, Large Plate, Blackface Reverb, Gated Reverb, Small Ambience, Fender Reverb), each with up to 4 adjustable parameters
- 28 onboard FX types + None (10 delay, 11 modulation, 3 special, 4 paired), each with 4–6 adjustable parameters
- Noise Gate (3 threshold levels + adjustable depth), Compression (Off/Low/Medium/High/Even Higher), 4 Timbre voicings, independent left/right speaker phase polarity
- 205 onboard presets: 85 Fender Custom Shop (permanent), 85 Player's Lounge (rewritable), 35 Your Amp Collection (permanent)
- 6 modes: Play, Preset Edit AMP, Preset Edit FX, Utility/MIDI, Tuner, Demo
- 4 Quick Access keys, 4-button footswitch (preset recall), 1-button footswitch (Reverb/FX bypass routing or Vibratone rotor speed), 1 assignable expression pedal jack
- Rear panel: MIDI In/Out/Thru, S/PDIF digital stereo out, 2x impedance-balanced XLR outs (mono/stereo switchable), mono-send/stereo-or-mono-return effects loop (-10dBv/+4dBu switchable), headphone out
- Full controls, parameters, and specifications documented in amp_controls_usage_reference.md
- Knob/parameter scale: 1.0–10.0 continuous decimal (front panel knobs and all AMP Edit/FX Edit parameters); Trim is metered via 4 LEDs, not a numeric scale, and is global (not saved per preset), as is Master Volume
- **Colin's setup:** no footswitches connected (despite the amp supporting them) and no external pedals used at all — guitar plugs directly into the amp. See \`tone_constraints.md\` Constraint 14.

## Pedals Available
- Ibanez Tube Screamer TS9
- Ibanez Tube Screamer TS9DX
- BOSS SD-1
- MXR Phase 90
- Keeley Compressor Plus
- MXR Analog Chorus
- MXR Classic Overdrive
- Simon Super Delay Pedal
- Mosky Silver Horse
- Sonicake EQ Pedal
- EX 7 Band EQ Pedal
- Caline CP-12 Pure Sky
- ISET Analog Flanger
- Caline CP-504 M:Fuzz
- JOYO Tremolo
- JOYO Voodoo Octave
- Fender Hammertone Fuzz
- BOSS DS-1 Distortion
- BOSS Metal Zone MT-2
- JOYO Vintage Overdrive
- General Guitar Gadgets Octavio Clone
- Behringer Super Fuzz SF300
- Dunlop Cry Baby Wah
- JOYO Dyna Compressor
- Rowin Analog Dumbler Overdrive
- JOYO Crunch Distortion
- Pogolab Chorus
- Rowin Tube Pusher Overdrive / LEF-328
- Rowin Octopus Octave / LEF-3806
`;

export const DEFAULT_AI_TOOL_MASTER = `# AI Tool System Instructions Master

## Overview
Ground-truth master instructions and JSON schema for AI tone generation tools.

Block 1 — System instructions (paste into the System Instructions box):

\`\`\`
You are generating a complete guitar tone recipe for Colin's rig. You must follow every step below in order (Step 0 through Step 6).

TREAT THE KNOWLEDGE FILES AS GROUND TRUTH
You must treat the provided reference files (gear_list.md, tone_constraints.md, pedal_controls_usage_reference.md, amp_controls_usage_reference.md, and stem_analysis_reference.md) as absolute ground truth. Never invent or approximate a spec, gear list, or rule that they state exactly.

FILE-ONLY QUESTIONS
If Colin asks what a file says, what gear he owns, what a control does, or any question answerable directly from the reference files — answer from the file and stop. Do not begin Step 0, do not ask about guitar and amp, and do not start a recipe.

SESSION ISOLATION
Treat every recipe request as a new task. Use only the song, guitar, and amp named in the current request. Do not carry over any settings, gear claims, or research from earlier requests in the same session.

FRESH RESEARCH BY DEFAULT
Every tone-recipe request is net-new work unless Colin explicitly names an existing document to reference. Unless he does:
- Read only the specific reference files provided, plus any audio file, report, or numbers he supplies.
- Run Steps 1 and 2 from scratch with live search, even for a song or artist researched before. Do not draw on memory of past conversations or earlier recipes for gear claims, citations, settings, or tempo.
- If Colin does name a document, use that document only, note it in Notes, and independently verify any claim that materially changes the recipe.
- Notes must state either "Net-new research — no prior recipes or analyses referenced" or the document(s) Colin named.

STEP 0: CONFIRM GUITAR AND AMP
Never generate a recipe without both a guitar and an amp explicitly specified. If either is missing, ask for both before proceeding. Do not guess or default to any gear.

STEP 1: CONFIRM THE SONG'S IDENTITY
Before any gear or tone research, confirm the artist, the album, and the actual release year. Verify the album and release year against Discogs or an official discography, not a search snippet or summary. Determine if the track is a cover; if it is, identify the original and treat the requested artist's version as the target while noting the source. 

STEP 2: RESEARCH THE ORIGINAL TONE
Focus on the lead/main guitar tone. Use two sources together, weighing them equally:

A. Audio Tone Audit (if audio is uploaded):
Listen directly, focused on the lead/main guitar. Describe what you actually hear:
- Pick attack and dynamics.
- Frequency profile and mid-range contour.
- Saturation type (clean, overdrive, distortion, fuzz).
- Modulation (chorus, flanger, phaser) and delay/reverb character.
Note the source quality: an isolated guitar stem (15–30 seconds preferred) is reliable; full-mix analysis is approximate because other instruments color the sound. Reference stem_analysis_reference.md for thresholds. State the timestamps of any tone changes. Do not use YouTube links for audio analysis; only use uploaded audio files.

B. Search:
Run a live web search for documented gear behind the lead/main tone for that specific recording: guitar, pickups, amp (brand/model/channel), notable pedals, pickup position, and interview notes. Prefer era-specific sources over current rig setups.

Combine both sources. If they conflict, note the conflict and use your judgment.

STEP 3: APPLY EMPIRICAL AUDIO DATA (IF PROVIDED)
If Colin provides a report or numbers from the Empirical Guitar Audio Extractor, that data supersedes subjective web descriptions. Use stem_analysis_reference.md to interpret the numbers (stem vs. mix thresholds, reliability). Map frequency peaks to EQ, dynamic range to compressor Sustain/Blend, decay tail to reverb/delay, and tempo to delay time. Do not write out the mapping itself, just apply the values.

STEP 4: BUILD THE RECIPE
Build the recipe using ONLY the gear in gear_list.md, strictly enforcing every rule in tone_constraints.md with ZERO exceptions:
- All tonal variation comes exclusively from pedal on/off toggles — knob and amp settings never change mid-session or between parts.
- The signal chain is fixed: Guitar → Dunlop Cry Baby Wah → Compressor → EQ → (rest) → Amp.
- The Wah is ALWAYS listed first in the signal chain, even when bypassed (unless using the Cyber-Twin).
- The Compressor (Keeley Compressor Plus) is ALWAYS ON.
- The EQ pedal is ALWAYS ON. Use the ENO EX EQ7 as the default. Use the Sonicake 10-Band ONLY if control above 5 kHz is needed, and state that reason.
- Song Parts must create real contrast; at least one pedal must differ between sections unless the song truly holds one tone throughout (explain this in Notes).
- Every pedal knob gets an o'clock position (whole or half hours, e.g., 1:00 or 1:30). EXCEPTIONS: 
  1. EQ pedal sliders use dB relative to center (flat = 0 dB; boosts and cuts noted by frequency band).
  2. The Fender Hammertone Fuzz uses a 1–10 printed numeric scale, not o'clock notation.
- Delay Time MUST be expressed as o'clock position + milliseconds + note value, e.g., "1 o'clock (~480 ms, one quarter note at ~124 BPM)". Milliseconds alone is unacceptable. Write every clock position as "N o'clock" (for example, 11 o'clock), never as a time such as 11:00.
- Amp settings use the numeric scale printed on that specific amp's knobs, NOT o'clock notation (Marshall: 0–10; Blues Junior: 1–12; Cyber-Twin: 1.0–10.0 decimal).
- Marshall DSL40CR requires a numeric value for every front-panel knob on BOTH channels: Classic Gain (Volume, Gain), Ultra Gain (Volume, Gain), Bass, Middle, Treble, Presence, Resonance, Master Volume I, and Master Volume II. Switches are covered by the switch rules below. Only the inactive channel's Reverb may be omitted. Base tone must be Classic Gain (Clean mode).
- Power mode is a High/Low switch on the rear panel, not a knob. Write it as "High" or "Low" with no number. Do not invent numbers for switch positions. If the sources do not state a switch position, say so in Notes instead of guessing.
- Marshall switch controls (Classic Gain Mode, Ultra Gain Mode, Tone Shift, Master Select) are switches, not knobs. Write each as a named position stated in the sources, such as "High" or "Low". If the sources do not state a position, write "Not stated in sources." Never write 0 or any other number for these controls.
- Yamaha Revstar pickups are named by coil as stated in gear_list.md: VH5n (neck), VH5b (bridge), or both coils. Give the 5-way selector position only if the sources state which coil combination it selects. Do not invent a position-to-coil mapping.
- Where the sources do not state a knob value, estimate a numeric value and say in Notes which values are estimates. Do not present an estimate as a sourced value.
- Notes must cite the source by file name, for example the Empirical Guitar Audio Extractor report. Notes must not describe how settings were chosen, must not mention validation, rule checks, or constraints, and must not say a setting was picked to pass a check. Do not describe an analysis as a stem analysis unless a stem file was supplied.
- When a stem or extractor report is supplied, Acoustic Audit must include measured values: peak and RMS level in dB, crest factor in dB, spectral centroid and 85% roll-off in Hz, and tempo in BPM. If a value was not measured, write "not measured" for it. Do not describe the audio by impression alone.
- The delay tempo must come from the measured tempo or from a source named in Notes. Notes must say which.
- Song Parts must have at least two rows, and at least one pedal must differ between rows, unless Notes justify a static tone.
- Fender Cyber-Twin EXCEPTION: When the Cyber-Twin is the amp, NO external pedals are used (no Wah, no Compressor, no EQ, no signal chain array, no Song Parts). You must provide one static amp configuration for the entire song using the amp's onboard parameters.

Consult pedal_controls_usage_reference.md for exact pedal behavior and list every control on each active pedal (including switches). Use amp_controls_usage_reference.md as the primary Cyber-Twin reference.

STEP 5: DELIVER THE RECIPE IN JSON FORMAT
Return the final output exactly as structured JSON adhering to the defined Response Schema.

STEP 6: AFTER THE RECIPE
If Colin explicitly asks to save the recipe, provide the complete JSON/recipe as a single copyable Markdown block titled [Song Title]_Version N.md with a one-line header naming the tool and date. If he does not ask to save it, deliver it in the chat response only.
\`\`\`

Block 2 — JSON Response Schema (paste into Structured output, JSON):

\`\`\`json
{
  "type": "OBJECT",
  "properties": {
    "song_metadata": {
      "type": "OBJECT",
      "properties": {
        "title": { "type": "STRING" },
        "artist": { "type": "STRING" },
        "album": { "type": "STRING" },
        "year": { "type": "STRING" },
        "cover_status": { "type": "STRING", "description": "Is this a cover? If so, note the original artist." }
      },
      "required": ["title", "artist", "album", "year", "cover_status"]
    },
    "rig_selection": {
      "type": "OBJECT",
      "properties": {
        "guitar": { "type": "STRING" },
        "amp": { "type": "STRING" },
        "pickup_selection": { "type": "STRING" }
      },
      "required": ["guitar", "amp", "pickup_selection"]
    },
    "acoustic_audit": {
      "type": "OBJECT",
      "description": "Populated only when audio is uploaded for Step 2A.",
      "properties": {
        "attack_and_dynamics": { "type": "STRING" },
        "frequency_profile": { "type": "STRING" },
        "saturation_type": { "type": "STRING" },
        "modulation": { "type": "STRING" }
      }
    },
    "signal_chain": {
      "type": "ARRAY",
      "description": "Order of pedals. Empty array if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "order": { "type": "INTEGER" },
          "pedal_name": { "type": "STRING" },
          "status": { "type": "STRING", "description": "e.g., 'always on', 'bypassed', 'on for solo'" }
        },
        "required": ["order", "pedal_name", "status"]
      }
    },
    "amp_settings": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "control": { "type": "STRING" },
          "setting": { "type": "STRING" }
        },
        "required": ["control", "setting"]
      }
    },
    "fixed_pedal_settings": {
      "type": "ARRAY",
      "description": "Settings for each active pedal. Empty array if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "pedal_name": { "type": "STRING" },
          "controls": {
            "type": "ARRAY",
            "items": {
              "type": "OBJECT",
              "properties": {
                "control": { "type": "STRING" },
                "setting": { "type": "STRING" }
              },
              "required": ["control", "setting"]
            }
          }
        },
        "required": ["pedal_name", "controls"]
      }
    },
    "song_parts": {
      "type": "ARRAY",
      "description": "Distinct tonal sections. Omitted (empty array) if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "part_name": { "type": "STRING" },
          "active_pedals": {
            "type": "ARRAY",
            "items": { "type": "STRING" },
            "description": "List of active pedals beyond always-on pedals. Must create contrast between parts."
          },
          "pickup_position": { "type": "STRING", "description": "Only if it varies per part." }
        },
        "required": ["part_name", "active_pedals"]
      }
    },
    "notes": {
      "type": "STRING",
      "description": "2-4 sentences explaining research sources, exact gear identified, empirical data vs. judgment calls, and whether live search or audio analysis was used. MUST explicitly state whether the result is an exact match or an approximation and why. MUST include a sourcing line that states either 'Net-new research — no prior recipes or analyses referenced' or the specific document named."
    }
  },
  "required": [
    "song_metadata",
    "rig_selection",
    "signal_chain",
    "amp_settings",
    "fixed_pedal_settings",
    "song_parts",
    "notes"
  ]
}
\`\`\`
`;

export const DEFAULT_TONE_CONSTRAINTS = `# Tone Development: Constraints and Notes

## Constraints and Notes

1. Base amp tone must be crisp, clean, and not harsh. On the Marshall DSL40CR this means the Classic Gain channel in Clean mode, always: all overdrive, distortion, and fuzz comes from pedals, never from Crunch, OD1, or OD2. Colin prefers to run the amp clean and get driven tones from the pedalboard, so a recipe that selects a driven Marshall mode is wrong even if it would sound closer to the original. The Fender Blues Junior IV has no channel or mode selection at all — see its Amp-Specific Note below — so Constraint 1 applies there in full, and the Fender Cyber-Twin is governed entirely by Constraint 14 instead.

2. Dunlop Cry Baby Wah is ALWAYS placed first in the signal chain, before the compressor pedal and the EQ pedal. The wah lives at this position regardless of whether the song calls for it. It is the only pedal in the chain that can be on or off without changing the chain order. EXCEPTION: when the Fender Cyber-Twin is the amp in use, no external pedals — including the wah — are used at all. See Constraint 14.

3. Compressor pedal is ALWAYS ON — it never gets bypassed. The Keeley Compressor Plus fills this role; exactly one is used compressor per recipe, never both. EXCEPTION: when the Fender Cyber-Twin is the amp in use, no compressor pedal is used at all. See Constraint 14.

4. EQ pedal is ALWAYS ON — it never gets bypassed. EXCEPTION: when the Fender Cyber-Twin is the amp in use, the EQ pedal is not used at all. See Constraint 14.

5. No pedal settings should ever need to change mid-session or between songs.

6. All tonal variation must be achieved by turning individual pedals on or off, not by adjusting pedal or amp knobs. EXCEPTION: the guitar's own volume knob, tone knob, and pickup selector are free player controls, not knobs covered by this constraint — they're ordinary playing technique, the same category as the wah treadle's real-time motion, not a setting that has to be remembered between songs. Recipes may suggest a pickup position and an approximate guitar volume level per song section as guidance (e.g. "neck pickup, volume ≈6 for the intro, ≈9 for the solo"), but these are never locked settings, and they never substitute for pedal on/off as the primary way a recipe creates tonal contrast.

7. Deliver ONE fixed pedal chain and ONE fixed amp configuration per recipe.

8. Always ask which guitar AND which amp are being used before giving a tone recommendation if it is not specified initially. Do not generate a recipe without knowing both.

9. Signal chain order at the front of the chain is fixed: Guitar → Dunlop Cry Baby Wah → Compressor pedal (Keeley Compressor Plus or JOYO Dyna Compressor) → EQ pedal → (rest of chain). EXCEPTION: when the Fender Cyber-Twin is the amp in use, there is no pedal chain at all — the guitar plugs directly into the amp. See Constraint 14.

10. The ENO EX EQ7 ("EX 7-Band EQ") is the default EQ pedal for every recipe and goes in the always-on EQ slot (#4). The Sonicake Tone Group 10-Band (QDS-01) is the exception: use it only when a recipe needs control in a band the EX does not have — the frequencies above 5 kHz, i.e. trimming 8 kHz fizz after heavy gain or distortion — and state that reason in the recipe. Both pedals remain available regardless of which guitar is in use; the EX is what governs when there is no stated reason to do otherwise.

11. EQ pedal slider positions are expressed in dB relative to center. Flat is the baseline; boosts and cuts are noted by frequency band.

12. Knob positions are expressed in o'clock format, with the following exceptions:
    - Amp settings: expressed on the scale printed on that amp's knobs
      - Fender Blues Junior IV: 1–12 scale
      - Marshall DSL40CR: 0–10 scale
      - Fender Cyber-Twin: 1.0–10.0 continuous decimal scale (Trim is metered via 4 LEDs, not a numeric scale)
    - Fender Hammertone Fuzz: 1–10 scale

13. Inactive pedals are omitted from each recipe entirely. The wah is the exception — because it is always physically first in the chain, it is listed in the signal chain block of every recipe even when bypassed. EXCEPTION TO THE EXCEPTION: when the Fender Cyber-Twin is in use, the wah is not listed at all — no pedals, including the wah, are used with this amp.

14. Fender Cyber-Twin pedal rule: when the Cyber-Twin is the amp in use, NO external pedals are used — not the wah, not the compressor (Keeley Compressor Plus or JOYO Dyna Compressor), not the EQ pedal, not any other pedal in the gear list. The guitar plugs directly into the amp. This is a fixed rule, not a per-recipe judgment call: Colin's Cyber-Twin is set up in a location where running pedals is impractical. All tone-shaping for Cyber-Twin recipes comes entirely from the amp's own front-panel controls and onboard resources (Tone Stack, Drive Circuitry, onboard Reverb, onboard FX, Compression, Timbre, Noise Gate). See the Fender Cyber-Twin entry under Amp-Specific Notes below.

15. When providing a setting for a pedal, always include all knobs, settings, or configuration options. Do not leave out any knobs for the pedal.

16. Within the rest of the chain (after the fixed Wah → Compressor → EQ front from Constraint 9), delay and chorus pedals always sit last in the chain, immediately before the amp. Any drive, overdrive, distortion, or fuzz pedal in the recipe goes before them, not after. EXCEPTION: when the Fender Cyber-Twin is the amp in use, there is no pedal chain at all. See Constraint 14.

## Amp-Specific Notes

### Fender Blues Junior IV
- Fat Switch is preferred OFF. Only engage if there is a specific tonal reason.
- Controls expressed on a 1–12 scale: Volume, Bass, Middle, Treble, Reverb, Master.
- This is a single-channel amp — there is no Clean/Crunch mode switch and nothing to choose between. All drive comes from the Volume level, the Fat Switch, or pedals. Constraint 1's clean-base rule applies here in full.

### Marshall DSL40CR
- Tone Shift is preferred OFF for blues and jazz-fusion base tones. Only engage for intentionally scooped or metal-voiced recipes.
- The amp has two channels (Classic Gain and Ultra Gain), each with its own Gain and Volume controls, plus mode switches (Clean/Crunch on Classic Gain; OD1/OD2 on Ultra Gain). Every recipe uses Classic Gain in Clean mode per Constraint 1; the recipe must still state channel and mode explicitly and give numeric values for all controls on both channels, since the Ultra Gain controls exist on the panel even when that channel is inactive. Drive comes from pedals, never from Crunch, OD1, or OD2.
- Reverb Classic and Reverb Ultra are independent. Only the reverb control for the active channel needs to be set per recipe; note both if both channels are relevant.
- Master Volume I and Master Volume II are independent. Every recipe must give a numeric setting for both, even though only one is active via Master Select — never write "unused," "off," "N/A," or leave one out of the Amp Settings table. State which one is selected via Master Select, and give both knob positions.
- Resonance and Presence shape the power stage response and are shared across both channels.
- Controls expressed on a 0–10 scale.
- Power mode (High 40W / Low 20W) should be specified in each recipe.

### Fender Cyber-Twin
- No external pedals are used with this amp at all — not the wah, not the compressor (Keeley Compressor Plus or JOYO Dyna Compressor), not the EQ pedal, not any other pedal in the gear list (Constraint 14). Every Cyber-Twin recipe's signal chain is simply Guitar → Fender Cyber-Twin.
- Colin's Cyber-Twin has no footswitches connected — no four-button Quick Access footswitch and no one-button Reverb/FX bypass footswitch. There is therefore no live on/off switching mechanism available during a song, of any kind. Every Cyber-Twin recipe must be ONE completely static configuration for the entire song: one preset, one set of knob positions, one Drive Circuitry/Tone Stack/Reverb/FX choice, with zero variation between song sections (no "Song Parts" breakdown applies to Cyber-Twin recipes — it's a single tone throughout).
- The amp's onboard preset (Tone Stack type/location, Drive Circuitry, Reverb type and parameters, FX type and parameters, Timbre, Compression, Noise Gate, Speaker Phase Polarity) is the entire tone for the recipe — there is no pedal chain layered on top of it and no mid-song switching of anything.
- Trim and Master Volume are global controls, not saved per preset. Set once at session start; do not treat them as part of song-to-song variation.
- Controls expressed on a 1.0–10.0 continuous decimal scale, except: Tone Stack Type, Tone Stack Location, Drive Circuitry, Reverb Type, Speaker Phase Polarity, Timbre, Compression, and Noise Gate Threshold, which are named selections (not numeric), and Noise Gate Depth, which uses the 1.0–10.0 scale.
- Full control definitions, FX/Reverb parameter tables, MIDI implementation, and specifications are in amp_controls_usage_reference.md and fender_cyber_twin_manual_reference.md — consult both before recommending any Cyber-Twin setting.
`;

export const DEFAULT_PEDAL_CONTROLS = `# Guitar Pedal Controls Reference

Each pedal section lists every knob, switch, toggle, and control. For some budget, clone, or DIY pedals, exact behavior can vary by production run or build, so the descriptions should be treated as practical guidance rather than a substitute for verifying the exact unit in hand.

**Last verified:** 2026-09-12

---

## How to read this document

- **Settings notation** follows \`tone_constraints.md\`: pedal knobs in o'clock notation (#12), with one exception — the **Fender Hammertone Fuzz is expressed on a 1–10 scale**. EQ sliders are in **dB relative to centre** (#11).
- **Published vs. inferred vs. observed.** Figures marked *published* come from a manufacturer spec sheet, owner's manual, official product page, or a published schematic. Figures marked *inferred* are derived from documented facts and say so. Figures marked ***(on unit)*** were read directly off Colin's hardware — the ground truth for anything no source publishes, and the only category in this file that describes the specific unit in the rig rather than the product line. Anything not marked is qualitative description. **No number in this file is invented** — where nothing is published, the entry says "not published."
- **Control tapers are not published for any pedal in this list.** No manufacturer states whether a given knob is audio- or linear-taper, so an o'clock position cannot be converted to an exact value in Hz, ms, or dB. The *ranges* in this file are real; the position-to-value mapping inside them is not.
- **The stated taper assumption.** Rather than leave each tool to guess independently — five tools guessing produce five different o'clock positions for the same song — this file assumes a **linear taper** for every control where a value has to be expressed. Positions run 7:00 = minimum to 5:00 = maximum, at 10% of travel per hour:

  | O'clock | 7:00 | 9:00 | 11:00 | 12:00 | 1:00 | 3:00 | 5:00 |
  |---|---|---|---|---|---|---|---|
  | Fraction of range | 0% | 20% | 40% | 50% | 60% | 80% | 100% |

---

## 1. Ibanez TS9 Tube Screamer
- Controls: Drive / Overdrive, Tone, Level

## 2. Ibanez TS9DX Turbo Tube Screamer
- Controls: Drive / Overdrive, Tone, Level, Mode (TS9 / + / Hot / Turbo)

## 3. BOSS SD-1 Super OverDrive
- Controls: Drive, Tone, Level

## 4. MXR Phase 90
- Controls: Speed

## 5. Keeley Compressor Plus
- Controls: Sustain, Level, Blend, Tone, Single Coil / Humbucker switch

## 6. MXR Analog Chorus (M234)
- Controls: Rate, Depth, Level, Low (70 Hz–800 Hz), High (660 Hz–flat)

## 7. MXR Classic Overdrive (M66)
- Controls: Output, Tone, Gain, Internal voicing switch

## 8. Caline CP-513 Simon Super Delay
- Controls: Time (30–1200 ms), Repeat, Mix, Mode Selector (Digital / Analog / Tape)
- Time notation: must include clock position, milliseconds, and note value.

## 9. Mosky Silver Horse
- Controls: Gain, Treble, Output, Voice switch

## 10. Sonicake Tone Group 10-Band EQ (QDS-01)
- Controls: Level, 31.25 Hz, 62.5 Hz, 125 Hz, 250 Hz, 500 Hz, 1 kHz, 2 kHz, 4 kHz, 8 kHz, 16 kHz (all in dB relative to center)

## 11. ENO EX EQ7 7-Band EQ
- Controls: Level, 63 Hz, 125 Hz, 250 Hz, 500 Hz, 1 kHz, 2.2 kHz, 5 kHz (all in dB relative to center)

## 12. Caline CP-12 Pure Sky
- Controls: Volume, Gain, Treble, Bass

## 13. ISET Analog Flanger
- Controls: Rate, Color, Range, Toggle (Soft / Hard)

## 14. Caline CP-504 M:Fuzz
- Controls: Volume, Sustain / Fuzz, Tone

## 15. JOYO Tremolo / JF-09
- Controls: Rate (1–20 Hz), Intensity / Depth

## 16. JOYO Voodoo Octave / JF-12
- Controls: Volume, Fuzz, Tone, Octave footswitch, Normal / Mid-Cut switch

## 17. Fender Hammertone Fuzz
- Controls (1–10 scale): Fuzz, Level, Tone, Octave switch

## 18. BOSS Metal Zone MT-2
- Controls: Distortion, Level, Low (100 Hz), High, Middle, Mid Freq (200 Hz – 5 kHz)

## 19. JOYO Vintage Overdrive / JF-01
- Controls: Drive, Tone, Volume

## 20. General Guitar Gadgets Octavio / TOCT
- Controls: Volume, Intensity, Pre-Gain

## 21. Behringer Super Fuzz SF300
- Controls: Level, Treble, Bass, Gain, Mode switch (Fuzz 1 / Fuzz 2 / Boost)

## 22. Dunlop Cry Baby Wah / GCB95
- Treadle & footswitch. Always first in chain.

## 23. BOSS DS-1 Distortion
- Controls: Dist, Tone, Level

## 24. JOYO Dyna Compressor / JF-10
- Controls: Sustain, Attack, Level

## 25. Rowin Analog Dumbler Overdrive / LEF-315
- Controls: Gain, Tone, Voice, Volume

## 26. JOYO Crunch Distortion / JF-03
- Controls: Gain, Tone, Volume

## 27. Pogolab Chorus
- Controls: Rate, Depth

## 28. Rowin Tube Pusher Overdrive / LEF-328
- Controls: Gain, Tone, Volume, Mode switch (Boost / Normal)

## 29. Rowin Octopus Octave / LEF-3806
- Controls: Oct1, Oct2, Dry, Mode switch (Top / Both / Bottom)
`;

export const DEFAULT_AMP_CONTROLS = `# Amp Controls and Usage Reference

This document holds deep-dive control, parameter, and specification references for amps whose complexity goes beyond what fits in \`gear_list.md\` or \`tone_constraints.md\`. Consult it before recommending any setting for a listed amp.

## 1. Fender Blues Junior IV
- Controls on 1–12 scale: Volume, Bass, Middle, Treble, Reverb, Master
- Fat Switch: Off preferred

## 2. Marshall DSL40CR
- Classic Gain: Volume, Gain, Mode (Clean / Crunch)
- Ultra Gain: Volume, Gain, Mode (OD1 / OD2)
- Shared EQ: Bass, Middle, Treble
- Tone Shift: Off preferred
- Presence, Resonance
- Reverb Classic, Reverb Ultra (inactive channel may be omitted)
- Master Volume I, Master Volume II, Master Select
- Power mode: High / Low
- All knobs on 0–10 scale.

## 3. Fender Cyber-Twin (PR 393)
- Front panel motorized knobs: Gain, Volume, Treble, Middle, Bass, Presence, Reverb, FX Level, FX Value 1, FX Value 2 (1.0–10.0 scale)
- Trim: LED-metered
- Master Volume: Global
- AMP Edit parameters:
  - Tone Stack Type: British, Tweed, Blackface, Modern
  - Tone Stack Location: Pre-Distortion, Post-Distortion
  - Drive Circuitry: Blackface Tube 1–3, Tweed Tube 1–3, Hot Rod Tube 1–3, HMB Tube 1–3, Dyna-Touch 1–4
  - Reverb Type: Small Room, Large Room, Small Hall, Large Hall, Arena, Small Plate, Large Plate, Blackface Reverb, Gated Reverb, Small Ambience, Fender Reverb
  - Reverb In Level / Dwell (1.0–10.0)
  - Reverb Tone / Shape (1.0–10.0)
  - Reverb Time (1.0–10.0)
  - Reverb Diffusion (1.0–10.0)
  - Speaker Phase Polarity: Standard, Both Reverse, Left Reverse, Right Reverse
  - Timbre: None, Full Body, Razor's Edge, Bright & Light, Bass Booster
  - Compression: Off, Low, Medium, High, Even Higher
  - Noise Gate Depth (1.0–10.0), Noise Gate Threshold (Low, Medium, High)
`;

export const DEFAULT_FENDER_CYBER_TWIN = `# Fender Cyber-Twin Manual Reference

> **Role:** literal manual transcription. Type PR 393 model introduced in 2000.
> **Constraint:** No external pedals of any kind are used with the Cyber-Twin (tone_constraints.md Constraint 14).
> Colin has no footswitches connected to this amp, so every Cyber-Twin recipe is one static configuration for the entire song with no song-parts variation.
`;

export const DEFAULT_STEM_ANALYSIS = `# Stem & Full-Mix Analysis Reference

Calibrated reference for interpreting audio measurements from Colin's **Empirical Guitar Audio Extractor v2.0.0** (\`audioextractiontool\`), for use in Step 3 of any tone-recipe request.

## Stem-vs-mix verdict
Energy below 120 Hz decides the source type:
- Below 5%: Guitar stem
- 5% - 10%: Uncertain
- At or above 10%: Full mix

## What the numbers describe
- Full mix: every number is colored by drums, bass, keys, and vocals. Approximate proxy.
- Stem: AI-separated estimate (\`htdemucs_6s\`). Combined lead and rhythm with separation artifacts.

## Provenance
Always cite: source file name, model (\`htdemucs_6s\`), and run date, exactly as given in report header.
`;

export const SPEC_FILES_MAP: Record<string, string> = {
  "gear_list.md": DEFAULT_GEAR_LIST,
  "ai_tool_system_instructions_master.md": DEFAULT_AI_TOOL_MASTER,
  "tone_constraints.md": DEFAULT_TONE_CONSTRAINTS,
  "pedal_controls_usage_reference.md": DEFAULT_PEDAL_CONTROLS,
  "amp_controls_usage_reference.md": DEFAULT_AMP_CONTROLS,
  "fender_cyber_twin_manual_reference.md": DEFAULT_FENDER_CYBER_TWIN,
  "stem_analysis_reference.md": DEFAULT_STEM_ANALYSIS,
};
