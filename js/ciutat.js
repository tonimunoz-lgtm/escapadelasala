// =============================================================
//  LA CIUTAT: un Matadepera esquemàtic, comú per a tota la classe.
//  - Carrers amb noms reals i els edificis principals al seu lloc aproximat.
//  - Al sud, per la Carretera de Terrassa, una zona de Terrassa amb els
//    serveis que no hi ha al poble (Notaria, Hisenda, Seguretat Social,
//    Registre Mercantil) i un polígon industrial.
//  - Al nord, el Parc Natural de Sant Llorenç del Munt i l'Obac.
//  Per moure un edifici, canvia'n les coordenades a EDIFICIS_CIUTAT.
// =============================================================
import { imgNegoci, imgLogo, SECTORS_NEGOCI } from './dades.js';

export const W = 236;
const DZ = 14;
const MARGE = 0.08;
export const iso = (u, v) => ({ x: (u - v) * W / 2, y: (u + v) * W / 4 });
const clau = (X, Y) => `${X},${Y}`;
const hash = (X, Y) => { let h = (X * 374761393 + Y * 668265263) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return h % 1000; };

// ---------- Plànol ----------
// Illes de 3x3 caselles separades per carrers (cada 4 caselles).
// Poble: illes bx 0..4, by 0..3  (caselles X 0..20, Y 0..16)
// Terrassa: illes bx 1..3, by 5..6 (caselles X 4..16, Y 20..28), unida per la Ctra. de Terrassa (X = 8)
const POBLE = { bx: [0, 4], by: [0, 3] };
const TERRASSA = { bx: [1, 3], by: [5, 6] };
const esIlla = (bx, by, z) => bx >= z.bx[0] && bx <= z.bx[1] && by >= z.by[0] && by <= z.by[1];

export const CARRERS = {
  h: { 0: 'Passeig d\'Àngel Guimerà', 4: 'Carrer de Sant Llorenç', 8: 'Carrer de Sant Joan', 12: 'Avinguda del Mas Sot', 16: 'Carrer de Joan Paloma', 20: 'Rambla d\'Ègara (Terrassa)', 24: 'Carrer del Polígon', 28: 'Carrer de Colom (Terrassa)' },
  v: { 0: 'Carrer de Sant Miquel', 4: 'Carrer de Pere Aldavert', 8: 'Carretera de Terrassa', 12: 'Carrer de Jaume Faura', 16: 'Carrer de Sant Ramon', 20: 'Carrer de Can Vinyals' },
};

