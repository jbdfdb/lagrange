import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/jsm/controls/OrbitControls.js';
import { EffectComposer } from './vendor/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/jsm/postprocessing/OutputPass.js';
import { PLANETS, AU_VISUAL, SUN_MASS, REFERENTIAL_CAPTIONS, PLANET_INFO, LAGRANGE_INFO } from './js/data.js';
import { randomSpawnState, trojanCandidateSpawn, stepAsteroid, planetGM, GM_SUN, SPAWN } from './js/asteroids.js';
import { planetPosition, lagrangePosition, makeDateAt } from './js/physics.js';
import {
  createSun, createPlanetMesh, createSaturnRings, createOrbitLine,
  createLagrangeMarker, createTrojans, updateTrojans, createStars,
} from './js/scene.js';
import { Labels, buildReferentialButtons, buildTrailButtons, showReferentialCaption, showInfoCard, hideInfoCard } from './js/ui.js';

const SIM_START_DAYS_PER_SECOND = 3;
const DAY_MS_AT_1X = 365.25 / SIM_START_DAYS_PER_SECOND;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
camera.position.set(8000, 6000, 8000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.9, 0.4, 0.85,
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 50;
controls.maxDistance = 20000;

const sunLight = new THREE.PointLight(0xFFEE88, 2, 50000);
sunLight.castShadow = true;
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x112244, 0.3));

const labels = new Labels();
const sun = createSun();
scene.add(sun);
labels.add(sun, 'Soleil', 'sun');

const planetMeshes = [];
const orbitLines = [];
const lagrangeGroups = new Map();
const trojanGroups = [];

PLANETS.forEach(p => {
  const mesh = createPlanetMesh(p);
  scene.add(mesh);
  planetMeshes.push(mesh);
  labels.add(mesh, p.name);

  const orbit = createOrbitLine(p);
  scene.add(orbit);
  orbitLines.push(orbit);

  if (p.name === 'Saturne') createSaturnRings(mesh, p);

  if (p.mass >= 10) {
    const group = new THREE.Group();
    ['L1', 'L2', 'L3', 'L4', 'L5'].forEach(which => {
      const marker = createLagrangeMarker(`${which}-${p.name}`);
      marker.userData.which = which;
      marker.userData.info = { type: `Point de Lagrange ${which} — système Soleil-${p.name}`, stats: [], facts: LAGRANGE_INFO[which] };
      group.add(marker);
      const label = labels.add(marker, `${which}·${p.name.slice(0, 2).toUpperCase()}`, 'lagrange');
      label.style.display = 'none';
      marker.userData.label = label;
    });
    scene.add(group);
    lagrangeGroups.set(p.name, group);

    if (p.name === 'Jupiter') {
      for (const which of ['L4', 'L5']) {
        const trojans = createTrojans(p, 120);
        trojans.userData.which = which;
        scene.add(trojans);
        trojanGroups.push({ points: trojans, planetName: p.name, which });
      }
    }
  }
});

scene.add(createStars());

const referential = {
  centerIndex: -1,
  centerName: 'Soleil',
  simDays: 0,
  speed: 1,
};

function heliocentricPositions() {
  const positions = { Soleil: new THREE.Vector3(0, 0, 0) };
  PLANETS.forEach((p, i) => {
    const pos = planetPosition(p, referential.simDays);
    positions[p.name] = new THREE.Vector3(pos.x, pos.y, pos.z);
  });
  return positions;
}

function updateWorld(positions) {
  const center = referential.centerName === 'Soleil'
    ? new THREE.Vector3(0, 0, 0)
    : positions[referential.centerName].clone();

  sun.position.copy(positions.Soleil).sub(center);
  sunLight.position.copy(sun.position);
  sunLight.target = sun;

  PLANETS.forEach((p, i) => {
    const mesh = planetMeshes[i];
    mesh.position.copy(positions[p.name]).sub(center);
    mesh.rotation.y += p.rotSpeed;
    mesh.userData.helioPos = positions[p.name];
  });

  orbitLines.forEach((line, i) => {
    line.position.copy(positions.Soleil).sub(center).negate().negate();
  });

  PLANETS.forEach(p => {
    const group = lagrangeGroups.get(p.name);
    if (!group) return;
    const planetPos = positions[p.name];
    group.children.forEach(marker => {
      const lp = lagrangePosition(planetPos, marker.userData.which);
      marker.position.set(lp.x - center.x, lp.y - center.y, lp.z - center.z);
    });
  });

  trojanGroups.forEach(({ points, planetName, which }) => {
    const mesh = planetMeshes[PLANETS.findIndex(p => p.name === planetName)];
    updateTrojans(points, mesh, referential.simDays, which);
    const centerNow = positions[planetName];
    const lp = lagrangePosition(centerNow, which);
    points.position.set(lp.x - center.x, lp.y - center.y, lp.z - center.z);
    points.userData.seeds.forEach(() => {});
    const attr = points.geometry.attributes.position;
    for (let i = 0; i < attr.count; i++) {
      attr.setXYZ(
        i,
        attr.getX(i) - 0,
        attr.getY(i),
        attr.getZ(i),
      );
    }
  });
}

