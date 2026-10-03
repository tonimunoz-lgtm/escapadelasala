import {
  EDIFICIS, RECURSOS, MIDA_MAPA, BLOC, AMPLE_CARRER, NUM_LOGOS, MAX_PER_ORDRE, NIVELL_MAX,
  COMISSIO_BORSA, imgEdifici, imgRecurs, imgLogo, tempsConstruccio, preuReferencia,
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
$('#btn-sortir').addEventListener('click', () => desa.sortir());

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
  if (!estat.tutorialVist) obrirGuia();
}

function tic() {
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
// Les imatges fan 256x256. El rombe superior de la parcel·la fa 236 px d'ample
// i el seu centre queda a y=175 dins la imatge.
const IMG = 256, W = 236, CENTRE_Y = 175, ALCADA_PARCELA = 14, GRUIX_LLOSA = 26;
const G = AMPLE_CARRER;
const NUM_ILLES = MIDA_MAPA / BLOC;
const EXTENSIO = MIDA_MAPA + (NUM_ILLES - 1) * G + 2 * G; // mida total de la ciutat
const coord = (k) => k + Math.floor(k / BLOC) * G + G;     // on comença la parcel·la k (amb carrers)
const iso = (u, v) => ({ x: (u - v) * W / 2, y: (u + v) * W / 4 });
const centreParcela = (i) => iso(coord(i % MIDA_MAPA) + 0.5, coord(Math.floor(i / MIDA_MAPA)) + 0.5);
const zIndex = (u, v) => Math.round((u + v) * 4) + 10;

let escala = 0.75;
let despl = { x: 0, y: 0 };
const caselles = [];

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
const punts = (...ps) => ps.map((p) => `${p.x},${p.y}`).join(' ');

// Dibuixa el terra de la ciutat: llosa d'asfalt, voreres de cada illa i línies dels carrers
function dibuixarTerra() {
  const T = EXTENSIO;
  const amplada = T * W, alcada = T * W / 2 + GRUIX_LLOSA;
  const ox = T * W / 2;
  const P = (u, v, dy = 0) => { const p = iso(u, v); return { x: p.x + ox, y: p.y + dy }; };
  const s = svg('svg', { class: 'terra', width: amplada, height: alcada, viewBox: `0 0 ${amplada} ${alcada}` });
  s.style.left = `${-ox}px`;
  s.style.top = `${ALCADA_PARCELA}px`;
  const d = GRUIX_LLOSA;
  s.append(
    svg('polygon', { points: punts(P(0, T), P(T, T), P(T, T, d), P(0, T, d)), fill: '#4a525c' }),
    svg('polygon', { points: punts(P(T, T), P(T, 0), P(T, 0, d), P(T, T, d)), fill: '#3a4049' }),
    svg('polygon', { points: punts(P(0, 0), P(T, 0), P(T, T), P(0, T)), fill: '#646e7a' }),
  );
  // línies discontínues al mig de cada carrer
  const centres = [G / 2, T - G / 2];
  for (let k = 1; k < NUM_ILLES; k++) centres.push(coord(k * BLOC) - G / 2);
  for (const c of centres) {
    for (const [a, b] of [[P(c, 0), P(c, T)], [P(0, c), P(T, c)]]) {
      s.append(svg('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#f3d35b', 'stroke-width': 3, 'stroke-dasharray': '16 14', opacity: '.9' }));
    }
  }
  // passos de vianants a les cruïlles interiors
  for (const cu of centres) for (const cv of centres) {
    const m = 0.16;
    s.append(svg('polygon', { points: punts(P(cu - m, cv - m), P(cu + m, cv - m), P(cu + m, cv + m), P(cu - m, cv + m)), fill: '#646e7a' }));
  }
  // voreres de cada illa
  const v = 0.08;
  for (let bi = 0; bi < NUM_ILLES; bi++) for (let bj = 0; bj < NUM_ILLES; bj++) {
    const u0 = coord(bj * BLOC) - v, u1 = coord(bj * BLOC) + BLOC + v;
    const v0 = coord(bi * BLOC) - v, v1 = coord(bi * BLOC) + BLOC + v;
    s.append(svg('polygon', { points: punts(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)), fill: '#c4cbd3', stroke: '#9aa3ad', 'stroke-width': 2 }));
  }
  return s;
}

