// Capa de dades: Firebase (Auth + Firestore) o mode de prova amb el navegador.
import config from './firebase-config.js';
import { valorEmpresa, afegirAmbCost } from './joc.js';
import { COMISSIO_BORSA, RECURSOS } from './dades.js';

export const modeProva = !config.apiKey;

const SDK = 'https://www.gstatic.com/firebasejs/12.19.0';
const CLAU_PROVA = 'fem-empresa-prova';
let fb = null; // mòduls i instàncies de Firebase

async function carregarFirebase() {
  if (fb) return fb;
  const [app, auth, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const instancia = app.initializeApp(config);
  fb = { auth, fs, a: auth.getAuth(instancia), db: fs.getFirestore(instancia) };
  return fb;
}

// Crida cb(usuari) cada cop que canvia la sessió (usuari = null si no n'hi ha)
export async function escoltarSessio(cb) {
  if (modeProva) {
    cb(sessionStorage.getItem('fem-empresa-dins') ? { uid: 'prova', nom: 'Mode de prova' } : null);
    return;
  }
  const { auth, a } = await carregarFirebase();
  auth.onAuthStateChanged(a, (u) => cb(u ? { uid: u.uid, nom: u.displayName || u.email, email: (u.email || '').toLowerCase() } : null));
}

export async function entrar() {
  if (modeProva) {
    sessionStorage.setItem('fem-empresa-dins', '1');
    location.reload();
    return;
  }
  const { auth, a } = await carregarFirebase();
  await auth.signInWithPopup(a, new auth.GoogleAuthProvider());
}

export async function sortir() {
  if (modeProva) {
    sessionStorage.removeItem('fem-empresa-dins');
    location.reload();
    return;
  }
  const { auth, a } = await carregarFirebase();
  await auth.signOut(a);
}

export async function carregarEmpresa(uid) {
  if (modeProva) {
    try { return JSON.parse(localStorage.getItem(CLAU_PROVA)) || null; } catch { return null; }
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDoc(fs.doc(db, 'empreses', uid));
  return snap.exists() ? snap.data() : null;
}

export async function desarEmpresa(uid, estat) {
  const dades = { ...estat, valor: valorEmpresa(estat), actualitzada: Date.now() };
  if (modeProva) {
    try { localStorage.setItem(CLAU_PROVA, JSON.stringify(dades)); } catch { /* sense espai */ }
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.setDoc(fs.doc(db, 'empreses', uid), dades);
}

export async function classificacio(uid, estat) {
  if (modeProva) return [{ uid, nom: estat.nom, logo: estat.logo, valor: valorEmpresa(estat) }];
  const { fs, db } = await carregarFirebase();
  const q = fs.query(fs.collection(db, 'empreses'), fs.orderBy('valor', 'desc'), fs.limit(50));
  const snap = await fs.getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, nom: d.data().nom, logo: d.data().logo, valor: d.data().valor }));
}

// =============================================================
//  BORSA ENTRE EMPRESES (col·lecció "mercat")
//  Sense servidor: el comprador marca l'oferta com a venuda (camp "pendent")
//  i el venedor cobra després des del seu navegador. Les regles de Firestore
//  comproven que els números quadrin.
// =============================================================

const CLAU_MERCAT = 'fem-empresa-mercat';
// Els contractes directes no paguen comissió; la borsa sí
const net = (o) => (o.perA ? (o.pendent || 0) : Math.floor((o.pendent || 0) * (1 - COMISSIO_BORSA)));
const copia = (o) => JSON.parse(JSON.stringify(o));
const ambValor = (e) => ({ ...e, valor: valorEmpresa(e), actualitzada: Date.now() });

function treureInventari(e, recurs, q) {
  if (!Number.isInteger(q) || q < 1) throw new Error('Tria una quantitat de 1 o més.');
  if ((e.inventari[recurs] || 0) < q) throw new Error('No en tens tantes unitats al magatzem.');
  e.inventari[recurs] -= q;
  if (e.inventari[recurs] === 0) delete e.inventari[recurs];
}
const afegirInventari = (e, recurs, q) => { e.inventari[recurs] = (e.inventari[recurs] || 0) + q; };

