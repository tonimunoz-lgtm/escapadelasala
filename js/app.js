// =============================================================
//  FEM EMPRESA · versió 2: munta el teu negoci a Matadepera
// =============================================================
import { $, h, svg, avis, mostrarPantalla } from './ui.js';
import * as joc from './joc.js';
import * as desa from './desa.js';
import {
  SECTORS_NEGOCI, ZONES, OBRES_ADEQUACIO, FASES_NEGOCI, PUBLICITAT, CONSTRUCCIO, DIRECTORS, DESBLOQUEIG,
  HISTORIAL_MINUTS, XAT_ACTIU, NUM_LOGOS, BANC, FIANCA_MESOS, imgLogo, imgNegoci,
} from './dades.js';
import {
  FORMES, TRAMITS, OPCIONS_ESTATUTS, SERVEIS, PAS_SERVEI, DOC_PAS, PERSONAL, SS_EMPRESA, GESTORIA, RISC_SANCIO, SETMANES_PER_MES,
} from './legal.js';
import { crearCiutat, localsPerId, nomCarrerDe, EDIFICIS_CIUTAT } from './ciutat.js';

// append que ignora els buits (null/false) en lloc d'escriure "null"
const ap = (el, ...xs) => el.append(...xs.flat().filter((x) => x != null && x !== false));

// ---------- estat ----------
let usuari = null;
let estat = null;
let config = { ...desa.CONFIG_INICIAL };
let ciutat = null;
let locals = {};

async function desar() {
  try { await desa.desarEmpresa(usuari.uid, estat); } catch (err) { console.error(err); avis('No s\'ha pogut desar. Revisa la connexió.', 'error'); }
}
function accio(fn) {
  try { const r = fn(); desar(); dibuixarTot(); return r; } catch (err) { avis(err.message, 'error'); return undefined; }
}

// ---------- arrencada ----------
if (desa.modeProva) { $('#avis-prova').hidden = false; $('#btn-entrar').textContent = 'Prova el joc'; }
$('#btn-entrar').addEventListener('click', async () => { try { await desa.entrar(); } catch (err) { avis(`No s'ha pogut entrar: ${err.message}`, 'error'); } });
$('#btn-prof-prova').addEventListener('click', () => desa.entrarComProfessorProva());
$('#btn-panell-prof').addEventListener('click', () => tornarAlPanell());

desa.escoltarSessio(async (u) => {
  usuari = u;
  if (!u) { mostrarPantalla('pantalla-inici'); return; }
  try { config = await desa.getConfig(); } catch (err) { console.error(err); }
  if (desa.esProfessor(u, config) && !sessionStorage.getItem('fem-empresa-jugar')) {
    const m = await import('./professor.js');
    m.iniciar({ usuari: u, config, jugar: () => { sessionStorage.setItem('fem-empresa-jugar', '1'); entrarAlumne(); } });
    return;
  }
  entrarAlumne();
}).catch((err) => { console.error(err); avis('No s\'ha pogut connectar amb Firebase.', 'error'); mostrarPantalla('pantalla-inici'); });

async function entrarAlumne() {
  try { estat = await desa.carregarEmpresa(usuari.uid); } catch (err) { console.error(err); avis('No s\'han pogut carregar les dades.', 'error'); return; }
  if (estat && config.partida && estat.partida != null && estat.partida !== config.partida) estat = null;
  if (joc.esVersioAntiga(estat)) {
    if (estat) avis('El joc s\'ha renovat: ara muntaràs el teu negoci a Matadepera. Comences de nou!', 'ok');
    estat = joc.estatInicial();
    estat.partida = config.partida;
    await desar();
  }
  estat.partida ??= config.partida;
  joc.migrar(estat);
  iniciarJoc();
}

function tornarAlPanell() { sessionStorage.removeItem('fem-empresa-jugar'); location.reload(); }

// ---------- joc ----------
let rellotge = null;
async function iniciarJoc() {
  mostrarPantalla('pantalla-joc');
  aplicarConfig();
  ciutat = crearCiutat({ canvas: $('#mon-canvas'), onClic: clicCiutat });
  ciutat.vistaPoble();
  await carregarLocals();
  joc.simular(estat); joc.actualitzar(estat); joc.aplicarDespeses(estat); joc.aplicarInteressos(estat);
  dibuixarTot();
  clearInterval(rellotge);
  rellotge = setInterval(tic, 1000);
  setInterval(carregarLocals, 30000);
  setInterval(comprovarProfessorat, 45000);
  comprovarProfessorat();
  iniciarXat();
  if (!estat.tutorialVist) setTimeout(() => obrirPasIdea(), 600);
}

let darrerDesat = Date.now();
function tic() {
  joc.simular(estat);
  const msgs = [...joc.actualitzar(estat), ...joc.aplicarDespeses(estat)];
  joc.aplicarInteressos(estat);
  if (msgs.length) {
    msgs.forEach((m) => avis(m, 'ok'));
    // obres d'adequació acabades durant la constitució
    if (joc.pasActual(estat) === 'obres' && estat.local?.estat === 'llest') joc.avancarPas(estat);
    if (estat.localAnterior) { desa.alliberarLocal(estat.localAnterior); delete estat.localAnterior; }
    sincronitzarLocal(); desar(); dibuixarTot();
  }
  if (joc.registrarHistorial(estat) || Date.now() - darrerDesat > 30000) { darrerDesat = Date.now(); desar(); }
  dibuixarCapcalera();
  refrescarPanell();
}

function dibuixarTot() {
  dibuixarCapcalera();
  ciutat?.setLocals(locals, usuari.uid);
  ciutat?.setObjectiu(objectiuActual());
  refrescarPanell(true);
}

async function carregarLocals() {
  try {
    locals = await desa.carregarLocals();
    // competència: negocis oberts del mateix sector a la mateixa zona
    if (estat.local && estat.sector) {
      const zona = estat.local.zona;
      const n = Object.entries(locals).filter(([id, l]) => l.sector === estat.sector && l.estat === 'obert' && localsPerId[id]?.zona === zona).length;
      joc.setCompetencia(n || 1);
    }
    ciutat?.setLocals(locals, usuari.uid);
  } catch (err) { console.error(err); }
}

function dadesLocalPublic() {
  return { nom: estat.nom, logo: estat.logo, sector: estat.sector, fase: estat.local?.fase || 1, estat: estat.local?.estat || 'contracte', faseObra: estat.nouLocal?.faseObra || 0 };
}
async function sincronitzarLocal() {
  try {
    if (estat.local) { await desa.actualitzarLocal(usuari.uid, estat.local.id, dadesLocalPublic()); locals[estat.local.id] = { uid: usuari.uid, ...dadesLocalPublic() }; }
    if (estat.nouLocal) { await desa.actualitzarLocal(usuari.uid, estat.nouLocal.id, { ...dadesLocalPublic(), estat: 'construint', faseObra: estat.nouLocal.faseObra }); locals[estat.nouLocal.id] = { uid: usuari.uid, ...dadesLocalPublic(), estat: 'construint', faseObra: estat.nouLocal.faseObra }; }
    ciutat?.setLocals(locals, usuari.uid);
  } catch (err) { console.error(err); }
}

// ---------- capçalera: diners, nivell i guia ----------
const constituida = () => estat.constitucio.constituida;
function dibuixarCapcalera() {
  $('#barra-logo').src = imgLogo(estat.logo || 1);
  $('#barra-nom').textContent = estat.nom || 'La meva futura empresa';
  $('#barra-diners').textContent = constituida() || estat.diners > 0 ? joc.diners(estat.diners) : `${joc.diners(estat.estalvis)} (estalvis)`;
  $('#barra-diners').title = `Empresa: ${joc.diners(estat.diners)} · Estalvis personals: ${joc.diners(estat.estalvis)}`;
  const { nivell, fraccio } = joc.progresNivell(estat);
  $('#nivell-text').textContent = `Nivell ${nivell}`;
  $('#nivell-ple').style.width = `${Math.round(fraccio * 100)}%`;
  if (constituida() && nivell > (estat.nivellMax || 1)) { estat.nivellMax = nivell; avis(`Has pujat al nivell ${nivell}!`, 'ok'); desar(); }
  const boto = $('#missio');
  if (!constituida()) {
    const t = textGuia();
    boto.hidden = false;
    $('#missio-text').textContent = `→ ${t}`;
    $('#missio-premi').textContent = `Pas ${estat.constitucio.pas + 1} de ${joc.passos(estat).length}`;
    boto.classList.remove('feta');
    return;
  }
  const m = joc.missioActual(estat);
  boto.hidden = !m;
  if (m) {
    const fet = m.fet(estat);
    $('#missio-text').textContent = `→ ${m.text}`;
    $('#missio-premi').textContent = fet ? `Cobra ${joc.diners(m.premi)}` : `+${joc.diners(m.premi)}`;
    boto.classList.toggle('feta', fet);
  }
}
$('#missio').addEventListener('click', () => {
  if (!constituida()) {
    const obj = objectiuActual();
    if (obj) ciutat.centrarEn(obj);
    if (joc.pasActual(estat) === 'idea') obrirPasIdea();
    else avis(textGuia());
    return;
  }
  const m = joc.missioActual(estat);
  if (m?.fet(estat)) accio(() => { joc.cobrarMissio(estat); avis(`Missió completada: +${joc.diners(m.premi)}`, 'ok'); });
  else if (m) avis(`Missió: ${m.text}. Premi: ${joc.diners(m.premi)}.`);
});

