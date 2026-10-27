import { useEffect, useState } from "react";
import { composePreview } from "../lib/strip";

// Pratinjau dirender dengan kode yang sama seperti hasil akhir (WYSIWYG)
export default function StripPreview({ frame, bw, className = "" }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let dead = false;
    composePreview(frame, bw)
      .then((u) => !dead && setSrc(u))
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [frame, bw]);

  return (
    <div className={`flex justify-center ${className}`}>
      {src && (
        <img
          src={src}
          alt={`Pratinjau frame ${frame.name}`}
          className="h-full w-auto border-[3px] border-ink shadow-[4px_4px_0_#2A2A2A]"
        />
      )}
    </div>
  );
}
