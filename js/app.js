import {
  EDIFICIS, RECURSOS, MIDA_MAPA, NUM_LOGOS, MAX_PER_ORDRE,
  imgEdifici, imgRecurs, imgLogo, tempsConstruccio,
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
let rellotge = null;

function iniciarJoc() {
  mostrarPantalla('pantalla-joc');
  joc.actualitzar(estat);
  construirMapa();
  dibuixarTot();
  centrarMapa();
  clearInterval(rellotge);
  rellotge = setInterval(tic, 1000);
  if (!estat.tutorialVist) obrirGuia();
}

function tic() {
  if (joc.actualitzar(estat)) { desar(); dibuixarTot(); avis('Obres acabades!', 'ok'); return; }
  dibuixarMapa();
  refrescarPanell();
}

function dibuixarTot() {
  $('#barra-logo').src = imgLogo(estat.logo);
  $('#barra-nom').textContent = estat.nom;
  $('#barra-diners').textContent = joc.diners(estat.diners);
  dibuixarMapa();
  refrescarPanell(true);
}

// ---------- mapa isomètric ----------
// Les imatges fan 256x256. El rombe superior de la parcel·la fa 236 px d'ample
// i el seu centre queda a y=175 dins la imatge.
const IMG = 256, AMPLE_ROMBE = 236, CENTRE_Y = 175;
let escala = 0.75;
let despl = { x: 0, y: 0 };
const caselles = [];

const posicio = (r, c) => ({
  x: (c - r) * AMPLE_ROMBE / 2,
  y: (c + r) * AMPLE_ROMBE / 4,
});

function construirMapa() {
  const mapa = $('#mapa');
  mapa.replaceChildren();
  caselles.length = 0;
  // Anell decoratiu d'arbres al voltant
  for (let r = -1; r <= MIDA_MAPA; r++) {
    for (let c = -1; c <= MIDA_MAPA; c++) {
      const vora = r < 0 || c < 0 || r >= MIDA_MAPA || c >= MIDA_MAPA;
      if (!vora || (r + c * 3) % 4 === 0) continue;
      const { x, y } = posicio(r, c);
      mapa.append(h('img', {
        class: 'decor', src: 'img/mapa/decor-arbres.webp', alt: '', draggable: 'false',
        style: `left:${x - IMG / 2}px;top:${y - CENTRE_Y}px;z-index:${r + c + 10}`,
      }));
    }
  }
  for (let i = 0; i < MIDA_MAPA * MIDA_MAPA; i++) {
    const r = Math.floor(i / MIDA_MAPA), c = i % MIDA_MAPA;
    const { x, y } = posicio(r, c);
    const img = h('img', { class: 'casella-img', alt: '', draggable: 'false' });
    const etiqueta = h('div', { class: 'etiqueta', style: `left:${x}px;top:${y - 20}px` });
    const casella = h('div', { class: 'casella', style: `left:${x - IMG / 2}px;top:${y - CENTRE_Y}px;z-index:${r + c + 10}` }, img);
    const zona = h('button', {
      class: 'zona', style: `left:${x - AMPLE_ROMBE / 2}px;top:${y - AMPLE_ROMBE / 4}px`,
      onclick: () => { if (!arrossegat) obrirParcela(i); },
    });
    mapa.append(casella, zona, etiqueta);
    caselles.push({ img, etiqueta, zona, casella });
  }
  aplicarTransformacio();
}

function imatgeParcela(p) {
  if (p.estat === 'bloquejada') return 'img/mapa/parcela-bloquejada.webp';
  if (p.estat === 'buida') return 'img/mapa/parcela-buida.webp';
  if (p.estat === 'obres') return 'img/mapa/parcela-obres.webp';
  return imgEdifici(p.tipus);
}

function nomParcela(p) {
  if (p.estat === 'bloquejada') return 'Parcel·la bloquejada';
  if (p.estat === 'buida') return 'Parcel·la lliure';
  if (p.estat === 'obres') return `${EDIFICIS[p.tipus].nom} (en obres)`;
  return EDIFICIS[p.tipus].nom;
}

function dibuixarMapa() {
  const ara = Date.now();
  estat.parceles.forEach((p, i) => {
    const { img, etiqueta, zona, casella } = caselles[i];
    const src = imatgeParcela(p);
    if (img.getAttribute('src') !== src) img.src = src;
    zona.setAttribute('aria-label', nomParcela(p));
    casella.classList.toggle('produint', !!p.produccio && p.produccio.fi > ara);

    let contingut = null;
    if (p.estat === 'obres') {
      const total = tempsConstruccio(p.tipus) * 1000;
      contingut = barra(1 - (p.fiObres - ara) / total, joc.temps((p.fiObres - ara) / 1000));
    } else if (p.produccio) {
      const { inici, fi, recurs } = p.produccio;
      contingut = fi <= ara
        ? h('span', { class: 'recollir' }, h('img', { src: imgRecurs(recurs), alt: '' }), 'Recull')
        : barra((ara - inici) / (fi - inici), joc.temps((fi - ara) / 1000));
    }
    etiqueta.replaceChildren(...(contingut ? [contingut] : []));
    etiqueta.hidden = !contingut;
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
  $('#mapa').style.transform = `translate(${despl.x}px, ${despl.y}px) scale(${escala})`;
}
function centrarMapa() {
  const v = $('#visor').getBoundingClientRect();
  escala = Math.min(1, Math.max(0.3, Math.min(v.width / (AMPLE_ROMBE * (MIDA_MAPA + 0.6)), (v.height - 140) / (AMPLE_ROMBE * MIDA_MAPA / 2 + 180))));
  const centre = posicio((MIDA_MAPA - 1) / 2, (MIDA_MAPA - 1) / 2);
  despl.x = v.width / 2 - centre.x * escala;
  despl.y = v.height / 2 - (centre.y - 40) * escala;
  aplicarTransformacio();
}
function zoom(factor, cx, cy) {
  const v = $('#visor').getBoundingClientRect();
  cx ??= v.width / 2; cy ??= v.height / 2;
  const nova = Math.min(1.6, Math.max(0.25, escala * factor));
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
  return JSON.stringify([p.estat, p.tipus, !!p.produccio, p.produccio && p.produccio.fi <= Date.now(), estat.diners, estat.inventari]);
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
  if (p.estat === 'bloquejada') return obrirPanell('Parcel·la bloquejada', panellBloquejada(i), info);
  if (p.estat === 'buida') return obrirPanell('Què hi vols construir?', panellConstruir(i), info);
  if (p.estat === 'obres') return obrirPanell(EDIFICIS[p.tipus].nom, panellObres(p), info);
  if (p.tipus === 'seu-central') return obrirPanell(estat.nom, panellSeu(), info);
  return obrirPanell(EDIFICIS[p.tipus].nom, panellEdifici(i), info);
}

const icona = (recurs, mida = 28) => h('img', { src: imgRecurs(recurs), alt: RECURSOS[recurs].nom, title: RECURSOS[recurs].nom, width: mida, height: mida, class: 'icona' });

function panellBloquejada(i) {
  const cost = joc.costParcela(estat);
  return h('div', { class: 'bloc' },
    h('p', {}, 'Compra aquesta parcel·la per tenir més espai per construir.'),
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
    llista.append(h('li', { class: `fitxa-edifici${def.aviat ? ' aviat' : ''}` },
      h('img', { src: imgEdifici(id), alt: '', width: 96, height: 96, class: 'fitxa-img' }),
      h('div', { class: 'fitxa-info' },
        h('strong', {}, def.nom),
        def.aviat
          ? h('span', { class: 'nota' }, 'Properament')
          : h('span', { class: 'fa' }, 'Fa ', ...def.produeix.map((o) => icona(o.recurs, 22))),
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

function panellEdifici(i) {
  const p = estat.parceles[i];
  const def = EDIFICIS[p.tipus];
  const cos = h('div', { class: 'bloc' }, h('img', { src: imgEdifici(p.tipus), alt: '', width: 160, height: 160, class: 'panell-img' }));

  if (p.produccio) {
    const { recurs, quantitat, inici, fi } = p.produccio;
    if (fi <= Date.now()) {
      cos.append(
        h('p', { class: 'resultat' }, icona(recurs, 40), `${joc.nombre(quantitat)} × ${RECURSOS[recurs].nom} a punt!`),
        h('button', {
          class: 'btn btn-principal btn-gran',
          onclick: () => accio(() => { const r = joc.recollir(estat, i); avis(`+${r.quantitat} ${RECURSOS[r.recurs].nom}`, 'ok'); }),
        }, 'Recull i porta al magatzem'));
    } else {
      cos.append(
        h('p', { class: 'resultat' }, icona(recurs, 40), `Produint ${joc.nombre(quantitat)} × ${RECURSOS[recurs].nom}`),
        h('div', { class: 'progres gran' }, h('span', { class: 'progres-ple', 'data-inici': inici, 'data-fi-barra': fi, style: `width:${((Date.now() - inici) / (fi - inici)) * 100}%` })),
        h('p', {}, 'Falten ', h('strong', { 'data-fi': fi }, joc.temps((fi - Date.now()) / 1000)), '.'));
    }
    return cos;
  }

  for (const opcio of def.produeix) {
    const max = joc.maxProduible(estat, opcio);
    const entrades = Object.entries(opcio.entrades);
    const input = h('input', { type: 'number', min: 1, max: Math.max(1, max), value: Math.min(10, Math.max(1, max)), inputmode: 'numeric', 'aria-label': 'Quantitat' });
    const tempsTxt = h('span', { class: 'nota' });
    const actualitzarTemps = () => { tempsTxt.textContent = `Temps: ${joc.temps(joc.segonsProduccio(opcio, Number(input.value) || 0))}`; };
    input.addEventListener('input', actualitzarTemps);
    actualitzarTemps();

    cos.append(h('div', { class: 'opcio' },
      h('div', { class: 'opcio-cap' }, icona(opcio.recurs, 44),
        h('div', {}, h('strong', {}, RECURSOS[opcio.recurs].nom),
          h('span', { class: 'nota' }, `Es ven a ${joc.diners(RECURSOS[opcio.recurs].preu)} la unitat`))),
      entrades.length
        ? h('p', { class: 'necessita' }, 'Per unitat cal: ', ...entrades.map(([r, q]) =>
          h('span', { class: `ingredient${joc.quantitatA(estat, r) < q ? ' falta' : ''}` }, icona(r, 22), `${q} (tens ${joc.nombre(joc.quantitatA(estat, r))})`)))
        : h('p', { class: 'necessita' }, 'No necessita cap material.'),
      h('div', { class: 'opcio-accio' },
        h('button', { class: 'btn-pas', type: 'button', 'aria-label': 'Menys', onclick: () => { input.value = Math.max(1, (Number(input.value) || 1) - 1); actualitzarTemps(); } }, '−'),
        input,
        h('button', { class: 'btn-pas', type: 'button', 'aria-label': 'Més', onclick: () => { input.value = Math.min(Math.max(1, max), (Number(input.value) || 0) + 1); actualitzarTemps(); } }, '+'),
        h('button', {
          class: 'btn btn-principal', disabled: max < 1,
          onclick: () => accio(() => { joc.iniciarProduccio(estat, i, opcio.recurs, Number(input.value)); tancarPanell(); }),
        }, 'Produeix')),
      tempsTxt,
      max < 1 ? h('p', { class: 'nota falta' }, 'Et falta material: produeix-lo primer en un altre edifici.') : null,
      max >= MAX_PER_ORDRE ? h('p', { class: 'nota' }, `Màxim ${MAX_PER_ORDRE} unitats per ordre.`) : null));
  }
  return cos;
}

// ---------- magatzem ----------
function obrirMagatzem() {
  const items = Object.entries(estat.inventari).filter(([, q]) => q > 0);
  const cos = h('div', { class: 'bloc' });
  if (!items.length) {
    cos.append(h('img', { src: 'img/personatges/guia-pensa.webp', alt: '', width: 160, height: 160, class: 'panell-img' }),
      h('p', {}, 'El magatzem és buit. Toca un edifici teu i posa\'l a produir.'));
  } else {
    const llista = h('ul', { class: 'llista-magatzem' });
    for (const [r, q] of items) {
      const input = h('input', { type: 'number', min: 1, max: q, value: q, inputmode: 'numeric', 'aria-label': `Unitats de ${RECURSOS[r].nom} per vendre` });
      llista.append(h('li', {},
        icona(r, 40),
        h('div', { class: 'mag-info' }, h('strong', {}, RECURSOS[r].nom),
          h('span', { class: 'nota' }, `${joc.nombre(q)} unitats · ${joc.diners(RECURSOS[r].preu)} cadascuna`)),
        h('div', { class: 'mag-venda' }, input,
          h('button', {
            class: 'btn btn-principal',
            onclick: () => accio(() => { const ing = joc.vendre(estat, r, Number(input.value)); avis(`Venut per ${joc.diners(ing)}`, 'ok'); }),
          }, 'Ven'))));
    }
    cos.append(h('p', { class: 'nota' }, 'El mercat de l\'escola compra tot el que li vulguis vendre a preu fix.'), llista);
  }
  obrirPanell('Magatzem', cos, { tipus: 'magatzem' });
}
$('#btn-magatzem').addEventListener('click', obrirMagatzem);

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
