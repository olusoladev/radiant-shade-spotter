

## Image Dominant Color — Library + Demo App

### 1. Core Library Module (`src/lib/image-dominant-color/`)

**Clean modular structure:**
- `types.ts` — `DominantColorResult` (`rgb`, `hex`), `DominantColorOptions` (`quality`, `precision`)
- `core/extract.ts` — Main `getDominantColor()` function accepting URL string, File, or HTMLImageElement
- `core/canvas.ts` — Canvas creation, image drawing at downscaled size (~100×100), pixel data extraction
- `core/quantize.ts` — Color precision reduction and frequency mapping to find the dominant color
- `utils/color.ts` — RGB→hex conversion, transparency detection
- `utils/image-loader.ts` — Unified image loading from URL/File/HTMLImageElement with error guards
- `index.ts` — Clean public API re-export

**Key behaviors:**
- Downscales to ~100×100 for performance
- Skips transparent pixels (alpha < 128)
- Reduces precision (default 16) to merge similar tones
- Pixel skipping via quality param (default 10)
- Guard clauses for invalid input, missing canvas support, empty pixel data

### 2. Demo Web App (Home Page)

**Interactive demo page with three input methods:**
- **URL input** — Paste any image URL and extract its dominant color
- **File upload** — Drag & drop or browse to pick a local image
- **Sample images** — Pre-loaded example images to try instantly

**Visual output:**
- Large color swatch showing the extracted dominant color
- RGB and hex values displayed
- The original image shown alongside the result
- Processing time indicator
- Copy-to-clipboard for hex/rgb values

**Design:** Clean, minimal layout with the image on one side and the color result on the other. Responsive for mobile.

### 3. Package-Ready Files (for external publishing)

- `tsup.config.ts` example file viewable in the demo
- `package.json` snippet with proper `exports` map, `sideEffects: false`, dual ESM/CJS config
- Build & publish instructions displayed on the demo page
- Example HTML usage code snippet

