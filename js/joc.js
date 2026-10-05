// Lògica del joc. Totes les funcions reben l'estat de l'empresa i el modifiquen.
// Si una acció no es pot fer, llancen un Error amb el missatge per a l'alumne.
import {
  EDIFICIS, RECURSOS, VELOCITAT, DINERS_INICIALS, MIDA_MAPA, PARCELES_OBERTES,
  PARCELA_SEU, COST_PARCELA_BASE, MAX_PER_ORDRE, NIVELL_MAX, SALARI_PER_SEGON,
  COST_CARRETERA, FASES, FASE_MINUTS, NIVELLS_EMPRESA, BANC, HISTORIAL_MINUTS, MISSIONS,
  tempsConstruccio, preuReferencia,
} from './dades.js';

export function estatInicial(nom, logo) {
  const parceles = [];
  for (let i = 0; i < MIDA_MAPA * MIDA_MAPA; i++) {
    parceles.push({ estat: PARCELES_OBERTES.includes(i) ? 'buida' : 'bloquejada' });
  }
  parceles[PARCELA_SEU] = { estat: 'edifici', tipus: 'seu-central', nivell: 1 };
  return {
    nom, logo,
    diners: DINERS_INICIALS,
    parceles,
    inventari: {},
    parcelesComprades: 0,
    tutorialVist: false,
    creada: Date.now(),
    versio: 2,
    stats: {},
    costos: {},
    deute: 0,
    historial: [],
    missio: 0,
    nivellMax: 1,
  };
}

// Adapta empreses desades amb versions anteriors del joc
// (també si el professorat canvia MIDA_MAPA a dades.js)
export function migrar(e) {
  const vellaMida = Math.round(Math.sqrt(e.parceles.length));
  if (vellaMida !== MIDA_MAPA) {
    const noves = Array.from({ length: MIDA_MAPA * MIDA_MAPA }, () => ({ estat: 'bloquejada' }));
    e.parceles.forEach((p, i) => {
      const r = Math.floor(i / vellaMida), c = i % vellaMida;
      if (r < MIDA_MAPA && c < MIDA_MAPA) noves[r * MIDA_MAPA + c] = p;
    });
    e.parceles = noves;
  }
  e.versio = 2;
  e.stats ??= {};
  e.costos ??= {};
  e.deute ??= 0;
  e.historial ??= [];
  e.missio ??= 0;
  e.nivellMax ??= 1;
  for (const p of e.parceles) if (p.estat === 'edifici' && !p.nivell) p.nivell = 1;
  return e;
}

// Acaba obres i millores. Retorna un text si ha canviat res.
export function actualitzar(e, ara = Date.now()) {
  let missatge = null;
  for (const p of e.parceles) {
    if (p.estat === 'obres' && p.fiObres <= ara) {
      p.estat = 'edifici';
      p.nivell = 1;
      delete p.fiObres;
      missatge = `Obres acabades: ${EDIFICIS[p.tipus].nom}`;
    }
    if (p.millora && p.millora.fi <= ara) {
      p.nivell = (p.nivell || 1) + 1;
      delete p.millora;
      missatge = `${EDIFICIS[p.tipus].nom} ara és de nivell ${p.nivell}`;
    }
  }
  return missatge;
}

export const costParcela = (e) => COST_PARCELA_BASE * (e.parcelesComprades + 1);

export function desbloquejar(e, i) {
  const p = e.parceles[i];
  if (p.estat !== 'bloquejada') throw new Error('Aquesta parcel·la ja és teva.');
  const cost = costParcela(e);
  if (e.diners < cost) throw new Error(`Necessites ${diners(cost)} per comprar-la.`);
  e.diners -= cost;
  e.parcelesComprades += 1;
  e.parceles[i] = { estat: 'buida' };
}

export function construir(e, i, tipus, ara = Date.now()) {
  const def = EDIFICIS[tipus];
  if (!def || def.aviat || def.inicial) throw new Error('Aquest edifici encara no es pot construir.');
  if (e.parceles[i].estat !== 'buida') throw new Error('La parcel·la no està lliure.');
  if (e.diners < def.cost) throw new Error(`Et falten ${diners(def.cost - e.diners)} per construir-lo.`);
  e.diners -= def.cost;
  e.parceles[i] = { estat: 'obres', tipus, fiObres: ara + tempsConstruccio(tipus) * 1000 };
}

