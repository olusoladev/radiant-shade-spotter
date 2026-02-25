import type { RGB, DominantColorOptions } from "../types";
import { isTransparent } from "../utils/color";

const DEFAULT_QUALITY = 10;
const DEFAULT_PRECISION = 16;

/**
 * Find the dominant color from raw RGBA pixel data using
 * precision reduction + frequency mapping.
 */
export function findDominantColor(
  data: Uint8ClampedArray,
  options: DominantColorOptions = {}
): RGB {
  const quality = Math.max(1, options.quality ?? DEFAULT_QUALITY);
  const precision = Math.max(1, options.precision ?? DEFAULT_PRECISION);

  const freq = new Map<string, { count: number; r: number; g: number; b: number }>();

  for (let i = 0; i < data.length; i += 4 * quality) {
    if (isTransparent(data, i)) continue;

    // Reduce precision by rounding to nearest multiple
    const r = Math.round(data[i] / precision) * precision;
    const g = Math.round(data[i + 1] / precision) * precision;
    const b = Math.round(data[i + 2] / precision) * precision;

    const key = `${r},${g},${b}`;
    const entry = freq.get(key);
    if (entry) {
      entry.count++;
    } else {
      freq.set(key, { count: 1, r, g, b });
    }
  }

  if (freq.size === 0) {
    throw new Error("No non-transparent pixel data found in the image");
  }

  let dominant = { count: 0, r: 0, g: 0, b: 0 };
  for (const entry of freq.values()) {
    if (entry.count > dominant.count) {
      dominant = entry;
    }
  }

  return [dominant.r, dominant.g, dominant.b];
}