// --- mode de prova: un mercat simulat amb empreses fictícies ---
function mercatProva() {
  let m = null;
  try { m = JSON.parse(localStorage.getItem(CLAU_MERCAT)); } catch { /* res */ }
  if (!m) {
    m = [];
    const bots = [['Cooperativa del Poble', 8], ['Distribucions Vallès', 13], ['Can Pagès SL', 2]];
    for (const r of Object.keys(RECURSOS)) {
      bots.forEach(([nom, logo], k) => m.push({
        id: `bot-${r}-${k}`, venedor: `bot${k}`, nomVenedor: nom, logo, recurs: r,
        quantitat: 20 + 15 * k, preu: Math.max(1, Math.round(RECURSOS[r].preu * (1.1 + 0.15 * k))), pendent: 0, creada: 0,
      }));
    }
  }
  return m;
}
const desarMercatProva = (m) => localStorage.setItem(CLAU_MERCAT, JSON.stringify(m));

// perA: uid de l'empresa destinatària si és un contracte directe
export async function publicarOferta(uid, estat, recurs, quantitat, preu, perA = null, nomPerA = null) {
  quantitat = Math.floor(quantitat); preu = Math.round(preu);
  if (!(preu >= 1)) throw new Error('El preu ha de ser d\'1 € o més.');
  if (perA === uid) throw new Error('No et pots enviar un contracte a tu mateix.');
  const nou = copia(estat);
  treureInventari(nou, recurs, quantitat);
  const oferta = { venedor: uid, nomVenedor: estat.nom, logo: estat.logo, recurs, quantitat, preu, pendent: 0, creada: Date.now(), qualitat: estat.qualitat?.[recurs] || 0 };
  if (perA) { oferta.perA = perA; oferta.nomPerA = nomPerA || ''; }
  if (modeProva) {
    const m = mercatProva();
    m.push({ ...oferta, id: `meva-${Date.now()}` });
    desarMercatProva(m);
    localStorage.setItem(CLAU_PROVA, JSON.stringify(ambValor(nou)));
  } else {
    const { fs, db } = await carregarFirebase();
    const lot = fs.writeBatch(db);
    lot.set(fs.doc(fs.collection(db, 'mercat')), oferta);
    lot.set(fs.doc(db, 'empreses', uid), ambValor(nou));
    await lot.commit();
  }
  Object.assign(estat, nou);
}

export async function ofertes(recurs) {
  let llista;
  if (modeProva) llista = mercatProva().filter((o) => o.recurs === recurs);
  else {
    const { fs, db } = await carregarFirebase();
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'mercat'), fs.where('recurs', '==', recurs)));
    llista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return llista.filter((o) => o.quantitat > 0 && !o.perA).sort((a, b) => a.preu - b.preu || a.creada - b.creada);
}

