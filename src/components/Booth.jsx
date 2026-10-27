import { Link } from "react-router-dom";
import Cat from "./Cat";

const STRIPS = ["#E8522B", "#4A8FE0", "#F4A6B8", "#F5C842", "#2A2A2A"];

export default function Booth() {
  return (
    <div
      className="booth relative"
      style={{
        aspectRatio: "420/440",
        width: "min(100%, 520px, calc(76dvh * 0.955))",
      }}
    >
      <svg
        viewBox="0 0 420 440"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Doodle photobooth with two cats"
      >
        <defs>
          <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="3.5" />
          </filter>
        </defs>
        <g
          filter="url(#wobble)"
          stroke="#2A2A2A"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <g transform="translate(8 0)">
            {/* kucing hitam di atas papan */}
            <g transform="translate(210 14.5) scale(.9)">
              <Cat tuxedo />
            </g>

            {/* papan nama */}
            <path d="M90 156v16M270 156v16" fill="none" />
            <rect x="40" y="100" width="280" height="56" rx="6" fill="#F5C842" />
            <text
              x="180"
              y="140"
              textAnchor="middle"
              fontFamily="Gaegu, cursive"
              fontWeight="700"
              fontSize="42"
              letterSpacing="3"
              fill="#2A2A2A"
              stroke="none"
            >
              PAWTOBOOTH
            </text>

            {/* badan booth */}
            <rect x="20" y="172" width="320" height="262" rx="10" fill="#E8522B" />
            <path d="M20 190h320" fill="none" />

            {/* etalase strip pilihan */}
            <rect x="40" y="200" width="152" height="116" rx="4" fill="#FBF3DC" />
            {STRIPS.map((c, i) => (
              <g key={c} transform={`rotate(${[-3, 2, -1, 3, -2][i]} ${60 + i * 28} 258)`}>
                <rect x={50 + i * 28} y="212" width="20" height="92" fill={c} strokeWidth="2.5" />
                {[0, 1, 2, 3].map((r) => (
                  <rect
                    key={r}
                    x={52 + i * 28}
                    y={215 + r * 22}
                    width="16"
                    height="19"
                    fill="#FBF3DC"
                    stroke="none"
                    opacity=".85"
                  />
                ))}
              </g>
            ))}

            {/* lampu open */}
            <rect x="50" y="334" width="62" height="24" rx="4" fill="#2A2A2A" />
            <text
              x="81"
              y="352"
              textAnchor="middle"
              className="blink"
              fontFamily="Gaegu, cursive"
              fontWeight="700"
              fontSize="20"
              fill="#F5C842"
              stroke="none"
            >
              open
            </text>

            {/* slot foto keluar */}
            <rect x="50" y="374" width="104" height="14" rx="3" fill="#2A2A2A" />
            <rect x="44" y="388" width="116" height="34" rx="5" fill="#FBF3DC" />

            {/* tirai */}
            <line x1="212" y1="196" x2="296" y2="196" />
            <g className="curtain">
              <rect x="216" y="198" width="76" height="196" fill="#4A8FE0" />
              <path
                d="M238 200c-8 50 8 90-2 192M258 200c6 60-8 100 2 192M278 200c-6 50 6 90-2 192"
                fill="none"
                strokeWidth="3"
              />
            </g>
            <ellipse cx="254" cy="404" rx="32" ry="9" fill="#F5C842" />
            <path d="M246 412v18M262 412v18" fill="none" />

            {/* cermin */}
            <rect x="304" y="200" width="26" height="112" rx="3" fill="#CFE3F7" />
            <path d="M312 214l9-5M312 298l9-5" fill="none" strokeWidth="3" />
          </g>

          {/* kucing oranye di samping booth */}
          <g transform="translate(322 358) scale(.8)">
            <Cat tone="#F59B5B" eye="#2A2A2A" />
          </g>
        </g>
      </svg>

      <Link
        to="/studio"
        className="sketch pop absolute grid place-items-center bg-butter font-hand font-bold"
        style={{
          left: "62.4%",
          top: "64%",
          width: "23%",
          height: "11%",
          transform: "translate(-50%,-50%)",
          fontSize: "clamp(1.05rem, 4.6vw, 1.7rem)",
        }}
      >
        enter
      </Link>
    </div>
  );
}
