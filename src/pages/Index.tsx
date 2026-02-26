import React, { useState, useRef, useCallback } from "react";
import { getDominantColor, type DominantColorResult } from "@devsola/image-color";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, Link, Image as ImageIcon, Copy, Clock, Pipette, Code, ChevronDown, ChevronUp } from "lucide-react";

const SAMPLE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400", label: "Mountain Lake" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", label: "Tropical Beach" },
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", label: "Green Valley" },
  { url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400", label: "Sunset Sky" },
  { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400", label: "Purple Gradient" },
  { url: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400", label: "Red Flowers" },
];

const USAGE_CODE = `import { getDominantColor } from 'image-dominant-color';

// From URL
const result = await getDominantColor('https://example.com/photo.jpg');
console.log(result.hex);  // "#4a7c59"
console.log(result.rgb);  // [74, 124, 89]

// From File input
const file = document.querySelector('input[type=file]').files[0];
const color = await getDominantColor(file);

// From HTMLImageElement
const img = document.querySelector('img');
const color2 = await getDominantColor(img);

// With options
const color3 = await getDominantColor(url, {
  quality: 5,    // Sample every 5th pixel (more accurate)
  precision: 8,  // Finer color grouping
});`;

const PACKAGE_JSON_SNIPPET = `{
  "name": "image-dominant-color",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false,
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}`;

const TSUP_CONFIG = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
});`;

const Index = () => {
  const [result, setResult] = useState<DominantColorResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showPackageInfo, setShowPackageInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColor = useCallback(async (input: string | File, previewUrl?: string) => {
    setLoading(true);
    setResult(null);
    setProcessingTime(null);

    if (typeof input === "string") {
      setImagePreview(input);
    } else if (previewUrl) {
      setImagePreview(previewUrl);
    }

    try {
      const start = performance.now();
      const color = await getDominantColor(input);
      const elapsed = performance.now() - start;

      setResult(color);
      setProcessingTime(elapsed);
    } catch (err) {
      toast({
        title: "Extraction failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
      setImagePreview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) extractColor(urlInput.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      extractColor(file, preview);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      extractColor(file, preview);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: text });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Pipette className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                image-dominant-color
              </h1>
              <p className="text-sm text-muted-foreground">
                Extract the dominant color from any image. Zero dependencies.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* Input Methods */}
        <section className="space-y-6">
          {/* URL Input */}
          <Card className="p-6">
            <form onSubmit={handleUrlSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Paste an image URL…"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="pl-10 font-mono text-sm"
                />
              </div>
              <Button type="submit" disabled={loading || !urlInput.trim()}>
                Extract
              </Button>
            </form>
          </Card>

          {/* File Upload / Drop Zone */}
          <Card
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-10 transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop an image here or <span className="font-medium text-foreground underline">browse</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Card>

          {/* Sample Images */}
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Or try a sample
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.url}
                  onClick={() => extractColor(sample.url)}
                  disabled={loading}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border transition-all hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={sample.url}
                    alt={sample.label}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-foreground/60 px-1.5 py-1 text-[10px] font-medium text-background backdrop-blur-sm">
                    {sample.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Result */}
        {(loading || result) && (
          <section>
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image preview */}
                <div className="flex items-center justify-center bg-muted p-6 md:w-1/2">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Analyzed image"
                      className="max-h-72 rounded-lg object-contain shadow-sm"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-border">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Color result */}
                <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-24 w-24 animate-pulse rounded-2xl bg-muted" />
                      <p className="text-sm text-muted-foreground">Extracting…</p>
                    </div>
                  ) : result ? (
                    <>
                      <div
                        className="h-28 w-28 rounded-2xl shadow-lg ring-1 ring-border"
                        style={{ backgroundColor: result.hex }}
                      />
                      <div className="space-y-2 text-center">
                        <button
                          onClick={() => copyToClipboard(result.hex)}
                          className="group flex items-center gap-2 font-mono text-2xl font-bold tracking-tight text-foreground"
                        >
                          {result.hex}
                          <Copy className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(`rgb(${result.rgb.join(", ")})`)}
                          className="group flex items-center gap-2 font-mono text-sm text-muted-foreground"
                        >
                          rgb({result.rgb.join(", ")})
                          <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </div>
                      {processingTime !== null && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {processingTime.toFixed(1)}ms
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Package Info / Code Snippets */}
        <section>
          <button
            onClick={() => setShowPackageInfo(!showPackageInfo)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code className="h-4 w-4" />
            npm package setup & usage
            {showPackageInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showPackageInfo && (
            <div className="mt-4 space-y-6">
              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Usage</h3>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed font-mono text-foreground">
                  {USAGE_CODE}
                </pre>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">package.json</h3>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed font-mono text-foreground">
                    {PACKAGE_JSON_SNIPPET}
                  </pre>
                </Card>
                <Card className="p-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">tsup.config.ts</h3>
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed font-mono text-foreground">
                    {TSUP_CONFIG}
                  </pre>
                  <div className="mt-4 rounded-lg bg-muted p-4 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">Build & Publish:</p>
                    <p className="font-mono">npm run build</p>
                    <p className="font-mono">npm publish</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Built with Canvas API · Zero dependencies · Tree-shakeable
      </footer>
    </div>
  );
};

export default Index;
