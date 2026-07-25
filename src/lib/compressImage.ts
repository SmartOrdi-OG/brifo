export interface CompressedImage {
  base64: string;
  mediaType: 'image/jpeg';
}

interface CompressOptions {
  maxDimension: number;
  maxBytes: number;
  minQuality: number;
}

/** Full-size copy sent to /api/analyze — large enough for the OCR/vision
 * model to read small print reliably. */
const ANALYZE_OPTIONS: CompressOptions = { maxDimension: 1600, maxBytes: 1024 * 1024, minQuality: 0.35 };

/** Smaller copy kept alongside the letter so a parent can reopen the
 * original later — display-only, so a much lower size budget is fine. */
const STORAGE_OPTIONS: CompressOptions = { maxDimension: 1000, maxBytes: 220 * 1024, minQuality: 0.35 };

export async function compressImage(source: Blob): Promise<CompressedImage> {
  return compressTo(source, ANALYZE_OPTIONS);
}

export async function compressImageForStorage(source: Blob): Promise<CompressedImage> {
  return compressTo(source, STORAGE_OPTIONS);
}

async function compressTo(source: Blob, { maxDimension, maxBytes, minQuality }: CompressOptions): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(source);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.8;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > maxBytes && quality > minQuality) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  console.log(
    `[compressImage] ${source.size} bytes -> ${blob.size} bytes (${width}x${height}, quality ${quality.toFixed(2)})`,
  );

  return { base64: await blobToBase64(blob), mediaType: 'image/jpeg' };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', quality);
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = () => reject(reader.error ?? new Error('file read failed'));
    reader.readAsDataURL(blob);
  });
}
