/**
 * Mode Voyage Interplanetaire
 * Navigation cinematique a travers le systeme solaire
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { camera, controls } from './scene.js';
import { sun, planetObjects } from './celestial.js';
import { referentialSystem } from './referential.js';
import { PLANETS, VOYAGE } from './config.js';

// ========================================
// State
// ========================================
let isVoyageActive = false;
let isAutoTourActive = false;
let currentTargetIndex = -1; // -1 = Soleil
let voyageSpeed = VOYAGE.DEFAULT_SPEED;
let transitionProgress = 0;
let startPosition = new THREE.Vector3();
let targetPosition = new THREE.Vector3();
let autoTourTimeout = null;

// Callbacks pour l'UI
let onVoyageStart = null;
let onVoyageEnd = null;
let onTargetChange = null;
let onSpeedChange = null;

// ========================================
// Easing Function
// ========================================
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ========================================
// Calculate Target Position
// ========================================
function getTargetCameraPosition(targetIndex) {
    let targetObject;
    let approachDistance;

    if (targetIndex === -1) {
        targetObject = sun;
        approachDistance = VOYAGE.APPROACH_DISTANCE * 5;
    } else {
        targetObject = planetObjects[targetIndex];
        // Distance d'approche proportionnelle a la taille de la planete
        approachDistance = VOYAGE.APPROACH_DISTANCE + PLANETS[targetIndex].radius * 3;
    }

    // Position de la camera: derriere et au-dessus de la cible
    const targetPos = targetObject.position.clone();
    const offset = new THREE.Vector3(
        approachDistance * 0.8,
        approachDistance * 0.4,
        approachDistance * 0.8
    );

    return targetPos.add(offset);
}

// ========================================
// Start Voyage to Target
// ========================================
export function voyageTo(targetIndex) {
    if (targetIndex === currentTargetIndex && isVoyageActive) return;

    isVoyageActive = true;
    currentTargetIndex = targetIndex;
    transitionProgress = 0;
    startPosition.copy(camera.position);
    targetPosition = getTargetCameraPosition(targetIndex);

    // Changer le referentiel
    referentialSystem.setCenter(targetIndex);

    if (onTargetChange) {
        const name = targetIndex === -1 ? 'Soleil' : PLANETS[targetIndex].name;
        onTargetChange(name, targetIndex);
    }

    if (onVoyageStart) {
        onVoyageStart();
    }
}

// ========================================
// Update Voyage Animation
// ========================================
export function updateVoyage(deltaTime) {
    if (!isVoyageActive) return;

    // Progression basee sur la vitesse
    const progressSpeed = (deltaTime * 1000) / VOYAGE.TRANSITION_DURATION;
    transitionProgress += progressSpeed * voyageSpeed;

    if (transitionProgress >= 1) {
        transitionProgress = 1;
        isVoyageActive = false;

        if (onVoyageEnd) {
            onVoyageEnd();
        }

        // Auto tour: passer a la prochaine planete
        if (isAutoTourActive) {
            scheduleNextAutoTourTarget();
        }
    }

    // Interpolation avec easing
    const easedProgress = easeInOutCubic(transitionProgress);

    // Interpoler la position de la camera
    camera.position.lerpVectors(startPosition, targetPosition, easedProgress);

    // Regarder vers la cible
    const lookTarget =
        currentTargetIndex === -1 ? sun.position : planetObjects[currentTargetIndex].position;
    controls.target.lerp(lookTarget, easedProgress * 0.1);
}

// ========================================
// Auto Tour
// ========================================
function scheduleNextAutoTourTarget() {
    if (!isAutoTourActive) return;

    autoTourTimeout = setTimeout(() => {
        if (!isAutoTourActive) return;

        // Passer a la prochaine planete
        let nextIndex = currentTargetIndex + 1;
        if (nextIndex >= PLANETS.length) {
            nextIndex = -1; // Retour au Soleil
        }

        voyageTo(nextIndex);
    }, VOYAGE.AUTO_TOUR_DELAY);
}

export function startAutoTour() {
    if (isAutoTourActive) return;

    isAutoTourActive = true;
    voyageTo(-1); // Commencer par le Soleil
}

export function stopAutoTour() {
    isAutoTourActive = false;
    if (autoTourTimeout) {
        clearTimeout(autoTourTimeout);
        autoTourTimeout = null;
    }
}

export function isAutoTourRunning() {
    return isAutoTourActive;
}

// ========================================
// Speed Control
// ========================================
export function setVoyageSpeed(speed) {
    voyageSpeed = Math.max(VOYAGE.MIN_SPEED, Math.min(VOYAGE.MAX_SPEED, speed));
    if (onSpeedChange) {
        onSpeedChange(voyageSpeed);
    }
}

export function getVoyageSpeed() {
    return voyageSpeed;
}

// ========================================
// State Getters
// ========================================
export function isVoyageInProgress() {
    return isVoyageActive;
}

export function getCurrentTarget() {
    return currentTargetIndex;
}

export function getCurrentTargetName() {
    return currentTargetIndex === -1 ? 'Soleil' : PLANETS[currentTargetIndex].name;
}

export function getNextTargetName() {
    const nextIndex = currentTargetIndex + 1;
    if (nextIndex >= PLANETS.length) {
        return 'Soleil';
    }
    return PLANETS[nextIndex].name;
}

// ========================================
// Event Callbacks
// ========================================
export function setVoyageCallbacks(callbacks) {
    if (callbacks.onVoyageStart) onVoyageStart = callbacks.onVoyageStart;
    if (callbacks.onVoyageEnd) onVoyageEnd = callbacks.onVoyageEnd;
    if (callbacks.onTargetChange) onTargetChange = callbacks.onTargetChange;
    if (callbacks.onSpeedChange) onSpeedChange = callbacks.onSpeedChange;
}

// ========================================
// Planet Info
// ========================================
export function getPlanetInfo(index) {
    if (index === -1) {
        return {
            name: 'Soleil',
            info: {
                diameter: '1 392 684 km',
                distanceAU: '0 UA (centre)',
                temperature: '5 500 C (surface)',
                moons: 'N/A',
            },
        };
    }
    return PLANETS[index];
}
