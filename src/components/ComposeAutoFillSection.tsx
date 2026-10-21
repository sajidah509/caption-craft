import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import {
  CaptionResponse,
  formatInstagramAutoFill,
  formatFacebookAutoFill,
  getCaptionStats,
} from "../utils/caption-helpers";
import { CaptionTone } from "./ComposeCaptionCard";

interface ComposeAutoFillSectionProps {
  captions: CaptionResponse;
  onCopySuccess: (text: string, platformName: string) => void;
  onOpenPreview: (caption: string, toneTitle: string) => void;
}

export function ComposeAutoFillSection({
  captions,
  onCopySuccess,
  onOpenPreview,
}: ComposeAutoFillSectionProps) {
  const [platform, setPlatform] = useState<"instagram" | "facebook">("instagram");
  const [selectedTone, setSelectedTone] = useState<CaptionTone>("funny");
  const [copied, setCopied] = useState(false);

  // Compute base text from tone
  const primaryText =
    selectedTone === "funny"
      ? captions.funny
      : selectedTone === "professional"
      ? captions.professional
      : captions.question;

  // Format tailored auto-fill text
  const autoFilledText =
    platform === "instagram"
      ? formatInstagramAutoFill(primaryText, captions.hashtags)
      : formatFacebookAutoFill(primaryText, captions.question, captions.hashtags);

  const stats = getCaptionStats(autoFilledText);

  const handleCopy = () => {
    navigator.clipboard.writeText(autoFilledText);
    setCopied(true);
    onCopySuccess(
      autoFilledText,
      platform === "instagram" ? "Instagram Auto-Fill" : "Facebook Auto-Fill"
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: `Caption for ${platform === "instagram" ? "Instagram" : "Facebook"}`,
        text: autoFilledText,
      }).catch(() => {});
    } else {
      // Fallback web intent
      const url =
        platform === "instagram"
          ? "https://www.instagram.com/"
          : "https://www.facebook.com/";
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#2D223C] to-[#201A2B] rounded-[24px] border border-[#6750A4]/40 p-4 shadow-lg transition-all animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#D0BCFF]/20 text-[#D0BCFF] flex items-center justify-center border border-[#D0BCFF]/40 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#D0BCFF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E6E0E9] flex items-center gap-1.5">
              1-Tap Auto-Fill Caption
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#D0BCFF] text-[#381E72] font-bold">
                NEW
              </span>
            </h3>
            <p className="text-[11px] text-[#CAC4D0]">
              Instant pre-formatted post with CTA &amp; optimized hashtags
            </p>
          </div>
        </div>
      </div>

      {/* Platform Toggle Chips (Material 3 FilterChip Style) */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setPlatform("instagram")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
            platform === "instagram"
              ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white border-transparent shadow-md"
              : "bg-[#1D1B20] text-[#CAC4D0] border-[#49454F] hover:bg-[#362F4A]"
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>Auto-Fill Instagram</span>
        </button>

        <button
          onClick={() => setPlatform("facebook")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
            platform === "facebook"
              ? "bg-[#1877F2] text-white border-transparent shadow-md"
              : "bg-[#1D1B20] text-[#CAC4D0] border-[#49454F] hover:bg-[#362F4A]"
          }`}
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>Auto-Fill Facebook</span>
        </button>
      </div>

      {/* Tone Switcher Pills */}
      <div className="flex items-center justify-between text-[11px] text-[#CAC4D0] mb-2 px-1">
        <span className="flex items-center gap-1 font-medium">
          <SlidersHorizontal className="w-3 h-3 text-[#D0BCFF]" />
          Select Tone Base:
        </span>
        <div className="flex items-center gap-1">
          {(["funny", "professional", "question"] as CaptionTone[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTone(t)}
              className={`px-2 py-0.5 rounded-md capitalize font-medium transition-all ${
                selectedTone === t
                  ? "bg-[#4F378B] text-[#EADDFF] border border-[#D0BCFF]/40 font-semibold"
                  : "bg-[#1D1B20]/60 text-[#CAC4D0] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-filled Formatted Text Box */}
      <div className="bg-[#141218] rounded-[16px] p-3.5 border border-[#49454F]/50 mb-3 relative group">
        <div className="max-h-48 overflow-y-auto pr-1">
          <p className="text-xs text-[#E6E0E9] leading-relaxed whitespace-pre-line select-text font-normal">
            {autoFilledText}
          </p>
        </div>

        {/* Platform watermark badge */}
        <div className="absolute top-2.5 right-2.5 opacity-40 group-hover:opacity-90 transition-opacity pointer-events-none">
          {platform === "instagram" ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E1306C]/30 text-[#FFD8E4] border border-[#E1306C]/40">
              IG Optimized
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1877F2]/30 text-[#D2E4FF] border border-[#1877F2]/40">
              FB Storytelling
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="text-[11px] font-mono text-[#CAC4D0]">
          {stats.charCount} chars &bull; {stats.wordCount} words
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              onOpenPreview(
                autoFilledText,
                platform === "instagram" ? "Instagram Auto-Fill" : "Facebook Auto-Fill"
              )
            }
            className="px-3 py-1.5 rounded-full bg-[#362F4A] hover:bg-[#49454F] text-[#E6E0E9] text-xs font-medium border border-[#49454F] transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>Preview</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
              copied
                ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF]"
                : platform === "instagram"
                ? "bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white border-transparent hover:opacity-95 shadow-sm"
                : "bg-[#1877F2] text-white border-transparent hover:bg-[#166FE5] shadow-sm"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>
                  Copy for {platform === "instagram" ? "Instagram" : "Facebook"}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleShareApp}
            title={`Open / Share to ${platform === "instagram" ? "Instagram" : "Facebook"}`}
            aria-label={`Open ${platform}`}
            className="p-1.5 rounded-full bg-[#362F4A] hover:bg-[#49454F] text-[#CAC4D0] hover:text-[#E6E0E9] border border-[#49454F] transition-all active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
