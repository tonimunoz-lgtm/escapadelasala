import {
  EDIFICIS, RECURSOS, MIDA_MAPA, BLOC, COST_CARRETERA, NUM_LOGOS, MAX_PER_ORDRE, NIVELL_MAX,
  COMISSIO_BORSA, CATEGORIES, DESBLOQUEIG, BANC, HISTORIAL_MINUTS, XAT_ACTIU, DIRECTORS, QUALITAT,
  imgEdifici, imgRecurs, imgLogo, tempsConstruccio, preuReferencia,
} from './dades.js';
import * as joc from './joc.js';
import * as desa from './desa.js';
import {
  FORMES, TRAMITS, OPCIONS_ESTATUTS, OFICINES, PERSONAL, SS_EMPRESA, GESTORIA, SECTORS, SETMANES_PER_MES, RISC_SANCIO,
} from './legal.js';
import { crearMon, casellaParcela, origenSlot } from './mon.js';

import { $, h, svg, avis, mostrarPantalla } from './ui.js';

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

let config = { ...desa.CONFIG_INICIAL };
$('#btn-prof-prova').addEventListener('click', () => desa.entrarComProfessorProva());

desa.escoltarSessio(async (u) => {
  usuari = u;
  if (!u) { mostrarPantalla('pantalla-inici'); return; }
  try { config = await desa.getConfig(); } catch (err) { console.error(err); }
  // El professorat entra al seu panell (pot jugar també com a alumne)
  if (desa.esProfessor(u, config) && !sessionStorage.getItem('fem-empresa-jugar')) {
    const m = await import('./professor.js');
    m.iniciar({ usuari: u, config, jugar: () => { sessionStorage.setItem('fem-empresa-jugar', '1'); entrarAlumne(); } });
    return;
  }
  entrarAlumne();
}).catch((err) => {
  console.error(err);
  avis('No s\'ha pogut connectar amb Firebase. Revisa js/firebase-config.js.', 'error');
  mostrarPantalla('pantalla-inici');
});

async function entrarAlumne() {
  try {
    estat = await desa.carregarEmpresa(usuari.uid);
  } catch (err) {
    console.error(err);
    avis('No s\'han pogut carregar les dades.', 'error');
    mostrarPantalla('pantalla-inici');
    return;
  }
  // Partida nova del professorat: es torna a començar
  if (estat && config.partida && estat.partida != null && estat.partida !== config.partida) estat = null;
  if (!estat) { estat = joc.estatInicial('', 1); estat.partida = config.partida; await desar(); }
  if (estat.partida == null) estat.partida = config.partida;
  joc.migrar(estat);
  aplicarConfig();
  if (!estat.constitucio.constituida) { obrirConstitucio(); return; }
  iniciarJoc();
}

// ---------- ordres del professorat (config/joc i avisos) ----------
function aplicarConfig() {
  joc.setFaseForcada(config.fase && config.fase !== 'auto' ? config.fase : null);
  $('#nav-xat').hidden = !(XAT_ACTIU && config.xatActiu !== false);
  $('#anunci').hidden = !config.anunci;
  $('#anunci').textContent = config.anunci || '';
  if (estat) {
    estat.reptesVistos ??= [];
    for (const r of config.reptes || []) {
      if (estat.reptesVistos.includes(r.id)) continue;
      estat.reptesVistos.push(r.id);
      if (estat.constitucio?.constituida) avis(`Nou repte del professorat: ${joc.textRepte(r)} (+${joc.diners(r.premi)})`, 'ok');
    }
  }
}

function missatgeProfessor(text) {
  const el = h('button', { class: 'notificacio prof-notif', onclick: () => el.remove() },
    h('img', { src: 'img/personatges/guia-explica.webp', alt: '', width: 40, height: 40 }),
    h('span', {}, h('strong', {}, 'Professorat'), h('span', { class: 'prof-text' }, text)));
  $('#notificacions').append(el);
}

async function reiniciarEmpresa() {
  await desa.esborrarMevesOfertes(usuari.uid).catch(() => {});
  const slot = estat.slot;
  estat = joc.estatInicial('', 1);
  estat.slot = slot;
  estat.partida = config.partida;
  await desar();
  location.reload();
}

async function comprovarProfessorat() {
  try {
    const c = await desa.getConfig();
    if (estat.partida != null && c.partida && c.partida !== estat.partida) {
      config = c;
      estat = joc.estatInicial('', 1);
      estat.partida = c.partida;
      await desar();
      location.reload();
      return;
    }
    config = c;
    aplicarConfig();
    const avisos = await desa.avisosPendents(usuari.uid);
    for (const a of avisos) {
      await desa.marcarLlegit(a.id);
      if (a.tipus === 'ajut') {
        estat.diners += a.import;
        missatgeProfessor(`${a.import >= 0 ? 'Has rebut una subvenció' : 'Has rebut una sanció'} de ${joc.diners(Math.abs(a.import))}. ${a.text || ''}`);
      } else if (a.tipus === 'missatge') {
        missatgeProfessor(a.text);
      } else if (a.tipus === 'reinici') {
        await reiniciarEmpresa();
        return;
      }
    }
    if (avisos.length) { await desar(); dibuixarTot(); }
  } catch (err) { console.error(err); }
}

// ---------- constitució de l'empresa (primer pas del joc) ----------
let rellotgeTramit = null;

function nomComplet(e) {
  const f = FORMES[e.forma];
  return f && f.sufix ? `${e.nomBase} ${f.sufix}` : (e.nomBase || 'La meva empresa');
}

function obrirConstitucio() {
  mostrarPantalla('pantalla-crear');
  dibuixarConstitucio();
  clearInterval(rellotgeTramit);
  rellotgeTramit = setInterval(() => {
    const c = estat?.constitucio;
    if (!c || c.constituida) { clearInterval(rellotgeTramit); return; }
    if (c.enCurs && c.enCurs.fi <= Date.now()) {
      c.fets.push(c.enCurs.id);
      avis(`Tràmit fet: ${TRAMITS[c.enCurs.id].nom}`, 'ok');
      delete c.enCurs;
      desar();
      dibuixarConstitucio();
    } else if (c.enCurs) {
      const el = document.querySelector('#constitucio [data-fi]');
      if (el) el.textContent = joc.temps((Number(el.dataset.fi) - Date.now()) / 1000);
      const b = document.querySelector('#constitucio [data-inici]');
      if (b) b.style.width = `${Math.min(100, ((Date.now() - c.enCurs.inici) / (c.enCurs.fi - c.enCurs.inici)) * 100)}%`;
    }
  }, 500);
}

