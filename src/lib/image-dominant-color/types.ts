/** RGB tuple [red, green, blue], each 0–255 */
export type RGB = [number, number, number];

/** Result returned by getDominantColor */
export interface DominantColorResult {
  rgb: RGB;
  hex: string;
}

/** Options for color extraction */
export interface DominantColorOptions {
  /**
   * Pixel sampling rate — every Nth pixel is sampled.
   * Higher = faster but less accurate. Default: 10
   */
  quality?: number;
  /**
   * Color precision reduction factor.
   * Rounds each channel to nearest multiple of this value to merge similar tones.
   * Default: 16
   */
  precision?: number;
}

/** Input accepted by getDominantColor */
export type ImageInput = string | File | HTMLImageElement;
