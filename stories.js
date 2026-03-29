/**
 * ═══════════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — REPOSITORI CENTRAL D'HISTÒRIES
 *  stories.js  v2.0
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Per afegir una nova història, simplement copia un bloc de la llista
 *  STORIES i edita els camps. El joc la detectarà automàticament.
 *
 *  CAMPS OBLIGATORIS PER HISTÒRIA:
 *  ─────────────────────────────────
 *  id         → string únic sense espais (ex: 'space', 'my_story')
 *  emoji      → emoji representatiu
 *  color      → color hex principal (accent de la UI)
 *  bg         → background CSS per al projector
 *  font       → font CSS per als títols
 *  level      → 'junior' | 'medio' | 'dificil' | 'expert'
 *               junior   = 10-12 anys  ⭐
 *               medio    = 12-15 anys  ⭐⭐
 *               dificil  = 15+ anys    ⭐⭐⭐
 *               expert   = batxillerat ⭐⭐⭐⭐
 *  diff       → { ca: string, es: string }  text visible dificultat
 *  dur        → { ca: string, es: string }  durada estimada
 *  ageLabel   → { ca: string, es: string }  rang d'edat
 *  title      → { ca: string, es: string }
 *  desc       → { ca: string, es: string }
 *  synopsis   → { ca: string, es: string }
 *  phases     → array de FASE (mínim 2, recomanat 3)
 *
 *  CAMPS DE CADA FASE:
 *  ─────────────────────────────────
 *  name            → { ca, es }
 *  narrativeTitle  → { ca, es }
 *  narrativeText   → { ca, es }
 *  enigma          → { ca, es }
 *  answer          → string (resposta correcta, insensible a majúscules)
 *                    Posa 'VARIABLE' si la resposta depèn del centre
 *  hint            → { ca, es }
 *  points          → número de punts si correcte
 *  mission         → { ca, es }  (opcional, missió fora de classe)
 *  missionIcon     → emoji (opcional)
 *  isFinal         → true  (només a l'última fase)
 * ═══════════════════════════════════════════════════════════════════
 */

