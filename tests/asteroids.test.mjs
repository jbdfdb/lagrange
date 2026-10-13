import assert from 'node:assert/strict';
import { randomUnitVector, randomSpawnState, trojanCandidateSpawn, stepAsteroid, SPAWN, GM_SUN, planetGM, circularSpeed, SUN_MASS_EARTHS } from '../static/js/asteroids.js';
import { PLANETS, AU_VISUAL } from '../static/js/data.js';
import { planetPosition, lagrangePosition } from '../static/js/physics.js';

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

console.log('asteroids tests');

test('randomUnitVector: unit length', () => {
  for (let i = 0; i < 500; i++) {
    const v = randomUnitVector();
    assert.ok(Math.abs(Math.hypot(v.x, v.y, v.z) - 1) < 1e-9);
  }
});

test('randomUnitVector: isotropic (y uniform on [-1,1])', () => {
  const N = 20000;
  let above = 0;
  for (let i = 0; i < N; i++) {
    if (randomUnitVector().y > 0.5) above++;
  }
  const p = above / N;
  assert.ok(Math.abs(p - 0.25) < 0.02, `p=${p}`);
});

test('randomUnitVector: with seeded rng is deterministic', () => {
  let seed = 42;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const a = randomUnitVector(rng);
  seed = 42;
  const b = randomUnitVector(rng);
  assert.deepEqual(a, b);
});

test('randomSpawnState: distance within shell and varied', () => {
  const distances = new Set();
  for (let i = 0; i < 200; i++) {
    const s = randomSpawnState({ auPerUnit: 200 });
    assert.ok(s.distanceAU >= SPAWN.minAU && s.distanceAU <= SPAWN.maxAU);
    distances.add(Math.round(s.distanceAU * 10));
  }
  assert.ok(distances.size >= 30, `distances must vary widely, got ${distances.size}`);
});

test('randomSpawnState: offset matches distance from origin', () => {
  for (let i = 0; i < 100; i++) {
    const s = randomSpawnState({ auPerUnit: 200 });
    const r = Math.hypot(s.offset.x, s.offset.y, s.offset.z);
    assert.ok(Math.abs(r - s.distanceAU * 200) < 1e-6);
  }
});

test('randomSpawnState: velocity inbound but not all aimed at the Sun', () => {
  let exact = 0;
  for (let i = 0; i < 300; i++) {
    const s = randomSpawnState({ auPerUnit: 200 });
    const pos = s.offset;
    const speed = Math.hypot(s.velocity.x, s.velocity.y, s.velocity.z);
    assert.ok(speed >= SPAWN.minSpeed && speed <= SPAWN.maxSpeed + 1e-9);
    const cosAngle = (pos.x * s.velocity.x + pos.y * s.velocity.y + pos.z * s.velocity.z) / (Math.hypot(...[pos.x, pos.y, pos.z]) * speed);
    assert.ok(cosAngle < 0, 'velocity must be inbound');
    if (cosAngle < -0.999) exact++;
  }
  assert.ok(exact < 300 * 0.2);
});

test('GM_SUN derived from Jupiter Kepler period is consistent', () => {
  const jupiter = PLANETS.find(p => p.name === 'Jupiter');
  const r = jupiter.a * AU_VISUAL;
  const v = Math.sqrt(GM_SUN / r);
  const expectedPeriod = 2 * Math.PI * r / v;
  assert.ok(Math.abs(expectedPeriod - jupiter.period) / jupiter.period < 1e-9);
});

test('planetGM: real mass ratios (Routh criterion μ < 0.0385)', () => {
  for (const p of PLANETS) {
    const mu = p.mass / SUN_MASS_EARTHS;
    assert.ok(mu < 0.0385, `${p.name} violates Routh: μ=${mu}`);
  }
  const jupiterGM = planetGM(317.8);
  const muJ = jupiterGM / GM_SUN;
  assert.ok(Math.abs(muJ - 317.8 / 333000) < 1e-12);
});

test('circularSpeed at Jupiter matches its Kepler orbital speed', () => {
  const jupiter = PLANETS.find(p => p.name === 'Jupiter');
  const r = jupiter.a * AU_VISUAL;
  const vCirc = circularSpeed(r);
  const vKepler = 2 * Math.PI * r / jupiter.period;
  assert.ok(Math.abs(vCirc - vKepler) / vKepler < 1e-9);
});

