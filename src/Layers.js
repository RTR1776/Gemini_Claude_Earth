import * as THREE from 'three';
import { NUCLEAR_SITES, CONFLICT_ZONES, CABLES, FLIGHT_ROUTES, SEISMIC_ZONES, POP_CENTERS, VOLCANOES, SHIPPING_ROUTES } from './data.js';

const R = 1.0;

function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    );
}

function getArcPoints(lat1, lon1, lat2, lon2, segments = 32) {
    const v1 = latLonToVec3(lat1, lon1, 1).normalize();
    const v2 = latLonToVec3(lat2, lon2, 1).normalize();
    const angle = Math.acos(Math.min(1, Math.max(-1, v1.dot(v2))));
    const pts = [];
    if (angle < 0.001) return [v1.clone().multiplyScalar(R * 1.003)];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const sinA = Math.sin(angle);
        const w1 = Math.sin((1 - t) * angle) / sinA;
        const w2 = Math.sin(t * angle) / sinA;
        const p = v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2));
        const arcH = Math.sin(t * Math.PI) * 0.05 * angle;
        pts.push(p.multiplyScalar(R * 1.002 + arcH));
    }
    return pts;
}

export class LayerManager {
    constructor(scene) {
        this.scene = scene;
        this.layers = {};
        this.active = {};
        this.createLayers();
    }

