import {
  EDIFICIS, RECURSOS, MIDA_MAPA, BLOC, COST_CARRETERA, NUM_LOGOS, MAX_PER_ORDRE, NIVELL_MAX,
  COMISSIO_BORSA, CATEGORIES, DESBLOQUEIG, BANC, HISTORIAL_MINUTS, XAT_ACTIU,
  imgEdifici, imgRecurs, imgLogo, tempsConstruccio, preuReferencia,
} from './dades.js';
import * as joc from './joc.js';
import * as desa from './desa.js';

// ---------- utilitats ----------
const $ = (s) => document.querySelector(s);

// Crea elements sense innerHTML (els noms d'empresa els escriu l'alumnat)
function h(tag, attrs = {}, ...fills) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const f of fills.flat()) if (f != null && f !== false) el.append(f.nodeType ? f : String(f));
  return el;
}

function avis(text, tipus = 'info') {
  const el = h('div', { class: `avis avis-${tipus}` }, text);
  $('#avisos').append(el);
  setTimeout(() => el.classList.add('fora'), 3200);
  setTimeout(() => el.remove(), 3700);
}

function mostrarPantalla(id) {
  for (const p of document.querySelectorAll('.pantalla')) p.hidden = p.id !== id;
  $('#carregant').hidden = true;
}

// ---------- estat ----------
let usuari = null;
let estat = null;

async function desar() {
  try { await desa.desarEmpresa(usuari.uid, estat); }
  catch (err) { console.error(err); avis('No s\'ha pogut desar. Revisa la connexió.', 'error'); }
}

// Executa una acció del joc, mostra l'error si n'hi ha, desa i redibuixa
function accio(fn) {
  try {
    const r = fn();
    desar();
    dibuixarTot();
    return r;
  } catch (err) {
    avis(err.message, 'error');
    return undefined;
  }
}

// ---------- arrencada ----------
if (desa.modeProva) {
  $('#avis-prova').hidden = false;
  $('#btn-entrar').textContent = 'Prova el joc';
}
$('#btn-entrar').addEventListener('click', async () => {
  try { await desa.entrar(); }
  catch (err) { avis(`No s'ha pogut entrar: ${err.message}`, 'error'); }
});

desa.escoltarSessio(async (u) => {
  usuari = u;
  if (!u) { mostrarPantalla('pantalla-inici'); return; }
  try {
    estat = await desa.carregarEmpresa(u.uid);
  } catch (err) {
    console.error(err);
    avis('No s\'han pogut carregar les dades.', 'error');
    mostrarPantalla('pantalla-inici');
    return;
  }
  if (!estat) { prepararCreacio(); mostrarPantalla('pantalla-crear'); return; }
  iniciarJoc();
}).catch((err) => {
  console.error(err);
  avis('No s\'ha pogut connectar amb Firebase. Revisa js/firebase-config.js.', 'error');
  mostrarPantalla('pantalla-inici');
});

// ---------- creació de l'empresa ----------
function prepararCreacio() {
  const graella = $('#graella-logos');
  graella.replaceChildren();
  for (let n = 1; n <= NUM_LOGOS; n++) {
    graella.append(h('label', { class: 'logo-opcio' },
      h('input', { type: 'radio', name: 'logo', value: n, checked: n === 1 }),
      h('img', { src: imgLogo(n), alt: `Logo ${n}`, width: 64, height: 64 })));
  }
}

$('#form-crear').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const nom = $('#nom-empresa').value.trim();
  if (!nom) return;
  const logo = Number(new FormData(ev.target).get('logo')) || 1;
  estat = joc.estatInicial(nom, logo);
  await desar();
  iniciarJoc();
});

// ---------- joc ----------
let rellotge = null, rellotgeBorsa = null;

function iniciarJoc() {
  joc.migrar(estat);
  mostrarPantalla('pantalla-joc');
  if (joc.actualitzar(estat)) desar();
  construirMapa();
  dibuixarTot();
  centrarMapa();
  clearInterval(rellotge);
  rellotge = setInterval(tic, 1000);
  clearInterval(rellotgeBorsa);
  rellotgeBorsa = setInterval(cobrarBorsa, 60000);
  cobrarBorsa();
  iniciarXat();
  joc.aplicarInteressos(estat);
  if (joc.registrarHistorial(estat)) desar();
  if (!estat.tutorialVist) obrirGuia();
}

function tic() {
  joc.aplicarInteressos(estat);
  if (joc.registrarHistorial(estat)) desar();
  dibuixarCapcalera();
  const missatge = joc.actualitzar(estat);
  if (missatge) { desar(); dibuixarTot(); avis(missatge, 'ok'); return; }
  dibuixarMapa();
  refrescarPanell();
}

async function cobrarBorsa() {
  try {
    const total = await desa.cobrarVendes(usuari.uid, estat);
    if (total) { avis(`Has venut a la borsa: +${joc.diners(total)}`, 'ok'); dibuixarTot(); }
  } catch (err) { console.error(err); }
}

function dibuixarTot() {
  dibuixarCapcalera();
  $('#barra-logo').src = imgLogo(estat.logo);
  $('#barra-nom').textContent = estat.nom;
  $('#barra-diners').textContent = joc.diners(estat.diners);
  dibuixarMapa();
  refrescarPanell(true);
}

// Accions que parlen amb el servidor (borsa)
async function accioRemota(fn, missatgeOk) {
  try {
    const r = await fn();
    if (missatgeOk) avis(typeof missatgeOk === 'function' ? missatgeOk(r) : missatgeOk, 'ok');
    dibuixarTot();
    return r;
  } catch (err) {
    console.error(err);
    avis(err.code === 'permission-denied' ? 'Operació no permesa. Torna-ho a provar.' : err.message, 'error');
    return undefined;
  }
}

// ---------- mapa isomètric amb illes i carrers ----------
// El mapa és una quadrícula de caselles iguals. Cada BLOC x BLOC parcel·les hi ha una fila
// i una columna de carretera (imatges img/mapa/carretera-*.webp).
// Les imatges fan 256x256: el rombe superior fa 236 px d'ample i el seu centre és a y=175.
const IMG = 256, W = 236, CENTRE_Y = 175;
const PAS = BLOC + 1;                                // parcel·les d'una illa + 1 carretera
const NUM_ILLES = MIDA_MAPA / BLOC;
const CASELLES = NUM_ILLES * PAS + 1;                 // caselles per costat (amb carreteres)
const EXTENSIO = CASELLES;
const coord = (k) => k + Math.floor(k / BLOC) + 1;   // casella on va la parcel·la k
const iso = (u, v) => ({ x: (u - v) * W / 2, y: (u + v) * W / 4 });
const centreParcela = (i) => iso(coord(i % MIDA_MAPA) + 0.5, coord(Math.floor(i / MIDA_MAPA)) + 0.5);
const zIndex = (u, v) => Math.round((u + v) * 4) + 10;