let trailDuration = 10;
const dynamicAsteroids = [];
const trails = new Map();

class Trail {
  constructor() {
    this.maxPoints = trailDuration * 60;
    this.positions = new Float32Array(this.maxPoints * 3);
    this.count = 0;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setDrawRange(0, 0);
    this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6 });
    this.line = new THREE.Line(this.geometry, this.material);
    scene.add(this.line);
  }

  push(pos) {
    const cap = trailDuration * 60;
    if (this.count >= cap) {
      this.positions.copyWithin(0, 3);
      this.count = cap - 1;
    }
    this.positions.set([pos.x, pos.y, pos.z], this.count * 3);
    this.count++;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.setDrawRange(0, this.count);
  }

  dispose() {
    scene.remove(this.line);
    this.geometry.dispose();
    this.material.dispose();
  }
}

function trojanSpawnState() {
  const jupiterIndex = PLANETS.findIndex(p => p.name === 'Jupiter');
  const jupiter = PLANETS[jupiterIndex];
  const helio = planetMeshes[jupiterIndex].userData.helioPos;
  const which = Math.random() < 0.5 ? 'L4' : 'L5';
  return trojanCandidateSpawn(helio || planetPosition(jupiter, referential.simDays), which);
}

function addDynamicAsteroid() {
  const isTrojanCandidate = Math.random() < SPAWN.trojanFraction;
  const state = isTrojanCandidate
    ? trojanSpawnState()
    : randomSpawnState({ auPerUnit: AU_VISUAL });
  const size = Math.random() * 1.5 + 0.5;
  const asteroid = new THREE.Mesh(
    new THREE.SphereGeometry(size, 12, 12),
    new THREE.MeshLambertMaterial({
      color: isTrojanCandidate ? 0xFFAA44 : 0xFFFFFF,
      emissive: isTrojanCandidate ? 0x442200 : 0x222222,
    }),
  );
  asteroid.position.set(
    sun.position.x + state.offset.x,
    sun.position.y + state.offset.y,
    sun.position.z + state.offset.z,
  );
  asteroid.userData = {
    velocity: new THREE.Vector3(state.velocity.x, state.velocity.y, state.velocity.z),
    isAsteroid: true,
    trojanCandidate: isTrojanCandidate,
  };
  scene.add(asteroid);
  dynamicAsteroids.push(asteroid);
  trails.set(asteroid, new Trail());
}

function gravityBodies() {
  const bodies = [{ x: sun.position.x, y: sun.position.y, z: sun.position.z, gm: GM_SUN }];
  planetMeshes.forEach((planet, i) => {
    bodies.push({
      x: planet.position.x,
      y: planet.position.y,
      z: planet.position.z,
      gm: planetGM(PLANETS[i].mass),
    });
  });
  return bodies;
}

let asteroidRainActive = false;
let asteroidRainTimeout = null;

function scheduleNextAsteroid() {
  const delay = SPAWN.minIntervalMs + Math.random() * (SPAWN.maxIntervalMs - SPAWN.minIntervalMs);
  asteroidRainTimeout = setTimeout(() => {
    addDynamicAsteroid();
    if (asteroidRainActive) scheduleNextAsteroid();
  }, delay);
}

function toggleAsteroidRain() {
  const btn = document.getElementById('rain-btn');
  asteroidRainActive = !asteroidRainActive;
  if (asteroidRainActive) {
    for (let i = 0; i < 2; i++) addDynamicAsteroid();
    scheduleNextAsteroid();
    btn.textContent = '⏹️ Arrêter la pluie';
  } else {
    if (asteroidRainTimeout) clearTimeout(asteroidRainTimeout);
    asteroidRainTimeout = null;
    btn.textContent = '☄️ Pluie d\'astéroïdes';
  }
  btn.classList.toggle('active', asteroidRainActive);
}

document.getElementById('rain-btn').onclick = toggleAsteroidRain;
document.getElementById('info-close').onclick = hideInfoCard;

const speedSlider = document.getElementById('speed-slider');
speedSlider.oninput = () => {
  referential.speed = parseFloat(speedSlider.value);
  document.getElementById('speed-value').textContent = `${referential.speed}×`;
};

buildTrailButtons(duration => { trailDuration = duration; });

function selectReferential(centerIndex, name) {
  referential.centerIndex = centerIndex;
  referential.centerName = name;
  showReferentialCaption(name, REFERENTIAL_CAPTIONS);
  hideInfoCard();
  const targetDistance = centerIndex === -1 ? 500 : (centerIndex < 4 ? 150 : 300);
  controls.target.set(0, 0, 0);
  const currentDir = camera.position.clone().normalize();
  camera.position.copy(currentDir.multiplyScalar(targetDistance));
}

