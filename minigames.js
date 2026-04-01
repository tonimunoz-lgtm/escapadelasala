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
