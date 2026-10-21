import React, { useState } from "react";
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Copy, Check } from "lucide-react";
import { formatSocialPost } from "../utils/caption-helpers";

interface ComposeSocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  caption: string;
  toneTitle: string;
  hashtags: string[];
}

export function ComposeSocialPreviewModal({
  isOpen,
  onClose,
  imageSrc,
  caption,
  toneTitle,
  hashtags,
}: ComposeSocialPreviewModalProps) {
  const [platform, setPlatform] = useState<"instagram" | "linkedin">("instagram");
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const fullPost = formatSocialPost(caption, hashtags);

  const handleCopyFull = () => {
    navigator.clipboard.writeText(fullPost);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1E192B] border border-[#362F4A] rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#362F4A] flex items-center justify-between bg-[#2B2930]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E6E0E9]">Social Feed Preview</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4F378B] text-[#EADDFF]">
              {toneTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#141218] p-0.5 rounded-full border border-[#49454F]">
              <button
                onClick={() => setPlatform("instagram")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  platform === "instagram"
                    ? "bg-[#D0BCFF] text-[#381E72]"
                    : "text-[#CAC4D0] hover:text-white"
                }`}
              >
                Instagram
              </button>
              <button
                onClick={() => setPlatform("linkedin")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  platform === "linkedin"
                    ? "bg-[#D0BCFF] text-[#381E72]"
                    : "text-[#CAC4D0] hover:text-white"
                }`}
              >
                LinkedIn
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#362F4A] text-[#CAC4D0] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Mockup */}
        <div className="flex-1 overflow-auto p-4 bg-[#141218]">
          <div className="bg-[#2B2930] rounded-[20px] border border-[#49454F]/60 overflow-hidden shadow-lg">
            {/* Account Header */}
            <div className="p-3 flex items-center justify-between border-b border-[#49454F]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D0BCFF] to-[#4F378B] p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-[#141218] flex items-center justify-center text-xs font-bold text-[#EADDFF]">
                    AI
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#E6E0E9] leading-tight">
                    {platform === "instagram" ? "your.creative.handle" : "Your Name &bull; 1st"}
                  </p>
                  <p className="text-[10px] text-[#CAC4D0]">
                    {platform === "instagram" ? "Original Audio" : "Creative Strategist &bull; Just now"}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-[#CAC4D0]" />
            </div>

            {/* Image */}
            {imageSrc && (
              <div className="w-full aspect-square bg-[#1D1B20] overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Social Action Bar (Instagram style) */}
            {platform === "instagram" && (
              <div className="px-3 pt-3 flex items-center justify-between text-[#E6E0E9]">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 hover:text-[#FFB4AB] cursor-pointer" />
                  <MessageCircle className="w-5 h-5 cursor-pointer" />
                  <Send className="w-5 h-5 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 cursor-pointer" />
              </div>
            )}

            {/* Caption & Hashtags with smooth internal scroll */}
            <div className="p-3.5 space-y-2 max-h-[180px] overflow-y-auto pr-1 pb-4">
              <p className="text-xs text-[#E6E0E9] leading-relaxed whitespace-pre-line font-normal">
                {caption}
              </p>

              {hashtags.length > 0 && (
                <p className="text-xs text-[#D0BCFF] font-medium leading-relaxed pt-1">
                  {hashtags.join(" ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#2B2930] border-t border-[#362F4A] flex items-center justify-between">
          <span className="text-xs text-[#CAC4D0]">Ready to paste into your social app</span>
          <button
            onClick={handleCopyFull}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              copiedAll
                ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF]"
                : "bg-[#4F378B] text-[#EADDFF] border-[#D0BCFF]/30 hover:bg-[#4F378B]/80"
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Caption + Tags</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
