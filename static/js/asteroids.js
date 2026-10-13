export const SPAWN = {
  minAU: 6,
  maxAU: 10,
  maxDeflectionRad: 0.5,
  minSpeed: 1,
  maxSpeed: 3,
  minIntervalMs: 2400,
  maxIntervalMs: 4200,
  killRadius: 15,
  killDistanceAU: 120,
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
