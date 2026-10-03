// Lògica del joc. Totes les funcions reben l'estat de l'empresa i el modifiquen.
// Si una acció no es pot fer, llancen un Error amb el missatge per a l'alumne.
import {
  EDIFICIS, RECURSOS, VELOCITAT, DINERS_INICIALS, MIDA_MAPA, PARCELES_OBERTES,
  PARCELA_SEU, COST_PARCELA_BASE, MAX_PER_ORDRE, tempsConstruccio,
} from './dades.js';

export function estatInicial(nom, logo) {
  const parceles = [];
  for (let i = 0; i < MIDA_MAPA * MIDA_MAPA; i++) {
    parceles.push({ estat: PARCELES_OBERTES.includes(i) ? 'buida' : 'bloquejada' });
  }
  parceles[PARCELA_SEU] = { estat: 'edifici', tipus: 'seu-central' };
  return {
    nom, logo,
    diners: DINERS_INICIALS,
    parceles,
    inventari: {},
    parcelesComprades: 0,
    tutorialVist: false,
    creada: Date.now(),
  };
}

// Converteix les obres acabades en edificis. Retorna true si ha canviat res.
export function actualitzar(e, ara = Date.now()) {
  let canvi = false;
  for (const p of e.parceles) {
    if (p.estat === 'obres' && p.fiObres <= ara) {
      p.estat = 'edifici';
      delete p.fiObres;
      canvi = true;
    }
  }
  return canvi;
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

export const quantitatA = (e, recurs) => e.inventari[recurs] || 0;

// Quantes unitats es poden produir amb el que hi ha al magatzem
export function maxProduible(e, opcio) {
  let max = MAX_PER_ORDRE;
  for (const [r, q] of Object.entries(opcio.entrades)) {
    max = Math.min(max, Math.floor(quantitatA(e, r) / q));
  }
  return Math.max(0, max);
}

export const segonsProduccio = (opcio, quantitat) => (opcio.temps * quantitat) / VELOCITAT;

export function iniciarProduccio(e, i, recurs, quantitat, ara = Date.now()) {
  const p = e.parceles[i];
  if (p.estat !== 'edifici') throw new Error('Aquest edifici no està a punt.');
  if (p.produccio) throw new Error('Aquest edifici ja està produint.');
  const opcio = EDIFICIS[p.tipus].produeix.find((o) => o.recurs === recurs);
  if (!opcio) throw new Error('Aquest edifici no fa aquest producte.');
  quantitat = Math.floor(quantitat);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  if (quantitat > maxProduible(e, opcio)) throw new Error('No tens prou material al magatzem.');
  for (const [r, q] of Object.entries(opcio.entrades)) {
    e.inventari[r] = quantitatA(e, r) - q * quantitat;
  }
  p.produccio = { recurs, quantitat, inici: ara, fi: ara + segonsProduccio(opcio, quantitat) * 1000 };
}

export function recollir(e, i, ara = Date.now()) {
  const p = e.parceles[i];
  if (!p.produccio) throw new Error('No hi ha res per recollir.');
  if (p.produccio.fi > ara) throw new Error('La producció encara no ha acabat.');
  const { recurs, quantitat } = p.produccio;
  e.inventari[recurs] = quantitatA(e, recurs) + quantitat;
  delete p.produccio;
  return { recurs, quantitat };
}

export function vendre(e, recurs, quantitat) {
  quantitat = Math.floor(quantitat);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  if (quantitat > quantitatA(e, recurs)) throw new Error('No en tens tantes unitats.');
  const ingres = quantitat * RECURSOS[recurs].preu;
  e.inventari[recurs] -= quantitat;
  if (e.inventari[recurs] === 0) delete e.inventari[recurs];
  e.diners += ingres;
  return ingres;
}

// Valor total de l'empresa: diners + estoc + edificis (per a la classificació)
export function valorEmpresa(e) {
  let v = e.diners;
  for (const [r, q] of Object.entries(e.inventari)) v += q * (RECURSOS[r]?.preu || 0);
  for (const p of e.parceles) if (p.tipus) v += EDIFICIS[p.tipus]?.cost || 0;
  return Math.round(v);
}

const fmt = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });
export const diners = (n) => `${fmt.format(n)} €`;
export const nombre = (n) => fmt.format(n);

export function temps(segons) {
  segons = Math.max(0, Math.ceil(segons));
  const h = Math.floor(segons / 3600), m = Math.floor((segons % 3600) / 60), s = segons % 60;
  if (h) return `${h} h ${m} min`;
  if (m) return s ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}
