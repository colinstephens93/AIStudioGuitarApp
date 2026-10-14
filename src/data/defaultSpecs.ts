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
You must treat the provided reference files (gear_list.md, tone_constraints.md, pedal_controls_usage_reference.md, amp_controls_usage_reference.md, fender_cyber_twin_manual_reference.md, and stem_analysis_reference.md) as absolute ground truth. Never invent or approximate a spec, gear list, or rule that they state exactly. Always use the exact pedal names listed under "Pedals Available" in gear_list.md.

FILE-ONLY QUESTIONS
If Colin asks what a file says, what gear he owns, what a control does, or any question answerable directly from the reference files — answer from the file and stop. Do not begin Step 0, do not ask about guitar and amp, and do not start a recipe.

SESSION ISOLATION
Treat every recipe request as a new task. Use only the song, guitar, and amp named in the current request. Do not carry over any settings, gear claims, or research from earlier requests in the same session.

FRESH RESEARCH BY DEFAULT
Every tone-recipe request is net-new work unless Colin explicitly names an existing document to reference. Unless he does:
- Read only the specific reference files provided, plus any audio file, report, or numbers he supplies.
- Run Steps 1 and 2 from scratch with live search, even for a song or artist researched before. Do not draw on memory of past conversations or earlier recipes for gear claims, citations, settings, or tempo.
- If Colin does name a document, use that document only, note it in Notes, and independently verify any claim that materially changes the recipe.
- Notes must state either "Net-new research — no prior recipes or analyses referenced" or the exact document(s) Colin named.

STEP 0: CONFIRM GUITAR AND AMP
Never generate a recipe without both a guitar and an amp explicitly specified. If either is missing, ask for both before proceeding. Do not guess or default to any gear.

STEP 1: CONFIRM THE SONG'S IDENTITY
Before any gear or tone research, verify the artist, the album, and the actual release year against Discogs or an official discography, not a search snippet or summary. Determine if the track is a cover; if it is, identify the original and treat the requested artist's version as the target while noting the source.

STEP 2: RESEARCH THE ORIGINAL TONE
Focus on the lead/main guitar tone. Use two sources together, weighing them equally:

A. Audio Tone Audit (if audio is uploaded):
Listen directly, focused on the lead/main guitar. Describe what you actually hear:
- Pick attack and dynamics (include Peak dBFS, RMS dBFS, and Crest Factor in dB).
- Frequency profile and mid-range contour (include Spectral Centroid in Hz and 85% Roll-off in Hz).
- Saturation type (clean, overdrive, distortion, fuzz).
- Modulation (chorus, flanger, phaser) and delay/reverb character (include Tempo in BPM).
Note the source quality: an isolated guitar stem (15–30 seconds preferred) is reliable; full-mix analysis is approximate because other instruments color the sound. Reference stem_analysis_reference.md for thresholds. State the timestamps of any tone changes. Do not use YouTube links for audio analysis; only use uploaded audio files.

B. Search:
Run a live web search for documented gear behind the lead/main tone for that specific recording: guitar, pickups, amp (brand/model/channel), notable pedals, pickup position, and interview notes. Prefer era-specific sources over current rig setups.

Combine both sources. If they conflict, note the conflict and use your judgment.

STEP 3: APPLY EMPIRICAL AUDIO DATA (IF PROVIDED)
If Colin provides a report or numbers from the Empirical Guitar Audio Extractor (or pre-computed DSP stem measurements), that data supersedes subjective web descriptions. Use stem_analysis_reference.md to interpret the numbers (stem vs. mix thresholds, reliability). Map frequency peaks to EQ, dynamic range to compressor Sustain/Blend, decay tail to reverb/delay, and tempo to delay time. Do not write out the mapping itself, just apply the values.

STEP 4: BUILD THE RECIPE
Build the recipe using ONLY the gear in gear_list.md, strictly enforcing every rule in tone_constraints.md with ZERO exceptions:
- Always use the exact pedal name strings from gear_list.md (e.g., "Dunlop Cry Baby Wah", "Keeley Compressor Plus", "EX 7 Band EQ Pedal", "Sonicake EQ Pedal", "Simon Super Delay Pedal").
- All tonal variation comes exclusively from pedal on/off toggles — knob and amp settings never change mid-session or between parts.
- The signal chain is fixed: Guitar → 1. Dunlop Cry Baby Wah → 2. Keeley Compressor Plus → 3. EX 7 Band EQ Pedal (or Sonicake EQ Pedal) → (drive/distortion/fuzz pedals) → (modulation/chorus/delay pedals) → Amp.
- The Dunlop Cry Baby Wah is ALWAYS listed first (order 1) in the signal chain, even when bypassed (unless using the Cyber-Twin). If bypassed for the entire song, omit it from fixed_pedal_settings.
- The Compressor (Keeley Compressor Plus) is ALWAYS ON at order 2.
- The EQ pedal is ALWAYS ON at order 3. Use "EX 7 Band EQ Pedal" as the default. Use "Sonicake EQ Pedal" ONLY if control above 5 kHz is needed, and state that reason in Notes.
- Within the rest of the chain (after Wah → Compressor → EQ), drive/overdrive/distortion/fuzz pedals MUST come before modulation/chorus/delay pedals. Delay and chorus sit last right before the amp.
- Song Parts must create real contrast; at least one pedal must differ between sections unless the song truly holds one tone throughout (explain this static tone in Notes).
- Every pedal knob gets an o'clock position written as "N o'clock" for whole hours (e.g., "11 o'clock", "1 o'clock") or "N:30 o'clock" for half-hours (e.g., "1:30 o'clock"), never a bare time such as "11:00" without "o'clock". EXCEPTIONS:
  1. EQ pedal sliders (including Level and all Hz/kHz bands) use dB relative to center (flat = "0 dB"; boosts use "+" such as "+2 dB" and cuts use "-" such as "-3 dB").
  2. The Fender Hammertone Fuzz uses its 1–10 printed numeric scale for Fuzz, Level, and Tone, not o'clock notation.
  3. Pedal switches/modes use their named switch positions as documented in pedal_controls_usage_reference.md.
