// =============================================================
//  PARC D'ATRACCIONS: catàleg, terrenys i economia (fase 1)
//  Tot el que cal per ajustar el joc és aquí: preus, costos, atractiu...
// =============================================================

// El parc es compra per parcel·les de 7x7 caselles. Al principi en tens 3x3 (21x21 caselles) i
// en pots comprar més fins a 5x5 (35x35): una a l'esquerra, una a la dreta i dues cap al fons.
// El costat de davant (on hi ha l'entrada) dona a la carretera i no es pot ampliar.
export const MIDA_PARC = 21;                       // terreny inicial
export const BLOC = 7;                             // mida d'una parcel·la
export const LIMITS_BLOCS = { bx: [-1, 3], by: [-2, 2] };
export const MIDA_TOTAL = 35;                      // mida màxima (5 parcel·les)
export const ORIGEN = { x: 7, y: 14 };             // on queda la casella (0,0) dins de l'espai màxim
export const BLOCS_INICIALS = ['0,0', '1,0', '2,0', '0,1', '1,1', '2,1', '0,2', '1,2', '2,2'];
export const preuParcella = (comprades) => 8000 + 2000 * comprades;  // cada parcel·la nova és més cara

// Pàrquing: hi ha 15 places gratuïtes al carrer; si n'hi caben més, la gent ve en cotxe
export const PLACES_CARRER = 15;
export const PART_EN_COTXE = 0.75;                 // 3 de cada 4 visitants arriben en cotxe
export const PERSONES_PER_COTXE = 3;

// Muralla: es construeix sola al voltant de tot el parc (deixant lliure l'entrada)
export const COST_TRAM_MURALLA = 120;   // per cada costat de casella
export const COST_TORRE = 600;          // a cada cantonada
export const ATRACTIU_MURALLA = 2;
// Entrada del parc (2x2) al mig del costat de davant
export const ENTRADA = { x: 9, y: 19 };

// ---------- temps ----------
// El parc obre de 10:00 a 20:00 (600 minuts de joc). A velocitat 1, 1 minut de joc = 0,4 s reals:
// un dia dura 4 minuts reals.
export const MINUTS_DIA = 600;
export const SEGONS_PER_MINUT = 0.4;
export const HORA_OBERTURA = 10;
export const ULTIMA_ENTRADA = 420;   // a partir de les 17:00 ja no entra ningú

// ---------- diners ----------
export const PRESTEC_INICIAL = 150000;   // el banc finança el projecte
export const PREU_TERRENY = 40000;
export const INTERES_DIARI = 0.0004;     // ~15 % anual si fos diari tot l'any; aquí, 0,04 % per dia de joc
export const COST_CAMI = 30;
export const RETORN_ENDERROC = 0.5;      // en enderrocar recuperes el 50 %

// ---------- personal ----------
export const PERSONAL_PARC = {
  mecanic: { nom: 'Mecànic/a', plural: 'Mecànics', sou: 95, text: 'Revisa i repara les atraccions espatllades. Sense mecànics, les has de reparar tu (i és car).' },
  netejador: { nom: 'Netejador/a', plural: 'Netejadors', sou: 70, text: 'Recull la brossa dels camins. La brossa fa enfadar els visitants.' },
  animador: { nom: 'Animador/a', plural: 'Animadors', sou: 80, text: 'Disfressat de mascota, fa que els visitants estiguin més contents.' },
};

// ---------- catàleg ----------
// mida: caselles (1 = 1x1, 2 = 2x2). frac: quina part de l'amplada de la casella ocupa la imatge.
// atractiu: quanta gent porta l'atracció. emocio: quant la gaudeixen. preuJust: preu que els sembla raonable.
// manteniment: cost fix per dia obert. cost: el que et costa cada producte venut.
export const CATEGORIES = [
  ['atraccio', 'Atraccions', 'carrusel'],
  ['menjar', 'Menjar i begudes', 'gelats'],
  ['botiga', 'Botigues', 'botiga-records'],
  ['servei', 'Serveis', 'lavabos'],
  ['decoracio', 'Decoració', 'arbre'],
];

