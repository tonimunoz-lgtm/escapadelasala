// =============================================================
//  DADES DEL JOC — aquí és on el professorat pot ajustar l'economia
// =============================================================

// 1 = velocitat normal. 2 = tot va el doble de ràpid (construir i produir).
export const VELOCITAT = 1;

export const DINERS_INICIALS = 12000;
// Mapa: MIDA_MAPA x MIDA_MAPA parcel·les, agrupades en illes de BLOC x BLOC separades per carrers
export const MIDA_MAPA = 6;
export const BLOC = 2;
export const COST_CARRETERA = 250;      // construir un tros de carretera en una parcel·la pròpia
export const PARCELES_OBERTES = [14, 15, 20, 21, 16, 22]; // illa central + 2 parcel·les de la illa del costat
export const PARCELA_SEU = 21;           // on hi ha la seu central
export const COST_PARCELA_BASE = 3000;   // la 1a parcel·la extra costa això, la 2a el doble...
export const MAX_PER_ORDRE = 100;        // unitats màximes per ordre de producció
export const NIVELL_MAX = 10;
export const SALARI_PER_SEGON = 0.1;     // € de sou per cada segon de producció (per unitat)
export const COMISSIO_BORSA = 0.03;      // la borsa es queda un 3% de cada venda, com a Sim Companies

// preu = el que paga el mercat de l'escola per cada unitat
export const RECURSOS = {
  electricitat: { nom: 'Electricitat', preu: 3,   cat: 'energia' },
  aigua:        { nom: 'Aigua',        preu: 2,   cat: 'energia' },
  llavors:      { nom: 'Llavors',      preu: 12,  cat: 'agricultura' },
  blat:         { nom: 'Blat',         preu: 22,  cat: 'agricultura' },
  raim:         { nom: 'Raïm',         preu: 24,  cat: 'agricultura' },
  olives:       { nom: 'Olives',       preu: 24,  cat: 'agricultura' },
  ous:          { nom: 'Ous',          preu: 34,  cat: 'alimentacio' },
  llet:         { nom: 'Llet',         preu: 62,  cat: 'alimentacio' },
  farina:       { nom: 'Farina',       preu: 55,  cat: 'alimentacio' },
  pa:           { nom: 'Pa',           preu: 140, cat: 'alimentacio' },
  vi:           { nom: 'Vi',           preu: 100, cat: 'alimentacio' },
  oli:          { nom: 'Oli',          preu: 130, cat: 'alimentacio' },
  fusta:        { nom: 'Fusta',        preu: 14,  cat: 'construccio' },
  pedra:        { nom: 'Pedra',        preu: 16,  cat: 'construccio' },
  maons:        { nom: 'Maons',        preu: 55,  cat: 'construccio' },
  // Punts de recerca: no es venen, es gasten a l'Empresa > Recerca
  recerca:      { nom: 'Punts de recerca', preu: 0, cat: 'recerca', intern: true, img: 'img/edificis/edifici-laboratori.webp' },
};

export const CATEGORIES = {
  energia: 'Energia i aigua',
  agricultura: 'Agricultura',
  alimentacio: 'Alimentació',
  construccio: 'Construcció',
};