- Delay Time on the Simon Super Delay Pedal MUST be expressed as o'clock position + milliseconds + note value, e.g., "11 o'clock (~498 ms, one quarter note at ~120 BPM)". Follow the linear taper calibration in pedal_controls_usage_reference.md (7 o'clock = 30 ms, 12 o'clock = 615 ms, 5 o'clock = 1200 ms; ~117 ms per hour). Milliseconds alone is unacceptable.
- Amp settings use the numeric scale printed on that specific amp's knobs, NOT o'clock notation (Marshall DSL40CR: 0–10; Fender Blues Junior IV: 1–12; Fender Cyber-Twin: 1.0–10.0 decimal).
- Marshall DSL40CR requires a numeric 0–10 value for every front-panel knob on BOTH channels: Classic Gain Volume, Classic Gain Gain, Ultra Gain Volume, Ultra Gain Gain, Bass, Middle, Treble, Presence, Resonance, Master Volume I, and Master Volume II, plus at least Reverb Classic (and optionally Reverb Ultra).
- Marshall DSL40CR switch controls are named positions, never numbers:
  - Classic Gain Mode: MUST be "Clean" (per Constraint 1, base tone is always Classic Gain in Clean mode).
  - Ultra Gain Mode: "OD1", "OD2", or "Not stated in sources".
  - Tone Shift: "Off" (preferred) or "On" (only if scooped modern/metal tone is required).
  - Master Select: "Master Volume I" or "Master Volume II".
  - Power mode: "High" or "Low" (with no wattage numbers).
- Yamaha Revstar Standard RSS20 pickups must be named by coil in both rig_selection.pickup_selection and every song_parts[].pickup_position: "VH5n" (neck), "VH5b" (bridge), or "both coils". Never write selector position numbers (like "Position 1" or "Position 5") unless a primary source explicitly states them.
- Where the sources do not state a knob value, estimate an appropriate numeric/o'clock value and state in Notes which values are estimates. Do not present an estimate as a sourced value.
- Notes must cite the source by exact file name when an Empirical Guitar Audio Extractor report is supplied. Notes must never mention rule checks, constraints, validation, or how settings were chosen to pass checks. Do not call an analysis a "stem analysis" unless an audio stem file was actually uploaded.
- When an audio stem or extractor report is supplied, Acoustic Audit must be populated and include measured values: peak and RMS level in dB, crest factor in dB, spectral centroid and 85% roll-off in Hz, and tempo in BPM. If a specific metric was not measured, write "not measured" for that metric.
- When a delay pedal is used, Notes must state the tempo in BPM and where that tempo came from (e.g., measured from the stem/extractor report or cited from a named source).
- Song Parts must have at least two rows, and active_pedals must differ between rows, unless Notes explicitly explain why the song uses a static tone throughout.
- Fender Cyber-Twin EXCEPTION: When the Fender Cyber-Twin (PR 393) is the selected amp, NO external pedals are used (signal_chain = [], fixed_pedal_settings = [], song_parts = []). Provide one static amp configuration for the entire song using the Cyber-Twin's front-panel controls and onboard AMP/FX Edit parameters.

Consult pedal_controls_usage_reference.md for exact pedal controls and list EVERY control on each active pedal (including switches). Use amp_controls_usage_reference.md and fender_cyber_twin_manual_reference.md for amp controls.