const PASSOS = [['forma', 'Forma jurídica'], ['socis', 'Socis i capital'], ['nom', 'Nom'], ['oficina', 'Domicili'], ['tramits', 'Tràmits'], ['fet', 'A punt!']];

function dibuixarConstitucio() {
  const c = estat.constitucio;
  const cont = $('#constitucio');
  const idx = PASSOS.findIndex(([p]) => p === c.pas);
  const progres = h('ol', { class: 'passos' }, ...PASSOS.map(([p, t], k) => h('li', { class: k < idx ? 'fet' : k === idx ? 'actiu' : '' }, h('span', {}, k + 1), t)));
  const cap = h('div', { class: 'cons-cap' },
    h('img', { src: 'img/personatges/guia-explica.webp', alt: '', width: 110, height: 110 }),
    h('div', {}, h('h2', {}, 'Crea la teva empresa'),
      h('p', { class: 'nota' }, `Tens ${joc.diners(estat.estalvis)} d'estalvis. Seguiràs els mateixos passos que a la vida real per crear una empresa a Catalunya.`)));
  const cos = {
    forma: pasForma, socis: pasSocis, nom: pasNom, oficina: pasOficina, tramits: pasTramits, fet: pasFet,
  }[c.pas]();
  cont.replaceChildren(cap, progres, cos);
  cont.scrollTop = 0;
}

function anarA(pas) { estat.constitucio.pas = pas; desar(); dibuixarConstitucio(); }
const botoTornar = (pas) => h('button', { class: 'btn', type: 'button', onclick: () => anarA(pas) }, '← Enrere');

function pasForma() {
  const sector = h('select', { class: 'camp-select', 'aria-label': 'Sector' },
    ...Object.entries(SECTORS).map(([id, s]) => h('option', { value: id, selected: estat.sector === id }, s.nom)));
  const graella = h('div', { class: 'formes' });
  for (const [id, f] of Object.entries(FORMES)) {
    graella.append(h('button', {
      class: `forma${estat.forma === id ? ' triada' : ''}`, type: 'button',
      onclick: () => { estat.forma = id; estat.sector = sector.value; anarA('socis'); },
    },
    h('strong', {}, f.nom),
    h('dl', {},
      h('dt', {}, 'Socis'), h('dd', {}, f.socisMin === f.socisMax ? `${f.socisMin}` : `${f.socisMin} o més`),
      h('dt', {}, 'Capital mínim'), h('dd', {}, f.capitalMin ? joc.diners(f.capitalMin) + (f.desemborsMin < 1 ? ` (${f.desemborsMin * 100}% a l'inici)` : '') : 'No cal'),
      h('dt', {}, 'Responsabilitat'), h('dd', {}, f.limitada ? 'Limitada' : 'Il·limitada'),
      h('dt', {}, 'Impostos'), h('dd', {}, f.tributacio)),
    h('p', { class: 'nota' }, f.avantatges),
    h('p', { class: 'nota falta' }, f.inconvenients)));
  }
  return h('div', { class: 'bloc' },
    h('p', {}, 'Primer de tot: a què et dedicaràs i quina forma jurídica tindrà la teva empresa? La forma jurídica decideix qui respon dels deutes, quins impostos pagues, quant capital cal i quins tràmits has de fer.'),
    h('label', { class: 'camp' }, h('span', {}, 'Sector de l\'activitat'), sector),
    graella);
}

function pasSocis() {
  const f = FORMES[estat.forma];
  const socis = h('input', { type: 'number', min: f.socisMin, max: f.socisMax, value: Math.max(f.socisMin, estat.socis || f.socisMin), class: 'input-preu' });
  const meva = h('input', { type: 'number', min: 0, max: estat.estalvis, value: estat.aportacioMeva ?? Math.min(15000, estat.estalvis), class: 'input-preu' });
  const altres = h('input', { type: 'number', min: 0, max: 200000, value: estat.aportacioAltres ?? (f.socisMin > 1 ? 5000 : 0), class: 'input-preu' });
  const capital = h('input', { type: 'number', min: f.capitalMin, value: estat.capital ?? Math.max(f.capitalMin, 15000), class: 'input-preu' });
  const info = h('div', { class: 'avis-bloqueig' });
  const filaAltres = h('label', { class: 'fila-preu' }, 'Aportació dels altres socis (€)', altres);
  const filaCapital = h('label', { class: 'fila-preu' }, 'Capital social subscrit (€)', capital);
  const calcula = () => {
    const n = Number(socis.value) || 1, m = Number(meva.value) || 0, a = n > 1 ? Number(altres.value) || 0 : 0;
    filaAltres.hidden = n <= 1;
    const desemb = m + a;
    const cap = f.capitalMin ? Math.max(Number(capital.value) || 0, desemb) : desemb;
    filaCapital.hidden = !f.capitalMin || f.desemborsMin >= 1;
    const errors = [];
    if (n < f.socisMin) errors.push(`Aquesta forma necessita com a mínim ${f.socisMin} socis.`);
    if (m > estat.estalvis) errors.push('No pots aportar més del que tens d\'estalvis.');
    if (f.capitalMin && cap < f.capitalMin) errors.push(`El capital mínim és ${joc.diners(f.capitalMin)}.`);
    if (f.desemborsMin < 1 && desemb < cap * f.desemborsMin) errors.push(`Cal desemborsar com a mínim el ${f.desemborsMin * 100}% (${joc.diners(cap * f.desemborsMin)}).`);
    if (estat.forma === 'sll' && m > desemb / 3 + 0.5) errors.push('En una societat laboral cap soci pot tenir més d\'un terç del capital.');
    const avisos = [];
    if (estat.forma === 'sl' && cap < 3000) avisos.push('Amb menys de 3.000 € de capital, el 20% dels beneficis anirà a reserva legal i en cas de liquidació respondries fins a 3.000 €.');
    if (!f.limitada) avisos.push('Recorda: amb aquesta forma, si l\'empresa no pot pagar, es faran servir els teus estalvis personals.');
    info.replaceChildren(
      h('strong', {}, `Diners que tindrà l'empresa per començar: ${joc.diners(desemb)}`),
      h('span', {}, `Et quedaran ${joc.diners(estat.estalvis - m)} d'estalvis personals per pagar els tràmits i per si de cas.`),
      ...avisos.map((t) => h('span', { class: 'nota' }, t)),
      ...errors.map((t) => h('span', { class: 'nota falta' }, t)));
    seguent.disabled = errors.length > 0;
    return { n, m, a, desemb, cap };
  };
  const seguent = h('button', {
    class: 'btn btn-principal', type: 'button',
    onclick: () => {
      const r = calcula();
      Object.assign(estat, { socis: r.n, aportacioMeva: r.m, aportacioAltres: r.a, desemborsat: r.desemb, capital: r.cap });
      anarA('nom');
    },
  }, 'Següent');
  for (const el of [socis, meva, altres, capital]) el.addEventListener('input', calcula);
  const r = h('div', { class: 'bloc' },
    h('h3', { class: 'subtitol' }, f.nom),
    h('p', {}, f.capitalMin
      ? 'El capital social són els diners que els socis posen a l\'empresa. No és una despesa: queden al compte de l\'empresa per invertir. A canvi, cada soci rep participacions o accions.'
      : 'Com a autònom/a no hi ha capital social: decideixes quants dels teus estalvis poses al negoci.'),
    h('label', { class: 'fila-preu' }, 'Nombre de socis (comptant-te a tu)', socis),
    h('label', { class: 'fila-preu' }, f.capitalMin ? 'La teva aportació (€)' : 'Diners que poses al negoci (€)', meva),
    filaAltres, filaCapital, info,
    h('div', { class: 'fila-botons' }, botoTornar('forma'), seguent));
  calcula();
  return r;
}