// Serveis i edificis singulars: [id, X, Y, mida, imatge, nom, servei]
// servei = edifici on es fan tràmits (gestoria, notaria, registre, banc, hisenda, seguretat-social, ajuntament)
export const EDIFICIS_CIUTAT = [
  // Centre: Ajuntament, plaça, serveis
  ['ajuntament', 9, 5, 2, 'img/ciutat/ajuntament.webp', 'Ajuntament de Matadepera', 'ajuntament'],
  ['placa-ajuntament', 9, 9, 2, 'img/ciutat/placa-font.webp', 'Plaça de l\'Ajuntament', null],
  ['gestoria', 11, 5, 1, 'img/ciutat/gestoria.webp', 'Gestoria', 'gestoria'],
  ['banc-sabadell', 11, 7, 1, 'img/ciutat/banc.webp', 'Banc (c. Sant Joan, 99)', 'banc'],
  ['caixabank', 7, 9, 1, 'img/ciutat/banc.webp', 'Banc (Ctra. de Terrassa, 23)', 'banc'],
  ['esglesia', 11, 11, 1, 'img/ciutat/esglesia.webp', 'Església', null],
  ['aparcament', 10, 11, 1, 'img/ciutat/aparcament.webp', 'Aparcament', null],
  ['cap', 5, 11, 1, 'img/ciutat/cap.webp', 'CAP Matadepera', null],
  // Casal de Cultura (c. Pere Aldavert)
  ['casal', 3, 5, 1, 'img/ciutat/casal-cultura.webp', 'Casal de Cultura', null],
  ['placa-casal', 3, 6, 1, 'img/ciutat/jardi.webp', 'Plaça del Casal', null],
  ['parc-infantil-1', 2, 5, 1, 'img/ciutat/parc-infantil.webp', 'Parc infantil', null],
  // Educació i esport
  ['institut', 13, 13, 2, 'img/ciutat/institut.webp', 'Institut Matadepera', null],
  ['escola', 13, 1, 1, 'img/ciutat/escola.webp', 'Escola', null],
  ['piscina', 17, 13, 2, 'img/ciutat/piscina-municipal.webp', 'Piscines municipals', null],
  ['pavello', 1, 13, 2, 'img/ciutat/pavello.webp', 'Pavelló esportiu', null],
  ['padel', 3, 13, 1, 'img/ciutat/pistes-padel.webp', 'Pistes municipals', null],
  ['camp-futbol', 17, 1, 2, 'img/ciutat/camp-futbol.webp', 'Camp de futbol', null],
  ['mercat', 5, 13, 2, 'img/ciutat/mercat-municipal.webp', 'Mercat', null],
  ['hort', 1, 10, 1, 'img/ciutat/hort-urba.webp', 'Horts urbans', null],
  // Al peu de la muntanya
  ['golf', 9, -4, 2, 'img/ciutat/camp-golf.webp', 'Camp de golf de La Mola', null],
  // Terrassa
  ['notaria', 5, 21, 1, 'img/ciutat/notaria.webp', 'Notaria (Terrassa)', 'notaria'],
  ['registre', 6, 21, 1, 'img/ciutat/registre-mercantil.webp', 'Registre Mercantil (Terrassa)', 'registre'],
  ['hisenda', 7, 21, 1, 'img/ciutat/hisenda.webp', 'Agència Tributària (Terrassa)', 'hisenda'],
  ['seguretat-social', 5, 22, 1, 'img/ciutat/seguretat-social.webp', 'Seguretat Social (Terrassa)', 'seguretat-social'],
];

// Locals en lloguer, naus i solars: [id, X, Y, tipus]
// Al centre (carrer Sant Joan i voltants) hi passa més gent.
export const LOCALS_CIUTAT = [
  // carrer de Sant Joan, costat nord (Y=7) i sud (Y=9)
  ['L1', 5, 7, 'local'], ['L2', 6, 7, 'local'], ['L3', 7, 7, 'local'], ['L4', 9, 7, 'local'], ['L5', 10, 7, 'local'],
  ['L6', 13, 7, 'local'], ['L7', 14, 7, 'local'], ['L8', 15, 7, 'local'],
  ['L9', 5, 9, 'local'], ['L10', 6, 9, 'local'], ['L11', 11, 9, 'local'], ['L12', 13, 9, 'local'], ['L13', 14, 9, 'local'],
  // carrer de Sant Llorenç i Ctra. de Terrassa
  ['L14', 6, 3, 'local'], ['L15', 7, 5, 'local'], ['L16', 13, 3, 'local'], ['L17', 7, 11, 'local'], ['L18', 9, 13, 'local'],
  // barris
  ['L19', 2, 9, 'local'], ['L20', 18, 9, 'local'], ['L21', 19, 13, 'local'], ['L22', 2, 3, 'local'],
  // Terrassa: polígon
  ['N1', 9, 21, 'nau'], ['N2', 10, 21, 'nau'], ['N3', 11, 21, 'nau'], ['N4', 13, 21, 'nau'], ['N5', 14, 21, 'nau'],
  ['S1', 9, 25, 'solar'], ['S2', 10, 25, 'solar'], ['S3', 13, 25, 'solar'], ['S4', 14, 25, 'solar'], ['S5', 5, 25, 'solar'],
];

function zonaDe(X, Y) {
  if (Y >= 20) return 'poligon';
  if (X >= 4 && X <= 16 && Y >= 4 && Y <= 12) return 'centre';
  return 'barri';
}

