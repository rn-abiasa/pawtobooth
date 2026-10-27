import { Link } from "react-router-dom";
import PixelSprite from "../components/PixelSprite";
import {
  BLACK_CAT, BLACK_CAT_PALETTE, ORANGE_CAT, ORANGE_CAT_PALETTE,
  BOOTH, BOOTH_PALETTE, BENCH, BENCH_PALETTE, CONE, CONE_PALETTE,
} from "../lib/sprites";

const INK = "#4a3b4a";
const pixelBorder = `0 -4px 0 0 ${INK}, 0 4px 0 0 ${INK}, -4px 0 0 0 ${INK}, 4px 0 0 0 ${INK}`;

// Halaman pratinjau saja: gaya visual aplikasi lain belum diubah.
export default function PixelPreview() {
  return (
    <main className="min-h-dvh bg-[#efe3d3] px-0 pb-10">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex min-h-11 items-center font-hand text-2xl font-bold">
          ← kembali
        </Link>
        <p className="font-hand text-xl">pratinjau gaya pixel</p>
      </div>

      {/* scene */}
      <div className="[--px:4px] sm:[--px:6px]">
        <div
          className="flex items-end justify-center gap-2 px-3 pt-28 sm:gap-10"
          style={{
            backgroundColor: "#ecdcc8",
            backgroundImage:
              "linear-gradient(rgba(120,90,100,.13) 2px,transparent 2px),linear-gradient(90deg,rgba(120,90,100,.13) 2px,transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        >
          <PixelSprite frames={BENCH} palette={BENCH_PALETTE} className="hidden sm:block" />

          <div className="relative">
            <PixelSprite frames={BOOTH} palette={BOOTH_PALETTE} mul={2} label="Photobooth pixel" />
            <div className="absolute bottom-full right-[18%]">
              <PixelSprite frames={BLACK_CAT} palette={BLACK_CAT_PALETTE} label="Kucing hitam" />
            </div>
          </div>

          <PixelSprite frames={ORANGE_CAT} palette={ORANGE_CAT_PALETTE} interval={700} label="Kucing oranye" />
          <PixelSprite frames={CONE} palette={CONE_PALETTE} className="mb-0" />
        </div>
        <div className="h-3 bg-[#e0b86a]" />
        <div className="h-14 border-t-4 border-[#a89fa9] bg-[#cfc6cf]" />
      </div>

      {/* contoh komponen UI */}
      <section className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6 px-6">
        <button
          type="button"
          className="px-8 py-3 font-hand text-3xl font-bold transition-transform active:translate-y-1"
          style={{
            background: "#f2d16b",
            color: INK,
            boxShadow: `${pixelBorder}, inset 0 -6px 0 0 rgba(0,0,0,.14), 0 10px 0 0 #b89a52`,
          }}
        >
          enter
        </button>
        <p
          className="w-full bg-[#fdf3e1] p-4 text-center"
          style={{ color: INK, boxShadow: `${pixelBorder}, 8px 8px 0 0 rgba(74,59,74,.25)` }}
        >
          Panel dan tombol memakai border bertangga (box-shadow) tanpa gambar. Sprite digambar dari teks.
        </p>
      </section>
    </main>
  );
}
