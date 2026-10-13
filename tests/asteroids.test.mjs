import assert from 'node:assert/strict';
import { randomUnitVector, randomSpawnState, SPAWN } from '../static/js/asteroids.js';

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
    const v = randomUnitVector();
    if (v.y > 0.5) above++;
  }
  const p = above / N;
  const expected = 0.25;
  assert.ok(Math.abs(p - expected) < 0.02, `p=${p}, expected=${expected}`);
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
    assert.ok(s.offset.y !== 0, 'spherical spawn must reach out of ecliptic plane');
    distances.add(Math.round(s.distanceAU * 10));
  }
  assert.ok(distances.size >= 30, `distances must vary widely, got ${distances.size} unique values`);
});

test('randomSpawnState: offset matches distance from origin', () => {
  for (let i = 0; i < 100; i++) {
    const s = randomSpawnState({ auPerUnit: 200 });
    const r = Math.hypot(s.offset.x, s.offset.y, s.offset.z);
    assert.ok(Math.abs(r - s.distanceAU * 200) < 1e-6);
  }
});

test('randomSpawnState: velocity aims near the Sun, not exactly at it', () => {
  let exact = 0;
  for (let i = 0; i < 300; i++) {
    const s = randomSpawnState({ auPerUnit: 200 });
    const v = s.velocity;
    const speed = Math.hypot(v.x, v.y, v.z);
    assert.ok(speed >= SPAWN.minSpeed && speed <= SPAWN.maxSpeed + 1e-9);
    const pos = s.offset;
    const cosAngle = (pos.x * v.x + pos.y * v.y + pos.z * v.z) / (Math.hypot(pos.x, pos.y, pos.z) * speed);
    assert.ok(cosAngle < 0, 'velocity must be inbound');
    if (cosAngle < -0.999) exact++;
  }
  assert.ok(exact < 300 * 0.2, 'most asteroids must be deflected, not all aimed at the Sun');
});

test('randomSpawnState: velocities point in all directions over many samples', () => {
  const ys = [];
  for (let i = 0; i < 1000; i++) {
    ys.push(randomSpawnState({ auPerUnit: 200 }).velocity.y);
  }
  const positive = ys.filter(y => y > 0).length;
  assert.ok(positive > 300 && positive < 700, `vy distribution too skewed: ${positive}/1000`);
});

console.log(`\n${passed} tests passed`);