// temps = segons per unitat · entrades = el que es gasta per cada unitat
export const EDIFICIS = {
  'central-electrica': { nom: 'Central elèctrica', cost: 2000, produeix: [
    { recurs: 'electricitat', temps: 5, entrades: {} } ] },
  'solar': { nom: 'Parc solar', cost: 4500, produeix: [
    { recurs: 'electricitat', temps: 4, entrades: {} } ] },
  'eolic': { nom: 'Parc eòlic', cost: 6500, produeix: [
    { recurs: 'electricitat', temps: 3, entrades: {} } ] },
  'estacio-bombeig': { nom: 'Estació de bombeig', cost: 1500, produeix: [
    { recurs: 'aigua', temps: 4, entrades: {} } ] },
  'viver': { nom: 'Viver', cost: 3000, produeix: [
    { recurs: 'llavors', temps: 10, entrades: { aigua: 1, electricitat: 1 } } ] },
  'camp-cultiu': { nom: 'Camp de cultiu', cost: 4000, produeix: [
    { recurs: 'blat',   temps: 12, entrades: { llavors: 1, aigua: 2 } },
    { recurs: 'raim',   temps: 15, entrades: { llavors: 1, aigua: 2 } },
    { recurs: 'olives', temps: 15, entrades: { llavors: 1, aigua: 2 } } ] },
  'granja': { nom: 'Granja', cost: 6000, produeix: [
    { recurs: 'ous',  temps: 15, entrades: { blat: 1, aigua: 1 } },
    { recurs: 'llet', temps: 18, entrades: { blat: 2, aigua: 2 } } ] },
  'moli': { nom: 'Molí', cost: 5000, produeix: [
    { recurs: 'farina', temps: 10, entrades: { blat: 2, electricitat: 1 } } ] },
  'forn': { nom: 'Forn de pa', cost: 7000, produeix: [
    { recurs: 'pa', temps: 20, entrades: { farina: 2, aigua: 1, electricitat: 1 } } ] },
  'celler': { nom: 'Celler', cost: 8000, produeix: [
    { recurs: 'vi', temps: 30, entrades: { raim: 3, electricitat: 1 } } ] },
  'almassera': { nom: 'Almàssera', cost: 8000, produeix: [
    { recurs: 'oli', temps: 30, entrades: { olives: 4, electricitat: 1 } } ] },
  'serradora': { nom: 'Serradora', cost: 3500, produeix: [
    { recurs: 'fusta', temps: 12, entrades: { electricitat: 1 } } ] },
  'pedrera': { nom: 'Pedrera', cost: 3500, produeix: [
    { recurs: 'pedra', temps: 12, entrades: { electricitat: 2 } } ] },
  'bobinadora-maons': { nom: 'Bòbila', cost: 6000, produeix: [
    { recurs: 'maons', temps: 20, entrades: { pedra: 2, electricitat: 2 } } ] },

  // Edificis que encara no es poden construir (properes versions)
  // La botiga ven al públic. tempsVenda = segons per unitat si el preu és el de referència.
  // Com més car, més lenta la venda: temps x (preu / preuReferencia)^2
  'botiga': { nom: 'Botiga', cost: 5000, produeix: [], ven: [
    { recurs: 'pa',   tempsVenda: 8 },
    { recurs: 'ous',  tempsVenda: 6 },
    { recurs: 'llet', tempsVenda: 7 },
    { recurs: 'vi',   tempsVenda: 10 },
    { recurs: 'oli',  tempsVenda: 10 } ] },
  'magatzem':    { nom: 'Magatzem',    cost: 0, aviat: true, produeix: [] },
  'restaurant':  { nom: 'Restaurant',  cost: 0, aviat: true, produeix: [] },
  'laboratori': { nom: 'Laboratori', cost: 9000, nivellMinim: 4, produeix: [
    { recurs: 'recerca', temps: 30, entrades: { electricitat: 2 } } ] },
  'port':        { nom: 'Port',        cost: 0, aviat: true, produeix: [] },

  // Edifici inicial (no es pot construir)
  'seu-central': { nom: 'Seu central', cost: 0, inicial: true, produeix: [] },
};

// Segons que costa construir un edifici
export const tempsConstruccio = (tipus) =>
  Math.max(20, Math.round(EDIFICIS[tipus].cost / 40)) / VELOCITAT;

// Preu de referència a la botiga (el que paga el públic sense fer cua)
export const preuReferencia = (recurs) => Math.round(RECURSOS[recurs].preu * 1.5);

export const imgEdifici = (tipus) => `img/edificis/edifici-${tipus}.webp`;
export const imgRecurs = (recurs) => RECURSOS[recurs]?.img || `img/recursos/recurs-${recurs}.webp`;
export const imgLogo = (n) => `img/avatars/logo-empresa-${String(n).padStart(2, '0')}.webp`;
export const NUM_LOGOS = 20;

// =============================================================
//  NIVELLS D'EMPRESA: es puja de nivell segons el valor de l'empresa
//  i cada nivell desbloqueja coses noves (com a Sim Companies)
// =============================================================
export const NIVELLS_EMPRESA = [0, 15000, 25000, 40000, 60000, 90000, 130000, 180000, 250000, 350000];
export const DESBLOQUEIG = {
  contractes: 2,   // enviar contractes directes a una altra empresa
  banc: 1,         // demanar préstecs
  recerca: 4,      // construir el laboratori i millorar la qualitat
  directors: 4,    // contractar directors
};

// =============================================================
//  QUALITAT (Q0 a Q5): es millora amb punts de recerca, per producte
// =============================================================
export const QUALITAT = {
  max: 5,
  cost: (q) => 10 * (q + 1) * (q + 1),  // punts per passar de Q a Q+1: 10, 40, 90, 160, 250
  bonusEscola: 0.08,                    // l'escola paga un 8% més per cada nivell de qualitat
  bonusBotiga: 0.15,                    // a la botiga, el preu habitual puja un 15% per nivell
};