// Construeix el mapa de caselles
function generarMapa() {
  const cel = new Map();
  const carreteres = new Set();
  const posa = (X, Y, c) => cel.set(clau(X, Y), c);
  const zones = [POBLE, TERRASSA];
  // carrers: vores de totes les illes de les dues zones
  for (const z of zones) {
    for (let by = z.by[0]; by <= z.by[1]; by++) for (let bx = z.bx[0]; bx <= z.bx[1]; bx++) {
      for (let k = 0; k <= 4; k++) {
        for (const [X, Y] of [[bx * 4 + k, by * 4], [bx * 4 + k, by * 4 + 4], [bx * 4, by * 4 + k], [bx * 4 + 4, by * 4 + k]]) carreteres.add(clau(X, Y));
      }
    }
  }
  // Carretera de Terrassa entre el poble i Terrassa
  for (let Y = 16; Y <= 20; Y++) carreteres.add(clau(8, Y));
  for (const k of carreteres) cel.set(k, { tipus: 'carretera' });
  // edificis singulars
  for (const [id, X, Y, mida, img, nom, servei] of EDIFICIS_CIUTAT) {
    for (let dx = 0; dx < mida; dx++) for (let dy = 0; dy < mida; dy++) {
      posa(X + dx, Y + dy, dx === mida - 1 && dy === mida - 1
        ? { tipus: 'edifici', id, img, nom, servei, mida, X, Y }
        : { tipus: 'part', id, X, Y, mida, nom, servei });
    }
  }
  for (const [id, X, Y, tipus] of LOCALS_CIUTAT) posa(X, Y, { tipus: 'local', id, sub: tipus, zona: zonaDe(X, Y), X, Y });
  // la resta de caselles: cases amb jardí, espais verds i pocs blocs baixos al centre
  const CASES = ['casa-1', 'casa-2', 'casa-3', 'casa-4', 'casa-piscina'];
  for (const z of zones) {
    for (let by = z.by[0]; by <= z.by[1]; by++) for (let bx = z.bx[0]; bx <= z.bx[1]; bx++) {
      for (let dx = 1; dx <= 3; dx++) for (let dy = 1; dy <= 3; dy++) {
        const X = bx * 4 + dx, Y = by * 4 + dy;
        if (cel.has(clau(X, Y))) continue;
        const h = hash(X, Y);
        let img;
        if (z === TERRASSA) img = h < 450 ? 'img/edificis/edifici-magatzem.webp' : h < 750 ? `img/ciutat/bloc-baix-${1 + ((h >> 4) % 2)}.webp` : 'img/ciutat/jardi.webp';
        else if (zonaDe(X, Y) === 'centre') img = h < 380 ? `img/ciutat/bloc-baix-${1 + ((h >> 4) % 2)}.webp` : h < 760 ? `img/ciutat/${CASES[h % 5]}.webp` : h < 900 ? 'img/ciutat/jardi.webp' : 'img/ciutat/gespa.webp';
        else img = h < 680 ? `img/ciutat/${CASES[h % 5]}.webp` : h < 800 ? 'img/ciutat/jardi.webp' : h < 900 ? 'img/ciutat/gespa.webp' : h < 950 ? 'img/ciutat/parc-infantil.webp' : 'img/ciutat/hort-urba.webp';
        posa(X, Y, { tipus: 'decor', img });
      }
    }
  }
  return { cel, carreteres };
}

export const MAPA = generarMapa();
export const localsPerId = Object.fromEntries(LOCALS_CIUTAT.map(([id, X, Y, sub]) => [id, { id, X, Y, sub, zona: zonaDe(X, Y) }]));
export const edificiPerServei = (servei) => EDIFICIS_CIUTAT.find((e) => e[6] === servei);
export const nomCarrerDe = (X, Y) => {
  // carrer més proper a la casella
  const opcions = [];
  for (const [y, nom] of Object.entries(CARRERS.h)) opcions.push([Math.abs(Y - y), nom]);
  for (const [x, nom] of Object.entries(CARRERS.v)) if (!(Y >= 20 && Number(x) > 16)) opcions.push([Math.abs(X - x), nom]);
  opcions.sort((a, b) => a[0] - b[0]);
  return opcions[0][1];
};

