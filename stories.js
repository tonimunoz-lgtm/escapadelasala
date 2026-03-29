/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — STORIES v3.0 (EXPERIENCIA ESPECTACULAR)
 *  5-7 fases por historia, minijuegos interactivos, variedad total
 * ═══════════════════════════════════════════════════════════════
 */

const STORIES = [
  // ═══════════════════════════════════════════════════════════════
  //  HISTORIA 1: LA NAVE ESPACIAL (Sci-fi épico - 7 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "space_epic", emoji: "🚀", lives: 4, totalPhases: 7,
    color: "#00f5ff", bg: "radial-gradient(ellipse at 30% 50%,#001a3a,#000010)",
    font: "'Orbitron',sans-serif", level: "dificil",
    diff: { ca: "Dificil", es: "Dificil" },
    dur: { ca: "60 min", es: "60 min" },
    ageLabel: { ca: "15+ anys", es: "15+ anos" },
    title: { ca: "Aurora-7: El Último Viaje", es: "Aurora-7: El Último Viaje" },
    desc: { ca: "Sci-fi · Sabotaje · Supervivencia extrema", es: "Sci-fi · Sabotaje · Supervivencia extrema" },
    synopsis: { 
      ca: "La tripulación de la Aurora-7 despierta de la hibernación prematuramente. Los sistemas fallan. Un saboteador oculto ha iniciado el autodestrucción. 60 minutos para salvar la nave y descubrir al traidor.", 
      es: "La tripulación de la Aurora-7 despierta de la hibernación prematuramente. Los sistemas fallan. Un saboteador oculto ha iniciado la autodestrucción. 60 minutos para salvar la nave y descubrir al traidor." 
    },
    phases: [
      {
        name: { ca: "DESPERTAR BRUSCO", es: "DESPERTAR BRUSCO" },
        narrativeTitle: { ca: "Emergencia en el puente", es: "Emergencia en el puente" },
        narrativeText: { 
          ca: "Las luces de emergencia parpadean rojo. El ordenador central anuncia: 'Autodestrucción iniciada: 60 minutos'. La puerta del puente está bloqueada por un código de acceso. El capitán dejó una pista visual...", 
          es: "Las luces de emergencia parpadean rojo. El ordenador central anuncia: 'Autodestrucción iniciada: 60 minutos'. La puerta del puente está bloqueada por un código de acceso. El capitán dejó una pista visual..." 
        },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#00f5ff", solution: [0,2,4,5] } },
        enigma: { ca: "Sigue el circuito activo (nodos brillantes) para encontrar el código: suma los nodos conectados.", es: "Sigue el circuito activo (nodos brillantes) para encontrar el código: suma los nodos conectados." },
        hint: { ca: "Los nodos brillantes son: 0→2→4→5. Suma: 0+2+4+5=?", es: "Los nodos brillantes son: 0→2→4→5. Suma: 0+2+4+5=?" },
        answer: "11", points: 100
      },
      {
        name: { ca: "OXÍGENO CRÍTICO", es: "OXÍGENO CRÍTICO" },
        narrativeTitle: { ca: "Sala de máquinas", es: "Sala de máquinas" },
        narrativeText: { 
          ca: "El oxígeno baja al 40%. Para reparar los filtros, necesitas recalibrar el sistema. El patrón de estrellas en la pantalla muestra la secuencia correcta de ajustes.", 
          es: "El oxígeno baja al 40%. Para reparar los filtros, necesitas recalibrar el sistema. El patrón de estrellas en la pantalla muestra la secuencia correcta de ajustes." 
        },
        minigame: "sequence",
        sequence: [2,0,3,1],
        enigma: { ca: "Repite la secuencia de símbolos que aparece en la pantalla para estabilizar el oxígeno.", es: "Repite la secuencia de símbolos que aparece en la pantalla para estabilizar el oxígeno." },
        hint: { ca: "Memoriza el orden: 💧 → ⚡ → 🌿 → 🔥", es: "Memoriza el orden: 💧 → ⚡ → 🌿 → 🔥" },
        answer: "OXIGEN", points: 150
      },
      {
        name: { ca: "EL CÓDIGO CESAR", es: "EL CÓDIGO CÉSAR" },
        narrativeTitle: { ca: "Archivos del capitán", es: "Archivos del capitán" },
        narrativeText: { 
          ca: "Encuentras un mensaje cifrado en el diario del capitán: 'R QH FHQWUDO KDV VDELGRDGR OD QDYH'. Usa la rueda de cifrado César con desplazamiento +3.", 
          es: "Encuentras un mensaje cifrado en el diario del capitán: 'R QH FHQWUDO KDV VDELGRDGR OD QDYH'. Usa la rueda de cifrado César con desplazamiento +3." 
        },
        minigame: "cipher",
        shift: 3,
        visual: { type: "cipherWheel", config: { shift: 3, highlightLetter: "R", color: "#00f5ff" } },
        enigma: { ca: "Descifra las 3 palabras clave usando la rueda. La respuesta es la palabra en posición 2 del mensaje.", es: "Descifra las 3 palabras clave usando la rueda. La respuesta es la palabra en posición 2 del mensaje." },
        hint: { ca: "R→O, Q→N, H→E... La segunda palabra es: CENTRAL", es: "R→O, Q→N, H→E... La segunda palabra es: CENTRAL" },
        answer: "CENTRAL", points: 150
      },
      {
        name: { ca: "EL TRAIDOR", es: "EL TRAIDOR" },
        narrativeTitle: { ca: "Interrogatorio", es: "Interrogatorio" },
        narrativeText: { 
          ca: "Tres sospechosos: A (ingeniero), B (médico), C (piloto). A dice: 'B es el traidor'. B dice: 'C está mintiendo'. C dice: 'A dice la verdad'. Solo uno miente.", 
          es: "Tres sospechosos: A (ingeniero), B (médico), C (piloto). A dice: 'B es el traidor'. B dice: 'C está mintiendo'. C dice: 'A dice la verdad'. Solo uno miente." 
        },
        enigma: { ca: "Si solo uno miente, ¿quién es el traidor? (Responde A, B o C)", es: "Si solo uno miente, ¿quién es el traidor? (Responde A, B o C)" },
        hint: { ca: "Si C dice la verdad, entonces A dice la verdad... pero entonces B miente. Prueba: si B miente, ¿es C el traidor?", es: "Si C dice la verdad, entonces A dice la verdad... pero entonces B miente. Prueba: si B miente, ¿es C el traidor?" },
        answer: "B", points: 200,
        mission: { ca: "Un miembro debe encontrar en la biblioteca un libro con el símbolo de la nave.", es: "Un miembro debe encontrar en la biblioteca un libro con el símbolo de la nave." }, missionIcon: "📚"
      },
      {
        name: { ca: "SIMON DICE", es: "SIMON DICE" },
        narrativeTitle: { ca: "Protocolo de emergencia", es: "Protocolo de emergencia" },
        narrativeText: { 
          ca: "El ordenador central requiere autenticación biométrica. Debes repetir el patrón de luces exacto para desbloquear el sistema de navegación.", 
          es: "El ordenador central requiere autenticación biométrica. Debes repetir el patrón de luces exacto para desbloquear el sistema de navegación." 
        },
        minigame: "simon",
        enigma: { ca: "Memoriza y repite la secuencia de colores. Si fallas, pierdes 1 vida.", es: "Memoriza y repite la secuencia de colores. Si fallas, pierdes 1 vida." },
        hint: { ca: "La secuencia es: Rojo → Verde → Azul → Amarillo → Verde", es: "La secuencia es: Rojo → Verde → Azul → Amarillo → Verde" },
        answer: "SIMON", points: 200
      },
      {
        name: { ca: "COORDENADAS", es: "COORDENADAS" },
        narrativeTitle: { ca: "Navegación estelar", es: "Navegación estelar" },
        narrativeText: { 
          ca: "El mapa estelar muestra la ruta de escape. La X marca el agujero de gusano más cercano. Necesitas calcular las coordenadas basándote en la constelación.", 
          es: "El mapa estelar muestra la ruta de escape. La X marca el agujero de gusano más cercano. Necesitas calcular las coordenadas basándote en la constelación." 
        },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [75, 45], color: "#00f5ff", seed: 42 } },
        enigma: { ca: "Coordenada X: 45 + (12x3). Coordenada Y: 30 + (5x3). Suma ambas.", es: "Coordenada X: 45 + (12x3). Coordenada Y: 30 + (5x3). Suma ambas." },
        hint: { ca: "X=45+36=81, Y=30+15=45. Suma: 81+45", es: "X=45+36=81, Y=30+15=45. Suma: 81+45" },
        answer: "126", points: 150
      },
      {
        name: { ca: "DESACTIVACIÓN", es: "DESACTIVACIÓN" },
        narrativeTitle: { ca: "El botón rojo", es: "El botón rojo" },
        narrativeText: { 
          ca: "Finalmente llegas al núcleo. El panel de control requiere el código final basado en todos los datos anteriores: Suma de todas las respuestas correctas previas.", 
          es: "Finalmente llegas al núcleo. El panel de control requiere el código final basado en todos los datos anteriores: Suma de todas las respuestas correctas previas." 
        },
        visual: { type: "controlPanel", config: { switches: ["11","CENTRAL","B","SIMON","126"], solution: [0,1,2,3,4], color: "#00f5ff", label: "PANEL FINAL" } },
        enigma: { ca: "Suma: 11 + 150 + 200 + 200 + 150 + 126 = ? (Solo los valores numéricos de respuestas anteriores)", es: "Suma: 11 + 150 + 200 + 200 + 150 + 126 = ? (Solo los valores numéricos de respuestas anteriores)" },
        hint: { ca: "11+150+200+200+150+126 = 837", es: "11+150+200+200+150+126 = 837" },
        answer: "837", points: 300, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  HISTORIA 2: EL CASTILLO MALDITO (Terror/Fantasía - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "castle_horror", emoji: "🏰", lives: 3, totalPhases: 6,
    color: "#8e44ad", bg: "radial-gradient(ellipse at 30% 70%,#150020,#050005)",
    font: "'Cinzel Decorative',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-15 anys", es: "12-15 anos" },
    title: { ca: "El Castillo de los Susurros", es: "El Castillo de los Susurros" },
    desc: { ca: "Terror · Misterio · Enigmas medievales", es: "Terror · Misterio · Enigmas medievales" },
    synopsis: { 
      ca: "El Castillo de Vladimiro ha estado abandonado durante siglos. Esta noche, las antorchas se encienden solas. Un espíritu ancestral desafía a los intrusos a resolver sus enigmas o quedar atrapados para siempre.", 
      es: "El Castillo de Vladimiro ha estado abandonado durante siglos. Esta noche, las antorchas se encienden solas. Un espíritu ancestral desafía a los intrusos a resolver sus enigmas o quedar atrapados para siempre." 
    },
    phases: [
      {
        name: { ca: "LA PUERTA LEVADIZA", es: "LA PUERTA LEVADIZA" },
        narrativeTitle: { ca: "Entrada al inframundo", es: "Entrada al inframundo" },
        narrativeText: { ca: "Una puerta masiva bloquea el paso. El mecanismo de engranajes requiere un código. El mapa del castillo muestra la combinación.", es: "Una puerta masiva bloquea el paso. El mecanismo de engranajes requiere un código. El mapa del castillo muestra la combinación." },
        visual: { type: "treasureMap", config: { paths: 4, finalX: [60, 40], color: "#8e44ad", seed: 666 } },
        enigma: { ca: "Año del castillo (1243) - Siglo actual (13) x 10 = ?", es: "Año del castillo (1243) - Siglo actual (13) x 10 = ?" },
        hint: { ca: "1243 - 130 = 1113", es: "1243 - 130 = 1113" },
        answer: "1113", points: 100
      },
      {
        name: { ca: "LA BIBLIOTECA MALDITA", es: "LA BIBLIOTECA MALDITA" },
        narrativeTitle: { ca: "Libros que sangran", es: "Libros que sangran" },
        narrativeText: { ca: "Los libros vuelan por la habitación. Para calmarnos, debes ordenar los grimorios por fecha de escritura. El patrón de estrellas indica el orden.", es: "Los libros vuelan por la habitación. Para calmarnos, debes ordenar los grimorios por fecha de escritura. El patrón de estrellas indica el orden." },
        minigame: "sequence",
        sequence: [3,1,0,2],
        enigma: { ca: "Ordena: Antiguo (negro), Medieval (púrpura), Renacentista (dorado), Moderno (blanco)", es: "Ordena: Antiguo (negro), Medieval (púrpura), Renacentista (dorado), Moderno (blanco)" },
        answer: "SEQUENCE", points: 150
      },
      {
        name: { ca: "EL ESPEJO MÁGICO", es: "EL ESPEJO MÁGICO" },
        narrativeTitle: { ca: "Reflejo del pasado", es: "Reflejo del pasado" },
        narrativeText: { ca: "El espejo muestra visiones del pasado. Para avanzar, debes tocar los símbolos en el orden correcto antes de que se rompa.", es: "El espejo muestra visiones del pasado. Para avanzar, debes tocar los símbolos en el orden correcto antes de que se rompa." },
        minigame: "simon",
        enigma: { ca: "Repite la secuencia de 4 colores que parpadean en el espejo.", es: "Repite la secuencia de 4 colores que parpadean en el espejo." },
        answer: "ESPEJO", points: 150
      },
      {
        name: { ca: "EL CÓDIGO DEL VAMPIRO", es: "EL CÓDIGO DEL VAMPIRO" },
        narrativeTitle: { ca: "Cripta real", es: "Cripta real" },
        narrativeText: { ca: "El ataúd del conde tiene un candado de combinación. La inscripción dice: 'Soy más viejo que el tiempo, nací ayer, no tengo voz pero cuento historias'.", es: "El ataúd del conde tiene un candado de combinación. La inscripción dice: 'Soy más viejo que el tiempo, nací ayer, no tengo voz pero cuento historias'." },
        visual: { type: "pixelSecret", config: { code: "LIBRO", color: "#8e44ad", noise: true } },
        enigma: { ca: "¿Qué soy? La respuesta está oculta en los píxeles del sarcófago.", es: "¿Qué soy? La respuesta está oculta en los píxeles del sarcófago." },
        hint: { ca: "La respuesta es LIBRO", es: "La respuesta es LIBRO" },
        answer: "LIBRO", points: 150,
        mission: { ca: "Encuentra en la biblioteca un libro con la inicial 'V' y mira la página 13.", es: "Encuentra en la biblioteca un libro con la inicial 'V' y mira la página 13." }, missionIcon: "📖"
      },
      {
        name: { ca: "LA ALQUIMIA", es: "LA ALQUIMIA" },
        narrativeTitle: { ca: "Laboratorio del mago", es: "Laboratorio del mago" },
        narrativeText: { ca: "Tres ingredientes deben mezclarse en el orden correcto: Polvo de estrella (A), Sangre de dragón (B), Esencia de luna (C). El diagrama de circuitos muestra la receta.", es: "Tres ingredientes deben mezclarse en el orden correcto: Polvo de estrella (A), Sangre de dragón (B), Esencia de luna (C). El diagrama de circuitos muestra la receta." },
        visual: { type: "circuitPuzzle", config: { nodes: 5, color: "#8e44ad", solution: [2,0,4] } },
        enigma: { ca: "Siguiendo el circuito rojo: ¿En qué orden se conectan los nodos 2, 0 y 4? (Responde: ABC, ACB, BAC, BCA, CAB o CBA)", es: "Siguiendo el circuito rojo: ¿En qué orden se conectan los nodos 2, 0 y 4? (Responde: ABC, ACB, BAC, BCA, CAB o CBA)" },
        hint: { ca: "El camino rojo va: Nodo 2 → Nodo 0 → Nodo 4. Orden: B (2), A (0), C (4)", es: "El camino rojo va: Nodo 2 → Nodo 0 → Nodo 4. Orden: B (2), A (0), C (4)" },
        answer: "BAC", points: 200
      },
      {
        name: { ca: "EL EXORCISMO FINAL", es: "EL EXORCISMO FINAL" },
        narrativeTitle: { ca: "Cámara del trono", es: "Cámara del trono" },
        narrativeText: { ca: "El fantasma de Vladimiro aparece. Para liberarlo, debes usar el cifrado ROT13 en su nombre maldito: 'ICTYNFZB'.", es: "El fantasma de Vladimiro aparece. Para liberarlo, debes usar el cifrado ROT13 en su nombre maldito: 'ICTYNFZB'." },
        minigame: "cipher",
        shift: 13,
        visual: { type: "cipherWheel", config: { shift: 13, highlightLetter: "I", color: "#8e44ad" } },
        enigma: { ca: "Descifra usando ROT13: I→V, C→P, T→G...", es: "Descifra usando ROT13: I→V, C→P, T→G..." },
        hint: { ca: "Vladimiro en ROT13: I C T Y N F Z M B → V P G L A S M O Z", es: "Vladimiro en ROT13: I C T Y N F Z M B → V P G L A S M O Z" },
        answer: "VLADIMIRO", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  HISTORIA 3: PIRATAS DEL CARIBE (Aventura - 5 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "pirates_adv", emoji: "🏴‍☠️", lives: 3, totalPhases: 5,
    color: "#f39c12", bg: "radial-gradient(ellipse at 50% 30%,#1f1000,#060400)",
    font: "'Pirata One',cursive", level: "junior",
    diff: { ca: "Junior-Avançat", es: "Junior-Avanzado" },
    dur: { ca: "45 min", es: "45 min" },
    ageLabel: { ca: "11-14 anys", es: "11-14 anos" },
    title: { ca: "L'Illa del Crani de Foc", es: "La Isla del Cráneo de Fuego" },
    desc: { ca: "Aventura · Tresor · Mapa", es: "Aventura · Tesoro · Mapa" },
    synopsis: { 
      ca: "Barbanegra va amagar el seu tresor més valuós a l'Illa del Crani. El mapa està dividit en tres parts entre els seus fidels. Reuneix les peces!", 
      es: "Barbanegra escondió su tesoro más valioso en la Isla del Cráneo. El mapa está dividido en tres partes entre sus fieles. ¡Reúne las piezas!" 
    },
    phases: [
      {
        name: { ca: "LA TAVERNA", es: "LA TABERNA" },
        narrativeTitle: { ca: "Primera peça del mapa", es: "Primera pieza del mapa" },
        narrativeText: { ca: "El primer marinero te da su pieza si ganas su juego de dados. Debes memorizar la secuencia de símbolos que saca.", es: "El primer marinero te da su pieza si ganas su juego de dados. Debes memorizar la secuencia de símbolos que saca." },
        minigame: "sequence",
        sequence: [1,3,0,2],
        enigma: { ca: "Repite la secuencia de monedas: Oro → Plata → Bronce → Diamante", es: "Repite la secuencia de monedas: Oro → Plata → Bronce → Diamante" },
        answer: "SEQUENCE", points: 100
      },
      {
        name: { ca: "EL MAPA TRENCAT", es: "EL MAPA ROTO" },
        narrativeTitle: { ca: "Ruta pel mar Caribe", es: "Ruta por el mar Caribe" },
        narrativeText: { ca: "Con las tres piezas juntas, el mapa muestra el camino. Sigue la ruta punteada hasta la X.", es: "Con las tres piezas juntas, el mapa muestra el camino. Sigue la ruta punteada hasta la X." },
        visual: { type: "treasureMap", config: { paths: 3, finalX: [70, 65], color: "#f39c12", seed: 1717 } },
        enigma: { ca: "Barbanegra tenia 17 anys quan va començar. Va viure 40 anys més. Suma el dia i el mes del seu naixement (17/11).", es: "Barbanegra tenía 17 años cuando empezó. Vivió 40 años más. Suma el día y el mes de su nacimiento (17/11)." },
        hint: { ca: "17+40=57. 17+11=28. Total: 57+28", es: "17+40=57. 17+11=28. Total: 57+28" },
        answer: "85", points: 150
      },
      {
        name: { ca: "LA CUEVA DEL CRANI", es: "LA CUEVA DEL CRÁNEO" },
        narrativeTitle: { ca: "Entrada secreta", es: "Entrada secreta" },
        narrativeText: { ca: "La cueva tiene un panel de piedra con símbolos. Debes repetir el patrón de luces que parpadean para abrirla.", es: "La cueva tiene un panel de piedra con símbolos. Debes repetir el patrón de luces que parpadean para abrirla." },
        minigame: "simon",
        enigma: { ca: "Memoriza el patrón de 5 colores del panel mágico.", es: "Memoriza el patrón de 5 colores del panel mágico." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "EL COFRE MALDIT", es: "EL COFRE MALDITO" },
        narrativeTitle: { ca: "Cerradura mecánica", es: "Cerradura mecánica" },
        narrativeText: { ca: "El cofre tiene un código de 4 dígitos basado en la edad de Barbanegra cuando murió y el número de barcos que hundió (8).", es: "El cofre tiene un código de 4 dígitos basado en la edad de Barbanegra cuando murió y el número de barcos que hundió (8)." },
        visual: { type: "pixelSecret", config: { code: "578", color: "#f39c12", noise: false } },
        enigma: { ca: "Edad: 57. Barcos: 8. Suma: 57+8 = ? (El código está en píxeles dorados)", es: "Edad: 57. Barcos: 8. Suma: 57+8 = ? (El código está en píxeles dorados)" },
        answer: "65", points: 200,
        mission: { ca: "Busca a la biblioteca un libro con el símbolo de la calavera.", es: "Busca en la biblioteca un libro con el símbolo de la calavera." }, missionIcon: "☠️"
      },
      {
        name: { ca: "EL BOTI FINAL", es: "EL BOTÍN FINAL" },
        narrativeTitle: { ca: "Tesoro de Barbanegra", es: "Tesoro de Barbanegra" },
        narrativeText: { ca: "El cofre se abre pero tiene una trampa final. Usa el cifrado César con desplazamiento 3 en 'QRPH' para desactivarla.", es: "El cofre se abre pero tiene una trampa final. Usa el cifrado César con desplazamiento 3 en 'QRPH' para desactivarla." },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "QRPH → cada letra retrocede 3 en el alfabeto.", es: "QRPH → cada letra retrocede 3 en el alfabeto." },
        hint: { ca: "Q→N, R→O, P→M, H→E", es: "Q→N, R→O, P→M, H→E" },
        answer: "NOME", points: 200, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  HISTORIA 4: ESCUELA DE MAGIA (Harry Potter style - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "magic_school", emoji: "🧙", lives: 4, totalPhases: 6,
    color: "#a855f7", bg: "radial-gradient(ellipse at 50% 40%,#1a0030,#070010)",
    font: "'Cinzel Decorative',cursive", level: "medio",
    diff: { ca: "Mitja", es: "Medio" },
    dur: { ca: "50 min", es: "50 min" },
    ageLabel: { ca: "12-16 anys", es: "12-16 anos" },
    title: { ca: "L'Escola Arcana", es: "La Escuela Arcana" },
    desc: { ca: "Magia · Pocions · Misteri", es: "Magia · Pociones · Misterio" },
    synopsis: { 
      ca: "Ets aprenent a l'Escola Arcana. El Gran Mag ha desaparegut i l'escola està en perill. Has de superar 6 proves màgiques per trobar-lo.", 
      es: "Eres aprendiz en la Escuela Arcana. El Gran Mago ha desaparecido y la escuela está en peligro. Debes superar 6 pruebas mágicas para encontrarlo." 
    },
    phases: [
      {
        name: { ca: "LA PORTA PARLANTE", es: "LA PUERTA HABLANTE" },
        narrativeTitle: { ca: "Accés a l'escola", es: "Acceso a la escuela" },
        narrativeText: { ca: "La puerta pregunta: 'Tengo agujas pero no coso, tengo números pero no cuento. ¿Qué soy?'", es: "La puerta pregunta: 'Tengo agujas pero no coso, tengo números pero no cuento. ¿Qué soy?'" },
        enigma: { ca: "Responde en catalán o castellano (singular).", es: "Responde en catalán o castellano (singular)." },
        answer: "rellotge", points: 100
      },
      {
        name: { ca: "EL LABERINT DE PÒCIONS", es: "EL LABERINTO DE POCIONES" },
        narrativeTitle: { ca: "Aula de Alquimia", es: "Aula de Alquimia" },
        narrativeText: { ca: "Debes seguir la receta exacta. Memoriza la secuencia de ingredientes.", es: "Debes seguir la receta exacta. Memoriza la secuencia de ingredientes." },
        minigame: "sequence",
        sequence: [2,0,3,1],
        enigma: { ca: "Orden: Escam de dragó → Pols d'estrella → Sang de unicorn → Essència de lluna", es: "Orden: Escama de dragón → Polvo de estrella → Sangre de unicornio → Esencia de luna" },
        answer: "SEQUENCE", points: 100
      },
      {
        name: { ca: "EL MIRALL DE L'ENVEJA", es: "EL ESPEJO DE LA ENVIDIA" },
        narrativeTitle: { ca: "Refleig perillós", es: "Reflejo peligroso" },
        narrativeText: { ca: "El espejo muestra tu deseo más profundo. Para pasar, repite el patrón de luz mágica.", es: "El espejo muestra tu deseo más profundo. Para pasar, repite el patrón de luz mágica." },
        minigame: "simon",
        enigma: { ca: "4 colores mágicos en secuencia.", es: "4 colores mágicos en secuencia." },
        answer: "SIMON", points: 150
      },
      {
        name: { ca: "LA XARXA FÒBICA", es: "LA TRAMPA ARÁCNIDA" },
        narrativeTitle: { ca: "Cobert de teranyines", es: "Cubierto de telarañas" },
        narrativeText: { ca: "Una araña mágica bloquea el paso. Sigue el circuito de seda para encontrar su salida.", es: "Una araña mágica bloquea el paso. Sigue el circuito de seda para encontrar su salida." },
        visual: { type: "circuitPuzzle", config: { nodes: 6, color: "#a855f7", solution: [0,2,4,5] } },
        enigma: { ca: "Suma los nodos del camino de seda púrpura.", es: "Suma los nodos del camino de seda púrpura." },
        hint: { ca: "0+2+4+5 = 11", es: "0+2+4+5 = 11" },
        answer: "11", points: 150
      },
      {
        name: { ca: "EL CODI DELS 4 ELEMENTS", es: "EL CÓDIGO DE LOS 4 ELEMENTS" },
        narrativeTitle: { ca: "Cámara elemental", es: "Cámara elemental" },
        narrativeText: { ca: "Fuego, Agua, Tierra, Aire. Cada uno tiene un valor. El mapa estelar muestra el orden.", es: "Fuego, Agua, Tierra, Aire. Cada uno tiene un valor. El mapa estelar muestra el orden." },
        visual: { type: "starPattern", config: { stars: 4, pattern: [0,3,1,2], color: "#a855f7", title: "ELEMENTS" } },
        enigma: { ca: "Fuego=9, Aire=1, Agua=4, Tierra=16. Orden estelar: Fuego→Aire→Agua→Tierra.", es: "Fuego=9, Aire=1, Agua=4, Tierra=16. Orden estelar: Fuego→Aire→Agua→Tierra." },
        hint: { ca: "Concatena: 9-1-4-16", es: "Concatena: 9-1-4-16" },
        answer: "91416", points: 200,
        mission: { ca: "Busca el grimorio en la biblioteca, sección Magia Antigua.", es: "Busca el grimorio en la biblioteca, sección Magia Antigua." }, missionIcon: "📚"
      },
      {
        name: { ca: "EL GRAN MAG", es: "EL GRAN MAGO" },
        narrativeTitle: { ca: "Revelació final", es: "Revelación final" },
        narrativeText: { ca: "El Gran Mag está atrapado en un hechizo. Usa ROT13 para liberarlo del nombre cifrado: 'XNETZ'", es: "El Gran Mago está atrapado en un hechizo. Usa ROT13 para liberarlo del nombre cifrado: 'XNETZ'" },
        minigame: "cipher",
        shift: 13,
        enigma: { ca: "XNETZ con ROT13. X→K, N→A...", es: "XNETZ con ROT13. X→K, N→A..." },
        hint: { ca: "K-A-T-E-M → KATEM", es: "K-A-T-E-M → KATEM" },
        answer: "KATEM", points: 250, isFinal: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  //  HISTORIA 5: AGENCIA SECRETA (Spy thriller - 6 fases)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "spy_agency", emoji: "🕵️", lives: 3, totalPhases: 6,
    color: "#e8c84a", bg: "radial-gradient(ellipse at 70% 30%,#1a1a00,#050500)",
    font: "'Orbitron',sans-serif", level: "expert",
    diff: { ca: "Expert", es: "Experto" },
    dur: { ca: "65 min", es: "65 min" },
    ageLabel: { ca: "16+ anys", es: "16+ anos" },
    title: { ca: "Operació: Fènix Negre", es: "Operación: Fénix Negro" },
    desc: { ca: "Espionatge · Acció · Suspense", es: "Espionaje · Acción · Suspense" },
    synopsis: { 
      ca: "Ets agent secret. Un virus anomenat 'Fènix Negre' amenaça amb esborrar totes les dades del món. Infiltra't al servidor principal i atura'l.", 
      es: "Eres agente secreto. Un virus llamado 'Fénix Negro' amenaza con borrar todos los datos del mundo. Infíltrate en el servidor principal y detenlo." 
    },
    phases: [
      {
        name: { ca: "ACCES ENGANYÓS", es: "ACCESO ENCUBIERTO" },
        narrativeTitle: { ca: "Recepció de l'edifici", es: "Recepción del edificio" },
        narrativeText: { ca: "Para entrar, debes hackear el panel de seguridad. Memoriza la secuencia de acceso.", es: "Para entrar, debes hackear el panel de seguridad. Memoriza la secuencia de acceso." },
        minigame: "sequence",
        sequence: [1,0,2,3],
        enigma: { ca: "Secuencia de acceso: Tarjeta → Huella → Retina → Voz.", es: "Secuencia de acceso: Tarjeta → Huella → Retina → Voz." },
        answer: "SEQUENCE", points: 100
      },
      {
        name: { ca: "FIREWALL DE NIVELL 1", es: "FIREWALL NIVEL 1" },
        narrativeTitle: { ca: "Primera barrera digital", es: "Primera barrera digital" },
        narrativeText: { ca: "El firewall usa un cifrado César básico. Descifra 'PDV' con desplazamiento -3.", es: "El firewall usa un cifrado César básico. Descifra 'PDV' con desplazamiento -3." },
        minigame: "cipher",
        shift: 3,
        enigma: { ca: "P→M, D→A, V→S", es: "P→M, D→A, V→S" },
        answer: "MAS", points: 150
      },
      {
        name: { ca: "LABERINT DIGITAL", es: "LABERINTO DIGITAL" },
        narrativeTitle: { ca: "Xarxa neuronal", es: "Red neuronal" },
        narrativeText: { ca: "Debes navegar por el circuito neuronal para encontrar el nodo central.", es: "Debes navegar por el circuito neuronal para encontrar el nodo central." },
        visual: { type: "circuitPuzzle", config: { nodes: 8, color: "#e8c84a", solution: [0,3,6,7] } },
        enigma: { ca: "Suma los nodos del camino dorado: 0→3→6→7", es: "Suma los nodos del camino dorado: 0→3→6→7" },
        answer: "16", points: 150
      },
      {
        name: { ca: "ENIGMA DEL PASSADOR", es: "ACERTIJO DEL GUARDA" },
        narrativeTitle: { ca: "Seguretat física", es: "Seguridad física" },
        narrativeText: { ca: "Un guardia bloquea el paso. Responde su acertijo: 'Soy más ligero que el aire pero incluso el hombre más fuerte no puede sostenerme mucho tiempo. ¿Qué soy?'", es: "Un guardia bloquea el paso. Responde su acertijo: 'Soy más ligero que el aire pero incluso el hombre más fuerte no puede sostenerme mucho tiempo. ¿Qué soy?'" },
        enigma: { ca: "Una palabra.", es: "Una palabra." },
        answer: "alé", points: 150,
        mission: { ca: "Encuentra al 'conserje' (profesor) y dile 'EL AGUILA HA ATERRADO'.", es: "Encuentra al 'conserje' (profesor) y dile 'EL AGUILA HA ATERRIZADO'." }, missionIcon: "🔌"
      },
      {
        name: { ca: "FIREWALL DE NIVELL 5", es: "FIREWALL NIVEL 5" },
        narrativeTitle: { ca: "Criptografia avançada", es: "Criptografía avanzada" },
        narrativeText: { ca: "El virus usa ROT13 avanzado. Descifra 'W BF PNRFNE'", es: "El virus usa ROT13 avanzado. Descifra 'W BF PNRFNE'" },
        minigame: "cipher",
        shift: 13,
        enigma: { ca: "W→J, B→O, F→S, P→C, N→A, R→E, F→S, N→A", es: "W→J, B→O, F→S, P→C, N→A, R→E, F→S, N→A" },
        answer: "JO CAESAR", points: 200
      },
      {
        name: { ca: "NUCLI DEL VIRUS", es: "NÚCLEO DEL VIRUS" },
        narrativeTitle: { ca: "Desactivació final", es: "Desactivación final" },
        narrativeText: { ca: "Para destruir el virus, debes repetir el patrón de acceso maestro. ¡Cuidado! Si fallas, el sistema se autodestruye.", es: "Para destruir el virus, debes repetir el patrón de acceso maestro. ¡Cuidado! Si fallas, el sistema se autodestruye." },
        minigame: "simon",
        enigma: { ca: "Patrón maestro de 6 colores. Concentración máxima.", es: "Patrón maestro de 6 colores. Concentración máxima." },
        answer: "SIMON", points: 300, isFinal: true
      }
    ]
  }
];

// Exportación compatible
if (typeof module !== "undefined" && module.exports) { module.exports = { STORIES }; }
if (typeof window !== "undefined") { window.STORIES = STORIES; }
