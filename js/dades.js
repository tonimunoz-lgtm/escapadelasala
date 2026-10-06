// =============================================================
//  DADES DEL JOC (versió 2: negocis en una ciutat comuna)
//  El professorat pot ajustar l'economia en aquest fitxer.
//  Temps del joc: 1 hora real = 1 setmana a l'empresa.
// =============================================================

export const VELOCITAT = 1; // 2 = tot el doble de ràpid

export const NUM_LOGOS = 20;
export const imgLogo = (n) => `img/avatars/logo-empresa-${String(n).padStart(2, '0')}.webp`;

// ---------- Sectors ----------
// Imports per unitat. demanda i capacitat són "per setmana" (1 hora real).
export const SECTORS_NEGOCI = {
  fleca: {
    nom: 'Fleca', iae: 'Epígraf 644.1 - Comerç al detall de pa i pastisseria',
    materia: { nom: 'Farina i ingredients', cost: 0.45, img: 'img/productes/materia-fleca.webp' },
    producte: { nom: 'Pa i pastes', preuRef: 1.8, img: 'img/productes/producte-fleca.webp' },
    demanda: 1800, capacitat: 700, ofici: 'Forner/a',
    text: 'Fas pa i pastes cada dia. Ven molt i barat: necessites molta gent passant i força personal.',
  },
  cafeteria: {
    nom: 'Cafeteria', iae: 'Epígraf 672 - Cafeteries',
    materia: { nom: 'Cafè, llet i pa', cost: 1.2, img: 'img/productes/materia-cafeteria.webp' },
    producte: { nom: 'Esmorzars i cafès', preuRef: 3.5, img: 'img/productes/producte-cafeteria.webp' },
    demanda: 1200, capacitat: 500, ofici: 'Cambrer/a',
    text: 'Serveis esmorzars i cafès. La ubicació és clau: com més gent passa, més clients entren.',
  },
  roba: {
    nom: 'Botiga de roba', iae: 'Epígraf 651.2 - Comerç al detall de peces de vestir',
    materia: { nom: 'Roba a l\'engròs', cost: 12, img: 'img/productes/materia-roba.webp' },
    producte: { nom: 'Peces de roba', preuRef: 30, img: 'img/productes/producte-roba.webp' },
    demanda: 150, capacitat: 120, ofici: 'Dependent/a',
    text: 'Compres roba a l\'engròs i la vens amb marge. Pocs clients però cada venda deixa més diners.',
  },
  bicis: {
    nom: 'Taller de bicicletes', iae: 'Epígraf 691.9 - Reparació d\'altres béns de consum',
    materia: { nom: 'Peces de recanvi', cost: 15, img: 'img/productes/materia-bicis.webp' },
    producte: { nom: 'Reparacions i bicis', preuRef: 45, img: 'img/productes/producte-bicis.webp' },
    demanda: 70, capacitat: 40, ofici: 'Mecànic/a',
    text: 'Repares i vens bicicletes. Feina especialitzada: pocs clients, tiquet alt i molta mà d\'obra.',
  },
};
export const imgNegoci = (sector, fase) => `img/negocis/${sector}-${Math.min(3, Math.max(1, fase || 1))}.webp`;

// ---------- Zones de la ciutat ----------
// gent: multiplicador de clients. Imports mensuals.
export const ZONES = {
  centre:  { nom: 'Centre', gent: 1.0, lloguerLocal: 1300, lloguerNau: 0, preuSolar: 0 },
  barri:   { nom: 'Barri', gent: 0.7, lloguerLocal: 750, lloguerNau: 0, preuSolar: 45000 },
  poligon: { nom: 'Polígon industrial', gent: 0.35, lloguerLocal: 0, lloguerNau: 1100, preuSolar: 30000 },
};
export const FIANCA_MESOS = 2;

// ---------- Obres i fases del negoci ----------
export const OBRES_ADEQUACIO = {
  basica:   { nom: 'Reforma bàsica', cost: 4000, segons: 60, atractiu: 1.0, text: 'Pintura, llum i mobiliari senzill.' },
  completa: { nom: 'Reforma completa', cost: 11000, segons: 120, atractiu: 1.2, text: 'Disseny cuidat i equipament nou: atreu un 20% més de clients.' },
};
export const CONSTRUCCIO = { cost: 60000, faseSegons: [90, 120, 120], text: 'Edifici propi en un solar: fonaments, estructura i acabats.' };
// Ampliacions: multiplicador de demanda (més espai, més visibilitat) i de capacitat
export const FASES_NEGOCI = [
  null,
  { nom: 'Local petit', demanda: 1, capacitat: 1, subministraments: 180 },
  { nom: 'Local ampliat', demanda: 1.7, capacitat: 1.6, subministraments: 320, cost: 25000, segons: 120 },
  { nom: 'Gran establiment', demanda: 2.6, capacitat: 2.4, subministraments: 600, cost: 70000, segons: 180 },
];

