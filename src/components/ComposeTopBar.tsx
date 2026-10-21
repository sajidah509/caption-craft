import React from "react";
import { Sparkles, Code2, Smartphone, Monitor, RotateCcw } from "lucide-react";

interface ComposeTopBarProps {
  onOpenCode: () => void;
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
  onReset: () => void;
  hasImage: boolean;
}

export function ComposeTopBar({
  onOpenCode,
  isPhoneFrame,
  onToggleFrame,
  onReset,
  hasImage,
}: ComposeTopBarProps) {
  return (
    <header className="w-full bg-[#1E192B] border-b border-[#362F4A]/60 px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#D0BCFF]/15 border border-[#D0BCFF]/30 flex items-center justify-center text-[#D0BCFF] shadow-inner">
          <Sparkles className="w-5 h-5 text-[#D0BCFF] animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#E6E0E9] tracking-tight flex items-center gap-1.5">
            CaptionCraft
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#4F378B] text-[#EADDFF] font-semibold uppercase">
              Compose
            </span>
          </h1>
          <p className="text-xs text-[#CAC4D0]">Android Jetpack Compose &bull; Gemini 3.8</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {hasImage && (
          <button
            onClick={onReset}
            title="Reset image and captions"
            aria-label="Reset selection"
            className="p-2 rounded-full hover:bg-[#362F4A] active:scale-95 text-[#CAC4D0] hover:text-[#E6E0E9] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onToggleFrame}
          title={isPhoneFrame ? "Switch to Wide / Tablet View" : "Switch to Pixel Phone Frame"}
          aria-label="Toggle device frame"
          className="p-2 rounded-full hover:bg-[#362F4A] active:scale-95 text-[#CAC4D0] hover:text-[#E6E0E9] transition-all"
        >
          {isPhoneFrame ? (
            <Monitor className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onOpenCode}
          aria-label="View Android APK project, manifest, gradle and source code"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4F378B] hover:bg-[#4F378B]/80 text-[#EADDFF] border border-[#D0BCFF]/30 text-xs font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-[#D0BCFF]" />
          <span>APK Hub</span>
        </button>
      </div>
    </header>
  );
}
