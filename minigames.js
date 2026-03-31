/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — MOTOR DE MINIJOCS INTERACTIVOS v3.0
 *  Ahora con juegos reales que retornan HTML interactivo
 * ═══════════════════════════════════════════════════════════════
 */

window.MINIGAMES = {
  
  // ─────────────────────────────────────────────
  //  MAPA DEL TRESOR — SVG Estático pero mejorado
  // ─────────────────────────────────────────────
  treasureMap: function(config = {}) {
    const { paths = 3, finalX = [70, 65], color = '#8B4513', seed = 42 } = config;
    
    function seededRandom(s) {
      let x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    }

    let waypoints = [];
    for (let i = 0; i < paths + 2; i++) {
      waypoints.push({
        x: 10 + seededRandom(seed + i * 7) * 80,
        y: 10 + seededRandom(seed + i * 13) * 80
      });
    }
    waypoints[waypoints.length - 1] = { x: finalX[0], y: finalX[1] };

    const pathD = waypoints.map((p, i) =>
      i === 0 ? `M ${p.x},${p.y}` : `Q ${(waypoints[i-1].x+p.x)/2+seededRandom(seed+i)*10-5},${(waypoints[i-1].y+p.y)/2+seededRandom(seed+i*3)*10-5} ${p.x},${p.y}`
    ).join(' ');

    const islands = Array.from({length: 4}, (_, i) => ({
      x: 15 + seededRandom(seed + i * 17) * 70,
      y: 15 + seededRandom(seed + i * 23) * 70,
      r: 4 + seededRandom(seed + i) * 8
    }));

    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:400px;filter:sepia(0.8) contrast(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.5));border-radius:12px;border:3px solid ${color}60;animation:mapFloat 6s ease-in-out infinite">
      <defs>
        <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"/>
          <feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
        <radialGradient id="xGlow" cx="50%" cy="50%"><stop offset="0%" stop-color="#FFD700" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="100" height="100" fill="#d4b483" filter="url(#paper)"/>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="${color}" stroke-width="0.8" stroke-dasharray="4,2"/>
      
      ${islands.map(il => `<ellipse cx="${il.x}" cy="${il.y}" rx="${il.r}" ry="${il.r*0.7}" fill="#8B6914" opacity="0.4"/>
        <ellipse cx="${il.x}" cy="${il.y}" rx="${il.r*0.6}" ry="${il.r*0.4}" fill="#6B8A3A" opacity="0.5"/>`).join('')}
      
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="2,1" opacity="0.8">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite"/>
      </path>
      
      ${waypoints.slice(0, -1).map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="1.5" fill="${color}" opacity="0.6"/>`).join('')}
      
      <!-- Rosa de los vientos animada -->
      <g transform="translate(88,12)">
        <circle r="6" fill="#d4b483" stroke="${color}" stroke-width="0.5"/>
        <text x="0" y="-3" font-size="3" fill="${color}" text-anchor="middle" font-weight="bold">N</text>
        <path d="M 0,-5 L 1.5,0 L 0,5 L -1.5,0 Z" fill="${color}" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite"/>
        </path>
      </g>
      
      <!-- X animada con brillo -->
      <g transform="translate(${finalX[0]},${finalX[1]})">
        <circle r="6" fill="url(#xGlow)" opacity="0.6">
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="#cc0000" stroke-width="2" stroke-linecap="round"/>
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="#cc0000" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  RODA DE CODIS — Interactiva visualmente
  // ─────────────────────────────────────────────
  cipherWheel: function(config = {}) {
    const { shift = 3, highlightLetter = 'A', color = '#00f5ff' } = config;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const inner = letters.slice(shift) + letters.slice(0, shift);
    
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" 
      style="width:100%;max-width:320px;filter:drop-shadow(0 4px 12px ${color}40)">
      <defs>
        <radialGradient id="grad1"><stop offset="0%" stop-color="${color}20"/><stop offset="100%" stop-color="transparent"/></radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#0a0a1a" stroke="${color}" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="48" fill="url(#grad1)"/>
      
      ${Array.from({length: 26}, (_, i) => {
        const angle = (360/26)*i - 90;
        const rad = angle * Math.PI / 180;
        const x1 = 50 + 42 * Math.cos(rad);
        const y1 = 50 + 42 * Math.sin(rad);
        const x2 = 50 + 28 * Math.cos(rad);
        const y2 = 50 + 28 * Math.sin(rad);
        const xm = 50 + 35 * Math.cos(rad);
        const ym = 50 + 35 * Math.sin(rad);
        const isHL = letters[i] === highlightLetter;
        
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${isHL?2:0.5}" opacity="${isHL?1:0.3}"/>
          <text x="${xm}" y="${ym}" font-size="3.5" fill="${isHL?'#FFD700':color}" text-anchor="middle" dominant-baseline="middle" 
            font-weight="${isHL?'bold':'normal'}" style="font-family:monospace">${letters[i]}</text>
          <text x="${50+20*Math.cos(rad)}" y="${50+20*Math.sin(rad)}" font-size="3" fill="${color}66" text-anchor="middle" dominant-baseline="middle"
            style="font-family:monospace">${inner[i]}</text>`;
      }).join('')}
      
      <circle cx="50" cy="50" r="15" fill="#0a0a1a" stroke="${color}" stroke-width="1"/>
      <text x="50" y="48" font-size="4" fill="${color}" text-anchor="middle" font-family="Orbitron">+${shift}</text>
      <text x="50" y="54" font-size="2.5" fill="${color}80" text-anchor="middle">DESPLAÇAMENT</text>
      
      <!-- Flecha indicadora -->
      <polygon points="50,8 48,12 52,12" fill="${color}"/>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  CIRCUIT PUZZLE — Visual mejorado
  // ─────────────────────────────────────────────
  circuitPuzzle: function(config = {}) {
    const { nodes = 6, color = '#00f5ff', solution = [0,2,4,5] } = config;
    const positions = [[20,20],[60,15],[85,35],[75,65],[45,80],[15,60],[50,45],[30,50],[65,45],[40,25]].slice(0, nodes);
    
    const edges = [];
    for (let i = 0; i < nodes; i++) {
      for (let j = i+1; j < nodes; j++) {
        const dx = positions[i][0]-positions[j][0], dy = positions[i][1]-positions[j][1];
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 50) edges.push([i, j, dist]);
      }
    }
    
    const solEdges = solution.slice(0,-1).map((n,i) => [n, solution[i+1]]);
    
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" 
      style="width:100%;max-width:360px;background:#020210;border-radius:12px;border:2px solid ${color}30">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      
      <!-- Grid animado -->
      ${Array.from({length:10},(_,i)=>`<line x1="${i*10}" y1="0" x2="${i*10}" y2="100" stroke="${color}08" stroke-width="0.3"/>
        <line x1="0" y1="${i*10}" x2="100" y2="${i*10}" stroke="${color}08" stroke-width="0.3"/>`).join('')}
      
      <!-- Conexiones -->
      ${edges.map(([a,b]) => {
        const isSol = solEdges.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
        return `<line x1="${positions[a][0]}" y1="${positions[a][1]}" x2="${positions[b][0]}" y2="${positions[b][1]}"
          stroke="${isSol ? color : color+'15'}" stroke-width="${isSol ? 2 : 0.5}" stroke-linecap="round"
          ${isSol ? `filter="url(#glow)" stroke-dasharray="4,2"` : ''}>
          ${isSol ? '<animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite"/>' : ''}
        </line>`;
      }).join('')}
      
      <!-- Nodos -->
      ${positions.map(([x,y], i) => {
        const isSol = solution.includes(i);
        const isStart = i === solution[0];
        const isEnd = i === solution[solution.length-1];
        
        return `<g>
          <circle cx="${x}" cy="${y}" r="${isSol?6:4}" fill="${isSol?color:'#0a0a1a'}" stroke="${color}" stroke-width="${isSol?2:1}"
            filter="${isSol?'url(#glow)':''}">
            ${isSol ? '<animate attributeName="r" values="'+ (isSol?6:4) + ';' + (isSol?7:4) + ';' + (isSol?6:4) + '" dur="2s" repeatCount="indefinite"/>' : ''}
          </circle>
          ${isStart?`<text x="${x}" y="${y-10}" font-size="4" fill="${color}" text-anchor="middle">INICI</text>`:''}
          ${isEnd?`<text x="${x}" y="${y+10}" font-size="4" fill="${color}" text-anchor="middle">FINAL</text>`:''}
          <text x="${x}" y="${y}" font-size="${isSol?4:3}" fill="${isSol?'#000':color}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${i}</text>
        </g>`;
      }).join('')}
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  PIXEL SECRET — Mejorado con animación
  // ─────────────────────────────────────────────
  pixelSecret: function(config = {}) {
    const { code = '42', color = '#ff6b00', noise = true } = config;
    const GRID = 16;
    const CELL = 100/GRID;
    
    // Generar patrón de dígitos pixelados
    const grid = Array.from({length: GRID}, () => Array(GRID).fill(0));
    const digits = code.toString().split('');
    const charW = 4, charH = 5;
    const startX = Math.floor((GRID - digits.length*(charW+1))/2);
    const startY = Math.floor((GRID - charH)/2);
    
    // Mapa de dígitos simples (1=píxel encendido)
    const digitMap = {
      '0':[[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
      '1':[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0],[1,1,1,0]],
      '2':[[1,1,1,0],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,0]],
      '3':[[1,1,1,0],[0,0,1,0],[0,1,1,0],[0,0,1,0],[1,1,1,0]],
      '4':[[1,0,1,0],[1,0,1,0],[1,1,1,0],[0,0,1,0],[0,0,1,0]],
      '5':[[1,1,1,0],[1,0,0,0],[1,1,1,0],[0,0,1,0],[1,1,1,0]],
      '6':[[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,1,0],[0,1,1,0]],
      '7':[[1,1,1,0],[0,0,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
      '8':[[0,1,1,0],[1,0,1,0],[0,1,1,0],[1,0,1,0],[0,1,1,0]],
      '9':[[0,1,1,0],[1,0,1,0],[0,1,1,0],[0,0,1,0],[0,1,1,0]],
      'A':[[0,1,1,0],[1,0,1,0],[1,1,1,0],[1,0,1,0],[1,0,1,0]],
      'B':[[1,1,1,0],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,1,1,0]],
      'C':[[0,1,1,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[0,1,1,0]]
    };
    
    digits.forEach((d, di) => {
      const map = digitMap[d] || digitMap['0'];
      map.forEach((row, ri) => {
        row.forEach((v, ci) => {
          const gx = startX + di*(charW+1) + ci;
          const gy = startY + ri;
          if(gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) grid[gy][gx] = v ? 2 : 0;
        });
      });
    });
    
    // Añadir ruido
    if(noise) {
      for(let y=0; y<GRID; y++) for(let x=0; x<GRID; x++) {
        if(grid[y][x]===0 && Math.random()<0.15) grid[y][x]=1;
      }
    }

    return `<div style="display:inline-block;background:#000;padding:8px;border:2px solid ${color};border-radius:8px;box-shadow:0 0 20px ${color}40">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px;image-rendering:pixelated">
        ${grid.map((row, y) => row.map((v, x) => v===0 ? '' : 
          `<rect x="${x*CELL}" y="${y*CELL}" width="${CELL}" height="${CELL}" fill="${v===2 ? color : color+'30'}" opacity="${v===2?1:0.3}">
            ${v===2 ? `<animate attributeName="opacity" values="1;0.7;1" dur="${1+Math.random()}s" repeatCount="indefinite"/>` : ''}
          </rect>`
        ).join('')).join('')}
      </svg>
      <div style="text-align:center;margin-top:8px;font-family:Orbitron;font-size:0.8rem;color:${color}">CODI AMAGAT</div>
    </div>`;
  },

  // ─────────────────────────────────────────────
  //  STAR PATTERN — Constelación animada
  // ─────────────────────────────────────────────
  starPattern: function(config = {}) {
    const { stars = 8, pattern = [0,3,7,11], color = '#00f5ff', title = 'CONSTEL·LACIÓ' } = config;
    const pts = Array.from({length: stars}, (_, i) => {
      const angle = (360/stars)*i - 90;
      const r = 30 + (i%3)*8;
      return {
        x: 50 + r * Math.cos(angle*Math.PI/180),
        y: 50 + r * Math.sin(angle*Math.PI/180)
      };
    });
    
    const lines = [];
    for(let i=0; i<pattern.length-1; i++) lines.push([pattern[i], pattern[i+1]]);
    
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;background:radial-gradient(ellipse at center,${color}10,transparent)">
      <!-- Estrellas de fondo -->
      ${Array.from({length:30},(_,i)=>`<circle cx="${Math.random()*100}" cy="${Math.random()*100}" r="${Math.random()*0.5+0.2}" fill="white" opacity="${Math.random()*0.5+0.2}">
        <animate attributeName="opacity" values="0;1;0" dur="${2+Math.random()*3}s" repeatCount="indefinite"/>
      </circle>`).join('')}
      
      <!-- Líneas de constelación -->
      ${lines.map(([a,b])=>`<line x1="${pts[a].x}" y1="${pts[a].y}" x2="${pts[b].x}" y2="${pts[b].y}" stroke="${color}" stroke-width="1" opacity="0.8" stroke-dasharray="2,1">
        <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="1s" repeatCount="indefinite"/>
      </line>`).join('')}
      
      <!-- Estrellas principales -->
      ${pts.map((p,i) => {
        const isHL = pattern.includes(i);
        return `<g>
          <circle cx="${p.x}" cy="${p.y}" r="${isHL?3:1.5}" fill="${isHL?color:'white'}" opacity="${isHL?1:0.6}" filter="${isHL?'drop-shadow(0 0 4px '+color+')':''}">
            ${isHL?'<animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>' : ''}
          </circle>
          <text x="${p.x+3}" y="${p.y-3}" font-size="3" fill="${color}80" font-family="monospace">${i}</text>
        </g>`;
      }).join('')}
      
      <text x="50" y="95" font-size="4" fill="${color}" text-anchor="middle" font-family="Orbitron" letter-spacing="2">${title}</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  PANEL DE CONTROL — Interruptores mejorados
  // ─────────────────────────────────────────────
  controlPanel: function(config = {}) {
    const { switches = ['A','B','C','D'], solution = [0,2,3,1], color = '#ff6b00', label = 'PANEL' } = config;
    
    return `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;background:linear-gradient(180deg,#1a1a1a,#0d0d0d);border:2px solid ${color};border-radius:12px">
      <rect x="0" y="0" width="100" height="70" rx="8" fill="url(#bg)" stroke="${color}" stroke-width="0.5"/>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="100%" stop-color="#0a0a0a"/></linearGradient>
        <linearGradient id="ledOn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}60"/></linearGradient>
      </defs>
      
      <text x="50" y="10" font-size="5" fill="${color}" text-anchor="middle" font-family="Orbitron" letter-spacing="1">${label}</text>
      
      ${switches.map((sw, i) => {
        const x = 15 + (i * (70/switches.length));
        const isActive = solution.includes(i);
        return `<g transform="translate(${x}, 20)">
          <rect x="0" y="0" width="12" height="25" rx="2" fill="#1a1a1a" stroke="${color}40" stroke-width="0.5"/>
          <circle cx="6" cy="5" r="2" fill="${isActive ? 'url(#ledOn)' : '#333'}" filter="${isActive?'drop-shadow(0 0 3px '+color+')':''}">
            ${isActive ? '<animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>' : ''}
          </circle>
          <text x="6" y="18" font-size="6" fill="${color}" text-anchor="middle" font-family="monospace">${sw}</text>
          <text x="6" y="35" font-size="3" fill="${color}80" text-anchor="middle">${i+1}</text>
        </g>`;
      }).join('')}
      
      <rect x="10" y="55" width="80" height="10" rx="2" fill="#000" stroke="${color}40"/>
      <text x="50" y="62" font-size="4" fill="${color}60" text-anchor="middle" font-family="monospace">SECUENCIA ACTIVA</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER ROOM — Sala de control post-apocalíptica
  // ─────────────────────────────────────────────
  bunkerRoom: function(config = {}) {
    const { color = '#00ff41', phase = 0 } = config;
    return `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:500px;background:#000d00;border-radius:8px;border:1px solid ${color}30">
      <defs>
        <filter id="bkglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- Grid -->
      ${Array.from({length:9},(_,i)=>`<line x1="${i*50}" y1="0" x2="${i*50}" y2="220" stroke="${color}08" stroke-width=".5"/>
        <line x1="0" y1="${i*28}" x2="400" y2="${i*28}" stroke="${color}08" stroke-width=".5"/>`).join('')}
      <!-- Paret fons -->
      <rect x="20" y="20" width="360" height="180" rx="4" fill="#010d01" stroke="${color}20" stroke-width="1"/>
      <!-- Ordinadors -->
      <rect x="35" y="35" width="80" height="55" rx="3" fill="#020f02" stroke="${color}40" stroke-width="1.5"/>
      <rect x="38" y="38" width="74" height="45" rx="2" fill="#000"/>
      ${Array.from({length:5},(_,i)=>`<rect x="42" y="${41+i*8}" width="${20+Math.sin(i)*15}" height="4" rx="1" fill="${color}" opacity="${.2+i*.08}"/>`).join('')}
      <text x="75" y="102" font-family="monospace" font-size="5" fill="${color}80" text-anchor="middle">SISTEMA ERR</text>
      <!-- Segon ordinador -->
      <rect x="135" y="35" width="80" height="55" rx="3" fill="#020f02" stroke="${color}30" stroke-width="1"/>
      <rect x="138" y="38" width="74" height="45" rx="2" fill="#000"/>
      <text x="175" y="58" font-family="monospace" font-size="6" fill="${color}60" text-anchor="middle">01000001</text>
      <text x="175" y="68" font-family="monospace" font-size="6" fill="${color}60" text-anchor="middle">01001001</text>
      <text x="175" y="78" font-family="monospace" font-size="5" fill="${color}40" text-anchor="middle">XIFRAT IA-2087</text>
      <!-- Alarma -->
      <circle cx="310" cy="55" r="22" fill="#1a0000" stroke="#ff2d2d" stroke-width="2" filter="url(#bkglow)">
        <animate attributeName="fill" values="#1a0000;#3a0000;#1a0000" dur="1s" repeatCount="indefinite"/>
      </circle>
      <text x="310" y="59" font-size="18" text-anchor="middle">☢️</text>
      <!-- Porta -->
      <rect x="340" y="90" width="38" height="70" rx="2" fill="#010d01" stroke="${color}50" stroke-width="2"/>
      <rect x="344" y="94" width="30" height="62" rx="1" fill="#000506"/>
      <circle cx="368" cy="125" r="4" fill="${color}40" stroke="${color}" stroke-width="1"/>
      <text x="359" y="148" font-family="monospace" font-size="5" fill="#ff2d2d" text-anchor="middle">🔒</text>
      <!-- Terra -->
      <rect x="20" y="170" width="360" height="30" rx="2" fill="#010a01"/>
      <line x1="20" y1="170" x2="380" y2="170" stroke="${color}30" stroke-width="1.5"/>
      <!-- Objectes sala -->
      <rect x="55" y="130" width="50" height="35" rx="2" fill="#020f02" stroke="${color}20" stroke-width="1"/>
      <text x="80" y="152" font-family="monospace" font-size="7" fill="${color}50" text-anchor="middle">📋 NOTES</text>
      <!-- Indicador fase -->
      <text x="200" y="210" font-family="monospace" font-size="5" fill="${color}60" text-anchor="middle">BÚNQUER B-7 — SALA CONTROL — FASE ${phase+1}</text>
      <!-- Llum parpellejant -->
      <circle cx="200" cy="25" r="5" fill="${color}" opacity=".7" filter="url(#bkglow)">
        <animate attributeName="opacity" values=".7;.2;.7" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER TERMINAL — Pantalla de desxifrat
  // ─────────────────────────────────────────────
  bunkerTerminal: function(config = {}) {
    const { color = '#00ff41', encoded = 'HF' } = config;
    const lines = ['> SISTEMA INICIANT...','> CONNEXIÓ ESTABLERTA','> ls /classified/','  IA-PROTOCOL.bin','  CULPABLE.enc  ← XIFRAT','> cat CULPABLE.enc'];
    return `<div style="background:#000;border:1px solid ${color}50;border-radius:6px;padding:12px;font-family:monospace;max-width:460px;width:100%">
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <div style="width:10px;height:10px;border-radius:50%;background:#ff4444"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:#ffd700"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:${color}"></div>
        <span style="margin-left:8px;font-size:.6rem;color:${color}60">root@bunker-b7:~$</span>
      </div>
      ${lines.map((l,i)=>`<div style="font-size:.72rem;color:${i<3?color+'80':i===4?'#ff2d2d':color+'50'};margin-bottom:3px;animation:none">${l}</div>`).join('')}
      <div style="font-size:1.1rem;letter-spacing:8px;color:#ff2d2d;text-align:center;padding:10px;border:1px solid #ff2d2d40;border-radius:4px;margin:8px 0;font-weight:bold">${encoded}</div>
      <div style="font-size:.6rem;color:${color}60;text-align:center">⬆ MISSATGE XIFRAT — Cal roda César per desxifrar</div>
    </div>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER PANEL — Panell de control amb llums
  // ─────────────────────────────────────────────
  bunkerPanel: function(config = {}) {
    const { color = '#00ff41' } = config;
    const btnColors = ['#00cc33','#ff2222','#2266ff','#ffaa00'];
    const btnLabels = ['OXIGEN','REACTOR','AGUA','PORTES'];
    return `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:500px;background:linear-gradient(180deg,#1a1a1a,#0d0d0d);border-radius:8px;border:2px solid ${color}40">
      <defs><filter id="pg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <!-- Header -->
      <rect x="10" y="10" width="380" height="30" rx="3" fill="rgba(0,0,0,.5)"/>
      <text x="200" y="30" font-family="monospace" font-size="10" fill="${color}" text-anchor="middle" letter-spacing="4">PANELL PROTOCOLS D'EMERGÈNCIA</text>
      <!-- 4 botons Simon -->
      ${btnColors.map((bc,i)=>`
        <rect x="${50+i*80}" y="55" width="60" height="80" rx="8" fill="${bc}30" stroke="${bc}" stroke-width="2">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="${1.2+i*.3}s" repeatCount="indefinite"/>
        </rect>
        <circle cx="${80+i*80}" cy="85" r="18" fill="${bc}50" filter="url(#pg)"/>
        <text x="${80+i*80}" y="90" font-size="14" text-anchor="middle">${['🟢','🔴','🔵','🟡'][i]}</text>
        <text x="${80+i*80}" y="128" font-family="monospace" font-size="6" fill="${bc}" text-anchor="middle">${btnLabels[i]}</text>
      `).join('')}
      <!-- Status bar -->
      <rect x="20" y="155" width="360" height="20" rx="3" fill="rgba(0,0,0,.6)" stroke="${color}30"/>
      <text x="200" y="168" font-family="monospace" font-size="7" fill="${color}80" text-anchor="middle">SEQÜÈNCIA: OBSERVA I REPETEIX EN ORDRE EXACTE</text>
      <!-- Alarm indicators -->
      ${Array.from({length:8},(_,i)=>`<circle cx="${30+i*50}" cy="188" r="4" fill="${i%2===0?'#ff2d2d':'#ff990050'}">
        <animate attributeName="fill" values="${i%2===0?'#ff2d2d;#330000;#ff2d2d':'#ff9900;#333300;#ff9900'}" dur="${.5+i*.1}s" repeatCount="indefinite"/>
      </circle>`).join('')}
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER MAP — Mapa del búnquer
  // ─────────────────────────────────────────────
  bunkerMap: function(config = {}) {
    const { color = '#00ff41' } = config;
    return `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:500px;background:#000d00;border-radius:8px;border:1px solid ${color}30">
      <!-- Grid del mapa -->
      ${Array.from({length:9},(_,i)=>`<line x1="${i*50}" y1="0" x2="${i*50}" y2="220" stroke="${color}12" stroke-width=".5"/>
        <line x1="0" y1="${i*28}" x2="400" y2="${i*28}" stroke="${color}12" stroke-width=".5"/>`).join('')}
      <!-- Corredors -->
      <rect x="40" y="40" width="320" height="140" rx="4" fill="none" stroke="${color}30" stroke-width="1" stroke-dasharray="4,2"/>
      <line x1="200" y1="40" x2="200" y2="180" stroke="${color}25" stroke-width="1.5" stroke-dasharray="3,2"/>
      <line x1="40" y1="110" x2="360" y2="110" stroke="${color}25" stroke-width="1.5" stroke-dasharray="3,2"/>
      <!-- Zones -->
      <rect x="50" y="50" width="70" height="50" rx="3" fill="${color}08" stroke="${color}30" stroke-width="1"/>
      <text x="85" y="73" font-family="monospace" font-size="7" fill="${color}60" text-anchor="middle">🚿 DUTXES</text>
      <rect x="165" y="50" width="70" height="50" rx="3" fill="${color}08" stroke="${color}30" stroke-width="1"/>
      <text x="200" y="73" font-family="monospace" font-size="7" fill="${color}60" text-anchor="middle">🍽️ MENJADOR</text>
      <rect x="280" y="50" width="70" height="50" rx="3" fill="${color}20" stroke="${color}" stroke-width="2">
        <animate attributeName="opacity" values="1;.6;1" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <text x="315" y="68" font-family="monospace" font-size="7" fill="${color}" text-anchor="middle" font-weight="bold">⚡ GENERADOR</text>
      <text x="315" y="80" font-family="monospace" font-size="6" fill="${color}80" text-anchor="middle">← OBJECTIU</text>
      <rect x="100" y="125" width="70" height="45" rx="3" fill="${color}08" stroke="${color}30" stroke-width="1"/>
      <text x="135" y="150" font-family="monospace" font-size="7" fill="${color}60" text-anchor="middle">🏥 INFERMERIA</text>
      <rect x="230" y="125" width="70" height="45" rx="3" fill="${color}08" stroke="${color}30" stroke-width="1"/>
      <text x="265" y="150" font-family="monospace" font-size="7" fill="${color}60" text-anchor="middle">🔧 MAGATZEM</text>
      <!-- Entrada -->
      <rect x="180" y="175" width="40" height="15" rx="2" fill="${color}20" stroke="${color}60"/>
      <text x="200" y="186" font-family="monospace" font-size="6" fill="${color}80" text-anchor="middle">ENTRADA</text>
      <!-- Títol -->
      <text x="200" y="212" font-family="monospace" font-size="6" fill="${color}50" text-anchor="middle">PLÀNOL BÚNQUER B-7 — ZONA GENERADOR: EST</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER DOOR — Porta hermètica amb pany
  // ─────────────────────────────────────────────
  bunkerDoor: function(config = {}) {
    const { color = '#00ff41' } = config;
    return `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:500px;background:#000d00;border-radius:8px;border:1px solid ${color}30">
      <!-- Paret -->
      <rect x="20" y="20" width="360" height="180" rx="4" fill="#010a01" stroke="${color}15" stroke-width="1"/>
      <!-- Porta gran -->
      <rect x="120" y="30" width="160" height="170" rx="4" fill="#020f02" stroke="${color}" stroke-width="3"/>
      <rect x="128" y="38" width="144" height="154" rx="3" fill="#010808"/>
      <!-- Reblons de la porta -->
      ${[[130,40],[260,40],[130,190],[260,190],[130,115],[260,115]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="${color}40" stroke="${color}60" stroke-width="1"/>`).join('')}
      <!-- Pany central -->
      <rect x="178" y="90" width="44" height="55" rx="6" fill="#0a1a0a" stroke="${color}" stroke-width="2.5"/>
      <circle cx="200" cy="108" r="12" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="200" cy="108" r="5" fill="${color}60"/>
      <!-- Dial de codi -->
      ${Array.from({length:4},(_,i)=>`
        <rect x="${152+i*22}" y="128" width="18" height="24" rx="3" fill="#000" stroke="${color}80" stroke-width="1.5"/>
        <text x="${161+i*22}" y="144" font-family="monospace" font-size="11" fill="${color}" text-anchor="middle">?</text>
      `).join('')}
      <!-- Indicadors llum -->
      <circle cx="155" cy="170" r="5" fill="#ff2d2d">
        <animate attributeName="fill" values="#ff2d2d;#330000;#ff2d2d" dur=".8s" repeatCount="indefinite"/>
      </circle>
      <text x="170" y="174" font-family="monospace" font-size="7" fill="#ff2d2d">BLOQUEJADA</text>
      <!-- Títol -->
      <text x="200" y="215" font-family="monospace" font-size="7" fill="${color}50" text-anchor="middle">PORTA HERMÈTICA — SECTOR SORTIDA — COD: ????</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  BUNKER EXIT — Sortida final amb sopa de lletres
  // ─────────────────────────────────────────────
  bunkerExit: function(config = {}) {
    const { color = '#00ff41' } = config;
    const words = ['OXIGEN','SORTIDA','BUNQUER','ALARMA','VIRUS'];
    return `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:500px;background:#000d00;border-radius:8px;border:2px solid ${color}50">
      <defs><filter id="eg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <!-- Header alarma -->
      <rect x="0" y="0" width="400" height="35" rx="4" fill="#1a0000">
        <animate attributeName="fill" values="#1a0000;#2a0000;#1a0000" dur=".6s" repeatCount="indefinite"/>
      </rect>
      <text x="200" y="22" font-family="monospace" font-size="10" fill="#ff2d2d" text-anchor="middle" letter-spacing="3" filter="url(#eg)">⚠ AUTODESTRUCCIÓ ACTIVADA ⚠</text>
      <!-- Paraules a trobar -->
      <text x="200" y="50" font-family="monospace" font-size="7" fill="${color}80" text-anchor="middle">PARAULES DE SEGURETAT:</text>
      ${words.map((w,i)=>`<text x="${50+i*70}" y="64" font-family="monospace" font-size="6.5" fill="${color}" text-anchor="middle">${w}</text>`).join('')}
      <!-- Graella de lletres (decorativa) -->
      <rect x="30" y="72" width="340" height="120" rx="3" fill="rgba(0,255,65,.03)" stroke="${color}20"/>
      ${Array.from({length:10},(_,r)=>Array.from({length:14},(_,c)=>`
        <text x="${45+c*23}" y="${88+r*11}" font-family="monospace" font-size="8" fill="${color}${r===2&&c===1?'ff':r===4&&c===3?'ff':'30'}">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)]}</text>
      `).join('')).join('')}
      <!-- Sortida -->
      <rect x="150" y="195" width="100" height="18" rx="3" fill="${color}15" stroke="${color}60" stroke-width="1">
        <animate attributeName="opacity" values="1;.4;1" dur="1s" repeatCount="indefinite"/>
      </rect>
      <text x="200" y="207" font-family="monospace" font-size="7" fill="${color}" text-anchor="middle" letter-spacing="2">🚀 SORTIDA D'EMERGÈNCIA</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  ADN HELIX — Visualización mejorada
  // ─────────────────────────────────────────────
  dnaHelix: function(config = {}) {
    const { seq1 = 'ATGCGA', seq2 = 'TACGCT', mutPos = 3, color = '#4ade80' } = config;
    const n = seq1.length;
    const BASE_COLORS = { A:'#ff6b00', T:'#00f5ff', G:'#4ade80', C:'#ff0080' };
    
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px;background:radial-gradient(ellipse at center,${color}10,transparent);border-radius:12px;border:2px solid ${color}30">
      ${Array.from({length: n}, (_, i) => {
        const y = 15 + (i * 70/n);
        const wave = Math.sin((i/n)*Math.PI*2 + Date.now()/1000); // Animación sutil
        const x1 = 25 + Math.sin((i/n)*Math.PI*2)*10;
        const x2 = 75 + Math.sin((i/n)*Math.PI*2)*10;
        const isMut = i === mutPos;
        const b1 = seq1[i], b2 = seq2[i];
        
        return `<g>
          <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${isMut?'#ff4444':color+'40'}" stroke-width="${isMut?2:1}" stroke-dasharray="${isMut?'4,2':'none'}"/>
          <circle cx="${x1}" cy="${y}" r="4" fill="${BASE_COLORS[b1]||color}" stroke="#000" stroke-width="0.5">
            ${isMut?'<animate attributeName="r" values="4;5;4" dur="0.5s" repeatCount="indefinite"/>' : ''}
          </circle>
          <text x="${x1}" y="${y}" font-size="3" fill="#000" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${b1}</text>
          <circle cx="${x2}" cy="${y}" r="4" fill="${BASE_COLORS[b2]||color}" stroke="#000" stroke-width="0.5"/>
          <text x="${x2}" y="${y}" font-size="3" fill="#000" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${b2}</text>
          ${isMut ? `<rect x="${Math.min(x1,x2)-6}" y="${y-6}" width="${Math.abs(x2-x1)+12}" height="12" rx="2" fill="none" stroke="#ff4444" stroke-width="1" stroke-dasharray="2,1">
            <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
          </rect>` : ''}
        </g>`;
      }).join('')}
      
      <path d="M ${Array.from({length:n},(_,i)=>`${25+Math.sin((i/n)*Math.PI*2)*10},${15+(i*70/n)}`).join(' L ')}" 
        fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
      <path d="M ${Array.from({length:n},(_,i)=>`${75+Math.sin((i/n)*Math.PI*2)*10},${15+(i*70/n)}`).join(' L ')}" 
        fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
    </svg>`;
  }
};