// Contractes que altres empreses t'han enviat
export async function contractesEntrants(uid) {
  let llista;
  if (modeProva) llista = mercatProva().filter((o) => o.perA === uid);
  else {
    const { fs, db } = await carregarFirebase();
    const snap = await fs.getDocs(fs.query(fs.collection(db, 'mercat'), fs.where('perA', '==', uid)));
    llista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return llista.filter((o) => o.quantitat > 0).sort((a, b) => b.creada - a.creada);
}

// Preu més baix de cada producte a la borsa (per a la cinta de preus)
let memoriaPreus = { t: 0, preus: {} };
export async function preusMinims() {
  if (Date.now() - memoriaPreus.t < 60000) return memoriaPreus.preus;
  let llista;
  if (modeProva) llista = mercatProva();
  else {
    const { fs, db } = await carregarFirebase();
    llista = (await fs.getDocs(fs.collection(db, 'mercat'))).docs.map((d) => d.data());
  }
  const preus = {};
  for (const o of llista) {
    if (o.perA || o.quantitat < 1) continue;
    if (preus[o.recurs] == null || o.preu < preus[o.recurs]) preus[o.recurs] = o.preu;
  }
  memoriaPreus = { t: Date.now(), preus };
  return preus;
}

export async function mevesOfertes(uid) {
  if (modeProva) return mercatProva().filter((o) => o.venedor === uid);
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'mercat'), fs.where('venedor', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function comprar(uid, estat, idOferta, quantitat, percentTransport = 0) {
  quantitat = Math.floor(quantitat);
  if (!(quantitat >= 1)) throw new Error('Tria una quantitat de 1 o més.');
  const aplicar = (o) => {
    if (!o || o.quantitat < 1) throw new Error('Aquesta oferta ja s\'ha esgotat.');
    if (o.venedor === uid) throw new Error('No pots comprar la teva pròpia oferta.');
    if (o.perA && o.perA !== uid) throw new Error('Aquest contracte és per a una altra empresa.');
    if (quantitat > o.quantitat) throw new Error(`Només en queden ${o.quantitat}.`);
    const cost = quantitat * o.preu;
    const transport = Math.ceil(cost * percentTransport);
    const nou = copia(estat);
    if (nou.diners < cost + transport) throw new Error('No tens prou diners.');
    nou.diners -= cost + transport;
    afegirAmbCost(nou, o.recurs, quantitat, o.preu);
    return { nou, quantitat: o.quantitat - quantitat, pendent: (o.pendent || 0) + cost, cost, transport, recurs: o.recurs };
  };
  if (modeProva) {
    const m = mercatProva();
    const o = m.find((x) => x.id === idOferta);
    const r = aplicar(o);
    o.quantitat = r.quantitat;
    if (o.venedor.startsWith('bot')) o.pendent = 0; else o.pendent = r.pendent;
    desarMercatProva(m.filter((x) => x.quantitat > 0 || x.pendent > 0));
    localStorage.setItem(CLAU_PROVA, JSON.stringify(ambValor(r.nou)));
    Object.assign(estat, r.nou);
    return r;
  }
  const { fs, db } = await carregarFirebase();
  const ref = fs.doc(db, 'mercat', idOferta);
  const r = await fs.runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const res = aplicar(snap.exists() ? snap.data() : null);
    tx.update(ref, { quantitat: res.quantitat, pendent: res.pendent });
    tx.set(fs.doc(db, 'empreses', uid), ambValor(res.nou));
    return res;
  });
  Object.assign(estat, r.nou);
  return r;
}

// Cobra el que han comprat els altres de les teves ofertes. Retorna els euros nets cobrats.
export async function cobrarVendes(uid, estat) {
  if (modeProva) {
    // Simulació: el poble compra les teves ofertes si el preu és raonable i porten 30 s publicades
    const m = mercatProva();
    let total = 0;
    for (const o of m) {
      if (o.venedor !== uid) continue;
      if (o.quantitat > 0 && Date.now() - o.creada > 30000 && o.preu <= RECURSOS[o.recurs].preu * 1.4) {
        o.pendent += o.quantitat * o.preu; o.quantitat = 0;
      }
      if (o.pendent > 0) { total += net(o); o.pendent = 0; }
    }
    if (!total) { desarMercatProva(m); return 0; }
    desarMercatProva(m.filter((x) => x.quantitat > 0 || x.pendent > 0));
    estat.diners += total;
    localStorage.setItem(CLAU_PROVA, JSON.stringify(ambValor(estat)));
    return total;
  }
  const meves = (await mevesOfertes(uid)).filter((o) => o.pendent > 0 || o.quantitat === 0);
  if (!meves.length) return 0;
  const { fs, db } = await carregarFirebase();
  const r = await fs.runTransaction(db, async (tx) => {
    const refs = meves.map((o) => fs.doc(db, 'mercat', o.id));
    const snaps = await Promise.all(refs.map((ref) => tx.get(ref)));
    const nou = copia(estat);
    let total = 0;
    snaps.forEach((s, k) => {
      if (!s.exists()) return;
      const o = s.data();
      total += net(o);
      if (o.quantitat === 0) tx.delete(refs[k]);
      else if (o.pendent > 0) tx.update(refs[k], { pendent: 0 });
    });
    nou.diners += total;
    if (total) tx.set(fs.doc(db, 'empreses', uid), ambValor(nou));
    return { nou, total };
  });
  if (r.total) Object.assign(estat, r.nou);
  return r.total;
}

