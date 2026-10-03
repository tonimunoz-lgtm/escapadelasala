// Capa de dades: Firebase (Auth + Firestore) o mode de prova amb el navegador.
import config from './firebase-config.js';
import { valorEmpresa } from './joc.js';

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
  auth.onAuthStateChanged(a, (u) => cb(u ? { uid: u.uid, nom: u.displayName || u.email } : null));
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