export const OBJECTES = {
  // entrades: la petita és la del principi; es pot millorar a la mitjana i a la gran (més atractiu)
  entrada: { nom: 'Entrada petita', cat: 'fix', img: 'entrada-petita', mida: 2, frac: 0.97, preu: 0, manteniment: 40, atractiu: 0 },
  'entrada-mitjana': { nom: 'Entrada del castell', cat: 'fix', img: 'entrada-mitjana', mida: 2, frac: 0.97, preu: 25000, manteniment: 80, atractiu: 1.5,
    text: 'Una porta amb torre. Fa el parc més vistós i hi ve més gent.' },
  'entrada-gran': { nom: 'Gran portal', cat: 'fix', img: 'entrada-gran', mida: 3, frac: 0.97, preu: 60000, manteniment: 150, atractiu: 4,
    text: 'L\'entrada d\'un gran parc: dues torres i quatre taquilles. Ocupa 3x3 caselles.' },

  carrusel: { nom: 'Carrusel de cavallets', cat: 'atraccio', img: 'carrusel', mida: 2, frac: 0.97, preu: 12000, manteniment: 120,
    capacitat: 16, durada: 4, atractiu: 3, emocio: 2, intensitat: 1, mareig: 1, preuJust: 3, text: 'Un clàssic per a tota la família. Tranquil i molt popular.' },
  tasses: { nom: 'Tasses giratòries', cat: 'atraccio', img: 'tasses', mida: 2, frac: 0.97, preu: 15000, manteniment: 150,
    capacitat: 12, durada: 3, atractiu: 4, emocio: 3, intensitat: 3, mareig: 5, preuJust: 3.5, text: 'Tasses que giren i giren. Més emoció que el carrusel.' },
  'cotxes-xoc': { nom: 'Cotxes de xoc', cat: 'atraccio', img: 'cotxes-xoc', mida: 2, frac: 0.97, preu: 22000, manteniment: 220,
    capacitat: 10, durada: 3, atractiu: 5, emocio: 4, intensitat: 3, mareig: 1, preuJust: 4, text: 'La preferida dels adolescents. Cara, però atrau molta gent.' },
  'llits-elastics': { nom: 'Llits elàstics', cat: 'atraccio', img: 'llits-elastics', mida: 1, frac: 0.97, preu: 6000, manteniment: 60,
    capacitat: 6, durada: 4, atractiu: 2, emocio: 2, intensitat: 2, mareig: 2, preuJust: 2, text: 'Barata i petita. Ideal per començar.' },
  // fase 2: atraccions més grans (les d'emoció 6 o més poden marejar: cal una infermeria)
  'sinia-petita': { nom: 'Sínia petita', cat: 'atraccio', img: 'sinia-petita', mida: 2, frac: 0.97, preu: 18000, manteniment: 160,
    capacitat: 16, durada: 5, atractiu: 4, emocio: 2, intensitat: 1, mareig: 1, preuJust: 3.5, text: 'Vistes boniques i cap ensurt. Agrada a tothom.' },
  'vaixell-pirata': { nom: 'Vaixell pirata', cat: 'atraccio', img: 'vaixell-pirata', mida: 2, frac: 0.97, preu: 26000, manteniment: 240,
    capacitat: 20, durada: 3, atractiu: 6, emocio: 5, intensitat: 5, mareig: 5, preuJust: 4.5, text: 'Es gronxa amunt i avall. Molta capacitat.' },
  'casa-terror': { nom: 'Casa del terror', cat: 'atraccio', img: 'casa-terror', mida: 2, frac: 0.97, preu: 30000, manteniment: 260,
    capacitat: 12, durada: 4, atractiu: 6, emocio: 5, intensitat: 3, mareig: 1, preuJust: 5, text: 'Fantasmes i crits. Els adolescents en fan cua.' },
  'torre-caiguda': { nom: 'Torre de caiguda', cat: 'atraccio', img: 'torre-caiguda', mida: 1, frac: 0.97, preu: 35000, manteniment: 320,
    capacitat: 12, durada: 2, atractiu: 7, emocio: 7, intensitat: 9, mareig: 4, preuJust: 5.5, text: 'Ocupa poc espai i és molt emocionant. Pot marejar.' },
  'sinia-gran': { nom: 'Sínia gran', cat: 'atraccio', img: 'sinia-gran', mida: 3, frac: 0.97, preu: 55000, manteniment: 450,
    capacitat: 40, durada: 6, atractiu: 8, emocio: 3, intensitat: 1, mareig: 1, preuJust: 5, text: 'Es veu des de lluny i hi caben 40 persones alhora.' },
  'muntanya-russa-petita': { nom: 'Muntanya russa familiar', cat: 'atraccio', img: 'muntanya-russa-petita', mida: 3, frac: 0.97, preu: 60000, manteniment: 500,
    capacitat: 20, durada: 3, atractiu: 9, emocio: 6, intensitat: 5, mareig: 3, preuJust: 6, text: 'La primera muntanya russa! Atrau molta gent. Pot marejar.' },
  'rius-rapids': { nom: 'Rius ràpids', cat: 'atraccio', img: 'rius-rapids', mida: 4, frac: 0.97, preu: 100000, manteniment: 850,
    capacitat: 24, durada: 5, atractiu: 12, emocio: 6, intensitat: 4, mareig: 2, preuJust: 7, text: 'Barques rodones entre cascades. Ideal a l\'estiu. Pot marejar.' },
  troncs: { nom: 'Troncs d\'aigua', cat: 'atraccio', img: 'troncs', mida: 4, frac: 0.97, preu: 110000, manteniment: 900,
    capacitat: 24, durada: 4, atractiu: 13, emocio: 7, intensitat: 5, mareig: 2, preuJust: 7.5, text: 'Una gran baixada i... xof! Pot marejar.' },
  'muntanya-russa-gegant': { nom: 'Muntanya russa gegant', cat: 'atraccio', img: 'muntanya-russa-gegant', mida: 4, frac: 0.97, preu: 140000, manteniment: 1100,
    capacitat: 28, durada: 3, atractiu: 16, emocio: 10, intensitat: 9, mareig: 6, preuJust: 9, text: 'L\'atracció estrella: loopings i velocitat. Molt cara i molt rendible. Mareja molt!' },

  gelats: { nom: 'Parada de gelats', cat: 'menjar', img: 'gelats', mida: 1, frac: 0.84, preu: 3000, manteniment: 50,
    cost: 0.9, preuJust: 3, efecte: { gana: 25, set: 25 }, text: 'Treu la gana i la set una mica. Cada gelat et costa 0,90 €.' },
  crispetes: { nom: 'Parada de crispetes', cat: 'menjar', img: 'crispetes', mida: 1, frac: 0.8, preu: 2500, manteniment: 40,
    cost: 0.5, preuJust: 2.5, efecte: { gana: 40, set: -10 }, text: 'Barates de fer, però donen set! Cada ració et costa 0,50 €.' },
  'hot-dogs': { nom: 'Parada de frankfurts', cat: 'menjar', img: 'hot-dogs', mida: 1, frac: 0.84, preu: 3500, manteniment: 60,
    cost: 1.4, preuJust: 4, efecte: { gana: 70 }, text: 'El que més treu la gana. Cada frankfurt et costa 1,40 €.' },
  begudes: { nom: 'Parada de begudes', cat: 'menjar', img: 'begudes', mida: 1, frac: 0.84, preu: 2500, manteniment: 40,
    cost: 0.4, preuJust: 2.5, efecte: { set: 75 }, text: 'Imprescindible si fa calor. Cada beguda et costa 0,40 €.' },

  // fase 3: restaurants temàtics (2x2). Treuen tota la gana, serveixen de pressa i agraden molt.
  'restaurant-mediterrani': { nom: 'Taverna mediterrània', cat: 'menjar', tema: 'mediterrani', img: 'restaurant-mediterrani', mida: 2, frac: 1, punta: 0.579,
    preu: 20000, manteniment: 180, cost: 4, preuJust: 12, efecte: { gana: 100, set: 60 }, rapid: true, satisfa: 8, text: 'Peix fresc i terrassa. Cada menú et costa 4 €.' },
  'restaurant-oest': { nom: 'Saloon del Far West', cat: 'menjar', tema: 'oest', img: 'restaurant-oest', mida: 2, frac: 1, punta: 0.551,
    preu: 20000, manteniment: 180, cost: 4, preuJust: 12, efecte: { gana: 100, set: 60 }, rapid: true, satisfa: 8, text: 'Costelles i limonada al desert. Cada menú et costa 4 €.' },
  'restaurant-pirates': { nom: 'Taverna pirata', cat: 'menjar', tema: 'pirates', img: 'restaurant-pirates', mida: 2, frac: 1, punta: 0.515,
    preu: 22000, manteniment: 190, cost: 4.5, preuJust: 13, efecte: { gana: 100, set: 60 }, rapid: true, satisfa: 9, text: 'Sobre l\'aigua, amb tresors i tot. Cada menú et costa 4,50 €.' },
  'restaurant-selva': { nom: 'Restaurant tiki', cat: 'menjar', tema: 'selva', img: 'restaurant-selva', mida: 2, frac: 1, punta: 0.573,
    preu: 22000, manteniment: 190, cost: 4.5, preuJust: 13, efecte: { gana: 100, set: 70 }, rapid: true, satisfa: 9, text: 'Fruita tropical i còctels sense alcohol. Cada menú et costa 4,50 €.' },
  'restaurant-medieval': { nom: 'Taverna medieval', cat: 'menjar', tema: 'medieval', img: 'restaurant-medieval', mida: 2, frac: 1, punta: 0.544,
    preu: 25000, manteniment: 210, cost: 5, preuJust: 14, efecte: { gana: 100, set: 60 }, rapid: true, satisfa: 10, text: 'Banquet de cavallers. Cada menú et costa 5 €.' },
  'restaurant-espai': { nom: 'Diner espacial', cat: 'menjar', tema: 'espai', img: 'restaurant-espai', mida: 2, frac: 1, punta: 0.549,
    preu: 25000, manteniment: 210, cost: 5, preuJust: 14, efecte: { gana: 100, set: 70 }, rapid: true, satisfa: 10, text: 'Hamburgueses galàctiques i neons. Cada menú et costa 5 €.' },

  globus: { nom: 'Parada de globus', cat: 'botiga', img: 'globus', mida: 1, frac: 0.86, preu: 2000, manteniment: 30,
    cost: 1, preuJust: 4, text: 'Un caprici: els visitants contents en compren. Cada globus et costa 1 €.' },
  'botiga-records': { nom: 'Botiga de records', cat: 'botiga', img: 'botiga-records', mida: 1, frac: 0.9, preu: 6000, manteniment: 60,
    cost: 4, preuJust: 10, text: 'Peluixos, gorres i tasses. Marge alt, però només hi compra qui s\'ho ha passat bé. Cada record et costa 4 €.' },

  parquing: { nom: 'Pàrquing', cat: 'servei', img: 'parquing', mida: 2, frac: 1, preu: 6000, manteniment: 30, places: 20, sensecami: true,
    text: '20 places per a cotxes. Sense pàrquing, només hi ha 15 places al carrer i molta gent no pot venir. Tu decideixes quant costa aparcar.' },
  'parquing-caseta': { nom: 'Caseta del pàrquing', cat: 'servei', img: 'parquing-caseta', mida: 1, frac: 0.82, preu: 2500, manteniment: 40, sensecami: true,
    text: 'Sense caseta, el pàrquing és gratis. Amb una caseta, cobres el preu que tu decideixis per cada cotxe (el manteniment inclou el sou del cobrador).' },
  'parada-bus': { nom: 'Parada d\'autobús', cat: 'servei', img: 'parada-bus', mida: 2, frac: 0.95, preu: 15000, manteniment: 120, sensecami: true,
    text: 'Una línia d\'autobús des de la ciutat: ve més gent i menys gent necessita aparcar.' },
  lavabos: { nom: 'Lavabos', cat: 'servei', img: 'lavabos', mida: 1, frac: 0.92, preu: 4000, manteniment: 45,
    text: 'Sense lavabos, els visitants s\'enfaden molt (i marxen).' },
  'primers-auxilis': { nom: 'Infermeria', cat: 'servei', img: 'primers-auxilis', mida: 1, frac: 0.9, preu: 8000, manteniment: 90,
    text: 'Si tens atraccions fortes, alguns visitants es maregen. Sense infermeria, marxen enfadats.' },
  caixer: { nom: 'Caixer automàtic', cat: 'servei', img: 'caixer', mida: 1, frac: 0.84, preu: 3000, manteniment: 25,
    text: 'Qui es queda sense diners en treu més i continua gastant. El banc et paga 0,50 € per cada ús.' },
  informacio: { nom: 'Punt d\'informació', cat: 'servei', img: 'informacio', mida: 1, frac: 0.8, preu: 2000, manteniment: 30,
    text: 'Els visitants s\'orienten millor i el parc té més bona fama.' },

  banc: { nom: 'Banc', cat: 'decoracio', img: 'banc', mida: 1, frac: 0.5, preu: 150, bellesa: 1, seient: true,
    text: 'Per descansar. Posa\'l al costat d\'un camí.' },
  paperera: { nom: 'Paperera', cat: 'decoracio', img: 'paperera', mida: 1, frac: 0.22, preu: 100, paperera: true,
    text: 'Si n\'hi ha a prop, la gent no llença brossa a terra.' },
  fanal: { nom: 'Fanal', cat: 'decoracio', img: 'fanal', mida: 1, frac: 0.22, preu: 200, bellesa: 1, text: 'Decora els camins.' },
  arbre: { nom: 'Arbre', cat: 'decoracio', img: 'arbre', mida: 1, frac: 0.78, preu: 250, bellesa: 2, text: 'Fa el parc més agradable.' },
  bardissa: { nom: 'Bardissa', cat: 'decoracio', img: 'bardissa', mida: 1, frac: 0.8, preu: 150, bellesa: 1, text: 'Per fer tanques verdes al voltant dels camins.' },
  estatua: { nom: 'Estàtua', cat: 'decoracio', img: 'estatua', mida: 1, frac: 0.84, preu: 1500, bellesa: 4, text: 'Decoració elegant.' },
  font: { nom: 'Font', cat: 'decoracio', img: 'font', mida: 1, frac: 0.9, preu: 2000, bellesa: 5, text: 'La decoració més bonica.' },
  flors: { nom: 'Parterre de flors', cat: 'decoracio', img: 'flors', mida: 1, frac: 0.82, preu: 300, bellesa: 3, text: 'La decoració que més agrada.' },
};
export const srcObjecte = (t) => `img/parc/${OBJECTES[t].img}.webp`;

