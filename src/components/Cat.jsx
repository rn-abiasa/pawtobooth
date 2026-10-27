const INK = "#2A2A2A";

// Kucing duduk, koordinat lokal 0-100. Dipakai di dalam <svg>.
export default function Cat({ tone = INK, tuxedo = false, eye = "#F5C842" }) {
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
      <g className="tail" fill="none">
        <path d="M78 92c18 2 22-14 16-30" strokeWidth="13" />
        <path d="M78 92c18 2 22-14 16-30" stroke={tone} strokeWidth="5" />
      </g>
      <ellipse cx="50" cy="74" rx="33" ry="22" fill={tone} />
      <path d="M28 30 L31 4 L48 18 Z M72 30 L69 4 L52 18 Z" fill={tone} />
      <ellipse cx="50" cy="42" rx="26" ry="22" fill={tone} />
      {tuxedo && <ellipse cx="50" cy="58" rx="9" ry="7" fill="#fff" stroke="none" />}
      <circle cx="40" cy="42" r="5" fill={eye} stroke="none" />
      <circle cx="60" cy="42" r="5" fill={eye} stroke="none" />
      <circle cx="40" cy="42" r="2.2" fill={INK} stroke="none" />
      <circle cx="60" cy="42" r="2.2" fill={INK} stroke="none" />
      <path d="M47 50h6l-3 3z" fill="#F4A6B8" strokeWidth="2" />
      <path d="M30 51l-12-2M30 56l-12 3M70 51l12-2M70 56l12 3" fill="none" strokeWidth="2.5" />
      <ellipse cx="38" cy="92" rx="8" ry="5" fill={tone} />
      <ellipse cx="62" cy="92" rx="8" ry="5" fill={tone} />
    </g>
  );
}

export function CatSvg({ className = "", ...props }) {
  return (
    <svg viewBox="-4 0 112 100" className={className} aria-hidden="true">
      <Cat {...props} />
    </svg>
  );
}
