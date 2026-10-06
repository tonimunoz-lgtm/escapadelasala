// Utilitats d'interfície compartides (joc i panell del professorat)
export const $ = (s) => document.querySelector(s);

// Crea elements sense innerHTML (els noms d'empresa i els missatges els escriu l'alumnat)
export function h(tag, attrs = {}, ...fills) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const f of fills.flat()) if (f != null && f !== false) el.append(f.nodeType ? f : String(f));
  return el;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
export function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

export function avis(text, tipus = 'info') {
  const el = h('div', { class: `avis avis-${tipus}` }, text);
  $('#avisos').append(el);
  setTimeout(() => el.classList.add('fora'), 3200);
  setTimeout(() => el.remove(), 3700);
}

export function mostrarPantalla(id) {
  for (const p of document.querySelectorAll('.pantalla')) p.hidden = p.id !== id;
  $('#carregant').hidden = true;
}
