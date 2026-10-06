// =============================================================
//  PANELL DEL PROFESSORAT
//  Empreses, ajuts i missatges, reptes, economia, xat i partida.
// =============================================================
import { $, h, avis, mostrarPantalla } from './ui.js';
import * as desa from './desa.js';
import * as joc from './joc.js';
import { FASES, TIPUS_REPTE, SECTORS_NEGOCI, imgLogo } from './dades.js';
import { FORMES } from './legal.js';

let ctx = null;      // { usuari, config, jugar }
let empreses = [];
let pestanya = 'empreses';

export function iniciar(opcions) {
  ctx = opcions;
  mostrarPantalla('pantalla-professor');
  $('#prof-jugar').onclick = () => ctx.jugar();
  $('#prof-sortir').onclick = () => (desa.modeProva ? desa.sortirModeProfessorProva() : desa.sortir());
  for (const b of document.querySelectorAll('#prof-pestanyes button')) {
    b.onclick = () => { pestanya = b.dataset.p; pinta(); };
  }
  carregar();
}

async function carregar() {
  try {
    [empreses, ctx.config] = await Promise.all([desa.llistarEmpreses(), desa.getConfig()]);
  } catch (err) {
    console.error(err);
    avis('No s\'han pogut carregar les dades. Comprova que el teu correu és a config/joc > professors.', 'error');
  }
  pinta();
}

function pinta() {
  for (const b of document.querySelectorAll('#prof-pestanyes button')) b.classList.toggle('actiu', b.dataset.p === pestanya);
  const cos = $('#prof-cos');
  const f = { empreses: pEmpreses, reptes: pReptes, economia: pEconomia, xat: pXat, partida: pPartida }[pestanya];
  cos.replaceChildren(h('p', { class: 'nota' }, 'Carregant…'));
  Promise.resolve(f()).then((el) => cos.replaceChildren(el)).catch((err) => {
    console.error(err);
    cos.replaceChildren(h('p', { class: 'nota falta' }, `Error: ${err.message}`));
  });
}

const fet = (msg) => { avis(msg, 'ok'); carregar(); };
const error = (err) => { console.error(err); avis(err.code === 'permission-denied' ? 'No tens permís: revisa que el teu correu és a config/joc > professors i que has publicat les regles.' : err.message, 'error'); };
const haFa = (t) => {
  if (!t) return '—';
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'ara mateix';
  if (s < 3600) return `fa ${Math.round(s / 60)} min`;
  if (s < 86400) return `fa ${Math.round(s / 3600)} h`;
  return `fa ${Math.round(s / 86400)} dies`;
};

// ---------- 1. Empreses ----------
function formulariAvis(perA, nomDesti, tancar) {
  const tipus = h('select', { class: 'camp-select' },
    h('option', { value: 'ajut' }, 'Subvenció / ajut (diners)'),
    h('option', { value: 'missatge' }, 'Missatge'));
  const imp = h('input', { type: 'number', value: 2000, min: -100000, class: 'input-preu', 'aria-label': 'Import' });
  const text = h('input', { class: 'camp-text', maxlength: 300, placeholder: 'Motiu o missatge (el veurà l\'alumne)' });
  const filaImp = h('label', { class: 'fila-preu' }, 'Import (€). En negatiu, és una multa.', imp);
  tipus.onchange = () => { filaImp.hidden = tipus.value !== 'ajut'; };
  return h('div', { class: 'prof-form' },
    h('strong', {}, `Enviar a: ${nomDesti}`), tipus, filaImp, text,
    h('div', { class: 'fila-botons' },
      h('button', { class: 'btn', onclick: tancar }, 'Cancel·la'),
      h('button', {
        class: 'btn btn-principal',
        onclick: async () => {
          try {
            const desti = perA === '*' ? empreses.filter((e) => e.constitucio?.constituida).map((e) => e.uid) : [perA];
            await Promise.all(desti.map((uid) => desa.enviarAvis(uid, { tipus: tipus.value, import: tipus.value === 'ajut' ? imp.value : 0, text: text.value })));
            fet(`Enviat a ${desti.length} empresa${desti.length === 1 ? '' : 'es'}. Ho rebran en menys d'un minut.`);
          } catch (err) { error(err); }
        },
      }, 'Envia')));
}

