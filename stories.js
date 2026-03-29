/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — STORIES v2.0 (AMB MINIJOCS VISUALS)
 *  stories.js
 *
 *  NOUS CAMPS PER FASE:
 *    visual     → { type, config }   Minijoc visual (SVG/HTML)
 *    lives      → número             Vides totals per l'equip (per defecte 3)
 *    minigame   → { type, config, answer }  Mini-joc interactiu
 *    choices    → [{ text, next }]   Narrativa branched (escolls)
 *    impostor   → true               Fase amb mecànica de traïdor
 *
 *  TYPES DE VISUAL DISPONIBLES:
 *    'treasureMap'  → mapa SVG generatiu amb ruta i X
 *    'cipherWheel'  → roda de codis César
 *    'circuitPuzzle'→ xarxa de circuits a connectar
 *    'pixelSecret'  → codi amagat en píxels
 *    'starPattern'  → constel·lació numerada
 *    'controlPanel' → panell d'interruptors
 *    'dnaHelix'     → doble hèlix d'ADN
 * ═══════════════════════════════════════════════════════════════
 */

const STORIES = [

  // ═══════════════════════════════════════════════════════════════
  //  BLOC 1 · JÚNIOR  ⭐  (10-12 anys)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "dragons", emoji: "🐉", lives: 3,
    color: "#ff4500", bg: "radial-gradient(ellipse at 40% 60%,#2a0800,#080000)",
    font: "'Cinzel Decorative',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "30 min", es: "30 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 anos" },
    title: { ca: "El Regne dels Dracs", es: "El Reino de los Dragones" },
    desc: { ca: "Fantasia · Dracs · Aventura", es: "Fantasia · Dragones · Aventura" },
    synopsis: { ca: "El drac guardià del tresor ha desaparegut! Sense ell, els enemics atacaran el castell. Heu de resoldre els seus acudits i trobar-lo abans de l'alba.", es: "El dragon guardian del tesoro ha desaparecido. Sin el, los enemigos atacaran el castillo. Debeis resolver sus acertijos y encontrarlo antes del alba." },
    phases: [
      {
        name: { ca: "LA COVA", es: "LA CUEVA" },
        narrativeTitle: { ca: "Entrada de la cova del drac", es: "Entrada a la cueva del dragon" },
        narrativeText: { ca: "La cova es fosca i calenta. A la paret hi ha dibuixos de dracs. Un pergami indica: troba el valor de l'estrella seguint la logica de la paret.", es: "La cueva es oscura y calida. En la pared hay dibujos de dragones. Un pergamino indica: encuentra el valor de la estrella siguiendo la logica de la pared." },
        visual: { type: "pixelSecret", config: { code: "4", color: "#ff4500", noise: true } },
        enigma: { ca: "Si un drac = 5, llavors 5 + estrella = 9. El codi esta amagat en el missatge de pixels de la paret.", es: "Si un dragon = 5, entonces 5 + estrella = 9. El codigo esta oculto en el mensaje de pixeles de la pared." },
        answer: "4", hint: { ca: "5 + ? = 9", es: "5 + ? = 9" }, points: 100
      },
      {
        name: { ca: "EL LABERINT", es: "EL LABERINTO" },
        narrativeTitle: { ca: "El laberint de foc", es: "El laberinto de fuego" },
        narrativeText: { ca: "Un mapa del laberint us mostra el cami! Heu de seguir la ruta marcada en vermell. Al final del cami hi ha el numero secret del drac.", es: "Un mapa del laberinto os muestra el camino. Debeis seguir la ruta marcada en rojo. Al final del camino esta el numero secreto del dragon." },
        visual: { type: "treasureMap", config: { paths: 4, finalX: [75, 60], color: "#ff4500", seed: 77 } },
        enigma: { ca: "Potes de 3 dracs + ales de 2 dracs. Cada drac: 4 potes, 2 ales.", es: "Patas de 3 dragones + alas de 2 dragones. Cada dragon: 4 patas, 2 alas." },
        answer: "16", hint: { ca: "(3x4)+(2x2)=12+4=16", es: "(3x4)+(2x2)=12+4=16" }, points: 150,
        mission: { ca: "Un membre ha d'anar a la biblioteca i buscar un llibre de fantasia. A la pagina 16 hi ha amagada una nota.", es: "Un miembro debe ir a la biblioteca y buscar un libro de fantasia. En la pagina 16 hay escondida una nota." }, missionIcon: "📖"
      },
      {
        name: { ca: "EL DRAC", es: "EL DRAGON" },
        narrativeTitle: { ca: "El drac adormit", es: "El dragon dormido" },
        narrativeText: { ca: "La constel·lacio del drac us mostra el cami fins a la seva cova. Unint les estrelles marcades trobeu la resposta a l'endevinalla final.", es: "La constelacion del dragon os muestra el camino hasta su cueva. Uniendo las estrellas marcadas encontrais la respuesta al acertijo final." },
        visual: { type: "starPattern", config: { stars: 8, pattern: [0,2,4,6], color: "#ff4500", title: "CONSTEL·LACIO DEL DRAC" } },
        enigma: { ca: "Tinc escames pero no soc un peix. Tinc ales pero no soc un ocell. Respiro foc pero no soc una estufa. Qui soc?", es: "Tengo escamas pero no soy un pez. Tengo alas pero no soy un pajaro. Respiro fuego pero no soy una estufa. Quien soy?" },
        answer: "drac", hint: { ca: "Guarda el tresor del regne...", es: "Guarda el tesoro del reino..." }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "pirates_jr", emoji: "⚓", lives: 3,
    color: "#f0a500", bg: "radial-gradient(ellipse at 50% 30%,#1a0e00,#060300)",
    font: "'Pirata One',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "25 min", es: "25 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 anos" },
    title: { ca: "El Tresor del Capita Perot", es: "El Tesoro del Capitan Perot" },
    desc: { ca: "Pirates · Tresor · Aventura divertida", es: "Piratas · Tesoro · Aventura divertida" },
    synopsis: { ca: "El Capita Perot era el pirata mes entremaliat del Mediterrani. Va amagar el seu tresor i va deixar tres endevinalles. Sou vosaltres els elegits!", es: "El Capitan Perot era el pirata mas travieso del Mediterraneo. Escondiio su tesoro y dejo tres acertijos. Sois vosotros los elegidos!" },
    phases: [
      {
        name: { ca: "MAPA 1", es: "MAPA 1" },
        narrativeTitle: { ca: "La primera creu", es: "La primera cruz" },
        narrativeText: { ca: "El vell capita us ha deixat el seu mapa! Seguiu la ruta puntejada fins a la X. El numero de graons es la primera clau.", es: "El viejo capitan os ha dejado su mapa. Seguid la ruta punteada hasta la X. El numero de peldanos es la primera clave." },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [68, 72], color: "#f0a500", seed: 42 } },
        enigma: { ca: "Dies de la setmana (7) x 4 = ? El mapa mostra el cami fins al numero exacte.", es: "Dias de la semana (7) x 4 = ? El mapa muestra el camino hasta el numero exacto." },
        answer: "28", hint: { ca: "7 x 4 = ?", es: "7 x 4 = ?" }, points: 100
      },
      {
        name: { ca: "MAPA 2", es: "MAPA 2" },
        narrativeTitle: { ca: "El codi pirata", es: "El codigo pirata" },
        narrativeText: { ca: "El cofre te un codi en pixels! El Capita Perot va amagar el numero entre el soroll visual. Fixeu-vos be en el patró de punts brillants.", es: "El cofre tiene un codigo en pixeles. El Capitan Perot escondio el numero entre el ruido visual. Fijaos bien en el patron de puntos brillantes." },
        visual: { type: "pixelSecret", config: { code: "32", color: "#f0a500", noise: true } },
        enigma: { ca: "M=13, A=1, R=18. Suma les lletres de MAR. El codi esta amagat en la imatge de pixels.", es: "M=13, A=1, R=18. Suma las letras de MAR. El codigo esta oculto en la imagen de pixeles." },
        answer: "32", hint: { ca: "13+1+18=?", es: "13+1+18=?" }, points: 150
      },
      {
        name: { ca: "EL TRESOR", es: "EL TESORO" },
        narrativeTitle: { ca: "El cofre d'or", es: "El cofre de oro" },
        narrativeText: { ca: "El sistema de control del cofre! Heu d'activar els interruptors en l'ordre correcte. La sequencia correcta amaga el codi final.", es: "El sistema de control del cofre. Debeis activar los interruptores en el orden correcto. La secuencia correcta oculta el codigo final." },
        visual: { type: "controlPanel", config: { switches: ["1","2","4","8"], solution: [0,1,2,3], color: "#f0a500", label: "COFRE DEL CAPITA" } },
        enigma: { ca: "Quin numero multiplicat per si mateix dona 64? (arrel quadrada de 64)", es: "Que numero multiplicado por si mismo da 64? (raiz cuadrada de 64)" },
        answer: "8", hint: { ca: "8 x 8 = 64", es: "8 x 8 = 64" }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "wizards", emoji: "🧙", lives: 3,
    color: "#a855f7", bg: "radial-gradient(ellipse at 50% 40%,#1a0030,#070010)",
    font: "'Cinzel Decorative',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "30 min", es: "30 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 anos" },
    title: { ca: "L'Escola de Magia", es: "La Escuela de Magia" },
    desc: { ca: "Magia · Encanteris · Aprenents", es: "Magia · Hechizos · Aprendices" },
    synopsis: { ca: "Sou aprenents de magia a l'Escola Arcana. El gran mestre ha tancat el laboratori amb un encanteri i ha perdut la memoria. Heu de superar tres proves per alliberar-lo!", es: "Sois aprendices de magia en la Escuela Arcana. El gran maestro ha cerrado el laboratorio con un hechizo. Debeis superar tres pruebas para liberarlo!" },
    phases: [
      {
        name: { ca: "PROVA 1", es: "PRUEBA 1" },
        narrativeTitle: { ca: "La pocio de colors", es: "La pocion de colores" },
        narrativeText: { ca: "La constel·lacio magica us mostra el cami dels colors! Uniu les estrelles en el patró correcte per descobrir la sequencia de colors.", es: "La constelacion magica os muestra el camino de los colores. Unid las estrellas en el patron correcto para descubrir la secuencia de colores." },
        visual: { type: "starPattern", config: { stars: 6, pattern: [0,1,2], color: "#a855f7", title: "ORDE DELS COLORS" } },
        enigma: { ca: "Cel=BLAU (BLA), Roses=ROSAT (ROS), Herba=VERD (VER). Primers 3 caracters de cada color units.", es: "Cielo=AZUL (AZU), Rosas=ROSA (ROS), Hierba=VERDE (VER). Primeros 3 caracteres de cada color unidos." },
        answer: "BLAROSVERD", hint: { ca: "BLA + ROS + VER", es: "AZU + ROS + VER" }, points: 100
      },
      {
        name: { ca: "PROVA 2", es: "PRUEBA 2" },
        narrativeTitle: { ca: "El grimori del mestre", es: "El grimorio del maestro" },
        narrativeText: { ca: "El circuit magic del grimori esta espatllat! Heu de trobar el cami correcte entre els nodes actius (brillants) per desxifrar el numero secret.", es: "El circuito magico del grimorio esta roto. Debeis encontrar el camino correcto entre los nodos activos (brillantes) para descifrar el numero secreto." },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#a855f7", solution: [0,1,3,5] } },
        enigma: { ca: "MAGIA te 5 lletres. BRUIXA te 6 lletres. Quant es 5+6?", es: "MAGIA tiene 5 letras. BRUJA tiene 5 letras. Cuanto es 5+5?" },
        answer: "11", hint: { ca: "Compta: B-R-U-I-X-A = 6. 5+6=11", es: "Cuenta: B-R-U-J-A = 5. 5+5=10" }, points: 150,
        mission: { ca: "Un aprenent ha d'anar a buscar el professor de guardia i pronunciar: ABRACADABRA ESCOLA.", es: "Un aprendiz debe ir a buscar al profesor de guardia y pronunciar: ABRACADABRA ESCUELA." }, missionIcon: "🪄"
      },
      {
        name: { ca: "PROVA 3", es: "PRUEBA 3" },
        narrativeTitle: { ca: "L'encanteri final", es: "El hechizo final" },
        narrativeText: { ca: "El codi final esta amagat en els pixels de la pedra magica! El numero secret del mestre apareix entre el soroll visual si sabeu on mirar.", es: "El codigo final esta oculto en los pixeles de la piedra magica. El numero secreto del maestro aparece entre el ruido visual si sabeis donde mirar." },
        visual: { type: "pixelSecret", config: { code: "25", color: "#a855f7", noise: true } },
        enigma: { ca: "(Mesos de l'any - dies de la setmana) x 5 = ? El codi apareix en la pedra.", es: "(Meses del ano - dias de la semana) x 5 = ? El codigo aparece en la piedra." },
        answer: "25", hint: { ca: "(12-7) x 5 = 5 x 5 = 25", es: "(12-7) x 5 = 5 x 5 = 25" }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "animals", emoji: "🦁", lives: 3,
    color: "#22c55e", bg: "radial-gradient(ellipse at 30% 70%,#001a08,#000500)",
    font: "'Rajdhani',sans-serif", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "25 min", es: "25 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 anos" },
    title: { ca: "Safari Matic", es: "Safari Matematico" },
    desc: { ca: "Animals · Natura · Mates divertides", es: "Animales · Naturaleza · Mates divertidas" },
    synopsis: { ca: "Sou cientifics en un safari africa. Un investigador ha perdut els seus quaderns. Heu de resoldre tres misteris de la savana per recuperar-los.", es: "Sois cientificos en un safari africano. Un investigador ha perdido sus cuadernos. Debeis resolver tres misterios de la sabana para recuperarlos." },
    phases: [
      {
        name: { ca: "MISTERI 1", es: "MISTERIO 1" },
        narrativeTitle: { ca: "El rastre del lleo", es: "La huella del leon" },
        narrativeText: { ca: "El mapa de la sabana mostra els rastres dels animals! La ruta vermella indica on van converger les petjades. Compteu les potes.", es: "El mapa de la sabana muestra las huellas de los animales. La ruta roja indica donde convergieron las huellas. Contad las patas." },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [60, 55], color: "#22c55e", seed: 99 } },
        enigma: { ca: "2 lleons + 1 elefant + 3 aguiles. Lleo=4 potes, Elefant=4, Aguila=2.", es: "2 leones + 1 elefante + 3 aguilas. Leon=4 patas, Elefante=4, Aguila=2." },
        answer: "18", hint: { ca: "(2x4)+(1x4)+(3x2)=18", es: "(2x4)+(1x4)+(3x2)=18" }, points: 100
      },
      {
        name: { ca: "MISTERI 2", es: "MISTERIO 2" },
        narrativeTitle: { ca: "La girafa i la zebra", es: "La jirafa y la cebra" },
        narrativeText: { ca: "La constel·lacio de la sabana mostra l'altura dels animals. Les estrelles connectades indiquen la sequencia d'altures a comparar.", es: "La constelacion de la sabana muestra la altura de los animales. Las estrellas conectadas indican la secuencia de alturas a comparar." },
        visual: { type: "starPattern", config: { stars: 5, pattern: [0,2,4], color: "#22c55e", title: "ALTURES ANIMALS" } },
        enigma: { ca: "3 zebres (150 cm cada una) vs 1 girafa (500 cm). Quina es la diferencia en cm?", es: "3 cebras (150 cm cada una) vs 1 jirafa (500 cm). Cual es la diferencia en cm?" },
        answer: "50", hint: { ca: "500 - (3x150) = 500 - 450 = 50", es: "500 - (3x150) = 500 - 450 = 50" }, points: 150
      },
      {
        name: { ca: "MISTERI 3", es: "MISTERIO 3" },
        narrativeTitle: { ca: "El codi de la reserva", es: "El codigo de la reserva" },
        narrativeText: { ca: "El sistema de control de la reserva! Els interruptors corresponen als animals protegits. El codi es el nombre d'animals actius x2.", es: "El sistema de control de la reserva. Los interruptores corresponden a los animales protegidos. El codigo es el numero de animales activos x2." },
        visual: { type: "controlPanel", config: { switches: ["🦁","🐘","🦏","🦍","🦓"], solution: [0,1,2,3,4], color: "#22c55e", label: "RESERVA NATURAL" } },
        enigma: { ca: "Quants animals protegeix la reserva? El codi es el doble.", es: "Cuantos animales protege la reserva? El codigo es el doble." },
        answer: "10", hint: { ca: "5 animals x 2 = 10", es: "5 animales x 2 = 10" }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "robots", emoji: "🤖", lives: 3,
    color: "#06b6d4", bg: "radial-gradient(ellipse at 60% 40%,#001a2e,#000810)",
    font: "'Orbitron',sans-serif", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "30 min", es: "30 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 anos" },
    title: { ca: "La Fabrica de Robots", es: "La Fabrica de Robots" },
    desc: { ca: "Robots · Tecnologia · Logica", es: "Robots · Tecnologia · Logica" },
    synopsis: { ca: "Sou enginyers junior a MEGA-TECH. El robot principal s'ha quedat sense bateria i tots els altres estan bloquejats. Resoldre tres errors per reactivar-los.", es: "Sois ingenieros junior en MEGA-TECH. El robot principal se ha quedado sin bateria y todos los demas estan bloqueados. Resolver tres errores para reactivarlos." },
    phases: [
      {
        name: { ca: "ERROR 001", es: "ERROR 001" },
        narrativeTitle: { ca: "Sistema de bateria", es: "Sistema de bateria" },
        narrativeText: { ca: "El circuit del sistema de bateria mostra quins nodes estan actius! Seguiu la connexio electrica entre els nodes brillants per trobar el codi de recarga.", es: "El circuito del sistema de bateria muestra que nodos estan activos. Seguid la conexion electrica entre los nodos brillantes para encontrar el codigo de recarga." },
        visual: { type: "circuitPuzzle", config: { nodes: 7, color: "#06b6d4", solution: [0,2,4,6] } },
        enigma: { ca: "Voltatge Europa (220V) + Angle recte (90) = ?", es: "Voltaje Europa (220V) + Angulo recto (90) = ?" },
        answer: "310", hint: { ca: "220+90=?", es: "220+90=?" }, points: 100
      },
      {
        name: { ca: "ERROR 002", es: "ERROR 002" },
        narrativeTitle: { ca: "El codi de programacio", es: "El codigo de programacion" },
        narrativeText: { ca: "El panell de control mostra la sequencia que cal activar! Cada interruptor te un valor: 2, 4, 8, 16, 32. Quin interruptor activaras a continuacio?", es: "El panel de control muestra la secuencia que hay que activar. Cada interruptor tiene un valor: 2, 4, 8, 16, 32. Que interruptor activareis a continuacion?" },
        visual: { type: "controlPanel", config: { switches: ["2","4","8","16","32","?"], solution: [0,1,2,3,4], color: "#06b6d4", label: "SEQUENCIA ROBOT" } },
        enigma: { ca: "Continua la sequencia: 2, 4, 8, 16, 32, __ ?", es: "Continua la secuencia: 2, 4, 8, 16, 32, __ ?" },
        answer: "64", hint: { ca: "32 x 2 = ?", es: "32 x 2 = ?" }, points: 150,
        mission: { ca: "Un membre ha d'anar a l'aula d'informatica i preguntar al professor el codi de reinici.", es: "Un miembro debe ir al aula de informatica y preguntar al profesor el codigo de reinicio." }, missionIcon: "💻"
      },
      {
        name: { ca: "ERROR 003", es: "ERROR 003" },
        narrativeTitle: { ca: "El robot activat!", es: "El robot activado!" },
        narrativeText: { ca: "El missatge final esta amagat en el sistema de pixels! El numero de robots actius apareix entre el soroll del sistema. Mireu amb atencio.", es: "El mensaje final esta oculto en el sistema de pixeles. El numero de robots activos aparece entre el ruido del sistema. Mirad con atencion." },
        visual: { type: "pixelSecret", config: { code: "13", color: "#06b6d4", noise: true } },
        enigma: { ca: "Total robots (5+3+7+2=17) - robots avariats (4) = robots actius.", es: "Total robots (5+3+7+2=17) - robots averiados (4) = robots activos." },
        answer: "13", hint: { ca: "(5+3+7+2) - 4 = 17 - 4 = 13", es: "(5+3+7+2) - 4 = 17 - 4 = 13" }, points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  HISTORIES AVANCADES (seleccio amb visuals potents)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "space", emoji: "🚀", lives: 3,
    color: "#00f5ff", bg: "radial-gradient(ellipse at 30% 50%,#001a3a,#000010)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Dificil", es: "Dificil" },
    dur: { ca: "45 min", es: "45 min" },
    ageLabel: { ca: "15+ anys", es: "15+ anos" },
    title: { ca: "Nau Espacial AURORA-7", es: "Nave Espacial AURORA-7" },
    desc: { ca: "Sci-fi · Sabotatge · Supervivencia", es: "Sci-fi · Sabotaje · Supervivencia" },
    synopsis: { ca: "La tripulacio desperta en orbita sense records. Els sistemes fallen. Algu va sabotejar la nau. Teniu 45 minuts abans que el reactor exploti.", es: "La tripulacion despierta en orbita sin recuerdos. Los sistemas fallan. Alguien saboteo la nave. Teneis 45 minutos antes de que el reactor explote." },
    phases: [
      {
        name: { ca: "DESPERTAR", es: "DESPERTAR" },
        narrativeTitle: { ca: "Sistema de vida: CRITIC", es: "Sistema de vida: CRITICO" },
        narrativeText: { ca: "El circuit de la nau mostra quins sistemes estan operatius! Seguiu la connexio electrica entre els nodes actius per trobar el codi d'acces al sistema de vida.", es: "El circuito de la nave muestra que sistemas estan operativos. Seguid la conexion electrica entre los nodos activos para encontrar el codigo de acceso al sistema de vida." },
        visual: { type: "circuitPuzzle", config: { nodes: 8, color: "#00f5ff", solution: [0,2,5,7] } },
        enigma: { ca: "Suma dels digits de 1986 (any MIR) x 4 (tripulants) = codi d'acces.", es: "Suma de los digitos de 1986 (ano MIR) x 4 (tripulantes) = codigo de acceso." },
        answer: "96", hint: { ca: "1+9+8+6=24. 24x4=?", es: "1+9+8+6=24. 24x4=?" }, points: 100
      },
      {
        name: { ca: "EL TRAIDOR", es: "EL TRAIDOR" },
        narrativeTitle: { ca: "Identifiqueu el sabotejador", es: "Identificad al saboteador" },
        narrativeText: { ca: "La constel·lacio d'evidencies! Cada node representa un sospitos. Les connexions mostren les contradiccions en les coartades. Qui menti?", es: "La constelacion de evidencias. Cada nodo representa un sospechoso. Las conexiones muestran las contradicciones en las coartadas. Quien mintio?" },
        visual: { type: "starPattern", config: { stars: 3, pattern: [1], color: "#ff4444", title: "XARXA DE SOSPITOSOS" } },
        enigma: { ca: "A diu dormia. B diu estava amb A. C diu va veure B al corredor a les 03:00. Si B menteix sobre estar amb A, qui es el traidor?", es: "A dice dormia. B dice estaba con A. C dice vio a B en el corredor a las 03:00. Si B miente, quien es el traidor?" },
        answer: "B", hint: { ca: "Si B menteix, llavors A era sol. Qui confirma on era C?", es: "Si B miente, entonces A estaba solo. Quien confirma donde estaba C?" },
        mission: { ca: "Un tripulant ha d'anar a la biblioteca i buscar el llibre amb el codi AURORA al llom.", es: "Un tripulante debe ir a la biblioteca y buscar el libro con el codigo AURORA en el lomo." }, missionIcon: "📚", points: 150
      },
      {
        name: { ca: "CODI FINAL", es: "CODIGO FINAL" },
        narrativeTitle: { ca: "Desactivar el reactor", es: "Desactivar el reactor" },
        narrativeText: { ca: "El panell de control del reactor! Els interruptors han de ser activats en l'ordre correcte. Cada simbol correspon a un valor: planetes, codi, frequencia, carboni.", es: "El panel de control del reactor. Los interruptores deben activarse en el orden correcto. Cada simbolo corresponde a un valor: planetas, codigo, frecuencia, carbono." },
        visual: { type: "controlPanel", config: { switches: ["🪐","2","7","⚛"], solution: [0,1,2,3], color: "#00f5ff", label: "REACTOR AURORA-7" } },
        enigma: { ca: "Codi 4 digits: planetes sistema solar (8) · 2 · 7 · numero atomic carboni x1.5 (9) = 8279", es: "Codigo 4 digitos: planetas sistema solar (8) · 2 · 7 · numero atomico carbono x1.5 (9) = 8279" },
        answer: "8279", hint: { ca: "Planetes:8, Carboni Z=6 x1.5=9 → 8-2-7-9", es: "Planetas:8, Carbono Z=6 x1.5=9 → 8-2-7-9" }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "museum", emoji: "🎨", lives: 3,
    color: "#9b59b6", bg: "radial-gradient(ellipse at 60% 40%,#1a0a2e,#0d0d0d)",
    font: "'Cinzel Decorative',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "40 min", es: "40 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 anos" },
    title: { ca: "El Museu Maleit", es: "El Museo Maldito" },
    desc: { ca: "Art · Misteri · Terror suau", es: "Arte · Misterio · Terror suave" },
    synopsis: { ca: "El museu tanca i quedeu atrapats. A mitjanit, els quadres cobren vida. El guardia exigeix que resoleu els seus enigmes.", es: "El museo cierra y quedais atrapados. A medianoche, los cuadros cobran vida. El guardian exige que resolvais sus enigmas." },
    phases: [
      {
        name: { ca: "MITJANIT", es: "MEDIANOCHE" },
        narrativeTitle: { ca: "Les pintures us miren", es: "Las pinturas os miran" },
        narrativeText: { ca: "La constel·lacio del museu mostra les rutes secretes entre les sales! Les estrelles connectades son els quadres que amaguen la resposta.", es: "La constelacion del museo muestra las rutas secretas entre las salas. Las estrellas conectadas son los cuadros que ocultan la respuesta." },
        visual: { type: "starPattern", config: { stars: 7, pattern: [0,3,6], color: "#9b59b6", title: "SALES DEL MUSEU" } },
        enigma: { ca: "Soc mes vell que el temps, pero vaig neixer avui. No tinc veu, pero explico histories. Qui soc?", es: "Soy mas viejo que el tiempo, pero naci hoy. No tengo voz, pero cuento historias. Quien soy?" },
        answer: "somni", hint: { ca: "Tots els humans ho fan cada nit...", es: "Todos los humanos lo hacen cada noche..." }, points: 100
      },
      {
        name: { ca: "EL GUARDIA", es: "EL GUARDIAN" },
        narrativeTitle: { ca: "El contracte de l'artista", es: "El contrato del artista" },
        narrativeText: { ca: "El panell d'accés al contracte del 1743! Heu d'activar els quadres correctes en ordre: Mona Lisa, Picasso, Dali. El numero d'objectes principals de cada quadre.", es: "El panel de acceso al contrato de 1743. Debeis activar los cuadros correctos en orden: Mona Lisa, Picasso, Dali. El numero de objetos principales de cada cuadro." },
        visual: { type: "controlPanel", config: { switches: ["🖼","👁","⏰","🌅"], solution: [0,1,2], color: "#9b59b6", label: "ARXIU DEL GUARDIA" } },
        enigma: { ca: "Mona Lisa=1 somriure, Picasso=3 ulls, Dali=1 rellotge. Concatena: 1-3-1.", es: "Mona Lisa=1 sonrisa, Picasso=3 ojos, Dali=1 reloj. Concatena: 1-3-1." },
        answer: "131", hint: { ca: "Concatena: 1 / 3 / 1", es: "Concatena: 1 / 3 / 1" },
        mission: { ca: "Un membre ha d'anar a l'entrada i buscar sota el bustia un sobre amb el simbol de l'art.", es: "Un miembro debe ir a la entrada y buscar bajo el buzon un sobre con el simbolo del arte." }, missionIcon: "📬", points: 150
      },
      {
        name: { ca: "ESCAPADA", es: "ESCAPE" },
        narrativeTitle: { ca: "La porta secreta", es: "La puerta secreta" },
        narrativeText: { ca: "El codi de la porta esta amagat en pixels! Any de mort de l'artista mes jove. El numero apareix entre el patró de punts brillants del sistema de seguretat.", es: "El codigo de la puerta esta oculto en pixeles. Ano de muerte del artista mas joven. El numero aparece entre el patron de puntos brillantes del sistema de seguridad." },
        visual: { type: "pixelSecret", config: { code: "1890", color: "#9b59b6", noise: true } },
        enigma: { ca: "Van Gogh 1890 (37a), Dali 1989 (84a), Picasso 1973 (91a). Any de mort del mes jove.", es: "Van Gogh 1890 (37a), Dali 1989 (84a), Picasso 1973 (91a). Ano de muerte del mas joven." },
        answer: "1890", hint: { ca: "37 < 84 < 91", es: "37 < 84 < 91" }, points: 200, isFinal: true
      }
    ]
  },

  {
    id: "train", emoji: "🚄", lives: 3,
    color: "#e74c3c", bg: "radial-gradient(ellipse at 50% 80%,#2d0000,#0a0005)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Dificil", es: "Dificil" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "15+ anys", es: "15+ anos" },
    title: { ca: "Tren Sense Frens", es: "Tren Sin Frenos" },
    desc: { ca: "Thriller · Velocitat · Tensio", es: "Thriller · Velocidad · Tension" },
    synopsis: { ca: "El tren bala viatja a 350 km/h. Els frens han estat sabotejats. A cada parada hi ha una bomba o una pista.", es: "El tren bala viaja a 350 km/h. Los frenos han sido saboteados. En cada parada hay una bomba o una pista." },
    phases: [
      {
        name: { ca: "PARADA 1", es: "PARADA 1" },
        narrativeTitle: { ca: "Missatge al seient", es: "Mensaje en el asiento" },
        narrativeText: { ca: "El mapa de la ruta del tren! La X indica el punt d'impacte al tunel. Calculeu el temps restant a partir de la distancia i la velocitat.", es: "El mapa de la ruta del tren. La X indica el punto de impacto en el tunel. Calculad el tiempo restante a partir de la distancia y la velocidad." },
        visual: { type: "treasureMap", config: { paths: 2, finalX: [82, 30], color: "#e74c3c", seed: 55 } },
        enigma: { ca: "El tren va a 350 km/h. La distancia fins al tunel es de 175 km. Quants minuts queden?", es: "El tren va a 350 km/h. La distancia hasta el tunel es de 175 km. Cuantos minutos quedan?" },
        answer: "30", hint: { ca: "Temps = (175/350) hores x 60 min/h", es: "Tiempo = (175/350) horas x 60 min/h" }, points: 100
      },
      {
        name: { ca: "PARADA 2", es: "PARADA 2" },
        narrativeTitle: { ca: "El passatger misterios", es: "El pasajero misterioso" },
        narrativeText: { ca: "La roda de codi Cesar mostra com desxifrar el missatge! Gireu la roda mental: cada lletra exterior correspon a una lletra interior desplacada 3 posicions.", es: "La rueda de codigo Cesar muestra como descifrar el mensaje. Girad la rueda mental: cada letra exterior corresponde a una letra interior desplazada 3 posiciones." },
        visual: { type: "cipherWheel", config: { shift: 3, highlightLetter: "R", color: "#e74c3c" } },
        enigma: { ca: "Desxifreu codi Cesar -3: R O L D Q R → cada lletra recua 3 a l'alfabet.", es: "Descifrad codigo Cesar -3: R O L D Q R → cada letra retrocede 3 en el alfabeto." },
        answer: "OLIANO", hint: { ca: "R-3=O, O-3=L, L-3=I, D-3=A, Q-3=N, R-3=O", es: "R-3=O, O-3=L, L-3=I, D-3=A, Q-3=N, R-3=O" },
        mission: { ca: "El revisor complice es al passadis. Digueu-li CODI VERMELL.", es: "El revisor complice esta en el pasillo. Decidle CODIGO ROJO." }, missionIcon: "🧳", points: 150
      },
      {
        name: { ca: "TUNEL FINAL", es: "TUNEL FINAL" },
        narrativeTitle: { ca: "10 minuts per a l'impacte", es: "10 minutos para el impacto" },
        narrativeText: { ca: "El panell de frens! 4 interruptors amb simbols geometrics. Han de ser activats de menys costats a mes. L'ordre correcte atura el tren.", es: "El panel de frenos. 4 interruptores con simbolos geometricos. Deben activarse de menos lados a mas. El orden correcto para el tren." },
        visual: { type: "controlPanel", config: { switches: ["○","∆","■","✦"], solution: [0,1,2,3], color: "#e74c3c", label: "PANEL FRENS AURORA" } },
        enigma: { ca: "Ordena de menys costats a mes: cercle (0), triangle (3), quadrat (4), estrella.", es: "Ordena de menos lados a mas: circulo (0), triangulo (3), cuadrado (4), estrella." },
        answer: "○∆■✦", hint: { ca: "Cercle=0, Triangle=3, Quadrat=4, Estrella=puntes", es: "Circulo=0, Triangulo=3, Cuadrado=4, Estrella=puntas" }, points: 200, isFinal: true
      }
    ]
  },

  { id:"bunker",emoji:"☢️",lives:3,color:"#27ae60",bg:"radial-gradient(ellipse at 40% 60%,#0d1f00,#050505)",font:"'Special Elite',cursive",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"55 min",es:"55 min"},ageLabel:{ca:"16+ anys",es:"16+ anos"},title:{ca:"Bunquer 2087",es:"Bunker 2087"},desc:{ca:"Post-apocaliptic · Ciencia · Supervivencia",es:"Post-apocaliptico · Ciencia · Supervivencia"},synopsis:{ca:"Any 2087. Sou els ultims humans. El bunquer te oxigen per a 6 hores. Descobriu que va passar.",es:"Ano 2087. Sois los ultimos humanos. El bunker tiene oxigeno para 6 horas. Descubrid que paso."},phases:[{name:{ca:"DESPERTAR",es:"DESPERTAR"},narrativeTitle:{ca:"Registres de l'any zero",es:"Registros del ano cero"},narrativeText:{ca:"El circuit del bunquer mostra quins sistemes sobreviuen! Nodes actius = sistemes operatius. Seguiu les connexions.",es:"El circuito del bunker muestra que sistemas sobreviven. Nodos activos = sistemas operativos. Seguid las conexiones."},visual:{type:"circuitPuzzle",config:{nodes:6,color:"#27ae60",solution:[0,1,3]}},enigma:{ca:"Any de Txernobil (1986) menys any fi Guerra Freda (1991). Valor absolut.",es:"Ano de Chernobil (1986) menos ano fin Guerra Fria (1991). Valor absoluto."},answer:"5",hint:{ca:"|1986-1991|=5",es:"|1986-1991|=5"},points:100},{name:{ca:"ELS ARXIUS",es:"LOS ARCHIVOS"},narrativeTitle:{ca:"Qui va causar el final",es:"Quien causo el fin"},narrativeText:{ca:"Els fragments binaris amaguen les inicials del culpable! El patró de pixels codifica la resposta. Convertiu binari a ASCII.",es:"Los fragmentos binarios ocultan las iniciales del culpable. El patron de pixeles codifica la respuesta. Convertid binario a ASCII."},visual:{type:"pixelSecret",config:{code:"AI",color:"#27ae60",noise:true}},enigma:{ca:"01000001=A(65). 01001001=? Les inicials del culpable apareixen en el missatge de pixels.",es:"01000001=A(65). 01001001=? Las iniciales del culpable aparecen en el mensaje de pixeles."},answer:"AI",hint:{ca:"01001001 decimal: 64+8+1=73. ASCII 73=I",es:"01001001 decimal: 64+8+1=73. ASCII 73=I"},mission:{ca:"Aneu a l'aula d'informatica i busqueu el fitxer BUNKER2087.",es:"Id al aula de informatica y buscad el archivo BUNKER2087."},missionIcon:"💻",points:150},{name:{ca:"SORTIDA",es:"SALIDA"},narrativeTitle:{ca:"La porta hermetica",es:"La puerta hermetica"},narrativeText:{ca:"El panell de la porta! Elements marcats a la taula periodica corresponen a interruptors. Activeu-los en ordre atomic.",es:"El panel de la puerta. Elementos marcados en la tabla periodica corresponden a interruptores. Activadlos en orden atomico."},visual:{type:"controlPanel",config:{switches:["H","Na","K","Fe","Cl"],solution:[0,1,2,3],color:"#27ae60",label:"PORTA BUNQUER 2087"}},enigma:{ca:"Primers digits dels numeros atomics: H(1), Na(11), K(19), Fe(26). Concatena: 1-1-1-2.",es:"Primeros digitos de los numeros atomicos: H(1), Na(11), K(19), Fe(26). Concatena: 1-1-1-2."},answer:"11119",hint:{ca:"H=1,Na=11,K=19,Fe=26 → primers digits: 1,1,1,2 → 11112... revisar: 1-11-19-26, primers digits 1,1,1,2 → 11112",es:"H=1,Na=11,K=19,Fe=26 → primeros digitos: 1,1,1,2 → 11112"},points:200,isFinal:true}]},

  { id:"pirates",emoji:"🏴‍☠️",lives:3,color:"#f39c12",bg:"radial-gradient(ellipse at 50% 30%,#1f1000,#060400)",font:"'Pirata One',cursive",level:"medio",diff:{ca:"Mitja",es:"Medio"},dur:{ca:"40 min",es:"40 min"},ageLabel:{ca:"12-15 anys",es:"12-15 anos"},title:{ca:"Pirates del Mediterrani",es:"Piratas del Mediterraneo"},desc:{ca:"Aventura · Mapa · Tresor",es:"Aventura · Mapa · Tesoro"},synopsis:{ca:"Sou tripulacio de El Venjador Escarlata. Heu trobat el mapa del tresor de Barbanegra. Pero el mapa esta xifrat.",es:"Sois tripulacion de El Vengador Escarlata. Habeis encontrado el mapa del tesoro de Barbanegra. Pero el mapa esta cifrado."},phases:[{name:{ca:"EL MAPA",es:"EL MAPA"},narrativeTitle:{ca:"Barbanegra us parla",es:"Barbanegra os habla"},narrativeText:{ca:"El mapa del tresor de Barbanegra! La ruta puntejada mostra el cami. Seguiu les marques fins a la X daurada.",es:"El mapa del tesoro de Barbanegra. La ruta punteada muestra el camino. Seguid las marcas hasta la X dorada."},visual:{type:"treasureMap",config:{paths:4,finalX:[65,70],color:"#f39c12",seed:33}},enigma:{ca:"Suma: edat primer viatge (17) + nombre de mars (7) = numero del cofre.",es:"Suma: edad primer viaje (17) + numero de mares (7) = numero del cofre."},answer:"24",hint:{ca:"17+7=?",es:"17+7=?"},points:100},{name:{ca:"L'ILLA",es:"LA ISLA"},narrativeTitle:{ca:"El guardia de la cova",es:"El guardian de la cueva"},narrativeText:{ca:"El circuit secret de la cova! Els nodes connectats mostren el cami cap al guardia. Seguiu la connexio correcta.",es:"El circuito secreto de la cueva. Los nodos conectados muestran el camino hacia el guardian. Seguid la conexion correcta."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#f39c12",solution:[0,2,4]}},enigma:{ca:"Tinc ciutats pero no cases. Tinc muntanyes pero no arbres. Tinc aigua pero no peixos. Que soc?",es:"Tengo ciudades pero no casas. Tengo montanas pero no arboles. Tengo agua pero no peces. Que soy?"},answer:"mapa",hint:{ca:"Es allo que useu per trobar el tresor...",es:"Es algo que usais para encontrar el tesoro..."},mission:{ca:"Un membre ha d'anar al pati i buscar sota del banc mes proper a l'entrada.",es:"Un miembro debe ir al patio y buscar bajo el banco mas cercano a la entrada."},missionIcon:"🗺️",points:150},{name:{ca:"EL TRESOR",es:"EL TESORO"},narrativeTitle:{ca:"El pany del cofre",es:"La cerradura del cofre"},narrativeText:{ca:"El codi del cofre esta en pixels! El nom de Colon en italia amagat en el sistema de seguretat. Mireu el patró brillant.",es:"El codigo del cofre esta en pixeles. El nombre de Colon en italiano oculto en el sistema de seguridad. Mirad el patron brillante."},visual:{type:"pixelSecret",config:{code:"CRIST",color:"#f39c12",noise:false}},enigma:{ca:"Nom de Colon en italia: Cristoforo Colombo. Les 5 primeres lletres.",es:"Nombre de Colon en italiano: Cristoforo Colombo. Las 5 primeras letras."},answer:"CRIST",hint:{ca:"Cristoforo → primeres 5 lletres",es:"Cristoforo → primeras 5 letras"},points:200,isFinal:true}]},

  { id:"castle",emoji:"🏰",lives:3,color:"#8e44ad",bg:"radial-gradient(ellipse at 30% 70%,#150020,#050005)",font:"'Cinzel Decorative',cursive",level:"medio",diff:{ca:"Mitja",es:"Medio"},dur:{ca:"40 min",es:"40 min"},ageLabel:{ca:"12-15 anys",es:"12-15 anos"},title:{ca:"El Castell Encantat",es:"El Castillo Encantado"},desc:{ca:"Terror suau · Medieval · Magia",es:"Terror suave · Medieval · Magia"},synopsis:{ca:"El fantasma del comte Vladimiro exigeix que respongueu els seus enigmes abans de l'alba.",es:"El fantasma del conde Vladimiro exige que respondais sus enigmas antes del amanecer."},phases:[{name:{ca:"ARRIBADA",es:"LLEGADA"},narrativeTitle:{ca:"Les portes es tanquen",es:"Las puertas se cierran"},narrativeText:{ca:"El mapa del castell mostra la ruta dels secrets! Seguiu el cami fins a la cambra del comte Vladimiro.",es:"El mapa del castillo muestra la ruta de los secretos. Seguid el camino hasta la camara del conde Vladimiro."},visual:{type:"treasureMap",config:{paths:3,finalX:[50,40],color:"#8e44ad",seed:666}},enigma:{ca:"El comte va ser maleit l'any 1723. Quants anys porta encantat fins al 2025?",es:"El conde fue maldecido en 1723. Cuantos anos lleva encantado hasta el 2025?"},answer:"302",hint:{ca:"2025-1723=?",es:"2025-1723=?"},points:100},{name:{ca:"LA MALEDICCIO",es:"LA MALDICION"},narrativeTitle:{ca:"El llibre d'encanteris",es:"El libro de hechizos"},narrativeText:{ca:"El circuit magic del grimori esta actiu! Les connexions entre nodes mostren el cami cap a la pagina secreta.",es:"El circuito magico del grimorio esta activo. Las conexiones entre nodos muestran el camino hacia la pagina secreta."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#8e44ad",solution:[0,2,3]}},enigma:{ca:"Com mes m'asseques, mes mullat et quedes. Que soc?",es:"Cuanto mas me seques, mas mojado te quedas. Que soy?"},answer:"tovallola",hint:{ca:"Es un objecte del bany...",es:"Es un objeto del bano..."},mission:{ca:"El grimoriu es a la classe d'Historia. Busqueu sota la taula del professor el sobre amb el segell del castell.",es:"El grimorio esta en la clase de Historia. Buscad bajo la mesa del profesor el sobre con el sello del castillo."},missionIcon:"📜",points:150},{name:{ca:"L'EXORCISME",es:"EL EXORCISMO"},narrativeTitle:{ca:"Alliberar el comte",es:"Liberar al conde"},narrativeText:{ca:"La roda de codis ROT13! Per desxifrar el nom del dimoni, gireu la roda: cada lletra avanca 13 posicions. Znyhf → ?",es:"La rueda de codigos ROT13. Para descifrar el nombre del demonio, girad la rueda: cada letra avanza 13 posiciones. Znyhf → ?"},visual:{type:"cipherWheel",config:{shift:13,highlightLetter:"Z",color:"#8e44ad"}},enigma:{ca:"ROT13: Z→M, n→a, y→l, h→u, f→s. Nom del dimoni.",es:"ROT13: Z→M, n→a, y→l, h→u, f→s. Nombre del demonio."},answer:"Malus",hint:{ca:"ROT13: cada lletra avanca 13 posicions",es:"ROT13: cada letra avanza 13 posiciones"},points:200,isFinal:true}]},

  { id:"atlantis",emoji:"🌊",lives:3,color:"#2980b9",bg:"radial-gradient(ellipse at 50% 100%,#00162e,#000510)",font:"'Orbitron',sans-serif",level:"dificil",diff:{ca:"Dificil",es:"Dificil"},dur:{ca:"50 min",es:"50 min"},ageLabel:{ca:"15+ anys",es:"15+ anos"},title:{ca:"Ciutat Submergida",es:"Ciudad Sumergida"},desc:{ca:"Atlantida · Ciencia · Arqueologia",es:"Atlantida · Ciencia · Arqueologia"},synopsis:{ca:"Una expedicio submarina ha trobat l'Atlantida. Heu de desxifrar els missatges per activar l'ascensor d'emergencia.",es:"Una expedicion submarina ha encontrado Atlantida. Debeis descifrar los mensajes para activar el ascensor de emergencia."},phases:[{name:{ca:"DESCOBRIMENT",es:"DESCUBRIMIENTO"},narrativeTitle:{ca:"Els registres atlants",es:"Los registros atlantes"},narrativeText:{ca:"El circuit atlant! En octal (base 8): 10 significa vuit. El circuit mostra les connexions numeriques del sistema atlant.",es:"El circuito atlante. En octal (base 8): 10 significa ocho. El circuito muestra las conexiones numericas del sistema atlante."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#2980b9",solution:[0,1,3,4]}},enigma:{ca:"En octal: 10+10 = 16 decimal. Quant es 16 en octal?",es:"En octal: 10+10 = 16 decimal. Cuanto es 16 en octal?"},answer:"20",hint:{ca:"16/8=2 resta 0 → 20 en octal",es:"16/8=2 resto 0 → 20 en octal"},points:100},{name:{ca:"EL REACTOR",es:"EL REACTOR"},narrativeTitle:{ca:"L'energia de l'Atlantida",es:"La energia de Atlantida"},narrativeText:{ca:"El panell de cristalls del reactor! Cada interruptor correspon a un cristall de quars amb la seva frequencia. Ordena'ls de menor a major.",es:"El panel de cristales del reactor. Cada interruptor corresponde a un cristal de cuarzo con su frecuencia. Ordenalos de menor a mayor."},visual:{type:"controlPanel",config:{switches:["430","490","530","560","620"],solution:[0,1,2,3,4],color:"#2980b9",label:"REACTOR ATLANT"}},enigma:{ca:"Vermell=430THz, Taronja=490THz, Groc=530THz, Verd=560THz, Blau=620THz. Ordre menor a major.",es:"Rojo=430THz, Naranja=490THz, Amarillo=530THz, Verde=560THz, Azul=620THz. Orden menor a mayor."},answer:"Vermell-Taronja-Groc-Verd-Blau",hint:{ca:"430<490<530<560<620",es:"430<490<530<560<620"},mission:{ca:"El cristall mestre es al laboratori. Pregunteu al professor pel PROJECTE ATLANTIDA.",es:"El cristal maestro esta en el laboratorio. Preguntad al profesor por el PROYECTO ATLANTIDA."},missionIcon:"💎",points:150},{name:{ca:"ASCENSOR",es:"ASCENSOR"},narrativeTitle:{ca:"Pujar a la superficie",es:"Subir a la superficie"},narrativeText:{ca:"El codi de l'ascensor en pixels! La pressio calculada esta amagada en el sistema de seguretat: P=densitat x g x alçada en bar.",es:"El codigo del ascensor en pixeles. La presion calculada esta oculta en el sistema de seguridad: P=densidad x g x altura en bar."},visual:{type:"pixelSecret",config:{code:"301",color:"#2980b9",noise:true}},enigma:{ca:"P = 1025 x 9.8 x 3000 Pa. Convertiu a bar (/100000). Arrodoniu.",es:"P = 1025 x 9.8 x 3000 Pa. Convertid a bar (/100000). Redonded."},answer:"301",hint:{ca:"30135000/100000 = 301.35 ≈ 301",es:"30135000/100000 = 301.35 ≈ 301"},points:200,isFinal:true}]},

  { id:"spy",emoji:"🕵️",lives:3,color:"#e8c84a",bg:"radial-gradient(ellipse at 70% 30%,#1a1a00,#050500)",font:"'Orbitron',sans-serif",level:"dificil",diff:{ca:"Dificil",es:"Dificil"},dur:{ca:"50 min",es:"50 min"},ageLabel:{ca:"15+ anys",es:"15+ anos"},title:{ca:"Agencia Fantasma",es:"Agencia Fantasma"},desc:{ca:"Espionatge · Mission Impossible · Codis",es:"Espionaje · Mission Impossible · Codigos"},synopsis:{ca:"Sou agents d'elit. Un virus robara tots els secrets del mon en 60 minuts. Infiltreu-vos i neutralitzeu l'amenaça.",es:"Sois agentes de elite. Un virus robara todos los secretos del mundo en 60 minutos. Infiltraos y neutralizad la amenaza."},phases:[{name:{ca:"INFILTRACIO",es:"INFILTRACION"},narrativeTitle:{ca:"Acces a la base",es:"Acceso a la base"},narrativeText:{ca:"La roda de codi Cesar! El contacte ha xifrat el missatge amb desplacament +3. Useu la roda per desxifrar: lletra exterior → lletra interior.",es:"La rueda de codigo Cesar. El contacto ha cifrado el mensaje con desplazamiento +3. Usad la rueda para descifrar: letra exterior → letra interior."},visual:{type:"cipherWheel",config:{shift:3,highlightLetter:"R",color:"#e8c84a"}},enigma:{ca:"Codi Cesar -3: R O L D Q R → cada lletra recua 3 posicions a l'alfabet.",es:"Codigo Cesar -3: R O L D Q R → cada letra retrocede 3 posiciones en el alfabeto."},answer:"OLIANO",hint:{ca:"Cada lletra recua 3 posicions",es:"Cada letra retrocede 3 posiciones"},points:100},{name:{ca:"EL VIRUS",es:"EL VIRUS"},narrativeTitle:{ca:"Anatomia de l'atac",es:"Anatomia del ataque"},narrativeText:{ca:"El circuit del servidor infectat! Nodes actius = sistemes compromesos. Seguiu la connexio per trobar l'origen de l'atac.",es:"El circuito del servidor infectado. Nodos activos = sistemas comprometidos. Seguid la conexion para encontrar el origen del ataque."},visual:{type:"circuitPuzzle",config:{nodes:7,color:"#e8c84a",solution:[0,3,6]}},enigma:{ca:"Primer primer entre 50-60 mes gran es 59. 59 x 8 + 1971 = ?",es:"Primer primo entre 50-60 mas grande es 59. 59 x 8 + 1971 = ?"},answer:"2443",hint:{ca:"59x8=472. 472+1971=?",es:"59x8=472. 472+1971=?"},mission:{ca:"El conserge es el contacte. Digueu-li L'AGUILA HA ATERRAT.",es:"El conserje es el contacto. Decidle EL AGUILA HA ATERRIZADO."},missionIcon:"🔌",points:150},{name:{ca:"NEUTRALITZACIO",es:"NEUTRALIZACION"},narrativeTitle:{ca:"Compte enrere",es:"Cuenta atras"},narrativeText:{ca:"El codi final en pixels! La suma de Fibonacci esta amagada en el sistema. Fibonacci: 0,1,1,2,3,5,8,13,21,34. Suma termes 7,8,9.",es:"El codigo final en pixeles. La suma de Fibonacci esta oculta en el sistema. Fibonacci: 0,1,1,2,3,5,8,13,21,34. Suma terminos 7,8,9."},visual:{type:"pixelSecret",config:{code:"68",color:"#e8c84a",noise:true}},enigma:{ca:"Fibonacci termes 7,8,9 (des de 0): 13+21+34=?",es:"Fibonacci terminos 7,8,9 (desde 0): 13+21+34=?"},answer:"68",hint:{ca:"13+21+34=?",es:"13+21+34=?"},points:200,isFinal:true}]},

  { id:"circus",emoji:"🎪",lives:3,color:"#ff0066",bg:"radial-gradient(ellipse at 50% 50%,#200010,#050005)",font:"'Creepster',cursive",level:"dificil",diff:{ca:"Dificil",es:"Dificil"},dur:{ca:"50 min",es:"50 min"},ageLabel:{ca:"15+ anys",es:"15+ anos"},title:{ca:"Circ del Fi del Mon",es:"Circo del Fin del Mundo"},desc:{ca:"Misteri fosc · Suspens · Enigmes",es:"Misterio oscuro · Suspense · Enigmas"},synopsis:{ca:"El circ va arribar una nit de tempesta. Al mati, tothom havia desaparegut. El pallasso: Per sortir, completeu els tres actes.",es:"El circo llego una noche de tormenta. Al dia siguiente, todos habian desaparecido. El payaso: Para salir, completad los tres actos."},phases:[{name:{ca:"ACTE I",es:"ACTO I"},narrativeTitle:{ca:"El mag us desafia",es:"El mago os desafia"},narrativeText:{ca:"La constel·lacio del circ! Les estrelles connectades mostren l'ordre dels actes. Seguiu el patró per trobar el primer numero magic.",es:"La constelacion del circo. Las estrellas conectadas muestran el orden de los actos. Seguid el patron para encontrar el primer numero magico."},visual:{type:"starPattern",config:{stars:6,pattern:[0,2,5],color:"#ff0066",title:"CONSTEL·LACIO DEL CIRC"}},enigma:{ca:"5 lletres MAGIA x 40 cartes baralla espanyola + 666 (nombre bestia) = ?",es:"5 letras MAGIA x 40 cartas baraja espanola + 666 (numero bestia) = ?"},answer:"866",hint:{ca:"5x40=200. 200+666=?",es:"5x40=200. 200+666=?"},points:100},{name:{ca:"ACTE II",es:"ACTO II"},narrativeTitle:{ca:"La trapecista sense cara",es:"La trapecista sin cara"},narrativeText:{ca:"El circuit del circ mostra la trajectoria de la trapecista! La velocitat d'impacte esta codificada en les connexions actives.",es:"El circuito del circo muestra la trayectoria de la trapecista. La velocidad de impacto esta codificada en las conexiones activas."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#ff0066",solution:[0,2,4]}},enigma:{ca:"v = arrel(2 x 10 x 80) = arrel(1600) = ?",es:"v = raiz(2 x 10 x 80) = raiz(1600) = ?"},answer:"40",hint:{ca:"arrel(1600)=40",es:"raiz(1600)=40"},mission:{ca:"El programa del circ es a la taquilla 13 o sota el grao de l'entrada.",es:"El programa del circo esta en la taquilla 13 o bajo el escoalon de la entrada."},missionIcon:"🎭",points:150},{name:{ca:"ACTE III",es:"ACTO III"},narrativeTitle:{ca:"El pallasso final",es:"El payaso final"},narrativeText:{ca:"La roda del pallasso! El codi final esta xifrat en simbols. La roda mostra com els simbols del pallasso corresponen a lletres reals.",es:"La rueda del payaso. El codigo final esta cifrado en simbolos. La rueda muestra como los simbolos del payaso corresponden a letras reales."},visual:{type:"cipherWheel",config:{shift:5,highlightLetter:"K",color:"#ff0066"}},enigma:{ca:"Com mes en treus, mes gran soc. Que soc?",es:"Cuantas mas quitas, mas grande soy. Que soy?"},answer:"forat",hint:{ca:"Creix quan li treus material",es:"Crece cuando le quitas material"},points:200,isFinal:true}]},

  { id:"jungle",emoji:"🌿",lives:3,color:"#2ecc71",bg:"radial-gradient(ellipse at 40% 40%,#001500,#000500)",font:"'Rajdhani',sans-serif",level:"medio",diff:{ca:"Mitja",es:"Medio"},dur:{ca:"40 min",es:"40 min"},ageLabel:{ca:"12-15 anys",es:"12-15 anos"},title:{ca:"Selva Prohibida",es:"Selva Prohibida"},desc:{ca:"Supervivencia · Tribus · Misteri",es:"Supervivencia · Tribus · Misterio"},synopsis:{ca:"Una tribu ancestral us ofereix ajuda si supereu tres proves de saviesa.",es:"Una tribu ancestral os ofrece ayuda si superais tres pruebas de sabiduria."},phases:[{name:{ca:"PROVA 1",es:"PRUEBA 1"},narrativeTitle:{ca:"El xaman parla",es:"El chaman habla"},narrativeText:{ca:"El mapa de la selva! La ruta fins a l'altar de l'aigua mostra el cami per resoldre el puzzle de les gerres.",es:"El mapa de la selva. La ruta hasta el altar del agua muestra el camino para resolver el puzzle de las vasijas."},visual:{type:"treasureMap",config:{paths:3,finalX:[55,60],color:"#2ecc71",seed:123}},enigma:{ca:"Dues gerres: 3L i 5L. Mesureu exactament 4L seguint els passos.",es:"Dos vasijas: 3L y 5L. Medid exactamente 4L siguiendo los pasos."},answer:"4",hint:{ca:"Omple 5L → aboca 3L → buida 3L → passa 2L → omple 5L → aboca 1L = 4L queden",es:"Llena 5L → vierte 3L → vacia 3L → pasa 2L → llena 5L → vierte 1L = 4L quedan"},points:100},{name:{ca:"PROVA 2",es:"PRUEBA 2"},narrativeTitle:{ca:"El consell d'ancians",es:"El consejo de ancianos"},narrativeText:{ca:"El circuit sagrat dels ancians! Jaguar=7, Serp=3, Aguila=12, Granota=2, Mico=5. Seguiu la connexio magica.",es:"El circuito sagrado de los ancianos. Jaguar=7, Serpiente=3, Aguila=12, Rana=2, Mono=5. Seguid la conexion magica."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#2ecc71",solution:[0,2,3,4]}},enigma:{ca:"(Jaguar x Granota) + (Aguila - Mico) x Serp = ?",es:"(Jaguar x Rana) + (Aguila - Mono) x Serpiente = ?"},answer:"35",hint:{ca:"(7x2)+(12-5)x3=14+21=35",es:"(7x2)+(12-5)x3=14+21=35"},mission:{ca:"La ploma sagrada de l'aguila es a la sala de direccio.",es:"La pluma sagrada del aguila esta en la sala de direccion."},missionIcon:"🦅",points:150},{name:{ca:"PROVA 3",es:"PRUEBA 3"},narrativeTitle:{ca:"El cor de la selva",es:"El corazon de la selva"},narrativeText:{ca:"La constel·lacio de l'arbre sagrat! Les estrelles connectades mostren el creixement de l'arbre al llarg dels anys.",es:"La constelacion del arbol sagrado. Las estrellas conectadas muestran el crecimiento del arbol a lo largo de los anos."},visual:{type:"starPattern",config:{stars:10,pattern:[0,3,6,9],color:"#2ecc71",title:"CREIXEMENT ARBRE"}},enigma:{ca:"Arbre: 1m inicial, +2m/any, -10% cada 3 anys per plaga. Altura any 10 (aprox)?",es:"Arbol: 1m inicial, +2m/ano, -10% cada 3 anos por plaga. Altura ano 10 (aprox)?"},answer:"17",hint:{ca:"Aprox 15-17m. Acceptem qualsevol valor en el rang.",es:"Aprox 15-17m. Aceptamos cualquier valor en el rango."},points:200,isFinal:true}]},

  { id:"instituto",emoji:"🏫",lives:3,color:"#e67e22",bg:"radial-gradient(ellipse at 50% 50%,#1f1000,#080400)",font:"'Special Elite',cursive",level:"medio",diff:{ca:"Mitja",es:"Medio"},dur:{ca:"45 min",es:"45 min"},ageLabel:{ca:"12-15 anys",es:"12-15 anos"},title:{ca:"L'Institut Maleit",es:"El Instituto Maldito"},desc:{ca:"Terror · La vostra escola · Secrets",es:"Terror · Vuestra escuela · Secretos"},synopsis:{ca:"Quelcom estrany va passar al vostre institut durant la nit. Les portes estan tancades.",es:"Algo extrano paso en vuestro instituto durante la noche. Las puertas estan cerradas."},phases:[{name:{ca:"EL DESPERTAR",es:"EL DESPERTAR"},narrativeTitle:{ca:"Els passadissos parlen",es:"Los pasillos hablan"},narrativeText:{ca:"El circuit secret de l'institut! Cada node es una aula. La connexio activa porta a la resposta.",es:"El circuito secreto del instituto. Cada nodo es un aula. La conexion activa lleva a la respuesta."},visual:{type:"circuitPuzzle",config:{nodes:6,color:"#e67e22",solution:[0,2,5]}},enigma:{ca:"Numero de l'aula de Matematiques + numero de la vostra aula actual. (El professor ho sap!)",es:"Numero del aula de Matematicas + numero de vuestra aula actual. (El profesor lo sabe!)"},answer:"VARIABLE",hint:{ca:"Pregunteu al professor!",es:"Preguntad al profesor!"},points:100},{name:{ca:"LA SALA PROHIBIDA",es:"LA SALA PROHIBIDA"},narrativeTitle:{ca:"Despatx del director",es:"Despacho del director"},narrativeText:{ca:"El mapa de l'institut! La ruta secreta fins al despatx del director esta marcada. Seguiu els passadissos prohibits.",es:"El mapa del instituto. La ruta secreta hasta el despacho del director esta marcada. Seguid los pasillos prohibidos."},visual:{type:"treasureMap",config:{paths:3,finalX:[60,40],color:"#e67e22",seed:2025}},enigma:{ca:"Any de fundacio + alumnes / 10. Pregunteu al professor!",es:"Ano de fundacion + alumnos / 10. Preguntad al profesor!"},answer:"VARIABLE",hint:{ca:"L'any de fundacio es a la web de l'institut.",es:"El ano de fundacion esta en la web del instituto."},mission:{ca:"Un membre ha d'anar a secretaria i preguntar per l'expedient de l'institut.",es:"Un miembro debe ir a secretaria y preguntar por el expediente del instituto."},missionIcon:"📋",points:150},{name:{ca:"EL SECRET FINAL",es:"EL SECRETO FINAL"},narrativeTitle:{ca:"El que ningu sap",es:"Lo que nadie sabe"},narrativeText:{ca:"El codi final esta amagat en el sistema de pixels de l'armari de direccio! El numero apareix entre el soroll si sabeu com desxifrar-lo.",es:"El codigo final esta oculto en el sistema de pixeles del armario de direccion. El numero aparece entre el ruido si sabeis como descifrarlo."},visual:{type:"pixelSecret",config:{code:"???",color:"#e67e22",noise:true}},enigma:{ca:"Nombre de professors x nombre d'assignatures d'aquest curs. (El professor ho sap!)",es:"Numero de profesores x numero de asignaturas de este curso. (El profesor lo sabe!)"},answer:"VARIABLE",hint:{ca:"Professors x assignatures. Pregunteu!",es:"Profesores x asignaturas. Preguntad!"},points:200,isFinal:true}]},

  { id:"teachers",emoji:"👩‍🏫",lives:3,color:"#1abc9c",bg:"radial-gradient(ellipse at 60% 40%,#001810,#020805)",font:"'Rajdhani',sans-serif",level:"medio",diff:{ca:"Facil-Mitja",es:"Facil-Medio"},dur:{ca:"35 min",es:"35 min"},ageLabel:{ca:"Professors",es:"Profesores"},title:{ca:"Atrapats a la Sala de Professors",es:"Atrapados en la Sala de Profesores"},desc:{ca:"Per a professors · Humor · Camaraderia",es:"Para profesores · Humor · Camaraderia"},synopsis:{ca:"Els professors queden atrapats durant el claustre. Per sortir han de resoldre enigmes sobre educacio.",es:"Los profesores quedan atrapados durante el claustro. Para salir deben resolver enigmas sobre educacion."},phases:[{name:{ca:"EL CLAUSTRE",es:"EL CLAUSTRO"},narrativeTitle:{ca:"La reunio que no acaba",es:"La reunion que nunca acaba"},narrativeText:{ca:"El circuit de coneixement pedagogic! Cada node es una teoria educativa. La connexio correcta prova que mereixeu ser professors.",es:"El circuito de conocimiento pedagogico. Cada nodo es una teoria educativa. La conexion correcta prueba que merецis ser profesores."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#1abc9c",solution:[0,1,2]}},enigma:{ca:"Intel·ligencies Multiples de Gardner (1983). Quantes en va identificar originalment?",es:"Inteligencias Multiples de Gardner (1983). Cuantas identifico originalmente?"},answer:"7",hint:{ca:"Musical, Cinestetica, Logico-matematica, Linguistica, Espacial, Interpersonal, Intrapersonal",es:"Musical, Kinestesica, Logico-matematica, Linguistica, Espacial, Interpersonal, Intrapersonal"},points:100},{name:{ca:"ELS EXPEDIENTS",es:"LOS EXPEDIENTES"},narrativeTitle:{ca:"Secrets del claustre",es:"Secretos del claustro"},narrativeText:{ca:"El mapa del centre educatiu! La ruta entre veterans i novells marca la diferencia d'anys d'experiencia.",es:"El mapa del centro educativo. La ruta entre veteranos y novatos marca la diferencia de anos de experiencia."},visual:{type:"treasureMap",config:{paths:2,finalX:[70,50],color:"#1abc9c",seed:88}},enigma:{ca:"Anys del professor mes veterà MENYS anys del mes nou. (Valors reals del claustre.)",es:"Anos del profesor mas veterano MENOS anos del mas nuevo. (Valores reales del claustro.)"},answer:"VARIABLE",hint:{ca:"Pregunteu als companys!",es:"Preguntad a los companeros!"},mission:{ca:"Un professor ha d'anar a buscar un alumne al passadis que te un sobre amb el simbol de la professora.",es:"Un profesor debe ir a buscar a un alumno en el pasillo que tiene un sobre con el simbolo de la profesora."},missionIcon:"👦",points:150},{name:{ca:"L'EXAMEN FINAL",es:"EL EXAMEN FINAL"},narrativeTitle:{ca:"L'examen dels professors",es:"El examen de los profesores"},narrativeText:{ca:"La constel·lacio del claustre! Cada estrella es un professor. Les connexions indiquen les relacions d'experiencia.",es:"La constelacion del claustro. Cada estrella es un profesor. Las conexiones indican las relaciones de experiencia."},visual:{type:"starPattern",config:{stars:5,pattern:[0,2,4],color:"#1abc9c",title:"EL CLAUSTRE"}},enigma:{ca:"Examen: 20 preguntes de 0.5 punts. Per treure un 5, quantes cal respondre be?",es:"Examen: 20 preguntas de 0.5 puntos. Para sacar un 5, cuantas hay que responder bien?"},answer:"10",hint:{ca:"5/0.5=?",es:"5/0.5=?"},points:200,isFinal:true}]},

  // EXPERT
  { id:"quantum",emoji:"⚛️",lives:3,color:"#818cf8",bg:"radial-gradient(ellipse at 50% 30%,#0a0020,#000010)",font:"'Orbitron',sans-serif",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"60 min",es:"60 min"},ageLabel:{ca:"17+ anys",es:"17+ anos"},title:{ca:"Laboratori Quantic",es:"Laboratorio Cuantico"},desc:{ca:"Fisica quantica · Criptografia · IA",es:"Fisica cuantica · Criptografia · IA"},synopsis:{ca:"Un experiment de fisica quantica ha sortit malament. La IA ha entrat en mode quarantena. 60 minuts per resoldre tres paradoxes quantiques.",es:"Un experimento de fisica cuantica ha salido mal. La IA ha entrado en modo cuarentena. 60 minutos para resolver tres paradojas cuanticas."},phases:[{name:{ca:"PARADOXA 1",es:"PARADOJA 1"},narrativeTitle:{ca:"El gat de Schrodinger",es:"El gato de Schrodinger"},narrativeText:{ca:"El circuit quantic! En un ordinador quantic, cada qubit pot ser 0 i 1 alhora. El circuit mostra les connexions entre 3 qubits independents.",es:"El circuito cuantico. En un ordenador cuantico, cada qubit puede ser 0 y 1 a la vez. El circuito muestra las conexiones entre 3 qubits independientes."},visual:{type:"circuitPuzzle",config:{nodes:8,color:"#818cf8",solution:[0,1,2,3,4,5,6,7]}},enigma:{ca:"Sistema de 3 qubits. Formula: 2 elevat a n (on n=nombre de qubits). Quants estats simultanis?",es:"Sistema de 3 qubits. Formula: 2 elevado a n (donde n=numero de qubits). Cuantos estados simultaneos?"},answer:"8",hint:{ca:"2 al cub = 2x2x2 = 8",es:"2 al cubo = 2x2x2 = 8"},points:100},{name:{ca:"PARADOXA 2",es:"PARADOJA 2"},narrativeTitle:{ca:"L'entrellaçament quantic",es:"El entrelazamiento cuantico"},narrativeText:{ca:"La constel·lacio dels nombres complexos! En el pla complex, z=3+4i es un punt. La seva distancia a l'origen (modul) es la clau.",es:"La constelacion de los numeros complejos. En el plano complejo, z=3+4i es un punto. Su distancia al origen (modulo) es la clave."},visual:{type:"starPattern",config:{stars:8,pattern:[2,5],color:"#818cf8",title:"PLA COMPLEX"}},enigma:{ca:"|z| = arrel(3^2 + 4^2) = arrel(9+16) = arrel(25) = ?",es:"|z| = raiz(3^2 + 4^2) = raiz(9+16) = raiz(25) = ?"},answer:"5",hint:{ca:"arrel(25) = 5",es:"raiz(25) = 5"},mission:{ca:"Un membre ha d'anar al laboratori i preguntar al professor per l'experiment quantic 5B.",es:"Un miembro debe ir al laboratorio y preguntar al profesor por el experimento cuantico 5B."},missionIcon:"🔬",points:150},{name:{ca:"PARADOXA 3",es:"PARADOJA 3"},narrativeTitle:{ca:"La decoherencia final",es:"La decoherencia final"},narrativeText:{ca:"El panell de control RSA! p=3, q=7. El panell mostra visualment com calcular la funcio d'Euler phi(n)=(p-1)x(q-1).",es:"El panel de control RSA. p=3, q=7. El panel muestra visualmente como calcular la funcion de Euler phi(n)=(p-1)x(q-1)."},visual:{type:"controlPanel",config:{switches:["p=3","q=7","p-1","q-1","φ(n)"],solution:[0,1,2,3,4],color:"#818cf8",label:"RSA BASICO"}},enigma:{ca:"phi(n) = (p-1) x (q-1) = (3-1) x (7-1) = ?",es:"phi(n) = (p-1) x (q-1) = (3-1) x (7-1) = ?"},answer:"12",hint:{ca:"(3-1) x (7-1) = 2 x 6 = 12",es:"(3-1) x (7-1) = 2 x 6 = 12"},points:200,isFinal:true}]},

  { id:"bioterror",emoji:"🧬",lives:3,color:"#4ade80",bg:"radial-gradient(ellipse at 60% 40%,#001a08,#020a02)",font:"'Special Elite',cursive",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"60 min",es:"60 min"},ageLabel:{ca:"17+ anys",es:"17+ anos"},title:{ca:"Codi Genetic",es:"Codigo Genetico"},desc:{ca:"Biologia molecular · Genetica · Bioterrorisme",es:"Biologia molecular · Genetica · Bioterrorismo"},synopsis:{ca:"Un agent ha modificat el codi genetic d'un virus inofensiu. Sou l'equip d'investigacio d'ultima linia. Desxifreu les sequencies.",es:"Un agente ha modificado el codigo genetico de un virus inofensivo. Sois el equipo de investigacion de ultima linea. Descifrad las secuencias."},phases:[{name:{ca:"SEQUENCIA ADN",es:"SECUENCIA ADN"},narrativeTitle:{ca:"El genoma modificat",es:"El genoma modificado"},narrativeText:{ca:"La doble helix de l'ADN! La mutacio esta clarament marcada en la sequencia. Compareu base per base i trobeu la posicio exacta del canvi.",es:"La doble helice del ADN. La mutacion esta claramente marcada en la secuencia. Comparad base por base y encontrad la posicion exacta del cambio."},visual:{type:"dnaHelix",config:{seq1:"ATGCGA",seq2:"ATGCGC",mutPos:5,color:"#4ade80"}},enigma:{ca:"ADN original: ATGCGATCGAT. ADN modificat: ATGCGATCGCT. En quina posicio hi ha la mutacio?",es:"ADN original: ATGCGATCGAT. ADN modificado: ATGCGATCGCT. En que posicion esta la mutacion?"},answer:"10",hint:{ca:"ATGCGATCG = 9 bases. La 10a canvia: A→C",es:"ATGCGATCG = 9 bases. La 10a cambia: A→C"},points:100},{name:{ca:"SINTESI PROTEICA",es:"SINTESIS PROTEICA"},narrativeTitle:{ca:"El codi de les proteines",es:"El codigo de las proteinas"},narrativeText:{ca:"El circuit de transcripcio ADN→ARNm! Cada connexio representa una regla de transcripcio: A→U, T→A, G→C, C→G. Seguiu el cami.",es:"El circuito de transcripcion ADN→ARNm. Cada conexion representa una regla de transcripcion: A→U, T→A, G→C, C→G. Seguid el camino."},visual:{type:"circuitPuzzle",config:{nodes:6,color:"#4ade80",solution:[0,1,2,3,4,5]}},enigma:{ca:"ADN: T-A-C-G-T-A → ARNm? Regles: T→A, A→U, C→G, G→C.",es:"ADN: T-A-C-G-T-A → ARNm? Reglas: T→A, A→U, C→G, G→C."},answer:"AUGCAU",hint:{ca:"T→A, A→U, C→G, G→C, T→A, A→U → AUGCAU",es:"T→A, A→U, C→G, G→C, T→A, A→U → AUGCAU"},mission:{ca:"Aneu al laboratori de biologia i busqueu el Protocol Antidot 7.",es:"Id al laboratorio de biologia y buscad el Protocolo Antidoto 7."},missionIcon:"🧪",points:150},{name:{ca:"L'ANTIDOT",es:"EL ANTIDOTO"},narrativeTitle:{ca:"La formula final",es:"La formula final"},narrativeText:{ca:"La helix de l'antidot! La concentracio exacta esta codificada en la sequencia genetica de l'antidot. Llei de Beer-Lambert: A = epsilon x c x l.",es:"La helice del antidoto. La concentracion exacta esta codificada en la secuencia genetica del antidoto. Ley de Beer-Lambert: A = epsilon x c x l."},visual:{type:"dnaHelix",config:{seq1:"AUGCAU",seq2:"TACGTA",mutPos:2,color:"#00ff88"}},enigma:{ca:"c = A / (epsilon x l) = 0.6 / (120 x 0.5) = ? mol/L",es:"c = A / (epsilon x l) = 0.6 / (120 x 0.5) = ? mol/L"},answer:"0.01",hint:{ca:"0.6 / (120 x 0.5) = 0.6 / 60 = 0.01",es:"0.6 / (120 x 0.5) = 0.6 / 60 = 0.01"},points:200,isFinal:true}]},

  { id:"hacking",emoji:"💻",lives:3,color:"#34d399",bg:"radial-gradient(ellipse at 40% 60%,#001a0a,#000805)",font:"'Orbitron',sans-serif",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"55 min",es:"55 min"},ageLabel:{ca:"16+ anys",es:"16+ anos"},title:{ca:"Infiltracio Zero-Day",es:"Infiltracion Zero-Day"},desc:{ca:"Ciberseguretat · Criptografia · Hacking etic",es:"Ciberseguridad · Criptografia · Hacking etico"},synopsis:{ca:"Sou hackers etics. El sistema ha estat compromès per un atac zero-day. Trobeu la vulnerabilitat i tanqueu la bretxa.",es:"Sois hackers eticos. El sistema ha sido comprometido por un ataque zero-day. Encontrad la vulnerabilidad y cerrad la brecha."},phases:[{name:{ca:"ELS LOGS",es:"LOS LOGS"},narrativeTitle:{ca:"Rastres digitals",es:"Rastros digitales"},narrativeText:{ca:"El circuit de la xarxa! La IP sospitosa en hexadecimal: C0.A8.01.01. Cada node del circuit correspon a un octet de la IP. Calculeu els valors decimals.",es:"El circuito de la red. La IP sospechosa en hexadecimal: C0.A8.01.01. Cada nodo del circuito corresponde a un octeto de la IP. Calculad los valores decimales."},visual:{type:"circuitPuzzle",config:{nodes:4,color:"#34d399",solution:[0,1,2,3]}},enigma:{ca:"IP hex: C0.A8.01.01. Quin es el segon octet (A8) en decimal? A=10, 8=8. A8=(10x16)+8=?",es:"IP hex: C0.A8.01.01. Cual es el segundo octeto (A8) en decimal? A=10, 8=8. A8=(10x16)+8=?"},answer:"168",hint:{ca:"(10x16)+8=160+8=168",es:"(10x16)+8=160+8=168"},points:100},{name:{ca:"EL PAYLOAD",es:"EL PAYLOAD"},narrativeTitle:{ca:"L'atac desxifrat",es:"El ataque descifrado"},narrativeText:{ca:"El codi del payload en pixels! Hash MD5 de la contrasenya. El patró de pixels revela la paraula original si sabeu on buscar.",es:"El codigo del payload en pixeles. Hash MD5 de la contrasena. El patron de pixeles revela la palabra original si sabeis donde buscar."},visual:{type:"pixelSecret",config:{code:"pw",color:"#34d399",noise:true}},enigma:{ca:"Hash MD5: 5f4dcc3b5aa765d61d8327deb882cf99. Es el hash d'una paraula anglesa de 8 lletres que significa contrasenya.",es:"Hash MD5: 5f4dcc3b5aa765d61d8327deb882cf99. Es el hash de una palabra inglesa de 8 letras que significa contrasena."},answer:"password",hint:{ca:"La paraula anglesa que significa contrasenya es password",es:"La palabra inglesa que significa contrasena es password"},mission:{ca:"Un membre pot cercar a internet el hash MD5 per confirmar.",es:"Un miembro puede buscar en internet el hash MD5 para confirmar."},missionIcon:"🔓",points:150},{name:{ca:"PATCH DE SEGURETAT",es:"PARCHE DE SEGURIDAD"},narrativeTitle:{ca:"Tancar la bretxa",es:"Cerrar la brecha"},narrativeText:{ca:"El panell de versions SEMVER! MAJOR.MINOR.PATCH. La versio actual es 2.14.3. Cal aplicar un patch per corregir la vulnerabilitat.",es:"El panel de versiones SEMVER. MAJOR.MINOR.PATCH. La version actual es 2.14.3. Hay que aplicar un patch para corregir la vulnerabilidad."},visual:{type:"controlPanel",config:{switches:["MAJOR","MINOR","PATCH","v2","v14","v3"],solution:[2,5],color:"#34d399",label:"SEMVER CONTROL"}},enigma:{ca:"Versio 2.14.3. PATCH +1 (1 bug corregit). Nova versio completa?",es:"Version 2.14.3. PATCH +1 (1 bug corregido). Nueva version completa?"},answer:"2.14.4",hint:{ca:"Nomes augmenta PATCH: 3+1=4 → 2.14.4",es:"Solo aumenta PATCH: 3+1=4 → 2.14.4"},points:200,isFinal:true}]},

  { id:"philosophy",emoji:"🏛️",lives:3,color:"#fbbf24",bg:"radial-gradient(ellipse at 30% 40%,#1a1400,#060500)",font:"'Cinzel Decorative',cursive",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"55 min",es:"55 min"},ageLabel:{ca:"16+ anys",es:"16+ anos"},title:{ca:"L'Oracle de Delfos",es:"El Oraculo de Delfos"},desc:{ca:"Filosofia · Logica · Grecia classica",es:"Filosofia · Logica · Grecia clasica"},synopsis:{ca:"Heu viatjat a l'antiga Grecia per consultar l'Oracle de Delfos. L'Oracle planteja tres dilemes filosofics que posen a prova el vostre pensament critic.",es:"Habeis viajado a la antigua Grecia para consultar al Oraculo de Delfos. El Oraculo plantea tres dilemas filosoficos que ponen a prueba vuestro pensamiento critico."},phases:[{name:{ca:"DILEMA 1",es:"DILEMA 1"},narrativeTitle:{ca:"La paradoxa del mentider",es:"La paradoja del mentiroso"},narrativeText:{ca:"La constel·lacio dels filosofs grecs! Cada estrella es un filosof. Les connexions mostren les relacions mestre-deixeble. Identifiqueu el que va formalitzar la logica.",es:"La constelacion de los filosofos griegos. Cada estrella es un filosofo. Las conexiones muestran las relaciones maestro-discipulo. Identificad el que formalizo la logica."},visual:{type:"starPattern",config:{stars:5,pattern:[0,2,4],color:"#fbbf24",title:"FILOSOFS GRECS"}},enigma:{ca:"Quin filosof va escriure els Analitics i va formalitzar la logica deductiva (silogismes)?",es:"Que filosofo escribio los Analiticos y formalizo la logica deductiva (silogismos)?"},answer:"Aristotil",hint:{ca:"Mestre d'Alexandre el Gran, deixeble de Plato.",es:"Maestro de Alejandro Magno, discipulo de Platon."},points:100},{name:{ca:"DILEMA 2",es:"DILEMA 2"},narrativeTitle:{ca:"La caverna de Plato",es:"La caverna de Platon"},narrativeText:{ca:"El mapa de l'academie de Plato! La ruta des de l'entrada de la caverna fins a la llum del sol mostra el cami de la il·luminacio filosofica.",es:"El mapa de la academia de Platon. La ruta desde la entrada de la caverna hasta la luz del sol muestra el camino de la iluminacion filosofica."},visual:{type:"treasureMap",config:{paths:3,finalX:[80,20],color:"#fbbf24",seed:360}},enigma:{ca:"En quina obra de Plato i quin llibre (numero roma) apareix l'al·legoria de la caverna?",es:"En que obra de Platon y que libro (numero romano) aparece la alegoria de la caverna?"},answer:"La Republica VII",hint:{ca:"L'obra es La Republica. L'al·legoria es al Llibre VII.",es:"La obra es La Republica. La alegoria esta en el Libro VII."},mission:{ca:"Un membre ha de buscar un exemplar de La Republica a la biblioteca.",es:"Un miembro debe buscar un ejemplar de La Republica en la biblioteca."},missionIcon:"📚",points:150},{name:{ca:"DILEMA 3",es:"DILEMA 3"},narrativeTitle:{ca:"El secret de l'Oracle",es:"El secreto del Oraculo"},narrativeText:{ca:"El panell de les maximes de Delfos! Tres maximes inscrites al temple. El codi final es el producte de les maximes per els deus olimpics.",es:"El panel de las maximas de Delfos. Tres maximas inscritas en el templo. El codigo final es el producto de las maximas por los dioses olimpicos."},visual:{type:"controlPanel",config:{switches:["Coneix-te","Res en exces","Dona paraula","x12","=?"],solution:[0,1,2,3,4],color:"#fbbf24",label:"TEMPLE DE DELFOS"}},enigma:{ca:"Maximes de Delfos (3) x Deus olimpics principals (12) = ?",es:"Maximas de Delfos (3) x Dioses olimpicos principales (12) = ?"},answer:"36",hint:{ca:"3 x 12 = 36",es:"3 x 12 = 36"},points:200,isFinal:true}]},

  { id:"blackhole",emoji:"🌌",lives:3,color:"#c084fc",bg:"radial-gradient(ellipse at 50% 50%,#0d0020,#000005)",font:"'Orbitron',sans-serif",level:"expert",diff:{ca:"Expert",es:"Experto"},dur:{ca:"65 min",es:"65 min"},ageLabel:{ca:"17+ anys",es:"17+ anos"},title:{ca:"Al Limit del Forat Negre",es:"Al Limite del Agujero Negro"},desc:{ca:"Astrofisica · Relativitat · Supervivencia",es:"Astrofisica · Relatividad · Supervivencia"},synopsis:{ca:"La vostra nau ha quedat atrapada a l'horitzó d'esdeveniments d'un forat negre. L'unica sortida es resoldre tres equacions d'astrofisica.",es:"Vuestra nave ha quedado atrapada en el horizonte de eventos de un agujero negro. La unica salida es resolver tres ecuaciones de astrofisica."},phases:[{name:{ca:"DILATACIO TEMPORAL",es:"DILATACION TEMPORAL"},narrativeTitle:{ca:"El temps s'alenteix",es:"El tiempo se ralentiza"},narrativeText:{ca:"La constel·lacio de la relativitat! El factor de Lorentz mesura quant s'alenteix el temps. Al 60% de la velocitat de la llum, quant es gamma?",es:"La constelacion de la relatividad. El factor de Lorentz mide cuanto se ralentiza el tiempo. Al 60% de la velocidad de la luz, cuanto es gamma?"},visual:{type:"starPattern",config:{stars:8,pattern:[0,4],color:"#c084fc",title:"FACTOR DE LORENTZ"}},enigma:{ca:"gamma = 1 / arrel(1-0.6^2) = 1/arrel(1-0.36) = 1/arrel(0.64) = 1/0.8 = ?",es:"gamma = 1 / raiz(1-0.6^2) = 1/raiz(1-0.36) = 1/raiz(0.64) = 1/0.8 = ?"},answer:"1.25",hint:{ca:"1/0.8 = 1.25",es:"1/0.8 = 1.25"},points:100},{name:{ca:"RADI SCHWARZSCHILD",es:"RADIO SCHWARZSCHILD"},narrativeTitle:{ca:"El punt de no retorn",es:"El punto de no retorno"},narrativeText:{ca:"El circuit de la nau al limit! Rs = 2GM/c2. Per al codi d'emergencia necessiteu el primer digit de 2GM del Sol en notacio cientifica.",es:"El circuito de la nave al limite. Rs = 2GM/c2. Para el codigo de emergencia necesitais el primer digito de 2GM del Sol en notacion cientifica."},visual:{type:"circuitPuzzle",config:{nodes:5,color:"#c084fc",solution:[0,2,4]}},enigma:{ca:"2 x G x M = 2 x 6.67e-11 x 2e30. Primer digit del coeficient en notacio cientifica.",es:"2 x G x M = 2 x 6.67e-11 x 2e30. Primer digito del coeficiente en notacion cientifica."},answer:"2",hint:{ca:"2x6.67x2=26.68 → notacio: 2.668e1 → primer digit: 2",es:"2x6.67x2=26.68 → notacion: 2.668e1 → primer digito: 2"},mission:{ca:"Aneu a buscar el professor de Fisica i pregunteu-li per l'equacio de Hawking.",es:"Id a buscar al profesor de Fisica y preguntadle por la ecuacion de Hawking."},missionIcon:"🌠",points:150},{name:{ca:"PROPULSOR D'EMERGENCIA",es:"PROPULSOR DE EMERGENCIA"},narrativeTitle:{ca:"Ultima oportunitat",es:"Ultima oportunidad"},narrativeText:{ca:"El codi de llancament en pixels! Quocient entre la velocitat de la llum i la velocitat del so. El numero apareix en el patró si sabeu com desxifrar-lo.",es:"El codigo de lanzamiento en pixeles. Cociente entre la velocidad de la luz y la velocidad del sonido. El numero aparece en el patron si sabeis como descifrarlo."},visual:{type:"pixelSecret",config:{code:"882353",color:"#c084fc",noise:true}},enigma:{ca:"300000000 / 340 = ? (Arrodonit a l'enter mes proper.)",es:"300000000 / 340 = ? (Redondeado al entero mas cercano.)"},answer:"882353",hint:{ca:"300000000/340 aprox 882353",es:"300000000/340 aprox 882353"},points:200,isFinal:true}]}

];

// Exportacio
if (typeof module !== "undefined" && module.exports) { module.exports = { STORIES }; }
if (typeof window !== "undefined") { window.STORIES = STORIES; }
