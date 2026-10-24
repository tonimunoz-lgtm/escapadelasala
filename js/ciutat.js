// =============================================================
//  EL MAPA: Matadepera, Terrassa i Sabadell (esquemàtics), comú per a tota la classe.
//  - Matadepera al mig, al peu del Parc Natural de Sant Llorenç del Munt i l'Obac.
//  - Terrassa al sud-oest (per la Ctra. de Terrassa) i Sabadell al sud-est
//    (per la Ctra. de Sabadell). Totes dues són molt més grans que Matadepera.
//  - Els serveis on es fan tràmits (Notaria, Hisenda, Seguretat Social,
//    Registre Mercantil) i el polígon industrial són a Terrassa.
//  Per moure un edifici, canvia'n les coordenades a EDIFICIS_CIUTAT.
// =============================================================
import { imgNegoci, imgLogo, SECTORS_NEGOCI } from './dades.js';
import { TERRENYS_PARC, MIDA_TOTAL, BLOC, BLOCS_INICIALS, OBJECTES, srcObjecte, giraObjecte, giraParc, dibuixaObjecte } from './parc-dades.js';

export const W = 236;
const DZ = 14;
const MARGE = 0.04;
// Parcel·les planes (sense edificis alts): es poden reprojectar a la graella sense que es noti,
// així el seu terra encaixa exactament encara que la il·lustració estigui dibuixada girada.
const PLANES = /(camp-futbol|gespa|solar-en-venda|pistes-padel|piscina-municipal)\.webp/;
// Canvia aquest número quan actualitzis imatges: obliga el navegador a no fer servir les velles
export const VERSIO_IMATGES = '7';
export const iso = (u, v) => ({ x: (u - v) * W / 2, y: (u + v) * W / 4 });
const clau = (X, Y) => `${X},${Y}`;
const hash = (X, Y) => { let h = (X * 374761393 + Y * 668265263) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return h % 1000; };

// ---------- Plànol ----------
// Illes de 3x3 caselles separades per carrers (cada 4 caselles).
// Matadepera: illes bx 0..4,   by 0..3   (X 0..20,   Y 0..16)   →  20 illes
// Terrassa:   illes bx -3..3,  by 5..10  (X -12..16, Y 20..44)  →  42 illes
// Sabadell:   illes bx 7..13,  by 3..9   (X 28..56,  Y 12..40)  →  49 illes
// Polígon de Terrassa: illes bx 1..3, by 5..6 (les naus i solars de sempre)
const MATADEPERA = { nom: 'Matadepera', bx: [0, 4], by: [0, 3] };
const TERRASSA = { nom: 'Terrassa', bx: [-3, 3], by: [5, 10] };
const SABADELL = { nom: 'Sabadell', bx: [7, 13], by: [3, 9] };
const ZONES_MAPA = [MATADEPERA, TERRASSA, SABADELL];
const esIlla = (bx, by, z) => bx >= z.bx[0] && bx <= z.bx[1] && by >= z.by[0] && by <= z.by[1];
const zonaMapaDe = (X, Y) => ZONES_MAPA.find((z) => X >= z.bx[0] * 4 && X <= z.bx[1] * 4 + 4 && Y >= z.by[0] * 4 && Y <= z.by[1] * 4 + 4) || null;
const esPoligonTerrassa = (X, Y) => X >= 4 && X <= 16 && Y >= 20 && Y <= 28;
const esPoligonSabadell = (X, Y) => X >= 48 && X <= 56 && Y >= 12 && Y <= 40;

