import * as THREE from '../vendor/three.module.js';
import { PLANETS, TRAIL_DURATIONS } from './data.js';

export class Labels {
  constructor() {
    this.items = [];
    this.MARGIN_PX = 12;
  }

  add(object, text, className = '', worldRadius = 1) {
    const div = document.createElement('div');
    div.textContent = text;
    div.className = `label ${className}`;
    document.body.appendChild(div);
    this.items.push({ div, object, worldRadius });
    return div;
  }

  update(camera) {
    const v = new THREE.Vector3();
    const world = new THREE.Vector3();
    const tanHalfFov = Math.tan((camera.fov * Math.PI / 180) / 2);
    for (const label of this.items) {
      label.object.getWorldPosition(world);
      v.copy(world).project(camera);
      if (v.z > 1) {
        label.div.style.display = 'none';
        continue;
      }
      const screenX = (v.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-v.y * 0.5 + 0.5) * window.innerHeight;
      const distance = world.distanceTo(camera.position);
      const screenRadius = distance > 0
        ? (label.worldRadius / (distance * tanHalfFov)) * (window.innerHeight / 2)
        : 0;
      label.div.style.display = 'block';
      label.div.style.left = screenX + 'px';
      label.div.style.top = screenY + screenRadius + this.MARGIN_PX + 'px';
    }
  }

  setVisible(visible) {
    this.items.forEach(l => { l.div.style.display = visible ? 'block' : 'none'; });
  }
}

export function buildReferentialButtons(onSelect, activeName = 'Soleil') {
  const container = document.getElementById('referential-buttons');
  const entries = [{ name: 'Soleil', index: -1 }, ...PLANETS.map((p, i) => ({ name: p.name, index: i }))];
  const buttons = new Map();
  entries.forEach(e => {
    const btn = document.createElement('button');
    btn.textContent = e.index === -1 ? `☀️ ${e.name}` : e.name;
    if (e.name === activeName) btn.classList.add('active');
    btn.onclick = () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(e.index, e.name);
    };
    container.appendChild(btn);
    buttons.set(e.name, btn);
  });
  return buttons;
}

export function buildTrailButtons(onSelect, active = 10) {
  const container = document.getElementById('trail-buttons');
  TRAIL_DURATIONS.forEach(duration => {
    const btn = document.createElement('button');
    btn.textContent = `${duration}s`;
    if (duration === active) btn.classList.add('active');
    btn.onclick = () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(duration);
    };
    container.appendChild(btn);
  });
}

export function showReferentialCaption(name, captions) {
  const el = document.getElementById('ref-caption');
  el.textContent = captions[name] || '';
  el.classList.toggle('visible', Boolean(captions[name]));
}

export function showInfoCard(title, info) {
  document.getElementById('info-title').textContent = title;
  const body = document.getElementById('info-body');
  body.innerHTML = '';
  if (info.type) {
    const type = document.createElement('div');
    type.textContent = info.type;
    type.style.cssText = 'color:#6699BB;font-size:10px;margin-bottom:8px;letter-spacing:1px;';
    body.appendChild(type);
  }
  info.stats.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'stat';
    const l = document.createElement('span');
    l.textContent = label;
    const v = document.createElement('span');
    v.textContent = value;
    row.append(l, v);
    body.appendChild(row);
  });
  if (info.facts) {
    const facts = document.createElement('p');
    facts.textContent = info.facts;
    facts.style.margin = '10px 0 0';
    body.appendChild(facts);
  }
  document.getElementById('info-card').classList.remove('hidden');
}

export function hideInfoCard() {
  document.getElementById('info-card').classList.add('hidden');
}