// Vehicles i persones (img/animacions). Els cotxes surten més sovint que els camions.
const VEHICLES = ['cotxe-1', 'cotxe-vermell', 'cotxe-blau', 'cotxe-groc', 'cotxe-blanc', 'cotxe-verd', 'cotxe-taronja', 'cotxe-gris',
  'cotxe-blau2', 'cabrio-vermell', 'cabrio-blau', 'familiar-beix', 'familiar-verd', 'furgoneta', 'furgoneta', 'camio', 'autobus'];
const AMPLADA_VEHICLE = { autobus: 175, camio: 150, furgoneta: 120 };
const NUM_PERSONES = 13;

// =============================================================
//  DIBUIX
// =============================================================
const COLORS = { asfalt: '#5d636b', vorera: '#c9ced5', linia: '#f2f2ee', carrero: '#d9d4c8', vorada: 'rgba(90,80,60,.35)' };

export function crearCiutat({ canvas, onClic }) {
  const ctx = canvas.getContext('2d');
  const imatges = new Map();
  let escala = 0.5, despl = { x: 0, y: 0 };
  let locals = {};          // id -> { uid, nom, logo, sector, fase, estat }
  let jo = null;            // uid
  let objectiu = null;      // id d'edifici o local a destacar (tutorial)
  let pendent = false;
  let patro = null;
  const { cel, carreteres } = MAPA;

  function img(src) {
    let im = imatges.get(src);
    if (!im) { im = new Image(); im.onload = demana; im.src = src; imatges.set(src, im); }
    return im.complete && im.naturalWidth ? im : null;
  }
  function demana() {
    if (pendent) return;
    pendent = true;
    requestAnimationFrame(() => { pendent = false; dibuixa(); });
  }

  function rombe(u, v, du = 1, dv = 1, dy = DZ) {
    const a = iso(u, v), b = iso(u + du, v), c = iso(u + du, v + dv), d = iso(u, v + dv);
    ctx.beginPath(); ctx.moveTo(a.x, a.y + dy); ctx.lineTo(b.x, b.y + dy); ctx.lineTo(c.x, c.y + dy); ctx.lineTo(d.x, d.y + dy); ctx.closePath();
  }

  function dibuixaCarretera(X, Y) {
    const n = carreteres.has(clau(X, Y - 1)), s = carreteres.has(clau(X, Y + 1));
    const w = carreteres.has(clau(X - 1, Y)), e = carreteres.has(clau(X + 1, Y));
    rombe(X, Y); ctx.fillStyle = COLORS.asfalt; ctx.fill();
    const v = 0.13;
    ctx.fillStyle = COLORS.vorera;
    if (!n) { rombe(X, Y, 1, v); ctx.fill(); }
    if (!s) { rombe(X, Y + 1 - v, 1, v); ctx.fill(); }
    if (!w) { rombe(X, Y, v, 1); ctx.fill(); }
    if (!e) { rombe(X + 1 - v, Y, v, 1); ctx.fill(); }
    if (escala < 0.3) return;
    const c = iso(X + 0.5, Y + 0.5);
    const mig = [[n, iso(X + 0.5, Y)], [s, iso(X + 0.5, Y + 1)], [w, iso(X, Y + 0.5)], [e, iso(X + 1, Y + 0.5)]];
    ctx.strokeStyle = COLORS.linia; ctx.lineWidth = 3; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -7;
    for (const [ok, p] of mig) if (ok) { ctx.beginPath(); ctx.moveTo(p.x, p.y + DZ); ctx.lineTo(c.x, c.y + DZ); ctx.stroke(); }
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
  }

  // Dibuixa una imatge isomètrica plana, retallada al seu rombe.
  // vella: imatges antigues (punta inferior del rombe a y=231, rombe 233 px)
  function sprite(src, X, Y, { mida = 1, marge = MARGE, base = '#8cbf45', alfa = 1, vella = false } = {}) {
    const im = img(src);
    if (marge) { rombe(X, Y, mida, mida); ctx.fillStyle = COLORS.carrero; ctx.fill(); }
    const u = X + marge, v = Y + marge, t = mida - 2 * marge;
    if (base) { rombe(u, v, t, t); ctx.fillStyle = base; ctx.fill(); }
    const a = iso(u, v), b = iso(u + t, v), c = iso(u + t, v + t), d = iso(u, v + t);
    if (marge) { ctx.strokeStyle = COLORS.vorada; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x, d.y + DZ); ctx.lineTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); ctx.stroke(); }
    if (im) {
      const S = im.naturalWidth;
      const cara = vella ? 233 : S * 236 / 256;          // amplada del rombe dins la imatge
      const puntaY = vella ? 231 : S * 250 / 256;         // y de la punta inferior del rombe
      const k = (W * t) / cara;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(d.x - W, d.y + DZ); ctx.lineTo(d.x, d.y + DZ); ctx.lineTo(c.x, c.y + DZ); ctx.lineTo(b.x, b.y + DZ); ctx.lineTo(b.x + W, b.y + DZ); ctx.lineTo(b.x + W, b.y - 900); ctx.lineTo(d.x - W, d.y - 900);
      ctx.closePath(); ctx.clip();
      if (alfa !== 1) ctx.globalAlpha = alfa;
      ctx.drawImage(im, c.x - (S / 2) * k, c.y + DZ - puntaY * k, S * k, S * k);
      ctx.restore();
    }
    if (marge) { ctx.strokeStyle = COLORS.vorada; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x, d.y + DZ); ctx.lineTo(c.x, c.y + DZ); ctx.lineTo(b.x, b.y + DZ); ctx.stroke(); }
  }

  function pastilla(x, y, text, { fons = '#fff', color = '#0a3566', mida = 16, icona = null } = {}) {
    ctx.font = `800 ${mida}px "Baloo 2", system-ui, sans-serif`;
    const tw = ctx.measureText(text).width, ic = icona ? mida * 1.6 : 0;
    const w = tw + ic + mida * 1.1, h = mida * 1.7;
    ctx.fillStyle = fons; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    if (icona) { const im = img(icona); if (im) ctx.drawImage(im, x - w / 2 + mida * 0.35, y - ic / 2, ic, ic); }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x + ic / 2, y + mida * 0.08);
  }

  function srcLocal(c) {
    const l = locals[c.id];
    if (!l) return c.sub === 'solar' ? 'img/locals/solar-en-venda.webp' : c.sub === 'nau' ? 'img/locals/nau-es-lloga.webp' : 'img/locals/local-es-lloga.webp';
    if (l.estat === 'construint') return `img/locals/construccio-${Math.min(3, l.faseObra || 1)}.webp`;
    if (l.estat === 'obres' || l.estat === 'contracte') return c.sub === 'solar' ? 'img/locals/solar-en-venda.webp' : 'img/locals/local-obres.webp';
    return imgNegoci(l.sector, l.fase);
  }

  // ---------- vianants i cotxes ----------
  const vianants = [];
  const cotxes = [];
  const llistaCarreteres = [...carreteres].map((k) => k.split(',').map(Number));
  const veinesCarretera = (X, Y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => carreteres.has(clau(X + dx, Y + dy)));
  function nouAgent(tipus) {
    const [X, Y] = llistaCarreteres[Math.floor(Math.random() * llistaCarreteres.length)];
    const dirs = veinesCarretera(X, Y);
    const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)] || [1, 0];
    const vehicles = VEHICLES;
    return {
      X, Y, dx, dy, t: Math.random(),
      vel: tipus === 'cotxe' ? 0.9 + Math.random() * 0.5 : 0.22 + Math.random() * 0.1,
      costat: tipus === 'cotxe' ? 0.18 : (Math.random() < 0.5 ? 0.4 : -0.4),
      img: tipus === 'cotxe' ? vehicles[Math.floor(Math.random() * vehicles.length)] : `persona-${1 + Math.floor(Math.random() * NUM_PERSONES)}`,
      tipus, fade: 1,
    };
  }
  for (let i = 0; i < 14; i++) cotxes.push(nouAgent('cotxe'));
  for (let i = 0; i < 46; i++) vianants.push(nouAgent('persona'));

  let darrer = performance.now();
  function mouAgents(dt) {
    for (const a of [...cotxes, ...vianants]) {
      if (a.entrant) { a.fade -= dt * 1.5; if (a.fade <= 0) Object.assign(a, nouAgent(a.tipus)); continue; }
      a.t += a.vel * dt;
      while (a.t >= 1) {
        a.t -= 1; a.X += a.dx; a.Y += a.dy;
        // vianant que passa davant d'un negoci obert: potser hi entra
        if (a.tipus === 'persona') {
          for (const [lx, ly] of [[a.X + a.dy, a.Y - a.dx], [a.X - a.dy, a.Y + a.dx]]) {
            const c = cel.get(clau(lx, ly));
            const l = c?.tipus === 'local' && locals[c.id];
            if (l && l.estat === 'obert' && Math.random() < 0.25 * (l.atractiu || 1)) { a.entrant = true; a.cap = [lx, ly]; }
          }
        }
        const opcions = veinesCarretera(a.X, a.Y).filter(([dx, dy]) => !(dx === -a.dx && dy === -a.dy));
        if (!opcions.length) { a.dx = -a.dx; a.dy = -a.dy; continue; }
        const recte = opcions.find(([dx, dy]) => dx === a.dx && dy === a.dy);
        [a.dx, a.dy] = recte && Math.random() < 0.7 ? recte : opcions[Math.floor(Math.random() * opcions.length)];
      }
    }
  }

  // Les imatges tenen 4 direccions en aquest ordre: ↙ (avall-esquerra), ↘, ↗, ↖
  const direccio = (a) => (a.dy === 1 ? 0 : a.dx === 1 ? 1 : a.dy === -1 ? 2 : 3);
  function dibuixaAgent(a) {
    const u = a.X + 0.5 + a.dx * (a.t - 0.5) + (-a.dy) * a.costat;
    const v = a.Y + 0.5 + a.dy * (a.t - 0.5) + (a.dx) * a.costat;
    const { x, y } = iso(u, v);
    const im = img(`img/animacions/${a.img}.webp`);
    if (!im) return;
    const dir = direccio(a);
    ctx.save();
    ctx.globalAlpha = a.entrant ? Math.max(0, a.fade) : 1;
    if (a.tipus === 'cotxe') {
      const fw = im.naturalWidth / 4, fh = im.naturalHeight;
      const ample = AMPLADA_VEHICLE[a.img] || 120;
      const k = ample / fw;
      ctx.drawImage(im, dir * fw, 0, fw, fh, x - (fw * k) / 2, y + DZ - fh * k + 10, fw * k, fh * k);
    } else {
      const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4;
      const frame = Math.floor((performance.now() / 150 + a.X * 3) % 4);
      ctx.drawImage(im, frame * fw, dir * fh, fw, fh, x - 20, y + DZ - 58, 40, 60);
    }
    ctx.restore();
  }

  function dibuixa() {
    const dpr = window.devicePixelRatio || 1;
    const amp = canvas.clientWidth, alt = canvas.clientHeight;
    if (canvas.width !== Math.round(amp * dpr) || canvas.height !== Math.round(alt * dpr)) { canvas.width = Math.round(amp * dpr); canvas.height = Math.round(alt * dpr); }
    const ara = performance.now();
    const dt = Math.min(0.1, (ara - darrer) / 1000); darrer = ara;
    mouAgents(dt);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#7cb342'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * despl.x, dpr * despl.y);
    const x0 = -despl.x / escala, y0 = -despl.y / escala, x1 = (amp - despl.x) / escala, y1 = (alt - despl.y) / escala;
    const gespa = img('img/mapa/fons-mapa-tile.webp');
    if (gespa) { if (!patro) patro = ctx.createPattern(gespa, 'repeat'); ctx.fillStyle = patro; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    const cella = (x, y) => ({ u: (x / (W / 2) + y / (W / 4)) / 2, v: (y / (W / 4) - x / (W / 2)) / 2 });
    const cs = [cella(x0, y0), cella(x1, y0), cella(x0, y1), cella(x1, y1)];
    const minX = Math.floor(Math.min(...cs.map((c) => c.u))) - 3, maxX = Math.ceil(Math.max(...cs.map((c) => c.u))) + 2;
    const minY = Math.floor(Math.min(...cs.map((c) => c.v))) - 3, maxY = Math.ceil(Math.max(...cs.map((c) => c.v))) + 4;

    // agents ordenats per diagonal per pintar-los al seu lloc
    const perDiag = new Map();
    if (escala > 0.22) for (const a of [...cotxes, ...vianants]) {
      const d = Math.floor(a.X + a.dx * (a.t - 0.5) + a.Y + a.dy * (a.t - 0.5) + 1);
      if (!perDiag.has(d)) perDiag.set(d, []);
      perDiag.get(d).push(a);
    }
    const etiquetes = [];
    for (let d = minX + minY; d <= maxX + maxY; d++) {
      for (let X = Math.max(minX, d - maxY); X <= Math.min(maxX, d - minY); X++) {
        const Y = d - X;
        const c = cel.get(clau(X, Y));
        if (!c) {
          // bosc del Parc Natural al nord i arbres pel camp
          const bosc = Y < 0 && Y > -9 && X > -6 && X < 26;
          if (escala > 0.2 && (bosc ? hash(X, Y) < 820 : hash(X, Y) < 110)) {
            sprite(['img/mapa/decor-arbres.webp', 'img/mapa/decor-arbres-2.webp', 'img/mapa/decor-arbres-3.webp'][hash(Y, X) % 3], X, Y, { marge: 0, base: '#8cbf45', vella: true });
          }
          continue;
        }
        if (c.tipus === 'carretera') { dibuixaCarretera(X, Y); continue; }
        if (c.tipus === 'part') continue;
        if (c.tipus === 'edifici') {
          const vell = c.img.includes('/edificis/');
          sprite(c.img, c.X, c.Y, { mida: c.mida, vella: vell });
          etiquetes.push(['edifici', c]);
          continue;
        }
        if (c.tipus === 'local') {
          const l = locals[c.id];
          sprite(srcLocal(c), X, Y, { base: c.sub === 'solar' ? '#8cbf45' : '#c9c4b8' });
          etiquetes.push(['local', c, l]);
          continue;
        }
        if (c.tipus === 'decor') sprite(c.img, X, Y, { vella: c.img.includes('/mapa/') || c.img.includes('/edificis/') });
      }
      for (const a of perDiag.get(d) || []) dibuixaAgent(a);
    }

    // etiquetes
    const ms = Math.max(14, 14 / Math.max(escala, 0.35));
    for (const [tipus, c, l] of etiquetes) {
      const mid = c.mida || 1;
      const { x, y } = iso(c.X + mid / 2, c.Y + mid / 2);
      const destacat = objectiu && (objectiu === c.id || objectiu === c.servei);
      if (destacat) {
        const salt = Math.sin(performance.now() / 220) * 10;
        pastilla(x, y - 150 * mid + salt, '▼ Ves aquí', { fons: '#f2891d', color: '#fff', mida: ms * 1.15 });
      }
      if (tipus === 'edifici' && (c.servei || escala >= 0.45)) pastilla(x, y + 40, c.nom, { fons: c.servei ? '#0a3566' : '#ffffff', color: c.servei ? '#fff' : '#0a3566', mida: ms * 0.85 });
      if (tipus === 'local' && l && escala >= 0.3) {
        pastilla(x, y + 40, l.nom || 'Empresa', { fons: l.uid === jo ? '#f2891d' : '#ffffff', color: l.uid === jo ? '#fff' : '#0a3566', mida: ms * 0.8, icona: imgLogo(l.logo || 1) });
      }
    }
    // noms dels carrers
    if (escala >= 0.3) {
      ctx.save();
      for (const [y, nom] of Object.entries(CARRERS.h)) {
        const Y = Number(y), X = Y >= 20 ? 6 : 2;
        if (!carreteres.has(clau(X, Y))) continue;
        const p = iso(X + 0.5, Y + 0.5);
        ctx.save(); ctx.translate(p.x, p.y + DZ); ctx.transform(1, 0.5, 0, 1, 0, 0);
        ctx.font = '700 15px "Nunito", system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(nom, 0, 0); ctx.restore();
      }
      for (const [x, nom] of Object.entries(CARRERS.v)) {
        const X = Number(x), Y = X === 8 ? 17 : 2;
        if (!carreteres.has(clau(X, Y))) continue;
        const p = iso(X + 0.5, Y + 0.5);
        ctx.save(); ctx.translate(p.x, p.y + DZ); ctx.transform(1, -0.5, 0, 1, 0, 0);
        ctx.font = '700 15px "Nunito", system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(nom, 0, 0); ctx.restore();
      }
      ctx.restore();
    }
    // rètols de zona quan es mira de lluny
    if (escala < 0.45) {
      const m = 18 / escala;
      const p1 = iso(10, -5); pastilla(p1.x, p1.y, 'Parc Natural de Sant Llorenç del Munt i l\'Obac', { fons: 'rgba(42,116,35,.92)', color: '#fff', mida: m });
      const p2 = iso(10.5, 8.5); pastilla(p2.x, p2.y - 200, 'MATADEPERA', { fons: '#0a3566', color: '#fff', mida: m * 1.3 });
      const p3 = iso(10.5, 24.5); pastilla(p3.x, p3.y - 200, 'TERRASSA', { fons: '#0a3566', color: '#fff', mida: m * 1.3 });
    }
  }

  // ---------- interacció (desplaçar, zoom, clic) ----------
  function casellaA(sx, sy) {
    const r = canvas.getBoundingClientRect();
    const x = (sx - r.left - despl.x) / escala, y = (sy - r.top - despl.y) / escala - DZ;
    return { X: Math.floor((x / (W / 2) + y / (W / 4)) / 2), Y: Math.floor((y / (W / 4) - x / (W / 2)) / 2) };
  }
  function zoom(factor, cx, cy) {
    const r = canvas.getBoundingClientRect();
    cx ??= r.width / 2; cy ??= r.height / 2;
    const nova = Math.min(1.6, Math.max(0.08, escala * factor));
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
    if (!punters.has(ev.pointerId)) return;
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
      const { X, Y } = casellaA(ev.clientX, ev.clientY);
      let c = cel.get(clau(X, Y)) || null;
      if (c?.tipus === 'part') c = cel.get(clau(c.X + c.mida - 1, c.Y + c.mida - 1));
      onClic?.({ X, Y, cella: c, local: c?.tipus === 'local' ? locals[c.id] || null : null });
    }
  };
  canvas.addEventListener('pointerup', acaba);
  canvas.addEventListener('pointercancel', acaba);
  canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); const r = canvas.getBoundingClientRect(); zoom(ev.deltaY < 0 ? 1.12 : 1 / 1.12, ev.clientX - r.left, ev.clientY - r.top); }, { passive: false });
  window.addEventListener('resize', demana);
  (function bucle() { demana(); setTimeout(bucle, 60); })();

  function centrar(X, Y, e) {
    const r = canvas.getBoundingClientRect();
    if (e) escala = e;
    const p = iso(X, Y);
    despl.x = r.width / 2 - p.x * escala; despl.y = r.height / 2 + 30 - (p.y + DZ) * escala;
    demana();
  }

  return {
    setLocals(mapa, uid) {
      jo = uid;
      locals = {};
      for (const [id, l] of Object.entries(mapa)) {
        const s = SECTORS_NEGOCI[l.sector];
        locals[id] = { ...l, atractiu: s ? Math.min(3, (s.demanda / 600)) * (l.fase || 1) / 2 : 1 };
      }
      demana();
    },
    setObjectiu(id) { objectiu = id; demana(); },
    zoom,
    centrar,
    centrarEn(id) {
      const e = EDIFICIS_CIUTAT.find((x) => x[0] === id || x[6] === id);
      if (e) return centrar(e[1] + e[3] / 2, e[2] + e[3] / 2, Math.max(escala, 0.5));
      const l = localsPerId[id];
      if (l) centrar(l.X + 0.5, l.Y + 0.5, Math.max(escala, 0.5));
    },
    vistaPoble() { const r = canvas.getBoundingClientRect(); centrar(10.5, 8.5, r.width < 700 ? 0.32 : 0.45); },
    vistaTot() { const r = canvas.getBoundingClientRect(); centrar(10.5, 12, Math.min(0.4, Math.max(0.1, Math.min(r.width / (W * 34), r.height / (W * 20))))); },
  };
}
