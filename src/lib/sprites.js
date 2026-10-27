// Sprite pixel art ditulis sebagai teks: 1 karakter = 1 piksel, "." = transparan.

const rep = (c, n) => c.repeat(n);
const set = (rows, pts, ch) =>
  rows.map((r, y) => [...r].map((c, x) => (pts.some(([py, px]) => py === y && px === x) ? ch : c)).join(""));
const recolor = (rows, map) => rows.map((r) => [...r].map((c) => map[c] ?? c).join(""));

/* ---------- kucing (18 x 13) ---------- */
const CAT = [
  "..KK........KK....",
  "..KKK......KKK....",
  "..KKKKKKKKKKKK....",
  ".KKKKKKKKKKKKKK...",
  ".KKYYKKKKKKYYKK...",
  ".KKKKKKPPKKKKKK...",
  ".KKKKKKWWKKKKKK...",
  "..KKKKKKKKKKKK....",
  ".KKKKKKWWKKKKKK...",
  ".KKKKKKWWKKKKKKK..",
  ".KKKKKKKKKKKKKKKK.",
  ".KKKKKKKKKKKKKKKK.",
  ".KKWWKKKKKKWWKKKK.",
];
const TAIL_A = [[4, 17], [5, 17], [6, 17], [7, 17], [8, 16], [9, 16]];
const TAIL_B = [[8, 16], [8, 17], [9, 16], [9, 17], [10, 17]];

export const BLACK_CAT = [set(CAT, TAIL_A, "K"), set(CAT, TAIL_B, "K")];
export const BLACK_CAT_PALETTE = { K: "#4a3b4a", W: "#f7efe2", Y: "#f2d16b", P: "#e8a0a8" };

const ORANGE = set(recolor(CAT, { K: "O", W: "L", Y: "E" }), [[2, 6], [2, 9], [3, 7], [3, 8]], "D");
export const ORANGE_CAT = [set(ORANGE, TAIL_A, "O"), set(ORANGE, TAIL_B, "O")];
export const ORANGE_CAT_PALETTE = { O: "#e8985a", L: "#f6dcae", E: "#4a3b4a", D: "#c4703a", P: "#e8a0a8" };

/* ---------- photobooth (22 x 19) ---------- */
export const BOOTH = [[
  "....SSSSSSSSSSSSSS....",
  "....SYSYSYSYSYSYSY....",
  "...bbbbbbbbbbbbbbbb...",
  "...BBBBBBBBBBBBBBBB...",
  "...BggggggggBBCCCCB...",
  "...BgrgygugpBBCCCCB...",
  "...BgrgygugpBBCCCCB...",
  "...BgrgygugpBBCCCCB...",
  "...BgrgygugpBBCCCCB...",
  "...BggggggggBBCCCCB...",
  "...BBBBBBBBBBBCCCCB...",
  "...BBLLBBBBBBBCCCCB...",
  "...BBBBBBBBBBBCCCCB...",
  "...BBBBBBBBBBBCCCCB...",
  "...BBDDDDDDBBBCCCCB...",
  "...BBbbbbbbBBBCCCCB...",
  "...BBBBBBBBBBBCCCCB...",
  "...BBBBBBBBBBBBBBBB...",
  "...bbbbbbbbbbbbbbbb...",
]];
export const BOOTH_PALETTE = {
  S: "#e0907a", Y: "#f9e7a0", b: "#a89fd0", B: "#cfc8ea", g: "#fdf3e1",
  r: "#e56f5e", y: "#f2d16b", u: "#7da7d9", p: "#e8a0a8", C: "#6f86b8",
  L: "#f2d16b", D: "#4a3b4a",
};

/* ---------- bangku (24 x 8) ---------- */
const LEG = "." + "bb" + rep(".", 18) + "bb" + ".";
export const BENCH = [[rep("B", 24), rep("b", 24), rep("B", 24), rep("b", 24), LEG, LEG, LEG, LEG]];
export const BENCH_PALETTE = { B: "#a9765a", b: "#7f5440" };

/* ---------- kerucut jalan (8 x 8) ---------- */
export const CONE = [[
  "...OO...",
  "..OOOO..",
  "..WWWW..",
  ".OOOOOO.",
  ".WWWWWW.",
  ".OOOOOO.",
  "OOOOOOOO",
  "DDDDDDDD",
]];
export const CONE_PALETTE = { O: "#e8985a", W: "#f7efe2", D: "#6b5a6e" };