// Què ha de fer ara l'alumne i on
function textGuia() {
  const p = joc.pasActual(estat);
  if (!p) return '';
  if (p === 'idea') return 'Parla amb la Marta: tria el nom i el sector del teu negoci';
  if (p === 'gestoria') return 'Ves a la Gestoria (al costat de l\'Ajuntament) per triar la forma jurídica';
  if (p === 'local') return 'Busca un local amb el cartell ES LLOGA i signa el contracte';
  if (p === 'obres') return estat.local?.estat === 'obres' ? 'Les obres estan en marxa...' : 'Ves al teu local i encarrega les obres d\'adequació';
  if (p === 'obertura') return 'Ves al teu local i obre les portes!';
  const servei = SERVEIS[PAS_SERVEI[p]];
  const ed = EDIFICIS_CIUTAT.find((e) => e[6] === PAS_SERVEI[p]);
  const lloc = ed && ed[2] >= 20 ? ' (a Terrassa, per la Carretera de Terrassa)' : '';
  return `Ves a ${servei?.nom || '?'}${lloc}: ${TRAMITS[p]?.nom || p}`;
}
function objectiuActual() {
  if (constituida()) return null;
  const p = joc.pasActual(estat);
  if (p === 'gestoria') return 'gestoria';
  if (p === 'obres' || p === 'obertura') return estat.local?.id || null;
  if (p === 'local' || p === 'idea') return null;
  return PAS_SERVEI[p] || null;
}

// ---------- clics a la ciutat ----------
function clicCiutat({ cella, local }) {
  if (!cella) return;
  if (cella.tipus === 'edifici' && cella.servei) return obrirServei(cella.servei, cella);
  if (cella.tipus === 'edifici') return avis(cella.nom);
  if (cella.tipus === 'local') {
    const info = localsPerId[cella.id];
    if ((estat.local && estat.local.id === cella.id) || (estat.nouLocal && estat.nouLocal.id === cella.id)) return obrirNegoci();
    if (local) return obrirLocalOcupat(info, local);
    return obrirLocalLliure(info);
  }
}

// ---------- escenes dins dels edificis ----------
let escenaTimer = null;
function obrirEscena({ servei, persona, interior, nomPersona, text, cos }) {
  const sv = SERVEIS[servei];
  $('#escena-fons').src = `img/interiors/${interior || sv?.interior || 'gestoria'}.webp`;
  $('#escena-persona').src = persona || `img/personatges/${sv?.persona || 'guia-explica'}.webp`;
  $('#escena-titol').textContent = sv?.nom || nomPersona || '';
  $('#escena-qui').textContent = nomPersona || sv?.personaNom || '';
  $('#escena-text').textContent = text || '';
  $('#escena-cos').replaceChildren(...[].concat(cos || []).flat().filter((x) => x != null && x !== false));
  $('#escena').hidden = false;
}
function tancarEscena() { $('#escena').hidden = true; clearInterval(escenaTimer); }
$('#escena-tancar').addEventListener('click', tancarEscena);
$('#escena').addEventListener('click', (ev) => { if (ev.target.id === 'escena') tancarEscena(); });

