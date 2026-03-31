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
