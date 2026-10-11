/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { SPEC_FILES_MAP } from "./data/defaultSpecs";
import {
  readGearMenus,
  loadInstructions,
  buildSpecsText,
  buildUserPrompt,
} from "./utils/gearParser";
import { runRuleChecks } from "./utils/ruleChecker";
import { RecipeJson } from "./types/recipe";
import { SpecFilesManager } from "./components/SpecFilesManager";
import { RecipeDisplay } from "./components/RecipeDisplay";
import {
  Terminal,
  Activity,
  HardDrive,
  Trash2,
  FileAudio,
  FileText,
  X,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function App() {
  // Spec files state
  const [specFiles, setSpecFiles] = useState<Record<string, string>>({
    ...SPEC_FILES_MAP,
  });
  const [customUploaded, setCustomUploaded] = useState<Record<string, boolean>>({});

  // Form Inputs
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [selectedGuitarFull, setSelectedGuitarFull] = useState("");
  const [selectedAmpFull, setSelectedAmpFull] = useState("");

  // Optional Stems and Reports
  const [stemFile, setStemFile] = useState<{
    filename: string;
    mimeType: string;
    base64Data: string;
    sizeKb: number;
  } | null>(null);

  const [reportFile, setReportFile] = useState<{
    filename: string;
    content: string;
  } | null>(null);

  // Execution & Output State
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [currentRecipe, setCurrentRecipe] = useState<RecipeJson | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Parse gear menus whenever gear_list.md updates
  const { guitars, amps, pedals } = useMemo(() => {
    const gearListText = specFiles["gear_list.md"] || "";
    return readGearMenus(gearListText);
  }, [specFiles]);

  // Set initial default selections once guitars/amps are parsed
  useEffect(() => {
    if (guitars.length > 0 && !selectedGuitarFull) {
      setSelectedGuitarFull(guitars[0].fullName);
    }
  }, [guitars, selectedGuitarFull]);

  useEffect(() => {
    if (amps.length > 0 && !selectedAmpFull) {
      setSelectedAmpFull(amps[0].fullName);
    }
  }, [amps, selectedAmpFull]);

  // Handle spec file upload or reset
  const handleSpecFileChange = (filename: string, content: string, isCustom: boolean) => {
    setSpecFiles((prev) => ({ ...prev, [filename]: content }));
    setCustomUploaded((prev) => ({ ...prev, [filename]: isCustom }));
  };

  const handleResetAllSpecs = () => {
    setSpecFiles({ ...SPEC_FILES_MAP });
    setCustomUploaded({});
  };

  // Stem upload handler (.wav or .mp3)
  const handleStemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".wav") && !lowerName.endsWith(".mp3")) {
      setGeneralError("Stem file must be a .wav or .mp3 audio file.");
      e.target.value = "";
      return;
    }

    setGeneralError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1] || "";
      const mimeType = file.type || (lowerName.endsWith(".wav") ? "audio/wav" : "audio/mp3");

      setStemFile({
        filename: file.name,
        mimeType,
        base64Data,
        sizeKb: Math.round(file.size / 1024),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Report upload handler (.md or .json)
  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".md") && !lowerName.endsWith(".json")) {
      setGeneralError("Audio Extractor report must be a .md or .json file.");
      e.target.value = "";
      return;
    }

    setGeneralError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setReportFile({
        filename: file.name,
        content: text,
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Generation action
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songTitle.trim()) {
      setGeneralError("Song Title is required.");
      return;
    }
    if (!artist.trim()) {
      setGeneralError("Artist is required.");
      return;
    }
    if (!selectedGuitarFull) {
      setGeneralError("Guitar selection is required.");
      return;
    }
    if (!selectedAmpFull) {
      setGeneralError("Amp selection is required.");
      return;
    }

    setGeneralError(null);
    setIsLoading(true);
    setStatusMessage("PARSING SYSTEM INSTRUCTIONS & BLOCK 2 SCHEMA...");

    try {
      const masterContent = specFiles["ai_tool_system_instructions_master.md"] || "";
      const { systemInstruction, schemaDict } = loadInstructions(masterContent);
      const specsText = buildSpecsText(specFiles);
      const userPrompt = buildUserPrompt(
        songTitle.trim(),
        artist.trim(),
        selectedGuitarFull,
        selectedAmpFull,
        !!stemFile,
        reportFile?.filename,
        reportFile?.content
      );

      const stemPayload = stemFile
        ? {
            filename: stemFile.filename,
            mimeType: stemFile.mimeType,
            base64Data: stemFile.base64Data,
          }
        : undefined;

      setStatusMessage("COMMUNICATING WITH GEMINI 3.8 FLASH // GROUNDING ACTIVE...");

      const res1 = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          schemaDict,
          specsText,
          userPrompt,
          stemAudio: stemPayload,
        }),
      });

      if (!res1.ok) {
        const errJson = await res1.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res1.status}`);
      }

      const data1 = await res1.json();
      let recipeJson = data1.recipeJson;

      if (!recipeJson && data1.rawText) {
        try {
          recipeJson = JSON.parse(data1.rawText);
        } catch {}
      }

      setStatusMessage("VERIFYING 14 TONE CONSTRAINTS & MATRIX RULES...");
      let errors: string[] = [];

      if (recipeJson) {
        errors = runRuleChecks(
          recipeJson,
          selectedGuitarFull,
          selectedAmpFull,
          pedals,
          !!stemFile,
          reportFile?.filename
        );
      } else {
        errors = ["Output was not valid JSON."];
      }

      if (errors.length > 0) {
        setStatusMessage(`VALIDATION CHECK FAILED (${errors.length} ERRORS) // RETRYING ONCE...`);

        let retryPrompt = userPrompt + "\n\nPrevious attempt failed the following checks:\n";
        for (const e of errors) {
          retryPrompt += `- ${e}\n`;
        }
        retryPrompt += "\nPlease correct these errors and provide the complete recipe JSON. Ensure all data matches strictly.";

        const originalRecipe = recipeJson;
        const originalErrors = errors;

        try {
          const res2 = await fetch("/api/generate-recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction,
              schemaDict,
              specsText,
              userPrompt: retryPrompt,
              stemAudio: stemPayload,
            }),
          });

          if (res2.ok) {
            const data2 = await res2.json();
            let retryJson = data2.recipeJson;
            if (!retryJson && data2.rawText) {
              try {
                retryJson = JSON.parse(data2.rawText);
              } catch {}
            }

            if (retryJson) {
              recipeJson = retryJson;
              errors = runRuleChecks(
                recipeJson,
                selectedGuitarFull,
                selectedAmpFull,
                pedals,
                !!stemFile,
                reportFile?.filename
              );
            } else {
              recipeJson = originalRecipe;
              errors = originalErrors;
            }
          } else {
            recipeJson = originalRecipe;
            errors = originalErrors;
          }
        } catch (retryErr) {
          console.warn("Retry failed, keeping first attempt:", retryErr);
          recipeJson = originalRecipe;
          errors = originalErrors;
        }
      }

      if (!recipeJson) {
        throw new Error("Model response was not valid JSON and could not be rendered.");
      }

      setCurrentRecipe(recipeJson);
      setWarnings(errors);
      setStatusMessage("");
    } catch (err: any) {
      console.error("Recipe generation failed:", err);
      setGeneralError(err.message || "Failed to generate recipe.");
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#4a5057] p-2 sm:p-5 flex flex-col items-center justify-start font-sans">
      {/* Jurassic Park Control Room Workstation Outer Chassis */}
      <div className="w-full max-w-6xl bg-[#848a92] bevel-out p-2 sm:p-3 shadow-2xl flex flex-col gap-2">
        {/* Top Control Room Title Bar */}
        <div className="bg-[#242628] text-white px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#111]">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffe600] text-black font-mono font-black text-xs px-2 py-0.5 bevel-out-sm">
              TERMINAL
            </span>
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              Workstation OS 9.2 // Guitar Tone Lab & Synthesis Terminal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#151718] px-2 py-0.5 border border-[#333] text-[10px] font-mono text-[#00ff66]">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
              <span>SYSTEM: ONLINE</span>
            </div>
            <div className="flex items-center gap-1 bg-[#151718] px-2 py-0.5 border border-[#333] text-[10px] font-mono text-[#00e5ff]">
              <span>AUDIO BUS: READY</span>
            </div>
          </div>
        </div>

        {/* 90s Workstation Header Banner */}
        <div className="bg-[#ffe600] text-black border-2 border-black flex items-center justify-between p-1.5 shadow-sm">
          <div className="bg-black text-[#ffe600] px-3 py-1 font-mono font-black text-sm flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase">MODULE</span>
            <span className="text-xl leading-none">01</span>
          </div>

          <div className="text-center">
            <div className="font-mono text-base sm:text-lg font-black tracking-wider uppercase text-black">
              Guitar Tone Recipe Generator // Main Console
            </div>
            <div className="font-mono text-[10px] italic text-[#222]">
              Rig Matching Engine & Automated Rule Checker // Gemini 3.8 Flash
            </div>
          </div>

          <div className="bg-black text-[#ffe600] px-3 py-1 font-mono font-black text-sm hidden sm:flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase">MODULE</span>
            <span className="text-xl leading-none">01</span>
          </div>
        </div>

        {/* Top Function Keys / Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#70767e] p-1 bevel-in-sm text-xs font-mono">
          <div className="flex flex-wrap items-center gap-1">
            <span className="bg-[#c2c7cd] bevel-out-sm px-2.5 py-1 text-black font-bold cursor-pointer hover:bg-[#d8dce1]">
              AUDIO RIG
            </span>
            <span className="bg-[#a2a8b0] border border-[#666] px-2.5 py-1 text-[#222] font-bold">
              SIGNAL CHAIN
            </span>
            <span className="bg-[#a2a8b0] border border-[#666] px-2.5 py-1 text-[#222] font-bold">
              PARAMETERS
            </span>
            <span className="bg-[#a2a8b0] border border-[#666] px-2.5 py-1 text-[#222] font-bold">
              DIAGNOSTICS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="bg-[#111] text-[#00ff66] px-2 py-0.5 text-[11px] font-mono border border-[#333]">
              status: ready for input
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]"></span>
          </div>
        </div>

        {/* Main Console Workspace: 2-column or grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Left Tactical Navigation & Telemetry Sidebar */}
          <div className="lg:col-span-3 bg-[#696f77] bevel-out p-1.5 flex flex-col gap-2 text-xs font-mono">
            {/* System Status Box */}
            <div className="bg-black text-white p-2 bevel-in-sm space-y-1">
              <div className="bg-[#222] px-1.5 py-0.5 text-[10px] font-bold text-[#00e5ff] uppercase flex justify-between">
                <span>SYSTEM STATUS</span>
                <span>[LIVE]</span>
              </div>
              <div className="text-[11px] text-[#ccc] space-y-0.5 pt-0.5">
                <div>rig environment:</div>
                <div className="text-[#ffe600]">Colin's Studio Rig</div>
              </div>
              <div className="pt-1 border-t border-[#333] grid grid-cols-2 gap-1 text-[10px]">
                <span className="bg-[#222] text-[#39ff14] px-1 text-center">engine: ok</span>
                <span className="bg-[#222] text-[#39ff14] px-1 text-center">model: online</span>
                <span className="bg-[#222] text-[#39ff14] px-1 text-center">rules: 14 checks</span>
                <span className="bg-[#222] text-[#39ff14] px-1 text-center">memory: 64MB</span>
              </div>
            </div>

            {/* Diagnostic Badges */}
            <div className="bg-black text-white p-2 bevel-in-sm space-y-1">
              <div className="text-[10px] text-[#888] uppercase mb-1">system diagnostics:</div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="bg-[#00aa44] text-white px-1.5 py-0.2 font-black text-[10px]">CLEAR</span>
                <span className="text-[#ccc]">Hardware Rules Loaded</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="bg-[#00aa44] text-white px-1.5 py-0.2 font-black text-[10px]">CLEAR</span>
                <span className="text-[#ccc]">Amp Specs Calibrated</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="bg-[#00aa44] text-white px-1.5 py-0.2 font-black text-[10px]">CLEAR</span>
                <span className="text-[#ccc]">Pedal Controls Matrix</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="bg-[#00aa44] text-white px-1.5 py-0.2 font-black text-[10px]">CLEAR</span>
                <span className="text-[#ccc]">Truth Files Mounted</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="bg-[#0088cc] text-white px-1.5 py-0.2 font-black text-[10px]">READY</span>
                <span className="text-[#aee0ff]">Waiting for Generation</span>
              </div>
            </div>

            {/* Tactical Pushbuttons like screenshot */}
            <div className="bg-[#8b9199] p-2 bevel-in-sm space-y-1.5">
              <div className="text-[10px] font-bold text-[#111] uppercase">Quick Presets:</div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSongTitle("Little Wing");
                    setArtist("Jimi Hendrix");
                  }}
                  className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm py-1 font-bold text-black text-[10px] cursor-pointer"
                  title="Load sample parameters"
                >
                  PRESET 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSongTitle("Gravity");
                    setArtist("John Mayer");
                  }}
                  className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm py-1 font-bold text-black text-[10px] cursor-pointer"
                  title="Load sample parameters"
                >
                  PRESET 2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSongTitle("Sultans of Swing");
                    setArtist("Dire Straits");
                  }}
                  className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm py-1 font-bold text-black text-[10px] cursor-pointer"
                  title="Load sample parameters"
                >
                  PRESET 3
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSongTitle("");
                    setArtist("");
                    setStemFile(null);
                    setReportFile(null);
                    setCurrentRecipe(null);
                    setWarnings([]);
                  }}
                  className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm py-1 font-bold text-black cursor-pointer"
                >
                  RESET FORM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("main-form");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm py-1 font-bold text-black cursor-pointer"
                >
                  GO TO FORM
                </button>
              </div>
            </div>

            {/* Hardware Telemetry Indicators */}
            <div className="bg-[#111] p-2 bevel-in-sm text-white space-y-1">
              <div className="text-[10px] text-[#00e5ff] font-bold">HARDWARE STATUS:</div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span>STRAT ENCL</span>
                  <span className="text-[#39ff14]">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>MARSHALL 40W</span>
                  <span className="text-[#39ff14]">STANDBY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PEDAL BOARD</span>
                  <span className="text-[#00e5ff] font-bold">29 UNITS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>DSP BUFFER</span>
                  <span className="text-[#ffe600]">44.1 kHz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Screen & Workstation Controls */}
          <div className="lg:col-span-9 space-y-2">
            {/* Spec Files Manager component in retro styling */}
            <SpecFilesManager
              specFiles={specFiles}
              customUploaded={customUploaded}
              onFileChange={handleSpecFileChange}
              onResetAll={handleResetAllSpecs}
            />

            {/* Input Form Terminal */}
            <div id="main-form" className="bg-[#8b9199] bevel-out p-1">
              {/* Form Bar */}
              <div className="bg-[#161f28] text-white px-3 py-1.5 flex items-center justify-between border-b border-[#000]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#ffe600]" />
                  <span className="font-mono text-xs font-bold text-[#ffe600] uppercase tracking-wider">
                    TARGET SONG & RIG PARAMETERS // FORM TERMINAL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#00e5ff]">INPUTS REQUIRED: 4</span>
              </div>

              {generalError && (
                <div className="m-2 bg-[#2b1010] border-2 border-[#ff2a2a] p-2.5 bevel-in-sm flex items-start gap-2 text-xs font-mono text-[#ffb0b0]">
                  <span className="bg-[#ff2a2a] text-white px-1.5 py-0.2 font-black text-[10px]">CHECK</span>
                  <div className="flex-1">
                    <span className="font-bold text-[#ff4444]">SYSTEM FAULT: </span>
                    {generalError}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralError(null)}
                    className="text-[#ff4444] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleGenerateRecipe} className="p-3 bg-[#a2a8b0] space-y-3 font-mono text-xs">
                {/* Row 1: Song & Artist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#111] uppercase">
                      1. SONG TITLE <span className="text-[#ff2a2a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gravity"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-black text-[#00ff66] font-mono bevel-in-sm focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#111] uppercase">
                      2. ARTIST <span className="text-[#ff2a2a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Mayer"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-black text-[#00ff66] font-mono bevel-in-sm focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                    />
                  </div>
                </div>

                {/* Row 2: Guitar & Amp Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#111] uppercase">
                      3. GUITAR SELECTION <span className="text-[#ff2a2a]">*</span>
                    </label>
                    <select
                      value={selectedGuitarFull}
                      onChange={(e) => setSelectedGuitarFull(e.target.value)}
                      className="w-full px-2 py-1.5 bg-black text-[#ffe600] font-mono bevel-in-sm focus:outline-none focus:ring-1 focus:ring-[#ffe600] cursor-pointer"
                    >
                      {guitars.map((g, idx) => (
                        <option key={idx} value={g.fullName}>
                          {g.shortName}
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-[#333] truncate" title={selectedGuitarFull}>
                      SPEC: {selectedGuitarFull}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#111] uppercase">
                      4. AMP SELECTION <span className="text-[#ff2a2a]">*</span>
                    </label>
                    <select
                      value={selectedAmpFull}
                      onChange={(e) => setSelectedAmpFull(e.target.value)}
                      className="w-full px-2 py-1.5 bg-black text-[#ffe600] font-mono bevel-in-sm focus:outline-none focus:ring-1 focus:ring-[#ffe600] cursor-pointer"
                    >
                      {amps.map((a, idx) => (
                        <option key={idx} value={a.fullName}>
                          {a.shortName}
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-[#333] truncate" title={selectedAmpFull}>
                      SPEC: {selectedAmpFull}
                    </div>
                  </div>
                </div>

                {/* Row 3: Optional Stem & Report Files */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#888]">
                  {/* Stem */}
                  <div className="bg-[#b4bac2] p-2 bevel-out-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#111] uppercase">
                        5. GUITAR STEM AUDIO
                      </span>
                      <span className="text-[9px] text-[#444] font-bold">[OPTIONAL]</span>
                    </div>
                    <div className="text-[10px] text-[#444]">
                      Attach isolated stem (.wav or .mp3, 15–30s)
                    </div>

                    {stemFile ? (
                      <div className="bg-black text-[#00ff66] p-1.5 bevel-in-sm flex items-center justify-between text-[11px]">
                        <div className="truncate">
                          <span className="font-bold">{stemFile.filename}</span>
                          <span className="text-[9px] text-[#888] ml-1">({stemFile.sizeKb} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStemFile(null)}
                          className="bg-[#ff2a2a] text-white px-1 font-bold text-[10px] cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <label className="bg-[#cdd2d8] hover:bg-[#e0e4ea] bevel-out-sm px-2 py-1 flex items-center justify-center gap-1.5 text-black font-bold text-[11px] cursor-pointer">
                        <FileAudio className="w-3.5 h-3.5" />
                        <span>LOAD AUDIO STEM (.WAV/.MP3)</span>
                        <input
                          type="file"
                          accept=".wav,.mp3,audio/wav,audio/mpeg"
                          onChange={handleStemUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Report */}
                  <div className="bg-[#b4bac2] p-2 bevel-out-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#111] uppercase">
                        6. EXTRACTOR REPORT
                      </span>
                      <span className="text-[9px] text-[#444] font-bold">[OPTIONAL]</span>
                    </div>
                    <div className="text-[10px] text-[#444]">
                      Attach Empirical Extractor report (.md or .json)
                    </div>

                    {reportFile ? (
                      <div className="bg-black text-[#00ff66] p-1.5 bevel-in-sm flex items-center justify-between text-[11px]">
                        <div className="truncate">
                          <span className="font-bold">{reportFile.filename}</span>
                          <span className="text-[9px] text-[#888] ml-1">
                            ({reportFile.content.split("\n").length} lines)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReportFile(null)}
                          className="bg-[#ff2a2a] text-white px-1 font-bold text-[10px] cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <label className="bg-[#cdd2d8] hover:bg-[#e0e4ea] bevel-out-sm px-2 py-1 flex items-center justify-center gap-1.5 text-black font-bold text-[11px] cursor-pointer">
                        <FileText className="w-3.5 h-3.5" />
                        <span>LOAD EXTRACTOR REPORT (.MD/.JSON)</span>
                        <input
                          type="file"
                          accept=".md,.json,text/markdown,application/json"
                          onChange={handleReportUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Console Action Bar */}
                <div className="pt-2 border-t border-[#888] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-[#222]">
                    {isLoading ? (
                      <div className="flex items-center gap-1.5 text-[#ff2a2a] font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
                        <span>{statusMessage}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[#00aa44] font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>STATION READY // SETTINGS: TEMP=0.1, GROUNDING=ON</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-[#ffe600] hover:bg-[#fff04d] active:bg-[#d4be00] bevel-out px-6 py-2 text-black font-black text-xs font-mono uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Activity className="w-4 h-4 animate-spin text-black" />
                        <span>PROCESSING TELEMETRY...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-black fill-black" />
                        <span>INITIATE TONE SYNTHESIS</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Diagnostic Output Screen */}
            {currentRecipe && (
              <div id="recipe-result">
                <RecipeDisplay recipe={currentRecipe} warnings={warnings} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Workstation System Icons & Status bar */}
        <div className="bg-[#242628] text-white p-2 border-t border-[#111] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffe600] text-black font-black text-[10px] px-2 py-0.5 bevel-out-sm">
              DRIVE VOLUMES
            </span>
            <div className="flex items-center gap-4 text-[10px] text-[#ccc]">
              <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>System HD</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Rig Spec Storage</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>Audio Stem Buffer</span>
              </div>
              <div className="flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5 text-[#aaa]" />
                <span>Trash</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#888]">
            COLIN'S RIG AUDIO WORKSTATION // 90s SGI / UNIX WORKBENCH ENGINE
          </div>
        </div>
      </div>
    </div>
  );
}
