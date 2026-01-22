/**
 * Systeme d'Asteroides avec physique Keplerienne
 * Utilise l'integration Velocity Verlet pour des orbites realistes
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { scene } from './scene.js';
import { sun, planetObjects } from './celestial.js';
import { AU_VISUAL, ASTEROIDS, PHYSICS, TRAILS, GEOMETRY } from './config.js';

// ========================================
// Constants for Kepler Physics
// ========================================
// Constante gravitationnelle calibree pour que les orbites soient visibles
// GM du Soleil en unites visuelles
const GM_SUN = 800000;
// Facteur pour les planetes (relatif a leur masse)
const GM_PLANET_FACTOR = 50;
// Pas de temps pour l'integration (plus petit = plus precis)
const DT = 0.016; // ~60fps

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
// Compute Gravitational Acceleration
// ========================================
function computeAcceleration(position) {
    const acceleration = new THREE.Vector3(0, 0, 0);

    // Acceleration due au Soleil (loi de Newton: a = -GM/r² * r_hat)
    const rSun = new THREE.Vector3().subVectors(position, sun.position);
    const distSun = rSun.length();

    if (distSun > PHYSICS.MIN_DISTANCE_THRESHOLD) {
        // a = -GM/r³ * r (forme vectorielle)
        const accSun = rSun.clone().multiplyScalar(-GM_SUN / (distSun * distSun * distSun));
        acceleration.add(accSun);
    }

    // Acceleration due aux planetes
    planetObjects.forEach((planet) => {
        const rPlanet = new THREE.Vector3().subVectors(position, planet.position);
        const dist = rPlanet.length();

        if (dist > PHYSICS.MIN_DISTANCE_THRESHOLD) {
            const gmPlanet = planet.userData.mass * GM_PLANET_FACTOR;
            const accPlanet = rPlanet.clone().multiplyScalar(-gmPlanet / (dist * dist * dist));
            acceleration.add(accPlanet);
        }
    });

    return acceleration;
}

// ========================================
// Calculate Orbital Velocity for Circular Orbit
// ========================================
function getOrbitalVelocity(position, centralMass) {
    // v = sqrt(GM/r) pour une orbite circulaire
    const r = position.length();
    return Math.sqrt(centralMass / r);
}

// ========================================
// Create Asteroid with Kepler-compatible initial conditions
// ========================================
export function addDynamicAsteroid() {
    // Position initiale: entre la ceinture d'asteroides et au-dela de Neptune
    const minDist = 2.5 * AU_VISUAL;  // Un peu avant Jupiter
    const maxDist = 35 * AU_VISUAL;   // Au-dela de Neptune
    const distance = minDist + Math.random() * (maxDist - minDist);

    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = (Math.random() - 0.5) * ASTEROIDS.Y_SPREAD * 2;

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

    // Calculer la vitesse orbitale circulaire a cette distance
    const vCircular = getOrbitalVelocity(asteroid.position, GM_SUN);

    // Direction tangentielle (perpendiculaire au rayon, dans le plan XZ)
    const radialDir = new THREE.Vector3(x, 0, z).normalize();
    const tangentDir = new THREE.Vector3(-radialDir.z, 0, radialDir.x);

    // Facteur de vitesse aleatoire:
    // < 1: orbite elliptique (perihelie a la position actuelle)
    // = 1: orbite circulaire
    // > 1 et < sqrt(2): orbite elliptique (aphelie a la position actuelle)
    // >= sqrt(2): orbite hyperbolique (s'echappe du systeme)

    // Distribution qui donne des orbites variees
    const orbitType = Math.random();
    let velocityFactor;

    if (orbitType < 0.3) {
        // Orbites elliptiques internes (plongent vers le Soleil)
        velocityFactor = 0.3 + Math.random() * 0.5; // 0.3 - 0.8
    } else if (orbitType < 0.6) {
        // Orbites quasi-circulaires
        velocityFactor = 0.85 + Math.random() * 0.3; // 0.85 - 1.15
    } else if (orbitType < 0.85) {
        // Orbites elliptiques externes
        velocityFactor = 1.1 + Math.random() * 0.3; // 1.1 - 1.4
    } else {
        // Orbites hyperboliques (s'echappent ou viennent de l'infini)
        velocityFactor = 1.42 + Math.random() * 0.3; // > sqrt(2)
    }

    // Ajouter une composante aleatoire a l'inclinaison de la vitesse
    const inclination = (Math.random() - 0.5) * 0.3; // +-15 degres
    const velocityY = vCircular * velocityFactor * inclination;

    // Direction de l'orbite (prograde ou retrograde)
    const direction = Math.random() > 0.1 ? 1 : -1; // 90% prograde

    const velocity = tangentDir.multiplyScalar(vCircular * velocityFactor * direction);
    velocity.y = velocityY;

    asteroid.userData = {
        velocity: velocity,
        acceleration: new THREE.Vector3(0, 0, 0),
        isAsteroid: true,
        mass: size * size * 0.01,
    };

    // Calculer l'acceleration initiale
    asteroid.userData.acceleration = computeAcceleration(asteroid.position);

    scene.add(asteroid);
    dynamicAsteroids.push(asteroid);
    trailPoints.set(asteroid, new AsteroidTrail(asteroid));

    return asteroid;
}

// ========================================
// Update Asteroids using Velocity Verlet
// ========================================
export function updateAsteroids() {
    for (let i = dynamicAsteroids.length - 1; i >= 0; i--) {
        const asteroid = dynamicAsteroids[i];
        const data = asteroid.userData;

        // Velocity Verlet Integration:
        // 1. x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
        const halfAccDtSq = data.acceleration.clone().multiplyScalar(0.5 * DT * DT);
        const velDt = data.velocity.clone().multiplyScalar(DT);
        asteroid.position.add(velDt).add(halfAccDtSq);

        // 2. Calculer a(t+dt) a la nouvelle position
        const newAcceleration = computeAcceleration(asteroid.position);

        // 3. v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
        const avgAcceleration = data.acceleration.clone().add(newAcceleration).multiplyScalar(0.5);
        data.velocity.add(avgAcceleration.multiplyScalar(DT));

        // 4. Stocker la nouvelle acceleration pour le prochain pas
        data.acceleration.copy(newAcceleration);

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