function construirMapa() {
  const mapa = $('#mapa');
  mapa.replaceChildren(dibuixarTerra());
  caselles.length = 0;
  // Bosc al voltant de la ciutat
  const T = EXTENSIO, fora = 0.75;
  for (let t = 0.5; t < T; t += 1) {
    for (const [u, v] of [[t, -fora], [-fora, t], [t, T + fora], [T + fora, t]]) {
      if (Math.round(t * 7 + u) % 3 === 0) continue;
      const { x, y } = iso(u, v);
      mapa.append(h('img', {
        class: 'decor', src: 'img/mapa/decor-arbres.webp', alt: '', draggable: 'false',
        style: `left:${x - IMG / 2}px;top:${y - CENTRE_Y}px;z-index:${zIndex(u, v)}`,
      }));
    }
  }
  for (let i = 0; i < MIDA_MAPA * MIDA_MAPA; i++) {
    const u = coord(i % MIDA_MAPA) + 0.5, v = coord(Math.floor(i / MIDA_MAPA)) + 0.5;
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
    caselles.push({ img, etiqueta, zona, casella, rotul });
  }
  aplicarTransformacio();
}

function imatgeParcela(p) {
  if (p.estat === 'bloquejada') return 'img/mapa/parcela-bloquejada.webp';
  if (p.estat === 'buida') return 'img/mapa/parcela-buida.webp';
  if (p.estat === 'obres') return 'img/mapa/parcela-obres.webp';
  if (p.millora) return 'img/mapa/parcela-millora.webp';
  return imgEdifici(p.tipus);
}

function nomParcela(p) {
  if (p.estat === 'bloquejada') return 'Parcel·la per comprar';
  if (p.estat === 'buida') return 'Parcel·la lliure';
  if (p.estat === 'obres') return `${EDIFICIS[p.tipus].nom} (en obres)`;
  return `${EDIFICIS[p.tipus].nom}, nivell ${p.nivell || 1}`;
}

