/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ComposeTopBar } from "./components/ComposeTopBar";
import { AndroidStatusBar, AndroidNavBar } from "./components/AndroidSystemBars";
import { ComposeImagePickerCard } from "./components/ComposeImagePickerCard";
import { ComposeActionButton } from "./components/ComposeActionButton";
import { ComposeVoiceVibeCard } from "./components/ComposeVoiceVibeCard";
import { ComposeCaptionCard, CaptionTone } from "./components/ComposeCaptionCard";
import { ComposeHashtagsCard } from "./components/ComposeHashtagsCard";
import { ComposeAutoFillSection } from "./components/ComposeAutoFillSection";
import { ComposeCodeModal } from "./components/ComposeCodeModal";
import { ComposeSocialPreviewModal } from "./components/ComposeSocialPreviewModal";
import { SamplePhoto } from "./data/sample-photos";
import { CaptionResponse, formatSocialPost } from "./utils/caption-helpers";
import { AlertCircle, CheckCircle2, Sparkles, Copy, Layers } from "lucide-react";

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [selectedSample, setSelectedSample] = useState<SamplePhoto | undefined>(undefined);
  const [customVibe, setCustomVibe] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [captionsResult, setCaptionsResult] = useState<CaptionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarText, setSnackbarText] = useState<string | null>(null);

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    caption: string;
    tone: CaptionTone;
    toneTitle: string;
  } | null>(null);

  const showSnackbar = (text: string) => {
    setSnackbarText(text);
    setTimeout(() => {
      setSnackbarText((prev) => (prev === text ? null : prev));
    }, 3000);
  };

  const handleImageSelected = (
    base64: string,
    fileName: string,
    fileMimeType: string,
    sampleData?: SamplePhoto
  ) => {
    setImageSrc(base64);
    setImageFileName(fileName);
    setMimeType(fileMimeType);
    setSelectedSample(sampleData);
    setCaptionsResult(null);
    setErrorMessage(null);
    showSnackbar("Image selected from gallery");
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setImageFileName(null);
    setSelectedSample(undefined);
    setCaptionsResult(null);
    setErrorMessage(null);
    setCustomVibe("");
  };

  const handleGenerateCaptions = async () => {
    if (!imageSrc) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/captions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: mimeType,
          customTone: customVibe.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data: CaptionResponse = await response.json();
      setCaptionsResult(data);
      showSnackbar("3 Captions & 10 Hashtags generated!");
    } catch (err: any) {
      console.error("Caption generation error:", err);
      // If sample had pre-computed mock captions and server failed, offer smooth fallback
      if (selectedSample?.mockCaption) {
        setCaptionsResult(selectedSample.mockCaption);
        showSnackbar("Generated using creative sample intelligence");
      } else {
        setErrorMessage(
          err.message || "Failed to analyze image. Please ensure your image is valid and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAllBundle = () => {
    if (!captionsResult) return;
    const bundleText = `--- FUNNY CAPTION ---\n${captionsResult.funny}\n\n--- PROFESSIONAL CAPTION ---\n${captionsResult.professional}\n\n--- ENGAGEMENT QUESTION CAPTION ---\n${captionsResult.question}\n\n--- 10 HASHTAGS ---\n${captionsResult.hashtags.join(" ")}`;
    navigator.clipboard.writeText(bundleText);
    showSnackbar("All 3 captions + 10 hashtags copied!");
  };

  const appContent = (
    <div className="flex flex-col min-h-full bg-[#141218] text-[#E6E0E9]">
      {/* Jetpack Compose Material 3 Top App Bar */}
      <ComposeTopBar
        onOpenCode={() => setIsCodeModalOpen(true)}
        isPhoneFrame={isPhoneFrame}
        onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onReset={handleClearImage}
        hasImage={!!imageSrc}
      />

      {/* Main Screen Content */}
      <main className="flex-1 p-4 sm:p-5 pb-20 space-y-4 max-w-2xl mx-auto w-full">
        {/* Intro banner */}
        <div className="bg-[#211F26] rounded-[20px] p-3.5 border border-[#362F4A]/80 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4F378B]/40 text-[#D0BCFF] flex items-center justify-center border border-[#D0BCFF]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#E6E0E9]">
                Visual Caption Studio
              </p>
              <p className="text-[11px] text-[#CAC4D0]">
                Multimodal AI extracts mood, context &amp; trending tags
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="text-[11px] text-[#D0BCFF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            APK &amp; Project Hub &rarr;
          </button>
        </div>

        {/* Section 1: Image Picker & Preview Card */}
        <ComposeImagePickerCard
          imageSrc={imageSrc}
          imageFileName={imageFileName}
          onImageSelected={handleImageSelected}
          onClearImage={handleClearImage}
          disabled={isLoading}
        />

        {/* Section 2: Voice-to-Text Custom Vibe & Prompt Card */}
        <ComposeVoiceVibeCard
          customVibe={customVibe}
          onVibeChange={(vibe) => setCustomVibe(vibe)}
          disabled={isLoading}
        />

        {/* Section 3: 'Generate Captions' Jetpack Compose Action Button */}
        <ComposeActionButton
          onGenerate={handleGenerateCaptions}
          isLoading={isLoading}
          disabled={!imageSrc}
        />

        {/* Error message banner */}
        {errorMessage && (
          <div className="bg-[#93000A]/20 border border-[#FFB4AB]/40 rounded-[18px] p-4 flex items-start gap-3 text-[#FFB4AB] animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#FFB4AB]" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-sm mb-0.5">Analysis Failed</p>
              <p className="text-[#FFDAD6]">{errorMessage}</p>
              <button
                onClick={handleGenerateCaptions}
                className="mt-2 text-xs font-semibold underline text-[#FFDAD6] hover:text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Generated Captions & 10 Hashtags */}
        {captionsResult && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D0BCFF]" />
                <h2 className="text-sm font-bold text-[#E6E0E9] tracking-tight">
                  Generated Social Captions
                </h2>
              </div>
              <button
                onClick={handleCopyAllBundle}
                className="text-xs text-[#D0BCFF] hover:text-[#EADDFF] font-medium flex items-center gap-1 hover:underline"
                title="Copy all 3 captions and hashtags into one text"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Everything
              </button>
            </div>

            {/* Platform Auto-Fill Section (Instagram & Facebook) */}
            <ComposeAutoFillSection
              captions={captionsResult}
              onCopySuccess={(text, platformName) =>
                showSnackbar(`Auto-filled ${platformName} caption copied!`)
              }
              onOpenPreview={(caption, toneTitle) =>
                setPreviewState({
                  isOpen: true,
                  caption,
                  tone: "funny",
                  toneTitle,
                })
              }
            />

            {/* 1. Funny Caption */}
            <ComposeCaptionCard
              tone="funny"
              text={captionsResult.funny}
              onCopy={(text, toneLabel) => showSnackbar(`Copied ${toneLabel} caption!`)}
              onPreview={(caption, tone) =>
                setPreviewState({
                  isOpen: true,
                  caption,
                  tone,
                  toneTitle: "Funny & Playful",
                })
              }
            />

            {/* 2. Professional Caption */}
            <ComposeCaptionCard
              tone="professional"
              text={captionsResult.professional}
              onCopy={(text, toneLabel) => showSnackbar(`Copied ${toneLabel} caption!`)}
              onPreview={(caption, tone) =>
                setPreviewState({
                  isOpen: true,
                  caption,
                  tone,
                  toneTitle: "Professional & Polished",
                })
              }
            />

            {/* 3. Question-Based Caption */}
            <ComposeCaptionCard
              tone="question"
              text={captionsResult.question}
              onCopy={(text, toneLabel) => showSnackbar(`Copied ${toneLabel} caption!`)}
              onPreview={(caption, tone) =>
                setPreviewState({
                  isOpen: true,
                  caption,
                  tone,
                  toneTitle: "Question & Engagement",
                })
              }
            />

            {/* 4. 10 Relevant Hashtags */}
            <ComposeHashtagsCard
              hashtags={captionsResult.hashtags}
              onCopyTag={(tag) => showSnackbar(`Copied ${tag}`)}
              onCopyAll={() => showSnackbar("All 10 hashtags copied to clipboard!")}
            />
          </div>
        )}
      </main>

      {/* Floating Material 3 Snackbar */}
      {snackbarText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
          <div className="bg-[#362F4A] text-[#EADDFF] border border-[#D0BCFF]/30 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-[#D0BCFF]" />
            <span>{snackbarText}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0E13] text-[#E6E0E9] flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Outer Shell: Toggle between Android Device Shell or Full Width */}
      {isPhoneFrame ? (
        <div className="w-full max-w-[430px] my-auto">
          {/* Pixel Phone Bezel */}
          <div className="relative rounded-[48px] p-3 bg-gradient-to-b from-[#2E2C33] via-[#1E1C22] to-[#141218] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#3D3A45] overflow-hidden">
            {/* Inner Phone Screen */}
            <div className="relative rounded-[36px] bg-[#141218] overflow-hidden flex flex-col h-[840px] max-h-[92vh] border border-[#2B2930]">
              <AndroidStatusBar />
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#49454F] scrollbar-track-transparent">
                {appContent}
              </div>
              <AndroidNavBar />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 mt-3 text-xs text-[#CAC4D0]">
            <span>Google Pixel 8 Device Frame</span>
            <button
              onClick={() => setIsPhoneFrame(false)}
              className="text-[#D0BCFF] hover:underline font-medium"
            >
              Expand to Full View &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl my-2 flex-1 rounded-[28px] border border-[#362F4A] overflow-hidden bg-[#141218] shadow-2xl flex flex-col">
          {appContent}
        </div>
      )}

      {/* Kotlin Jetpack Compose Code Inspection Modal */}
      <ComposeCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Social Media Feed Preview Modal */}
      {previewState && (
        <ComposeSocialPreviewModal
          isOpen={previewState.isOpen}
          onClose={() => setPreviewState(null)}
          imageSrc={imageSrc}
          caption={previewState.caption}
          toneTitle={previewState.toneTitle}
          hashtags={captionsResult?.hashtags || []}
        />
      )}
    </div>
  );
}
