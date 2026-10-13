import { PLANETS, AU_VISUAL } from './data.js';
import { lagrangePosition } from './physics.js';

const JUPITER = PLANETS.find(p => p.name === 'Jupiter');

export const TIME_SCALE = 1;
export const GM_SUN = Math.pow(JUPITER.a * AU_VISUAL, 3) * Math.pow(2 * Math.PI / JUPITER.period, 2) / Math.pow(TIME_SCALE, 2);
export const SUN_MASS_EARTHS = 333000;

export function planetGM(massEarths) {
  return GM_SUN * massEarths / SUN_MASS_EARTHS;
}

export function circularSpeed(r) {
  return Math.sqrt(GM_SUN / r);
}

export const SPAWN = {
  minAU: 6,
  maxAU: 10,
  maxDeflectionRad: 0.5,
  minSpeed: 0.8,
  maxSpeed: 2.6,
  minIntervalMs: 2400,
  maxIntervalMs: 4200,
  killRadius: 15,
  killDistanceAU: 120,
  maxPopulation: 150,
  trojanFraction: 0.4,
  trojanJitterAU: 0.45,
  trojanSpeedSpread: 0.08,
  maxSpeedCap: 25,
};

function randomUniform(min, max) {
  return min + Math.random() * (max - min);
}

export function randomUnitVector(rng = Math.random) {
  const z = 2 * rng() - 1;
  const phi = rng() * 2 * Math.PI;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return { x: r * Math.cos(phi), y: z, z: r * Math.sin(phi) };
}

export function randomSpawnState({ auPerUnit = 200 } = {}) {
  const dir = randomUnitVector();
  const distanceAU = randomUniform(SPAWN.minAU, SPAWN.maxAU);
  const speed = randomUniform(SPAWN.minSpeed, SPAWN.maxSpeed);

  const toSun = { x: -dir.x, y: -dir.y, z: -dir.z };
  const deflection = randomUniform(-SPAWN.maxDeflectionRad, SPAWN.maxDeflectionRad);
  const cosD = Math.cos(deflection);
  const sinD = Math.sin(deflection);

  const axis = randomUnitVector();
  const cross = {
    x: toSun.y * axis.z - toSun.z * axis.y,
    y: toSun.z * axis.x - toSun.x * axis.z,
    z: toSun.x * axis.y - toSun.y * axis.x,
  };
  const axisLength = Math.hypot(cross.x, cross.y, cross.z) || 1;
  cross.x /= axisLength; cross.y /= axisLength; cross.z /= axisLength;

  const velocity = {
    x: toSun.x * cosD + cross.x * sinD,
    y: toSun.y * cosD + cross.y * sinD,
    z: toSun.z * cosD + cross.z * sinD,
  };

  return {
    offset: {
      x: dir.x * distanceAU * auPerUnit,
      y: dir.y * distanceAU * auPerUnit,
      z: dir.z * distanceAU * auPerUnit,
    },
    velocity: { x: velocity.x * speed, y: velocity.y * speed, z: velocity.z * speed },
    distanceAU,
  };
}

export function trojanCandidateSpawn(planetHelioPos, which) {
  const lp = lagrangePosition(planetHelioPos, which);
  const r = Math.hypot(lp.x, lp.z);
  if (r === 0) {
    return { offset: { x: 0, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 } };
  }

  const jitter = randomUnitVector();
  const jitterMag = randomUniform(0, SPAWN.trojanJitterAU) * AU_VISUAL;
  const offset = {
    x: lp.x + jitter.x * jitterMag,
    y: lp.y + jitter.y * jitterMag,
    z: lp.z + jitter.z * jitterMag,
  };

  const vCirc = circularSpeed(r);
  const speed = vCirc * (1 + (Math.random() * 2 - 1) * SPAWN.trojanSpeedSpread);
  const tangent = { x: -lp.z / r, z: lp.x / r };
  const radial = (Math.random() - 0.5) * 0.1 * speed;

  return {
    offset,
    velocity: {
      x: tangent.x * speed + (lp.x / r) * radial,
      y: 0,
      z: tangent.z * speed + (lp.z / r) * radial,
    },
  };
}

export function stepAsteroid(state, h, bodies) {
  let ax = 0, ay = 0, az = 0;
  for (const body of bodies) {
    const dx = body.x - state.x;
    const dy = body.y - state.y;
    const dz = body.z - state.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    const d = Math.sqrt(d2);
    if (d < 1e-6) continue;
    const a = body.gm / (d2 * d);
    ax += a * dx; ay += a * dy; az += a * dz;
  }
  return { ax, ay, az };
}