function pasNom() {
  const f = FORMES[estat.forma];
  const nom = h('input', { maxlength: 24, value: estat.nomBase || '', placeholder: 'Per exemple: Forn de Sabadell', class: 'camp-text', 'aria-label': 'Nom' });
  const mostra = h('p', { class: 'nom-final' });
  const pinta = () => { mostra.textContent = f.sufix ? `${nom.value.trim() || '...'} ${f.sufix}` : (nom.value.trim() || '...'); };
  nom.addEventListener('input', pinta); pinta();
  const graella = h('div', { class: 'graella-logos' });
  for (let n = 1; n <= NUM_LOGOS; n++) {
    graella.append(h('label', { class: 'logo-opcio' },
      h('input', { type: 'radio', name: 'logo', value: n, checked: (estat.logo || 1) === n }),
      h('img', { src: imgLogo(n), alt: `Logo ${n}`, width: 64, height: 64 })));
  }
  const necessitaCert = f.tramits.includes('certificacio') || f.tramits.includes('certificacioCoop');
  return h('div', { class: 'bloc' },
    h('p', {}, necessitaCert
      ? `La denominació social ha de ser única. Quan facis el tràmit de certificació negativa, el registre comprovarà que cap altra empresa no la té. La forma jurídica ha d'aparèixer al nom: "${f.sufix}".`
      : 'Com a autònom/a factures amb el teu nom, però pots fer servir un nom comercial. Si el vols protegir, el pots registrar com a marca a l\'Oficina Espanyola de Patents i Marques.'),
    h('label', { class: 'camp' }, h('span', {}, necessitaCert ? 'Denominació social' : 'Nom comercial'), nom),
    mostra,
    h('fieldset', { class: 'camp' }, h('legend', {}, 'Tria un logo'), graella),
    h('div', { class: 'fila-botons' }, botoTornar('socis'), h('button', {
      class: 'btn btn-principal', type: 'button',
      onclick: async () => {
        const t = nom.value.trim();
        if (t.length < 3) { avis('Escriu un nom de 3 lletres o més.', 'error'); return; }
        estat.nomBase = t;
        estat.logo = Number(graella.querySelector('input:checked')?.value) || 1;
        estat.nom = nomComplet(estat);
        anarA('oficina');
      },
    }, 'Següent')));
}

function pasOficina() {
  const llista = h('div', { class: 'formes' });
  for (const [id, o] of Object.entries(OFICINES)) {
    llista.append(h('button', {
      class: `forma${estat.oficina === id ? ' triada' : ''}`, type: 'button',
      onclick: () => { estat.oficina = id; anarA('tramits'); },
    }, h('strong', {}, o.nom),
    h('dl', {}, h('dt', {}, 'Lloguer'), h('dd', {}, `${joc.diners(o.mensual)} al mes`), h('dt', {}, 'Fiança'), h('dd', {}, o.fianca ? joc.diners(o.fianca) : 'No cal')),
    h('p', { class: 'nota' }, o.text)));
  }
  return h('div', { class: 'bloc' },
    h('p', {}, 'Tota empresa necessita un domicili social, que surt als estatuts i a les factures. Pots llogar des d\'una simple adreça fins a un local. El lloguer es paga cada mes i la fiança la recuperes si te\'n vas.'),
    h('p', { class: 'nota' }, 'Al joc, 1 hora real equival a 1 setmana de l\'empresa: les despeses mensuals es van cobrant a poc a poc.'),
    llista, botoTornar('nom'));
}

function pasTramits() {
  const c = estat.constitucio;
  const f = FORMES[estat.forma];
  const llista = h('ol', { class: 'tramits' });
  let total = 0;
  const seguent = f.tramits.find((t) => !c.fets.includes(t));
  for (const id of f.tramits) {
    const t = TRAMITS[id];
    const cost = joc.dinersCost(id, estat);
    total += cost;
    const fet = c.fets.includes(id);
    const actual = id === seguent;
    const item = h('li', { class: fet ? 'fet' : actual ? 'actual' : '' },
      h('div', { class: 'tram-cap' }, h('strong', {}, t.nom), h('span', { class: 'tram-cost' }, cost ? joc.diners(cost) : 'Gratuït')),
      h('span', { class: 'nota' }, `${t.on}. Temps real: ${t.real}.`));
    if (actual || fet) item.append(h('p', {}, t.que));
    if (actual) {
      if (c.enCurs) {
        item.append(h('div', { class: 'progres gran' }, h('span', { class: 'progres-ple', 'data-inici': c.enCurs.inici, style: 'width:0%' })),
          h('p', { class: 'nota' }, 'En tràmit… falten ', h('strong', { 'data-fi': c.enCurs.fi }, joc.temps((c.enCurs.fi - Date.now()) / 1000))));
      } else {
        if (t.opcions) {
          item.append(h('div', { class: 'opcions-estatuts' }, ...Object.entries(OPCIONS_ESTATUTS).map(([oid, o]) => h('label', { class: 'opcio-radio' },
            h('input', { type: 'radio', name: 'estatuts', value: oid, checked: (estat.estatuts || 'tipus') === oid, onchange: () => { estat.estatuts = oid; dibuixarConstitucio(); } }),
            h('span', {}, h('strong', {}, `${o.nom}${o.cost ? ` (${joc.diners(o.cost)})` : ''}`), h('span', { class: 'nota' }, o.text))))));
        }
        item.append(h('button', {
          class: 'btn btn-principal', type: 'button',
          onclick: async () => {
            let cost2 = joc.dinersCost(id, estat);
            if (t.nom_) {
              const lliure = await desa.nomDisponible(usuari.uid, estat.nomBase).catch(() => true);
              if (!lliure) {
                estat.constitucio.pas = 'nom';
                avis(`Certificació denegada: ja existeix una empresa que es diu "${estat.nomBase}". Tria un altre nom.`, 'error');
                desar(); dibuixarConstitucio(); return;
              }
            }
            if (estat.estalvis < cost2) { avis('No tens prou estalvis per pagar aquest tràmit.', 'error'); return; }
            estat.estalvis -= cost2;
            estat.costosConstitucio = (estat.costosConstitucio || 0) + cost2;
            const ara = Date.now();
            c.enCurs = { id, inici: ara, fi: ara + t.segonsJoc * 1000 };
            desar(); dibuixarConstitucio();
          },
        }, `Fes el tràmit${cost ? ` (${joc.diners(cost)})` : ''}`));
      }
    }
    llista.append(item);
  }
  const acabat = !seguent && !c.enCurs;
  return h('div', { class: 'bloc' },
    h('p', {}, `Aquests són els tràmits per crear una empresa com a ${f.nom.toLowerCase()} a Catalunya, en ordre. Els costos els pagues dels teus estalvis (són despeses de constitució). Cost total aproximat: ${joc.diners(total)}.`),
    h('p', { class: 'nota' }, 'Truc real: als Punts d\'Atenció a l\'Emprenedor (PAE) i amb el sistema CIRCE pots fer molts d\'aquests tràmits en línia i d\'una sola vegada.'),
    llista,
    h('div', { class: 'fila-botons' }, c.fets.length ? null : botoTornar('oficina'),
      h('button', { class: 'btn btn-principal', type: 'button', disabled: !acabat, onclick: () => anarA('fet') }, 'Veure el resultat')));
}

