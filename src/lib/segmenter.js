import { getBackground } from "./backgrounds";

const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

let segPromise = null;

// Dimuat hanya saat pertama kali latar dipilih
export function getSegmenter() {
  if (!segPromise) {
    segPromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import(/* @vite-ignore */ `${CDN}/vision_bundle.mjs`);
      const fileset = await FilesetResolver.forVisionTasks(`${CDN}/wasm`);
      const make = (delegate) =>
        ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: "VIDEO",
          outputConfidenceMasks: true,
          outputCategoryMask: false,
        });
      try {
        return await make("GPU");
      } catch {
        return await make("CPU");
      }
    })();
    segPromise.catch(() => {
      segPromise = null;
    });
  }
  return segPromise;
}

const tmp = { person: null, mask: null };

// Gambar orang (dipotong dengan mask) di atas latar, hasilnya sudah dicerminkan
export function composite(video, mask, canvas, bgId, state) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d");
  tmp.person ||= document.createElement("canvas");
  tmp.mask ||= document.createElement("canvas");
  const p = tmp.person, mc = tmp.mask;
  if (p.width !== W || p.height !== H) {
    p.width = W;
    p.height = H;
  }

  const mw = mask.width, mh = mask.height;
  const data = mask.getAsFloat32Array();

  // Model bisa memberi nilai "orang" tinggi atau rendah: deteksi dari posisi
  // (tengah-bawah biasanya orang, pojok atas biasanya latar)
  const avg = (x0, x1, y0, y1) => {
    let s = 0, n = 0;
    for (let y = Math.floor(y0 * mh); y < y1 * mh; y += 4)
      for (let x = Math.floor(x0 * mw); x < x1 * mw; x += 4) {
        s += data[y * mw + x];
        n++;
      }
    return s / n;
  };
  const diff = avg(0.35, 0.65, 0.5, 0.9) - (avg(0, 0.2, 0, 0.2) + avg(0.8, 1, 0, 0.2)) / 2;
  if (Math.abs(diff) > 0.25) state.invert = diff < 0;

  if (mc.width !== mw || mc.height !== mh) {
    mc.width = mw;
    mc.height = mh;
  }
  const mctx = mc.getContext("2d");
  const img = mctx.createImageData(mw, mh);
  const d = img.data;
  for (let i = 0; i < data.length; i++) {
    let v = state.invert ? 1 - data[i] : data[i];
    v = Math.min(1, Math.max(0, (v - 0.35) / 0.3)); // tepi agak halus
    d[i * 4 + 3] = v * 255;
  }
  mctx.putImageData(img, 0, 0);

  // crop 4:3 dari video
  const vw = video.videoWidth, vh = video.videoHeight;
  const r = W / H;
  let sx = 0, sy = 0, sw = vw, sh = vh;
  if (sw / sh > r) {
    sw = sh * r;
    sx = (vw - sw) / 2;
  } else {
    sh = sw / r;
    sy = (vh - sh) / 2;
  }

  const pc = p.getContext("2d");
  pc.globalCompositeOperation = "source-over";
  pc.clearRect(0, 0, W, H);
  pc.save();
  pc.translate(W, 0);
  pc.scale(-1, 1);
  pc.drawImage(video, sx, sy, sw, sh, 0, 0, W, H);
  pc.globalCompositeOperation = "destination-in";
  pc.drawImage(mc, (sx * mw) / vw, (sy * mh) / vh, (sw * mw) / vw, (sh * mh) / vh, 0, 0, W, H);
  pc.restore();

  ctx.drawImage(getBackground(bgId, W, H), 0, 0);
  ctx.drawImage(p, 0, 0);
}
