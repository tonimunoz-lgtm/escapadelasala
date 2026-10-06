// =============================================================
//  LÒGICA DEL JOC (versió 2: negocis a Matadepera)
//  1 hora real = 1 setmana de l'empresa.
// =============================================================
import {
  VELOCITAT, SECTORS_NEGOCI, ZONES, FIANCA_MESOS, OBRES_ADEQUACIO, CONSTRUCCIO, FASES_NEGOCI, PUBLICITAT,
  ASSEGURANCA_MENSUAL, FASES, FASE_MINUTS, NIVELLS_EMPRESA, BANC, HISTORIAL_MINUTS, MISSIONS, TIPUS_REPTE, DIRECTORS,
} from './dades.js';
import {
  FORMES, PERSONAL, SS_EMPRESA, GESTORIA, RISC_SANCIO, SETMANES_PER_MES, ESTALVIS_INICIALS,
  OPCIONS_ESTATUTS, costTramit, passosConstitucio,
} from './legal.js';

const HORA = 3600000;

// ---------- format ----------
const fmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });
const fmtDec = new Intl.NumberFormat('ca-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const diners = (n) => `${fmt.format(n)} €`;
export const dinersDec = (n) => `${fmtDec.format(n)} €`;
export const nombre = (n) => fmt.format(n);
export function temps(segons) {
  segons = Math.max(0, Math.ceil(segons));
  const h = Math.floor(segons / 3600), m = Math.floor((segons % 3600) / 60), s = segons % 60;
  if (h) return `${h} h ${m} min`;
  if (m) return s ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}

// ---------- estat inicial ----------
export function estatInicial() {
  return {
    versio: 3,
    nom: '', nomBase: '', logo: 1, sector: null, forma: null,
    estalvis: ESTALVIS_INICIALS, diners: 0,
    constitucio: { constituida: false, pas: 0, fets: [], docs: [] },
    local: null,
    negoci: { materia: 0, producte: 0, preu: null, publicitat: 0 },
    plantilla: { treballadors: 0, rrhh: 0 }, gestoria: false, altaOcupador: false,
    stats: {}, setmanes: {}, actius: 0,
    deute: 0, historial: [], missio: 0, nivellMax: 1, directors: {},
    reptesCobrats: [], reptesVistos: [], tutorialVist: false, creada: Date.now(),
  };
}
// Empreses de la versió anterior (amb parcel·les): no són compatibles, comencen de nou
export const esVersioAntiga = (e) => !e || (e.versio || 0) < 3;

export function migrar(e) {
  e.stats ??= {}; e.setmanes ??= {}; e.directors ??= {}; e.historial ??= [];
  e.negoci ??= { materia: 0, producte: 0, preu: null, publicitat: 0 };
  e.plantilla ??= { treballadors: 0, rrhh: 0 };
  e.reptesCobrats ??= []; e.reptesVistos ??= [];
  return e;
}

// ---------- constitució ----------
export const passos = (e) => passosConstitucio(e.forma);
export const pasActual = (e) => passos(e)[e.constitucio.pas] || null;
export function dinersCost(id, e) {
  if (id === 'estatuts') return OPCIONS_ESTATUTS[e.estatuts || 'tipus'].cost;
  if (id === 'llicencia' || id === 'bancAutonom') return id === 'llicencia' ? 250 : 0;
  return costTramit(id, e.forma, e.capital || 0, (e.estatuts || 'tipus') === 'tipus');
}
export function avancarPas(e) { e.constitucio.pas += 1; }

// ---------- fase econòmica ----------
let faseForcada = null;
export function setFaseForcada(clau) { faseForcada = FASES[clau] ? clau : null; }
export function faseEconomica(ara = Date.now()) {
  if (faseForcada) return { clau: faseForcada, ...FASES[faseForcada], fi: null, forcada: true };
  const periode = FASE_MINUTS * 60000;
  const n = Math.floor(ara / periode);
  const h = ((n * 2654435761) >>> 0) % 10;
  const clau = h < 5 ? 'normal' : h < 8 ? 'expansio' : 'recessio';
  return { clau, ...FASES[clau], fi: (n + 1) * periode };
}

// ---------- directors ----------
export function bonus(e, clau) {
  let b = 1;
  for (const id of Object.keys(e.directors || {})) if (DIRECTORS[id]?.[clau] != null) b *= DIRECTORS[id][clau];
  return b;
}
export const souDirectorsHora = (e) => Object.keys(e.directors || {}).reduce((s, id) => s + (DIRECTORS[id]?.souHora || 0), 0);
export function contractarDirector(e, id) {
  const d = DIRECTORS[id];
  if (!d || e.directors[id]) throw new Error('No es pot contractar.');
  if (e.diners < d.fitxatge) throw new Error(`Necessites ${diners(d.fitxatge)}.`);
  e.diners -= d.fitxatge; e.directors[id] = { des: Date.now() };
}
export function acomiadarDirector(e, id) { delete e.directors[id]; }

// ---------- negoci ----------
export const sector = (e) => SECTORS_NEGOCI[e.sector];
export const faseNegoci = (e) => FASES_NEGOCI[e.local?.fase || 1];
export const obert = (e) => e.local?.estat === 'obert';

let competencia = 1; // negocis del mateix sector a la mateixa zona (ho calcula l'app amb tots els locals)
export function setCompetencia(n) { competencia = Math.max(1, n); }

export function capacitatHora(e) {
  const s = sector(e);
  if (!s) return 0;
  const persones = (e.plantilla?.treballadors || 0) + 1; // tu també hi treballes
  return s.capacitat * persones * faseNegoci(e).capacitat * bonus(e, 'produccio') * VELOCITAT;
}
export function demandaHora(e, preu = e.negoci?.preu) {
  const s = sector(e);
  if (!s || !e.local) return 0;
  const zona = ZONES[e.local.zona] || ZONES.barri;
  const p = preu || s.producte.preuRef;
  const preuFactor = Math.min(3, (s.producte.preuRef / p) ** 2);
  const reforma = OBRES_ADEQUACIO[e.local.reforma]?.atractiu || 1;
  const publi = PUBLICITAT[e.negoci?.publicitat || 0]?.efecte || 1;
  const comp = 1 / (1 + 0.3 * (competencia - 1));
  return s.demanda * zona.gent * faseNegoci(e).demanda * reforma * faseEconomica().vendes * preuFactor * publi * comp * bonus(e, 'vendes') * VELOCITAT;
}

function setmanaIdx(ara) { return Math.floor(ara / HORA); }
function llibre(e, ara) {
  const k = setmanaIdx(ara);
  e.setmanes ??= {};
  if (!e.setmanes[k]) {
    // tanca la setmana anterior
    const claus = Object.keys(e.setmanes).map(Number).sort((a, b) => a - b);
    const ant = claus[claus.length - 1];
    if (ant != null && e.setmanes[ant] && !e.setmanes[ant].tancada) {
      const s = e.setmanes[ant];
      s.tancada = true;
      if (s.ing - s.mat - s.fix > 0) e.stats.setmanesAmbBenefici = (e.stats.setmanesAmbBenefici || 0) + 1;
    }
    e.setmanes[k] = { ing: 0, mat: 0, fix: 0, unitats: 0 };
    for (const c of claus.slice(0, -10)) delete e.setmanes[c];
  }
  return e.setmanes[k];
}
export function setmanaActual(e) { return e.setmanes?.[setmanaIdx(Date.now())] || { ing: 0, mat: 0, fix: 0, unitats: 0 }; }
export function setmanaAnterior(e) {
  const claus = Object.keys(e.setmanes || {}).map(Number).sort((a, b) => a - b);
  const k = claus.filter((c) => c < setmanaIdx(Date.now())).pop();
  return k != null ? e.setmanes[k] : null;
}

// Simula producció i vendes des de l'última vegada
export function simular(e, ara = Date.now()) {
  const abans = e.simT ?? ara;
  e.simT = ara;
  if (!obert(e)) return;
  const dtH = Math.min((ara - abans) / HORA, 24 * 7);
  if (dtH <= 0) return;
  const s = sector(e);
  const n = e.negoci;
  n.preu ??= s.producte.preuRef;
  // producció: l'equip transforma matèria primera en producte (amb un estoc màxim)
  const maxEstoc = capacitatHora(e) * 0.6;
  const fer = Math.max(0, Math.min(capacitatHora(e) * dtH, n.materia, maxEstoc - n.producte));
  n.materia -= fer; n.producte += fer;
  const ll = llibre(e, ara);
  ll.mat += fer * s.materia.cost;
  // vendes als clients
  const venda = Math.min(n.producte, demandaHora(e) * dtH);
  n.producte -= venda;
  const ingres = venda * n.preu;
  e.diners += ingres;
  ll.ing += ingres; ll.unitats += venda;
  e.stats.unitatsVenudes = (e.stats.unitatsVenudes || 0) + venda;
  e.stats.ingressos = (e.stats.ingressos || 0) + ingres;
}

export function comprarMateria(e, q) {
  q = Math.floor(q);
  if (!(q >= 1)) throw new Error('Tria una quantitat.');
  const cost = q * sector(e).materia.cost;
  if (e.diners < cost) throw new Error(`No tens prou diners: costa ${diners(cost)}.`);
  e.diners -= cost; e.negoci.materia += q;
  e.stats.comprat = (e.stats.comprat || 0) + 1;
  return cost;
}
export function fixarPreu(e, preu) {
  preu = Math.round(Number(preu) * 100) / 100;
  if (!(preu > 0)) throw new Error('El preu ha de ser més gran que 0.');
  e.negoci.preu = preu;
}
export function fixarPublicitat(e, nivell) { e.negoci.publicitat = Math.max(0, Math.min(PUBLICITAT.length - 1, nivell)); }

// ---------- local ----------
export const lloguerMensual = (info) => {
  const z = ZONES[info.zona] || ZONES.barri;
  return info.sub === 'nau' ? z.lloguerNau : z.lloguerLocal;
};
export const preuSolar = (info) => (ZONES[info.zona] || ZONES.poligon).preuSolar || 40000;

export function signarLloguer(e, info) {
  const mensual = lloguerMensual(info);
  const fianca = mensual * FIANCA_MESOS;
  const caixa = e.constitucio.constituida || e.diners > 0 ? 'diners' : 'estalvis';
  if (e[caixa] < fianca) throw new Error(`Necessites ${diners(fianca)} per a la fiança (${FIANCA_MESOS} mesos).`);
  e[caixa] -= fianca;
  e.local = { id: info.id, tipus: 'lloguer', sub: info.sub, zona: info.zona, estat: 'contracte', fase: 1, fianca, desde: Date.now() };
  e.despesesT = Date.now();
}

export function iniciarObres(e, tipus) {
  const o = OBRES_ADEQUACIO[tipus];
  if (!e.local) throw new Error('Primer necessites un local.');
  if (e.diners < o.cost) throw new Error(`L'empresa necessita ${diners(o.cost)} per a aquestes obres.`);
  e.diners -= o.cost; e.actius += o.cost;
  const ara = Date.now();
  Object.assign(e.local, { estat: 'obres', reforma: tipus, iniciObres: ara, fiObres: ara + (o.segons * 1000) / VELOCITAT, obra: 'adequacio' });
}

export function ampliar(e) {
  const f = e.local?.fase || 1;
  const seg = FASES_NEGOCI[f + 1];
  if (!seg) throw new Error('El negoci ja és al màxim.');
  if (!obert(e)) throw new Error('El negoci ha d\'estar obert.');
  if (e.diners < seg.cost) throw new Error(`Necessites ${diners(seg.cost)}.`);
  e.diners -= seg.cost; e.actius += seg.cost;
  const ara = Date.now();
  Object.assign(e.local, { estat: 'obres', iniciObres: ara, fiObres: ara + (seg.segons * 1000) / VELOCITAT, obra: 'ampliacio' });
}

export function comprarSolar(e, info) {
  const preu = preuSolar(info);
  if (!e.constitucio.constituida) throw new Error('Primer cal que l\'empresa estigui constituïda.');
  if (e.diners < preu + CONSTRUCCIO.cost) throw new Error(`Necessites ${diners(preu + CONSTRUCCIO.cost)} (solar ${diners(preu)} + construcció ${diners(CONSTRUCCIO.cost)}). Pots demanar un préstec al banc.`);
  e.diners -= preu + CONSTRUCCIO.cost; e.actius += preu + CONSTRUCCIO.cost;
  const ara = Date.now();
  e.nouLocal = { id: info.id, tipus: 'propietat', sub: 'solar', zona: info.zona, estat: 'construint', faseObra: 1, iniciObres: ara,
    fiObres: ara + CONSTRUCCIO.faseSegons[0] * 1000 / VELOCITAT, fase: Math.max(1, e.local?.fase || 1), reforma: 'completa' };
}

// Acaba obres i construccions. Retorna missatges.
export function actualitzar(e, ara = Date.now()) {
  const msgs = [];
  const l = e.local;
  if (l?.estat === 'obres' && l.fiObres <= ara) {
    if (l.obra === 'ampliacio') { l.fase += 1; l.estat = 'obert'; msgs.push(`Obres acabades: ara el negoci és "${FASES_NEGOCI[l.fase].nom}"`); }
    else { l.estat = 'llest'; msgs.push('Obres acabades! Ves al teu local per obrir les portes.'); }
    delete l.fiObres;
  }
  const n = e.nouLocal;
  if (n?.estat === 'construint' && n.fiObres <= ara) {
    if (n.faseObra < 3) {
      n.faseObra += 1; n.iniciObres = ara; n.fiObres = ara + CONSTRUCCIO.faseSegons[n.faseObra - 1] * 1000 / VELOCITAT;
      msgs.push(`Construcció: fase ${n.faseObra} de 3`);
    } else {
      msgs.push('L\'edifici nou està acabat! El negoci s\'hi trasllada.');
      e.localAnterior = e.local?.id || null;
      e.local = { ...n, estat: 'obert' };
      delete e.nouLocal;
    }
  }
  return msgs;
}

// ---------- personal i despeses fixes ----------
export const costPersona = (rol) => PERSONAL[rol].sou * (1 + SS_EMPRESA);
export const treballadors = (e) => (e.plantilla?.treballadors || 0) + (e.plantilla?.rrhh || 0);
export const teGestioLaboral = (e) => !!e.gestoria || (e.plantilla?.rrhh || 0) > 0;
export function contractar(e, rol) {
  if (!e.altaOcupador) throw new Error('Primer has d\'inscriure l\'empresa a la Seguretat Social com a ocupadora.');
  if (rol === 'treballadors' && !teGestioLaboral(e)) throw new Error('Necessites una gestoria o un/a tècnic/a de RRHH per fer les nòmines.');
  e.plantilla[rol] = (e.plantilla[rol] || 0) + 1;
}
export function acomiadar(e, rol) {
  if (!(e.plantilla[rol] > 0)) throw new Error('No hi ha ningú en aquest lloc.');
  e.plantilla[rol] -= 1;
}

export function despesesMensuals(e) {
  const files = [];
  if (e.local?.tipus === 'lloguer') files.push(['Lloguer del local', lloguerMensual(e.local)]);
  if (e.local) files.push(['Subministraments (llum, aigua, internet)', faseNegoci(e).subministraments]);
  if (e.local) files.push(['Assegurança del local', ASSEGURANCA_MENSUAL]);
  if (e.constitucio.constituida) files.push(['Quota d\'autònom (RETA)', FORMES[e.forma]?.quotaMensual || 0]);
  if (e.gestoria) files.push(['Gestoria', GESTORIA.fixe + GESTORIA.perTreballador * treballadors(e)]);
  const nt = e.plantilla?.treballadors || 0;
  if (nt) files.push([`${nt} × ${sector(e)?.ofici || 'Treballador/a'} (sou + Seg. Social)`, Math.round(nt * costPersona('treballadors'))]);
  const nr = e.plantilla?.rrhh || 0;
  if (nr) files.push([`${nr} × Tècnic/a de RRHH (sou + Seg. Social)`, Math.round(nr * costPersona('rrhh'))]);
  const pub = PUBLICITAT[e.negoci?.publicitat || 0];
  if (pub?.mensual) files.push([`Publicitat: ${pub.nom}`, pub.mensual]);
  const dir = souDirectorsHora(e);
  if (dir) files.push(['Directors', Math.round(dir * SETMANES_PER_MES)]);
  return files;
}
export const totalMensual = (e) => despesesMensuals(e).reduce((s, [, v]) => s + v, 0);

export function aplicarDespeses(e, ara = Date.now()) {
  const msgs = [];
  const abans = e.despesesT ?? ara;
  e.despesesT = ara;
  if (!e.local) return msgs;
  const hores = Math.min((ara - abans) / HORA, 24 * 7);
  const cost = totalMensual(e) / SETMANES_PER_MES * hores * VELOCITAT;
  e.diners -= cost;
  llibre(e, ara).fix += cost;
  // sancions si ningú porta els impostos
  const setmana = setmanaIdx(ara);
  if (e.ultimaSetmana == null) e.ultimaSetmana = setmana;
  const noves = Math.min(setmana - e.ultimaSetmana, 4);
  e.ultimaSetmana = setmana;
  if (e.constitucio.constituida && !e.gestoria) {
    for (let k = 0; k < noves; k++) if (Math.random() < RISC_SANCIO.probabilitat) {
      e.diners -= RISC_SANCIO.import; e.sancions = (e.sancions || 0) + 1;
      msgs.push(`${RISC_SANCIO.text} −${diners(RISC_SANCIO.import)}`);
    }
  }
  if (e.diners < 0) {
    const f = FORMES[e.forma];
    if (f && !f.limitada && e.estalvis > 0) {
      const tapa = Math.min(e.estalvis, -e.diners); e.estalvis -= tapa; e.diners += tapa;
      msgs.push(`L'empresa no tenia diners: com que respons amb el teu patrimoni, s'han fet servir ${diners(tapa)} dels teus estalvis.`);
    }
    if (e.diners < 0 && e.plantilla.treballadors > 0) {
      e.plantilla.treballadors = 0;
      msgs.push('No podies pagar les nòmines: el personal ha marxat.');
    }
  }
  return msgs;
}

// ---------- banc ----------
export const interesHora = (e) => BANC.interesHora * bonus(e, 'interes');
export function aplicarInteressos(e, ara = Date.now()) {
  if (!e.deute) { e.deuteT = ara; return; }
  e.deute *= (1 + interesHora(e)) ** ((ara - (e.deuteT || ara)) / HORA);
  e.deuteT = ara;
}
export const maxPrestec = (e) => Math.max(0, Math.floor((valorEmpresa(e) + (e.deute || 0)) * BANC.maxPercentValor * (FORMES[e.forma]?.bancFactor || 1) - (e.deute || 0)));
export function demanarPrestec(e, q) {
  q = Math.floor(q); aplicarInteressos(e);
  if (!(q >= 1)) throw new Error('Tria una quantitat.');
  if (q > maxPrestec(e)) throw new Error(`El banc només et deixa ${diners(maxPrestec(e))}.`);
  e.deute += q; e.diners += q;
}
export function retornarPrestec(e, q) {
  aplicarInteressos(e);
  q = Math.min(Math.floor(q), Math.ceil(e.deute));
  if (!(q >= 1)) throw new Error('No tens cap préstec.');
  if (q > e.diners) throw new Error('No tens prou diners.');
  e.diners -= q; e.deute = Math.max(0, e.deute - q); if (e.deute < 0.5) e.deute = 0;
}

// ---------- valor, balanç, nivell ----------
export function balanc(e) {
  const s = SECTORS_NEGOCI[e.sector];
  const estoc = s ? (e.negoci?.materia || 0) * s.materia.cost + (e.negoci?.producte || 0) * s.materia.cost : 0;
  const fianca = e.local?.fianca || 0;
  const corrents = Math.round((e.diners || 0) + estoc);
  const noCorrents = Math.round((e.actius || 0) + fianca);
  const passius = Math.round(e.deute || 0);
  return { diners: Math.round(e.diners || 0), estoc: Math.round(estoc), corrents, noCorrents, passius, net: corrents + noCorrents - passius };
}
export const valorEmpresa = (e) => (e && e.constitucio ? balanc(e).net : Math.round(e?.valor || 0));
export function nivellDeValor(v) { let n = 1; NIVELLS_EMPRESA.forEach((l, k) => { if (v >= l) n = k + 1; }); return n; }
export const nivellEmpresa = (e) => nivellDeValor(valorEmpresa(e));
export function progresNivell(e) {
  const n = nivellEmpresa(e), a = NIVELLS_EMPRESA[n - 1], b = NIVELLS_EMPRESA[n];
  if (b == null) return { nivell: n, fraccio: 1, falta: 0 };
  const v = valorEmpresa(e);
  return { nivell: n, fraccio: Math.max(0, (v - a) / (b - a)), falta: b - v };
}
export function registrarHistorial(e, ara = Date.now()) {
  const u = e.historial[e.historial.length - 1];
  if (u && ara - u.t < HISTORIAL_MINUTS * 60000) return false;
  e.historial.push({ t: ara, v: valorEmpresa(e) });
  if (e.historial.length > 60) e.historial.shift();
  return true;
}

// ---------- missions i reptes ----------
export const missioActual = (e) => MISSIONS[e.missio || 0] || null;
export function cobrarMissio(e) {
  const m = missioActual(e);
  if (!m || !m.fet(e)) throw new Error('Encara no l\'has completat.');
  e.diners += m.premi; e.missio = (e.missio || 0) + 1; return m;
}
export function progresRepte(e, r) {
  const x = Number(r.xifra) || 0, st = (k) => e.stats?.[k] || 0;
  switch (r.tipus) {
    case 'valor': return [valorEmpresa(e), x];
    case 'diners': return [Math.round(e.diners), x];
    case 'nivell': return [nivellEmpresa(e), x];
    case 'vendes': return [Math.floor(st('unitatsVenudes')), x];
    case 'ingressos': return [Math.round(st('ingressos')), x];
    case 'benefici': return [st('setmanesAmbBenefici'), x];
    case 'fase': return [e.local?.fase || 0, x];
    case 'treballadors': return [treballadors(e), x];
    case 'senseDeute': return [(e.deute || 0) < 1 && e.constitucio?.constituida ? 1 : 0, 1];
    default: return [0, 1];
  }
}
export const repteFet = (e, r) => { const [a, b] = progresRepte(e, r); return a >= b; };
export const textRepte = (r) => r.text || TIPUS_REPTE[r.tipus]?.text(r) || 'Repte';
export function cobrarRepte(e, r) {
  if (e.reptesCobrats.includes(r.id)) throw new Error('Ja l\'has cobrat.');
  if (r.fins && Date.now() > r.fins) throw new Error('Aquest repte ja ha caducat.');
  if (!repteFet(e, r)) throw new Error('Encara no l\'has aconseguit.');
  e.reptesCobrats.push(r.id); e.diners += Number(r.premi) || 0;
}

// Compatibilitat amb funcions antigues de la borsa (desa.js)
export function afegirAmbCost(e, recurs, q) { e.inventari ??= {}; e.inventari[recurs] = (e.inventari[recurs] || 0) + q; }