// ---------- carreteres ----------
export function construirCarretera(e, i) {
  if (e.parceles[i].estat !== 'buida') throw new Error('Només pots fer carreteres en parcel·les teves i lliures.');
  if (e.diners < COST_CARRETERA) throw new Error(`Necessites ${diners(COST_CARRETERA)}.`);
  e.diners -= COST_CARRETERA;
  e.parceles[i] = { estat: 'carretera' };
}

export function treureCarretera(e, i) {
  if (e.parceles[i].estat !== 'carretera') throw new Error('Aquí no hi ha cap carretera teva.');
  e.parceles[i] = { estat: 'buida' };
}

// ---------- millores de nivell ----------
export const costMillora = (p) => EDIFICIS[p.tipus].cost * (p.nivell || 1);
export const tempsMillora = (p) => tempsConstruccio(p.tipus) * (p.nivell || 1);
export const ocupat = (p) => !!(p.produccio || p.venda || p.millora);

export function millorar(e, i, ara = Date.now()) {
  const p = e.parceles[i];
  if (p.estat !== 'edifici' || EDIFICIS[p.tipus].inicial) throw new Error('Aquest edifici no es pot millorar.');
  if (ocupat(p)) throw new Error('Espera que l\'edifici acabi la feina per millorar-lo.');
  if ((p.nivell || 1) >= NIVELL_MAX) throw new Error('Ja és al nivell màxim.');
  const cost = costMillora(p);
  if (e.diners < cost) throw new Error(`Et falten ${diners(cost - e.diners)} per millorar-lo.`);
  e.diners -= cost;
  p.millora = { inici: ara, fi: ara + tempsMillora(p) * 1000 };
}

// ---------- producció ----------
export const quantitatA = (e, recurs) => e.inventari[recurs] || 0;

// Quantes unitats es poden produir amb el material i els diners que hi ha
export function maxProduible(e, opcio) {
  let max = MAX_PER_ORDRE;
  for (const [r, q] of Object.entries(opcio.entrades)) {
    max = Math.min(max, Math.floor(quantitatA(e, r) / q));
  }
  const sou = opcio.temps * SALARI_PER_SEGON;
  if (sou > 0) max = Math.min(max, Math.floor(e.diners / sou));
  return Math.max(0, max);
}

export const souProduccio = (opcio, quantitat) => Math.ceil(opcio.temps * quantitat * SALARI_PER_SEGON);
export const segonsProduccio = (opcio, quantitat, nivell = 1, fase = faseEconomica()) =>
  (opcio.temps * quantitat) / VELOCITAT / nivell / fase.produccio;

// Cost per unitat: materials (al seu cost mitjà) + sous
export function costUnitariProduccio(e, opcio) {
  let c = opcio.temps * SALARI_PER_SEGON;
  for (const [r, q] of Object.entries(opcio.entrades)) c += q * costMitja(e, r);
  return c;
}

export function iniciarProduccio(e, i, recurs, quantitat, ara = Date.now()) {
  const p = e.parceles[i];
  if (p.estat !== 'edifici') throw new Error('Aquest edifici no està a punt.');
  if (ocupat(p)) throw new Error('Aquest edifici ja està treballant.');
  const opcio = EDIFICIS[p.tipus].produeix.find((o) => o.recurs === recurs);
  if (!opcio) throw new Error('Aquest edifici no fa aquest producte.');
  quantitat = Math.floor(quantitat);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  if (quantitat > maxProduible(e, opcio)) throw new Error('No tens prou material o diners per als sous.');
  const cost = costUnitariProduccio(e, opcio);
  for (const [r, q] of Object.entries(opcio.entrades)) {
    e.inventari[r] = quantitatA(e, r) - q * quantitat;
    if (e.inventari[r] === 0) delete e.inventari[r];
  }
  e.diners -= souProduccio(opcio, quantitat);
  p.produccio = { recurs, quantitat, cost, inici: ara, fi: ara + segonsProduccio(opcio, quantitat, p.nivell) * 1000 };
}

