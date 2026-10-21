import React, { useState } from "react";
import { Copy, Check, Smile, Briefcase, HelpCircle, Eye, Share2 } from "lucide-react";
import { getCaptionStats } from "../utils/caption-helpers";

export type CaptionTone = "funny" | "professional" | "question";

interface ComposeCaptionCardProps {
  tone: CaptionTone;
  text: string;
  onCopy: (text: string, toneLabel: string) => void;
  onPreview: (caption: string, tone: CaptionTone) => void;
}

const TONE_CONFIG: Record<
  CaptionTone,
  {
    title: string;
    subtitle: string;
    icon: typeof Smile;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
  }
> = {
  funny: {
    title: "Funny & Playful",
    subtitle: "Humorous, witty & meme-ready",
    icon: Smile,
    badgeBg: "bg-[#FFB74D]/20",
    badgeText: "text-[#FFB74D]",
    borderColor: "border-[#FFB74D]/30",
  },
  professional: {
    title: "Professional & Polished",
    subtitle: "Thoughtful brand & career storytelling",
    icon: Briefcase,
    badgeBg: "bg-[#64B5F6]/20",
    badgeText: "text-[#64B5F6]",
    borderColor: "border-[#64B5F6]/30",
  },
  question: {
    title: "Question & Engagement",
    subtitle: "Designed to trigger comments & discussion",
    icon: HelpCircle,
    badgeBg: "bg-[#81C784]/20",
    badgeText: "text-[#81C784]",
    borderColor: "border-[#81C784]/30",
  },
};

export function ComposeCaptionCard({
  tone,
  text,
  onCopy,
  onPreview,
}: ComposeCaptionCardProps) {
  const [copied, setCopied] = useState(false);
  const config = TONE_CONFIG[tone];
  const Icon = config.icon;
  const stats = getCaptionStats(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy(text, config.title);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#2B2930] rounded-[22px] border border-[#49454F]/50 p-4 shadow-sm hover:shadow-md transition-all">
      {/* Header with Tone Badge and Copy Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full ${config.badgeBg} ${config.badgeText} flex items-center justify-center border ${config.borderColor} shadow-inner`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E6E0E9] leading-tight">
              {config.title}
            </h3>
            <span className="text-[11px] text-[#CAC4D0]">{config.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(text, tone)}
            aria-label={`Preview ${config.title} in social feed`}
            title="Preview in social feed"
            className="p-2 rounded-full hover:bg-[#362F4A] active:scale-95 text-[#CAC4D0] hover:text-[#E6E0E9] transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            aria-label={`Copy ${config.title}`}
            title="Copy caption"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
              copied
                ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF]"
                : "bg-[#4F378B]/40 hover:bg-[#4F378B] text-[#EADDFF] border-[#D0BCFF]/30"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Caption Content Box */}
      <div className="bg-[#1D1B20] rounded-[16px] p-3.5 border border-[#49454F]/40 mb-3">
        <p className="text-sm text-[#E6E0E9] leading-relaxed whitespace-pre-wrap select-text font-normal">
          {text}
        </p>
      </div>

      {/* Footer Stats & Meta Chips */}
      <div className="flex items-center justify-between text-[11px] text-[#CAC4D0] pt-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#362F4A]/60 font-mono">
            {stats.charCount} chars
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#362F4A]/60 font-mono">
            {stats.wordCount} words
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs text-[#D0BCFF] hover:underline font-medium flex items-center gap-1"
        >
          <Share2 className="w-3 h-3" />
          Quick Copy
        </button>
      </div>
    </div>
  );
}