function obrirServei(servei, cella) {
  const pas = joc.pasActual(estat);
  const sv = SERVEIS[servei];
  // Pas de la constitució que toca aquí
  if (!constituida() && pas === 'gestoria' && servei === 'gestoria') return escenaGestoria();
  if (!constituida() && PAS_SERVEI[pas] === servei) return escenaTramit(pas);
  if (!constituida() && estat.constitucio.enCurs && PAS_SERVEI[estat.constitucio.enCurs.id] === servei) return escenaTramit(estat.constitucio.enCurs.id);
  // Serveis quan l'empresa ja funciona
  if (constituida()) {
    if (servei === 'banc') return escenaBanc();
    if (servei === 'gestoria') return escenaGestoriaServeis();
    if (servei === 'seguretat-social') return escenaSS();
  }
  const ara = textGuia();
  obrirEscena({ servei, text: `${sv.text}${!constituida() && ara ? `\n\nAra mateix t'has d'ocupar d'això: ${ara}.` : ''}`, cos: [] });
}

// Pas 1: la Marta et rep
function obrirPasIdea() {
  if (joc.pasActual(estat) !== 'idea') { avis(textGuia()); return; }
  const nom = h('input', { class: 'camp-text', maxlength: 24, placeholder: 'Ex.: Forn Sant Joan', value: estat.nomBase || '' });
  let sectorTriat = estat.sector || null;
  let logo = estat.logo || 1;
  const sectors = h('div', { class: 'triar-sector' }, ...Object.entries(SECTORS_NEGOCI).map(([id, s]) => {
    const b = h('button', { type: 'button', class: `carta-sector${sectorTriat === id ? ' triada' : ''}`, onclick: () => {
      sectorTriat = id; for (const x of sectors.children) x.classList.toggle('triada', x === b);
    } }, h('img', { src: imgNegoci(id, 1), alt: '', width: 96, height: 96 }), h('strong', {}, s.nom), h('span', { class: 'nota' }, s.text));
    return b;
  }));
  const logos = h('div', { class: 'graella-logos petita' }, ...Array.from({ length: NUM_LOGOS }, (_, k) => {
    const n = k + 1;
    const b = h('button', { type: 'button', class: `logo-boto${logo === n ? ' triat' : ''}`, onclick: () => { logo = n; for (const x of logos.children) x.classList.toggle('triat', x === b); } }, h('img', { src: imgLogo(n), alt: '', width: 44, height: 44 }));
    return b;
  }));
  obrirEscena({
    persona: 'img/personatges/guia-explica.webp', interior: 'ajuntament', nomPersona: 'La Marta, la teva mentora',
    text: `Benvingut/da a Matadepera! Tens ${joc.diners(estat.estalvis)} d'estalvis i una idea de negoci. Primer de tot: com es dirà i a què es dedicarà? Després t'acompanyaré pels llocs on es fan els tràmits, com a la vida real.`,
    cos: [
      h('label', { class: 'camp' }, h('span', {}, 'Nom del negoci'), nom),
      h('strong', {}, 'Sector'), sectors,
      h('strong', {}, 'Logo'), logos,
      h('button', { class: 'btn btn-principal btn-gran', onclick: () => {
        const t = nom.value.trim();
        if (t.length < 3) return avis('Escriu un nom de 3 lletres o més.', 'error');
        if (!sectorTriat) return avis('Tria un sector.', 'error');
        Object.assign(estat, { nomBase: t, nom: t, sector: sectorTriat, logo, tutorialVist: true });
        joc.avancarPas(estat); desar(); dibuixarTot(); tancarEscena();
        avis('Molt bé! Ara ves a la Gestoria: et diran quina forma jurídica et convé.', 'ok');
        ciutat.centrarEn('gestoria');
      } }, 'Som-hi!'),
    ],
  });
}

// Pas 2: a la gestoria es tria la forma jurídica i el capital
function escenaGestoria() {
  const formes = h('div', { class: 'formes petites' }, ...Object.entries(FORMES).map(([id, f]) => h('button', {
    type: 'button', class: `forma${estat.forma === id ? ' triada' : ''}`,
    onclick: () => { estat.forma = id; escenaCapital(); },
  }, h('strong', {}, f.nom),
  h('span', { class: 'nota' }, `${f.socisMin === f.socisMax ? '1 persona' : `${f.socisMin} socis o més`} · ${f.capitalMin ? `capital mínim ${joc.diners(f.capitalMin)}` : 'sense capital mínim'} · responsabilitat ${f.limitada ? 'limitada' : 'il·limitada'}`),
  h('span', { class: 'nota' }, f.avantatges))));
  obrirEscena({ servei: 'gestoria', text: `Hola! Així que vols obrir ${SECTORS_NEGOCI[estat.sector].nom.toLowerCase()}... Primer hem de decidir la forma jurídica: d'això depèn qui paga si les coses van malament, quins impostos pagaràs i quins tràmits caldrà fer. Mira-les i tria'n una.`, cos: formes });
}
function escenaCapital() {
  const f = FORMES[estat.forma];
  const socis = h('input', { type: 'number', min: f.socisMin, max: f.socisMax, value: Math.max(f.socisMin, estat.socis || f.socisMin), class: 'input-preu' });
  const meva = h('input', { type: 'number', min: 0, max: estat.estalvis, value: estat.aportacioMeva ?? Math.min(18000, estat.estalvis), class: 'input-preu' });
  const altres = h('input', { type: 'number', min: 0, value: estat.aportacioAltres ?? (f.socisMin > 1 ? 8000 : 0), class: 'input-preu' });
  const capital = h('input', { type: 'number', min: f.capitalMin, value: Math.max(f.capitalMin, 20000), class: 'input-preu' });
  const fAltres = h('label', { class: 'fila-preu' }, 'Aportació dels altres socis (€)', altres);
  const fCap = h('label', { class: 'fila-preu' }, 'Capital subscrit (€)', capital);
  const info = h('div', { class: 'avis-bloqueig' });
  const boto = h('button', { class: 'btn btn-principal' }, 'D\'acord, endavant');
  const calc = () => {
    const n = Number(socis.value) || 1, m = Number(meva.value) || 0, a = n > 1 ? Number(altres.value) || 0 : 0, des = m + a;
    const cap = f.capitalMin && f.desemborsMin < 1 ? Math.max(Number(capital.value) || 0, des) : des;
    fAltres.hidden = n <= 1; fCap.hidden = !(f.capitalMin && f.desemborsMin < 1);
    const err = [];
    if (n < f.socisMin) err.push(`Calen com a mínim ${f.socisMin} socis.`);
    if (m > estat.estalvis) err.push('No pots posar més del que tens.');
    if (f.capitalMin && cap < f.capitalMin) err.push(`El capital mínim és ${joc.diners(f.capitalMin)}.`);
    if (f.desemborsMin < 1 && des < cap * f.desemborsMin) err.push(`Cal desemborsar com a mínim el ${f.desemborsMin * 100}%.`);
    if (estat.forma === 'sll' && m > des / 3 + 0.5) err.push('En una societat laboral cap soci pot tenir més d\'un terç del capital.');
    info.replaceChildren(...[h('strong', {}, `L'empresa començarà amb ${joc.diners(des)}`),
      h('span', { class: 'nota' }, `Amb aquests diners pagaràs la fiança del local, les obres i la primera matèria primera. Et quedaran ${joc.diners(estat.estalvis - m)} d'estalvis per als tràmits.`),
      estat.forma === 'sl' && cap < 3000 ? h('span', { class: 'nota' }, 'Amb menys de 3.000 € de capital, el 20% dels beneficis va a reserva legal.') : null,
      !f.limitada ? h('span', { class: 'nota falta' }, 'Atenció: amb aquesta forma, si l\'empresa deu diners, en respons amb el teu patrimoni.') : null,
      ...err.map((t) => h('span', { class: 'nota falta' }, t))].filter(Boolean));
    boto.disabled = err.length > 0;
    return { n, m, a, des, cap };
  };
  for (const el of [socis, meva, altres, capital]) el.addEventListener('input', calc);
  boto.onclick = () => {
    const r = calc();
    Object.assign(estat, { socis: r.n, aportacioMeva: r.m, aportacioAltres: r.a, desemborsat: r.des, capital: r.cap });
    estat.nom = f.sufix ? `${estat.nomBase} ${f.sufix}` : estat.nomBase;
    estat.gestoria = true; // la gestoria t'acompanya des del principi
    joc.avancarPas(estat); desar(); dibuixarTot(); tancarEscena();
    avis(`Perfecte: ${estat.nom}. ${textGuia()}.`, 'ok');
    const o = objectiuActual(); if (o) ciutat.centrarEn(o);
  };
  obrirEscena({ servei: 'gestoria', text: `${f.nom}. ${f.responsabilitat} Ara decidim quants socis sou i quants diners hi poseu. Jo us portaré els papers d'ara endavant (${joc.diners(GESTORIA.fixe)} al mes).`,
    cos: [h('label', { class: 'fila-preu' }, 'Socis (comptant-te a tu)', socis), h('label', { class: 'fila-preu' }, f.capitalMin ? 'La teva aportació (€)' : 'Diners que poses al negoci (€)', meva), fAltres, fCap, info,
      h('div', { class: 'fila-botons' }, h('button', { class: 'btn', onclick: escenaGestoria }, '← Una altra forma'), boto)] });
  calc();
}

// Tràmit genèric en un edifici
function escenaTramit(id) {
  const t = TRAMITS[id];
  const servei = PAS_SERVEI[id];
  const c = estat.constitucio;
  const pinta = () => {
    const cos = [];
    cos.push(h('div', { class: 'tramit-fitxa' },
      h('img', { src: `img/documents/${DOC_PAS[id] || 'doc-estatuts'}.webp`, alt: '', width: 72, height: 72 }),
      h('div', {}, h('strong', {}, t.nom), h('span', { class: 'nota' }, `Cost: ${joc.dinersCost(id, estat) ? joc.diners(joc.dinersCost(id, estat)) : 'gratuït'} · Temps real: ${t.real}`))));
    if (c.enCurs?.id === id) {
      cos.push(h('div', { class: 'progres gran' }, h('span', { class: 'progres-ple', id: 'escena-barra', style: 'width:0%' })),
        h('p', { class: 'nota' }, 'En tràmit... ', h('strong', { id: 'escena-temps' }, '')));
    } else {
      if (id === 'estatuts') {
        cos.push(...Object.entries(OPCIONS_ESTATUTS).map(([oid, o]) => h('label', { class: 'opcio-radio' },
          h('input', { type: 'radio', name: 'estatuts', checked: (estat.estatuts || 'tipus') === oid, onchange: () => { estat.estatuts = oid; pinta(); } }),
          h('span', {}, h('strong', {}, `${o.nom}${o.cost ? ` (${joc.diners(o.cost)})` : ''}`), h('span', { class: 'nota' }, o.text)))));
      }
      cos.push(h('button', { class: 'btn btn-principal btn-gran', onclick: () => ferTramit(id) }, `Fes el tràmit${joc.dinersCost(id, estat) ? ` (${joc.diners(joc.dinersCost(id, estat))})` : ''}`));
    }
    obrirEscena({ servei, text: t.que, cos });
  };
  pinta();
  clearInterval(escenaTimer);
  escenaTimer = setInterval(() => {
    if (!c.enCurs) return;
    const b = document.getElementById('escena-barra');
    if (b) b.style.width = `${Math.min(100, ((Date.now() - c.enCurs.inici) / (c.enCurs.fi - c.enCurs.inici)) * 100)}%`;
    const tx = document.getElementById('escena-temps');
    if (tx) tx.textContent = joc.temps((c.enCurs.fi - Date.now()) / 1000);
    if (c.enCurs.fi <= Date.now()) acabarTramit();
  }, 300);
}

async function ferTramit(id) {
  const t = TRAMITS[id];
  const cost = joc.dinersCost(id, estat);
  if ((id === 'certificacio' || id === 'certificacioCoop')) {
    const lliure = await desa.nomDisponible(usuari.uid, estat.nomBase).catch(() => true);
    if (!lliure) {
      const nom = prompt(`Certificació denegada: ja hi ha una empresa que es diu "${estat.nomBase}". Proposa un altre nom:`, `${estat.nomBase} 2`);
      if (!nom || nom.trim().length < 3) return;
      estat.nomBase = nom.trim();
      const f = FORMES[estat.forma];
      estat.nom = f.sufix ? `${estat.nomBase} ${f.sufix}` : estat.nomBase;
      return ferTramit(id);
    }
  }
  if (estat.estalvis < cost) { avis('No tens prou estalvis per pagar aquest tràmit.', 'error'); return; }
  estat.estalvis -= cost;
  estat.costosConstitucio = (estat.costosConstitucio || 0) + cost;
  const ara = Date.now();
  estat.constitucio.enCurs = { id, inici: ara, fi: ara + t.segonsJoc * 1000 };
  desar(); escenaTramit(id);
}

function acabarTramit() {
  const c = estat.constitucio;
  const id = c.enCurs.id;
  delete c.enCurs;
  c.fets.push(id);
  const doc = DOC_PAS[id];
  if (doc && !c.docs.includes(doc)) c.docs.push(doc);
  // efectes de cada tràmit
  if (id === 'banc' || id === 'bancAutonom') { estat.estalvis -= estat.aportacioMeva; estat.diners += estat.desemborsat; }
  if ((id === 'nif' || id === 'nif036' || id === 'hisenda036') && !estat.nif) {
    const f = FORMES[estat.forma];
    const x = String(Math.floor(10000000 + Math.random() * 89999999));
    estat.nif = f.lletraNif ? `${f.lletraNif}${x}` : `${x}${'TRWAGMYFPDXBNJZSQVHLCKE'[Number(x) % 23]}`;
  }
  if (id === 'reta') estat.altaOcupador = true; // al joc, l'alta d'ocupador es fa alhora
  joc.avancarPas(estat);
  desar(); dibuixarTot();
  clearInterval(escenaTimer);
  const seguent = textGuia();
  obrirEscena({ servei: PAS_SERVEI[id], text: `Fet! Aquí tens el document: ${TRAMITS[id].nom}. L'he posat a la teva carpeta.\n\nSegüent pas: ${seguent}.`,
    cos: [h('img', { src: `img/documents/${doc || 'doc-estatuts'}.webp`, alt: '', width: 110, height: 110, class: 'doc-gran' }),
      h('button', { class: 'btn btn-principal', onclick: () => { tancarEscena(); const o = objectiuActual(); if (o) ciutat.centrarEn(o); } }, 'D\'acord')] });
}

// ---------- locals ----------
function obrirLocalLliure(info) {
  const z = ZONES[info.zona];
  const carrer = nomCarrerDe(info.X, info.Y);
  const cos = h('div', { class: 'bloc' });
  if (info.sub === 'solar') {
    const preu = joc.preuSolar(info);
    ap(cos, 
      h('img', { src: 'img/locals/solar-en-venda.webp', alt: '', width: 150, height: 150, class: 'panell-img' }),
      h('p', {}, `Solar en venda a ${carrer} (${z.nom}). Hi pots construir un edifici propi per al teu negoci: no pagaràs lloguer, però és una inversió gran.`),
      h('dl', { class: 'dades' }, h('dt', {}, 'Preu del solar'), h('dd', {}, joc.diners(preu)), h('dt', {}, 'Construcció'), h('dd', {}, joc.diners(CONSTRUCCIO.cost)), h('dt', {}, 'Clients que passen'), h('dd', {}, `${Math.round(z.gent * 100)}%`)),
      constituida() && joc.obert(estat) && !estat.nouLocal
        ? h('button', { class: 'btn btn-principal', onclick: async () => {
          try {
            await desa.reservarLocal(usuari.uid, info.id, { ...dadesLocalPublic(), estat: 'construint', faseObra: 1 });
            joc.comprarSolar(estat, info); await sincronitzarLocal(); desar(); dibuixarTot(); tancarPanell(); avis('Comencen les obres de l\'edifici nou!', 'ok');
          } catch (err) { avis(err.message, 'error'); desa.alliberarLocal(info.id).catch(() => {}); }
        } }, `Compra i construeix (${joc.diners(preu + CONSTRUCCIO.cost)})`)
        : h('p', { class: 'nota' }, 'Podràs comprar un solar quan el teu negoci ja funcioni.'));
    return obrirPanell('Solar en venda', cos, { tipus: 'local' });
  }
  const mensual = joc.lloguerMensual(info);
  const potLlogar = !estat.local && joc.pasActual(estat) === 'local';
  ap(cos, 
    h('img', { src: info.sub === 'nau' ? 'img/locals/nau-es-lloga.webp' : 'img/locals/local-es-lloga.webp', alt: '', width: 150, height: 150, class: 'panell-img' }),
    h('p', {}, `${info.sub === 'nau' ? 'Nau industrial' : 'Local'} en lloguer a ${carrer} (${z.nom}).`),
    h('dl', { class: 'dades' },
      h('dt', {}, 'Lloguer'), h('dd', {}, `${joc.diners(mensual)} al mes`),
      h('dt', {}, 'Fiança'), h('dd', {}, `${joc.diners(mensual * FIANCA_MESOS)} (${FIANCA_MESOS} mesos)`),
      h('dt', {}, 'Gent que hi passa'), h('dd', {}, z.gent >= 1 ? 'Molta' : z.gent >= 0.6 ? 'Normal' : 'Poca')),
    h('p', { class: 'nota' }, info.zona === 'centre' ? 'Al centre hi passa molta gent: ideal per a botigues i cafeteries, però el lloguer és car.' : info.zona === 'poligon' ? 'Al polígon el lloguer per metre és barat, però hi passa poca gent.' : 'Un barri tranquil: lloguer moderat i clients de proximitat.'),
    potLlogar ? h('button', { class: 'btn btn-principal btn-gran', onclick: async () => {
      try {
        await desa.reservarLocal(usuari.uid, info.id, dadesLocalPublic());
        joc.signarLloguer(estat, info);
        estat.constitucio.docs.push('doc-contracte-lloguer');
        joc.avancarPas(estat);
        locals[info.id] = { uid: usuari.uid, ...dadesLocalPublic() };
        await sincronitzarLocal(); desar(); dibuixarTot(); tancarPanell();
        avis(`Contracte signat! ${textGuia()}.`, 'ok');
        const o = objectiuActual(); if (o) ciutat.centrarEn(o);
      } catch (err) { avis(err.message, 'error'); }
    } }, 'Signa el contracte de lloguer') : h('p', { class: 'nota' }, estat.local ? 'Ja tens un local.' : 'Encara no toca: primer segueix els passos que et diu la Marta.'));
  obrirPanell(info.sub === 'nau' ? 'Nau en lloguer' : 'Local en lloguer', cos, { tipus: 'local' });
}

function obrirLocalOcupat(info, l) {
  const s = SECTORS_NEGOCI[l.sector];
  obrirPanell(l.nom || 'Empresa', h('div', { class: 'bloc' },
    h('img', { src: imgNegoci(l.sector, l.fase), alt: '', width: 150, height: 150, class: 'panell-img' }),
    h('p', {}, `${s?.nom || 'Negoci'} a ${nomCarrerDe(info.X, info.Y)}. ${l.estat === 'obert' ? 'Obert al públic.' : l.estat === 'construint' ? 'En construcció.' : 'Preparant l\'obertura.'}`),
    l.uid && !String(l.uid).startsWith('bot') ? h('button', { class: 'btn', onclick: () => obrirPerfil(l.uid) }, 'Veure l\'empresa') : h('p', { class: 'nota' }, 'Empresa del poble (fictícia).')), { tipus: 'local' });
}

// ---------- el meu negoci ----------
function obrirNegoci() {
  const l = estat.local;
  const s = SECTORS_NEGOCI[estat.sector];
  const pas = joc.pasActual(estat);
  const cos = h('div', { class: 'bloc' });
  const imatge = !l ? null : l.estat === 'obert' ? imgNegoci(estat.sector, l.fase) : l.estat === 'obres' ? 'img/locals/local-obres.webp' : 'img/locals/local-es-lloga.webp';
  if (imatge) ap(cos, h('div', { class: 'cap-edifici' }, h('img', { src: imatge, alt: '', width: 140, height: 140, class: 'panell-img' }), l?.estat === 'obert' ? h('span', { class: 'insignia-nivell' }, FASES_NEGOCI[l.fase].nom) : null));
  if (!l) { ap(cos, h('p', {}, 'Encara no tens local. Busca un local amb el cartell ES LLOGA.')); return obrirPanell('El meu negoci', cos, { tipus: 'negoci' }); }

  // Obres d'adequació (pas de la constitució)
  if (pas === 'obres' && l.estat === 'contracte') {
    ap(cos, h('p', {}, 'Abans d\'obrir has d\'adequar el local al teu negoci. Tria el tipus de reforma (es paga amb els diners de l\'empresa):'),
      ...Object.entries(OBRES_ADEQUACIO).map(([id, o]) => h('div', { class: 'opcio' },
        h('strong', {}, `${o.nom}: ${joc.diners(o.cost)}`), h('span', { class: 'nota' }, o.text),
        h('button', { class: 'btn btn-principal', disabled: estat.diners < o.cost, onclick: () => accio(() => { joc.iniciarObres(estat, id); sincronitzarLocal(); tancarPanell(); avis('Comencen les obres!', 'ok'); }) }, 'Encarrega les obres'))),
      estat.diners < OBRES_ADEQUACIO.basica.cost ? h('p', { class: 'nota falta' }, 'L\'empresa no té prou diners. Pots demanar un préstec al banc.') : null);
    return obrirPanell('El meu local', cos, { tipus: 'negoci' });
  }
  if (l.estat === 'obres') {
    ap(cos, h('p', {}, l.obra === 'ampliacio' ? 'Obres d\'ampliació en marxa: mentrestant el negoci està tancat.' : 'Obres d\'adequació en marxa.'),
      h('div', { class: 'progres gran' }, h('span', { class: 'progres-ple', 'data-inici': l.iniciObres, 'data-fi-barra': l.fiObres, style: 'width:0%' })),
      h('p', {}, 'Falten ', h('strong', { 'data-fi': l.fiObres }, joc.temps((l.fiObres - Date.now()) / 1000)), '.'));
    return obrirPanell('El meu local', cos, { tipus: 'negoci' });
  }
  if (pas === 'obertura') {
    ap(cos, h('p', {}, 'Tot a punt: tens els papers, el local adequat i els diners al compte. Obre les portes!'),
      h('button', { class: 'btn btn-principal btn-gran', onclick: () => {
        estat.local.estat = 'obert';
        estat.constitucio.constituida = true;
        joc.avancarPas(estat);
        estat.negoci.preu = s.producte.preuRef;
        estat.simT = Date.now(); estat.despesesT = Date.now();
        sincronitzarLocal(); desar(); dibuixarTot(); tancarPanell();
        obrirEscena({ persona: 'img/personatges/guia-celebra.webp', interior: 'ajuntament', nomPersona: 'La Marta',
          text: `Felicitats! ${estat.nom} ja és oberta. Ara compra matèria primera, posa el preu i contracta gent si cal. Vigila les despeses de cada setmana: lloguer, sous, subministraments...`,
          cos: [h('button', { class: 'btn btn-principal', onclick: () => { tancarEscena(); obrirNegoci(); } }, 'Anem al negoci')] });
      } }, 'Obre les portes!'));
    return obrirPanell('El meu local', cos, { tipus: 'negoci' });
  }
  if (!joc.obert(estat)) { ap(cos, h('p', {}, textGuia())); return obrirPanell('El meu negoci', cos, { tipus: 'negoci' }); }

  // Negoci obert
  const n = estat.negoci;
  const dem = joc.demandaHora(estat), cap = joc.capacitatHora(estat);
  const qMat = h('input', { type: 'number', min: 1, value: Math.round(cap), class: 'input-preu', 'aria-label': 'Quantitat' });
  const preu = h('input', { type: 'number', min: 0.1, step: 0.1, value: n.preu ?? s.producte.preuRef, class: 'input-preu', 'aria-label': 'Preu' });
  const prev = h('span', { class: 'nota' });
  const actPrev = () => { const d = joc.demandaHora(estat, Number(preu.value) || 0); prev.textContent = `Amb aquest preu vindrien uns ${joc.nombre(d)} clients/setmana (ingressos ${joc.diners(d * (Number(preu.value) || 0))} si hi ha prou producte).`; };
  preu.addEventListener('input', actPrev); actPrev();
  const costMat = h('span', { class: 'nota' });
  const actCost = () => { costMat.textContent = `Cost: ${joc.diners((Number(qMat.value) || 0) * s.materia.cost)}`; };
  qMat.addEventListener('input', actCost); actCost();
  const seg = FASES_NEGOCI[(l.fase || 1) + 1];
  const setm = joc.setmanaActual(estat);
  ap(cos, 
    h('div', { class: 'estoc-negoci' },
      h('div', {}, h('img', { src: s.materia.img, alt: '', width: 40, height: 40 }), h('span', { class: 'nota' }, s.materia.nom), h('strong', { 'data-viu': 'materia' }, joc.nombre(n.materia))),
      h('div', {}, h('span', { class: 'fletxa-prod' }, '→')),
      h('div', {}, h('img', { src: s.producte.img, alt: '', width: 40, height: 40 }), h('span', { class: 'nota' }, s.producte.nom), h('strong', { 'data-viu': 'producte' }, joc.nombre(n.producte)))),
    h('dl', { class: 'dades' },
      h('dt', {}, 'Capacitat de l\'equip'), h('dd', { 'data-viu': 'capacitat' }, `${joc.nombre(cap)} /setmana`),
      h('dt', {}, 'Clients que vindrien'), h('dd', { 'data-viu': 'demanda' }, `${joc.nombre(dem)} /setmana`),
      h('dt', {}, 'Venut aquesta setmana'), h('dd', { 'data-viu': 'venut' }, `${joc.nombre(setm.unitats)} (${joc.diners(setm.ing)})`)),
    cap < dem ? h('p', { class: 'nota falta' }, 'Hi ha més clients dels que podeu atendre: contracta gent o amplia el negoci.') : null,
    n.materia < cap * 0.2 ? h('p', { class: 'nota falta' }, 'Et queda poca matèria primera: sense ella no pots vendre!') : null,
    h('div', { class: 'opcio' }, h('strong', {}, `Compra ${s.materia.nom.toLowerCase()} al proveïdor`),
      h('span', { class: 'nota' }, `${joc.dinersDec(s.materia.cost)} per unitat.`),
      h('div', { class: 'opcio-accio' }, qMat, h('button', { class: 'btn btn-principal', onclick: () => accio(() => { const c = joc.comprarMateria(estat, Number(qMat.value)); avis(`Comprat per ${joc.diners(c)}`, 'ok'); }) }, 'Compra')), costMat),
    h('div', { class: 'opcio' }, h('strong', {}, 'Preu de venda'),
      h('span', { class: 'nota' }, `Preu habitual al poble: ${joc.dinersDec(s.producte.preuRef)}. Com més car, menys clients.`),
      h('div', { class: 'opcio-accio' }, preu, h('button', { class: 'btn', onclick: () => accio(() => { joc.fixarPreu(estat, preu.value); avis('Preu actualitzat', 'ok'); }) }, 'Desa el preu')), prev),
    h('div', { class: 'opcio' }, h('strong', {}, 'Publicitat'),
      h('div', { class: 'fila-botons' }, ...PUBLICITAT.map((p, k) => h('button', { class: `btn btn-petit${(n.publicitat || 0) === k ? ' btn-principal' : ''}`, onclick: () => accio(() => { joc.fixarPublicitat(estat, k); }) }, `${p.nom}${p.mensual ? ` (${joc.diners(p.mensual)}/mes)` : ''}`)))),
    h('div', { class: 'opcio' }, h('strong', {}, 'Personal'),
      h('span', {}, `Hi treballes tu i ${estat.plantilla.treballadors} ${s.ofici.toLowerCase()}${estat.plantilla.treballadors === 1 ? '' : 's'}.`),
      h('button', { class: 'btn', onclick: () => obrirEmpresa('personal') }, 'Gestiona el personal')),
    seg ? h('div', { class: 'opcio millora' }, h('strong', {}, `Amplia: ${seg.nom}`),
      h('span', { class: 'nota' }, `Més espai i visibilitat: ×${seg.demanda} clients i ×${seg.capacitat} capacitat. Obres de ${joc.temps(seg.segons)} amb el negoci tancat.`),
      h('button', { class: 'btn', disabled: estat.diners < seg.cost, onclick: () => accio(() => { joc.ampliar(estat); sincronitzarLocal(); tancarPanell(); avis('Comencen les obres d\'ampliació', 'ok'); }) }, `Amplia per ${joc.diners(seg.cost)}`)) : null,
    estat.nouLocal ? h('p', { class: 'nota' }, `Estàs construint un edifici propi: fase ${estat.nouLocal.faseObra} de 3.`) : h('p', { class: 'nota' }, 'Vols deixar de pagar lloguer? Compra un solar EN VENDA i construeix-hi el teu edifici.'));
  obrirPanell(estat.nom, cos, { tipus: 'negoci' });
}

// ---------- serveis quan l'empresa ja funciona ----------
function escenaBanc() {
  joc.aplicarInteressos(estat);
  const max = joc.maxPrestec(estat), deute = Math.ceil(estat.deute || 0);
  const imp = h('input', { type: 'number', min: 1, value: Math.min(max, 10000), class: 'input-preu' });
  obrirEscena({ servei: 'banc', text: `El compte de ${estat.nom} té ${joc.diners(estat.diners)}. Et puc deixar fins a ${joc.diners(max)} amb un interès del ${(joc.interesHora(estat) * 100).toFixed(1).replace('.', ',')}% setmanal. Deute actual: ${joc.diners(deute)}.`,
    cos: [h('label', { class: 'fila-preu' }, 'Import (€)', imp),
      h('div', { class: 'fila-botons' },
        h('button', { class: 'btn btn-principal', disabled: max < 1, onclick: () => { accio(() => { joc.demanarPrestec(estat, Number(imp.value)); avis('Préstec concedit', 'ok'); }); escenaBanc(); } }, 'Demana préstec'),
        h('button', { class: 'btn', disabled: deute < 1, onclick: () => { accio(() => { joc.retornarPrestec(estat, Number(imp.value)); avis('Has tornat diners', 'ok'); }); escenaBanc(); } }, 'Torna diners'))] });
}
function escenaGestoriaServeis() {
  obrirEscena({ servei: 'gestoria', text: estat.gestoria ? `Et portem els impostos i les nòmines per ${joc.diners(GESTORIA.fixe)} al mes + ${joc.diners(GESTORIA.perTreballador)} per nòmina.` : `Ara no et portem res: compte amb les sancions d'Hisenda (${Math.round(RISC_SANCIO.probabilitat * 100)}% de risc cada setmana).`,
    cos: [h('button', { class: estat.gestoria ? 'btn' : 'btn btn-principal', onclick: () => { accio(() => { estat.gestoria = !estat.gestoria; }); escenaGestoriaServeis(); } }, estat.gestoria ? 'Dona de baixa la gestoria' : 'Contracta la gestoria')] });
}
function escenaSS() {
  obrirEscena({ servei: 'seguretat-social', text: `L'empresa ${estat.altaOcupador ? 'ja està inscrita com a ocupadora' : 'encara no pot contractar'}. Ara tens ${estat.plantilla.treballadors} persones contractades. Cada contracte costa el sou brut més un ${Math.round(SS_EMPRESA * 100)}% de cotització a càrrec de l'empresa.`,
    cos: [h('button', { class: 'btn btn-principal', onclick: () => { tancarEscena(); obrirEmpresa('personal'); } }, 'Gestiona el personal')] });
}

// ---------- panell lateral ----------
let panell = null;
function obrirPanell(titol, contingut, info) {
  if (info.tipus === 'negoci') info.firma = firmaNegoci();
  $('#panell-titol').textContent = titol;
  $('#panell-cos').replaceChildren(contingut);
  $('#panell').hidden = false;
  $('#panell').classList.toggle('ample', !!info.ample);
  panell = info;
}
function tancarPanell() { $('#panell').hidden = true; panell = null; marcarNav('mapa'); }
$('#panell-tancar').addEventListener('click', tancarPanell);
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { tancarPanell(); tancarEscena(); } });
function firmaNegoci() {
  const l = estat.local;
  return JSON.stringify([l?.estat, l?.fase, l?.id, joc.pasActual(estat), estat.plantilla, estat.negoci?.publicitat, estat.negoci?.preu, estat.nouLocal?.faseObra, estat.negoci?.materia < 1]);
}
function valorsVius() {
  const n = estat.negoci, s = SECTORS_NEGOCI[estat.sector], setm = joc.setmanaActual(estat);
  return {
    materia: joc.nombre(n?.materia || 0), producte: joc.nombre(n?.producte || 0),
    capacitat: `${joc.nombre(joc.capacitatHora(estat))} /setmana`, demanda: `${joc.nombre(joc.demandaHora(estat))} /setmana`,
    venut: `${joc.nombre(setm.unitats)} (${joc.diners(setm.ing)})`, diners: joc.diners(estat.diners), s,
  };
}
function refrescarPanell(forcar = false) {
  if (!panell) return;
  for (const el of document.querySelectorAll('#panell [data-fi]')) el.textContent = joc.temps((Number(el.dataset.fi) - Date.now()) / 1000);
  for (const el of document.querySelectorAll('#panell [data-inici]')) {
    const a = Number(el.dataset.inici), b = Number(el.dataset.fiBarra);
    el.style.width = `${Math.min(100, ((Date.now() - a) / (b - a)) * 100)}%`;
  }
  if (panell.tipus === 'negoci') {
    // només es torna a dibuixar quan canvia alguna cosa important; els números es posen al dia sense redibuixar
    if (firmaNegoci() !== panell.firma && !document.activeElement?.matches('#panell input')) { obrirNegoci(); return; }
    const viu = valorsVius();
    for (const el of document.querySelectorAll('#panell [data-viu]')) el.textContent = viu[el.dataset.viu] ?? '';
  }
}

