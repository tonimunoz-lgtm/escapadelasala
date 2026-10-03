// =============================================================
//  DADES DEL JOC — aquí és on el professorat pot ajustar l'economia
// =============================================================

// 1 = velocitat normal. 2 = tot va el doble de ràpid (construir i produir).
export const VELOCITAT = 1;

export const DINERS_INICIALS = 12000;
export const MIDA_MAPA = 4;              // el mapa és de MIDA_MAPA x MIDA_MAPA parcel·les
export const PARCELES_OBERTES = [0, 1, 2, 4, 5, 6]; // parcel·les disponibles al començar
export const PARCELA_SEU = 5;            // on hi ha la seu central
export const COST_PARCELA_BASE = 3000;   // la 1a parcel·la extra costa això, la 2a el doble...
export const MAX_PER_ORDRE = 100;        // unitats màximes per ordre de producció

// preu = el que paga el mercat de l'escola per cada unitat
export const RECURSOS = {
  electricitat: { nom: 'Electricitat', preu: 3 },
  aigua:        { nom: 'Aigua',        preu: 2 },
  llavors:      { nom: 'Llavors',      preu: 12 },
  blat:         { nom: 'Blat',         preu: 22 },
  raim:         { nom: 'Raïm',         preu: 24 },
  olives:       { nom: 'Olives',       preu: 24 },
  ous:          { nom: 'Ous',          preu: 34 },
  llet:         { nom: 'Llet',         preu: 62 },
  farina:       { nom: 'Farina',       preu: 55 },
  pa:           { nom: 'Pa',           preu: 140 },
  vi:           { nom: 'Vi',           preu: 100 },
  oli:          { nom: 'Oli',          preu: 130 },
  fusta:        { nom: 'Fusta',        preu: 14 },
  pedra:        { nom: 'Pedra',        preu: 16 },
  maons:        { nom: 'Maons',        preu: 55 },
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
  'botiga':      { nom: 'Botiga',      cost: 0, aviat: true, produeix: [] },
  'magatzem':    { nom: 'Magatzem',    cost: 0, aviat: true, produeix: [] },
  'restaurant':  { nom: 'Restaurant',  cost: 0, aviat: true, produeix: [] },
  'laboratori':  { nom: 'Laboratori',  cost: 0, aviat: true, produeix: [] },
  'port':        { nom: 'Port',        cost: 0, aviat: true, produeix: [] },

  // Edifici inicial (no es pot construir)
  'seu-central': { nom: 'Seu central', cost: 0, inicial: true, produeix: [] },
};

// Segons que costa construir un edifici
export const tempsConstruccio = (tipus) =>
  Math.max(20, Math.round(EDIFICIS[tipus].cost / 40)) / VELOCITAT;

export const imgEdifici = (tipus) => `img/edificis/edifici-${tipus}.webp`;
export const imgRecurs = (recurs) => `img/recursos/recurs-${recurs}.webp`;
export const imgLogo = (n) => `img/avatars/logo-empresa-${String(n).padStart(2, '0')}.webp`;
export const NUM_LOGOS = 20;