export function recollir(e, i, ara = Date.now()) {
  const p = e.parceles[i];
  if (p.produccio) {
    if (p.produccio.fi > ara) throw new Error('La producció encara no ha acabat.');
    const { recurs, quantitat, cost } = p.produccio;
    afegirAmbCost(e, recurs, quantitat, cost ?? RECURSOS[recurs].preu * 0.5);
    sumaStat(e, `produit_${recurs}`, quantitat);
    delete p.produccio;
    return { tipus: 'produccio', recurs, quantitat };
  }
  if (p.venda) {
    if (p.venda.fi > ara) throw new Error('La venda encara no ha acabat.');
    const ingres = p.venda.quantitat * p.venda.preu;
    e.diners += ingres;
    sumaStat(e, 'vendesBotiga', 1);
    sumaStat(e, 'ingressosBotiga', ingres);
    const r = { tipus: 'venda', recurs: p.venda.recurs, quantitat: p.venda.quantitat, ingres };
    delete p.venda;
    return r;
  }
  throw new Error('No hi ha res per recollir.');
}

// ---------- botiga (venda al públic) ----------
export function segonsVenda(opcio, quantitat, preu, nivell = 1, fase = faseEconomica()) {
  const ref = preuReferencia(opcio.recurs);
  return (opcio.tempsVenda * quantitat * (preu / ref) ** 2) / VELOCITAT / nivell / fase.vendes;
}
// Sous de la botiga: proporcionals al temps de venda (si poses un preu alt, pagues més hores)
export const souVenda = (opcio, quantitat, preu) =>
  Math.ceil(segonsVenda(opcio, quantitat, preu, 1, FASES.normal) * VELOCITAT * SALARI_PER_SEGON * 0.5);

export function iniciarVenda(e, i, recurs, quantitat, preu, ara = Date.now()) {
  const p = e.parceles[i];
  if (p.estat !== 'edifici' || !EDIFICIS[p.tipus].ven) throw new Error('Aquest edifici no és una botiga.');
  if (ocupat(p)) throw new Error('La botiga ja està venent.');
  const opcio = EDIFICIS[p.tipus].ven.find((o) => o.recurs === recurs);
  if (!opcio) throw new Error('Aquesta botiga no ven aquest producte.');
  quantitat = Math.floor(quantitat);
  preu = Math.round(preu);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  if (!(preu >= 1)) throw new Error('El preu ha de ser d\'1 € o més.');
  if (quantitat > quantitatA(e, recurs)) throw new Error('No en tens tantes unitats al magatzem.');
  const sou = souVenda(opcio, quantitat, preu);
  if (e.diners < sou) throw new Error(`Necessites ${diners(sou)} per pagar els sous de la botiga.`);
  e.inventari[recurs] -= quantitat;
  if (e.inventari[recurs] === 0) delete e.inventari[recurs];
  e.diners -= sou;
  p.venda = { recurs, quantitat, preu, inici: ara, fi: ara + segonsVenda(opcio, quantitat, preu, p.nivell) * 1000 };
}

// ---------- mercat de l'escola (preu fix) ----------
export function vendre(e, recurs, quantitat) {
  quantitat = Math.floor(quantitat);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  if (quantitat > quantitatA(e, recurs)) throw new Error('No en tens tantes unitats.');
  const ingres = quantitat * RECURSOS[recurs].preu;
  e.inventari[recurs] -= quantitat;
  if (e.inventari[recurs] === 0) delete e.inventari[recurs];
  e.diners += ingres;
  sumaStat(e, 'vendesEscola', 1);
  return ingres;
}

// Valor total de l'empresa: diners + estoc + edificis (per a la classificació)
export function valorEmpresa(e) {
  let v = e.diners - (e.deute || 0);
  for (const [r, q] of Object.entries(e.inventari)) v += q * (RECURSOS[r]?.preu || 0);
  for (const p of e.parceles) {
    if (!p.tipus) continue;
    const cost = EDIFICIS[p.tipus]?.cost || 0;
    const n = p.nivell || 1;
    v += cost * (n * (n + 1)) / 2; // construcció + millores pagades
  }
  return Math.round(v);
}

// ---------- estadístiques i cost mitjà de l'estoc ----------
export function sumaStat(e, clau, n) {
  e.stats ??= {};
  e.stats[clau] = (e.stats[clau] || 0) + n;
}
export const costMitja = (e, recurs) => e.costos?.[recurs] ?? RECURSOS[recurs].preu * 0.5;
export function afegirAmbCost(e, recurs, q, costUnitari) {
  e.costos ??= {};
  const abans = quantitatA(e, recurs);
  const mitja = abans > 0 ? (abans * costMitja(e, recurs) + q * costUnitari) / (abans + q) : costUnitari;
  e.costos[recurs] = Math.round(mitja * 100) / 100;
  e.inventari[recurs] = abans + q;
}