// ---------- navegació ----------
function marcarNav(s) { for (const b of document.querySelectorAll('.navegacio button')) b.classList.toggle('actiu', b.dataset.seccio === s); }
const SECCIONS = {
  mapa: () => { tancarPanell(); },
  negoci: () => { marcarNav('negoci'); if (estat.local) { ciutat.centrarEn(estat.local.id); obrirNegoci(); } else avis(textGuia()); },
  carpeta: () => { marcarNav('carpeta'); obrirCarpeta(); },
  empresa: () => obrirEmpresa(),
  cerca: () => obrirCerca(),
  xat: () => obrirXat(),
};
for (const b of document.querySelectorAll('.navegacio button')) b.addEventListener('click', () => SECCIONS[b.dataset.seccio]());
$('#zoom-mes').addEventListener('click', () => ciutat?.zoom(1.25));
$('#zoom-menys').addEventListener('click', () => ciutat?.zoom(1 / 1.25));
$('#zoom-mon').addEventListener('click', () => ciutat?.vistaTot());
$('#zoom-ciutat').addEventListener('click', () => ciutat?.vistaPoble());

function pestanyes(actual, llista) {
  return h('div', { class: 'pestanyes', role: 'tablist' }, ...llista.map(([id, text, fn, bloq]) => h('button', {
    class: `pestanya${id === actual ? ' actiu' : ''}`, role: 'tab', onclick: fn,
  }, text, bloq ? h('span', { class: 'cadenat' }, '🔒') : null)));
}

