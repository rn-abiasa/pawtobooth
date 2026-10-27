import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePaw } from "../state";
import usePageTitle from "../lib/usePageTitle";

export default function Result() {
  const nav = useNavigate();
  const { strip, reset } = usePaw();
  usePageTitle("Your photo strip is ready · Pawtobooth");
  const [note, setNote] = useState("");

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
