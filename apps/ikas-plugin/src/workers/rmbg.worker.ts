import { pipeline, env, type ImageSegmentationPipeline, type RawImage } from "@huggingface/transformers";

// Run model in browser, no server download
env.allowLocalModels = false;

let segmenter: ImageSegmentationPipeline | null = null;

async function getSegmenter(): Promise<ImageSegmentationPipeline> {
  if (!segmenter) {
    segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
      device: "webgpu",
    }) as ImageSegmentationPipeline;
  }
  return segmenter;
}

self.onmessage = async (e: MessageEvent<{ id: string; imageUrl: string }>) => {
  const { id, imageUrl } = e.data;
  try {
    const seg = await getSegmenter();
    const result = await seg(imageUrl, { threshold: 0.5 });

    // RMBG-1.4 returns a single foreground mask as RawImage
    const item = Array.isArray(result) ? result[0] : result;
    const rawMask = (item as { mask: RawImage }).mask;

    // Fetch original image to composite with mask
    const imgResp = await fetch(imageUrl);
    const imgBlob = await imgResp.blob();
    const imgBitmap = await createImageBitmap(imgBlob);

    // Draw original onto canvas
    const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgBitmap, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert RawImage mask to ImageData via canvas
    const maskCanvas = new OffscreenCanvas(rawMask.width, rawMask.height);
    const maskCtx = maskCanvas.getContext("2d")!;
    // RawImage has Uint8ClampedArray `data` (grayscale single channel)
    const maskRgba = new Uint8ClampedArray(rawMask.width * rawMask.height * 4);
    const src = rawMask.data as Uint8ClampedArray;
    for (let i = 0; i < src.length; i++) {
      const v = src[i];
      maskRgba[i * 4]     = v;
      maskRgba[i * 4 + 1] = v;
      maskRgba[i * 4 + 2] = v;
      maskRgba[i * 4 + 3] = 255;
    }
    maskCtx.putImageData(new ImageData(maskRgba, rawMask.width, rawMask.height), 0, 0);

    // Scale mask to image size
    const scaledMaskCanvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
    const scaledCtx = scaledMaskCanvas.getContext("2d")!;
    scaledCtx.drawImage(maskCanvas, 0, 0, imgBitmap.width, imgBitmap.height);
    const scaledMask = scaledCtx.getImageData(0, 0, imgBitmap.width, imgBitmap.height);

    // Apply mask: red channel of scaled mask → alpha of original image
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i + 3] = scaledMask.data[i];
    }

    ctx.putImageData(imgData, 0, 0);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    self.postMessage({ id, blob });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