// ---------- carpeta de documents ----------
function obrirCarpeta() {
  const c = estat.constitucio;
  const passos = joc.passos(estat);
  const noms = { idea: 'Nom i sector (amb la Marta)', gestoria: 'Forma jurídica i capital (Gestoria)', local: 'Contracte de lloguer del local', obres: 'Obres d\'adequació', obertura: 'Obertura del negoci' };
  obrirPanell('La meva carpeta', h('div', { class: 'bloc' },
    h('p', { class: 'nota' }, 'Aquí guardes els documents que et donen a cada lloc.'),
    c.docs.length ? h('div', { class: 'carpeta' }, ...c.docs.map((d) => h('figure', {}, h('img', { src: `img/documents/${d}.webp`, alt: '', width: 90, height: 90 }), h('figcaption', {}, d.replace('doc-', '').replace(/-/g, ' '))))) : h('p', {}, 'Encara no tens cap document.'),
    h('h3', { class: 'subtitol' }, 'Passos per crear l\'empresa'),
    h('ol', { class: 'tramits petit' }, ...passos.map((p, k) => h('li', { class: k < c.pas ? 'fet' : k === c.pas ? 'actual' : '' },
      h('span', {}, noms[p] || `${TRAMITS[p]?.nom || p} (${SERVEIS[PAS_SERVEI[p]]?.nom || ''})`)))),
    estat.nif ? h('p', {}, `NIF de l'empresa: `, h('strong', {}, estat.nif)) : null), { tipus: 'carpeta' });
}