function pEmpreses() {
  const constituides = empreses.filter((e) => e.constitucio?.constituida);
  const valors = constituides.map((e) => e.valor ?? joc.valorEmpresa(e));
  const total = valors.reduce((a, b) => a + b, 0);
  const zonaForm = h('div', {});
  const files = [...empreses].sort((a, b) => (b.valor || 0) - (a.valor || 0)).map((e, k) => {
    const f = FORMES[e.forma];
    const valor = e.valor ?? joc.valorEmpresa(e);
    return h('tr', {},
      h('td', {}, k + 1),
      h('td', {}, h('div', { class: 'prof-emp' }, h('img', { src: imgLogo(e.logo || 1), alt: '', width: 32, height: 32 }),
        h('div', {}, h('strong', {}, e.nom || '(sense nom)'), h('span', { class: 'nota' }, `${SECTORS_NEGOCI[e.sector]?.nom || 'Sense sector'} · ${f?.curt || '—'} · ${e.constitucio?.constituida ? `NIF ${e.nif || '—'}` : `constituint-se (pas ${(e.constitucio?.pas ?? 0) + 1})`}`)))),
      h('td', {}, String(joc.nivellDeValor(valor))),
      h('td', { class: 'num' }, joc.diners(valor)),
      h('td', { class: 'num' }, joc.diners(e.diners || 0)),
      h('td', { class: 'num' }, joc.diners(Math.round(e.deute || 0))),
      h('td', { class: 'num' }, String((e.plantilla?.treballadors || 0) + (e.plantilla?.rrhh || 0))),
      h('td', {}, haFa(e.actualitzada)),
      h('td', {}, h('div', { class: 'fila-botons' },
        h('button', { class: 'btn btn-petit', onclick: () => zonaForm.replaceChildren(formulariAvis(e.uid, e.nom, () => zonaForm.replaceChildren())) }, 'Ajut / missatge'),
        h('button', {
          class: 'btn btn-petit',
          onclick: async () => {
            if (!confirm(`Reiniciar l'empresa "${e.nom}"? Tornarà a l'assistent de constitució.`)) return;
            try { await desa.enviarAvis(e.uid, { tipus: 'reinici', text: 'El professorat ha reiniciat la teva empresa.' }); fet('Ordre de reinici enviada'); } catch (err) { error(err); }
          },
        }, 'Reinicia'),
        h('button', {
          class: 'btn btn-petit btn-perill',
          onclick: async () => {
            if (!confirm(`Esborrar del tot "${e.nom}"? Si l'alumne té el joc obert, li cal recarregar la pàgina.`)) return;
            try { await desa.esborrarEmpresa(e.uid); fet('Empresa esborrada'); } catch (err) { error(err); }
          },
        }, 'Esborra'))));
  });
  return h('div', { class: 'bloc' },
    h('div', { class: 'prof-xifres' },
      h('div', {}, h('span', { class: 'nota' }, 'Empreses'), h('strong', {}, `${constituides.length} / ${empreses.length}`)),
      h('div', {}, h('span', { class: 'nota' }, 'Valor total'), h('strong', {}, joc.diners(total))),
      h('div', {}, h('span', { class: 'nota' }, 'Valor mitjà'), h('strong', {}, joc.diners(constituides.length ? total / constituides.length : 0)))),
    h('div', { class: 'fila-botons' },
      h('button', { class: 'btn', onclick: carregar }, 'Actualitza'),
      h('button', { class: 'btn btn-principal', onclick: () => zonaForm.replaceChildren(formulariAvis('*', 'totes les empreses', () => zonaForm.replaceChildren())) }, 'Ajut o missatge a tothom'),
      h('button', { class: 'btn', onclick: descarregarCsv }, 'Descarrega CSV')),
    zonaForm,
    h('div', { class: 'taula-scroll' }, h('table', { class: 'prof-taula' },
      h('thead', {}, h('tr', {}, ...['#', 'Empresa', 'Nv', 'Valor', 'Diners', 'Deute', 'Plantilla', 'Darrera activitat', ''].map((t) => h('th', {}, t)))),
      h('tbody', {}, ...files))),
    empreses.length ? null : h('p', { class: 'nota' }, 'Encara no hi ha cap empresa.'));
}

function descarregarCsv() {
  const cap = ['empresa', 'sector', 'forma', 'nif', 'constituida', 'fase_negoci', 'nivell', 'valor', 'diners', 'deute', 'treballadors', 'capital', 'estalvis_personals', 'unitats_venudes', 'ingressos', 'setmanes_amb_benefici', 'missions', 'reptes_cobrats', 'sancions'];
  const files = empreses.map((e) => {
    const valor = e.valor ?? joc.valorEmpresa(e);
    return [e.nom, SECTORS_NEGOCI[e.sector]?.nom || '', FORMES[e.forma]?.curt || '', e.nif || '', e.constitucio?.constituida ? 'sí' : 'no', e.local?.fase || 0,
      joc.nivellDeValor(valor), Math.round(valor), Math.round(e.diners || 0), Math.round(e.deute || 0), e.plantilla?.treballadors || 0, e.capital || 0,
      Math.round(e.estalvis || 0), Math.round(e.stats?.unitatsVenudes || 0), Math.round(e.stats?.ingressos || 0), e.stats?.setmanesAmbBenefici || 0,
      e.missio || 0, (e.reptesCobrats || []).length, e.sancions || 0];
  });
  const csv = [cap, ...files].map((f) => f.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const a = h('a', { href: URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })), download: 'fem-empresa-classe.csv' });
  document.body.append(a); a.click(); a.remove();
}