const esCarreteraFixa = (R, C) => R % PAS === 0 || C % PAS === 0;
const indexParcela = (R, C) => (R - Math.floor(R / PAS) - 1) * MIDA_MAPA + (C - Math.floor(C / PAS) - 1);
function hiHaCarretera(R, C) {
  if (R < 0 || C < 0 || R >= CASELLES || C >= CASELLES) return false;
  if (esCarreteraFixa(R, C)) return true;
  return estat.parceles[indexParcela(R, C)]?.estat === 'carretera';
}
// Tria la peça segons les carreteres veïnes
function imatgeCarretera(R, C) {
  const llarg = hiHaCarretera(R, C - 1) || hiHaCarretera(R, C + 1);
  const ample = hiHaCarretera(R - 1, C) || hiHaCarretera(R + 1, C);
  if (llarg && ample) return 'img/mapa/carretera-creuament.webp';
  if (ample) return 'img/mapa/carretera-b.webp';
  return 'img/mapa/carretera-a.webp';
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

let escala = 0.75;
let despl = { x: 0, y: 0 };
const caselles = [];
const carreteresFixes = [];

function posarTile(mapa, R, C, src, classe) {
  const { x, y } = iso(C + 0.5, R + 0.5);
  const img = h('img', {
    class: classe, src, alt: '', draggable: 'false',
    style: `left:${x - IMG / 2}px;top:${y - CENTRE_Y}px;z-index:${zIndex(C + 0.5, R + 0.5)}`,
  });
  mapa.append(img);
  return img;
}

function construirMapa() {
  const mapa = $('#mapa');
  mapa.replaceChildren();
  caselles.length = 0;
  carreteresFixes.length = 0;
  // Bosc al voltant, alineat amb la quadrícula
  for (let k = -1; k <= CASELLES; k++) {
    for (const [R, C] of [[-1, k], [CASELLES, k], [k, -1], [k, CASELLES]]) {
      if ((R * 7 + C * 3) % 4 === 0) continue;
      posarTile(mapa, R, C, 'img/mapa/decor-arbres.webp', 'decor');
    }
  }
  // Carreteres fixes
  for (let R = 0; R < CASELLES; R++) for (let C = 0; C < CASELLES; C++) {
    if (esCarreteraFixa(R, C)) carreteresFixes.push({ R, C, img: posarTile(mapa, R, C, '', 'decor carretera') });
  }
  // Parcel·les
  for (let i = 0; i < MIDA_MAPA * MIDA_MAPA; i++) {
    const R = coord(Math.floor(i / MIDA_MAPA)), C = coord(i % MIDA_MAPA);
    const u = C + 0.5, v = R + 0.5;
    const { x, y } = iso(u, v);
    const img = h('img', { class: 'casella-img', alt: '', draggable: 'false' });
    const casella = h('div', { class: 'casella', style: `left:${x - IMG / 2}px;top:${y - CENTRE_Y}px;z-index:${zIndex(u, v)}` }, img);
    const zona = h('button', {
      class: 'zona', style: `left:${x - W / 2}px;top:${y - W / 4}px`,
      onclick: () => { if (!arrossegat) obrirParcela(i); },
    });
    const etiqueta = h('div', { class: 'etiqueta', style: `left:${x}px;top:${y - 30}px` });
    const rotul = h('div', { class: 'rotul', style: `left:${x}px;top:${y + 26}px` });
    mapa.append(casella, zona, etiqueta, rotul);
    caselles.push({ img, etiqueta, zona, casella, rotul, R, C });
  }
  aplicarTransformacio();
}

function imatgeParcela(p, i) {
  if (p.estat === 'carretera') { const { R, C } = caselles[i]; return imatgeCarretera(R, C); }
  if (p.estat === 'bloquejada') return 'img/mapa/parcela-bloquejada.webp';
  if (p.estat === 'buida') return 'img/mapa/parcela-buida.webp';
  if (p.estat === 'obres') return 'img/mapa/parcela-obres.webp';
  if (p.millora) return 'img/mapa/parcela-millora.webp';
  return imgEdifici(p.tipus);
}

function nomParcela(p) {
  if (p.estat === 'bloquejada') return 'Parcel·la per comprar';
  if (p.estat === 'buida') return 'Parcel·la lliure';
  if (p.estat === 'carretera') return 'Carretera';
  if (p.estat === 'obres') return `${EDIFICIS[p.tipus].nom} (en obres)`;
  return `${EDIFICIS[p.tipus].nom}, nivell ${p.nivell || 1}`;
}

function dibuixarMapa() {
  const ara = Date.now();
  for (const c of carreteresFixes) {
    const src = imatgeCarretera(c.R, c.C);
    if (c.img.getAttribute('src') !== src) c.img.src = src;
  }
  estat.parceles.forEach((p, i) => {
    const { img, etiqueta, zona, casella, rotul } = caselles[i];
    const src = imatgeParcela(p, i);
    if (img.getAttribute('src') !== src) img.src = src;
    zona.setAttribute('aria-label', nomParcela(p));
    const feina = p.produccio || p.venda;
    casella.classList.toggle('produint', !!p.produccio && p.produccio.fi > ara);
    casella.classList.toggle('bloquejada', p.estat === 'bloquejada');

    let contingut = null;
    if (p.estat === 'obres') {
      const total = tempsConstruccio(p.tipus) * 1000;
      contingut = barra(1 - (p.fiObres - ara) / total, joc.temps((p.fiObres - ara) / 1000));
    } else if (p.millora) {
      contingut = barra((ara - p.millora.inici) / (p.millora.fi - p.millora.inici), joc.temps((p.millora.fi - ara) / 1000));
    } else if (feina) {
      const icon = p.venda ? 'img/recursos/recurs-diners.webp' : imgRecurs(feina.recurs);
      contingut = feina.fi <= ara
        ? h('span', { class: 'recollir' }, h('img', { src: icon, alt: '' }), p.venda ? 'Cobra' : 'Recull')
        : barra((ara - feina.inici) / (feina.fi - feina.inici), joc.temps((feina.fi - ara) / 1000));
    }
    etiqueta.replaceChildren(...(contingut ? [contingut] : []));
    etiqueta.hidden = !contingut;

    const teRotul = p.estat === 'edifici' || p.estat === 'obres';
    rotul.hidden = !teRotul;
    if (teRotul) {
      const nom = p.tipus === 'seu-central' ? estat.nom : EDIFICIS[p.tipus].nom;
      const clau = `${nom}|${p.nivell}|${p.estat}`;
      if (rotul.dataset.clau !== clau) {
        rotul.dataset.clau = clau;
        const parts = [h('span', {}, nom)];
        if (p.estat === 'edifici' && p.tipus !== 'seu-central') parts.push(h('b', {}, `Nv ${p.nivell || 1}`));
        rotul.replaceChildren(...parts);
      }
    }
  });
  $('#barra-diners').textContent = joc.diners(estat.diners);
}

function barra(fraccio, text) {
  const pct = Math.max(0, Math.min(1, fraccio)) * 100;
  return h('span', { class: 'progres' },
    h('span', { class: 'progres-ple', style: `width:${pct}%` }),
    h('span', { class: 'progres-text' }, text));
}

// ---------- moure i fer zoom al mapa ----------
let arrossegat = false;
function aplicarTransformacio() {
  const mapa = $('#mapa');
  mapa.style.transform = `translate(${despl.x}px, ${despl.y}px) scale(${escala})`;
  // Amb el mapa allunyat només es veu el nivell; apropant-lo apareixen els noms
  mapa.classList.toggle('lluny', escala < 0.8);
  mapa.classList.toggle('molt-lluny', escala < 0.45);
}
function centrarMapa() {
  const v = $('#visor').getBoundingClientRect();
  const T = EXTENSIO;
  escala = Math.min(1, Math.min(v.width / (T * W * 1.05), (v.height - 120) / (T * W / 2 + 260)));
  let centre = iso(T / 2, T / 2);
  if (escala < 0.42) { escala = 0.42; centre = centreParcela(estat.parceles.findIndex((p) => p.tipus === 'seu-central')); }
  despl.x = v.width / 2 - centre.x * escala;
  despl.y = v.height / 2 + 30 - centre.y * escala;
  aplicarTransformacio();
}
function zoom(factor, cx, cy) {
  const v = $('#visor').getBoundingClientRect();
  cx ??= v.width / 2; cy ??= v.height / 2;
  const nova = Math.min(1.6, Math.max(0.2, escala * factor));
  despl.x = cx - (cx - despl.x) * (nova / escala);
  despl.y = cy - (cy - despl.y) * (nova / escala);
  escala = nova;
  aplicarTransformacio();
}
$('#zoom-mes').addEventListener('click', () => zoom(1.2));
$('#zoom-menys').addEventListener('click', () => zoom(1 / 1.2));
$('#visor').addEventListener('wheel', (ev) => {
  ev.preventDefault();
  const v = $('#visor').getBoundingClientRect();
  zoom(ev.deltaY < 0 ? 1.1 : 1 / 1.1, ev.clientX - v.left, ev.clientY - v.top);
}, { passive: false });

{
  let inici = null;
  const visor = $('#visor');
  visor.addEventListener('pointerdown', (ev) => {
    inici = { x: ev.clientX, y: ev.clientY, dx: despl.x, dy: despl.y };
    arrossegat = false;
  });
  window.addEventListener('pointermove', (ev) => {
    if (!inici) return;
    const mx = ev.clientX - inici.x, my = ev.clientY - inici.y;
    if (!arrossegat && Math.hypot(mx, my) < 6) return;
    arrossegat = true;
    visor.classList.add('arrossegant');
    despl.x = inici.dx + mx; despl.y = inici.dy + my;
    aplicarTransformacio();
  });
  window.addEventListener('pointerup', () => {
    inici = null;
    visor.classList.remove('arrossegant');
    setTimeout(() => { arrossegat = false; }, 0);
  });
}
window.addEventListener('resize', () => { if (estat) centrarMapa(); });

// ---------- panell lateral ----------
let panell = null; // { tipus, i, firma }

function obrirPanell(titol, contingut, info) {
  $('#panell-titol').textContent = titol;
  $('#panell-cos').replaceChildren(contingut);
  $('#panell').hidden = false;
  $('#panell').classList.toggle('ample', !!info.ample);
  if (info.tipus === 'parcela') marcarNav('mapa');
  panell = info;
}
function tancarPanell() { $('#panell').hidden = true; panell = null; marcarNav('mapa'); }
$('#panell-tancar').addEventListener('click', tancarPanell);
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') tancarPanell(); });

// La "firma" canvia quan cal redibuixar el panell sencer (no per cada segon)
function firmaParcela(i) {
  const p = estat.parceles[i];
  const feina = p.produccio || p.venda || p.millora;
  return JSON.stringify([p.estat, p.tipus, p.nivell, !!p.produccio, !!p.venda, !!p.millora, feina && feina.fi <= Date.now(), estat.diners, estat.inventari]);
}

function refrescarPanell(forcar = false) {
  if (!panell) return;
  if (panell.tipus === 'parcela') {
    if (forcar || firmaParcela(panell.i) !== panell.firma) { obrirParcela(panell.i); return; }
  } else if (forcar && panell.tipus === 'magatzem') { obrirMagatzem(); return; }
  else if (panell.tipus === 'empresa' && panell.pestanya === 'resum' && document.querySelector('#panell [data-fi]') &&
    Number(document.querySelector('#panell [data-fi]').dataset.fi) <= Date.now()) { obrirEmpresa('resum'); return; }
  // actualitza els comptes enrere
  for (const el of document.querySelectorAll('#panell [data-fi]')) {
    el.textContent = joc.temps((Number(el.dataset.fi) - Date.now()) / 1000);
  }
  for (const el of document.querySelectorAll('#panell [data-inici]')) {
    const ini = Number(el.dataset.inici), fi = Number(el.dataset.fiBarra);
    el.style.width = `${Math.min(100, ((Date.now() - ini) / (fi - ini)) * 100)}%`;
  }
}

function obrirParcela(i) {
  const p = estat.parceles[i];
  const info = { tipus: 'parcela', i, firma: firmaParcela(i) };
  if (p.estat === 'bloquejada') return obrirPanell('Parcel·la per comprar', panellBloquejada(i), info);
  if (p.estat === 'buida') return obrirPanell('Què hi vols construir?', panellConstruir(i), info);
  if (p.estat === 'carretera') return obrirPanell('Carretera', panellCarretera(i), info);
  if (p.estat === 'obres') return obrirPanell(EDIFICIS[p.tipus].nom, panellObres(p), info);
  if (p.tipus === 'seu-central') return obrirPanell(estat.nom, panellSeu(), info);
  return obrirPanell(`${EDIFICIS[p.tipus].nom}`, panellEdifici(i), info);
}

const icona = (recurs, mida = 28) => h('img', { src: imgRecurs(recurs), alt: RECURSOS[recurs].nom, title: RECURSOS[recurs].nom, width: mida, height: mida, class: 'icona' });

// Selector de quantitat amb botons − i +
function selectorQuantitat(valor, max, onCanvi, etiqueta = 'Quantitat') {
  const input = h('input', { type: 'number', min: 1, max: Math.max(1, max), value: valor, inputmode: 'numeric', 'aria-label': etiqueta });
  const fixa = (n) => { input.value = Math.max(1, Math.min(Math.max(1, max), n)); onCanvi(); };
  input.addEventListener('input', onCanvi);
  const cont = h('div', { class: 'selector' },
    h('button', { class: 'btn-pas', type: 'button', 'aria-label': 'Menys', onclick: () => fixa((Number(input.value) || 1) - 1) }, '−'),
    input,
    h('button', { class: 'btn-pas', type: 'button', 'aria-label': 'Més', onclick: () => fixa((Number(input.value) || 0) + 1) }, '+'),
    h('button', { class: 'btn-pas btn-max', type: 'button', onclick: () => fixa(max) }, 'Màx'));
  return { input, cont };
}

function panellBloquejada(i) {
  const cost = joc.costParcela(estat);
  return h('div', { class: 'bloc' },
    h('p', {}, 'Compra aquesta parcel·la per tenir més espai per construir. Cada parcel·la nova és més cara que l\'anterior.'),
    h('button', {
      class: 'btn btn-principal', disabled: estat.diners < cost,
      onclick: () => accio(() => { joc.desbloquejar(estat, i); avis('Parcel·la comprada!', 'ok'); }),
    }, `Compra-la per ${joc.diners(cost)}`),
    estat.diners < cost ? h('p', { class: 'nota' }, `Et falten ${joc.diners(cost - estat.diners)}.`) : null);
}

function panellConstruir(i) {
  const llista = h('ul', { class: 'llista-edificis' });
  llista.append(h('li', { class: 'fitxa-edifici' },
    h('img', { src: 'img/mapa/carretera-a.webp', alt: '', width: 96, height: 96, class: 'fitxa-img' }),
    h('div', { class: 'fitxa-info' }, h('strong', {}, 'Carretera'),
      h('span', { class: 'nota' }, 'S\'uneix sola amb les carreteres del costat. Es fa a l\'instant.')),
    h('button', {
      class: 'btn btn-principal', disabled: estat.diners < COST_CARRETERA,
      onclick: () => accio(() => { joc.construirCarretera(estat, i); tancarPanell(); }),
    }, joc.diners(COST_CARRETERA))));
  const tipus = Object.entries(EDIFICIS).filter(([, d]) => !d.inicial);
  tipus.sort((a, b) => (Number(!!a[1].aviat) - Number(!!b[1].aviat)) || (a[1].cost - b[1].cost));
  for (const [id, def] of tipus) {
    const potPagar = estat.diners >= def.cost;
    const fa = def.ven
      ? h('span', { class: 'fa' }, 'Ven ', ...def.ven.map((o) => icona(o.recurs, 22)))
      : h('span', { class: 'fa' }, 'Fa ', ...def.produeix.map((o) => icona(o.recurs, 22)));
    llista.append(h('li', { class: `fitxa-edifici${def.aviat ? ' aviat' : ''}` },
      h('img', { src: imgEdifici(id), alt: '', width: 96, height: 96, class: 'fitxa-img' }),
      h('div', { class: 'fitxa-info' },
        h('strong', {}, def.nom),
        def.aviat ? h('span', { class: 'nota' }, 'Properament') : fa,
        def.aviat ? null : h('span', { class: 'nota' }, `Obres: ${joc.temps(tempsConstruccio(id))}`)),
      def.aviat ? null : h('button', {
        class: 'btn btn-principal', disabled: !potPagar,
        onclick: () => accio(() => { joc.construir(estat, i, id); tancarPanell(); avis(`Comencen les obres: ${def.nom}`, 'ok'); }),
      }, joc.diners(def.cost))));
  }
  return llista;
}

function panellCarretera(i) {
  return h('div', { class: 'bloc' },
    h('img', { src: imatgeParcela(estat.parceles[i], i), alt: '', width: 160, height: 160, class: 'panell-img' }),
    h('p', {}, 'Aquest tros de carretera és teu. Pots treure\'l per tornar a tenir la parcel·la lliure (no es recuperen els diners).'),
    h('button', { class: 'btn', onclick: () => accio(() => { joc.treureCarretera(estat, i); tancarPanell(); }) }, 'Treu la carretera'));
}

function panellObres(p) {
  return h('div', { class: 'bloc' },
    h('img', { src: imgEdifici(p.tipus), alt: '', width: 160, height: 160, class: 'panell-img' }),
    h('p', {}, 'Les obres acaben d\'aquí a ', h('strong', { 'data-fi': p.fiObres }, joc.temps((p.fiObres - Date.now()) / 1000)), '.'));
}

function panellSeu() {
  const edificis = estat.parceles.filter((p) => p.estat === 'edifici' && p.tipus !== 'seu-central').length;
  return h('div', { class: 'bloc' },
    h('img', { src: imgLogo(estat.logo), alt: '', width: 96, height: 96, class: 'panell-logo' }),
    h('dl', { class: 'dades' },
      h('dt', {}, 'Diners'), h('dd', {}, joc.diners(estat.diners)),
      h('dt', {}, 'Valor de l\'empresa'), h('dd', {}, joc.diners(joc.valorEmpresa(estat))),
      h('dt', {}, 'Edificis'), h('dd', {}, joc.nombre(edificis))),
    h('button', { class: 'btn', onclick: obrirGuia }, 'Torna a veure el tutorial'));
}

function barraPanell(inici, fi) {
  return h('div', { class: 'progres gran' }, h('span', { class: 'progres-ple', 'data-inici': inici, 'data-fi-barra': fi, style: `width:${Math.min(100, ((Date.now() - inici) / (fi - inici)) * 100)}%` }));
}

function panellEdifici(i) {
  const p = estat.parceles[i];
  const def = EDIFICIS[p.tipus];
  const nivell = p.nivell || 1;
  const cos = h('div', { class: 'bloc' },
    h('div', { class: 'cap-edifici' },
      h('img', { src: imatgeParcela(p, i), alt: '', width: 140, height: 140, class: 'panell-img' }),
      h('span', { class: 'insignia-nivell' }, `Nivell ${nivell}`)));

  // Millorant
  if (p.millora) {
    cos.append(h('p', { class: 'resultat' }, `Millorant fins al nivell ${nivell + 1}`),
      barraPanell(p.millora.inici, p.millora.fi),
      h('p', {}, 'Falten ', h('strong', { 'data-fi': p.millora.fi }, joc.temps((p.millora.fi - Date.now()) / 1000)), '.'));
    return cos;
  }

  // Feina en marxa o acabada
  const feina = p.produccio || p.venda;
  if (feina) {
    const nom = RECURSOS[feina.recurs].nom;
    if (feina.fi <= Date.now()) {
      cos.append(
        p.venda
          ? h('p', { class: 'resultat' }, icona(feina.recurs, 40), `Venudes ${joc.nombre(feina.quantitat)} unitats de ${nom}: ${joc.diners(feina.quantitat * feina.preu)}`)
          : h('p', { class: 'resultat' }, icona(feina.recurs, 40), `${joc.nombre(feina.quantitat)} × ${nom} a punt!`),
        h('button', {
          class: 'btn btn-principal btn-gran',
          onclick: () => accio(() => {
            const r = joc.recollir(estat, i);
            avis(r.tipus === 'venda' ? `+${joc.diners(r.ingres)}` : `+${r.quantitat} ${RECURSOS[r.recurs].nom}`, 'ok');
          }),
        }, p.venda ? 'Cobra les vendes' : 'Recull i porta al magatzem'));
    } else {
      cos.append(
        h('p', { class: 'resultat' }, icona(feina.recurs, 40),
          p.venda ? `Venent ${joc.nombre(feina.quantitat)} × ${nom} a ${joc.diners(feina.preu)}` : `Produint ${joc.nombre(feina.quantitat)} × ${nom}`),
        barraPanell(feina.inici, feina.fi),
        h('p', {}, 'Falten ', h('strong', { 'data-fi': feina.fi }, joc.temps((feina.fi - Date.now()) / 1000)), '.'));
    }
    return cos;
  }

  if (def.ven) for (const opcio of def.ven) cos.append(opcioVenda(i, opcio, nivell));
  for (const opcio of def.produeix) cos.append(opcioProduccio(i, opcio, nivell));
  cos.append(seccioMillora(i));
  return cos;
}

function opcioProduccio(i, opcio, nivell) {
  const max = joc.maxProduible(estat, opcio);
  const entrades = Object.entries(opcio.entrades);
  const info = h('span', { class: 'nota' });
  const { input, cont } = selectorQuantitat(Math.min(10, Math.max(1, max)), max, () => {
    const q = Number(input.value) || 0;
    info.textContent = `Temps: ${joc.temps(joc.segonsProduccio(opcio, q, nivell))}. Sous: ${joc.diners(joc.souProduccio(opcio, q))}. Cost per unitat: ${joc.dinersDec(joc.costUnitariProduccio(estat, opcio))}.`;
  });
  input.dispatchEvent(new Event('input'));
  return h('div', { class: 'opcio' },
    h('div', { class: 'opcio-cap' }, icona(opcio.recurs, 44),
      h('div', {}, h('strong', {}, RECURSOS[opcio.recurs].nom),
        h('span', { class: 'nota' }, `L'escola en paga ${joc.diners(RECURSOS[opcio.recurs].preu)} la unitat`))),
    entrades.length
      ? h('p', { class: 'necessita' }, 'Per unitat cal: ', ...entrades.map(([r, q]) =>
        h('span', { class: `ingredient${joc.quantitatA(estat, r) < q ? ' falta' : ''}` }, icona(r, 22), `${q} (tens ${joc.nombre(joc.quantitatA(estat, r))})`)))
      : h('p', { class: 'necessita' }, 'No necessita cap material.'),
    h('div', { class: 'opcio-accio' }, cont,
      h('button', {
        class: 'btn btn-principal', disabled: max < 1,
        onclick: () => accio(() => { joc.iniciarProduccio(estat, i, opcio.recurs, Number(input.value)); tancarPanell(); }),
      }, 'Produeix')),
    info,
    max < 1 ? h('p', { class: 'nota falta' }, 'Et falta material: produeix-lo en un altre edifici o compra\'l a la borsa.') : null);
}

function opcioVenda(i, opcio, nivell) {
  const estoc = joc.quantitatA(estat, opcio.recurs);
  const ref = preuReferencia(opcio.recurs);
  const info = h('span', { class: 'nota' });
  const preu = h('input', { type: 'number', min: 1, value: ref, inputmode: 'numeric', 'aria-label': 'Preu per unitat', class: 'input-preu' });
  const { input, cont } = selectorQuantitat(Math.max(1, Math.min(estoc, 20)), estoc, () => calcula());
  function calcula() {
    const q = Number(input.value) || 0, pr = Number(preu.value) || 0;
    if (!q || !pr) { info.textContent = ''; return; }
    info.textContent = `Temps: ${joc.temps(joc.segonsVenda(opcio, q, pr, nivell))}. Ingressos: ${joc.diners(q * pr)}. Sous: ${joc.diners(joc.souVenda(opcio, q, pr))}.`;
  }
  preu.addEventListener('input', calcula);
  calcula();
  return h('div', { class: 'opcio' },
    h('div', { class: 'opcio-cap' }, icona(opcio.recurs, 44),
      h('div', {}, h('strong', {}, RECURSOS[opcio.recurs].nom),
        h('span', { class: 'nota' }, `Tens ${joc.nombre(estoc)} unitats. Preu habitual: ${joc.diners(ref)}`))),
    h('label', { class: 'fila-preu' }, 'Preu per unitat (€)', preu),
    h('div', { class: 'opcio-accio' }, cont,
      h('button', {
        class: 'btn btn-principal', disabled: estoc < 1,
        onclick: () => accio(() => { joc.iniciarVenda(estat, i, opcio.recurs, Number(input.value), Number(preu.value)); tancarPanell(); }),
      }, 'Posa a la venda')),
    info,
    estoc < 1 ? h('p', { class: 'nota' }, 'No en tens: produeix-ne o compra\'n a la borsa.') : null);
}

function seccioMillora(i) {
  const p = estat.parceles[i];
  const nivell = p.nivell || 1;
  if (nivell >= NIVELL_MAX) return h('div', { class: 'opcio' }, h('p', {}, 'Aquest edifici ja és al nivell màxim.'));
  const cost = joc.costMillora(p);
  return h('div', { class: 'opcio millora' },
    h('strong', {}, `Millora a nivell ${nivell + 1}`),
    h('p', { class: 'nota' }, `Treballarà ${nivell + 1} vegades més ràpid que al nivell 1. Les obres duren ${joc.temps(joc.tempsMillora(p))} i mentrestant no pot treballar.`),
    h('button', {
      class: 'btn', disabled: estat.diners < cost,
      onclick: () => accio(() => { joc.millorar(estat, i); avis('Comencen les obres de millora', 'ok'); }),
    }, `Millora per ${joc.diners(cost)}`));
}

// ---------- navegació inferior ----------
function marcarNav(seccio) {
  for (const b of document.querySelectorAll('.navegacio button')) b.classList.toggle('actiu', b.dataset.seccio === seccio);
}
const SECCIONS = {
  mapa: () => tancarPanell(),
  magatzem: () => obrirMagatzem(),
  mercat: () => obrirMercat(),
  empresa: () => obrirEmpresa(),
  xat: () => obrirXat(),
};
for (const b of document.querySelectorAll('.navegacio button')) {
  b.addEventListener('click', () => SECCIONS[b.dataset.seccio]());
}
if (!XAT_ACTIU) $('#nav-xat').hidden = true;

// Pestanyes dins d'una secció (com la barra d'icones de Sim Companies)
function pestanyes(actual, llista) {
  return h('div', { class: 'pestanyes', role: 'tablist' },
    ...llista.map(([id, text, fn, bloquejat]) => h('button', {
      class: `pestanya${id === actual ? ' actiu' : ''}`, role: 'tab',
      'aria-selected': id === actual ? 'true' : 'false', onclick: fn,
    }, text, bloquejat ? h('span', { class: 'cadenat', title: 'Bloquejat' }, '🔒') : null)));
}

// ---------- barra de nivell i missions ----------
function dibuixarCapcalera() {
  const { nivell, fraccio, falta } = joc.progresNivell(estat);
  $('#nivell-text').textContent = `Nivell ${nivell}`;
  $('#nivell-ple').style.width = `${Math.round(fraccio * 100)}%`;
  $('#barra-nivell').title = falta ? `Et falten ${joc.diners(falta)} de valor per pujar de nivell` : 'Nivell màxim';
  if (nivell > (estat.nivellMax || 1)) {
    estat.nivellMax = nivell;
    desar();
    avis(`Has pujat al nivell ${nivell}!`, 'ok');
  }
  const m = joc.missioActual(estat);
  const boto = $('#missio');
  boto.hidden = !m;
  if (m) {
    const fet = m.fet(estat);
    $('#missio-text').textContent = `→ ${m.text}`;
    $('#missio-premi').textContent = fet ? `Cobra ${joc.diners(m.premi)}` : `+${joc.diners(m.premi)}`;
    boto.classList.toggle('feta', fet);
  }
}
$('#missio').addEventListener('click', () => {
  const m = joc.missioActual(estat);
  if (!m) return;
  if (m.fet(estat)) accio(() => { joc.cobrarMissio(estat); avis(`Missió completada: +${joc.diners(m.premi)}`, 'ok'); });
  else avis(`Missió: ${m.text}. Premi: ${joc.diners(m.premi)}.`);
});
$('#barra-nivell').addEventListener('click', () => obrirEmpresa('resum'));

// ---------- magatzem (estil Sim Companies) ----------
function obrirMagatzem() {
  marcarNav('magatzem');
  const items = Object.entries(estat.inventari).filter(([, q]) => q > 0);
  const cos = h('div', { class: 'bloc' });
  if (!items.length) {
    cos.append(h('img', { src: 'img/personatges/guia-pensa.webp', alt: '', width: 160, height: 160, class: 'panell-img' }),
      h('p', {}, 'El magatzem és buit. Toca un edifici teu i posa\'l a produir, o compra al Mercat.'));
  } else {
    let total = 0;
    for (const [cat, nomCat] of Object.entries(CATEGORIES)) {
      const delaCat = items.filter(([r]) => RECURSOS[r].cat === cat);
      if (!delaCat.length) continue;
      const graella = h('div', { class: 'graella-estoc' });
      for (const [r, q] of delaCat) {
        total += q * joc.costMitja(estat, r);
        graella.append(h('button', { class: 'carta-estoc', onclick: () => obrirProducte(r) },
          h('span', { class: 'carta-preu' }, joc.dinersDec(joc.costMitja(estat, r))),
          h('span', { class: 'carta-q' }, joc.nombre(q)),
          icona(r, 52),
          h('span', { class: 'carta-nom' }, RECURSOS[r].nom)));
      }
      cos.append(h('h3', { class: 'subtitol' }, nomCat), graella);
    }
    cos.prepend(h('div', { class: 'total-estoc' }, h('span', {}, 'Valor de l\'estoc (a cost)'), h('strong', {}, joc.diners(total))));
    cos.append(h('p', { class: 'nota' }, 'El preu petit de cada carta és el que t\'ha costat cada unitat de mitjana. Toca un producte per vendre\'l.'));
  }
  obrirPanell('Magatzem', cos, { tipus: 'magatzem', ample: true });
}

function obrirProducte(r) {
  const q = joc.quantitatA(estat, r);
  if (!q) { obrirMagatzem(); return; }
  const cost = joc.costMitja(estat, r);
  const quant = h('input', { type: 'number', min: 1, max: q, value: q, inputmode: 'numeric', 'aria-label': 'Unitats', class: 'input-preu' });
  const preu = h('input', { type: 'number', min: 1, value: Math.max(1, Math.round(RECURSOS[r].preu * 1.2)), inputmode: 'numeric', 'aria-label': 'Preu per unitat', class: 'input-preu' });
  const desti = h('select', { class: 'input-preu ample', 'aria-label': 'Empresa destinatària' }, h('option', { value: '' }, 'Carregant empreses…'));
  const potContractes = joc.nivellEmpresa(estat) >= DESBLOQUEIG.contractes;
  if (potContractes) {
    desa.classificacio(usuari.uid, estat).then((files) => {
      const altres = files.filter((f) => f.uid !== usuari.uid);
      desti.replaceChildren(...(altres.length
        ? altres.map((f) => h('option', { value: f.uid, 'data-nom': f.nom }, f.nom))
        : [h('option', { value: '' }, 'Encara no hi ha altres empreses')]));
    }).catch(() => desti.replaceChildren(h('option', { value: '' }, 'No s\'han pogut carregar')));
  }
  const cos = h('div', { class: 'bloc' },
    h('button', { class: 'btn-tornar', onclick: obrirMagatzem }, '← Magatzem'),
    h('div', { class: 'opcio-cap' }, icona(r, 56),
      h('div', {}, h('strong', {}, RECURSOS[r].nom),
        h('span', { class: 'nota' }, `Tens ${joc.nombre(q)} unitats. Cost mitjà: ${joc.dinersDec(cost)}`))),
    h('label', { class: 'fila-preu' }, 'Unitats', quant),

    h('div', { class: 'opcio' },
      h('strong', {}, 'Mercat de l\'escola'),
      h('p', { class: 'nota' }, `Paga ${joc.diners(RECURSOS[r].preu)} per unitat, sempre i a l'instant.`),
      h('button', {
        class: 'btn btn-principal',
        onclick: () => accio(() => { const ing = joc.vendre(estat, r, Number(quant.value)); avis(`Venut per ${joc.diners(ing)}`, 'ok'); obrirProducte(r); }),
      }, 'Ven a l\'escola')),

    h('div', { class: 'opcio' },
      h('strong', {}, 'Borsa'),
      h('p', { class: 'nota' }, `Hi poses el preu tu. Quan algú compra, la borsa es queda un ${Math.round(COMISSIO_BORSA * 100)}%.`),
      h('label', { class: 'fila-preu' }, 'Preu per unitat (€)', preu),
      h('button', {
        class: 'btn btn-principal',
        onclick: () => accioRemota(async () => {
          await desa.publicarOferta(usuari.uid, estat, r, Number(quant.value), Number(preu.value));
          joc.sumaStat(estat, 'ofertesBorsa', 1); await desar();
        }, 'Oferta publicada a la borsa').then(() => obrirProducte(r)),
      }, 'Publica a la borsa')),

    h('div', { class: 'opcio' },
      h('strong', {}, 'Contracte directe'),
      potContractes
        ? [h('p', { class: 'nota' }, 'Ofereix-ho a una empresa concreta. Sense comissió: només ella el pot acceptar. Fa servir el mateix preu de dalt.'),
          desti,
          h('button', {
            class: 'btn',
            onclick: () => {
              const opt = desti.selectedOptions[0];
              if (!desti.value) { avis('Tria una empresa.', 'error'); return; }
              accioRemota(() => desa.publicarOferta(usuari.uid, estat, r, Number(quant.value), Number(preu.value), desti.value, opt.dataset.nom),
                `Contracte enviat a ${opt.dataset.nom}`).then(() => obrirProducte(r));
            },
          }, 'Envia el contracte')]
        : h('p', { class: 'nota' }, `Es desbloqueja al nivell ${DESBLOQUEIG.contractes} d'empresa.`)));
  obrirPanell(RECURSOS[r].nom, cos, { tipus: 'producte', ample: true });
}

// ---------- mercat: borsa i contractes ----------
async function cintaPreus() {
  const cinta = h('div', { class: 'cinta' }, h('span', { class: 'nota' }, 'Carregant preus…'));
  desa.preusMinims().then((preus) => {
    const elems = Object.keys(RECURSOS).filter((r) => preus[r] != null).map((r) => {
      const amunt = preus[r] >= RECURSOS[r].preu;
      return h('span', { class: 'cinta-item' }, icona(r, 22), joc.diners(preus[r]), h('b', { class: amunt ? 'amunt' : 'avall' }, amunt ? '↑' : '↓'));
    });
    cinta.replaceChildren(h('div', { class: 'cinta-pista' }, ...elems, ...elems.map((e) => e.cloneNode(true))));
  }).catch(() => cinta.replaceChildren());
  return cinta;
}

async function obrirMercat(pestanya = 'borsa') {
  marcarNav('mercat');
  const tabs = pestanyes(pestanya, [
    ['borsa', 'Borsa', () => obrirMercat('borsa')],
    ['contractes', 'Contractes', () => obrirMercat('contractes'), joc.nivellEmpresa(estat) < DESBLOQUEIG.contractes],
  ]);
  if (pestanya === 'contractes') return obrirContractes(tabs);
  const cos = h('div', { class: 'bloc' }, tabs, await cintaPreus());
  for (const [cat, nomCat] of Object.entries(CATEGORIES)) {
    cos.append(h('h3', { class: 'subtitol' }, nomCat),
      h('div', { class: 'graella-mercat' }, ...Object.keys(RECURSOS).filter((r) => RECURSOS[r].cat === cat).map((r) =>
        h('button', { class: 'btn-recurs', title: RECURSOS[r].nom, onclick: () => obrirBorsa(r) }, icona(r, 40), h('span', {}, RECURSOS[r].nom)))));
  }
  obrirPanell('Mercat', cos, { tipus: 'mercat', ample: true });
}

async function obrirContractes(tabs) {
  const entrants = h('div', { class: 'llista-ofertes' }, h('p', { class: 'nota' }, 'Carregant…'));
  const sortints = h('div', { class: 'llista-ofertes' });
  obrirPanell('Mercat', h('div', { class: 'bloc' }, tabs,
    joc.nivellEmpresa(estat) < DESBLOQUEIG.contractes ? h('p', { class: 'avis-bloqueig' }, `Els contractes es desbloquegen al nivell ${DESBLOQUEIG.contractes}. Encara pots acceptar els que t'enviïn.`) : null,
    h('h3', { class: 'subtitol' }, 'Contractes que has rebut'), entrants,
    h('h3', { class: 'subtitol' }, 'Contractes que has enviat'), sortints,
    h('p', { class: 'nota' }, 'Els contractes no paguen comissió. Per enviar-ne un, ves al Magatzem i toca un producte.')), { tipus: 'mercat', ample: true });
  try {
    const [ent, meves] = await Promise.all([desa.contractesEntrants(usuari.uid), desa.mevesOfertes(usuari.uid)]);
    entrants.replaceChildren(...(ent.length ? ent.map((o) => h('div', { class: 'fila-oferta' },
      h('img', { src: imgLogo(o.logo || 1), alt: '', width: 34, height: 34 }),
      h('span', { class: 'of-info' }, h('strong', {}, o.nomVenedor), h('span', { class: 'nota' }, `${joc.nombre(o.quantitat)} × ${RECURSOS[o.recurs].nom} a ${joc.diners(o.preu)} (total ${joc.diners(o.quantitat * o.preu)})`)),
      h('div', { class: 'of-compra' }, icona(o.recurs, 30), h('button', {
        class: 'btn btn-principal',
        onclick: () => accioRemota(() => desa.comprar(usuari.uid, estat, o.id, o.quantitat), (r) => `Contracte acceptat: ${joc.diners(r.cost)}`).then(() => obrirMercat('contractes')),
      }, 'Accepta')))) : [h('p', { class: 'nota' }, 'No tens cap contracte pendent.')]));
    const env = meves.filter((o) => o.perA);
    sortints.replaceChildren(...(env.length ? env.map((o) => h('div', { class: 'fila-oferta propia' },
      icona(o.recurs, 30),
      h('span', { class: 'of-info' }, `${joc.nombre(o.quantitat)} a ${joc.diners(o.preu)} per a ${o.nomPerA || 'una empresa'}`,
        o.pendent ? h('span', { class: 'nota' }, `Per cobrar: ${joc.diners(o.pendent)}`) : null),
      h('button', { class: 'btn', onclick: () => accioRemota(() => desa.retirarOferta(usuari.uid, estat, o.id), 'Contracte retirat').then(() => obrirMercat('contractes')) }, 'Retira'))) : [h('p', { class: 'nota' }, 'No has enviat cap contracte.')]));
  } catch (err) {
    console.error(err);
    entrants.replaceChildren(h('p', { class: 'nota falta' }, 'No s\'han pogut carregar els contractes.'));
  }
}

// ---------- empresa: resum, banc, classificació, recerca ----------
function obrirEmpresa(pestanya = 'resum') {
  marcarNav('empresa');
  const n = joc.nivellEmpresa(estat);
  const tabs = pestanyes(pestanya, [
    ['resum', 'Resum', () => obrirEmpresa('resum')],
    ['banc', 'Banc', () => obrirEmpresa('banc'), n < DESBLOQUEIG.banc],
    ['classificacio', 'Classificació', () => obrirEmpresa('classificacio')],
    ['recerca', 'Recerca', () => obrirEmpresa('recerca'), true],
  ]);
  const cos = h('div', { class: 'bloc' }, tabs);
  if (pestanya === 'resum') cos.append(...seccioResum());
  if (pestanya === 'banc') cos.append(...seccioBanc(n));
  if (pestanya === 'classificacio') cos.append(seccioClassificacio());
  if (pestanya === 'recerca') cos.append(h('div', { class: 'avis-bloqueig' },
    h('strong', {}, 'La recerca arribarà aviat'),
    h('p', {}, `Amb el laboratori podràs millorar la qualitat dels productes i vendre'ls més cars. Es desbloquejarà al nivell ${DESBLOQUEIG.recerca}.`)));
  obrirPanell(estat.nom, cos, { tipus: 'empresa', pestanya, ample: true });
}

function seccioResum() {
  const fase = joc.faseEconomica();
  const b = joc.balanc(estat);
  const fila = (k, v, classe = '') => [h('dt', { class: classe }, k), h('dd', { class: classe }, v)];
  const rank = h('span', {}, '…');
  desa.classificacio(usuari.uid, estat).then((f) => {
    const pos = f.findIndex((x) => x.uid === usuari.uid);
    rank.textContent = pos >= 0 ? `${pos + 1}a de ${f.length}` : 'n/d';
  }).catch(() => { rank.textContent = 'n/d'; });
  return [
    h('div', { class: `fase fase-${fase.clau}` },
      h('span', { class: 'nota' }, 'Fase econòmica actual'),
      h('strong', {}, fase.nom),
      h('div', { class: 'fase-efectes' },
        h('span', {}, 'Producció ', fletxa(fase.produccio)),
        h('span', {}, 'Vendes ', fletxa(fase.vendes))),
      h('p', { class: 'nota' }, fase.text, ' Canvia d\'aquí a ', h('strong', { 'data-fi': fase.fi }, joc.temps((fase.fi - Date.now()) / 1000)), '.')),
    h('div', { class: 'resum-graella' },
      h('div', { class: 'grafic' }, h('span', { class: 'nota' }, 'Valor de l\'empresa'), graficValor()),
      h('div', {},
        h('p', { class: 'rank' }, 'Posició a la classe: ', rank),
        h('dl', { class: 'dades balanc' },
          ...fila('Diners', joc.diners(b.diners)),
          ...fila('Estoc', joc.diners(b.estoc)),
          ...fila('Actius corrents', joc.diners(b.corrents), 'fort'),
          ...fila('Actius no corrents (edificis)', joc.diners(b.noCorrents), 'fort'),
          ...fila('Passius (préstecs)', `−${joc.diners(b.passius)}`, 'fort'),
          ...fila('Patrimoni net', joc.diners(b.net), 'total')))),
    h('div', { class: 'fila-botons' },
      h('button', { class: 'btn', onclick: obrirGuia }, 'Tutorial'),
      h('button', { class: 'btn', onclick: () => desa.sortir() }, 'Tanca la sessió')),
  ];
}

function fletxa(mult) {
  if (mult > 1) return h('b', { class: 'amunt' }, '▲');
  if (mult < 1) return h('b', { class: 'avall' }, '▼');
  return h('b', { class: 'igual' }, '●');
}

function graficValor() {
  const punts = estat.historial || [];
  if (punts.length < 2) return h('p', { class: 'nota grafic-buit' }, `Aquí veuràs com creix la teva empresa. Es desa un punt cada ${HISTORIAL_MINUTS} minuts.`);
  const W = 320, H = 150, P = 6;
  const vs = punts.map((p) => p.v);
  const min = Math.min(...vs), max = Math.max(...vs), rang = max - min || 1;
  const x = (k) => P + (k / (punts.length - 1)) * (W - 2 * P);
  const y = (v) => H - P - ((v - min) / rang) * (H - 2 * P);
  const linia = punts.map((p, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'grafic-svg', role: 'img', 'aria-label': `Valor de ${joc.diners(min)} a ${joc.diners(max)}` });
  s.append(svg('path', { d: `${linia} L${x(punts.length - 1)},${H - P} L${x(0)},${H - P} Z`, fill: 'rgb(60 157 50 / .18)' }),
    svg('path', { d: linia, fill: 'none', stroke: '#3c9d32', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
  return h('div', {}, s, h('div', { class: 'grafic-eix' }, h('span', {}, joc.diners(min)), h('span', {}, joc.diners(max))));
}

function seccioBanc(n) {
  if (n < DESBLOQUEIG.banc) {
    return [h('div', { class: 'avis-bloqueig' }, h('strong', {}, 'La teva empresa encara és massa petita per demanar préstecs'),
      h('p', {}, `El banc et deixarà diners quan arribis al nivell ${DESBLOQUEIG.banc}. Fes créixer el valor de l'empresa.`))];
  }
  joc.aplicarInteressos(estat);
  const max = joc.maxPrestec(estat);
  const deute = Math.ceil(estat.deute || 0);
  const demana = h('input', { type: 'number', min: 1, max: Math.max(1, max), value: Math.min(max, 5000), inputmode: 'numeric', class: 'input-preu', 'aria-label': 'Import del préstec' });
  const torna = h('input', { type: 'number', min: 1, max: Math.max(1, deute), value: deute, inputmode: 'numeric', class: 'input-preu', 'aria-label': 'Import a tornar' });
  return [
    h('dl', { class: 'dades' },
      h('dt', {}, 'Deute actual'), h('dd', {}, joc.diners(deute)),
      h('dt', {}, 'Interès'), h('dd', {}, `${(BANC.interesHora * 100).toFixed(0)}% cada hora`),
      h('dt', {}, 'Encara et poden deixar'), h('dd', {}, joc.diners(max))),
    h('div', { class: 'opcio' }, h('strong', {}, 'Demana un préstec'),
      h('p', { class: 'nota' }, 'Els diners arriben a l\'instant. El deute creix cada hora fins que el tornis: compta que la inversió et doni més del que costa.'),
      h('label', { class: 'fila-preu' }, 'Import (€)', demana),
      h('button', { class: 'btn btn-principal', disabled: max < 1, onclick: () => accio(() => { joc.demanarPrestec(estat, Number(demana.value)); avis('Préstec concedit', 'ok'); obrirEmpresa('banc'); }) }, 'Demana el préstec')),
    h('div', { class: 'opcio' }, h('strong', {}, 'Torna diners'),
      h('label', { class: 'fila-preu' }, 'Import (€)', torna),
      h('button', { class: 'btn', disabled: deute < 1, onclick: () => accio(() => { joc.retornarPrestec(estat, Number(torna.value)); avis('Has tornat diners al banc', 'ok'); obrirEmpresa('banc'); }) }, 'Torna')),
  ];
}

function seccioClassificacio() {
  const cont = h('div', {}, h('p', { class: 'nota' }, 'Carregant…'));
  desa.classificacio(usuari.uid, estat).then((files) => {
    const llista = h('ol', { class: 'llista-classificacio' });
    files.forEach((f, k) => llista.append(h('li', { class: f.uid === usuari.uid ? 'jo' : '' },
      h('span', { class: 'posicio' }, k + 1),
      h('img', { src: imgLogo(f.logo || 1), alt: '', width: 36, height: 36 }),
      h('span', { class: 'cl-nom' }, f.nom),
      h('span', { class: 'cl-valor' }, joc.diners(f.valor || 0)))));
    cont.replaceChildren(h('p', { class: 'nota' }, 'Ordenat pel valor de l\'empresa: diners, estoc i edificis, menys els préstecs.'), llista);
  }).catch(() => cont.replaceChildren(h('p', { class: 'nota falta' }, 'No s\'ha pogut carregar la classificació.')));
  return cont;
}

// ---------- xat de la classe ----------
let missatgesXat = [];
let xatIniciat = false;
let ultimVist = Date.now();

async function iniciarXat() {
  if (!XAT_ACTIU || xatIniciat) return;
  xatIniciat = true;
  try {
    await desa.escoltarXat((llista) => {
      const nous = llista.filter((m) => m.creada > ultimVist && m.autor !== usuari.uid);
      missatgesXat = llista;
      if (panell?.tipus === 'xat') { dibuixarXat(); ultimVist = Date.now(); return; }
      for (const m of nous.slice(-3)) notificar(m);
      const pendents = llista.filter((m) => m.creada > ultimVist && m.autor !== usuari.uid).length;
      $('#xat-nous').hidden = !pendents;
      $('#xat-nous').textContent = pendents;
    });
  } catch (err) { console.error(err); }
}

function notificar(m) {
  const el = h('button', { class: 'notificacio', onclick: () => { el.remove(); obrirXat(); } },
    h('img', { src: imgLogo(m.logo || 1), alt: '', width: 40, height: 40 }),
    h('span', {}, h('strong', {}, m.nom), h('span', {}, m.text)));
  $('#notificacions').append(el);
  setTimeout(() => el.remove(), 7000);
}

function obrirXat() {
  marcarNav('xat');
  ultimVist = Date.now();
  $('#xat-nous').hidden = true;
  const entrada = h('input', { maxlength: 200, placeholder: 'Escriu un missatge…', 'aria-label': 'Missatge', autocomplete: 'off' });
  const envia = async (ev) => {
    ev.preventDefault();
    const text = entrada.value.trim();
    if (!text) return;
    entrada.value = '';
    try { await desa.enviarMissatge(usuari.uid, estat, text); } catch (err) { console.error(err); avis('No s\'ha pogut enviar.', 'error'); }
  };
  obrirPanell('Xat de la classe', h('div', { class: 'xat' },
    h('div', { id: 'xat-llista', class: 'xat-llista' }),
    h('form', { class: 'xat-form', onsubmit: envia }, entrada, h('button', { class: 'btn btn-principal', type: 'submit' }, 'Envia')),
    h('p', { class: 'nota' }, 'Sigues respectuós: el professorat pot veure i esborrar els missatges.')), { tipus: 'xat', ample: true });
  dibuixarXat();
  entrada.focus();
}

function dibuixarXat() {
  const llista = document.getElementById('xat-llista');
  if (!llista) return;
  llista.replaceChildren(...(missatgesXat.length ? missatgesXat.map((m) => h('div', { class: `xat-msg${m.autor === usuari.uid ? ' meu' : ''}` },
    h('img', { src: imgLogo(m.logo || 1), alt: '', width: 32, height: 32 }),
    h('div', {}, h('strong', {}, m.nom), h('p', {}, m.text)))) : [h('p', { class: 'nota' }, 'Encara no hi ha missatges. Saluda la classe!')]));
  llista.scrollTop = llista.scrollHeight;
}

// ---------- borsa entre empreses ----------
let recursBorsa = 'electricitat';

async function obrirBorsa(recurs = recursBorsa) {
  recursBorsa = recurs;
  marcarNav('mercat');
  const selector = h('div', { class: 'selector-recursos', role: 'tablist' },
    ...Object.keys(RECURSOS).map((r) => h('button', {
      class: `btn-recurs${r === recurs ? ' actiu' : ''}`, role: 'tab', 'aria-selected': r === recurs ? 'true' : 'false',
      title: RECURSOS[r].nom, onclick: () => obrirBorsa(r),
    }, icona(r, 30))));
  const llista = h('div', { class: 'llista-ofertes' }, h('p', { class: 'nota' }, 'Carregant ofertes…'));
  const meves = h('div', { class: 'meves-ofertes' });
  obrirPanell('Borsa', h('div', { class: 'bloc' },
    h('button', { class: 'btn-tornar', onclick: () => obrirMercat() }, '← Mercat'),
    selector,
    h('h3', { class: 'subtitol' }, icona(recurs, 32), `${RECURSOS[recurs].nom}`,
      h('span', { class: 'nota' }, `L'escola en paga ${joc.diners(RECURSOS[recurs].preu)}`)),
    llista, meves), { tipus: 'borsa', ample: true });

  try {
    const [ofs, propies] = await Promise.all([desa.ofertes(recurs), desa.mevesOfertes(usuari.uid)]);
    if (panell?.tipus !== 'borsa' || recursBorsa !== recurs) return;
    llista.replaceChildren(...(ofs.length ? ofs.map(filaOferta) : [h('p', { class: 'nota' }, 'Ningú en ven ara mateix. Pots ser el primer des del Magatzem.')]));
    meves.replaceChildren(...(propies.length ? [
      h('h3', { class: 'subtitol' }, 'Les teves ofertes'),
      ...propies.map((o) => h('div', { class: 'fila-oferta propia' },
        icona(o.recurs, 30),
        h('span', { class: 'of-info' }, `${joc.nombre(o.quantitat)} a ${joc.diners(o.preu)}`,
          o.pendent ? h('span', { class: 'nota' }, `Per cobrar: ${joc.diners(o.pendent)}`) : null),
        h('button', {
          class: 'btn', onclick: () => accioRemota(() => desa.retirarOferta(usuari.uid, estat, o.id), 'Oferta retirada').then(() => obrirBorsa(recursBorsa)),
        }, 'Retira'))),
    ] : []));
  } catch (err) {
    console.error(err);
    llista.replaceChildren(h('p', { class: 'nota falta' }, 'No s\'ha pogut carregar la borsa. Revisa la connexió.'));
  }
}

function filaOferta(o) {
  const meva = o.venedor === usuari.uid;
  const { input, cont } = selectorQuantitat(Math.min(o.quantitat, 10), o.quantitat, () => {});
  return h('div', { class: `fila-oferta${meva ? ' propia' : ''}` },
    h('img', { src: imgLogo(o.logo || 1), alt: '', width: 34, height: 34 }),
    h('span', { class: 'of-info' }, h('strong', {}, o.nomVenedor || 'Empresa'),
      h('span', { class: 'nota' }, `${joc.nombre(o.quantitat)} unitats a ${joc.diners(o.preu)}`)),
    meva ? h('span', { class: 'nota' }, 'La teva') : h('div', { class: 'of-compra' }, cont,
      h('button', {
        class: 'btn btn-principal',
        onclick: () => accioRemota(() => desa.comprar(usuari.uid, estat, o.id, Number(input.value)),
          (r) => `Comprat per ${joc.diners(r.cost)}`).then(() => obrirBorsa(recursBorsa)),
      }, 'Compra')));
}

// ---------- guia / tutorial ----------
const PASSOS_GUIA = [
  ['guia-normal', 'Hola! Sóc la Marta i t\'ajudaré a començar. Aquest és el terreny de la teva empresa.'],
  ['guia-explica', 'Toca la parcel·la del cartell + i construeix una central elèctrica. Gairebé totes les fàbriques necessiten electricitat.'],
  ['guia-pensa', 'Després fes una estació de bombeig. Amb aigua i electricitat podràs fer llavors al viver, i amb llavors, blat.'],
  ['guia-celebra', 'Ven el que produeixis des del Magatzem i fes créixer l\'empresa. Som-hi!'],
];
let pasGuia = 0;
function obrirGuia() { pasGuia = 0; tancarPanell(); mostrarPas(); $('#guia').hidden = false; }
function mostrarPas() {
  const [img, text] = PASSOS_GUIA[pasGuia];
  $('#guia-img').src = `img/personatges/${img}.webp`;
  $('#guia-text').textContent = text;
  $('#guia-seguent').textContent = pasGuia === PASSOS_GUIA.length - 1 ? 'Som-hi!' : 'Següent';
}
$('#guia-seguent').addEventListener('click', () => {
  pasGuia += 1;
  if (pasGuia < PASSOS_GUIA.length) { mostrarPas(); return; }
  $('#guia').hidden = true;
  if (!estat.tutorialVist) { estat.tutorialVist = true; desar(); }
});
