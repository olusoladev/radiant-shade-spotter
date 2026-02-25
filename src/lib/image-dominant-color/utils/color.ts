import type { RGB } from "../types";

/** Convert RGB tuple to hex string (#rrggbb) */
export function rgbToHex(rgb: RGB): string {
  return (
    "#" +
    rgb
      .map((c) => {
        const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/** Returns true if the pixel at offset i is transparent (alpha < 128) */
export function isTransparent(data: Uint8ClampedArray, i: number): boolean {
  return data[i + 3] < 128;
}
