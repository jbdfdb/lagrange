import * as THREE from 'https://esm.sh/three@0.153.0';
import { OrbitControls } from 'https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls';

console.log('🚀 Système Solaire PREMIUM - Référentiels RÉELS !');

// Scène
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

// Caméra
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
camera.position.set(8000, 6000, 8000);

// Renderer
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Contrôles
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);
controls.minDistance = 50;
controls.maxDistance = 20000;

// Lumières
let sunLight = new THREE.PointLight(0xFFEE88, 2, 50000);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x112244, 0.3));

// ÉCHELLES
const AU_VISUAL = 200;

// ☀️ SOLEIL avec shader
function createSun() {
    let sunGeo = new THREE.SphereGeometry(30, 64, 64);

    let sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0xFF2200) },
            color2: { value: new THREE.Color(0xFF8800) },
            color3: { value: new THREE.Color(0xFFFF44) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            varying vec2 vUv;
            
            float noise(vec2 p) {
                return sin(p.x * 8.0 + time * 2.0) * sin(p.y * 6.0 + time * 1.5) * 0.5 + 0.5;
            }
            
            void main() {
                vec2 uv = vUv;
                float dist = distance(uv, vec2(0.5));
                
                float gradient = 1.0 - dist * 2.0;
                float noiseVal = noise(uv * 3.0 + time * 0.1);
                
                float eruption = sin(uv.x * 15.0 + time * 3.0) * sin(uv.y * 12.0 + time * 2.5);
                eruption *= (1.0 - gradient) * 0.4;
                
                vec3 color = mix(color1, color2, gradient);
                color = mix(color, color3, gradient * gradient);
                color += eruption * color3;
                
                float intensity = 0.7 + noiseVal * 0.5 + eruption * 0.3;
                
                gl_FragColor = vec4(color * intensity, 1.0);
            }
        `
    });

    let sun = new THREE.Mesh(sunGeo, sunMaterial);
    sun.userData = { name: 'Soleil', mass: 1000 };
    scene.add(sun);
    return sun;
}

// 🌍 TERRE DE NUIT
function createEarthNight() {
    let canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    let ctx = canvas.getContext('2d');

    let gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    gradient.addColorStop(0, '#003366');
    gradient.addColorStop(1, '#001122');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#223344';
    ctx.fillRect(120, 80, 220, 180);
    ctx.fillRect(180, 260, 140, 220);
    ctx.fillRect(460, 70, 90, 120);
    ctx.fillRect(440, 140, 110, 240);
    ctx.fillRect(550, 50, 300, 200);
    ctx.fillRect(720, 320, 140, 100);

    for (let i = 0; i < 1500; i++) {
        let x = Math.random() * 1024;
        let y = Math.random() * 512;

        let isLand = (x > 120 && x < 340 && y > 80 && y < 260) ||
            (x > 180 && x < 320 && y > 260 && y < 480) ||
            (x > 460 && x < 550 && y > 70 && y < 190) ||
            (x > 440 && x < 550 && y > 140 && y < 380) ||
            (x > 550 && x < 850 && y > 50 && y < 250) ||
            (x > 720 && x < 860 && y > 320 && y < 420);

        if (isLand && Math.random() > 0.2) {
            let intensity = Math.random();
            ctx.fillStyle = intensity > 0.7 ? '#FFFF88' :
                intensity > 0.4 ? '#FFDD44' : '#FFAA22';
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 3 + 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    return new THREE.CanvasTexture(canvas);
}

// PLANÈTES
let planets = [
    { name: 'Mercure', distance: 0.39 * AU_VISUAL, radius: 3, color: 0x8C7853, rotSpeed: 0.004, period: 88, mass: 0.055 },
    { name: 'Vénus', distance: 0.72 * AU_VISUAL, radius: 5, color: 0xFFC649, rotSpeed: -0.002, period: 225, mass: 0.815 },
    { name: 'Terre', distance: 1.0 * AU_VISUAL, radius: 6, color: 0x6B93D6, rotSpeed: 0.02, period: 365, mass: 1.0 },
    { name: 'Mars', distance: 1.52 * AU_VISUAL, radius: 4, color: 0xCD5C5C, rotSpeed: 0.018, period: 687, mass: 0.107 },
    { name: 'Jupiter', distance: 5.2 * AU_VISUAL, radius: 25, color: 0xD8CA9D, rotSpeed: 0.045, period: 4333, mass: 317.8 },
    { name: 'Saturne', distance: 9.5 * AU_VISUAL, radius: 22, color: 0xFAD5A5, rotSpeed: 0.038, period: 10759, mass: 95.2 },
    { name: 'Uranus', distance: 19.2 * AU_VISUAL, radius: 15, color: 0x4FD0E4, rotSpeed: 0.025, period: 30689, mass: 14.5 },
    { name: 'Neptune', distance: 30.1 * AU_VISUAL, radius: 14, color: 0x4B70DD, rotSpeed: 0.022, period: 60182, mass: 17.1 }
];

let planetObjects = [];
let planetLabels = [];
let lagrangePoints = [];

// 🎯 SYSTÈME DE RÉFÉRENTIEL SIMPLIFIÉ
class ReferentialSystem {
    constructor() {
        this.centerIndex = -1;
        this.time = 0;
    }

    setCenter(centerIndex) {
        this.centerIndex = centerIndex;
        console.log(`🎯 NOUVEAU RÉFÉRENTIEL: ${centerIndex === -1 ? 'Soleil' : planets[centerIndex].name}`);
    }

    update(deltaTime) {
        this.time += deltaTime * 3;

        // Calcul positions héliocentriques
        let helioPositions = [];
        helioPositions[0] = new THREE.Vector3(0, 0, 0); // Soleil

        for (let i = 0; i < planets.length; i++) {
            let p = planets[i];
            let keplerVel = 1 / Math.sqrt(p.distance / AU_VISUAL);
            let angle = this.time * keplerVel * 0.5;

            helioPositions[i + 1] = new THREE.Vector3(
                Math.cos(angle) * p.distance,
                0,
                Math.sin(angle) * p.distance
            );
        }

        // Position du centre de référence
        let centerPos = this.centerIndex === -1 ?
            new THREE.Vector3(0, 0, 0) :
            helioPositions[this.centerIndex + 1].clone();

        // Repositionner tout le monde
        sun.position.copy(helioPositions[0].sub(centerPos));
        sunLight.position.copy(sun.position);

        for (let i = 0; i < planetObjects.length; i++) {
            let newPos = helioPositions[i + 1].clone().sub(centerPos);
            planetObjects[i].position.copy(newPos);
        }

        // Mettre à jour points de Lagrange
        lagrangePoints.forEach(point => {
            let planetName = point.userData.name.split('-')[1];
            let planetIndex = planets.findIndex(p => p.name === planetName);

            if (planetIndex >= 0) {
                let planetPos = planetObjects[planetIndex].position.clone();
                let angle = Math.atan2(planetPos.z, planetPos.x);

                if (point.userData.name.includes('L4')) angle += Math.PI / 3;
                if (point.userData.name.includes('L5')) angle -= Math.PI / 3;

                let distance = planets[planetIndex].distance;
                point.position.set(
                    Math.cos(angle) * distance - centerPos.x,
                    0,
                    Math.sin(angle) * distance - centerPos.z
                );
            }
        });
    }
}

let referentialSystem = new ReferentialSystem();
let sun = createSun();

// POINTS DE LAGRANGE
function createLagrangePoint(position, name) {
    let group = new THREE.Group();

    let xGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(15, 0, 0)
    ]);
    let xLine = new THREE.Line(xGeo, new THREE.LineBasicMaterial({ color: 0xFF0000 }));
    group.add(xLine);

    let yGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -15, 0),
        new THREE.Vector3(0, 15, 0)
    ]);
    let yLine = new THREE.Line(yGeo, new THREE.LineBasicMaterial({ color: 0x00FF00 }));
    group.add(yLine);

    let zGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -15),
        new THREE.Vector3(0, 0, 15)
    ]);
    let zLine = new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: 0x0000FF }));
    group.add(zLine);

    group.position.copy(position);
    group.userData = { name: name, isLagrange: true };
    scene.add(group);
    lagrangePoints.push(group);

    return group;
}

// Création des planètes
for (let i = 0; i < planets.length; i++) {
    let p = planets[i];

    let geo = new THREE.SphereGeometry(p.radius, 64, 64);
    let mat = new THREE.MeshLambertMaterial({ color: p.color });

    if (p.name === 'Terre') {
        let earthTexture = createEarthNight();
        mat = new THREE.MeshLambertMaterial({
            map: earthTexture,
            emissive: 0x001122,
            emissiveIntensity: 0.2
        });
    }

    let planet = new THREE.Mesh(geo, mat);
    planet.position.set(p.distance, 0, 0);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.userData = { name: p.name, planetIndex: i, mass: p.mass };
    scene.add(planet);
    planetObjects.push(planet);

    // Points de Lagrange pour planètes externes
    if (i >= 2) {
        let l4Pos = new THREE.Vector3(
            Math.cos(Math.PI / 3) * p.distance,
            0,
            Math.sin(Math.PI / 3) * p.distance
        );
        let l5Pos = new THREE.Vector3(
            Math.cos(-Math.PI / 3) * p.distance,
            0,
            Math.sin(-Math.PI / 3) * p.distance
        );

        createLagrangePoint(l4Pos, `L4-${p.name}`);
        createLagrangePoint(l5Pos, `L5-${p.name}`);
    }

    // ORBITES FIXES
    let orbitPoints = [];
    for (let j = 0; j <= 256; j++) {
        let angle = (j / 256) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
            Math.cos(angle) * p.distance,
            0,
            Math.sin(angle) * p.distance
        ));
    }
    let orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    let orbitMat = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3
    });
    let orbitLine = new THREE.Line(orbitGeo, orbitMat);
    scene.add(orbitLine);

    // Labels épurés
    let labelDiv = document.createElement('div');
    labelDiv.textContent = p.name;
    labelDiv.style.position = 'absolute';
    labelDiv.style.color = '#FFFFFF';
    labelDiv.style.fontFamily = 'Orbitron, monospace';
    labelDiv.style.fontSize = '11px';
    labelDiv.style.fontWeight = '600';
    labelDiv.style.pointerEvents = 'none';
    labelDiv.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
    document.body.appendChild(labelDiv);

    planetLabels.push({ div: labelDiv, object: planet });
}

// Label Soleil
let sunLabelDiv = document.createElement('div');
sunLabelDiv.textContent = 'Soleil';
sunLabelDiv.style.position = 'absolute';
sunLabelDiv.style.color = '#FFFF00';
sunLabelDiv.style.fontFamily = 'Orbitron, monospace';
sunLabelDiv.style.fontSize = '12px';
sunLabelDiv.style.fontWeight = 'bold';
sunLabelDiv.style.pointerEvents = 'none';
sunLabelDiv.style.textShadow = '0 0 15px rgba(255,255,0,0.9)';
document.body.appendChild(sunLabelDiv);
planetLabels.push({ div: sunLabelDiv, object: sun });

// ANNEAUX DE SATURNE
for (let i = 0; i < planetObjects.length; i++) {
    if (planets[i].name === 'Saturne') {
        let saturnPlanet = planetObjects[i];
        let ringGeo = new THREE.RingGeometry(planets[i].radius + 5, planets[i].radius + 15, 64);
        let ringMat = new THREE.MeshLambertMaterial({
            color: 0xCCAAAA,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        let rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = Math.PI / 6;
        saturnPlanet.add(rings);
        break;
    }
}

// ASTÉROÏDES 
let dynamicAsteroids = [];
let trailDuration = 10;
let trailPoints = new Map();

class AsteroidTrail {
    constructor(asteroid) {
        this.asteroid = asteroid;
        this.points = [];
        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.6
        });
        this.line = new THREE.Line(this.geometry, this.material);
        scene.add(this.line);
    }

    update() {
        this.points.push(this.asteroid.position.clone());

        let maxPoints = trailDuration * 60;
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

function addDynamicAsteroid() {
    let distance = 6 * AU_VISUAL + Math.random() * 4 * AU_VISUAL;
    let angle = Math.random() * Math.PI * 2;
    let x = Math.cos(angle) * distance;
    let z = Math.sin(angle) * distance;
    let y = (Math.random() - 0.5) * 100;

    let size = Math.random() * 1.5 + 0.5;
    let mat = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        emissive: 0x222222
    });
    let geo = new THREE.SphereGeometry(size, 12, 12);
    let asteroid = new THREE.Mesh(geo, mat);
    asteroid.position.set(x, y, z);

    let speed = Math.random() * 2 + 1;
    let dirToCenter = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), asteroid.position).normalize();

    asteroid.userData = {
        velocity: dirToCenter.multiplyScalar(speed),
        isAsteroid: true,
        mass: size * size * 0.01
    };

    scene.add(asteroid);
    dynamicAsteroids.push(asteroid);

    trailPoints.set(asteroid, new AsteroidTrail(asteroid));
}

// GRAVITÉ SIMPLE MAIS EFFICACE
function applyGravity(asteroid) {
    let totalForce = new THREE.Vector3(0, 0, 0);

    // Force du Soleil
    let dirSun = new THREE.Vector3().subVectors(sun.position, asteroid.position);
    let distSun = dirSun.length();
    if (distSun > 5) {
        let forceSun = dirSun.normalize().multiplyScalar(50 / (distSun * distSun));
        totalForce.add(forceSun);
    }

    // Forces des planètes
    planetObjects.forEach(planet => {
        let dir = new THREE.Vector3().subVectors(planet.position, asteroid.position);
        let dist = dir.length();
        if (dist > 5) {
            let force = dir.normalize().multiplyScalar(planet.userData.mass * 0.1 / (dist * dist));
            totalForce.add(force);
        }
    });

    return totalForce;
}

// INTERFACE UTILISATEUR
let referentialDiv = document.createElement('div');
referentialDiv.style.position = 'absolute';
referentialDiv.style.top = '120px';
referentialDiv.style.left = '20px';
referentialDiv.style.padding = '15px';
referentialDiv.style.display = 'flex';
referentialDiv.style.flexDirection = 'column';
referentialDiv.style.gap = '8px';
referentialDiv.style.zIndex = '1000';
referentialDiv.style.minWidth = '180px';
referentialDiv.style.background = 'rgba(0,0,0,0.85)';
referentialDiv.style.border = '1px solid #00FFFF';
referentialDiv.style.borderRadius = '8px';
document.body.appendChild(referentialDiv);

let refTitle = document.createElement('div');
refTitle.textContent = '🎯 RÉFÉRENTIEL';
refTitle.style.color = '#00FFFF';
refTitle.style.fontFamily = 'Orbitron, monospace';
refTitle.style.fontSize = '13px';
refTitle.style.fontWeight = 'bold';
refTitle.style.textAlign = 'center';
refTitle.style.marginBottom = '5px';
refTitle.style.textShadow = '0 0 10px #00FFFF';
referentialDiv.appendChild(refTitle);

let activeRefButton = null;

function changeReferential(centerIndex, buttonElement) {
    if (activeRefButton) {
        activeRefButton.style.background = 'linear-gradient(45deg, #001122, #003366)';
        activeRefButton.style.color = '#00FFFF';
        activeRefButton.style.borderColor = '#00FFFF';
        activeRefButton.style.boxShadow = 'none';
    }

    buttonElement.style.background = 'linear-gradient(45deg, #AA3300, #FF6600)';
    buttonElement.style.color = '#FFFFFF';
    buttonElement.style.borderColor = '#FF6600';
    buttonElement.style.boxShadow = '0 0 20px rgba(255,102,0,0.7)';
    activeRefButton = buttonElement;

    referentialSystem.setCenter(centerIndex);

    let targetDistance = centerIndex === -1 ? 500 : (centerIndex < 4 ? 150 : 300);
    controls.target.set(0, 0, 0);

    let currentDir = camera.position.clone().normalize();
    camera.position.copy(currentDir.multiplyScalar(targetDistance));
}

// Bouton Soleil
let sunBtn = document.createElement('button');
sunBtn.textContent = '☀️ Soleil';
sunBtn.style.width = '100%';
sunBtn.style.padding = '8px';
sunBtn.style.fontSize = '11px';
sunBtn.style.fontFamily = 'Orbitron, monospace';
sunBtn.style.background = 'linear-gradient(45deg, #001122, #003366)';
sunBtn.style.color = '#00FFFF';
sunBtn.style.border = '1px solid #00FFFF';
sunBtn.style.borderRadius = '6px';
sunBtn.style.cursor = 'pointer';
sunBtn.onclick = () => changeReferential(-1, sunBtn);
referentialDiv.appendChild(sunBtn);

// Boutons planètes
planets.forEach((p, i) => {
    let btn = document.createElement('button');
    btn.textContent = p.name;
    btn.style.width = '100%';
    btn.style.padding = '6px';
    btn.style.fontSize = '10px';
    btn.style.fontFamily = 'Orbitron, monospace';
    btn.style.background = 'linear-gradient(45deg, #001122, #003366)';
    btn.style.color = '#00FFFF';
    btn.style.border = '1px solid #00FFFF';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => changeReferential(i, btn);
    referentialDiv.appendChild(btn);
});

// Panel traînées
let trailDiv = document.createElement('div');
trailDiv.style.position = 'absolute';
trailDiv.style.top = '120px';
trailDiv.style.right = '20px';
trailDiv.style.padding = '15px';
trailDiv.style.zIndex = '1000';
trailDiv.style.minWidth = '160px';
trailDiv.style.background = 'rgba(0,0,0,0.85)';
trailDiv.style.border = '1px solid #00FFFF';
trailDiv.style.borderRadius = '8px';
document.body.appendChild(trailDiv);

let trailTitle = document.createElement('div');
trailTitle.textContent = '⭐ TRAÎNÉES';
trailTitle.style.color = '#00FFFF';
trailTitle.style.fontFamily = 'Orbitron, monospace';
trailTitle.style.fontSize = '13px';
trailTitle.style.fontWeight = 'bold';
trailTitle.style.textAlign = 'center';
trailTitle.style.marginBottom = '10px';
trailTitle.style.textShadow = '0 0 10px #00FFFF';
trailDiv.appendChild(trailTitle);

let trailDurations = [5, 10, 20, 30, 50, 100];
trailDurations.forEach(duration => {
    let btn = document.createElement('button');
    btn.textContent = `${duration}s`;
    btn.style.width = '48%';
    btn.style.padding = '4px';
    btn.style.fontSize = '10px';
    btn.style.margin = '2px 1%';
    btn.style.display = 'inline-block';
    btn.style.fontFamily = 'Orbitron, monospace';
    btn.style.background = 'linear-gradient(45deg, #001122, #003366)';
    btn.style.color = '#00FFFF';
    btn.style.border = '1px solid #00FFFF';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
        trailDuration = duration;
        trailDiv.querySelectorAll('button').forEach(b => {
            b.style.background = 'linear-gradient(45deg, #001122, #003366)';
            b.style.color = '#00FFFF';
            b.style.boxShadow = 'none';
        });
        btn.style.background = 'linear-gradient(45deg, #AA3300, #FF6600)';
        btn.style.color = '#FFFFFF';
        btn.style.boxShadow = '0 0 20px rgba(255,102,0,0.7)';
    };
    if (duration === 10) {
        btn.style.background = 'linear-gradient(45deg, #AA3300, #FF6600)';
        btn.style.color = '#FFFFFF';
        btn.style.boxShadow = '0 0 20px rgba(255,102,0,0.7)';
    }
    trailDiv.appendChild(btn);
});

// Panel contrôles
let controlDiv = document.createElement('div');
controlDiv.style.position = 'absolute';
controlDiv.style.bottom = '20px';
controlDiv.style.left = '20px';
controlDiv.style.padding = '15px';
controlDiv.style.display = 'flex';
controlDiv.style.flexDirection = 'column';
controlDiv.style.gap = '10px';
controlDiv.style.zIndex = '1000';
controlDiv.style.background = 'rgba(0,0,0,0.85)';
controlDiv.style.border = '1px solid #00FFFF';
controlDiv.style.borderRadius = '8px';
document.body.appendChild(controlDiv);

let asteroidRainActive = false;
let asteroidRainInterval = null;

function startAsteroidRain() {
    if (asteroidRainActive) return;
    asteroidRainActive = true;

    for (let i = 0; i < 2; i++) {
        addDynamicAsteroid();
    }

    asteroidRainInterval = setInterval(() => {
        addDynamicAsteroid();
    }, 3000);
}

function stopAsteroidRain() {
    asteroidRainActive = false;
    if (asteroidRainInterval) clearInterval(asteroidRainInterval);
}

let rainBtn = document.createElement('button');
rainBtn.textContent = "☄️ Pluie d'astéroïdes";
rainBtn.style.fontSize = "12px";
rainBtn.style.padding = "8px 12px";
rainBtn.style.width = "180px";
rainBtn.style.fontFamily = 'Orbitron, monospace';
rainBtn.style.background = 'linear-gradient(45deg, #001122, #003366)';
rainBtn.style.color = '#00FFFF';
rainBtn.style.border = '1px solid #00FFFF';
rainBtn.style.borderRadius = '6px';
rainBtn.style.cursor = 'pointer';
rainBtn.onclick = () => {
    if (!asteroidRainActive) {
        startAsteroidRain();
        rainBtn.textContent = "⏹️ Arrêter pluie";
        rainBtn.style.background = 'linear-gradient(45deg, #AA3300, #FF6600)';
        rainBtn.style.color = '#FFFFFF';
        rainBtn.style.boxShadow = '0 0 20px rgba(255,102,0,0.7)';
    } else {
        stopAsteroidRain();
        rainBtn.textContent = "☄️ Pluie d'astéroïdes";
        rainBtn.style.background = 'linear-gradient(45deg, #001122, #003366)';
        rainBtn.style.color = '#00FFFF';
        rainBtn.style.boxShadow = 'none';
    }
};
controlDiv.appendChild(rainBtn);

let counterDiv = document.createElement('div');
counterDiv.textContent = 'Astéroïdes: 0';
counterDiv.style.color = '#00FFFF';
counterDiv.style.fontFamily = 'Orbitron, monospace';
counterDiv.style.fontSize = '11px';
counterDiv.style.textAlign = 'center';
counterDiv.style.padding = '4px';
counterDiv.style.background = 'rgba(0,0,0,0.5)';
counterDiv.style.borderRadius = '4px';
controlDiv.appendChild(counterDiv);

// ÉTOILES
let starGeo = new THREE.BufferGeometry();
let starVerts = [];
let starColors = [];
for (let i = 0; i < 3000; i++) {
    starVerts.push(
        (Math.random() - 0.5) * 100000,
        (Math.random() - 0.5) * 30000,
        (Math.random() - 0.5) * 100000
    );

    let colorType = Math.random();
    if (colorType < 0.3) starColors.push(1, 1, 1);
    else if (colorType < 0.6) starColors.push(1, 0.8, 0.6);
    else if (colorType < 0.8) starColors.push(0.8, 0.8, 1);
    else starColors.push(1, 0.6, 0.4);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
starGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
let starMat = new THREE.PointsMaterial({
    size: 30,
    opacity: 0.9,
    transparent: true,
    vertexColors: true
});
let stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Initialiser sur le Soleil
referentialSystem.setCenter(-1);
sunBtn.style.background = 'linear-gradient(45deg, #AA3300, #FF6600)';
sunBtn.style.color = '#FFFFFF';
sunBtn.style.boxShadow = '0 0 20px rgba(255,102,0,0.7)';
activeRefButton = sunBtn;

// ANIMATION PRINCIPALE
let time = 0;
let lastTime = 0;

function animate(currentTime) {
    requestAnimationFrame(animate);

    let deltaTime = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
    time += 0.005;

    // Soleil shader
    if (sun.material.uniforms) {
        sun.material.uniforms.time.value = time;
    }
    sun.rotation.y += 0.008;

    // Système de référentiel
    referentialSystem.update(deltaTime);

    // Rotation des planètes
    for (let i = 0; i < planetObjects.length; i++) {
        planetObjects[i].rotation.y += planets[i].rotSpeed;
    }

    // Astéroïdes
    for (let i = dynamicAsteroids.length - 1; i >= 0; i--) {
        let asteroid = dynamicAsteroids[i];

        let gravityForce = applyGravity(asteroid);
        asteroid.userData.velocity.add(gravityForce.multiplyScalar(0.001));

        if (asteroid.userData.velocity.length() > 10) {
            asteroid.userData.velocity.normalize().multiplyScalar(10);
        }

        asteroid.position.add(asteroid.userData.velocity.clone().multiplyScalar(0.1));

        if (trailPoints.has(asteroid)) {
            trailPoints.get(asteroid).update();
        }

        let distanceFromOrigin = asteroid.position.length();

        if (distanceFromOrigin < 15 || distanceFromOrigin > 20000) {
            scene.remove(asteroid);
            if (trailPoints.has(asteroid)) {
                trailPoints.get(asteroid).dispose();
                trailPoints.delete(asteroid);
            }
            dynamicAsteroids.splice(i, 1);
        }
    }

    counterDiv.textContent = `Astéroïdes: ${dynamicAsteroids.length}`;
    updateLabels();
    controls.update();
    renderer.render(scene, camera);
}

function updateLabels() {
    for (let label of planetLabels) {
        let pos = label.object.position.clone().project(camera);

        let screenX = (pos.x * 0.5 + 0.5) * window.innerWidth;
        let screenY = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        if (pos.z > 1) {
            label.div.style.display = 'none';
            continue;
        }

        label.div.style.display = 'block';
        label.div.style.left = screenX + 15 + 'px';
        label.div.style.top = screenY - 5 + 'px';
    }
}

console.log('🌟 Système Solaire PREMIUM démarré !');
animate(0);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});