// Carrers: [h|v, coordenada, des de, fins a, nom, població]
// 'h' = carrer a Y fix (va de X=des a X=fins); 'v' = carrer a X fix (de Y=des a Y=fins).
// El plànol és esquemàtic: els noms són reals però la posició és aproximada.
export const CARRERS = [
  // Matadepera
  ['h', 0, 0, 20, 'Passeig d\'Àngel Guimerà', 'Matadepera'],
  ['h', 4, 0, 20, 'Carrer de Sant Llorenç', 'Matadepera'],
  ['h', 8, 0, 20, 'Carrer de Sant Joan', 'Matadepera'],
  ['h', 12, 0, 20, 'Avinguda del Mas Sot', 'Matadepera'],
  ['h', 16, 0, 20, 'Carrer de Joan Paloma', 'Matadepera'],
  ['v', 0, 0, 16, 'Carrer de Sant Miquel', 'Matadepera'],
  ['v', 4, 0, 16, 'Carrer de Pere Aldavert', 'Matadepera'],
  ['v', 8, 0, 19, 'Carretera de Terrassa', 'Matadepera'],
  ['v', 12, 0, 16, 'Carrer de Jaume Faura', 'Matadepera'],
  ['v', 16, 0, 16, 'Carrer de Sant Ramon', 'Matadepera'],
  ['v', 20, 0, 16, 'Carrer de Can Vinyals', 'Matadepera'],
  // carreteres entre poblacions
  ['h', 12, 21, 27, 'Carretera de Sabadell', 'Matadepera'],
  ['h', 32, 17, 27, 'Carretera de Terrassa a Sabadell (N-150)', null],
  // Terrassa
  ['h', 20, -12, 16, 'Rambla d\'Ègara', 'Terrassa'],
  ['h', 24, -12, 16, 'Carrer del Polígon', 'Terrassa'],
  ['h', 28, -12, 16, 'Carrer de Colom', 'Terrassa'],
  ['h', 32, -12, 16, 'Passeig del Vint-i-dos de Juliol', 'Terrassa'],
  ['h', 36, -12, 16, 'Carrer Major', 'Terrassa'],
  ['h', 40, -12, 16, 'Avinguda de Barcelona', 'Terrassa'],
  ['h', 44, -12, 16, 'Carretera de Montcada', 'Terrassa'],
  ['v', -12, 20, 44, 'Avinguda de Jacquard', 'Terrassa'],
  ['v', -8, 20, 44, 'Carrer de Sant Pere', 'Terrassa'],
  ['v', -4, 20, 44, 'Carrer de la Font Vella', 'Terrassa'],
  ['v', 0, 20, 44, 'Avinguda de l\'Abat Marcet', 'Terrassa'],
  ['v', 4, 20, 44, 'Carrer de Sant Leopold', 'Terrassa'],
  ['v', 8, 20, 44, 'Carretera de Matadepera', 'Terrassa'],
  ['v', 12, 20, 44, 'Carrer de la Unió', 'Terrassa'],
  ['v', 16, 20, 44, 'Carretera de Rubí', 'Terrassa'],
  // Sabadell
  ['h', 12, 28, 56, 'Avinguda de Matadepera', 'Sabadell'],
  ['h', 16, 28, 56, 'Carrer de les Tres Creus', 'Sabadell'],
  ['h', 20, 28, 56, 'La Rambla', 'Sabadell'],
  ['h', 24, 28, 56, 'Passeig de la Plaça Major', 'Sabadell'],
  ['h', 28, 28, 56, 'Carrer de Gràcia', 'Sabadell'],
  ['h', 32, 28, 56, 'Gran Via', 'Sabadell'],
  ['h', 36, 28, 56, 'Avinguda de Barberà', 'Sabadell'],
  ['h', 40, 28, 56, 'Carrer de Covadonga', 'Sabadell'],
  ['v', 28, 12, 40, 'Carretera de Terrassa', 'Sabadell'],
  ['v', 32, 12, 40, 'Avinguda de Francesc Macià', 'Sabadell'],
  ['v', 36, 12, 40, 'Carrer de Sant Pau', 'Sabadell'],
  ['v', 40, 12, 40, 'Carrer de la Indústria', 'Sabadell'],
  ['v', 44, 12, 40, 'Ronda de Zamenhof', 'Sabadell'],
  ['v', 48, 12, 40, 'Carrer de Vilarrúbias', 'Sabadell'],
  ['v', 52, 12, 40, 'Avinguda de l\'Onze de Setembre', 'Sabadell'],
  ['v', 56, 12, 40, 'Ronda de Ponent', 'Sabadell'],
];

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
  ['parc-esglesia', 10, 11, 1, 'img/ciutat/parc.webp', 'Parc de l\'Església', null],
  ['cap', 5, 11, 1, 'img/ciutat/cap.webp', 'CAP Matadepera', null],
  // Casal de Cultura (c. Pere Aldavert)
  ['casal', 3, 5, 1, 'img/ciutat/casal-cultura.webp', 'Casal de Cultura', null],
  ['placa-casal', 3, 6, 1, 'img/ciutat/jardi.webp', 'Plaça del Casal', null],
  ['parc-infantil-1', 2, 5, 1, 'img/ciutat/parc-infantil.webp', 'Parc infantil', null],
  // Educació i esport
  ['institut', 13, 13, 2, 'img/ciutat/institut.webp', 'Institut Matadepera', null],
  ['escola', 13, 1, 2, 'img/ciutat/escola-nova.webp', 'Escola', null],
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
  ['ajuntament-terrassa', -3, 29, 2, 'img/ciutat/ajuntament.webp', 'Ajuntament de Terrassa', null],
  ['seu-egara', 5, 29, 1, 'img/ciutat/esglesia.webp', 'Seu d\'Ègara', null],
  ['vallparadis', 1, 29, 2, 'img/ciutat/placa-font.webp', 'Parc de Vallparadís', null],
  ['mercat-terrassa', 1, 33, 2, 'img/ciutat/mercat-municipal.webp', 'Mercat de la Independència', null],
  ['universitat-terrassa', 9, 33, 2, 'img/ciutat/institut.webp', 'Campus universitari de Terrassa', null],
  ['estadi-terrassa', -7, 37, 2, 'img/ciutat/camp-futbol.webp', 'Estadi Olímpic de Terrassa', null],
  ['pavello-terrassa', -11, 25, 2, 'img/ciutat/pavello.webp', 'Pavelló de Terrassa', null],
  // Sabadell
  ['ajuntament-sabadell', 41, 21, 2, 'img/ciutat/ajuntament.webp', 'Ajuntament de Sabadell', null],
  ['placa-major-sabadell', 41, 25, 2, 'img/ciutat/placa-font.webp', 'Plaça Major de Sabadell', null],
  ['nova-creu-alta', 33, 17, 2, 'img/ciutat/camp-futbol.webp', 'Estadi de la Nova Creu Alta', null],
  ['mercat-sabadell', 45, 29, 2, 'img/ciutat/mercat-municipal.webp', 'Mercat Central de Sabadell', null],
  ['natacio-sabadell', 37, 33, 2, 'img/ciutat/piscina-municipal.webp', 'Club Natació Sabadell', null],
  ['parc-catalunya', 33, 29, 2, 'img/ciutat/placa-font.webp', 'Parc Catalunya', null],
  ['esglesia-sabadell', 37, 21, 1, 'img/ciutat/esglesia.webp', 'Església de Sant Fèlix', null],
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
  if (esPoligonTerrassa(X, Y) || esPoligonSabadell(X, Y)) return 'poligon';
  const z = zonaMapaDe(X, Y);
  if (z === MATADEPERA) return X >= 4 && X <= 16 && Y >= 4 && Y <= 12 ? 'centre' : 'barri';
  if (z === TERRASSA) return X >= -4 && X <= 12 && Y >= 28 && Y <= 36 ? 'centre' : 'barri';
  if (z === SABADELL) return X >= 32 && X <= 48 && Y >= 16 && Y <= 32 ? 'centre' : 'barri';
  return 'barri';
}

