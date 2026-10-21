import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, AlertCircle } from "lucide-react";

interface ComposeVoiceVibeCardProps {
  customVibe: string;
  onVibeChange: (vibe: string) => void;
  disabled?: boolean;
}

const QUICK_VIBE_PRESETS = [
  { label: "✨ Cozy & Nostalgic", text: "Cozy autumn aesthetic, warm nostalgic tone, vintage coffee shop vibes" },
  { label: "🚀 Startup Hustle", text: "Silicon Valley founder mindset, high energy, productivity and grit" },
  { label: "🌴 Vacation Mode", text: "Tropical paradise, wanderlust energy, carefree vacation mood" },
  { label: "💅 Witty & Sarcastic", text: "Gen-Z dry humor, witty punchline, playful sarcasm" },
  { label: "🔥 Gym Motivation", text: "Relentless discipline, fitness mindset, overcoming excuses" },
];

export function ComposeVoiceVibeCard({
  customVibe,
  onVibeChange,
  disabled = false,
}: ComposeVoiceVibeCardProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          onVibeChange(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access was denied. You can still type your vibe below!");
        } else if (event.error !== "no-speech") {
          setSpeechError(`Voice input: ${event.error}. You can type directly.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Error initializing SpeechRecognition:", e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onVibeChange]);

  const toggleListening = () => {
    if (disabled) return;
    if (!speechSupported) {
      setSpeechError("Voice recognition is not supported in this browser. Please type your vibe below.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        // Recognition might already be running, restart it
        recognitionRef.current?.abort();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  };

  const handleClear = () => {
    onVibeChange("");
    setSpeechError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="bg-[#2B2930] rounded-[24px] border border-[#49454F]/50 p-4 shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-[#FFB4AB] text-[#690005] animate-pulse"
                : "bg-[#4F378B]/40 text-[#D0BCFF] border border-[#D0BCFF]/30"
            }`}
          >
            {isListening ? (
              <Volume2 className="w-4 h-4 animate-bounce" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E6E0E9] flex items-center gap-1.5">
              Custom Voice Vibe &amp; Prompt
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#4F378B] text-[#EADDFF]">
                Speech-to-Text
              </span>
            </h3>
            <p className="text-[11px] text-[#CAC4D0]">
              Speak your desired tone, story angle, or keywords
            </p>
          </div>
        </div>

        {customVibe && (
          <button
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear custom vibe"
            title="Clear prompt"
            className="p-1.5 rounded-full hover:bg-[#362F4A] text-[#CAC4D0] hover:text-[#FFB4AB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Voice Recording / Input Surface (Jetpack Compose OutlinedTextField Style) */}
      <div className="relative">
        <div
          className={`relative rounded-[16px] bg-[#1D1B20] border transition-all ${
            isListening
              ? "border-[#FFB4AB] ring-2 ring-[#FFB4AB]/30"
              : customVibe
              ? "border-[#D0BCFF]/60"
              : "border-[#49454F] focus-within:border-[#D0BCFF]"
          } p-3 flex flex-col gap-2`}
        >
          <div className="flex items-start gap-2.5">
            {/* Pulsing Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={disabled}
              aria-label={isListening ? "Stop voice recording" : "Record voice vibe"}
              title={
                isListening
                  ? "Click to stop recording"
                  : speechSupported
                  ? "Click to speak your prompt"
                  : "Speech recognition not supported, type below"
              }
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md ${
                isListening
                  ? "bg-[#FFB4AB] text-[#690005] ring-4 ring-[#FFB4AB]/40 animate-pulse"
                  : "bg-[#D0BCFF] hover:bg-[#E8DEF8] text-[#381E72] hover:shadow-[#D0BCFF]/30"
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-[#690005]" />
              ) : (
                <Mic className="w-5 h-5 text-[#381E72]" />
              )}
            </button>

            {/* Editable Text Area */}
            <div className="flex-1 min-w-0">
              <textarea
                value={customVibe}
                onChange={(e) => onVibeChange(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening... Speak your vibe, audience, or aesthetic now!"
                    : "Tap mic to speak, or type your custom vibe (e.g. 'moody night drive, synthwave aesthetic')..."
                }
                rows={2}
                disabled={disabled}
                className="w-full bg-transparent text-xs text-[#E6E0E9] placeholder-[#938F99] resize-none focus:outline-none font-normal leading-relaxed"
              />
            </div>
          </div>

          {/* Listening Live Status Indicator */}
          {isListening && (
            <div className="flex items-center justify-between pt-1 border-t border-[#49454F]/40 text-[11px] text-[#FFB4AB]">
              <span className="flex items-center gap-1.5 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#FFB4AB] animate-ping" />
                Listening to your voice... Speak clearly
              </span>
              <button
                type="button"
                onClick={toggleListening}
                className="underline font-semibold cursor-pointer text-[#FFDAD6]"
              >
                Done Speaking
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Speech error or info message */}
      {speechError && (
        <div className="mt-2 text-[11px] text-[#FFB4AB] flex items-center gap-1.5 px-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Quick Preset Vibe Chips */}
      <div className="mt-3 pt-2.5 border-t border-[#49454F]/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-[#CAC4D0] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D0BCFF]" />
            Quick Vibe Ideas:
          </span>
          {customVibe && (
            <span className="text-[10px] font-mono text-[#D0BCFF]">
              Will be appended to Gemini AI prompt
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_VIBE_PRESETS.map((preset) => {
            const isSelected = customVibe === preset.text;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onVibeChange(preset.text)}
                disabled={disabled}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-[#D0BCFF] text-[#381E72] border-[#D0BCFF] font-semibold"
                    : "bg-[#1D1B20] text-[#CAC4D0] hover:text-[#E6E0E9] border-[#49454F] hover:border-[#D0BCFF]/40 hover:bg-[#362F4A]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