function dibuixarMapa() {
  const ara = Date.now();
  estat.parceles.forEach((p, i) => {
    const { img, etiqueta, zona, casella, rotul } = caselles[i];
    const src = imatgeParcela(p);
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
        rotul.replaceChildren(h('span', {}, nom), p.estat === 'edifici' && p.tipus !== 'seu-central' ? h('b', {}, `Nv ${p.nivell || 1}`) : null);
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
  panell = info;
}
function tancarPanell() { $('#panell').hidden = true; panell = null; }
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
      h('img', { src: imatgeParcela(p), alt: '', width: 140, height: 140, class: 'panell-img' }),
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
    info.textContent = `Temps: ${joc.temps(joc.segonsProduccio(opcio, q, nivell))}. Sous: ${joc.diners(joc.souProduccio(opcio, q))}.`;
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

// ---------- magatzem ----------
function obrirMagatzem() {
  const items = Object.entries(estat.inventari).filter(([, q]) => q > 0);
  const cos = h('div', { class: 'bloc' });
  if (!items.length) {
    cos.append(h('img', { src: 'img/personatges/guia-pensa.webp', alt: '', width: 160, height: 160, class: 'panell-img' }),
      h('p', {}, 'El magatzem és buit. Toca un edifici teu i posa\'l a produir, o compra a la borsa.'));
  } else {
    const llista = h('ul', { class: 'llista-magatzem' });
    for (const [r, q] of items) {
      const quant = h('input', { type: 'number', min: 1, max: q, value: q, inputmode: 'numeric', 'aria-label': `Unitats de ${RECURSOS[r].nom}` });
      const preu = h('input', { type: 'number', min: 1, value: Math.max(1, Math.round(RECURSOS[r].preu * 1.2)), inputmode: 'numeric', 'aria-label': 'Preu a la borsa', class: 'input-preu' });
      const formBorsa = h('div', { class: 'form-borsa', hidden: true },
        h('label', { class: 'fila-preu' }, 'Preu per unitat a la borsa (€)', preu),
        h('button', {
          class: 'btn btn-principal',
          onclick: () => accioRemota(() => desa.publicarOferta(usuari.uid, estat, r, Number(quant.value), Number(preu.value)),
            `Oferta publicada a la borsa`),
        }, 'Publica l\'oferta'),
        h('p', { class: 'nota' }, `La borsa es queda un ${Math.round(COMISSIO_BORSA * 100)}% quan algú compra.`));
      llista.append(h('li', {},
        icona(r, 40),
        h('div', { class: 'mag-info' }, h('strong', {}, RECURSOS[r].nom),
          h('span', { class: 'nota' }, `${joc.nombre(q)} unitats. L'escola paga ${joc.diners(RECURSOS[r].preu)}`)),
        h('div', { class: 'mag-venda' }, quant,
          h('button', {
            class: 'btn btn-principal',
            onclick: () => accio(() => { const ing = joc.vendre(estat, r, Number(quant.value)); avis(`Venut per ${joc.diners(ing)}`, 'ok'); }),
          }, 'Ven a l\'escola'),
          h('button', { class: 'btn', onclick: () => { formBorsa.hidden = !formBorsa.hidden; } }, 'A la borsa')),
        formBorsa));
    }
    cos.append(h('p', { class: 'nota' }, 'L\'escola compra a preu fix. A la borsa pots demanar més, però algú t\'ho ha de comprar.'), llista);
  }
  obrirPanell('Magatzem', cos, { tipus: 'magatzem' });
}
$('#btn-magatzem').addEventListener('click', obrirMagatzem);

// ---------- borsa entre empreses ----------
let recursBorsa = 'electricitat';

async function obrirBorsa(recurs = recursBorsa) {
  recursBorsa = recurs;
  const selector = h('div', { class: 'selector-recursos', role: 'tablist' },
    ...Object.keys(RECURSOS).map((r) => h('button', {
      class: `btn-recurs${r === recurs ? ' actiu' : ''}`, role: 'tab', 'aria-selected': r === recurs ? 'true' : 'false',
      title: RECURSOS[r].nom, onclick: () => obrirBorsa(r),
    }, icona(r, 30))));
  const llista = h('div', { class: 'llista-ofertes' }, h('p', { class: 'nota' }, 'Carregant ofertes…'));
  const meves = h('div', { class: 'meves-ofertes' });
  obrirPanell('Borsa', h('div', { class: 'bloc' },
    selector,
    h('h3', { class: 'subtitol' }, icona(recurs, 32), `${RECURSOS[recurs].nom}`,
      h('span', { class: 'nota' }, `L'escola en paga ${joc.diners(RECURSOS[recurs].preu)}`)),
    llista, meves), { tipus: 'borsa' });

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
$('#btn-borsa').addEventListener('click', () => obrirBorsa());

// ---------- classificació ----------
$('#btn-classificacio').addEventListener('click', async () => {
  obrirPanell('Classificació', h('p', {}, 'Carregant…'), { tipus: 'classificacio' });
  try {
    const files = await desa.classificacio(usuari.uid, estat);
    const llista = h('ol', { class: 'llista-classificacio' });
    files.forEach((f, n) => llista.append(h('li', { class: f.uid === usuari.uid ? 'jo' : '' },
      h('span', { class: 'posicio' }, n + 1),
      h('img', { src: imgLogo(f.logo || 1), alt: '', width: 36, height: 36 }),
      h('span', { class: 'cl-nom' }, f.nom),
      h('span', { class: 'cl-valor' }, joc.diners(f.valor || 0)))));
    obrirPanell('Classificació', h('div', { class: 'bloc' },
      h('p', { class: 'nota' }, 'Ordenat pel valor de l\'empresa: diners, estoc i edificis.'), llista), { tipus: 'classificacio' });
  } catch (err) {
    console.error(err);
    obrirPanell('Classificació', h('p', {}, 'No s\'ha pogut carregar la classificació.'), { tipus: 'classificacio' });
  }
});

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
