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
        summary: 'Mission emblematique d\'exploration du systeme solaire externe. Voyager 1 a revolutionne notre comprehension de Jupiter et Saturne avant de devenir le premier objet humain a penetrer l\'espace interstellaire. Elle transporte le Golden Record, un message de l\'humanite vers d\'eventuelles civilisations extraterrestres.',
        timeline: [
            { date: '1977-09-05', event: 'Lancement depuis Cap Canaveral', highlight: true },
            { date: '1979-03-05', event: 'Survol de Jupiter - Decouverte volcans sur Io' },
            { date: '1980-11-12', event: 'Survol de Saturne et Titan' },
            { date: '1990-02-14', event: 'Photo "Pale Blue Dot" de la Terre' },
            { date: '2012-08-25', event: 'Entree dans l\'espace interstellaire', highlight: true },
            { date: '2025', event: 'Toujours en communication a 24 milliards km' },
        ],
        characteristics: {
            masse: '825 kg',
            puissance: 'RTG plutonium',
            distance: '24+ milliards km',
            vitesse: '17 km/s',
        },
        color: 0x00ff88,
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
        summary: 'Seule sonde a avoir survole les quatre geantes gazeuses. Grace a un alignement planetaire rare (tous les 175 ans), Voyager 2 a pu visiter Jupiter, Saturne, Uranus et Neptune en une seule mission, revelant des mondes inconnus et leurs lunes fascinantes.',
        timeline: [
            { date: '1977-08-20', event: 'Lancement (avant Voyager 1)', highlight: true },
            { date: '1979-07-09', event: 'Survol de Jupiter' },
            { date: '1981-08-25', event: 'Survol de Saturne' },
            { date: '1986-01-24', event: 'Premier survol d\'Uranus', highlight: true },
            { date: '1989-08-25', event: 'Premier survol de Neptune', highlight: true },
            { date: '2018-11-05', event: 'Entree dans l\'espace interstellaire' },
        ],
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
        summary: 'Pionniere de l\'exploration spatiale lointaine. Pioneer 10 fut la premiere sonde a traverser la ceinture d\'asteroides et a photographier Jupiter de pres. Elle porte une plaque doree representant l\'humanite, premier message physique envoye vers les etoiles.',
        timeline: [
            { date: '1972-03-02', event: 'Lancement - Fusee Atlas-Centaur', highlight: true },
            { date: '1972-07-15', event: 'Entree dans la ceinture d\'asteroides' },
            { date: '1973-12-03', event: 'Premier survol de Jupiter', highlight: true },
            { date: '1983-06-13', event: 'Depasse l\'orbite de Neptune' },
            { date: '2003-01-23', event: 'Dernier signal recu a 12 milliards km' },
        ],
        characteristics: {
            masse: '258 kg',
            puissance: 'RTG 155W',
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
        summary: 'Premiere sonde a explorer Saturne et ses anneaux. Pioneer 11 a utilise l\'assistance gravitationnelle de Jupiter pour atteindre Saturne, ouvrant la voie aux missions Voyager. Elle a decouvert une nouvelle lune et un anneau supplementaire de Saturne.',
        timeline: [
            { date: '1973-04-05', event: 'Lancement depuis Cap Canaveral', highlight: true },
            { date: '1974-12-02', event: 'Survol de Jupiter (assistance gravitationnelle)' },
            { date: '1979-09-01', event: 'Premier survol de Saturne', highlight: true },
            { date: '1990-02-23', event: 'Dernieres donnees scientifiques' },
            { date: '1995-11-30', event: 'Fin de mission - Signal trop faible' },
        ],
        characteristics: {
            masse: '259 kg',
            puissance: 'RTG 155W',
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
        summary: 'Mission historique vers Pluton et au-dela. New Horizons a revele un monde etonnamment complexe avec des montagnes de glace, des plaines d\'azote et une atmosphere ténue. Elle continue d\'explorer la ceinture de Kuiper, cette zone mysterieuse aux confins du systeme solaire.',
        timeline: [
            { date: '2006-01-19', event: 'Lancement - Plus rapide sonde jamais lancee', highlight: true },
            { date: '2007-02-28', event: 'Assistance gravitationnelle Jupiter' },
            { date: '2015-07-14', event: 'Survol historique de Pluton', highlight: true },
            { date: '2019-01-01', event: 'Survol d\'Arrokoth (2014 MU69)', highlight: true },
            { date: '2025+', event: 'Exploration ceinture de Kuiper en cours' },
        ],
        characteristics: {
            masse: '478 kg',
            puissance: 'RTG 240W',
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
        agency: 'NASA/ESA/ASI',
        type: 'Orbiteur + Atterrisseur',
        launchDate: '1997-10-15',
        endControl: '2017-09-15',
        status: 'Mission terminee - Grand Finale',
        summary: 'L\'une des missions les plus ambitieuses de l\'histoire spatiale. Cassini a orbite Saturne pendant 13 ans, revelant ses anneaux, ses lunes et ses tempetes. L\'atterrisseur Huygens s\'est pose sur Titan, decouvrant des lacs de methane et une atmosphere epaisse. La mission s\'est terminee par une plongee deliberee dans Saturne.',
        timeline: [
            { date: '1997-10-15', event: 'Lancement depuis Cap Canaveral', highlight: true },
            { date: '1998-04-26', event: 'Premier survol de Venus' },
            { date: '2004-07-01', event: 'Insertion en orbite de Saturne', highlight: true },
            { date: '2005-01-14', event: 'Atterrissage de Huygens sur Titan', highlight: true },
            { date: '2008-07-31', event: 'Decouverte de lacs sur Titan' },
            { date: '2017-09-15', event: 'Grand Finale - Plongee dans Saturne' },
        ],
        characteristics: {
            masse: '5 712 kg',
            puissance: 'RTG 885W',
            duree: '20 ans',
            orbites: '294 autour de Saturne',
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
        summary: 'Mission pour percer les secrets de Jupiter. Juno etudie l\'interieur, l\'atmosphere et la magnetosphere de la geante gazeuse. Ses orbites polaires plongent a 4 200 km des nuages, revelant des cyclones geants aux poles et une structure interne surprenante. Premiere sonde a energie solaire aussi loin du Soleil.',
        timeline: [
            { date: '2011-08-05', event: 'Lancement depuis Cap Canaveral', highlight: true },
            { date: '2013-10-09', event: 'Assistance gravitationnelle Terre' },
            { date: '2016-07-04', event: 'Insertion en orbite de Jupiter', highlight: true },
            { date: '2017-07-11', event: 'Survol de la Grande Tache Rouge' },
            { date: '2021-06-07', event: 'Survol rapproche de Ganymede' },
            { date: '2025+', event: 'Mission etendue - survols des lunes' },
        ],
        characteristics: {
            masse: '3 625 kg',
            puissance: 'Solaire 490W',
            orbites: '50+ completees',
            altitude: '4 200 km minimum',
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
        agency: 'NASA/JPL',
        type: 'Rover martien',
        launchDate: '2011-11-26',
        endControl: null,
        status: 'Active - Cratere Gale, Mars',
        summary: 'Laboratoire scientifique mobile de la taille d\'une voiture. Curiosity a prouve que Mars possedait autrefois les conditions necessaires a la vie. Son atterrissage spectaculaire par "sky crane" a ouvert une nouvelle ere d\'exploration martienne. Il gravit actuellement le Mont Sharp.',
        timeline: [
            { date: '2011-11-26', event: 'Lancement depuis Cap Canaveral', highlight: true },
            { date: '2012-08-06', event: 'Atterrissage "7 minutes de terreur"', highlight: true },
            { date: '2013-03-12', event: 'Decouverte: Mars habitable autrefois' },
            { date: '2014-09-11', event: 'Arrivee au Mont Sharp' },
            { date: '2019-06-23', event: 'Detection de methane atmospherique' },
            { date: '2024', event: '30+ km parcourus, toujours actif' },
        ],
        characteristics: {
            masse: '899 kg',
            puissance: 'RTG 110W',
            distance: '30+ km',
            instruments: '17 cameras',
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
        agency: 'NASA/JPL',
        type: 'Rover martien',
        launchDate: '2020-07-30',
        endControl: null,
        status: 'Active - Cratere Jezero, Mars',
        summary: 'Mission d\'astrobiologie a la recherche de traces de vie ancienne. Perseverance explore un ancien delta de riviere et collecte des echantillons pour un futur retour sur Terre. Elle est accompagnee d\'Ingenuity, premier helicoptere extraterrestre, qui a revolutionne l\'exploration aerienne.',
        timeline: [
            { date: '2020-07-30', event: 'Lancement pendant la fenetre Mars', highlight: true },
            { date: '2021-02-18', event: 'Atterrissage dans le cratere Jezero', highlight: true },
            { date: '2021-04-19', event: 'Premier vol d\'Ingenuity', highlight: true },
            { date: '2022-09-01', event: 'Debut collecte echantillons' },
            { date: '2024-01-18', event: 'Fin de mission Ingenuity (72 vols)' },
            { date: '2030s', event: 'Retour echantillons prevu (MSR)' },
        ],
        characteristics: {
            masse: '1 025 kg',
            puissance: 'RTG 110W',
            helicoptere: 'Ingenuity 1.8kg',
            echantillons: '43 tubes prevus',
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
        summary: 'Un petit pas pour l\'homme, un bond de geant pour l\'humanite. Apollo 11 a realise le reve millenaire de marcher sur la Lune. Neil Armstrong et Buzz Aldrin ont passe 2h30 sur le sol lunaire pendant que Michael Collins orbitait au-dessus. Cette mission a change a jamais notre vision de l\'humanite.',
        timeline: [
            { date: '1969-07-16', event: 'Decollage Saturn V - Kennedy Space Center', highlight: true },
            { date: '1969-07-19', event: 'Insertion en orbite lunaire' },
            { date: '1969-07-20', event: '"L\'Aigle a atterri" - Mer de la Tranquillite', highlight: true },
            { date: '1969-07-20', event: 'Premiers pas d\'Armstrong sur la Lune', highlight: true },
            { date: '1969-07-21', event: 'Decollage lunaire et rendez-vous' },
            { date: '1969-07-24', event: 'Amerrissage dans le Pacifique' },
        ],
        characteristics: {
            equipage: 'Armstrong, Aldrin, Collins',
            duree: '8 jours 3h 18min',
            temps_EVA: '2h 31min',
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
        summary: 'Premiere sonde a orbiter une comete et a y deposer un atterrisseur. Rosetta a accompagne la comete 67P/Churyumov-Gerasimenko pendant deux ans, revelant sa composition et son activite. Philae s\'est pose dans des conditions difficiles mais a transmis des donnees precieuses sur ce vestige du systeme solaire primitif.',
        timeline: [
            { date: '2004-03-02', event: 'Lancement depuis Kourou', highlight: true },
            { date: '2007-02-25', event: 'Survol de Mars' },
            { date: '2011-06-08', event: 'Entree en hibernation profonde' },
            { date: '2014-01-20', event: 'Reveil apres 31 mois de sommeil' },
            { date: '2014-08-06', event: 'Arrivee a la comete 67P', highlight: true },
            { date: '2014-11-12', event: 'Atterrissage de Philae', highlight: true },
            { date: '2016-09-30', event: 'Rosetta se pose sur la comete' },
        ],
        characteristics: {
            masse: '3 000 kg',
            cible: 'Comete 67P',
            atterrisseur: 'Philae 100kg',
            duree: '12 ans voyage',
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
        summary: 'Mission pour "toucher le Soleil". Parker Solar Probe est l\'objet le plus rapide jamais construit par l\'humanite et celui qui s\'approche le plus de notre etoile. Protegee par un bouclier thermique revolutionnaire, elle plonge dans la couronne solaire pour comprendre les mysteres du vent solaire et des eruptions.',
        timeline: [
            { date: '2018-08-12', event: 'Lancement vers le Soleil', highlight: true },
            { date: '2018-11-05', event: 'Premier perihelie a 24 millions km' },
            { date: '2021-04-28', event: 'Premiere traversee de la couronne solaire', highlight: true },
            { date: '2023-09-27', event: 'Survol Venus n°6' },
            { date: '2024-12-24', event: 'Record: 6.16 millions km du Soleil', highlight: true },
            { date: '2025', event: 'Vitesse max: 692 000 km/h' },
        ],
        characteristics: {
            masse: '685 kg',
            vitesse_max: '692 000 km/h',
            perihelie: '6.16 millions km',
            bouclier: '1 400°C resist.',
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
        summary: 'Le plus grand et le plus puissant telescope spatial jamais construit. Webb observe l\'univers en infrarouge, perçant les nuages de poussiere cosmique pour voir la naissance des etoiles et les premieres galaxies formees apres le Big Bang. Stationne au point de Lagrange L2, il revolutionne notre comprehension du cosmos.',
        timeline: [
            { date: '2021-12-25', event: 'Lancement Ariane 5 - Cadeau de Noel', highlight: true },
            { date: '2022-01-08', event: 'Deploiement miroir primaire complete' },
            { date: '2022-01-24', event: 'Arrivee au point L2', highlight: true },
            { date: '2022-07-12', event: 'Premieres images officielles', highlight: true },
            { date: '2023-09-12', event: 'Detection CO2 sur exoplanete' },
            { date: '2024', event: 'Observation galaxies a z>14' },
        ],
        characteristics: {
            masse: '6 500 kg',
            miroir: '6.5m hexagonal',
            position: 'Point L2 (1.5M km)',
            temperature: '-233°C instruments',
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