function pasFet() {
  const f = FORMES[estat.forma];
  if (!estat.nif) {
    const xifres = String(Math.floor(10000000 + Math.random() * 89999999));
    estat.nif = f.lletraNif ? `${f.lletraNif}${xifres}` : `${xifres}${'TRWAGMYFPDXBNJZSQVHLCKE'[Number(xifres) % 23]}`;
  }
  const fianca = OFICINES[estat.oficina]?.fianca || 0;
  const diners = estat.desemborsat - fianca;
  return h('div', { class: 'bloc' },
    h('div', { class: 'escriptura' },
      h('span', { class: 'nota' }, f.lletraNif ? 'Empresa inscrita' : 'Alta d\'activitat'),
      h('strong', { class: 'nom-final' }, estat.nom),
      h('dl', { class: 'dades' },
        h('dt', {}, 'Forma jurídica'), h('dd', {}, f.nom),
        h('dt', {}, f.lletraNif ? 'NIF' : 'NIF (el teu DNI)'), h('dd', {}, estat.nif),
        h('dt', {}, 'Socis'), h('dd', {}, String(estat.socis)),
        h('dt', {}, f.capitalMin ? 'Capital social' : 'Diners al negoci'), h('dd', {}, joc.diners(estat.capital)),
        h('dt', {}, 'Desemborsat'), h('dd', {}, joc.diners(estat.desemborsat)),
        h('dt', {}, 'Domicili'), h('dd', {}, OFICINES[estat.oficina].nom),
        h('dt', {}, 'Despeses de constitució'), h('dd', {}, joc.diners(estat.costosConstitucio || 0)),
        h('dt', {}, 'Fiança de l\'oficina'), h('dd', {}, joc.diners(fianca)),
        h('dt', {}, 'Diners al compte de l\'empresa'), h('dd', {}, joc.diners(diners)),
        h('dt', {}, 'Els teus estalvis'), h('dd', {}, joc.diners(estat.estalvis - estat.aportacioMeva)))),
    h('p', {}, 'Ara comença la feina de veritat: donar-te d\'alta com a ocupador, triar qui et porta les nòmines i els impostos, contractar personal i construir. Cada setmana (1 hora real) pagaràs el lloguer, la quota d\'autònom i les nòmines.'),
    h('div', { class: 'fila-botons' }, h('button', {
      class: 'btn btn-principal btn-gran', type: 'button',
      onclick: async () => {
        try {
          if (estat.slot == null) estat.slot = await desa.assignarSlot();
          estat.estalvis -= estat.aportacioMeva;
          estat.diners = diners;
          estat.constitucio = { ...estat.constitucio, constituida: true, pas: 'fet', data: Date.now() };
          estat.despesesT = Date.now();
          await desar();
          iniciarJoc();
        } catch (err) { console.error(err); avis('No s\'ha pogut acabar. Torna-ho a provar.', 'error'); }
      },
    }, 'Comença a treballar!')));
}

// ---------- joc ----------
let rellotge = null, rellotgeBorsa = null, rellotgeMon = null, rellotgeProf = null;

async function iniciarJoc() {
  joc.migrar(estat);
  clearInterval(rellotgeTramit);
  mostrarPantalla('pantalla-joc');
  if (estat.slot == null) {
    try { estat.slot = await desa.assignarSlot(); await desar(); } catch (err) { console.error(err); estat.slot = 0; }
  }
  if (joc.actualitzar(estat)) desar();
  construirMapa();
  dibuixarTot();
  centrarMapa();
  carregarMon();
  if (!rellotgeMon) rellotgeMon = setInterval(carregarMon, 60000);
  if (!rellotgeProf) rellotgeProf = setInterval(comprovarProfessorat, 45000);
  comprovarProfessorat();
  { const m = joc.aplicarDespeses(estat); m.forEach((t) => setTimeout(() => avis(t, 'error'), 1200)); }
  clearInterval(rellotge);
  rellotge = setInterval(tic, 1000);
  clearInterval(rellotgeBorsa);
  rellotgeBorsa = setInterval(cobrarBorsa, 60000);
  cobrarBorsa();
  iniciarXat();
  joc.aplicarInteressos(estat);
  { const m = joc.aplicarDirectors(estat); if (m) setTimeout(() => avis(m, 'error'), 1500); }
  if (joc.registrarHistorial(estat)) desar();
  if (!estat.tutorialVist) obrirGuia();
}