buildReferentialButtons(selectReferential);
showReferentialCaption('Soleil', REFERENTIAL_CAPTIONS);


const CLICK_TOLERANCE_PX = 30;

renderer.domElement.addEventListener('click', event => {
  const clickables = [
    { object: sun, name: 'Soleil', info: PLANET_INFO.Soleil },
    ...planetMeshes.map(m => ({ object: m, name: m.userData.name, info: PLANET_INFO[m.userData.name] })),
    ...[...lagrangeGroups.values()].flatMap(g => g.children.map(m => ({ object: m, name: m.userData.name, info: m.userData.info }))),
  ];

  const v = new THREE.Vector3();
  let best = null;
  let bestDist = CLICK_TOLERANCE_PX;
  for (const c of clickables) {
    v.copy(c.object.getWorldPosition(new THREE.Vector3())).project(camera);
    if (v.z > 1) continue;
    const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
    const d = Math.hypot(sx - event.clientX, sy - event.clientY);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  if (!best) return;

  showInfoCard(best.name, best.info);
  if (best.object === sun || planetMeshes.includes(best.object)) {
    controls.target.copy(best.object.position);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', event => {
  const key = parseInt(event.key, 10);
  if (key === 1) selectReferentialAndHighlight(-1, 'Soleil');
  else if (key >= 2 && key <= 1 + PLANETS.length) selectReferentialAndHighlight(key - 2, PLANETS[key - 2].name);
  if (event.key === 'Escape') hideInfoCard();
  if (event.key === ' ') {
    event.preventDefault();
    referential.paused = !referential.paused;
  }
});

function selectReferentialAndHighlight(index, name) {
  selectReferential(index, name);
  const container = document.getElementById('referential-buttons');
  container.querySelectorAll('button').forEach(b => {
    b.classList.toggle('active', b.textContent.endsWith(name) || (index === -1 && b.textContent.includes('Soleil')));
  });
}

document.getElementById('start-btn').onclick = () => {
  const loading = document.getElementById('loading');
  loading.style.opacity = '0';
  setTimeout(() => loading.remove(), 650);
};

let lastTime = performance.now();
let frameAccumulator = 0;

function animate(now) {
  requestAnimationFrame(animate);
  const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!referential.paused) {
    referential.simDays += deltaTime * SIM_START_DAYS_PER_SECOND * referential.speed;
  }

  sun.material.uniforms.time.value += deltaTime;
  sun.rotation.y += 0.008;

  const positions = heliocentricPositions();
  updateWorld(positions);

  for (let i = dynamicAsteroids.length - 1; i >= 0; i--) {
    const asteroid = dynamicAsteroids[i];
    const simDaysStep = deltaTime * SIM_START_DAYS_PER_SECOND * referential.speed;
    const bodies = gravityBodies();
    const hMax = 2;
    const subSteps = Math.max(1, Math.min(40, Math.ceil(simDaysStep / hMax)));
    const h = simDaysStep / subSteps;
    for (let s = 0; s < subSteps; s++) {
      const acc = stepAsteroid(
        { x: asteroid.position.x, y: asteroid.position.y, z: asteroid.position.z },
        h,
        bodies,
      );
      asteroid.userData.velocity.x += acc.ax * h;
      asteroid.userData.velocity.y += acc.ay * h;
      asteroid.userData.velocity.z += acc.az * h;
      if (asteroid.userData.velocity.length() > SPAWN.maxSpeedCap) {
        asteroid.userData.velocity.setLength(SPAWN.maxSpeedCap);
      }
      asteroid.position.x += asteroid.userData.velocity.x * h;
      asteroid.position.y += asteroid.userData.velocity.y * h;
      asteroid.position.z += asteroid.userData.velocity.z * h;
    }
    trails.get(asteroid)?.push(asteroid.position);
    const distanceFromSun = asteroid.position.distanceTo(sun.position);
    const killDistance = SPAWN.killDistanceAU * AU_VISUAL;
    if (distanceFromSun < SPAWN.killRadius || distanceFromSun > killDistance) {
      asteroid.geometry.dispose();
      asteroid.material.dispose();
      scene.remove(asteroid);
      trails.get(asteroid).dispose();
      trails.delete(asteroid);
      dynamicAsteroids.splice(i, 1);
    }
  }

  document.getElementById('asteroid-counter').textContent = `Astéroïdes: ${dynamicAsteroids.length}`;
  document.getElementById('sim-date').textContent = makeDateAt(referential.simDays);

  lagrangeGroups.forEach(group => {
    group.children.forEach(marker => {
      const d = camera.position.distanceTo(marker.position);
      marker.userData.label.style.display = d < 9000 ? 'block' : 'none';
    });
  });

  labels.update(camera);
  controls.update();
  composer.render();
}

requestAnimationFrame(animate);
console.log('🌟 Lagrange — Système solaire interactif démarré');
