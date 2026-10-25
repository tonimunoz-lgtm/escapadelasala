// =============================================================
//  MÓN DELS PARCS: un paisatge (muntanyes, rius i costa) amb carreteres i parcel·les
//  on cada empresa de la classe construeix el seu parc d'atraccions.
//  Substitueix el mapa de la ciutat: la ciutat ja no cal (els tràmits es fan des dels menús).
//  Fa la mateixa feina que crearCiutat(): clics, centrar, zoom i miniatures dels parcs.
// =============================================================
import { MIDA_TOTAL, BLOC, BLOCS_INICIALS, OBJECTES, srcObjecte, giraObjecte, giraParc, dibuixaObjecte } from './parc-dades.js';

// La imatge de fons es dibuixa a mida real: 1 unitat del món = 1 píxel de la imatge.
const FONS = { src: 'img/mapa/mon.webp', w: 1774, h: 887 };
// Les carreteres de la imatge segueixen una graella isomètrica: (a, b) són coordenades al llarg de les
// dues direccions dels carrers, amb l'origen a la rotonda del mig.
const C1 = { x: 853, y: 420 };
export const P = (a, b) => ({ x: C1.x + a - b, y: C1.y + (a + b) / 2 });
const DE_P = (x, y) => { const dx = x - C1.x, dy = y - C1.y; return { a: (dx + 2 * dy) / 2, b: (2 * dy - dx) / 2 }; };

// Graella de parcel·les: cada cel·la (i, j) fa PAS x PAS unitats; la parcel·la n'ocupa S i la resta és carrer.
// Les cel·les s'han triat perquè caiguin sobre el prat de la imatge (sense rius, bosc ni platja).
const PAS = 96, S = 80, MARGE = (PAS - S) / 2;
const CELLES = [[-1, -1], [0, -1], [-1, 0], [0, 0], [-1, -2], [0, -2], [-2, -1], [1, -1], [-2, 0], [1, 0], [-1, 1], [0, 1], [-1, -3], [0, -3], [-2, -2], [1, -2], [-3, -1], [2, -1], [-3, 0], [2, 0], [-2, 1], [1, 1], [-1, 2], [0, 2], [-2, -3], [1, -3], [-3, -2], [2, -2], [-4, -1], [3, -1], [-4, 0], [3, 0], [-3, 1], [2, 1], [-2, 2], [1, 2], [-1, 3], [0, 3], [-3, -3], [2, -3], [-4, -2], [3, -2], [4, -1], [4, 0], [-4, 1], [3, 1], [-3, 2], [2, 2], [-2, 3], [1, 3], [3, -3], [4, -2], [5, -1], [5, 0], [4, 1], [-4, 2], [3, 2], [-3, 3], [2, 3], [1, 4], [4, -3], [5, -2], [4, 2], [3, 3], [2, 4], [4, 3], [3, 4]];
// avingudes principals (a = 0 i b = 0, que es creuen a la rotonda del mig) i fins on arriben
const AVINGUDES = { a: [-5 * PAS, 6 * PAS], b: [-4.5 * PAS, 5 * PAS] };
function zonaDe(a, b) {
  if (a < 0 && b < 0) return 'les muntanyes';
  if (a >= 0 && b < 0) return 'la costa';
  if (a >= 0) return 'les cales';
  return 'el riu';
}
// L'entrada de cada parc mira cap a l'avinguda més propera
function generaParcelles() {
  return CELLES.map(([i, j], k) => {
    const a = i * PAS + MARGE, b = j * PAS + MARGE, ca = a + S / 2, cb = b + S / 2;
    const costat = Math.abs(ca) < Math.abs(cb) ? (ca < 0 ? 'E' : 'W') : (cb < 0 ? 'S' : 'N');
    return { id: `P${k + 1}`, i, j, a, b, costat, zona: zonaDe(ca, cb) };
  });
}
export const PARCELLES_MON = generaParcelles();
export const parcellaPerId = (id) => PARCELLES_MON.find((p) => p.id === id);
const hiHa = new Set(CELLES.map(([i, j]) => `${i},${j}`));