// =============================================================
//  DIRECTORS: cobren un sou cada hora real i milloren l'empresa
// =============================================================
export const DIRECTORS = {
  operacions: { nom: 'Directora d\'operacions', logo: 14, fitxatge: 3000, souHora: 400,
    efecte: 'Tots els edificis produeixen un 15% més ràpid.', produccio: 1.15 },
  marqueting: { nom: 'Director de màrqueting', logo: 15, fitxatge: 3000, souHora: 350,
    efecte: 'Les botigues venen un 20% més ràpid.', vendes: 1.2 },
  tecnologia: { nom: 'Directora de tecnologia', logo: 17, fitxatge: 4000, souHora: 300,
    efecte: 'El laboratori investiga un 30% més ràpid.', recerca: 1.3 },
  financer:   { nom: 'Director financer', logo: 19, fitxatge: 2500, souHora: 250,
    efecte: 'Els préstecs del banc paguen la meitat d\'interès.', interes: 0.5 },
};

// =============================================================
//  FASES ECONÒMIQUES: canvien soles cada FASE_MINUTS, iguals per a tothom
//  produccio / vendes: com més alt, més ràpid
// =============================================================
export const FASE_MINUTS = 20;
export const FASES = {
  normal:    { nom: 'Normalitat', produccio: 1,    vendes: 1,    text: 'L\'economia va com sempre.' },
  expansio:  { nom: 'Expansió',   produccio: 1,    vendes: 1.3,  text: 'La gent compra més: les botigues venen més ràpid.' },
  recessio:  { nom: 'Recessió',   produccio: 1.2,  vendes: 0.75, text: 'Es ven més lent, però produir és més ràpid.' },
};

// =============================================================
//  BANC
// =============================================================
export const BANC = {
  maxPercentValor: 0.3,   // pots demanar fins al 30% del valor de l'empresa
  interesHora: 0.02,      // 2% d'interès cada hora real
};

export const HISTORIAL_MINUTS = 5;   // cada quan es desa un punt del gràfic de valor
export const XAT_ACTIU = true;       // posa false per amagar el xat de la classe

// =============================================================
//  MISSIONS (tutorial guiat). La condició rep l'empresa (e).
// =============================================================
const teEdifici = (e, tipus) => e.parceles.some((p) => p.tipus === tipus && p.estat === 'edifici');
const stat = (e, clau) => (e.stats && e.stats[clau]) || 0;
export const MISSIONS = [
  { text: 'Dona\'t d\'alta com a ocupador i tria qui et porta les nòmines', premi: 300, fet: (e) => e.altaOcupador && (e.gestoria || (e.plantilla?.rrhh || 0) > 0) },
  { text: 'Contracta 2 operaris', premi: 300, fet: (e) => (e.plantilla?.operari || 0) >= 2 },
  { text: 'Construeix una central elèctrica', premi: 500, fet: (e) => teEdifici(e, 'central-electrica') },
  { text: 'Construeix una estació de bombeig', premi: 500, fet: (e) => teEdifici(e, 'estacio-bombeig') },
  { text: 'Produeix i recull 20 unitats d\'aigua', premi: 300, fet: (e) => stat(e, 'produit_aigua') >= 20 },
  { text: 'Construeix un viver', premi: 800, fet: (e) => teEdifici(e, 'viver') },
  { text: 'Recull 10 llavors', premi: 500, fet: (e) => stat(e, 'produit_llavors') >= 10 },
  { text: 'Ven alguna cosa al mercat de l\'escola', premi: 300, fet: (e) => stat(e, 'vendesEscola') >= 1 },
  { text: 'Construeix un camp de cultiu', premi: 1000, fet: (e) => teEdifici(e, 'camp-cultiu') },
  { text: 'Publica una oferta a la borsa', premi: 500, fet: (e) => stat(e, 'ofertesBorsa') >= 1 },
  { text: 'Millora un edifici a nivell 2', premi: 1000, fet: (e) => e.parceles.some((p) => (p.nivell || 1) >= 2) },
  { text: 'Construeix una botiga i ven-hi alguna cosa', premi: 1500, fet: (e) => stat(e, 'vendesBotiga') >= 1 },
  { text: 'Arriba al nivell 3 d\'empresa', premi: 2000, fet: (e) => e.nivellMax >= 3 },
];
