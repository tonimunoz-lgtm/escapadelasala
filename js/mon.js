// =============================================================
//  MÓN COMÚ: totes les empreses de la classe en un sol mapa (canvas).
//  - Cada empresa té una ciutat (illes de parcel·les + carrers) en una posició (slot).
//  - Entre ciutats hi ha camp on es poden construir carreteres noves.
//  - El zoom i el desplaçament afecten tot el món.
// =============================================================
import { MIDA_MAPA, BLOC, EDIFICIS } from './dades.js';

export const W = 236;            // amplada del rombe d'una casella (px del món)
const IMG = 256, CENTRE_Y = 172; // les imatges fan 256x256 i el centre del rombe superior és a y=172
const DZ = 14;                   // les parcel·les estan 14 px més altes que el terra (carrers i camp)
const PAS = BLOC + 1;
const NUM_ILLES = MIDA_MAPA / BLOC;
export const CASELLES = NUM_ILLES * PAS + 1; // caselles de costat d'una ciutat
export const SEPARACIO = CASELLES + 4;       // distància entre ciutats (4 caselles de camp)

export const iso = (u, v) => ({ x: (u - v) * W / 2, y: (u + v) * W / 4 });
const clau = (X, Y) => `${X},${Y}`;

// Posició de cada slot en espiral al voltant de (0,0)
const espiral = [[0, 0]];
for (let k = 1; espiral.length < 400; k++) {
  for (let x = -k; x <= k; x++) espiral.push([x, -k]);
  for (let y = -k + 1; y <= k; y++) espiral.push([k, y]);
  for (let x = k - 1; x >= -k; x--) espiral.push([x, k]);
  for (let y = k - 1; y > -k; y--) espiral.push([-k, y]);
}
export function origenSlot(slot) {
  const [sx, sy] = espiral[slot] || [0, 0];
  return { X: sx * SEPARACIO, Y: sy * SEPARACIO };
}
export const esCarreteraCiutat = (R, C) => R % PAS === 0 || C % PAS === 0;
export const indexParcela = (R, C) => (R - Math.floor(R / PAS) - 1) * MIDA_MAPA + (C - Math.floor(C / PAS) - 1);
export const casellaParcela = (i) => {
  const r = Math.floor(i / MIDA_MAPA), c = i % MIDA_MAPA;
  return { R: r + Math.floor(r / BLOC) + 1, C: c + Math.floor(c / BLOC) + 1 };
};
const hash = (X, Y) => { let h = (X * 374761393 + Y * 668265263) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return h % 1000; };

const COLORS = {
  asfalt: '#5d636b', vorera: '#c9ced5', vora: '#9aa2ac', linia: '#f2f2ee',
  plana: { bloquejada: '#8f969e', buida: '#8cc152', obres: '#e9a23b', carretera: '#5d636b', edifici: '#4f86c6' },
};