// ---------- fase econòmica (igual per a tothom, depèn de l'hora) ----------
export function faseEconomica(ara = Date.now()) {
  const periode = FASE_MINUTS * 60000;
  const n = Math.floor(ara / periode);
  const h = ((n * 2654435761) >>> 0) % 10;
  const clau = h < 5 ? 'normal' : h < 8 ? 'expansio' : 'recessio';
  return { clau, ...FASES[clau], fi: (n + 1) * periode };
}

// ---------- nivell d'empresa ----------
export function nivellEmpresa(e) {
  const v = valorEmpresa(e);
  let n = 1;
  NIVELLS_EMPRESA.forEach((llindar, k) => { if (v >= llindar) n = k + 1; });
  return n;
}
export function progresNivell(e) {
  const n = nivellEmpresa(e);
  const ara = NIVELLS_EMPRESA[n - 1], seguent = NIVELLS_EMPRESA[n];
  if (seguent == null) return { nivell: n, fraccio: 1, falta: 0 };
  const v = valorEmpresa(e);
  return { nivell: n, fraccio: (v - ara) / (seguent - ara), falta: seguent - v };
}

// ---------- banc ----------
export function aplicarInteressos(e, ara = Date.now()) {
  if (!e.deute) { e.deuteT = ara; return; }
  const hores = (ara - (e.deuteT || ara)) / 3600000;
  e.deute = e.deute * (1 + BANC.interesHora) ** hores;
  e.deuteT = ara;
}
export const maxPrestec = (e) => Math.max(0, Math.floor((valorEmpresa(e) + (e.deute || 0)) * BANC.maxPercentValor - (e.deute || 0)));
export function demanarPrestec(e, q, ara = Date.now()) {
  q = Math.floor(q);
  if (!(q >= 1)) throw new Error('Tria una quantitat.');
  aplicarInteressos(e, ara);
  if (q > maxPrestec(e)) throw new Error(`El banc només et deixa ${diners(maxPrestec(e))} més.`);
  e.deute += q;
  e.diners += q;
}
export function retornarPrestec(e, q, ara = Date.now()) {
  aplicarInteressos(e, ara);
  q = Math.min(Math.floor(q), Math.ceil(e.deute));
  if (!(q >= 1)) throw new Error('No tens cap préstec per tornar.');
  if (q > e.diners) throw new Error('No tens prou diners.');
  e.diners -= q;
  e.deute = Math.max(0, e.deute - q);
  if (e.deute < 0.5) e.deute = 0;
}

// ---------- balanç i historial ----------
export function balanc(e) {
  let estoc = 0;
  for (const [r, q] of Object.entries(e.inventari)) estoc += q * (RECURSOS[r]?.preu || 0);
  let edificis = 0;
  for (const p of e.parceles) {
    if (!p.tipus) continue;
    const n = p.nivell || 1;
    edificis += (EDIFICIS[p.tipus]?.cost || 0) * (n * (n + 1)) / 2;
  }
  const passius = Math.round(e.deute || 0);
  return { diners: Math.round(e.diners), estoc: Math.round(estoc), corrents: Math.round(e.diners + estoc), noCorrents: Math.round(edificis), passius, net: Math.round(e.diners + estoc + edificis - passius) };
}
export function registrarHistorial(e, ara = Date.now()) {
  e.historial ??= [];
  const ultim = e.historial[e.historial.length - 1];
  if (ultim && ara - ultim.t < HISTORIAL_MINUTS * 60000) return false;
  e.historial.push({ t: ara, v: valorEmpresa(e) });
  if (e.historial.length > 60) e.historial.shift();
  return true;
}

// ---------- missions ----------
export const missioActual = (e) => MISSIONS[e.missio || 0] || null;
export function cobrarMissio(e) {
  const m = missioActual(e);
  if (!m || !m.fet(e)) throw new Error('Encara no has completat aquesta missió.');
  e.diners += m.premi;
  e.missio = (e.missio || 0) + 1;
  return m;
}

const fmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });
export const diners = (n) => `${fmt.format(n)} €`;
export const nombre = (n) => fmt.format(n);
const fmtDec = new Intl.NumberFormat('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const dinersDec = (n) => `${fmtDec.format(n)} €`;

export function temps(segons) {
  segons = Math.max(0, Math.ceil(segons));
  const h = Math.floor(segons / 3600), m = Math.floor((segons % 3600) / 60), s = segons % 60;
  if (h) return `${h} h ${m} min`;
  if (m) return s ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}
