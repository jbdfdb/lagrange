/**
 * Mode Voyage Interplanétaire
 * Navigation cinématique à travers le système solaire.
 * Adapté de la branche dev : transitions eased + tour automatique.
 */
import * as THREE from '../vendor/three.module.js';

const TRANSITION_DURATION_MS = 3000;
const APPROACH_DISTANCE = 100;

let isVoyageActive = false;
let isAutoTourActive = false;
let currentTargetIndex = -1;
let voyageSpeed = 1;
let transitionProgress = 0;
const startPosition = new THREE.Vector3();
const targetPosition = new THREE.Vector3();
let autoTourTimeout = null;

let cameraRef = null;
let controlsRef = null;
let getTargetObject = null;
let onVoyageEnd = null;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function initVoyage(camera, controls, targetObjectGetter, endCallback) {
  cameraRef = camera;
  controlsRef = controls;
  getTargetObject = targetObjectGetter;
  onVoyageEnd = endCallback;
}

function getTargetCameraPosition(targetIndex) {
  const targetObject = getTargetObject(targetIndex);
  if (!targetObject) return null;
  const approachDistance = targetIndex === -1
    ? APPROACH_DISTANCE * 5
    : APPROACH_DISTANCE + targetObject.userData.mass * 1.5;
  const offset = new THREE.Vector3(
    approachDistance * 0.8,
    approachDistance * 0.4,
    approachDistance * 0.8,
  );
  return targetObject.position.clone().add(offset);
}

export function voyageTo(targetIndex) {
  if (!cameraRef || !getTargetObject) return;
  const dest = getTargetCameraPosition(targetIndex);
  if (!dest) return;
  isVoyageActive = true;
  currentTargetIndex = targetIndex;
  transitionProgress = 0;
  startPosition.copy(cameraRef.position);
  targetPosition.copy(dest);
}

export function updateVoyage(deltaTimeMs) {
  if (!isVoyageActive || !cameraRef) return false;
  transitionProgress += (deltaTimeMs / TRANSITION_DURATION_MS) * voyageSpeed;
  if (transitionProgress >= 1) {
    transitionProgress = 1;
    isVoyageActive = false;
    if (onVoyageEnd) onVoyageEnd(currentTargetIndex);
    if (isAutoTourActive) scheduleNextAutoTourTarget();
  }
  const eased = easeInOutCubic(transitionProgress);
  cameraRef.position.lerpVectors(startPosition, targetPosition, eased);
  if (controlsRef && !isVoyageActive) controlsRef.target.copy(getTargetObject(currentTargetIndex).position);
  return true;
}

const TOUR_ORDER = [-1, 2, 4, 5, 6, 7, 3, 1, 0];

function scheduleNextAutoTourTarget() {
  const nextIndex = TOUR_ORDER[(TOUR_ORDER.indexOf(currentTargetIndex) + 1) % TOUR_ORDER.length];
  autoTourTimeout = setTimeout(() => voyageTo(nextIndex), 2500);
}

export function startAutoTour(startIndex = -1) {
  isAutoTourActive = true;
  voyageTo(startIndex);
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

export function isVoyageInProgress() {
  return isVoyageActive;
}

export function getCurrentTarget() {
  return currentTargetIndex;
}