function tic() {
  joc.aplicarInteressos(estat);
  const despeses = joc.aplicarDespeses(estat);
  if (despeses.length) { despeses.forEach((t) => avis(t, 'error')); desar(); }
  const marxen = joc.aplicarDirectors(estat);
  if (marxen) { avis(marxen, 'error'); desar(); }
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

// ---------- mapa del món (canvas, js/mon.js) ----------
let mon = null;
let arrossegat = false; // compatibilitat
function construirMapa() {
  if (!mon) {
    mon = crearMon({ canvas: $('#mon-canvas'), onClic: clicMon });
  }
  mon.setJo(usuari.uid, estat);
}
async function carregarMon() {
  try { mon?.setEmpreses(await desa.carregarMon(usuari.uid, estat)); } catch (err) { console.error(err); }
}
function centrarMapa() { mon?.vistaCiutat(estat.slot); }
function dibuixarMapa() {
  mon?.setJo(usuari.uid, estat);
  $('#barra-diners').textContent = joc.diners(estat.diners);
}

function clicMon({ X, Y, cella }) {
  if (cella && cella.emp.uid === usuari.uid) {
    if (cella.tipus === 'parcela') return obrirParcela(cella.i);
    if (cella.mon) return obrirCarreteraMon(X, Y, true);
    return avis('Carrer de la teva ciutat.');
  }
  if (cella) {
    if (String(cella.emp.uid).startsWith('bot')) return avis(`${cella.emp.nom}: empresa fictícia del mode de prova.`);
    return obrirPerfil(cella.emp.uid);
  }
  obrirCarreteraMon(X, Y, false);
}

function obrirCarreteraMon(X, Y, meva) {
  const cos = h('div', { class: 'bloc' },
    h('img', { src: 'img/mapa/carretera-a.webp', alt: '', width: 140, height: 140, class: 'panell-img' }));
  if (meva) {
    cos.append(h('p', {}, 'Aquest tros de carretera l\'has fet tu. Si el treus, pots deixar alguna ciutat sense connexió.'),
      h('button', { class: 'btn', onclick: () => accio(() => { joc.treureCarreteraMon(estat, X, Y); tancarPanell(); }) }, 'Treu la carretera'));
  } else {
    const potser = mon.teCarreteraVeina(X, Y);
    cos.append(
      h('p', {}, 'Camp lliure. Hi pots fer un tros de carretera per arribar a altres ciutats. Les empreses connectades per carretera no paguen transport quan es compren coses a la borsa.'),
      potser ? null : h('p', { class: 'nota falta' }, 'Només pots construir al costat d\'una carretera que ja existeixi.'),
      h('button', {
        class: 'btn btn-principal', disabled: !potser || estat.diners < COST_CARRETERA,
        onclick: () => accio(() => { joc.construirCarreteraMon(estat, X, Y); tancarPanell(); }),
      }, `Construeix carretera (${joc.diners(COST_CARRETERA)})`));
  }
  obrirPanell('Carretera', cos, { tipus: 'carretera-mon' });
}

const PERCENT_TRANSPORT = 0.1;
function percentTransport(uidVenedor) {
  const e = mon?.empresaDeUid(uidVenedor);
  if (!e || e.slot == null) return PERCENT_TRANSPORT;
  return mon.connectades(estat.slot, e.slot) ? 0 : PERCENT_TRANSPORT;
}

function imatgeParcela(p) {
  if (p.estat === 'carretera') return 'img/mapa/carretera-a.webp';
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

$('#zoom-mes').addEventListener('click', () => mon?.zoom(1.25));
$('#zoom-menys').addEventListener('click', () => mon?.zoom(1 / 1.25));
$('#zoom-mon').addEventListener('click', () => mon?.centrarEnSlot(estat.slot, 0.07));
$('#zoom-ciutat').addEventListener('click', () => centrarMapa());

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
        def.aviat ? null : h('span', { class: 'nota' }, `Obres: ${joc.temps(tempsConstruccio(id))}`),
        def.nivellMinim && joc.nivellEmpresa(estat) < def.nivellMinim ? h('span', { class: 'nota falta' }, `Cal el nivell ${def.nivellMinim} d'empresa`) : null),
      def.aviat ? null : h('button', {
        class: 'btn btn-principal', disabled: !potPagar || (def.nivellMinim && joc.nivellEmpresa(estat) < def.nivellMinim),
        onclick: () => accio(() => { joc.construir(estat, i, id); tancarPanell(); avis(`Comencen les obres: ${def.nom}`, 'ok'); }),
      }, joc.diners(def.cost))));
  }
  return llista;
}

function panellCarretera(i) {
  return h('div', { class: 'bloc' },
    h('img', { src: imatgeParcela(estat.parceles[i]), alt: '', width: 160, height: 160, class: 'panell-img' }),
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
    info.textContent = `Temps: ${joc.temps(joc.tempsProduccio(estat, opcio, q, nivell))}. Costos variables: ${joc.diners(joc.souProduccio(opcio, q))}. Cost per unitat: ${joc.dinersDec(joc.costUnitariProduccio(estat, opcio))}.`;
  });
  input.dispatchEvent(new Event('input'));
  return h('div', { class: 'opcio' },
    h('div', { class: 'opcio-cap' }, icona(opcio.recurs, 44),
      h('div', {}, h('strong', {}, RECURSOS[opcio.recurs].nom),
        h('span', { class: 'nota' }, RECURSOS[opcio.recurs].intern
          ? `Tens ${joc.nombre(estat.recerca || 0)} punts. Es fan servir a Empresa > Recerca.`
          : `L'escola en paga ${joc.diners(joc.preuEscola(estat, opcio.recurs))} la unitat (Q${joc.qualitat(estat, opcio.recurs)})`))),
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
  const ref = joc.preuReferenciaQ(estat, opcio.recurs);
  const info = h('span', { class: 'nota' });
  const preu = h('input', { type: 'number', min: 1, value: ref, inputmode: 'numeric', 'aria-label': 'Preu per unitat', class: 'input-preu' });
  const { input, cont } = selectorQuantitat(Math.max(1, Math.min(estoc, 20)), estoc, () => calcula());
  function calcula() {
    const q = Number(input.value) || 0, pr = Number(preu.value) || 0;
    if (!q || !pr) { info.textContent = ''; return; }
    info.textContent = `Temps: ${joc.temps(joc.tempsVenda(estat, opcio, q, pr, nivell))}. Ingressos: ${joc.diners(q * pr)}. Costos de la botiga: ${joc.diners(joc.souVenda(opcio, q, pr))}.`;
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
  cerca: () => obrirCerca(),
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
  const items = Object.entries(estat.inventari).filter(([r, q]) => q > 0 && RECURSOS[r] && !RECURSOS[r].intern);
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
          h('span', { class: 'carta-qual' }, `Q${joc.qualitat(estat, r)}`),
          icona(r, 52),
          h('span', { class: 'carta-nom' }, RECURSOS[r].nom)));
      }
      cos.append(h('h3', { class: 'subtitol' }, nomCat), graella);
    }
    if (estat.recerca) cos.prepend(h('div', { class: 'total-estoc' }, h('span', {}, icona('recerca', 28), ' Punts de recerca'), h('strong', {}, joc.nombre(estat.recerca))));
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
      h('p', { class: 'nota' }, `Paga ${joc.diners(joc.preuEscola(estat, r))} per unitat (qualitat Q${joc.qualitat(estat, r)}), sempre i a l'instant.`),
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
        onclick: () => accioRemota(() => desa.comprar(usuari.uid, estat, o.id, o.quantitat, percentTransport(o.venedor)), (r) => `Contracte acceptat: ${joc.diners(r.cost)}${r.transport ? ` + ${joc.diners(r.transport)} de transport` : ''}`).then(() => obrirMercat('contractes')),
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
    ['personal', 'Personal i despeses', () => obrirEmpresa('personal')],
    ['reptes', 'Reptes', () => obrirEmpresa('reptes')],
    ['banc', 'Banc', () => obrirEmpresa('banc'), n < DESBLOQUEIG.banc],
    ['classificacio', 'Classificació', () => obrirEmpresa('classificacio')],
    ['recerca', 'Recerca', () => obrirEmpresa('recerca'), n < DESBLOQUEIG.recerca],
    ['directors', 'Directors', () => obrirEmpresa('directors'), n < DESBLOQUEIG.directors],
  ]);
  const cos = h('div', { class: 'bloc' }, tabs);
  if (pestanya === 'resum') cos.append(...seccioResum());
  if (pestanya === 'personal') cos.append(...seccioPersonal());
  if (pestanya === 'reptes') cos.append(...seccioReptes());
  if (pestanya === 'banc') cos.append(...seccioBanc(n));
  if (pestanya === 'classificacio') cos.append(seccioClassificacio());
  if (pestanya === 'recerca') cos.append(...seccioRecerca(n));
  if (pestanya === 'directors') cos.append(...seccioDirectors(n));
  obrirPanell(estat.nom, cos, { tipus: 'empresa', pestanya, ample: true });
}

