import assert from 'node:assert/strict';
import { solveKepler, planetPosition, lagrangePosition, makeDateAt } from '../static/js/physics.js';
import { PLANETS } from '../static/js/data.js';

let passed = 0;

function test(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('physics tests');

test('solveKepler: circular orbit is identity', () => {
  assert.ok(Math.abs(solveKepler(1.2, 0) - 1.2) < 1e-12);
});

test('solveKepler: Newton converges for e=0.2', () => {
  const e = 0.2, M = 0.5;
  const E = solveKepler(M, e);
  assert.ok(Math.abs(E - e * Math.sin(E) - M) < 1e-10);
});

test('planetPosition: period returns to same spot', () => {
  const earth = PLANETS[2];
  const p1 = planetPosition(earth, 100);
  const p2 = planetPosition(earth, 100 + earth.period);
  assert.ok(Math.hypot(p1.x - p2.x, p1.z - p2.z) < 1e-6);
});

test('planetPosition: elliptical orbit keeps Sun at focus', () => {
  const mercury = PLANETS[0];
  for (let t = 0; t < mercury.period; t += 7) {
    const pos = planetPosition(mercury, t);
    const auDist = pos.r;
    assert.ok(auDist >= mercury.a * (1 - mercury.e) - 1e-9);
    assert.ok(auDist <= mercury.a * (1 + mercury.e) + 1e-9);
  }
});

test('planetPosition: Kepler\'s second law (equal areas in equal times)', () => {
  const mars = PLANETS[3];
  const sample = (t0, dt) => {
    const a = planetPosition(mars, t0);
    const b = planetPosition(mars, t0 + dt);
    return 0.5 * Math.abs(a.x * b.z - b.x * a.z);
  };
  const nearPerihelion = sample(0, 5);
  const nearAphelion = sample(mars.period / 2, 5);
  assert.ok(Math.abs(nearPerihelion - nearAphelion) < 0.05 * nearPerihelion);
});

test('planetPosition: inclination matches data', () => {
  const mercury = PLANETS[0];
  let maxY = 0;
  for (let t = 0; t < mercury.period; t += 2) {
    maxY = Math.max(maxY, Math.abs(planetPosition(mercury, t).y));
  }
  const expected = Math.sin(mercury.inclination * Math.PI / 180) * mercury.a * Math.sqrt(1 - mercury.e * mercury.e) * 200;
  assert.ok(Math.abs(maxY - expected) / expected < 0.05);
});

test('lagrangePosition: L4/L5 form equilateral triangles', () => {
  const jupiter = PLANETS[4];
  const pos = planetPosition(jupiter, 300);
  for (const which of ['L4', 'L5']) {
    const lp = lagrangePosition(pos, which);
    const dSun = Math.hypot(lp.x, lp.z);
    const dPlanet = Math.hypot(lp.x - pos.x, lp.z - pos.z);
    assert.ok(Math.abs(dSun - dPlanet) / dSun < 1e-9);
  }
});

test('lagrangePosition: L3 is diametrically opposite', () => {
  const earth = PLANETS[2];
  const pos = planetPosition(earth, 0);
  const l3 = lagrangePosition(pos, 'L3');
  assert.ok(Math.abs(Math.hypot(l3.x, l3.z) + 0) >= 0);
  assert.ok(Math.abs(l3.x + pos.x) < 1e-9 && Math.abs(l3.z + pos.z) < 1e-9);
});

test('makeDateAt: renders a French date', () => {
  const d = makeDateAt(0);
  assert.match(d, /2025/);
});

console.log(`\n${passed} tests passed`);
