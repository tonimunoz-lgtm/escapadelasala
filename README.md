# Fem Empresa

Simulador d'empresa en català per jugar a classe. Funciona només amb serveis gratuïts:
**GitHub** (codi i imatges), **Vercel** (allotjament) i **Firebase** pla Spark (inici de sessió i dades).
No cal instal·lar res: no hi ha cap pas de compilació.

## 1. Pujar el projecte a GitHub
1. Crea un repositori nou a github.com (pot ser privat).
2. **Add file > Upload files**. GitHub accepta 100 fitxers per pujada, així que fes-ho en dues vegades:
   - primer arrossega la carpeta `img`,
   - després la resta: `index.html`, `manifest.json`, `vercel.json`, `firestore.rules`, `README.md` i les carpetes `css` i `js`.

## 2. Publicar-lo a Vercel
1. Entra a vercel.com amb el compte de GitHub.
2. **Add New > Project**, tria el repositori i a *Framework Preset* posa **Other**. No canviïs res més.
3. **Deploy**. En un minut tindràs l'adreça (per exemple `fem-empresa.vercel.app`).

En aquest punt el joc ja funciona en **mode de prova** (sense comptes, les dades es desen al navegador).

## 3. Connectar Firebase (comptes i dades compartides)
1. A console.firebase.google.com crea un projecte (Google Analytics no cal). Queda al pla gratuït Spark.
2. **Afegeix una app web** (icona `</>`), copia l'objecte `firebaseConfig` i enganxa'n els valors a
   `js/firebase-config.js`. Ho pots fer a GitHub mateix amb el llapis d'editar; Vercel es tornarà a publicar sol.
3. **Authentication > Comença > Sign-in method > Google**: activa'l.
4. **Authentication > Configuració > Dominis autoritzats**: afegeix l'adreça de Vercel (`fem-empresa.vercel.app`).
5. **Firestore Database > Crea una base de dades** en mode producció, ubicació `eur3 (europe-west)`.
6. A la pestanya **Regles** de Firestore, enganxa el contingut de `firestore.rules` i prem **Publica**.

## Ajustar el joc
Tota l'economia és a `js/dades.js`: diners inicials, preus, temps, costos i la constant `VELOCITAT`
(posa 2 o 3 per a sessions curtes de classe).

## Com està fet
- `js/dades.js`: edificis, recursos i equilibri.
- `js/joc.js`: regles (construir, produir, recollir, vendre). La producció es calcula amb marques de temps,
  així que avança encara que l'alumne tanqui la pestanya.
- `js/desa.js`: Firebase o mode de prova. Cada empresa és un sol document a `empreses/{uid}`.
- `js/app.js`: interfície i mapa isomètric.

## Limitacions conegudes
- Les regles de Firestore només deixen que cadascú escrigui la seva empresa, però els càlculs es fan al navegador:
  un alumne amb coneixements podria fer trampa des de la consola. Es pot blindar més endavant amb funcions de Vercel.
- El mercat compra a preu fix. El mercat entre alumnes és el següent pas.