// ---------- empresa ----------
function obrirEmpresa(p = 'resum') {
  marcarNav('empresa');
  const n = joc.nivellEmpresa(estat);
  const tabs = pestanyes(p, [
    ['resum', 'Resum', () => obrirEmpresa('resum')],
    ['personal', 'Personal i despeses', () => obrirEmpresa('personal')],
    ['reptes', 'Reptes', () => obrirEmpresa('reptes')],
    ['directors', 'Directors', () => obrirEmpresa('directors'), n < DESBLOQUEIG.directors],
    ['classificacio', 'Classificació', () => obrirEmpresa('classificacio')],
  ]);
  const cos = h('div', { class: 'bloc' }, tabs);
  ({ resum: secResum, personal: secPersonal, reptes: secReptes, directors: secDirectors, classificacio: secClassificacio })[p](cos, n);
  obrirPanell(estat.nom || 'La meva empresa', cos, { tipus: 'empresa', ample: true });
}

function secResum(cos) {
  const fase = joc.faseEconomica();
  const b = joc.balanc(estat);
  const ant = joc.setmanaAnterior(estat), act = joc.setmanaActual(estat);
  const fila = (k, v, cl = '') => [h('dt', { class: cl }, k), h('dd', { class: cl }, v)];
  const pyg = (s, titol) => s ? h('div', { class: 'opcio' }, h('strong', {}, titol), h('dl', { class: 'dades balanc' },
    ...fila('Ingressos per vendes', joc.diners(s.ing)), ...fila('Matèria primera consumida', `−${joc.diners(s.mat)}`), ...fila('Despeses fixes (lloguer, sous...)', `−${joc.diners(s.fix)}`),
    ...fila(s.ing - s.mat - s.fix >= 0 ? 'Benefici' : 'Pèrdues', joc.diners(s.ing - s.mat - s.fix), 'total'))) : null;
  const rank = h('span', {}, '…');
  desa.classificacio(usuari.uid, estat).then((f) => { const k = f.findIndex((x) => x.uid === usuari.uid); rank.textContent = k >= 0 ? `${k + 1}a de ${f.length}` : 'n/d'; }).catch(() => { rank.textContent = 'n/d'; });
  const f = FORMES[estat.forma];
  ap(cos, 
    h('div', { class: `fase fase-${fase.clau}` }, h('span', { class: 'nota' }, 'Fase econòmica'), h('strong', {}, fase.nom), h('p', { class: 'nota' }, fase.text, fase.forcada ? ' (fixada pel professorat)' : '')),
    f ? h('div', { class: 'targeta-legal' }, h('div', {}, h('strong', {}, estat.nom), h('span', { class: 'nota' }, `${f.nom}${estat.nif ? `. NIF ${estat.nif}` : ''}. ${SECTORS_NEGOCI[estat.sector]?.iae || ''}`)),
      h('dl', { class: 'dades' }, ...fila('Capital', joc.diners(estat.capital || 0)), ...fila('Responsabilitat', f.limitada ? 'Limitada' : 'Il·limitada'), ...fila('Els teus estalvis', joc.diners(estat.estalvis)))) : null,
    pyg(act, 'Compte de resultats d\'aquesta setmana'), pyg(ant, 'Setmana passada'),
    h('div', { class: 'resum-graella' },
      h('div', { class: 'grafic' }, h('span', { class: 'nota' }, 'Valor de l\'empresa'), grafic()),
      h('div', {}, h('p', { class: 'rank' }, 'Posició: ', rank), h('dl', { class: 'dades balanc' },
        ...fila('Diners', joc.diners(b.diners)), ...fila('Estoc', joc.diners(b.estoc)), ...fila('Actius corrents', joc.diners(b.corrents), 'fort'),
        ...fila('Actius no corrents (obres, fiança, edificis)', joc.diners(b.noCorrents), 'fort'), ...fila('Passius (préstecs)', `−${joc.diners(b.passius)}`, 'fort'), ...fila('Patrimoni net', joc.diners(b.net), 'total')))),
    h('div', { class: 'fila-botons' },
      h('button', { class: 'btn', onclick: () => desa.sortir() }, 'Tanca la sessió'),
      desa.esProfessor(usuari, config) ? h('button', { class: 'btn btn-perill', onclick: async () => { if (confirm('Reiniciar la teva empresa?')) await reiniciarEmpresa(); } }, 'Reinicia la meva empresa') : null,
      desa.esProfessor(usuari, config) ? h('button', { class: 'btn btn-principal', onclick: tornarAlPanell }, 'Torna al panell del professorat') : null));
}
function grafic() {
  const p = estat.historial || [];
  if (p.length < 2) return h('p', { class: 'nota grafic-buit' }, `Es desa un punt cada ${HISTORIAL_MINUTS} minuts.`);
  const W = 320, H = 150, P = 6, vs = p.map((x) => x.v), mn = Math.min(...vs), mx = Math.max(...vs), r = mx - mn || 1;
  const X = (k) => P + (k / (p.length - 1)) * (W - 2 * P), Y = (v) => H - P - ((v - mn) / r) * (H - 2 * P);
  const d = p.map((q, k) => `${k ? 'L' : 'M'}${X(k).toFixed(1)},${Y(q.v).toFixed(1)}`).join(' ');
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'grafic-svg' });
  s.append(svg('path', { d: `${d} L${X(p.length - 1)},${H - P} L${X(0)},${H - P} Z`, fill: 'rgb(60 157 50 / .18)' }), svg('path', { d, fill: 'none', stroke: '#3c9d32', 'stroke-width': 3 }));
  return h('div', {}, s, h('div', { class: 'grafic-eix' }, h('span', {}, joc.diners(mn)), h('span', {}, joc.diners(mx))));
}