// Construeix el mapa de caselles
function generarMapa() {
  const cel = new Map();
  const carreteres = new Set();
  const posa = (X, Y, c) => cel.set(clau(X, Y), c);
  const zones = ZONES_MAPA;
  // carrers: vores de totes les illes de les tres poblacions
  for (const z of zones) {
    for (let by = z.by[0]; by <= z.by[1]; by++) for (let bx = z.bx[0]; bx <= z.bx[1]; bx++) {
      for (let k = 0; k <= 4; k++) {
        for (const [X, Y] of [[bx * 4 + k, by * 4], [bx * 4 + k, by * 4 + 4], [bx * 4, by * 4 + k], [bx * 4 + 4, by * 4 + k]]) carreteres.add(clau(X, Y));
      }
    }
  }
  // carreteres entre poblacions
  for (let Y = 16; Y <= 20; Y++) carreteres.add(clau(8, Y));    // Matadepera - Terrassa
  for (let X = 20; X <= 28; X++) carreteres.add(clau(X, 12));   // Matadepera - Sabadell
  for (let X = 16; X <= 28; X++) carreteres.add(clau(X, 32));   // Terrassa - Sabadell
  // Terrenys per a parcs d'atraccions a les afores, cadascun amb una carretera fins a la ciutat
  for (const [id, X0, Y0, costat] of TERRENYS_PARC) {
    for (let dx = 0; dx < 7; dx++) for (let dy = 0; dy < 7; dy++) posa(X0 + dx, Y0 + dy, { tipus: 'terreny', id, X: X0, Y: Y0 });
    const [dx, dy, X, Y] = costat === 'E' ? [1, 0, X0 + 7, Y0 + 3] : costat === 'W' ? [-1, 0, X0 - 1, Y0 + 3] : costat === 'S' ? [0, 1, X0 + 3, Y0 + 7] : [0, -1, X0 + 3, Y0 - 1];
    for (let k = 0, x = X, y = Y; k < 40 && !carreteres.has(clau(x, y)); k++, x += dx, y += dy) carreteres.add(clau(x, y));
  }
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
  const BOTIGUES = ['fleca', 'cafeteria', 'roba', 'bicis', 'floristeria', 'fruiteria', 'gelateria', 'informatica', 'llibreria', 'perruqueria', 'restaurant', 'gimnas'];
  const bloc = (h) => `img/ciutat/bloc-baix-${1 + ((h >> 4) % 2)}.webp`;
  const pisos = (h) => `img/ciutat/habitatges-${1 + ((h >> 3) % 3)}.webp`;
  // Terrassa i Sabadell: ciutat densa (pisos, botigues a la planta baixa, places)
  for (const z of zones) {
    for (let by = z.by[0]; by <= z.by[1]; by++) for (let bx = z.bx[0]; bx <= z.bx[1]; bx++) {
      for (let dx = 1; dx <= 3; dx++) for (let dy = 1; dy <= 3; dy++) {
        const X = bx * 4 + dx, Y = by * 4 + dy;
        if (cel.has(clau(X, Y))) continue;
        const h = hash(X, Y);
        let img;
        if (esPoligonTerrassa(X, Y) || esPoligonSabadell(X, Y)) img = h < 650 ? 'img/ciutat/nau-industrial.webp' : h < 850 ? bloc(h) : 'img/ciutat/jardi.webp';
        else if (z !== MATADEPERA) img = h < 430 ? pisos(h) : h < 640 ? bloc(h) : h < 800 ? `img/negocis/${BOTIGUES[h % BOTIGUES.length]}-${1 + ((h >> 5) % 3)}.webp` : h < 890 ? 'img/ciutat/jardi.webp' : h < 950 ? 'img/ciutat/parc.webp' : 'img/ciutat/parc-infantil.webp';
        else if (zonaDe(X, Y) === 'centre') img = h < 380 ? `img/ciutat/bloc-baix-${1 + ((h >> 4) % 2)}.webp` : h < 760 ? `img/ciutat/${CASES[h % 5]}.webp` : h < 900 ? 'img/ciutat/jardi.webp' : 'img/ciutat/gespa.webp';
        else img = h < 680 ? `img/ciutat/${CASES[h % 5]}.webp` : h < 800 ? 'img/ciutat/jardi.webp' : h < 900 ? 'img/ciutat/gespa.webp' : h < 950 ? 'img/ciutat/parc-infantil.webp' : 'img/ciutat/parc.webp';
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
  // carrer més proper a la casella (amb la població si no és Matadepera)
  let millor = null, dist = Infinity;
  for (const [dir, at, des, fins, nom, poble] of CARRERS) {
    const [al, llarg] = dir === 'h' ? [Y, X] : [X, Y];
    if (llarg < des - 1 || llarg > fins + 1) continue;
    const d = Math.abs(al - at);
    if (d < dist) { dist = d; millor = poble && poble !== 'Matadepera' ? `${nom} (${poble})` : nom; }
  }
  return millor || 'Carretera';
};

// Vehicles i persones (img/animacions). Els cotxes surten més sovint que els camions.
const VEHICLES = ['cotxe-1', 'cotxe-vermell', 'cotxe-blau', 'cotxe-groc', 'cotxe-blanc', 'cotxe-verd', 'cotxe-taronja', 'cotxe-gris',
  'cotxe-blau2', 'cabrio-vermell', 'cabrio-blau', 'familiar-beix', 'familiar-verd', 'furgoneta', 'furgoneta', 'camio', 'autobus', 'bici', 'bici', 'moto'];
// Mides pensades perquè una parcel·la (236 px) faci uns 20 metres: un cotxe de 4,5 m fa uns 55 px
const AMPLADA_VEHICLE = { autobus: 105, camio: 85, furgoneta: 68, bici: 30, moto: 34 };
const NUM_PERSONES = 21;
// Una persona (~1,7 m) al costat d'una casa de dues plantes (~7 m): uns 22 px d'alçada
const MIDA_PERSONA = { w: 15, h: 22 };

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
    if (!im) {
      im = new Image();
      im.onload = () => { mesurar(im); demana(); };
      im.src = `${src}?v=${VERSIO_IMATGES}`;
      imatges.set(src, im);
    }
    return im.complete && im.naturalWidth && im._caixa ? im : null;
  }
  // Mesura on és el terra (la base de rajola) de cada imatge.
  // Les il·lustracions no tenen totes la mateixa perspectiva: n'hi ha amb el terra més alt
  // que un rombe 2:1, i n'hi ha de lleugerament girades (la punta de baix no és al mig).
  // Busquem les tres cantonades de baix de la base (esquerra, punta, dreta) ajustant una
  // recta a cada costat del contorn inferior, i després deformem la imatge (transformació
  // afí) perquè aquestes cantonades caiguin exactament sobre les de la parcel·la.
  function mesurar(im) {
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(im, 0, 0);
    const W0 = c.width, H0 = c.height;
    let dades;
    try { dades = g.getImageData(0, 0, W0, H0).data; } catch { im._caixa = { x0: 0, x1: W0, y1: H0 }; return; }
    // punt opac més baix de cada columna
    const baix = new Int32Array(W0).fill(-1);
    let x0 = W0, x1 = -1, y1 = 0;
    for (let x = 0; x < W0; x++) {
      for (let y = H0 - 1; y >= 0; y--) if (dades[(y * W0 + x) * 4 + 3] > 40) { baix[x] = y; break; }
      if (baix[x] >= 0) { if (x < x0) x0 = x; x1 = x; if (baix[x] > y1) y1 = baix[x]; }
    }
    if (x1 <= x0) { im._caixa = { x0: 0, x1: W0, y1: H0 }; return; }
    im._caixa = { x0, x1, y1 };   // per si no trobem una base clara
    // punta aproximada: la columna més baixa (mitjana de les que hi arriben)
    let sx = 0, n = 0;
    for (let x = x0; x <= x1; x++) if (baix[x] >= y1 - 2) { sx += x; n++; }
    const xp = sx / n;
    // recta per mínims quadrats, descartant punts que se n'allunyen (arbres, ombres...)
    const recta = (xa, xb) => {
      let pts = [];
      for (let x = Math.round(xa); x <= xb; x++) if (baix[x] >= 0) pts.push([x, baix[x]]);
      let m = 0, q = 0;
      for (let it = 0; it < 4 && pts.length > 5; it++) {
        let Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
        for (const [x, y] of pts) { Sx += x; Sy += y; Sxx += x * x; Sxy += x * y; }
        const k = pts.length; m = (k * Sxy - Sx * Sy) / (k * Sxx - Sx * Sx); q = (Sy - m * Sx) / k;
        const tol = Math.max(2, (x1 - x0) * 0.008);
        pts = pts.filter(([x, y]) => Math.abs(y - (m * x + q)) < tol * (it < 2 ? 3 : 1.5));
      }
      return pts.length > 5 ? { m, q } : null;
    };
    const esq = recta(x0 + (xp - x0) * 0.15, x0 + (xp - x0) * 0.8);
    const dre = recta(xp + (x1 - xp) * 0.2, xp + (x1 - xp) * 0.85);
    if (!esq || !dre) return;
    // pendents raonables per a una base isomètrica
    if (!(esq.m > 0.15 && esq.m < 1.8 && dre.m < -0.15 && dre.m > -1.8)) return;
    const tx = (dre.q - esq.q) / (esq.m - dre.m), ty = esq.m * tx + esq.q;
    if (tx < x0 + (x1 - x0) * 0.1 || tx > x1 - (x1 - x0) * 0.1) return;
    im._base = {
      E: [x0, esq.m * x0 + esq.q],   // cantonada esquerra
      P: [tx, ty],                   // punta de baix
      D: [x1, dre.m * x1 + dre.q],   // cantonada dreta
    };
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

  // Dibuixa una imatge isomètrica dins de la seva parcel·la:
  // s'escala perquè la part visible ocupi l'amplada del rombe, s'alinea a la punta de baix
  // i es retalla pels costats i per sota perquè no envaeixi els carrerons ni les veïnes.
  function sprite(src, X, Y, { mida = 1, marge = MARGE, base = '#8cbf45' } = {}) {
    const im = img(src);
    if (marge) { rombe(X, Y, mida, mida); ctx.fillStyle = COLORS.carrero; ctx.fill(); }
    const u = X + marge, v = Y + marge, t = mida - 2 * marge;
    if (base && !im) { rombe(u, v, t, t); ctx.fillStyle = base; ctx.fill(); }
    const a = iso(u, v), b = iso(u + t, v), c = iso(u + t, v + t), d = iso(u, v + t);
    if (marge) { ctx.strokeStyle = COLORS.vorada; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x, d.y + DZ); ctx.lineTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); ctx.stroke(); }
    if (im) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(d.x - 1, d.y + DZ); ctx.lineTo(c.x, c.y + DZ + 1); ctx.lineTo(b.x + 1, b.y + DZ); ctx.lineTo(b.x + 1, b.y - 1200); ctx.lineTo(d.x - 1, d.y - 1200);
      ctx.closePath(); ctx.clip();
      const bs = im._base;
      if (bs) {
        const E = bs.E, P = bs.P, D = bs.D;
        const f = (P[0] - E[0]) / (D[0] - E[0]);   // on cau la punta (0,5 = al mig)
        if (PLANES.test(src)) {
          // Superfícies planes (camp, gespa, solar, pistes, piscina): no hi ha res alt que es
          // pugui deformar, així que cada meitat s'ajusta exactament a la parcel·la.
          const kv = (b.x - d.x) / (D[0] - E[0]);
          for (const [Q, q, xa, xb] of [[D, b, c.x, b.x + 2], [E, d, d.x - 2, c.x + 1.5]]) {
            const mx = (q.x - c.x) / (Q[0] - P[0]);
            const sh = ((q.y - c.y) - kv * (Q[1] - P[1])) / (Q[0] - P[0]);
            ctx.save();
            ctx.beginPath(); ctx.rect(xa, c.y - 3000, xb - xa, 3100); ctx.clip();
            ctx.transform(mx, sh, 0, kv, c.x - mx * P[0], c.y + DZ - sh * P[0] - kv * P[1]);
            ctx.drawImage(im, 0, 0);
            ctx.restore();
          }
        } else {
          // Edificis i parcs: MAI es deformen. Només una escala horitzontal (k) i una vertical
          // (ky) molt semblant perquè el terra tingui la perspectiva 2:1. Si la il·lustració està
          // dibuixada des d'un altre angle, encaixa una mica pitjor però no s'estira.
          const k = (b.x - d.x) / (D[0] - E[0]);
          const pend = ((P[1] - E[1]) / (P[0] - E[0]) + (P[1] - D[1]) / (D[0] - P[0])) / 2;
          const ky = k * Math.max(0.7, Math.min(1.05, 0.5 / pend));
          const tx = (d.x + b.x) / 2 - k * (E[0] + D[0]) / 2;
          const ty = (d.y + b.y + c.y) / 3 + DZ - ky * (E[1] + D[1] + P[1]) / 3;
          ctx.transform(k, 0, 0, ky, tx, ty);
          ctx.drawImage(im, 0, 0);
        }
      } else {
        const cx = im._caixa;
        const k = (W * t) / (cx.x1 - cx.x0 + 1);
        const mig = (cx.x0 + cx.x1) / 2;
        ctx.drawImage(im, c.x - mig * k, c.y + DZ - cx.y1 * k, im.naturalWidth * k, im.naturalHeight * k);
      }
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
    // els locals que no són de cap alumne són comerços de la ciutat (les empreses de la classe tenen un parc)
    if (!l) {
      if (c.sub === 'solar') return 'img/locals/solar-en-venda.webp';
      if (c.sub === 'nau') return 'img/ciutat/nau-industrial.webp';
      const s = ['fleca', 'cafeteria', 'roba', 'bicis', 'floristeria', 'fruiteria', 'gelateria', 'informatica', 'llibreria', 'perruqueria', 'restaurant', 'gimnas'];
      const h = hash(c.X, c.Y);
      return imgNegoci(s[h % s.length], 1 + ((h >> 4) % 3));
    }
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
      costat: tipus === 'cotxe' ? 0.14 : (Math.random() < 0.5 ? 0.42 : -0.42),
      img: tipus === 'cotxe' ? vehicles[Math.floor(Math.random() * vehicles.length)] : `persona-${1 + Math.floor(Math.random() * NUM_PERSONES)}`,
      tipus, fade: 1,
    };
  }
  for (let i = 0; i < 40; i++) cotxes.push(nouAgent('cotxe'));
  for (let i = 0; i < 130; i++) vianants.push(nouAgent('persona'));

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
      const ample = AMPLADA_VEHICLE[a.img] || 56;
      const k = ample / fw;
      ctx.drawImage(im, dir * fw, 0, fw, fh, x - (fw * k) / 2, y + DZ - fh * k * 0.78, fw * k, fh * k);
    } else {
      const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4;
      const frame = Math.floor((performance.now() / 150 + a.X * 3) % 4);
      ctx.drawImage(im, frame * fw, dir * fh, fw, fh, x - MIDA_PERSONA.w / 2, y + DZ - MIDA_PERSONA.h + 1, MIDA_PERSONA.w, MIDA_PERSONA.h);
    }
    ctx.restore();
  }

  // Terreny d'un parc d'atraccions: gespa tancada i, si és d'algú, el seu parc en miniatura
  function dibuixaTerreny([id, X0, Y0, costat]) {
    const parc = locals[id];
    const vora = (u, v, mu, mv) => { const a = iso(u, v), b = iso(u + mu, v), c = iso(u + mu, v + mv), d = iso(u, v + mv);
      ctx.beginPath(); ctx.moveTo(a.x, a.y + DZ); ctx.lineTo(b.x, b.y + DZ); ctx.lineTo(c.x, c.y + DZ); ctx.lineTo(d.x, d.y + DZ); ctx.closePath(); };
    vora(X0 + 0.1, Y0 + 0.1, 6.8, 6.8);
    ctx.fillStyle = '#a8c86a'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = parc ? '#5a3d22' : '#c9b48a'; ctx.setLineDash(parc ? [] : [18, 12]); ctx.stroke(); ctx.setLineDash([]);
    if (!parc || escala < 0.12) return;
    const k = 7 / MIDA_TOTAL;   // l'espai màxim del parc (35x35 caselles) ocupa les 7x7 parcel·les del terreny
    // parcel·les que ja ha comprat
    ctx.fillStyle = '#8fd05a';
    for (const b of (parc.blocs || BLOCS_INICIALS.join(';')).split(';')) {
      if (!b) continue;
      const [bx, by] = b.split(',').map(Number);
      const [lx, ly] = giraObjecte(bx * BLOC, by * BLOC, BLOC, costat);
      vora(X0 + lx * k, Y0 + ly * k, BLOC * k, BLOC * k); ctx.fill();
    }
    // camins
    ctx.fillStyle = '#e6d6b4';
    for (const p of (parc.camins || '').split(';')) {
      if (!p) continue;
      const [px, py] = p.split(',').map(Number);
      const [lx, ly] = giraParc(px, py, costat);
      vora(X0 + lx * k, Y0 + ly * k, k, k); ctx.fill();
    }
    // objectes, de darrere cap endavant
    const objs = (parc.objectes || '').split(';').filter(Boolean).map((o) => {
      const [t, px, py, gir] = o.split(','); const m = OBJECTES[t]?.mida || 1;
      const [lx, ly] = giraObjecte(Number(px), Number(py), m, costat);
      return { t, lx, ly, m, gir: gir === '1' ? 1 : 0 };
    }).filter((o) => OBJECTES[o.t] && !OBJECTES[o.t].ressort).sort((a, b) => (a.lx + a.ly + a.m) - (b.lx + b.ly + b.m));
    for (const o of objs) {
      const im = imgParc(srcObjecte(o.t));
      if (!im) continue;
      const c = iso(X0 + (o.lx + o.m / 2) * k, Y0 + (o.ly + o.m / 2) * k);
      dibuixaObjecte(ctx, im, o.t, c.x, c.y + DZ, W * o.m * k, o.gir);
    }
  }
  // les imatges del parc no tenen base: no cal mesurar-les
  function imgParc(src) {
    let im = imatges.get(src);
    if (!im) { im = new Image(); im.onload = demana; im.src = `${src}?v=${VERSIO_IMATGES}`; imatges.set(src, im); }
    return im.complete && im.naturalWidth ? im : null;
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
      const u = a.X + 0.5 + a.dx * (a.t - 0.5) + (-a.dy) * a.costat, v = a.Y + 0.5 + a.dy * (a.t - 0.5) + a.dx * a.costat;
      const d = Math.floor(u) + Math.floor(v);
      if (!perDiag.has(d)) perDiag.set(d, []);
      perDiag.get(d).push(a);
    }
    const etiquetes = [];
    // Els edificis grans (2×2) es pinten al començament de la diagonal de la seva cel·la
    // de davant: així queden per sobre de tot el que tenen darrere i per sota de les
    // parcel·les que tenen davant (abans, una casa del costat es podia pintar més tard).
    const grans = new Map();
    for (const c of cel.values()) if (c.tipus === 'edifici' && c.mida > 1) {
      const dd = c.X + c.Y + c.mida;
      if (!grans.has(dd)) grans.set(dd, []);
      grans.get(dd).push(c);
    }
    // terrenys dels parcs d'atraccions (7x7): es pinten sencers d'una vegada, com els edificis grans
    for (const t of TERRENYS_PARC) {
      const dd = t[1] + t[2] + 7;
      if (!grans.has(dd)) grans.set(dd, []);
      grans.get(dd).push({ terreny: t });
    }
    for (let d = minX + minY; d <= maxX + maxY; d++) {
      for (const c of grans.get(d) || []) {
        if (c.terreny) {
          const [id, X0, Y0] = c.terreny;
          if (X0 + 7 < minX || X0 > maxX || Y0 + 7 < minY || Y0 > maxY) continue;
          dibuixaTerreny(c.terreny);
          etiquetes.push(['terreny', c.terreny, locals[id]]);
          continue;
        }
        if (c.X + c.mida < minX || c.X > maxX || c.Y + c.mida < minY || c.Y > maxY) continue;
        sprite(c.img, c.X, c.Y, { mida: c.mida });
        etiquetes.push(['edifici', c]);
      }
      for (let X = Math.max(minX, d - maxY); X <= Math.min(maxX, d - minY); X++) {
        const Y = d - X;
        const c = cel.get(clau(X, Y));
        if (!c) {
          // bosc del Parc Natural al nord i arbres pel camp
          const bosc = Y < 0 && Y > -9 && X > -14 && X < 30;
          if (escala > 0.2 && (bosc ? hash(X, Y) < 820 : hash(X, Y) < 110)) {
            sprite(['img/mapa/decor-arbres.webp', 'img/mapa/decor-arbres-2.webp', 'img/mapa/decor-arbres-3.webp'][hash(Y, X) % 3], X, Y, { marge: 0, base: '#8cbf45' });
          }
          continue;
        }
        if (c.tipus === 'carretera') { dibuixaCarretera(X, Y); continue; }
        if (c.tipus === 'terreny') continue;   // ja pintat sencer
        if (c.tipus === 'part') continue;
        if (c.tipus === 'edifici') {
          if (c.mida > 1) continue;   // ja pintat al començament de la diagonal
          sprite(c.img, c.X, c.Y, { mida: c.mida });
          etiquetes.push(['edifici', c]);
          continue;
        }
        if (c.tipus === 'local') {
          const l = locals[c.id];
          sprite(srcLocal(c), X, Y, { base: c.sub === 'solar' ? '#8cbf45' : '#c9c4b8' });
          etiquetes.push(['local', c, l]);
          continue;
        }
        if (c.tipus === 'decor') sprite(c.img, X, Y);
      }
      for (const a of perDiag.get(d) || []) dibuixaAgent(a);
    }

    // etiquetes
    const ms = Math.max(14, 14 / Math.max(escala, 0.35));
    for (const [tipus, c, l] of etiquetes) {
      if (tipus === 'terreny') {
        const [id, X0, Y0, , zona] = c;
        const { x, y } = iso(X0 + 3.5, Y0 + 3.5);
        if (l) pastilla(x, y + 60, `🎢 ${l.nom || 'Parc'}`, { fons: l.uid === jo ? '#f2891d' : '#ffffff', color: l.uid === jo ? '#fff' : '#0a3566', mida: ms * 1.1 });
        else if (escala >= 0.2) pastilla(x, y, `Terreny en venda · ${id}`, { fons: 'rgba(255,255,255,.92)', color: '#0a3566', mida: ms * 0.9 });
        if (objectiu === id) pastilla(x, y - 260 + Math.sin(performance.now() / 220) * 10, '▼ El teu parc', { fons: '#f2891d', color: '#fff', mida: ms * 1.15 });
        continue;
      }
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
      for (const [dir, at, des, fins, nom] of CARRERS) {
        // el nom es dibuixa a l'inici de cada carrer (i a la meitat si és llarg)
        // sempre a mig tram (X o Y = 4n+2), mai en una cruïlla, perquè no se superposin
        const posicions = fins - des > 20 ? [des + 2, 4 * Math.round((des + fins) / 8) + 2] : [des + 2];
        for (const q of posicions) {
          const X = dir === 'h' ? q : at, Y = dir === 'h' ? at : q;
          if (!carreteres.has(clau(X, Y))) continue;
          const p = iso(X + 0.5, Y + 0.5);
          ctx.save(); ctx.translate(p.x, p.y + DZ); ctx.transform(1, dir === 'h' ? 0.5 : -0.5, 0, 1, 0, 0);
          ctx.font = '700 15px "Nunito", system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.textAlign = dir === 'h' ? 'left' : 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(nom, 0, 0); ctx.restore();
        }
      }
      ctx.restore();
    }
    // rètols de zona quan es mira de lluny
    if (escala < 0.45) {
      const m = 18 / escala;
      const p1 = iso(10, -5); pastilla(p1.x, p1.y, 'Parc Natural de Sant Llorenç del Munt i l\'Obac', { fons: 'rgba(42,116,35,.92)', color: '#fff', mida: m });
      const p2 = iso(10.5, 8.5); pastilla(p2.x, p2.y - 200, 'MATADEPERA', { fons: '#0a3566', color: '#fff', mida: m * 1.3 });
      const p3 = iso(2, 32); pastilla(p3.x, p3.y - 200, 'TERRASSA', { fons: '#0a3566', color: '#fff', mida: m * 1.6 });
      const p4 = iso(42, 26); pastilla(p4.x, p4.y - 200, 'SABADELL', { fons: '#0a3566', color: '#fff', mida: m * 1.6 });
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
    const nova = Math.min(1.6, Math.max(0.04, escala * factor));
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
      if (l) return centrar(l.X + 0.5, l.Y + 0.5, Math.max(escala, 0.5));
      const t = TERRENYS_PARC.find((x) => x[0] === id);
      if (t) centrar(t[1] + 3.5, t[2] + 3.5, Math.max(escala, 0.3));
    },
    vistaPoble() { const r = canvas.getBoundingClientRect(); centrar(10.5, 8.5, r.width < 700 ? 0.32 : 0.45); },
    vistaTot() { const r = canvas.getBoundingClientRect(); centrar(18, 24, Math.min(0.4, Math.max(0.04, Math.min(r.width / (W * 64), r.height / (W * 36))))); },
  };
}
