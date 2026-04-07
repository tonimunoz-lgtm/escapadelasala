/**
 * ═══════════════════════════════════════════════════════════════
 *  ESCAPE CLASS — MOTOR DE MINIJOCS VISUALS v5.0
 *  Jocs visuals per al PROJECTOR
 * ═══════════════════════════════════════════════════════════════
 */

window.MINIGAMES = {

  treasureMap: function(config = {}) {
    const { paths = 3, finalX = [70, 65], color = '#8B4513', seed = 42 } = config;
    function sr(s) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }
    let wps = [];
    for (let i = 0; i < paths + 2; i++) wps.push({ x: 10 + sr(seed + i * 7) * 80, y: 10 + sr(seed + i * 13) * 80 });
    wps[wps.length - 1] = { x: finalX[0], y: finalX[1] };
    const pathD = wps.map((p, i) => i === 0 ? `M ${p.x},${p.y}` :
      `Q ${(wps[i-1].x+p.x)/2+sr(seed+i)*10-5},${(wps[i-1].y+p.y)/2+sr(seed+i*3)*10-5} ${p.x},${p.y}`).join(' ');
    const islands = Array.from({length:4},(_,i)=>({ x:15+sr(seed+i*17)*70, y:15+sr(seed+i*23)*70, r:4+sr(seed+i)*8 }));
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:420px;filter:sepia(0.7) contrast(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.6));border-radius:10px;border:3px solid ${color}80">
      <defs><filter id="paper2"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"/><feColorMatrix type="saturate" values="0.3"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
      <rect width="100" height="100" fill="#d4b483"/>
      <rect width="100" height="100" fill="rgba(180,120,60,.18)" filter="url(#paper2)"/>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="4,2"/>
      ${islands.map(il=>`<ellipse cx="${il.x}" cy="${il.y}" rx="${il.r}" ry="${il.r*0.7}" fill="#8B6914" opacity="0.5"/>
        <ellipse cx="${il.x}" cy="${il.y}" rx="${il.r*0.6}" ry="${il.r*0.4}" fill="#4a7a2a" opacity="0.55"/>`).join('')}
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="1.8" stroke-dasharray="3,1.5" opacity="0.9">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="3s" repeatCount="indefinite"/></path>
      ${wps.slice(0,-1).map(p=>`<circle cx="${p.x}" cy="${p.y}" r="1.8" fill="${color}" opacity="0.7"/>`).join('')}
      <g transform="translate(88,12)"><circle r="6.5" fill="#d4b483" stroke="${color}" stroke-width="0.8"/>
        <text x="0" y="-3.5" font-size="3.5" fill="${color}" text-anchor="middle" font-weight="bold">N</text>
        <text x="0" y="6" font-size="3.5" fill="${color}" text-anchor="middle" font-weight="bold">S</text>
        <text x="-5" y="1.5" font-size="3" fill="${color}" text-anchor="middle">W</text>
        <text x="5" y="1.5" font-size="3" fill="${color}" text-anchor="middle">E</text></g>
      <g transform="translate(${finalX[0]},${finalX[1]})">
        <circle r="8" fill="#FFD700" opacity="0.3"><animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/></circle>
        <line x1="-5" y1="-5" x2="5" y2="5" stroke="#cc0000" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="5" y1="-5" x2="-5" y2="5" stroke="#cc0000" stroke-width="2.5" stroke-linecap="round"/>
        <text x="0" y="11" font-size="3.5" fill="#cc0000" text-anchor="middle" font-weight="bold">TRESOR</text></g>
    </svg>`;
  },

  cipherWheel: function(config = {}) {
    const { shift = 3, highlightLetter = 'A', color = '#00f5ff' } = config;
    const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', inner = L.slice(shift) + L.slice(0, shift);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:340px;filter:drop-shadow(0 4px 16px ${color}50)">
      <circle cx="50" cy="50" r="48" fill="#0a0a1a" stroke="${color}" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="36" fill="#050510" stroke="${color}40" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="22" fill="#0a0a1a" stroke="${color}" stroke-width="1.2"/>
      ${Array.from({length:26},(_,i)=>{
        const a=(360/26)*i-90, r=a*Math.PI/180;
        const isHL=L[i]===highlightLetter;
        return `<line x1="${50+44*Math.cos(r)}" y1="${50+44*Math.sin(r)}" x2="${50+30*Math.cos(r)}" y2="${50+30*Math.sin(r)}" stroke="${color}" stroke-width="${isHL?2:0.5}" opacity="${isHL?1:0.25}"/>
          <text x="${50+37*Math.cos(r)}" y="${50+37*Math.sin(r)}" font-size="${isHL?4.5:3.5}" fill="${isHL?'#FFD700':color}" text-anchor="middle" dominant-baseline="middle" font-weight="${isHL?'bold':'normal'}" style="font-family:monospace">${L[i]}</text>
          <text x="${50+26*Math.cos(r)}" y="${50+26*Math.sin(r)}" font-size="3" fill="${color}80" text-anchor="middle" dominant-baseline="middle" style="font-family:monospace">${inner[i]}</text>`;
      }).join('')}
      <text x="50" y="47" font-size="5" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">+${shift}</text>
      <text x="50" y="54" font-size="2.8" fill="${color}60" text-anchor="middle">DESPLAÇAMENT</text>
      <polygon points="50,3 48,8 52,8" fill="${color}"/>
    </svg>`;
  },

  circuitPuzzle: function(config = {}) {
    const { nodes = 6, color = '#00f5ff', solution = [0,2,4,5] } = config;
    const positions = [[20,20],[60,15],[85,35],[75,65],[45,80],[15,60],[50,45],[30,50],[65,45],[40,25]].slice(0, nodes);
    const edges = [];
    for (let i = 0; i < nodes; i++) for (let j = i+1; j < nodes; j++) {
      const dx=positions[i][0]-positions[j][0], dy=positions[i][1]-positions[j][1];
      if(Math.sqrt(dx*dx+dy*dy)<55) edges.push([i,j]);
    }
    const solEdges = solution.slice(0,-1).map((n,i)=>[n,solution[i+1]]);
    const isSolEdge=(a,b)=>solEdges.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:380px;background:#020210;border-radius:12px;border:2px solid ${color}40">
      ${Array.from({length:8},(_,i)=>`<line x1="${i*14}" y1="0" x2="${i*14}" y2="100" stroke="${color}08" stroke-width="0.5"/>
        <line x1="0" y1="${i*14}" x2="100" y2="${i*14}" stroke="${color}08" stroke-width="0.5"/>`).join('')}
      ${edges.map(([a,b])=>`<line x1="${positions[a][0]}" y1="${positions[a][1]}" x2="${positions[b][0]}" y2="${positions[b][1]}"
        stroke="${isSolEdge(a,b)?color:'rgba(255,255,255,0.08)'}" stroke-width="${isSolEdge(a,b)?1.5:0.5}" opacity="${isSolEdge(a,b)?0.9:0.3}"/>`).join('')}
      ${positions.map((p,i)=>{
        const isSol=solution.includes(i);
        return `<circle cx="${p[0]}" cy="${p[1]}" r="${isSol?5:3.5}" fill="${isSol?color:'rgba(255,255,255,0.15)'}" stroke="${isSol?'#fff':color}" stroke-width="${isSol?1.5:0.5}">
          ${isSol?`<animate attributeName="r" values="4.5;6.5;4.5" dur="1.8s" repeatCount="indefinite"/>`:''}
        </circle>
        <text x="${p[0]}" y="${p[1]}" font-size="2.8" fill="${isSol?'#000':'rgba(255,255,255,.4)'}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${i}</text>`;
      }).join('')}
      <text x="50" y="96" font-size="3" fill="${color}60" text-anchor="middle" font-family="monospace">CONNECTA ELS NODES BRILLANTS</text>
    </svg>`;
  },

  pixelSecret: function(config = {}) {
    const { code = '42', color = '#00f5ff', noise = true } = config;
    const GRID=16, CELL=100/GRID;
    const grid=Array.from({length:GRID},()=>Array(GRID).fill(0));
    const DM={'0':[[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],'1':[[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],'2':[[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],'3':[[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],'4':[[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],'5':[[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],'6':[[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],'7':[[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],'8':[[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],'9':[[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],'A':[[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],'B':[[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],'C':[[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]]};
    const digits=String(code).toUpperCase().split('');
    const total=digits.length, charW=4, totalW=total*(charW+1)-1;
    const startX=Math.floor((GRID-totalW)/2), startY=5;
    digits.forEach((d,di)=>{const map=DM[d]||DM['0'];map.forEach((row,ri)=>row.forEach((v,ci)=>{const gx=startX+di*(charW+1)+ci,gy=startY+ri;if(gx>=0&&gx<GRID&&gy>=0&&gy<GRID)grid[gy][gx]=v?2:0;}));});
    if(noise){for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++){if(grid[y][x]===0&&Math.random()<0.12)grid[y][x]=1;}}
    return `<div style="display:inline-block;background:#000;padding:10px;border:2px solid ${color};border-radius:10px;box-shadow:0 0 25px ${color}50;width:100%;max-width:320px">
      <div style="font-family:Orbitron,monospace;font-size:0.55rem;color:${color};text-align:center;margin-bottom:6px;letter-spacing:3px;opacity:0.7">MISSATGE XIFRAT</div>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;image-rendering:pixelated;display:block">
        <rect width="100" height="100" fill="#000510"/>
        ${grid.map((row,y)=>row.map((v,x)=>v===0?'':`<rect x="${x*CELL}" y="${y*CELL}" width="${CELL}" height="${CELL}" fill="${v===2?color:color+'25'}" opacity="${v===2?1:0.4}">${v===2?`<animate attributeName="opacity" values="1;0.7;1" dur="${1.2+((x+y)*7%10)*0.08}s" repeatCount="indefinite"/>`:''}</rect>`).join('')).join('')}
      </svg>
      <div style="font-family:Orbitron,monospace;font-size:0.5rem;color:${color}70;text-align:center;margin-top:6px;letter-spacing:2px">OBSERVA ELS PÍXELS BRILLANTS</div>
    </div>`;
  },

  starPattern: function(config = {}) {
    const { stars = 8, pattern = [0,3,7], color = '#00f5ff', title = 'CONSTEL·LACIÓ' } = config;
    const pts=Array.from({length:stars},(_,i)=>{const a=(360/stars)*i-90,r=a*Math.PI/180,radius=28+(i%3)*9;return{x:50+radius*Math.cos(r),y:50+radius*Math.sin(r)};});
    const lines=[];for(let i=0;i<pattern.length-1;i++)lines.push([pattern[i],pattern[i+1]]);
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:340px;background:radial-gradient(ellipse at 50% 45%,#050520,#000008);border-radius:12px">
      ${Array.from({length:40},(_,i)=>`<circle cx="${Math.sin(i*47)*50+50}" cy="${Math.cos(i*31)*45+45}" r="${0.3+Math.random()*0.8}" fill="white" opacity="${0.15+Math.random()*0.5}"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="${2+Math.random()*4}s" repeatCount="indefinite"/></circle>`).join('')}
      ${lines.map(([a,b])=>`<line x1="${pts[a].x}" y1="${pts[a].y}" x2="${pts[b].x}" y2="${pts[b].y}" stroke="${color}" stroke-width="1.2" opacity="0.85"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></line>`).join('')}
      ${pts.map((p,i)=>{const isHL=pattern.includes(i);return `<g>${isHL?`<circle cx="${p.x}" cy="${p.y}" r="8" fill="${color}" opacity="0.1"><animate attributeName="r" values="6;11;6" dur="2s" repeatCount="indefinite"/></circle>`:''}
        <circle cx="${p.x}" cy="${p.y}" r="${isHL?4:2}" fill="${isHL?color:'rgba(255,255,255,0.5)'}" opacity="${isHL?1:0.6}">${isHL?`<animate attributeName="r" values="3.5;5.5;3.5" dur="1.5s" repeatCount="indefinite"/>`:''}
        </circle>
        <text x="${p.x+5}" y="${p.y-4}" font-size="3.5" fill="${color}90" font-family="monospace">${i}</text></g>`;}).join('')}
      <text x="50" y="103" font-size="4.5" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold" letter-spacing="2">${title}</text>
      <text x="50" y="108" font-size="2.8" fill="${color}60" text-anchor="middle">CONNECTA: ${pattern.join(' → ')}</text>
    </svg>`;
  },

  controlPanel: function(config = {}) {
    const { switches = ['A','B','C','D'], solution = [0,2], color = '#ff6b00', label = 'PANEL' } = config;
    const n=switches.length, panW=Math.max(80,n*18), uid=label.replace(/\W/g,'');
    return `<svg viewBox="0 0 ${panW+20} 90" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:linear-gradient(180deg,#1a1a2e,#0d0d1a);border-radius:12px;border:2px solid ${color}50">
      <defs><radialGradient id="led${uid}" cx="50%" cy="30%"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}60"/></radialGradient></defs>
      <rect x="4" y="4" width="${panW+12}" height="82" rx="8" fill="none" stroke="${color}20" stroke-width="0.5"/>
      <text x="${(panW+20)/2}" y="16" font-size="6" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold" letter-spacing="2">${label}</text>
      <line x1="10" y1="22" x2="${panW+10}" y2="22" stroke="${color}30" stroke-width="0.5"/>
      ${switches.map((sw,i)=>{const x=10+i*(panW/n),cx=x+(panW/n)/2,isA=solution.includes(i);return `<g>
        <rect x="${cx-6}" y="25" width="12" height="35" rx="3" fill="#0a0a1a" stroke="${color}50" stroke-width="0.8"/>
        ${isA?`<circle cx="${cx}" cy="30" r="8" fill="${color}" opacity="0.12"><animate attributeName="r" values="6;11;6" dur="1.5s" repeatCount="indefinite"/></circle>`:''}
        <circle cx="${cx}" cy="30" r="3.5" fill="${isA?`url(#led${uid})`:'#111'}" stroke="${isA?color:'rgba(255,255,255,0.15)'}" stroke-width="1">
          ${isA?`<animate attributeName="opacity" values="1;0.6;1" dur="${0.8+i*0.15}s" repeatCount="indefinite"/>`:''}
        </circle>
        <rect x="${cx-3}" y="${isA?36:44}" width="6" height="12" rx="2" fill="${isA?color:'rgba(255,255,255,0.2)'}" opacity="${isA?0.9:0.4}"/>
        <text x="${cx}" y="70" font-size="${sw.length>2?3.5:5}" fill="${isA?color:'rgba(255,255,255,0.5)'}" text-anchor="middle" font-family="monospace" font-weight="bold">${sw}</text>
        <text x="${cx}" y="80" font-size="3" fill="${color}50" text-anchor="middle">${i+1}</text>
      </g>`}).join('')}
    </svg>`;
  },

  dnaHelix: function(config = {}) {
    const { seq1 = 'ATGCGA', seq2 = 'TACGCT', mutPos = 3, color = '#4ade80' } = config;
    const n=seq1.length, BC={A:'#ff6b00',T:'#00f5ff',G:'#4ade80',C:'#ff0080'};
    return `<svg viewBox="0 0 100 ${18+n*15+10}" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:300px;background:radial-gradient(ellipse at 50% 50%,${color}15,#000);border-radius:12px;border:2px solid ${color}30">
      <text x="50" y="10" font-size="4" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace">SEQÜÈNCIA ADN</text>
      ${Array.from({length:n},(_,i)=>{const y=18+i*15,wave=Math.sin((i/n)*Math.PI*2),x1=25+wave*12,x2=75+wave*12,isMut=i===mutPos,b1=seq1[i],b2=seq2[i];return `<g>
        <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${isMut?'#ff4444':color+'50'}" stroke-width="${isMut?2:1}" stroke-dasharray="${isMut?'none':'3,1'}"/>
        <circle cx="${x1}" cy="${y}" r="5" fill="${BC[b1]||color}" stroke="#000" stroke-width="0.8"/>
        <text x="${x1}" y="${y}" font-size="3.5" fill="#000" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${b1}</text>
        <circle cx="${x2}" cy="${y}" r="5" fill="${BC[b2]||color}" stroke="#000" stroke-width="0.8"/>
        <text x="${x2}" y="${y}" font-size="3.5" fill="#000" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${b2}</text>
        ${isMut?`<rect x="${Math.min(x1,x2)-8}" y="${y-7}" width="${Math.abs(x2-x1)+16}" height="14" rx="3" fill="none" stroke="#ff4444" stroke-width="1.5"><animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/></rect>
        <text x="${(x1+x2)/2}" y="${y-10}" font-size="3" fill="#ff4444" text-anchor="middle">⚠ MUTACIÓ</text>`:''}
      </g>`}).join('')}
    </svg>`;
  },

  // ══════════════════════════════════════════════════════════════
  //  AURORA-7 VISUALS CINEMATOGRÀFICS
  // ══════════════════════════════════════════════════════════════

  spaceAlert: function(config = {}) {
    const { color = '#00f5ff', sector = 0, threat = 'REACTOR' } = config;
    // The 4 blinking red numbers that form code 7749
    const redNums = ['7','7','4','9'];
    const allNums = [];
    // build a 5x4 grid of numbers, insert red ones at positions 3,7,10,15
    const redPositions = [3,7,10,15];
    let ri = 0;
    for(let i = 0; i < 20; i++){
      if(redPositions.includes(i)){
        allNums.push({ v: redNums[ri++], red: true });
      } else {
        allNums.push({ v: Math.floor(Math.random()*10), red: false });
      }
    }
    const cols = 5;
    const cellW = 16, cellH = 10;
    const gridSvg = allNums.map((n,i) => {
      const cx = 10 + (i % cols) * cellW + cellW/2;
      const cy = 48 + Math.floor(i / cols) * cellH + cellH/2;
      return `<text x="${cx}" y="${cy}" font-size="5.5" fill="${n.red ? '#ff3333' : color+'40'}"
        text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-weight="${n.red?'bold':'normal'}">
        ${n.v}${n.red ? `<animate attributeName="opacity" values="1;0.1;1" dur="${0.6+Math.random()*0.4}s" repeatCount="indefinite"/>` : ''}
      </text>`;
    }).join('');

    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#000810;border-radius:14px;border:2px solid ${color}60">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- Starfield -->
      ${Array.from({length:40},(_,i)=>`<circle cx="${(i*37.3)%100}" cy="${(i*19.7)%40}" r="${0.3+Math.random()*0.8}" fill="white" opacity="${0.1+Math.random()*0.5}"><animate attributeName="opacity" values="0.1;0.7;0.1" dur="${2+Math.random()*4}s" repeatCount="indefinite"/></circle>`).join('')}
      <!-- ARIA header -->
      <rect width="100" height="14" fill="${color}15"/>
      <text x="50" y="9" font-size="5" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold" letter-spacing="2">◈ ARIA — SISTEMA DE DIAGNÒSTIC ◈</text>
      <!-- Alert bar -->
      <rect y="15" width="100" height="7" fill="#ff000020"/>
      <text x="50" y="20.5" font-size="4.5" fill="#ff4444" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">⚠ SECTOR ${sector} — ${threat} — FALLADA CRÍTICA ⚠</text>
      <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite"/>
      <!-- Grid label -->
      <text x="10" y="45" font-size="3.5" fill="${color}80" font-family="monospace" letter-spacing="1">PANELL DE DIAGNÒSTIC — CODI D'ACCÉS:</text>
      <!-- Number grid -->
      ${gridSvg}
      <!-- Red numbers highlight -->
      <rect x="8" y="44" width="${5*cellW+4}" height="${4*cellH+4}" rx="3" fill="none" stroke="${color}20" stroke-width="0.5"/>
      <!-- Legend -->
      <rect x="8" y="94" width="84" height="22" rx="4" fill="${color}08" stroke="${color}20" stroke-width="0.5"/>
      <circle cx="16" cy="101" r="3" fill="#ff333380"/>
      <text x="22" y="103.5" font-size="3.8" fill="#ff4444" font-family="monospace">Els números en VERMELL formen el codi</text>
      <text x="22" y="110" font-size="3.5" fill="${color}60" font-family="monospace">Llegiu-los d'esquerra a dreta</text>
      <!-- Pulse corner decorations -->
      <rect x="0" y="0" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="92" y="0" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="0" y="112" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="92" y="112" width="8" height="8" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
    </svg>`;
  },

  oxygenBar: function(config = {}) {
    const { color = '#00f5ff' } = config;
    return `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#000810;border-radius:14px;border:2px solid ${color}60">
      <defs><filter id="og"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect width="100" height="12" fill="#ff000015"/>
      <text x="50" y="8.5" font-size="4.5" fill="#ff4444" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">⚠ SISTEMA D'OXIGEN — PRESSIÓ CRÍTICA ⚠</text>
      <!-- Oxygen molecule -->
      <circle cx="50" cy="35" r="12" fill="none" stroke="${color}30" stroke-width="1"/>
      <circle cx="43" cy="33" r="5" fill="${color}20" stroke="${color}" stroke-width="1" filter="url(#og)">
        <animate attributeName="r" values="5;6.5;5" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="57" cy="33" r="5" fill="${color}20" stroke="${color}" stroke-width="1" filter="url(#og)">
        <animate attributeName="r" values="5;6.5;5" dur="1.2s" begin="0.6s" repeatCount="indefinite"/>
      </circle>
      <text x="43" y="35" font-size="5" fill="${color}" text-anchor="middle" font-weight="bold">O</text>
      <text x="57" y="35" font-size="5" fill="${color}" text-anchor="middle" font-weight="bold">O</text>
      <line x1="48" y1="33" x2="52" y2="33" stroke="${color}" stroke-width="1.5"/>
      <!-- Pressure bar -->
      <text x="10" y="54" font-size="3.5" fill="${color}80" font-family="monospace">PRESSIÓ CABINA:</text>
      <rect x="10" y="57" width="80" height="6" rx="3" fill="rgba(255,255,255,0.07)"/>
      <rect x="10" y="57" width="12" height="6" rx="3" fill="#ff4444">
        <animate attributeName="width" values="12;15;12" dur="0.8s" repeatCount="indefinite"/>
      </rect>
      <text x="50" y="62.5" font-size="3" fill="rgba(255,255,255,0.5)" text-anchor="middle">15% — INSUFICIENT</text>
      <!-- Instruction -->
      <rect x="5" y="67" width="90" height="10" rx="4" fill="rgba(0,245,255,0.08)" stroke="${color}30" stroke-width="0.5"/>
      <text x="50" y="73.5" font-size="3.5" fill="${color}" text-anchor="middle" font-family="monospace">💨 Bufeu TOTS junts durant 5 SEGONS</text>
    </svg>`;
  },

  suspectBoard: function(config = {}) {
    const { color = '#00f5ff' } = config;
    const suspects = [
      { name:'VEGA', role:'PILOT', icon:'👩‍✈️', sus: 72 },
      { name:'KAI',  role:'ENGINYER', icon:'👨‍🔧', sus: 45 },
      { name:'SORA', role:'METGESSA', icon:'👩‍⚕️', sus: 91 },
      { name:'REX',  role:'SEGURETAT', icon:'🕵️', sus: 63 },
    ];
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#050010;border-radius:14px;border:2px solid #ff334480">
      <rect width="100" height="12" fill="#ff000020"/>
      <text x="50" y="8.5" font-size="4.5" fill="#ff4444" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">🔴 DOSSIER NEMESIS — ACCÉS RESTRINGIT</text>
      ${suspects.map((s,i) => {
        const x = 10 + (i % 2) * 50, y = 15 + Math.floor(i / 2) * 45;
        const barW = s.sus * 0.32;
        const barCol = s.sus > 80 ? '#ff4444' : s.sus > 60 ? '#ff8800' : '#00f5ff';
        return `<rect x="${x}" y="${y}" width="40" height="40" rx="5" fill="rgba(255,255,255,0.03)" stroke="${barCol}40" stroke-width="0.8"/>
        <text x="${x+7}" y="${y+13}" font-size="10">${s.icon}</text>
        <text x="${x+22}" y="${y+10}" font-size="5" fill="#fff" font-weight="bold" font-family="monospace">${s.name}</text>
        <text x="${x+22}" y="${y+17}" font-size="3" fill="rgba(255,255,255,0.4)" font-family="monospace">${s.role}</text>
        <text x="${x+7}" y="${y+27}" font-size="3" fill="${barCol}90" font-family="monospace">SOSPITA:</text>
        <rect x="${x+7}" y="${y+29}" width="30" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="${x+7}" y="${y+29}" width="${barW}" height="4" rx="2" fill="${barCol}">
          <animate attributeName="width" from="0" to="${barW}" dur="1.2s" fill="freeze"/>
        </rect>
        <text x="${x+38}" y="${y+33}" font-size="3.5" fill="${barCol}" text-anchor="end" font-family="monospace" font-weight="bold">${s.sus}%</text>`;
      }).join('')}
      <!-- Bottom instruction -->
      <rect x="5" y="102" width="90" height="7" rx="3" fill="rgba(255,51,51,0.08)" stroke="#ff444430" stroke-width="0.5"/>
      <text x="50" y="107" font-size="3.2" fill="#ff8888" text-anchor="middle" font-family="monospace">💬 Compartiu pistes verbalment entre equips</text>
    </svg>`;
  },

  morseDisplay: function(config = {}) {
    const { color = '#00f5ff', message = '... .- .-.. ...- .- .-. / .-.. .- / -. .- ...' } = config;
    // Split into characters for animated display
    const chars = message.split('');
    return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#000a05;border-radius:14px;border:2px solid ${color}60">
      <defs><filter id="scan"><feColorMatrix type="matrix" values="0 0 0 0 0  0.2 0 0 0 0.8  0 0 0 0 0  0 0 0 1 0"/></filter></defs>
      <!-- CRT scanlines effect -->
      ${Array.from({length:18},(_,i)=>`<line x1="0" y1="${i*5}" x2="100" y2="${i*5}" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>`).join('')}
      <rect width="100" height="12" fill="${color}15"/>
      <text x="50" y="8.5" font-size="4.5" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">📡 TRANSMISSIÓ INTERCEPTADA</text>
      <!-- Antenna icon -->
      <text x="8" y="25" font-size="8">📡</text>
      <text x="20" y="21" font-size="3.5" fill="${color}80" font-family="monospace">FREQÜÈNCIA: 418.7 MHz</text>
      <text x="20" y="27" font-size="3.5" fill="${color}60" font-family="monospace">ORIGEN: DESCONEGUT</text>
      <!-- Waveform -->
      <rect x="5" y="31" width="90" height="15" rx="3" fill="rgba(0,0,0,0.5)" stroke="${color}30" stroke-width="0.5"/>
      ${Array.from({length:44},(_,i)=>{
        const h = 2 + Math.random()*10;
        return `<rect x="${6+i*2}" y="${38-h/2}" width="1.2" height="${h}" fill="${color}" opacity="${0.3+Math.random()*0.5}">
          <animate attributeName="height" values="${h};${2+Math.random()*10};${h}" dur="${0.3+Math.random()*0.4}s" repeatCount="indefinite"/>
        </rect>`;
      }).join('')}
      <!-- Morse code display -->
      <text x="5" y="56" font-size="3.5" fill="${color}80" font-family="monospace" letter-spacing="1">MISSATGE MORSE DESCODIFICAT:</text>
      <rect x="5" y="58" width="90" height="20" rx="4" fill="rgba(0,245,255,0.05)" stroke="${color}40" stroke-width="0.5"/>
      <text x="50" y="66" font-size="3" fill="${color}" text-anchor="middle" font-family="monospace" letter-spacing="1">... .- .-.. ...- .- .-.</text>
      <text x="50" y="73" font-size="3" fill="${color}" text-anchor="middle" font-family="monospace" letter-spacing="1">.-.. .-   -. .- ...</text>
      <!-- Table hint -->
      <rect x="5" y="81" width="90" height="7" rx="3" fill="rgba(255,215,0,0.07)" stroke="rgba(255,215,0,0.2)" stroke-width="0.5"/>
      <text x="50" y="86" font-size="3.2" fill="#ffd700" text-anchor="middle" font-family="monospace">📋 Useu la taula Morse del sobre AURORA</text>
    </svg>`;
  },

  dnaVerification: function(config = {}) {
    const { color = '#00f5ff' } = config;
    const levels = [
      { col: '#ff3333', label: 'NEURAL', pct: 87 },
      { col: '#00ff88', label: 'RETINAL', pct: 92 },
      { col: '#a855f7', label: 'CORTICAL', pct: 78 },
      { col: color, label: 'SINÀPTIC', pct: 95 },
    ];
    return `<svg viewBox="0 0 100 95" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#000810;border-radius:14px;border:2px solid ${color}60">
      <rect width="100" height="12" fill="${color}15"/>
      <text x="50" y="8.5" font-size="4.5" fill="${color}" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">🧬 VERIFICACIÓ D'EMPREMTA NEURAL</text>
      <!-- DNA helix -->
      ${Array.from({length:8},(_,i)=>{
        const y = 16 + i*7, wave = Math.sin(i*0.8)*12;
        return `<line x1="${50+wave}" y1="${y}" x2="${50-wave}" y2="${y}" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
          <circle cx="${50+wave}" cy="${y}" r="2.5" fill="${color}" opacity="${0.4+i*0.04}">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="${0.8+i*0.1}s" repeatCount="indefinite"/>
          </circle>
          <circle cx="${50-wave}" cy="${y}" r="2.5" fill="#a855f7" opacity="${0.4+i*0.04}">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="${0.8+i*0.1}s" repeatCount="indefinite"/>
          </circle>`;
      }).join('')}
      <!-- Biometric bars -->
      ${levels.map((l,i) => {
        const y = 78 + i * 0; // they go horizontally
        const gy = 18 + i * 15;
        return `<text x="5" y="${14+gy}" font-size="3" fill="${l.col}90" font-family="monospace">${l.label}</text>
          <rect x="30" y="${10+gy}" width="60" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
          <rect x="30" y="${10+gy}" width="${l.pct*0.6}" height="4" rx="2" fill="${l.col}">
            <animate attributeName="width" from="0" to="${l.pct*0.6}" dur="${0.8+i*0.3}s" fill="freeze"/>
          </rect>
          <text x="93" y="${14+gy}" font-size="3" fill="${l.col}" text-anchor="end" font-family="monospace">${l.pct}%</text>`;
      }).join('')}
      <!-- Status -->
      <rect x="5" y="87" width="90" height="7" rx="3" fill="rgba(0,245,255,0.08)" stroke="${color}30" stroke-width="0.5"/>
      <text x="50" y="92" font-size="3.5" fill="${color}" text-anchor="middle" font-family="monospace">⚡ Esperant seqüència biomètrica...</text>
    </svg>`;
  },

  uvReveal: function(config = {}) {
    const { color = '#00f5ff', hiddenCode = 'AURORA' } = config;
    return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#050008;border-radius:14px;border:2px solid #a855f780">
      <defs>
        <radialGradient id="uvlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <rect width="100" height="12" fill="#a855f715"/>
      <text x="50" y="8.5" font-size="4.5" fill="#a855f7" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">🔦 TINTA INVISIBLE — DOCUMENT SECRET</text>
      <!-- Paper texture -->
      <rect x="15" y="16" width="70" height="55" rx="4" fill="#f5f0e8" opacity="0.08" stroke="#a855f730" stroke-width="0.8"/>
      <!-- UV light cone -->
      <ellipse cx="50" cy="44" rx="28" ry="20" fill="url(#uvlight)">
        <animate attributeName="rx" values="28;32;28" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- Hidden text revealed under UV -->
      <text x="50" y="38" font-size="5" fill="#a855f7" text-anchor="middle" font-family="monospace" font-weight="bold" opacity="0">
        ${hiddenCode}
        <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      </text>
      <text x="50" y="50" font-size="3.5" fill="#cc99ff" text-anchor="middle" font-family="monospace" opacity="0">
        — CODI DE DESACTIVACIÓ —
        <animate attributeName="opacity" values="0;0.7;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
      </text>
      <!-- Flashlight icon -->
      <text x="50" y="30" font-size="16" text-anchor="middle">🔦</text>
      <!-- Instructions -->
      <rect x="5" y="75" width="90" height="13" rx="4" fill="rgba(168,85,247,0.08)" stroke="#a855f730" stroke-width="0.5"/>
      <text x="50" y="81" font-size="3.5" fill="#cc99ff" text-anchor="middle" font-family="monospace">Apunteu la llum UV al document secret</text>
      <text x="50" y="86" font-size="3.2" fill="#a855f780" text-anchor="middle" font-family="monospace">El professor té el document preparat</text>
    </svg>`;
  },

  reactorCountdown: function(config = {}) {
    const { color = '#00f5ff' } = config;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:480px;background:#080000;border-radius:14px;border:2px solid #ff444480">
      <defs>
        <radialGradient id="reactorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff4444" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <!-- Background glow -->
      <ellipse cx="50" cy="50" rx="45" ry="45" fill="url(#reactorGlow)">
        <animate attributeName="rx" values="40;50;40" dur="1s" repeatCount="indefinite"/>
      </ellipse>
      <rect width="100" height="12" fill="#ff000025"/>
      <text x="50" y="8.5" font-size="4" fill="#ff4444" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">⚠ AUTODESTRUCCIÓ INICIADA ⚠</text>
      <!-- Reactor core -->
      <circle cx="50" cy="48" r="22" fill="none" stroke="#ff444440" stroke-width="2"/>
      <circle cx="50" cy="48" r="16" fill="none" stroke="#ff444460" stroke-width="1.5"/>
      <circle cx="50" cy="48" r="10" fill="#ff0000" opacity="0.2">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.8s" repeatCount="indefinite"/>
        <animate attributeName="r" values="9;13;9" dur="0.8s" repeatCount="indefinite"/>
      </circle>
      <!-- Rotating danger arrows -->
      ${Array.from({length:8},(_,i)=>{
        const a = i*45*Math.PI/180;
        const x1=50+16*Math.cos(a), y1=48+16*Math.sin(a);
        const x2=50+20*Math.cos(a), y2=48+20*Math.sin(a);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff4444" stroke-width="1.5" opacity="0.6"/>`;
      }).join('')}
      <text x="50" y="52" font-size="14" text-anchor="middle">☢️</text>
      <!-- Status -->
      <rect x="5" y="73" width="90" height="8" rx="3" fill="#ff00002a" stroke="#ff444430" stroke-width="0.5"/>
      <text x="50" y="79" font-size="4" fill="#ff4444" text-anchor="middle" font-family="Orbitron,monospace" font-weight="bold">TOTS ELS EQUIPS: ENVIEU JUNTS!</text>
      <!-- Sync instruction -->
      <rect x="5" y="84" width="90" height="14" rx="4" fill="rgba(0,245,255,0.06)" stroke="${color}30" stroke-width="0.5"/>
      <text x="50" y="90" font-size="3.5" fill="${color}" text-anchor="middle" font-family="monospace">Compteu: 3... 2... 1... ENVIEU!</text>
      <text x="50" y="96" font-size="3.2" fill="${color}80" text-anchor="middle" font-family="monospace">El codi és el nom de la missió</text>
    </svg>`;
  },

  stockMarket: function(config = {}) {
    const { companies = ['TECH','FOOD','BANK'], prices = [100,85,120], color = '#00ff88' } = config;
    const maxP=Math.max(...prices);
    return `<div style="background:#020f08;border:2px solid ${color}50;border-radius:12px;padding:12px;font-family:Orbitron,monospace;max-width:400px">
      <div style="font-size:0.65rem;color:${color};letter-spacing:3px;margin-bottom:10px;text-align:center">📈 MERCAT DE VALORS EN VIU</div>
      ${companies.map((c,i)=>{const pct=((prices[i]/100-1)*100).toFixed(0),up=prices[i]>=100;return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;padding:6px 8px;background:rgba(255,255,255,0.04);border-radius:6px">
        <span style="font-size:0.65rem;color:rgba(255,255,255,0.7);min-width:45px">${c}</span>
        <div style="flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px">
          <div style="height:100%;width:${(prices[i]/maxP*100).toFixed(0)}%;background:${up?color:'#ff4444'};border-radius:3px"></div>
        </div>
        <span style="font-family:monospace;font-size:0.75rem;color:${up?color:'#ff4444'};min-width:35px;text-align:right">${prices[i]}</span>
        <span style="font-size:0.6rem;color:${up?color:'#ff4444'};min-width:42px;text-align:right">${up?'+':''}${pct}%</span>
      </div>`}).join('')}
      <div style="text-align:center;font-size:0.5rem;color:${color}50;margin-top:6px">CADA EQUIP TÉ 1000 CR · COMPRA · VEN · AGUANTA</div>
    </div>`;
  }

};
