const W = 600;
const INK = "#2A2A2A";
const RED = "#B8272D";
const NAVY = "#1F2F5C";
const MONO = "ui-monospace, Menlo, Consolas, monospace";
const SERIF = 'Georgia, "Times New Roman", serif';
const HAND = 'Gaegu, "Comic Sans MS", cursive';

// pad: jarak kiri-kanan slot, inset: ruang bingkai di sekeliling foto
const SPEC = {
  solid: { pad: 40, inset: 0, gap: 24, head: 40, foot: 150 },
  ticket: { pad: 56, inset: 0, gap: 22, head: 270, foot: 170 },
  boarding: { pad: 44, inset: 0, gap: 20, head: 290, foot: 170 },
  stamp: { pad: 30, inset: 24, gap: 18, head: 90, foot: 190 },
};

export function geom(frame) {
  const s = SPEC[frame.kind];
  const CW = W - 2 * (s.pad + s.inset);
  const CH = Math.round((CW * 3) / 4);
  const slotH = CH + 2 * s.inset;
  const H = s.head + 4 * slotH + 3 * s.gap + s.foot;
  const cells = [0, 1, 2, 3].map((i) => {
    const sy = s.head + i * (slotH + s.gap);
    return { sx: s.pad, sy, sw: W - 2 * s.pad, sh: slotH, x: s.pad + s.inset, y: sy + s.inset, w: CW, h: CH };
  });
  return { ...s, CW, CH, H, cells };
}

const load = (src) =>
  new Promise((ok, no) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = no;
    i.src = src;
  });

function paw(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  const dot = (dx, dy, rx, ry) => {
    ctx.beginPath();
    ctx.ellipse(x + dx * s, y + dy * s, rx * s, ry * s, 0, 0, 7);
    ctx.fill();
  };
  dot(0, 4, 11, 9);
  dot(-11, -8, 4.5, 6);
  dot(-4, -14, 4.5, 6);
  dot(4, -14, 4.5, 6);
  dot(11, -8, 4.5, 6);
}

// kotak dengan tepi bergerigi (perangko / tiket)
function scallop(ctx, x, y, w, h, r, fill, hole) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = hole;
  const row = (len, at) => {
    const n = Math.round(len / (r * 2.7));
    const s = len / n;
    for (let i = 0; i <= n; i++) {
      const [cx, cy] = at(i * s);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 7);
      ctx.fill();
    }
  };
  row(w, (t) => [x + t, y]);
  row(w, (t) => [x + t, y + h]);
  row(h, (t) => [x, y + t]);
  row(h, (t) => [x + w, y + t]);
}

function text(ctx, str, x, y, font, color, align = "left") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
  ctx.textAlign = "left";
}

function paintBg(ctx, f, g, date) {
  const H = g.H;
  if (f.kind === "ticket") {
    ctx.fillStyle = "#2F5D9B";
    ctx.fillRect(0, 0, W, H);
    scallop(ctx, 18, 18, W - 36, H - 36, 9, "#FBF3DC", "#2F5D9B");
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, W - 68, H - 68);
    text(ctx, "CINEMA PAWS", W / 2, 118, `700 58px ${SERIF}`, RED, "center");
    text(ctx, "T I C K E T S", W / 2, 152, `700 22px ${SERIF}`, RED, "center");
    const bx = 56, by = 176, bwid = 488, bh = 80;
    ctx.strokeRect(bx, by, bwid, bh);
    [240, 360].forEach((dx) => {
      ctx.beginPath();
      ctx.moveTo(bx + dx, by);
      ctx.lineTo(bx + dx, by + bh);
      ctx.stroke();
    });
    const box = (x, w, label, val, size) => {
      text(ctx, label, x + w / 2, by + 26, `700 17px ${SERIF}`, RED, "center");
      text(ctx, val, x + w / 2, by + 64, `700 ${size}px ${SERIF}`, RED, "center");
    };
    box(bx, 240, "DATE", date, 32);
    box(bx + 240, 120, "ROW", "01", 36);
    box(bx + 360, 128, "SEAT", "04", 36);
  } else if (f.kind === "boarding") {
    ctx.fillStyle = "#F2F0EA";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#E63B32";
    ctx.fillRect(0, 0, W, 110);
    text(ctx, "PAW AIR", 44, 74, `700 54px ${MONO}`, "#fff");
    text(ctx, "BOARDING PASS", W - 44, 70, `700 20px ${MONO}`, "#fff", "right");
    const item = (x, y, label, val, size = 26) => {
      text(ctx, label, x, y, `700 15px ${MONO}`, "#E63B32");
      text(ctx, val, x, y + 32, `700 ${size}px ${MONO}`, INK);
    };
    item(44, 146, "FROM", "BDG");
    item(214, 146, "TO", "FUN");
    item(384, 146, "FLIGHT", "PAW 101");
    item(44, 212, "DATE", date.toUpperCase(), 22);
    item(214, 212, "GATE", "A7");
    item(384, 212, "SEAT", "4B");
  } else if (f.kind === "stamp") {
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, W, H);
    paw(ctx, W / 2 - 128, 56, 1.5, "#FBF3DC");
    text(ctx, "pawtobooth", W / 2 + 10, 68, `700 46px ${HAND}`, "#FBF3DC", "center");
  } else {
    ctx.fillStyle = f.bg;
    ctx.fillRect(0, 0, W, H);
  }
}