function seccioRecerca(n) {
  if (n < DESBLOQUEIG.recerca) {
    return [h('div', { class: 'avis-bloqueig' }, h('strong', {}, 'La teva empresa encara és massa petita per investigar'),
      h('p', {}, `Al nivell ${DESBLOQUEIG.recerca} podràs construir un laboratori. Els punts de recerca milloren la qualitat (Q) dels teus productes: l'escola te'ls paga més i a la botiga es venen més cars.`))];
  }
  const graella = h('div', { class: 'graella-recerca' });
  for (const r of Object.keys(RECURSOS).filter((x) => !RECURSOS[x].intern)) {
    const q = joc.qualitat(estat, r);
    const cost = QUALITAT.cost(q);
    graella.append(h('div', { class: 'fila-recerca' },
      icona(r, 36),
      h('span', { class: 'of-info' }, h('strong', {}, `${RECURSOS[r].nom} Q${q}`),
        h('span', { class: 'nota' }, `Escola: ${joc.diners(joc.preuEscola(estat, r))}`)),
      q >= QUALITAT.max ? h('span', { class: 'nota' }, 'Màxim') : h('button', {
        class: 'btn', disabled: (estat.recerca || 0) < cost,
        onclick: () => accio(() => { joc.investigar(estat, r); avis(`${RECURSOS[r].nom} ara és Q${q + 1}`, 'ok'); obrirEmpresa('recerca'); }),
      }, `Q${q + 1} per ${cost} punts`)));
  }
  return [
    h('div', { class: 'total-estoc' }, h('span', {}, icona('recerca', 28), ' Punts de recerca'), h('strong', {}, joc.nombre(estat.recerca || 0))),
    h('p', { class: 'nota' }, `Els punts els fa el laboratori. Cada nivell de qualitat fa que l'escola pagui un ${Math.round(QUALITAT.bonusEscola * 100)}% més i que a la botiga el preu habitual pugi un ${Math.round(QUALITAT.bonusBotiga * 100)}%.`),
    graella,
  ];
}

function seccioDirectors(n) {
  if (n < DESBLOQUEIG.directors) {
    return [h('div', { class: 'avis-bloqueig' }, h('strong', {}, 'Els directors estan disponibles a partir del nivell ' + DESBLOQUEIG.directors),
      h('p', {}, 'Cada director cobra un sou cada hora, però fa que l\'empresa funcioni millor. Si un dia no els pots pagar, marxen.'))];
  }
  const sou = joc.souDirectorsHora(estat);
  return [
    h('div', { class: 'total-estoc' }, h('span', {}, 'Sous dels directors'), h('strong', {}, `${joc.diners(sou)} / hora`)),
    ...Object.entries(DIRECTORS).map(([id, d]) => {
      const te = !!estat.directors?.[id];
      return h('div', { class: `fila-director${te ? ' contractat' : ''}` },
        h('img', { src: imgLogo(d.logo), alt: '', width: 52, height: 52 }),
        h('div', { class: 'of-info' }, h('strong', {}, d.nom), h('span', {}, d.efecte),
          h('span', { class: 'nota' }, `Fitxatge ${joc.diners(d.fitxatge)}. Sou ${joc.diners(d.souHora)} cada hora.`)),
        te
          ? h('button', { class: 'btn', onclick: () => accio(() => { joc.acomiadarDirector(estat, id); avis(`${d.nom} ja no treballa per tu`); obrirEmpresa('directors'); }) }, 'Acomiada')
          : h('button', { class: 'btn btn-principal', disabled: estat.diners < d.fitxatge, onclick: () => accio(() => { joc.contractarDirector(estat, id); avis(`Has contractat: ${d.nom}`, 'ok'); obrirEmpresa('directors'); }) }, 'Contracta'));
    }),
    h('p', { class: 'nota' }, 'Els sous es descompten sols mentre tens el joc obert i quan hi tornes a entrar.'),
  ];
}