export const PUBLICITAT = [
  { nom: 'Cap', mensual: 0, efecte: 1 },
  { nom: 'Xarxes socials', mensual: 150, efecte: 1.12 },
  { nom: 'Cartells i xarxes', mensual: 450, efecte: 1.25 },
  { nom: 'Campanya forta', mensual: 1200, efecte: 1.4 },
];
export const ASSEGURANCA_MENSUAL = 60;

// ---------- Fases econòmiques ----------
export const FASE_MINUTS = 20;
export const FASES = {
  normal:   { nom: 'Normalitat', produccio: 1, vendes: 1, text: 'L\'economia va com sempre.' },
  expansio: { nom: 'Expansió', produccio: 1, vendes: 1.25, text: 'La gent gasta més: entren més clients.' },
  recessio: { nom: 'Recessió', produccio: 1, vendes: 0.75, text: 'La gent gasta menys: entren menys clients.' },
};

// ---------- Nivells d'empresa i desbloquejos ----------
export const NIVELLS_EMPRESA = [0, 25000, 40000, 60000, 90000, 130000, 180000, 250000, 350000, 500000];
export const DESBLOQUEIG = { banc: 1, directors: 4 };
export const BANC = { maxPercentValor: 0.4, interesHora: 0.01 };
export const HISTORIAL_MINUTS = 5;
export const XAT_ACTIU = true;

export const DIRECTORS = {
  operacions: { nom: 'Directora d\'operacions', logo: 14, fitxatge: 3000, souHora: 400, efecte: 'L\'equip treballa un 15% més ràpid.', produccio: 1.15 },
  marqueting: { nom: 'Director de màrqueting', logo: 15, fitxatge: 3000, souHora: 350, efecte: 'Entren un 20% més de clients.', vendes: 1.2 },
  financer:   { nom: 'Director financer', logo: 19, fitxatge: 2500, souHora: 250, efecte: 'Els préstecs paguen la meitat d\'interès.', interes: 0.5 },
};

// ---------- Missions després d'obrir ----------
const st = (e, k) => (e.stats && e.stats[k]) || 0;
export const MISSIONS = [
  { text: 'Compra matèria primera al proveïdor', premi: 300, fet: (e) => st(e, 'comprat') >= 1 },
  { text: 'Contracta la primera persona', premi: 300, fet: (e) => (e.plantilla?.treballadors || 0) >= 1 },
  { text: 'Ven 100 unitats', premi: 500, fet: (e) => st(e, 'unitatsVenudes') >= 100 },
  { text: 'Tanca una setmana amb benefici', premi: 800, fet: (e) => st(e, 'setmanesAmbBenefici') >= 1 },
  { text: 'Fes publicitat del negoci', premi: 300, fet: (e) => (e.negoci?.publicitat || 0) >= 1 },
  { text: 'Amplia el negoci a la fase 2', premi: 2000, fet: (e) => (e.local?.fase || 0) >= 2 },
  { text: 'Arriba al nivell 4 d\'empresa', premi: 3000, fet: (e) => (e.nivellMax || 1) >= 4 },
];

// ---------- Reptes que pot crear el professorat ----------
export const TIPUS_REPTE = {
  valor:        { nom: 'Valor de l\'empresa', params: ['xifra'], text: (r) => `Arriba a ${Number(r.xifra).toLocaleString('ca-ES')} € de valor d'empresa` },
  diners:       { nom: 'Diners a la caixa', params: ['xifra'], text: (r) => `Tingues ${Number(r.xifra).toLocaleString('ca-ES')} € a la caixa` },
  nivell:       { nom: 'Nivell d\'empresa', params: ['xifra'], text: (r) => `Arriba al nivell ${r.xifra} d'empresa` },
  vendes:       { nom: 'Unitats venudes', params: ['xifra'], text: (r) => `Ven ${Number(r.xifra).toLocaleString('ca-ES')} unitats` },
  ingressos:    { nom: 'Ingressos totals', params: ['xifra'], text: (r) => `Factura ${Number(r.xifra).toLocaleString('ca-ES')} € en total` },
  benefici:     { nom: 'Setmanes amb benefici', params: ['xifra'], text: (r) => `Tanca ${r.xifra} setmanes amb benefici` },
  fase:         { nom: 'Fase del negoci', params: ['xifra'], text: (r) => `Amplia el negoci fins a la fase ${r.xifra}` },
  treballadors: { nom: 'Plantilla', params: ['xifra'], text: (r) => `Tingues ${r.xifra} persones contractades` },
  senseDeute:   { nom: 'Sense deutes', params: [], text: () => 'Torna tots els préstecs del banc' },
};

// Compatibilitat amb la borsa de la versió anterior (desactivada en aquesta versió)
export const COMISSIO_BORSA = 0.03;
export const RECURSOS = {};
