/**
 * Systeme de Referentiel Dynamique
 * Permet de voir le systeme solaire depuis n'importe quelle planete
 */

import * as THREE from 'https://esm.sh/three@0.153.0';
import { AU_VISUAL, PLANETS } from './config.js';
import { sun, planetObjects, lagrangePoints } from './celestial.js';
import { sunLight } from './scene.js';

// ========================================
// Referential System Class
// ========================================
export class ReferentialSystem {
    constructor() {
        this.centerIndex = -1; // -1 = Soleil
        this.time = 0;
        this.helioPositions = [];
    }

    /**
     * Definit le centre du referentiel
     * @param {number} centerIndex - Index de la planete (-1 pour le Soleil)
     */
    setCenter(centerIndex) {
        this.centerIndex = centerIndex;
        const centerName = centerIndex === -1 ? 'Soleil' : PLANETS[centerIndex].name;
        console.log(`Referentiel: ${centerName}`);
    }

    /**
     * Retourne le nom du centre actuel
     */
    getCenterName() {
        return this.centerIndex === -1 ? 'Soleil' : PLANETS[this.centerIndex].name;
    }

    /**
     * Calcule les positions heliocentriques de tous les corps
     */
    calculateHeliocentricPositions() {
        this.helioPositions = [];
        this.helioPositions[0] = new THREE.Vector3(0, 0, 0); // Soleil

        for (let i = 0; i < PLANETS.length; i++) {
            const p = PLANETS[i];
            const distance = p.distance * AU_VISUAL;

            // Vitesse keplerienne: v = sqrt(GM/r)
            const keplerVel = 1 / Math.sqrt(p.distance);
            const angle = this.time * keplerVel * 0.5;

            this.helioPositions[i + 1] = new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );
        }

        return this.helioPositions;
    }

    /**
     * Met a jour les positions de tous les corps celestes
     * @param {number} deltaTime - Temps ecoule depuis la derniere frame
     * @param {number} speedMultiplier - Multiplicateur de vitesse
     */
    update(deltaTime, speedMultiplier = 1) {
        this.time += deltaTime * 3 * speedMultiplier;

        // Calcul des positions heliocentriques
        this.calculateHeliocentricPositions();

        // Position du centre de reference
        const centerPos =
            this.centerIndex === -1
                ? new THREE.Vector3(0, 0, 0)
                : this.helioPositions[this.centerIndex + 1].clone();

        // Repositionner le Soleil
        sun.position.copy(this.helioPositions[0].clone().sub(centerPos));
        sunLight.position.copy(sun.position);

        // Repositionner les planetes
        for (let i = 0; i < planetObjects.length; i++) {
            const newPos = this.helioPositions[i + 1].clone().sub(centerPos);
            planetObjects[i].position.copy(newPos);
        }

        // Mettre a jour les points de Lagrange
        this.updateLagrangePoints(centerPos);
    }

    /**
     * Met a jour les positions des points de Lagrange
     */
    updateLagrangePoints(centerPos) {
        lagrangePoints.forEach((point) => {
            const planetName = point.userData.name.split('-')[1];
            const planetIndex = PLANETS.findIndex((p) => p.name === planetName);

            if (planetIndex >= 0) {
                const planetPos = planetObjects[planetIndex].position.clone();
                let angle = Math.atan2(planetPos.z, planetPos.x);

                if (point.userData.name.includes('L4')) {
                    angle += Math.PI / 3;
                }
                if (point.userData.name.includes('L5')) {
                    angle -= Math.PI / 3;
                }

                const distance = PLANETS[planetIndex].distance * AU_VISUAL;
                point.position.set(
                    Math.cos(angle) * distance - centerPos.x,
                    0,
                    Math.sin(angle) * distance - centerPos.z
                );
            }
        });
    }

    /**
     * Retourne la position heliocentrique d'une planete
     * @param {number} planetIndex - Index de la planete
     */
    getPlanetHelioPosition(planetIndex) {
        if (this.helioPositions.length === 0) {
            this.calculateHeliocentricPositions();
        }
        return this.helioPositions[planetIndex + 1]?.clone() || new THREE.Vector3();
    }
}

// Instance unique
export const referentialSystem = new ReferentialSystem();
