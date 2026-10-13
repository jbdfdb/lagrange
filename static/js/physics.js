import { AU_VISUAL } from './data.js';

export function solveKepler(M, e, iterations = 8) {
  let E = M;
  for (let i = 0; i < iterations; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
}

export function planetPosition(p, tDays) {
  const n = (2 * Math.PI) / p.period;
  const M = p.M0 + n * tDays;
  const E = solveKepler(M, p.e);
  const xv = p.a * (Math.cos(E) - p.e);
  const yv = p.a * Math.sqrt(1 - p.e * p.e) * Math.sin(E);
  const r = Math.hypot(xv, yv);
  const nu = Math.atan2(yv, xv);
  const inc = p.inclination * Math.PI / 180;
  return {
    x: r * Math.cos(nu) * AU_VISUAL,
    y: r * Math.sin(nu) * Math.sin(inc) * AU_VISUAL,
    z: r * Math.sin(nu) * Math.cos(inc) * AU_VISUAL,
    r: r,
  };
}

export function lagrangePosition(planetPos, which) {
  const theta = Math.atan2(planetPos.z, planetPos.x);
  const r = Math.hypot(planetPos.x, planetPos.z);
  const offsets = { L1: 0, L2: 0, L3: Math.PI, L4: Math.PI / 3, L5: -Math.PI / 3 };
  const a = theta + offsets[which];
  return {
    x: Math.cos(a) * r,
    y: planetPos.y,
    z: Math.sin(a) * r,
  };
}

export function makeDateAt(simDays) {
  const epoch = Date.UTC(2025, 0, 1);
  return new Date(epoch + simDays * 86400000).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}
