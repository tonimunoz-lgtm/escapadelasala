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

## Com és el joc (versió 2: Matadepera)
- **Una ciutat comuna** inspirada en Matadepera, amb els carrers reals (Sant Joan, Sant Llorenç, Ctra. de Terrassa,
  Pg. Àngel Guimerà, Av. del Mas Sot...), l'Ajuntament, els bancs, l'Institut, la Plaça del Casal, el Parc Natural al nord
  i, per la Carretera de Terrassa, la zona de **Terrassa** amb la Notaria, Hisenda, la Seguretat Social, el Registre Mercantil
  i el polígon. El plànol és esquemàtic: es pot retocar a `js/ciutat.js` (EDIFICIS_CIUTAT i LOCALS_CIUTAT).
- **Constitució guiada**: la Marta et rep (nom, sector i logo) i vas edifici per edifici (Gestoria, Registre, Banc, Notaria,
  Hisenda, Seguretat Social, Ajuntament). A cada lloc t'atén una persona i et dona un document per a la **carpeta**.
- **Local**: llogues un local amb el cartell ES LLOGA (o una nau al polígon), demanes el permís d'obres, fas la reforma i obres.
- **Negoci** (fleca, cafeteria, botiga de roba o taller de bicicletes): compres matèria primera, poses el preu, contractes gent,
  fas publicitat i amplies el negoci en tres fases. Més endavant pots comprar un solar i construir-hi el teu edifici.
- **Vida a la ciutat**: cotxes, furgonetes i autobusos pels carrers i vianants que entren als negocis.
- **Empresa**: compte de resultats de cada setmana, balanç, banc, personal i despeses, reptes, directors i classificació.
- 1 hora real = 1 setmana de l'empresa.

## Panell del professorat
1. A Firestore, crea la col·lecció **config** amb un document d'ID **joc**.
   Afegeix-hi un camp **professors** de tipus *array* amb el teu correu (el mateix amb què entres amb Google), en minúscules.
2. Publica `firestore.rules` (cada cop que canviï).
3. Entra al joc: veuràs el **Panell del professorat** en lloc del joc. Des d'allà pots:
   - veure totes les empreses (valor, diners, deute, plantilla, darrera activitat) i descarregar-les en CSV;
   - enviar **subvencions** (o multes, amb import negatiu) i **missatges** a una empresa o a tothom;
   - **reiniciar** o **esborrar** l'empresa d'un alumne;
   - crear **reptes** amb premi i data límit (valor, diners, nivell, produir, construir, qualitat, plantilla...);
   - fixar la **fase econòmica**, publicar un **anunci** per a tothom i activar o desactivar el **xat**;
   - llegir i **esborrar missatges** del xat;
   - començar una **partida nova** per a tota la classe;
   - afegir més professorat a la llista.
   Amb el botó "Juga com a alumne" pots tenir també la teva empresa.
Els alumnes reben les ordres del professorat en menys d'un minut.

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
- En mode de prova la borsa té empreses fictícies, i les teves ofertes les "compra el poble" si el preu és raonable.