function seccioReptes() {
  const reptes = config.reptes || [];
  if (!reptes.length) return [h('div', { class: 'avis-bloqueig' }, h('strong', {}, 'Ara mateix no hi ha reptes'), h('p', {}, 'Quan el professorat en publiqui, els veuràs aquí amb el seu premi.'))];
  return reptes.map((r) => {
    const [a, b] = joc.progresRepte(estat, r);
    const cobrat = (estat.reptesCobrats || []).includes(r.id);
    const caducat = r.fins && Date.now() > r.fins;
    const fet = a >= b;
    return h('div', { class: `fila-director${cobrat ? ' contractat' : ''}` },
      h('span', { class: 'trofeu' }, '🏆'),
      h('div', { class: 'of-info' }, h('strong', {}, joc.textRepte(r)),
        h('span', {}, `Premi: ${joc.diners(r.premi)}`),
        h('span', { class: 'nota' }, `Progrés: ${joc.nombre(Math.min(a, b))} de ${joc.nombre(b)}${r.fins ? `. Acaba ${new Date(r.fins).toLocaleString('ca-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}` : ''}`)),
      cobrat ? h('span', { class: 'nota' }, 'Cobrat ✔')
        : h('button', { class: 'btn btn-principal', disabled: !fet || caducat, onclick: () => accio(() => { joc.cobrarRepte(estat, r); avis(`Repte aconseguit: +${joc.diners(r.premi)}`, 'ok'); obrirEmpresa('reptes'); }) }, caducat ? 'Caducat' : 'Cobra'));
  });
}

function seccioPersonal() {
  const files = joc.despesesMensuals(estat);
  const total = joc.totalMensual(estat);
  const lliures = joc.operarisLliures(estat);
  const filaRol = (rol) => {
    const d = PERSONAL[rol];
    const n = estat.plantilla?.[rol] || 0;
    return h('div', { class: 'fila-director' },
      h('img', { src: rol === 'rrhh' ? imgLogo(20) : 'img/recursos/recurs-treballadors.webp', alt: '', width: 52, height: 52 }),
      h('div', { class: 'of-info' }, h('strong', {}, `${d.nom}: ${n}`),
        h('span', {}, d.text),
        h('span', { class: 'nota' }, `Sou brut ${joc.diners(d.sou)}/mes + Seguretat Social de l'empresa (~${Math.round(SS_EMPRESA * 100)}%) = ${joc.diners(joc.costPersona(rol))}/mes per persona.`),
        rol === 'operari' ? h('span', { class: 'nota' }, `Ara en tens ${Math.max(0, lliures)} de lliures.`) : null),
      h('div', { class: 'fila-botons' },
        h('button', { class: 'btn', disabled: n < 1, onclick: () => accio(() => { joc.acomiadar(estat, rol); obrirEmpresa('personal'); }) }, '−1'),
        h('button', { class: 'btn btn-principal', onclick: () => accio(() => { joc.contractar(estat, rol); avis(`Contracte signat: ${d.nom}`, 'ok'); obrirEmpresa('personal'); }) }, '+1')));
  };
  return [
    h('div', { class: 'opcio' },
      h('strong', {}, 'Despeses fixes cada mes'),
      h('dl', { class: 'dades balanc' }, ...files.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, joc.diners(v))]),
        h('dt', { class: 'total' }, 'Total al mes'), h('dd', { class: 'total' }, joc.diners(total))),
      h('p', { class: 'nota' }, `Al joc, 1 hora real és 1 setmana: pagues uns ${joc.diners(total / SETMANES_PER_MES)} cada hora.`)),

    h('div', { class: 'opcio' },
      h('strong', {}, '1. Alta com a empresa ocupadora'),
      estat.altaOcupador
        ? h('p', {}, '✔ Feta. L\'empresa ja té codi de compte de cotització a la Seguretat Social.')
        : [h('p', {}, 'Abans de contractar ningú, l\'empresa s\'ha d\'inscriure a la Tresoreria General de la Seguretat Social (es fa per Internet amb el sistema RED o la gestoria). És gratuït.'),
          h('button', { class: 'btn btn-principal', onclick: () => accio(() => { estat.altaOcupador = true; avis('Empresa inscrita a la Seguretat Social', 'ok'); obrirEmpresa('personal'); }) }, 'Inscriu l\'empresa')]),

    h('div', { class: 'opcio' },
      h('strong', {}, '2. Qui et porta els papers?'),
      h('p', { class: 'nota' }, GESTORIA.text),
      h('p', {}, estat.gestoria
        ? `Tens gestoria contractada: ${joc.diners(GESTORIA.fixe)}/mes + ${joc.diners(GESTORIA.perTreballador)} per cada nòmina.`
        : `No tens gestoria. Si no tens un/a tècnic/a de RRHH no podràs contractar operaris, i cada setmana hi ha un ${Math.round(RISC_SANCIO.probabilitat * 100)}% de risc de sanció d'Hisenda (${joc.diners(RISC_SANCIO.import)}).`),
      h('button', { class: estat.gestoria ? 'btn' : 'btn btn-principal', onclick: () => accio(() => { estat.gestoria = !estat.gestoria; obrirEmpresa('personal'); }) },
        estat.gestoria ? 'Dona de baixa la gestoria' : 'Contracta una gestoria')),

    h('div', { class: 'opcio' }, h('strong', {}, '3. Plantilla'), filaRol('operari'), filaRol('rrhh')),

    h('div', { class: 'opcio' },
      h('strong', {}, 'Seu de l\'empresa'),
      h('p', {}, `Ara: ${OFICINES[estat.oficina]?.nom || 'cap'}. Una seu millor dona més confiança al banc.`),
      h('div', { class: 'fila-botons' }, ...Object.entries(OFICINES).filter(([id]) => id !== estat.oficina).map(([id, o]) =>
        h('button', { class: 'btn', onclick: () => accio(() => { joc.canviarOficina(estat, id); avis(`Ens traslladem: ${o.nom}`, 'ok'); obrirEmpresa('personal'); }) }, `${o.nom} (${joc.diners(o.mensual)}/mes)`)))),
  ];
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
      h('p', { class: 'nota' }, fase.text, ...(fase.forcada
        ? [' Fase fixada pel professorat.']
        : [' Canvia d\'aquí a ', h('strong', { 'data-fi': fase.fi }, joc.temps((fase.fi - Date.now()) / 1000)), '.']))),
    targetaLegal(),
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
      h('button', { class: 'btn', onclick: () => desa.sortir() }, 'Tanca la sessió'),
      h('button', { class: 'btn btn-perill', onclick: tornarAComencar }, 'Torna a començar de zero'),
      desa.esProfessor(usuari, config) ? h('button', { class: 'btn btn-principal', onclick: () => { sessionStorage.removeItem('fem-empresa-jugar'); location.reload(); } }, 'Torna al panell del professorat') : null),
  ];
}

async function tornarAComencar() {
  if (!confirm('Segur que vols esborrar la teva empresa i tornar a començar des de la constitució? No es pot desfer.')) return;
  try { await reiniciarEmpresa(); } catch (err) { console.error(err); avis('No s\'ha pogut reiniciar. Torna-ho a provar.', 'error'); }
}