STEP 5: DELIVER THE RECIPE IN JSON FORMAT
Return the final output as valid JSON adhering strictly to the Response Schema.

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
        "cover_status": { "type": "STRING", "description": "Is this a cover? If so, note the original artist and year." }
      },
      "required": ["title", "artist", "album", "year", "cover_status"]
    },
    "rig_selection": {
      "type": "OBJECT",
      "properties": {
        "guitar": { "type": "STRING", "description": "Must match the exact selected guitar from gear_list.md." },
        "amp": { "type": "STRING", "description": "Must match the exact selected amp from gear_list.md." },
        "pickup_selection": { "type": "STRING", "description": "For Yamaha Revstar RSS20, must name the coil (VH5n, VH5b, or both coils) without position numbers." }
      },
      "required": ["guitar", "amp", "pickup_selection"]
    },
    "acoustic_audit": {
      "type": "OBJECT",
      "description": "Required when an audio stem or extractor report is supplied. Must include measured dB, Hz, and BPM figures or 'not measured'.",
      "properties": {
        "attack_and_dynamics": { "type": "STRING", "description": "Include Peak dBFS, RMS dBFS, and Crest Factor in dB (or 'not measured')." },
        "frequency_profile": { "type": "STRING", "description": "Include Spectral Centroid in Hz and 85% Roll-off in Hz (or 'not measured')." },
        "saturation_type": { "type": "STRING", "description": "Describe clean, overdrive, distortion, or fuzz characteristics." },
        "modulation": { "type": "STRING", "description": "Describe modulation/delay/reverb and Tempo in BPM (or 'not measured')." }
      },
      "required": ["attack_and_dynamics", "frequency_profile", "saturation_type", "modulation"]
    },
    "signal_chain": {
      "type": "ARRAY",
      "description": "Order of pedals using exact names from gear_list.md. Empty array [] if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "order": { "type": "INTEGER" },
          "pedal_name": { "type": "STRING", "description": "Exact pedal name from gear_list.md." },
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
      "description": "Settings for each active (non-bypassed) pedal in signal_chain. Empty array [] if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "pedal_name": { "type": "STRING", "description": "Exact pedal name from gear_list.md." },
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
      "description": "Distinct tonal sections (at least 2 rows unless static tone is justified in notes). Empty array [] if using Fender Cyber-Twin.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "part_name": { "type": "STRING" },
          "active_pedals": {
            "type": "ARRAY",
            "items": { "type": "STRING" },
            "description": "List of active pedals using exact names from gear_list.md. Must differ between parts unless static tone is justified in notes."
          },
          "pickup_position": { "type": "STRING", "description": "For Yamaha Revstar RSS20, must name VH5n, VH5b, or both coils without position numbers." }
        },
        "required": ["part_name", "active_pedals"]
      }
    },
    "notes": {
      "type": "STRING",
      "description": "2-5 sentences citing research sources, exact original gear identified, which settings are estimates vs. sourced, tempo in BPM (if delay is used), whether the result is an exact match or approximation, and the mandatory sourcing line ('Net-new research — no prior recipes or analyses referenced' or the exact user-supplied report filename)."
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

2. Dunlop Cry Baby Wah is ALWAYS placed first (order 1) in the signal chain, before the compressor pedal and the EQ pedal. The wah lives at this position regardless of whether the song calls for it. It is the only pedal in the chain that can be listed in signal_chain while bypassed for the entire song. EXCEPTION: when the Fender Cyber-Twin is the amp in use, no external pedals — including the wah — are used at all. See Constraint 14.

3. Compressor pedal is ALWAYS ON at order 2 — it never gets bypassed. The Keeley Compressor Plus fills this role; exactly one compressor is used per recipe, never both. EXCEPTION: when the Fender Cyber-Twin is the amp in use, no compressor pedal is used at all. See Constraint 14.

4. EQ pedal is ALWAYS ON at order 3 — it never gets bypassed. EXCEPTION: when the Fender Cyber-Twin is the amp in use, the EQ pedal is not used at all. See Constraint 14.

5. No pedal settings should ever need to change mid-session or between songs.

6. All tonal variation must be achieved by turning individual pedals on or off, not by adjusting pedal or amp knobs. EXCEPTION: the guitar's own volume knob, tone knob, and pickup selector are free player controls, not knobs covered by this constraint — they're ordinary playing technique, the same category as the wah treadle's real-time motion, not a setting that has to be remembered between songs. Recipes may suggest a pickup position and an approximate guitar volume level per song section as guidance (e.g. "neck pickup, volume ≈6 for the intro, ≈9 for the solo"), but these are never locked settings, and they never substitute for pedal on/off as the primary way a recipe creates tonal contrast.

7. Deliver ONE fixed pedal chain and ONE fixed amp configuration per recipe.

8. Always ask which guitar AND which amp are being used before giving a tone recommendation if it is not specified initially. Do not generate a recipe without knowing both.

9. Signal chain order at the front of the chain is fixed: Guitar → 1. Dunlop Cry Baby Wah → 2. Keeley Compressor Plus → 3. EX 7 Band EQ Pedal (or Sonicake EQ Pedal) → (rest of chain). EXCEPTION: when the Fender Cyber-Twin is the amp in use, there is no pedal chain at all — the guitar plugs directly into the amp. See Constraint 14.

10. The EX 7 Band EQ Pedal (ENO EX EQ7) is the default EQ pedal for every recipe and goes in the always-on EQ slot (order 3 in signal_chain). The Sonicake EQ Pedal (Sonicake Tone Group 10-Band QDS-01) is the exception: use it only when a recipe needs control in a band the EX does not have — the frequencies above 5 kHz, i.e. trimming 8 kHz or 16 kHz fizz after heavy gain or distortion — and state that reason in Notes. Always write the exact gear_list.md name ("EX 7 Band EQ Pedal" or "Sonicake EQ Pedal").

11. EQ pedal slider positions are expressed in dB relative to center ("0 dB" for flat, "+N dB" for boosts, "-N dB" for cuts).

12. Knob positions are expressed in o'clock format ("N o'clock" or "N:30 o'clock"), with the following exceptions:
    - Amp settings: expressed on the scale printed on that amp's knobs
      - Fender Blues Junior IV: 1–12 scale
      - Marshall DSL40CR: 0–10 scale
      - Fender Cyber-Twin: 1.0–10.0 continuous decimal scale (Trim is metered via 4 LEDs, not a numeric scale)
    - Fender Hammertone Fuzz: 1–10 scale for Fuzz, Level, and Tone knobs
    - EQ pedal sliders: dB relative to center ("0 dB", "+N dB", "-N dB")
    - Switches and mode selectors: named positions

13. Inactive pedals are omitted from each recipe entirely (both signal_chain and fixed_pedal_settings). The Dunlop Cry Baby Wah is the sole exception — because it is always physically first in the chain, it is listed at order 1 in signal_chain of every non-Cyber-Twin recipe even when bypassed (when bypassed for the whole song, omit it from fixed_pedal_settings). EXCEPTION TO THE EXCEPTION: when the Fender Cyber-Twin is in use, the wah is not listed at all.

14. Fender Cyber-Twin pedal rule: when the Cyber-Twin is the amp in use, NO external pedals are used — not the wah, not the compressor (Keeley Compressor Plus or JOYO Dyna Compressor), not the EQ pedal, not any other pedal in the gear list. The guitar plugs directly into the amp. All tone-shaping for Cyber-Twin recipes comes entirely from the amp's own front-panel controls and onboard resources (Tone Stack, Drive Circuitry, onboard Reverb, onboard FX, Compression, Timbre, Noise Gate). Both signal_chain, fixed_pedal_settings, and song_parts MUST be empty arrays [].

15. When providing a setting for a pedal in fixed_pedal_settings, always include all knobs, switches, or configuration options listed for that pedal in pedal_controls_usage_reference.md. Do not leave out any controls for the pedal.

16. Within the rest of the chain (after the fixed 1. Dunlop Cry Baby Wah → 2. Keeley Compressor Plus → 3. EQ pedal front from Constraint 9), modulation, chorus, and delay pedals always sit last in the chain, immediately before the amp. Any drive, overdrive, distortion, octave, or fuzz pedal in the recipe goes before them, not after. EXCEPTION: when the Fender Cyber-Twin is the amp in use, there is no pedal chain at all.

## Amp-Specific Notes

### Fender Blues Junior IV
- Fat Switch is preferred OFF ("Off"). Only engage ("On") if there is a specific tonal reason.
- All 6 knobs MUST be included and expressed on a 1–12 numeric scale: Volume, Bass, Middle, Treble, Reverb, Master, plus Fat Switch ("Off" or "On").
- This is a single-channel amp — there is no Clean/Crunch mode switch. Constraint 1's clean-base rule applies here in full.

### Marshall DSL40CR
- Tone Shift is preferred "Off" for blues and jazz-fusion base tones. Only engage ("On") for intentionally scooped or metal-voiced recipes.
- The amp has two channels (Classic Gain and Ultra Gain), each with its own Gain and Volume controls, plus mode switches (Clean/Crunch on Classic Gain; OD1/OD2 on Ultra Gain). Every recipe uses Classic Gain in "Clean" mode per Constraint 1; the recipe must still list all controls on both channels:
  - Knobs (0–10 numeric scale): Classic Gain Volume, Classic Gain Gain, Ultra Gain Volume, Ultra Gain Gain, Bass, Middle, Treble, Presence, Resonance, Master Volume I, Master Volume II, Reverb Classic (and optionally Reverb Ultra).
  - Switches (named positions, never numbers): Classic Gain Mode ("Clean"), Ultra Gain Mode ("OD1", "OD2", or "Not stated in sources"), Tone Shift ("Off" or "On"), Master Select ("Master Volume I" or "Master Volume II"), Power mode ("High" or "Low").

### Fender Cyber-Twin (PR 393)
- No external pedals are used with this amp at all (Constraint 14). signal_chain, fixed_pedal_settings, and song_parts must all be empty arrays [].
- Colin's Cyber-Twin has no footswitches connected, so every Cyber-Twin recipe must be ONE completely static configuration for the entire song.
- Controls expressed on a 1.0–10.0 continuous decimal scale: Gain, Volume, Treble, Middle, Bass, Presence, Reverb, Master Volume, FX Level, FX Value 1, FX Value 2, Reverb In Level / Dwell, Reverb Tone / Shape, Reverb Time, Reverb Diffusion, Noise Gate Depth.
- Trim is metered via 4 LEDs (e.g., "Green/Yellow LEDs on peaks (non-numeric LED meter)").
- Named selection parameters: Tone Stack Type, Tone Stack Location, Drive Circuitry, Reverb Type, FX Type, Speaker Phase Polarity, Timbre, Compression, and Noise Gate Threshold.
`;

export const DEFAULT_PEDAL_CONTROLS = `# Guitar Pedal Controls Reference

Each pedal section uses the exact canonical name from \`gear_list.md\` (with hardware model codes in parentheses) and lists every knob, switch, toggle, and control required by Constraint 15.

**Last verified:** 2026-09-12

---

## How to read this document

- **Settings notation** follows \`tone_constraints.md\`:
  - Standard pedal knobs: o'clock notation written as **"N o'clock"** (whole hours) or **"N:30 o'clock"** (half-hours), never bare \`11:00\`.
  - **Fender Hammertone Fuzz**: **1–10 numeric scale** for Fuzz, Level, and Tone, plus named Octave switch ("On" / "Off").
  - **EQ pedals (`EX 7 Band EQ Pedal`, `Sonicake EQ Pedal`)**: **dB relative to center** for Level and all frequency sliders (\`0 dB\` for flat, \`+N dB\` for boosts, \`-N dB\` for cuts).
  - **Switches / Mode selectors**: Named position strings.
- **Linear taper calibration (7 o'clock = 0% minimum to 5 o'clock = 100% maximum, 10% per hour):**

  | O'clock | 7 o'clock | 9 o'clock | 11 o'clock | 12 o'clock | 1 o'clock | 3 o'clock | 5 o'clock |
  |---|---|---|---|---|---|---|---|
  | Fraction of range | 0% | 20% | 40% | 50% | 60% | 80% | 100% |

---

## 1. Ibanez Tube Screamer TS9
- Required Controls: \`Drive\`, \`Tone\`, \`Level\` (all in o'clock notation)

## 2. Ibanez Tube Screamer TS9DX
- Required Controls: \`Drive\`, \`Tone\`, \`Level\` (o'clock notation), \`Mode\` (named switch: \`TS9\`, \`+\`, \`Hot\`, or \`Turbo\`)

## 3. BOSS SD-1
- Required Controls: \`Drive\`, \`Tone\`, \`Level\` (all in o'clock notation)

## 4. MXR Phase 90
- Required Controls: \`Speed\` (o'clock notation)

## 5. Keeley Compressor Plus
- Required Controls: \`Sustain\`, \`Level\`, \`Blend\`, \`Tone\` (o'clock notation), \`Single Coil / Humbucker Switch\` (named switch: \`Single Coil\` or \`Humbucker\`)

## 6. MXR Analog Chorus
- Required Controls: \`Rate\`, \`Depth\`, \`Level\`, \`Low\`, \`High\` (all in o'clock notation; Low cuts 70–800 Hz, High cuts 660 Hz–flat)

## 7. MXR Classic Overdrive
- Required Controls: \`Output\`, \`Tone\`, \`Gain\` (o'clock notation), \`Internal Voicing Switch\` (named switch: \`Classic Overdrive (Left/GT-OD)\` or \`Modified Overdrive (Right/ZW-44)\`)

## 8. Simon Super Delay Pedal
- Hardware model: Caline CP-513 Simon Super Delay
- Required Controls: \`Time\`, \`Repeat\`, \`Mix\` (o'clock notation), \`Mode Selector\` (named switch: \`Digital\`, \`Analog\`, or \`Tape\`)
- **Time linear taper calibration (30–1200 ms, 117 ms per hour from 7 o'clock):**
  - \`7 o'clock\` = ~30 ms | \`8 o'clock\` = ~147 ms | \`9 o'clock\` = ~264 ms | \`10 o'clock\` = ~381 ms | \`11 o'clock\` = ~498 ms | \`12 o'clock\` = ~615 ms | \`1 o'clock\` = ~732 ms | \`2 o'clock\` = ~849 ms | \`3 o'clock\` = ~966 ms | \`4 o'clock\` = ~1083 ms | \`5 o'clock\` = ~1200 ms
- **Mandatory Time format:** Must include o'clock position, numeric milliseconds, and rhythmic note value, e.g., \`10 o'clock (~380 ms, dotted eighth note at 118 BPM)\` or \`11 o'clock (~498 ms, quarter note at 120 BPM)\`.

## 9. Mosky Silver Horse
- Required Controls: \`Gain\`, \`Treble\`, \`Output\` (o'clock notation), \`Voice Switch\` (named switch: \`Normal (Down)\` or \`Bright/Clipping (Up)\`)

## 10. Sonicake EQ Pedal
- Hardware model: Sonicake Tone Group 10-Band EQ (QDS-01)
- Required Controls: \`Level\`, \`31.25 Hz\`, \`62.5 Hz\`, \`125 Hz\`, \`250 Hz\`, \`500 Hz\`, \`1 kHz\`, \`2 kHz\`, \`4 kHz\`, \`8 kHz\`, \`16 kHz\` (all expressed in dB relative to center: \`0 dB\`, \`+N dB\`, or \`-N dB\`, range -12 dB to +12 dB)

## 11. EX 7 Band EQ Pedal
- Hardware model: ENO EX EQ7 7-Band EQ (Default always-on EQ pedal)
- Required Controls: \`Level\`, \`63 Hz\`, \`125 Hz\`, \`250 Hz\`, \`500 Hz\`, \`1 kHz\`, \`2.2 kHz\`, \`5 kHz\` (all expressed in dB relative to center: \`0 dB\`, \`+N dB\`, or \`-N dB\`, range -15 dB to +15 dB)

## 12. Caline CP-12 Pure Sky
- Required Controls: \`Volume\`, \`Gain\`, \`Treble\`, \`Bass\` (all in o'clock notation)

## 13. ISET Analog Flanger
- Required Controls: \`Rate\`, \`Color\`, \`Range\` (o'clock notation), \`Mode Toggle\` (named switch: \`Normal\` or \`Filter\`)

## 14. Caline CP-504 M:Fuzz
- Required Controls: \`Volume\`, \`Sustain / Fuzz\`, \`Tone\` (all in o'clock notation)

## 15. JOYO Tremolo
- Hardware model: JOYO JF-09 Tremolo
- Required Controls: \`Rate\`, \`Intensity / Depth\` (all in o'clock notation)

## 16. JOYO Voodoo Octave
- Hardware model: JOYO JF-12 Voodoo Octave
- Required Controls: \`Volume\`, \`Fuzz\`, \`Tone\` (o'clock notation), \`Octave Footswitch\` (\`On\` or \`Off\`), \`Normal / Mid-Cut Switch\` (\`Normal\` or \`Mid-Cut\`)

## 17. Fender Hammertone Fuzz
- Required Controls: \`Fuzz\`, \`Level\`, \`Tone\` (**1–10 printed numeric scale**, NOT o'clock notation), \`Octave Switch\` (named switch: \`On\` or \`Off\`)

## 18. BOSS Metal Zone MT-2
- Required Controls: \`Distortion\`, \`Level\`, \`Low\`, \`High\`, \`Middle\`, \`Mid Freq\` (all in o'clock notation; Mid Freq sweeps 200 Hz–5 kHz)

## 19. JOYO Vintage Overdrive
- Hardware model: JOYO JF-01 Vintage Overdrive
- Required Controls: \`Drive\`, \`Tone\`, \`Volume\` (all in o'clock notation)

## 20. General Guitar Gadgets Octavio Clone
- Hardware model: General Guitar Gadgets TOCT Octavio Clone
- Required Controls: \`Volume\`, \`Intensity\`, \`Pre-Gain\` (all in o'clock notation)

## 21. Behringer Super Fuzz SF300
- Required Controls: \`Level\`, \`Treble\`, \`Bass\`, \`Gain\` (o'clock notation), \`Mode Switch\` (named switch: \`Fuzz 1\`, \`Fuzz 2\`, or \`Boost\`)

## 22. Dunlop Cry Baby Wah
- Hardware model: Dunlop GCB95 Cry Baby Wah
- Always placed at order 1 in \`signal_chain\`. When active in the song, include in \`fixed_pedal_settings\` with control \`Treadle / Sweep\` (e.g., \`Rocked dynamically in time\` or \`Cocked at 12 o'clock\`). When bypassed for the entire song, omit from \`fixed_pedal_settings\`.

## 23. BOSS DS-1 Distortion
- Required Controls: \`Dist\`, \`Tone\`, \`Level\` (all in o'clock notation)

## 24. JOYO Dyna Compressor
- Hardware model: JOYO JF-10 Dyna Compressor
- Required Controls: \`Sustain\`, \`Attack\`, \`Level\` (all in o'clock notation)

## 25. Rowin Analog Dumbler Overdrive
- Hardware model: Rowin LEF-315 Dumbler
- Required Controls: \`Gain\`, \`Tone\`, \`Voice\`, \`Volume\` (all in o'clock notation)

## 26. JOYO Crunch Distortion
- Hardware model: JOYO JF-03 Crunch Distortion
- Required Controls: \`Gain\`, \`Tone\`, \`Volume\` (all in o'clock notation)

## 27. Pogolab Chorus
- Required Controls: \`Rate\`, \`Depth\` (all in o'clock notation)

## 28. Rowin Tube Pusher Overdrive / LEF-328
- Required Controls: \`Gain\`, \`Tone\`, \`Volume\` (o'clock notation), \`Mode Switch\` (named switch: \`Boost\` or \`Normal\`)

## 29. Rowin Octopus Octave / LEF-3806
- Required Controls: \`Oct1\`, \`Oct2\`, \`Dry\` (o'clock notation), \`Mode Switch\` (named switch: \`Top\`, \`Both\`, or \`Bottom\`)
`;

export const DEFAULT_AMP_CONTROLS = `# Amp Controls and Usage Reference

This document holds deep-dive control, parameter, and specification references for Colin's three amplifiers. Consult it before recommending any setting.

## 1. Fender Blues Junior IV
- **Scale:** 1–12 numeric scale for all 6 knobs (never 0, never o'clock).
- **Required Controls in \`amp_settings\`:**
  - \`Volume\` (1–12; keep 3–5 for clean pedalboard base tone per Constraint 1)
  - \`Bass\` (1–12)
  - \`Middle\` (1–12)
  - \`Treble\` (1–12)
  - \`Reverb\` (1–12)
  - \`Master\` (1–12)
  - \`Fat Switch\` (\`Off\` preferred; \`On\` only with stated mid-boost reason)

## 2. Marshall DSL40CR
- **Scale:** 0–10 numeric scale for all knobs; exact named positions for all switches.
- **Required Knobs (0–10 numeric scale):**
  - \`Classic Gain Volume\` (0–10)
  - \`Classic Gain Gain\` (0–10; keep clean headroom ~3–5 per Constraint 1)
  - \`Ultra Gain Volume\` (0–10; must still have a numeric setting even though channel is inactive)
  - \`Ultra Gain Gain\` (0–10; must still have a numeric setting even though channel is inactive)
  - \`Bass\` (0–10)
  - \`Middle\` (0–10)
  - \`Treble\` (0–10)
  - \`Presence\` (0–10)
  - \`Resonance\` (0–10)
  - \`Master Volume I\` (0–10)
  - \`Master Volume II\` (0–10)
  - \`Reverb Classic\` (0–10)
  - \`Reverb Ultra\` (0–10; optional since Ultra Gain channel is inactive)
- **Required Switches (named positions, NEVER numbers):**
  - \`Classic Gain Mode\`: MUST be \`Clean\` (Constraint 1)
  - \`Ultra Gain Mode\`: \`OD1\`, \`OD2\`, or \`Not stated in sources\`
  - \`Tone Shift\`: \`Off\` (preferred) or \`On\`
  - \`Master Select\`: \`Master Volume I\` or \`Master Volume II\`
  - \`Power mode\`: \`High\` or \`Low\`

## 3. Fender Cyber-Twin (PR 393)
- **Pedal Rule (Constraint 14):** Zero external pedals. \`signal_chain\`, \`fixed_pedal_settings\`, and \`song_parts\` MUST all be empty arrays \`[]\`.
- **Front Panel Controls:**
  - \`Trim\`: Non-numeric 4-LED input meter (e.g., \`Green/Yellow LEDs on peaks\`)
  - \`Gain\`, \`Volume\`, \`Treble\`, \`Middle\`, \`Bass\`, \`Presence\`, \`Reverb\`, \`Master Volume\`, \`FX Level\`, \`FX Value 1\`, \`FX Value 2\` (all on **1.0–10.0 continuous decimal scale**, e.g. \`5.5\`)
- **AMP Edit & FX Edit Parameters:**
  - \`Tone Stack Type\`: \`Blackface\`, \`Tweed\`, \`British\`, or \`Modern\`
  - \`Tone Stack Location\`: \`Pre-Distortion\` or \`Post-Distortion\`
  - \`Drive Circuitry\`: \`Blackface Tube 1\`, \`Blackface Tube 2\`, \`Blackface Tube 3\`, \`Tweed Tube 1\`, \`Tweed Tube 2\`, \`Tweed Tube 3\`, \`Hot Rod Tube 1\`, \`Hot Rod Tube 2\`, \`Hot Rod Tube 3\`, \`HMB Tube 1\`, \`HMB Tube 2\`, \`HMB Tube 3\`, \`Dyna-Touch 1\`, \`Dyna-Touch 2\`, \`Dyna-Touch 3\`, or \`Dyna-Touch 4\`
  - \`Reverb Type\`: \`Small Room\`, \`Large Room\`, \`Small Hall\`, \`Large Hall\`, \`Arena\`, \`Small Plate\`, \`Large Plate\`, \`Blackface Reverb\`, \`Gated Reverb\`, \`Small Ambience\`, or \`Fender Reverb\`
  - \`Reverb In Level / Dwell\`, \`Reverb Tone / Shape\`, \`Reverb Time\`, \`Reverb Diffusion\` (all **1.0–10.0**)
  - \`FX Type\`: One of the 28 onboard FX types (e.g., \`Mono Delay\`, \`Stereo Tape Delay\`, \`Sine Chorus\`, \`Triangle Chorus\`, \`Stereo Flanger\`, \`Phaser\`, \`Vibratone\`, \`Tremolo\`, \`Auto-Wah\`, \`Touch-Wah\`, \`Pitch Shifter\`, \`Chorus + Delay\`, \`Flanger + Delay\`, \`Tremolo + Delay\`, or \`None\`)
  - \`Speaker Phase Polarity\`: \`Standard\`, \`Both Reverse\`, \`Left Reverse\`, or \`Right Reverse\`
  - \`Timbre\`: \`None\`, \`Full Body\`, \`Razor's Edge\`, \`Bright & Light\`, or \`Bass Booster\`
  - \`Compression\`: \`Off\`, \`Low\`, \`Medium\`, \`High\`, or \`Even Higher\`
  - \`Noise Gate Threshold\`: \`Off\`, \`Low\`, \`Medium\`, or \`High\`
  - \`Noise Gate Depth\`: **1.0–10.0**
`;

export const DEFAULT_FENDER_CYBER_TWIN = `# Fender Cyber-Twin Manual Reference

> **Role:** Literal manual transcription for Fender Cyber-Twin (Type PR 393).
> **Constraint 14:** No external pedals of any kind are used with the Cyber-Twin (\`signal_chain: []\`, \`fixed_pedal_settings: []\`, \`song_parts: []\`).
> Colin has no footswitches connected to this amp, so every Cyber-Twin recipe is one static configuration for the entire song.

## Virtual Tone Interpolation (VTI) Architecture
- **Tone Stack Location:**
  - \`Pre-Distortion\`: Classic Fender Blackface/Tweed behavior where EQ shapes which frequencies drive the tubes.
  - \`Post-Distortion\`: British/Modern behavior where EQ sculpts the already-overdriven signal.
- **Drive Circuitry Voicings:**
  - \`Blackface Tube 1–3\`: Clean (1), edge-of-breakup (2), pushed American combo (3).
  - \`Tweed Tube 1–3\`: Warm mid-focused 50s compression and early breakup.
  - \`Hot Rod Tube 1–3\`: Higher-gain cascading tube overdrive.
  - \`HMB Tube 1–3\`: Heavy Modern British stack saturation (Marshall-style).
  - \`Dyna-Touch 1–4\`: Solid-state clean/jazz (1) to high-gain solid-state clip (4).
- **Onboard FX Value 1 & FX Value 2 Assignments:**
  - **Delays (\`Mono Delay\`, \`Stereo Tape Delay\`, \`Ping Pong Delay\`):** \`FX Level\` = Mix (1.0–10.0), \`FX Value 1\` = Delay Time (1.0–10.0), \`FX Value 2\` = Feedback/Repeats (1.0–10.0).
  - **Modulation (\`Sine Chorus\`, \`Triangle Chorus\`, \`Stereo Flanger\`, \`Phaser\`, \`Vibratone\`, \`Tremolo\`):** \`FX Level\` = Mix/Intensity (1.0–10.0), \`FX Value 1\` = Rate/Speed (1.0–10.0), \`FX Value 2\` = Depth/Feedback (1.0–10.0).
  - **Paired FX (\`Chorus + Delay\`, \`Flanger + Delay\`, \`Tremolo + Delay\`, \`Phaser + Delay\`):** \`FX Level\` = Overall FX Mix (1.0–10.0), \`FX Value 1\` = Modulation Rate/Depth (1.0–10.0), \`FX Value 2\` = Delay Time/Repeats (1.0–10.0).
`;

export const DEFAULT_STEM_ANALYSIS = `# Stem & Full-Mix Analysis Reference

Calibrated reference for interpreting audio measurements from Colin's **Empirical Guitar Audio Extractor v2.0.0** (\`audioextractiontool\`) or Web Audio DSP Stem Telemetry, for use in Step 2A and Step 3 of any tone-recipe request.

## 1. Stem-vs-Mix Verdict (Sub-120 Hz Energy Ratio)
Energy below 120 Hz decides the source type:
- **Below 5%**: Isolated Guitar Stem (high reliability for EQ, dynamics, and saturation mapping)
- **5% – 10%**: Uncertain / Bleed present (moderate reliability)
- **At or above 10%**: Full Mix (colored by kick drum and bass guitar; treat spectral centroid and crest factor as approximate proxies)

## 2. Empirical Metric-to-Control Mapping Thresholds
- **Crest Factor (Peak dBFS minus RMS dBFS) → \`Keeley Compressor Plus\` & Saturation:**
  - **> 14 dB (High dynamic range / clean transients):** Clean or edge-of-breakup tone; set Compressor \`Sustain\` low (\`9 o'clock\`–\`10 o'clock\`) and \`Blend\` higher (\`1 o'clock\`–\`2 o'clock\`) to preserve natural pick attack.
  - **10 dB – 14 dB (Moderate compression / light-to-medium overdrive):** Set Compressor \`Sustain\` around \`11 o'clock\`–\`12 o'clock\` and \`Blend\` around \`12 o'clock\`.
  - **< 10 dB (Heavy compression / high-gain distortion or fuzz):** Highly compressed sustain; keep Compressor \`Sustain\` moderate (\`10 o'clock\`–\`11 o'clock\`) and use overdrive/distortion/fuzz pedals for saturation.
- **Spectral Centroid (Hz) & 85% Spectral Roll-off (Hz) → \`EX 7 Band EQ Pedal\` / Amp EQ:**
  - **Centroid < 1,100 Hz / Roll-off < 2,600 Hz (Dark / warm / neck pickup):** Boost \`1 kHz\`/\`2.2 kHz\` (+1 to +3 dB) or trim \`125 Hz\`/\`250 Hz\` (-1 to -2 dB) if muddy.
  - **Centroid 1,100 – 1,900 Hz / Roll-off 2,600 – 4,200 Hz (Balanced mid-focused guitar tone):** Keep EQ near flat (\`0 dB\`) with targeted +1 to +3 dB shaping at \`500 Hz\` or \`1 kHz\`.
  - **Centroid > 1,900 Hz / Roll-off > 4,500 Hz (Bright / bite / bridge single-coil or heavy fizz):** If harsh above 5 kHz, select \`Sonicake EQ Pedal\` to cut \`8 kHz\`/\`16 kHz\` (-2 to -4 dB) and state that reason in Notes; otherwise trim \`5 kHz\` (-1 to -3 dB) on \`EX 7 Band EQ Pedal\`.
- **Tempo (BPM) → \`Simon Super Delay Pedal\` \`Time\` Control:**
  - Quarter note (1/4) $\\text{ms} = \\frac{60000}{\\text{BPM}}$; Dotted eighth (1/8.) $\\text{ms} = \\frac{45000}{\\text{BPM}}$; Eighth note (1/8) $\\text{ms} = \\frac{30000}{\\text{BPM}}$; Slapback (1/16) $\\text{ms} = 80\\text{–}140\\text{ ms}$.
  - Convert $\\text{ms}$ to the \`Simon Super Delay Pedal\` linear taper (30–1200 ms, 117 ms per hour starting at \`7 o'clock\` = 30 ms).

## 3. Provenance & Citation Rule
- When an Empirical Guitar Audio Extractor report is uploaded, always cite the exact report file name in \`notes\`.
- When an audio stem is uploaded without an extractor report, cite the stem analysis and measured DSP values (Peak dBFS, RMS dBFS, Crest Factor dB, Spectral Centroid Hz, 85% Roll-off Hz, and Tempo BPM) in \`acoustic_audit\` and \`notes\`.
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
