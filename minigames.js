/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — MOTOR DE MINIJOCS v1.0
 *  minigames.js
 *  Injecta minijocs visuals a les fases del joc.
 *  Cada minijoc retorna una Promise que es resol amb la resposta.
 * ═══════════════════════════════════════════════════════════════
 */

window.MINIGAMES = {

  // ─────────────────────────────────────────────
  //  MAPA DEL TRESOR — SVG generatiu amb X
  // ─────────────────────────────────────────────
  treasureMap: function(config = {}) {
    const { paths = 3, finalX = [70, 65], color = '#8B4513' } = config;
    const seed = config.seed || 42;

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

    // Islands / obstacles
    const islands = Array.from({length: 4}, (_, i) => ({
      x: 15 + seededRandom(seed + i * 17) * 70,
      y: 15 + seededRandom(seed + i * 23) * 70,
      r: 4 + seededRandom(seed + i) * 8
    }));

    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:420px;filter:sepia(0.8) contrast(1.1);border-radius:8px;border:2px solid ${color}40">
      <defs>
        <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
        <filter id="aged"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2"/>
          <feDisplacementMap in="SourceGraphic" scale="1.5"/></filter>
      </defs>
      <!-- Paper background -->
      <rect width="100" height="100" fill="#d4b483" filter="url(#paper)"/>
      <rect width="100" height="100" fill="#c8a96820" />
      <!-- Border ornament -->
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="${color}" stroke-width="0.8" stroke-dasharray="3,2"/>
      <rect x="3.5" y="3.5" width="93" height="93" fill="none" stroke="${color}80" stroke-width="0.3"/>
      <!-- Islands -->
      ${islands.map(il => `<ellipse cx="${il.x}" cy="${il.y}" rx="${il.r}" ry="${il.r*0.7}" fill="#8B6914" opacity="0.4"/>
        <ellipse cx="${il.x}" cy="${il.y}" rx="${il.r*0.6}" ry="${il.r*0.4}" fill="#6B8A3A" opacity="0.5"/>`).join('')}
      <!-- Dotted path -->
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="0.6" stroke-dasharray="1.5,1" opacity="0.7"/>
      <!-- Waypoint markers -->
      ${waypoints.slice(0, -1).map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="1" fill="${color}" opacity="0.5"/>`).join('')}
      <!-- Compass rose -->
      <g transform="translate(88,12)">
        <circle r="5" fill="#d4b48380" stroke="${color}" stroke-width="0.4"/>
        <text x="-1" y="-2.5" font-size="2.5" fill="${color}" font-family="serif" text-anchor="middle">N</text>
        <text x="-1" y="4" font-size="2.5" fill="${color}" font-family="serif" text-anchor="middle">S</text>
        <text x="-4" y="1" font-size="2.5" fill="${color}" font-family="serif" text-anchor="middle">W</text>
        <text x="2.5" y="1" font-size="2.5" fill="${color}" font-family="serif" text-anchor="middle">E</text>
        <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="${color}" stroke-width="0.3"/>
        <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="${color}" stroke-width="0.3"/>
      </g>
      <!-- X marks the spot -->
      <g transform="translate(${finalX[0]},${finalX[1]})">
        <circle r="4" fill="#FFD70040" stroke="#cc0000" stroke-width="0.8"/>
        <line x1="-3" y1="-3" x2="3" y2="3" stroke="#cc0000" stroke-width="1.2"/>
        <line x1="3" y1="-3" x2="-3" y2="3" stroke="#cc0000" stroke-width="1.2"/>
        <animateTransform attributeName="transform" type="scale" values="1;1.25;1" dur="1.5s" repeatCount="indefinite"
          additive="sum" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      </g>
      <!-- Title -->
      <text x="50" y="8" font-size="3.5" fill="${color}" font-family="serif" text-anchor="middle" opacity="0.8"
        style="font-style:italic">Mapa del Tresor</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  XIFRAT VISUAL — Roda de codis
  // ─────────────────────────────────────────────
  cipherWheel: function(config = {}) {
    const { outerLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', shift = 3, highlightLetter = 'R', color = '#00f5ff' } = config;
    const n = outerLetters.length;
    const innerLetters = outerLetters.slice(shift) + outerLetters.slice(0, shift);
    const hlIdx = outerLetters.indexOf(highlightLetter);

    const slices = Array.from({length: n}, (_, i) => {
      const angle = (360 / n) * i - 90;
      const rad = angle * Math.PI / 180;
      const r_outer = 44, r_inner_o = 30, r_inner_i = 28, r_center = 15;
      const nextRad = ((angle + 360/n) * Math.PI / 180);
      const x1o = 50 + r_outer * Math.cos(rad), y1o = 50 + r_outer * Math.sin(rad);
      const x2o = 50 + r_outer * Math.cos(nextRad), y2o = 50 + r_outer * Math.sin(nextRad);
      const x1i = 50 + r_inner_o * Math.cos(rad), y1i = 50 + r_inner_o * Math.sin(rad);
      const x2i = 50 + r_inner_o * Math.cos(nextRad), y2i = 50 + r_inner_o * Math.sin(nextRad);
      const midAngle = (angle + 360/n/2) * Math.PI / 180;
      const xText = 50 + 37 * Math.cos(midAngle), yText = 50 + 37 * Math.sin(midAngle);
      const xInner = 50 + 22 * Math.cos(midAngle), yInner = 50 + 22 * Math.sin(midAngle);
      const isHL = i === hlIdx;
      return { i, rad, nextRad, x1o, y1o, x2o, y2o, x1i, y1i, x2i, y2i, xText, yText, xInner, yInner, isHL,
        outer: outerLetters[i], inner: innerLetters[i] };
    });

    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:360px">
      <defs>
        <radialGradient id="cwbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}20"/>
          <stop offset="100%" stop-color="${color}05"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#0a0a1a" stroke="${color}40" stroke-width="0.5"/>
      ${slices.map(s => `
        <path d="M ${s.x1i},${s.y1i} L ${s.x1o},${s.y1o} A 44 44 0 0 1 ${s.x2o},${s.y2o} L ${s.x2i},${s.y2i} A 30 30 0 0 0 ${s.x1i},${s.y1i}"
          fill="${s.isHL ? color+'40' : 'transparent'}" stroke="${color}30" stroke-width="0.3"/>
        <text x="${s.xText}" y="${s.yText}" font-size="4" fill="${s.isHL ? color : color+'aa'}" text-anchor="middle"
          dominant-baseline="middle" font-family="monospace" font-weight="${s.isHL ? 'bold' : 'normal'}">${s.outer}</text>
        <text x="${s.xInner}" y="${s.yInner}" font-size="3.5" fill="${s.isHL ? '#ff6b00' : color+'66'}" text-anchor="middle"
          dominant-baseline="middle" font-family="monospace">${s.inner}</text>
      `).join('')}
      <circle cx="50" cy="50" r="13" fill="#0a0a1a" stroke="${color}" stroke-width="0.8"/>
      <text x="50" y="50" font-size="4" fill="${color}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Orbitron',monospace">CESAR</text>
      <!-- Pointer -->
      <polygon points="50,3 48.5,6 51.5,6" fill="${color}" opacity="0.8"/>
      <line x1="50" y1="6" x2="50" y2="50" stroke="${color}30" stroke-width="0.3" stroke-dasharray="1,1"/>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  CIRCUIT VISUAL — Xarxa de nodes per connexió
  // ─────────────────────────────────────────────
  circuitPuzzle: function(config = {}) {
    const { nodes = 6, color = '#00f5ff', solution = [0,2,4,5] } = config;
    const positions = [
      [20,20],[60,15],[85,35],[75,65],[45,80],[15,60],
      [50,45],[30,50],[65,45],[40,25]
    ].slice(0, nodes);

    const edges = [];
    for (let i = 0; i < nodes; i++) {
      for (let j = i+1; j < nodes; j++) {
        const dx = positions[i][0]-positions[j][0], dy = positions[i][1]-positions[j][1];
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 45) edges.push([i, j, dist]);
      }
    }
    const solutionEdges = solution.slice(0,-1).map((n,i) => [n, solution[i+1]]);

    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:360px">
      <rect width="100" height="100" fill="#050510"/>
      <!-- Grid lines -->
      ${Array.from({length:10},(_,i)=>`<line x1="${i*10}" y1="0" x2="${i*10}" y2="100" stroke="${color}08" stroke-width="0.3"/>
        <line x1="0" y1="${i*10}" x2="100" y2="${i*10}" stroke="${color}08" stroke-width="0.3"/>`).join('')}
      <!-- Edges -->
      ${edges.map(([a,b]) => {
        const isSol = solutionEdges.some(([x,y]) => (x===a&&y===b)||(x===b&&y===a));
        return `<line x1="${positions[a][0]}" y1="${positions[a][1]}" x2="${positions[b][0]}" y2="${positions[b][1]}"
          stroke="${isSol ? color : color+'20'}" stroke-width="${isSol ? '0.8' : '0.3'}"
          ${isSol ? 'stroke-dasharray="2,1"' : ''}>
          ${isSol ? `<animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite"/>` : ''}
        </line>`;
      }).join('')}
      <!-- Nodes -->
      ${positions.map(([x,y], i) => {
        const isSol = solution.includes(i);
        return `<circle cx="${x}" cy="${y}" r="${isSol ? 3.5 : 2.5}" fill="${isSol ? color : '#0a0a1a'}"
          stroke="${color}" stroke-width="0.7">
          ${isSol ? `<animate attributeName="r" values="${3.5};${4.5};${3.5}" dur="2s" repeatCount="indefinite"/>` : ''}
        </circle>
        <text x="${x}" y="${y}" font-size="2.5" fill="${isSol ? '#000' : color}" text-anchor="middle"
          dominant-baseline="middle" font-family="monospace">${i}</text>`;
      }).join('')}
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  PÍXELS SECRETS — Imatge pixelada amb codi
  // ─────────────────────────────────────────────
  pixelSecret: function(config = {}) {
    const { code = '42', color = '#ff6b00', noise = true } = config;
    const GRID = 16;
    const DIGIT_MAP = {
      '0': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
      '1': [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0],[1,1,1,0]],
      '2': [[1,1,1,0],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,0]],
      '3': [[1,1,1,0],[0,0,1,0],[0,1,1,0],[0,0,1,0],[1,1,1,0]],
      '4': [[1,0,1,0],[1,0,1,0],[1,1,1,0],[0,0,1,0],[0,0,1,0]],
      '5': [[1,1,1,0],[1,0,0,0],[1,1,1,0],[0,0,1,0],[1,1,1,0]],
      '6': [[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,1,0],[0,1,1,0]],
      '7': [[1,1,1,0],[0,0,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
      '8': [[0,1,1,0],[1,0,1,0],[0,1,1,0],[1,0,1,0],[0,1,1,0]],
      '9': [[0,1,1,0],[1,0,1,0],[0,1,1,0],[0,0,1,0],[0,1,1,0]],
    };
    const CELL = 100 / GRID;
    const grid = Array.from({length: GRID}, () => Array(GRID).fill(0));
    // Place digits centered
    const digits = code.toString().split('');
    const startX = Math.floor((GRID - digits.length * 5) / 2);
    const startY = Math.floor((GRID - 5) / 2);
    digits.forEach((d, di) => {
      const map = DIGIT_MAP[d] || DIGIT_MAP['0'];
      map.forEach((row, ri) => row.forEach((v, ci) => {
        const gx = startX + di * 5 + ci;
        const gy = startY + ri;
        if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) grid[gy][gx] = v ? 2 : 0;
      }));
    });
    // Add noise
    if (noise) {
      for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
        if (grid[y][x] === 0 && Math.random() < 0.2) grid[y][x] = 1;
      }
    }
    return `<div style="display:inline-block;background:#000;padding:4px;border:1px solid ${color}40;border-radius:4px">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;image-rendering:pixelated">
        ${grid.map((row, y) => row.map((v, x) => v === 0 ? '' :
          `<rect x="${x*CELL}" y="${y*CELL}" width="${CELL}" height="${CELL}"
            fill="${v===2 ? color : color+'25'}" opacity="${v===2?1:0.4}"/>`
        ).join('')).join('')}
      </svg>
    </div>`;
  },

  // ─────────────────────────────────────────────
  //  PANELL ESTEL·LAR — Constel·lació amb patró
  // ─────────────────────────────────────────────
  starPattern: function(config = {}) {
    const { stars = 12, pattern = [0,3,7,11], color = '#00f5ff', title = 'CONSTEL·LACIÓ' } = config;
    const pts = Array.from({length: stars}, (_, i) => {
      const angle = (360 / stars) * i - 90;
      const r = 35 + (i % 3) * 5;
      return {
        x: 50 + r * Math.cos(angle * Math.PI / 180),
        y: 50 + r * Math.sin(angle * Math.PI / 180)
      };
    });
    const lines = [];
    for (let i = 0; i < pattern.length - 1; i++) {
      lines.push([pattern[i], pattern[i+1]]);
    }
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px">
      <rect width="100" height="100" fill="#020210"/>
      ${Array.from({length:40},(_,i)=>`<circle cx="${Math.random()*100}" cy="${Math.random()*100}" r="${Math.random()*0.5+0.2}"
        fill="white" opacity="${Math.random()*0.6+0.1}"/>`).join('')}
      ${lines.map(([a,b])=>`<line x1="${pts[a].x}" y1="${pts[a].y}" x2="${pts[b].x}" y2="${pts[b].y}"
        stroke="${color}" stroke-width="0.5" opacity="0.6"/>`).join('')}
      ${pts.map((p,i) => {
        const isHL = pattern.includes(i);
        return `<circle cx="${p.x}" cy="${p.y}" r="${isHL?2.5:1.2}" fill="${isHL?color:'white'}" opacity="${isHL?1:0.5}">
          ${isHL?`<animate attributeName="opacity" values="1;0.4;1" dur="${1+i*0.3}s" repeatCount="indefinite"/>`:''}
        </circle>
        <text x="${p.x+2}" y="${p.y-2}" font-size="2.5" fill="${color}80" font-family="monospace">${i}</text>`;
      }).join('')}
      <text x="50" y="96" font-size="3" fill="${color}60" text-anchor="middle" font-family="'Orbitron',monospace">${title}</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  PANELL DE CONTROL — Interruptors animats
  // ─────────────────────────────────────────────
  controlPanel: function(config = {}) {
    const { switches = ['○','∆','■','✦'], solution = [0,2,3,1], color = '#ff6b00', label = 'PANEL DE CONTROL' } = config;
    const n = switches.length;
    const w = 100 / n;
    return `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
      <rect width="100" height="60" rx="4" fill="#0d0d0d" stroke="${color}40" stroke-width="0.8"/>
      <rect x="1" y="1" width="98" height="58" rx="3" fill="none" stroke="${color}20" stroke-width="0.3"/>
      <!-- Title -->
      <text x="50" y="8" font-size="3.5" fill="${color}80" text-anchor="middle" font-family="'Orbitron',monospace">${label}</text>
      <!-- Switches -->
      ${switches.map((sw, i) => {
        const cx = w/2 + i*w;
        const isOn = solution.indexOf(i) < 2; // primera meitat "activa"
        return `
        <!-- Switch ${i} -->
        <rect x="${cx-7}" y="12" width="14" height="22" rx="3" fill="#1a1a1a" stroke="${color}40" stroke-width="0.5"/>
        <!-- LED -->
        <circle cx="${cx}" cy="15" r="2" fill="${isOn ? '#00ff88' : '#ff4444'}">
          ${isOn ? `<animate attributeName="opacity" values="1;0.5;1" dur="${0.8+i*0.3}s" repeatCount="indefinite"/>` : ''}
        </circle>
        <!-- Symbol -->
        <text x="${cx}" y="28" font-size="6" fill="${color}" text-anchor="middle" dominant-baseline="middle">${sw}</text>
        <!-- Number label -->
        <text x="${cx}" y="40" font-size="3" fill="${color}80" text-anchor="middle" font-family="monospace">${i+1}</text>`;
      }).join('')}
      <!-- Bottom bar -->
      <rect x="5" y="48" width="90" height="8" rx="2" fill="#0a0a0a" stroke="${color}20" stroke-width="0.3"/>
      <text x="50" y="54" font-size="2.5" fill="${color}50" text-anchor="middle" font-family="monospace">SEQUENCE: _ _ _ _</text>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  DNA HELIX — Visualització ADN
  // ─────────────────────────────────────────────
  dnaHelix: function(config = {}) {
    const { seq1 = 'ATGCGA', seq2 = 'TACGCT', mutPos = 5, color = '#4ade80' } = config;
    const n = seq1.length;
    const BASE_COLORS = { A:'#ff6b00', T:'#00f5ff', G:'#4ade80', C:'#ff0080' };
    const h = 100 / n;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:300px">
      <rect width="100" height="100" fill="#020a04"/>
      ${Array.from({length: n}, (_, i) => {
        const y = h/2 + i*h;
        const wave = Math.sin((i/n)*Math.PI*2);
        const x1 = 25 + wave * 15;
        const x2 = 75 + wave * 15;
        const isMut = i === mutPos;
        const b1 = seq1[i], b2 = seq2[i];
        return `
        <!-- Backbone lines -->
        <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"
          stroke="${isMut ? '#ff4444' : color+'40'}" stroke-width="${isMut ? '0.8' : '0.4'}"/>
        <!-- Left base -->
        <circle cx="${x1}" cy="${y}" r="4" fill="${BASE_COLORS[b1]||color}" opacity="${isMut?1:0.8}"/>
        <text x="${x1}" y="${y}" font-size="3.5" fill="#000" text-anchor="middle" dominant-baseline="middle"
          font-family="monospace" font-weight="bold">${b1}</text>
        <!-- Right base -->
        <circle cx="${x2}" cy="${y}" r="4" fill="${BASE_COLORS[b2]||color}" opacity="${isMut?1:0.8}"/>
        <text x="${x2}" y="${y}" font-size="3.5" fill="#000" text-anchor="middle" dominant-baseline="middle"
          font-family="monospace" font-weight="bold">${b2}</text>
        ${isMut ? `<rect x="${x1-6}" y="${y-6}" width="${x2-x1+12}" height="12" rx="2"
          fill="none" stroke="#ff4444" stroke-width="0.6" stroke-dasharray="2,1">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <text x="50" y="${y-8}" font-size="2.5" fill="#ff4444" text-anchor="middle">MUTACIÓ pos.${i+1}</text>` : ''}`;
      }).join('')}
      <!-- Backbone curves -->
      <path d="M ${Array.from({length:n},(_,i)=>`${25+Math.sin((i/n)*Math.PI*2)*15},${h/2+i*h}`).join(' L ')}"
        fill="none" stroke="${color}" stroke-width="0.8" opacity="0.4"/>
      <path d="M ${Array.from({length:n},(_,i)=>`${75+Math.sin((i/n)*Math.PI*2)*15},${h/2+i*h}`).join(' L ')}"
        fill="none" stroke="${color}" stroke-width="0.8" opacity="0.4"/>
    </svg>`;
  },

  // ─────────────────────────────────────────────
  //  PROGRESS BAR DE VIDES (3 cors)
  // ─────────────────────────────────────────────
  livesBar: function(lives = 3, maxLives = 3, color = '#ff4444') {
    return `<div style="display:flex;gap:6px;align-items:center;justify-content:center;margin:4px 0">
      ${Array.from({length: maxLives}, (_, i) =>
        `<span style="font-size:1.4rem;transition:all .3s;filter:${i < lives ? 'drop-shadow(0 0 6px '+color+')' : 'grayscale(1) opacity(0.3)'}">${i < lives ? '❤️' : '🖤'}</span>`
      ).join('')}
    </div>`;
  }
};
