import type { ImageInput } from "../types";

/**
 * Loads an ImageInput into an HTMLImageElement ready for canvas drawing.
 * Handles URL strings, File objects, and existing HTMLImageElement instances.
 */
export function loadImage(input: ImageInput): Promise<HTMLImageElement> {
  if (input instanceof HTMLImageElement) {
    if (input.complete && input.naturalWidth > 0) {
      return Promise.resolve(input);
    }
    return new Promise((resolve, reject) => {
      input.onload = () => resolve(input);
      input.onerror = () => reject(new Error("Failed to load image element"));
    });
  }

  if (input instanceof File) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(input);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image from File"));
      };
      img.src = url;
    });
  }

  if (typeof input === "string") {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image from URL: ${input}`));
      img.src = input;
    });
  }

  return Promise.reject(new Error("Invalid image input: expected URL string, File, or HTMLImageElement"));
}
