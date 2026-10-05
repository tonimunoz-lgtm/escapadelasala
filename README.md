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

## Com comença el joc
1. **Constitució de l'empresa** com a la vida real a Catalunya: forma jurídica (autònom, CB, SCP, SL, SLL, SA, cooperativa),
   socis i capital social, denominació (certificació negativa: el nom no es pot repetir a la classe), domicili social
   i tots els tràmits en ordre (banc, estatuts, notari, NIF, Registre, Hisenda, RETA, comunicació a l'Ajuntament), amb costos i terminis reals orientatius.
   Les dades són a `js/legal.js` (revisa-les: la normativa i les taxes canvien).
2. **Posada en marxa**: alta com a empresa ocupadora, gestoria o tècnic/a de RRHH, contractar personal (sou + Seguretat Social),
   lloguer de l'oficina. **1 hora real = 1 setmana** de l'empresa: les despeses mensuals es cobren a poc a poc.

## Què es pot fer al joc
- **Món comú**: totes les empreses de la classe en un sol mapa. Fes zoom enrere (botó "Món") per veure-les i construeix carreteres
  pel camp per connectar ciutats (sense carretera, comprar a la borsa costa un 10% de transport).
- **Ciutat amb illes i carrers**: 36 parcel·les en 9 illes separades per carreteres (imatges `img/mapa/carretera-*.webp`).
  Comences a la illa central i pots comprar més parcel·les o fer-hi carreteres noves, que s'uneixen soles amb les del costat.
  Per fer la ciutat més gran, canvia `MIDA_MAPA` a `js/dades.js` (ha de ser múltiple de 2).
- **Construir i produir** en cadena (aigua, electricitat, llavors, blat, farina, pa, vi, oli, maons…). Produir costa **sous**.
- **Nivells**: cada edifici es pot millorar fins al nivell 10; cada nivell el fa treballar més ràpid.
- **Botiga**: ven al públic al preu que tu triïs. Com més car, més lenta la venda (i més sous).
- **Borsa entre alumnes**: publica ofertes des del Magatzem i compra les dels companys. La borsa cobra un 3% al venedor.
  Els diners de les vendes es cobren sols quan el venedor té el joc obert.
- **Mercat de l'escola**: compra qualsevol producte a preu fix (la sortida segura).
- **Missions** guiades amb premi (barra de dalt, com a Sim Companies).
- **Nivell d'empresa** segons el valor: desbloqueja els contractes (nivell 2) i el banc (nivell 3).
- **Fases econòmiques** (normalitat, expansió, recessió) que canvien cada 20 minuts i afecten la producció i les vendes.
- **Magatzem** per categories amb el cost mitjà de cada producte i el valor total de l'estoc.
- **Mercat** amb cinta de preus, categories, borsa i **contractes directes** entre empreses (sense comissió).
- **Empresa**: gràfic del valor, posició a la classe, balanç (actius, passius, patrimoni net), **banc** amb préstecs i interessos.
- **Recerca i qualitat** (nivell 4): el laboratori fa punts de recerca que pugen la qualitat (Q0 a Q5) de cada producte.
  Més qualitat vol dir que l'escola paga més i que la botiga ven més cara.
- **Directors** (nivell 4): operacions, màrqueting, tecnologia i finances. Cobren cada hora i milloren l'empresa.
- **Cerca d'empreses**: troba qualsevol empresa de la classe, mira'n els edificis, la qualitat i compra-li les ofertes.
- **Xat de la classe** amb avisos de missatges nous (es pot desactivar amb `XAT_ACTIU` a `js/dades.js`).
- **Classificació** pel valor de l'empresa.

## Si ja tenies una versió anterior publicada
Torna a enganxar `firestore.rules` a Firestore > Regles i prem **Publica** cada cop que aquest fitxer canviï (borsa, contractes i xat).
Les empreses ja creades s'adapten soles al mapa nou.

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