const STORIES = [

  // ─────────────────────────────────────────────────────────────────
  //  BLOC 1 · JÚNIOR  (10-12 anys)  ⭐
  // ─────────────────────────────────────────────────────────────────

  {
    id:'dragons', emoji:'🐉',
    color:'#ff4500', bg:'radial-gradient(ellipse at 40% 60%,#2a0800,#080000)',
    font:"'Cinzel Decorative',cursive",
    level:'junior',
    diff:{ca:'⭐ Júnior',es:'⭐ Júnior'},
    dur:{ca:'30 min',es:'30 min'},
    ageLabel:{ca:'10-12 anys',es:'10-12 años'},
    title:{ca:'El Regne dels Dracs',es:'El Reino de los Dragones'},
    desc:{ca:'Fantasia · Dracs · Aventura',es:'Fantasía · Dragones · Aventura'},
    synopsis:{ca:"El drac guardià del tresor del regne ha desaparegut! Sense ell, els enemics atacaran el castell. Heu d'endinsar-vos a la seva cova, resoldre els seus acudits i trobar-lo abans de l'alba.",es:"¡El dragón guardián del tesoro del reino ha desaparecido! Sin él, los enemigos atacarán el castillo. Debéis entrar en su cueva, resolver sus acertijos y encontrarlo antes del alba."},
    phases:[
      {name:{ca:'LA COVA',es:'LA CUEVA'},
       narrativeTitle:{ca:'Entrada de la cova del drac',es:'Entrada a la cueva del dragón'},
       narrativeText:{ca:"La cova és fosca i calenta. A la paret hi ha dibuixos d'un drac petit. Al costat dels dibuixos hi ha escrits números: 🐉+🐉+🐉=15. Si un drac val 5, quin número substitueix ⭐ a: 🐉+⭐=9?",es:"La cueva es oscura y cálida. En la pared hay dibujos de un dragón pequeño. Junto a los dibujos hay números escritos: 🐉+🐉+🐉=15. Si un dragón vale 5, ¿qué número sustituye a ⭐ en: 🐉+⭐=9?"},
       enigma:{ca:"Si 🐉=5, llavors 🐉+⭐=9. Quin és el valor de ⭐?",es:"Si 🐉=5, entonces 🐉+⭐=9. ¿Cuál es el valor de ⭐?"},
       answer:'4',hint:{ca:'5+?=9',es:'5+?=9'},points:100},
      {name:{ca:'EL LABERINT',es:'EL LABERINTO'},
       narrativeTitle:{ca:'El laberint de foc',es:'El laberinto de fuego'},
       narrativeText:{ca:"Al centre de la cova hi ha un laberint de pedra. Per travessar-lo sense cremar-se cal saber el codi secret del drac. Un pergamí diu: 'El meu número preferit és el que obtens si comptes les potes de 3 dracs i les ales de 2 dracs (cada drac té 4 potes i 2 ales).'",es:"En el centro de la cueva hay un laberinto de piedra. Para cruzarlo sin quemarse hay que saber el código secreto del dragón. Un pergamino dice: 'Mi número favorito es el que obtienes si cuentas las patas de 3 dragones y las alas de 2 dragones (cada dragón tiene 4 patas y 2 alas).'"},
       enigma:{ca:"Potes de 3 dracs + ales de 2 dracs = ?",es:"Patas de 3 dragones + alas de 2 dragones = ?"},
       answer:'16',hint:{ca:'(3×4)+(2×2)=12+4=16',es:'(3×4)+(2×2)=12+4=16'},points:150,
       mission:{ca:"Un membre de l'equip ha d'anar a la biblioteca i buscar un llibre de dragons o fantasia. A la pàgina 16 hi ha amagada una nota del professor.",es:"Un miembro del equipo debe ir a la biblioteca y buscar un libro de dragones o fantasía. En la página 16 hay escondida una nota del profesor."},missionIcon:'📖'},
      {name:{ca:'EL DRAC',es:'EL DRAGÓN'},
       narrativeTitle:{ca:'El drac adormit',es:'El dragón dormido'},
       narrativeText:{ca:"Heu trobat el drac! Està adormit i somnia amb endevinalles. Per despertar-lo sense que s'enfadi, heu de respondre la seva endevinalla preferida.",es:"¡Habéis encontrado el dragón! Está dormido y sueña con acertijos. Para despertarlo sin que se enfade, debéis responder su acertijo favorito."},
       enigma:{ca:"Tinc escames però no sóc un peix. Tinc ales però no sóc un ocell. Respiro foc però no sóc una estufa. Qui sóc?",es:"Tengo escamas pero no soy un pez. Tengo alas pero no soy un pájaro. Respiro fuego pero no soy una estufa. ¿Quién soy?"},
       answer:'drac',hint:{ca:"Guarda el tresor del regne...",es:"Guarda el tesoro del reino..."},points:200,isFinal:true}
    ]
  },

  {
    id:'pirates_jr', emoji:'⚓',
    color:'#f0a500', bg:'radial-gradient(ellipse at 50% 30%,#1a0e00,#060300)',
    font:"'Pirata One',cursive",
    level:'junior',
    diff:{ca:'⭐ Júnior',es:'⭐ Júnior'},
    dur:{ca:'25 min',es:'25 min'},
    ageLabel:{ca:'10-12 anys',es:'10-12 años'},
    title:{ca:'El Tresor del Capità Perot',es:'El Tesoro del Capitán Perot'},
    desc:{ca:'Pirates · Tresor · Aventura divertida',es:'Piratas · Tesoro · Aventura divertida'},
    synopsis:{ca:"El Capità Perot era el pirata més entremaliat del Mediterrani. Abans de morir va amagar el seu tresor i va deixar tres endevinalles perquè els nens més llests del món el trobessin. Sou vosaltres!",es:"El Capitán Perot era el pirata más travieso del Mediterráneo. Antes de morir escondió su tesoro y dejó tres acertijos para que los niños más listos del mundo lo encontrasen. ¡Sois vosotros!"},
    phases:[
      {name:{ca:'MAPA 1',es:'MAPA 1'},
       narrativeTitle:{ca:'La primera creu',es:'La primera cruz'},
       narrativeText:{ca:"La vella xata del Capità Perot us entrega un mapa amb tres X. La primera pista diu: 'El tresor és amagat en el lloc que té tants graons com dies té la setmana multiplicats per 4.'",es:"La vieja pata de palo del Capitán Perot os entrega un mapa con tres X. La primera pista dice: 'El tesoro está escondido en el lugar que tiene tantos peldaños como días tiene la semana multiplicados por 4.'"},
       enigma:{ca:"Quants graons té el lloc on és el tresor? (Dies de la setmana × 4)",es:"¿Cuántos peldaños tiene el lugar donde está el tesoro? (Días de la semana × 4)"},
       answer:'28',hint:{ca:'7 dies × 4 = ?',es:'7 días × 4 = ?'},points:100},
      {name:{ca:'MAPA 2',es:'MAPA 2'},
       narrativeTitle:{ca:'El codi pirata',es:'El código pirata'},
       narrativeText:{ca:"La segona X del mapa porta a un cofre tancat. El codi del cadenat és una paraula que el Capità Perot adorava. Usa la clau: A=1, B=2, C=3... i suma les lletres de 'MAR'.",es:"La segunda X del mapa lleva a un cofre cerrado. El código del candado es un número. Usa la clave: A=1, B=2, C=3... y suma las letras de 'MAR'."},
       enigma:{ca:"M=13, A=1, R=18. Quant és M+A+R?",es:"M=13, A=1, R=18. ¿Cuánto es M+A+R?"},
       answer:'32',hint:{ca:'13+1+18=?',es:'13+1+18=?'},points:150},
      {name:{ca:'EL TRESOR',es:'EL TESORO'},
       narrativeTitle:{ca:"El cofre d'or",es:'El cofre de oro'},
       narrativeText:{ca:"Heu arribat al tresor! Però el cofre té un últim pany. El Capità Perot va escriure: 'El meu tresor el guarda el número que, si el multipliques per si mateix, dona 64.'",es:"¡Habéis llegado al tesoro! Pero el cofre tiene un último candado. El Capitán Perot escribió: 'Mi tesoro lo guarda el número que, si lo multiplicas por sí mismo, da 64.'"},
       enigma:{ca:"Quin número multiplicat per si mateix dona 64? (arrel quadrada de 64)",es:"¿Qué número multiplicado por sí mismo da 64? (raíz cuadrada de 64)"},
       answer:'8',hint:{ca:'8×8=64',es:'8×8=64'},points:200,isFinal:true}
    ]
  },

  {
    id:'wizards', emoji:'🧙',
    color:'#a855f7', bg:'radial-gradient(ellipse at 50% 40%,#1a0030,#070010)',
    font:"'Cinzel Decorative',cursive",
    level:'junior',
    diff:{ca:'⭐ Júnior',es:'⭐ Júnior'},
    dur:{ca:'30 min',es:'30 min'},
    ageLabel:{ca:'10-12 anys',es:'10-12 años'},
    title:{ca:"L'Escola de Màgia",es:'La Escuela de Magia'},
    desc:{ca:'Màgia · Encanteris · Aprenents',es:'Magia · Hechizos · Aprendices'},
    synopsis:{ca:"Sou aprenents de màgia a l'Escola Arcana. El gran mestre ha tancat accidentalment el laboratori de pocions amb un encanteri i ha perdut la memòria. Heu de resoldre tres proves màgiques per alliberar-lo!",es:"Sois aprendices de magia en la Escuela Arcana. El gran maestro ha cerrado accidentalmente el laboratorio de pociones con un hechizo y ha perdido la memoria. ¡Debéis superar tres pruebas mágicas para liberarlo!"},
    phases:[
      {name:{ca:'PROVA 1',es:'PRUEBA 1'},
       narrativeTitle:{ca:'La poció de colors',es:'La poción de colores'},
       narrativeText:{ca:"El laboratori té ampolles de colors. Per fer la poció de la memòria cal mesclar colors en l'ordre correcte. El llibre de receptes diu: 'Primer el color del cel, després el color de les roses, finalment el color de l'herba.'",es:"El laboratorio tiene botellas de colores. Para hacer la poción de la memoria hay que mezclar colores en el orden correcto. El libro de recetas dice: 'Primero el color del cielo, después el color de las rosas, finalmente el color de la hierba.'"},
       enigma:{ca:"Quin és l'ordre correcte de colors? Escriu les tres primeres lletres de cada color en ordre (sense espais).",es:"¿Cuál es el orden correcto de colores? Escribe las tres primeras letras de cada color en orden (sin espacios)."},
       answer:'BLUROSVERD',hint:{ca:"Cel=BLAU, Roses=ROSAT, Herba=VERD → primers 3: BLA-ROS-VER",es:"Cielo=AZUL, Rosas=ROSA, Hierba=VERDE → primeros 3: AZU-ROS-VER"},points:100},
      {name:{ca:'PROVA 2',es:'PRUEBA 2'},
       narrativeTitle:{ca:'El grimori del mestre',es:'El grimorio del maestro'},
       narrativeText:{ca:"Al grimori hi ha una pàgina secreta amb l'encanteri de la memòria. Però les paraules estan en ordre de revers! La clau és el nombre de lletres de la paraula MÀGIA (sense accent) sumada al nombre de lletres de BRUIXA.",es:"En el grimorio hay una página secreta con el hechizo de la memoria. ¡Pero las palabras están al revés! La clave es el número de letras de la palabra MAGIA sumado al número de letras de BRUJA."},
       enigma:{ca:"MAGIA té 5 lletres. BRUIXA té 6 lletres. Quant és 5+6?",es:"MAGIA tiene 5 letras. BRUJA tiene 5 letras. ¿Cuánto es 5+5?"},
       answer:'10',hint:{ca:'Compta bé les lletres: B-R-U-I-X-A = 6. 5+6=?',es:'Cuenta bien las letras: B-R-U-J-A = 5. 5+5=?'},points:150,
       mission:{ca:"Un/a aprenent ha d'anar a buscar al professor de guàrdia i pronunciar les paraules màgiques 'ABRACADABRA ESCOLA'. El professor tindrà preparada la pròxima pista.",es:"Un/a aprendiz debe ir a buscar al profesor de guardia y pronunciar las palabras mágicas 'ABRACADABRA ESCUELA'. El profesor tendrá preparada la siguiente pista."},missionIcon:'🪄'},
      {name:{ca:'PROVA 3',es:'PRUEBA 3'},
       narrativeTitle:{ca:"L'encanteri final",es:'El hechizo final'},
       narrativeText:{ca:"L'últim encanteri necessita el número secret del mestre. Ell us dóna una pista: 'Sóc el nombre de mesos de l'any menys el nombre de dies d'una setmana, i el resultat multiplicat per 5.'",es:"El último hechizo necesita el número secreto del maestro. Él os da una pista: 'Soy el número de meses del año menos el número de días de una semana, y el resultado multiplicado por 5.'"},
       enigma:{ca:"(Mesos de l'any − dies de la setmana) × 5 = ?",es:"(Meses del año − días de la semana) × 5 = ?"},
       answer:'25',hint:{ca:'(12-7)×5=5×5=25',es:'(12-7)×5=5×5=25'},points:200,isFinal:true}
    ]
  },

  {
    id:'animals', emoji:'🦁',
    color:'#22c55e', bg:'radial-gradient(ellipse at 30% 70%,#001a08,#000500)',
    font:"'Rajdhani',sans-serif",
    level:'junior',
    diff:{ca:'⭐ Júnior',es:'⭐ Júnior'},
    dur:{ca:'25 min',es:'25 min'},
    ageLabel:{ca:'10-12 anys',es:'10-12 años'},
    title:{ca:'Safari Matemàtic',es:'Safari Matemático'},
    desc:{ca:'Animals · Natura · Matemàtiques divertides',es:'Animales · Naturaleza · Matemáticas divertidas'},
    synopsis:{ca:"Sou científics en un safari africà. Un investigador ha perdut els seus quaderns de notes amb les dades dels animals. Sense elles no pot protegir-los! Heu de resoldre tres misteris de la savana per recuperar-los.",es:"Sois científicos en un safari africano. Un investigador ha perdido sus cuadernos de notas con los datos de los animales. ¡Sin ellas no puede protegerlos! Debéis resolver tres misterios de la sabana para recuperarlos."},
    phases:[
      {name:{ca:'MISTERI 1',es:'MISTERIO 1'},
       narrativeTitle:{ca:'El rastre del lleó',es:'La huella del león'},
       narrativeText:{ca:"Heu trobat petjades! Per saber de quin animal són, cal resoldre: 'Un lleó té 4 potes. Un elefant té 4 potes. Una àguila té 2 potes. Si en un grup hi ha 2 lleons, 1 elefant i 3 àguiles, quantes potes hi ha en total?'",es:"¡Habéis encontrado huellas! Para saber de qué animal son, hay que resolver: 'Un león tiene 4 patas. Un elefante tiene 4 patas. Un águila tiene 2 patas. Si en un grupo hay 2 leones, 1 elefante y 3 águilas, ¿cuántas patas hay en total?'"},
       enigma:{ca:"2 lleons + 1 elefant + 3 àguiles = ? potes en total",es:"2 leones + 1 elefante + 3 águilas = ? patas en total"},
       answer:'18',hint:{ca:'(2×4)+(1×4)+(3×2)=8+4+6=18',es:'(2×4)+(1×4)+(3×2)=8+4+6=18'},points:100},
      {name:{ca:'MISTERI 2',es:'MISTERIO 2'},
       narrativeTitle:{ca:'La girafa i la zebra',es:'La jirafa y la cebra'},
       narrativeText:{ca:"Una girafa mesura 5 metres i una zebra mesura 1,5 metres. El quadern perdut diu que si posem 3 zebres una sobre l'altra, quasi arriben a l'alçada de la girafa. Quants centímetres de diferència hi ha?",es:"Una jirafa mide 5 metros y una cebra mide 1,5 metros. El cuaderno perdido dice que si ponemos 3 cebras una encima de otra, casi llegan a la altura de la jirafa. ¿Cuántos centímetros de diferencia hay?"},
       enigma:{ca:"3 zebres = 3 × 150 cm. Girafa = 500 cm. Diferència = ?",es:"3 cebras = 3 × 150 cm. Jirafa = 500 cm. Diferencia = ?"},
       answer:'50',hint:{ca:'500-(3×150)=500-450=50',es:'500-(3×150)=500-450=50'},points:150},
      {name:{ca:'MISTERI 3',es:'MISTERIO 3'},
       narrativeTitle:{ca:'El codi de la reserva',es:'El código de la reserva'},
       narrativeText:{ca:"El quadern s'ha quedat tancat amb un codi de 2 xifres. La pista és: 'Sóc el doble del nombre de animals salvatges protegits a la reserva. La reserva protegeix animals que comencen per les lletres: L, E, R, G, Z (lleó, elefant, rinoceront, goril·la, zebra).'",es:"El cuaderno se ha quedado bloqueado con un código de 2 cifras. La pista es: 'Soy el doble del número de animales salvajes protegidos en la reserva. La reserva protege animales que empiezan por las letras: L, E, R, G, Z (león, elefante, rinoceronte, gorila, cebra).'"},
       enigma:{ca:"Quants animals protegeix la reserva? El codi és el doble d'aquest número.",es:"¿Cuántos animales protege la reserva? El código es el doble de ese número."},
       answer:'10',hint:{ca:'5 animals × 2 = 10',es:'5 animales × 2 = 10'},points:200,isFinal:true}
    ]
  },

  {
    id:'robots', emoji:'🤖',
    color:'#06b6d4', bg:'radial-gradient(ellipse at 60% 40%,#001a2e,#000810)',
    font:"'Orbitron',sans-serif",
    level:'junior',
    diff:{ca:'⭐ Júnior',es:'⭐ Júnior'},
    dur:{ca:'30 min',es:'30 min'},
    ageLabel:{ca:'10-12 anys',es:'10-12 años'},
    title:{ca:'La Fàbrica de Robots',es:'La Fábrica de Robots'},
    desc:{ca:'Robots · Tecnologia · Lògica',es:'Robots · Tecnología · Lógica'},
    synopsis:{ca:"Sou enginyers júnior a la Fàbrica de Robots MEGA-TECH. Avui, el robot principal s'ha quedat sense bateria i tots els altres robots estan bloquejats. Per reactivar-los heu de resoldre tres errors del sistema.",es:"Sois ingenieros júnior en la Fábrica de Robots MEGA-TECH. Hoy, el robot principal se ha quedado sin batería y todos los demás robots están bloqueados. Para reactivarlos debéis resolver tres errores del sistema."},
    phases:[
      {name:{ca:'ERROR 001',es:'ERROR 001'},
       narrativeTitle:{ca:'Sistema de bateria',es:'Sistema de batería'},
       narrativeText:{ca:"La pantalla mostra: BATERIA AL 0%. Per recarregar-la cal introduir el codi d'energia. El manual diu: 'El codi és el resultat de: (voltatge de la xarxa elèctrica a Europa) + (graus d'un angle recte).' ",es:"La pantalla muestra: BATERÍA AL 0%. Para recargarla hay que introducir el código de energía. El manual dice: 'El código es el resultado de: (voltaje de la red eléctrica en Europa) + (grados de un ángulo recto).'"},
       enigma:{ca:"Voltatge Europa (220V) + Angle recte (90°) = ?",es:"Voltaje Europa (220V) + Ángulo recto (90°) = ?"},
       answer:'310',hint:{ca:'220+90=?',es:'220+90=?'},points:100},
      {name:{ca:'ERROR 002',es:'ERROR 002'},
       narrativeTitle:{ca:'El codi de programació',es:'El código de programación'},
       narrativeText:{ca:"El robot necessita un codi de programació. La seqüència és: 2, 4, 8, 16, 32... Quin és el pròxim número de la seqüència? Aquest número és el codi.",es:"El robot necesita un código de programación. La secuencia es: 2, 4, 8, 16, 32... ¿Cuál es el siguiente número de la secuencia? Ese número es el código."},
       enigma:{ca:"Continua la seqüència: 2, 4, 8, 16, 32, __? (Cada número és el doble de l'anterior.)",es:"Continúa la secuencia: 2, 4, 8, 16, 32, __? (Cada número es el doble del anterior.)"},
       answer:'64',hint:{ca:'32×2=?',es:'32×2=?'},points:150,
       mission:{ca:"Un membre de l'equip ha d'anar a l'aula d'informàtica i preguntar al professor o tècnic el 'codi de reinici dels robots'. Tindrà una nota preparada.",es:"Un miembro del equipo debe ir al aula de informática y preguntar al profesor o técnico el 'código de reinicio de los robots'. Tendrá una nota preparada."},missionIcon:'💻'},
      {name:{ca:'ERROR 003',es:'ERROR 003'},
       narrativeTitle:{ca:'El robot activat!',es:'¡El robot activado!'},
       narrativeText:{ca:"Últim pas! El robot central necessita saber quants robots hi ha a la fàbrica. Al seu registre consten: 5 robots soldadors, 3 robots pintors, 7 robots embaladors i 2 robots de control. Però 4 d'ells estan avariats. Quants robots funcionen?",es:"¡Último paso! El robot central necesita saber cuántos robots hay en la fábrica. En su registro constan: 5 robots soldadores, 3 robots pintores, 7 robots embaladores y 2 robots de control. Pero 4 de ellos están averiados. ¿Cuántos robots funcionan?"},
       enigma:{ca:"Total de robots − robots avariats = robots que funcionen",es:"Total de robots − robots averiados = robots que funcionan"},
       answer:'13',hint:{ca:'(5+3+7+2)-4=17-4=13',es:'(5+3+7+2)-4=17-4=13'},points:200,isFinal:true}
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  //  BLOC 2 · EXISTENTS (12 històries originals) — no modificar ids
  // ─────────────────────────────────────────────────────────────────

  {
    id:'space',emoji:'🚀',color:'#00f5ff',bg:'radial-gradient(ellipse at 30% 50%,#001a3a,#000010)',
    font:"'Orbitron',sans-serif",
    level:'dificil',
    diff:{ca:'★★★ Difícil',es:'★★★ Difícil'},dur:{ca:'45 min',es:'45 min'},
    ageLabel:{ca:'15+ anys',es:'15+ años'},
    title:{ca:'Nau Espacial AURORA-7',es:'Nave Espacial AURORA-7'},
    desc:{ca:'Sci-fi · Sabotatge · Supervivència',es:'Sci-fi · Sabotaje · Supervivencia'},
    synopsis:{ca:"La tripulació desperta en òrbita sense records. Els sistemes fallen. Algú va sabotejar la nau. Teniu 45 minuts abans que el reactor exploti.",es:"La tripulación despierta en órbita sin recuerdos. Los sistemas fallan. Alguien saboteó la nave. Tenéis 45 minutos antes de que el reactor explote."},
    phases:[
      {name:{ca:'DESPERTAR',es:'DESPERTAR'},narrativeTitle:{ca:'Sistema de vida: CRÍTIC',es:'Sistema de vida: CRÍTICO'},
       narrativeText:{ca:"Els llums d'emergència ho tenyeixen tot de vermell. L'oxigen escasseja. A la pantalla parpelleja: SABOTATGE DETECTAT — ACCÉS NIVELL 1 REQUERIT.",es:"Las luces de emergencia tiñen todo de rojo. El oxígeno escasea. En la pantalla parpadea: SABOTAJE DETECTADO — ACCESO NIVEL 1 REQUERIDO."},
       enigma:{ca:"El codi d'accés és la suma dels dígits de l'any de llançament del MIR (1986) multiplicada pel nombre de tripulants (4).",es:"El código de acceso es la suma de los dígitos del año de lanzamiento del MIR (1986) multiplicada por el número de tripulantes (4)."},
       answer:'96',hint:{ca:'1+9+8+6=24. I 24×4?',es:'1+9+8+6=24. ¿Y 24×4?'},points:100},
      {name:{ca:'EL TRAÏDOR',es:'EL TRAIDOR'},narrativeTitle:{ca:'Identifiqueu el sabotejador',es:'Identificad al saboteador'},
       narrativeText:{ca:"La IA ha trobat 3 sospitosos. Cadascun té una coartada. Una és mentida. L'accés al reactor va ocórrer entre les 02:00 i les 04:00.",es:"La IA ha encontrado 3 sospechosos. Cada uno tiene una coartada. Una es mentira. El acceso al reactor ocurrió entre las 02:00 y las 04:00."},
       enigma:{ca:"A diu: 'Dormia a la cambra 3'. B diu: 'Estava al menjador amb A'. C diu: 'Vaig veure B als corredors a les 03:00'. Si B menteix sobre estar amb A, qui és el traïdor?",es:"A dice: 'Dormía en la cámara 3'. B dice: 'Estaba en el comedor con A'. C dice: 'Vi a B en los corredores a las 03:00'. Si B miente sobre estar con A, ¿quién es el traidor?"},
       answer:'B',hint:{ca:"Si B menteix, llavors A era sol. I qui confirma on era C?",es:"Si B miente, entonces A estaba solo. ¿Y quién confirma dónde estaba C?"},
       mission:{ca:"Un tripulant ha d'anar a la biblioteca i buscar el llibre amb el codi 'AURORA' al llom.",es:"Un tripulante debe ir a la biblioteca y buscar el libro con el código 'AURORA' en el lomo."},missionIcon:'📚',points:150},
      {name:{ca:'CODI FINAL',es:'CÓDIGO FINAL'},narrativeTitle:{ca:'Desactivar el reactor',es:'Desactivar el reactor'},
       narrativeText:{ca:"30 minuts. La seqüència de desactivació requereix un codi de 4 dígits fragmentat per la nau: ■2■■, ■■7■, ■■■9, 3■■■.",es:"30 minutos. La secuencia de desactivación requiere un código de 4 dígitos fragmentado por la nave: ■2■■, ■■7■, ■■■9, 3■■■."},
       enigma:{ca:"Primer dígit: nombre de planetes del sistema solar. Segon: 2. Tercer: 7. Quart: nombre atòmic del carboni × 1,5.",es:"Primer dígito: número de planetas del sistema solar. Segundo: 2. Tercero: 7. Cuarto: número atómico del carbono × 1,5."},
       answer:'8279',hint:{ca:'Planetes:8. Carboni Z=6, ×1,5=9 → 8-2-7-9',es:'Planetas:8. Carbono Z=6, ×1,5=9 → 8-2-7-9'},points:200,isFinal:true}
    ]
  },
  {id:'museum',emoji:'🎨',color:'#9b59b6',bg:'radial-gradient(ellipse at 60% 40%,#1a0a2e,#0d0d0d)',font:"'Cinzel Decorative',cursive",level:'medio',diff:{ca:'★★ Mitjà',es:'★★ Medio'},dur:{ca:'40 min',es:'40 min'},ageLabel:{ca:'12-15 anys',es:'12-15 años'},title:{ca:'El Museu Maleït',es:'El Museo Maldito'},desc:{ca:'Art · Misteri · Terror suau',es:'Arte · Misterio · Terror suave'},synopsis:{ca:"El museu tanca i quedeu atrapats. A mitjanit, els quadres cobren vida. El guardià exigeix que resoleu els seus enigmes.",es:"El museo cierra y quedáis atrapados. A medianoche, los cuadros cobran vida. El guardián exige que resolvéis sus enigmas."},phases:[{name:{ca:'MITJANIT',es:'MEDIANOCHE'},narrativeTitle:{ca:'Les pintures us miren',es:'Las pinturas os miran'},narrativeText:{ca:"El rellotge marca les 00:00. Una veu: 'Responeu el meu primer endevinall o us convertiré en natura morta.'",es:"El reloj marca las 00:00. Una voz: 'Responded mi primer acertijo o os convertiré en naturaleza muerta.'"},enigma:{ca:"Sóc més vell que el temps, però vaig néixer avui. No tinc veu, però explico històries. Els reis em temen i els pobres em posseeixen. Què sóc?",es:"Soy más viejo que el tiempo, pero nací hoy. No tengo voz, pero cuento historias. Los reyes me temen y los pobres me poseen. ¿Qué soy?"},answer:'somni',hint:{ca:"Tots els humans ho fan cada nit...",es:"Todos los humanos lo hacen cada noche..."},points:100},{name:{ca:'EL GUARDIÀ',es:'EL GUARDIÁN'},narrativeTitle:{ca:"El contracte de l'artista",es:'El contrato del artista'},narrativeText:{ca:"El guardià mostra un contracte de 1743: 'El qui resolgui l'enigma serà lliure.'",es:"El guardián muestra un contrato de 1743: 'El que resuelva el enigma será libre.'"},enigma:{ca:"La Mona Lisa té 1 somriure. Un Picasso té 3 ulls. Un Dalí té 1 rellotge fos. Combina el nombre d'objectes: 1-3-1.",es:"La Mona Lisa tiene 1 sonrisa. Un Picasso tiene 3 ojos. Un Dalí tiene 1 reloj derretido. Combina el número de objetos: 1-3-1."},answer:'131',hint:{ca:'Concatena: 1-3-1',es:'Concatena: 1-3-1'},mission:{ca:"Un membre ha d'anar a l'entrada i buscar sota el bústia un sobre amb el símbol 🎨.",es:"Un miembro debe ir a la entrada y buscar bajo el buzón un sobre con el símbolo 🎨."},missionIcon:'📬',points:150},{name:{ca:'ESCAPADA',es:'ESCAPE'},narrativeTitle:{ca:'La porta secreta',es:'La puerta secreta'},narrativeText:{ca:"Rere un quadre de Van Gogh hi ha una porta. La clau és l'any de mort de l'artista més jove.",es:"Tras un cuadro de Van Gogh hay una puerta. La clave es el año de muerte del artista más joven."},enigma:{ca:"Van Gogh 1890 (37 anys). Dalí 1989 (84). Picasso 1973 (91). Any de mort del més jove.",es:"Van Gogh 1890 (37 años). Dalí 1989 (84). Picasso 1973 (91). Año de muerte del más joven."},answer:'1890',hint:{ca:'37<84<91',es:'37<84<91'},points:200,isFinal:true}]},
  {id:'train',emoji:'🚄',color:'#e74c3c',bg:'radial-gradient(ellipse at 50% 80%,#2d0000,#0a0005)',font:"'Orbitron',sans-serif",level:'dificil',diff:{ca:'★★★ Difícil',es:'★★★ Difícil'},dur:{ca:'50 min',es:'50 min'},ageLabel:{ca:'15+ anys',es:'15+ años'},title:{ca:'Tren Sense Frens',es:'Tren Sin Frenos'},desc:{ca:'Thriller · Velocitat · Tensió',es:'Thriller · Velocidad · Tensión'},synopsis:{ca:"El tren bala viatja a 350km/h. Els frens han estat sabotejats. A cada parada hi ha una bomba... o una pista.",es:"El tren bala viaja a 350km/h. Los frenos han sido saboteados. En cada parada hay una bomba... o una pista."},phases:[{name:{ca:'PARADA 1',es:'PARADA 1'},narrativeTitle:{ca:'Missatge al seient',es:'Mensaje en el asiento'},narrativeText:{ca:"Sota el seient hi ha un sobre amb la fotografia del maquinista inconscient.",es:"Bajo el asiento hay un sobre con la fotografía del maquinista inconsciente."},enigma:{ca:"El tren va a 350 km/h. La distància fins al túnel és de 175 km. Quants minuts queden?",es:"El tren va a 350 km/h. La distancia hasta el túnel es de 175 km. ¿Cuántos minutos quedan?"},answer:'30',hint:{ca:'Temps=distància÷velocitat×60',es:'Tiempo=distancia÷velocidad×60'},points:100},{name:{ca:'PARADA 2',es:'PARADA 2'},narrativeTitle:{ca:'El passatger misteriós',es:'El pasajero misterioso'},narrativeText:{ca:"Un home baixa del sostre: 'Tinc el codi per als frens, però primer heu de demostrar-ho.'",es:"Un hombre baja del techo: 'Tengo el código para los frenos, pero primero demostradlo.'"},enigma:{ca:"Desxifreu el codi César (desplaçament -3): ROLDQR",es:"Descifrad el código César (desplazamiento -3): ROLDQR"},answer:'OLIANO',hint:{ca:'R-3=O, O-3=L...',es:'R-3=O, O-3=L...'},mission:{ca:"El 'revisor' còmplice té la maleta. Digueu-li 'CODI VERMELL'.",es:"El 'revisor' cómplice tiene el maletín. Decidle 'CÓDIGO ROJO'."},missionIcon:'🧳',points:150},{name:{ca:'TÚNEL FINAL',es:'TÚNEL FINAL'},narrativeTitle:{ca:"10 minuts per a l'impacte",es:'10 minutos para el impacto'},narrativeText:{ca:"4 interruptors: ∆, ○, ■, ✦. L'ordre d'activació és crucial.",es:"4 interruptores: ∆, ○, ■, ✦. El orden de activación es crucial."},enigma:{ca:"Ordena de menys costats a més: ○(0), ∆(3), ■(4), ✦(puntes)",es:"Ordena de menos lados a más: ○(0), ∆(3), ■(4), ✦(puntas)"},answer:'○∆■✦',hint:{ca:'Cercle=0, Triangle=3, Quadrat=4...',es:'Círculo=0, Triángulo=3, Cuadrado=4...'},points:200,isFinal:true}]},
  {id:'bunker',emoji:'☢️',color:'#27ae60',bg:'radial-gradient(ellipse at 40% 60%,#0d1f00,#050505)',font:"'Special Elite',cursive",level:'expert',diff:{ca:'★★★★ Expert',es:'★★★★ Experto'},dur:{ca:'55 min',es:'55 min'},ageLabel:{ca:'16+ anys',es:'16+ años'},title:{ca:'Búnquer 2087',es:'Búnker 2087'},desc:{ca:'Post-apocalíptic · Ciència · Supervivència',es:'Post-apocalíptico · Ciencia · Supervivencia'},synopsis:{ca:"Any 2087. Sou els últims humans. El búnquer té oxigen per a 6 hores. Descobriu què va passar i trobeu la sortida.",es:"Año 2087. Sois los últimos humanos. El búnker tiene oxígeno para 6 horas. Descubrid qué pasó y encontrad la salida."},phases:[{name:{ca:'DESPERTAR',es:'DESPERTAR'},narrativeTitle:{ca:"Registres de l'any zero",es:'Registros del año cero'},narrativeText:{ca:"La IA diu: 'Benvinguts a la Fase de Recuperació. Necessito verificar la vostra identitat.'",es:"La IA dice: 'Bienvenidos a la Fase de Recuperación. Necesito verificar vuestra identidad.'"},enigma:{ca:"Any de Txernòbil (1986) menys any de la fi de la Guerra Freda (1991). Valor absolut.",es:"Año de Chernóbil (1986) menos año del fin de la Guerra Fría (1991). Valor absoluto."},answer:'5',hint:{ca:'|1986-1991|=?',es:'|1986-1991|=?'},points:100},{name:{ca:'ELS ARXIUS',es:'LOS ARCHIVOS'},narrativeTitle:{ca:'Qui va causar el final',es:'Quién causó el fin'},narrativeText:{ca:"Fragments en binari: 01000001, 01001001. Convertiu a ASCII.",es:"Fragmentos en binario: 01000001, 01001001. Convertid a ASCII."},enigma:{ca:"01000001=A (65). 01001001=? Inicials del culpable.",es:"01000001=A (65). 01001001=? Iniciales del culpable."},answer:'AI',hint:{ca:'01001001=73 decimal=I',es:'01001001=73 decimal=I'},mission:{ca:"Aneu a informàtica i busqueu el fitxer 'BUNKER2087'. La contrasenya la té el professor de guàrdia.",es:"Id a informática y buscad el archivo 'BUNKER2087'. La contraseña la tiene el profesor de guardia."},missionIcon:'💻',points:150},{name:{ca:'SORTIDA',es:'SALIDA'},narrativeTitle:{ca:'La porta hermètica',es:'La puerta hermética'},narrativeText:{ca:"Elements marcats a la Taula Periòdica: H, Na, K, Fe. Números atòmics, primers dígits concatenats.",es:"Elementos marcados en la Tabla Periódica: H, Na, K, Fe. Números atómicos, primeros dígitos concatenados."},enigma:{ca:"H(1), Na(11), K(19), Fe(26). Primers dígits: 1,1,1,2 → concatena-ho tot.",es:"H(1), Na(11), K(19), Fe(26). Primeros dígitos: 1,1,1,2 → concaténalo todo."},answer:'11119',hint:{ca:'H=1, Na=11, K=19, Fe=26',es:'H=1, Na=11, K=19, Fe=26'},points:200,isFinal:true}]},
  {id:'pirates',emoji:'🏴‍☠️',color:'#f39c12',bg:'radial-gradient(ellipse at 50% 30%,#1f1000,#060400)',font:"'Pirata One',cursive",level:'medio',diff:{ca:'★★ Mitjà',es:'★★ Medio'},dur:{ca:'40 min',es:'40 min'},ageLabel:{ca:'12-15 anys',es:'12-15 años'},title:{ca:'Pirates del Mediterrani',es:'Piratas del Mediterráneo'},desc:{ca:'Aventura · Mapa · Tresor',es:'Aventura · Mapa · Tesoro'},synopsis:{ca:"Sou tripulació de El Venjador Escarlata. Heu trobat el mapa de Barbanegra. Però el mapa està xifrat.",es:"Sois tripulación de El Vengador Escarlata. Habéis encontrado el mapa de Barbanegra. Pero el mapa está cifrado."},phases:[{name:{ca:'EL MAPA',es:'EL MAPA'},narrativeTitle:{ca:'Barbanegra us parla',es:'Barbanegra os habla'},narrativeText:{ca:"Una ampolla amb un pergamí: 'Suma l'edat que tenia quan vaig zarpar (17) al nombre de mars que vam surcar (7).'",es:"Una botella con un pergamino: 'Suma la edad que tenía cuando zarpé (17) al número de mares que surcamos (7).'"},enigma:{ca:"17+7=?",es:"17+7=?"},answer:'24',hint:{ca:'17+7=?',es:'17+7=?'},points:100},{name:{ca:"L'ILLA",es:'LA ISLA'},narrativeTitle:{ca:'El guardià de la cova',es:'El guardián de la cueva'},narrativeText:{ca:"Un vell pirata: 'Resoleu el meu endevinall i us deixaré passar.'",es:"Un viejo pirata: '¡Resolved mi acertijo y os dejaré pasar!'"},enigma:{ca:"Tinc ciutats però no cases. Tinc muntanyes però no arbres. Tinc aigua però no peixos. Tinc carreteres però no cotxes. Què sóc?",es:"Tengo ciudades pero no casas. Tengo montañas pero no árboles. Tengo agua pero no peces. Tengo carreteras pero no coches. ¿Qué soy?"},answer:'mapa',hint:{ca:"Useu per trobar el tresor...",es:"Lo usáis para encontrar el tesoro..."},mission:{ca:"La 'X' és sota el banc del pati.",es:"La 'X' está bajo el banco del patio."},missionIcon:'🗺️',points:150},{name:{ca:'EL TRESOR',es:'EL TESORO'},narrativeTitle:{ca:'El pany del cofre',es:'La cerradura del cofre'},narrativeText:{ca:"Colom signava en castellà però el seu nom italià era Cristoforo Colombo. Les 5 primeres lletres.",es:"Colón firmaba en castellano pero su nombre italiano era Cristoforo Colombo. Las 5 primeras letras."},enigma:{ca:"Les 5 primeres lletres del nom italià de Colom.",es:"Las 5 primeras letras del nombre italiano de Colón."},answer:'CRIST',hint:{ca:'Cristoforo → CRIST',es:'Cristoforo → CRIST'},points:200,isFinal:true}]},
  {id:'castle',emoji:'🏰',color:'#8e44ad',bg:'radial-gradient(ellipse at 30% 70%,#150020,#050005)',font:"'Cinzel Decorative',cursive",level:'medio',diff:{ca:'★★ Mitjà',es:'★★ Medio'},dur:{ca:'40 min',es:'40 min'},ageLabel:{ca:'12-15 anys',es:'12-15 años'},title:{ca:'El Castell Encantat',es:'El Castillo Encantado'},desc:{ca:'Terror suau · Medieval · Màgia',es:'Terror suave · Medieval · Magia'},synopsis:{ca:"El fantasma del comte Vladimiro exigeix que respongueu els seus enigmes abans de l'alba.",es:"El fantasma del conde Vladimiro exige que respondáis sus enigmas antes del amanecer."},phases:[{name:{ca:'ARRIBADA',es:'LLEGADA'},narrativeTitle:{ca:'Les portes es tanquen',es:'Las puertas se cierran'},narrativeText:{ca:"Una veu cavernosa: 'Benvinguts a casa meva. Fa 300 anys que no rebo visites.'",es:"Una voz cavernosa: 'Bienvenidos a mi hogar. Hace 300 años que no recibo visitas.'"},enigma:{ca:"El comte va ser maleït l'any 1723. Quants anys porta encantat fins a 2025?",es:"El conde fue maldecido en 1723. ¿Cuántos años lleva encantado hasta 2025?"},answer:'302',hint:{ca:'2025-1723=?',es:'2025-1723=?'},points:100},{name:{ca:'LA MALEDICCIÓ',es:'LA MALDICIÓN'},narrativeTitle:{ca:"El llibre d'encanteris",es:'El libro de hechizos'},narrativeText:{ca:"El comte mostra la biblioteca: 'El títol del llibre és la resposta.'",es:"El conde muestra la biblioteca: 'El título del libro es la respuesta.'"},enigma:{ca:"Com més m'asseques, més mullat et quedes. Què sóc?",es:"Cuanto más me seques, más mojado te quedas. ¿Qué soy?"},answer:'tovallola',hint:{ca:"Objecte del bany...",es:"Objeto del baño..."},mission:{ca:"El grimoriu és a la classe d'Història, sota la taula del professor. Sobre amb segell 🏰.",es:"El grimorio está en la clase de Historia, bajo la mesa del profesor. Sobre con sello 🏰."},missionIcon:'📜',points:150},{name:{ca:"L'EXORCISME",es:'EL EXORCISMO'},narrativeTitle:{ca:'Alliberar el comte',es:'Liberar al conde'},narrativeText:{ca:"El conjur necessita el nom del dimoni en ROT13: 'Znyhf'.",es:"El conjuro necesita el nombre del demonio en ROT13: 'Znyhf'."},enigma:{ca:"ROT13: Z→M, n→a, y→l, h→u, f→s. Nom del dimoni.",es:"ROT13: Z→M, n→a, y→l, h→u, f→s. Nombre del demonio."},answer:'Malus',hint:{ca:'ROT13: 13 posicions',es:'ROT13: 13 posiciones'},points:200,isFinal:true}]},
  {id:'atlantis',emoji:'🌊',color:'#2980b9',bg:'radial-gradient(ellipse at 50% 100%,#00162e,#000510)',font:"'Orbitron',sans-serif",level:'dificil',diff:{ca:'★★★ Difícil',es:'★★★ Difícil'},dur:{ca:'50 min',es:'50 min'},ageLabel:{ca:'15+ anys',es:'15+ años'},title:{ca:'Ciutat Submergida',es:'Ciudad Sumergida'},desc:{ca:'Atlàntida · Ciència · Arqueologia',es:'Atlántida · Ciencia · Arqueología'},synopsis:{ca:"Una expedició ha trobat l'Atlàntida. Heu de xifrar els missatges per activar l'ascensor.",es:"Una expedición ha encontrado Atlántida. Debéis descifrar los mensajes para activar el ascensor."},phases:[{name:{ca:'DESCOBRIMENT',es:'DESCUBRIMIENTO'},narrativeTitle:{ca:'Els registres atlants',es:'Los registros atlantes'},narrativeText:{ca:"Sistema atlant: base 8 (octal). Primer missatge: 10+10=? en octal.",es:"Sistema atlante: base 8 (octal). Primer mensaje: 10+10=? en octal."},enigma:{ca:"10(octal)=8 decimal. 10+10=16 decimal. Quant és 16 en octal?",es:"10(octal)=8 decimal. 10+10=16 decimal. ¿Cuánto es 16 en octal?"},answer:'20',hint:{ca:'16÷8=2 resta 0 → 20',es:'16÷8=2 resto 0 → 20'},points:100},{name:{ca:'EL REACTOR',es:'EL REACTOR'},narrativeTitle:{ca:"L'energia de l'Atlàntida",es:'La energía de Atlántida'},narrativeText:{ca:"5 cristalls de quars. Ordena'ls de menor a major freqüència.",es:"5 cristales de cuarzo. Ordénalos de menor a mayor frecuencia."},enigma:{ca:"Vermell=430THz, Taronja=490THz, Groc=530THz, Verd=560THz, Blau=620THz.",es:"Rojo=430THz, Naranja=490THz, Amarillo=530THz, Verde=560THz, Azul=620THz."},answer:'Vermell-Taronja-Groc-Verd-Blau',hint:{ca:'430<490<530<560<620',es:'430<490<530<560<620'},mission:{ca:"El 'cristall mestre' al laboratori de ciències. Pregunteu pel 'PROJECTE ATLÀNTIDA'.",es:"El 'cristal maestro' en el laboratorio de ciencias. Preguntad por el 'PROYECTO ATLÁNTIDA'."},missionIcon:'💎',points:150},{name:{ca:'ASCENSOR',es:'ASCENSOR'},narrativeTitle:{ca:'Pujar a la superfície',es:'Subir a la superficie'},narrativeText:{ca:"A 3000m, densitat=1025 kg/m³, g=9,8 m/s². Codi=pressió en bar.",es:"A 3000m, densidad=1025 kg/m³, g=9,8 m/s². Código=presión en bar."},enigma:{ca:"P=ρ×g×h=1025×9,8×3000 Pa. Convertiu a bar (÷100.000). Arrodoneu.",es:"P=ρ×g×h=1025×9,8×3000 Pa. Convertid a bar (÷100.000). Redonded."},answer:'301',hint:{ca:'30.135.000÷100.000≈301',es:'30.135.000÷100.000≈301'},points:200,isFinal:true}]},
  {id:'spy',emoji:'🕵️',color:'#e8c84a',bg:'radial-gradient(ellipse at 70% 30%,#1a1a00,#050500)',font:"'Orbitron',sans-serif",level:'dificil',diff:{ca:'★★★ Difícil',es:'★★★ Difícil'},dur:{ca:'50 min',es:'50 min'},ageLabel:{ca:'15+ anys',es:'15+ años'},title:{ca:'Agència Fantasma',es:'Agencia Fantasma'},desc:{ca:'Espionatge · Codis · Mission Impossible',es:'Espionaje · Códigos · Mission Impossible'},synopsis:{ca:"Sou agents d'elit. Un virus robarà tots els secrets del món en 60 minuts. Neutralitzeu l'amenaça.",es:"Sois agentes de élite. Un virus robará todos los secretos del mundo en 60 minutos. Neutralizad la amenaza."},phases:[{name:{ca:'INFILTRACIÓ',es:'INFILTRACIÓN'},narrativeTitle:{ca:'Accés a la base',es:'Acceso a la base'},narrativeText:{ca:"Codi César (desplaçament 3): 'ROLDQR'. Desxifreu-lo.",es:"Código César (desplazamiento 3): 'ROLDQR'. Descifradlo."},enigma:{ca:"Codi César desplaçament -3: ROLDQR",es:"Código César desplazamiento -3: ROLDQR"},answer:'OLIANO',hint:{ca:'R-3=O...',es:'R-3=O...'},points:100},{name:{ca:'EL VIRUS',es:'EL VIRUS'},narrativeTitle:{ca:"Anatomia de l'atac",es:'Anatomía del ataque'},narrativeText:{ca:"Hash: primer primer entre 50-60 × 8 bits + 1971.",es:"Hash: primer primo entre 50-60 × 8 bits + 1971."},enigma:{ca:"El major primer entre 50 i 60 és 59. 59×8+1971=?",es:"El mayor primo entre 50 y 60 es 59. 59×8+1971=?"},answer:'2443',hint:{ca:'59×8=472. 472+1971=?',es:'59×8=472. 472+1971=?'},mission:{ca:"El conserge és el contacte. Digueu-li 'L'àguila ha aterrat'.",es:"El conserje es el contacto. Decidle 'El águila ha aterrizado'."},missionIcon:'🔌',points:150},{name:{ca:'NEUTRALITZACIÓ',es:'NEUTRALIZACIÓN'},narrativeTitle:{ca:'Compte enrere',es:'Cuenta atrás'},narrativeText:{ca:"Seqüència Fibonacci: 0,1,1,2,3,5,8,13,21,34. Suma termes 7,8,9.",es:"Secuencia Fibonacci: 0,1,1,2,3,5,8,13,21,34. Suma términos 7,8,9."},enigma:{ca:"Termes 7,8,9 (des de 0): 13+21+34=?",es:"Términos 7,8,9 (desde 0): 13+21+34=?"},answer:'68',hint:{ca:'13+21+34=68',es:'13+21+34=68'},points:200,isFinal:true}]},
  {id:'circus',emoji:'🎪',color:'#ff0066',bg:'radial-gradient(ellipse at 50% 50%,#200010,#050005)',font:"'Creepster',cursive",level:'dificil',diff:{ca:'★★★ Difícil',es:'★★★ Difícil'},dur:{ca:'50 min',es:'50 min'},ageLabel:{ca:'15+ anys',es:'15+ años'},title:{ca:'Circ del Fi del Món',es:'Circo del Fin del Mundo'},desc:{ca:'Misteri fosc · Suspens · Enigmes',es:'Misterio oscuro · Suspense · Enigmas'},synopsis:{ca:"El circ va arribar una nit de tempesta. Al matí, tothom havia desaparegut. El pallasso: 'Per sortir, completeu els tres actes.'",es:"El circo llegó una noche de tormenta. Al día siguiente, todos habían desaparecido. El payaso: 'Para salir, completad los tres actos.'"},phases:[{name:{ca:'ACTE I',es:'ACTO I'},narrativeTitle:{ca:'El mag us desafia',es:'El mago os desafía'},narrativeText:{ca:"Lletres de MÀGIA(5) × cartes baralla espanyola(40) + nombre de la bèstia.",es:"Letras de MAGIA(5) × cartas baraja española(40) + número de la bestia."},enigma:{ca:"5×40=200. Nombre de la bèstia (Apocalipsi)=666. Resultat?",es:"5×40=200. Número de la bestia (Apocalipsis)=666. ¿Resultado?"},answer:'866',hint:{ca:'200+666=?',es:'200+666=?'},points:100},{name:{ca:'ACTE II',es:'ACTO II'},narrativeTitle:{ca:'La trapecista sense cara',es:'La trapecista sin cara'},narrativeText:{ca:"h=80m, g=10m/s². Velocitat=√(2gh). Codi.",es:"h=80m, g=10m/s². Velocidad=√(2gh). Código."},enigma:{ca:"v=√(2×10×80)=√1600=?",es:"v=√(2×10×80)=√1600=?"},answer:'40',hint:{ca:'√1600=40',es:'√1600=40'},mission:{ca:"Programa amagat a la taquilla nº13 o sota el graó de l'entrada.",es:"Programa oculto en la taquilla nº13 o bajo el escalón de la entrada."},missionIcon:'🎭',points:150},{name:{ca:'ACTE III',es:'ACTO III'},narrativeTitle:{ca:'El pallasso final',es:'El payaso final'},narrativeText:{ca:"El pallasso: 'Un últim endevinall i sereu lliures.'",es:"El payaso: 'Un último acertijo y seréis libres.'"},enigma:{ca:"Com més en treus, més gran sóc. Què sóc?",es:"Cuantas más quitas, más grande soy. ¿Qué soy?"},answer:'forat',hint:{ca:'Creix quan li treus material',es:'Crece cuando le quitas material'},points:200,isFinal:true}]},
  {id:'jungle',emoji:'🌿',color:'#2ecc71',bg:'radial-gradient(ellipse at 40% 40%,#001500,#000500)',font:"'Rajdhani',sans-serif",level:'medio',diff:{ca:'★★ Mitjà',es:'★★ Medio'},dur:{ca:'40 min',es:'40 min'},ageLabel:{ca:'12-15 anys',es:'12-15 años'},title:{ca:'Selva Prohibida',es:'Selva Prohibida'},desc:{ca:'Supervivència · Tribus · Misteri',es:'Supervivencia · Tribus · Misterio'},synopsis:{ca:"Una tribu ancestral us ofereix ajuda si supereu tres proves de saviesa.",es:"Una tribu ancestral os ofrece ayuda si superáis tres pruebas de sabiduría."},phases:[{name:{ca:'PROVA 1',es:'PRUEBA 1'},narrativeTitle:{ca:'El xaman parla',es:'El chamán habla'},narrativeText:{ca:"Dues gerres: 3L i 5L. Mesureu exactament 4L.",es:"Dos vasijas: 3L y 5L. Medid exactamente 4L."},enigma:{ca:"Omple 5L→aboca 3L (queden 2L)→buida 3L→passa 2L→omple 5L→aboca 1L. Quants litres queden a la de 5L?",es:"Llena 5L→vierte 3L (quedan 2L)→vacía 3L→pasa 2L→llena 5L→vierte 1L. ¿Cuántos litros quedan en la de 5L?"},answer:'4',hint:{ca:'Segueix els passos',es:'Sigue los pasos'},points:100},{name:{ca:'PROVA 2',es:'PRUEBA 2'},narrativeTitle:{ca:"El consell d'ancians",es:'El consejo de ancianos'},narrativeText:{ca:"Jaguar=7, Serp=3, Àguila=12, Granota=2, Mico=5.",es:"Jaguar=7, Serpiente=3, Águila=12, Rana=2, Mono=5."},enigma:{ca:"(Jaguar×Granota)+(Àguila−Mico)×Serp=?",es:"(Jaguar×Rana)+(Águila−Mono)×Serpiente=?"},answer:'35',hint:{ca:'(7×2)+(12-5)×3=14+21=35',es:'(7×2)+(12-5)×3=14+21=35'},mission:{ca:"La 'ploma sagrada' és a la sala de direcció. Demaneu la 'prova de la selva'.",es:"La 'pluma sagrada' está en la sala de dirección. Pedid la 'prueba de la selva'."},missionIcon:'🦅',points:150},{name:{ca:'PROVA 3',es:'PRUEBA 3'},narrativeTitle:{ca:'El cor de la selva',es:'El corazón de la selva'},narrativeText:{ca:"Arbre: creix 2m/any des d'1m. Cada 3 anys perd el 10%. Alçada als 10 anys?",es:"Árbol: crece 2m/año desde 1m. Cada 3 años pierde el 10%. ¿Altura a los 10 años?"},enigma:{ca:"Any3:7→6,3 | Any6:12,3→11,07 | Any9:17,07→15,36 | Any10:≈17",es:"Año3:7→6,3 | Año6:12,3→11,07 | Año9:17,07→15,36 | Año10:≈17"},answer:'17',hint:{ca:'Aprox. 15-17m, acceptem qualsevol valor',es:'Aprox. 15-17m, aceptamos cualquier valor'},points:200,isFinal:true}]},
  {id:'instituto',emoji:'🏫',color:'#e67e22',bg:'radial-gradient(ellipse at 50% 50%,#1f1000,#080400)',font:"'Special Elite',cursive",level:'medio',diff:{ca:'★★ Mitjà',es:'★★ Medio'},dur:{ca:'45 min',es:'45 min'},ageLabel:{ca:'12-15 anys',es:'12-15 años'},title:{ca:"L'Institut Maleït",es:'El Instituto Maldito'},desc:{ca:'Terror · La vostra escola · Secrets',es:'Terror · Vuestra escuela · Secretos'},synopsis:{ca:"Quelcom estrany va passar al vostre institut durant la nit. Els passadissos xiuxiuegen noms.",es:"Algo extraño pasó en vuestro instituto durante la noche. Los pasillos susurran nombres."},phases:[{name:{ca:'EL DESPERTAR',es:'EL DESPERTAR'},narrativeTitle:{ca:'Els passadissos parlen',es:'Los pasillos hablan'},narrativeText:{ca:"A la pissarra: 'El primer secret és on els números van sense descans.'",es:"En la pizarra: 'El primer secreto está donde los números van sin descanso.'"},enigma:{ca:"Número de l'aula de Matemàtiques + número de la vostra aula. (El professor ho sap!)",es:"Número del aula de Matemáticas + número de vuestra aula. (¡El profesor lo sabe!)"},answer:'VARIABLE',hint:{ca:"Pregunteu al professor!",es:"¡Preguntad al profesor!"},points:100},{name:{ca:'LA SALA PROHIBIDA',es:'LA SALA PROHIBIDA'},narrativeTitle:{ca:'Despatx del director',es:'Despacho del director'},narrativeText:{ca:"'El codi és l'any de fundació de l'institut + nombre d'alumnes ÷ 10.'",es:"'El código es el año de fundación del instituto + número de alumnos ÷ 10.'"},enigma:{ca:"Any de fundació + alumnes ÷ 10. (Pregunteu!)",es:"Año de fundación + alumnos ÷ 10. (¡Preguntad!)"},answer:'VARIABLE',hint:{ca:"Web de l'institut.",es:"Web del instituto."},mission:{ca:"Aneu a secretaria i pregunteu per 'l'expedient de l'institut'.",es:"Id a secretaría y preguntad por 'el expediente del instituto'."},missionIcon:'📋',points:150},{name:{ca:'EL SECRET FINAL',es:'EL SECRETO FINAL'},narrativeTitle:{ca:'El que ningú sap',es:'Lo que nadie sabe'},narrativeText:{ca:"Al lloc més profund hi ha una caixa. Codi final.",es:"En el lugar más profundo hay una caja. Código final."},enigma:{ca:"Nombre de professors × nombre d'assignatures d'aquest curs.",es:"Número de profesores × número de asignaturas de este curso."},answer:'VARIABLE',hint:{ca:"Pregunteu al professor!",es:"¡Preguntad al profesor!"},points:200,isFinal:true}]},
  {id:'teachers',emoji:'👩‍🏫',color:'#1abc9c',bg:'radial-gradient(ellipse at 60% 40%,#001810,#020805)',font:"'Rajdhani',sans-serif",level:'medio',diff:{ca:'★ Fàcil-Mitjà',es:'★ Fácil-Medio'},dur:{ca:'35 min',es:'35 min'},ageLabel:{ca:'Professors',es:'Profesores'},title:{ca:'Atrapats a la Sala de Professors',es:'Atrapados en la Sala de Profesores'},desc:{ca:'Per a professors · Humor · Camaraderia',es:'Para profesores · Humor · Camaradería'},synopsis:{ca:"Els professors queden atrapats durant el claustre. Han de resoldre enigmes per sortir.",es:"Los profesores quedan atrapados durante el claustro. Deben resolver enigmas para salir."},phases:[{name:{ca:'EL CLAUSTRE',es:'EL CLAUSTRO'},narrativeTitle:{ca:'La reunió que no acaba',es:'La reunión que nunca acaba'},narrativeText:{ca:"Les portes estan tancades. Nota: 'Demostreu que mereixeu ser professors.'",es:"Las puertas están cerradas. Nota: 'Demostrad que merecéis ser llamados docentes.'"},enigma:{ca:"Intel·ligències Múltiples (Gardner, 1983). Quantes en va identificar originalment?",es:"Inteligencias Múltiples (Gardner, 1983). ¿Cuántas identificó originalmente?"},answer:'7',hint:{ca:'Musical, Cinestèsica, Lògico-matemàtica, Lingüística, Espacial, Interpersonal, Intrapersonal',es:'Musical, Kinestésica, Lógico-matemática, Lingüística, Espacial, Interpersonal, Intrapersonal'},points:100},{name:{ca:'ELS EXPEDIENTS',es:'LOS EXPEDIENTES'},narrativeTitle:{ca:'Secrets del claustre',es:'Secretos del claustro'},narrativeText:{ca:"Diferència d'anys entre el professor més veterà i el més nou.",es:"Diferencia de años entre el profesor más veterano y el más nuevo."},enigma:{ca:"Anys del professor més veterà MENYS anys del professor més nou. (Valors reals del claustre.)",es:"Años del profesor más veterano MENOS años del profesor más nuevo. (Valores reales del claustro.)"},answer:'VARIABLE',hint:{ca:"Pregunteu als companys!",es:"¡Preguntad a los compañeros!"},mission:{ca:"Un/a professor/a ha de buscar un alumne al passadís amb un sobre amb el símbol 👩‍🏫.",es:"Un/a profesor/a debe buscar a un alumno en el pasillo con un sobre con el símbolo 👩‍🏫."},missionIcon:'👦',points:150},{name:{ca:"L'EXAMEN FINAL",es:'EL EXAMEN FINAL'},narrativeTitle:{ca:"L'examen dels professors",es:'El examen de los profesores'},narrativeText:{ca:"Examen de 20 preguntes de 0,5 punts. Nota mínima 5.",es:"Examen de 20 preguntas de 0,5 puntos. Nota mínima 5."},enigma:{ca:"Per treure un 5, quantes preguntes cal respondre bé? (0,5 pts cada una.)",es:"Para sacar un 5, ¿cuántas preguntas deben responderse bien? (0,5 pts cada una.)"},answer:'10',hint:{ca:'5÷0,5=10',es:'5÷0,5=10'},points:200,isFinal:true}]},

  // ─────────────────────────────────────────────────────────────────
  //  BLOC 3 · EXPERT  (16+ / batxillerat)  ⭐⭐⭐⭐
  // ─────────────────────────────────────────────────────────────────

  {
    id:'quantum', emoji:'⚛️',
    color:'#818cf8', bg:'radial-gradient(ellipse at 50% 30%,#0a0020,#000010)',
    font:"'Orbitron',sans-serif",
    level:'expert',
    diff:{ca:'★★★★★ Màxim',es:'★★★★★ Máximo'},
    dur:{ca:'60 min',es:'60 min'},
    ageLabel:{ca:'17+ anys',es:'17+ años'},
    title:{ca:'Laboratori Quàntic',es:'Laboratorio Cuántico'},
    desc:{ca:'Física quàntica · Criptografia · IA',es:'Física cuántica · Criptografía · IA'},
    synopsis:{ca:"Un experiment de física quàntica ha sortit malament. El laboratori s'ha tancat sol i la IA interna ha entrat en mode de quarantena. Teniu 60 minuts per resoldre tres paradoxes quàntiques i restaurar el sistema abans que la IA esborri totes les dades.",es:"Un experimento de física cuántica ha salido mal. El laboratorio se ha cerrado solo y la IA interna ha entrado en modo cuarentena. Tenéis 60 minutos para resolver tres paradojas cuánticas y restaurar el sistema antes de que la IA borre todos los datos."},
    phases:[
      {name:{ca:'PARADOXA 1',es:'PARADOJA 1'},
       narrativeTitle:{ca:'El gat de Schrödinger',es:'El gato de Schrödinger'},
       narrativeText:{ca:"La IA demana que demostreu que enteneu la superposició quàntica. A la pantalla apareix: 'Si un foton pot estar en dos estats alhora (0 i 1), i tenim 3 fotons independents, quants estats simultanis totals existeixen? (2^n)'",es:"La IA pide que demostréis que entendéis la superposición cuántica. En la pantalla aparece: 'Si un fotón puede estar en dos estados a la vez (0 y 1), y tenemos 3 fotones independientes, ¿cuántos estados simultáneos totales existen? (2^n)'"},
       enigma:{ca:"Quants estats simultanis pot tenir un sistema de 3 qubits? (Formula: 2 elevat a n, on n=nombre de qubits.)",es:"¿Cuántos estados simultáneos puede tener un sistema de 3 qubits? (Fórmula: 2 elevado a n, donde n=número de qubits.)"},
       answer:'8',hint:{ca:'2³=2×2×2=8',es:'2³=2×2×2=8'},points:100},
      {name:{ca:'PARADOXA 2',es:'PARADOJA 2'},
       narrativeTitle:{ca:"L'entrellaçament quàntic",es:'El entrelazamiento cuántico'},
       narrativeText:{ca:"La IA mostra una seqüència de nombres complexos. Per desxifrar el missatge ocult cal calcular el mòdul d'un nombre complex. El nombre és z = 3 + 4i. El mòdul és |z| = √(a²+b²) on a=3 (part real) i b=4 (part imaginària). El mòdul és el codi d'accés al segon nivell.",es:"La IA muestra una secuencia de números complejos. Para descifrar el mensaje oculto hay que calcular el módulo de un número complejo. El número es z = 3 + 4i. El módulo es |z| = √(a²+b²) donde a=3 (parte real) y b=4 (parte imaginaria). El módulo es el código de acceso al segundo nivel."},
       enigma:{ca:"|z| = √(3²+4²) = √(9+16) = √25 = ?",es:"|z| = √(3²+4²) = √(9+16) = √25 = ?"},
       answer:'5',hint:{ca:'√25=5',es:'√25=5'},
       mission:{ca:"Un membre ha d'anar al laboratori de física/química i preguntar al professor per 'l'experiment quàntic 5B'. Tindrà preparada la pista del tercer nivell.",es:"Un miembro debe ir al laboratorio de física/química y preguntar al profesor por 'el experimento cuántico 5B'. Tendrá preparada la pista del tercer nivel."},missionIcon:'🔬',points:150},
      {name:{ca:'PARADOXA 3',es:'PARADOJA 3'},
       narrativeTitle:{ca:'La decoherència final',es:'La decoherencia final'},
       narrativeText:{ca:"L'última paradoxa: la IA ha encriptat el codi de reinici amb l'algorisme RSA bàsic. Coneixeu p=3, q=7 (nombres primers). La clau pública és n=p×q i φ(n)=(p-1)×(q-1). Heu de trobar φ(n) per calcular la clau privada. φ(n) és el vostre codi final.",es:"La última paradoja: la IA ha encriptado el código de reinicio con el algoritmo RSA básico. Conocéis p=3, q=7 (números primos). La clave pública es n=p×q y φ(n)=(p-1)×(q-1). Debéis encontrar φ(n) para calcular la clave privada. φ(n) es vuestro código final."},
       enigma:{ca:"φ(n) = (p-1)×(q-1) amb p=3, q=7. Calculeu φ(n).",es:"φ(n) = (p-1)×(q-1) con p=3, q=7. Calculad φ(n)."},
       answer:'12',hint:{ca:'(3-1)×(7-1)=2×6=12',es:'(3-1)×(7-1)=2×6=12'},points:200,isFinal:true}
    ]
  },

  {
    id:'blackhole', emoji:'🌌',
    color:'#c084fc', bg:'radial-gradient(ellipse at 50% 50%,#0d0020,#000005)',
    font:"'Orbitron',sans-serif",
    level:'expert',
    diff:{ca:'★★★★★ Màxim',es:'★★★★★ Máximo'},
    dur:{ca:'65 min',es:'65 min'},
    ageLabel:{ca:'17+ anys',es:'17+ años'},
    title:{ca:'Al Límit del Forat Negre',es:'Al Límite del Agujero Negro'},
    desc:{ca:'Astrofísica · Relativitat · Supervivència',es:'Astrofísica · Relatividad · Supervivencia'},
    synopsis:{ca:"La vostra nau ha quedat atrapada a l'horitzó d'esdeveniments d'un forat negre. Cada segon que passa, el temps s'alenteix. L'única sortida és resoldre tres equacions d'astrofísica que activen el propulsor d'emergència.",es:"Vuestra nave ha quedado atrapada en el horizonte de eventos de un agujero negro. Cada segundo que pasa, el tiempo se ralentiza. La única salida es resolver tres ecuaciones de astrofísica que activan el propulsor de emergencia."},
    phases:[
      {name:{ca:'DILATACIÓ TEMPORAL',es:'DILATACIÓN TEMPORAL'},
       narrativeTitle:{ca:'El temps s\'alenteix',es:'El tiempo se ralentiza'},
       narrativeText:{ca:"La relativitat especial d'Einstein prediu que el temps passa més lent a gran velocitat. Si la vostra nau viatja al 60% de la velocitat de la llum (v=0,6c), el factor de Lorentz és γ=1/√(1-v²/c²). Necessiteu calcular γ per calibrar els rellotges.",es:"La relatividad especial de Einstein predice que el tiempo pasa más lento a gran velocidad. Si vuestra nave viaja al 60% de la velocidad de la luz (v=0,6c), el factor de Lorentz es γ=1/√(1-v²/c²). Necesitáis calcular γ para calibrar los relojes."},
       enigma:{ca:"γ=1/√(1-(0,6)²)=1/√(1-0,36)=1/√0,64=1/0,8=? (Doneu el resultat com a fracció simplificada o decimal)",es:"γ=1/√(1-(0,6)²)=1/√(1-0,36)=1/√0,64=1/0,8=? (Dad el resultado como fracción simplificada o decimal)"},
       answer:'1.25',hint:{ca:'1/0,8=1,25 o 5/4',es:'1/0,8=1,25 o 5/4'},points:100},
      {name:{ca:'RADI DE SCHWARZSCHILD',es:'RADIO DE SCHWARZSCHILD'},
       narrativeTitle:{ca:'El punt de no retorn',es:'El punto de no retorno'},
       narrativeText:{ca:"El radi de Schwarzschild (Rs) d'un forat negre és: Rs=2GM/c². Per al Sol: G=6,67×10⁻¹¹, M(Sol)=2×10³⁰ kg, c=3×10⁸ m/s. Per calcular el codi d'emergència, necessiteu el valor numèric de 2GM del Sol (sense dividir per c²). Expresseu-ho en notació científica i agafeu el primer dígit del coeficient.",es:"El radio de Schwarzschild (Rs) de un agujero negro es: Rs=2GM/c². Para el Sol: G=6,67×10⁻¹¹, M(Sol)=2×10³⁰ kg, c=3×10⁸ m/s. Para calcular el código de emergencia, necesitáis el valor numérico de 2GM del Sol (sin dividir por c²). Expresadlo en notación científica y tomad el primer dígito del coeficiente."},
       enigma:{ca:"2×G×M = 2×6,67×10⁻¹¹×2×10³⁰ = ? ×10^? El primer dígit del coeficient és el codi.",es:"2×G×M = 2×6,67×10⁻¹¹×2×10³⁰ = ? ×10^? El primer dígito del coeficiente es el código."},
       answer:'2',hint:{ca:'2×6,67×2=26,68. En notació científica: 2,668×10¹ → primer dígit: 2',es:'2×6,67×2=26,68. En notación científica: 2,668×10¹ → primer dígito: 2'},
       mission:{ca:"Un membre ha de trobar el professor de Física i preguntar-li per 'l'equació de Hawking'. Ell/ella té preparada la pista final.",es:"Un miembro debe encontrar al profesor de Física y preguntarle por 'la ecuación de Hawking'. Él/ella tiene preparada la pista final."},missionIcon:'🌠',points:150},
      {name:{ca:'PROPULSOR D\'EMERGÈNCIA',es:'PROPULSOR DE EMERGENCIA'},
       narrativeTitle:{ca:'Última oportunitat',es:'Última oportunidad'},
       narrativeText:{ca:"El propulsor necessita saber la velocitat d'escapament del forat negre (l'horitzó). La velocitat d'escapament ve=√(2GM/R). Per a un forat negre de massa 10 masses solars i radi 30 km: ve=c (velocitat de la llum en m/s). Però per calcular el codi de llançament, cal el quocient entre la velocitat de la llum (c=3×10⁸ m/s) i la velocitat del so a l'aire (340 m/s). Arrodoneix a l'enter.",es:"El propulsor necesita saber la velocidad de escape del agujero negro (en el horizonte). La velocidad de escape ve=√(2GM/R). Para un agujero negro de masa 10 masas solares y radio 30 km: ve=c (velocidad de la luz en m/s). Pero para calcular el código de lanzamiento, se necesita el cociente entre la velocidad de la luz (c=3×10⁸ m/s) y la velocidad del sonido en el aire (340 m/s). Redondea al entero."},
       enigma:{ca:"(3×10⁸) ÷ 340 = ? (Arrodoneix a l'enter més proper.)",es:"(3×10⁸) ÷ 340 = ? (Redondea al entero más cercano.)"},
       answer:'882353',hint:{ca:'300000000÷340≈882353',es:'300000000÷340≈882353'},points:200,isFinal:true}
    ]
  },

  {
    id:'bioterror', emoji:'🧬',
    color:'#4ade80', bg:'radial-gradient(ellipse at 60% 40%,#001a08,#020a02)',
    font:"'Special Elite',cursive",
    level:'expert',
    diff:{ca:'★★★★★ Màxim',es:'★★★★★ Máximo'},
    dur:{ca:'60 min',es:'60 min'},
    ageLabel:{ca:'17+ anys',es:'17+ años'},
    title:{ca:'Codi Genètic',es:'Código Genético'},
    desc:{ca:'Biologia molecular · Genètica · Bioterrorisme',es:'Biología molecular · Genética · Bioterrorismo'},
    synopsis:{ca:"Un laboratori de biotecnologia ha estat infiltrat. Un agent ha modificat el codi genètic d'un virus inofensiu per convertir-lo en patogen. Sou l'equip d'investigació d'última línia. Heu de desxifrar les seqüències, identificar la mutació i crear l'antídot.",es:"Un laboratorio de biotecnología ha sido infiltrado. Un agente ha modificado el código genético de un virus inofensivo para convertirlo en patógeno. Sois el equipo de investigación de última línea. Debéis descifrar las secuencias, identificar la mutación y crear el antídoto."},
    phases:[
      {name:{ca:'SEQÜÈNCIA ADN',es:'SECUENCIA ADN'},
       narrativeTitle:{ca:'El genoma modificat',es:'El genoma modificado'},
       narrativeText:{ca:"L'ADN original del virus inofensiu és: 5'-ATGCGATCGAT-3'. L'ADN modificat és: 5'-ATGCGATCGCT-3'. Per sintetitzar l'antídot, primer cal identificar la posició exacta de la mutació (comptant des del nucl. 1 = A). Llavors cal construir la cadena complementària del segment mutat: A s'uneix a T, G s'uneix a C.",es:"El ADN original del virus inofensivo es: 5'-ATGCGATCGAT-3'. El ADN modificado es: 5'-ATGCGATCGCT-3'. Para sintetizar el antídoto, primero hay que identificar la posición exacta de la mutación (contando desde el nucl. 1 = A). Luego hay que construir la cadena complementaria del segmento mutado: A se une a T, G se une a C."},
       enigma:{ca:"En quina posició hi ha la mutació? (Compta base per base: original AT-GC-GA-TC-GA-T vs modificat AT-GC-GA-TC-GC-T)",es:"¿En qué posición está la mutación? (Cuenta base por base: original AT-GC-GA-TC-GA-T vs modificado AT-GC-GA-TC-GC-T)"},
       answer:'10',hint:{ca:'ATGCGATCG-A-T vs ATGCGATCG-C-T → posició 10',es:'ATGCGATCG-A-T vs ATGCGATCG-C-T → posición 10'},points:100},
      {name:{ca:'SÍNTESI PROTEICA',es:'SÍNTESIS PROTEICA'},
       narrativeTitle:{ca:'El codi de les proteïnes',es:'El código de las proteínas'},
       narrativeText:{ca:"Per crear l'antídot cal sintetitzar una proteïna específica. L'ARN missatger (ARNm) es transcriu de l'ADN substituint T per U. Donada la seqüència d'ADN: 5'-TACGTA-3', quina és la seqüència d'ARNm resultant? (Recordeu: A→U, T→A, G→C, C→G en la transcripció.)",es:"Para crear el antídoto hay que sintetizar una proteína específica. El ARN mensajero (ARNm) se transcribe del ADN sustituyendo T por U. Dada la secuencia de ADN: 5'-TACGTA-3', ¿cuál es la secuencia de ARNm resultante? (Recordad: A→U, T→A, G→C, C→G en la transcripción.)"},
       enigma:{ca:"ADN 5'-TACGTA-3'. Transcripció a ARNm: cada base de l'ADN s'aparella amb el seu complement en l'ARNm (A-U, T-A, G-C, C-G).",es:"ADN 5'-TACGTA-3'. Transcripción a ARNm: cada base del ADN se empareja con su complemento en el ARNm (A-U, T-A, G-C, C-G)."},
       answer:'AUGCAU',hint:{ca:'T→A, A→U, C→G, G→C, T→A, A→U → AUGCAU',es:'T→A, A→U, C→G, G→C, T→A, A→U → AUGCAU'},
       mission:{ca:"Un membre ha d'anar al laboratori de biologia i buscar el 'Protocol Antídot 7'. El professor de Biologia el té preparat.",es:"Un miembro debe ir al laboratorio de biología y buscar el 'Protocolo Antídoto 7'. El profesor de Biología lo tiene preparado."},missionIcon:'🧪',points:150},
      {name:{ca:"L'ANTÍDOT",es:'EL ANTÍDOTO'},
       narrativeTitle:{ca:'La fórmula final',es:'La fórmula final'},
       narrativeText:{ca:"L'antídot necessita una concentració exacta. La llei de Beer-Lambert diu: A = ε × c × l, on A=absorbància (0,6), ε=coeficient d'extinció molar (120 L/mol·cm), l=longitud de pas (0,5 cm). Heu de calcular c (concentració en mol/L) per preparar la solució.",es:"El antídoto necesita una concentración exacta. La ley de Beer-Lambert dice: A = ε × c × l, donde A=absorbancia (0,6), ε=coeficiente de extinción molar (120 L/mol·cm), l=longitud de paso (0,5 cm). Debéis calcular c (concentración en mol/L) para preparar la solución."},
       enigma:{ca:"A=ε×c×l → c=A/(ε×l)=0,6/(120×0,5)=? mol/L",es:"A=ε×c×l → c=A/(ε×l)=0,6/(120×0,5)=? mol/L"},
       answer:'0.01',hint:{ca:'0,6÷(120×0,5)=0,6÷60=0,01',es:'0,6÷(120×0,5)=0,6÷60=0,01'},points:200,isFinal:true}
    ]
  },

  {
    id:'hacking', emoji:'💻',
    color:'#34d399', bg:'radial-gradient(ellipse at 40% 60%,#001a0a,#000805)',
    font:"'Orbitron',sans-serif",
    level:'expert',
    diff:{ca:'★★★★ Expert',es:'★★★★ Experto'},
    dur:{ca:'55 min',es:'55 min'},
    ageLabel:{ca:'16+ anys',es:'16+ años'},
    title:{ca:'Infiltració Zero-Day',es:'Infiltración Zero-Day'},
    desc:{ca:'Ciberseguretat · Criptografia · Hacking ètic',es:'Ciberseguridad · Criptografía · Hacking ético'},
    synopsis:{ca:"Sou hackers ètics contractats per una gran empresa. El seu sistema ha estat compromès per un atac zero-day. Teniu accés als logs del servidor però estan parcialment encriptats. Heu de trobar la vulnerabilitat, identificar l'atacant i tancar la bretxa de seguretat.",es:"Sois hackers éticos contratados por una gran empresa. Su sistema ha sido comprometido por un ataque zero-day. Tenéis acceso a los logs del servidor pero están parcialmente encriptados. Debéis encontrar la vulnerabilidad, identificar al atacante y cerrar la brecha de seguridad."},
    phases:[
      {name:{ca:'ELS LOGS',es:'LOS LOGS'},
       narrativeTitle:{ca:'Rastres digitals',es:'Rastros digitales'},
       narrativeText:{ca:"El log del servidor mostra una IP sospitosa en notació hexadecimal: C0.A8.01.01. Per identificar l'atacant cal convertir cada octet hexadecimal a decimal. C=12, 0=0 → C0 en hex. Recorda: en hexadecimal, C=12. Per tant C0 hex = (12×16)+0 = 192 decimal.",es:"El log del servidor muestra una IP sospechosa en notación hexadecimal: C0.A8.01.01. Para identificar al atacante hay que convertir cada octeto hexadecimal a decimal. C=12, 0=0 → C0 en hex. Recuerda: en hexadecimal, C=12. Por tanto C0 hex = (12×16)+0 = 192 decimal."},
       enigma:{ca:"Convertiu C0.A8.01.01 de hexadecimal a decimal. Quin és el segon octet (A8) en decimal?",es:"Convertid C0.A8.01.01 de hexadecimal a decimal. ¿Cuál es el segundo octeto (A8) en decimal?"},
       answer:'168',hint:{ca:'A=10, 8=8. A8 hex=(10×16)+8=160+8=168',es:'A=10, 8=8. A8 hex=(10×16)+8=160+8=168'},points:100},
      {name:{ca:'EL PAYLOAD',es:'EL PAYLOAD'},
       narrativeTitle:{ca:"L'atac desxifrat",es:'El ataque descifrado'},
       narrativeText:{ca:"El payload de l'atac estava encriptat en Base64. La cadena descodificada és una funció hash MD5. El hash d'una contrasenya robada és: 5f4dcc3b5aa765d61d8327deb882cf99. Sabeu que és el hash MD5 d'una paraula anglesa de 8 lletres, molt comuna, que significa 'paraula de pas' en anglès.",es:"El payload del ataque estaba encriptado en Base64. La cadena decodificada es una función hash MD5. El hash de una contraseña robada es: 5f4dcc3b5aa765d61d8327deb882cf99. Sabéis que es el hash MD5 de una palabra inglesa de 8 letras, muy común, que significa 'palabra de paso' en inglés."},
       enigma:{ca:"Quin és el hash MD5 de 'password'? (Hint: aquest hash famós el trobareu als diccionaris de hacking.)",es:"¿Cuál es el hash MD5 de 'password'? (Hint: este hash famoso lo encontraréis en los diccionarios de hacking.)"},
       answer:'password',hint:{ca:"La paraula en anglès que significa 'contrasenya' és... password",es:"La palabra en inglés que significa 'contraseña' es... password"},
       mission:{ca:"Un membre ha de cercar a internet '5f4dcc3b5aa765d61d8327deb882cf99 md5 decrypt' per confirmar la resposta.",es:"Un miembro debe buscar en internet '5f4dcc3b5aa765d61d8327deb882cf99 md5 decrypt' para confirmar la respuesta."},missionIcon:'🔓',points:150},
      {name:{ca:'PATCH DE SEGURETAT',es:'PARCHE DE SEGURIDAD'},
       narrativeTitle:{ca:'Tancar la bretxa',es:'Cerrar la brecha'},
       narrativeText:{ca:"Per tancar la vulnerabilitat cal aplicar un patch. El número de versió del patch segueix el protocol SEMVER: MAJOR.MINOR.PATCH. L'actual és 2.14.3. S'han corregit: 1 vulnerabilitat crítica (MAJOR no canvia), 0 noves funcionalitats (MINOR no canvia), es corregeix 1 bug de seguretat. Quin és el nou número de versió complet?",es:"Para cerrar la vulnerabilidad hay que aplicar un patch. El número de versión del patch sigue el protocolo SEMVER: MAJOR.MINOR.PATCH. El actual es 2.14.3. Se han corregido: 1 vulnerabilidad crítica (MAJOR no cambia), 0 nuevas funcionalidades (MINOR no cambia), se corrige 1 bug de seguridad. ¿Cuál es el nuevo número de versión completo?"},
       enigma:{ca:"Versió actual: 2.14.3. S'ha corregit 1 bug (PATCH +1). Nova versió?",es:"Versión actual: 2.14.3. Se ha corregido 1 bug (PATCH +1). ¿Nueva versión?"},
       answer:'2.14.4',hint:{ca:'Només augmenta PATCH: 3+1=4 → 2.14.4',es:'Solo aumenta PATCH: 3+1=4 → 2.14.4'},points:200,isFinal:true}
    ]
  },

  {
    id:'philosophy', emoji:'🏛️',
    color:'#fbbf24', bg:'radial-gradient(ellipse at 30% 40%,#1a1400,#060500)',
    font:"'Cinzel Decorative',cursive",
    level:'expert',
    diff:{ca:'★★★★ Expert',es:'★★★★ Experto'},
    dur:{ca:'55 min',es:'55 min'},
    ageLabel:{ca:'16+ anys',es:'16+ años'},
    title:{ca:"L'Oracle de Delfos",es:'El Oráculo de Delfos'},
    desc:{ca:'Filosofia · Lògica · Grècia clàssica',es:'Filosofía · Lógica · Grecia clásica'},
    synopsis:{ca:"Heu viatjat a l'antiga Grècia per consultar l'Oracle de Delfos. Però l'Oracle no parla directament: planteja tres dilemes filosòfics que posen a prova el vostre pensament crític, la vostra lògica i el vostre coneixement de la filosofia clàssica. Si responeu bé, us revelarà el secret de la saviesa.",es:"Habéis viajado a la antigua Grecia para consultar al Oráculo de Delfos. Pero el Oráculo no habla directamente: plantea tres dilemas filosóficos que ponen a prueba vuestro pensamiento crítico, vuestra lógica y vuestro conocimiento de la filosofía clásica. Si respondéis bien, os revelará el secreto de la sabiduría."},
    phases:[
      {name:{ca:'DILEMA 1',es:'DILEMA 1'},
       narrativeTitle:{ca:'El paradoxe del mentider',es:'La paradoja del mentiroso'},
       narrativeText:{ca:"L'Oracle planteja la paradoxa de l'Epimenides: Epimenides de Creta va dir 'Tots els cretenses menteixen.' Si Epimenides és cretense, aquesta afirmació és vertadera o falsa? El codi per avançar és la inicial del filòsof grec que va formalitzar la lògica aristotèlica i va establir el principi de no contradicció.",es:"El Oráculo plantea la paradoja de Epiménides: Epimónides de Creta dijo 'Todos los cretenses mienten.' Si Epimónides es cretense, ¿esta afirmación es verdadera o falsa? El código para avanzar es la inicial del filósofo griego que formalizó la lógica aristotélica y estableció el principio de no contradicción."},
       enigma:{ca:"Quin filòsof va escriure els 'Analítics' i va formalitzar la lògica deductiva (silogismes)? Escriu el seu nom complet.",es:"¿Qué filósofo escribió los 'Analíticos' y formalizó la lógica deductiva (silogismos)? Escribe su nombre completo."},
       answer:'Aristòtil',hint:{ca:"Mestre d'Alexandre el Gran, deixeble de Plató.",es:"Maestro de Alejandro Magno, discípulo de Platón."},points:100},
      {name:{ca:'DILEMA 2',es:'DILEMA 2'},
       narrativeTitle:{ca:'La caverna de Plató',es:'La caverna de Platón'},
       narrativeText:{ca:"L'Oracle descriu l'al·legoria de la caverna. Uns presoners encadenats veuen ombres a la paret i les confonen amb la realitat. El filòsof que surt de la caverna i veu el Sol representa el camí cap al coneixement. L'Oracle demana: 'En quina obra de Plató apareix aquesta al·legoria? I en quin llibre (número romà)?' Format de resposta: NomObraLibreRomà",es:"El Oráculo describe la alegoría de la caverna. Unos prisioneros encadenados ven sombras en la pared y las confunden con la realidad. El filósofo que sale de la caverna y ve el Sol representa el camino hacia el conocimiento. El Oráculo pregunta: '¿En qué obra de Platón aparece esta alegoría? ¿Y en qué libro (número romano)?' Formato de respuesta: NombreObraLibroRomano"},
       enigma:{ca:"En quina obra i quin llibre (número romà) apareix l'al·legoria de la caverna de Plató?",es:"¿En qué obra y qué libro (número romano) aparece la alegoría de la caverna de Platón?"},
       answer:'La República VII',hint:{ca:"L'obra és 'La República' (Politeia). L'al·legoria és al Llibre VII.",es:"La obra es 'La República' (Politeia). La alegoría está en el Libro VII."},
       mission:{ca:"Un membre ha de buscar un exemplar de La República (o qualsevol text filosòfic) a la biblioteca i trobar la referència al Llibre VII.",es:"Un miembro debe buscar un ejemplar de La República (o cualquier texto filosófico) en la biblioteca y encontrar la referencia al Libro VII."},missionIcon:'📚',points:150},
      {name:{ca:'DILEMA 3',es:'DILEMA 3'},
       narrativeTitle:{ca:"El secret de l'Oracle",es:'El secreto del Oráculo'},
       narrativeText:{ca:"L'Oracle revela l'últim dilema. Al temple de Delfos hi havia inscrites tres màximes. La més famosa és 'Coneix-te a tu mateix' (Gnôthi seautón). El codi final és el nombre total de màximes inscrites al temple de Delfos multiplicat pel nombre de déus de l'Olimp grec (els dotze olímpics principals).",es:"El Oráculo revela el último dilema. En el templo de Delfos había inscritas tres máximas. La más famosa es 'Conócete a ti mismo' (Gnôthi seautón). El código final es el número total de máximas inscritas en el templo de Delfos multiplicado por el número de dioses del Olimpo griego (los doce olímpicos principales)."},
       enigma:{ca:"Màximes de Delfos × Déus olímpics principals = ? (3 màximes × 12 olímpics)",es:"Máximas de Delfos × Dioses olímpicos principales = ? (3 máximas × 12 olímpicos)"},
       answer:'36',hint:{ca:'3×12=36',es:'3×12=36'},points:200,isFinal:true}
    ]
  }

];

// ═══════════════════════════════════════════════════════════════════
//  EXPORTACIÓ — No modificar aquestes línies
// ═══════════════════════════════════════════════════════════════════

// Per a ús com a mòdul ES (si s'usa amb import/export)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORIES };
}

// Per a ús com a script clàssic (window.STORIES)
if (typeof window !== 'undefined') {
  window.STORIES = STORIES;
}