// Retira una oferta: el que no s'ha venut torna al magatzem i es cobra el que s'havia venut
export async function retirarOferta(uid, estat, idOferta) {
  const aplicar = (o) => {
    if (!o || o.venedor !== uid) throw new Error('Aquesta oferta no és teva.');
    const nou = copia(estat);
    if (o.quantitat > 0) afegirInventari(nou, o.recurs, o.quantitat);
    nou.diners += net(o);
    return nou;
  };
  if (modeProva) {
    const m = mercatProva();
    const nou = aplicar(m.find((x) => x.id === idOferta));
    desarMercatProva(m.filter((x) => x.id !== idOferta));
    localStorage.setItem(CLAU_PROVA, JSON.stringify(ambValor(nou)));
    Object.assign(estat, nou);
    return;
  }
  const { fs, db } = await carregarFirebase();
  const ref = fs.doc(db, 'mercat', idOferta);
  const nou = await fs.runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const n = aplicar(snap.exists() ? snap.data() : null);
    tx.delete(ref);
    tx.set(fs.doc(db, 'empreses', uid), ambValor(n));
    return n;
  });
  Object.assign(estat, nou);
}

// =============================================================
//  XAT DE LA CLASSE (col·lecció "xat")
// =============================================================
const CLAU_XAT = 'fem-empresa-xat';
export async function enviarMissatge(uid, estat, text) {
  text = String(text || '').trim().slice(0, 200);
  if (!text) return;
  const m = { autor: uid, nom: estat.nom, logo: estat.logo, text, creada: Date.now() };
  if (modeProva) {
    const llista = JSON.parse(localStorage.getItem(CLAU_XAT) || '[]');
    llista.push(m);
    localStorage.setItem(CLAU_XAT, JSON.stringify(llista.slice(-50)));
    escoltadorsProva.forEach((cb) => cb(llista.slice(-30)));
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.addDoc(fs.collection(db, 'xat'), m);
}

const escoltadorsProva = new Set();
// Crida cb(missatges) cada cop que arriba un missatge nou. Retorna una funció per parar.
export async function escoltarXat(cb) {
  if (modeProva) {
    let llista = JSON.parse(localStorage.getItem(CLAU_XAT) || 'null');
    if (!llista) {
      llista = [{ autor: 'bot0', nom: 'Cooperativa del Poble', logo: 8, text: 'Bon dia a tothom! Venem blat barat a la borsa.', creada: Date.now() - 60000 }];
      localStorage.setItem(CLAU_XAT, JSON.stringify(llista));
    }
    escoltadorsProva.add(cb);
    cb(llista.slice(-30));
    return () => escoltadorsProva.delete(cb);
  }
  const { fs, db } = await carregarFirebase();
  const q = fs.query(fs.collection(db, 'xat'), fs.orderBy('creada', 'desc'), fs.limit(30));
  return fs.onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data()).reverse()), (err) => console.error(err));
}

