# Fem Empresa — resum per continuar en una conversa nova

Joc educatiu de gestió empresarial (català). Vanilla JS + Canvas 2D, Firebase Firestore, Vercel, sense compilació.
Fitxers clau: `js/parc.js` (simulació, editor i dibuix del parc), `js/parc-dades.js` (catàleg, dades i animacions),
`js/mon-parcs.js` (mode món, NOU), `js/app.js`, `js/joc.js`, `js/legal.js`, `css/estil.css`, imatges a `img/parc/` i `img/mapa/`.

## Mode món (substitueix la ciutat)
- `crearMon()` a `js/mon-parcs.js` té la mateixa interfície que tenia `crearCiutat()` (setLocals, setObjectiu, centrarEn, vistaTot, vistaPoble, zoom).
- Fons: `img/mapa/mon.webp` (paisatge amb les carreteres originals esborrades). 1 unitat del món = 1 px de la imatge.
- Coordenades (a, b) al llarg dels carrers, origen a la rotonda del mig `C1 = (853, 420)`; `P(a,b) = (853 + a - b, 420 + (a+b)/2)`.
- Graella de cel·les de 96 unitats (parcel·la de 80 + carrer). `CELLES`: 67 parcel·les triades sobre el prat. Ids P1..P67 (ordenats des del centre).
- L'entrada de cada parc mira cap a l'avinguda més propera (`costat`). Miniatures amb `giraParc`/`giraObjecte`.
- La ciutat (`ciutat.js`) ja no es dibuixa; només s'importa `localsPerId`/`nomCarrerDe` per a codi antic de locals.
- Tràmits: el botó de la missió obre directament l'escena que toca. Panell nou «Oficines» (navegació) amb totes les oficines.
- «Parcs» (abans «Empreses») llista els parcs de la classe.

## Parc d'atraccions
- Graella: `M = MIDA_TOTAL + 20`, `OX = ORIGEN.x + 20`. `colocat(o)` (x > -90) substitueix l'antic `x >= 0` (que amagava tot el que hi havia a la parcel·la esquerra i feia que la guixeta no cobrés).
- Fons del parc: `img/parc/fons-parc.webp` encaixat amb `PAISATGE` (prat sobre x -28..29, y -15..31).
- Fora del parc (`EXTERIOR`: y 21..27, parcel·les bx -3..3) i carretera (`CARRETERA`: y 28..29).
  - Pàrquing: parcel·la sencera 7x7 (`parcella: true`), 40 places, una entrada amb guixeta i barrera; cobra si preu > 0.
  - Parada d'autobús: `exterior` + `carretera` (ha de tocar la carretera). Marquesina `parada-bus-v2.webp` (`MARQUESINA`, dibuix propi).
    Autobús de línia (`autobus-darrere.webp`, cap a −x pel carril de la vorera): frena, para, en baixen fins a 14 visitants
    (`pendentsBus`: el 30 % de les arribades si hi ha parada) per la porta de davant, caminen per la vorera i entren. L'altre sentit: `autobus-davant.webp`.
    Es circula per la dreta (+x pel carril de fora, y = 29,5; −x pel de la vorera, y = 28,5) i els vehicles fan cua (no s'atravessen).
  - Trànsit (`transit`): cotxes que passen, cotxes que entren al pàrquing, autobús.
  - Esplanada del portal fins a la carretera (`ocup = -2`): la gent hi arriba caminant.
  - Els pàrquings/casetes/parades antics es retiren i es retornen els diners (`migraExterior`).
- Muralla: torres només a les cantonades; porta on arriba la passarel·la del ressort.
- Atraccions animades: vegeu camp `anim` a OBJECTES (gronxa, roda, tren, barques, raiers, carrusel, tasses, xoc, torre) i `llums`.

## Camins de llambordes i objectes amb 4 vistes
- Camins dibuixats per codi (`telaPedra`/`dibuixaPedra` a parc.js): llambordes + vora clara als costats sense veí + peça a les cantonades
  de dins + gruix de la llosa. Màscara de 8 veïns × 4 variants, desades en teles petites (una sola `drawImage` per casella).
  L'esplanada de l'entrada fa servir el mateix dibuix.
- Bases enllosades (`TERRA`, mateix generador amb un altre estil): lloses color sorra amb vora de terracota sota tot el que
  es construeix al parc (menys arbres, bardisses, flors, entrades, exterior i ressort). `setBases` es calcula a recalcula().
- `vistes: 4` a OBJECTES → imatges `img/parc/vistes/<img>-<0..3>.webp` (0 davant avall-esquerra, 1 avall-dreta, 2 amunt-dreta, 3 amunt-esquerra).
  `srcObjecte(t, gir)`, `girsDe(t)`; R o «↻ Gira» passen per les 4. Sense `vistes`, el gir continua sent un mirall.
  Amb 4 vistes: gelats, crispetes, hot-dogs, begudes, banc, casa-terror, primers-auxilis, caixer, globus, botiga-records, llits-elastics, lavabos.
- Atracció nova: `cascades` (Cascades encantades, 3x3, 4 vistes, sense peces mòbils, recerca 8 punts).
- Pendent: muntanya russa de fusta i pavelló de xoc (cal base sense vehicles + recorregut/punts per a cada vista).

## Proporcions (referència: persona = 30 px = 1,7 m → ~17,6 px/m; 1 casella ≈ 4 m)
- `ESCALA_ATRACCIONS = 0.8` (parc-dades.js): atraccions, parades de menjar 1x1 i botigues es dibuixen al 80 % (les imatges tenien taquilles i torniquets al doble de mida). Lavabos, restaurants, entrades i decoració no es toquen.
- Bus: `BUS.llargada = 1.2` caselles (~2 cotxes). Marquesina: pals a u 0,7–1,3, v 1,6. Guixeta del pàrquing a `WP * 0.6`.
- El ressort té els edificis petits (~0,6×) però es deixa així. Els cotxes són ~1,5× la gent.
- Per a imatges noves: demanar «torniquets i taquilla a l'alçada de la cintura d'una persona adulta».

## Ressort del Far West (versió 3)
- Posició fixa `x0: -26, y0: 7`, 14x14 + replà de l'arc (`extra`). Imatge `resort.webp` sense mirall (`punts` = cantonades esq., baix, dreta).
- Passarel·la de l'arc (`sortida`) cap a +X fins al parc (es recalcula en comprar terreny; els trossos que queden dins es converteixen en camí).
- `camins` marcats sobre els camins de sorra. `llocs`: 7 hotels/cabanes, 3 accessos a piscina (`petita`/`gran`), 3 restaurants, botiga.
- Estat `dins`: la gent entra al restaurant/botiga (s'amaga) o neda a la piscina (punts `aigua`).

## Proves
- `prova.html` (parc sol), `prova-mon.html` (món sol). El joc sencer es prova amb Playwright interceptant `js/firebase-config.js` amb `apiKey: ''` (mode de prova).
- `window.parcApi.aPantalla(u,v)` i `.estat()` (retorn d'`obrirParc`) per a proves automàtiques.

## Pendent / idees
- Mode nit (enfosquir cap al vespre, encendre `llums`, fanals i parades).
- Animar la casa del terror.
- Mostrar el ressort i el pàrquing a la miniatura del món.
- Àrees temàtiques (Medieval, Far West, Pirates, Selva, Espai, Mediterrani).
- Netejar el codi antic de locals/negocis de la ciutat (app.js, ciutat.js, mon.js) quan es confirmi que no es fa servir.
