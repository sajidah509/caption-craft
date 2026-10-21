import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, RefreshCw, X, Sparkles, CheckCircle2 } from "lucide-react";
import { SAMPLE_PHOTOS, SamplePhoto } from "../data/sample-photos";
import { optimizeImageForAnalysis } from "../utils/image-utils";

interface ComposeImagePickerCardProps {
  imageSrc: string | null;
  imageFileName: string | null;
  onImageSelected: (base64: string, fileName: string, mimeType: string, sampleData?: SamplePhoto) => void;
  onClearImage: () => void;
  disabled?: boolean;
}

export function ComposeImagePickerCard({
  imageSrc,
  imageFileName,
  onImageSelected,
  onClearImage,
  disabled = false,
}: ComposeImagePickerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      const optimized = await optimizeImageForAnalysis(file);
      onImageSelected(optimized.base64, file.name, optimized.mimeType);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(reader.result as string, file.name, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleSelectSample = async (sample: SamplePhoto) => {
    if (disabled) return;
    setIsLoadingSample(true);
    try {
      const optimized = await optimizeImageForAnalysis(sample.url);
      onImageSelected(optimized.base64, `${sample.id}.jpg`, optimized.mimeType, sample);
    } catch (err) {
      console.warn("Using sample url directly:", err);
      onImageSelected(sample.url, `${sample.id}.jpg`, "image/jpeg", sample);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* Jetpack Compose ElevatedCard container */}
      <div className="bg-[#2B2930] rounded-[24px] border border-[#49454F]/50 p-4 shadow-md transition-all">
        {imageSrc ? (
          /* Selected Image View */
          <div className="space-y-3">
            <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-[#1D1B20] border border-[#49454F]/60 group">
              <img
                src={imageSrc}
                alt="Selected gallery preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Gradient overlay on top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Top controls pill */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  aria-label="Change image"
                  title="Choose another image"
                  className="px-2.5 py-1.5 rounded-full bg-[#1D1B20]/80 backdrop-blur-md text-[#E6E0E9] hover:bg-[#362F4A] text-xs font-medium border border-[#49454F] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#D0BCFF]" />
                  <span>Change</span>
                </button>
                <button
                  onClick={onClearImage}
                  disabled={disabled}
                  aria-label="Remove image"
                  title="Remove selected image"
                  className="p-1.5 rounded-full bg-[#1D1B20]/80 backdrop-blur-md text-[#CAC4D0] hover:text-[#FFB4AB] hover:bg-[#93000A]/30 border border-[#49454F] active:scale-95 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom image info pill */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90 z-10">
                <span className="truncate max-w-[200px] font-medium drop-shadow bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  {imageFileName || "Selected Photo"}
                </span>
                <span className="flex items-center gap-1 bg-[#4F378B]/90 text-[#EADDFF] px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm border border-[#D0BCFF]/30">
                  <CheckCircle2 className="w-3 h-3 text-[#D0BCFF]" />
                  Ready to analyze
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#CAC4D0] flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#D0BCFF]" />
                Photo ready for Gemini AI
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="text-xs text-[#D0BCFF] hover:underline font-medium cursor-pointer"
              >
                Browse Gallery &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Empty State: Select image from Gallery */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-[18px] p-6 text-center transition-all ${
              isDragging
                ? "border-[#D0BCFF] bg-[#D0BCFF]/10 scale-[0.99]"
                : "border-[#49454F] hover:border-[#D0BCFF]/60 hover:bg-[#332D41]/30"
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-[#4F378B]/30 border border-[#D0BCFF]/30 flex items-center justify-center text-[#D0BCFF] mb-3 shadow-inner">
              <Upload className="w-7 h-7 text-[#D0BCFF]" />
            </div>

            <h3 className="text-sm font-semibold text-[#E6E0E9] mb-1">
              Select Image from Gallery
            </h3>
            <p className="text-xs text-[#CAC4D0] mb-4 max-w-xs mx-auto">
              Choose any photo from your phone or drag & drop (JPEG, PNG, WEBP)
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isLoadingSample}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D0BCFF] text-[#381E72] hover:bg-[#E8DEF8] active:scale-95 text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose from Device</span>
            </button>
          </div>
        )}

        {/* Quick Sample Photos Carousel */}
        <div className="mt-4 pt-3 border-t border-[#49454F]/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#CAC4D0] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D0BCFF]" />
              Or test with sample photos
            </span>
            {isLoadingSample && (
              <span className="text-[11px] text-[#D0BCFF] animate-pulse">Loading sample...</span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_PHOTOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                disabled={disabled || isLoadingSample}
                className="group relative rounded-[12px] overflow-hidden aspect-square border border-[#49454F]/60 hover:border-[#D0BCFF] transition-all hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] cursor-pointer"
                title={sample.title}
                aria-label={`Select sample ${sample.title}`}
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate w-full text-left leading-tight drop-shadow">
                    {sample.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
