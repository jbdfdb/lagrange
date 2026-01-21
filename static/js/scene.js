/**
 * Configuration de la scene Three.js
 * Camera, Renderer, Controls, Lumieres
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { OrbitControls } from 'https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls';
import { CAMERA, RENDERER, COLORS, STARS } from './config.js';

// ========================================
// Scene
// ========================================
export const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.BACKGROUND);

// ========================================
// Camera
// ========================================
export const camera = new THREE.PerspectiveCamera(
    CAMERA.FOV,
    window.innerWidth / window.innerHeight,
    CAMERA.NEAR,
    CAMERA.FAR
);
camera.position.set(
    CAMERA.INITIAL_POSITION.x,
    CAMERA.INITIAL_POSITION.y,
    CAMERA.INITIAL_POSITION.z
);

// ========================================
// Renderer
// ========================================
export const renderer = new THREE.WebGLRenderer({
    antialias: RENDERER.ANTIALIAS,
    alpha: RENDERER.ALPHA,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = RENDERER.TONE_MAPPING_EXPOSURE;

// ========================================
// Controls
// ========================================
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = CAMERA.DAMPING_FACTOR;
controls.target.set(0, 0, 0);
controls.minDistance = CAMERA.MIN_DISTANCE;
controls.maxDistance = CAMERA.MAX_DISTANCE;

// ========================================
// Lights
// ========================================
export const sunLight = new THREE.PointLight(COLORS.SUN_LIGHT, 2, 50000);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(COLORS.AMBIENT_LIGHT, 0.3);
scene.add(ambientLight);

// ========================================
// Stars Background
// ========================================
export function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < STARS.COUNT; i++) {
        vertices.push(
            (Math.random() - 0.5) * STARS.SPREAD_XZ,
            (Math.random() - 0.5) * STARS.SPREAD_Y,
            (Math.random() - 0.5) * STARS.SPREAD_XZ
        );

        // Variation de couleur des etoiles
        const colorType = Math.random();
        if (colorType < 0.3) {
            colors.push(...COLORS.STAR_WHITE);
        } else if (colorType < 0.6) {
            colors.push(...COLORS.STAR_WARM);
        } else if (colorType < 0.8) {
            colors.push(...COLORS.STAR_COOL);
        } else {
            colors.push(...COLORS.STAR_RED);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: STARS.SIZE,
        opacity: STARS.OPACITY,
        transparent: true,
        vertexColors: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    return stars;
}

// ========================================
// Resize Handler
// ========================================
export function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========================================
// Initialize
// ========================================
export function initScene() {
    document.body.appendChild(renderer.domElement);
    createStars();
    window.addEventListener('resize', handleResize);
    console.log('Scene Three.js initialisee');
}
