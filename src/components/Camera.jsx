import { useEffect, useRef, useState } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Camera({ onDone, onCancel }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const alive = useRef(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(null);
  const [flash, setFlash] = useState(false);
  const [shots, setShots] = useState(0);

  useEffect(() => {
    alive.current = true;
    const req = navigator.mediaDevices?.getUserMedia
      ? navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        })
      : Promise.reject(new Error("no camera"));

    req
      .then((s) => {
        if (!alive.current) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        videoRef.current.srcObject = s;
        setReady(true);
      })
      .catch(() =>
        setError("Kamera tidak bisa dibuka. Izinkan akses kamera di browser, atau pakai upload foto."),
      );

    return () => {
      alive.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const snap = () => {
    const v = videoRef.current;
    const r = 4 / 3;
    let sw = v.videoWidth, sh = v.videoHeight, sx = 0, sy = 0;
    if (sw / sh > r) {
      const w = sh * r;
      sx = (sw - w) / 2;
      sw = w;
    } else {
      const h = sw / r;
      sy = (sh - h) / 2;
      sh = h;
    }
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 600;
    const x = c.getContext("2d");
    x.translate(800, 0);
    x.scale(-1, 1); // cermin, sama seperti preview
    x.drawImage(v, sx, sy, sw, sh, 0, 0, 800, 600);
    return c.toDataURL("image/jpeg", 0.92);
  };

  const start = async () => {
    if (busy) return;
    setBusy(true);
    const got = [];
    for (let i = 0; i < 4; i++) {
      for (let n = 3; n > 0; n--) {
        setCount(n);
        await sleep(1000);
        if (!alive.current) return;
      }
      setCount(null);
      setFlash(true);
      got.push(snap());
      setShots(got.length);
      await sleep(250);
      setFlash(false);
      await sleep(500);
      if (!alive.current) return;
    }
    onDone(got);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center gap-4 overflow-y-auto bg-wall px-4 py-5">
      <div className="flex w-full max-w-lg items-center justify-between font-hand text-2xl font-bold">
        <button type="button" onClick={onCancel} className="min-h-11 px-1">
          ← batal
        </button>
        <span>foto {Math.min(shots + 1, 4)}/4</span>
      </div>

      <div className="sketch pop relative aspect-[4/3] w-full max-w-lg overflow-hidden bg-ink">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full -scale-x-100 object-cover"
        />
        {count && (
          <div
            aria-live="assertive"
            className="absolute inset-0 grid place-items-center font-hand text-[8rem] font-bold text-paper drop-shadow-[4px_4px_0_#2A2A2A]"
          >
            {count}
          </div>
        )}
        {flash && <div className="absolute inset-0 bg-white" />}
      </div>

      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-3 w-8 rounded-full border-[3px] border-ink ${i < shots ? "bg-booth" : "bg-paper"}`}
          />
        ))}
      </div>

      {error ? (
        <div className="flex w-full max-w-lg flex-col gap-3 text-center">
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={onCancel}
            className="sketch pop h-14 bg-butter font-hand text-3xl font-bold"
          >
            kembali
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!ready || busy}
          onClick={start}
          className="sketch pop h-16 w-full max-w-lg bg-butter font-hand text-4xl font-bold disabled:opacity-50"
        >
          {busy ? "senyum…" : "mulai foto"}
        </button>
      )}
    </div>
  );
}
