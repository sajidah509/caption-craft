import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface ComposeActionButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function ComposeActionButton({
  onGenerate,
  isLoading,
  disabled,
}: ComposeActionButtonProps) {
  return (
    <div className="w-full">
      <button
        onClick={onGenerate}
        disabled={disabled || isLoading}
        className={`w-full py-3.5 px-6 rounded-[16px] font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] ${
          disabled
            ? "bg-[#332D41]/40 text-[#CAC4D0]/40 border border-[#49454F]/30 cursor-not-allowed"
            : isLoading
            ? "bg-[#4F378B] text-[#EADDFF] border border-[#D0BCFF]/40 cursor-wait shadow-lg shadow-[#4F378B]/20"
            : "bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] hover:shadow-lg hover:shadow-[#D0BCFF]/25 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 text-[#EADDFF] animate-spin" />
            <span className="font-medium text-sm">Gemini is analyzing visual details...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 fill-current" />
            <span>Generate Captions</span>
          </>
        )}
      </button>

      {disabled && (
        <p className="text-[11px] text-center text-[#938F99] mt-2">
          Select an image from the gallery first to enable Gemini caption generation
        </p>
      )}
    </div>
  );
}
