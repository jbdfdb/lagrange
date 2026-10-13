import * as THREE from '../vendor/three.module.js';
import { PLANETS, AU_VISUAL } from './data.js';
import { planetPosition, lagrangePosition } from './physics.js';

export function createSun() {
  const sunGeo = new THREE.SphereGeometry(30, 64, 64);
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      color1: { value: new THREE.Color(0xFF2200) },
      color2: { value: new THREE.Color(0xFF8800) },
      color3: { value: new THREE.Color(0xFFFF44) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;

      float noise(vec2 p) {
        return sin(p.x * 8.0 + time * 2.0) * sin(p.y * 6.0 + time * 1.5) * 0.5 + 0.5;
      }

      void main() {
        vec2 uv = vUv;
        float dist = distance(uv, vec2(0.5));

        float gradient = 1.0 - dist * 2.0;
        float noiseVal = noise(uv * 3.0 + time * 0.1);

        float eruption = sin(uv.x * 15.0 + time * 3.0) * sin(uv.y * 12.0 + time * 2.5);
        eruption *= (1.0 - gradient) * 0.4;

        vec3 color = mix(color1, color2, gradient);
        color = mix(color, color3, gradient * gradient);
        color += eruption * color3;

        float intensity = 0.7 + noiseVal * 0.5 + eruption * 0.3;

        gl_FragColor = vec4(color * intensity, 1.0);
      }
    `,
  });

  const sun = new THREE.Mesh(sunGeo, sunMaterial);
  sun.userData = { name: 'Soleil', mass: 1000 };
  return sun;
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
  gradient.addColorStop(0, '#003366');
  gradient.addColorStop(1, '#001122');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  const lands = [
    [120, 80, 220, 180], [180, 260, 140, 220], [460, 70, 90, 120],
    [440, 140, 110, 240], [550, 50, 300, 200], [720, 320, 140, 100],
  ];
  ctx.fillStyle = '#223344';
  lands.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));

  const inLand = (x, y) => lands.some(([lx, ly, lw, lh]) => x > lx && x < lx + lw && y > ly && y < ly + lh);

  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    if (inLand(x, y) && Math.random() > 0.2) {
      const intensity = Math.random();
      ctx.fillStyle = intensity > 0.7 ? '#FFFF88' : intensity > 0.4 ? '#FFDD44' : '#FFAA22';
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

export function createPlanetMesh(p) {
  let mat = new THREE.MeshLambertMaterial({ color: p.color });
  if (p.name === 'Terre') {
    mat = new THREE.MeshLambertMaterial({
      map: createEarthTexture(),
      emissive: 0x001122,
      emissiveIntensity: 0.2,
    });
  }
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.radius, 64, 64), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { name: p.name, planetIndex: PLANETS.indexOf(p), mass: p.mass };
  return mesh;
}

export function createSaturnRings(planet, p) {
  const ringGeo = new THREE.RingGeometry(p.radius + 5, p.radius + 15, 64);
  const ringMat = new THREE.MeshLambertMaterial({
    color: 0xCCAAAA,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });
  const rings = new THREE.Mesh(ringGeo, ringMat);
  rings.rotation.x = Math.PI / 2;
  rings.rotation.z = Math.PI / 6;
  planet.add(rings);
}

export function createOrbitLine(p) {
  const points = [];
  for (let j = 0; j <= 256; j++) {
    const t = (j / 256) * p.period;
    const pos = planetPosition(p, t);
    points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
  return new THREE.Line(geo, mat);
}

export function createLagrangeMarker(name) {
  const group = new THREE.Group();
  const axes = [
    [[-15, 0, 0], [15, 0, 0], 0xFF0000],
    [[0, -15, 0], [0, 15, 0], 0x00FF00],
    [[0, 0, -15], [0, 0, 15], 0x0000FF],
  ];
  axes.forEach(([a, b, color]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...a), new THREE.Vector3(...b),
    ]);
    group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
  });
  group.userData = { name, isLagrange: true };
  return group;
}

export function createTrojans(p, count = 120) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xFFAA44, size: 3, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(geo, mat);
  points.userData = {
    isTrojan: true,
    planetName: p.name,
    seeds: Array.from({ length: count }, () => ({
      angleOffset: (Math.random() - 0.5) * 0.5,
      radialFactor: 0.92 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.004 + Math.random() * 0.008,
    })),
  };
  return points;
}

export function updateTrojans(points, planetHelioPos, tDays, which) {
  const seeds = points.userData.seeds;
  const attr = points.geometry.attributes.position;
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];
    const base = lagrangePosition(planetHelioPos, which);
    const theta = Math.atan2(base.z, base.x) + s.angleOffset + Math.sin(tDays * s.wobble * 10 + s.phase) * 0.08;
    const r = Math.hypot(base.x, base.z) * s.radialFactor;
    attr.setXYZ(i, Math.cos(theta) * r, base.y + Math.sin(tDays * s.wobble * 6 + s.phase) * 6, Math.sin(theta) * r);
  }
  attr.needsUpdate = true;
}

export function createStars() {
  const starGeo = new THREE.BufferGeometry();
  const starVerts = [];
  const starColors = [];
  for (let i = 0; i < 3000; i++) {
    starVerts.push(
      (Math.random() - 0.5) * 100000,
      (Math.random() - 0.5) * 30000,
      (Math.random() - 0.5) * 100000,
    );
    const colorType = Math.random();
    if (colorType < 0.3) starColors.push(1, 1, 1);
    else if (colorType < 0.6) starColors.push(1, 0.8, 0.6);
    else if (colorType < 0.8) starColors.push(0.8, 0.8, 1);
    else starColors.push(1, 0.6, 0.4);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
  starGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
  return new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 30, opacity: 0.9, transparent: true, vertexColors: true,
  }));
}
