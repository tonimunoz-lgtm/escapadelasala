// =============================================================
//  EL TEU PARC D'ATRACCIONS (fase 1)
//  - Editor: camins, atraccions, parades, serveis i decoració.
//  - Visitants que caminen, fan cua, mengen, embruten i opinen.
//  - Economia: entrades, preus de cada atracció i parada, personal,
//    manteniment, préstec i informe de cada dia.
//  El parc funciona mentre el tens obert (es pot posar en pausa).
// =============================================================
import { h, avis } from './ui.js';
import { faseEconomica } from './joc.js';
import {
  RECERCA_NIVELLS, RECERCA_ORDRE, PER_INVESTIGAR, CAMPANYES, NOMS_VISITANTS,
  MIDA_TOTAL as M, ORIGEN, COST_TRAM_MURALLA, COST_TORRE, ATRACTIU_MURALLA, BLOC, LIMITS_BLOCS, BLOCS_INICIALS, preuParcella, PLACES_CARRER, PART_EN_COTXE, PERSONES_PER_COTXE, ENTRADA, MINUTS_DIA, SEGONS_PER_MINUT, HORA_OBERTURA, ULTIMA_ENTRADA, INTERES_DIARI,
  COST_CAMI, RETORN_ENDERROC, PERSONAL_PARC, CATEGORIES, OBJECTES, srcObjecte, dibuixaObjecte,
} from './parc-dades.js';