// ---------- terrenys al mapa de la ciutat ----------
// [id, X, Y, costat de l'entrada, nom de la zona]. Cada terreny fa 7x7 parcel·les de la ciutat.
// costat: cap on mira l'entrada ('E' = +X, 'W' = -X, 'S' = +Y, 'N' = -Y), cap a la carretera.
export const TERRENYS_PARC = [
  ['P1', -27, 1, 'E', 'oest de Matadepera'],
  ['P2', -27, 9, 'E', 'oest de Matadepera'],
  ['P3', -27, 21, 'E', 'oest de Terrassa'],
  ['P4', -27, 33, 'E', 'oest de Terrassa'],
  ['P5', -11, 50, 'N', 'sud de Terrassa'],
  ['P6', 1, 50, 'N', 'sud de Terrassa'],
  ['P7', 13, 50, 'N', 'sud de Terrassa'],
  ['P8', 19, 37, 'N', 'entre Terrassa i Sabadell'],
  ['P9', 29, 46, 'N', 'sud de Sabadell'],
  ['P10', 41, 46, 'N', 'sud de Sabadell'],
  ['P11', 53, 46, 'N', 'sud de Sabadell'],
  ['P12', 63, 13, 'W', 'est de Sabadell'],
  ['P13', 63, 25, 'W', 'est de Sabadell'],
  ['P14', 63, 37, 'W', 'est de Sabadell'],
  ['P15', 33, -1, 'S', 'nord de Sabadell'],
  ['P16', 45, -1, 'S', 'nord de Sabadell'],
  ['P17', 53, -1, 'S', 'nord de Sabadell'],
];
export const terrenyPerId = (id) => TERRENYS_PARC.find((t) => t[0] === id);