// Perfil complet d'una empresa (per al cercador)
export async function perfilEmpresa(uid) {
  if (modeProva) {
    if (uid === 'prova') return JSON.parse(localStorage.getItem(CLAU_PROVA));
    return null;
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDoc(fs.doc(db, 'empreses', uid));
  return snap.exists() ? snap.data() : null;
}

// =============================================================
//  MÓN: cada empresa té una ciutat en una posició (slot) del mapa comú
// =============================================================
export async function assignarSlot() {
  if (modeProva) return 0;
  const { fs, db } = await carregarFirebase();
  const ref = fs.doc(db, 'mon', 'comptador');
  return fs.runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const n = snap.exists() ? snap.data().n : 0;
    tx.set(ref, { n: n + 1 });
    return n;
  });
}

// Totes les empreses (per dibuixar el món). En mode de prova, dues ciutats fictícies.
export async function carregarMon(uid, estat) {
  if (modeProva) {
    const bot = (nom, logo, slot, edificis) => {
      const parceles = Array.from({ length: estat.parceles.length }, () => ({ estat: 'bloquejada' }));
      edificis.forEach(([i, tipus, nivell]) => { parceles[i] = { estat: 'edifici', tipus, nivell }; });
      return { uid: `bot-${slot}`, nom, logo, slot, parceles, carreteresMon: [] };
    };
    return [
      { uid, ...estat },
      bot('Cooperativa del Poble SCCL', 8, 1, [[14, 'camp-cultiu', 2], [15, 'granja', 1], [20, 'seu-central', 1], [21, 'moli', 1]]),
      bot('Distribucions Vallès SL', 13, 2, [[14, 'estacio-bombeig', 3], [15, 'central-electrica', 2], [21, 'seu-central', 1], [20, 'botiga', 1], [8, 'solar', 1]]),
    ];
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.collection(db, 'empreses'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() })).filter((e) => e.slot != null);
}

// El nom (certificació negativa) no pot coincidir amb el d'una altra empresa de la classe
export async function nomDisponible(uid, nom) {
  const net = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  if (modeProva) return !['cooperativadelpoble', 'distribucionsvalles', 'canpages'].includes(net(nom));
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.collection(db, 'empreses'));
  return !snap.docs.some((d) => d.id !== uid && net(d.data().nomBase || d.data().nom) === net(nom));
}

// Esborra totes les ofertes i contractes propis (per tornar a començar)
export async function esborrarMevesOfertes(uid) {
  if (modeProva) { desarMercatProva(mercatProva().filter((o) => o.venedor !== uid)); return; }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'mercat'), fs.where('venedor', '==', uid)));
  await Promise.all(snap.docs.map((d) => fs.deleteDoc(d.ref)));
}

// =============================================================
//  PROFESSORAT
//  config/joc: { professors: [correus], partida, fase, anunci, xatActiu, reptes: [] }
//  avisos/{id}: { perA, tipus: 'ajut' | 'missatge' | 'reinici', import, text, creada, llegit }
// =============================================================
const CLAU_CONFIG = 'fem-empresa-config';
const CLAU_AVISOS = 'fem-empresa-avisos';
export const CONFIG_INICIAL = { professors: [], partida: 1, fase: 'auto', anunci: '', xatActiu: true, reptes: [] };