export function crearMon({ canvas, onClic, onCanvi }) {
  const ctx = canvas.getContext('2d');
  const imatges = new Map();
  let escala = 0.5, despl = { x: 0, y: 0 };
  let empreses = [];      // [{uid, nom, logo, slot, parceles, carreteresMon}]
  let jo = null;          // { uid, estat }
  let cel = new Map();    // clau -> {tipus, emp, i?}
  let carreteres = new Set();
  let componentDe = new Map();
  let pendent = false;
  let patro = null;

  function img(src) {
    let im = imatges.get(src);
    if (!im) {
      im = new Image();
      im.onload = () => demana();
      im.src = src;
      imatges.set(src, im);
    }
    return im.complete && im.naturalWidth ? im : null;
  }

  // ---------- dades ----------
  function reconstruir() {
    cel = new Map();
    carreteres = new Set();
    const totes = jo ? [...empreses.filter((e) => e.uid !== jo.uid), { ...jo.estat, uid: jo.uid }] : empreses;
    // carreteres del món (fora de les ciutats)
    for (const e of totes) for (const k of e.carreteresMon || []) { cel.set(k, { tipus: 'carretera', emp: e, mon: true }); carreteres.add(k); }
    for (const e of totes) {
      if (e.slot == null) continue;
      const o = origenSlot(e.slot);
      for (let R = 0; R < CASELLES; R++) for (let C = 0; C < CASELLES; C++) {
        const k = clau(o.X + C, o.Y + R);
        if (esCarreteraCiutat(R, C)) { cel.set(k, { tipus: 'carretera', emp: e }); carreteres.add(k); continue; }
        const i = indexParcela(R, C);
        const p = e.parceles?.[i] || { estat: 'bloquejada' };
        cel.set(k, { tipus: 'parcela', emp: e, i, p });
        if (p.estat === 'carretera') carreteres.add(k);
      }
    }
    // components connexes de carreteres (per saber si dues ciutats estan unides)
    componentDe = new Map();
    let id = 0;
    for (const k of carreteres) {
      if (componentDe.has(k)) continue;
      id++;
      const cua = [k];
      componentDe.set(k, id);
      while (cua.length) {
        const [X, Y] = cua.pop().split(',').map(Number);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const n = clau(X + dx, Y + dy);
          if (carreteres.has(n) && !componentDe.has(n)) { componentDe.set(n, id); cua.push(n); }
        }
      }
    }
  }

  function demana() {
    if (pendent) return;
    pendent = true;
    requestAnimationFrame(() => { pendent = false; dibuixa(); });
  }

  // ---------- dibuix ----------
  function rombe(u, v, du = 1, dv = 1, dy = 0) {
    const a = iso(u, v), b = iso(u + du, v), c = iso(u + du, v + dv), d = iso(u, v + dv);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + dy); ctx.lineTo(b.x, b.y + dy); ctx.lineTo(c.x, c.y + dy); ctx.lineTo(d.x, d.y + dy);
    ctx.closePath();
  }

  function dibuixaCarretera(X, Y) {
    const n = carreteres.has(clau(X, Y - 1)), s = carreteres.has(clau(X, Y + 1));
    const w = carreteres.has(clau(X - 1, Y)), e = carreteres.has(clau(X + 1, Y));
    rombe(X, Y, 1, 1, DZ); ctx.fillStyle = COLORS.asfalt; ctx.fill();
    const v = 0.13;
    ctx.fillStyle = COLORS.vorera;
    if (!n) { rombe(X, Y, 1, v, DZ); ctx.fill(); }
    if (!s) { rombe(X, Y + 1 - v, 1, v, DZ); ctx.fill(); }
    if (!w) { rombe(X, Y, v, 1, DZ); ctx.fill(); }
    if (!e) { rombe(X + 1 - v, Y, v, 1, DZ); ctx.fill(); }
    if (escala < 0.3) return;
    const graus = n + s + w + e;
    const c = iso(X + 0.5, Y + 0.5);
    const mig = { n: iso(X + 0.5, Y), s: iso(X + 0.5, Y + 1), w: iso(X, Y + 0.5), e: iso(X + 1, Y + 0.5) };
    ctx.strokeStyle = COLORS.linia;
    if (graus <= 2) {
      ctx.lineWidth = 3; ctx.setLineDash([14, 12]);
      ctx.beginPath();
      for (const [ok, p] of [[n, mig.n], [s, mig.s], [w, mig.w], [e, mig.e]]) if (ok) { ctx.moveTo(c.x, c.y + DZ); ctx.lineTo(p.x, p.y + DZ); }
      ctx.stroke(); ctx.setLineDash([]);
    } else {
      // pas de vianants a les cruïlles
      ctx.lineWidth = 5; ctx.setLineDash([5, 6]);
      ctx.beginPath();
      const z = 0.2;
      if (n) { const a = iso(X + 0.25, Y + z), b = iso(X + 0.75, Y + z); ctx.moveTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); }
      if (s) { const a = iso(X + 0.25, Y + 1 - z), b = iso(X + 0.75, Y + 1 - z); ctx.moveTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); }
      if (w) { const a = iso(X + z, Y + 0.25), b = iso(X + z, Y + 0.75); ctx.moveTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); }
      if (e) { const a = iso(X + 1 - z, Y + 0.25), b = iso(X + 1 - z, Y + 0.75); ctx.moveTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); }
      ctx.stroke(); ctx.setLineDash([]);
    }
  }

  function srcParcela(p) {
    if (p.estat === 'bloquejada') return 'img/mapa/parcela-bloquejada.webp';
    if (p.estat === 'buida') return 'img/mapa/parcela-buida.webp';
    if (p.estat === 'obres') return 'img/mapa/parcela-obres.webp';
    if (p.millora) return 'img/mapa/parcela-millora.webp';
    if (p.tipus && EDIFICIS[p.tipus]) return `img/edificis/edifici-${p.tipus}.webp`;
    return 'img/mapa/parcela-buida.webp';
  }

  function sprite(src, X, Y, alfa = 1) {
    const im = img(src);
    if (!im) return;
    const { x, y } = iso(X + 0.5, Y + 0.5);
    if (alfa !== 1) ctx.globalAlpha = alfa;
    ctx.drawImage(im, x - IMG / 2, y - CENTRE_Y, IMG, IMG);
    if (alfa !== 1) ctx.globalAlpha = 1;
  }

  function pastilla(x, y, text, { fons = '#fff', color = '#0a3566', mida = 17, icona = null } = {}) {
    ctx.font = `800 ${mida}px "Baloo 2", system-ui, sans-serif`;
    const tw = ctx.measureText(text).width;
    const ic = icona ? mida * 1.6 : 0;
    const w = tw + ic + mida * 1.1, h = mida * 1.7;
    ctx.fillStyle = fons;
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    if (icona) { const im = img(icona); if (im) ctx.drawImage(im, x - w / 2 + mida * 0.35, y - ic / 2, ic, ic); }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + ic / 2, y + mida * 0.08);
  }

  function barra(x, y, frac, text) {
    const w = 150, h = 26;
    ctx.fillStyle = 'rgba(10,53,102,.85)';
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#f2891d';
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, Math.max(h, w * Math.max(0, Math.min(1, frac))), h, h / 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '800 15px "Baloo 2", system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 1);
  }

  let rellotgeFum = 0;
  function dibuixa() {
    const dpr = window.devicePixelRatio || 1;
    const amp = canvas.clientWidth, alt = canvas.clientHeight;
    if (canvas.width !== Math.round(amp * dpr) || canvas.height !== Math.round(alt * dpr)) {
      canvas.width = Math.round(amp * dpr); canvas.height = Math.round(alt * dpr);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#7cb342'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * despl.x, dpr * despl.y);

    // límits visibles en coordenades del món
    const x0 = -despl.x / escala, y0 = -despl.y / escala;
    const x1 = (amp - despl.x) / escala, y1 = (alt - despl.y) / escala;
    // gespa que es fa gran i petita amb el zoom
    const gespa = img('img/mapa/fons-mapa-tile.webp');
    if (gespa) {
      if (!patro) patro = ctx.createPattern(gespa, 'repeat');
      ctx.fillStyle = patro; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    const cella = (x, y) => ({ u: (x / (W / 2) + y / (W / 4)) / 2, v: (y / (W / 4) - x / (W / 2)) / 2 });
    const cs = [cella(x0, y0), cella(x1, y0), cella(x0, y1), cella(x1, y1)];
    const minX = Math.floor(Math.min(...cs.map((c) => c.u))) - 2, maxX = Math.ceil(Math.max(...cs.map((c) => c.u))) + 1;
    const minY = Math.floor(Math.min(...cs.map((c) => c.v))) - 2, maxY = Math.ceil(Math.max(...cs.map((c) => c.v))) + 3;
    const simple = escala < 0.2;
    const ara = Date.now();
    const meus = [];

    for (let d = minX + minY; d <= maxX + maxY; d++) {
      for (let X = Math.max(minX, d - maxY); X <= Math.min(maxX, d - minY); X++) {
        const Y = d - X;
        const c = cel.get(clau(X, Y));
        if (!c) {
          // arbres al camp (no al costat de carreteres)
          if (!simple && escala > 0.25 && hash(X, Y) < 140 && !aprop(X, Y)) sprite('img/mapa/decor-arbres.webp', X, Y);
          continue;
        }
        if (c.tipus === 'carretera' || c.p?.estat === 'carretera') { dibuixaCarretera(X, Y); continue; }
        const esMeu = jo && c.emp.uid === jo.uid;
        if (simple) {
          rombe(X + 0.06, Y + 0.06, 0.88, 0.88);
          ctx.fillStyle = COLORS.plana[c.p.estat] || '#999';
          if (c.p.estat === 'edifici' && !esMeu) ctx.fillStyle = '#7f8fa8';
          ctx.fill();
          continue;
        }
        sprite(srcParcela(c.p), X, Y, c.p.estat === 'bloquejada' ? 0.85 : 1);
        if (esMeu) meus.push([X, Y, c]);
        else if (c.p.estat === 'edifici' && escala > 0.35 && c.p.tipus !== 'seu-central') {
          const { x, y } = iso(X + 0.5, Y + 0.5);
          pastilla(x, y + 26, `Nv ${c.p.nivell || 1}`, { fons: '#0a3566', color: '#fff', mida: 15 });
        }
      }
    }

    // capa de dalt: fum, barres, rètols de la meva ciutat
    if (!simple) {
      rellotgeFum = (rellotgeFum + 1) % 8;
      for (const [X, Y, c] of meus) {
        const p = c.p;
        const { x, y } = iso(X + 0.5, Y + 0.5);
        const feina = p.produccio || p.venda;
        if (p.produccio && p.produccio.fi > ara) {
          const fum = img('img/anim/anim-fum.webp');
          if (fum) ctx.drawImage(fum, rellotgeFum * 128, 0, 128, 128, x - 8, y - 140, 64, 64);
        }
        if (escala < 0.3) continue;
        if (p.estat === 'obres') barra(x, y - 30, 1 - (p.fiObres - ara) / (p.duradaObres || 60000), temps((p.fiObres - ara) / 1000));
        else if (p.millora) barra(x, y - 30, (ara - p.millora.inici) / (p.millora.fi - p.millora.inici), temps((p.millora.fi - ara) / 1000));
        else if (feina) {
          if (feina.fi <= ara) pastilla(x, y - 30, p.venda ? 'Cobra' : 'Recull', { fons: '#3c9d32', color: '#fff', mida: 18, icona: p.venda ? 'img/recursos/recurs-diners.webp' : (feina.recurs === 'recerca' ? 'img/edificis/edifici-laboratori.webp' : `img/recursos/recurs-${feina.recurs}.webp`) });
          else barra(x, y - 30, (ara - feina.inici) / (feina.fi - feina.inici), temps((feina.fi - ara) / 1000));
        }
        if (p.estat === 'edifici' && p.tipus !== 'seu-central' && escala > 0.35) {
          pastilla(x, y + 26, escala >= 0.8 ? `${EDIFICIS[p.tipus].nom}  Nv ${p.nivell || 1}` : `Nv ${p.nivell || 1}`, { fons: '#0a3566', color: '#fff', mida: 15 });
        }
      }
    }

    // noms de les empreses quan es mira de lluny
    if (escala < 0.45) {
      const totes = jo ? [...empreses.filter((e) => e.uid !== jo.uid), { ...jo.estat, uid: jo.uid }] : empreses;
      for (const e of totes) {
        if (e.slot == null) continue;
        const o = origenSlot(e.slot);
        const { x, y } = iso(o.X + CASELLES / 2, o.Y + CASELLES / 2);
        const mida = 16 / escala;
        pastilla(x, y - 40 / escala, e.nom || 'Empresa', {
          fons: jo && e.uid === jo.uid ? '#f2891d' : '#ffffff', color: jo && e.uid === jo.uid ? '#fff' : '#0a3566',
          mida, icona: `img/avatars/logo-empresa-${String(e.logo || 1).padStart(2, '0')}.webp`,
        });
      }
    }
  }

  function aprop(X, Y) {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (cel.has(clau(X + dx, Y + dy))) return true;
    return false;
  }

  function temps(s) {
    s = Math.max(0, Math.ceil(s));
    const m = Math.floor(s / 60);
    return m ? `${m} min ${s % 60} s` : `${s} s`;
  }

  // ---------- interacció ----------
  function aMon(sx, sy) {
    const r = canvas.getBoundingClientRect();
    return { x: (sx - r.left - despl.x) / escala, y: (sy - r.top - despl.y) / escala };
  }
  function casellaA(sx, sy) {
    const { x, y } = aMon(sx, sy);
    const u = (x / (W / 2) + y / (W / 4)) / 2, v = (y / (W / 4) - x / (W / 2)) / 2;
    return { X: Math.floor(u), Y: Math.floor(v) };
  }

  function zoom(factor, cx, cy) {
    const r = canvas.getBoundingClientRect();
    cx ??= r.width / 2; cy ??= r.height / 2;
    const nova = Math.min(1.6, Math.max(0.04, escala * factor));
    despl.x = cx - (cx - despl.x) * (nova / escala);
    despl.y = cy - (cy - despl.y) * (nova / escala);
    escala = nova;
    demana();
    onCanvi?.(escala);
  }

  const punters = new Map();
  let inici = null, arrossegat = false, pinça = null;
  canvas.addEventListener('pointerdown', (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 1) { inici = { x: ev.clientX, y: ev.clientY, dx: despl.x, dy: despl.y }; arrossegat = false; }
    if (punters.size === 2) {
      const [a, b] = [...punters.values()];
      pinça = { d: Math.hypot(a.x - b.x, a.y - b.y), escala };
      arrossegat = true;
    }
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!punters.has(ev.pointerId)) return;
    punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 2 && pinça) {
      const [a, b] = [...punters.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = canvas.getBoundingClientRect();
      zoom((pinça.escala * d / pinça.d) / escala, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    if (!inici) return;
    const mx = ev.clientX - inici.x, my = ev.clientY - inici.y;
    if (!arrossegat && Math.hypot(mx, my) < 6) return;
    arrossegat = true;
    canvas.classList.add('arrossegant');
    despl.x = inici.dx + mx; despl.y = inici.dy + my;
    demana();
  });
  const acaba = (ev) => {
    const eraClic = punters.size === 1 && !arrossegat && inici;
    punters.delete(ev.pointerId);
    if (punters.size < 2) pinça = null;
    if (punters.size === 0) { inici = null; canvas.classList.remove('arrossegant'); }
    if (eraClic && ev.type === 'pointerup') {
      const { X, Y } = casellaA(ev.clientX, ev.clientY);
      onClic?.({ X, Y, cella: cel.get(clau(X, Y)) || null });
    }
  };
  canvas.addEventListener('pointerup', acaba);
  canvas.addEventListener('pointercancel', acaba);
  canvas.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    const r = canvas.getBoundingClientRect();
    zoom(ev.deltaY < 0 ? 1.12 : 1 / 1.12, ev.clientX - r.left, ev.clientY - r.top);
  }, { passive: false });
  window.addEventListener('resize', demana);
  setInterval(demana, 140); // animacions i comptes enrere

  return {
    setJo(uid, estat) { jo = { uid, estat }; reconstruir(); demana(); },
    setEmpreses(llista) { empreses = llista; reconstruir(); demana(); },
    actualitza() { reconstruir(); demana(); },
    zoom,
    get escala() { return escala; },
    centrarEnSlot(slot, novaEscala) {
      const o = origenSlot(slot || 0);
      const { x, y } = iso(o.X + CASELLES / 2, o.Y + CASELLES / 2);
      const r = canvas.getBoundingClientRect();
      if (novaEscala) escala = novaEscala;
      despl.x = r.width / 2 - x * escala;
      despl.y = r.height / 2 + 20 - y * escala;
      demana();
    },
    vistaCiutat(slot) {
      const r = canvas.getBoundingClientRect();
      const e = Math.min(1, Math.max(0.3, Math.min(r.width / (CASELLES * W * 1.05), (r.height - 140) / (CASELLES * W / 2 + 220))));
      this.centrarEnSlot(slot, e);
    },
    esCarretera: (X, Y) => carreteres.has(clau(X, Y)),
    teCarreteraVeina: (X, Y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => carreteres.has(clau(X + dx, Y + dy))),
    // dues ciutats estan connectades si comparteixen component de carreteres
    connectades(slotA, slotB) {
      if (slotA == null || slotB == null) return false;
      const a = origenSlot(slotA), b = origenSlot(slotB);
      const ca = componentDe.get(clau(a.X, a.Y)), cb = componentDe.get(clau(b.X, b.Y));
      return ca != null && ca === cb;
    },
    empresaDeUid: (uid) => empreses.find((e) => e.uid === uid),
  };
}