const WP = 128;                       // amplada d'una casella del parc (unitats del món)
const iso = (u, v) => ({ x: (u - v) * WP / 2, y: (u + v) * WP / 4 });
const k2 = (x, y) => `${x},${y}`;
// Les caselles van de (-7,-14) a (27,20): l'espai màxim del parc. idx() les passa a un índex de taula.
const OX = ORIGEN.x, OY = ORIGEN.y;
const aLaGraella = (x, y) => x >= -OX && y >= -OY && x < M - OX && y < M - OY;
const idx = (x, y) => (y + OY) * M + (x + OX);
const desIdx = (c) => [c % M - OX, Math.floor(c / M) - OY];
const blocDe = (x, y) => `${Math.floor(x / BLOC)},${Math.floor(y / BLOC)}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur = (n) => `${fmt.format(n)} €`;
const eur2 = (n) => `${fmt2.format(n)} €`;
const hora = (m) => { const t = HORA_OBERTURA * 60 + Math.floor(m); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
const PERSONES = 21;
// elements SVG (el gràfic de benefici)
const sv = (tag, attrs = {}, ...fills) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const f of fills.flat()) if (f != null) el.append(f.nodeType ? f : String(f));
  return el;
};
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
  parquing: ['🚗', 'No troben lloc per aparcar (i se\'n tornen a casa)', 'Construeix un pàrquing: cada un té 20 places.'],
  intens: ['😱', 'Algunes atraccions els fan massa por', 'És normal: no a tothom li agraden les emocions fortes. Tingues atraccions de tots els tipus.'],
  vomit: ['🤮', 'Hi ha vòmits als camins', 'Les atraccions de mareig alt fan vomitar: posa una infermeria a prop i netejadors.'],
  pluja: ['🌧️', 'Plou i no hi ha on aixoplugar-se', 'Els dies de pluja ve menys gent: aprofita per fer manteniment.'],
  mareig: ['🤢', 'Es maregen i no hi ha infermeria', 'Si tens atraccions fortes, construeix una infermeria.'],
};

// Esdeveniments que pot llançar el professorat (config.esdeveniment = { tipus, fins })
export const ESDEVENIMENTS = {
  calor: { nom: 'Onada de calor', ic: '☀️', text: 'Tothom té molta set: es venen moltes més begudes i gelats.', arribades: 1.05, set: 1.8 },
  pluja: { nom: 'Dia de pluja', ic: '🌧️', text: 'Ve la meitat de gent i estan de pitjor humor.', arribades: 0.5, satisf: -0.03 },
  festa: { nom: 'Festa Major', ic: '🎉', text: 'Hi ha festa a la comarca: ve molta més gent.', arribades: 1.4 },
};

// Pensaments positius (elogis), com al RollerCoaster Tycoon
const ELOGIS = {
  genial: ['🤩', 'Aquesta atracció és genial!'],
  bonpreu: ['👍', 'Quin preu tan bo!'],
  bonic: ['🌸', 'Quin parc tan bonic!'],
  net: ['✨', 'Que net que està tot!'],
  bonmenjar: ['😋', 'Això estava boníssim!'],
  divertit: ['😄', 'M\'ho estic passant d\'allò més bé!'],
};

export function obrirParc({ estat, desar = () => {}, publicar, onTanca, nomesLectura = false, pas = () => null, onFita = () => {}, obrePortes = () => {}, config = () => ({}) }) {
  const parc = estat.parc;
  // Els diners del parc són els diners de l'empresa (un sol compte). Si el parc encara tenia diners
  // propis (versió anterior), passen a l'empresa.
  if (Object.prototype.hasOwnProperty.call(parc, 'diners') && Object.getOwnPropertyDescriptor(parc, 'diners').value !== undefined) {
    estat.diners = (estat.diners || 0) + (parc.diners || 0); delete parc.diners;
  }
  Object.defineProperty(parc, 'diners', { get: () => estat.diners, set: (v) => { estat.diners = v; }, enumerable: false, configurable: true });
  parc.obert ??= !!estat.constitucio?.constituida;
  const esdeveniment = () => { const e = config()?.esdeveniment; return e && e.fins > Date.now() ? ESDEVENIMENTS[e.tipus] : null; };
  parc.brossa ??= {}; parc.historial ??= []; parc.personal ??= { mecanic: 0, netejador: 0, animador: 0 };
  parc.preus ??= { entrada: 5 }; parc.totals ??= { visitants: 0, ingressos: 0, despeses: 0 };
  for (const r of parc.historial) if (Array.isArray(r.queixes)) r.queixes = Object.fromEntries(r.queixes);
  parc.blocs ??= [...BLOCS_INICIALS]; parc.preus.parquing ??= 3;
  let blocs = new Set(parc.blocs);
  // una casella és del parc si és dins d'una parcel·la comprada
  const dins = (x, y) => aLaGraella(x, y) && blocs.has(blocDe(x, y));

  // ---------- DOM ----------
  const canvas = h('canvas', { class: 'parc-canvas', 'aria-label': 'El teu parc d\'atraccions' });
  let vEsdev = null, botoObrir = null, vValoracio = null, infoVisitant = null;
  const vDiners = h('strong', {}), vVisit = h('strong', {}), vSatisf = h('strong', {}), vDia = h('strong', {});
  const botoVel = [0, 1, 2, 4].map((v) => h('button', { class: 'parc-vel', title: v ? `Velocitat x${v}` : 'Pausa', onclick: () => posaVelocitat(v) }, v === 0 ? '⏸' : v === 1 ? '▶' : v === 2 ? '⏩' : '⏭'));
  const barra = h('header', { class: 'parc-barra' },
    h('button', { class: 'btn parc-tornar', onclick: tancar }, '← Ciutat'),
    h('span', { class: 'parc-nom' }, `🎢 ${parc.nom}`),
    h('span', { class: 'parc-dada', title: 'Diners del parc' }, '💶 ', vDiners),
    h('span', { class: 'parc-dada', title: 'Visitants dins del parc' }, '👥 ', vVisit),
    h('span', { class: 'parc-dada', title: 'Satisfacció mitjana dels visitants' }, '😊 ', vSatisf),
    h('span', { class: 'parc-dada', title: 'Valoració del parc (0-999): satisfacció, atraccions, netedat i fama' }, '⭐ ', vValoracio = h('strong', {})),
    h('span', { class: 'parc-dada', title: 'Dia i hora' }, '📅 ', vDia),
    vEsdev = h('span', { class: 'parc-esdev', hidden: true }),
    botoObrir = h('button', { class: 'btn btn-principal parc-obrir', hidden: true, onclick: () => {
      if (pas() !== 'obertura') return avis(pas() === 'atraccio' ? 'Abans d\'obrir, construeix una atracció i connecta-la amb un camí fins a l\'entrada.' : 'Abans d\'obrir, acaba els tràmits de l\'empresa.', 'error');
      parc.obert = true; obrePortes(); guarda(true); refrescaBarra();
    } }, '🎉 Obre el parc!'),
    h('span', { class: 'parc-vels' }, ...botoVel));
  const EINES = [
    ['mou', '✋', 'Mou'],
    ['cami', '🟫', 'Camins'],
    ...CATEGORIES.map(([id, nom, img]) => [id, img, nom]),
    ['enderroca', '🧨', 'Enderroca'],
    ['terreny', '🗺️', 'Terreny'],
    ['finances', '💶', 'Diners'],
    ['personal', '👷', 'Personal'],
    ['opinions', '💭', 'Opinions'],
    ['marqueting', '📣', 'Màrqueting'],
    ['recerca', '🔬', 'Recerca'],
  ];
  const botonsEina = {};
  const eines = h('nav', { class: 'parc-eines' }, ...EINES.map(([id, ic, nom]) => {
    const b = h('button', { class: 'parc-eina', title: nom, 'data-eina': id, onclick: () => triaEina(id) },
      ic.length > 3 ? h('img', { src: srcObjecte(ic), alt: '' }) : h('span', { class: 'parc-eina-ic' }, ic), h('span', {}, nom));
    botonsEina[id] = b;
    return b;
  }));
  const cataleg = h('div', { class: 'parc-cataleg', hidden: true });
  const info = h('aside', { class: 'parc-info', hidden: true });
  const ajuda = h('div', { class: 'parc-ajuda' });
  // barra petita que surt mentre col·loques o mous alguna cosa (el catàleg s'amaga perquè no tapi el mapa)
  const xip = h('div', { class: 'parc-xip', hidden: true });
  const zoom = h('div', { class: 'parc-zoom' },
    h('button', { onclick: () => zoomA(1.25) }, '+'), h('button', { onclick: () => zoomA(0.8) }, '−'), h('button', { onclick: encaixa, class: 'parc-zoom-text' }, 'Tot'));
  const arrel = h('div', { class: `parc${nomesLectura ? ' parc-lectura' : ''}` }, canvas, barra, eines, cataleg, info, ajuda, xip, zoom);
  document.body.append(arrel);
  const ctx = canvas.getContext('2d');

  // ---------- estat d'execució (no es desa) ----------
  let velocitat = 1, eina = 'mou', aColocar = null, hover = null, movent = null, girNou = 0;
  let escala = 0.5; const despl = { x: 0, y: 0 };
  const visitants = [], personal = [], textos = [];
  const rt = new Map();          // estat de cada atracció/parada: cua, muntats...
  let ocup = new Int32Array(M * M), acces = new Map(), bellesa = new Float32Array(M * M), paperera = new Uint8Array(M * M);
  let entradaAcces = [];
  let cotxes = 0;   // cotxes aparcats ara mateix (cada visitant en cotxe en compta 1/3)
  const placesPropies = () => parc.objectes.filter((o) => o.t === 'parquing' && o.x >= 0).length * OBJECTES.parquing.places;
  let pendentArribada = 0, darrerFrame = performance.now(), viu = true, darrerDesat = Date.now(), informeObert = false;
  parc.avui ??= nouDia();
  parc.avui.botigues ??= 0; parc.avui.altres ??= 0; parc.avui.parquing ??= 0; parc.avui.senseParquing ??= 0;

  function nouDia() {
    return { visitants: 0, entrades: 0, atraccions: 0, menjar: 0, botigues: 0, altres: 0, parquing: 0, senseParquing: 0, costMenjar: 0, satisfSum: 0, satisfN: 0, queixes: {} };
  }

  // ---------- caches de la graella ----------
  const camins = () => new Set(parc.camins);
  let setCamins = camins();
  const esCami = (x, y) => setCamins.has(k2(x, y));
  function recalcula() {
    setCamins = camins();
    blocs = new Set(parc.blocs);
    ocup = new Int32Array(M * M);
    for (const p of setCamins) { const [x, y] = p.split(',').map(Number); if (dins(x, y)) ocup[idx(x, y)] = -1; }
    for (const o of parc.objectes) {
      const m = OBJECTES[o.t].mida;
      for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) if (dins(o.x + dx, o.y + dy)) ocup[idx(o.x + dx, o.y + dy)] = o.id;
    }
    acces = new Map();
    bellesa = new Float32Array(M * M); paperera = new Uint8Array(M * M);
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t], m = d.mida, a = [];
      for (let i = 0; i < m; i++) for (const [x, y] of [[o.x + i, o.y - 1], [o.x + i, o.y + m], [o.x - 1, o.y + i], [o.x + m, o.y + i]]) if (dins(x, y) && esCami(x, y)) a.push([x, y]);
      acces.set(o.id, a);
      if (d.bellesa || d.paperera) {
        for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
          const x = o.x + dx, y = o.y + dy;
          if (!dins(x, y)) continue;
          if (d.bellesa) bellesa[idx(x, y)] += d.bellesa;
          if (d.paperera) paperera[idx(x, y)] = 1;
        }
      }
      if (!rt.has(o.id)) rt.set(o.id, { cua: [], muntats: [], fi: 0, servei: 0 });
    }
    const ent = parc.objectes.find((o) => OBJECTES[o.t].cat === 'fix');
    entradaAcces = ent ? acces.get(ent.id) : [];
    for (const id of [...rt.keys()]) if (!parc.objectes.some((o) => o.id === id)) rt.delete(id);
  }
  recalcula();
  // Fita de la constitució: hi ha almenys una atracció a la qual es pot arribar des de l'entrada
  function comprovaFites() {
    if (pas() !== 'atraccio' || !entradaAcces.length) return;
    const [sx, sy] = entradaAcces[0];
    if (parc.objectes.some((o) => OBJECTES[o.t].cat === 'atraccio' && accessible(o) && ruta(sx, sy, acces.get(o.id)))) onFita('atraccio');
  }
  // ---------- investigació ----------
  function recerca() {
    if (!parc.recerca) {
      // el que ja estava construit (parcs d'abans) compta com a investigat
      parc.recerca = { nivell: 'normal', punts: 0, investigat: [...new Set(parc.objectes.map((o) => o.t).filter((t) => PER_INVESTIGAR.has(t)))] };
    }
    return parc.recerca;
  }
  const investigat = (t) => !PER_INVESTIGAR.has(t) || recerca().investigat.includes(t);
  const seguentRecerca = () => RECERCA_ORDRE.find(([t]) => !recerca().investigat.includes(t)) || null;

  // ---------- valoració del parc (0-999), com al RollerCoaster ----------
  function valoracio() {
    const s = visitants.length ? visitants.reduce((t, v) => t + v.satisf, 0) / visitants.length : (parc.historial.at(-1)?.satisf ?? 60);
    const atr = parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio');
    const brossa = Object.values(parc.brossa).reduce((t, n) => t + n, 0);
    const v = s * 5 + Math.min(250, atr.length * 25) + Math.max(0, 150 - brossa * 8) + parc.reputacio - atr.filter((o) => o.avariat).length * 40;
    return Math.round(clamp(v, 0, 999));
  }
  const objecte = (id) => parc.objectes.find((o) => o.id === id);
  const esEntrada = (o) => OBJECTES[o.t].cat === 'fix';
  const entrada = () => parc.objectes.find(esEntrada);
  const quants = (t) => parc.objectes.filter((o) => o.t === t && o.x >= 0).length;
  const accessible = (o) => (acces.get(o.id) || []).length > 0;

  // Camí més curt (per camins) des de (x,y) fins a qualsevol casella de l'objectiu
  function ruta(x, y, objectius) {
    if (!objectius.length) return null;
    if (!aLaGraella(x, y)) return null;
    const meta = new Set(objectius.filter(([a, b]) => aLaGraella(a, b)).map(([a, b]) => idx(a, b)));
    const prev = new Int32Array(M * M).fill(-2);
    const ini = idx(x, y); prev[ini] = -1;
    const cua = [ini];
    for (let i = 0; i < cua.length; i++) {
      const c = cua[i];
      if (meta.has(c)) {
        const r = []; for (let p = c; p !== -1; p = prev[p]) r.push(desIdx(p));
        return r.reverse();
      }
      const [cx, cy] = desIdx(c);
      for (const [dx, dy] of VEINS) {
        const nx = cx + dx, ny = cy + dy;
        if (!dins(nx, ny)) continue;
        const n = idx(nx, ny);
        if (prev[n] === -2 && ocup[n] === -1) { prev[n] = c; cua.push(n); }
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
      if (d.cat === 'menjar' || d.cat === 'botiga') tipus.add(o.t);
      if (o.t === 'informacio') a += 1;
    }
    const ent = entrada();
    return a + tipus.size * 0.4 + (ent ? OBJECTES[ent.t].atractiu || 0 : 0) + (parc.muralla ? ATRACTIU_MURALLA : 0);
  }
  const preuJustEntrada = (a) => 2 + 1.5 * Math.pow(Math.max(a, 0.5), 0.7);
  function ritmeArribades(minut) {
    if (minut >= ULTIMA_ENTRADA || !entradaAcces.length || !parc.obert) return 0;
    const a = atractiu();
    if (a <= 0) return 0;
    const horaF = 0.45 + 0.85 * Math.sin(Math.PI * minut / ULTIMA_ENTRADA);
    const preuF = clamp(1.6 - parc.preus.entrada / preuJustEntrada(a), 0.03, 1.3);
    const repF = 0.4 + parc.reputacio / 80;
    const parqF = placesPropies() && quants('parquing-caseta') ? clamp(1.15 - parc.preus.parquing / 10, 0.6, 1.15) : 1;
    const busF = 1 + 0.08 * Math.min(2, quants('parada-bus'));
    const faseF = faseEconomica().vendes || 1;
    const esdF = esdeveniment()?.arribades || 1;
    const mktF = 1 + Math.min(1, (parc.campanyes || []).filter((c) => c.fins >= parc.dia).reduce((t, c) => t + (CAMPANYES[c.tipus]?.efecte || 0), 0));
    return 0.065 * a * horaF * preuF * repF * parqF * busF * faseF * esdF * mktF;
  }

  // ---------- visitants ----------
  function nouVisitant() {
    // la majoria arriben en cotxe: si no hi ha lloc per aparcar, se'n tornen
    let enCotxe = Math.random() < Math.max(0.4, PART_EN_COTXE - 0.15 * quants('parada-bus')), pagaParquing = 0;
    if (enCotxe) {
      const propies = placesPropies();
      if (cotxes + 1 / PERSONES_PER_COTXE > propies + PLACES_CARRER) {
        parc.avui.senseParquing += 1; parc.avui.queixes.parquing = (parc.avui.queixes.parquing || 0) + 1;
        return;
      }
      cotxes += 1 / PERSONES_PER_COTXE;
      // si tens pàrquing, els cotxes hi aparquen (i paguen); si no, aparquen al carrer
      // només es cobra si hi ha una caseta
      if (propies > 0 && cotxes <= propies && quants('parquing-caseta')) pagaParquing = parc.preus.parquing / PERSONES_PER_COTXE;
    }
    const [sx, sy] = entradaAcces[Math.floor(Math.random() * entradaAcces.length)];
    const v = {
      x: sx, y: sy, fx: (entrada()?.x ?? ENTRADA.x) + 0.5 + Math.random() * (OBJECTES[entrada()?.t || 'entrada'].mida - 1), fy: (entrada()?.y ?? ENTRADA.y) + OBJECTES[entrada()?.t || 'entrada'].mida - 0.8, ruta: [[sx, sy]], pas: 0,
      estat: 'camina', objectiu: null, img: `persona-${1 + Math.floor(Math.random() * PERSONES)}`, dir: 2,
      gana: 5 + Math.random() * 35, set: 5 + Math.random() * 35, lavabo: Math.random() * 25, energia: 75 + Math.random() * 25,
      satisf: 62, pressupost: 15 + Math.random() * 45, brossa: 0, passos: 0, temps: 0, vist: new Set(), sense: {}, espera: 0,
      // gustos: fins a quina intensitat aguanta (i a partir de quina li sembla avorrit) i com de fàcil es mareja
      nom: NOMS_VISITANTS[Math.floor(Math.random() * NOMS_VISITANTS.length)], num: (parc.totals.visitants || 0) + 1,
      intMax: 3 + Math.random() * 7.5, mareigF: 0.5 + Math.random(), viatges: 0, gastat: parc.preus.entrada,
    };
    v.cotxe = enCotxe;
    v.intMin = Math.max(0, v.intMax - 6);
    parc.diners += parc.preus.entrada + pagaParquing; v.pressupost -= parc.preus.entrada + pagaParquing;
    if (pagaParquing) { parc.avui.parquing += pagaParquing; parc.totals.ingressos += pagaParquing; }
    parc.avui.visitants += 1; parc.avui.entrades += parc.preus.entrada; parc.totals.visitants += 1; parc.totals.ingressos += parc.preus.entrada;
    if (parc.preus.entrada > 0) flota((entrada()?.x ?? ENTRADA.x) + 1, (entrada()?.y ?? ENTRADA.y) + 0.5, `+${eur(parc.preus.entrada)}`, '#2a7423');
    visitants.push(v);
  }
  function pensa(v, clau) {
    const q = QUEIXES[clau] || ELOGIS[clau];
    v.pensament = { ic: q?.[0] || clau, fins: performance.now() + 2600 };
    if (q) {
      (v.pensaments ??= []).unshift(`${q[0]} ${q[1]}`); if (v.pensaments.length > 5) v.pensaments.pop();
      if (QUEIXES[clau]) parc.avui.queixes[clau] = (parc.avui.queixes[clau] || 0) + 1;
      else { parc.avui.elogis ??= {}; parc.avui.elogis[clau] = (parc.avui.elogis[clau] || 0) + 1; }
    }
  }
  function flota(x, y, text, color) { textos.push({ x, y, text, color, ini: performance.now() }); if (textos.length > 40) textos.shift(); }

  // Tria què vol fer ara el visitant
  function decideix(v, minut) {
    v.objectiu = null;
    const cansat = v.energia < 8, tard = minut >= MINUTS_DIA - 40, sensePressupost = v.pressupost < 1.5;
    if (tard || cansat || sensePressupost || v.satisf < 12 || (v.temps > 320 && Math.random() < 0.4)) return marxa(v);
    const cerca = (filtre, clau, silenci = false) => {
      const cands = parc.objectes.filter((o) => filtre(o) && accessible(o) && !o.avariat);
      if (!cands.length) { if (!v.sense[clau]) { if (!silenci) { pensa(v, clau); v.satisf -= 6; } v.sense[clau] = 40; } return false; }
      const obj = new Map();
      for (const o of cands) for (const a of acces.get(o.id)) obj.set(k2(...a), o);
      const r = ruta(v.x, v.y, [...obj.keys()].map((s) => s.split(',').map(Number)));
      if (!r) { if (!v.sense[clau]) { if (!silenci) { pensa(v, clau); v.satisf -= 4; } v.sense[clau] = 40; } return false; }
      const fi = r[r.length - 1];
      v.objectiu = obj.get(k2(...fi)).id; v.ruta = r; v.pas = 0; v.estat = 'camina';
      return true;
    };
    if (v.marejat) {
      if (cerca((o) => o.t === 'primers-auxilis', 'mareig')) return;
      v.satisf -= 10; v.marejat = false; return marxa(v);
    }
    if (v.lavabo > 65 && !v.sense.lavabo && cerca((o) => o.t === 'lavabos', 'lavabo')) return;
    if (v.pressupost < 6 && v.temps < 280 && v.satisf > 45 && !v.sense.caixer && !v.caixer && cerca((o) => o.t === 'caixer', 'caixer', true)) return;
    if (v.satisf > 60 && v.temps > 90 && v.pressupost > 8 && !v.comprat && !v.sense.botiga && Math.random() < 0.08 && cerca((o) => OBJECTES[o.t].cat === 'botiga', 'botiga', true)) return;
    if (v.set > 55 && !v.sense.set && cerca((o) => o.t === 'begudes' || o.t === 'gelats', 'set')) return;
    if (v.gana > 55 && !v.sense.gana && cerca((o) => OBJECTES[o.t].cat === 'menjar' && o.t !== 'begudes', 'gana')) return;
    if (v.energia < 30 && !v.sense.cansat && cerca((o) => OBJECTES[o.t].seient, 'cansat')) return;
    // una atracció: les que encara no ha provat tenen més opcions
    const atr = parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio' && accessible(o) && !o.avariat);
    if (atr.length) {
      let total = 0;
      const pes = atr.map((o) => {
        const d = OBJECTES[o.t], int = d.intensitat ?? 3;
        const gust = int > v.intMax ? 0.02 : int < v.intMin ? 0.35 : 1;   // massa forta: gairebé mai; massa suau: poc
        const p = d.atractiu * gust * (v.vist.has(o.id) ? 0.3 : 1) / (1 + rt.get(o.id).cua.length / 8); total += p; return p;
      });
      let r = Math.random() * total, tria = atr[0];
      for (let i = 0; i < atr.length; i++) { r -= pes[i]; if (r <= 0) { tria = atr[i]; break; } }
      if (v.vist.has(tria.id) && v.vist.size >= atr.length && v.temps > 150 && Math.random() < 0.35) return marxa(v);
      if ((OBJECTES[tria.t].intensitat ?? 3) > v.intMax) { pensa(v, 'intens'); v.vist.add(tria.id); v.estat = 'espera'; v.espera = 2; return; }
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
    if (d.cat === 'atraccio' || d.cat === 'menjar' || d.cat === 'botiga' || o.t === 'lavabos' || o.t === 'caixer' || o.t === 'primers-auxilis') {
      const preu = d.cat === 'servei' ? 0 : o.preu ?? (d.cat === 'atraccio' ? 0 : d.preuJust);
      if (preu > 0) {
        const vol = clamp(1.75 - preu / d.preuJust, 0, 1);
        if (v.pressupost < preu || Math.random() > vol) { pensa(v, 'car'); v.satisf -= 5; v.estat = 'idle'; if (d.cat !== 'atraccio') v.sense[d.cat === 'menjar' ? (o.t === 'begudes' ? 'set' : 'gana') : d.cat === 'botiga' ? 'botiga' : 'lavabo'] = 25; return; }
      }
      const n = rt.get(o.id).cua.length;
      v.estat = 'cua'; v.espera = 0; rt.get(o.id).cua.push(v);
      // es col·loquen en fila dins la casella del camí (3x3 llocs, i després s'hi van afegint)
      v.fx = v.x + 0.5 + ((n % 3) - 1) * 0.27 + (Math.random() - 0.5) * 0.06;
      v.fy = v.y + 0.5 + ((Math.floor(n / 3) % 3) - 1) * 0.27 + (Math.random() - 0.5) * 0.06;
      return;
    }
    v.estat = 'idle';
  }
  // Paga i gaudeix d'una atracció o d'una parada
  function serveix(v, o) {
    const d = OBJECTES[o.t];
    const preu = d.cat === 'atraccio' ? (o.preu ?? 0) : d.cat === 'servei' ? 0 : (o.preu ?? d.preuJust);
    if (preu > 0) {
      v.pressupost -= preu; v.gastat = (v.gastat || 0) + preu; parc.diners += preu; o.ingressos = (o.ingressos || 0) + preu; parc.totals.ingressos += preu;
      if (d.cat === 'atraccio') parc.avui.atraccions += preu; else if (d.cat === 'botiga') parc.avui.botigues += preu; else parc.avui.menjar += preu;
      flota(o.x + d.mida / 2, o.y + d.mida / 2, `+${eur2(preu)}`, '#2a7423');
    }
    if (d.cat === 'menjar') {
      parc.diners -= d.cost; parc.avui.costMenjar += d.cost; parc.totals.despeses += d.cost;
      v.gana = clamp(v.gana - (d.efecte.gana || 0), 0, 100); v.set = clamp(v.set - (d.efecte.set || 0), 0, 100);
      v.lavabo += d.efecte.set > 0 ? 20 : 8;
      if (d.rapid && Math.random() < 0.4) pensa(v, 'bonmenjar');
      v.brossa = d.rapid ? 0 : 1; v.passos = 0; v.satisf += (d.satisfa || 4) * clamp(d.preuJust / Math.max(preu, 0.5), 0.5, 1.4);
      o.usos = (o.usos || 0) + 1;
    }
    if (d.cat === 'botiga') {
      parc.diners -= d.cost; parc.avui.costMenjar += d.cost; parc.totals.despeses += d.cost;
      v.comprat = true; v.satisf += 6; o.usos = (o.usos || 0) + 1;
    }
    if (o.t === 'lavabos') { v.lavabo = 0; v.satisf += 3; o.usos = (o.usos || 0) + 1; }
    if (o.t === 'primers-auxilis') { v.marejat = false; v.satisf += 5; v.energia += 15; o.usos = (o.usos || 0) + 1; }
    if (o.t === 'caixer') {
      v.caixer = true; v.pressupost += 20 + Math.random() * 30; o.usos = (o.usos || 0) + 1;
      parc.diners += 0.5; parc.avui.altres += 0.5; parc.totals.ingressos += 0.5; o.ingressos = (o.ingressos || 0) + 0.5;
    }
    if (d.cat === 'atraccio') {
      const int = d.intensitat ?? 3, ajust = int > v.intMax ? 0.4 : int < v.intMin ? 0.6 : 1;
      v.viatges = (v.viatges || 0) + 1;
      v.vist.add(o.id); v.set += 3; v.satisf += ajust * (3 + d.emocio * 1.6) * clamp(Math.sqrt(d.preuJust / Math.max(preu, d.preuJust * 0.5)), 0.6, 1.3); v.energia -= 4;
      if (Math.random() < 0.012 * (d.mareig ?? 1) * v.mareigF) { v.marejat = true; v.marejatDes = parc.minut; pensa(v, '🤢'); }
      else if (ajust === 1 && d.emocio >= 5 && Math.random() < 0.3) pensa(v, 'genial');
      if (preu > 0 && preu <= d.preuJust * 0.7 && Math.random() < 0.3) pensa(v, 'bonpreu');
    }
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
      // si no hi ha res espatllat, revisa l'atracció més gastada
      const gastada = parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio' && (o.fiabilitat ?? 100) < 85 && accessible(o) && !personal.some((q) => q !== p && q.desti === o.id))
        .sort((a, b) => (a.fiabilitat ?? 100) - (b.fiabilitat ?? 100))[0];
      if (gastada) { const r = ruta(p.x, p.y, acces.get(gastada.id)); if (r) { p.ruta = r; p.pas = 0; p.estat = 'camina'; p.desti = gastada.id; p.revisio = true; return; } }
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
    while (pendentArribada >= 1 && visitants.length < 400) { pendentArribada -= 1; nouVisitant(); }
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
          o.fiabilitat = Math.max(20, (o.fiabilitat ?? 100) - 0.12);   // cada viatge desgasta una mica
          if (Math.random() < 0.002 + (100 - o.fiabilitat) / 100 * 0.03) {
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
        const t = o.t === 'lavabos' ? 0.3 : o.t === 'caixer' ? 0.4 : o.t === 'primers-auxilis' ? 0.5 : d.rapid ? 0.15 : 0.6;   // minuts per persona
        while (s.cua.length && s.servei >= t) { s.servei -= t; const v = s.cua.shift(); serveix(v, o); v.estat = 'idle'; }
      } else s.servei = 0;
    }

    // visitants
    for (let i = visitants.length - 1; i >= 0; i--) {
      const v = visitants[i];
      v.temps += dm;
      for (const c of Object.keys(v.sense)) { v.sense[c] -= dm; if (v.sense[c] <= 0) delete v.sense[c]; }
      if (v.estat !== 'muntat') {
        const esd = esdeveniment();
        v.gana += 0.24 * dm; v.set += 0.3 * dm * (esd?.set || 1); v.satisf += (esd?.satisf || 0) * dm; v.lavabo += 0.14 * dm; v.energia -= 0.1 * dm;
        if (v.gana > 85 || v.set > 85) v.satisf -= 0.15 * dm;
        if (v.lavabo > 90) v.satisf -= 0.3 * dm;
        if (v.energia < 15) v.satisf -= 0.15 * dm;
        const c = idx(v.x, v.y);
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
        // marejat massa estona sense infermeria: vomita al camí
        if (v.marejat && parc.minut - (v.marejatDes ?? parc.minut) > 10 && esCami(v.x, v.y)) {
          parc.brossa[k2(v.x, v.y)] = Math.min(6, (parc.brossa[k2(v.x, v.y)] || 0) + 2);
          pensa(v, 'vomit'); v.satisf -= 8; v.marejat = false;
        }
        if (dins(v.x, v.y)) {
          if (bellesa[c] >= 6 && Math.random() < 0.004 * dm) pensa(v, 'bonic');
          if (v.satisf > 85 && Math.random() < 0.003 * dm) pensa(v, 'divertit');
          if (Math.random() < 0.0015 * dm && Object.keys(parc.brossa).length < 2) pensa(v, 'net');
        }
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
          if (p.rol === 'mecanic' && p.desti && (objecte(p.desti)?.avariat || p.revisio)) { p.estat = 'treballa'; p.feina = p.revisio && !objecte(p.desti)?.avariat ? 5 : 12; }
        }
      } else if (p.estat === 'treballa') {
        p.feina -= dm;
        if (p.feina <= 0) {
          if (p.rol === 'netejador') delete parc.brossa[p.desti];
          if (p.rol === 'mecanic') {
            const o = objecte(p.desti);
            if (o) { flota(o.x + 1, o.y + 1, o.avariat ? '🔧 Reparada' : '🔧 Revisada', '#0b78c8'); o.avariat = false; o.fiabilitat = Math.min(100, Math.max(o.fiabilitat ?? 100, 92)); }
          }
          p.estat = 'idle'; p.desti = null; p.revisio = false;
        }
      } else decideixPersonal(p);
    }

    if (parc.minut >= MINUTS_DIA) tancaDia();
  }
  function surt(v) {
    if (v.cotxe) cotxes = Math.max(0, cotxes - 1 / PERSONES_PER_COTXE);
    parc.reputacio = clamp(parc.reputacio * 0.98 + v.satisf * 0.02, 0, 100);
    parc.avui.satisfSum += v.satisf; parc.avui.satisfN += 1;
  }

  // ---------- final del dia: informe ----------
  function tancaDia() {
    for (const v of visitants) surt(v);
    visitants.length = 0; cotxes = 0;
    for (const s of rt.values()) { s.cua = []; s.muntats = []; }
    const a = parc.avui;
    const manteniment = parc.objectes.reduce((t, o) => t + (OBJECTES[o.t].manteniment || 0), 0);
    const sous = Object.entries(parc.personal).reduce((t, [rol, n]) => t + n * PERSONAL_PARC[rol].sou, 0);
    const interessos = Math.round(parc.deute * INTERES_DIARI);
    // publicitat: les campanyes actives es paguen cada dia
    parc.campanyes = (parc.campanyes || []).filter((c) => c.fins >= parc.dia);
    const publicitat = parc.campanyes.reduce((t, c) => t + (CAMPANYES[c.tipus]?.costDia || 0), 0);
    // investigació: punts segons el pressupost; quan n'hi ha prou, es desbloqueja la següent atracció
    const rec = recerca(), nivell = RECERCA_NIVELLS[rec.nivell] || RECERCA_NIVELLS.cap;
    let descobert = null;
    rec.punts += nivell.punts;
    const seg = seguentRecerca();
    if (seg && rec.punts >= seg[1]) { rec.punts -= seg[1]; rec.investigat.push(seg[0]); descobert = seg[0]; }
    if (!seguentRecerca()) rec.punts = 0;
    const despRecerca = seguentRecerca() || descobert ? nivell.cost : 0;
    const valoracioDia = valoracio();
    parc.diners -= manteniment + sous + interessos + publicitat + despRecerca;
    parc.totals.despeses += manteniment + sous + interessos + publicitat + despRecerca;
    const ingressos = a.entrades + a.atraccions + a.menjar + (a.botigues || 0) + (a.altres || 0) + (a.parquing || 0);
    const despeses = manteniment + sous + interessos + a.costMenjar + publicitat + despRecerca;
    const informe = {
      parquing: Math.round(a.parquing || 0), senseParquing: a.senseParquing || 0, publicitat, recerca: despRecerca, descobert, valoracio: valoracioDia,
      elogis: Object.fromEntries(Object.entries(a.elogis || {}).sort((x, y) => y[1] - x[1]).slice(0, 3)),
      dia: parc.dia, visitants: a.visitants, entrades: a.entrades, atraccions: a.atraccions, menjar: a.menjar, botigues: Math.round((a.botigues || 0) + (a.altres || 0)),
      costMenjar: Math.round(a.costMenjar), manteniment, sous, interessos, ingressos: Math.round(ingressos), despeses: Math.round(despeses),
      benefici: Math.round(ingressos - despeses), satisf: a.satisfN ? Math.round(a.satisfSum / a.satisfN) : null, reputacio: Math.round(parc.reputacio),
      // Firebase no accepta llistes dins de llistes: les 3 queixes principals es desen com a objecte
      queixes: Object.fromEntries(Object.entries(a.queixes).sort((x, y) => y[1] - x[1]).slice(0, 3)),
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
    if (nomesLectura) return;
    desar();
    if (publica) publicar?.({
      nom: parc.nom,
      camins: parc.camins.join(';'),
      objectes: parc.objectes.filter((o) => o.x >= 0).map((o) => `${o.t},${o.x},${o.y}${o.gir ? ',1' : ''}`).join(';'),
      atraccions: parc.objectes.filter((o) => OBJECTES[o.t].cat === 'atraccio').length,
      blocs: parc.blocs.join(';'),
      reputacio: Math.round(parc.reputacio),
    });
  }
  let desatPendent = null;
  function guardaAviat() {
    comprovaFites(); clearTimeout(desatPendent); desatPendent = setTimeout(() => { if (movent) guardaAviat(); else guarda(true); }, 1200); }

  // ---------- comprar terreny ----------
  function totsElsBlocs() {
    const r = [];
    for (let by = LIMITS_BLOCS.by[0]; by <= LIMITS_BLOCS.by[1]; by++) for (let bx = LIMITS_BLOCS.bx[0]; bx <= LIMITS_BLOCS.bx[1]; bx++) r.push(`${bx},${by}`);
    return r;
  }
  // es pot comprar si no és teva i toca (per un costat) una parcel·la teva
  function esComprable(b) {
    if (blocs.has(b)) return false;
    const [bx, by] = b.split(',').map(Number);
    if (bx < LIMITS_BLOCS.bx[0] || bx > LIMITS_BLOCS.bx[1] || by < LIMITS_BLOCS.by[0] || by > LIMITS_BLOCS.by[1]) return false;
    return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => blocs.has(`${bx + dx},${by + dy}`));
  }
  function compraParcella(b) {
    if (!esComprable(b)) return avis(blocs.has(b) ? 'Aquesta parcel·la ja és teva.' : 'Només pots comprar parcel·les que toquin el teu parc (les marcades en taronja).', 'error');
    let preu = preuParcella(parc.blocs.length - BLOCS_INICIALS.length), extra = 0;
    if (parc.muralla) {
      const abans = muralla().cost; blocs.add(b); extra = Math.max(0, muralla().cost - abans); blocs.delete(b);
    }
    if (parc.diners < preu + extra) return avis(`No tens prou diners: aquesta parcel·la costa ${eur(preu)}${extra ? ` (més ${eur(extra)} per allargar la muralla)` : ''}.`, 'error');
    if (!confirm(`Vols comprar aquesta parcel·la de 7x7 caselles per ${eur(preu)}${extra ? `, més ${eur(extra)} per allargar la muralla` : ''}?`)) return;
    preu += extra;
    parc.diners -= preu; parc.totals.despeses += preu;
    parc.blocs.push(b); recalcula(); guarda(true);
    const [bx, by] = b.split(',').map(Number);
    flota(bx * BLOC + BLOC / 2, by * BLOC + BLOC / 2, `−${eur(preu)}`, '#d6402f');
    avis(`Parcel·la comprada! El parc ja fa ${parc.blocs.length * BLOC * BLOC} caselles.`, 'ok');
    if (!totsElsBlocs().some(esComprable)) avis('Has arribat a la mida màxima del parc.', 'ok');
  }

  // ---------- entrada ----------
  function milloraEntrada(t) {
    const ent = entrada(), d = OBJECTES[t], m = d.mida;
    if (parc.diners < d.preu) return avis(`No tens prou diners: costa ${eur(d.preu)}.`, 'error');
    // les entrades més grans creixen cap a dins del parc (la vora de davant no es mou)
    const x = ENTRADA.x, y = ENTRADA.y + 2 - m;
    for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) {
      const c = ocup[idx(x + dx, y + dy)];
      if (!dins(x + dx, y + dy) || (c > 0 && c !== ent.id)) return avis('Hi ha alguna cosa just darrere de l\'entrada: treu-la o mou-la primer.', 'error');
    }
    if (!confirm(`Vols canviar l'entrada per ${d.nom} (${eur(d.preu)})?`)) return;
    for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) parc.camins = parc.camins.filter((p) => p !== k2(x + dx, y + dy));
    parc.diners -= d.preu; parc.totals.despeses += d.preu;
    ent.t = t; ent.x = x; ent.y = y;
    recalcula(); guarda(true); obreObjecte(ent);
    if (!entradaAcces.length) avis('Ara l\'entrada no toca cap camí: fes-ne un perquè pugui entrar la gent.', 'error');
    else avis(`Ja tens ${d.nom}!`, 'ok');
  }

  // ---------- muralla ----------
  // Trams: costats de les caselles del parc que donen a fora (excepte davant de l'entrada).
  // Torres: als punts on la muralla gira o s'acaba.
  function muralla() {
    const ent = entrada(), me = ent ? OBJECTES[ent.t].mida : 0;
    const forat = (x, yLinia) => ent && yLinia === ent.y + me && x >= ent.x && x < ent.x + me;
    const trams = [], extrems = new Map();
    const punt = (x, y, dir) => { const k = k2(x, y); if (!extrems.has(k)) extrems.set(k, new Set()); extrems.get(k).add(dir); };
    for (const b of blocs) {
      const [bx, by] = b.split(',').map(Number);
      for (let i = 0; i < BLOC; i++) {
        const x = bx * BLOC + i, y = by * BLOC + i;
        if (!dins(x, by * BLOC - 1)) { trams.push(['x', x, by * BLOC]); punt(x, by * BLOC, 'x'); punt(x + 1, by * BLOC, 'x'); }
        if (!dins(x, (by + 1) * BLOC) && !forat(x, (by + 1) * BLOC)) { trams.push(['x', x, (by + 1) * BLOC]); punt(x, (by + 1) * BLOC, 'x'); punt(x + 1, (by + 1) * BLOC, 'x'); }
        if (!dins(bx * BLOC - 1, y)) { trams.push(['y', bx * BLOC, y]); punt(bx * BLOC, y, 'y'); punt(bx * BLOC, y + 1, 'y'); }
        if (!dins((bx + 1) * BLOC, y)) { trams.push(['y', (bx + 1) * BLOC, y]); punt((bx + 1) * BLOC, y, 'y'); punt((bx + 1) * BLOC, y + 1, 'y'); }
      }
    }
    // un punt és cantonada si hi arriben trams de les dues direccions, o extrem si només n'hi arriba un
    const comptes = new Map();
    for (const [dir, x, y] of trams) for (const [px, py] of dir === 'x' ? [[x, y], [x + 1, y]] : [[x, y], [x, y + 1]]) comptes.set(k2(px, py), (comptes.get(k2(px, py)) || 0) + 1);
    const torres = [...extrems.entries()].filter(([k, dirs]) => dirs.size > 1 || comptes.get(k) === 1).map(([k]) => k.split(',').map(Number));
    return { trams, torres, cost: trams.length * COST_TRAM_MURALLA + torres.length * COST_TORRE };
  }
  function construeixMuralla() {
    if (parc.muralla) {
      if (!confirm('Vols enderrocar la muralla? No en recuperaràs els diners.')) return;
      parc.muralla = false; guarda(true); refrescaCataleg(); return;
    }
    const { trams, torres, cost } = muralla();
    if (parc.diners < cost) return avis(`No tens prou diners: la muralla costa ${eur(cost)}.`, 'error');
    if (!confirm(`La muralla envoltarà tot el parc: ${trams.length} trams i ${torres.length} torres, per ${eur(cost)}. Si després amplies el parc, la muralla s'allargarà sola (pagant només el tros nou). Endavant?`)) return;
    parc.diners -= cost; parc.totals.despeses += cost; parc.muralla = true;
    guarda(true); refrescaCataleg(); avis('El parc ja té muralla! Ara és més atractiu.', 'ok');
  }

  // ---------- construcció ----------
  function potColocar(t, x, y) {
    const m = OBJECTES[t].mida;
    for (let dx = 0; dx < m; dx++) for (let dy = 0; dy < m; dy++) {
      if (!dins(x + dx, y + dy) || ocup[idx(x + dx, y + dy)] !== 0) return false;
    }
    return true;
  }
  function coloca(t, x, y) {
    const d = OBJECTES[t];
    if (!investigat(t)) return avis('Aquesta atracció encara s\'ha d\'investigar.', 'error');
    if (!potColocar(t, x, y)) return avis('Aquí no hi cap: ha de ser sobre gespa lliure.', 'error');
    if (parc.diners < d.preu) return avis(`No tens prou diners: costa ${eur(d.preu)}.`, 'error');
    parc.diners -= d.preu; parc.totals.despeses += d.preu;
    const o = { id: parc.seguentId++, t, x, y };
    if (girNou) o.gir = 1;
    if (d.cat === 'atraccio') o.preu = 0; else if (d.cat === 'menjar' || d.cat === 'botiga') o.preu = d.preuJust;
    parc.objectes.push(o);
    recalcula();
    flota(x + d.mida / 2, y + d.mida / 2, `−${eur(d.preu)}`, '#d6402f');
    if (!accessible(o) && d.cat !== 'decoracio' && !d.sensecami) avis('Recorda connectar-ho amb un camí: si no, ningú hi podrà arribar.', 'info');
    guardaAviat(); refrescaCataleg();
  }
  function posaCami(x, y) {
    if (!dins(x, y) || ocup[idx(x, y)] !== 0) return;
    if (parc.diners < COST_CAMI) { avis('No tens prou diners per fer més camí.', 'error'); return; }
    parc.diners -= COST_CAMI; parc.totals.despeses += COST_CAMI;
    parc.camins.push(k2(x, y)); recalcula(); guardaAviat();
  }
  function enderroca(x, y) {
    if (!dins(x, y)) return;
    const c = ocup[idx(x, y)];
    if (c === -1) {
      parc.camins = parc.camins.filter((p) => p !== k2(x, y)); delete parc.brossa[k2(x, y)];
      for (const v of visitants) if (v.x === x && v.y === y) v.estat = 'idle';
      recalcula(); guardaAviat(); return;
    }
    if (c > 0) {
      const o = objecte(c);
      if (esEntrada(o)) return avis('L\'entrada no es pot enderrocar.', 'error');
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
    if (movent) cancelaMoure();
    for (const [k, b] of Object.entries(botonsEina)) b.classList.toggle('actiu', k === id);
    aColocar = null; xip.hidden = true; ajuda.hidden = false;
    if (id === 'finances') { eina = 'mou'; botonsEina.mou.classList.add('actiu'); botonsEina.finances.classList.remove('actiu'); cataleg.hidden = true; return obreFinances(); }
    if (id === 'personal') { eina = 'mou'; botonsEina.mou.classList.add('actiu'); botonsEina.personal.classList.remove('actiu'); cataleg.hidden = true; return obrePersonal(); }
    const panells = { opinions: obreOpinions, marqueting: obreMarqueting, recerca: obreRecerca };
    if (panells[id]) { eina = 'mou'; botonsEina.mou.classList.add('actiu'); botonsEina[id].classList.remove('actiu'); cataleg.hidden = true; return panells[id](); }
    const abans = eina;
    eina = id;
    if ((abans === 'terreny') !== (id === 'terreny')) encaixa();
    cataleg.hidden = !CATEGORIES.some(([c]) => c === id);
    if (!cataleg.hidden) refrescaCataleg();
    const textos = {
      mou: 'Arrossega per moure\'t. Toca una atracció o una parada per veure-la i canviar-ne el preu.',
      cami: `Arrossega per la gespa per fer camins (${eur(COST_CAMI)} per casella). Els visitants només caminen pels camins.`,
      enderroca: 'Toca o arrossega per treure camins i objectes. Dels objectes en recuperes la meitat del preu.',
      terreny: `Toca una parcel·la marcada en taronja per comprar-la. Cada parcel·la fa 7x7 caselles i n'hi pot haver fins a ${(LIMITS_BLOCS.bx[1] - LIMITS_BLOCS.bx[0] + 1) * (LIMITS_BLOCS.by[1] - LIMITS_BLOCS.by[0] + 1)}.`,
    };
    ajuda.textContent = textos[id] || 'Tria què vols construir i toca la gespa on ho vols posar.';
  }
  function refrescaCataleg() {
    if (cataleg.hidden) return;
    const cartaMuralla = eina === 'decoracio' ? h('button', { class: `parc-carta${parc.muralla ? ' triada' : ''}`, onclick: construeixMuralla, title: 'Envolta tot el parc amb una muralla' },
      h('img', { src: 'img/parc/muralla-tram.webp', alt: '' }), h('strong', {}, parc.muralla ? 'Muralla (feta)' : 'Muralla'),
      h('span', {}, parc.muralla ? 'Toca per treure-la' : eur(muralla().cost)), h('span', { class: 'nota' }, `Tot el parc · +${ATRACTIU_MURALLA} d'atractiu`)) : null;
    cataleg.replaceChildren(...[cartaMuralla].filter(Boolean), ...Object.entries(OBJECTES).filter(([, d]) => d.cat === eina).map(([t, d]) => !investigat(t) ? h('button', {
      class: 'parc-carta bloquejada', title: 'Encara s\'ha d\'investigar', onclick: () => obreRecerca(),
    }, h('img', { src: srcObjecte(t), alt: '' }), h('strong', {}, d.nom), h('span', {}, '🔒 Per investigar'), h('span', { class: 'nota' }, seguentRecerca()?.[0] === t ? 'S\'està investigant ara' : 'Toca per veure la recerca')) : h('button', {
      class: `parc-carta${aColocar === t ? ' triada' : ''}`, disabled: parc.diners < d.preu, title: d.text || '', 'data-preu': d.preu,
      onclick: () => { aColocar = t; mostraXip(); },
    }, h('img', { src: srcObjecte(t), alt: '' }), h('strong', {}, d.nom), h('span', {}, eur(d.preu)),
    d.atractiu ? h('span', { class: 'nota' }, `Atractiu ${d.atractiu} · ${d.capacitat} places · ${d.mida}x${d.mida}`) : d.cost ? h('span', { class: 'nota' }, `Cost: ${eur2(d.cost)} / unitat`) : null)));
  }
  function mostraXip() {
    const d = OBJECTES[aColocar];
    cataleg.hidden = true; ajuda.hidden = true; xip.hidden = false;
    const text = movent
      ? `Mou ${d.nom}: toca on la vols posar${movent.cost ? ` (costarà ${eur(movent.cost)})` : ' (gratis)'}.`
      : `${d.nom} (${eur(d.preu)}): toca la gespa on la vols posar${d.mida > 1 ? ` (${d.mida}x${d.mida})` : ''}. Pots arrossegar el mapa.`;
    xip.replaceChildren(...[h('img', { src: srcObjecte(aColocar), alt: '', style: (movent ? movent.o.gir : girNou) ? 'transform: scaleX(-1)' : '' }), h('span', {}, text),
      h('button', { class: 'btn', title: 'Gira (tecla R)', onclick: giraNou }, '↔ Gira'),
      movent ? null : h('button', { class: 'btn', onclick: () => { aColocar = null; xip.hidden = true; cataleg.hidden = false; refrescaCataleg(); } }, 'Canvia'),
      h('button', { class: 'btn btn-principal', onclick: () => { if (movent) cancelaMoure(); else { aColocar = null; xip.hidden = true; cataleg.hidden = false; refrescaCataleg(); } } }, movent ? 'Cancel·la' : 'Fet')].filter(Boolean));
  }
  // Girar (com en un mirall) el que estàs col·locant o movent
  function giraNou() {
    if (movent) movent.o.gir = movent.o.gir ? 0 : 1; else girNou = girNou ? 0 : 1;
    mostraXip();
  }
  // Moure un objecte ja construït: gratis si encara no l'ha fet servir ningú (o és decoració)
  function costMoure(o) { const d = OBJECTES[o.t]; return d.cat === 'decoracio' || !(o.usos > 0) ? 0 : Math.round(d.preu * 0.1); }
  function comencaMoure(o) {
    const s = rt.get(o.id);
    if (s) { for (const v of [...s.cua, ...s.muntats]) { v.estat = 'idle'; v.amagat = false; } s.cua = []; s.muntats = []; }
    movent = { o, x0: o.x, y0: o.y, cost: costMoure(o) };
    o.x = -100; o.y = -100;
    recalcula(); tancaInfo();
    for (const [k, b] of Object.entries(botonsEina)) b.classList.toggle('actiu', k === 'mou');
    eina = 'mou'; aColocar = o.t; mostraXip();
  }
  function acabaMoure(x, y) {
    const { o, cost } = movent;
    if (!potColocar(o.t, x, y)) return avis('Aquí no hi cap: ha de ser sobre gespa lliure.', 'error');
    if (parc.diners < cost) return avis(`No tens prou diners per moure-la (${eur(cost)}).`, 'error');
    o.x = x; o.y = y; parc.diners -= cost; parc.totals.despeses += cost;
    movent = null; aColocar = null; xip.hidden = true; ajuda.hidden = false;
    recalcula(); guardaAviat();
    if (!accessible(o) && OBJECTES[o.t].cat !== 'decoracio' && !OBJECTES[o.t].sensecami) avis('Recorda connectar-la amb un camí.', 'info');
  }
  function cancelaMoure() {
    if (!movent) return;
    movent.o.x = movent.x0; movent.o.y = movent.y0;
    movent = null; aColocar = null; xip.hidden = true; ajuda.hidden = false;
    recalcula();
  }
  function tancaInfo() { info.hidden = true; info.replaceChildren(); infoVisitant = null; }
  function panell(titol, ...cos) {
    infoVisitant = null;
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
    if (esEntrada(o)) {
      const a = atractiu();
      const millores = Object.entries(OBJECTES).filter(([t, x]) => x.cat === 'fix' && x.preu > d.preu).map(([t, x]) =>
        h('button', { class: 'btn btn-principal', onclick: () => milloraEntrada(t) }, `Millora a ${x.nom} (${eur(x.preu)})`));
      cos.push(h('p', {}, 'Per aquí entren els visitants. El preu de l\'entrada és el que paguen en arribar.'),
        h('label', { class: 'fila-preu' }, 'Preu de l\'entrada (€)', campPreu(parc.preus.entrada, (n) => { parc.preus.entrada = n; }, 1)),
        h('p', { class: 'nota' }, `Amb les atraccions que tens, als visitants els sembla raonable pagar uns ${eur(preuJustEntrada(a))}. Com més cara, menys gent vindrà.`),
        millores.length ? h('h3', {}, 'Millora l\'entrada') : null,
        ...Object.entries(OBJECTES).filter(([, x]) => x.cat === 'fix' && x.preu > d.preu).map(([, x]) => h('p', { class: 'nota' }, `${x.nom}: ${x.text}`)),
        ...millores);
    } else {
      if (d.text) cos.push(h('p', { class: 'nota' }, d.text));
      if (!accessible(o) && d.cat !== 'decoracio' && !d.sensecami) cos.push(h('p', { class: 'nota falta' }, '⚠️ No toca cap camí: ningú hi pot arribar.'));
      if (d.cat === 'atraccio') {
        const barra = (nom, n, color) => h('div', { class: 'parc-nota' }, h('span', {}, nom), h('span', { class: 'parc-barreta' }, h('span', { style: `width:${n * 10}%;background:${color}` })), h('strong', {}, `${n}/10`));
        cos.push(barra('Emoció', d.emocio ?? 0, '#3c9d32'), barra('Intensitat', d.intensitat ?? 0, '#f2891d'), barra('Mareig', d.mareig ?? 0, '#8e44ad'),
          h('p', { class: 'nota' }, 'Cada visitant té els seus gustos: si la intensitat és més alta del que aguanta, no hi puja; si és massa baixa, s\'avorreix. Com més mareig, més gent es mareja.'),
          barra('Fiabilitat', Math.round((o.fiabilitat ?? 100) / 10), (o.fiabilitat ?? 100) > 70 ? '#0b78c8' : '#d6402f'),
          h('p', { class: 'nota' }, `Fiabilitat: ${Math.round(o.fiabilitat ?? 100)} %. Amb l'ús es desgasta i s'espatlla més sovint; els mecànics la revisen quan no tenen res a reparar.`));
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
      if (d.cat === 'menjar' || d.cat === 'botiga') {
        cos.push(h('dl', { class: 'dades' },
          h('dt', {}, 'Unitats venudes'), h('dd', {}, fmt.format(o.usos || 0)),
          h('dt', {}, 'Ingressos totals'), h('dd', {}, eur(o.ingressos || 0)),
          h('dt', {}, 'Et costa cada unitat'), h('dd', {}, eur2(d.cost)),
          h('dt', {}, 'Manteniment'), h('dd', {}, `${eur(d.manteniment)} / dia`)),
        h('label', { class: 'fila-preu' }, 'Preu de venda (€)', campPreu(o.preu ?? d.preuJust, (n) => { o.preu = n; }, 0.1)),
        h('p', { class: 'nota' }, `Marge per unitat: preu de venda − cost. Als visitants els sembla just pagar uns ${eur2(d.preuJust)}.`));
      }
      if (o.t === 'parquing') {
        cos.push(h('dl', { class: 'dades' },
          h('dt', {}, 'Places (tots els pàrquings)'), h('dd', {}, String(placesPropies())),
          h('dt', {}, 'Cotxes aparcats ara'), h('dd', {}, String(Math.round(Math.min(cotxes, placesPropies())))),
          h('dt', {}, 'Places al carrer (gratis)'), h('dd', {}, String(PLACES_CARRER))),
        h('label', { class: 'fila-preu' }, 'Preu per cotxe (€)', campPreu(parc.preus.parquing, (n) => { parc.preus.parquing = n; }, 0.5)),
        h('p', { class: 'nota' }, 'Com més car, menys gent vindrà. Si el pàrquing és ple, els que arriben en cotxe se\'n tornen a casa.'),
        quants('parquing-caseta') ? null : h('p', { class: 'nota falta' }, 'Ara és gratis: per cobrar, construeix una caseta del pàrquing (a Serveis).'));
      } else if (d.cat === 'servei') cos.push(h('p', { class: 'nota' }, `Usos: ${fmt.format(o.usos || 0)} · Manteniment: ${eur(d.manteniment)} / dia${o.t === 'caixer' ? ` · Comissions: ${eur2(o.ingressos || 0)}` : ''}`));
      const cm = costMoure(o);
      cos.push(h('div', { class: 'fila-botons' },
        h('button', { class: 'btn', onclick: () => { o.gir = o.gir ? 0 : 1; guardaAviat(); } }, '↔ Gira'),
        h('button', { class: 'btn', onclick: () => comencaMoure(o) }, cm ? `Mou-la (${eur(cm)})` : 'Mou-la (gratis)'),
        h('button', { class: 'btn', onclick: () => enderroca(o.x, o.y) }, `Enderroca (+${eur(Math.round(d.preu * RETORN_ENDERROC))})`)),
      h('p', { class: 'nota' }, cm ? 'Com que ja s\'ha fet servir, moure-la costa un 10 % del preu (desmuntar i tornar a muntar).' : 'Encara no l\'ha fet servir ningú: la pots moure gratis.'));
    }
    panell(d.nom, ...cos);
  }
  // ---------- un visitant ----------
  function obreVisitant(v) {
    const barra = (nom, n, color) => h('div', { class: 'parc-nota' }, h('span', {}, nom), h('span', { class: 'parc-barreta' }, h('span', { style: `width:${clamp(n, 0, 100)}%;background:${color}` })));
    const fer = { camina: v.objectiu === 'sortida' ? 'Se\'n va cap a la sortida' : v.objectiu ? `Va cap a: ${OBJECTES[objecte(v.objectiu)?.t]?.nom || '...'}` : 'Passeja', cua: 'Fa cua', muntat: 'És dins d\'una atracció', seu: 'Descansa en un banc', idle: 'Pensa què fer', espera: 'Mira al seu voltant', surt: 'Marxa del parc' }[v.estat] || '';
    panell(`${v.nom} (visitant n. ${v.num})`,
      h('p', {}, h('strong', {}, fer), v.marejat ? ' · 🤢 Està marejat' : ''),
      barra('Felicitat', v.satisf, '#3c9d32'), barra('Energia', v.energia, '#0b78c8'),
      barra('Gana', v.gana, '#f2891d'), barra('Set', v.set, '#29a3d6'), barra('Lavabo', v.lavabo, '#8e44ad'),
      h('dl', { class: 'dades' },
        h('dt', {}, 'Diners que li queden'), h('dd', {}, eur2(Math.max(0, v.pressupost))),
        h('dt', {}, 'Ha gastat al parc'), h('dd', {}, eur2(v.gastat || 0)),
        h('dt', {}, 'Atraccions on ha pujat'), h('dd', {}, String(v.viatges || 0)),
        h('dt', {}, 'Intensitat que li agrada'), h('dd', {}, `de ${v.intMin.toFixed(0)} a ${v.intMax.toFixed(0)}`),
        h('dt', {}, 'Temps al parc'), h('dd', {}, `${Math.round(v.temps)} min`)),
      h('h3', {}, 'Què pensa'),
      v.pensaments?.length ? h('ul', { class: 'parc-queixes' }, ...v.pensaments.map((t) => h('li', {}, t))) : h('p', { class: 'nota' }, 'Encara no ha pensat res especial.'));
    infoVisitant = v;
  }
  // ---------- què pensen els visitants (avui) ----------
  function obreOpinions() {
    const llista = (obj, dic, classe) => Object.entries(obj || {}).filter(([c]) => dic[c]).sort((a, b) => b[1] - a[1])
      .map(([c, n]) => h('li', { class: classe }, `${dic[c][0]} ${dic[c][1]} `, h('strong', {}, `(${n})`), dic[c][2] ? h('span', { class: 'nota' }, dic[c][2]) : null));
    const bons = llista(parc.avui.elogis, ELOGIS, ''), dolents = llista(parc.avui.queixes, QUEIXES, '');
    panell('Què pensen els visitants (avui)',
      h('p', { class: 'nota' }, 'Com al RollerCoaster Tycoon: el que diuen els visitants és la millor pista per saber què has de millorar. Toca un visitant per veure què pensa ell.'),
      h('h3', {}, '👍 Coses bones'), bons.length ? h('ul', { class: 'parc-queixes' }, ...bons) : h('p', { class: 'nota' }, 'Encara res.'),
      h('h3', {}, '👎 Queixes'), dolents.length ? h('ul', { class: 'parc-queixes' }, ...dolents) : h('p', { class: 'nota' }, 'Cap queixa. Molt bé!'));
  }
  // ---------- màrqueting ----------
  function obreMarqueting() {
    parc.campanyes = (parc.campanyes || []).filter((c) => c.fins >= parc.dia);
    const files = Object.entries(CAMPANYES).map(([id, c]) => {
      const activa = parc.campanyes.find((x) => x.tipus === id);
      return h('div', { class: 'parc-personal' },
        h('div', {}, h('strong', {}, `${c.ic} ${c.nom}`), h('span', { class: 'nota' }, `${c.text} ${eur(c.costDia)} cada dia · +${Math.round(c.efecte * 100)} % de visitants.`)),
        activa ? h('p', { class: 'nota' }, `✅ En marxa fins al dia ${activa.fins}.`) : h('div', { class: 'fila-botons' }, ...[3, 7].map((dies) =>
          h('button', { class: 'btn', onclick: () => { parc.campanyes.push({ tipus: id, fins: parc.dia + dies - 1 }); guarda(); obreMarqueting(); avis(`Campanya «${c.nom}» en marxa!`, 'ok'); } }, `${dies} dies (${eur(c.costDia * dies)})`))));
    });
    panell('Màrqueting', h('p', { class: 'nota' }, 'La publicitat fa venir més gent mentre dura. Es paga al final de cada dia. Pregunta\'t si el que guanyes de més paga el que costa!'), ...files);
  }
  // ---------- investigació ----------
  function obreRecerca() {
    const rec = recerca(), seg = seguentRecerca();
    const triar = h('div', { class: 'fila-botons' }, ...Object.entries(RECERCA_NIVELLS).map(([id, n]) =>
      h('button', { class: `btn${rec.nivell === id ? ' btn-principal' : ''}`, onclick: () => { rec.nivell = id; guarda(); obreRecerca(); } }, `${n.nom}${n.cost ? ` (${eur(n.cost)}/dia)` : ''}`)));
    const pendents = RECERCA_ORDRE.filter(([t]) => !rec.investigat.includes(t));
    panell('Investigació (R+D)',
      h('p', { class: 'nota' }, 'El departament d\'investigació dissenya atraccions noves. Com més pressupost, més de pressa. Si no hi inverteixes, no tindràs les atraccions més grans.'),
      h('h3', {}, 'Pressupost'), triar,
      seg ? h('div', { class: 'parc-personal' },
        h('strong', {}, `Ara s'investiga: ${OBJECTES[seg[0]].nom}`),
        h('div', { class: 'parc-nota' }, h('span', {}, 'Progrés'), h('span', { class: 'parc-barreta' }, h('span', { style: `width:${Math.min(100, rec.punts / seg[1] * 100)}%;background:#8e44ad` })), h('strong', {}, `${rec.punts}/${seg[1]}`)),
        h('span', { class: 'nota' }, (RECERCA_NIVELLS[rec.nivell]?.punts || 0) ? `Al ritme actual, falten uns ${Math.ceil((seg[1] - rec.punts) / RECERCA_NIVELLS[rec.nivell].punts)} dies.` : 'Amb el pressupost a «Cap», la investigació està aturada.'))
        : h('p', {}, '🎉 Ja ho has investigat tot!'),
      pendents.length > 1 ? h('h3', {}, 'Després vindran') : null,
      pendents.length > 1 ? h('ul', { class: 'parc-queixes' }, ...pendents.slice(1).map(([t]) => h('li', {}, OBJECTES[t].nom))) : null,
      rec.investigat.length ? h('h3', {}, 'Ja investigat') : null,
      rec.investigat.length ? h('p', { class: 'nota' }, rec.investigat.map((t) => OBJECTES[t]?.nom).join(', ')) : null);
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
    const preus = [h('label', { class: 'fila-preu' }, 'Entrada (€)', campPreu(parc.preus.entrada, (n) => { parc.preus.entrada = n; }, 1)),
      placesPropies() && quants('parquing-caseta') ? h('label', { class: 'fila-preu' }, 'Pàrquing, per cotxe (€)', campPreu(parc.preus.parquing, (n) => { parc.preus.parquing = n; }, 0.5)) : null];
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t];
      if (d.cat === 'atraccio') preus.push(h('label', { class: 'fila-preu' }, `${d.nom} (just: ${eur2(d.preuJust)})`, campPreu(o.preu ?? 0, (n) => { o.preu = n; })));
      if (d.cat === 'menjar' || d.cat === 'botiga') preus.push(h('label', { class: 'fila-preu' }, `${d.nom} (cost ${eur2(d.cost)}, just ${eur2(d.preuJust)})`, campPreu(o.preu ?? d.preuJust, (n) => { o.preu = n; }, 0.1)));
    }
    const taula = hist.length ? h('table', { class: 'parc-taula' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Dia'), h('th', {}, 'Visitants'), h('th', {}, 'Ingressos'), h('th', {}, 'Despeses'), h('th', {}, 'Benefici'))),
      h('tbody', {}, ...hist.map((r) => h('tr', {}, h('td', {}, String(r.dia)), h('td', {}, String(r.visitants)), h('td', {}, eur(r.ingressos)), h('td', {}, eur(r.despeses)),
        h('td', { class: r.benefici < 0 ? 'falta' : '' }, eur(r.benefici)))))) : h('p', { class: 'nota' }, 'Encara no ha acabat cap dia. Al final de cada dia (a les 20:00) veuràs l\'informe.');
    const dies = parc.historial.slice(-14);
    const grafic = dies.length > 1 ? (() => {
      const W = 340, H = 120, m = Math.max(1, ...dies.map((d) => Math.abs(d.benefici))), bw = W / dies.length;
      const y0 = H / 2;
      return sv('svg', { viewBox: `0 0 ${W} ${H + 16}`, class: 'parc-grafic', role: 'img', 'aria-label': 'Benefici dels últims dies' },
        sv('line', { x1: 0, x2: W, y1: y0, y2: y0, stroke: '#9fb3c8', 'stroke-width': 1 }),
        ...dies.map((d, i) => {
          const hh = (Math.abs(d.benefici) / m) * (H / 2 - 4);
          return sv('rect', { x: i * bw + 3, y: d.benefici >= 0 ? y0 - hh : y0, width: bw - 6, height: Math.max(1, hh), rx: 3, fill: d.benefici >= 0 ? '#3c9d32' : '#d6402f' });
        }),
        ...dies.map((d, i) => sv('text', { x: i * bw + bw / 2, y: H + 13, 'text-anchor': 'middle', 'font-size': 10, fill: '#5a6b7d' }, String(d.dia))));
    })() : null;
    panell('Diners i preus', deute, h('h3', {}, 'Preus'), ...preus, h('h3', {}, 'Benefici de cada dia'), grafic || h('p', { class: 'nota' }, 'El gràfic sortirà quan hagin passat uns quants dies.'), h('h3', {}, 'Últims dies'), taula);
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
    const consells = Object.entries(r.queixes || {}).sort((x, y) => y[1] - x[1]).filter(([c]) => QUEIXES[c]).map(([c, n]) => h('li', {}, `${QUEIXES[c][0]} ${QUEIXES[c][1]} (${n} vegades). `, h('span', { class: 'nota' }, QUEIXES[c][2])));
    panell(`Informe del dia ${r.dia}`,
      h('dl', { class: 'dades' },
        h('dt', {}, 'Visitants'), h('dd', {}, String(r.visitants)),
        h('dt', {}, 'Entrades'), h('dd', {}, eur(r.entrades)),
        h('dt', {}, 'Atraccions'), h('dd', {}, eur(r.atraccions)),
        h('dt', {}, 'Menjar i begudes'), h('dd', {}, eur(r.menjar)),
        r.botigues ? [h('dt', {}, 'Botigues i caixers'), h('dd', {}, eur(r.botigues))] : null,
        r.parquing ? [h('dt', {}, 'Pàrquing'), h('dd', {}, eur(r.parquing))] : null,
        h('dt', {}, h('strong', {}, 'Total ingressos')), h('dd', {}, h('strong', {}, eur(r.ingressos))),
        h('dt', {}, 'Cost dels productes venuts'), h('dd', {}, `−${eur(r.costMenjar)}`),
        h('dt', {}, 'Manteniment'), h('dd', {}, `−${eur(r.manteniment)}`),
        h('dt', {}, 'Sous del personal'), h('dd', {}, `−${eur(r.sous)}`),
        h('dt', {}, 'Interessos del préstec'), h('dd', {}, `−${eur(r.interessos)}`),
        r.publicitat ? [h('dt', {}, 'Publicitat'), h('dd', {}, `−${eur(r.publicitat)}`)] : null,
        r.recerca ? [h('dt', {}, 'Investigació'), h('dd', {}, `−${eur(r.recerca)}`)] : null,
        h('dt', {}, h('strong', {}, 'Benefici del dia')), h('dd', { class: r.benefici < 0 ? 'falta' : '' }, h('strong', {}, eur(r.benefici))),
        h('dt', {}, 'Satisfacció'), h('dd', {}, r.satisf == null ? '—' : `${r.satisf} / 100`),
        h('dt', {}, 'Reputació'), h('dd', {}, `${r.reputacio} / 100`),
        r.valoracio != null ? [h('dt', {}, 'Valoració del parc'), h('dd', {}, `⭐ ${r.valoracio} / 999`)] : null),
      r.descobert ? h('p', { class: 'nota' }, `🔬 Els investigadors han acabat el disseny de: `, h('strong', {}, OBJECTES[r.descobert].nom), '. Ja la pots construir!') : null,
      Object.keys(r.elogis || {}).length ? h('div', {}, h('h3', {}, 'El que més els ha agradat'), h('ul', { class: 'parc-queixes' }, ...Object.entries(r.elogis).filter(([c]) => ELOGIS[c]).map(([c, n]) => h('li', {}, `${ELOGIS[c][0]} ${ELOGIS[c][1]} (${n} vegades)`)))) : null,
      r.senseParquing ? h('p', { class: 'nota falta' }, `🚗 ${r.senseParquing} visitants no han trobat lloc per aparcar i se n'han tornat a casa.`) : null,
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
    // encaixa l'espai màxim si estàs comprant terreny; si no, només el que ja és teu
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const llista = eina === 'terreny' ? totsElsBlocs() : [...blocs];
    for (const b of llista) { const [bx, by] = b.split(',').map(Number); x0 = Math.min(x0, bx); y0 = Math.min(y0, by); x1 = Math.max(x1, bx + 1); y1 = Math.max(y1, by + 1); }
    const nx = (x1 - x0) * BLOC, ny = (y1 - y0) * BLOC;
    escala = Math.min(w / ((nx + ny) / 2 * WP * 1.08), (ht - 120) / ((nx + ny) / 4 * WP * 1.25));
    const c = iso(x0 * BLOC + nx / 2, y0 * BLOC + ny / 2);
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
  const tecla = (ev) => {
    if ((ev.key === 'r' || ev.key === 'R') && aColocar && !ev.target.matches?.('input')) { giraNou(); return; }
    if (ev.key === 'Escape') { if (movent) cancelaMoure(); else if (aColocar) { aColocar = null; xip.hidden = true; cataleg.hidden = false; refrescaCataleg(); } else triaEina('mou'); } };
  window.addEventListener('keydown', tecla);
  const redim = () => encaixa();
  window.addEventListener('resize', redim);

  function aplicaPinzell(ev) {
    const { x, y } = casella(ev.clientX, ev.clientY);
    if (eina === 'cami') posaCami(x, y); else enderroca(x, y);
  }
  function clic(ev) {
    if (aColocar) { const m = OBJECTES[aColocar].mida; const { x, y } = casella(ev.clientX, ev.clientY, m); if (movent) acabaMoure(x, y); else coloca(aColocar, x, y); return; }
    if (eina === 'terreny') { const { x, y } = casella(ev.clientX, ev.clientY); return compraParcella(blocDe(x, y)); }
    if (eina !== 'mou') return;
    const v = visitantA(ev.clientX, ev.clientY);
    if (v) return obreVisitant(v);
    const o = objecteA(ev.clientX, ev.clientY);
    if (o) obreObjecte(o);
  }
  function visitantA(sx, sy) {
    const r = canvas.getBoundingClientRect();
    const wx = (sx - r.left - despl.x) / escala, wy = (sy - r.top - despl.y) / escala;
    let millor = null, dist = 26;
    for (const v of visitants) {
      if (v.amagat) continue;
      const p = iso(v.fx, v.fy), d = Math.hypot(wx - p.x, wy - (p.y - 14));
      if (d < dist) { dist = d; millor = v; }
    }
    return millor;
  }
  // Quin objecte hi ha sota el dit: primer mira la imatge (de davant cap enrere), després la casella
  function objecteA(sx, sy) {
    const r = canvas.getBoundingClientRect();
    const wx = (sx - r.left - despl.x) / escala, wy = (sy - r.top - despl.y) / escala;
    const ordre = [...parc.objectes].filter((o) => o.x >= 0).sort((a, b) => (b.x + b.y + 2 * OBJECTES[b.t].mida) - (a.x + a.y + 2 * OBJECTES[a.t].mida));
    for (const o of ordre) {
      const d = OBJECTES[o.t], im = img(srcObjecte(o.t));
      if (!im) continue;
      const c = iso(o.x + d.mida / 2, o.y + d.mida / 2), w = WP * d.mida * d.frac, hh = w * (im.naturalHeight / im.naturalWidth);
      const baix = c.y + (WP * d.mida / 4) * d.frac;
      if (wx >= c.x - w * 0.42 && wx <= c.x + w * 0.42 && wy >= baix - hh * 0.95 && wy <= baix) return o;
    }
    const { x, y } = casella(sx, sy);
    return dins(x, y) && ocup[idx(x, y)] > 0 ? objecte(ocup[idx(x, y)]) : null;
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
    // parcel·les que es poden comprar (només es veuen amb l'eina Terreny)
    if (eina === 'terreny') {
      ctx.textAlign = 'center';
      for (const b of totsElsBlocs()) {
        if (blocs.has(b)) continue;
        const [bx, by] = b.split(',').map(Number);
        const pot = esComprable(b);
        rombe(bx * BLOC + 0.15, by * BLOC + 0.15, BLOC - 0.3, BLOC - 0.3);
        ctx.fillStyle = pot ? (hover && blocDe(hover.x, hover.y) === b ? 'rgba(255,214,120,.75)' : 'rgba(255,255,255,.35)') : 'rgba(255,255,255,.12)'; ctx.fill();
        ctx.setLineDash([16, 12]); ctx.lineWidth = 4; ctx.strokeStyle = pot ? '#f2891d' : 'rgba(255,255,255,.4)'; ctx.stroke(); ctx.setLineDash([]);
        if (pot) {
          const c = iso(bx * BLOC + BLOC / 2, by * BLOC + BLOC / 2);
          ctx.font = '800 54px "Baloo 2", system-ui'; ctx.fillStyle = '#0a3566'; ctx.fillText(eur(preuParcella(parc.blocs.length - BLOCS_INICIALS.length)), c.x, c.y + 18);
        }
      }
    }
    // terreny del parc: gespa amb un escaquer suau perquè es vegin les caselles
    for (const b of blocs) {
      const [bx, by] = b.split(',').map(Number);
      for (let y = by * BLOC; y < (by + 1) * BLOC; y++) for (let x = bx * BLOC; x < (bx + 1) * BLOC; x++) { rombe(x, y); ctx.fillStyle = (x + y) % 2 ? '#86c45a' : '#80bd54'; ctx.fill(); }
    }
    // tanca: només a les vores que no toquen una altra parcel·la teva
    ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 7; ctx.beginPath();
    for (const b of blocs) {
      const [bx, by] = b.split(',').map(Number), x0 = bx * BLOC, y0 = by * BLOC;
      const v = [[`${bx},${by - 1}`, [x0, y0], [x0 + BLOC, y0]], [`${bx + 1},${by}`, [x0 + BLOC, y0], [x0 + BLOC, y0 + BLOC]],
        [`${bx},${by + 1}`, [x0, y0 + BLOC], [x0 + BLOC, y0 + BLOC]], [`${bx - 1},${by}`, [x0, y0], [x0, y0 + BLOC]]];
      for (const [vei, a, z] of v) if (!blocs.has(vei)) { const p = iso(...a), q = iso(...z); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
    }
    ctx.stroke();
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
      const ok = aColocar ? potColocar(aColocar, hover.x, hover.y) && parc.diners >= (movent ? movent.cost : OBJECTES[aColocar].preu) : eina === 'cami' ? dins(hover.x, hover.y) && ocup[idx(hover.x, hover.y)] === 0 : dins(hover.x, hover.y);
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
    if (parc.muralla) {
      const { trams, torres } = muralla();
      const imT = img('img/parc/muralla-tram.webp'), imR = img('img/parc/muralla-torre.webp');
      if (imT) for (const [dir, x, y] of trams) afegeix(x + y - 0.5, () => dibuixaTram(imT, dir, x, y));
      if (imR) for (const [x, y] of torres) afegeix(x + y - 0.4, () => {
        const p = iso(x, y), w = WP * 0.56, hh = w * imR.naturalHeight / imR.naturalWidth;
        ctx.drawImage(imR, p.x - w / 2, p.y + 10 - hh, w, hh);
      });
    }
    for (const v of visitants) if (!v.amagat) afegeix(Math.floor(v.fx) + Math.floor(v.fy) + 0.5, () => dibuixaPersona(v));
    for (const p of personal) afegeix(Math.floor(p.fx) + Math.floor(p.fy) + 0.5, () => dibuixaPersona(p));
    if (hover && aColocar) afegeix(hover.x + hover.y + 2 * (OBJECTES[aColocar].mida - 1) + 0.9, () => {
      const im = img(srcObjecte(aColocar)); if (!im) return;
      const m = OBJECTES[aColocar].mida, c = iso(hover.x + m / 2, hover.y + m / 2);
      const ok = potColocar(aColocar, hover.x, hover.y) && parc.diners >= (movent ? movent.cost : OBJECTES[aColocar].preu);
      ctx.globalAlpha = ok ? 0.75 : 0.35; dibuixaObjecte(ctx, im, aColocar, c.x, c.y, WP * m, movent ? movent.o.gir : girNou); ctx.globalAlpha = 1;
      // contorn de la base per sobre de la imatge: verd si hi cap, vermell si no
      rombe(hover.x, hover.y, m, m); ctx.lineWidth = 5; ctx.strokeStyle = ok ? '#3c9d32' : '#d6402f'; ctx.stroke();
      if (!ok) { ctx.font = '800 22px "Baloo 2", system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#d6402f'; ctx.fillText(parc.diners < (movent ? movent.cost : OBJECTES[aColocar].preu) ? 'No tens prou diners' : 'Aquí no hi cap', c.x, c.y + 8); }
    });
    for (const d of [...capes.keys()].sort((a, b) => a - b)) for (const f of capes.get(d)) f();
    dibuixaCrits();
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
  // Un tram de muralla sobre el costat d'una casella: 'x' va cap avall a la dreta, 'y' (girat) cap avall a l'esquerra
  function dibuixaTram(im, dir, x, y) {
    const w = WP * 0.6, hh = w * im.naturalHeight / im.naturalWidth;
    if (dir === 'x') { const q = iso(x + 1, y); ctx.drawImage(im, q.x - w * 0.96, q.y + 4 - hh, w, hh); return; }
    const q = iso(x, y + 1);
    ctx.save(); ctx.translate(q.x, 0); ctx.scale(-1, 1); ctx.drawImage(im, -w * 0.96, q.y + 4 - hh, w, hh); ctx.restore();
  }
  // ---------- atraccions en marxa ----------
  // Gent que es veu damunt de l'atracció mentre funciona. Retorna [darrere, davant] per poder
  // dibuixar els de darrere abans de la imatge i els de davant després (sembla que hi són a dins).
  const t0 = performance.now();
  function passatgers(o, s) {
    const d = OBJECTES[o.t], m = d.mida, t = (performance.now() - t0) / 1000;
    const qui = s.muntats.slice(0, o.t === 'llits-elastics' ? 4 : 10);
    if (!qui.length) return [[], []];
    const cu = o.x + m / 2, cv = o.y + m / 2, r = [[], []];
    qui.forEach((v, i) => {
      let u = cu, w = cv, alt = 0;
      if (o.t === 'llits-elastics') {
        const [du, dw] = [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]][i];
        u += du; w += dw; alt = 6 + Math.abs(Math.sin(t * 5 + i * 1.7)) * 26;
      } else if (o.t === 'carrusel') {
        const a = t * 0.9 + (i / qui.length) * Math.PI * 2;
        u += Math.cos(a) * m * 0.3; w += Math.sin(a) * m * 0.3; alt = 14 + Math.sin(t * 3 + i) * 5;
      } else if (o.t === 'tasses') {
        const a = t * 0.7 + (Math.floor(i / 2) / Math.ceil(qui.length / 2)) * Math.PI * 2, b = t * 4 + i * Math.PI;
        u += Math.cos(a) * m * 0.24 + Math.cos(b) * 0.08; w += Math.sin(a) * m * 0.24 + Math.sin(b) * 0.08; alt = 10;
      } else return;
      const p = iso(u, w);
      r[p.y < iso(cu, cv).y ? 0 : 1].push({ v, x: p.x, y: p.y - alt });
    });
    return r;
  }
  function dibuixaPassatger({ v, x, y }) {
    const im = img(`img/animacions/${v.img}.webp`);
    if (!im) return;
    const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4;
    ctx.drawImage(im, 0, 0, fw, fh, x - 10, y - 28, 20, 30);
  }
  // crits i emocions que surten de les atraccions grans quan funcionen
  const crits = [];
  const CRITS = { fort: ['Aaaah!', '😱', '🤩', 'Iuuuhu!', 'Més ràpid!', '😵'], suau: ['😄', '🎵', '😊', 'Que bonic!', '👋'], aigua: ['💦', '💦', 'Xof!', '😆', '💧'] };
  function llançaCrits() {
    const ara = performance.now();
    for (const o of parc.objectes) {
      const d = OBJECTES[o.t], s = rt.get(o.id);
      if (d.cat !== 'atraccio' || !s?.muntats.length || o.x < 0 || ['llits-elastics', 'carrusel', 'tasses'].includes(o.t)) continue;
      if (Math.random() > 0.35) continue;
      const tipus = /troncs|rius/.test(o.t) ? 'aigua' : (d.intensitat ?? 3) >= 5 ? 'fort' : 'suau';
      const llista = CRITS[tipus];
      const im = img(srcObjecte(o.t)), m = d.mida;
      const alt = im ? WP * m * d.frac * (im.naturalHeight / im.naturalWidth) * 0.75 : WP * m * 0.5;
      crits.push({ x: o.x + m / 2 + (Math.random() - 0.5) * m * 0.6, y: o.y + m / 2 + (Math.random() - 0.5) * m * 0.6, alt, text: llista[Math.floor(Math.random() * llista.length)], ini: ara });
    }
    while (crits.length > 60) crits.shift();
  }
  function dibuixaCrits() {
    const ara = performance.now();
    ctx.textAlign = 'center';
    for (let i = crits.length - 1; i >= 0; i--) {
      const c = crits[i], vida = (ara - c.ini) / 1800;
      if (vida >= 1) { crits.splice(i, 1); continue; }
      const p = iso(c.x, c.y);
      ctx.globalAlpha = Math.min(1, (1 - vida) * 1.6);
      ctx.font = c.text.length > 2 ? '800 20px "Baloo 2", system-ui' : '26px system-ui';
      const y = p.y - c.alt - vida * 60;
      if (c.text.length > 2) { ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.strokeText(c.text, p.x, y); ctx.fillStyle = '#0a3566'; }
      ctx.fillText(c.text, p.x, y);
    }
    ctx.globalAlpha = 1;
  }

  // Atraccions amb peces mòbils (de moment, el vaixell pirata): base + peça que es mou + capa de davant
  function dibuixaAnimat(o, d, c) {
    if (d.anim.tipus === 'roda') return dibuixaRoda(o, d, c);
    const a = d.anim, src = (n) => `img/parc/${n}.webp`;
    const base = img(src(a.base)), peca = img(src(a.peca)), dav = img(src(a.davant));
    if (!base || !peca || !dav) return false;
    const m = d.mida, w = WP * m * d.frac, k = w / base.naturalWidth, hb = base.naturalHeight * k;
    const baix = c.y + (WP * m / 4) * d.frac, esq = -w * (d.punta ?? 0.5), dalt = baix - hb;
    // angle: només mentre hi ha gent; arrenca suau i frena al final del viatge
    const s = rt.get(o.id);
    let angle = 0;
    if (s?.muntats.length && s.fi) {
      const f = clamp(1 - (s.fi - parc.minut) / d.durada, 0, 1);
      // cada atracció té el seu propi ritme (si no, totes es mourien exactament igual)
      angle = (a.angle * Math.PI / 180) * Math.sin(Math.PI * f) * Math.sin(2 * Math.PI * (tempsAnim + o.id * 0.37) / a.periode);
    }
    ctx.save(); ctx.translate(c.x, 0); if (o.gir) ctx.scale(-1, 1);
    ctx.drawImage(base, esq, dalt, w, hb);
    ctx.save();
    ctx.translate(esq + a.pivotBase[0] * k, dalt + a.pivotBase[1] * k); ctx.rotate(angle);
    ctx.drawImage(peca, -a.pivotPeca[0] * k, -a.pivotPeca[1] * k, peca.naturalWidth * k, peca.naturalHeight * k);
    // passatgers asseguts: se'n veu el cos de cintura amunt i es mouen amb la peça
    if (a.seients && s?.muntats.length) {
      s.muntats.slice(0, a.seients.length).forEach((v, i) => {
        const im = img(`img/animacions/${v.img}.webp`);
        if (!im) return;
        const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4, [sx, sy] = a.seients[i];
        const x = (sx - a.pivotPeca[0]) * k, y = (sy - a.pivotPeca[1]) * k;
        ctx.drawImage(im, 0, fh, fw, fh * 0.6, x - 9, y - 16, 18, 16.2);
      });
    }
    ctx.restore();
    ctx.drawImage(dav, esq, dalt, w, hb);
    ctx.restore();
    return true;
  }

  // Sínia: la roda gira dins el seu pla (lleugerament inclinat) i les cabines pengen sempre dretes
  function dibuixaRoda(o, d, c) {
    const a = d.anim, src = (n) => `img/parc/${n}.webp`;
    const base = img(src(a.base)), roda = img(src(a.roda)), cab = img(src(a.cabina)), dav = img(src(a.davant));
    if (!base || !roda || !cab || !dav) return false;
    const m = d.mida, w = WP * m * d.frac, k = w / base.naturalWidth, hb = base.naturalHeight * k;
    const baix = c.y + (WP * m / 4) * d.frac, esq = -w * (d.punta ?? 0.5), dalt = baix - hb;
    // gir: només mentre hi ha gent; arrenca i frena suau
    const s = rt.get(o.id);
    const dtA = tempsAnim - (s?.tA ?? tempsAnim);
    if (s) {
      s.tA = tempsAnim;
      if (s.muntats.length && s.fi) {
        const f = clamp(1 - (s.fi - parc.minut) / d.durada, 0, 1);
        s.angle = (s.angle || 0) + dtA * a.velocitat * Math.min(1, Math.sin(Math.PI * f) * 1.6);
      }
    }
    const fi = (s?.angle || 0) + o.id * 0.4, hx = esq + a.hub[0] * k, hy = dalt + a.hub[1] * k, R = a.radi * k, sh = a.inclinacio;
    ctx.save(); ctx.translate(c.x, 0); if (o.gir) ctx.scale(-1, 1);
    ctx.drawImage(base, esq, dalt, w, hb);
    // roda
    const rr = R / a.radiRoda, rw = roda.naturalWidth * rr, rh = roda.naturalHeight * rr;
    ctx.save(); ctx.translate(hx, hy); ctx.transform(1, sh, 0, 1, 0, 0); ctx.rotate(fi);
    ctx.drawImage(roda, -rw / 2, -rh / 2, rw, rh);
    ctx.restore();
    // cabines (i la gent que hi va a dins)
    const cw = a.ampladaCabina * k, chh = cw * cab.naturalHeight / cab.naturalWidth;
    const passatgers = s?.muntats || [];
    for (let i = 0; i < a.cabines; i++) {
      const ang = fi + (i * 2 * Math.PI) / a.cabines;
      const x = R * Math.cos(ang), y = R * Math.sin(ang);
      const px = hx + x, py = hy + y + sh * x - chh * 0.03;
      const v = passatgers[i];
      if (v) {
        const im = img(`img/animacions/${v.img}.webp`);
        if (im) { const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4; ctx.drawImage(im, 0, 0, fw, fh * 0.6, px - cw * 0.28, py + chh * 0.33, cw * 0.56, cw * 0.5); }
      }
      ctx.drawImage(cab, px - cw / 2, py, cw, chh);
    }
    ctx.drawImage(dav, esq, dalt, w, hb);
    ctx.restore();
    return true;
  }

  function dibuixaObj(o) {
    if (o.x < 0) return;
    const d = OBJECTES[o.t], m = d.mida, im = img(srcObjecte(o.t));
    const c = iso(o.x + m / 2, o.y + m / 2);
    const [darrere, davant] = d.cat === 'atraccio' && rt.get(o.id) ? passatgers(o, rt.get(o.id)) : [[], []];
    darrere.forEach(dibuixaPassatger);
    if (!(d.anim && dibuixaAnimat(o, d, c)) && im) dibuixaObjecte(ctx, im, o.t, c.x, c.y, WP * m, o.gir);
    davant.forEach(dibuixaPassatger);
    if (o.t === 'parquing') dibuixaCotxes(o);
    const s = rt.get(o.id);
    ctx.textAlign = 'center';
    if (o.avariat) { ctx.font = '40px system-ui'; ctx.fillText('🔧', c.x, c.y - WP * m * 0.55); }
    else if (d.cat !== 'decoracio' && !esEntrada(o) && !d.sensecami && !accessible(o)) { ctx.font = '36px system-ui'; ctx.fillText('⚠️', c.x, c.y - WP * m * 0.5); }
    if (s && s.cua.length > 0 && escala > 0.3) {
      ctx.font = '800 18px "Baloo 2", system-ui'; const t = `👥 ${s.cua.length}`;
      ctx.fillStyle = 'rgba(10,53,102,.85)'; const tw = ctx.measureText(t).width + 14;
      ctx.beginPath(); ctx.roundRect(c.x - tw / 2, c.y + 4, tw, 24, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(t, c.x, c.y + 22);
    }
  }
  // Cotxes aparcats: s'omplen els pàrquings per ordre, segons quanta gent hi ha al parc
  const COTXES = ['cotxe-blau', 'cotxe-vermell', 'cotxe-groc', 'cotxe-blanc', 'cotxe-verd', 'familiar-beix', 'cotxe-gris', 'cotxe-taronja'];
  function dibuixaCotxes(o) {
    const lots = parc.objectes.filter((p) => p.t === 'parquing' && p.x >= 0);
    let resta = Math.min(cotxes, placesPropies()) - lots.indexOf(o) * OBJECTES.parquing.places;
    const n = Math.round(clamp(resta, 0, OBJECTES.parquing.places) / OBJECTES.parquing.places * 8);
    for (let i = 0; i < n; i++) {
      const fila = i < 4 ? 0 : 1, col = i % 4;
      const u = o.x + 0.27 + col * 0.49, v = o.y + (fila ? 1.62 : 0.38);
      const im = img(`img/animacions/${COTXES[(o.id * 3 + i) % COTXES.length]}.webp`);
      if (!im) continue;
      const p = iso(u, v), fw = im.naturalWidth / 4, fh = im.naturalHeight, w = 58, hh = fh * (w / fw);
      ctx.drawImage(im, (fila ? 0 : 2) * fw, 0, fw, fh, p.x - w / 2, p.y - hh * 0.72, w, hh);
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
    vValoracio.textContent = String(valoracio());
    botoVel.forEach((b, i) => b.classList.toggle('actiu', [0, 1, 2, 4][i] === velocitat));
    const esd = esdeveniment();
    vEsdev.hidden = !esd; if (esd) { vEsdev.textContent = `${esd.ic} ${esd.nom}`; vEsdev.title = esd.text; }
    botoObrir.hidden = parc.obert || nomesLectura;
  }
  function posaVelocitat(v) { velocitat = v; refrescaBarra(); }

  // ---------- bucle ----------
  let comptadorBarra = 0, tempsAnim = 0;   // tempsAnim: segons d'animació (s'atura amb la pausa)
  function bucle(ara) {
    if (!viu) return;
    const dt = Math.min(0.25, (ara - darrerFrame) / 1000); darrerFrame = ara;
    if (velocitat && !informeObert) tempsAnim += dt * Math.min(2, velocitat);
    if (velocitat && !informeObert && !movent) {   // mentre mous una cosa, el temps s'atura
      let dm = (dt / SEGONS_PER_MINUT) * velocitat;
      while (dm > 0) { const pas = Math.min(0.5, dm); simula(pas); dm -= pas; if (informeObert) break; }
    }
    dibuixa();
    if ((comptadorBarra += dt) > 0.25) {
      comptadorBarra = 0; refrescaBarra();
      if (velocitat && !informeObert) llançaCrits();
      if (infoVisitant && !info.hidden) { const v = infoVisitant; if (visitants.includes(v)) { const sc = info.querySelector('.parc-info-cos')?.scrollTop; obreVisitant(v); const c = info.querySelector('.parc-info-cos'); if (c && sc) c.scrollTop = sc; } else tancaInfo(); } if (!cataleg.hidden) for (const b of cataleg.children) b.disabled = parc.diners < Number(b.dataset.preu || 0); }
    if (Date.now() - darrerDesat > 30000 && !movent) guarda(false);
    requestAnimationFrame(bucle);
  }

  function tancar() {
    cancelaMoure();
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
  if (!nomesLectura) comprovaFites();
  triaEina('mou');
  refrescaBarra();
  requestAnimationFrame((t) => { darrerFrame = t; bucle(t); });
  if (nomesLectura) {
    ajuda.textContent = '👩‍🏫 Mode professorat: veus el parc tal com el té l\'alumne. Els canvis que facis aquí no es desen.';
    const r = parc.historial[parc.historial.length - 1];
    if (r) mostraInforme(r); else panell(parc.nom, h('p', { class: 'nota' }, 'Aquest parc encara no ha tancat cap dia.'));
    informeObert = false;
  } else if (!parc.benvinguda) {
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
