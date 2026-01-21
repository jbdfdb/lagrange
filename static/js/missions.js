/**
 * Missions Spatiales Historiques
 * Trajectoires des sondes, fusees et navettes humaines
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { scene } from './scene.js';
import { AU_VISUAL, PLANETS } from './config.js';

// ========================================
// Donnees des Missions Spatiales
// ========================================
export const MISSIONS_DATA = [
    // === MISSIONS INTERPLANETAIRES ===
    {
        id: 'voyager1',
        name: 'Voyager 1',
        agency: 'NASA',
        type: 'Sonde interplanetaire',
        launchDate: '1977-09-05',
        endControl: null, // Toujours en contact
        status: 'Active - Espace interstellaire',
        description: 'Premiere sonde a atteindre l\'espace interstellaire. Porte le Golden Record.',
        characteristics: {
            masse: '825 kg',
            puissance: 'RTG plutonium',
            distance: '24+ milliards km',
            vitesse: '17 km/s',
        },
        color: 0x00ff88,
        // Trajectoire simplifiee (points cles en UA)
        trajectory: [
            { body: 'Terre', date: '1977-09-05', au: 1.0, angle: 0 },
            { body: 'Jupiter', date: '1979-03-05', au: 5.2, angle: 45 },
            { body: 'Saturne', date: '1980-11-12', au: 9.5, angle: 80 },
            { body: 'Heliopause', date: '2012-08-25', au: 121, angle: 120 },
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
        trajectory: [
            { body: 'Terre', date: '1977-08-20', au: 1.0, angle: 0 },
            { body: 'Jupiter', date: '1979-07-09', au: 5.2, angle: 50 },
            { body: 'Saturne', date: '1981-08-25', au: 9.5, angle: 95 },
            { body: 'Uranus', date: '1986-01-24', au: 19.2, angle: 140 },
            { body: 'Neptune', date: '1989-08-25', au: 30.1, angle: 180 },
            { body: 'Heliopause', date: '2018-11-05', au: 119, angle: 210 },
        ],
    },
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
        trajectory: [
            { body: 'Terre', date: '1972-03-02', au: 1.0, angle: 0 },
            { body: 'Jupiter', date: '1973-12-03', au: 5.2, angle: 60 },
            { body: 'Deep Space', date: '2003-01-23', au: 82, angle: 110 },
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
        trajectory: [
            { body: 'Terre', date: '1973-04-05', au: 1.0, angle: 0 },
            { body: 'Jupiter', date: '1974-12-02', au: 5.2, angle: 55 },
            { body: 'Saturne', date: '1979-09-01', au: 9.5, angle: 100 },
            { body: 'Deep Space', date: '1995-11-30', au: 44, angle: 150 },
        ],
    },
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
        trajectory: [
            { body: 'Terre', date: '2006-01-19', au: 1.0, angle: 0 },
            { body: 'Jupiter', date: '2007-02-28', au: 5.2, angle: 40 },
            { body: 'Pluton', date: '2015-07-14', au: 39.5, angle: 130 },
            { body: 'Arrokoth', date: '2019-01-01', au: 44.6, angle: 145 },
            { body: 'Kuiper Belt', date: '2025-01-01', au: 60, angle: 160 },
        ],
    },
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
        trajectory: [
            { body: 'Terre', date: '1997-10-15', au: 1.0, angle: 0 },
            { body: 'Venus', date: '1998-04-26', au: 0.72, angle: 30 },
            { body: 'Venus', date: '1999-06-24', au: 0.72, angle: 60 },
            { body: 'Terre', date: '1999-08-18', au: 1.0, angle: 90 },
            { body: 'Jupiter', date: '2000-12-30', au: 5.2, angle: 120 },
            { body: 'Saturne', date: '2004-07-01', au: 9.5, angle: 180 },
        ],
    },
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
        trajectory: [
            { body: 'Terre', date: '2011-08-05', au: 1.0, angle: 0 },
            { body: 'Deep Space', date: '2012-09-01', au: 2.5, angle: 45 },
            { body: 'Terre', date: '2013-10-09', au: 1.0, angle: 90 },
            { body: 'Jupiter', date: '2016-07-04', au: 5.2, angle: 160 },
        ],
    },

    // === MISSIONS MARS ===
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
        trajectory: [
            { body: 'Terre', date: '2011-11-26', au: 1.0, angle: 0 },
            { body: 'Mars', date: '2012-08-06', au: 1.52, angle: 45 },
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
        trajectory: [
            { body: 'Terre', date: '2020-07-30', au: 1.0, angle: 0 },
            { body: 'Mars', date: '2021-02-18', au: 1.52, angle: 50 },
        ],
    },

    // === MISSIONS APOLLO ===
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
        trajectory: [
            { body: 'Terre', date: '1969-07-16', au: 1.0, angle: 0 },
            { body: 'Lune', date: '1969-07-20', au: 1.00257, angle: 5 },
            { body: 'Terre', date: '1969-07-24', au: 1.0, angle: 10 },
        ],
    },
    {
        id: 'apollo13',
        name: 'Apollo 13',
        agency: 'NASA',
        type: 'Mission habitee lunaire',
        launchDate: '1970-04-11',
        endControl: '1970-04-17',
        status: 'Terminee - Retour d\'urgence',
        description: '"Houston, we have a problem" - Survie miraculeuse apres explosion.',
        characteristics: {
            equipage: 'Lovell, Swigert, Haise',
            duree: '5 jours 22h',
            incident: 'Explosion reservoir O2',
            retour: 'Fronde lunaire',
        },
        color: 0xcccccc,
        trajectory: [
            { body: 'Terre', date: '1970-04-11', au: 1.0, angle: 0 },
            { body: 'Lune', date: '1970-04-14', au: 1.00257, angle: 6 },
            { body: 'Terre', date: '1970-04-17', au: 1.0, angle: 12 },
        ],
    },

    // === AUTRES MISSIONS ===
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
        trajectory: [
            { body: 'Terre', date: '2004-03-02', au: 1.0, angle: 0 },
            { body: 'Terre', date: '2005-03-04', au: 1.0, angle: 30 },
            { body: 'Mars', date: '2007-02-25', au: 1.52, angle: 60 },
            { body: 'Terre', date: '2007-11-13', au: 1.0, angle: 90 },
            { body: 'Terre', date: '2009-11-13', au: 1.0, angle: 120 },
            { body: 'Comete 67P', date: '2014-08-06', au: 3.5, angle: 180 },
        ],
    },
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
            temperature: 'Bouclier 1400°C',
        },
        color: 0xffaa00,
        trajectory: [
            { body: 'Terre', date: '2018-08-12', au: 1.0, angle: 0 },
            { body: 'Venus', date: '2018-10-03', au: 0.72, angle: 20 },
            { body: 'Soleil (perihelia)', date: '2024-12-24', au: 0.046, angle: 45 },
        ],
    },
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
            temperature: '-233°C',
        },
        color: 0xffdd44,
        trajectory: [
            { body: 'Terre', date: '2021-12-25', au: 1.0, angle: 0 },
            { body: 'L2', date: '2022-01-24', au: 1.01, angle: 180 },
        ],
    },
];

// ========================================
// State
// ========================================
let missionObjects = new Map();
let activeMissions = new Set();
let selectedMission = null;
let missionTrailsVisible = true;

// ========================================
// Create Mission Trajectory
// ========================================
function createMissionTrajectory(mission) {
    const points = [];
    const trajectory = mission.trajectory;

    for (let i = 0; i < trajectory.length; i++) {
        const point = trajectory[i];
        const distance = point.au * AU_VISUAL;
        const angleRad = (point.angle * Math.PI) / 180;

        points.push(
            new THREE.Vector3(
                Math.cos(angleRad) * distance,
                (Math.random() - 0.5) * 20, // Legere variation Y
                Math.sin(angleRad) * distance
            )
        );
    }

    // Creer une courbe lisse
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(100);

    // Ligne de trajectoire
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({
        color: mission.color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2,
    });
    const line = new THREE.Line(geometry, material);
    line.userData = { missionId: mission.id, type: 'trajectory' };

    // Marqueurs aux points cles
    const markers = [];
    trajectory.forEach((point, index) => {
        const markerGeo = new THREE.SphereGeometry(index === 0 ? 4 : 2, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({
            color: index === 0 ? 0x00ff00 : mission.color,
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);

        const distance = point.au * AU_VISUAL;
        const angleRad = (point.angle * Math.PI) / 180;
        marker.position.set(
            Math.cos(angleRad) * distance,
            (Math.random() - 0.5) * 20,
            Math.sin(angleRad) * distance
        );
        marker.userData = {
            missionId: mission.id,
            type: 'marker',
            pointIndex: index,
            body: point.body,
            date: point.date,
        };
        markers.push(marker);
    });

    // Icone de la sonde (au dernier point)
    const lastPoint = trajectory[trajectory.length - 1];
    const probeGeo = new THREE.ConeGeometry(3, 8, 8);
    const probeMat = new THREE.MeshBasicMaterial({ color: mission.color });
    const probe = new THREE.Mesh(probeGeo, probeMat);

    const lastDistance = lastPoint.au * AU_VISUAL;
    const lastAngle = (lastPoint.angle * Math.PI) / 180;
    probe.position.set(
        Math.cos(lastAngle) * lastDistance,
        10,
        Math.sin(lastAngle) * lastDistance
    );
    probe.rotation.x = Math.PI / 2;
    probe.userData = { missionId: mission.id, type: 'probe' };

    return { line, markers, probe, mission };
}

// ========================================
// Add Mission to Scene
// ========================================
export function addMission(missionId) {
    const mission = MISSIONS_DATA.find((m) => m.id === missionId);
    if (!mission || missionObjects.has(missionId)) return;

    const objects = createMissionTrajectory(mission);

    scene.add(objects.line);
    objects.markers.forEach((m) => scene.add(m));
    scene.add(objects.probe);

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

    scene.remove(objects.line);
    objects.markers.forEach((m) => scene.remove(m));
    scene.remove(objects.probe);

    objects.line.geometry.dispose();
    objects.line.material.dispose();
    objects.markers.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
    });
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
// Select Mission (for info display)
// ========================================
export function selectMission(missionId) {
    selectedMission = missionId;
    return getMissionInfo(missionId);
}

// ========================================
// Get Selected Mission
// ========================================
export function getSelectedMission() {
    return selectedMission;
}

// ========================================
// Clear All Missions
// ========================================
export function clearAllMissions() {
    const missionIds = Array.from(activeMissions);
    missionIds.forEach((id) => removeMission(id));
}

// ========================================
// Toggle All Trajectories Visibility
// ========================================
export function setMissionTrailsVisible(visible) {
    missionTrailsVisible = visible;
    missionObjects.forEach((objects) => {
        objects.line.visible = visible;
        objects.markers.forEach((m) => (m.visible = visible));
    });
}

// ========================================
// Initialize with Default Missions
// ========================================
export function initMissions() {
    // Ajouter quelques missions par defaut
    addMission('voyager1');
    addMission('voyager2');
    console.log('Systeme de missions initialise');
}
