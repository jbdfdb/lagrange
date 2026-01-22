/**
 * Missions Spatiales Historiques
 * Trajectoires des sondes, fusees et navettes humaines
 * DYNAMIQUE: Les trajectoires suivent le referentiel actif
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { scene, camera } from './scene.js';
import { sun, planetObjects } from './celestial.js';
import { AU_VISUAL, PLANETS } from './config.js';

// ========================================
// Donnees des Missions Spatiales
// ========================================
export const MISSIONS_DATA = [
    // === VOYAGER ===
    {
        id: 'voyager1',
        name: 'Voyager 1',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '1977-09-05',
        endControl: null,
        status: 'Active - Espace interstellaire',
        description: 'Premiere sonde a atteindre l\'espace interstellaire. Porte le Golden Record.',
        characteristics: {
            masse: '825 kg',
            puissance: 'RTG plutonium',
            distance: '24+ milliards km',
            vitesse: '17 km/s',
        },
        color: 0x00ff88,
        // Survols: reference aux planetes par index (-1 = Soleil)
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '1977' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '1979' },
            { planetIndex: 5, label: 'Saturne', dateLabel: '1980' },
            { planetIndex: -2, label: 'Heliopause', distance: 121, dateLabel: '2012' },
        ],
    },
    {
        id: 'voyager2',
        name: 'Voyager 2',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '1977-08-20',
        endControl: null,
        status: 'Active - Espace interstellaire',
        description: 'Seule sonde a avoir survole les 4 geantes gazeuses.',
        characteristics: {
            masse: '825 kg',
            puissance: 'RTG plutonium',
            distance: '20+ milliards km',
            vitesse: '15.4 km/s',
        },
        color: 0x00ffaa,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '1977' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '1979' },
            { planetIndex: 5, label: 'Saturne', dateLabel: '1981' },
            { planetIndex: 6, label: 'Uranus', dateLabel: '1986' },
            { planetIndex: 7, label: 'Neptune', dateLabel: '1989' },
            { planetIndex: -2, label: 'Heliopause', distance: 119, dateLabel: '2018' },
        ],
    },
    // === PIONEER ===
    {
        id: 'pioneer10',
        name: 'Pioneer 10',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '1972-03-02',
        endControl: '2003-01-23',
        status: 'Inactive - Signal perdu',
        description: 'Premiere sonde a traverser la ceinture d\'asteroides et survoler Jupiter.',
        characteristics: {
            masse: '258 kg',
            puissance: 'RTG',
            distance: '12+ milliards km',
            vitesse: '12.1 km/s',
        },
        color: 0xffaa00,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '1972' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '1973' },
            { planetIndex: -2, label: 'Deep Space', distance: 82, dateLabel: '2003' },
        ],
    },
    {
        id: 'pioneer11',
        name: 'Pioneer 11',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '1973-04-05',
        endControl: '1995-11-30',
        status: 'Inactive - Signal perdu',
        description: 'Premiere sonde a survoler Saturne.',
        characteristics: {
            masse: '259 kg',
            puissance: 'RTG',
            distance: '6.5+ milliards km',
            vitesse: '11.4 km/s',
        },
        color: 0xffcc00,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '1973' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '1974' },
            { planetIndex: 5, label: 'Saturne', dateLabel: '1979' },
            { planetIndex: -2, label: 'Deep Space', distance: 44, dateLabel: '1995' },
        ],
    },
    // === NEW HORIZONS ===
    {
        id: 'newhorizons',
        name: 'New Horizons',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '2006-01-19',
        endControl: null,
        status: 'Active - Ceinture de Kuiper',
        description: 'Premiere sonde a survoler Pluton et l\'objet Arrokoth.',
        characteristics: {
            masse: '478 kg',
            puissance: 'RTG',
            distance: '8+ milliards km',
            vitesse: '14.1 km/s',
        },
        color: 0xff66ff,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2006' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '2007' },
            { planetIndex: -2, label: 'Pluton', distance: 39.5, dateLabel: '2015' },
            { planetIndex: -2, label: 'Arrokoth', distance: 44.6, dateLabel: '2019' },
        ],
    },
    // === CASSINI ===
    {
        id: 'cassini',
        name: 'Cassini-Huygens',
        agency: 'NASA/ESA',
        type: 'Orbiteur + Atterrisseur',
        launchDate: '1997-10-15',
        endControl: '2017-09-15',
        status: 'Mission terminee - Plongee dans Saturne',
        description: 'Orbiteur de Saturne pendant 13 ans. Huygens a atterri sur Titan.',
        characteristics: {
            masse: '5 712 kg',
            puissance: 'RTG',
            duree: '20 ans',
            orbites: '294 orbites de Saturne',
        },
        color: 0xffff00,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '1997' },
            { planetIndex: 1, label: 'Venus', dateLabel: '1998' },
            { planetIndex: 1, label: 'Venus 2', dateLabel: '1999' },
            { planetIndex: 2, label: 'Terre 2', dateLabel: '1999' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '2000' },
            { planetIndex: 5, label: 'Saturne', dateLabel: '2004' },
        ],
    },
    // === JUNO ===
    {
        id: 'juno',
        name: 'Juno',
        agency: 'NASA',
        type: 'Orbiteur',
        launchDate: '2011-08-05',
        endControl: null,
        status: 'Active - Orbite Jupiter',
        description: 'Etudie la composition, gravite et champ magnetique de Jupiter.',
        characteristics: {
            masse: '3 625 kg',
            puissance: 'Panneaux solaires',
            orbites: '50+ orbites',
            altitude: '4 200 km (perijove)',
        },
        color: 0xff8800,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2011' },
            { planetIndex: 2, label: 'Terre (assist.)', dateLabel: '2013' },
            { planetIndex: 4, label: 'Jupiter', dateLabel: '2016' },
        ],
    },
    // === MARS ROVERS ===
    {
        id: 'curiosity',
        name: 'Curiosity',
        agency: 'NASA',
        type: 'Rover martien',
        launchDate: '2011-11-26',
        endControl: null,
        status: 'Active - Cratere Gale, Mars',
        description: 'Rover de la taille d\'une voiture explorant Mars depuis 2012.',
        characteristics: {
            masse: '899 kg',
            puissance: 'RTG',
            distance: '30+ km parcourus',
            duree: '12+ ans',
        },
        color: 0xff4444,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2011' },
            { planetIndex: 3, label: 'Mars', dateLabel: '2012' },
        ],
    },
    {
        id: 'perseverance',
        name: 'Perseverance',
        agency: 'NASA',
        type: 'Rover martien',
        launchDate: '2020-07-30',
        endControl: null,
        status: 'Active - Cratere Jezero, Mars',
        description: 'Recherche de traces de vie ancienne. Accompagne par l\'helicoptere Ingenuity.',
        characteristics: {
            masse: '1 025 kg',
            puissance: 'RTG',
            equipement: 'Ingenuity (helicoptere)',
            mission: 'Astrobiologie',
        },
        color: 0xff6666,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2020' },
            { planetIndex: 3, label: 'Mars', dateLabel: '2021' },
        ],
    },
    // === APOLLO ===
    {
        id: 'apollo11',
        name: 'Apollo 11',
        agency: 'NASA',
        type: 'Mission habitee lunaire',
        launchDate: '1969-07-16',
        endControl: '1969-07-24',
        status: 'Terminee - Premiers pas sur la Lune',
        description: 'Neil Armstrong et Buzz Aldrin: premiers humains sur la Lune.',
        characteristics: {
            equipage: 'Armstrong, Aldrin, Collins',
            duree: '8 jours',
            temps_lune: '21h 36min',
            echantillons: '21.5 kg de roches',
        },
        color: 0xffffff,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '16 juil.' },
            { planetIndex: -3, label: 'Lune', dateLabel: '20 juil.' },
            { planetIndex: 2, label: 'Retour', dateLabel: '24 juil.' },
        ],
    },
    // === ROSETTA ===
    {
        id: 'rosetta',
        name: 'Rosetta',
        agency: 'ESA',
        type: 'Orbiteur + Atterrisseur',
        launchDate: '2004-03-02',
        endControl: '2016-09-30',
        status: 'Terminee - Posee sur comete',
        description: 'Premiere sonde a orbiter et atterrir sur une comete (67P).',
        characteristics: {
            masse: '3 000 kg',
            cible: 'Comete 67P/Churyumov',
            atterrisseur: 'Philae',
            duree: '12 ans',
        },
        color: 0x88ffff,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2004' },
            { planetIndex: 2, label: 'Terre 2', dateLabel: '2005' },
            { planetIndex: 3, label: 'Mars', dateLabel: '2007' },
            { planetIndex: 2, label: 'Terre 3', dateLabel: '2007' },
            { planetIndex: 2, label: 'Terre 4', dateLabel: '2009' },
            { planetIndex: -2, label: 'Comete 67P', distance: 3.5, dateLabel: '2014' },
        ],
    },
    // === PARKER SOLAR PROBE ===
    {
        id: 'parkersolar',
        name: 'Parker Solar Probe',
        agency: 'NASA',
        type: 'Sonde solaire',
        launchDate: '2018-08-12',
        endControl: null,
        status: 'Active - Orbite proche Soleil',
        description: 'Objet humain le plus rapide et le plus proche du Soleil.',
        characteristics: {
            masse: '685 kg',
            vitesse_max: '692 000 km/h',
            distance_soleil: '6.16 millions km',
            temperature: 'Bouclier 1400 C',
        },
        color: 0xffaa00,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2018' },
            { planetIndex: 1, label: 'Venus', dateLabel: '2018' },
            { planetIndex: -1, label: 'Soleil (perihelia)', dateLabel: '2024' },
        ],
    },
    // === JWST ===
    {
        id: 'jwst',
        name: 'James Webb Space Telescope',
        agency: 'NASA/ESA/CSA',
        type: 'Telescope spatial',
        launchDate: '2021-12-25',
        endControl: null,
        status: 'Active - Point L2',
        description: 'Plus grand telescope spatial, observe l\'univers en infrarouge.',
        characteristics: {
            masse: '6 500 kg',
            miroir: '6.5m de diametre',
            position: 'Point de Lagrange L2',
            temperature: '-233 C',
        },
        color: 0xffdd44,
        flybys: [
            { planetIndex: 2, label: 'Terre', dateLabel: '2021' },
            { planetIndex: -4, label: 'Point L2', dateLabel: '2022' },
        ],
    },
];

// ========================================
// State
// ========================================
let missionObjects = new Map();
let activeMissions = new Set();
let missionLabels = [];

// ========================================
// Get Position for Flyby Point
// ========================================
function getFlybyPosition(flyby, index, totalFlybys) {
    // planetIndex: -1 = Soleil, 0-7 = planetes, -2 = deep space (distance), -3 = Lune, -4 = L2

    if (flyby.planetIndex === -1) {
        // Soleil
        return sun.position.clone();
    } else if (flyby.planetIndex >= 0 && flyby.planetIndex < planetObjects.length) {
        // Planete
        return planetObjects[flyby.planetIndex].position.clone();
    } else if (flyby.planetIndex === -2 && flyby.distance) {
        // Deep space - direction sortante depuis le dernier point planete
        const angle = (index / totalFlybys) * Math.PI * 0.8 + Math.PI * 0.1;
        const distance = flyby.distance * AU_VISUAL;
        return new THREE.Vector3(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );
    } else if (flyby.planetIndex === -3) {
        // Lune - proche de la Terre
        const earthPos = planetObjects[2].position.clone();
        return earthPos.add(new THREE.Vector3(15, 0, 15));
    } else if (flyby.planetIndex === -4) {
        // Point L2 - derriere la Terre par rapport au Soleil
        const earthPos = planetObjects[2].position.clone();
        const dirFromSun = earthPos.clone().sub(sun.position).normalize();
        return earthPos.add(dirFromSun.multiplyScalar(30));
    }

    // Fallback
    return new THREE.Vector3(0, 0, 0);
}

// ========================================
// Create Mission Visual Objects
// ========================================
function createMissionObjects(mission) {
    const group = new THREE.Group();
    group.userData = { missionId: mission.id };

    // Marqueurs de survol
    const markers = [];
    mission.flybys.forEach((flyby, index) => {
        // Sphere pour le marqueur
        const isStart = index === 0;
        const isEnd = index === mission.flybys.length - 1;
        const size = isStart ? 5 : (isEnd ? 4 : 3);

        const markerGeo = new THREE.SphereGeometry(size, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({
            color: isStart ? 0x00ff00 : mission.color,
            transparent: true,
            opacity: isEnd ? 1.0 : 0.8,
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.userData = { flyby, index };
        markers.push(marker);
        group.add(marker);
    });

    // Ligne de trajectoire (sera mise a jour dynamiquement)
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
        color: mission.color,
        transparent: true,
        opacity: 0.7,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);

    // Icone de sonde au dernier point
    const probeGeo = new THREE.ConeGeometry(4, 10, 8);
    const probeMat = new THREE.MeshBasicMaterial({
        color: mission.color,
        transparent: true,
        opacity: 0.9,
    });
    const probe = new THREE.Mesh(probeGeo, probeMat);
    probe.rotation.x = -Math.PI / 2;
    group.add(probe);

    // Labels pour les survols
    const labels = [];
    mission.flybys.forEach((flyby, index) => {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'mission-label';
        labelDiv.innerHTML = `<span style="color: #${mission.color.toString(16).padStart(6, '0')}">${flyby.label}</span><br><small>${flyby.dateLabel}</small>`;
        labelDiv.style.cssText = `
            position: absolute;
            font-family: 'Orbitron', monospace;
            font-size: 9px;
            color: #ffffff;
            pointer-events: none;
            text-shadow: 0 0 5px #000, 0 0 10px #000;
            white-space: nowrap;
            z-index: 500;
        `;
        document.body.appendChild(labelDiv);
        labels.push({ div: labelDiv, index });
        missionLabels.push({ div: labelDiv, missionId: mission.id });
    });

    return { group, markers, line, probe, labels, mission };
}

// ========================================
// Update Mission Positions
// ========================================
function updateMissionPositions(objects) {
    const { markers, line, probe, labels, mission } = objects;
    const points = [];

    // Mettre a jour les positions des marqueurs
    mission.flybys.forEach((flyby, index) => {
        const pos = getFlybyPosition(flyby, index, mission.flybys.length);
        markers[index].position.copy(pos);
        points.push(pos.clone());
    });

    // Mettre a jour la ligne de trajectoire
    if (points.length > 1) {
        // Creer une courbe lisse
        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(50);
        line.geometry.setFromPoints(curvePoints);
    }

    // Positionner la sonde au dernier point
    const lastPos = points[points.length - 1];
    if (lastPos) {
        probe.position.copy(lastPos);
        probe.position.y += 8;

        // Orienter vers le point precedent
        if (points.length > 1) {
            const prevPos = points[points.length - 2];
            const direction = new THREE.Vector3().subVectors(lastPos, prevPos).normalize();
            probe.lookAt(lastPos.clone().add(direction));
        }
    }
}

// ========================================
// Update Mission Labels (2D projection)
// ========================================
export function updateMissionLabels() {
    missionLabels.forEach(({ div, missionId }) => {
        const objects = missionObjects.get(missionId);
        if (!objects || !activeMissions.has(missionId)) {
            div.style.display = 'none';
            return;
        }

        // Trouver l'index du label
        const labelData = objects.labels.find(l => l.div === div);
        if (!labelData) return;

        const marker = objects.markers[labelData.index];
        if (!marker) return;

        const pos = marker.position.clone().project(camera);

        if (pos.z > 1) {
            div.style.display = 'none';
            return;
        }

        const screenX = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        div.style.display = 'block';
        div.style.left = (screenX + 10) + 'px';
        div.style.top = (screenY - 10) + 'px';
    });
}

// ========================================
// Add Mission to Scene
// ========================================
export function addMission(missionId) {
    const mission = MISSIONS_DATA.find((m) => m.id === missionId);
    if (!mission || missionObjects.has(missionId)) return;

    const objects = createMissionObjects(mission);
    scene.add(objects.group);

    // Position initiale
    updateMissionPositions(objects);

    missionObjects.set(missionId, objects);
    activeMissions.add(missionId);

    console.log(`Mission ajoutee: ${mission.name}`);
}

// ========================================
// Remove Mission from Scene
// ========================================
export function removeMission(missionId) {
    const objects = missionObjects.get(missionId);
    if (!objects) return;

    scene.remove(objects.group);

    // Nettoyer les labels
    objects.labels.forEach(({ div }) => {
        div.remove();
    });
    missionLabels = missionLabels.filter(l => l.missionId !== missionId);

    // Disposer les geometries
    objects.markers.forEach(m => {
        m.geometry.dispose();
        m.material.dispose();
    });
    objects.line.geometry.dispose();
    objects.line.material.dispose();
    objects.probe.geometry.dispose();
    objects.probe.material.dispose();

    missionObjects.delete(missionId);
    activeMissions.delete(missionId);
}

// ========================================
// Toggle Mission Visibility
// ========================================
export function toggleMission(missionId) {
    if (activeMissions.has(missionId)) {
        removeMission(missionId);
        return false;
    } else {
        addMission(missionId);
        return true;
    }
}

// ========================================
// Update All Active Missions (called each frame)
// ========================================
export function updateMissions() {
    missionObjects.forEach((objects, missionId) => {
        if (activeMissions.has(missionId)) {
            updateMissionPositions(objects);
        }
    });
}

// ========================================
// Get Mission Info
// ========================================
export function getMissionInfo(missionId) {
    return MISSIONS_DATA.find((m) => m.id === missionId);
}

// ========================================
// Get All Missions
// ========================================
export function getAllMissions() {
    return MISSIONS_DATA;
}

// ========================================
// Get Active Missions
// ========================================
export function getActiveMissions() {
    return Array.from(activeMissions);
}

// ========================================
// Is Mission Active
// ========================================
export function isMissionActive(missionId) {
    return activeMissions.has(missionId);
}

// ========================================
// Clear All Missions
// ========================================
export function clearAllMissions() {
    const missionIds = Array.from(activeMissions);
    missionIds.forEach((id) => removeMission(id));
}

// ========================================
// Initialize with Default Missions
// ========================================
export function initMissions() {
    // Ajouter Voyager 1 & 2 par defaut
    addMission('voyager1');
    addMission('voyager2');
    console.log('Systeme de missions initialise');
}
