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
    // peces mòbils: plataforma buida + 6 cavalls que giren al voltant del pal (els del darrere queden tapats pel pal)
    // llums: posició de les bombetes (es detecten soles a la imatge) per fer pampallugues i, en un futur, el mode nit
    anim: { tipus: 'carrusel', base: 'carrusel-base', columna: 'carrusel-columna', davant: 'carrusel-davant',
      cavalls: ['carrusel-cavall-1', 'carrusel-cavall-2'], n: 6, centre: [381.4, 544.2], rx: 212.3, ry: 86.8, alcada: 231.6, velocitat: 0.8,
      llums: [[147.7, 245.8], [150.8, 249.2], [606.1, 251.3], [73.8, 252.8], [687.4, 252.7], [143.2, 264.0], [372.9, 265.9], [597.7, 265.3], [129.1, 264.2], [158.1, 265.7], [75.5, 271.9], [689.4, 273.3], [123.6, 276.2], [640.1, 277.3], [93.9, 276.7], [102.4, 280.1], [670.2, 278.7], [179.9, 282.4], [359.3, 278.8], [658.6, 281.5], [574.8, 286.0], [363.8, 282.2], [384.7, 286.0], [173.6, 290.5], [587.5, 293.0], [505.8, 294.9], [245.7, 293.6], [332.8, 295.9], [61.8, 295.7], [88.2, 297.1], [130.2, 293.7], [677.4, 298.2], [155.3, 299.6], [337.0, 307.3], [175.4, 310.3], [417.9, 307.7], [198.7, 308.3], [561.5, 311.0], [210.0, 308.7], [90.7, 315.2], [214.9, 313.9], [673.4, 316.2], [305.4, 317.5], [546.0, 316.9], [449.8, 318.1], [532.9, 317.1], [245.5, 317.2], [294.1, 317.8], [272.9, 318.5], [287.4, 323.4], [193.0, 323.2], [469.7, 325.8], [329.1, 330.2], [249.0, 327.8], [90.4, 339.4], [495.7, 340.7], [555.2, 339.0], [673.8, 340.3], [128.9, 360.8], [171.7, 359.2], [351.3, 359.2], [636.0, 362.0], [152.8, 369.2], [610.9, 372.1], [210.3, 374.3], [551.1, 375.1], [525.8, 375.6], [182.2, 381.4], [581.8, 384.0], [356.7, 382.6], [294.1, 387.9], [333.8, 385.6], [464.7, 389.4], [341.4, 402.0], [380.2, 402.8], [417.5, 402.7], [317.3, 414.5], [450.1, 413.0], [180.3, 416.2], [576.5, 417.0], [338.3, 429.7], [431.6, 429.5], [386.5, 432.1], [319.9, 436.3], [446.7, 436.1], [319.0, 458.7], [338.1, 459.5], [448.1, 460.2], [431.1, 459.6], [386.2, 463.7], [319.1, 485.0], [448.2, 485.2], [338.6, 493.9], [431.1, 494.9], [386.2, 500.7]] },
    capacitat: 32, durada: 8, atractiu: 3, emocio: 2, intensitat: 1, mareig: 1, preuJust: 3, text: 'Un clàssic per a tota la família. Tranquil i molt popular.' },
  tasses: { nom: 'Tasses giratòries', cat: 'atraccio', img: 'tasses', mida: 2, frac: 0.97, preu: 15000, manteniment: 150,
    // peces mòbils: plataforma amb la tetera + 6 tasses que donen voltes i giren sobre si mateixes
    anim: { tipus: 'tasses', base: 'tasses-base', tetera: 'tasses-tetera', davant: 'tasses-davant',
      tasses: ['tasses-tassa-1', 'tasses-tassa-2', 'tasses-tassa-3'], n: 6, centre: [384, 374.3], rx: 193.6, ry: 87.1, amplada: 148.4,
      velocitat: 0.9, girPropi: 3.2, llums: [[559.5, 11.0], [182.8, 11.3], [558.3, 81.8], [539.6, 100.3], [551.2, 96.4], [213.1, 102.0], [203.0, 99.3], [530.8, 106.8], [579.0, 109.1], [172.7, 109.7], [224.7, 106.8], [549.8, 108.7], [545.7, 111.7], [474.2, 119.9], [483.8, 123.7], [462.6, 121.7], [26.5, 122.1], [714.9, 122.3], [464.0, 129.1], [617.7, 142.7], [134.6, 143.2], [607.4, 141.4], [655.5, 165.6], [665.1, 169.6], [87.2, 170.3], [92.3, 180.0], [661.4, 180.3], [184.3, 210.7], [559.9, 210.6], [285.7, 221.0], [285.9, 227.5], [105.2, 229.2], [107.7, 234.1], [636.0, 234.2], [466.6, 238.7], [281.2, 239.4], [595.0, 238.8], [535.1, 251.3], [214.3, 252.2], [581.2, 262.5], [167.6, 263.5], [657.0, 271.1], [132.7, 282.5], [616.9, 282.5], [676.0, 285.9], [42.3, 291.4], [681.8, 291.1], [705.1, 292.0], [95.7, 303.2], [654.2, 303.0], [716.2, 307.4], [26.4, 307.7], [683.6, 328.3], [66.3, 329.4], [674.2, 345.1], [689.5, 360.5], [670.4, 373.6], [13.1, 382.0], [16.8, 386.3], [670.4, 405.2], [108.1, 403.9], [710.3, 409.3], [45.2, 425.4], [121.1, 428.1], [83.2, 445.4], [45.0, 449.3], [83.9, 452.7], [60.7, 463.7], [64.5, 466.9], [203.3, 481.6], [479.5, 479.2], [180.8, 492.4], [169.9, 495.9], [228.1, 490.4], [19.5, 498.1], [554.1, 495.1], [240.8, 494.1], [109.1, 494.7], [211.4, 497.9], [548.6, 501.8], [200.3, 502.5], [164.9, 502.0], [537.0, 510.4], [214.5, 510.5], [170.3, 503.8], [337.9, 510.5], [40.2, 520.5], [292.1, 515.5], [513.1, 514.6], [446.4, 515.7], [518.3, 518.8], [294.6, 521.5], [449.0, 521.7], [272.0, 530.4], [472.6, 531.8], [64.3, 540.7], [59.8, 538.8]] },
    capacitat: 24, durada: 7, atractiu: 4, emocio: 3, intensitat: 3, mareig: 5, preuJust: 3.5, text: 'Tasses que giren i giren. Més emoció que el carrusel.' },
  'cotxes-xoc': { nom: 'Cotxes de xoc', cat: 'atraccio', img: 'cotxes-xoc', mida: 2, frac: 0.97, preu: 22000, manteniment: 220,
    // peces mòbils: pista buida + 3 cotxes (de cara i d'esquena; el mirall dona les 4 direccions) que xoquen
    anim: { tipus: 'xoc', base: 'cotxes-xoc-base', davant: 'cotxes-xoc-davant', colors: ['vermell', 'blau', 'groc'],
      pista: [[263.2, 335.4], [690, 435.8], [57.5, 440.9]], amplada: 108, sostre: 150, velocitat: 0.32, llums: [[523.9, 165.5], [683.4, 170.0], [131.7, 170.8], [402.3, 174.8], [534.4, 171.0], [97.4, 174.1], [106.4, 181.8], [562.5, 186.2], [68.8, 197.8], [57.0, 203.0], [591.4, 202.3], [296.4, 205.8], [603.4, 208.4], [614.0, 213.8], [327.0, 214.2], [18.7, 216.5], [257.6, 212.3], [245.5, 217.1], [623.3, 218.5], [104.1, 234.6], [270.1, 232.1], [236.0, 233.5], [652.1, 232.5], [552.7, 233.5], [180.6, 235.9], [351.0, 237.4], [203.9, 242.5], [563.2, 241.2], [57.9, 245.8], [364.8, 244.5], [268.4, 247.6], [102.7, 252.3], [548.2, 250.8], [681.1, 250.9], [217.7, 250.3], [376.3, 251.4], [550.0, 255.2], [356.4, 258.9], [722.9, 257.3], [145.9, 263.0], [329.4, 260.6], [652.6, 262.6], [650.7, 265.1], [396.8, 265.8], [347.6, 268.4], [27.2, 267.2], [87.9, 268.4], [649.3, 270.2], [387.7, 278.6], [121.5, 275.6], [619.4, 275.6], [547.5, 298.8], [66.3, 282.6], [138.2, 282.6], [28.9, 286.1], [112.9, 291.3], [716.7, 298.9], [415.4, 301.9], [173.9, 302.4], [282.3, 303.6], [271.4, 303.3], [693.6, 310.2], [241.4, 306.1], [193.5, 307.6], [285.4, 312.9], [577.9, 314.4], [184.3, 321.2], [227.5, 322.3], [669.8, 322.1], [564.2, 322.4], [280.4, 328.5], [329.1, 325.6], [486.8, 339.2], [343.7, 331.8], [644.5, 335.5], [332.7, 344.5], [618.9, 349.8], [466.2, 351.4], [545.4, 354.2], [592.8, 364.6], [512.9, 369.9], [412.4, 369.0], [481.4, 376.2], [503.2, 384.3]] },
    capacitat: 6, durada: 4, atractiu: 5, emocio: 4, intensitat: 3, mareig: 1, preuJust: 4, text: 'La preferida dels adolescents. Cara, però atrau molta gent.' },
  'llits-elastics': { nom: 'Llits elàstics', cat: 'atraccio', img: 'llits-elastics', mida: 1, frac: 0.97, preu: 6000, manteniment: 60,
    capacitat: 6, durada: 4, atractiu: 2, emocio: 2, intensitat: 2, mareig: 2, preuJust: 2, text: 'Barata i petita. Ideal per començar.' },
  // fase 2: atraccions més grans (les d'emoció 6 o més poden marejar: cal una infermeria)
  'sinia-petita': { nom: 'Sínia petita', cat: 'atraccio', img: 'sinia-petita', mida: 2, frac: 0.97, preu: 18000, manteniment: 160,
    // peces mòbils: la base (potes i porta), la roda que gira i les cabines que hi pengen sempre dretes
    anim: { tipus: 'roda', base: 'sinia-petita-base', davant: 'sinia-petita-davant', roda: 'sinia-petita-roda', cabina: 'sinia-petita-cabina',
      hub: [392.5, -11], radi: 212, radiRoda: 278, cabines: 8, ampladaCabina: 84, inclinacio: 0.18, velocitat: 0.6 },
    capacitat: 32, durada: 10, atractiu: 4, emocio: 2, intensitat: 1, mareig: 1, preuJust: 3.5, text: 'Vistes boniques i cap ensurt. Agrada a tothom.' },
  'vaixell-pirata': { nom: 'Vaixell pirata', cat: 'atraccio', img: 'vaixell-pirata', mida: 2, frac: 0.97, preu: 26000, manteniment: 240,
    // peces mòbils: la base, la barca que es gronxa (penjada de l'eix) i la porta que queda per davant
    anim: { tipus: 'gronxa', base: 'vaixell-base', peca: 'vaixell-barca', davant: 'vaixell-base-davant', pivotBase: [408.5, 73.8], pivotPeca: [214, 71.7], angle: 32, periode: 1.7,
      // seients (en píxels de la imatge de la barca): s'hi asseuen els passatgers mentre funciona
      seients: [[150, 282], [200, 297], [250, 314], [300, 329], [180, 306], [230, 322], [280, 337], [326, 349]] },
    capacitat: 40, durada: 8, atractiu: 6, emocio: 5, intensitat: 5, mareig: 5, preuJust: 4.5, text: 'Es gronxa amunt i avall. Molta capacitat.' },
  'casa-terror': { nom: 'Casa del terror', cat: 'atraccio', img: 'casa-terror', mida: 2, frac: 0.97, preu: 30000, manteniment: 260,
    capacitat: 12, durada: 4, atractiu: 6, emocio: 5, intensitat: 3, mareig: 1, preuJust: 5, text: 'Fantasmes i crits. Els adolescents en fan cua.' },
  // ocupa 2x2 caselles (abans 1x1): així la porta i la taquilla tenen la mateixa mida que a les altres atraccions
  'torre-caiguda': { nom: 'Torre de caiguda', cat: 'atraccio', img: 'torre-caiguda', mida: 2, frac: 0.97, preu: 35000, manteniment: 320,
    // peces mòbils: torre + anell de cadires (meitat de darrere i meitat de davant) que puja i cau de cop
    anim: { tipus: 'torre', base: 'torre-base', columna: 'torre-columna', davant: 'torre-davant',
      anellDarrere: 'torre-cadires-darrere', anellDavant: 'torre-cadires-davant', eixX: 385.3, dalt: 285.9, baix: 575, amplada: 389.7, forat: [0.5075, 0.3855],
      seients: [[0.413, 0.36], [0.594, 0.36], [0.218, 0.3], [0.797, 0.3], [0.083, 0.2], [0.94, 0.21]], llums: [[429.7, 80.4], [316.9, 86.8], [405.6, 99.2], [488.6, 88.7], [429.7, 104.8], [288.0, 112.7], [301.9, 119.4], [304.8, 126.3], [325.6, 126.8], [427.3, 127.2], [281.8, 130.3], [366.4, 141.0], [284.7, 143.4], [484.6, 143.0], [314.9, 145.3], [313.2, 151.2], [469.8, 151.9], [296.8, 153.5], [348.0, 153.4], [449.3, 154.2], [377.8, 155.1], [325.5, 158.8], [432.5, 160.4], [313.7, 163.0], [408.3, 162.4], [449.1, 165.7], [408.7, 170.6], [349.6, 172.3], [378.2, 176.6], [342.2, 202.9], [427.4, 203.0], [356.1, 229.7], [342.1, 238.8], [427.0, 239.1], [313.2, 255.4], [327.1, 260.5], [341.2, 274.8], [427.8, 275.1], [368.0, 272.5], [379.1, 275.8], [355.9, 338.6], [342.0, 317.5], [427.2, 317.8], [329.9, 339.1], [341.9, 359.1], [427.0, 359.3], [329.9, 388.4], [355.7, 401.9], [341.9, 401.7], [427.1, 401.7], [356.0, 443.2], [342.0, 441.1], [427.3, 441.5], [329.9, 446.9], [355.7, 473.3], [341.9, 480.5], [426.8, 480.1], [329.9, 503.6], [355.7, 508.9], [342.1, 517.6], [427.0, 517.4], [314.4, 539.9], [326.5, 543.6], [341.3, 557.7], [428.2, 557.3], [355.4, 590.3], [308.5, 578.9], [342.3, 592.5], [427.1, 592.7]] },
    capacitat: 12, durada: 5, atractiu: 7, emocio: 7, intensitat: 9, mareig: 4, preuJust: 5.5, text: 'Ocupa poc espai i és molt emocionant. Pot marejar.' },
  'sinia-gran': { nom: 'Sínia gran', cat: 'atraccio', img: 'sinia-gran', mida: 3, frac: 0.97, preu: 55000, manteniment: 450,
    // peces mòbils: 12 cabines de vidre (la gent es veu a través del vidre)
    anim: { tipus: 'roda', base: 'sinia-gran-base', davant: 'sinia-gran-davant', roda: 'sinia-gran-roda', cabina: 'sinia-gran-cabina',
      hub: [523.4, 65.8], radi: 306, radiRoda: 329.1, cabines: 12, ampladaCabina: 95, inclinacio: 0.2, velocitat: 0.4, ganxo: 0.05, vidre: true },
    capacitat: 80, durada: 12, atractiu: 8, emocio: 3, intensitat: 1, mareig: 1, preuJust: 5, text: 'Es veu des de lluny i hi caben 80 persones alhora.' },
  'muntanya-russa-petita': { nom: 'Muntanya russa familiar', cat: 'atraccio', img: 'muntanya-russa-petita', mida: 3, frac: 0.97, preu: 60000, manteniment: 500,
    capacitat: 20, durada: 3, atractiu: 9, emocio: 6, intensitat: 5, mareig: 3, preuJust: 6, text: 'La primera muntanya russa! Atrau molta gent. Pot marejar.' },
  'rius-rapids': { nom: 'Rius ràpids', cat: 'atraccio', img: 'rius-rapids', mida: 4, frac: 0.97, preu: 100000, manteniment: 850,
    // peces mòbils: 4 barques rodones (vistes des de dalt) que baixen pel riu girant sobre si mateixes
    anim: { tipus: 'raiers', base: 'rius-rapids-base', davant: 'rius-rapids-davant', vehicle: 'rius-rapids-barca', barques: 4, diametre: 78,
      velocitats: { canal: 0.8, pujada: 0.35, cim: 0.5, baixada: 2.4, esquitx: 1.2 }, girs: { canal: 0.9, pujada: 0.2, cim: 0.5, baixada: 3.5, esquitx: 2.5 },
      cami: [[856.1, 266.8, "canal"], [744.4, 266.8, "canal"], [657.6, 248.1, "canal"], [558.3, 235.7, "canal"], [459.1, 241.9, "canal"], [347.4, 235.7, "canal"], [260.5, 254.3, "canal"], [248.1, 287.8, "canal"], [297.8, 320.1, "cim"], [317.6, 359.8, "baixada"], [297.8, 399.5, "esquitx"], [223.3, 419.4, "canal"], [161.3, 434.2, "canal"], [134.0, 469.0, "canal"], [186.1, 502.5, "canal"], [285.4, 521.1, "canal"], [409.4, 536.0, "canal"], [521.1, 552.1, "canal"], [620.4, 568.2, "canal"], [719.6, 573.2, "canal"], [806.5, 555.8, "canal"], [893.3, 521.1, "canal"], [940.5, 471.5, "canal"], [945.4, 403.2, "pujada"], [920.6, 349.9, "pujada"], [883.4, 307.7, "pujada"]], llums: [[809.0, 292.2], [631.7, 383.5], [981.4, 461.2], [41.3, 561.6], [20.6, 571.1], [60.9, 568.5], [247.8, 627.9], [609.6, 636.6], [961.0, 667.5], [935.0, 695.3], [584.9, 699.4], [828.2, 695.3], [256.7, 700.1], [396.3, 756.6], [475.9, 779.1], [646.1, 807.7], [683.1, 845.2], [745.4, 826.1]] },
    capacitat: 72, durada: 15, atractiu: 12, emocio: 6, intensitat: 4, mareig: 2, preuJust: 7, text: 'Barques rodones entre cascades. Ideal a l\'estiu. Pot marejar.' },
  troncs: { nom: 'Troncs d\'aigua', cat: 'atraccio', img: 'troncs', mida: 4, frac: 0.97, preu: 110000, manteniment: 900,
    // peces mòbils: 3 barques-tronc que recorren el canal (cadascuna al seu ritme) i esquitxen a baix de la caiguda
    anim: { tipus: 'barques', base: 'troncs-base', davant: 'troncs-davant', vehicle: 'troncs-tronc', barques: 3, llargada: 84,
      seients: [0.27, 0.56], velocitats: { canal: 0.9, pujada: 0.3, cim: 0.5, baixada: 2.6, esquitx: 1.2 },
      cami: [[208.1, 420.4, "canal"], [249.8, 412.1, "canal"], [333.0, 391.3, "canal"], [416.3, 366.3, "canal"], [482.9, 328.8, "pujada"], [532.8, 295.5, "pujada"], [574.4, 264.7, "pujada"], [607.7, 233.1, "pujada"], [636.9, 179.0, "pujada"], [666.0, 151.5, "cim"], [691.0, 195.6, "baixada"], [724.3, 266.4, "baixada"], [761.8, 349.7, "baixada"], [799.2, 432.9, "baixada"], [832.5, 507.8, "baixada"], [850.8, 546.1, "esquitx"], [890.8, 559.5, "canal"], [940.7, 572.8, "canal"], [969.9, 586.9, "canal"], [957.4, 601.1, "canal"], [899.1, 597.7, "canal"], [832.5, 592.8, "canal"], [749.3, 584.4, "canal"], [666.0, 574.4, "canal"], [582.8, 564.4, "canal"], [516.2, 557.8, "canal"], [449.6, 552.8, "canal"], [383.0, 539.5, "canal"], [316.4, 519.5, "canal"], [249.8, 497.8, "canal"], [199.8, 482.9, "canal"], [158.2, 466.2, "canal"], [131.5, 441.2, "canal"], [148.2, 416.3, "canal"], [179.0, 411.3, "canal"]] },
    capacitat: 72, durada: 12, atractiu: 13, emocio: 7, intensitat: 5, mareig: 2, preuJust: 7.5, text: 'Una gran baixada i... xof! Pot marejar.' },
  'muntanya-russa-gegant': { nom: 'Muntanya russa gegant', cat: 'atraccio', img: 'muntanya-russa-gegant', mida: 4, frac: 0.97, preu: 140000, manteniment: 1100,
    // peces mòbils: la muntanya russa sense tren + un tren (locomotora i 4 vagons) que recorre el traçat de la via.
    // cami: punts de la via (en píxels de la imatge base) i el tipus de tram, que en marca la velocitat.
    anim: { tipus: 'tren', base: 'muntanya-russa-gegant-base', davant: 'muntanya-russa-gegant-davant',
      loco: 'muntanya-russa-gegant-locomotora', vago: 'muntanya-russa-gegant-vago', vagons: 4, llargada: 72, espai: 4,
      velocitats: { estacio: 0.5, pla: 1, pujada: 0.3, cim: 0.6, baixada: 2.4, loop: 2, corba: 1.4 },
      cami: [[679.4, 654.5, "estacio"], [579.9, 631.3, "estacio"], [480.5, 608.9, "estacio"], [372.8, 584.1, "estacio"], [314.8, 579.9, "pla"], [240.3, 591.5, "pla"], [165.7, 598.2, "pla"], [107.7, 594.8, "pla"], [82.8, 571.7, "pla"], [91.1, 538.5, "pujada"], [97.8, 505.4, "pujada"], [136.7, 406.0, "pujada"], [175.6, 302.4, "pujada"], [213.7, 198.8, "pujada"], [248.5, 103.6, "pujada"], [271.7, 64.6, "pujada"], [299.9, 49.7, "cim"], [338.0, 54.7, "cim"], [372.8, 76.2, "cim"], [412.6, 114.3, "baixada"], [449.9, 172.3, "baixada"], [483.0, 246.9, "baixada"], [516.1, 323.1, "baixada"], [549.3, 396.0, "baixada"], [578.3, 454.0, "baixada"], [598.2, 484.7, "baixada"], [639.1, 473.6, "loop"], [667.9, 442.5, "loop"], [683.9, 397.7, "loop"], [683.9, 347.9, "loop"], [667.9, 303.1, "loop"], [639.1, 272.0, "loop"], [603.1, 261.0, "loop"], [567.2, 272.0, "loop"], [538.4, 303.1, "loop"], [522.4, 347.9, "loop"], [522.4, 397.7, "loop"], [538.4, 442.5, "loop"], [567.2, 473.6, "loop"], [603.1, 484.7, "loop"], [654.5, 507.0, "pla"], [720.8, 530.2, "pla"], [787.1, 540.2, "pla"], [844.2, 524.6, "loop"], [883.4, 480.9, "loop"], [905.2, 417.8, "loop"], [905.2, 347.7, "loop"], [883.4, 284.6, "loop"], [844.2, 240.9, "loop"], [795.3, 225.3, "loop"], [746.5, 240.9, "loop"], [707.2, 284.6, "loop"], [685.5, 347.7, "loop"], [685.5, 417.8, "loop"], [707.2, 480.9, "loop"], [746.5, 524.6, "loop"], [795.3, 540.2, "loop"], [869.9, 531.9, "corba"], [936.2, 507.0, "corba"], [987.5, 530.2, "corba"], [1009.1, 594.8, "corba"], [995.8, 661.1, "corba"], [946.1, 710.8, "corba"], [869.9, 735.7, "corba"], [795.3, 732.4, "corba"], [729.1, 702.6, "corba"]] },
    capacitat: 90, durada: 10, atractiu: 16, emocio: 10, intensitat: 9, mareig: 6, preuJust: 9, text: 'L\'atracció estrella: loopings i velocitat. Molt cara i molt rendible. Mareja molt!' },

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
