// Latar tirai digambar lewat canvas, tanpa aset gambar
export const BACKGROUNDS = [
  { id: "none", name: "original", swatch: "#FBF3DC" },
  { id: "biru", name: "blue curtain", swatch: "#3B76B8", colors: ["#1B3D66", "#3B76B8"] },
  { id: "merah", name: "red curtain", swatch: "#B3293A", colors: ["#5E0F1A", "#B3293A"] },
  { id: "krim", name: "cream curtain", swatch: "#F2E5BF", colors: ["#CDB98A", "#F2E5BF"] },
  { id: "pink", name: "pink curtain", swatch: "#F9C6D3", colors: ["#E88FA5", "#F9C6D3"] },
];

const cache = new Map();

export function getBackground(id, W, H) {
  const key = `${id}-${W}x${H}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const [dark, light] = BACKGROUNDS.find((b) => b.id === id).colors;

  const folds = 9;
  const fw = W / folds;
  for (let i = 0; i < folds; i++) {
    const g = ctx.createLinearGradient(i * fw, 0, (i + 1) * fw, 0);
    g.addColorStop(0, dark);
    g.addColorStop(0.5, light);
    g.addColorStop(1, dark);
    ctx.fillStyle = g;
    ctx.fillRect(i * fw, 0, fw + 1, H);
  }
  // bayangan lembut di atas dan bawah
  const v = ctx.createLinearGradient(0, 0, 0, H);
  v.addColorStop(0, "rgba(0,0,0,.35)");
  v.addColorStop(0.35, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,.15)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  cache.set(key, c);
  return c;
}