test('trojanCandidateSpawn: seeded near L4/L5 with near-circular speed', () => {
  const jupiter = PLANETS.find(p => p.name === 'Jupiter');
  const pos = planetPosition(jupiter, 1234);
  for (const which of ['L4', 'L5']) {
    const lp = lagrangePosition(pos, which);
    const rLP = Math.hypot(lp.x, lp.z);
    for (let i = 0; i < 50; i++) {
      const s = trojanCandidateSpawn(pos, which);
      const d = Math.hypot(s.offset.x - lp.x, s.offset.y - lp.y, s.offset.z - lp.z);
      assert.ok(d <= SPAWN.trojanJitterAU * AU_VISUAL + 1e-6, `jitter too large: ${d}`);
      const speed = Math.hypot(s.velocity.x, s.velocity.y, s.velocity.z);
      const vCirc = circularSpeed(rLP);
      const tolerance = SPAWN.trojanSpeedSpread + 0.05 * SPAWN.trojanSpeedSpread + 0.005;
      assert.ok(Math.abs(speed - vCirc) / vCirc <= tolerance, `speed ${speed} vs circ ${vCirc}`);
      const radialDot = (s.offset.x * s.velocity.x + s.offset.z * s.velocity.z) / (Math.hypot(s.offset.x, s.offset.z) * speed || 1);
      assert.ok(Math.abs(radialDot) < 0.2, 'tangential-ish launch required');
    }
  }
});

test('stepAsteroid: Kepler energy conservation (bound orbit stays bound)', () => {
  const jupiter = PLANETS.find(p => p.name === 'Jupiter');
  const r = jupiter.a * AU_VISUAL;
  const vC = circularSpeed(r);
  let state = { x: r, y: 0, z: 0 };
  let vel = { x: 0, y: 0, z: vC * 0.9 };
  const bodies = [{ x: 0, y: 0, z: 0, gm: GM_SUN }];
  const h = 0.1;
  const steps = 20000;
  let energy0 = 0.5 * (vel.x ** 2 + vel.z ** 2) - GM_SUN / Math.hypot(state.x, state.z);
  for (let i = 0; i < steps; i++) {
    const { ax, ay, az } = stepAsteroid(state, h, bodies);
    vel.x += ax * h; vel.z += az * h;
    state.x += vel.x * h; state.z += vel.z * h;
  }
  const energy1 = 0.5 * (vel.x ** 2 + vel.z ** 2) - GM_SUN / Math.hypot(state.x, state.z);
  assert.ok(Math.abs(energy1 - energy0) / Math.abs(energy0) < 0.02, `energy drift ${(energy1 - energy0) / energy0}`);
});

test('integration: seeded trojan stays in the L4 tadpole region over one Jupiter period', () => {
  const jupiter = PLANETS.find(p => p.name === 'Jupiter');
  const jupPos0 = planetPosition(jupiter, 0);
  const lp = lagrangePosition(jupPos0, 'L4');
  const r = Math.hypot(lp.x, lp.z);
  const vC = circularSpeed(r);
  const tangent = { x: -lp.z / r, z: lp.x / r };
  let state = { x: lp.x, y: 0, z: lp.z };
  let vel = { x: tangent.x * vC, y: 0, z: tangent.z * vC };

  const h = 0.25;
  const jupGM = planetGM(jupiter.mass);
  let minSep = Infinity, maxSep = 0;
  let maxAngleDev = 0;
  for (let t = 0; t < jupiter.period * 1.5; t += h) {
    const jupPos = planetPosition(jupiter, t);
    const bodies = [
      { x: 0, y: 0, z: 0, gm: GM_SUN },
      { x: jupPos.x, y: 0, z: jupPos.z, gm: jupGM },
    ];
    const acc = stepAsteroid(state, h, bodies);
    vel.x += acc.ax * h; vel.z += acc.az * h;
    state.x += vel.x * h; state.z += vel.z * h;

    const jupAngle = Math.atan2(jupPos.z, jupPos.x);
    const angle = Math.atan2(state.z, state.x) - jupAngle;
    const dev = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
    maxAngleDev = Math.max(maxAngleDev, dev);
    const sep = Math.hypot(state.x - jupPos.x, state.z - jupPos.z);
    minSep = Math.min(minSep, sep);
    maxSep = Math.max(maxSep, sep);
  }
  assert.ok(maxAngleDev > Math.PI / 12, `trojan must librate, max angle deviation ${maxAngleDev}`);
  assert.ok(maxAngleDev < Math.PI * 0.9, `trojan must not escape the tadpole: ${maxAngleDev}`);
  assert.ok(minSep > jupiter.radius * 2, `collision with Jupiter: minSep=${minSep}`);
});

console.log(`\n${passed} tests passed`);