export function crearMon({ canvas, onClic }) {
  const ctx = canvas.getContext('2d');
  let escala = 1, locals = {}, jo = null, objectiu = null, pendent = false;
  const despl = { x: 0, y: 0 };
  const imatges = new Map();
  function img(src) {
    let im = imatges.get(src);
    if (!im) { im = new Image(); im.onload = demana; im.src = src; imatges.set(src, im); }
    return im.complete && im.naturalWidth ? im : null;
  }
  function demana() { if (!pendent) { pendent = true; requestAnimationFrame(() => { pendent = false; dibuixa(); }); } }
  const rombe = (a, b, da, db) => {
    const p = [P(a, b), P(a + da, b), P(a + da, b + db), P(a, b + db)];
    ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); for (const q of p.slice(1)) ctx.lineTo(q.x, q.y); ctx.closePath();
  };
  const linia = (a1, b1, a2, b2) => { const p = P(a1, b1), q = P(a2, b2); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); };

  // carrers: al voltant de totes les parcel·les, i dues avingudes més amples que travessen el mapa
  function dibuixaCarrers() {
    const trams = [];
    for (const [i, j] of CELLES) {
      for (const [a1, b1, a2, b2] of [[i, j, i + 1, j], [i, j + 1, i + 1, j + 1], [i, j, i, j + 1], [i + 1, j, i + 1, j + 1]]) trams.push([a1 * PAS, b1 * PAS, a2 * PAS, b2 * PAS]);
    }
    const unics = [...new Map(trams.map((t) => [t.join(','), t])).values()];
    const avingudes = [[0, AVINGUDES.b[0], 0, AVINGUDES.b[1]], [AVINGUDES.a[0], 0, AVINGUDES.a[1], 0]];
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const traça = (llista, gruix, color) => { ctx.strokeStyle = color; ctx.lineWidth = gruix; ctx.beginPath(); for (const t of llista) linia(...t); ctx.stroke(); };
    traça(unics, 12, '#b9b29f'); traça(avingudes, 18, '#b9b29f');     // voreres
    traça(unics, 9, '#6a6f78'); traça(avingudes, 14, '#62676f');      // asfalt
    ctx.setLineDash([5, 6]); traça(avingudes, 1.2, 'rgba(255,255,255,.8)'); ctx.setLineDash([]);
    // rotonda del mig
    const c = P(0, 0);
    ctx.save(); ctx.translate(c.x, c.y); ctx.scale(1, 0.5);
    ctx.fillStyle = '#b9b29f'; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#62676f'; ctx.beginPath(); ctx.arc(0, 0, 31, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6fae3c'; ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e8e2cf'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  }

  // una parcel·la: en venda (gespa amb vora discontínua) o amb el parc en miniatura
  function dibuixaParcella(t) {
    const parc = locals[t.id], meu = parc && parc.uid === jo, k = S / MIDA_TOTAL;
    rombe(t.a + 2, t.b + 2, S - 4, S - 4);
    ctx.fillStyle = parc ? 'rgba(150,205,95,.92)' : 'rgba(225,240,190,.35)'; ctx.fill();
    ctx.lineWidth = parc ? 2.5 : 2; ctx.setLineDash(parc ? [] : [7, 5]);
    ctx.strokeStyle = meu ? '#f2891d' : parc ? '#6b4a2b' : 'rgba(255,255,255,.9)'; ctx.stroke(); ctx.setLineDash([]);
    // entrada: un petit tram de camí cap a la carretera
    const ent = { S: [t.a + S / 2 - 4, t.b + S - 3, 8, MARGE + 3], N: [t.a + S / 2 - 4, t.b - MARGE, 8, MARGE + 3], E: [t.a + S - 3, t.b + S / 2 - 4, MARGE + 3, 8], W: [t.a - MARGE, t.b + S / 2 - 4, MARGE + 3, 8] }[t.costat];
    rombe(...ent); ctx.fillStyle = '#e6d6b4'; ctx.fill();
    if (!parc) {
      // el rètol només surt quan t'hi apropes (al mapa sencer n'hi hauria massa)
      if (escala > 2.2) { const c = P(t.a + S / 2, t.b + S / 2); etiqueta(c.x, c.y, 'En venda', '#ffffff', '#0a3566', 7); }
      return;
    }
    if (escala > 0.45) {
      const L = (px, py) => { const [lx, ly] = giraParc(px, py, t.costat); return [t.a + lx * k, t.b + ly * k]; };
      ctx.fillStyle = '#8fd05a';
      for (const bl of (parc.blocs || BLOCS_INICIALS.join(';')).split(';')) {
        if (!bl) continue;
        const [bx, by] = bl.split(',').map(Number), [lx, ly] = giraObjecte(bx * BLOC, by * BLOC, BLOC, t.costat);
        rombe(t.a + lx * k, t.b + ly * k, BLOC * k, BLOC * k); ctx.fill();
      }
      ctx.fillStyle = '#e6d6b4';
      for (const p of (parc.camins || '').split(';')) { if (!p) continue; const [a, b] = L(...p.split(',').map(Number)); rombe(a, b, k, k); ctx.fill(); }
      const objs = (parc.objectes || '').split(';').filter(Boolean).map((o) => {
        const [tt, px, py, gir] = o.split(','); const m = OBJECTES[tt]?.mida || 1;
        const [lx, ly] = giraObjecte(Number(px), Number(py), m, t.costat);
        return { t: tt, lx, ly, m, gir: gir === '1' ? 1 : 0 };
      }).filter((o) => OBJECTES[o.t] && !OBJECTES[o.t].ressort && !OBJECTES[o.t].exterior).sort((x, y) => (x.lx + x.ly + x.m) - (y.lx + y.ly + y.m));
      for (const o of objs) {
        const im = img(srcObjecte(o.t)); if (!im) continue;
        const c = P(t.a + (o.lx + o.m / 2) * k, t.b + (o.ly + o.m / 2) * k);
        dibuixaObjecte(ctx, im, o.t, c.x, c.y, 2 * k * o.m * 1.5, o.gir);   // una mica més grans perquè es vegin
      }
    }
    const c = P(t.a + S / 2, t.b + S);
    etiqueta(c.x, c.y + 4, parc.nom || 'Parc', meu ? '#f2891d' : '#0a3566', '#fff', 10);
  }
  function etiqueta(x, y, text, fons, color, mida) {
    ctx.font = `800 ${mida}px "Baloo 2", system-ui, sans-serif`; ctx.textAlign = 'center';
    const w = ctx.measureText(text).width + mida;
    ctx.fillStyle = fons; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.roundRect(x - w / 2, y - mida * 0.9, w, mida * 1.6, mida * 0.8); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = color; ctx.fillText(text, x, y + mida * 0.35);
  }

  // el paisatge sempre omple la pantalla: no es pot arrossegar més enllà de les vores de la imatge
  function limita() {
    const amp = canvas.clientWidth, alt = canvas.clientHeight;
    escala = Math.max(escala, amp / FONS.w, alt / FONS.h);
    despl.x = Math.min(0, Math.max(amp - FONS.w * escala, despl.x));
    despl.y = Math.min(0, Math.max(alt - FONS.h * escala, despl.y));
  }
  function dibuixa() {
    limita();
    const dpr = window.devicePixelRatio || 1, amp = canvas.clientWidth, alt = canvas.clientHeight;
    if (canvas.width !== Math.round(amp * dpr) || canvas.height !== Math.round(alt * dpr)) { canvas.width = Math.round(amp * dpr); canvas.height = Math.round(alt * dpr); }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#2f6f9e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * despl.x, dpr * despl.y);
    const fons = img(FONS.src);
    if (fons) ctx.drawImage(fons, 0, 0, FONS.w, FONS.h);
    dibuixaCarrers();
    for (const t of PARCELLES_MON) dibuixaParcella(t);
    // l'objectiu actual (on has d'anar) parpelleja
    const obj = objectiu && parcellaPerId(objectiu);
    if (obj) {
      const f = 0.5 + 0.5 * Math.sin(performance.now() / 250);
      rombe(obj.a, obj.b, S, S); ctx.lineWidth = 4 + f * 3; ctx.strokeStyle = `rgba(242,137,29,${0.5 + f * 0.5})`; ctx.stroke();
      demana();
    }
  }

  // ---------- interacció (desplaçar, zoom, clic) ----------
  const aMon = (sx, sy) => { const r = canvas.getBoundingClientRect(); return { x: (sx - r.left - despl.x) / escala, y: (sy - r.top - despl.y) / escala }; };
  function parcellaA(sx, sy) {
    const m = aMon(sx, sy), { a, b } = DE_P(m.x, m.y);
    return PARCELLES_MON.find((t) => a >= t.a && a <= t.a + S && b >= t.b && b <= t.b + S) || null;
  }
  function zoom(factor, cx, cy) {
    const r = canvas.getBoundingClientRect();
    cx ??= r.width / 2; cy ??= r.height / 2;
    const nova = Math.min(5, Math.max(0.25, escala * factor));
    despl.x = cx - (cx - despl.x) * (nova / escala); despl.y = cy - (cy - despl.y) * (nova / escala);
    escala = nova; demana();
  }
  const punters = new Map();
  let inici = null, arrossegat = false, pinca = null;
  canvas.addEventListener('pointerdown', (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 1) { inici = { x: ev.clientX, y: ev.clientY, dx: despl.x, dy: despl.y }; arrossegat = false; }
    if (punters.size === 2) { const [a, b] = [...punters.values()]; pinca = { d: Math.hypot(a.x - b.x, a.y - b.y), escala }; arrossegat = true; }
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!punters.has(ev.pointerId)) { canvas.style.cursor = parcellaA(ev.clientX, ev.clientY) ? 'pointer' : ''; return; }
    punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 2 && pinca) {
      const [a, b] = [...punters.values()]; const r = canvas.getBoundingClientRect();
      zoom((pinca.escala * Math.hypot(a.x - b.x, a.y - b.y) / pinca.d) / escala, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); return;
    }
    if (!inici) return;
    const mx = ev.clientX - inici.x, my = ev.clientY - inici.y;
    if (!arrossegat && Math.hypot(mx, my) < 6) return;
    arrossegat = true; canvas.classList.add('arrossegant');
    despl.x = inici.dx + mx; despl.y = inici.dy + my; demana();
  });
  const acaba = (ev) => {
    const clic = punters.size === 1 && !arrossegat && inici;
    punters.delete(ev.pointerId);
    if (punters.size < 2) pinca = null;
    if (!punters.size) { inici = null; canvas.classList.remove('arrossegant'); }
    if (clic && ev.type === 'pointerup') {
      const t = parcellaA(ev.clientX, ev.clientY);
      onClic?.({ cella: t ? { tipus: 'terreny', id: t.id } : null, local: t ? locals[t.id] || null : null });
    }
  };
  canvas.addEventListener('pointerup', acaba);
  canvas.addEventListener('pointercancel', acaba);
  canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); const r = canvas.getBoundingClientRect(); zoom(ev.deltaY < 0 ? 1.12 : 1 / 1.12, ev.clientX - r.left, ev.clientY - r.top); }, { passive: false });
  window.addEventListener('resize', demana);

  function centrarPunt(x, y, e) {
    const r = canvas.getBoundingClientRect();
    if (e) escala = e;
    despl.x = r.width / 2 - x * escala; despl.y = r.height / 2 + 20 - y * escala;
    demana();
  }
  function vistaTot() {
    const r = canvas.getBoundingClientRect();
    centrarPunt(FONS.w / 2, FONS.h / 2 - 20, Math.max(r.width / FONS.w, r.height / FONS.h));
  }
  return {
    setLocals(mapa, uid) { jo = uid; locals = { ...mapa }; demana(); },
    setObjectiu(id) { objectiu = id; demana(); },
    zoom,
    centrarEn(id) {
      const t = parcellaPerId(id); if (!t) return;
      const c = P(t.a + S / 2, t.b + S / 2), r = canvas.getBoundingClientRect();
      centrarPunt(c.x, c.y, Math.max(escala, Math.min(3, r.width / 600)));
    },
    vistaTot,
    // «el meu parc»: centra el parc de l'empresa (o tot el mapa si encara no en té)
    vistaPoble() { const meu = Object.entries(locals).find(([, l]) => l.uid === jo && l.tipus === 'parc'); if (meu) this.centrarEn(meu[0]); else vistaTot(); },
  };
}
