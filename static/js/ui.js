/**
 * Interface Utilisateur
 * Panneaux de controle et labels
 */

import { camera } from './scene.js';
import { planetLabels } from './celestial.js';
import { referentialSystem } from './referential.js';
import {
    startAsteroidRain,
    stopAsteroidRain,
    isAsteroidRainActive,
    setTrailDuration,
    dynamicAsteroids,
} from './asteroids.js';
import {
    voyageTo,
    startAutoTour,
    stopAutoTour,
    isAutoTourRunning,
    setVoyageSpeed,
    getVoyageSpeed,
    setVoyageCallbacks,
    getCurrentTargetName,
    getNextTargetName,
    getPlanetInfo,
} from './voyage.js';
import { PLANETS, TRAILS, VOYAGE } from './config.js';

// ========================================
// UI Elements
// ========================================
let referentialPanel = null;
let trailPanel = null;
let controlPanel = null;
let voyagePanel = null;
let planetInfoPanel = null;
let asteroidCounter = null;
let voyageInfo = null;
let speedValueDisplay = null;
let activeRefButton = null;
let activeTrailButton = null;

// ========================================
// Create Button Helper
// ========================================
function createButton(text, options = {}) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `btn ${options.className || ''}`;

    if (options.small) btn.classList.add('btn--small');
    if (options.half) btn.classList.add('btn--half');
    if (options.active) btn.classList.add('btn--active');

    if (options.onClick) {
        btn.addEventListener('click', options.onClick);
    }

    return btn;
}

// ========================================
// Create Panel Helper
// ========================================
function createPanel(id, title, titleIcon) {
    const panel = document.createElement('div');
    panel.id = id;
    panel.className = 'panel';

    const titleEl = document.createElement('div');
    titleEl.className = 'panel-title';
    titleEl.textContent = `${titleIcon} ${title}`;
    panel.appendChild(titleEl);

    document.body.appendChild(panel);
    return panel;
}

// ========================================
// Referential Panel
// ========================================
function createReferentialPanel() {
    referentialPanel = createPanel('referential-panel', 'REFERENTIEL', '');

    // Bouton Soleil
    const sunBtn = createButton('Soleil', {
        active: true,
        onClick: () => handleReferentialChange(-1, sunBtn),
    });
    referentialPanel.appendChild(sunBtn);
    activeRefButton = sunBtn;

    // Boutons planetes
    PLANETS.forEach((planet, index) => {
        const btn = createButton(planet.name, {
            small: true,
            onClick: () => handleReferentialChange(index, btn),
        });
        referentialPanel.appendChild(btn);
    });
}

function handleReferentialChange(centerIndex, buttonElement) {
    // Deselectionner l'ancien bouton
    if (activeRefButton) {
        activeRefButton.classList.remove('btn--active');
    }

    // Selectionner le nouveau bouton
    buttonElement.classList.add('btn--active');
    activeRefButton = buttonElement;

    // Changer le referentiel (via voyage pour une transition fluide)
    voyageTo(centerIndex);
}

// ========================================
// Trail Panel
// ========================================
function createTrailPanel() {
    trailPanel = createPanel('trail-panel', 'TRAINEES', '');

    TRAILS.DURATIONS.forEach((duration) => {
        const isDefault = duration === TRAILS.DEFAULT_DURATION;
        const btn = createButton(`${duration}s`, {
            half: true,
            small: true,
            active: isDefault,
            onClick: () => handleTrailDurationChange(duration, btn),
        });

        if (isDefault) {
            activeTrailButton = btn;
        }

        trailPanel.appendChild(btn);
    });
}

function handleTrailDurationChange(duration, buttonElement) {
    setTrailDuration(duration);

    if (activeTrailButton) {
        activeTrailButton.classList.remove('btn--active');
    }
    buttonElement.classList.add('btn--active');
    activeTrailButton = buttonElement;
}

// ========================================
// Control Panel (Asteroids)
// ========================================
function createControlPanel() {
    controlPanel = createPanel('control-panel', 'ASTEROIDES', '');

    // Bouton pluie d'asteroides
    const rainBtn = createButton("Pluie d'asteroides", {
        onClick: () => {
            if (!isAsteroidRainActive()) {
                startAsteroidRain();
                rainBtn.textContent = 'Arreter pluie';
                rainBtn.classList.add('btn--active');
            } else {
                stopAsteroidRain();
                rainBtn.textContent = "Pluie d'asteroides";
                rainBtn.classList.remove('btn--active');
            }
        },
    });
    controlPanel.appendChild(rainBtn);

    // Compteur
    asteroidCounter = document.createElement('div');
    asteroidCounter.id = 'asteroid-counter';
    asteroidCounter.textContent = 'Asteroides: 0';
    controlPanel.appendChild(asteroidCounter);
}

