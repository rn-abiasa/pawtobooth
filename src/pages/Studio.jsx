import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePaw } from "../state";
import { FRAMES } from "../lib/frames";
import StripPreview from "../components/StripPreview";
import Camera from "../components/Camera";
import { CatSvg } from "../components/Cat";
import usePageTitle from "../lib/usePageTitle";

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#2A2A2A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

const STEPS = [
  "Pick b&w or color with the lever.",
  "Pick a frame with the left and right arrows.",
  "Press start, then take photos or upload 4.",
];

export default function Studio() {
  const nav = useNavigate();
  const { frame, setFrame, bw, setBw, setPhotos } = usePaw();
  usePageTitle("Studio – Pick a Frame · Pawtobooth");
  const [sheet, setSheet] = useState(false);
  const [cam, setCam] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);
  const f = FRAMES[frame];

  const step = (d) => setFrame((frame + d + FRAMES.length) % FRAMES.length);
  const finish = (list) => {
    setPhotos(list);
    nav("/print");
  };
  const onFiles = (e) => {
    const files = [...e.target.files].filter((x) => x.type.startsWith("image/"));
    e.target.value = "";
    if (files.length < 4) {
      setMsg("Pick 4 photos at once.");
      return;
    }
    finish(files.slice(0, 4).map((x) => URL.createObjectURL(x)));
  };

  useEffect(() => {
    if (!sheet) return;
    const k = (e) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [sheet]);

  if (cam) return <Camera onDone={finish} onCancel={() => setCam(false)} />;

  return (
    <main className="tiles min-h-dvh px-4 pb-10 pt-4 md:flex md:items-center">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex min-h-11 items-center font-hand text-2xl font-bold">
            ← exit
          </Link>
          <CatSvg className="h-12 w-12" tuxedo />
        </header>

        <div className="mt-2 grid gap-6 md:grid-cols-2 md:gap-10">
          {/* layar mesin */}
          <section className="sketch bg-booth p-3 shadow-[5px_5px_0_#2A2A2A]">
            <div className="sketch bg-paper px-2 py-5">
              <div className="flex items-center justify-between gap-1">
                <button type="button" aria-label="Previous frame" onClick={() => step(-1)} className="sketch pop grid h-12 w-12 shrink-0 place-items-center bg-wall">
                  <Chevron dir="l" />
                </button>
                <StripPreview frame={f} bw={bw} className="h-[22rem] sm:h-[26rem]" />
                <button type="button" aria-label="Next frame" onClick={() => step(1)} className="sketch pop grid h-12 w-12 shrink-0 place-items-center bg-wall">
                  <Chevron dir="r" />
                </button>
              </div>
              <p className="mt-4 text-center font-hand text-2xl font-bold" aria-live="polite">
                frame {f.name}
              </p>
              <div className="mt-2 flex justify-center gap-2" aria-hidden="true">
                {FRAMES.map((x, i) => (
                  <span key={x.id} className={`h-3 w-3 rounded-full border-2 border-ink ${i === frame ? "bg-ink" : "bg-paper"}`} />
                ))}
              </div>
            </div>
          </section>

          {/* kontrol */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-3 font-hand text-3xl font-bold">
              <span className={bw ? "" : "opacity-50"}>b&amp;w</span>
              <button
                type="button"
                role="switch"
                aria-checked={!bw}
                aria-label="Color filter"
                onClick={() => setBw(!bw)}
                className="sketch pop relative h-12 w-24 bg-paper"
              >
                <span
                  className={`absolute top-1 h-9 w-9 rounded-full border-[3px] border-ink bg-butter transition-all ${bw ? "left-1" : "left-[calc(100%-2.5rem)]"}`}
                />
              </button>
              <span className={bw ? "opacity-50" : ""}>color</span>
            </div>

            <ol className="sketch flex flex-col gap-3 bg-paper p-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="font-hand text-3xl font-bold leading-none text-booth">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => {
                setMsg("");
                setSheet(true);
              }}
              className="sketch pop h-16 bg-butter font-hand text-4xl font-bold"
            >
              start
            </button>
          </section>
        </div>
      </div>

      {sheet && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 p-3 sm:items-center"
          onClick={() => setSheet(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose photo source"
            className="sketch flex w-full max-w-sm flex-col gap-3 bg-paper p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-hand text-3xl font-bold">where are the photos from?</h2>
            <button
              type="button"
              onClick={() => {
                setSheet(false);
                setCam(true);
              }}
              className="sketch pop h-14 bg-butter font-hand text-3xl font-bold"
            >
              open camera
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="sketch pop h-14 bg-bubble font-hand text-3xl font-bold"
            >
              upload 4 photos
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
            {msg && (
              <p role="alert" className="text-center text-booth">
                {msg}
              </p>
            )}
            <button type="button" onClick={() => setSheet(false)} className="min-h-11 font-hand text-2xl font-bold">
              cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