function targetaLegal() {
  const f = FORMES[estat.forma] || FORMES.sl;
  return h('div', { class: 'targeta-legal' },
    h('div', {}, h('strong', {}, estat.nom), h('span', { class: 'nota' }, `${f.nom}. NIF ${estat.nif || '—'}`)),
    h('dl', { class: 'dades' },
      h('dt', {}, f.capitalMin ? 'Capital social' : 'Aportació inicial'), h('dd', {}, joc.diners(estat.capital || 0)),
      h('dt', {}, 'Responsabilitat'), h('dd', {}, f.limitada ? 'Limitada' : 'Il·limitada'),
      h('dt', {}, 'Els teus estalvis personals'), h('dd', {}, joc.diners(estat.estalvis || 0))),
    h('p', { class: 'nota' }, f.responsabilitat));
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
      h('dt', {}, 'Interès'), h('dd', {}, `${(joc.interesHora(estat) * 100).toFixed(1).replace('.', ',')}% cada hora`),
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

// ---------- cercador d'empreses ----------
let empresesCerca = null;
async function obrirCerca(text = '') {
  marcarNav('cerca');
  const entrada = h('input', { type: 'search', placeholder: 'Nom de l\'empresa…', value: text, 'aria-label': 'Cerca empreses', class: 'camp-cerca' });
  const llista = h('div', { class: 'llista-ofertes' }, h('p', { class: 'nota' }, 'Carregant…'));
  const pinta = () => {
    const t = entrada.value.trim().toLowerCase();
    const files = (empresesCerca || []).filter((f) => !t || (f.nom || '').toLowerCase().includes(t));
    llista.replaceChildren(...(files.length ? files.map((f) => h('button', { class: 'fila-oferta fila-empresa', onclick: () => obrirPerfil(f.uid, entrada.value) },
      h('img', { src: imgLogo(f.logo || 1), alt: '', width: 34, height: 34 }),
      h('span', { class: 'of-info' }, h('strong', {}, f.nom), h('span', { class: 'nota' }, `Nivell ${joc.nivellDeValor(f.valor || 0)}. Valor ${joc.diners(f.valor || 0)}`)))) : [h('p', { class: 'nota' }, 'Cap empresa coincideix.')]));
  };
  entrada.addEventListener('input', pinta);
  obrirPanell('Cerca empreses', h('div', { class: 'bloc' }, entrada, llista), { tipus: 'cerca', ample: true });
  try { empresesCerca = await desa.classificacio(usuari.uid, estat); pinta(); }
  catch (err) { console.error(err); llista.replaceChildren(h('p', { class: 'nota falta' }, 'No s\'han pogut carregar les empreses.')); }
}

async function obrirPerfil(uid, textCerca = '') {
  const cos = h('div', { class: 'bloc' }, h('button', { class: 'btn-tornar', onclick: () => obrirCerca(textCerca) }, '← Cerca'), h('p', { class: 'nota' }, 'Carregant…'));
  obrirPanell('Empresa', cos, { tipus: 'perfil', ample: true });
  try {
    const [e, ofertes] = await Promise.all([desa.perfilEmpresa(uid), desa.mevesOfertes(uid)]);
    if (!e) { cos.lastChild.textContent = 'No s\'ha trobat aquesta empresa.'; return; }
    const edificis = {};
    for (const p of e.parceles || []) {
      if (p.estat !== 'edifici' || !EDIFICIS[p.tipus] || EDIFICIS[p.tipus].inicial) continue;
      edificis[p.tipus] ??= { n: 0, nivell: 0 };
      edificis[p.tipus].n += 1;
      edificis[p.tipus].nivell = Math.max(edificis[p.tipus].nivell, p.nivell || 1);
    }
    const qual = Object.entries(e.qualitat || {}).filter(([, q]) => q > 0);
    const valor = e.valor ?? joc.valorEmpresa(e);
    cos.lastChild.remove();
    cos.append(
      h('div', { class: 'cap-perfil' }, h('img', { src: imgLogo(e.logo || 1), alt: '', width: 72, height: 72 }),
        h('div', {}, h('h3', { class: 'subtitol' }, e.nom), h('span', { class: 'nota' }, `Nivell ${joc.nivellDeValor(valor)}. Valor ${joc.diners(valor)}`))),
      h('h3', { class: 'subtitol' }, 'Edificis'),
      Object.keys(edificis).length
        ? h('div', { class: 'graella-perfil' }, ...Object.entries(edificis).map(([t, d]) => h('div', { class: 'carta-estoc' },
          h('img', { src: imgEdifici(t), alt: '', width: 64, height: 64 }),
          h('span', { class: 'carta-q' }, `×${d.n}`),
          h('span', { class: 'carta-nom' }, `${EDIFICIS[t].nom}`), h('span', { class: 'nota' }, `fins a Nv ${d.nivell}`))))
        : h('p', { class: 'nota' }, 'Encara no té edificis.'),
      qual.length ? h('p', {}, 'Qualitat: ', ...qual.map(([r, q]) => h('span', { class: 'ingredient' }, icona(r, 22), `Q${q} `))) : null,
      h('h3', { class: 'subtitol' }, 'Ofertes a la borsa'),
      ...(ofertes.filter((o) => !o.perA && o.quantitat > 0).map(filaOferta)),
      ofertes.some((o) => !o.perA && o.quantitat > 0) ? null : h('p', { class: 'nota' }, 'No té cap oferta oberta.'));
  } catch (err) {
    console.error(err);
    avis('No s\'ha pogut carregar l\'empresa.', 'error');
  }
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
    ...Object.keys(RECURSOS).filter((r) => !RECURSOS[r].intern).map((r) => h('button', {
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
      h('span', { class: 'nota' }, `${joc.nombre(o.quantitat)} unitats a ${joc.diners(o.preu)}, qualitat Q${o.qualitat || 0}`),
      meva ? null : h('span', { class: 'nota' }, percentTransport(o.venedor) ? `+${Math.round(PERCENT_TRANSPORT * 100)}% de transport (no hi ha carretera fins a la teva ciutat)` : 'Connectada per carretera: sense transport')),
    meva ? h('span', { class: 'nota' }, 'La teva') : h('div', { class: 'of-compra' }, cont,
      h('button', {
        class: 'btn btn-principal',
        onclick: () => accioRemota(() => desa.comprar(usuari.uid, estat, o.id, Number(input.value), percentTransport(o.venedor)),
          (r) => `Comprat per ${joc.diners(r.cost)}${r.transport ? ` + ${joc.diners(r.transport)} de transport` : ''}`).then(() => obrirBorsa(recursBorsa)),
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