// ---------- 2. Reptes ----------
function pReptes() {
  const reptes = ctx.config.reptes || [];
  const tipus = h('select', { class: 'camp-select' }, ...Object.entries(TIPUS_REPTE).map(([id, t]) => h('option', { value: id }, t.nom)));
  const xifra = h('input', { type: 'number', min: 1, value: 50000, class: 'input-preu' });
  const recurs = h('select', { class: 'camp-select' });
  const edifici = h('select', { class: 'camp-select' });
  const premi = h('input', { type: 'number', min: 0, value: 3000, class: 'input-preu' });
  const hores = h('input', { type: 'number', min: 0, value: 0, class: 'input-preu' });
  const text = h('input', { class: 'camp-text', maxlength: 120, placeholder: 'Text del repte (opcional: si el deixes buit es fa sol)' });
  const fXifra = h('label', { class: 'fila-preu' }, 'Xifra', xifra);
  const fRecurs = h('label', { class: 'fila-preu' }, 'Producte', recurs);
  const fEdifici = h('label', { class: 'fila-preu' }, 'Edifici', edifici);
  const previa = h('p', { class: 'nom-final' });
  const dades = () => ({ tipus: tipus.value, xifra: Number(xifra.value) || 0, recurs: recurs.value, edifici: edifici.value });
  const actualitza = () => {
    const p = TIPUS_REPTE[tipus.value].params;
    fXifra.hidden = !p.includes('xifra'); fRecurs.hidden = !p.includes('recurs'); fEdifici.hidden = !p.includes('edifici');
    previa.textContent = text.value.trim() || TIPUS_REPTE[tipus.value].text(dades());
  };
  for (const el of [tipus, xifra, recurs, edifici, text]) el.addEventListener('input', actualitza);
  tipus.addEventListener('change', actualitza);
  actualitza();
  const guardar = async (llista) => { await desa.setConfig({ reptes: llista }); ctx.config.reptes = llista; };
  return h('div', { class: 'bloc' },
    h('p', {}, 'Els reptes surten a tots els alumnes (Empresa > Reptes). Quan l\'aconsegueixen, cobren el premi una sola vegada. Pots posar-hi una data límit.'),
    h('div', { class: 'prof-form' },
      h('strong', {}, 'Repte nou'),
      h('label', { class: 'fila-preu' }, 'Tipus', tipus), fXifra, fRecurs, fEdifici,
      h('label', { class: 'fila-preu' }, 'Premi (€)', premi),
      h('label', { class: 'fila-preu' }, 'Hores de termini (0 = sense límit)', hores),
      text, previa,
      h('button', {
        class: 'btn btn-principal',
        onclick: async () => {
          const r = { id: `r${Date.now()}`, ...dades(), premi: Number(premi.value) || 0, text: text.value.trim() || '', creat: Date.now() };
          if (Number(hores.value) > 0) r.fins = Date.now() + Number(hores.value) * 3600000;
          try { await guardar([...reptes, r]); fet('Repte publicat'); } catch (err) { error(err); }
        },
      }, 'Publica el repte')),
    h('h3', { class: 'subtitol' }, 'Reptes actius'),
    ...(reptes.length ? reptes.map((r) => {
      const fets = empreses.filter((e) => (e.reptesCobrats || []).includes(r.id)).length;
      return h('div', { class: 'fila-recerca' },
        h('span', {}, '🏆'),
        h('span', { class: 'of-info' }, h('strong', {}, joc.textRepte(r)),
          h('span', { class: 'nota' }, `Premi ${joc.diners(r.premi)}. L'han cobrat ${fets} empreses.${r.fins ? ` Acaba ${new Date(r.fins).toLocaleString('ca-ES')}.` : ''}`)),
        h('button', { class: 'btn btn-petit btn-perill', onclick: async () => { try { await guardar(reptes.filter((x) => x.id !== r.id)); fet('Repte eliminat'); } catch (err) { error(err); } } }, 'Treu'));
    }) : [h('p', { class: 'nota' }, 'No hi ha cap repte actiu.')]));
}

