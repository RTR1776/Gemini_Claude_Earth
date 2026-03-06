import * as THREE from 'three';

/**
 * Earth orbital environment: Moon, ISS, and satellite constellation.
 * All objects orbit in earth-local space (children of the scene, rotate with it).
 */

const SAT_CONFIGS = [
    { inc: 0.35, speed: 0.17, color: 0xffff00, alt: 1.03 },
    { inc: 0.80, speed: 0.14, color: 0xff8800, alt: 1.04 },
    { inc: 0.10, speed: 0.11, color: 0x00ffff, alt: 1.05 },
    { inc: 0.60, speed: 0.07, color: 0xff00ff, alt: 1.08 },
    { inc: 0.05, speed: 0.04, color: 0xffffff, alt: 1.15 },
    { inc: 0.98, speed: 0.15, color: 0x88ff88, alt: 1.03 },
    { inc: 0.45, speed: 0.12, color: 0xff4444, alt: 1.04 },
    { inc: 0.70, speed: 0.09, color: 0x4488ff, alt: 1.06 },
    { inc: 0.52, speed: 0.10, color: 0xffaa00, alt: 1.07 },
    { inc: 0.30, speed: 0.16, color: 0x00ff88, alt: 1.03 },
];

export class EarthOrbits {
    constructor(scene) {
        this.scene = scene;
        this.satellites = [];
        this.moonMesh = null;
        this.issMesh = null;
        this.issTrailPoints = [];
        this.issTrailLine = null;

        this.createMoon();
        this.createISS();
        this.createSatellites();
    }

    createMoon() {
        const texLoader = new THREE.TextureLoader();
        const moonGeo = new THREE.SphereGeometry(0.27, 64, 64);

        // Try to load moon texture, fall back to grey
        texLoader.load(`${import.meta.env.BASE_URL}textures/moon_8k.jpg`,
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                const mat = new THREE.MeshStandardMaterial({
                    map: tex,
                    roughness: 1.0,
                    metalness: 0.0
                });
                this.moonMesh = new THREE.Mesh(moonGeo, mat);
                this.scene.add(this.moonMesh);
            },
            undefined,
            () => {
                // Fallback: plain grey moon
                const mat = new THREE.MeshStandardMaterial({
                    color: 0x999999,
                    roughness: 1.0,
                    metalness: 0.0,
                    emissive: 0x111111
                });
                this.moonMesh = new THREE.Mesh(moonGeo, mat);
                this.scene.add(this.moonMesh);
            }
        );
    }

    createISS() {
        // ISS: bright green dot, 51.6° inclination, low orbit
        const geo = new THREE.SphereGeometry(0.012, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.issMesh = new THREE.Mesh(geo, mat);
        this.scene.add(this.issMesh);

        // ISS orbit trail
        const trailGeo = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(300 * 3); // 300 points
        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        const trailMat = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        this.issTrailLine = new THREE.Line(trailGeo, trailMat);
        this.scene.add(this.issTrailLine);
    }

    createSatellites() {
        let idCounter = 1;
        SAT_CONFIGS.forEach(cfg => {
            const group = new THREE.Group();

            const geo = new THREE.SphereGeometry(0.007, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ color: cfg.color });
            const mesh = new THREE.Mesh(geo, mat);
            group.add(mesh);

            // Invisible, larger hit sphere for easier raycasting
            const hitGeo = new THREE.SphereGeometry(0.025, 8, 8);
            const hitMat = new THREE.MeshBasicMaterial({ visible: false });
            const hitMesh = new THREE.Mesh(hitGeo, hitMat);
            group.add(hitMesh);


            // Make hitmesh interactable instead of visual mesh
            hitMesh.userData = {
                isInteractable: true,
                dataArray: [{
                    cat: 'ORBITAL ASSET',
                    title: `SATELLITE INT-${idCounter++}`,
                    detail: `Orbit Type: LEO | Inc: ${Math.round(cfg.inc * (180 / Math.PI))}°`,
                    deckard: 'More space junk cluttering up the void. Classic human behavior.'
                }]
            };

            this.scene.add(group);

            this.satellites.push({
                mesh: group,
                hitMesh: hitMesh,
                cfg: cfg,
                angle: Math.random() * Math.PI * 2
            });
        });
    }

    update(elapsed) {
        // Moon: orbits at ~3.5 units, slow period, tidally locked
        if (this.moonMesh) {
            const moonAngle = elapsed * 0.05;
            const moonDist = 3.5;
            const moonInc = 0.09; // ~5° inclination
            this.moonMesh.position.set(
                Math.cos(moonAngle) * moonDist,
                Math.sin(moonInc) * Math.sin(moonAngle) * moonDist,
                Math.sin(moonAngle) * moonDist
            );
            this.moonMesh.rotation.y = moonAngle;
        }

        // ISS: 51.6° inclination, altitude 1.06, fast orbit
        const issAngle = elapsed * 2.0;
        const issAlt = 1.06;
        const issInc = 51.6 * Math.PI / 180;
        const x = Math.cos(issAngle) * issAlt;
        const z = Math.sin(issAngle) * issAlt;
        const issY = z * Math.sin(issInc);
        const issZ = z * Math.cos(issInc);
        this.issMesh.position.set(x, issY, issZ);

        // Update ISS trail
        if (this.issTrailLine) {
            const positions = this.issTrailLine.geometry.attributes.position.array;
            const trailLen = 300;
            for (let i = 0; i < trailLen; i++) {
                const t = elapsed - (i * 0.02);
                const a = t * 2.0;
                const tx = Math.cos(a) * issAlt;
                const tz = Math.sin(a) * issAlt;
                positions[i * 3] = tx;
                positions[i * 3 + 1] = tz * Math.sin(issInc);
                positions[i * 3 + 2] = tz * Math.cos(issInc);
            }
            this.issTrailLine.geometry.attributes.position.needsUpdate = true;
        }

        // Satellites: various orbits with proper inclination and RAAN
        this.satellites.forEach(s => {
            const angle = s.startAngle + elapsed * s.speed;
            const sx = Math.cos(angle) * s.alt;
            const sz = Math.sin(angle) * s.alt;
            const cosI = Math.cos(s.inc);
            const sinI = Math.sin(s.inc);
            const cosR = Math.cos(s.raan);
            const sinR = Math.sin(s.raan);

            s.mesh.position.set(
                sx * cosR - sz * sinR * cosI,
                sz * sinI,
                sx * sinR + sz * cosR * cosI
            );
        });
    }
}