function secPersonal(cos) {
  const s = SECTORS_NEGOCI[estat.sector];
  const files = joc.despesesMensuals(estat), total = joc.totalMensual(estat);
  const rol = (id, nom, img, text) => {
    const nn = estat.plantilla[id] || 0;
    return h('div', { class: 'fila-director' }, h('img', { src: img, alt: '', width: 52, height: 52, class: 'foto-personal' }),
      h('div', { class: 'of-info' }, h('strong', {}, `${nom}: ${nn}`), h('span', {}, text),
        h('span', { class: 'nota' }, `Sou brut ${joc.diners(PERSONAL[id].sou)}/mes + Seguretat Social (~${Math.round(SS_EMPRESA * 100)}%) = ${joc.diners(joc.costPersona(id))}/mes`)),
      h('div', { class: 'fila-botons' },
        h('button', { class: 'btn', disabled: nn < 1, onclick: () => { accio(() => joc.acomiadar(estat, id)); obrirEmpresa('personal'); } }, '−1'),
        h('button', { class: 'btn btn-principal', onclick: () => { accio(() => { joc.contractar(estat, id); avis('Contracte signat', 'ok'); }); obrirEmpresa('personal'); } }, '+1')));
  };
  ap(cos, 
    h('div', { class: 'opcio' }, h('strong', {}, 'Despeses fixes cada mes'),
      h('dl', { class: 'dades balanc' }, ...files.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, joc.diners(v))]), h('dt', { class: 'total' }, 'Total'), h('dd', { class: 'total' }, joc.diners(total))),
      h('p', { class: 'nota' }, `1 hora real = 1 setmana: pagues uns ${joc.diners(total / SETMANES_PER_MES)} cada hora.`)),
    estat.altaOcupador ? null : h('p', { class: 'nota falta' }, 'Per contractar, l\'empresa s\'ha d\'inscriure a la Seguretat Social (es fa al tràmit d\'alta al RETA).'),
    rol('treballadors', s?.ofici || 'Treballador/a', 'img/personal/operari.webp', `Cada persona pot atendre ${joc.nombre(s?.capacitat || 0)} clients/setmana.`),
    rol('rrhh', 'Tècnic/a de RRHH', 'img/personal/rrhh.webp', 'Porta les nòmines: substitueix la gestoria laboral (val la pena amb molta plantilla).'),
    h('div', { class: 'opcio' }, h('div', { class: 'cap-amb-foto' }, h('img', { src: 'img/personal/gestoria.webp', alt: '', width: 56, height: 56, class: 'foto-personal' }), h('strong', {}, `Gestoria: ${estat.gestoria ? 'contractada' : 'no'}`)),
      h('p', { class: 'nota' }, GESTORIA.text),
      h('button', { class: 'btn', onclick: () => { accio(() => { estat.gestoria = !estat.gestoria; }); obrirEmpresa('personal'); } }, estat.gestoria ? 'Dona-la de baixa' : 'Contracta-la')));
}