function paintSlot(ctx, f, c) {
  if (f.kind === "stamp") scallop(ctx, c.sx, c.sy, c.sw, c.sh, 9, "#FFFFFF", NAVY);
}

function paintBorder(ctx, f, c) {
  const style = {
    ticket: [RED, 4],
    boarding: [INK, 4],
    stamp: [NAVY, 3],
    solid: [INK, 6],
  }[f.kind];
  ctx.strokeStyle = style[0];
  ctx.lineWidth = style[1];
  ctx.strokeRect(c.x - 2, c.y - 2, c.w + 4, c.h + 4);
}

function paintFoot(ctx, f, g, date) {
  const y0 = g.H - g.foot;
  if (f.kind === "ticket") {
    text(ctx, "THANK YOU  ★  SEE YOU AGAIN  ★  THANK YOU", W / 2, y0 + 26, `700 15px ${SERIF}`, "#2F5D9B", "center");
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3;
    ctx.strokeRect(56, y0 + 44, 488, 70);
    text(ctx, "pawtobooth", W / 2, y0 + 94, `700 50px ${HAND}`, RED, "center");
  } else if (f.kind === "boarding") {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(24, y0 + 8);
    ctx.lineTo(W - 24, y0 + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, "GATE CLOSES 25 MINUTES BEFORE DEPARTURE", W / 2, y0 + 38, `700 14px ${MONO}`, "#E63B32", "center");
    const widths = [3, 2, 5, 2, 4, 3, 6, 2, 3, 5, 2, 4];
    let x = 44, i = 0;
    ctx.fillStyle = INK;
    while (x < W - 44) {
      const w = widths[i % widths.length];
      if (i % 2 === 0) ctx.fillRect(x, y0 + 54, w, 70);
      x += w + (i % 3 === 0 ? 2 : 1);
      i++;
    }
    text(ctx, "pawtobooth", W / 2, y0 + 154, `700 24px ${MONO}`, INK, "center");
  } else if (f.kind === "stamp") {
    text(ctx, "hello, meow!", W / 2, y0 + 78, `italic 700 58px ${SERIF}`, "#FBF3DC", "center");
    text(ctx, date, W / 2, y0 + 122, `italic 30px ${SERIF}`, "#FBF3DC", "center");
    text(ctx, "♥  ♥  ♥", W / 2, y0 + 168, `32px ${SERIF}`, "#F4A6B8", "center");
  } else {
    paw(ctx, g.pad + 26, y0 + 78, 1.7, f.text);
    text(ctx, "pawtobooth", g.pad + 78, y0 + 78, `700 52px ${HAND}`, f.text);
    text(ctx, date, g.pad + 78, y0 + 116, `400 30px ${HAND}`, f.text);
  }
}

function drawPhoto(ctx, img, c, bw) {
  const r = c.w / c.h;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (sw / sh > r) {
    const w = sh * r;
    sx = (sw - w) / 2;
    sw = w;
  } else {
    const h = sw / r;
    sy = (sh - h) / 2;
    sh = h;
  }
  ctx.drawImage(img, sx, sy, sw, sh, c.x, c.y, c.w, c.h);
  // grayscale manual (ctx.filter tidak didukung Safari)
  if (bw) {
    const d = ctx.getImageData(c.x, c.y, c.w, c.h);
    const p = d.data;
    for (let k = 0; k < p.length; k += 4) {
      const g = p[k] * 0.3 + p[k + 1] * 0.59 + p[k + 2] * 0.11;
      p[k] = p[k + 1] = p[k + 2] = Math.min(255, (g - 128) * 1.12 + 134);
    }
    ctx.putImageData(d, c.x, c.y);
  }
}

const TINTS = ["#9EC5F0", "#F7C6B0", "#C8E6A8", "#F6D98A"];
const GRAYS = ["#8C8C8C", "#A9A9A9", "#8C8C8C", "#A9A9A9"];

function placeholder(ctx, c, i, bw) {
  ctx.fillStyle = (bw ? GRAYS : TINTS)[i];
  ctx.fillRect(c.x, c.y, c.w, c.h);
  paw(ctx, c.x + c.w / 2, c.y + c.h / 2 + 10, 4, "rgba(255,255,255,.55)");
}

async function render(frame, bw, imgs) {
  try {
    await document.fonts.load("700 48px Gaegu");
  } catch {
    /* pakai font cadangan */
  }
  const g = geom(frame);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = g.H;
  const ctx = c.getContext("2d");
  const date = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  paintBg(ctx, frame, g, date);
  g.cells.forEach((cell, i) => {
    paintSlot(ctx, frame, cell);
    if (imgs) drawPhoto(ctx, imgs[i], cell, bw);
    else placeholder(ctx, cell, i, bw);
    paintBorder(ctx, frame, cell);
  });
  paintFoot(ctx, frame, g, date);
  return c.toDataURL("image/png");
}

export async function composeStrip(urls, frame, bw) {
  const imgs = await Promise.all(urls.map(load));
  return render(frame, bw, imgs);
}

export const composePreview = (frame, bw) => render(frame, bw, null);
