/**
 * Systeme d'Asteroides avec gravite et trainees
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { scene } from './scene.js';
import { sun, planetObjects } from './celestial.js';
import { AU_VISUAL, ASTEROIDS, PHYSICS, TRAILS, GEOMETRY } from './config.js';

// ========================================
// Storage
// ========================================
export const dynamicAsteroids = [];
const trailPoints = new Map();
let trailDuration = TRAILS.DEFAULT_DURATION;

// ========================================
// Asteroid Trail Class
// ========================================
class AsteroidTrail {
    constructor(asteroid) {
        this.asteroid = asteroid;
        this.points = [];
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: TRAILS.OPACITY,
        });
        this.line = new THREE.Line(this.geometry, this.material);
        scene.add(this.line);
    }

    update() {
        this.points.push(this.asteroid.position.clone());

        const maxPoints = trailDuration * ASTEROIDS.TRAIL_MAX_POINTS_MULTIPLIER;
        if (this.points.length > maxPoints) {
            this.points.shift();
        }

        if (this.points.length > 1) {
            this.geometry.setFromPoints(this.points);
        }
    }

    dispose() {
        scene.remove(this.line);
        this.geometry.dispose();
        this.material.dispose();
    }
}

// ========================================
// Gravity Calculation
// ========================================
function applyGravity(asteroid) {
    const totalForce = new THREE.Vector3(0, 0, 0);

    // Force du Soleil
    const dirSun = new THREE.Vector3().subVectors(sun.position, asteroid.position);
    const distSun = dirSun.length();
    if (distSun > PHYSICS.MIN_DISTANCE_THRESHOLD) {
        const forceSun = dirSun
            .normalize()
            .multiplyScalar(PHYSICS.SUN_GRAVITY_MULTIPLIER / (distSun * distSun));
        totalForce.add(forceSun);
    }

    // Forces des planetes
    planetObjects.forEach((planet) => {
        const dir = new THREE.Vector3().subVectors(planet.position, asteroid.position);
        const dist = dir.length();
        if (dist > PHYSICS.MIN_DISTANCE_THRESHOLD) {
            const force = dir
                .normalize()
                .multiplyScalar(
                    (planet.userData.mass * PHYSICS.PLANET_GRAVITY_MULTIPLIER) / (dist * dist)
                );
            totalForce.add(force);
        }
    });

    return totalForce;
}

// ========================================
// Create Asteroid
// ========================================
export function addDynamicAsteroid() {
    // Position initiale dans la ceinture d'asteroides
    const distance =
        ASTEROIDS.MIN_DISTANCE_MULTIPLIER * AU_VISUAL +
        Math.random() * (ASTEROIDS.MAX_DISTANCE_MULTIPLIER - ASTEROIDS.MIN_DISTANCE_MULTIPLIER) * AU_VISUAL;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = (Math.random() - 0.5) * ASTEROIDS.Y_SPREAD;

    // Taille aleatoire
    const size = Math.random() * (ASTEROIDS.MAX_SIZE - ASTEROIDS.MIN_SIZE) + ASTEROIDS.MIN_SIZE;

    // Geometrie et materiau
    const geometry = new THREE.SphereGeometry(size, GEOMETRY.ASTEROID_SEGMENTS, GEOMETRY.ASTEROID_SEGMENTS);
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        emissive: 0x222222,
    });

    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.position.set(x, y, z);

    // Vitesse initiale vers le centre
    const speed = Math.random() * (ASTEROIDS.MAX_SPEED - ASTEROIDS.MIN_SPEED) + ASTEROIDS.MIN_SPEED;
    const dirToCenter = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), asteroid.position)
        .normalize();

    asteroid.userData = {
        velocity: dirToCenter.multiplyScalar(speed),
        isAsteroid: true,
        mass: size * size * 0.01,
    };

    scene.add(asteroid);
    dynamicAsteroids.push(asteroid);
    trailPoints.set(asteroid, new AsteroidTrail(asteroid));

    return asteroid;
}

// ========================================
// Update Asteroids
// ========================================
export function updateAsteroids() {
    for (let i = dynamicAsteroids.length - 1; i >= 0; i--) {
        const asteroid = dynamicAsteroids[i];

        // Appliquer la gravite
        const gravityForce = applyGravity(asteroid);
        asteroid.userData.velocity.add(gravityForce.multiplyScalar(PHYSICS.GRAVITY_STRENGTH));

        // Limiter la vitesse maximale
        if (asteroid.userData.velocity.length() > PHYSICS.MAX_ASTEROID_VELOCITY) {
            asteroid.userData.velocity.normalize().multiplyScalar(PHYSICS.MAX_ASTEROID_VELOCITY);
        }

        // Mettre a jour la position
        asteroid.position.add(asteroid.userData.velocity.clone().multiplyScalar(0.1));

        // Mettre a jour la trainee
        if (trailPoints.has(asteroid)) {
            trailPoints.get(asteroid).update();
        }

        // Verifier les limites
        const distanceFromOrigin = asteroid.position.length();
        if (
            distanceFromOrigin < PHYSICS.ASTEROID_DESTRUCTION_RADIUS ||
            distanceFromOrigin > PHYSICS.ASTEROID_BOUNDARY
        ) {
            removeAsteroid(asteroid, i);
        }
    }

    return dynamicAsteroids.length;
}

// ========================================
// Remove Asteroid
// ========================================
function removeAsteroid(asteroid, index) {
    scene.remove(asteroid);

    if (trailPoints.has(asteroid)) {
        trailPoints.get(asteroid).dispose();
        trailPoints.delete(asteroid);
    }

    dynamicAsteroids.splice(index, 1);
}

// ========================================
// Clear All Asteroids
// ========================================
export function clearAllAsteroids() {
    for (let i = dynamicAsteroids.length - 1; i >= 0; i--) {
        removeAsteroid(dynamicAsteroids[i], i);
    }
}

// ========================================
// Asteroid Rain Control
// ========================================
let asteroidRainActive = false;
let asteroidRainInterval = null;

export function startAsteroidRain() {
    if (asteroidRainActive) return;
    asteroidRainActive = true;

    // Spawn initial asteroids
    for (let i = 0; i < ASTEROIDS.INITIAL_SPAWN_COUNT; i++) {
        addDynamicAsteroid();
    }

    // Continue spawning
    asteroidRainInterval = setInterval(() => {
        addDynamicAsteroid();
    }, ASTEROIDS.SPAWN_INTERVAL);
}

export function stopAsteroidRain() {
    asteroidRainActive = false;
    if (asteroidRainInterval) {
        clearInterval(asteroidRainInterval);
        asteroidRainInterval = null;
    }
}

export function isAsteroidRainActive() {
    return asteroidRainActive;
}

// ========================================
// Trail Duration Control
// ========================================
export function setTrailDuration(duration) {
    trailDuration = duration;
}

export function getTrailDuration() {
    return trailDuration;
}
