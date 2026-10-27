import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePaw } from "../state";
import { FRAMES } from "../lib/frames";
import { composeStrip } from "../lib/strip";
import { CatSvg } from "../components/Cat";
import usePageTitle from "../lib/usePageTitle";

const H = "min(48dvh, 500px)";

export default function Print() {
  const nav = useNavigate();
  const { photos, frame, bw, crops, strip, setStrip } = usePaw();
  const [done, setDone] = useState(false);
  usePageTitle("Printing your strip… · Pawtobooth");

  useEffect(() => {
    if (!photos.length) return;
    let dead = false;
    composeStrip(photos, FRAMES[frame], bw, crops)
      .then((u) => !dead && setStrip(u))
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [photos, frame, bw, crops, setStrip]);

  if (!photos.length) return <Navigate to="/studio" replace />;

  return (
    <main className="tiles flex min-h-dvh flex-col items-center px-4 pb-8 pt-20">
      <div className="w-full max-w-xs">
        {/* kepala mesin + slot */}
        <div className="sketch relative bg-booth px-4 pb-5 pt-4 text-center shadow-[5px_5px_0_#2A2A2A]">
          <CatSvg className="absolute -top-[4.4rem] right-5 w-24" tuxedo />
          <p className="font-hand text-3xl font-bold text-paper" aria-live="polite">
            {done ? "all done!" : "printing…"}
          </p>
          <div className="mx-auto mt-3 h-4 w-44 rounded-full border-[3px] border-ink bg-ink" />
        </div>

        {/* strip meluncur keluar dari slot */}
        <div
          className="-mt-2 flex justify-center overflow-hidden"
          style={{ height: H }}
        >
          {strip && (
            <img
              src={strip}
              alt="Your photo strip"
              className="eject h-full w-auto max-w-none border-x-[3px] border-b-[3px] border-ink"
              onAnimationEnd={() => setDone(true)}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-xs flex-col items-center gap-4">
        <CatSvg className={`w-16 ${done ? "hop" : ""}`} tone="#F59B5B" eye="#2A2A2A" />
        <button
          type="button"
          disabled={!done}
          onClick={() => nav("/result")}
          className="sketch pop h-16 w-full bg-butter font-hand text-4xl font-bold disabled:opacity-40"
        >
          take your strip
        </button>
      </div>
    </main>
  );
}