// Passa una casella del parc (0..20) a la posició dins del terreny, girada perquè l'entrada
// (que dins del parc sempre és al costat +Y) miri cap a la carretera.
export function giraParc(px, py, costat) {
  const n = MIDA_TOTAL - 1;
  px += ORIGEN.x; py += ORIGEN.y;
  if (costat === 'S') return [px, py];
  if (costat === 'N') return [n - px, n - py];
  if (costat === 'E') return [py, n - px];
  return [n - py, px]; // 'W'
}
// Mateix gir per a un objecte de mida m: retorna la cantonada mínima del rectangle girat
export function giraObjecte(px, py, m, costat) {
  const a = giraParc(px, py, costat), b = giraParc(px + m - 1, py + m - 1, costat);
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1])];
}

// Dibuixa un objecte del parc: la imatge no té base; s'escala segons la fracció de l'amplada
// del rombe que ocupa i es recolza a terra al centre de la casella.
// (cx, cy) = centre del rombe a terra; amp = amplada del rombe a la pantalla.
// gir = 1: la imatge es dibuixa com en un mirall (l'objecte mira cap a l'altre costat).
export function dibuixaObjecte(ctx, im, t, cx, cy, amp, gir = 0) {
  const o = OBJECTES[t];
  const w = amp * o.frac;
  const h = w * (im.naturalHeight / im.naturalWidth);
  const baix = cy + (amp / 4) * o.frac;   // punt de davant de l'objecte
  const p = o.punta ?? 0.5;   // on cau la punta de davant dins de la imatge (0,5 = al mig)
  if (!gir) { ctx.drawImage(im, cx - w * p, baix - h, w, h); return; }
  ctx.save(); ctx.translate(cx, 0); ctx.scale(-1, 1);
  ctx.drawImage(im, -w * p, baix - h, w, h);
  ctx.restore();
}