function secReptes(cos) {
  const reptes = config.reptes || [];
  if (!reptes.length) { ap(cos, h('p', { class: 'nota' }, 'Ara no hi ha reptes del professorat.')); return; }
  for (const r of reptes) {
    const [a, b] = joc.progresRepte(estat, r), cobrat = estat.reptesCobrats.includes(r.id), cad = r.fins && Date.now() > r.fins;
    ap(cos, h('div', { class: `fila-director${cobrat ? ' contractat' : ''}` }, h('span', { class: 'trofeu' }, '🏆'),
      h('div', { class: 'of-info' }, h('strong', {}, joc.textRepte(r)), h('span', {}, `Premi: ${joc.diners(r.premi)}`), h('span', { class: 'nota' }, `Progrés: ${joc.nombre(Math.min(a, b))} de ${joc.nombre(b)}`)),
      cobrat ? h('span', { class: 'nota' }, 'Cobrat ✔') : h('button', { class: 'btn btn-principal', disabled: a < b || cad, onclick: () => { accio(() => { joc.cobrarRepte(estat, r); avis('Repte aconseguit!', 'ok'); }); obrirEmpresa('reptes'); } }, cad ? 'Caducat' : 'Cobra')));
  }
}
function secDirectors(cos, n) {
  if (n < DESBLOQUEIG.directors) { ap(cos, h('p', { class: 'avis-bloqueig' }, `Els directors es desbloquegen al nivell ${DESBLOQUEIG.directors}.`)); return; }
  for (const [id, d] of Object.entries(DIRECTORS)) {
    const te = !!estat.directors[id];
    ap(cos, h('div', { class: `fila-director${te ? ' contractat' : ''}` }, h('img', { src: imgLogo(d.logo), alt: '', width: 52, height: 52 }),
      h('div', { class: 'of-info' }, h('strong', {}, d.nom), h('span', {}, d.efecte), h('span', { class: 'nota' }, `Fitxatge ${joc.diners(d.fitxatge)}. Sou ${joc.diners(d.souHora)}/setmana.`)),
      h('button', { class: te ? 'btn' : 'btn btn-principal', onclick: () => { accio(() => (te ? joc.acomiadarDirector(estat, id) : joc.contractarDirector(estat, id))); obrirEmpresa('directors'); } }, te ? 'Acomiada' : 'Contracta')));
  }
}
function secClassificacio(cos) {
  const c = h('div', {}, h('p', { class: 'nota' }, 'Carregant…'));
  ap(cos, c);
  desa.classificacio(usuari.uid, estat).then((f) => {
    c.replaceChildren(h('ol', { class: 'llista-classificacio' }, ...f.map((x, k) => h('li', { class: x.uid === usuari.uid ? 'jo' : '' },
      h('span', { class: 'posicio' }, k + 1), h('img', { src: imgLogo(x.logo || 1), alt: '', width: 36, height: 36 }), h('span', { class: 'cl-nom' }, x.nom || '—'), h('span', { class: 'cl-valor' }, joc.diners(x.valor || 0))))));
  }).catch(() => c.replaceChildren(h('p', { class: 'nota falta' }, 'No s\'ha pogut carregar.')));
}

// ---------- cerca ----------
async function obrirCerca() {
  marcarNav('cerca');
  const llista = h('div', { class: 'llista-ofertes' }, h('p', { class: 'nota' }, 'Carregant…'));
  obrirPanell('Empreses de Matadepera', h('div', { class: 'bloc' }, llista), { tipus: 'cerca', ample: true });
  const files = Object.entries(locals).filter(([, l]) => l.nom);
  llista.replaceChildren(...(files.length ? files.map(([id, l]) => h('button', { class: 'fila-oferta fila-empresa', onclick: () => { tancarPanell(); ciutat.centrarEn(id); } },
    h('img', { src: imgLogo(l.logo || 1), alt: '', width: 34, height: 34 }),
    h('span', { class: 'of-info' }, h('strong', {}, l.nom), h('span', { class: 'nota' }, `${SECTORS_NEGOCI[l.sector]?.nom || ''} · ${nomCarrerDe(localsPerId[id]?.X || 0, localsPerId[id]?.Y || 0)} · ${l.estat === 'obert' ? FASES_NEGOCI[l.fase || 1].nom : 'preparant-se'}`)))) : [h('p', { class: 'nota' }, 'Encara no hi ha negocis.')]));
}
async function obrirPerfil(uid) {
  const id = Object.entries(locals).find(([, l]) => l.uid === uid)?.[0];
  if (id) { tancarPanell(); ciutat.centrarEn(id); }
}

// ---------- professorat: configuració, avisos i reptes ----------
function aplicarConfig() {
  joc.setFaseForcada(config.fase && config.fase !== 'auto' ? config.fase : null);
  $('#btn-panell-prof').hidden = !desa.esProfessor(usuari, config);
  $('#nav-xat').hidden = !(XAT_ACTIU && config.xatActiu !== false);
  $('#anunci').hidden = !config.anunci; $('#anunci').textContent = config.anunci || '';
  if (estat) for (const r of config.reptes || []) {
    if (estat.reptesVistos.includes(r.id)) continue;
    estat.reptesVistos.push(r.id);
    if (constituida()) avis(`Nou repte: ${joc.textRepte(r)} (+${joc.diners(r.premi)})`, 'ok');
  }
}
function missatgeProfessor(text) {
  const el = h('button', { class: 'notificacio prof-notif', onclick: () => el.remove() }, h('img', { src: 'img/personatges/guia-explica.webp', alt: '', width: 40, height: 40 }), h('span', {}, h('strong', {}, 'Professorat'), h('span', { class: 'prof-text' }, text)));
  $('#notificacions').append(el);
}
async function reiniciarEmpresa() {
  await desa.esborrarMevesOfertes(usuari.uid).catch(() => {});
  await desa.alliberarLocalsDe(usuari.uid).catch(() => {});
  estat = joc.estatInicial(); estat.partida = config.partida;
  await desar(); location.reload();
}
async function comprovarProfessorat() {
  try {
    const c = await desa.getConfig();
    if (estat.partida != null && c.partida && c.partida !== estat.partida) { config = c; await reiniciarEmpresa(); return; }
    config = c; aplicarConfig();
    const avs = await desa.avisosPendents(usuari.uid);
    for (const a of avs) {
      await desa.marcarLlegit(a.id);
      if (a.tipus === 'ajut') { estat.diners += a.import; missatgeProfessor(`${a.import >= 0 ? 'Subvenció' : 'Sanció'} de ${joc.diners(Math.abs(a.import))}. ${a.text || ''}`); }
      else if (a.tipus === 'missatge') missatgeProfessor(a.text);
      else if (a.tipus === 'reinici') { await reiniciarEmpresa(); return; }
    }
    if (avs.length) { await desar(); dibuixarTot(); }
  } catch (err) { console.error(err); }
}

// ---------- xat ----------
let missatgesXat = [], xatIniciat = false, ultimVist = Date.now();
async function iniciarXat() {
  if (!XAT_ACTIU || xatIniciat) return;
  xatIniciat = true;
  try {
    await desa.escoltarXat((llista) => {
      const nous = llista.filter((m) => m.creada > ultimVist && m.autor !== usuari.uid);
      missatgesXat = llista;
      if (panell?.tipus === 'xat') { dibuixarXat(); ultimVist = Date.now(); return; }
      for (const m of nous.slice(-3)) {
        const el = h('button', { class: 'notificacio', onclick: () => { el.remove(); obrirXat(); } }, h('img', { src: imgLogo(m.logo || 1), alt: '', width: 40, height: 40 }), h('span', {}, h('strong', {}, m.nom), h('span', {}, m.text)));
        $('#notificacions').append(el); setTimeout(() => el.remove(), 7000);
      }
      const pend = llista.filter((m) => m.creada > ultimVist && m.autor !== usuari.uid).length;
      $('#xat-nous').hidden = !pend; $('#xat-nous').textContent = pend;
    });
  } catch (err) { console.error(err); }
}
function obrirXat() {
  marcarNav('xat'); ultimVist = Date.now(); $('#xat-nous').hidden = true;
  const entrada = h('input', { maxlength: 200, placeholder: 'Escriu un missatge…', autocomplete: 'off' });
  obrirPanell('Xat de la classe', h('div', { class: 'xat' }, h('div', { id: 'xat-llista', class: 'xat-llista' }),
    h('form', { class: 'xat-form', onsubmit: async (ev) => { ev.preventDefault(); const t = entrada.value.trim(); if (!t) return; entrada.value = ''; try { await desa.enviarMissatge(usuari.uid, estat, t); } catch { avis('No s\'ha pogut enviar.', 'error'); } } },
      entrada, h('button', { class: 'btn btn-principal', type: 'submit' }, 'Envia')),
    h('p', { class: 'nota' }, 'Sigues respectuós: el professorat pot veure i esborrar els missatges.')), { tipus: 'xat', ample: true });
  dibuixarXat();
}
function dibuixarXat() {
  const l = document.getElementById('xat-llista');
  if (!l) return;
  l.replaceChildren(...(missatgesXat.length ? missatgesXat.map((m) => h('div', { class: `xat-msg${m.autor === usuari.uid ? ' meu' : ''}` }, h('img', { src: imgLogo(m.logo || 1), alt: '', width: 32, height: 32 }), h('div', {}, h('strong', {}, m.nom), h('p', {}, m.text)))) : [h('p', { class: 'nota' }, 'Encara no hi ha missatges.')]));
  l.scrollTop = l.scrollHeight;
}

// Accés per a proves automàtiques (només en mode de prova)
if (desa.modeProva) window.__fe = { obrirServei, obrirLocalLliure: (id) => obrirLocalLliure(localsPerId[id]), obrirNegoci, obrirCarpeta, obrirEmpresa, estat: () => estat, pas: () => joc.pasActual(estat) };
