import { useEffect, useRef, useState } from "react";
import { BACKGROUNDS } from "../lib/backgrounds";
import { composite, getSegmenter } from "../lib/segmenter";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CW = 720, CH = 540;

export default function Camera({ onDone, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const alive = useRef(true);
  const bgRef = useRef("none");
  const maskState = useRef({ invert: false });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(null);
  const [flash, setFlash] = useState(false);
  const [shots, setShots] = useState(0);
  const [bg, setBg] = useState("none");
  const [segReady, setSegReady] = useState(false);
  const [bgNote, setBgNote] = useState("");

  bgRef.current = bg;
  const showCanvas = bg !== "none" && segReady;
  const loadingBg = bg !== "none" && !segReady;

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
        setError("Camera can't be opened. Allow camera access in your browser, or upload photos instead."),
      );

    return () => {
      alive.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // loop segmentasi: aktif hanya saat latar dipilih
  useEffect(() => {
    if (!ready || bg === "none") return;
    let dead = false;
    let raf = 0;
    let last = -1;

    getSegmenter()
      .then((seg) => {
        if (dead) return;
        setSegReady(true);
        const loop = () => {
          if (dead) return;
          const v = videoRef.current;
          const cv = canvasRef.current;
          if (v && cv && v.readyState >= 2 && v.videoWidth && v.currentTime !== last) {
            last = v.currentTime;
            try {
              seg.segmentForVideo(v, performance.now(), (res) => {
                const m = res.confidenceMasks[res.confidenceMasks.length - 1];
                composite(v, m, cv, bgRef.current, maskState.current);
              });
            } catch {
              /* lewati frame yang gagal */
            }
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      })
      .catch(() => {
        if (dead) return;
        setBgNote("Couldn't load the backgrounds. Check your internet connection and try again.");
        setBg("none");
      });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
    };
  }, [ready, bg]);

  const pickBg = (id) => {
    setBgNote("");
    setBg(id);
  };

  const snap = () => {
    if (bgRef.current !== "none" && canvasRef.current && segReady) {
      return canvasRef.current.toDataURL("image/jpeg", 0.92); // sudah dicerminkan
    }
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
          ← cancel
        </button>
        <span>photo {Math.min(shots + 1, 4)}/4</span>
      </div>

      <div className="sketch pop relative aspect-[4/3] w-full max-w-lg overflow-hidden bg-ink">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full -scale-x-100 object-cover ${showCanvas ? "opacity-0" : ""}`}
        />
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className={`absolute inset-0 h-full w-full ${showCanvas ? "" : "hidden"}`}
        />
        {loadingBg && (
          <p role="status" className="absolute inset-x-0 bottom-2 text-center font-hand text-xl font-bold text-paper drop-shadow-[2px_2px_0_#2A2A2A]">
            loading background…
          </p>
        )}
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

      {!error && (
        <div className="w-full max-w-lg">
          <div className="flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="Background">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={bg === b.id}
                disabled={busy}
                onClick={() => pickBg(b.id)}
                className={`sketch pop flex h-11 shrink-0 items-center gap-2 px-3 font-hand text-xl font-bold disabled:opacity-50 ${bg === b.id ? "bg-butter" : "bg-paper"}`}
              >
                <span className="h-4 w-4 rounded-full border-2 border-ink" style={{ background: b.swatch }} />
                {b.name}
              </button>
            ))}
          </div>
          {bgNote && (
            <p role="alert" className="mt-1 text-center text-sm text-booth">
              {bgNote}
            </p>
          )}
        </div>
      )}

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
            back
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!ready || busy || loadingBg}
          onClick={start}
          className="sketch pop h-16 w-full max-w-lg bg-butter font-hand text-4xl font-bold disabled:opacity-50"
        >
          {busy ? "smile…" : "start shooting"}
        </button>
      )}
    </div>
  );
}
