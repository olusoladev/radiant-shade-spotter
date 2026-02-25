const TARGET_SIZE = 100;

/**
 * Draw image onto an offscreen canvas downscaled to ~100×100
 * and return the raw RGBA pixel data.
 */
export function extractPixelData(img: HTMLImageElement): Uint8ClampedArray {
  if (typeof document === "undefined" || !document.createElement) {
    throw new Error("Canvas API is not available in this environment");
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D canvas context");
  }

  // Downscale preserving aspect ratio
  const ratio = Math.min(TARGET_SIZE / img.naturalWidth, TARGET_SIZE / img.naturalHeight, 1);
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  return imageData.data;
}
