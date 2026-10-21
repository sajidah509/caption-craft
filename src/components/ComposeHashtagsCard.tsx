import React, { useState } from "react";
import { Hash, Copy, Check, Tags } from "lucide-react";

interface ComposeHashtagsCardProps {
  hashtags: string[];
  onCopyTag: (tag: string) => void;
  onCopyAll: (allTagsString: string) => void;
}

export function ComposeHashtagsCard({
  hashtags,
  onCopyTag,
  onCopyAll,
}: ComposeHashtagsCardProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);

  const validTags = hashtags && hashtags.length > 0 ? hashtags.slice(0, 10) : [];

  const handleCopyAll = () => {
    const allString = validTags.join(" ");
    navigator.clipboard.writeText(allString);
    setCopiedAll(true);
    onCopyAll(allString);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleTagClick = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedSingleTag(tag);
    onCopyTag(tag);
    setTimeout(() => setCopiedSingleTag(null), 1500);
  };

  return (
    <div className="bg-[#2B2930] rounded-[22px] border border-[#49454F]/50 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D0BCFF]/15 text-[#D0BCFF] flex items-center justify-center border border-[#D0BCFF]/30">
            <Tags className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E6E0E9] flex items-center gap-1.5">
              10 Relevant Hashtags
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#4F378B] text-[#EADDFF]">
                {validTags.length}
              </span>
            </h3>
            <span className="text-[11px] text-[#CAC4D0]">Tap any tag to copy individually</span>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          aria-label="Copy all 10 hashtags"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
            copiedAll
              ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF]"
              : "bg-[#4F378B]/40 hover:bg-[#4F378B] text-[#EADDFF] border-[#D0BCFF]/30"
          }`}
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>All Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All 10</span>
            </>
          )}
        </button>
      </div>

      {/* Jetpack Compose AssistChips Cloud */}
      <div className="flex flex-wrap gap-2">
        {validTags.map((tag, idx) => {
          const isCopied = copiedSingleTag === tag;
          return (
            <button
              key={`${tag}-${idx}`}
              onClick={() => handleTagClick(tag)}
              title={`Click to copy ${tag}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-90 border select-none ${
                isCopied
                  ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF] font-semibold"
                  : "bg-[#1D1B20] hover:bg-[#362F4A] text-[#E6E0E9] border-[#49454F] hover:border-[#D0BCFF]/50"
              }`}
            >
              {isCopied ? (
                <Check className="w-3 h-3 text-[#381E72]" />
              ) : (
                <Hash className="w-3 h-3 text-[#D0BCFF]" />
              )}
              <span>{tag.replace(/^#/, "")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
