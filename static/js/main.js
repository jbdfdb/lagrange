/**
 * Lagrange - Systeme Solaire 3D Interactif
 * Point d'entree principal
 *
 * @author J-B de Fromont
 * @version 2.0.0
 */

import { scene, camera, renderer, controls, initScene } from './scene.js';
import { initCelestialBodies, updateSun, updatePlanetRotations } from './celestial.js';
import { referentialSystem } from './referential.js';
import { updateAsteroids } from './asteroids.js';
import { updateVoyage, getVoyageSpeed } from './voyage.js';
import { initUI, updateLabels, updateAsteroidCounter, hideLoadingScreen } from './ui.js';

// ========================================
// State
// ========================================
let time = 0;
let lastTime = 0;
let isRunning = true;

// ========================================
// Animation Loop
// ========================================
function animate(currentTime) {
    if (!isRunning) return;

    requestAnimationFrame(animate);

    // Calcul du delta time
    const deltaTime = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;

    // Skip si delta trop grand (tab inactive)
    if (deltaTime > 0.1) return;

    // Increment time for shaders
    time += 0.005;

    // Update sun shader and rotation
    updateSun(time);

    // Update referential system (planet positions)
    referentialSystem.update(deltaTime, getVoyageSpeed());

    // Update planet rotations
    updatePlanetRotations();

    // Update voyage animation
    updateVoyage(deltaTime);

    // Update asteroids and get count
    const asteroidCount = updateAsteroids();
    updateAsteroidCounter(asteroidCount);

    // Update UI labels
    updateLabels();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// ========================================
// Pause / Resume
// ========================================
export function pause() {
    isRunning = false;
}

export function resume() {
    if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }
}

// ========================================
// Visibility Change Handler
// ========================================
function handleVisibilityChange() {
    if (document.hidden) {
        pause();
    } else {
        resume();
    }
}

// ========================================
// Initialize Application
// ========================================
async function init() {
    console.log('Lagrange - Systeme Solaire 3D');
    console.log('Initialisation...');

    try {
        // Initialize Three.js scene
        initScene();

        // Create celestial bodies
        initCelestialBodies();

        // Initialize UI
        initUI();

        // Handle visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Hide loading screen
        hideLoadingScreen();

        // Start animation loop
        console.log('Demarrage de l\'animation...');
        requestAnimationFrame(animate);

    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div style="color: #FF6600;">Erreur de chargement</div>
                <div style="font-size: 12px; margin-top: 10px;">${error.message}</div>
            `;
        }
    }
}

// ========================================
// Start Application
// ========================================
init();