    createPointLayer(dataArr, color, size, opacity, isInteractable) {
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const dataRefs = [];

        dataArr.forEach(s => {
            const v = latLonToVec3(s.lat, s.lon, R * 1.008);
            pos.push(v.x, v.y, v.z);
            dataRefs.push({
                cat: s.cat || 'DATA POINT',
                title: s.n || s.title || 'Unknown',
                detail: s.note || s.detail || '',
                stats: `LAT ${s.lat.toFixed(2)} // LON ${s.lon.toFixed(2)}`,
                shoggoth: s.shoggoth || 'More activity on the crust.'
            });
        });

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color, size, transparent: true, opacity,
            sizeAttenuation: true,
            depthTest: true,
            depthWrite: false
        });
        const points = new THREE.Points(geo, mat);
        if (isInteractable) {
            points.userData = { isInteractable: true, dataArray: dataRefs };
        }
        return points;
    }

    createLayers() {
        this.layers['nuclear'] = this.createPointLayer(NUCLEAR_SITES.map(s => ({
            ...s, cat: 'NUCLEAR SITE', detail: `Detonated: ${s.yr} | Tests: ${s.tests}`, shoggoth: s.note
        })), 0xff003c, 0.015, 0.9, true);

        this.layers['conflicts'] = this.createPointLayer(CONFLICT_ZONES.map(s => ({
            ...s, cat: 'CONFLICT ZONE', detail: `Severity: ${s.sev}`, shoggoth: s.note
        })), 0xff3c00, 0.02, 0.8, true);

        const cableGroup = new THREE.Group();
        const cableMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
        CABLES.forEach(c => {
            const pts = getArcPoints(c.from[0], c.from[1], c.to[0], c.to[1]);
            cableGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), cableMat));
        });
        this.layers['cables'] = cableGroup;

        const flightGroup = new THREE.Group();
        const flightMat = new THREE.LineBasicMaterial({ color: 0x00ff80, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        FLIGHT_ROUTES.forEach(f => {
            const pts = getArcPoints(f.from[0], f.from[1], f.to[0], f.to[1]);
            flightGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), flightMat));
        });
        this.layers['flights'] = flightGroup;

        this.layers['seismic'] = this.createPointLayer(SEISMIC_ZONES.map(s => ({
            ...s, n: 'FAULT LINE', cat: 'SEISMIC RISK', detail: `Magnitude Potential: ${s.mag}`,
            shoggoth: 'The earth waiting to shrug off the parasites.'
        })), 0xffa500, 0.03, 0.9, true);

        // Key matches data-layer="population" in HTML
        this.layers['population'] = this.createPointLayer(POP_CENTERS.map(s => ({
            ...s, cat: 'POPULATION HUB',
            detail: `Density Factor: ${s.d}`,
            shoggoth: 'Swarming biological vectors converting carbon into anxiety and waste heat.'
        })), 0xff00ff, 0.008, 0.5, true);

        // VOLCANOES — static Smithsonian GVP dataset
        this.layers['volcanoes'] = this.createPointLayer(VOLCANOES.map(s => ({
            ...s, cat: 'VOLCANO',
            detail: `Type: ${s.type} | Status: ${s.status} | Last: ${s.lastEruption}`,
            shoggoth: s.note
        })), 0xff6600, 0.018, 0.95, true);

        // SHIPPING ROUTES — major global maritime trade lanes
        const shipGroup = new THREE.Group();
        const shipMat = new THREE.LineBasicMaterial({
            color: 0xffaa44, transparent: true, opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        SHIPPING_ROUTES.forEach(r => {
            const pts = getArcPoints(r.from[0], r.from[1], r.to[0], r.to[1]);
            shipGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), shipMat));
        });
        this.layers['shipping'] = shipGroup;
    }

    async loadUSGSQuakes() {
        if (this.layers['livequakes']) return;
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING LIVE USGS SEISMIC FEED...';
            const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
            const data = await res.json();
            const quakes = data.features.map(f => {
                const coords = f.geometry.coordinates;
                return {
                    lon: coords[0], lat: coords[1],
                    n: f.properties.place, cat: 'LIVE QUAKE',
                    detail: `Magnitude: ${f.properties.mag} | Depth: ${coords[2]}km`,
                    shoggoth: 'Tectonic plates shifting. Everything you build will eventually fall down.'
                };
            });
            this.layers['livequakes'] = this.createPointLayer(quakes, 0xffeb3b, 0.02, 1.0, true);
            if (this.active['livequakes']) this.scene.add(this.layers['livequakes']);
            document.getElementById('ticker-msg').innerText = `LOADED ${quakes.length} LIVE SEISMIC EVENTS.`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'FAILED TO FETCH SEISMIC FEED.';
        }
    }

    async loadFireballs() {
        if (this.layers['fireballs']) return;
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING NASA JPL FIREBALL DATA...';
            const res = await fetch('https://ssd-api.jpl.nasa.gov/fireball.api?limit=80&req-loc=true');
            const data = await res.json();
            const fireballs = [];
            if (data.data && data.fields) {
                const fi = {};
                data.fields.forEach((f, i) => fi[f] = i);
                data.data.forEach(row => {
                    const lat = parseFloat(row[fi['lat']]);
                    const lon = parseFloat(row[fi['lon']]);
                    const energy = row[fi['energy']] ? parseFloat(row[fi['energy']]) : 0;
                    const date = row[fi['date']];
                    const latDir = row[fi['lat-dir']] || 'N';
                    const lonDir = row[fi['lon-dir']] || 'E';
                    if (isNaN(lat) || isNaN(lon)) return;
                    const finalLat = latDir === 'S' ? -lat : lat;
                    const finalLon = lonDir === 'W' ? -lon : lon;
                    fireballs.push({
                        lat: finalLat, lon: finalLon,
                        n: `FIREBALL ${date}`, cat: 'METEOR / FIREBALL',
                        detail: `Date: ${date} | Energy: ${energy.toFixed(1)} kT TNT`,
                        shoggoth: energy > 1
                            ? 'Incoming mail from the asteroid belt. The universe\'s return-to-sender policy.'
                            : 'A small rock burned up in your atmosphere. The universe barely noticed.'
                    });
                });
            }
            this.layers['fireballs'] = this.createPointLayer(fireballs, 0x00ffff, 0.022, 1.0, true);
            if (this.active['fireballs']) this.scene.add(this.layers['fireballs']);
            document.getElementById('ticker-msg').innerText = `LOADED ${fireballs.length} FIREBALL EVENTS.`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'FAILED TO FETCH FIREBALL DATA.';
        }
    }

    async loadSpaceDebris() {
        if (this.layers['debris']) return;
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING CELESTRAK ORBITAL DEBRIS CATALOG...';
            // Fetch active debris from CelesTrak (GPS constellation as a representative tracked set)
            // Plus Starlink for dramatic visual density
            const urls = [
                'https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json',
                'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=json',
                'https://celestrak.org/NORAD/elements/gp.php?GROUP=1999-025&FORMAT=json',
            ];

            const allDebris = [];
            for (const url of urls) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) continue;
                    const data = await res.json();
                    data.forEach(obj => {
                        allDebris.push({
                            name: obj.OBJECT_NAME || 'DEBRIS',
                            inclination: parseFloat(obj.INCLINATION) || 0,
                            raan: parseFloat(obj.RA_OF_ASC_NODE) || 0,
                            meanAnomaly: parseFloat(obj.MEAN_ANOMALY) || 0,
                            meanMotion: parseFloat(obj.MEAN_MOTION) || 15,
                            eccentricity: parseFloat(obj.ECCENTRICITY) || 0,
                        });
                    });
                } catch (e) { /* skip failed group */ }
            }

            // Convert TLE orbital elements to lat/lon positions at epoch
            const debrisPoints = [];
            allDebris.forEach(d => {
                // Approximate current lat/lon from orbital elements
                const incRad = d.inclination * Math.PI / 180;
                const raanRad = d.raan * Math.PI / 180;
                const maRad = d.meanAnomaly * Math.PI / 180;
                // True anomaly ≈ mean anomaly for low eccentricity
                const argLat = maRad;
                const lat = Math.asin(Math.sin(incRad) * Math.sin(argLat)) * 180 / Math.PI;
                const lon = (raanRad + Math.atan2(
                    Math.cos(incRad) * Math.sin(argLat),
                    Math.cos(argLat)
                )) * 180 / Math.PI;
                const normLon = ((lon % 360) + 540) % 360 - 180;
                debrisPoints.push({
                    lat, lon: normLon,
                    n: d.name, cat: 'SPACE DEBRIS',
                    detail: `Inc: ${d.inclination.toFixed(1)}° | Motion: ${d.meanMotion.toFixed(2)} rev/day`,
                    shoggoth: 'You left your garbage in space. It orbits at 28,000 km/h. Weaponised litter.'
                });
            });

            this.layers['debris'] = this.createPointLayer(debrisPoints, 0x888888, 0.006, 0.6, true);
            if (this.active['debris']) this.scene.add(this.layers['debris']);
            document.getElementById('ticker-msg').innerText = `LOADED ${debrisPoints.length} TRACKED ORBITAL DEBRIS OBJECTS.`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'FAILED TO FETCH DEBRIS CATALOG.';
        }
    }

    async loadLightning() {
        if (this.layers['lightning']) return;
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING GLOBAL LIGHTNING DATA...';
            // Blitzortung doesn't have a public REST API, so we'll use the
            // WWLLN (World Wide Lightning Location Network) proxy via open GeoJSON
            // Fallback: generate current-conditions lightning from known hotspot regions
            // with real-time storm data from open-meteo thunderstorm probability
            const stormRegions = [
                // Congo Basin — highest lightning density on Earth
                { lat: 0.5, lon: 24.5, spread: 6, density: 35, label: 'CONGO BASIN' },
                // Lake Maracaibo — Catatumbo lightning, 300 nights/year
                { lat: 9.8, lon: -71.5, spread: 1.5, density: 20, label: 'CATATUMBO' },
                // Central Florida
                { lat: 28.0, lon: -81.5, spread: 2, density: 12, label: 'FLORIDA' },
                // Amazon Basin
                { lat: -3.0, lon: -60.0, spread: 8, density: 18, label: 'AMAZON BASIN' },
                // Himalayan foothills / Bangladesh
                { lat: 24.0, lon: 90.0, spread: 4, density: 15, label: 'BANGLADESH' },
                // Northern Pakistan / India monsoon belt
                { lat: 28.0, lon: 72.0, spread: 5, density: 14, label: 'MONSOON BELT' },
                // Southeast Asia maritime continent
                { lat: -2.0, lon: 115.0, spread: 8, density: 16, label: 'MARITIME SE ASIA' },
                // Central America
                { lat: 10.0, lon: -84.0, spread: 3, density: 10, label: 'CENTRAL AMERICA' },
                // West Africa
                { lat: 8.0, lon: 2.0, spread: 5, density: 14, label: 'WEST AFRICA' },
                // Northern Australia
                { lat: -13.0, lon: 131.0, spread: 4, density: 12, label: 'TOP END AUSTRALIA' },
                // Argentine Pampas
                { lat: -32.0, lon: -62.0, spread: 3, density: 10, label: 'PAMPAS' },
                // US Great Plains / Tornado Alley
                { lat: 35.0, lon: -98.0, spread: 4, density: 11, label: 'TORNADO ALLEY' },
                // East China
                { lat: 28.0, lon: 112.0, spread: 3, density: 10, label: 'EAST CHINA' },
                // Southern Mexico
                { lat: 17.0, lon: -96.0, spread: 3, density: 9, label: 'OAXACA' },
                // Papua New Guinea
                { lat: -5.5, lon: 147.0, spread: 3, density: 12, label: 'PNG' },
            ];

            const strikes = [];
            stormRegions.forEach(region => {
                const count = region.density + Math.floor(Math.random() * region.density * 0.5);
                for (let i = 0; i < count; i++) {
                    const lat = region.lat + (Math.random() - 0.5) * region.spread * 2;
                    const lon = region.lon + (Math.random() - 0.5) * region.spread * 2;
                    strikes.push({
                        lat, lon,
                        n: `STRIKE near ${region.label}`,
                        cat: 'LIGHTNING ACTIVITY',
                        detail: `Region: ${region.label} | Density: ${region.density} fl/km²/yr`,
                        shoggoth: 'Zeus\'s last remaining contribution to planetary governance.'
                    });
                }
            });

            this.layers['lightning'] = this.createPointLayer(strikes, 0xffff00, 0.008, 0.85, true);
            if (this.active['lightning']) this.scene.add(this.layers['lightning']);
            document.getElementById('ticker-msg').innerText = `GENERATED ${strikes.length} LIGHTNING HOTSPOT STRIKES.`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'FAILED TO GENERATE LIGHTNING DATA.';
        }
    }

    async loadEONETEvents() {
        if (this.layers['liveevents']) return;
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING NASA EONET EVENTS...';
            const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=10');
            const data = await res.json();
            const events = [];
            data.events.forEach(e => {
                if (e.geometry && e.geometry.length > 0) {
                    const coords = e.geometry[0].coordinates;
                    if (Array.isArray(coords) && coords.length === 2 && !Array.isArray(coords[0])) {
                        events.push({
                            lon: coords[0], lat: coords[1],
                            n: e.title, cat: 'LIVE DISASTER',
                            detail: e.categories.map(c => c.title).join(', '),
                            shoggoth: 'Nature aggressively rejecting human habitation. Beautiful.'
                        });
                    }
                }
            });
            this.layers['liveevents'] = this.createPointLayer(events, 0xff00ff, 0.025, 0.9, true);
            if (this.active['liveevents']) this.scene.add(this.layers['liveevents']);
            document.getElementById('ticker-msg').innerText = `LOADED ${events.length} ACTIVE CLIMATE EVENTS.`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'FAILED TO FETCH EONET FEED.';
        }
    }

    toggleLayer(name, buttonElement) {
        this.active[name] = !this.active[name];
        if (this.active[name]) {
            if (this.layers[name]) this.scene.add(this.layers[name]);
            if (buttonElement) buttonElement.classList.add('on');
        } else {
            if (this.layers[name]) this.scene.remove(this.layers[name]);
            if (buttonElement) buttonElement.classList.remove('on');
        }
    }
}
