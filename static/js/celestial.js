/**
 * Corps celestes: Soleil, Planetes, Points de Lagrange
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { scene } from './scene.js';
import { AU_VISUAL, SUN, PLANETS, COLORS, GEOMETRY } from './config.js';

// ========================================
// Storage
// ========================================
export let sun = null;
export const planetObjects = [];
export const planetLabels = [];
export const lagrangePoints = [];

// ========================================
// Sun Shader
// ========================================
const sunVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const sunFragmentShader = `
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
`;

// ========================================
// Create Sun
// ========================================
export function createSun() {
    const geometry = new THREE.SphereGeometry(SUN.RADIUS, GEOMETRY.SPHERE_SEGMENTS, GEOMETRY.SPHERE_SEGMENTS);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(SUN.SHADER_COLORS.COLOR1) },
            color2: { value: new THREE.Color(SUN.SHADER_COLORS.COLOR2) },
            color3: { value: new THREE.Color(SUN.SHADER_COLORS.COLOR3) },
        },
        vertexShader: sunVertexShader,
        fragmentShader: sunFragmentShader,
    });

    sun = new THREE.Mesh(geometry, material);
    sun.userData = { name: 'Soleil', mass: SUN.MASS };
    scene.add(sun);

    // Sun label
    const labelDiv = document.createElement('div');
    labelDiv.textContent = 'Soleil';
    labelDiv.className = 'celestial-label celestial-label--sun';
    document.body.appendChild(labelDiv);
    planetLabels.push({ div: labelDiv, object: sun });

    return sun;
}

// ========================================
// Create Earth Night Texture
// ========================================
function createEarthNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ocean gradient
    const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    gradient.addColorStop(0, '#003366');
    gradient.addColorStop(1, '#001122');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents (simplified shapes)
    ctx.fillStyle = '#223344';
    const continents = [
        [120, 80, 220, 180],   // Amerique du Nord
        [180, 260, 140, 220],  // Amerique du Sud
        [460, 70, 90, 120],    // Europe
        [440, 140, 110, 240],  // Afrique
        [550, 50, 300, 200],   // Asie
        [720, 320, 140, 100],  // Australie
    ];
    continents.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));

    // City lights
    for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;

        const isLand = continents.some(
            ([cx, cy, cw, ch]) => x > cx && x < cx + cw && y > cy && y < cy + ch
        );

        if (isLand && Math.random() > 0.2) {
            const intensity = Math.random();
            ctx.fillStyle =
                intensity > 0.7 ? '#FFFF88' : intensity > 0.4 ? '#FFDD44' : '#FFAA22';
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    return new THREE.CanvasTexture(canvas);
}

// ========================================
// Create Lagrange Point
// ========================================
function createLagrangePoint(position, name) {
    const group = new THREE.Group();
    const size = 15;

    // X axis (red)
    const xGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-size, 0, 0),
        new THREE.Vector3(size, 0, 0),
    ]);
    group.add(new THREE.Line(xGeo, new THREE.LineBasicMaterial({ color: COLORS.LAGRANGE_X })));

    // Y axis (green)
    const yGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -size, 0),
        new THREE.Vector3(0, size, 0),
    ]);
    group.add(new THREE.Line(yGeo, new THREE.LineBasicMaterial({ color: COLORS.LAGRANGE_Y })));

    // Z axis (blue)
    const zGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -size),
        new THREE.Vector3(0, 0, size),
    ]);
    group.add(new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: COLORS.LAGRANGE_Z })));

    group.position.copy(position);
    group.userData = { name, isLagrange: true };
    scene.add(group);
    lagrangePoints.push(group);

    return group;
}

// ========================================
// Create Saturn Rings
// ========================================
function createSaturnRings(planet, planetData) {
    const innerRadius = planetData.radius + 5;
    const outerRadius = planetData.radius + 15;

    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, GEOMETRY.SPHERE_SEGMENTS);
    const material = new THREE.MeshLambertMaterial({
        color: 0xccaaaa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
    });

    const rings = new THREE.Mesh(geometry, material);
    rings.rotation.x = Math.PI / 2;
    rings.rotation.z = Math.PI / 6;
    planet.add(rings);
}

// ========================================
// Create Orbit Line
// ========================================
function createOrbitLine(distance) {
    const points = [];
    for (let j = 0; j <= GEOMETRY.ORBIT_SEGMENTS; j++) {
        const angle = (j / GEOMETRY.ORBIT_SEGMENTS) * Math.PI * 2;
        points.push(
            new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance)
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: COLORS.ORBIT,
        transparent: true,
        opacity: 0.3,
    });

    const orbit = new THREE.Line(geometry, material);
    scene.add(orbit);
    return orbit;
}

// ========================================
// Create Planet
// ========================================
function createPlanet(planetData, index) {
    const distance = planetData.distance * AU_VISUAL;

    // Geometry and material
    const geometry = new THREE.SphereGeometry(
        planetData.radius,
        GEOMETRY.SPHERE_SEGMENTS,
        GEOMETRY.SPHERE_SEGMENTS
    );

    let material;
    if (planetData.name === 'Terre') {
        const earthTexture = createEarthNightTexture();
        material = new THREE.MeshLambertMaterial({
            map: earthTexture,
            emissive: 0x001122,
            emissiveIntensity: 0.2,
        });
    } else {
        material = new THREE.MeshLambertMaterial({ color: planetData.color });
    }

    // Create mesh
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(distance, 0, 0);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.userData = {
        name: planetData.name,
        planetIndex: index,
        mass: planetData.mass,
        info: planetData.info,
    };
    scene.add(planet);
    planetObjects.push(planet);

    // Saturn rings
    if (planetData.hasRings) {
        createSaturnRings(planet, planetData);
    }

    // Lagrange points (for planets from Earth onwards)
    if (index >= 2) {
        const l4Pos = new THREE.Vector3(
            Math.cos(Math.PI / 3) * distance,
            0,
            Math.sin(Math.PI / 3) * distance
        );
        const l5Pos = new THREE.Vector3(
            Math.cos(-Math.PI / 3) * distance,
            0,
            Math.sin(-Math.PI / 3) * distance
        );

        createLagrangePoint(l4Pos, `L4-${planetData.name}`);
        createLagrangePoint(l5Pos, `L5-${planetData.name}`);
    }

    // Orbit line
    createOrbitLine(distance);

    // Label
    const labelDiv = document.createElement('div');
    labelDiv.textContent = planetData.name;
    labelDiv.className = 'celestial-label';
    document.body.appendChild(labelDiv);
    planetLabels.push({ div: labelDiv, object: planet });

    return planet;
}

// ========================================
// Initialize All Celestial Bodies
// ========================================
export function initCelestialBodies() {
    createSun();

    PLANETS.forEach((planetData, index) => {
        createPlanet(planetData, index);
    });

    console.log(`Cree: Soleil + ${planetObjects.length} planetes + ${lagrangePoints.length} points de Lagrange`);
}

// ========================================
// Update Sun Shader
// ========================================
export function updateSun(time) {
    if (sun && sun.material.uniforms) {
        sun.material.uniforms.time.value = time;
    }
    if (sun) {
        sun.rotation.y += SUN.ROTATION_SPEED;
    }
}

// ========================================
// Update Planet Rotations
// ========================================
export function updatePlanetRotations() {
    for (let i = 0; i < planetObjects.length; i++) {
        planetObjects[i].rotation.y += PLANETS[i].rotSpeed;
    }
}