// ---------- estat inicial del parc ----------
export function parcNou(terreny, nom) {
  return {
    versio: 1, terreny, nom,
    diners: PRESTEC_INICIAL - PREU_TERRENY, deute: PRESTEC_INICIAL,
    dia: 1, minut: 0,
    camins: [`${ENTRADA.x},${ENTRADA.y - 1}`, `${ENTRADA.x + 1},${ENTRADA.y - 1}`, `${ENTRADA.x},${ENTRADA.y - 2}`, `${ENTRADA.x + 1},${ENTRADA.y - 2}`],
    objectes: [{ id: 1, t: 'entrada', x: ENTRADA.x, y: ENTRADA.y }],
    seguentId: 2,
    preus: { entrada: 5, parquing: 3 },
    blocs: [...BLOCS_INICIALS],
    personal: { mecanic: 0, netejador: 0, animador: 0 },
    brossa: {},
    reputacio: 50,
    avui: null,
    historial: [],
    totals: { visitants: 0, ingressos: 0, despeses: PREU_TERRENY },
  };
}

// ---------- investigació (R+D) ----------
// Les atraccions grans no es poden construir fins que el departament d'investigació les ha dissenyat.
// Cada dia el parc genera punts segons el pressupost; quan n'hi ha prou, es desbloqueja la següent.
export const RECERCA_NIVELLS = {
  cap:    { nom: 'Cap', cost: 0, punts: 0 },
  baix:   { nom: 'Baix', cost: 300, punts: 1 },
  normal: { nom: 'Normal', cost: 800, punts: 3 },
  alt:    { nom: 'Alt', cost: 2000, punts: 6 },
};
export const RECERCA_ORDRE = [
  ['sinia-gran', 4], ['torre-caiguda', 5], ['muntanya-russa-petita', 7], ['restaurant-mediterrani', 3], ['restaurant-oest', 3],
  ['rius-rapids', 10], ['restaurant-pirates', 4], ['restaurant-selva', 4], ['troncs', 12], ['restaurant-medieval', 5],
  ['restaurant-espai', 5], ['entrada-gran', 6], ['muntanya-russa-gegant', 16],
];
export const PER_INVESTIGAR = new Set(RECERCA_ORDRE.map(([t]) => t));

// ---------- màrqueting ----------
export const CAMPANYES = {
  cartells: { nom: 'Cartells a la ciutat', ic: '🪧', costDia: 250, efecte: 0.12, text: 'Barat i discret: una mica més de gent.' },
  radio: { nom: 'Anuncis a la ràdio', ic: '📻', costDia: 800, efecte: 0.3, text: 'Arriba a tota la comarca.' },
  tele: { nom: 'Anunci a la televisió', ic: '📺', costDia: 2500, efecte: 0.6, text: 'Car, però ve molta més gent.' },
};

// Noms dels visitants (per quan en toques un)
export const NOMS_VISITANTS = ['Pau', 'Martina', 'Jan', 'Júlia', 'Marc', 'Laia', 'Pol', 'Aina', 'Arnau', 'Carla', 'Biel', 'Noa', 'Àlex', 'Ona', 'Nil', 'Emma',
  'Joan', 'Maria', 'Hugo', 'Sara', 'Oriol', 'Paula', 'Roc', 'Abril', 'Èric', 'Clàudia', 'Jordi', 'Núria', 'Iker', 'Mireia', 'Toni', 'Montse', 'Ferran', 'Rosa'];
