import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePaw } from "../state";
import { FRAMES } from "../lib/frames";
import { composeStrip } from "../lib/strip";
import CropTile from "../components/CropTile";
import usePageTitle from "../lib/usePageTitle";

export default function Result() {
  const nav = useNavigate();
  const { strip, setStrip, reset, photos, frame, bw, source, crops, setCrops } = usePaw();
  usePageTitle("Your photo strip is ready · Pawtobooth");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const lastCrops = useRef(crops);

  const canEdit = source === "upload" && photos.length === 4;

  // susun ulang strip setiap kali posisi foto digeser
  useEffect(() => {
    if (crops === lastCrops.current || !photos.length) return;
    lastCrops.current = crops;
    let dead = false;
    const t = setTimeout(() => {
      composeStrip(photos, FRAMES[frame], bw, crops)
        .then((u) => !dead && setStrip(u))
        .catch(() => {});
    }, 150);
    return () => {
      dead = true;
      clearTimeout(t);
    };
  }, [crops, photos, frame, bw, setStrip]);

  if (!strip) return <Navigate to="/" replace />;

  const download = () => {
    const a = document.createElement("a");
    a.href = strip;
    a.download = "pawtobooth-strip.png";
    a.click();
  };

  const share = async () => {
    try {
      const blob = await (await fetch(strip)).blob();
      const file = new File([blob], "pawtobooth-strip.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "pawtobooth" });
      } else {
        download();
        setNote("Sharing isn't supported on this device, so the strip was downloaded instead.");
      }
    } catch (e) {
      if (e.name !== "AbortError") setNote("Couldn't share. Download the strip and send it manually.");
    }
  };

  const go = (to) => {
    reset();
    nav(to);
  };

  const setCrop = (i, pos) => setCrops((list) => list.map((p, j) => (j === i ? pos : p)));
  const resetCrops = () => setCrops(crops.map(() => ({ x: 50, y: 50 })));

  if (editing) {
    return (
      <main className="tiles min-h-dvh px-4 py-6">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          <h1 className="font-hand text-4xl font-bold">Drag to reframe</h1>
          <p className="text-sm">
            Move each photo so nobody&apos;s head gets cut off. You can also use the arrow keys.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((src, i) => (
              <CropTile
                key={src}
                src={src}
                pos={crops[i]}
                onChange={(pos) => setCrop(i, pos)}
                label={`Photo ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetCrops}
              className="sketch pop h-14 flex-1 bg-paper font-hand text-2xl font-bold"
            >
              reset
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="sketch pop h-14 flex-1 bg-butter font-hand text-2xl font-bold"
            >
              done
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="tiles flex min-h-dvh items-center px-4 py-8">
      <div className="mx-auto grid w-full max-w-3xl items-center gap-8 md:grid-cols-2">
        <img
          src={strip}
          alt="Your photo strip"
          className="mx-auto w-auto max-w-full -rotate-2 border-[3px] border-ink shadow-[6px_6px_0_#2A2A2A]"
          style={{ maxHeight: "min(58dvh, 560px)" }}
        />

        <div className="flex flex-col gap-3">
          <h1 className="font-hand text-4xl font-bold">Your strip is ready</h1>
          <button type="button" onClick={download} className="sketch pop h-16 bg-butter font-hand text-3xl font-bold">
            download
          </button>
          <button type="button" onClick={share} className="sketch pop h-16 bg-bubble font-hand text-3xl font-bold">
            share
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="sketch pop h-14 bg-paper font-hand text-2xl font-bold"
            >
              adjust photos
            </button>
          )}
          <button type="button" onClick={() => go("/studio")} className="sketch pop h-14 bg-paper font-hand text-2xl font-bold">
            take another
          </button>
          <button type="button" onClick={() => go("/")} className="min-h-11 font-hand text-2xl font-bold">
            ← back to start
          </button>
          {note && (
            <p role="status" className="text-sm">
              {note}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
