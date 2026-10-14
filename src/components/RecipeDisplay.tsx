import React, { useState } from "react";
import { RecipeJson, GroundingSource } from "../types/recipe";
import { safeOrder } from "../utils/ruleChecker";
import { generateMarkdownRecipe } from "../utils/markdownRenderer";
import { Download, Copy, Check, AlertTriangle, Terminal, Cpu, Sliders, Music, Radio, Globe } from "lucide-react";

interface RecipeDisplayProps {
  recipe: RecipeJson;
  warnings: string[];
  groundingSources?: GroundingSource[];
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, warnings, groundingSources }) => {
  const [copied, setCopied] = useState(false);

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

  const handleDownloadMd = () => {
    const mdContent = generateMarkdownRecipe(recipe);
    const cleanSong = song.replace(/[\\/:*?"<>|]/g, "");
    const cleanArtist = artist.replace(/[\\/:*?"<>|]/g, "");
    const filename = `${cleanSong} - ${cleanArtist}.md`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMd = () => {
    const mdContent = generateMarkdownRecipe(recipe);
    navigator.clipboard.writeText(mdContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sortedChain = [...(recipe.signal_chain || [])].sort((a, b) => safeOrder(a) - safeOrder(b));

  return (
    <div className="bg-[#8b9199] bevel-out p-1.5 space-y-2 text-black font-sans">
      {/* 90s Audio Workstation Diagnostic Header */}
      <div className="bg-[#242628] text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#111]">
        <div className="flex items-center gap-3">
          <div className="bg-[#ffe600] text-black font-black px-2 py-0.5 text-xs tracking-tighter bevel-out-sm font-mono flex items-center gap-1">
            <span>OUTPUT</span>
            <span className="text-sm">REC</span>
          </div>
          <div>
            <div className="font-mono text-sm font-bold tracking-wider text-[#ffe600] uppercase">
              WORKSTATION // TONE RECIPE DIAGNOSTIC
            </div>
            <div className="text-[10px] text-[#aaa] font-mono">
              OUTPUT FILE: {song.toUpperCase()} - {artist.toUpperCase()} // GEMINI 3.8 FLASH
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMd}
            className="bg-[#c2c7cd] hover:bg-[#d5d9de] active:bg-[#a8aeb5] bevel-out-sm px-3 py-1 text-xs font-mono font-bold text-black cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00aa44]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "COPIED" : "COPY .MD"}
          </button>
          <button
            type="button"
            onClick={handleDownloadMd}
            className="bg-[#ffe600] hover:bg-[#fff04d] active:bg-[#d4be00] bevel-out-sm px-3.5 py-1 text-xs font-mono font-black text-black cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            DOWNLOAD .MD
          </button>
        </div>
      </div>

      {/* Warnings Panel styled like Jurassic Park CHECK / CLEAR status list */}
      {warnings && warnings.length > 0 && (
        <div className="bg-[#1e1010] border-2 border-[#ff2a2a] p-2.5 bevel-in-sm space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff4444]">
            <span className="bg-[#ff2a2a] text-white px-2 py-0.5 text-[10px] font-black">CHECK</span>
            <span className="uppercase tracking-wider">RULE VALIDATION WARNINGS DETECTED ({warnings.length})</span>
          </div>
          <div className="space-y-1 pt-1 font-mono text-[11px] text-[#ffb0b0]">
            {warnings.map((warn, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-[#2b1414] p-1.5 border border-[#441a1a]">
                <span className="text-[#ff4444] font-bold">[{idx + 1}]</span>
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Terminal Screen Inset */}
      <div className="bg-[#040808] cr-grid bevel-in p-4 sm:p-6 text-slate-100 font-mono space-y-6">
        {/* Section 1: Header */}
        <div className="border-b border-[#00e5ff]/30 pb-4 space-y-2">
          <div className="text-[10px] text-[#00e5ff] tracking-widest uppercase flex items-center justify-between">
            <span>&gt;&gt; TARGET RECORDING SPECIFICATION</span>
            <span className="text-[#888]">SYS_DATE: {todayStr}</span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            {song} <span className="text-[#ffe600]">—</span> {artist}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d1d5db] pt-1">
            <div className="bg-[#11161d] p-2 border border-[#222a35]">
              <span className="text-[#00e5ff] font-bold">ALBUM:</span> {album} ({year})
            </div>
            <div className="bg-[#11161d] p-2 border border-[#222a35]">
              <span className="text-[#00e5ff] font-bold">COVER STATUS:</span> {cover}
            </div>
            <div className="bg-[#11161d] p-2 border border-[#222a35]">
              <span className="text-[#ffe600] font-bold">GUITAR:</span> {guitar}
            </div>
            <div className="bg-[#11161d] p-2 border border-[#222a35]">
              <span className="text-[#ffe600] font-bold">AMP:</span> {amp}
            </div>
            <div className="sm:col-span-2 bg-[#11161d] p-2 border border-[#222a35] text-[#39ff14]">
              <span className="text-white font-bold">PICKUP SELECTION:</span> {pickup}
            </div>
          </div>
        </div>

        {/* Optional Acoustic Audit */}
        {recipe.acoustic_audit && Object.keys(recipe.acoustic_audit).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              ACOUSTIC AUDIT TELEMETRY
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0c1218] p-3 border border-[#00e5ff]/30 text-xs">
              {recipe.acoustic_audit.attack_and_dynamics && (
                <div>
                  <span className="text-[#888] block text-[10px]">ATTACK & DYNAMICS</span>
                  <span className="text-[#00e5ff]">{recipe.acoustic_audit.attack_and_dynamics}</span>
                </div>
              )}
              {recipe.acoustic_audit.frequency_profile && (
                <div>
                  <span className="text-[#888] block text-[10px]">FREQUENCY PROFILE</span>
                  <span className="text-[#00e5ff]">{recipe.acoustic_audit.frequency_profile}</span>
                </div>
              )}
              {recipe.acoustic_audit.saturation_type && (
                <div>
                  <span className="text-[#888] block text-[10px]">SATURATION TYPE</span>
                  <span className="text-[#39ff14]">{recipe.acoustic_audit.saturation_type}</span>
                </div>
              )}
              {recipe.acoustic_audit.modulation && (
                <div>
                  <span className="text-[#888] block text-[10px]">MODULATION</span>
                  <span className="text-[#ffe600]">{recipe.acoustic_audit.modulation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Signal Chain */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            SIGNAL CHAIN ROUTING
          </div>
          {sortedChain.length === 0 ? (
            <div className="p-3 bg-[#0c1218] border border-[#222a35] text-xs text-[#888]">
              Guitar ──▶ {amp} (Direct connection; no external pedals permitted per Constraint 14)
            </div>
          ) : (
            <div className="bg-[#080d12] p-3 border border-[#00e5ff]/40 text-xs space-y-1.5 overflow-x-auto">
              <div className="text-[10px] text-[#666] mb-1 font-mono">FLOW TOPOLOGY:</div>
              {sortedChain.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[#ffe600] font-bold w-6">{p.order}.</span>
                  <span className="text-white font-bold">{p.pedal_name}</span>
                  <span className="text-[#444]">──</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 font-bold ${
                      p.status?.toLowerCase().includes("always on")
                        ? "bg-[#00aa44]/20 text-[#39ff14] border border-[#00aa44]"
                        : p.status?.toLowerCase().includes("bypassed")
                        ? "bg-[#222] text-[#777] border border-[#444]"
                        : "bg-[#ffe600]/20 text-[#ffe600] border border-[#ffe600]"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Amp Settings Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            AMP SETTINGS // PRINTED CONTROL SCALE
          </div>
          <div className="border border-[#222a35] bg-[#0c1218] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161f28] text-[#00e5ff] font-bold border-b border-[#222a35]">
                <tr>
                  <th className="py-1.5 px-3 w-1/2">CONTROL</th>
                  <th className="py-1.5 px-3 w-1/2">SETTING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161f28] text-slate-200">
                {(recipe.amp_settings || []).map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#111922]">
                    <td className="py-1.5 px-3 text-[#ccc]">{s.control}</td>
                    <td className="py-1.5 px-3 text-[#ffe600] font-bold">{s.setting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Fixed Pedal Settings as one table per pedal */}
        {(recipe.fixed_pedal_settings || []).length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              FIXED PEDAL SETTINGS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(recipe.fixed_pedal_settings || []).map((pedal, pIdx) => (
                <div key={pIdx} className="border border-[#222a35] bg-[#0c1218] overflow-hidden">
                  <div className="bg-[#161f28] px-3 py-1 text-xs font-bold text-white border-b border-[#222a35] flex items-center justify-between">
                    <span className="text-[#39ff14]">{pedal.pedal_name}</span>
                    <span className="text-[10px] text-[#888]">{pedal.controls?.length || 0} CONTROLS</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f151c] text-[#888] text-[10px] border-b border-[#1f2832]">
                      <tr>
                        <th className="py-1 px-3 w-1/2">CONTROL</th>
                        <th className="py-1 px-3 w-1/2">SETTING</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#151c24] text-slate-200">
                      {(pedal.controls || []).map((c, cIdx) => (
                        <tr key={cIdx} className="hover:bg-[#111922]">
                          <td className="py-1 px-3 text-[#bbb] text-[11px]">{c.control}</td>
                          <td className="py-1 px-3 text-[#ffe600] font-bold text-[11px]">{c.setting}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Song Parts Table */}
        {(recipe.song_parts || []).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              SONG PARTS MATRIX
            </div>
            <div className="border border-[#222a35] bg-[#0c1218] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161f28] text-[#00e5ff] font-bold border-b border-[#222a35]">
                  <tr>
                    <th className="py-1.5 px-3 w-1/4">PART NAME</th>
                    <th className="py-1.5 px-3 w-1/2">ACTIVE PEDALS</th>
                    <th className="py-1.5 px-3 w-1/4">PICKUP POSITION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161f28]">
                  {(recipe.song_parts || []).map((pt, idx) => {
                    const activePedalsStr = Array.isArray(pt.active_pedals)
                      ? pt.active_pedals.length > 0
                        ? pt.active_pedals.join(", ")
                        : "None (Always-On Only)"
                      : String(pt.active_pedals || "None (Always-On Only)");
                    return (
                      <tr key={idx} className="hover:bg-[#111922]">
                        <td className="py-1.5 px-3 text-white font-bold">{pt.part_name}</td>
                        <td className="py-1.5 px-3 text-[#39ff14]">{activePedalsStr}</td>
                        <td className="py-1.5 px-3 text-[#aaa]">{pt.pickup_position || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 6: Notes */}
        {recipe.notes && (
          <div className="space-y-1 pt-2 border-t border-[#00e5ff]/20">
            <div className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider">
              &gt;&gt; RESEARCH & AUDIT NOTES
            </div>
            <div className="text-xs text-[#ddd] leading-relaxed bg-[#0c1218] p-3 border border-[#222a35]">
              {recipe.notes}
            </div>
          </div>
        )}

        {/* Grounded Web Sources (if returned by Google Search) */}
        {groundingSources && groundingSources.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>VERIFIED GROUNDING SOURCES ({groundingSources.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-[#0c1218] p-2.5 border border-[#222a35] text-[11px]">
              {groundingSources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#161f28] hover:bg-[#1f2c3a] text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 truncate max-w-xs"
                  title={src.uri}
                >
                  [{idx + 1}] {src.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Mandated Verification Line */}
        <div className="bg-[#ffe600] text-black px-4 py-2 font-mono font-black text-center text-xs tracking-wider uppercase bevel-out-sm">
          Verify the album and release year on Discogs before using this recipe.
        </div>
      </div>
    </div>
  );
};