// ========================================
// Voyage Panel (NEW)
// ========================================
function createVoyagePanel() {
    voyagePanel = createPanel('voyage-panel', 'VOYAGE', '');

    // Bouton Voyage Auto
    const autoTourBtn = createButton('Voyage Auto', {
        onClick: () => {
            if (!isAutoTourRunning()) {
                startAutoTour();
                autoTourBtn.textContent = 'Arreter Voyage';
                autoTourBtn.classList.add('btn--active');
            } else {
                stopAutoTour();
                autoTourBtn.textContent = 'Voyage Auto';
                autoTourBtn.classList.remove('btn--active');
            }
        },
    });
    voyagePanel.appendChild(autoTourBtn);

    // Controle de vitesse
    const speedControl = document.createElement('div');
    speedControl.className = 'speed-control';

    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Vitesse:';
    speedControl.appendChild(speedLabel);

    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.className = 'speed-slider';
    speedSlider.min = VOYAGE.MIN_SPEED;
    speedSlider.max = VOYAGE.MAX_SPEED;
    speedSlider.step = 0.1;
    speedSlider.value = VOYAGE.DEFAULT_SPEED;
    speedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        setVoyageSpeed(speed);
        speedValueDisplay.textContent = `x${speed.toFixed(1)}`;
    });
    speedControl.appendChild(speedSlider);

    speedValueDisplay = document.createElement('span');
    speedValueDisplay.className = 'speed-value';
    speedValueDisplay.textContent = `x${VOYAGE.DEFAULT_SPEED.toFixed(1)}`;
    speedControl.appendChild(speedValueDisplay);

    voyagePanel.appendChild(speedControl);

    // Info voyage
    voyageInfo = document.createElement('div');
    voyageInfo.className = 'voyage-info';
    voyageInfo.innerHTML = `
        <div>Actuel: <span class="voyage-info--highlight">${getCurrentTargetName()}</span></div>
        <div>Suivant: ${getNextTargetName()}</div>
    `;
    voyagePanel.appendChild(voyageInfo);

    // Callbacks pour mise a jour UI
    setVoyageCallbacks({
        onTargetChange: (name) => {
            updateVoyageInfo();
            updateReferentialButtonState(name);
        },
        onVoyageEnd: updateVoyageInfo,
    });
}

function updateVoyageInfo() {
    if (voyageInfo) {
        voyageInfo.innerHTML = `
            <div>Actuel: <span class="voyage-info--highlight">${getCurrentTargetName()}</span></div>
            <div>Suivant: ${getNextTargetName()}</div>
        `;
    }
}

function updateReferentialButtonState(targetName) {
    const buttons = referentialPanel.querySelectorAll('button');
    buttons.forEach((btn) => {
        if (btn.textContent === targetName) {
            if (activeRefButton) {
                activeRefButton.classList.remove('btn--active');
            }
            btn.classList.add('btn--active');
            activeRefButton = btn;
        }
    });
}

// ========================================
// Planet Info Panel
// ========================================
function createPlanetInfoPanel() {
    planetInfoPanel = document.createElement('div');
    planetInfoPanel.id = 'planet-info';
    planetInfoPanel.className = 'panel';
    planetInfoPanel.innerHTML = `
        <div class="planet-name">Soleil</div>
        <div class="planet-stats">
            <div><span class="stat-label">Diametre:</span> <span class="stat-value">-</span></div>
            <div><span class="stat-label">Distance:</span> <span class="stat-value">-</span></div>
            <div><span class="stat-label">Temperature:</span> <span class="stat-value">-</span></div>
            <div><span class="stat-label">Satellites:</span> <span class="stat-value">-</span></div>
        </div>
    `;
    document.body.appendChild(planetInfoPanel);
}

export function showPlanetInfo(planetIndex) {
    const data = getPlanetInfo(planetIndex);
    if (!data || !planetInfoPanel) return;

    planetInfoPanel.querySelector('.planet-name').textContent = data.name;

    const stats = planetInfoPanel.querySelectorAll('.stat-value');
    stats[0].textContent = data.info.diameter;
    stats[1].textContent = data.info.distanceAU;
    stats[2].textContent = data.info.temperature;
    stats[3].textContent = data.info.moons;

    planetInfoPanel.classList.add('visible');
}

export function hidePlanetInfo() {
    if (planetInfoPanel) {
        planetInfoPanel.classList.remove('visible');
    }
}

// ========================================
// Labels Update
// ========================================
export function updateLabels() {
    for (const label of planetLabels) {
        const pos = label.object.position.clone().project(camera);

        const screenX = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        if (pos.z > 1) {
            label.div.style.display = 'none';
            continue;
        }

        label.div.style.display = 'block';
        label.div.style.left = screenX + 15 + 'px';
        label.div.style.top = screenY - 5 + 'px';
    }
}

// ========================================
// Asteroid Counter Update
// ========================================
export function updateAsteroidCounter(count) {
    if (asteroidCounter) {
        asteroidCounter.textContent = `Asteroides: ${count}`;
    }
}

// ========================================
// Hide Loading Screen
// ========================================
export function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loading.remove(), 500);
    }
}

// ========================================
// Initialize UI
// ========================================
export function initUI() {
    createReferentialPanel();
    createTrailPanel();
    createControlPanel();
    createVoyagePanel();
    createPlanetInfoPanel();

    // Initialiser le referentiel sur le Soleil
    referentialSystem.setCenter(-1);

    console.log('Interface utilisateur initialisee');
}
