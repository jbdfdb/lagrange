/**
 * Configuration centralisee pour le Systeme Solaire
 * Toutes les constantes et donnees planetaires
 */

// ========================================
// Echelles et Physique
// ========================================
export const AU_VISUAL = 200; // 1 Unite Astronomique = 200 unites Three.js

export const PHYSICS = {
    GRAVITY_STRENGTH: 0.001,
    MAX_ASTEROID_VELOCITY: 10,
    SUN_GRAVITY_MULTIPLIER: 50,
    PLANET_GRAVITY_MULTIPLIER: 0.1,
    MIN_DISTANCE_THRESHOLD: 5,
    ASTEROID_BOUNDARY: 20000,
    ASTEROID_DESTRUCTION_RADIUS: 15,
};

// ========================================
// Camera
// ========================================
export const CAMERA = {
    FOV: 60,
    NEAR: 1,
    FAR: 100000,
    INITIAL_POSITION: { x: 8000, y: 6000, z: 8000 },
    MIN_DISTANCE: 50,
    MAX_DISTANCE: 20000,
    DAMPING_FACTOR: 0.05,
};

// ========================================
// Rendu
// ========================================
export const RENDERER = {
    ANTIALIAS: true,
    ALPHA: true,
    TONE_MAPPING_EXPOSURE: 1.2,
};

// ========================================
// Etoiles
// ========================================
export const STARS = {
    COUNT: 3000,
    SPREAD_XZ: 100000,
    SPREAD_Y: 30000,
    SIZE: 30,
    OPACITY: 0.9,
};

// ========================================
// Asteroides
// ========================================
export const ASTEROIDS = {
    SPAWN_INTERVAL: 3000,
    INITIAL_SPAWN_COUNT: 2,
    MIN_DISTANCE_MULTIPLIER: 6,
    MAX_DISTANCE_MULTIPLIER: 10,
    Y_SPREAD: 100,
    MIN_SIZE: 0.5,
    MAX_SIZE: 2,
    MIN_SPEED: 1,
    MAX_SPEED: 3,
    TRAIL_MAX_POINTS_MULTIPLIER: 60, // points per second
};

// ========================================
// Trainees
// ========================================
export const TRAILS = {
    DEFAULT_DURATION: 10,
    DURATIONS: [5, 10, 20, 30, 50, 100],
    OPACITY: 0.6,
};

// ========================================
// Geometrie
// ========================================
export const GEOMETRY = {
    SPHERE_SEGMENTS: 64,
    ORBIT_SEGMENTS: 256,
    ASTEROID_SEGMENTS: 12,
};

// ========================================
// Couleurs
// ========================================
export const COLORS = {
    // UI
    PRIMARY: 0x00ffff,
    SECONDARY: 0xff6600,
    BACKGROUND: 0x000011,
    TEXT: 0xffffff,
    SUN_LABEL: 0xffff00,

    // Scene
    AMBIENT_LIGHT: 0x112244,
    SUN_LIGHT: 0xffee88,

    // Orbites
    ORBIT: 0x444444,

    // Etoiles
    STAR_WHITE: [1, 1, 1],
    STAR_WARM: [1, 0.8, 0.6],
    STAR_COOL: [0.8, 0.8, 1],
    STAR_RED: [1, 0.6, 0.4],

    // Lagrange
    LAGRANGE_X: 0xff0000,
    LAGRANGE_Y: 0x00ff00,
    LAGRANGE_Z: 0x0000ff,
};

// ========================================
// Soleil
// ========================================
export const SUN = {
    RADIUS: 30,
    MASS: 1000,
    ROTATION_SPEED: 0.008,
    SHADER_COLORS: {
        COLOR1: 0xff2200,
        COLOR2: 0xff8800,
        COLOR3: 0xffff44,
    },
};

// ========================================
// Planetes
// ========================================
export const PLANETS = [
    {
        name: 'Mercure',
        distance: 0.39,
        radius: 3,
        color: 0x8c7853,
        rotSpeed: 0.004,
        period: 88,
        mass: 0.055,
        info: {
            diameter: '4 879 km',
            distanceAU: '0.39 UA',
            temperature: '-180 a 430 C',
            moons: 0,
        },
    },
    {
        name: 'Venus',
        distance: 0.72,
        radius: 5,
        color: 0xffc649,
        rotSpeed: -0.002,
        period: 225,
        mass: 0.815,
        info: {
            diameter: '12 104 km',
            distanceAU: '0.72 UA',
            temperature: '462 C',
            moons: 0,
        },
    },
    {
        name: 'Terre',
        distance: 1.0,
        radius: 6,
        color: 0x6b93d6,
        rotSpeed: 0.02,
        period: 365,
        mass: 1.0,
        info: {
            diameter: '12 742 km',
            distanceAU: '1.00 UA',
            temperature: '-89 a 57 C',
            moons: 1,
        },
    },
    {
        name: 'Mars',
        distance: 1.52,
        radius: 4,
        color: 0xcd5c5c,
        rotSpeed: 0.018,
        period: 687,
        mass: 0.107,
        info: {
            diameter: '6 779 km',
            distanceAU: '1.52 UA',
            temperature: '-87 a -5 C',
            moons: 2,
        },
    },
    {
        name: 'Jupiter',
        distance: 5.2,
        radius: 25,
        color: 0xd8ca9d,
        rotSpeed: 0.045,
        period: 4333,
        mass: 317.8,
        info: {
            diameter: '139 820 km',
            distanceAU: '5.20 UA',
            temperature: '-145 C',
            moons: 95,
        },
    },
    {
        name: 'Saturne',
        distance: 9.5,
        radius: 22,
        color: 0xfad5a5,
        rotSpeed: 0.038,
        period: 10759,
        mass: 95.2,
        hasRings: true,
        info: {
            diameter: '116 460 km',
            distanceAU: '9.54 UA',
            temperature: '-178 C',
            moons: 146,
        },
    },
    {
        name: 'Uranus',
        distance: 19.2,
        radius: 15,
        color: 0x4fd0e4,
        rotSpeed: 0.025,
        period: 30689,
        mass: 14.5,
        info: {
            diameter: '50 724 km',
            distanceAU: '19.22 UA',
            temperature: '-224 C',
            moons: 28,
        },
    },
    {
        name: 'Neptune',
        distance: 30.1,
        radius: 14,
        color: 0x4b70dd,
        rotSpeed: 0.022,
        period: 60182,
        mass: 17.1,
        info: {
            diameter: '49 244 km',
            distanceAU: '30.07 UA',
            temperature: '-218 C',
            moons: 16,
        },
    },
];

// ========================================
// Voyage Mode
// ========================================
export const VOYAGE = {
    DEFAULT_SPEED: 1.0,
    MIN_SPEED: 0.1,
    MAX_SPEED: 10.0,
    APPROACH_DISTANCE: 100,
    TRANSITION_DURATION: 3000, // ms
    AUTO_TOUR_DELAY: 5000, // ms entre chaque planete
};
