// =============================================================
//  EL TEU PARC D'ATRACCIONS (fase 1)
//  - Editor: camins, atraccions, parades, serveis i decoració.
//  - Visitants que caminen, fan cua, mengen, embruten i opinen.
//  - Economia: entrades, preus de cada atracció i parada, personal,
//    manteniment, préstec i informe de cada dia.
//  El parc funciona mentre el tens obert (es pot posar en pausa).
// =============================================================
import { h, avis } from './ui.js';
import {
  MIDA_PARC as N, ENTRADA, MINUTS_DIA, SEGONS_PER_MINUT, HORA_OBERTURA, ULTIMA_ENTRADA, INTERES_DIARI,
  COST_CAMI, RETORN_ENDERROC, PERSONAL_PARC, CATEGORIES, OBJECTES, srcObjecte, dibuixaObjecte,
} from './parc-dades.js';

const WP = 128;                       // amplada d'una casella del parc (unitats del món)
const iso = (u, v) => ({ x: (u - v) * WP / 2, y: (u + v) * WP / 4 });
const k2 = (x, y) => `${x},${y}`;
const dins = (x, y) => x >= 0 && y >= 0 && x < N && y < N;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur = (n) => `${fmt.format(n)} €`;
const eur2 = (n) => `${fmt2.format(n)} €`;
const hora = (m) => { const t = HORA_OBERTURA * 60 + Math.floor(m); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
const PERSONES = 21;
const VEINS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const QUEIXES = {
  car: ['💸', 'Els preus són massa cars', 'Abaixa els preus de les atraccions, del menjar o de l\'entrada.'],
  lavabo: ['🚻', 'No troben lavabos', 'Construeix lavabos al costat d\'un camí.'],
  gana: ['🍔', 'Tenen gana i no hi ha on menjar', 'Posa parades de menjar a prop dels camins.'],
  set: ['🥤', 'Tenen set i no hi ha begudes', 'Posa una parada de begudes.'],
  brut: ['🗑️', 'El parc està brut', 'Contracta netejadors i posa papereres als camins.'],
  cansat: ['😴', 'Estan cansats i no hi ha on seure', 'Posa bancs al costat dels camins.'],
  cua: ['⏳', 'Les cues són massa llargues', 'Construeix més atraccions perquè la gent es reparteixi.'],
  avaria: ['🔧', 'Hi ha atraccions espatllades', 'Contracta mecànics o repara-les tu.'],
  avorrit: ['🥱', 'S\'avorreixen: hi ha poques atraccions', 'Construeix atraccions noves.'],
};

export function obrirParc({ estat, desar, publicar, onTanca }) {
  const parc = estat.parc;
  parc.brossa ??= {}; parc.historial ??= []; parc.personal ??= { mecanic: 0, netejador: 0, animador: 0 };
  parc.preus ??= { entrada: 5 }; parc.totals ??= { visitants: 0, ingressos: 0, despeses: 0 };

  // ---------- DOM ----------
  const canvas = h('canvas', { class: 'parc-canvas', 'aria-label': 'El teu parc d\'atraccions' });
  const vDiners = h('strong', {}), vVisit = h('strong', {}), vSatisf = h('strong', {}), vDia = h('strong', {});
  const botoVel = [0, 1, 2, 4].map((v) => h('button', { class: 'parc-vel', title: v ? `Velocitat x${v}` : 'Pausa', onclick: () => posaVelocitat(v) }, v === 0 ? '⏸' : v === 1 ? '▶' : v === 2 ? '⏩' : '⏭'));
  const barra = h('header', { class: 'parc-barra' },
    h('button', { class: 'btn parc-tornar', onclick: tancar }, '← Ciutat'),
    h('span', { class: 'parc-nom' }, `🎢 ${parc.nom}`),
    h('span', { class: 'parc-dada', title: 'Diners del parc' }, '💶 ', vDiners),
    h('span', { class: 'parc-dada', title: 'Visitants dins del parc' }, '👥 ', vVisit),
    h('span', { class: 'parc-dada', title: 'Satisfacció mitjana dels visitants' }, '😊 ', vSatisf),
    h('span', { class: 'parc-dada', title: 'Dia i hora' }, '📅 ', vDia),
    h('span', { class: 'parc-vels' }, ...botoVel));
  const EINES = [
    ['mou', '✋', 'Mou'],
    ['cami', '🟫', 'Camins'],
    ...CATEGORIES.map(([id, nom, img]) => [id, img, nom]),
    ['enderroca', '🧨', 'Enderroca'],
    ['finances', '💶', 'Diners'],
    ['personal', '👷', 'Personal'],
  ];
  const botonsEina = {};
  const eines = h('nav', { class: 'parc-eines' }, ...EINES.map(([id, ic, nom]) => {
    const b = h('button', { class: 'parc-eina', title: nom, onclick: () => triaEina(id) },
      ic.length > 3 ? h('img', { src: srcObjecte(ic), alt: '' }) : h('span', { class: 'parc-eina-ic' }, ic), h('span', {}, nom));
    botonsEina[id] = b;
    return b;
  }));
  const cataleg = h('div', { class: 'parc-cataleg', hidden: true });
  const info = h('aside', { class: 'parc-info', hidden: true });
  const ajuda = h('div', { class: 'parc-ajuda' });
  const zoom = h('div', { class: 'parc-zoom' },
    h('button', { onclick: () => zoomA(1.25) }, '+'), h('button', { onclick: () => zoomA(0.8) }, '−'), h('button', { onclick: encaixa, class: 'parc-zoom-text' }, 'Tot'));
  const arrel = h('div', { class: 'parc' }, canvas, barra, eines, cataleg, info, ajuda, zoom);
  document.body.append(arrel);
  const ctx = canvas.getContext('2d');

  // ---------- estat d'execució (no es desa) ----------
  let velocitat = 1, eina = 'mou', aColocar = null, hover = null;
  let escala = 0.5; const despl = { x: 0, y: 0 };
  const visitants = [], personal = [], textos = [];
  const rt = new Map();          // estat de cada atracció/parada: cua, muntats...
  let ocup = new Int32Array(N * N), acces = new Map(), bellesa = new Float32Array(N * N), paperera = new Uint8Array(N * N);
  let entradaAcces = [];
  let pendentArribada = 0, darrerFrame = performance.now(), viu = true, darrerDesat = Date.now(), informeObert = false;
  parc.avui ??= nouDia();

  function nouDia() {
    return { visitants: 0, entrades: 0, atraccions: 0, menjar: 0, costMenjar: 0, satisfSum: 0, satisfN: 0, queixes: {} };
  }

  // ---------- caches de la graella ----------
  const camins = () => new Set(parc.camins);
  let setCamins = camins();
  const esCami = (x, y) => setCamins.has(k2(x, y));
  function recalcula() {
    setCamins = camins();
    ocup = new Int32Array(N * N);
    for (const p of setCamins) { const [x, y] = p.split(',').map(Number); if (dins(x, y)) ocup[y * N + x] = -1; }
    for (const o of parc.objectes) {
      const m = OBJECTES[o.t].mida;
      for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) if (dins(o.x + dx, o.y + dy)) ocup[(o.y + dy) * N + o.x + dx] = o.id;
    }
    acces = new Map();
    bellesa = new Float32Array(N * N); paperera = new Uint8Array(N * N);
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t], m = d.mida, a = [];
      for (let i = 0; i < m; i++) for (const [x, y] of [[o.x + i, o.y - 1], [o.x + i, o.y + m], [o.x - 1, o.y + i], [o.x + m, o.y + i]]) if (dins(x, y) && esCami(x, y)) a.push([x, y]);
      acces.set(o.id, a);
      if (d.bellesa || d.paperera) {
        for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
          const x = o.x + dx, y = o.y + dy;
          if (!dins(x, y)) continue;
          if (d.bellesa) bellesa[y * N + x] += d.bellesa;
          if (d.paperera) paperera[y * N + x] = 1;
        }
      }
      if (!rt.has(o.id)) rt.set(o.id, { cua: [], muntats: [], fi: 0, servei: 0 });
    }
    const ent = parc.objectes.find((o) => o.t === 'entrada');
    entradaAcces = ent ? acces.get(ent.id) : [];
    for (const id of [...rt.keys()]) if (!parc.objectes.some((o) => o.id === id)) rt.delete(id);
  }
  recalcula();
  const objecte = (id) => parc.objectes.find((o) => o.id === id);
  const accessible = (o) => (acces.get(o.id) || []).length > 0;

  // Camí més curt (per camins) des de (x,y) fins a qualsevol casella de l'objectiu
  function ruta(x, y, objectius) {
    if (!objectius.length) return null;
    const meta = new Set(objectius.map(([a, b]) => a + b * N));
    const prev = new Int32Array(N * N).fill(-2);
    const ini = x + y * N; prev[ini] = -1;
    const cua = [ini];
    for (let i = 0; i < cua.length; i++) {
      const c = cua[i];
      if (meta.has(c)) {
        const r = []; for (let p = c; p !== -1; p = prev[p]) r.push([p % N, Math.floor(p / N)]);
        return r.reverse();
      }
      const cx = c % N, cy = Math.floor(c / N);
      for (const [dx, dy] of VEINS) {
        const nx = cx + dx, ny = cy + dy, n = nx + ny * N;
        if (dins(nx, ny) && prev[n] === -2 && ocup[n] === -1) { prev[n] = c; cua.push(n); }
      }
    }
    return null;
  }

  // ---------- atractiu del parc i arribades ----------
  function atractiu() {
    let a = 0; const tipus = new Set();
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t];
      if (!accessible(o)) continue;
      if (d.cat === 'atraccio' && !o.avariat) a += d.atractiu;
      if (d.cat === 'menjar') tipus.add(o.t);
      if (o.t === 'informacio') a += 1;
    }
    return a + tipus.size * 0.4;
  }
  const preuJustEntrada = (a) => 2 + 1.5 * Math.pow(Math.max(a, 0.5), 0.7);
  function ritmeArribades(minut) {
    if (minut >= ULTIMA_ENTRADA || !entradaAcces.length) return 0;
    const a = atractiu();
    if (a <= 0) return 0;
    const horaF = 0.45 + 0.85 * Math.sin(Math.PI * minut / ULTIMA_ENTRADA);
    const preuF = clamp(1.6 - parc.preus.entrada / preuJustEntrada(a), 0.03, 1.3);
    const repF = 0.4 + parc.reputacio / 80;
    return 0.065 * a * horaF * preuF * repF;
  }

  // ---------- visitants ----------
  function nouVisitant() {
    const [sx, sy] = entradaAcces[Math.floor(Math.random() * entradaAcces.length)];
    const v = {
      x: sx, y: sy, fx: ENTRADA.x + 0.5 + Math.random(), fy: ENTRADA.y + 1.2, ruta: [[sx, sy]], pas: 0,
      estat: 'camina', objectiu: null, img: `persona-${1 + Math.floor(Math.random() * PERSONES)}`, dir: 2,
      gana: 5 + Math.random() * 35, set: 5 + Math.random() * 35, lavabo: Math.random() * 25, energia: 75 + Math.random() * 25,
      satisf: 62, pressupost: 15 + Math.random() * 45, brossa: 0, passos: 0, temps: 0, vist: new Set(), sense: {}, espera: 0,
    };
    parc.diners += parc.preus.entrada; v.pressupost -= parc.preus.entrada;
    parc.avui.visitants += 1; parc.avui.entrades += parc.preus.entrada; parc.totals.visitants += 1; parc.totals.ingressos += parc.preus.entrada;
    if (parc.preus.entrada > 0) flota(ENTRADA.x + 1, ENTRADA.y + 0.5, `+${eur(parc.preus.entrada)}`, '#2a7423');
    visitants.push(v);
  }
  function pensa(v, clau) {
    v.pensament = { ic: QUEIXES[clau]?.[0] || clau, fins: performance.now() + 2600 };
    if (QUEIXES[clau]) parc.avui.queixes[clau] = (parc.avui.queixes[clau] || 0) + 1;
  }
  function flota(x, y, text, color) { textos.push({ x, y, text, color, ini: performance.now() }); if (textos.length > 40) textos.shift(); }

  // Tria què vol fer ara el visitant
  function decideix(v, minut) {
    v.objectiu = null;
    const cansat = v.energia < 8, tard = minut >= MINUTS_DIA - 40, sensePressupost = v.pressupost < 1.5;
    if (tard || cansat || sensePressupost || v.satisf < 12 || (v.temps > 320 && Math.random() < 0.4)) return marxa(v);
    const cerca = (filtre, clau) => {
      const cands = parc.objectes.filter((o) => filtre(o) && accessible(o) && !o.avariat);
      if (!cands.length) { if (!v.sense[clau]) { pensa(v, clau); v.satisf -= 6; v.sense[clau] = 40; } return false; }
      const obj = new Map();
      for (const o of cands) for (const a of acces.get(o.id)) obj.set(k2(...a), o);
      const r = ruta(v.x, v.y, [...obj.keys()].map((s) => s.split(',').map(Number)));
      if (!r) { if (!v.sense[clau]) { pensa(v, clau); v.satisf -= 4; v.sense[clau] = 40; } return false; }
      const fi = r[r.length - 1];
      v.objectiu = obj.get(k2(...fi)).id; v.ruta = r; v.pas = 0; v.estat = 'camina';
      return true;
    };
    if (v.lavabo > 65 && !v.sense.lavabo && cerca((o) => o.t === 'lavabos', 'lavabo')) return;
    if (v.set > 60 && !v.sense.set && cerca((o) => o.t === 'begudes' || o.t === 'gelats', 'set')) return;
    if (v.gana > 60 && !v.sense.gana && cerca((o) => OBJECTES[o.t].cat === 'menjar' && o.t !== 'begudes', 'gana')) return;
    if (v.energia < 30 && !v.sense.cansat && cerca((o) => OBJECTES[o.t].seient, 'cansat')) return;
    // una atracció: les que encara no ha provat tenen més opcions
    const atr = parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio' && accessible(o) && !o.avariat);
    if (atr.length) {
      let total = 0;
      const pes = atr.map((o) => { const p = OBJECTES[o.t].atractiu * (v.vist.has(o.id) ? 0.3 : 1) / (1 + rt.get(o.id).cua.length / 8); total += p; return p; });
      let r = Math.random() * total, tria = atr[0];
      for (let i = 0; i < atr.length; i++) { r -= pes[i]; if (r <= 0) { tria = atr[i]; break; } }
      if (v.vist.has(tria.id) && v.vist.size >= atr.length && v.temps > 150 && Math.random() < 0.35) return marxa(v);
      const rr = ruta(v.x, v.y, acces.get(tria.id));
      if (rr) { v.objectiu = tria.id; v.ruta = rr; v.pas = 0; v.estat = 'camina'; return; }
    } else if (!v.sense.avorrit) { pensa(v, 'avorrit'); v.satisf -= 8; v.sense.avorrit = 60; }
    // passeja una mica
    const vs = VEINS.map(([dx, dy]) => [v.x + dx, v.y + dy]).filter(([x, y]) => dins(x, y) && esCami(x, y));
    if (vs.length) { v.ruta = [[v.x, v.y], vs[Math.floor(Math.random() * vs.length)]]; v.pas = 0; v.estat = 'camina'; }
    else { v.estat = 'espera'; v.espera = 3; }
  }
  function marxa(v) {
    v.objectiu = 'sortida';
    const r = ruta(v.x, v.y, entradaAcces);
    if (r) { v.ruta = r; v.pas = 0; v.estat = 'camina'; } else { v.estat = 'fora'; }
  }
  // Ha arribat on volia anar
  function arriba(v) {
    if (v.objectiu === 'sortida') { v.estat = 'surt'; v.fade = 1; return; }
    const o = objecte(v.objectiu);
    if (!o || o.avariat) { if (o?.avariat) { pensa(v, 'avaria'); v.satisf -= 4; } v.estat = 'idle'; return; }
    const d = OBJECTES[o.t];
    if (d.seient) { v.estat = 'seu'; v.espera = 8; return; }
    if (d.cat === 'atraccio' || d.cat === 'menjar' || o.t === 'lavabos') {
      const preu = o.preu ?? (d.cat === 'atraccio' ? 0 : d.preuJust);
      if (preu > 0) {
        const vol = clamp(1.75 - preu / d.preuJust, 0, 1);
        if (v.pressupost < preu || Math.random() > vol) { pensa(v, 'car'); v.satisf -= 5; v.estat = 'idle'; if (d.cat !== 'atraccio') v.sense[d.cat === 'menjar' ? (o.t === 'begudes' ? 'set' : 'gana') : 'lavabo'] = 25; return; }
      }
      v.estat = 'cua'; v.espera = 0; rt.get(o.id).cua.push(v);
      return;
    }
    v.estat = 'idle';
  }
  // Paga i gaudeix d'una atracció o d'una parada
  function serveix(v, o) {
    const d = OBJECTES[o.t];
    const preu = d.cat === 'atraccio' ? (o.preu ?? 0) : o.t === 'lavabos' ? 0 : (o.preu ?? d.preuJust);
    if (preu > 0) {
      v.pressupost -= preu; parc.diners += preu; o.ingressos = (o.ingressos || 0) + preu; parc.totals.ingressos += preu;
      if (d.cat === 'atraccio') parc.avui.atraccions += preu; else parc.avui.menjar += preu;
      flota(o.x + d.mida / 2, o.y + d.mida / 2, `+${eur2(preu)}`, '#2a7423');
    }
    if (d.cat === 'menjar') {
      parc.diners -= d.cost; parc.avui.costMenjar += d.cost; parc.totals.despeses += d.cost;
      v.gana = clamp(v.gana - (d.efecte.gana || 0), 0, 100); v.set = clamp(v.set - (d.efecte.set || 0), 0, 100);
      v.lavabo += d.efecte.set > 0 ? 20 : 8;
      v.brossa = 1; v.passos = 0; v.satisf += 4 * clamp(d.preuJust / Math.max(preu, 0.5), 0.5, 1.4);
      o.usos = (o.usos || 0) + 1;
    }
    if (o.t === 'lavabos') { v.lavabo = 0; v.satisf += 3; o.usos = (o.usos || 0) + 1; }
    if (d.cat === 'atraccio') { v.vist.add(o.id); v.satisf += (5 + d.emocio * 2.5) * clamp(Math.sqrt(d.preuJust / Math.max(preu, d.preuJust * 0.5)), 0.6, 1.3); v.energia -= 4; }
    v.satisf = clamp(v.satisf, 0, 100);
  }

  // ---------- personal ----------
  function ajustaPersonal() {
    for (const [rol, n] of Object.entries(parc.personal)) {
      const actuals = personal.filter((p) => p.rol === rol);
      for (let i = actuals.length; i < n; i++) {
        const [x, y] = entradaAcces[0] || [ENTRADA.x, ENTRADA.y - 1];
        personal.push({ rol, x, y, fx: x + 0.5, fy: y + 0.5, ruta: [[x, y]], pas: 0, estat: 'idle', img: `persona-${rol === 'mecanic' ? 7 : rol === 'netejador' ? 12 : 3}`, dir: 0, feina: 0 });
      }
      for (let i = actuals.length; i > n; i--) personal.splice(personal.indexOf(actuals[i - 1]), 1);
    }
  }
  function decideixPersonal(p) {
    if (p.rol === 'mecanic') {
      const avariats = parc.objectes.filter((o) => o.avariat && accessible(o) && !personal.some((q) => q !== p && q.desti === o.id));
      for (const o of avariats) { const r = ruta(p.x, p.y, acces.get(o.id)); if (r) { p.ruta = r; p.pas = 0; p.estat = 'camina'; p.desti = o.id; return; } }
    }
    if (p.rol === 'netejador') {
      const brutes = Object.keys(parc.brossa).map((s) => s.split(',').map(Number)).filter(([x, y]) => !personal.some((q) => q !== p && q.desti === k2(x, y)));
      if (brutes.length) { const r = ruta(p.x, p.y, brutes); if (r) { p.ruta = r; p.pas = 0; p.estat = 'camina'; p.desti = k2(...r[r.length - 1]); return; } }
    }
    p.desti = null;
    const vs = VEINS.map(([dx, dy]) => [p.x + dx, p.y + dy]).filter(([x, y]) => dins(x, y) && esCami(x, y));
    if (vs.length) { p.ruta = [[p.x, p.y], vs[Math.floor(Math.random() * vs.length)]]; p.pas = 0; p.estat = 'camina'; } else p.estat = 'idle';
  }

  // ---------- moviment ----------
  const VEL = 1.6; // caselles per minut de joc
  function camina(a, dm) {
    let resta = VEL * dm;
    while (resta > 0 && a.pas < a.ruta.length - 1) {
      const [nx, ny] = a.ruta[a.pas + 1];
      if (!esCami(nx, ny) && !(a.objectiu === 'sortida')) { a.ruta = [[a.x, a.y]]; a.pas = 0; break; }
      const tx = nx + 0.5, ty = ny + 0.5;
      const dx = tx - a.fx, dy = ty - a.fy, dist = Math.hypot(dx, dy);
      if (Math.abs(dx) > Math.abs(dy)) a.dir = dx > 0 ? 1 : 3; else if (dy) a.dir = dy > 0 ? 0 : 2;
      if (dist <= resta) { a.fx = tx; a.fy = ty; resta -= dist; a.pas += 1; a.x = nx; a.y = ny; a.passos = (a.passos || 0) + 1; }
      else { a.fx += (dx / dist) * resta; a.fy += (dy / dist) * resta; resta = 0; }
    }
    // primer tram des de la porta fins al camí
    if (a.pas === 0 && a.ruta.length === 1) {
      const tx = a.x + 0.5, ty = a.y + 0.5, dx = tx - a.fx, dy = ty - a.fy, dist = Math.hypot(dx, dy);
      if (dist > 0.01) { const s = Math.min(1, (VEL * dm) / dist); a.fx += dx * s; a.fy += dy * s; a.dir = 2; return false; }
    }
    return a.pas >= a.ruta.length - 1;
  }

  // ---------- un pas de simulació (dm minuts de joc) ----------
  function simula(dm) {
    const m0 = parc.minut;
    parc.minut += dm;
    // arribades
    pendentArribada += ritmeArribades(m0) * dm;
    while (pendentArribada >= 1 && visitants.length < 320) { pendentArribada -= 1; nouVisitant(); }
    if (pendentArribada > 3) pendentArribada = 0;
    const animadors = personal.filter((p) => p.rol === 'animador');

    // atraccions i parades
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t], s = rt.get(o.id);
      if (!s) continue;
      if (d.cat === 'atraccio') {
        if (s.muntats.length && parc.minut >= s.fi) {
          for (const v of s.muntats) { serveix(v, o); v.estat = 'idle'; v.amagat = false; }
          o.usos = (o.usos || 0) + s.muntats.length;
          if (Math.random() < 0.005 * (1 + (o.usos || 0) / 600)) {
            o.avariat = true; o.avariatDes = parc.minut;
            avis(`S'ha espatllat: ${d.nom}!`, 'error');
          }
          s.muntats = [];
        }
        if (!s.muntats.length && s.cua.length && !o.avariat && (s.cua.length >= d.capacitat || s.cua[0].espera >= 1.5)) {
          s.muntats = s.cua.splice(0, d.capacitat);
          for (const v of s.muntats) { v.estat = 'muntat'; v.amagat = true; }
          s.fi = parc.minut + d.durada;
        }
        if (o.avariat && s.cua.length) { for (const v of s.cua) { pensa(v, 'avaria'); v.satisf -= 6; v.estat = 'idle'; } s.cua = []; }
      } else if (s.cua.length) {
        s.servei += dm;
        const t = o.t === 'lavabos' ? 0.6 : 1;
        while (s.cua.length && s.servei >= t) { s.servei -= t; const v = s.cua.shift(); serveix(v, o); v.estat = 'idle'; }
      } else s.servei = 0;
    }

    // visitants
    for (let i = visitants.length - 1; i >= 0; i--) {
      const v = visitants[i];
      v.temps += dm;
      for (const c of Object.keys(v.sense)) { v.sense[c] -= dm; if (v.sense[c] <= 0) delete v.sense[c]; }
      if (v.estat !== 'muntat') {
        v.gana += 0.12 * dm; v.set += 0.16 * dm; v.lavabo += 0.08 * dm; v.energia -= 0.1 * dm;
        if (v.gana > 85 || v.set > 85) v.satisf -= 0.15 * dm;
        if (v.lavabo > 90) v.satisf -= 0.3 * dm;
        if (v.energia < 15) v.satisf -= 0.15 * dm;
        const c = v.y * N + v.x;
        if (dins(v.x, v.y)) {
          v.satisf += Math.min(0.12, 0.015 * bellesa[c]) * dm;
          let bruta = 0;
          for (const [dx, dy] of [[0, 0], ...VEINS]) bruta += parc.brossa[k2(v.x + dx, v.y + dy)] || 0;
          if (bruta) { v.satisf -= Math.min(0.4, 0.06 * bruta) * dm; if (bruta >= 3 && Math.random() < 0.01 * dm) pensa(v, 'brut'); }
          // brossa: si hi ha una paperera a prop, la llença; si no, acaba a terra
          if (v.brossa) {
            if (paperera[c]) v.brossa = 0;
            else if (v.passos > 7 && esCami(v.x, v.y)) { v.brossa = 0; parc.brossa[k2(v.x, v.y)] = Math.min(6, (parc.brossa[k2(v.x, v.y)] || 0) + 1); }
          }
        }
        for (const a of animadors) if (Math.abs(a.fx - v.fx) + Math.abs(a.fy - v.fy) < 4) { v.satisf += 0.12 * dm; break; }
        if (parc.objectes.some((o) => o.t === 'informacio' && accessible(o))) v.satisf += 0.01 * dm;
      }
      v.satisf = clamp(v.satisf, 0, 100);

      if (v.estat === 'camina') { if (camina(v, dm)) arriba(v); }
      else if (v.estat === 'idle') decideix(v, parc.minut);
      else if (v.estat === 'espera') { v.espera -= dm; if (v.espera <= 0) v.estat = 'idle'; }
      else if (v.estat === 'seu') { v.espera -= dm; v.energia += 4.5 * dm; if (v.espera <= 0) { v.estat = 'idle'; v.satisf += 2; } }
      else if (v.estat === 'cua') {
        v.espera += dm; v.satisf -= 0.06 * dm;
        if (v.espera > 40) { const s = rt.get(v.objectiu); if (s) s.cua.splice(s.cua.indexOf(v), 1); pensa(v, 'cua'); v.satisf -= 6; v.estat = 'idle'; }
      } else if (v.estat === 'surt' || v.estat === 'fora') {
        v.fade = (v.fade ?? 1) - dm * 0.5;
        if (v.fade <= 0 || v.estat === 'fora') { surt(v); visitants.splice(i, 1); }
      }
    }

    // personal
    for (const p of personal) {
      if (p.estat === 'camina') {
        if (camina(p, dm)) {
          p.estat = 'idle';
          if (p.rol === 'netejador' && p.desti && parc.brossa[p.desti]) { p.estat = 'treballa'; p.feina = 1.5; }
          if (p.rol === 'mecanic' && p.desti && objecte(p.desti)?.avariat) { p.estat = 'treballa'; p.feina = 12; }
        }
      } else if (p.estat === 'treballa') {
        p.feina -= dm;
        if (p.feina <= 0) {
          if (p.rol === 'netejador') delete parc.brossa[p.desti];
          if (p.rol === 'mecanic') { const o = objecte(p.desti); if (o) { o.avariat = false; flota(o.x + 1, o.y + 1, '🔧 Reparada', '#0b78c8'); } }
          p.estat = 'idle'; p.desti = null;
        }
      } else decideixPersonal(p);
    }

    if (parc.minut >= MINUTS_DIA) tancaDia();
  }
  function surt(v) {
    parc.reputacio = clamp(parc.reputacio * 0.98 + v.satisf * 0.02, 0, 100);
    parc.avui.satisfSum += v.satisf; parc.avui.satisfN += 1;
  }

  // ---------- final del dia: informe ----------
  function tancaDia() {
    for (const v of visitants) surt(v);
    visitants.length = 0;
    for (const s of rt.values()) { s.cua = []; s.muntats = []; }
    const a = parc.avui;
    const manteniment = parc.objectes.reduce((t, o) => t + (OBJECTES[o.t].manteniment || 0), 0);
    const sous = Object.entries(parc.personal).reduce((t, [rol, n]) => t + n * PERSONAL_PARC[rol].sou, 0);
    const interessos = Math.round(parc.deute * INTERES_DIARI);
    parc.diners -= manteniment + sous + interessos;
    parc.totals.despeses += manteniment + sous + interessos;
    const ingressos = a.entrades + a.atraccions + a.menjar;
    const despeses = manteniment + sous + interessos + a.costMenjar;
    const informe = {
      dia: parc.dia, visitants: a.visitants, entrades: a.entrades, atraccions: a.atraccions, menjar: a.menjar,
      costMenjar: Math.round(a.costMenjar), manteniment, sous, interessos, ingressos: Math.round(ingressos), despeses: Math.round(despeses),
      benefici: Math.round(ingressos - despeses), satisf: a.satisfN ? Math.round(a.satisfSum / a.satisfN) : null, reputacio: Math.round(parc.reputacio),
      queixes: Object.entries(a.queixes).sort((x, y) => y[1] - x[1]).slice(0, 3),
    };
    parc.historial.push(informe);
    if (parc.historial.length > 30) parc.historial.shift();
    parc.dia += 1; parc.minut = 0; parc.avui = nouDia();
    guarda(true);
    mostraInforme(informe);
  }

  // ---------- desar ----------
  function guarda(publica = false) {
    darrerDesat = Date.now();
    desar();
    if (publica) publicar?.({
      nom: parc.nom,
      camins: parc.camins.join(';'),
      objectes: parc.objectes.map((o) => `${o.t},${o.x},${o.y}`).join(';'),
      atraccions: parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio').length,
      reputacio: Math.round(parc.reputacio),
    });
  }
  let desatPendent = null;
  function guardaAviat() { clearTimeout(desatPendent); desatPendent = setTimeout(() => guarda(true), 1200); }

  // ---------- construcció ----------
  function potColocar(t, x, y) {
    const m = OBJECTES[t].mida;
    for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) {
      if (!dins(x + dx, y + dy) || ocup[(y + dy) * N + x + dx] !== 0) return false;
    }
    return true;
  }
  function coloca(t, x, y) {
    const d = OBJECTES[t];
    if (!potColocar(t, x, y)) return avis('Aquí no hi cap: ha de ser sobre gespa lliure.', 'error');
    if (parc.diners < d.preu) return avis(`No tens prou diners: costa ${eur(d.preu)}.`, 'error');
    parc.diners -= d.preu; parc.totals.despeses += d.preu;
    const o = { id: parc.seguentId++, t, x, y };
    if (d.cat === 'atraccio') o.preu = 0; else if (d.cat === 'menjar') o.preu = d.preuJust;
    parc.objectes.push(o);
    recalcula();
    flota(x + d.mida / 2, y + d.mida / 2, `−${eur(d.preu)}`, '#d6402f');
    if (!accessible(o) && d.cat !== 'decoracio') avis('Recorda connectar-ho amb un camí: si no, ningú hi podrà arribar.', 'info');
    guardaAviat(); refrescaCataleg();
  }
  function posaCami(x, y) {
    if (!dins(x, y) || ocup[y * N + x] !== 0) return;
    if (parc.diners < COST_CAMI) { avis('No tens prou diners per fer més camí.', 'error'); return; }
    parc.diners -= COST_CAMI; parc.totals.despeses += COST_CAMI;
    parc.camins.push(k2(x, y)); recalcula(); guardaAviat();
  }
  function enderroca(x, y) {
    if (!dins(x, y)) return;
    const c = ocup[y * N + x];
    if (c === -1) {
      parc.camins = parc.camins.filter((p) => p !== k2(x, y)); delete parc.brossa[k2(x, y)];
      for (const v of visitants) if (v.x === x && v.y === y) v.estat = 'idle';
      recalcula(); guardaAviat(); return;
    }
    if (c > 0) {
      const o = objecte(c);
      if (o.t === 'entrada') return avis('L\'entrada no es pot enderrocar.', 'error');
      const retorn = Math.round(OBJECTES[o.t].preu * RETORN_ENDERROC);
      if (OBJECTES[o.t].preu >= 1000 && !confirm(`Vols enderrocar ${OBJECTES[o.t].nom}? Recuperaràs ${eur(retorn)}.`)) return;
      const s = rt.get(o.id);
      if (s) for (const v of [...s.cua, ...s.muntats]) { v.estat = 'idle'; v.amagat = false; }
      parc.objectes = parc.objectes.filter((x2) => x2 !== o);
      parc.diners += retorn;
      for (const v of visitants) if (v.objectiu === o.id) v.estat = 'idle';
      recalcula(); guardaAviat(); tancaInfo();
      flota(o.x + 0.5, o.y + 0.5, `+${eur(retorn)}`, '#2a7423');
    }
  }

  // ---------- eines i panells ----------
  function triaEina(id) {
    for (const [k, b] of Object.entries(botonsEina)) b.classList.toggle('actiu', k === id);
    aColocar = null;
    if (id === 'finances') { eina = 'mou'; botonsEina.mou.classList.add('actiu'); botonsEina.finances.classList.remove('actiu'); cataleg.hidden = true; return obreFinances(); }
    if (id === 'personal') { eina = 'mou'; botonsEina.mou.classList.add('actiu'); botonsEina.personal.classList.remove('actiu'); cataleg.hidden = true; return obrePersonal(); }
    eina = id;
    cataleg.hidden = !CATEGORIES.some(([c]) => c === id);
    if (!cataleg.hidden) refrescaCataleg();
    const textos = {
      mou: 'Arrossega per moure\'t. Toca una atracció o una parada per veure-la i canviar-ne el preu.',
      cami: `Arrossega per la gespa per fer camins (${eur(COST_CAMI)} per casella). Els visitants només caminen pels camins.`,
      enderroca: 'Toca o arrossega per treure camins i objectes. Dels objectes en recuperes la meitat del preu.',
    };
    ajuda.textContent = textos[id] || 'Tria què vols construir i toca la gespa on ho vols posar.';
  }
  function refrescaCataleg() {
    if (cataleg.hidden) return;
    cataleg.replaceChildren(...Object.entries(OBJECTES).filter(([, d]) => d.cat === eina).map(([t, d]) => h('button', {
      class: `parc-carta${aColocar === t ? ' triada' : ''}`, disabled: parc.diners < d.preu, title: d.text || '', 'data-preu': d.preu,
      onclick: () => { aColocar = t; refrescaCataleg(); ajuda.textContent = `${d.nom}: toca la gespa on la vols posar${d.mida > 1 ? ` (ocupa ${d.mida}x${d.mida} caselles)` : ''}. Ha de tocar un camí.`; },
    }, h('img', { src: srcObjecte(t), alt: '' }), h('strong', {}, d.nom), h('span', {}, eur(d.preu)),
    d.atractiu ? h('span', { class: 'nota' }, `${'★'.repeat(d.atractiu)} · ${d.capacitat} places`) : d.cat === 'menjar' ? h('span', { class: 'nota' }, `Cost: ${eur2(d.cost)} / unitat`) : null)));
  }
  function tancaInfo() { info.hidden = true; info.replaceChildren(); }
  function panell(titol, ...cos) {
    info.replaceChildren(h('header', {}, h('h2', {}, titol), h('button', { class: 'btn-tancar', onclick: tancaInfo, 'aria-label': 'Tanca' }, '×')), h('div', { class: 'parc-info-cos' }, ...cos));
    info.hidden = false;
  }
  function campPreu(valor, onCanvi, pas = 0.5) {
    const inp = h('input', { type: 'number', min: 0, max: 100, step: pas, value: valor, class: 'input-preu' });
    inp.addEventListener('change', () => { const n = clamp(Number(inp.value) || 0, 0, 100); inp.value = n; onCanvi(n); guardaAviat(); });
    return inp;
  }
  function obreObjecte(o) {
    const d = OBJECTES[o.t], s = rt.get(o.id);
    const cos = [h('img', { src: srcObjecte(o.t), alt: '', class: 'parc-info-img' })];
    if (o.t === 'entrada') {
      const a = atractiu();
      cos.push(h('p', {}, 'Per aquí entren els visitants. El preu de l\'entrada és el que paguen en arribar.'),
        h('label', { class: 'fila-preu' }, 'Preu de l\'entrada (€)', campPreu(parc.preus.entrada, (n) => { parc.preus.entrada = n; }, 1)),
        h('p', { class: 'nota' }, `Amb les atraccions que tens, als visitants els sembla raonable pagar uns ${eur(preuJustEntrada(a))}. Com més cara, menys gent vindrà.`));
    } else {
      if (d.text) cos.push(h('p', { class: 'nota' }, d.text));
      if (!accessible(o) && d.cat !== 'decoracio') cos.push(h('p', { class: 'nota falta' }, '⚠️ No toca cap camí: ningú hi pot arribar.'));
      if (d.cat === 'atraccio') {
        cos.push(h('dl', { class: 'dades' },
          h('dt', {}, 'Viatges (persones)'), h('dd', {}, fmt.format(o.usos || 0)),
          h('dt', {}, 'Ingressos totals'), h('dd', {}, eur(o.ingressos || 0)),
          h('dt', {}, 'A la cua ara'), h('dd', {}, String(s?.cua.length || 0)),
          h('dt', {}, 'Manteniment'), h('dd', {}, `${eur(d.manteniment)} / dia`)),
        h('label', { class: 'fila-preu' }, 'Preu per viatge (€, 0 = inclòs a l\'entrada)', campPreu(o.preu ?? 0, (n) => { o.preu = n; })),
        h('p', { class: 'nota' }, `Als visitants els sembla just pagar-ne uns ${eur2(d.preuJust)}.`));
        if (o.avariat) {
          const cost = Math.round(d.preu * 0.1);
          cos.push(h('p', { class: 'falta' }, '🔧 Està espatllada!'),
            parc.personal.mecanic ? h('p', { class: 'nota' }, 'Un mecànic hi anirà de seguida.') : h('button', { class: 'btn btn-principal', onclick: () => {
              if (parc.diners < cost) return avis('No tens prou diners.', 'error');
              parc.diners -= cost; parc.totals.despeses += cost; o.avariat = false; guardaAviat(); obreObjecte(o);
            } }, `Repara-la (${eur(cost)})`));
        }
      }
      if (d.cat === 'menjar') {
        cos.push(h('dl', { class: 'dades' },
          h('dt', {}, 'Unitats venudes'), h('dd', {}, fmt.format(o.usos || 0)),
          h('dt', {}, 'Ingressos totals'), h('dd', {}, eur(o.ingressos || 0)),
          h('dt', {}, 'Et costa cada unitat'), h('dd', {}, eur2(d.cost)),
          h('dt', {}, 'Manteniment'), h('dd', {}, `${eur(d.manteniment)} / dia`)),
        h('label', { class: 'fila-preu' }, 'Preu de venda (€)', campPreu(o.preu ?? d.preuJust, (n) => { o.preu = n; }, 0.1)),
        h('p', { class: 'nota' }, `Marge per unitat: preu de venda − cost. Als visitants els sembla just pagar uns ${eur2(d.preuJust)}.`));
      }
      if (o.t === 'lavabos') cos.push(h('p', { class: 'nota' }, `Usos: ${fmt.format(o.usos || 0)} · Manteniment: ${eur(d.manteniment)} / dia`));
      cos.push(h('button', { class: 'btn', onclick: () => enderroca(o.x, o.y) }, `Enderroca (recuperes ${eur(Math.round(d.preu * RETORN_ENDERROC))})`));
    }
    panell(d.nom, ...cos);
  }
  function obreFinances() {
    const hist = parc.historial.slice(-7).reverse();
    const deute = h('div', { class: 'bloc' },
      h('dl', { class: 'dades' },
        h('dt', {}, 'Diners del parc'), h('dd', {}, eur(parc.diners)),
        h('dt', {}, 'Préstec pendent'), h('dd', {}, eur(parc.deute)),
        h('dt', {}, 'Interessos per dia'), h('dd', {}, eur(parc.deute * INTERES_DIARI)),
        h('dt', {}, 'Reputació del parc'), h('dd', {}, `${Math.round(parc.reputacio)} / 100`),
        h('dt', {}, 'Visitants totals'), h('dd', {}, fmt.format(parc.totals.visitants))),
      parc.deute > 0 ? h('button', { class: 'btn', onclick: () => {
        const q = Math.min(10000, parc.deute);
        if (parc.diners < q) return avis('No tens prou diners per retornar 10.000 €.', 'error');
        parc.diners -= q; parc.deute -= q; guarda(); obreFinances(); avis(`Has retornat ${eur(q)} al banc.`, 'ok');
      } }, `Retorna ${eur(Math.min(10000, parc.deute))} del préstec`) : null);
    const preus = [h('label', { class: 'fila-preu' }, 'Entrada (€)', campPreu(parc.preus.entrada, (n) => { parc.preus.entrada = n; }, 1))];
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t];
      if (d.cat === 'atraccio') preus.push(h('label', { class: 'fila-preu' }, `${d.nom} (just: ${eur2(d.preuJust)})`, campPreu(o.preu ?? 0, (n) => { o.preu = n; })));
      if (d.cat === 'menjar') preus.push(h('label', { class: 'fila-preu' }, `${d.nom} (cost ${eur2(d.cost)}, just ${eur2(d.preuJust)})`, campPreu(o.preu ?? d.preuJust, (n) => { o.preu = n; }, 0.1)));
    }
    const taula = hist.length ? h('table', { class: 'parc-taula' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Dia'), h('th', {}, 'Visitants'), h('th', {}, 'Ingressos'), h('th', {}, 'Despeses'), h('th', {}, 'Benefici'))),
      h('tbody', {}, ...hist.map((r) => h('tr', {}, h('td', {}, String(r.dia)), h('td', {}, String(r.visitants)), h('td', {}, eur(r.ingressos)), h('td', {}, eur(r.despeses)),
        h('td', { class: r.benefici < 0 ? 'falta' : '' }, eur(r.benefici)))))) : h('p', { class: 'nota' }, 'Encara no ha acabat cap dia. Al final de cada dia (a les 20:00) veuràs l\'informe.');
    panell('Diners i preus', deute, h('h3', {}, 'Preus'), ...preus, h('h3', {}, 'Últims dies'), taula);
  }
  function obrePersonal() {
    const files = Object.entries(PERSONAL_PARC).map(([rol, p]) => h('div', { class: 'parc-personal' },
      h('div', {}, h('strong', {}, `${p.plural}: ${parc.personal[rol] || 0}`), h('span', { class: 'nota' }, `${p.text} Sou: ${eur(p.sou)} / dia.`)),
      h('div', { class: 'fila-botons' },
        h('button', { class: 'btn', onclick: () => { parc.personal[rol] = Math.max(0, (parc.personal[rol] || 0) - 1); ajustaPersonal(); guarda(); obrePersonal(); } }, '−'),
        h('button', { class: 'btn btn-principal', onclick: () => { if ((parc.personal[rol] || 0) >= 10) return; parc.personal[rol] = (parc.personal[rol] || 0) + 1; ajustaPersonal(); guarda(); obrePersonal(); } }, '+ Contracta'))));
    const total = Object.entries(parc.personal).reduce((t, [rol, n]) => t + n * PERSONAL_PARC[rol].sou, 0);
    panell('Personal', ...files, h('p', { class: 'nota' }, `Total en sous: ${eur(total)} cada dia. Es paguen al final del dia.`));
  }
  function mostraInforme(r) {
    informeObert = true;
    const consells = r.queixes.map(([c, n]) => h('li', {}, `${QUEIXES[c][0]} ${QUEIXES[c][1]} (${n} vegades). `, h('span', { class: 'nota' }, QUEIXES[c][2])));
    panell(`Informe del dia ${r.dia}`,
      h('dl', { class: 'dades' },
        h('dt', {}, 'Visitants'), h('dd', {}, String(r.visitants)),
        h('dt', {}, 'Entrades'), h('dd', {}, eur(r.entrades)),
        h('dt', {}, 'Atraccions'), h('dd', {}, eur(r.atraccions)),
        h('dt', {}, 'Menjar i begudes'), h('dd', {}, eur(r.menjar)),
        h('dt', {}, h('strong', {}, 'Total ingressos')), h('dd', {}, h('strong', {}, eur(r.ingressos))),
        h('dt', {}, 'Cost del menjar venut'), h('dd', {}, `−${eur(r.costMenjar)}`),
        h('dt', {}, 'Manteniment'), h('dd', {}, `−${eur(r.manteniment)}`),
        h('dt', {}, 'Sous del personal'), h('dd', {}, `−${eur(r.sous)}`),
        h('dt', {}, 'Interessos del préstec'), h('dd', {}, `−${eur(r.interessos)}`),
        h('dt', {}, h('strong', {}, 'Benefici del dia')), h('dd', { class: r.benefici < 0 ? 'falta' : '' }, h('strong', {}, eur(r.benefici))),
        h('dt', {}, 'Satisfacció'), h('dd', {}, r.satisf == null ? '—' : `${r.satisf} / 100`),
        h('dt', {}, 'Reputació'), h('dd', {}, `${r.reputacio} / 100`)),
      r.visitants === 0 ? h('p', { class: 'nota falta' }, atractiu() <= 0 ? 'No ha vingut ningú: construeix una atracció i connecta-la amb un camí fins a l\'entrada.' : 'No ha vingut ningú. Potser l\'entrada és massa cara?') : null,
      consells.length ? h('div', {}, h('h3', {}, 'De què es queixen els visitants'), h('ul', { class: 'parc-queixes' }, ...consells)) : null,
      h('button', { class: 'btn btn-principal btn-gran', onclick: () => { informeObert = false; tancaInfo(); } }, `Comença el dia ${r.dia + 1}`));
  }

  // ---------- càmera ----------
  function mida() {
    const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(r.width * dpr) || canvas.height !== Math.round(r.height * dpr)) { canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); }
    return { w: r.width, h: r.height, dpr };
  }
  function encaixa() {
    const { w, h: ht } = mida();
    escala = Math.min(w / (N * WP * 1.08), (ht - 120) / (N * WP * 0.62));
    const c = iso(N / 2, N / 2);
    despl.x = w / 2 - c.x * escala; despl.y = ht / 2 + 30 - (c.y - 40) * escala;
  }
  function zoomA(f, cx, cy) {
    const { w, h: ht } = mida();
    cx ??= w / 2; cy ??= ht / 2;
    const nova = clamp(escala * f, 0.12, 2.2);
    despl.x = cx - (cx - despl.x) * (nova / escala); despl.y = cy - (cy - despl.y) * (nova / escala); escala = nova;
  }
  function casella(sx, sy, m = 1) {
    const r = canvas.getBoundingClientRect();
    const x = (sx - r.left - despl.x) / escala, y = (sy - r.top - despl.y) / escala;
    const u = (x / (WP / 2) + y / (WP / 4)) / 2, v = (y / (WP / 4) - x / (WP / 2)) / 2;
    return m > 1 ? { x: Math.round(u - m / 2), y: Math.round(v - m / 2) } : { x: Math.floor(u), y: Math.floor(v) };
  }

  // ---------- entrada del ratolí / tàctil ----------
  const punters = new Map();
  let arrossega = null, pinça = null;
  canvas.addEventListener('pointerdown', (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 2) { const [a, b] = [...punters.values()]; pinça = Math.hypot(a.x - b.x, a.y - b.y); arrossega = null; return; }
    arrossega = { x: ev.clientX, y: ev.clientY, dx: despl.x, dy: despl.y, mogut: false, pinta: (eina === 'cami' || eina === 'enderroca') && ev.button === 0 };
    if (arrossega.pinta) aplicaPinzell(ev);
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (punters.has(ev.pointerId)) punters.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (punters.size === 2 && pinça) {
      const [a, b] = [...punters.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = canvas.getBoundingClientRect();
      zoomA(d / pinça, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); pinça = d; return;
    }
    hover = casella(ev.clientX, ev.clientY, aColocar ? OBJECTES[aColocar].mida : 1);
    if (!arrossega) return;
    const dx = ev.clientX - arrossega.x, dy = ev.clientY - arrossega.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) arrossega.mogut = true;
    if (arrossega.pinta) { aplicaPinzell(ev); return; }
    if (arrossega.mogut) { despl.x = arrossega.dx + dx; despl.y = arrossega.dy + dy; }
  });
  const acaba = (ev) => {
    punters.delete(ev.pointerId);
    if (punters.size < 2) pinça = null;
    if (!arrossega) return;
    const a = arrossega; arrossega = null;
    if (a.mogut || a.pinta) return;
    clic(ev);
  };
  canvas.addEventListener('pointerup', acaba);
  canvas.addEventListener('pointercancel', acaba);
  canvas.addEventListener('pointerleave', () => { hover = null; });
  canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); const r = canvas.getBoundingClientRect(); zoomA(ev.deltaY < 0 ? 1.12 : 1 / 1.12, ev.clientX - r.left, ev.clientY - r.top); }, { passive: false });
  const tecla = (ev) => { if (ev.key === 'Escape') { if (aColocar) { aColocar = null; refrescaCataleg(); } else triaEina('mou'); } };
  window.addEventListener('keydown', tecla);
  const redim = () => encaixa();
  window.addEventListener('resize', redim);

  function aplicaPinzell(ev) {
    const { x, y } = casella(ev.clientX, ev.clientY);
    if (eina === 'cami') posaCami(x, y); else enderroca(x, y);
  }
  function clic(ev) {
    if (aColocar) { const m = OBJECTES[aColocar].mida; const { x, y } = casella(ev.clientX, ev.clientY, m); coloca(aColocar, x, y); return; }
    const { x, y } = casella(ev.clientX, ev.clientY);
    if (!dins(x, y)) return;
    const c = ocup[y * N + x];
    if (eina === 'mou' && c > 0) obreObjecte(objecte(c));
  }

  // ---------- dibuix ----------
  const imatges = new Map();
  function img(src) {
    let im = imatges.get(src);
    if (!im) { im = new Image(); im.src = src; imatges.set(src, im); }
    return im.complete && im.naturalWidth ? im : null;
  }
  function rombe(u, v, mu = 1, mv = 1) {
    const a = iso(u, v), b = iso(u + mu, v), c = iso(u + mu, v + mv), d = iso(u, v + mv);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
  }
  function dibuixa() {
    const { w, h: ht, dpr } = mida();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#5f9e3a'; ctx.fillRect(0, 0, w, ht);
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * despl.x, dpr * despl.y);
    // terra del parc: gespa amb un escaquer suau perquè es vegin les caselles
    rombe(-0.15, -0.15, N + 0.3, N + 0.3); ctx.fillStyle = '#6b4a2b'; ctx.fill();
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { rombe(x, y); ctx.fillStyle = (x + y) % 2 ? '#86c45a' : '#80bd54'; ctx.fill(); }
    // camins
    for (const p of setCamins) {
      const [x, y] = p.split(',').map(Number);
      rombe(x, y); ctx.fillStyle = '#e9dbb8'; ctx.fill();
      ctx.strokeStyle = '#c4ad7f'; ctx.lineWidth = 3; ctx.beginPath();
      const a = iso(x, y), b = iso(x + 1, y), c = iso(x + 1, y + 1), d = iso(x, y + 1);
      if (!esCami(x, y - 1)) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
      if (!esCami(x + 1, y)) { ctx.moveTo(b.x, b.y); ctx.lineTo(c.x, c.y); }
      if (!esCami(x, y + 1)) { ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); }
      if (!esCami(x - 1, y)) { ctx.moveTo(d.x, d.y); ctx.lineTo(a.x, a.y); }
      ctx.stroke();
      const b2 = parc.brossa[p];
      if (b2) {
        for (let i = 0; i < b2; i++) {
          const q = iso(x + 0.3 + ((i * 37) % 5) / 9, y + 0.3 + ((i * 53) % 5) / 9);
          ctx.fillStyle = ['#d6402f', '#f2c12e', '#ffffff', '#3b6fd6'][i % 4];
          ctx.beginPath(); ctx.ellipse(q.x, q.y, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    // previsualització del que es col·loca
    if (hover && (aColocar || eina === 'cami' || eina === 'enderroca')) {
      const m = aColocar ? OBJECTES[aColocar].mida : 1;
      const ok = aColocar ? potColocar(aColocar, hover.x, hover.y) && parc.diners >= OBJECTES[aColocar].preu : eina === 'cami' ? dins(hover.x, hover.y) && ocup[hover.y * N + hover.x] === 0 : dins(hover.x, hover.y);
      rombe(hover.x, hover.y, m, m);
      ctx.fillStyle = eina === 'enderroca' ? 'rgba(214,64,47,.4)' : ok ? 'rgba(60,157,50,.45)' : 'rgba(214,64,47,.45)'; ctx.fill();
    }
    // objectes i persones, de darrere cap endavant
    const capes = new Map();
    const afegeix = (d, f) => { if (!capes.has(d)) capes.set(d, []); capes.get(d).push(f); };
    for (const o of parc.objectes) {
      const m = OBJECTES[o.t].mida;
      afegeix(o.x + o.y + 2 * (m - 1), () => dibuixaObj(o));
    }
    for (const v of visitants) if (!v.amagat) afegeix(Math.floor(v.fx) + Math.floor(v.fy) + 0.5, () => dibuixaPersona(v));
    for (const p of personal) afegeix(Math.floor(p.fx) + Math.floor(p.fy) + 0.5, () => dibuixaPersona(p));
    if (hover && aColocar) afegeix(hover.x + hover.y + 2 * (OBJECTES[aColocar].mida - 1) + 0.9, () => {
      const im = img(srcObjecte(aColocar)); if (!im) return;
      const m = OBJECTES[aColocar].mida, c = iso(hover.x + m / 2, hover.y + m / 2);
      const ok = potColocar(aColocar, hover.x, hover.y) && parc.diners >= OBJECTES[aColocar].preu;
      ctx.globalAlpha = ok ? 0.75 : 0.35; dibuixaObjecte(ctx, im, aColocar, c.x, c.y, WP * m); ctx.globalAlpha = 1;
      // contorn de la base per sobre de la imatge: verd si hi cap, vermell si no
      rombe(hover.x, hover.y, m, m); ctx.lineWidth = 5; ctx.strokeStyle = ok ? '#3c9d32' : '#d6402f'; ctx.stroke();
      if (!ok) { ctx.font = '800 22px "Baloo 2", system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#d6402f'; ctx.fillText(parc.diners < OBJECTES[aColocar].preu ? 'No tens prou diners' : 'Aquí no hi cap', c.x, c.y + 8); }
    });
    for (const d of [...capes.keys()].sort((a, b) => a - b)) for (const f of capes.get(d)) f();
    // textos flotants (diners)
    const ara = performance.now();
    ctx.textAlign = 'center'; ctx.font = '800 22px "Baloo 2", system-ui, sans-serif';
    for (let i = textos.length - 1; i >= 0; i--) {
      const t = textos[i], vida = (ara - t.ini) / 1400;
      if (vida >= 1) { textos.splice(i, 1); continue; }
      const p = iso(t.x, t.y);
      ctx.globalAlpha = 1 - vida; ctx.fillStyle = '#fff'; ctx.fillText(t.text, p.x + 1, p.y - 60 - vida * 50 + 1);
      ctx.fillStyle = t.color; ctx.fillText(t.text, p.x, p.y - 60 - vida * 50);
    }
    ctx.globalAlpha = 1;
  }
  function dibuixaObj(o) {
    const d = OBJECTES[o.t], m = d.mida, im = img(srcObjecte(o.t));
    const c = iso(o.x + m / 2, o.y + m / 2);
    if (im) dibuixaObjecte(ctx, im, o.t, c.x, c.y, WP * m);
    const s = rt.get(o.id);
    ctx.textAlign = 'center';
    if (o.avariat) { ctx.font = '40px system-ui'; ctx.fillText('🔧', c.x, c.y - WP * m * 0.55); }
    else if (d.cat !== 'decoracio' && o.t !== 'entrada' && !accessible(o)) { ctx.font = '36px system-ui'; ctx.fillText('⚠️', c.x, c.y - WP * m * 0.5); }
    if (s && s.cua.length > 0 && escala > 0.3) {
      ctx.font = '800 18px "Baloo 2", system-ui'; const t = `👥 ${s.cua.length}`;
      ctx.fillStyle = 'rgba(10,53,102,.85)'; const tw = ctx.measureText(t).width + 14;
      ctx.beginPath(); ctx.roundRect(c.x - tw / 2, c.y + 4, tw, 24, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(t, c.x, c.y + 22);
    }
  }
  function dibuixaPersona(a) {
    const im = img(`img/animacions/${a.img}.webp`);
    if (!im) return;
    const p = iso(a.fx, a.fy);
    const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4;
    const quiet = a.estat === 'cua' || a.estat === 'seu' || a.estat === 'treballa' || a.estat === 'espera';
    const frame = quiet ? 0 : Math.floor((performance.now() / 140 + (a.fx + a.fy) * 3) % 4);
    const wq = 20, hq = 30;
    ctx.globalAlpha = a.estat === 'surt' ? clamp(a.fade, 0, 1) : 1;
    if (a.rol) { ctx.fillStyle = a.rol === 'mecanic' ? '#0b78c8' : a.rol === 'netejador' ? '#3c9d32' : '#e04fa0'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 13, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.drawImage(im, frame * fw, a.dir * fh, fw, fh, p.x - wq / 2, p.y - hq + 2, wq, hq);
    if (a.rol === 'animador') { ctx.font = '18px system-ui'; ctx.textAlign = 'center'; ctx.fillText('🎈', p.x + 10, p.y - hq); }
    if (a.estat === 'treballa') { ctx.font = '18px system-ui'; ctx.textAlign = 'center'; ctx.fillText(a.rol === 'mecanic' ? '🔧' : '🧹', p.x, p.y - hq - 4); }
    if (a.pensament && a.pensament.fins > performance.now()) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(p.x, p.y - hq - 18, 17, 15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.font = '20px system-ui'; ctx.textAlign = 'center'; ctx.fillText(a.pensament.ic, p.x, p.y - hq - 11);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- capçalera ----------
  function refrescaBarra() {
    vDiners.textContent = eur(parc.diners);
    vDiners.classList.toggle('falta', parc.diners < 0);
    vVisit.textContent = String(visitants.length);
    const s = visitants.length ? visitants.reduce((t, v) => t + v.satisf, 0) / visitants.length : null;
    vSatisf.textContent = s == null ? '—' : `${Math.round(s)}%`;
    vDia.textContent = `Dia ${parc.dia} · ${hora(parc.minut)}`;
    botoVel.forEach((b, i) => b.classList.toggle('actiu', [0, 1, 2, 4][i] === velocitat));
  }
  function posaVelocitat(v) { velocitat = v; refrescaBarra(); }

  // ---------- bucle ----------
  let comptadorBarra = 0;
  function bucle(ara) {
    if (!viu) return;
    const dt = Math.min(0.25, (ara - darrerFrame) / 1000); darrerFrame = ara;
    if (velocitat && !informeObert) {
      let dm = (dt / SEGONS_PER_MINUT) * velocitat;
      while (dm > 0) { const pas = Math.min(0.5, dm); simula(pas); dm -= pas; if (informeObert) break; }
    }
    dibuixa();
    if ((comptadorBarra += dt) > 0.25) { comptadorBarra = 0; refrescaBarra(); if (!cataleg.hidden) for (const b of cataleg.children) b.disabled = parc.diners < Number(b.dataset.preu || 0); }
    if (Date.now() - darrerDesat > 30000) guarda(false);
    requestAnimationFrame(bucle);
  }

  function tancar() {
    viu = false;
    window.removeEventListener('keydown', tecla); window.removeEventListener('resize', redim);
    clearTimeout(desatPendent);
    guarda(true);
    arrel.remove();
    onTanca?.();
  }

  // ---------- arrencada ----------
  encaixa();
  ajustaPersonal();
  triaEina('mou');
  refrescaBarra();
  requestAnimationFrame((t) => { darrerFrame = t; bucle(t); });
  if (!parc.benvinguda) {
    parc.benvinguda = true;
    panell('Benvingut/da al teu parc!',
      h('p', {}, `El banc t'ha deixat ${eur(parc.deute)} i ja has pagat el terreny. Ara tens ${eur(parc.diners)} per construir.`),
      h('ol', { class: 'parc-passos' },
        h('li', {}, 'Fes camins des de l\'entrada (eina 🟫 Camins).'),
        h('li', {}, 'Construeix una atracció tocant un camí (🎠 Atraccions).'),
        h('li', {}, 'Afegeix menjar, begudes i lavabos: els visitants en necessitaran.'),
        h('li', {}, 'Posa preus a 💶 Diners i mira l\'informe al final de cada dia.')),
      h('p', { class: 'nota' }, 'Cada dia del parc dura 4 minuts (de 10:00 a 20:00). Pots accelerar el temps o posar-lo en pausa. El parc només funciona mentre el tens obert.'),
      h('button', { class: 'btn btn-principal btn-gran', onclick: tancaInfo }, 'Som-hi!'));
    guarda(true);
  }
  return { tancar };
}
