import React, { useRef } from "react";
import { SPEC_FILES_MAP } from "../data/defaultSpecs";
import { FileText, Upload, RotateCcw, ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface SpecFilesManagerProps {
  specFiles: Record<string, string>;
  customUploaded: Record<string, boolean>;
  onFileChange: (filename: string, content: string, isCustom: boolean) => void;
  onResetAll: () => void;
}

const REQUIRED_SPECS: { key: string; label: string; description: string }[] = [
  {
    key: "ai_tool_system_instructions_master.md",
    label: "AI Tool Master Instructions",
    description: "Block 1 System Instructions + Block 2 JSON Response Schema",
  },
  {
    key: "gear_list.md",
    label: "Gear List Archive",
    description: "Available guitars, amps, and pedals (populates selectors)",
  },
  {
    key: "tone_constraints.md",
    label: "Tone Constraints Matrix",
    description: "Hard constraints for signal chain, always-on pedals, and amp rules",
  },
  {
    key: "pedal_controls_usage_reference.md",
    label: "Pedal Controls Reference",
    description: "Control ranges, notation standards, and initial parameters",
  },
  {
    key: "amp_controls_usage_reference.md",
    label: "Amp Controls Reference",
    description: "Parameter tables for Blues Jr, Marshall DSL40CR & Cyber-Twin",
  },
  {
    key: "fender_cyber_twin_manual_reference.md",
    label: "Cyber-Twin Manual Ref",
    description: "Type PR 393 source transcription & static-tone constraints",
  },
  {
    key: "stem_analysis_reference.md",
    label: "Stem Analysis Reference",
    description: "Calibrated stem-vs-mix thresholds & reliability rankings",
  },
];

export const SpecFilesManager: React.FC<SpecFilesManagerProps> = ({
  specFiles,
  customUploaded,
  onFileChange,
  onResetAll,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewingFile, setViewingFile] = React.useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileUpload = (filename: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onFileChange(filename, text, true);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetSingleFile = (filename: string) => {
    const defaultText = SPEC_FILES_MAP[filename] || "";
    onFileChange(filename, defaultText, false);
  };

  const customCount = Object.values(customUploaded).filter(Boolean).length;

  return (
    <div className="bg-[#8b9199] bevel-out p-1 text-black font-sans">
      {/* Top Header Bar */}
      <div className="bg-[#242628] text-white px-3 py-1.5 flex items-center justify-between border-b border-[#111]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#ffe600]" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#ffe600]">
            SYS_ARCHIVES // SPECIFICATION FILES
          </span>
          <span className="text-[10px] font-mono bg-[#111] px-1.5 py-0.2 text-[#00ff66] border border-[#333]">
            7 / 7 LOADED
          </span>
          {customCount > 0 && (
            <span className="text-[10px] font-mono bg-[#ff2a2a] text-white px-1.5 py-0.2 font-bold animate-pulse">
              {customCount} OVERRIDE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm px-2.5 py-0.5 text-[11px] font-bold text-black cursor-pointer flex items-center gap-1"
          >
            <span>{isOpen ? "COLLAPSE PANEL" : "EXPAND / EDIT SPECS"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick summary bar when closed */}
      {!isOpen && (
        <div className="px-3 py-1.5 bg-[#a2a8b0] text-[11px] font-mono text-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] inline-block shadow-[0_0_5px_#00ff66]"></span>
            <span>Master instructions and 6 rig spec files loaded in memory (Google Drive truth baseline).</span>
          </div>
          <span className="text-[10px] text-[#444]">CLICK EXPAND TO UPLOAD CUSTOM .MD</span>
        </div>
      )}

      {/* Expanded Spec Manager */}
      {isOpen && (
        <div className="p-2.5 bg-[#a2a8b0] space-y-2">
          <div className="flex items-center justify-between bg-[#222] text-[#ccc] px-3 py-1 text-[11px] font-mono border border-[#444]">
            <span className="text-[#00ff66]">
              STATUS: READY // YOU CAN OVERRIDE ANY OF THE 7 FILES VIA LOCAL UPLOAD (.MD OR .JSON)
            </span>
            {customCount > 0 && (
              <button
                type="button"
                onClick={onResetAll}
                className="bg-[#ff2a2a] hover:bg-[#ff4444] text-white px-2 py-0.5 font-bold cursor-pointer flex items-center gap-1 text-[10px]"
              >
                <RotateCcw className="w-3 h-3" />
                RESET ALL TO DEFAULT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {REQUIRED_SPECS.map(({ key, label, description }) => {
              const isCustom = customUploaded[key] || false;
              const content = specFiles[key] || "";
              const linesCount = content.split("\n").length;

              return (
                <div key={key} className="bg-[#b4bac2] bevel-out-sm p-2 text-xs flex flex-col justify-between gap-1.5">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-black text-[11px] truncate" title={key}>
                        {key}
                      </span>
                      {isCustom ? (
                        <span className="bg-[#ff2a2a] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 shrink-0">
                          OVERRIDE
                        </span>
                      ) : (
                        <span className="bg-[#00aa44] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 shrink-0">
                          CLEAR
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-[#222] text-[11px]">{label}</div>
                    <div className="text-[#444] text-[10px] line-clamp-1">{description}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#888] text-[10px] font-mono">
                    <span className="text-[#333] font-bold">{linesCount} lines</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingFile(viewingFile === key ? null : key)}
                        className="bg-[#cdd2d8] hover:bg-[#e0e4ea] active:bg-[#b5bac2] bevel-out-sm px-1.5 py-0.5 text-black font-semibold cursor-pointer"
                      >
                        {viewingFile === key ? "HIDE" : "VIEW"}
                      </button>

                      <input
                        type="file"
                        accept=".md,.txt,.json"
                        ref={(el) => {
                          fileInputRefs.current[key] = el;
                        }}
                        onChange={(e) => handleFileUpload(key, e)}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[key]?.click()}
                        className="bg-[#cdd2d8] hover:bg-[#e0e4ea] active:bg-[#b5bac2] bevel-out-sm px-1.5 py-0.5 text-black font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-2.5 h-2.5" />
                        LOAD
                      </button>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => resetSingleFile(key)}
                          title="Reset file to default"
                          className="bg-[#ff2a2a] hover:bg-[#ff4444] text-white px-1 py-0.5 font-bold cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {viewingFile === key && (
                    <div className="mt-1 p-2 bg-black text-[#00ff66] font-mono text-[10px] border border-[#222] max-h-40 overflow-y-auto whitespace-pre-wrap bevel-in-sm">
                      {content.slice(0, 2500)}
                      {content.length > 2500 && "\n... [TRUNCATED SYSTEM OUTPUT]"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
