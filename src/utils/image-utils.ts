/**
 * Resizes an image file or base64 data to max dimensions (e.g. 800x800)
 * to ensure fast transfer and low latency when querying Gemini multimodal API.
 */
export async function optimizeImageForAnalysis(
  source: File | string,
  maxDimension = 800,
  quality = 0.82
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fallback to original
        if (typeof source === "string") {
          resolve({ base64: source, mimeType: "image/jpeg" });
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve({ base64: reader.result as string, mimeType: source.type || "image/jpeg" });
          reader.readAsDataURL(source);
        }
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const optimizedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64: optimizedBase64, mimeType: "image/jpeg" });
    };

    img.onerror = (e) => {
      if (typeof source === "string") {
        resolve({ base64: source, mimeType: "image/jpeg" });
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve({ base64: reader.result as string, mimeType: source.type || "image/jpeg" });
        reader.readAsDataURL(source);
      }
    };

    if (typeof source === "string") {
      img.src = source;
    } else {
      const url = URL.createObjectURL(source);
      img.src = url;
    }
  });
}
