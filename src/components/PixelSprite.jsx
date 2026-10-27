import { useEffect, useState } from "react";

// Merender sprite berbasis teks menjadi SVG <rect> (satu rect per deret warna sama).
// Ukuran 1 piksel diatur lewat CSS variable --px, jadi mudah responsif.
export default function PixelSprite({ frames, palette, mul = 1, interval = 550, className = "", label }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), interval);
    return () => clearInterval(t);
  }, [frames.length, interval]);

  const rows = frames[i % frames.length];
  const w = Math.max(...rows.map((r) => r.length));
  const rects = [];
  rows.forEach((r, y) => {
    let x = 0;
    while (x < r.length) {
      const c = r[x];
      if (c === ".") {
        x++;
        continue;
      }
      let e = x;
      while (e < r.length && r[e] === c) e++;
      rects.push(<rect key={`${y}-${x}`} x={x} y={y} width={e - x} height={1} fill={palette[c]} />);
      x = e;
    }
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      style={{ width: `calc(var(--px, 4px) * ${w * mul})`, height: "auto" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block ${className}`}
    >
      {rects}
    </svg>
  );
}
