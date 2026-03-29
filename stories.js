/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — STORIES v3.0 (22 HISTORIES COMPLETES)
 *  Totes les histories millorades amb 5-7 fases i minijocs reals
 * ═══════════════════════════════════════════════════════════════
 */

const STORIES = [

  // ═══════════════════════════════════════════════════════════════
  //  1. EL REGNE DELS DRACS (Fantasia - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dragons", emoji: "🐉", lives: 3, totalPhases: 5,
    color: "#ff4500", bg: "radial-gradient(ellipse at 40% 60%,#2a0800,#080000)",
    font: "'Cinzel Decorative',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "40 min", es: "40 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 años" },
    title: { ca: "El Regne dels Dracs", es: "El Reino de los Dragones" },
    desc: { ca: "Fantasia · Dracs · Aventura èpica", es: "Fantasía · Dragones · Aventura épica" },
    synopsis: { 
      ca: "El drac guardià ha desaparegut! Sense ell, els enemics atacaran. Heu de superar 5 proves per trobar-lo.", 
      es: "¡El dragón guardián ha desaparecido! Sin él, los enemigos atacarán. Debéis superar 5 pruebas para encontrarlo." 
    },
    phases: [
      {
        name: { ca: "LA COVA FOSCA", es: "LA CUEVA OSCURA" },
        narrativeTitle: { ca: "Entrada misteriosa", es: "Entrada misteriosa" },
        narrativeText: { ca: "La cova és fosca i calenta. A la paret hi ha símbols de dracs que formen un codi.", es: "La cueva es oscura y cálida. En la pared hay símbolos de dragones que forman un código." },
        visual: { type: "pixelSecret", config: { code: "4", color: "#ff4500", noise: true } },
        enigma: { ca: "Si un drac = 5, llavors 5 + estrella = 9. El codi està amagat en els píxels.", es: "Si un dragón = 5, entonces 5 + estrella = 9. El código está oculto en los píxeles." },
        answer: "4", hint: { ca: "5 + ? = 9", es: "5 + ? = 9" }, points: 100
      },
      {
        name: { ca: "EL LABERINT DE FOC", es: "EL LABERINTO DE FUEGO" },
        narrativeTitle: { ca: "Mapa del laberint", es: "Mapa del laberinto" },
        narrativeText: { ca: "Un mapa mostra el camí! Segueix la ruta vermella fins a la X.", es: "¡Un mapa muestra el camino! Sigue la ruta roja hasta la X." },
        visual: { type: "treasureMap", config: { paths: 4, finalX: [75, 60], color: "#ff4500", seed: 77 } },
        enigma: { ca: "Potes de 3 dracs (4 potes cada un) + ales de 2 dracs (2 ales cada un)", es: "Patas de 3 dragones (4 patas cada uno) + alas de 2 dragones (2 alas cada uno)" },
        answer: "16", hint: { ca: "(3×4) + (2×2) = 16", es: "(3×4) + (2×2) = 16" }, points: 150,
        mission: { ca: "Un membre ha d'anar a la biblioteca i buscar un llibre de fantasia. A la pàgina 16 hi ha una nota.", es: "Un miembro debe ir a la biblioteca y buscar un libro de fantasía. En la página 16 hay una nota." }, missionIcon: "📖"
      },
      {
        name: { ca: "PROVA DE MEMÒRIA", es: "PRUEBA DE MEMORIA" },
        narrativeTitle: { ca: "La seqüència màgica", es: "La secuencia mágica" },
        narrativeText: { ca: "El drac et desafia a repetir la seva seqüència de foc!", es: "¡El dragón te desafía a repetir su secuencia de fuego!" },
        minigame: "simon",
        enigma: { ca: "Memoritza i repeteix els 4 colors del drac.", es: "Memoriza y repite los 4 colores del dragón." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "EL CÀLCUL DEL VALENT", es: "EL CÁLCULO DEL VALIENTE" },
        narrativeTitle: { ca: "Enigma matemàtic", es: "Enigma matemático" },
        narrativeText: { ca: "Per creuar el pont, resol aquest càlcul ràpid.", es: "Para cruzar el puente, resuelve este cálculo rápido." },
        enigma: { ca: "Dracs = 7, Cavallers = 3. Si atenen 4 dracs i 6 cavallers, quants peus hi ha? (Drac: 4 peus + 2 ales, Cavaller: 2 peus)", es: "Dragones = 7, Caballeros = 3. Si atacan 4 dragones y 6 caballeros, ¿cuántos pies hay? (Dragón: 4 patas + 2 alas, Caballero: 2 pies)" },
        answer: "40", hint: { ca: "(4×6) + (6×2) + (4×2) = 24+12+8", es: "(4×6) + (6×2) + (4×2) = 24+12+8" }, points: 150
      },
      {
        name: { ca: "EL DRAC DORMIT", es: "EL DRAGÓN DORMIDO" },
        narrativeTitle: { ca: "Constel·lació del drac", es: "Constelación del dragón" },
        narrativeText: { ca: "La constel·lació mostra la veritat. Endevina qui soc.", es: "La constelación muestra la verdad. Adivina quién soy." },
        visual: { type: "starPattern", config: { stars: 8, pattern: [0,2,4,6], color: "#ff4500", title: "DRAC MAJESTUÓS" } },
        enigma: { ca: "Tinc escates però no soc peix. Tinc ales però no soc ocell. Qui soc?", es: "Tengo escamas pero no soy pez. Tengo alas pero no soy pájaro. ¿Quién soy?" },
        answer: "DRAC", hint: { ca: "Comença per D i rima amb 'ac'", es: "Comienza por D y rima con 'agón'" }, points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  2. EL TRESOR DEL CAPITÀ PEROT (Pirates - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "pirates_jr", emoji: "⚓", lives: 3, totalPhases: 5,
    color: "#f0a500", bg: "radial-gradient(ellipse at 50% 30%,#1a0e00,#060300)",
    font: "'Pirata One',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "35 min", es: "35 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 años" },
    title: { ca: "El Tresor del Capità Perot", es: "El Tesoro del Capitán Perot" },
    desc: { ca: "Pirates · Mapa · Tresor per als més petits", es: "Piratas · Mapa · Tesoro para los más pequeños" },
    synopsis: { 
      ca: "El Capità Perot va amagar el seu tresor amb 5 endevinalles. Sou els elegits per trobar-lo!", 
      es: "¡El Capitán Perot escondió su tesoro con 5 acertijos! ¡Sois los elegidos para encontrarlo!" 
    },
    phases: [
      {
        name: { ca: "MAPA 1: LA BADIA", es: "MAPA 1: LA BAHÍA" },
        narrativeTitle: { ca: "Primera peça del mapa", es: "Primera pieza del mapa" },
        narrativeText: { ca: "Segueix la ruta puntejada fins a la X!", es: "¡Sigue la ruta punteada hasta la X!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [68, 72], color: "#f0a500", seed: 42 } },
        enigma: { ca: "Dies de la setmana (7) × 4 = ?", es: "Días de la semana (7) × 4 = ?" },
        answer: "28", hint: { ca: "7 × 4", es: "7 × 4" }, points: 100
      },
      {
        name: { ca: "EL CÒDIGE PIXELAT", es: "EL CÓDIGO PIXELADO" },
        narrativeTitle: { ca: "Cofre del Capità", es: "Cofre del Capitán" },
        narrativeText: { ca: "El cofre té un codi amagat entre el soroll!", es: "¡El cofre tiene un código oculto entre el ruido!" },
        visual: { type: "pixelSecret", config: { code: "32", color: "#f0a500", noise: true } },
        enigma: { ca: "M=13, A=1, R=18. Suma MAR.", es: "M=13, A=1, R=18. Suma MAR." },
        answer: "32", hint: { ca: "13+1+18", es: "13+1+18" }, points: 100
      },
      {
        name: { ca: "SEQÜÈNCIA PIRATA", es: "SECUENCIA PIRATA" },
        narrativeTitle: { ca: "El ball del pirata", es: "El baile del pirata" },
        narrativeText: { ca: "Repeteix la seqüència de passos del Capità Perot!", es: "¡Repite la secuencia de pasos del Capitán Perot!" },
        minigame: "simon",
        enigma: { ca: "4 moviments de ball pirata.", es: "4 movimientos de baile pirata." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "PANEL DE CONTROL", es: "PANEL DE CONTROL" },
        narrativeTitle: { ca: "El sistema del cofre", es: "El sistema del cofre" },
        narrativeText: { ca: "Activa els interruptors en l'ordre correcte.", es: "Activa los interruptores en el orden correcto." },
        visual: { type: "controlPanel", config: { switches: ["1","2","4","8"], solution: [0,1,2,3], color: "#f0a500", label: "COFRE" } },
        enigma: { ca: "Quin nombre × si mateix = 64?", es: "¿Qué número × sí mismo = 64?" },
        answer: "8", hint: { ca: "8 × 8 = 64", es: "8 × 8 = 64" }, points: 150
      },
      {
        name: { ca: "EL TRESOR FINAL", es: "EL TESORO FINAL" },
        narrativeTitle: { ca: "Última prova", es: "Última prueba" },
        narrativeText: { ca: "Desxifra el missatge del Capità amb el còdige Cèsar!", es: "¡Descifra el mensaje del Capitán con el código César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "V D F N (retrocedeix 3 lletres)", es: "V D F N (retrocede 3 letras)" },
        answer: "SCAN", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  3. L'ESCOLA DE MÀGIA (Màgia - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "wizards", emoji: "🧙", lives: 3, totalPhases: 6,
    color: "#a855f7", bg: "radial-gradient(ellipse at 50% 40%,#1a0030,#070010)",
    font: "'Cinzel Decorative',cursive", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "45 min", es: "45 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 años" },
    title: { ca: "L'Escola Arcana", es: "La Escuela Arcana" },
    desc: { ca: "Màgia · Encanteris · Misteri màgic", es: "Magia · Hechizos · Misterio mágico" },
    synopsis: { 
      ca: "Sou aprenents de màgia. El Gran Mestre ha desaparegut. 6 proves us esperen!", 
      es: "Sois aprendices de magia. El Gran Maestro ha desaparecido. ¡6 pruebas os esperan!" 
    },
    phases: [
      {
        name: { ca: "LA POCIÓ DE COLORS", es: "LA POCIÓN DE COLORES" },
        narrativeTitle: { ca: "Laboratori de pocions", es: "Laboratorio de pociones" },
        narrativeText: { ca: "La constel·lació mostra l'ordre dels colors!", es: "¡La constelación muestra el orden de los colores!" },
        visual: { type: "starPattern", config: { stars: 6, pattern: [0,1,2], color: "#a855f7", title: "ORDRE" } },
        enigma: { ca: "Cel=BLAU, Roses=ROSAT, Herba=VERD. Primers 3 caràcters junts.", es: "Cielo=AZUL, Rosas=ROSA, Hierba=VERDE. Primeros 3 caracteres juntos." },
        answer: "BLAROSVER", hint: { ca: "BLA + ROS + VER", es: "AZU + ROS + VER" }, points: 100
      },
      {
        name: { ca: "EL GRIMORI", es: "EL GRIMORIO" },
        narrativeTitle: { ca: "Llibre màgic", es: "Libro mágico" },
        narrativeText: { ca: "El circuit del grimori està trencat!", es: "¡El circuito del grimorio está roto!" },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#a855f7", solution: [0,1,3,5] } },
        enigma: { ca: "MAGIA té 5 lletres, BRUIXA té 6. Suma-les.", es: "MAGIA tiene 5 letras, BRUJA tiene 5. Súmalas." },
        answer: "10", hint: { ca: "5 + 5", es: "5 + 5" }, points: 150
      },
      {
        name: { ca: "SEQÜÈNCIA MÀGICA", es: "SECUENCIA MÁGICA" },
        narrativeTitle: { ca: "Varita màgica", es: "Varita mágica" },
        narrativeText: { ca: "Repeteix els moviments màgics!", es: "¡Repite los movimientos mágicos!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 moviments.", es: "Secuencia de 5 movimientos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "MISSIÓ EXTERIOR", es: "MISIÓN EXTERIOR" },
        narrativeTitle: { ca: "El professor de guàrdia", es: "El profesor de guardia" },
        narrativeText: { ca: "Necessites ajuda del professor!", es: "¡Necesitas ayuda del profesor!" },
        enigma: { ca: "Aneu a buscar el professor i digueu: ABRACADABRA ESCOLA", es: "Id a buscar al profesor y decid: ABRACADABRA ESCUELA" },
        answer: "ABRACADABRA", points: 100,
        mission: { ca: "Un aprenent ha d'anar a buscar el professor i pronunciar la paraula màgica.", es: "Un aprendiz debe ir a buscar al profesor y pronunciar la palabra mágica." }, missionIcon: "🪄"
      },
      {
        name: { ca: "EL CÒDIGE SECRET", es: "EL CÓDIGO SECRETO" },
        narrativeTitle: { ca: "Pedra màgica", es: "Piedra mágica" },
        narrativeText: { ca: "El codi està amagat en els píxels!", es: "¡El código está oculto en los píxeles!" },
        visual: { type: "pixelSecret", config: { code: "25", color: "#a855f7", noise: true } },
        enigma: { ca: "(Mesos de l'any - dies de la setmana) × 5", es: "(Meses del año - días de la semana) × 5" },
        answer: "25", hint: { ca: "(12-7) × 5", es: "(12-7) × 5" }, points: 200
      },
      {
        name: { ca: "ENCANTERI FINAL", es: "HECHIZO FINAL" },
        narrativeTitle: { ca: "Alliberar el mestre", es: "Liberar al maestro" },
        narrativeText: { ca: "Desxifra l'encanteri amb la roda Cèsar!", es: "¡Descifra el hechizo con la rueda César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "GUDHO (retrocedeix 3)", es: "GUDHO (retrocede 3)" },
        answer: "DRAKE", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  4. SAFARI MATEMÀTIC (Animals - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "animals", emoji: "🦁", lives: 3, totalPhases: 5,
    color: "#22c55e", bg: "radial-gradient(ellipse at 30% 70%,#001a08,#000500)",
    font: "'Rajdhani',sans-serif", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "35 min", es: "35 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 años" },
    title: { ca: "Safari Màgic", es: "Safari Mágico" },
    desc: { ca: "Animals · Natura · Mates divertides", es: "Animales · Naturaleza · Mates divertidas" },
    synopsis: { 
      ca: "Sou científics en un safari africà. Heu de resoldre 5 misteris per salvar els animals!", 
      es: "¡Sois científicos en un safari africano! ¡Debéis resolver 5 misterios para salvar los animales!" 
    },
    phases: [
      {
        name: { ca: "EL RASTRE DEL LLEÓ", es: "LA HUELLA DEL LEÓN" },
        narrativeTitle: { ca: "Pista animal", es: "Pista animal" },
        narrativeText: { ca: "El mapa mostra on van convergir les petjades!", es: "¡El mapa muestra dónde convergieron las huellas!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [60, 55], color: "#22c55e", seed: 99 } },
        enigma: { ca: "2 lleons + 1 elefant + 3 àguiles. Suma potes.", es: "2 leones + 1 elefante + 3 águilas. Suma patas." },
        answer: "18", hint: { ca: "(2×4) + (1×4) + (3×2)", es: "(2×4) + (1×4) + (3×2)" }, points: 100
      },
      {
        name: { ca: "ALÇADES COMPARADES", es: "ALTURAS COMPARADAS" },
        narrativeTitle: { ca: "La jirafa i la zebra", es: "La jirafa y la cebra" },
        narrativeText: { ca: "La constel·lació mostra les alçades!", es: "¡La constelación muestra las alturas!" },
        visual: { type: "starPattern", config: { stars: 5, pattern: [0,2,4], color: "#22c55e", title: "ALÇADES" } },
        enigma: { ca: "3 zebres (150cm) vs 1 jirafa (500cm). Diferència?", es: "3 cebras (150cm) vs 1 jirafa (500cm). ¿Diferencia?" },
        answer: "50", hint: { ca: "500 - (3×150)", es: "500 - (3×150)" }, points: 150
      },
      {
        name: { ca: "MEMÒRIA ANIMAL", es: "MEMORIA ANIMAL" },
        narrativeTitle: { ca: "Còdics dels animals", es: "Códigos de los animales" },
        narrativeText: { ca: "Repeteix la seqüència d'animals!", es: "¡Repite la secuencia de animales!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 4 animals.", es: "Secuencia de 4 animales." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "RESERVA NATURAL", es: "RESERVA NATURAL" },
        narrativeTitle: { ca: "Sistema de control", es: "Sistema de control" },
        narrativeText: { ca: "El panell de control de la reserva!", es: "¡El panel de control de la reserva!" },
        visual: { type: "controlPanel", config: { switches: ["🦁","🐘","🦏","🦍","🦓"], solution: [0,1,2,3,4], color: "#22c55e", label: "RESERVA" } },
        enigma: { ca: "Quants animals? El codi és el doble.", es: "¿Cuántos animales? El código es el doble." },
        answer: "10", hint: { ca: "5 × 2", es: "5 × 2" }, points: 150
      },
      {
        name: { ca: "FÓRMULA SECRETA", es: "FÓRMULA SECRETA" },
        narrativeTitle: { ca: "Medicament per als animals", es: "Medicamento para los animales" },
        narrativeText: { ca: "Calcula la dosi exacta!", es: "¡Calcula la dosis exacta!" },
        enigma: { ca: "Pes lleó (190kg) + pes zebra (300kg) + 10 = ?", es: "Peso león (190kg) + peso cebra (300kg) + 10 = ?" },
        answer: "500", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  5. LA FÀBRICA DE ROBOTS (Tecnologia - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "robots", emoji: "🤖", lives: 3, totalPhases: 6,
    color: "#06b6d4", bg: "radial-gradient(ellipse at 60% 40%,#001a2e,#000810)",
    font: "'Orbitron',sans-serif", level: "junior",
    diff: { ca: "Junior", es: "Junior" },
    dur: { ca: "40 min", es: "40 min" },
    ageLabel: { ca: "10-12 anys", es: "10-12 años" },
    title: { ca: "Mega-Tech Industries", es: "Mega-Tech Industries" },
    desc: { ca: "Robots · Tecnologia · Futur", es: "Robots · Tecnología · Futuro" },
    synopsis: { 
      ca: "Els robots s'han averiat! Sou enginyers i heu de reparar-los superant 6 errors.", 
      es: "¡Los robots se han averiado! ¡Sois ingenieros y debéis repararlos superando 6 errores!" 
    },
    phases: [
      {
        name: { ca: "ERROR 001: BATERIA", es: "ERROR 001: BATERÍA" },
        narrativeTitle: { ca: "Sistema de energia", es: "Sistema de energía" },
        narrativeText: { ca: "El circuit de bateria mostra els nodes actius!", es: "¡El circuito de batería muestra los nodos activos!" },
        visual: { type: "circuitPuzzle", config: { nodes: 7, color: "#06b6d4", solution: [0,2,4,6] } },
        enigma: { ca: "Voltatge Europa (220) + Angle recte (90) = ?", es: "Voltaje Europa (220) + Ángulo recto (90) = ?" },
        answer: "310", points: 100
      },
      {
        name: { ca: "ERROR 002: PROGRAMACIÓ", es: "ERROR 002: PROGRAMACIÓN" },
        narrativeTitle: { ca: "Codi binari", es: "Código binario" },
        narrativeText: { ca: "El panell mostra la seqüència!", es: "¡El panel muestra la secuencia!" },
        visual: { type: "controlPanel", config: { switches: ["2","4","8","16","32","64"], solution: [0,1,2,3,4], color: "#06b6d4", label: "CODI" } },
        enigma: { ca: "Continua: 2, 4, 8, 16, 32, __?", es: "Continúa: 2, 4, 8, 16, 32, __?" },
        answer: "64", hint: { ca: "32 × 2", es: "32 × 2" }, points: 100
      },
      {
        name: { ca: "ERROR 003: SEQÜÈNCIA", es: "ERROR 003: SECUENCIA" },
        narrativeTitle: { ca: "Patró mecànic", es: "Patrón mecánico" },
        narrativeText: { ca: "Repeteix els moviments del robot!", es: "¡Repite los movimientos del robot!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 moviments mecànics.", es: "Secuencia de 5 movimientos mecánicos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "ERROR 004: MISSATGE", es: "ERROR 004: MENSAJE" },
        narrativeTitle: { ca: "Robot comunicador", es: "Robot comunicador" },
        narrativeText: { ca: "Desxifra el missatge del robot amb Cèsar!", es: "¡Descifra el mensaje del robot con César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "URERF (shift 3)", es: "URERF (shift 3)" },
        answer: "ROBOT", points: 150
      },
      {
        name: { ca: "ERROR 005: MISSIÓ", es: "ERROR 005: MISIÓN" },
        narrativeTitle: { ca: "Codi de reinici", es: "Código de reinicio" },
        narrativeText: { ca: "Necessites el codi de reinici!", es: "¡Necesitas el código de reinicio!" },
        enigma: { ca: "Ves a l'aula d'informàtica i demana el codi.", es: "Ve al aula de informática y pide el código." },
        answer: "RESET", points: 100,
        mission: { ca: "Un membre ha d'anar a l'aula d'informàtica.", es: "Un miembro debe ir al aula de informática." }, missionIcon: "💻"
      },
      {
        name: { ca: "ERROR 006: ACTIVACIÓ", es: "ERROR 006: ACTIVACIÓN" },
        narrativeTitle: { ca: "Robot actiu!", es: "¡Robot activo!" },
        narrativeText: { ca: "Càlcul final per activar tots els robots!", es: "¡Cálculo final para activar todos los robots!" },
        visual: { type: "pixelSecret", config: { code: "13", color: "#06b6d4", noise: true } },
        enigma: { ca: "Total robots (17) - avariats (4) = actius", es: "Total robots (17) - averiados (4) = activos" },
        answer: "13", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  6. NAU ESPACIAL AURORA-7 (Sci-fi - 7 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "space", emoji: "🚀", lives: 4, totalPhases: 7,
    color: "#00f5ff", bg: "radial-gradient(ellipse at 30% 50%,#001a3a,#000010)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "60 min", es: "60 min" },
    ageLabel: { ca: "15+ anys", es: "15+ años" },
    title: { ca: "Aurora-7: Missió Crítica", es: "Aurora-7: Misión Crítica" },
    desc: { ca: "Sci-fi · Sabotatge · Supervivència", es: "Sci-fi · Sabotaje · Supervivencia" },
    synopsis: { 
      ca: "Autodestrucció iniciada. 60 minuts per salvar la nau i descobrir el traidor. 7 proves extremes.", 
      es: "Autodestrucción iniciada. 60 minutos para salvar la nave y descubrir al traidor. 7 pruebas extremas." 
    },
    phases: [
      {
        name: { ca: "DESPERTAR BRUSC", es: "DESPERTAR BRUSCO" },
        narrativeTitle: { ca: "Pont de comandament", es: "Puente de mando" },
        narrativeText: { ca: "Sistema de vida crític. Segueix el circuit!", es: "¡Sistema de vida crítico. ¡Sigue el circuito!" },
        visual: { type: "circuitPuzzle", config: { nodes: 8, color: "#00f5ff", solution: [0,2,5,7] } },
        enigma: { ca: "Suma digits de 1986 (any MIR) × 4 tripulants", es: "Suma dígitos de 1986 (año MIR) × 4 tripulantes" },
        answer: "96", hint: { ca: "(1+9+8+6) × 4 = 24×4", es: "(1+9+8+6) × 4 = 24×4" }, points: 100
      },
      {
        name: { ca: "OXIGEN CRÍTIC", es: "OXÍGENO CRÍTICO" },
        narrativeTitle: { ca: "Sala de màquines", es: "Sala de máquinas" },
        narrativeText: { ca: "Repeteix la seqüència de calibració!", es: "¡Repite la secuencia de calibración!" },
        minigame: "sequence",
        sequence: [2,0,3,1],
        enigma: { ca: "Seqüència d'oxigen: Aire → Filtre → Bomba → Sortida", es: "Secuencia de oxígeno: Aire → Filtro → Bomba → Salida" },
        answer: "SEQUENCE", points: 150
      },
      {
        name: { ca: "CÒDIGE CESAR", es: "CÓDIGO CÉSAR" },
        narrativeTitle: { ca: "Diari del capità", es: "Diario del capitán" },
        narrativeText: { ca: "Desxifra el missatge del capità!", es: "¡Descifra el mensaje del capitán!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "R QH FHQWUDO → Cèsar -3", es: "R QH FHQWUDO → César -3" },
        answer: "CENTRAL", points: 150
      },
      {
        name: { ca: "EL TRAIDOR", es: "EL TRAIDOR" },
        narrativeTitle: { ca: "Interrogatori", es: "Interrogatorio" },
        narrativeText: { ca: "A diu: B és el traidor. B diu: C menteix. C diu: A diu la veritat. Només un menteix.", es: "A dice: B es el traidor. B dice: C miente. C dice: A dice la verdad. Solo uno miente." },
        enigma: { ca: "Qui és el traidor? (A, B o C)", es: "¿Quién es el traidor? (A, B o C)" },
        answer: "B", points: 200
      },
      {
        name: { ca: "PROTOCOL SIMON", es: "PROTOCOLO SIMON" },
        narrativeTitle: { ca: "Autenticació biomètrica", es: "Autenticación biométrica" },
        narrativeText: { ca: "Repeteix el patró de seguretat!", es: "¡Repite el patrón de seguridad!" },
        minigame: "simon",
        enigma: { ca: "Patró de 5 colors de seguretat.", es: "Patrón de 5 colores de seguridad." },
        answer: "SIMON", points: 200
      },
      {
        name: { ca: "COORDENADES", es: "COORDENADAS" },
        narrativeTitle: { ca: "Navegació estelar", es: "Navegación estelar" },
        narrativeText: { ca: "Calcula les coordenades de l'agujer de cuc!", es: "¡Calcula las coordenadas del agujero de gusano!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [75, 45], color: "#00f5ff", seed: 42 } },
        enigma: { ca: "X = 45+(12×3), Y = 30+(5×3). Suma X+Y.", es: "X = 45+(12×3), Y = 30+(5×3). Suma X+Y." },
        answer: "126", hint: { ca: "81 + 45", es: "81 + 45" }, points: 150,
        mission: { ca: "Ves a la biblioteca i busca el llibre AURORA.", es: "Ve a la biblioteca y busca el libro AURORA." }, missionIcon: "📚"
      },
      {
        name: { ca: "DESACTIVACIÓ FINAL", es: "DESACTIVACIÓN FINAL" },
        narrativeTitle: { ca: "El botó vermell", es: "El botón rojo" },
        narrativeText: { ca: "Suma totes les respostes anteriors!", es: "¡Suma todas las respuestas anteriores!" },
        visual: { type: "controlPanel", config: { switches: ["96","SEQ","CENT","B","SIM","126"], solution: [0,1,2,3,4,5], color: "#00f5ff", label: "REACTOR" } },
        enigma: { ca: "96 + 150 + 150 + 200 + 200 + 126 = ?", es: "96 + 150 + 150 + 200 + 200 + 126 = ?" },
        answer: "922", points: 300, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  7. EL MUSEU MALEÏT (Art/Terror - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "museum", emoji: "🎨", lives: 3, totalPhases: 6,
    color: "#9b59b6", bg: "radial-gradient(ellipse at 60% 40%,#1a0a2e,#0d0d0d)",
    font: "'Cinzel Decorative',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 años" },
    title: { ca: "El Museu de Mitjanit", es: "El Museo de Medianoche" },
    desc: { ca: "Art · Misteri · Terror suau", es: "Arte · Misterio · Terror suave" },
    synopsis: { 
      ca: "Atrapats al museu. Els quadres cobren vida. 6 enigmes artístics us esperen.", 
      es: "Atrapados en el museo. Los cuadros cobran vida. 6 enigmas artísticos os esperan." 
    },
    phases: [
      {
        name: { ca: "MITJANIT", es: "MEDIANOCHE" },
        narrativeTitle: { ca: "Les pintures us miren", es: "Las pinturas os miran" },
        narrativeText: { ca: "La constel·lació del museu mostra el camí!", es: "¡La constelación del museo muestra el camino!" },
        visual: { type: "starPattern", config: { stars: 7, pattern: [0,3,6], color: "#9b59b6", title: "RUTA" } },
        enigma: { ca: "Soc més vell que el temps però vaig néixer avui. No tinc veu però explico històries.", es: "Soy más viejo que el tiempo pero nací hoy. No tengo voz pero cuento historias." },
        answer: "SOMNI", points: 100
      },
      {
        name: { ca: "MEMÒRIA ARTÍSTICA", es: "MEMORIA ARTÍSTICA" },
        narrativeTitle: { ca: "Seqüència de quadres", es: "Secuencia de cuadros" },
        narrativeText: { ca: "Repeteix l'ordre dels quadres!", es: "¡Repite el orden de los cuadros!" },
        minigame: "sequence",
        sequence: [3,1,0,2],
        enigma: { ca: "Gòtic → Renaixement → Modern → Abstracte", es: "Gótico → Renacimiento → Moderno → Abstracto" },
        answer: "SEQUENCE", points: 150
      },
      {
        name: { ca: "EL GUARDIÀ", es: "EL GUARDIÁN" },
        narrativeTitle: { ca: "Contracte de 1743", es: "Contrato de 1743" },
        narrativeText: { ca: "Activa els quadres en ordre!", es: "¡Activa los cuadros en orden!" },
        visual: { type: "controlPanel", config: { switches: ["🖼","👁","⏰","🌅"], solution: [0,1,2], color: "#9b59b6", label: "ARXIU" } },
        enigma: { ca: "Mona Lisa=1, Picasso=3 ulls, Dalí=1 rellotge. Concatena.", es: "Mona Lisa=1, Picasso=3 ojos, Dalí=1 reloj. Concatena." },
        answer: "131", points: 150
      },
      {
        name: { ca: "CÒDIGE PIXELAT", es: "CÓDIGO PIXELADO" },
        narrativeTitle: { ca: "Sistema de seguretat", es: "Sistema de seguridad" },
        narrativeText: { ca: "El codi està amagat en els píxels!", es: "¡El código está oculto en los píxeles!" },
        visual: { type: "pixelSecret", config: { code: "1890", color: "#9b59b6", noise: true } },
        enigma: { ca: "Any de mort de Van Gogh (37 anys), més jove dels tres.", es: "Año de muerte de Van Gogh (37 años), más joven de los tres." },
        answer: "1890", hint: { ca: "Van Gogh 1890, Dalí 1989, Picasso 1973", es: "Van Gogh 1890, Dalí 1989, Picasso 1973" }, points: 200,
        mission: { ca: "Ves a l'entrada i busca sota la bústia.", es: "Ve a la entrada y busca bajo el buzón." }, missionIcon: "📬"
      },
      {
        name: { ca: "XIFRAT ARTÍSTIC", es: "CIFRADO ARTÍSTICO" },
        narrativeTitle: { ca: "Missatge ocult", es: "Mensaje oculto" },
        narrativeText: { ca: "Desxifra amb la roda Cèsar!", es: "¡Descifra con la rueda César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "DUHO (shift 3)", es: "DUHO (shift 3)" },
        answer: "ARTE", points: 150
      },
      {
        name: { ca: "ESCAPADA FINAL", es: "ESCAPE FINAL" },
        narrativeTitle: { ca: "La porta secreta", es: "La puerta secreta" },
        narrativeText: { ca: "Últim enigma per sortir!", es: "¡Último enigma para salir!" },
        enigma: { ca: "Suma totes les obres: Mona Lisa (1) + Guernica (1) + Gòtica (1) + Persitència (1) = ?", es: "Suma todas las obras: Mona Lisa (1) + Guernica (1) + Gótica (1) + Persistencia (1) = ?" },
        answer: "4", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  8. TREN SENSE FRENS (Thriller - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "train", emoji: "🚄", lives: 3, totalPhases: 6,
    color: "#e74c3c", bg: "radial-gradient(ellipse at 50% 80%,#2d0000,#0a0005)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "55 min", es: "55 min" },
    ageLabel: { ca: "15+ anys", es: "15+ años" },
    title: { ca: "Tren Bala: Alerta Màxima", es: "Tren Bala: Alerta Máxima" },
    desc: { ca: "Thriller · Velocitat · Tensió extrema", es: "Thriller · Velocidad · Tensión extrema" },
    synopsis: { 
      ca: "350 km/h sense frens. 6 parades amb bombes i pistes. Atura el tren o morireu tots.", 
      es: "350 km/h sin frenos. 6 paradas con bombas y pistas. Detén el tren o moriréis todos." 
    },
    phases: [
      {
        name: { ca: "PARADA 1: MISSATGE", es: "PARADA 1: MENSAJE" },
        narrativeTitle: { ca: "Al seient 13B", es: "En el asiento 13B" },
        narrativeText: { ca: "El mapa mostra el punt d'impacte!", es: "¡El mapa muestra el punto de impacto!" },
        visual: { type: "treasureMap", config: { paths: 2, finalX: [82, 30], color: "#e74c3c", seed: 55 } },
        enigma: { ca: "Tren 350 km/h. Distància 175 km. Minuts fins al túnel?", es: "Tren 350 km/h. Distancia 175 km. ¿Minutos hasta el túnel?" },
        answer: "30", hint: { ca: "(175/350) × 60", es: "(175/350) × 60" }, points: 100
      },
      {
        name: { ca: "PARADA 2: CODI", es: "PARADA 2: CÓDIGO" },
        narrativeTitle: { ca: "Passatger misteriós", es: "Pasajero misterioso" },
        narrativeText: { ca: "La roda de Cèsar mostra la clau!", es: "¡La rueda de César muestra la clave!" },
        visual: { type: "cipherWheel", config: { shift: 3, highlightLetter: "R", color: "#e74c3c" } },
        enigma: { ca: "Desxifra R O L D Q R (shift -3)", es: "Descifra R O L D Q R (shift -3)" },
        answer: "OLIANO", points: 150
      },
      {
        name: { ca: "PARADA 3: MEMÒRIA", es: "PARADA 3: MEMORIA" },
        narrativeTitle: { ca: "Sistema de frens", es: "Sistema de frenos" },
        narrativeText: { ca: "Repeteix la seqüència d'emergència!", es: "¡Repite la secuencia de emergencia!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 frenades d'emergència.", es: "Secuencia de 5 frenadas de emergencia." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "PARADA 4: CIRCUIT", es: "PARADA 4: CIRCUITO" },
        narrativeTitle: { ca: "Control del tren", es: "Control del tren" },
        narrativeText: { ca: "Segueix el circuit de seguretat!", es: "¡Sigue el circuito de seguridad!" },
        visual: { type: "circuitPuzzle", config: { nodes: 7, color: "#e74c3c", solution: [0,3,6] } },
        enigma: { ca: "Suma nodes del camí de seguretat: 0→3→6", es: "Suma nodos del camino de seguridad: 0→3→6" },
        answer: "9", points: 150
      },
      {
        name: { ca: "PARADA 5: SEQÜÈNCIA", es: "PARADA 5: SECUENCIA" },
        narrativeTitle: { ca: "Controls finals", es: "Controles finales" },
        narrativeText: { ca: "Ordena els controls de menys a més costats!", es: "¡Ordena los controles de menos a más lados!" },
        visual: { type: "controlPanel", config: { switches: ["○","∆","■","✦"], solution: [0,1,2,3], color: "#e74c3c", label: "FRENS" } },
        enigma: { ca: "Cercle (0) → Triangle (3) → Quadrat (4) → Estrella (10)", es: "Círculo (0) → Triángulo (3) → Cuadrado (4) → Estrella (10)" },
        answer: "CIRCULO", points: 200,
        mission: { ca: "El revisor és al passadís. Digues-li CODI VERMELL.", es: "El revisor está en el pasillo. Dile CÓDIGO ROJO." }, missionIcon: "🧳"
      },
      {
        name: { ca: "TÚNEL FINAL", es: "TÚNEL FINAL" },
        narrativeTitle: { ca: "10 minuts per l'impacte", es: "10 minutos para el impacto" },
        narrativeText: { ca: "Càlcul final per aturar el tren!", es: "¡Cálculo final para detener el tren!" },
        enigma: { ca: "350 km/h = ? m/s (arrodonit). Pista: 350 × 1000 / 3600", es: "350 km/h = ? m/s (redondeado). Pista: 350 × 1000 / 3600" },
        answer: "97", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  9. BUNQUER 2087 (Post-apocalíptic - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "bunker", emoji: "☢️", lives: 3, totalPhases: 6,
    color: "#27ae60", bg: "radial-gradient(ellipse at 40% 60%,#0d1f00,#050505)",
    font: "'Special Elite',cursive", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "60 min", es: "60 min" },
    ageLabel: { ca: "16+ anys", es: "16+ años" },
    title: { ca: "Búnquer 2087: Supervivència", es: "Búnker 2087: Supervivencia" },
    desc: { ca: "Post-apocalíptic · Ciència · Últims humans", es: "Post-apocalíptico · Ciencia · Últimos humanos" },
    synopsis: { 
      ca: "Any 2087. Sou els últims humans. Oxigen per 6 hores. 6 proves per descobrir la veritat.", 
      es: "Año 2087. Sois los últimos humanos. Oxígeno para 6 horas. 6 pruebas para descubrir la verdad." 
    },
    phases: [
      {
        name: { ca: "DESPERTAR", es: "DESPERTAR" },
        narrativeTitle: { ca: "Registres de l'any zero", es: "Registros del año cero" },
        narrativeText: { ca: "El circuit mostra quins sistemes sobreviuen!", es: "¡El circuito muestra qué sistemas sobreviven!" },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#27ae60", solution: [0,1,3] } },
        enigma: { ca: "1986 (Txernòbil) - 1991 (Fi Guerra Freda) = Valor absolut", es: "1986 (Chernóbil) - 1991 (Fin Guerra Fría) = Valor absoluto" },
        answer: "5", points: 100
      },
      {
        name: { ca: "ARXIUS BINARIS", es: "ARCHIVOS BINARIOS" },
        narrativeTitle: { ca: "El culpable", es: "El culpable" },
        narrativeText: { ca: "Converteix binari a ASCII!", es: "¡Convierte binario a ASCII!" },
        visual: { type: "pixelSecret", config: { code: "AI", color: "#27ae60", noise: true } },
        enigma: { ca: "01000001=A(65). 01001001=I(73). Inicials del culpable.", es: "01000001=A(65). 01001001=I(73). Iniciales del culpable." },
        answer: "AI", points: 150
      },
      {
        name: { ca: "XIFRAT", es: "CIFRADO" },
        narrativeTitle: { ca: "Missatge encriptat", es: "Mensaje encriptado" },
        narrativeText: { ca: "Desxifra amb ROT13!", es: "¡Descifra con ROT13!" },
        minigame: "cipher",
        shift: 13,
        enigma: { ca: "N V (ROT13)", es: "N V (ROT13)" },
        answer: "AI", points: 150
      },
      {
        name: { ca: "TAULA PERIÒDICA", es: "TABLA PERIÓDICA" },
        narrativeTitle: { ca: "Porta hermètica", es: "Puerta hermética" },
        narrativeText: { ca: "Activa elements en ordre atòmic!", es: "¡Activa elementos en orden atómico!" },
        visual: { type: "controlPanel", config: { switches: ["H","He","Li","Be","B"], solution: [0,1,2,3,4], color: "#27ae60", label: "PORTA" } },
        enigma: { ca: "Ordena: Hidrogen, Heli, Liti, Beril·li, Bor", es: "Ordena: Hidrógeno, Helio, Litio, Berilio, Boro" },
        answer: "HELIBE", points: 200,
        mission: { ca: "Ves a l'aula d'informàtica i busca l'arxiu BUNKER2087.", es: "Ve al aula de informática y busca el archivo BUNKER2087." }, missionIcon: "💻"
      },
      {
        name: { ca: "MEMÒRIA", es: "MEMORIA" },
        narrativeTitle: { ca: "Seqüència de supervivència", es: "Secuencia de supervivencia" },
        narrativeText: { ca: "Repeteix la seqüència de protocols!", es: "¡Repite la secuencia de protocolos!" },
        minigame: "simon",
        enigma: { ca: "5 passos de supervivència.", es: "5 pasos de supervivencia." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "SORTIDA", es: "SALIDA" },
        narrativeTitle: { ca: "L'última porta", es: "La última puerta" },
        narrativeText: { ca: "Càlcul final d'oxigen!", es: "¡Cálculo final de oxígeno!" },
        enigma: { ca: "6 hores = ? minuts. Menys 45 minuts gastats = ?", es: "6 horas = ? minutos. Menos 45 minutos gastados = ?" },
        answer: "315", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  10. PIRATES DEL MEDITERRANI (Aventura - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "pirates", emoji: "🏴‍☠️", lives: 3, totalPhases: 6,
    color: "#f39c12", bg: "radial-gradient(ellipse at 50% 30%,#1f1000,#060400)",
    font: "'Pirata One',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 años" },
    title: { ca: "Pirates del Mediterrani", es: "Piratas del Mediterráneo" },
    desc: { ca: "Aventura · Mapa · Tresor", es: "Aventura · Mapa · Tesoro" },
    synopsis: { 
      ca: "Sou tripulació d'El Venjador Escarlata. El mapa de Barbanegra està xifrat. 6 proves per al tresor!", 
      es: "Sois tripulación de El Vengador Escarlata. ¡El mapa de Barbanegra está cifrado! ¡6 pruebas para el tesoro!" 
    },
    phases: [
      {
        name: { ca: "EL MAPA", es: "EL MAPA" },
        narrativeTitle: { ca: "Barbanegra us parla", es: "Barbanegra os habla" },
        narrativeText: { ca: "Segueix la ruta fins a la X!", es: "¡Sigue la ruta hasta la X!" },
        visual: { type: "treasureMap", config: { paths: 4, finalX: [65, 70], color: "#f39c12", seed: 33 } },
        enigma: { ca: "Edat primer viatge (17) + nombre de mars (7)", es: "Edad primer viaje (17) + número de mares (7)" },
        answer: "24", points: 100
      },
      {
        name: { ca: "CÒDIGE PIXELAT", es: "CÓDIGO PIXELADO" },
        narrativeTitle: { ca: "Cofre del Capità", es: "Cofre del Capitán" },
        narrativeText: { ca: "Codi amagat entre el soroll!", es: "¡Código oculto entre el ruido!" },
        visual: { type: "pixelSecret", config: { code: "1770", color: "#f39c12", noise: false } },
        enigma: { ca: "Any de naixement de Barbanegra: 1680 + 90", es: "Año de nacimiento de Barbanegra: 1680 + 90" },
        answer: "1770", points: 150
      },
      {
        name: { ca: "L'ILLA", es: "LA ISLA" },
        narrativeTitle: { ca: "Guardià de la cova", es: "Guardián de la cueva" },
        narrativeText: { ca: "El circuit secret de la cova!", es: "¡El circuito secreto de la cueva!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#f39c12", solution: [0,2,4] } },
        enigma: { ca: "Tinc ciutats però no cases, muntanyes però no arbres...", es: "Tengo ciudades pero no casas, montañas pero no árboles..." },
        answer: "MAPA", points: 150
      },
      {
        name: { ca: "SEQÜÈNCIA PIRATA", es: "SECUENCIA PIRATA" },
        narrativeTitle: { ca: "Ball del pirata", es: "Baile del pirata" },
        narrativeText: { ca: "Repeteix els passos del Capità!", es: "¡Repite los pasos del Capitán!" },
        minigame: "simon",
        enigma: { ca: "4 moviments de ball pirata.", es: "4 movimientos de baile pirata." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "MISSIÓ EXTERIOR", es: "MISIÓN EXTERIOR" },
        narrativeTitle: { ca: "Pista al pati", es: "Pista en el patio" },
        narrativeText: { ca: "Necessites una pista física!", es: "¡Necesitas una pista física!" },
        answer: "PISTA",
        mission: { ca: "Ves al pati i busca sota del banc de l'entrada.", es: "Ve al patio y busca bajo el banco de la entrada." }, missionIcon: "🗺️", points: 100
      },
      {
        name: { ca: "EL TRESOR", es: "EL TESORO" },
        narrativeTitle: { ca: "Pany del cofre", es: "Cerradura del cofre" },
        narrativeText: { ca: "Cristòfor Colombo en italià!", es: "¡Cristoforo Colombo en italiano!" },
        visual: { type: "pixelSecret", config: { code: "CRIST", color: "#f39c12", noise: false } },
        enigma: { ca: "5 primeres lletres de Cristoforo.", es: "5 primeras letras de Cristoforo." },
        answer: "CRIST", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  11. EL CASTELL ENCANTAT (Terror - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "castle", emoji: "🏰", lives: 3, totalPhases: 6,
    color: "#8e44ad", bg: "radial-gradient(ellipse at 30% 70%,#150020,#050005)",
    font: "'Cinzel Decorative',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 años" },
    title: { ca: "El Castell dels Susurros", es: "El Castillo de los Susurros" },
    desc: { ca: "Terror · Medieval · Misteri fosc", es: "Terror · Medieval · Misterio oscuro" },
    synopsis: { 
      ca: "El fantasma del Comte Vladimiro us atrapa. 6 enigmes per alliberar-vos o sou seus per sempre.", 
      es: "El fantasma del Conde Vladimiro os atrapa. 6 enigmas para liberaros o sois suyos para siempre." 
    },
    phases: [
      {
        name: { ca: "ARRIBADA", es: "LLEGADA" },
        narrativeTitle: { ca: "Portes que es tanquen", es: "Puertas que se cierran" },
        narrativeText: { ca: "El mapa mostra la ruta dels secrets!", es: "¡El mapa muestra la ruta de los secretos!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [50, 40], color: "#8e44ad", seed: 666 } },
        enigma: { ca: "Maleït el 1723. Quants anys fins al 2025?", es: "Maldecido en 1723. ¿Cuántos años hasta 2025?" },
        answer: "302", points: 100
      },
      {
        name: { ca: "CONSTEL·LACIÓ", es: "CONSTELACIÓN" },
        narrativeTitle: { ca: "Estels del destí", es: "Estrellas del destino" },
        narrativeText: { ca: "Segueix el patró estel·lar!", es: "¡Sigue el patrón estelar!" },
        visual: { type: "starPattern", config: { stars: 5, pattern: [0,2,4], color: "#8e44ad", title: "DESTÍ" } },
        enigma: { ca: "Quin número és el camí estel·lar? 0→2→4", es: "¿Qué número es el camino estelar? 0→2→4" },
        answer: "6", points: 100
      },
      {
        name: { ca: "LA MALEDICCIÓ", es: "LA MALDICIÓN" },
        narrativeTitle: { ca: "Llibre d'encanteris", es: "Libro de hechizos" },
        narrativeText: { ca: "El circuit del grimori està actiu!", es: "¡El circuito del grimorio está activo!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#8e44ad", solution: [0,2,3] } },
        enigma: { ca: "Com més m'asseques, més mullat et quedes.", es: "Cuanto más me secas, más mojado te quedas." },
        answer: "TOVALLOLA", points: 150,
        mission: { ca: "El grimori és a la classe d'Història, sota la taula del professor.", es: "El grimorio está en la clase de Historia, bajo la mesa del profesor." }, missionIcon: "📜"
      },
      {
        name: { ca: "MEMÒRIA MÀGICA", es: "MEMORIA MÁGICA" },
        narrativeTitle: { ca: "Encanteri de repetició", es: "Hechizo de repetición" },
        narrativeText: { ca: "Repeteix l'encanteri del fantasma!", es: "¡Repite el hechizo del fantasma!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 4 encanteris.", es: "Secuencia de 4 hechizos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "XIFRAT", es: "CIFRADO" },
        narrativeTitle: { ca: "Nom del dimoni", es: "Nombre del demonio" },
        narrativeText: { ca: "Desxifra amb ROT13!", es: "¡Descifra con ROT13!" },
        minigame: "cipher",
        shift: 13,
        enigma: { ca: "Znyhf (ROT13)", es: "Znyhf (ROT13)" },
        answer: "Malus", points: 200
      },
      {
        name: { ca: "ALLIBERAMENT", es: "LIBERACIÓN" },
        narrativeTitle: { ca: "Exorcisme final", es: "Exorcismo final" },
        narrativeText: { ca: "Suma tots els anys de maledicció!", es: "¡Suma todos los años de maldición!" },
        enigma: { ca: "302 anys de maledicció + 13 lletres de VLADIMIRO = ?", es: "302 años de maldición + 13 letras de VLADIMIRO = ?" },
        answer: "315", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  12. CIUTAT SUMERGIDA (Atlantis - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "atlantis", emoji: "🌊", lives: 3, totalPhases: 6,
    color: "#2980b9", bg: "radial-gradient(ellipse at 50% 100%,#00162e,#000510)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "55 min", es: "55 min" },
    ageLabel: { ca: "15+ anys", es: "15+ años" },
    title: { ca: "Atlantis: La Ciutat Perduda", es: "Atlantis: La Ciudad Perdida" },
    desc: { ca: "Atlantis · Ciència · Arqueologia", es: "Atlantis · Ciencia · Arqueología" },
    synopsis: { 
      ca: "Heu trobat Atlantis! Però l'ascensor d'emergència necessita 6 codis per activar-se. Pugeu abans que s'ensorri!", 
      es: "¡Habéis encontrado Atlantis! Pero el ascensor de emergencia necesita 6 códigos para activarse. ¡Subid antes de que se hunda!" 
    },
    phases: [
      {
        name: { ca: "DESCobRIMENT", es: "DESCUBRIMIENTO" },
        narrativeTitle: { ca: "Registres atlants", es: "Registros atlantes" },
        narrativeText: { ca: "El circuit atlant en octal!", es: "¡El circuito atlante en octal!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#2980b9", solution: [0,1,3,4] } },
        enigma: { ca: "En octal: 10+10 = 16 decimal. 16 en octal = ?", es: "En octal: 10+10 = 16 decimal. ¿16 en octal?" },
        answer: "20", points: 100
      },
      {
        name: { ca: "ADN ATLANT", es: "ADN ATLANTE" },
        narrativeTitle: { ca: "Seqüència genètica", es: "Secuencia genética" },
        narrativeText: { ca: "L'hèlix d'ADN mostra la mutació!", es: "¡La hélice de ADN muestra la mutación!" },
        visual: { type: "dnaHelix", config: { seq1: "ATGCGA", seq2: "TACGCT", mutPos: 2, color: "#2980b9" } },
        enigma: { ca: "Quina posició té la mutació?", es: "¿Qué posición tiene la mutación?" },
        answer: "3", points: 150
      },
      {
        name: { ca: "REACTOR", es: "REACTOR" },
        narrativeTitle: { ca: "Cristalls de quars", es: "Cristales de cuarzo" },
        narrativeText: { ca: "Ordena per freqüència!", es: "¡Ordena por frecuencia!" },
        visual: { type: "controlPanel", config: { switches: ["430","490","530","560","620"], solution: [0,1,2,3,4], color: "#2980b9", label: "REACTOR" } },
        enigma: { ca: "De menor a major THz: Vermell, Taronja, Groc, Verd, Blau", es: "De menor a mayor THz: Rojo, Naranja, Amarillo, Verde, Azul" },
        answer: "ESPECTRE", points: 150,
        mission: { ca: "El cristall mestre és al laboratori. Pregunta pel PROJECTE ATLANTIDA.", es: "El cristal maestro está en el laboratorio. Pregunta por el PROYECTO ATLANTIDA." }, missionIcon: "💎"
      },
      {
        name: { ca: "MEMÒRIA SUBMARINA", es: "MEMORIA SUBMARINA" },
        narrativeTitle: { ca: "Seqüència de pressió", es: "Secuencia de presión" },
        narrativeText: { ca: "Repeteix la seqüència de descompressió!", es: "¡Repite la secuencia de descompresión!" },
        minigame: "simon",
        enigma: { ca: "5 passos de descompressió.", es: "5 pasos de descompresión." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "CÀLCUL DE PRESSIÓ", es: "CÁLCUL DE PRESIÓN" },
        narrativeTitle: { ca: "Ascensor d'emergència", es: "Ascensor de emergencia" },
        narrativeText: { ca: "Calcula la pressió!", es: "¡Calcula la presión!" },
        enigma: { ca: "P = 1025 × 9.8 × 3000 Pa. /100000 = ? bar (arrodonit)", es: "P = 1025 × 9.8 × 3000 Pa. /100000 = ? bar (redondeado)" },
        answer: "301", hint: { ca: "30135000/100000 = 301.35", es: "30135000/100000 = 301.35" }, points: 200
      },
      {
        name: { ca: "ASCENSOR", es: "ASCENSOR" },
        narrativeTitle: { ca: "Pujar a la superfície", es: "Subir a la superficie" },
        narrativeText: { ca: "Còdige final per escapar!", es: "¡Código final para escapar!" },
        visual: { type: "pixelSecret", config: { code: "3142", color: "#2980b9", noise: true } },
        enigma: { ca: "Suma tots els codis anteriors: 20+3+ESPECTRE+301 = ? (Només números)", es: "Suma todos los códigos anteriores: 20+3+ESPECTRE+301 = ? (Sólo números)" },
        answer: "324", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  13. AGÈNCIA FANTASMA (Espionatge - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "spy", emoji: "🕵️", lives: 3, totalPhases: 6,
    color: "#e8c84a", bg: "radial-gradient(ellipse at 70% 30%,#1a1a00,#050500)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "55 min", es: "55 min" },
    ageLabel: { ca: "15+ anys", es: "15+ años" },
    title: { ca: "Agència Fantasma", es: "Agencia Fantasma" },
    desc: { ca: "Espionatge · Acció · Suspense", es: "Espionaje · Acción · Suspense" },
    synopsis: { 
      ca: "Sou agents secrets. El virus 'Fènix Negre' robarà tots els secrets en 60 minuts. Infiltra't i atura'l!", 
      es: "Sois agentes secretos. El virus 'Fénix Negro' robará todos los secretos en 60 minutos. ¡Infiltrate y detenlo!" 
    },
    phases: [
      {
        name: { ca: "INFILTRACIÓ", es: "INFILTRACIÓN" },
        narrativeTitle: { ca: "Accés a la base", es: "Acceso a la base" },
        narrativeText: { ca: "La roda de Cèsar obre portes!", es: "¡La rueda de César abre puertas!" },
        visual: { type: "cipherWheel", config: { shift: 3, highlightLetter: "R", color: "#e8c84a" } },
        enigma: { ca: "Desxifra: R O L D Q R (shift -3)", es: "Descifra: R O L D Q R (shift -3)" },
        answer: "OLIANO", points: 100
      },
      {
        name: { ca: "FIREWALL 1", es: "FIREWALL 1" },
        narrativeTitle: { ca: "Primera barrera", es: "Primera barrera" },
        narrativeText: { ca: "El circuit de la xarxa!", es: "¡El circuito de la red!" },
        visual: { type: "circuitPuzzle", config: { nodes: 7, color: "#e8c84a", solution: [0,3,6] } },
        enigma: { ca: "Suma nodes: 0→3→6", es: "Suma nodos: 0→3→6" },
        answer: "9", points: 100
      },
      {
        name: { ca: "SEQÜÈNCIA D'ACCÉS", es: "SECUENCIA DE ACCESO" },
        narrativeTitle: { ca: "Credencials", es: "Credenciales" },
        narrativeText: { ca: "Repeteix el patró de seguretat!", es: "¡Repite el patrón de seguridad!" },
        minigame: "simon",
        enigma: { ca: "Seqüència d'accés de 5 passos.", es: "Secuencia de acceso de 5 pasos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "EL CONSERGE", es: "EL CONSERJE" },
        narrativeTitle: { ca: "Contacte interior", es: "Contacto interior" },
        narrativeText: { ca: "Necessites la paraula clau!", es: "¡Necesitas la palabra clave!" },
        enigma: { ca: "Digues al conserge: L'ÀGUILA HA ATERRAT", es: "Dile al conserje: EL ÁGUILA HA ATERRIZADO" },
        answer: "AGUILA", points: 100,
        mission: { ca: "El conserge (professor) té un sobre per tu.", es: "El conserje (profesor) tiene un sobre para ti." }, missionIcon: "🔌"
      },
      {
        name: { ca: "FIREWALL FINAL", es: "FIREWALL FINAL" },
        narrativeTitle: { ca: "Criptografia avançada", es: "Criptografía avanzada" },
        narrativeText: { ca: "Fibonacci és la clau!", es: "¡Fibonacci es la clave!" },
        enigma: { ca: "Fibonacci termes 7,8,9: 13+21+34 = ?", es: "Fibonacci términos 7,8,9: 13+21+34 = ?" },
        answer: "68", hint: { ca: "13+21+34", es: "13+21+34" }, points: 200
      },
      {
        name: { ca: "NEUTRALITZACIÓ", es: "NEUTRALIZACIÓN" },
        narrativeTitle: { ca: "Núcli del virus", es: "Núcleo del virus" },
        narrativeText: { ca: "Suma tots els codis d'accés!", es: "¡Suma todos los códigos de acceso!" },
        visual: { type: "controlPanel", config: { switches: ["OLI","9","SIM","AGU","68"], solution: [0,1,2,3,4], color: "#e8c84a", label: "VIRUS" } },
        enigma: { ca: "9 + 68 = ? (Només números)", es: "9 + 68 = ? (Sólo números)" },
        answer: "77", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  14. CIRC DEL FI DEL MÓN (Suspense - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "circus", emoji: "🎪", lives: 3, totalPhases: 6,
    color: "#ff0066", bg: "radial-gradient(ellipse at 50% 50%,#200010,#050005)",
    font: "'Creepster',cursive", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "55 min", es: "55 min" },
    ageLabel: { ca: "15+ anys", es: "15+ años" },
    title: { ca: "El Circ de Mitjanit", es: "El Circo de Medianoche" },
    desc: { ca: "Misteri fosc · Suspens · Terror psicològic", es: "Misterio oscuro · Suspense · Terror psicológico" },
    synopsis: { 
      ca: "El circ va arribar una nit de tempesta. Al matí, tothom havia desaparegut. El pallasso us desafia a 6 actes...", 
      es: "El circo llegó una noche de tormenta. Al día siguiente, todos habían desaparecido. El payaso os desafía a 6 actos..." 
    },
    phases: [
      {
        name: { ca: "ACTE I: EL MAG", es: "ACTO I: EL MAGO" },
        narrativeTitle: { ca: "Desafiament màgic", es: "Desafío mágico" },
        narrativeText: { ca: "La constel·lació del circ!", es: "¡La constelación del circo!" },
        visual: { type: "starPattern", config: { stars: 6, pattern: [0,2,5], color: "#ff0066", title: "CIRC" } },
        enigma: { ca: "MAGIA (5) × 40 cartes + 666 = ?", es: "MAGIA (5) × 40 cartas + 666 = ?" },
        answer: "866", points: 100
      },
      {
        name: { ca: "ACTE II: TRAPEZISTA", es: "ACTO II: TRAPEZISTA" },
        narrativeTitle: { ca: "La trapecista sense cara", es: "La trapecista sin cara" },
        narrativeText: { ca: "Calcula la velocitat d'impacte!", es: "¡Calcula la velocidad de impacto!" },
        enigma: { ca: "v = arrel(2×10×80) = arrel(1600) = ?", es: "v = raíz(2×10×80) = raíz(1600) = ?" },
        answer: "40", points: 150
      },
      {
        name: { ca: "ACTE III: MEMÒRIA", es: "ACTO III: MEMORIA" },
        narrativeTitle: { ca: "Truc de memòria", es: "Truco de memoria" },
        narrativeText: { ca: "Repeteix la seqüència del pallasso!", es: "¡Repite la secuencia del payaso!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 colors del pallasso.", es: "Secuencia de 5 colores del payaso." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "ACTE IV: ENDEVINALLE", es: "ACTO IV: ADIVINANZA" },
        narrativeTitle: { ca: "Enigma del pallasso", es: "Enigma del payaso" },
        narrativeText: { ca: "Endevina què és!", es: "¡Adivina qué es!" },
        enigma: { ca: "Com més en treus, més gran soc.", es: "Cuanto más quitas, más grande soy." },
        answer: "FORAT", points: 150
      },
      {
        name: { ca: "ACTE V: CÒDIGE", es: "ACTO V: CÓDIGO" },
        narrativeTitle: { ca: "Carta xifrada", es: "Carta cifrada" },
        narrativeText: { ca: "Desxifra el missatge del pallasso!", es: "¡Descifra el mensaje del payaso!" },
        minigame: "cipher",
        shift: 5,
        enigma: { ca: "Rfwsj (shift 5)", es: "Rfwsj (shift 5)" },
        answer: "MASCA", points: 200
      },
      {
        name: { ca: "ACTE VI: FINAL", es: "ACTO VI: FINAL" },
        narrativeTitle: { ca: "L'últim número", es: "El último número" },
        narrativeText: { ca: "Suma tots els actes!", es: "¡Suma todos los actos!" },
        enigma: { ca: "866 + 40 + 150 + 150 + 200 = ?", es: "866 + 40 + 150 + 150 + 200 = ?" },
        answer: "1406", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  15. SELVA PROHIBIDA (Aventura - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "jungle", emoji: "🌿", lives: 3, totalPhases: 6,
    color: "#2ecc71", bg: "radial-gradient(ellipse at 40% 40%,#001500,#000500)",
    font: "'Rajdhani',sans-serif", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 años" },
    title: { ca: "La Selva Prohibida", es: "La Selva Prohibida" },
    desc: { ca: "Supervivència · Tribus · Aventura salvatge", es: "Supervivencia · Tribus · Aventura salvaje" },
    synopsis: { 
      ca: "Una tribu ancestral us ofereix ajuda si supereu 6 proves de saviesa. Us atreviu?", 
      es: "¿Una tribu ancestral os ofrece ayuda si superáis 6 pruebas de sabiduría? ¿Os atrevéis?" 
    },
    phases: [
      {
        name: { ca: "PROVA 1: AIGUA", es: "PRUEBA 1: AGUA" },
        narrativeTitle: { ca: "Gerres de la selva", es: "Vasijas de la selva" },
        narrativeText: { ca: "Mesura exactament 4 litres!", es: "¡Mide exactamente 4 litros!" },
        enigma: { ca: "Amb gerres de 3L i 5L, mesura 4L.", es: "Con vasijas de 3L y 5L, mide 4L." },
        answer: "4", hint: { ca: "Omple 5L, aboca a 3L (queden 2L), buida 3L, passa 2L, omple 5L, aboca 1L a 3L = 4L", es: "Llena 5L, vierte a 3L (quedan 2L), vacía 3L, pasa 2L, llena 5L, vierte 1L a 3L = 4L" }, points: 100
      },
      {
        name: { ca: "PROVA 2: ANIMALS", es: "PRUEBA 2: ANIMALES" },
        narrativeTitle: { ca: "Consell d'ancians", es: "Consejo de ancianos" },
        narrativeText: { ca: "El circuit sagrat dels animals!", es: "¡El circuito sagrado de los animales!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#2ecc71", solution: [0,2,3,4] } },
        enigma: { ca: "(Jaguar 7 × Granota 2) + (Àguila 12 - Mico 5) × Serp 3 = ?", es: "(Jaguar 7 × Rana 2) + (Águila 12 - Mono 5) × Serpiente 3 = ?" },
        answer: "35", hint: { ca: "(7×2) + (7×3) = 14 + 21", es: "(7×2) + (7×3) = 14 + 21" }, points: 150,
        mission: { ca: "La ploma sagrada és a la sala de direcció.", es: "La pluma sagrada está en la sala de dirección." }, missionIcon: "🦅"
      },
      {
        name: { ca: "PROVA 3: MEMÒRIA", es: "PRUEBA 3: MEMORIA" },
        narrativeTitle: { ca: "Ritual de repetició", es: "Ritual de repetición" },
        narrativeText: { ca: "Repeteix els passos del xaman!", es: "¡Repite los pasos del chamán!" },
        minigame: "simon",
        enigma: { ca: "Dansa del xaman: 4 passos.", es: "Danza del chamán: 4 pasos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "PROVA 4: CONSTEL·LACIÓ", es: "PRUEBA 4: CONSTELACIÓN" },
        narrativeTitle: { ca: "Arbre sagrat", es: "Árbol sagrado" },
        narrativeText: { ca: "El creixement de l'arbre!", es: "¡El crecimiento del árbol!" },
        visual: { type: "starPattern", config: { stars: 10, pattern: [0,3,6,9], color: "#2ecc71", title: "ARBRE" } },
        enigma: { ca: "Arbre: 1m inicial, +2m/any, -10% cada 3 anys. Alçada any 10?", es: "Árbol: 1m inicial, +2m/año, -10% cada 3 años. Altura año 10?" },
        answer: "17", hint: { ca: "Aprox 15-17m", es: "Aprox 15-17m" }, points: 150
      },
      {
        name: { ca: "PROVA 5: MAPA", es: "PRUEBA 5: MAPA" },
        narrativeTitle: { ca: "Camí secret", es: "Camino secreto" },
        narrativeText: { ca: "Segueix el mapa fins a l'altar!", es: "¡Sigue el mapa hasta el altar!" },
        visual: { type: "treasureMap", config: { paths: 2, finalX: [40, 60], color: "#2ecc71", seed: 123 } },
        enigma: { ca: "Coordenades X=40, Y=60. Suma:", es: "Coordenadas X=40, Y=60. Suma:" },
        answer: "100", points: 150
      },
      {
        name: { ca: "PROVA 6: SAVIESA", es: "PRUEBA 6: SABIDURÍA" },
        narrativeTitle: { ca: "Cor de la selva", es: "Corazón de la selva" },
        narrativeText: { ca: "Suma tota la saviesa acumulada!", es: "¡Suma toda la sabiduría acumulada!" },
        enigma: { ca: "4 + 35 + 150 + 17 + 100 = ?", es: "4 + 35 + 150 + 17 + 100 = ?" },
        answer: "306", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  16. L'INSTITUT MALEÏT (Terror escolar - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "instituto", emoji: "🏫", lives: 3, totalPhases: 5,
    color: "#e67e22", bg: "radial-gradient(ellipse at 50% 50%,#1f1000,#080400)",
    font: "'Special Elite',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "45 min", es: "45 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 años" },
    title: { ca: "L'Institut Maleït", es: "El Instituto Maldito" },
    desc: { ca: "Terror · Escola · Secrets", es: "Terror · Escuela · Secretos" },
    synopsis: { 
      ca: "Quelcom estrany va passar al vostre institut durant la nit. Les portes estan tancades. 5 proves per escapar.", 
      es: "Algo extraño pasó en vuestro instituto durante la noche. Las puertas están cerradas. 5 pruebas para escapar." 
    },
    phases: [
      {
        name: { ca: "EL DESPERTAR", es: "EL DESPERTAR" },
        narrativeTitle: { ca: "Passadissos foscos", es: "Pasillos oscuros" },
        narrativeText: { ca: "El circuit secret de l'institut!", es: "¡El circuito secreto del instituto!" },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#e67e22", solution: [0,2,5] } },
        enigma: { ca: "Aula Mates + Aula actual (pregunta al professor)", es: "Aula Mates + Aula actual (pregunta al profesor)" },
        answer: "VARIABLE", points: 100
      },
      {
        name: { ca: "LA SALA PROHIBIDA", es: "LA SALA PROHIBIDA" },
        narrativeTitle: { ca: "Despatx del director", es: "Despacho del director" },
        narrativeText: { ca: "El mapa de l'institut!", es: "¡El mapa del instituto!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [60, 40], color: "#e67e22", seed: 2025 } },
        enigma: { ca: "Any fundació + alumnes/10 (pregunta al professor)", es: "Año fundación + alumnos/10 (pregunta al profesor)" },
        answer: "VARIABLE", points: 150
      },
      {
        name: { ca: "MEMÒRIA", es: "MEMORIA" },
        narrativeTitle: { ca: "Campana de l'institut", es: "Campana del instituto" },
        narrativeText: { ca: "Repeteix el toc de campana!", es: "¡Repite el toque de campana!" },
        minigame: "simon",
        enigma: { ca: "Melodia de 4 notes.", es: "Melodía de 4 notas." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "MISSIÓ", es: "MISIÓN" },
        narrativeTitle: { ca: "Secretaria", es: "Secretaría" },
        narrativeText: { ca: "Necessites un document!", es: "¡Necesitas un documento!" },
        answer: "EXPEDIENT",
        mission: { ca: "Ves a secretaria i demana l'expedient de l'institut.", es: "Ve a secretaría y pide el expediente del instituto." }, missionIcon: "📋", points: 100
      },
      {
        name: { ca: "CODI FINAL", es: "CÓDIGO FINAL" },
        narrativeTitle: { ca: "Armari de direcció", es: "Armario de dirección" },
        narrativeText: { ca: "El codi és al sistema de píxels!", es: "¡El código está en el sistema de píxeles!" },
        visual: { type: "pixelSecret", config: { code: "2025", color: "#e67e22", noise: true } },
        enigma: { ca: "Professors × Assignatures (pregunta al professor)", es: "Profesores × Asignaturas (pregunta al profesor)" },
        answer: "VARIABLE", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  17. ATRAPATS A LA SALA DE PROFESSORS (Humor - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "teachers", emoji: "👩‍🏫", lives: 4, totalPhases: 5,
    color: "#1abc9c", bg: "radial-gradient(ellipse at 60% 40%,#001810,#020805)",
    font: "'Rajdhani',sans-serif", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "40 min", es: "40 min" },
    ageLabel: { ca: "Professors", es: "Profesores" },
    title: { ca: "Atrapats al Claustre", es: "Atrapados en el Claustro" },
    desc: { ca: "Humor · Professors · Camaraderia", es: "Humor · Profesores · Camaradería" },
    synopsis: { 
      ca: "Els professors queden atrapats durant el claustre. 5 enigmes sobre educació per sortir.", 
      es: "Los profesores quedan atrapados durante el claustro. 5 enigmas sobre educación para salir." 
    },
    phases: [
      {
        name: { ca: "EL CLAUSTRE", es: "EL CLAUSTRO" },
        narrativeTitle: { ca: "La reunió interminable", es: "La reunión interminable" },
        narrativeText: { ca: "El circuit pedagògic!", es: "¡El circuito pedagógico!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#1abc9c", solution: [0,1,2] } },
        enigma: { ca: "Intel·ligències múltiples de Gardner (1983): Quantes?", es: "Inteligencias múltiples de Gardner (1983): ¿Cuántas?" },
        answer: "7", hint: { ca: "Musical, Corporal, Lògica, Lingüística, Espacial, Interpersonal, Intrapersonal", es: "Musical, Corporal, Lógica, Lingüística, Espacial, Interpersonal, Intrapersonal" }, points: 100
      },
      {
        name: { ca: "ELS EXPEDIENTS", es: "LOS EXPEDIENTES" },
        narrativeTitle: { ca: "Secrets del claustre", es: "Secretos del claustro" },
        narrativeText: { ca: "El mapa del centre educatiu!", es: "¡El mapa del centro educativo!" },
        visual: { type: "treasureMap", config: { paths: 2, finalX: [70, 50], color: "#1abc9c", seed: 88 } },
        enigma: { ca: "Anys del més veterà MENYS anys del més nou.", es: "Años del más veterano MENOS años del más nuevo." },
        answer: "VARIABLE", points: 100
      },
      {
        name: { ca: "MEMÒRIA DOCENT", es: "MEMORIA DOCENT" },
        narrativeTitle: { ca: "Horari escolar", es: "Horario escolar" },
        narrativeText: { ca: "Repeteix l'horari de dilluns!", es: "¡Repite el horario de lunes!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 4 assignatures.", es: "Secuencia de 4 asignaturas." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "MISSIÓ", es: "MISIÓN" },
        narrativeTitle: { ca: "Alumne missatger", es: "Alumno mensajero" },
        narrativeText: { ca: "Necessites ajuda d'un alumne!", es: "¡Necesitas ayuda de un alumno!" },
        answer: "ALUMNE",
        mission: { ca: "Un professor ha d'anar a buscar un alumne al passadís.", es: "Un profesor debe ir a buscar a un alumno en el pasillo." }, missionIcon: "👦", points: 100
      },
      {
        name: { ca: "EXAMEN FINAL", es: "EXAMEN FINAL" },
        narrativeTitle: { ca: "Prova per als professors", es: "Prueba para los profesores" },
        narrativeText: { ca: "L'examen dels professors!", es: "¡El examen de los profesores!" },
        visual: { type: "starPattern", config: { stars: 5, pattern: [0,2,4], color: "#1abc9c", title: "CLAUSTRE" } },
        enigma: { ca: "Examen 20 preguntes de 0.5 pts. Per treure un 5, quantes bé?", es: "Examen 20 preguntas de 0.5 pts. Para sacar un 5, ¿cuántas bien?" },
        answer: "10", hint: { ca: "5 / 0.5 = 10", es: "5 / 0.5 = 10" }, points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  18. LABORATORI QUÀNTIC (Física - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "quantum", emoji: "⚛️", lives: 4, totalPhases: 6,
    color: "#818cf8", bg: "radial-gradient(ellipse at 50% 30%,#0a0020,#000010)",
    font: "'Orbitron',sans-serif", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "70 min", es: "70 min" },
    ageLabel: { ca: "17+ anys", es: "17+ años" },
    title: { ca: "Laboratori Quàntic", es: "Laboratorio Cuántico" },
    desc: { ca: "Física quàntica · Criptografia · IA", es: "Física cuántica · Criptografía · IA" },
    synopsis: { 
      ca: "Un experiment de física quàntica ha fallat. La IA ha entrat en mode quarantena. 60 minuts per 6 paradoxes quàntiques.", 
      es: "Un experimento de física cuántica ha fallado. La IA ha entrado en modo cuarentena. 60 minutos para 6 paradojas cuánticas." 
    },
    phases: [
      {
        name: { ca: "GAT DE SCHRÖDINGER", es: "GATO DE SCHRÖDINGER" },
        narrativeTitle: { ca: "Superposició quàntica", es: "Superposición cuántica" },
        narrativeText: { ca: "El circuit quàntic amb 3 qubits!", es: "¡El circuito cuántico con 3 qubits!" },
        visual: { type: "circuitPuzzle", config: { nodes: 8, color: "#818cf8", solution: [0,1,2,3,4,5,6,7] } },
        enigma: { ca: "2^n on n=3 qubits. Estats simultanis?", es: "2^n donde n=3 qubits. ¿Estados simultáneos?" },
        answer: "8", hint: { ca: "2 al cub = 8", es: "2 al cubo = 8" }, points: 100
      },
      {
        name: { ca: "ENTRELLAÇAMENT", es: "ENTRELAZAMIENTO" },
        narrativeTitle: { ca: "Nombres complexos", es: "Números complejos" },
        narrativeText: { ca: "La constel·lació del pla complex!", es: "¡La constelación del plano complejo!" },
        visual: { type: "starPattern", config: { stars: 8, pattern: [2,5], color: "#818cf8", title: "COMPLEX" } },
        enigma: { ca: "|z| = arrel(3² + 4²) = arrel(25) = ?", es: "|z| = raíz(3² + 4²) = raíz(25) = ?" },
        answer: "5", points: 150
      },
      {
        name: { ca: "SEQÜÈNCIA QUÀNTICA", es: "SECUENCIA CUÁNTICA" },
        narrativeTitle: { ca: "Autenticació quàntica", es: "Autenticación cuántica" },
        narrativeText: { ca: "Repeteix la seqüència de partícules!", es: "¡Repite la secuencia de partículas!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 4 partícules subatòmiques.", es: "Secuencia de 4 partículas subatómicas." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "RSA BÀSIC", es: "RSA BÁSICO" },
        narrativeTitle: { ca: "Criptografia RSA", es: "Criptografía RSA" },
        narrativeText: { ca: "Calcula phi(n) amb p=3, q=7!", es: "¡Calcula phi(n) con p=3, q=7!" },
        visual: { type: "controlPanel", config: { switches: ["p=3","q=7","p-1","q-1","φ(n)"], solution: [0,1,2,3,4], color: "#818cf8", label: "RSA" } },
        enigma: { ca: "phi(n) = (p-1)×(q-1) = 2×6 = ?", es: "phi(n) = (p-1)×(q-1) = 2×6 = ?" },
        answer: "12", points: 200,
        mission: { ca: "Ves al laboratori i pregunta per l'experiment 5B.", es: "Ve al laboratorio y pregunta por el experimento 5B." }, missionIcon: "🔬"
      },
      {
        name: { ca: "XIFRAT QUÀNTIC", es: "CIFRADO CUÁNTICO" },
        narrativeTitle: { ca: " missatge de l'IA", es: "mensaje de la IA" },
        narrativeText: { ca: "Desxifra el missatge amb Cèsar!", es: "¡Descifra el mensaje con César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "LD QXD (shift 3)", es: "LD QXD (shift 3)" },
        answer: "IA QUA", points: 200
      },
      {
        name: { ca: "DECOHERÈNCIA", es: "DECOHERENCIA" },
        narrativeTitle: { ca: "Equació final", es: "Ecuación final" },
        narrativeText: { ca: "Suma totes les constants quàntiques!", es: "¡Suma todas las constantes cuánticas!" },
        enigma: { ca: "8 + 5 + 12 + 12 = ?", es: "8 + 5 + 12 + 12 = ?" },
        answer: "37", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  19. CODI GENÈTIC (Biologia - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "bioterror", emoji: "🧬", lives: 3, totalPhases: 6,
    color: "#4ade80", bg: "radial-gradient(ellipse at 60% 40%,#001a08,#020a02)",
    font: "'Special Elite',cursive", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "65 min", es: "65 min" },
    ageLabel: { ca: "17+ anys", es: "17+ años" },
    title: { ca: "Codi Genètic: Protocol Alpha", es: "Código Genético: Protocolo Alpha" },
    desc: { ca: "Biologia molecular · Genètica · Bioterrorisme", es: "Biología molecular · Genética · Bioterrorismo" },
    synopsis: { 
      ca: "Un virus modificat amenaça la humanitat. Sou l'equip d'investigació d'última línia. 6 sequències per desxifrar.", 
      es: "Un virus modificado amenaza la humanidad. Sois el equipo de investigación de última línea. 6 secuencias para descifrar." 
    },
    phases: [
      {
        name: { ca: "SEQÜÈNCIA ADN", es: "SECUENCIA ADN" },
        narrativeTitle: { ca: "Genoma modificat", es: "Genoma modificado" },
        narrativeText: { ca: "Troba la mutació a l'hèlix!", es: "¡Encuentra la mutación en la hélice!" },
        visual: { type: "dnaHelix", config: { seq1: "ATGCGA", seq2: "ATGCGC", mutPos: 5, color: "#4ade80" } },
        enigma: { ca: "Posició de la mutació A→C", es: "Posición de la mutación A→C" },
        answer: "6", points: 100
      },
      {
        name: { ca: "SÍNTESI PROTEICA", es: "SÍNTESIS PROTEICA" },
        narrativeTitle: { ca: "Transcripció ADN→ARN", es: "Transcripción ADN→ARN" },
        narrativeText: { ca: "Converteix la seqüència!", es: "¡Convierte la secuencia!" },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#4ade80", solution: [0,1,2,3,4,5] } },
        enigma: { ca: "ADN: TACGTA → ARNm? (A→U, T→A, C→G, G→C)", es: "ADN: TACGTA → ARNm? (A→U, T→A, C→G, G→C)" },
        answer: "AUGCAU", points: 150
      },
      {
        name: { ca: "MEMÒRIA BIO", es: "MEMORIA BIO" },
        narrativeTitle: { ca: "Seqüència d'aminoàcids", es: "Secuencia de aminoácidos" },
        narrativeText: { ca: "Repeteix la seqüència de bases!", es: "¡Repite la secuencia de bases!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 bases nitrogenades.", es: "Secuencia de 5 bases nitrogenadas." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "ANTÍDOT", es: "ANTÍDOTO" },
        narrativeTitle: { ca: "Fórmula final", es: "Fórmula final" },
        narrativeText: { ca: "Calcula la concentració!", es: "¡Calcula la concentración!" },
        enigma: { ca: "c = 0.6 / (120 × 0.5) = ?", es: "c = 0.6 / (120 × 0.5) = ?" },
        answer: "0.01", hint: { ca: "0.6 / 60 = 0.01", es: "0.6 / 60 = 0.01" }, points: 200,
        mission: { ca: "Ves al lab de biologia i busca el Protocol Antídot 7.", es: "Ve al lab de biología y busca el Protocolo Antídoto 7." }, missionIcon: "🧪"
      },
      {
        name: { ca: "CODI DE SEGURETAT", es: "CÓDIGO DE SEGURIDAD" },
        narrativeTitle: { ca: "Sistema de contenció", es: "Sistema de contención" },
        narrativeText: { ca: "El codi és al sistema de píxels!", es: "¡El código está en el sistema de píxeles!" },
        visual: { type: "pixelSecret", config: { code: "STOP", color: "#4ade80", noise: true } },
        enigma: { ca: "Para el virus: S-T-O-P", es: "Para el virus: S-T-O-P" },
        answer: "STOP", points: 150
      },
      {
        name: { ca: "ALLIBERAMENT", es: "LIBERACIÓN" },
        narrativeTitle: { ca: "Vacuna final", es: "Vacuna final" },
        narrativeText: { ca: "Suma totes les posicions de les bases!", es: "¡Suma todas las posiciones de las bases!" },
        enigma: { ca: "6 (mutació) + 6 (ARNm longitud) + 0.01×100 = ?", es: "6 (mutación) + 6 (ARNm longitud) + 0.01×100 = ?" },
        answer: "13", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  20. INFILTRACIÓ ZERO-DAY (Hacking - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "hacking", emoji: "💻", lives: 3, totalPhases: 6,
    color: "#34d399", bg: "radial-gradient(ellipse at 40% 60%,#001a0a,#000805)",
    font: "'Orbitron',sans-serif", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "60 min", es: "60 min" },
    ageLabel: { ca: "16+ anys", es: "16+ años" },
    title: { ca: "Infiltració Zero-Day", es: "Infiltración Zero-Day" },
    desc: { ca: "Ciberseguretat · Hacking ètic · Criptografia", es: "Ciberseguridad · Hacking ético · Criptografía" },
    synopsis: { 
      ca: "Sou hackers ètics. Un atac zero-day ha compromès el sistema. 6 proves per trobar la vulnerabilitat i tancar la bretxa.", 
      es: "Sois hackers éticos. Un ataque zero-day ha comprometido el sistema. 6 pruebas para encontrar la vulnerabilidad y cerrar la brecha." 
    },
    phases: [
      {
        name: { ca: "ANÀLISI DE LOGS", es: "ANÁLISIS DE LOGS" },
        narrativeTitle: { ca: "Rastres digitals", es: "Rastros digitales" },
        narrativeText: { ca: "IP sospitosa: C0.A8.01.01 hex!", es: "¡IP sospechosa: C0.A8.01.01 hex!" },
        visual: { type: "circuitPuzzle", config: { nodes: 4, color: "#34d399", solution: [0,1,2,3] } },
        enigma: { ca: "Segon octet A8 hex en decimal: (10×16)+8 = ?", es: "Segundo octeto A8 hex en decimal: (10×16)+8 = ?" },
        answer: "168", hint: { ca: "160+8", es: "160+8" }, points: 100
      },
      {
        name: { ca: "PAYLOAD", es: "PAYLOAD" },
        narrativeTitle: { ca: "Atac desxifrat", es: "Ataque descifrado" },
        narrativeText: { ca: "Hash MD5 als píxels!", es: "¡Hash MD5 en los píxeles!" },
        visual: { type: "pixelSecret", config: { code: "PASS", color: "#34d399", noise: true } },
        enigma: { ca: "Hash MD5 de 'password' (paraula anglesa de 8 lletres)", es: "Hash MD5 de 'password' (palabra inglesa de 8 letras)" },
        answer: "PASSWORD", points: 150
      },
      {
        name: { ca: "FIREWALL", es: "FIREWALL" },
        narrativeTitle: { ca: "Barrera de seguretat", es: "Barrera de seguridad" },
        narrativeText: { ca: "Repeteix el patró de ports!", es: "¡Repite el patrón de puertos!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 ports oberts.", es: "Secuencia de 5 puertos abiertos." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "XIFRAT", es: "CIFRADO" },
        narrativeTitle: { ca: "Missatge xifrat", es: "Mensaje cifrado" },
        narrativeText: { ca: "Desxifra amb la roda Cèsar!", es: "¡Descifra con la rueda César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "FRPSXWDGR (shift 3)", es: "FRPSXWDGR (shift 3)" },
        answer: "COMPUTADO", points: 200
      },
      {
        name: { ca: "SEMVER", es: "SEMVER" },
        narrativeTitle: { ca: "Control de versions", es: "Control de versiones" },
        narrativeText: { ca: "Actualitza el patch!", es: "¡Actualiza el patch!" },
        visual: { type: "controlPanel", config: { switches: ["MAJOR","MINOR","PATCH","2","14","3"], solution: [2,5], color: "#34d399", label: "VERSIÓ" } },
        enigma: { ca: "Versió 2.14.3. PATCH +1 = ?", es: "Versión 2.14.3. PATCH +1 = ?" },
        answer: "2.14.4", points: 150,
        mission: { ca: "Cerca el hash MD5 a internet per confirmar.", es: "Busca el hash MD5 en internet para confirmar." }, missionIcon: "🔓"
      },
      {
        name: { ca: "PATCHEO FINAL", es: "PARCHEO FINAL" },
        narrativeTitle: { ca: "Tancar la bretxa", es: "Cerrar la brecha" },
        narrativeText: { ca: "Suma tots els nivells de seguretat!", es: "¡Suma todos los niveles de seguridad!" },
        enigma: { ca: "168 + 150 + 150 + 200 + 150 = ?", es: "168 + 150 + 150 + 200 + 150 = ?" },
        answer: "818", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  21. L'ORACLE DE DELFOS (Filosofia - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "philosophy", emoji: "🏛️", lives: 3, totalPhases: 6,
    color: "#fbbf24", bg: "radial-gradient(ellipse at 30% 40%,#1a1400,#060500)",
    font: "'Cinzel Decorative',cursive", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "60 min", es: "60 min" },
    ageLabel: { ca: "16+ anys", es: "16+ años" },
    title: { ca: "L'Oracle de Delfos", es: "El Oráculo de Delfos" },
    desc: { ca: "Filosofia · Lògica · Grècia clàssica", es: "Filosofía · Lógica · Grecia clásica" },
    synopsis: { 
      ca: "Heu viatjat a l'antiga Grècia. L'Oracle planteja 3 dilemes filosòfics que posen a prova el vostre pensament crític.", 
      es: "Habéis viajado a la antigua Grecia. El Oráculo plantea 3 dilemas filosóficos que ponen a prueba vuestro pensamiento crítico." 
    },
    phases: [
      {
        name: { ca: "DILEMA 1", es: "DILEMA 1" },
        narrativeTitle: { ca: "La paradoxa del mentider", es: "La paradoja del mentiroso" },
        narrativeText: { ca: "La constel·lació dels filòsofs!", es: "¡La constelación de los filósofos!" },
        visual: { type: "starPattern", config: { stars: 5, pattern: [0,2,4], color: "#fbbf24", title: "FILOSOFS" } },
        enigma: { ca: "Qui va formalitzar la lògica deductiva? (Aristòtil, Plató o Sòcrates)", es: "¿Quién formalizó la lógica deductiva? (Aristóteles, Platón o Sócrates)" },
        answer: "ARISTOTIL", points: 100
      },
      {
        name: { ca: "DILEMA 2", es: "DILEMA 2" },
        narrativeTitle: { ca: "La cova de Plató", es: "La caverna de Platón" },
        narrativeText: { ca: "El mapa de l'Acadèmia!", es: "¡El mapa de la Academia!" },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [80, 20], color: "#fbbf24", seed: 360 } },
        enigma: { ca: "En quina obra i llibre (número romà) apareix l'al·legoria de la cova?", es: "¿En qué obra y libro (número romano) aparece la alegoría de la caverna?" },
        answer: "REPUBLICA VII", points: 150,
        mission: { ca: "Busca 'La República' a la biblioteca.", es: "Busca 'La República' en la biblioteca." }, missionIcon: "📚"
      },
      {
        name: { ca: "MEMÒRIA", es: "MEMORIA" },
        narrativeTitle: { ca: "Màximes de Delfos", es: "Máximas de Delfos" },
        narrativeText: { ca: "Repeteix les màximes!", es: "¡Repite las máximas!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 3 màximes.", es: "Secuencia de 3 máximas." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "DILEMA 3", es: "DILEMA 3" },
        narrativeTitle: { ca: "Epicurus i el sofriment", es: "Epicuro y el sufrimiento" },
        narrativeText: { ca: "El panell de les màximes!", es: "¡El panel de las máximas!" },
        visual: { type: "controlPanel", config: { switches: ["Coneix-te","Res excessiu","Paraula donada"], solution: [0,1,2], color: "#fbbf24", label: "MAXIMES" } },
        enigma: { ca: "Màximes (3) × Deus olímpics (12) = ?", es: "Máximas (3) × Dioses olímpicos (12) = ?" },
        answer: "36", points: 200
      },
      {
        name: { ca: "XIFRAT", es: "CIFRADO" },
        narrativeTitle: { ca: "Missatge de l'oracle", es: "Mensaje del oráculo" },
        narrativeText: { ca: "Desxifra amb Cèsar!", es: "¡Descifra con César!" },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "VWDWXV (shift 3)", es: "VWDWXV (shift 3)" },
        answer: "STATUS", points: 200
      },
      {
        name: { ca: "SAVIESA FINAL", es: "SABIDURÍA FINAL" },
        narrativeTitle: { ca: "La resposta última", es: "La respuesta última" },
        narrativeText: { ca: "Suma tot el coneixement!", es: "¡Suma todo el conocimiento!" },
        enigma: { ca: "100 + 150 + 150 + 200 + 200 = ?", es: "100 + 150 + 150 + 200 + 200 = ?" },
        answer: "800", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  22. AL LÍMIT DEL FORAT NEGRE (Astrofísica - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "blackhole", emoji: "🌌", lives: 3, totalPhases: 6,
    color: "#c084fc", bg: "radial-gradient(ellipse at 50% 50%,#0d0020,#000005)",
    font: "'Orbitron',sans-serif", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "70 min", es: "70 min" },
    ageLabel: { ca: "17+ anys", es: "17+ años" },
    title: { ca: "Horitzó d'Esdeveniments", es: "Horizonte de Eventos" },
    desc: { ca: "Astrofísica · Relativitat · Forats negres", es: "Astrofísica · Relatividad · Agujeros negros" },
    synopsis: { 
      ca: "La vostra nau està atrapada a l'horitzó d'esdeveniments. 6 equacions d'astrofísica per escapar de la singularitat.", 
      es: "Vuestra nave está atrapada en el horizonte de eventos. 6 ecuaciones de astrofísica para escapar de la singularidad." 
    },
    phases: [
      {
        name: { ca: "DILATACIÓ TEMPORAL", es: "DILATACIÓN TEMPORAL" },
        narrativeTitle: { ca: "El temps s'alenteix", es: "El tiempo se ralentiza" },
        narrativeText: { ca: "El factor de Lorentz!", es: "¡El factor de Lorentz!" },
        visual: { type: "starPattern", config: { stars: 8, pattern: [0,4], color: "#c084fc", title: "LORENTZ" } },
        enigma: { ca: "gamma = 1 / arrel(1-0.6²) = 1/0.8 = ?", es: "gamma = 1 / raíz(1-0.6²) = 1/0.8 = ?" },
        answer: "1.25", points: 100
      },
      {
        name: { ca: "RADI SCHWARZSCHILD", es: "RADIO SCHWARZSCHILD" },
        narrativeTitle: { ca: "Punt de no retorn", es: "Punto de no retorno" },
        narrativeText: { ca: "El circuit de la singularitat!", es: "¡El circuito de la singularidad!" },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#c084fc", solution: [0,2,4] } },
        enigma: { ca: "Primer dígit de 2×6.67×2 en notació científica", es: "Primer dígito de 2×6.67×2 en notación científica" },
        answer: "2", hint: { ca: "26.68 = 2.668e1", es: "26.68 = 2.668e1" }, points: 150
      },
      {
        name: { ca: "MEMÒRIA ESPACIAL", es: "MEMORIA ESPACIAL" },
        narrativeTitle: { ca: "Seqüència gravitatòria", es: "Secuencia gravitatoria" },
        narrativeText: { ca: "Repeteix el patró d'ones gravitacionals!", es: "¡Repite el patrón de ondas gravitacionales!" },
        minigame: "simon",
        enigma: { ca: "Seqüència de 5 deteccions d'ones.", es: "Secuencia de 5 detecciones de ondas." },
        answer: "SIMON", points: 150,
        mission: { ca: "Ves a buscar el professor de Física i pregunta per l'equació d'Hawking.", es: "Ve a buscar al profesor de Física y pregunta por la ecuación de Hawking." }, missionIcon: "🌠"
      },
      {
        name: { ca: "PROPULSOR", es: "PROPULSOR" },
        narrativeTitle: { ca: "Velocitat de fuga", es: "Velocidad de fuga" },
        narrativeText: { ca: "Càlcul de la velocitat!", es: "¡Cálculo de la velocidad!" },
        enigma: { ca: "300000000 / 340 = ? (arrodonit)", es: "300000000 / 340 = ? (redondeado)" },
        answer: "882353", points: 200
      },
      {
        name: { ca: "CONSTEL·LACIÓ", es: "CONSTELACIÓN" },
        narrativeTitle: { ca: "Ruta d'escapatòria", es: "Ruta de escape" },
        narrativeText: { ca: "El mapa estel·lar!", es: "¡El mapa estelar!" },
        visual: { type: "treasureMap", config: { paths: 2, finalX: [50, 50], color: "#c084fc", seed: 314 } },
        enigma: { ca: "Radi del forat negre × pi (3.14) = ?", es: "Radio del agujero negro × pi (3.14) = ?" },
        answer: "314", points: 150
      },
      {
        name: { ca: "SALVATGE FINAL", es: "SALVATJE FINAL" },
        narrativeTitle: { ca: "Energia de zero-punt", es: "Energía de punto-cero" },
        narrativeText: { ca: "Suma totes les constants!", es: "¡Suma todas las constantes!" },
        enigma: { ca: "1.25 + 2 + 150 + 882353 + 314 = ?", es: "1.25 + 2 + 150 + 882353 + 314 = ?" },
        answer: "882820", hint: { ca: "Arrodonit a enter", es: "Redondeado a entero" }, points: 300, isFinal: true
      }
    ]
  }
,

  // ═══════════════════════════════════════════════════════════════
  //  NOVA 1: OPERACIÓ XARXA (Cultura Digital - 6 fases IMMERSIVES)
  //  Minijocs: roomExplorer, socialMedia, influencerQuiz, lockPuzzle,
  //            memoryCards, cipherDial
  // ═══════════════════════════════════════════════════════════════
  {
    id: "digital_ops", emoji: "📱", lives: 3, totalPhases: 6,
    color: "#00f5ff", bg: "radial-gradient(ellipse at 40% 30%,#001a20,#000508)",
    font: "'Orbitron',monospace", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-16 anys", es: "12-16 años" },
    title: { ca: "Operació Xarxa", es: "Operación Red" },
    desc: { ca: "Hack · Xarxes Socials · Cultura Digital", es: "Hack · Redes Sociales · Cultura Digital" },
    synopsis: {
      ca: "Ets un agent especial infiltrat a la xarxa d'un grup de desinformació. Hauràs de trobar proves, desxifrar missatges i superar proves de cultura digital per aturar-los.",
      es: "Eres un agente especial infiltrado en la red de un grupo de desinformación. Deberás encontrar pruebas, descifrar mensajes y superar pruebas de cultura digital para detenerlos."
    },
    phases: [
      {
        name: { ca: "FASE 1: SALA DE CONTROL", es: "FASE 1: SALA DE CONTROL" },
        narrativeTitle: { ca: "La sala dels secrets", es: "La sala de los secretos" },
        narrativeText: {
          ca: "Has accedit a la sala de control dels hackers. Hi ha objectes per tot arreu. Has d'explorar cada racó per trobar pistes que revelin la seva identitat.",
          es: "Has accedido a la sala de control de los hackers. Hay objetos por todas partes. Debes explorar cada rincón para encontrar pistas que revelen su identidad."
        },
        minigame: "roomExplorer",
        roomObjects: [
          { id: "laptop", x: 45, y: 50, e: "💻", l: "Portàtil", cl: "Pantalla oberta: 'Codi d'accés: X'" },
          { id: "phone", x: 20, y: 65, e: "📱", l: "Mòbil", cl: "WhatsApp: 'Operació llançada a les 3h'" },
          { id: "papers", x: 70, y: 40, e: "📄", l: "Papers", cl: "Esquema d'operació: FAKEINFO" },
          { id: "usb", x: 55, y: 25, e: "🔌", l: "USB", cl: "Etiqueta: 'PROVA_FINAL'" },
          { id: "coffee", x: 15, y: 30, e: "☕", l: "Cafè", cl: "Tassa de la universitat de... BARCELONA!" }
        ],
        roomBg: "linear-gradient(180deg,#001a20 0%,#000d12 60%,#001015 100%)",
        enigma: {
          ca: "Has explorat la sala. Quin codi d'accés apareix al portàtil? (La lletra que falta al missatge)",
          es: "Has explorado la sala. ¿Qué código de acceso aparece en el portátil? (La letra que falta en el mensaje)"
        },
        answer: "X", hint: { ca: "Mira bé la pantalla del portàtil", es: "Mira bien la pantalla del portátil" }, points: 100
      },
      {
        name: { ca: "FASE 2: FAKE NEWS", es: "FASE 2: FAKE NEWS" },
        narrativeTitle: { ca: "La xarxa de mentides", es: "La red de mentiras" },
        narrativeText: {
          ca: "El grup publica fake news a les xarxes per manipular l'opinió pública. Has de detectar quina d'aquestes publicacions és falsa per poder bloquejar-la.",
          es: "El grupo publica fake news en las redes para manipular la opinión pública. Debes detectar cuál de estas publicaciones es falsa para poder bloquearla."
        },
        minigame: "socialMedia",
        post: {
          av: "🤖", user: "@InfoTrends24", handle: "infotrends24 • 3min",
          content: "🚨 URGENT: WhatsApp deixarà de ser GRATIS a partir del 2025 i costarà 0,89€/mes. El CEO Mark Zuckerberg ho ha confirmat! Compartiu abans que l'esborrin! #WhatsApp #Viral",
          opts: ["És veritat! 😱", "És FAKE NEWS ✗", "Pot ser cert 🤔", "No ho sé 🤷"],
          correct: 1,
          expl: "Bulo clàssic! WhatsApp ha estat sempre gratuït des que Meta el va comprar. Mai s'ha anunciat cap subscripció. Comprova les fonts oficials!"
        },
        enigma: {
          ca: "Analitza el post. És veritat o fake news? Tria l'opció correcta per bloquejar la desinformació.",
          es: "Analiza el post. ¿Es verdad o fake news? Elige la opción correcta para bloquear la desinformación."
        },
        answer: "1", hint: { ca: "WhatsApp és gratis des de 2016. Desconfia dels missatges 'compartiu ara!'", es: "WhatsApp es gratis desde 2016. Desconfía de los mensajes 'compartid ahora!'" }, points: 120
      },
      {
        name: { ca: "FASE 3: QUIZ INFLUENCER", es: "FASE 3: QUIZ INFLUENCER" },
        narrativeTitle: { ca: "El test de cultura digital", es: "El test de cultura digital" },
        narrativeText: {
          ca: "Per desbloquejar el servidor, has de demostrar que coneixes la cultura digital. Respon correctament per continuar.",
          es: "Para desbloquear el servidor, debes demostrar que conoces la cultura digital. Responde correctamente para continuar."
        },
        minigame: "influencerQuiz",
        question: { ca: "Qui és el creador de YouTube?", es: "¿Quién es el creador de YouTube?" },
        options: ["Mark Zuckerberg", "Larry Page", "Chad Hurley, Steve Chen i Jawed Karim", "Jack Dorsey"],
        correctIdx: 2,
        explanation: { ca: "YouTube va ser fundat el 2005 per tres ex-empleats de PayPal: Chad Hurley, Steve Chen i Jawed Karim.", es: "YouTube fue fundado en 2005 por tres ex-empleados de PayPal: Chad Hurley, Steve Chen y Jawed Karim." },
        enigma: {
          ca: "Selecciona la resposta correcta per desbloquejar el servidor.",
          es: "Selecciona la respuesta correcta para desbloquear el servidor."
        },
        answer: "2", hint: { ca: "Van ser tres persones, no una", es: "Fueron tres personas, no una" }, points: 130
      },
      {
        name: { ca: "FASE 4: PANY DIGITAL", es: "FASE 4: CERRADURA DIGITAL" },
        narrativeTitle: { ca: "El codi del servidor", es: "El código del servidor" },
        narrativeText: {
          ca: "Has trobat el servidor principal. Està protegit per un pany de 4 dígits. Recorda: el codi és l'any en que va néixer Instagram.",
          es: "Has encontrado el servidor principal. Está protegido por una cerradura de 4 dígitos. Recuerda: el código es el año en que nació Instagram."
        },
        minigame: "lockPuzzle",
        enigma: {
          ca: "Instagram es va llançar l'any 2010. Gira els dials fins arribar al codi correcte i obre el pany.",
          es: "Instagram se lanzó en el año 2010. Gira los diales hasta llegar al código correcto y abre el candado."
        },
        answer: "2010", hint: { ca: "2-0-1-0. L'any en que Kevin Systrom va llançar Instagram", es: "2-0-1-0. El año en que Kevin Systrom lanzó Instagram" }, points: 150
      },
      {
        name: { ca: "FASE 5: MEMÒRIA VIRAL", es: "FASE 5: MEMORIA VIRAL" },
        narrativeTitle: { ca: "Les icones del net", es: "Los iconos de la red" },
        narrativeText: {
          ca: "Per confirmar la teva identitat a la xarxa, has de superar el test de memòria visual. Troba totes les parelles d'icones digitals.",
          es: "Para confirmar tu identidad en la red, debes superar el test de memoria visual. Encuentra todos los pares de iconos digitales."
        },
        minigame: "memoryCards",
        pairs: ["📱", "💻", "🎮", "📸", "🎵", "🌐"],
        enigma: {
          ca: "Recorda on és cada icona i troba les parelles per demostrar que ets humà.",
          es: "Recuerda dónde está cada icono y encuentra los pares para demostrar que eres humano."
        },
        answer: "MEMORY", hint: { ca: "Comença per les cantonades, és més fàcil recordar-les", es: "Empieza por las esquinas, es más fácil recordarlas" }, points: 150
      },
      {
        name: { ca: "FASE 6: MISSATGE XIFRAT", es: "FASE 6: MENSAJE CIFRADO" },
        narrativeTitle: { ca: "L'ordre final", es: "La orden final" },
        narrativeText: {
          ca: "Has arribat al missatge final dels hackers. Està xifrat amb el codi César. Desplaça les lletres per desxifrar-lo i atura l'operació!",
          es: "Has llegado al mensaje final de los hackers. Está cifrado con el código César. Desplaza las letras para descifrarlo y ¡detén la operación!"
        },
        minigame: "cipherDial",
        encoded: "SDUD",
        shift: 3,
        enigma: {
          ca: "El missatge xifrat és SDUD. Amb desplaçament de -3 (codi César), quin és el missatge real? Ajusta el dial fins desxifrar-lo.",
          es: "El mensaje cifrado es SDUD. Con desplazamiento de -3 (código César), ¿cuál es el mensaje real? Ajusta el dial hasta descifrarlo."
        },
        answer: "PARA", hint: { ca: "S-3=P, D-3=A, U-3=R, D-3=A", es: "S-3=P, D-3=A, U-3=R, D-3=A" }, points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  NOVA 2: MISIÓ ENIGMA (Aventura Espionatge - 6 fases IMMERSIVES)
  //  Minijocs: mapNavigator, chessMove, wordSearch, simon,
  //            puzzleSlider, influencerQuiz
  // ═══════════════════════════════════════════════════════════════
  {
    id: "spy_mission", emoji: "🕵️", lives: 3, totalPhases: 6,
    color: "#a855f7", bg: "radial-gradient(ellipse at 60% 40%,#0d0020,#050010)",
    font: "'Orbitron',monospace", level: "dificil",
    diff: { ca: "Difícil", es: "Difícil" },
    dur: { ca: "55 min", es: "55 min" },
    ageLabel: { ca: "14-18 anys", es: "14-18 años" },
    title: { ca: "Missió: Enigma", es: "Misión: Enigma" },
    desc: { ca: "Espionatge · Enigmes · Alta dificultat", es: "Espionaje · Enigmas · Alta dificultad" },
    synopsis: {
      ca: "Ets l'agent Enigma-7. El teu objectiu: infiltrar-te al centre de la Xarxa Ombra, recuperar els arxius secrets i escapar abans que l'alarma s'activi.",
      es: "Eres el agente Enigma-7. Tu objetivo: infiltrarte en el centro de la Red Sombra, recuperar los archivos secretos y escapar antes de que la alarma se active."
    },
    phases: [
      {
        name: { ca: "FASE 1: SEGUIMENT", es: "FASE 1: SEGUIMIENTO" },
        narrativeTitle: { ca: "La ruta de l'agent", es: "La ruta del agente" },
        narrativeText: {
          ca: "El teu informador t'ha deixat un mapa amb marques. Has de localitzar el punt de trobada secret navegant entre les trampes de la Xarxa Ombra.",
          es: "Tu informador te ha dejado un mapa con marcas. Debes localizar el punto de encuentro secreto navegando entre las trampas de la Red Sombra."
        },
        minigame: "mapNavigator",
        mapLocations: [
          { id: "A", x: 15, y: 75, e: "🏢", n: "Oficina", ok: false },
          { id: "B", x: 45, y: 25, e: "🌉", n: "Pont", ok: false },
          { id: "C", x: 78, y: 55, e: "🔮", n: "Punt Secret", ok: true },
          { id: "D", x: 30, y: 55, e: "☕", n: "Cafè", ok: false },
          { id: "E", x: 65, y: 20, e: "🚇", n: "Metro", ok: false }
        ],
        mapPaths: [["A","D"],["D","B"],["B","E"],["E","C"]],
        enigma: {
          ca: "Navega pel mapa i localitza el punt de trobada secret. Atenció: els llocs falsos activen l'alarma!",
          es: "Navega por el mapa y localiza el punto de encuentro secreto. ¡Atención: los lugares falsos activan la alarma!"
        },
        answer: "C", hint: { ca: "El punt secret té un símbol màgic 🔮", es: "El punto secreto tiene un símbolo mágico 🔮" }, points: 100
      },
      {
        name: { ca: "FASE 2: AJEDREZ TÀCTIC", es: "FASE 2: AJEDREZ TÁCTICO" },
        narrativeTitle: { ca: "El Joc del Mestre", es: "El Juego del Maestro" },
        narrativeText: {
          ca: "El cap de la Xarxa Ombra és un gran jugador d'escacs. T'ha deixat un trencaclosques tàctic: has de trobar el moviment guanyador per demostrar que ets digne d'accedir als arxius.",
          es: "El jefe de la Red Sombra es un gran jugador de ajedrez. Te ha dejado un puzzle táctico: debes encontrar el movimiento ganador para demostrar que eres digno de acceder a los archivos."
        },
        minigame: "chessMove",
        board: {
          pieces: { "e1": "♔", "d8": "♚", "f6": "♞", "h7": "♜", "a1": "♖" },
          hl: ["g8", "h8", "e8", "d7"],
          q: { ca: "El cavall (♞) és a f6. Quina casella li fa escac al rei negre (♚ d8)?", es: "El caballo (♞) está en f6. ¿Qué casilla le da jaque al rey negro (♚ d8)?" },
          ans: "e8"
        },
        enigma: {
          ca: "Toca les caselles ressaltades per trobar el moviment de cavall que fa escac al rei.",
          es: "Toca las casillas resaltadas para encontrar el movimiento de caballo que da jaque al rey."
        },
        answer: "E8", hint: { ca: "El cavall salta en forma de L. Des de f6, pot anar a e8", es: "El caballo salta en forma de L. Desde f6, puede ir a e8" }, points: 150
      },
      {
        name: { ca: "FASE 3: SOPA DE CODIS", es: "FASE 3: SOPA DE CÓDIGOS" },
        narrativeTitle: { ca: "Els arxius secrets", es: "Los archivos secretos" },
        narrativeText: {
          ca: "Has trobat una pantalla amb una sopa de lletres. Les paraules clau amagades revelaràn l'accés als arxius secrets.",
          es: "Has encontrado una pantalla con una sopa de letras. Las palabras clave ocultas revelarán el acceso a los archivos secretos."
        },
        minigame: "wordSearch",
        words: ["SPY", "CODE", "HACK"],
        gridSize: 7,
        enigma: {
          ca: "Troba les 3 paraules amagades: SPY, CODE i HACK. Selecciona les lletres i verifica.",
          es: "Encuentra las 3 palabras ocultas: SPY, CODE y HACK. Selecciona las letras y verifica."
        },
        answer: "SPYCODEHACK", hint: { ca: "Busca de dalt a baix, d'esquerra a dreta i en diagonal", es: "Busca de arriba abajo, de izquierda a derecha y en diagonal" }, points: 150
      },
      {
        name: { ca: "FASE 4: SEQÜÈNCIA D'ACTIVACIÓ", es: "FASE 4: SECUENCIA DE ACTIVACIÓN" },
        narrativeTitle: { ca: "El protocol de seguretat", es: "El protocolo de seguridad" },
        narrativeText: {
          ca: "Per accedir a la cambra dels servidors, has de repetir la seqüència d'activació exacta del sistema de seguretat. Equivoca't i l'alarma sonarà.",
          es: "Para acceder a la cámara de servidores, debes repetir la secuencia de activación exacta del sistema de seguridad. Equivócate y la alarma sonará."
        },
        minigame: "simon",
        simonLevel: 5,
        enigma: {
          ca: "Repeteix la seqüència de colors del sistema. Arriba al nivell 5 per desbloquejar l'accés.",
          es: "Repite la secuencia de colores del sistema. Llega al nivel 5 para desbloquear el acceso."
        },
        answer: "SIMON", hint: { ca: "Concentra't en el primer color de cada seqüència nova", es: "Concéntrate en el primer color de cada nueva secuencia" }, points: 150
      },
      {
        name: { ca: "FASE 5: PUZZLE D'ESCAPADA", es: "FASE 5: PUZZLE DE ESCAPE" },
        narrativeTitle: { ca: "La porta secreta", es: "La puerta secreta" },
        narrativeText: {
          ca: "Has localitzat els arxius! Però la porta de sortida té un mecanisme de peces. Ordena el trencaclosques per obrir la porta i escapar.",
          es: "¡Has localizado los archivos! Pero la puerta de salida tiene un mecanismo de piezas. Ordena el puzzle para abrir la puerta y escapar."
        },
        minigame: "puzzleSlider",
        puzzleSize: 3,
        puzzleEmojis: ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","🔓"],
        enigma: {
          ca: "Mou les peces fins que estiguin en ordre del 1 al 8 per desvelar el candau obert 🔓.",
          es: "Mueve las piezas hasta que estén en orden del 1 al 8 para revelar el candado abierto 🔓."
        },
        answer: "PUZZLE", hint: { ca: "Mou primer les peces de la cantonada superior esquerra cap al centre", es: "Mueve primero las piezas de la esquina superior izquierda hacia el centro" }, points: 150
      },
      {
        name: { ca: "FASE 6: DEBRIEFING FINAL", es: "FASE 6: DEBRIEFING FINAL" },
        narrativeTitle: { ca: "L'informe secret", es: "El informe secreto" },
        narrativeText: {
          ca: "Missió gairebé completada! Per certificar el teu accés i enviar l'informe a la central, has de demostrar que coneixes qui controla la informació al món digital.",
          es: "¡Misión casi completada! Para certificar tu acceso y enviar el informe a la central, debes demostrar que conoces quién controla la información en el mundo digital."
        },
        minigame: "influencerQuiz",
        question: { ca: "Quina empresa és propietària d'Instagram, WhatsApp i Facebook?", es: "¿Qué empresa es propietaria de Instagram, WhatsApp y Facebook?" },
        options: ["Google", "Apple", "Meta (abans Facebook, Inc.)", "Microsoft"],
        correctIdx: 2,
        explanation: { ca: "Meta Platforms, Inc. (anteriorment Facebook, Inc.) és propietària de Facebook, Instagram i WhatsApp.", es: "Meta Platforms, Inc. (anteriormente Facebook, Inc.) es propietaria de Facebook, Instagram y WhatsApp." },
        enigma: {
          ca: "Última prova: selecciona la resposta correcta per enviar l'informe i completar la missió.",
          es: "Última prueba: selecciona la respuesta correcta para enviar el informe y completar la misión."
        },
        answer: "2", hint: { ca: "Mark Zuckerberg és el CEO d'aquesta empresa", es: "Mark Zuckerberg es el CEO de esta empresa" }, points: 250, isFinal: true
      }
    ]
  }

];

// Exportació compatible amb navegadors i Node.js
if (typeof module !== "undefined" && module.exports) { 
  module.exports = { STORIES }; 
}
if (typeof window !== "undefined") { 
  window.STORIES = STORIES; 
}
