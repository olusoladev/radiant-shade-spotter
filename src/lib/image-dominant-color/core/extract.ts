import type { ImageInput, DominantColorOptions, DominantColorResult } from "../types";
import { loadImage } from "../utils/image-loader";
import { extractPixelData } from "./canvas";
import { findDominantColor } from "./quantize";
import { rgbToHex } from "../utils/color";

/**
 * Extract the dominant color from an image.
 *
 * @param input — URL string, File object, or HTMLImageElement
 * @param options — quality (pixel skip rate) and precision (color reduction)
 * @returns Promise resolving to { rgb, hex }
 */
export async function getDominantColor(
  input: ImageInput,
  options?: DominantColorOptions
): Promise<DominantColorResult> {
  if (!input) {
    throw new Error("Image input is required");
  }

  const img = await loadImage(input);

  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    throw new Error("Image has no dimensions — it may not have loaded correctly");
  }

  const pixelData = extractPixelData(img);
  const rgb = findDominantColor(pixelData, options);

  return { rgb, hex: rgbToHex(rgb) };
}
