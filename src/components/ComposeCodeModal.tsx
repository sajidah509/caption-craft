import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  FileCode2,
  Download,
  Settings,
  ShieldCheck,
  Package,
  Palette,
  Rocket,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { getJetpackComposeSourceCode } from "../utils/caption-helpers";
import {
  ANDROID_MANIFEST_XML,
  BUILD_GRADLE_KTS,
  REPOSITORY_KT,
  THEME_KT,
  PLAYSTORE_CHECKLIST,
} from "../data/android-project-files";

interface ComposeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey =
  | "main_activity"
  | "build_gradle"
  | "manifest"
  | "repository"
  | "theme"
  | "playstore_guide";

export function ComposeCodeModal({ isOpen, onClose }: ComposeCodeModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("main_activity");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mainActivityCode = getJetpackComposeSourceCode();

  const getActiveContent = (): { code: string; fileName: string; language: string } => {
    switch (activeTab) {
      case "main_activity":
        return { code: mainActivityCode, fileName: "MainActivity.kt", language: "kotlin" };
      case "build_gradle":
        return { code: BUILD_GRADLE_KTS, fileName: "app/build.gradle.kts", language: "kotlin" };
      case "manifest":
        return { code: ANDROID_MANIFEST_XML, fileName: "AndroidManifest.xml", language: "xml" };
      case "repository":
        return { code: REPOSITORY_KT, fileName: "Repository.kt", language: "kotlin" };
      case "theme":
        return { code: THEME_KT, fileName: "Theme.kt", language: "kotlin" };
      case "playstore_guide":
        return { code: "", fileName: "PlayStoreReleaseGuide.md", language: "markdown" };
    }
  };

  const current = getActiveContent();

  const handleCopy = () => {
    if (activeTab === "playstore_guide") {
      const guideText = PLAYSTORE_CHECKLIST.map(
        (c) => `${c.category}\n${c.items.map((i) => `• ${i}`).join("\n")}`
      ).join("\n\n");
      navigator.clipboard.writeText(guideText);
    } else {
      navigator.clipboard.writeText(current.code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload =
      activeTab === "playstore_guide"
        ? PLAYSTORE_CHECKLIST.map(
            (c) => `${c.category}\n${c.items.map((i) => `• ${i}`).join("\n")}`
          ).join("\n\n")
        : current.code;

    const mime = current.fileName.endsWith(".xml") ? "text/xml" : "text/plain";
    const blob = new Blob([textToDownload], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = current.fileName.split("/").pop() || "code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#1E192B] border border-[#362F4A] rounded-[28px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#362F4A] flex items-center justify-between bg-[#2B2930]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4F378B] text-[#D0BCFF] flex items-center justify-center border border-[#D0BCFF]/30 shadow-inner">
              <Rocket className="w-5 h-5 text-[#D0BCFF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#E6E0E9]">
                  Android APK &amp; Play Store Project Hub
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D0BCFF] text-[#381E72] font-bold">
                  SDK 35 Ready
                </span>
              </div>
              <p className="text-[11px] text-[#CAC4D0]">
                Full single-activity Jetpack Compose project, manifests, build scripts &amp; release guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              aria-label={`Download ${current.fileName}`}
              title="Download file"
              className="p-2 rounded-full hover:bg-[#362F4A] text-[#CAC4D0] hover:text-[#E6E0E9] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              aria-label="Copy active file contents"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                copied
                  ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF]"
                  : "bg-[#4F378B] text-[#EADDFF] border-[#D0BCFF]/30 hover:bg-[#4F378B]/80"
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
                  <span>Copy File</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-full hover:bg-[#362F4A] text-[#CAC4D0] hover:text-[#E6E0E9] transition-all ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#211F26] border-b border-[#362F4A] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("main_activity")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "main_activity"
                ? "bg-[#362F4A] text-[#D0BCFF] font-semibold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>MainActivity.kt</span>
          </button>

          <button
            onClick={() => setActiveTab("build_gradle")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "build_gradle"
                ? "bg-[#362F4A] text-[#D0BCFF] font-semibold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>build.gradle.kts</span>
          </button>

          <button
            onClick={() => setActiveTab("manifest")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "manifest"
                ? "bg-[#362F4A] text-[#D0BCFF] font-semibold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AndroidManifest.xml</span>
          </button>

          <button
            onClick={() => setActiveTab("repository")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "repository"
                ? "bg-[#362F4A] text-[#D0BCFF] font-semibold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Repository.kt</span>
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "theme"
                ? "bg-[#362F4A] text-[#D0BCFF] font-semibold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme.kt</span>
          </button>

          <button
            onClick={() => setActiveTab("playstore_guide")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "playstore_guide"
                ? "bg-[#4F378B] text-[#EADDFF] font-bold"
                : "text-[#CAC4D0] hover:text-white hover:bg-[#2B2930]"
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-[#D0BCFF]" />
            <span>Play Store Release Guide</span>
          </button>
        </div>

        {/* Tab Content Body */}
        {activeTab === "playstore_guide" ? (
          <div className="flex-1 overflow-auto p-5 pb-12 bg-[#141218] text-[#E6E0E9] space-y-6">
            <div className="bg-[#2B2930] p-4 rounded-[18px] border border-[#49454F]/50">
              <h3 className="text-sm font-bold text-[#E6E0E9] mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D0BCFF]" />
                Google Play Store APK / AAB Readiness Checklist
              </h3>
              <p className="text-xs text-[#CAC4D0] leading-relaxed">
                Follow these exact steps to compile your production Android App Bundle (`.aab`) and submit it to the Google Play Developer Console.
              </p>
            </div>

            {PLAYSTORE_CHECKLIST.map((section, idx) => (
              <div
                key={idx}
                className="bg-[#1D1B20] p-4 rounded-[18px] border border-[#362F4A] space-y-2.5"
              >
                <h4 className="text-xs font-bold text-[#D0BCFF] tracking-wide uppercase">
                  {section.category}
                </h4>
                <ul className="space-y-2 text-xs text-[#CAC4D0]">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#D0BCFF] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Quick Terminal Command Box */}
            <div className="bg-[#0F0E13] p-4 rounded-[16px] border border-[#49454F]/60 space-y-2 font-mono text-xs text-[#E6E0E9]">
              <div className="flex items-center gap-2 text-[#CAC4D0] text-[11px] pb-1 border-b border-[#362F4A]">
                <Terminal className="w-3.5 h-3.5 text-[#D0BCFF]" />
                <span>Terminal Quick Command: Build Release Bundle</span>
              </div>
              <p className="text-[#D0BCFF] select-all">./gradlew bundleRelease</p>
              <p className="text-[11px] text-[#938F99]">
                Output: <span className="text-[#CAC4D0]">app/build/outputs/bundle/release/app-release.aab</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 pb-12 bg-[#141218] text-[#E6E0E9] font-['JetBrains_Mono',monospace] text-xs leading-relaxed selection:bg-[#4F378B]">
            <pre className="whitespace-pre">
              <code>{current.code}</code>
            </pre>
          </div>
        )}

        {/* Footer info banner */}
        <div className="px-5 py-3 border-t border-[#362F4A] bg-[#2B2930] flex items-center justify-between text-xs text-[#CAC4D0]">
          <span className="truncate max-w-sm">
            Target SDK 35 &bull; Gemini 3.8 Flash Client &bull; Jetpack Compose Material 3
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#362F4A] text-[#E6E0E9] hover:bg-[#49454F] font-medium transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
