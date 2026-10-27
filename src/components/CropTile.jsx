import { useRef, useState } from "react";

const clamp = (v) => Math.min(100, Math.max(0, v));

// Foto yang bisa digeser untuk mengatur bagian yang masuk ke strip.
// pos = { x, y } dalam persen, sama seperti object-position.
export default function CropTile({ src, pos, onChange, label }) {
  const box = useRef(null);
  const drag = useRef(null);
  const [nat, setNat] = useState(null);

  // sisa ruang geser (px) pada tampilan saat ini
  const overflow = () => {
    const r = box.current.getBoundingClientRect();
    const s = Math.max(r.width / nat.w, r.height / nat.h);
    return { ox: nat.w * s - r.width, oy: nat.h * s - r.height };
  };

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, pos };
  };

  const move = (e) => {
    if (!drag.current || !nat) return;
    const { ox, oy } = overflow();
    const d = drag.current;
    onChange({
      x: ox > 1 ? clamp(d.pos.x - ((e.clientX - d.x) / ox) * 100) : d.pos.x,
      y: oy > 1 ? clamp(d.pos.y - ((e.clientY - d.y) / oy) * 100) : d.pos.y,
    });
  };

  const up = () => {
    drag.current = null;
  };

  const key = (e) => {
    const step = 5;
    const delta = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }[e.key];
    if (!delta) return;
    e.preventDefault();
    onChange({ x: clamp(pos.x + delta[0]), y: clamp(pos.y + delta[1]) });
  };

  return (
    <div
      ref={box}
      role="group"
      tabIndex={0}
      aria-label={`${label}. Drag or use the arrow keys to reframe.`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
      className="sketch relative aspect-[4/3] cursor-grab touch-none select-none overflow-hidden bg-ink active:cursor-grabbing"
    >
      <img
        src={src}
        alt=""
        draggable={false}
        onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
        className="pointer-events-none h-full w-full object-cover"
        style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
      />
    </div>
  );
}