// ---------- 3. Economia i avisos ----------
function pEconomia() {
  const c = ctx.config;
  const fase = h('select', { class: 'camp-select' },
    h('option', { value: 'auto', selected: c.fase === 'auto' }, 'Automàtica (canvia cada 20 minuts)'),
    ...Object.entries(FASES).map(([id, f]) => h('option', { value: id, selected: c.fase === id }, `${f.nom}: ${f.text}`)));
  const anunci = h('textarea', { class: 'camp-text', rows: 3, maxlength: 280, placeholder: 'Ex.: Avui la borsa tanca a les 12.30. Qui tingui més valor guanya!' }, c.anunci || '');
  const xat = h('input', { type: 'checkbox', checked: c.xatActiu !== false });
  return h('div', { class: 'bloc' },
    h('div', { class: 'prof-form' },
      h('strong', {}, 'Fase econòmica'),
      h('p', { class: 'nota' }, 'Fixa una fase per treballar-la a classe: en recessió es ven més lent i es produeix més ràpid; en expansió les botigues venen més.'),
      fase,
      h('button', { class: 'btn btn-principal', onclick: async () => { try { await desa.setConfig({ fase: fase.value }); fet('Fase canviada'); } catch (err) { error(err); } } }, 'Aplica')),
    h('div', { class: 'prof-form' },
      h('strong', {}, 'Anunci per a tota la classe'),
      h('p', { class: 'nota' }, 'Surt a dalt de la pantalla de tots els alumnes.'),
      anunci,
      h('div', { class: 'fila-botons' },
        h('button', { class: 'btn', onclick: async () => { try { await desa.setConfig({ anunci: '' }); fet('Anunci tret'); } catch (err) { error(err); } } }, 'Treu l\'anunci'),
        h('button', { class: 'btn btn-principal', onclick: async () => { try { await desa.setConfig({ anunci: anunci.value.trim() }); fet('Anunci publicat'); } catch (err) { error(err); } } }, 'Publica'))),
    h('div', { class: 'prof-form' },
      h('strong', {}, 'Xat de la classe'),
      h('label', { class: 'opcio-radio' }, xat, h('span', {}, 'Xat activat per als alumnes')),
      h('button', { class: 'btn btn-principal', onclick: async () => { try { await desa.setConfig({ xatActiu: xat.checked }); fet(xat.checked ? 'Xat activat' : 'Xat desactivat'); } catch (err) { error(err); } } }, 'Desa')));
}

// ---------- 4. Xat ----------
async function pXat() {
  const missatges = await desa.missatgesXat();
  return h('div', { class: 'bloc' },
    h('div', { class: 'fila-botons' },
      h('button', { class: 'btn', onclick: () => pinta() }, 'Actualitza'),
      h('button', { class: 'btn btn-perill', onclick: async () => { if (!confirm('Esborrar tots els missatges del xat?')) return; try { await desa.buidarXat(); fet('Xat buidat'); } catch (err) { error(err); } } }, 'Buida tot el xat')),
    ...(missatges.length ? missatges.map((m) => h('div', { class: 'xat-msg prof-msg' },
      h('img', { src: imgLogo(m.logo || 1), alt: '', width: 32, height: 32 }),
      h('div', {}, h('strong', {}, `${m.nom} · ${new Date(m.creada).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}`), h('p', {}, m.text)),
      h('button', { class: 'btn btn-petit btn-perill', onclick: async () => { try { await desa.esborrarMissatge(m.id); fet('Missatge esborrat'); } catch (err) { error(err); } } }, 'Esborra'))) : [h('p', { class: 'nota' }, 'No hi ha missatges.')]));
}

// ---------- 5. Partida i professorat ----------
function pPartida() {
  const c = ctx.config;
  const correus = h('textarea', { class: 'camp-text', rows: 3 }, (c.professors || []).join('\n'));
  return h('div', { class: 'bloc' },
    h('div', { class: 'prof-form avis-perill' },
      h('strong', {}, `Partida actual: número ${c.partida || 1}`),
      h('p', {}, 'Una partida nova esborra la borsa, els contractes, el xat, els reptes i els avisos, i reinicia les posicions del món. Cada alumne, quan torni a entrar (o en menys d\'un minut si té el joc obert), començarà de zero amb l\'assistent de constitució.'),
      h('button', {
        class: 'btn btn-perill',
        onclick: async () => {
          if (!confirm('Segur que vols començar una partida nova per a tota la classe? No es pot desfer.')) return;
          try { await desa.novaPartida(); fet('Partida nova creada'); } catch (err) { error(err); }
        },
      }, 'Comença una partida nova')),
    h('div', { class: 'prof-form' },
      h('strong', {}, 'Professorat amb accés a aquest panell'),
      h('p', { class: 'nota' }, 'Un correu per línia (el mateix amb què entren amb Google). No t\'esborris a tu mateix/a.'),
      correus,
      h('button', {
        class: 'btn btn-principal',
        onclick: async () => {
          const llista = correus.value.split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
          if (!desa.modeProva && !llista.includes(ctx.usuari.email)) { avis('Has de deixar el teu correu a la llista.', 'error'); return; }
          try { await desa.setConfig({ professors: llista }); fet('Llista desada'); } catch (err) { error(err); }
        },
      }, 'Desa la llista')));
}