export async function getConfig() {
  if (modeProva) {
    try { return { ...CONFIG_INICIAL, ...JSON.parse(localStorage.getItem(CLAU_CONFIG) || '{}') }; } catch { return { ...CONFIG_INICIAL }; }
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDoc(fs.doc(db, 'config', 'joc'));
  return { ...CONFIG_INICIAL, ...(snap.exists() ? snap.data() : {}) };
}

export async function setConfig(canvis) {
  if (modeProva) {
    const c = await getConfig();
    localStorage.setItem(CLAU_CONFIG, JSON.stringify({ ...c, ...canvis }));
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.setDoc(fs.doc(db, 'config', 'joc'), canvis, { merge: true });
}

export function esProfessor(usuari, config) {
  if (modeProva) return sessionStorage.getItem('fem-empresa-prof') === '1';
  return !!usuari?.email && (config.professors || []).map((x) => String(x).toLowerCase().trim()).includes(usuari.email);
}
export function entrarComProfessorProva() {
  sessionStorage.setItem('fem-empresa-prof', '1');
  sessionStorage.setItem('fem-empresa-dins', '1');
  location.reload();
}
export function sortirModeProfessorProva() { sessionStorage.removeItem('fem-empresa-prof'); location.reload(); }

// Totes les empreses, amb totes les dades (també les que encara s'estan constituint)
export async function llistarEmpreses() {
  if (modeProva) {
    const e = JSON.parse(localStorage.getItem(CLAU_PROVA) || 'null');
    return e ? [{ uid: 'prova', ...e }] : [];
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.collection(db, 'empreses'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function enviarAvis(perA, dades) {
  const av = { perA, tipus: dades.tipus, import: Math.round(Number(dades.import) || 0), text: String(dades.text || '').slice(0, 300), creada: Date.now(), llegit: false };
  if (modeProva) {
    const l = JSON.parse(localStorage.getItem(CLAU_AVISOS) || '[]');
    l.push({ ...av, id: `a${Date.now()}${Math.random().toString(36).slice(2, 6)}` });
    localStorage.setItem(CLAU_AVISOS, JSON.stringify(l));
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.addDoc(fs.collection(db, 'avisos'), av);
}

export async function avisosPendents(uid) {
  if (modeProva) return JSON.parse(localStorage.getItem(CLAU_AVISOS) || '[]').filter((a) => a.perA === uid && !a.llegit);
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'avisos'), fs.where('perA', '==', uid), fs.where('llegit', '==', false)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.creada - b.creada);
}

export async function marcarLlegit(id) {
  if (modeProva) {
    const l = JSON.parse(localStorage.getItem(CLAU_AVISOS) || '[]').map((a) => (a.id === id ? { ...a, llegit: true } : a));
    localStorage.setItem(CLAU_AVISOS, JSON.stringify(l));
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.updateDoc(fs.doc(db, 'avisos', id), { llegit: true });
}

export async function esborrarEmpresa(uid) {
  await alliberarLocalsDe(uid).catch(() => {});
  if (modeProva) { localStorage.removeItem(CLAU_PROVA); return; }
  const { fs, db } = await carregarFirebase();
  await fs.deleteDoc(fs.doc(db, 'empreses', uid));
}

export async function missatgesXat() {
  if (modeProva) return JSON.parse(localStorage.getItem(CLAU_XAT) || '[]').map((m, k) => ({ id: String(k), ...m })).reverse();
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'xat'), fs.orderBy('creada', 'desc'), fs.limit(100)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function esborrarMissatge(id) {
  if (modeProva) {
    const l = JSON.parse(localStorage.getItem(CLAU_XAT) || '[]');
    l.splice(Number(id), 1);
    localStorage.setItem(CLAU_XAT, JSON.stringify(l));
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.deleteDoc(fs.doc(db, 'xat', id));
}

// Esborra tots els documents d'una col·lecció (per lots de 400)
async function buidarColleccio(nom) {
  const { fs, db } = await carregarFirebase();
  for (;;) {
    const snap = await fs.getDocs(fs.query(fs.collection(db, nom), fs.limit(400)));
    if (snap.empty) return;
    const lot = fs.writeBatch(db);
    snap.docs.forEach((d) => lot.delete(d.ref));
    await lot.commit();
  }
}

// Partida nova per a tota la classe: cada alumne torna a començar en entrar
export async function novaPartida() {
  const c = await getConfig();
  if (modeProva) {
    localStorage.removeItem(CLAU_MERCAT); localStorage.removeItem(CLAU_XAT); localStorage.removeItem(CLAU_AVISOS); localStorage.removeItem('fem-empresa-locals');
    await setConfig({ partida: (c.partida || 1) + 1, reptes: [], anunci: '' });
    return;
  }
  await buidarColleccio('mercat');
  await buidarColleccio('xat');
  await buidarColleccio('avisos');
  await buidarColleccio('locals');
  const { fs, db } = await carregarFirebase();
  await fs.setDoc(fs.doc(db, 'mon', 'comptador'), { n: 0 });
  await setConfig({ partida: (c.partida || 1) + 1, reptes: [], anunci: '' });
}
export async function buidarXat() {
  if (modeProva) { localStorage.removeItem(CLAU_XAT); return; }
  await buidarColleccio('xat');
}

// =============================================================
//  LOCALS DE LA CIUTAT (col·lecció "locals", un document per local)
//  { uid, nom, logo, sector, fase, estat, faseObra }
//  Un local només el pot ocupar una empresa.
// =============================================================
const CLAU_LOCALS = 'fem-empresa-locals';
function localsProva() {
  let m = null;
  try { m = JSON.parse(localStorage.getItem(CLAU_LOCALS)); } catch { /* res */ }
  if (!m) {
    m = {
      L12: { uid: 'bot-1', nom: 'Forn de la Plaça SL', logo: 6, sector: 'fleca', fase: 2, estat: 'obert' },
      L20: { uid: 'bot-2', nom: 'Bicis La Mola', logo: 14, sector: 'bicis', fase: 1, estat: 'obert' },
      L4: { uid: 'bot-3', nom: 'Cafè del Casal SCCL', logo: 16, sector: 'cafeteria', fase: 3, estat: 'obert' },
    };
    localStorage.setItem(CLAU_LOCALS, JSON.stringify(m));
  }
  return m;
}

export async function carregarLocals() {
  if (modeProva) return localsProva();
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.collection(db, 'locals'));
  return Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
}

// Reserva un local lliure (falla si ja és d'algú)
export async function reservarLocal(uid, id, dades) {
  const doc = { uid, ...dades, actualitzat: Date.now() };
  if (modeProva) {
    const m = localsProva();
    if (m[id] && m[id].uid !== uid) throw new Error('Aquest local ja l\'ha agafat una altra empresa.');
    m[id] = doc; localStorage.setItem(CLAU_LOCALS, JSON.stringify(m)); return;
  }
  const { fs, db } = await carregarFirebase();
  const ref = fs.doc(db, 'locals', id);
  await fs.runTransaction(db, async (tx) => {
    const s = await tx.get(ref);
    if (s.exists() && s.data().uid !== uid) throw new Error('Aquest local ja l\'ha agafat una altra empresa.');
    tx.set(ref, doc);
  });
}

export async function actualitzarLocal(uid, id, dades) {
  if (modeProva) {
    const m = localsProva();
    if (m[id]?.uid === uid) { m[id] = { ...m[id], ...dades, actualitzat: Date.now() }; localStorage.setItem(CLAU_LOCALS, JSON.stringify(m)); }
    return;
  }
  const { fs, db } = await carregarFirebase();
  await fs.updateDoc(fs.doc(db, 'locals', id), { ...dades, actualitzat: Date.now() });
}

export async function alliberarLocal(id) {
  if (!id) return;
  if (modeProva) { const m = localsProva(); delete m[id]; localStorage.setItem(CLAU_LOCALS, JSON.stringify(m)); return; }
  const { fs, db } = await carregarFirebase();
  await fs.deleteDoc(fs.doc(db, 'locals', id));
}

// Allibera tots els locals d'una empresa (reinici o esborrat)
export async function alliberarLocalsDe(uid) {
  if (modeProva) {
    const m = localsProva();
    for (const [k, v] of Object.entries(m)) if (v.uid === uid) delete m[k];
    localStorage.setItem(CLAU_LOCALS, JSON.stringify(m)); return;
  }
  const { fs, db } = await carregarFirebase();
  const snap = await fs.getDocs(fs.query(fs.collection(db, 'locals'), fs.where('uid', '==', uid)));
  await Promise.all(snap.docs.map((d) => fs.deleteDoc(d.ref)));
}
