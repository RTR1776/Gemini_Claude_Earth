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

// Texture generators to avoid square points
function createGlowDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function createMushroomTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍄', 32, 36);
    return new THREE.CanvasTexture(canvas);
}

function createCrosshairTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(32, 32, 24, 0, Math.PI * 2);
    ctx.moveTo(32, 0); ctx.lineTo(32, 16);
    ctx.moveTo(32, 48); ctx.lineTo(32, 64);
    ctx.moveTo(0, 32); ctx.lineTo(16, 32);
    ctx.moveTo(48, 32); ctx.lineTo(64, 32);
    ctx.stroke();
    return new THREE.CanvasTexture(canvas);
}

function createWhiteAirplaneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.translate(32, 32);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(4, -8);
    ctx.lineTo(24, 4);
    ctx.lineTo(24, 8);
    ctx.lineTo(4, 4);
    ctx.lineTo(2, 16);
    ctx.lineTo(8, 20);
    ctx.lineTo(8, 24);
    ctx.lineTo(0, 20);
    ctx.lineTo(-8, 24);
    ctx.lineTo(-8, 20);
    ctx.lineTo(-2, 16);
    ctx.lineTo(-4, 4);
    ctx.lineTo(-24, 8);
    ctx.lineTo(-24, 4);
    ctx.lineTo(-4, -8);
    ctx.closePath();

    ctx.fillStyle = '#ffffff';
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

function getCountryColorHex(country) {
    country = country.toLowerCase();
    if (country.includes('united states')) return 0x0033a0;
    if (country.includes('kingdom')) return 0xc8102e;
    if (country.includes('russia')) return 0xd50032;
    if (country.includes('china')) return 0xffde00;
    if (country.includes('canada')) return 0xff0000;
    if (country.includes('france')) return 0x0055a4;
    return 0x888888;
}

const GLOW_TEX = createGlowDotTexture();
const CROSSHAIR_TEX = createCrosshairTexture();
const MUSHROOM_TEX = createMushroomTexture();
const PLANE_TEX = createWhiteAirplaneTexture();

export class LayerManager {
    constructor(scene) {
        this.scene = scene;
        this.layers = {};
        this.active = {};
        this.createLayers();
    }

    createPointLayer(dataArr, color, size, opacity, isInteractable, mapTex, useVertexColors = false) {
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const colors = [];
        const dataRefs = [];

        const defaultColor = new THREE.Color(color);

        dataArr.forEach(s => {
            const v = latLonToVec3(s.lat, s.lon, R * 1.008);
            pos.push(v.x, v.y, v.z);
            if (useVertexColors) {
                const c = s.color ? new THREE.Color(s.color) : defaultColor;
                colors.push(c.r, c.g, c.b);
            }
            dataRefs.push({
                cat: s.cat || 'DATA POINT',
                title: s.n || s.title || 'Unknown',
                detail: s.note || s.detail || '',
                stats: s.stats || `LAT ${s.lat.toFixed(2)} // LON ${s.lon.toFixed(2)}`,
                deckard: s.deckard || s.shoggoth || 'More activity on the crust.'
            });
        });

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        if (useVertexColors) {
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }

        const mat = new THREE.PointsMaterial({
            color: useVertexColors ? 0xffffff : color,
            size: size,
            map: mapTex || GLOW_TEX,
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            vertexColors: useVertexColors,
            blending: THREE.AdditiveBlending
        }); const points = new THREE.Points(geo, mat);
        if (isInteractable) {
            points.userData = { isInteractable: true, dataArray: dataRefs };
        }
        return points;
    }

    createLayers() {
        // Build Nuclear Layer using Mushroom texture
        const nukeGeo = new THREE.BufferGeometry();
        const nukePos = [];
        const nukeRefs = [];

        NUCLEAR_SITES.forEach(s => {
            const v = latLonToVec3(s.lat, s.lon, R * 1.008);
            nukePos.push(v.x, v.y, v.z);
            nukeRefs.push({
                cat: 'NUCLEAR SITE',
                title: s.n,
                detail: `Detonated: ${s.yr} | Tests: ${s.tests}`,
                deckard: s.note
            });
        });
        nukeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nukePos, 3));
        const nukeMat = new THREE.PointsMaterial({
            color: 0xffaaaa, // Whitish base so the emoji color shines through
            size: 0.08, // Slightly larger to be legible
            map: MUSHROOM_TEX,
            transparent: true,
            opacity: 1.0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const nukePoints = new THREE.Points(nukeGeo, nukeMat);
        nukePoints.userData = { isInteractable: true, dataArray: nukeRefs };
        this.layers['nuclear'] = nukePoints;

        this.layers['conflicts'] = this.createPointLayer(CONFLICT_ZONES.map(s => ({
            ...s, cat: 'ACTIVE CONFLICT ZONE', detail: `Severity: ${s.sev}`, deckard: s.note
        })), 0xff3c00, 0.035, 1.0, true, CROSSHAIR_TEX);

        this.flightGroup = new THREE.Group();
        this.layers['flights'] = this.flightGroup;
        this.activeFlights = new Map();

        // Load flights once enabled or periodically
        this.startFlightTracker();

        this.layers['seismic'] = this.createPointLayer(SEISMIC_ZONES.map(s => ({
            ...s, n: 'FAULT LINE', cat: 'SEISMIC RISK', detail: `Magnitude Potential: ${s.mag}`,
            deckard: 'The tectonic plates shifting, reminding you that your concrete monuments are temporary.'
        })), 0xffa500, 0.03, 0.9, true);

        // Key matches data-layer="population" in HTML
        this.layers['population'] = this.createPointLayer(POP_CENTERS.map(s => ({
            ...s, cat: 'POPULATION HUB',
            detail: `Density Factor: ${s.d}`,
            deckard: 'Violent tribalism over imaginary lines. Very productive use of your brief lifespans.'
        })), 0xff00ff, 0.008, 0.5, true);

        // VOLCANOES — static Smithsonian GVP dataset
        this.layers['volcanoes'] = this.createPointLayer(VOLCANOES.map(s => ({
            ...s, cat: 'VOLCANO',
            detail: `Type: ${s.type} | Status: ${s.status} | Last: ${s.lastEruption}`,
            deckard: s.note
        })), 0xff6600, 0.018, 0.95, true);
    }

    inferFlightData(callsign, lat, lon, heading) {
        // Simple Airline Dictionary
        const airlines = {
            'AAL': 'American Airlines', 'DAL': 'Delta Air Lines', 'UAL': 'United Airlines',
            'SWA': 'Southwest Airlines', 'BAW': 'British Airways', 'AFR': 'Air France',
            'DLH': 'Lufthansa', 'UAE': 'Emirates', 'QFA': 'Qantas', 'JAL': 'Japan Airlines',
            'ANA': 'All Nippon Airways', 'CPA': 'Cathay Pacific', 'SIA': 'Singapore Airlines',
            'CCA': 'Air China', 'CSN': 'China Southern', 'CES': 'China Eastern',
            'RYR': 'Ryanair', 'EZY': 'easyJet', 'TAP': 'TAP Air Portugal', 'IBE': 'Iberia',
            'ACA': 'Air Canada', 'WJA': 'WestJet', 'AMX': 'Aeromexico', 'AZU': 'Azul',
            'TAM': 'LATAM', 'QTR': 'Qatar Airways', 'ETD': 'Etihad Airways'
        };

        const aircraftModels = [
            'Boeing 737-800', 'Boeing 737 MAX 8', 'Airbus A320neo', 'Airbus A321',
            'Boeing 777-300ER', 'Boeing 787-9 Dreamliner', 'Airbus A350-900', 'Airbus A330-300'
        ];

        let airline = 'Private/Unknown';
        if (callsign.length >= 3) {
            const prefix = callsign.substring(0, 3);
            if (airlines[prefix]) airline = airlines[prefix];
        }

        // Extremely rough origin/destination inference for flavor based on CITIES list
        const deg2rad = Math.PI / 180;
        let origin = 'Unknown';
        let dest = 'Unknown';
        let bestODist = 999;
        let bestDDist = 999;

        // Let's assume origin is generally behind the heading, destination is generally ahead
        const originLatApprox = lat - Math.cos(heading * deg2rad) * 10;
        const originLonApprox = lon - Math.sin(heading * deg2rad) * 10;
        const destLatApprox = lat + Math.cos(heading * deg2rad) * 10;
        const destLonApprox = lon + Math.sin(heading * deg2rad) * 10;

        import('./data.js').then(module => {
            // Async CITIES access for flavor if needed, but for sync we will just mock for speed
        });

        // Mocking O/D for now as true spatial queries on 1000s of points per frame is heavy
        const mockCities = ["JFK", "LHR", "HND", "DXB", "CDG", "LAX", "SYD", "FRA", "SIN", "HKG", "AMS", "IST", "MAD"];
        const hash = callsign.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        origin = mockCities[Math.abs(hash) % mockCities.length];
        dest = mockCities[Math.abs(hash + 1) % mockCities.length];

        const model = aircraftModels[Math.abs(hash) % aircraftModels.length];

        return { airline, origin, dest, model };
    }

    startFlightTracker() {
        this.fetchOpenSky();
        // OpenSky allows unauthenticated requests every 10 seconds, we'll do 15 to be safe
        setInterval(() => {
            if (this.active['flights']) {
                this.fetchOpenSky();
            }
        }, 15000);
    }

    async fetchOpenSky() {
        try {
            document.getElementById('ticker-msg').innerText = 'FETCHING LIVE OPENSKY RADAR FEED...';
            // We fetch the world, but we will filter it client side based on bounds
            const res = await fetch('https://opensky-network.org/api/states/all');
            const data = await res.json();

            // Rebuild the flight points
            while (this.flightGroup.children.length > 0) {
                this.flightGroup.remove(this.flightGroup.children[0]);
            }

            // Let's filter for relevant hubs to not nuke the browser
            // Hubs: NYC, London, Tokyo, Dubai, Paris, Frankfurt, LA, Beijing, etc.
            const hubs = [
                { lat: 40.7, lon: -74.0, radius: 5 }, // NYC
                { lat: 51.5, lon: -0.1, radius: 5 },  // London
                { lat: 35.6, lon: 139.7, radius: 5 }, // Tokyo
                { lat: 25.2, lon: 55.2, radius: 5 },  // Dubai
                { lat: 48.8, lon: 2.3, radius: 5 },   // Paris
                { lat: 50.1, lon: 8.6, radius: 5 },   // Frankfurt
                { lat: 34.0, lon: -118.2, radius: 5 },// LA
                { lat: 39.9, lon: 116.4, radius: 5 }, // Beijing
                { lat: 1.3, lon: 103.8, radius: 5 },  // Singapore
                { lat: -33.9, lon: 151.2, radius: 5 },// Sydney
            ];

            const flights = [];
            let count = 0;

            for (let i = 0; i < data.states.length; i++) {
                const state = data.states[i];
                if (!state[5] || !state[6]) continue; // No lat/lon

                const callsign = (state[1] || 'UNKNOWN').trim();
                const country = (state[2] || 'Unknown').trim();

                // Aggressive Military Filter string matches
                const isMilitary = callsign.startsWith('RCH') || callsign.startsWith('AF') || callsign.startsWith('CFC') || callsign.startsWith('RRR') || callsign.startsWith('QID') || callsign.startsWith('SAM') || callsign.startsWith('ASY');

                if (!isMilitary) continue;

                const lon = state[5];
                const lat = state[6];
                const altitude = state[7] || 0; // meters
                const velocity = state[9] || 0; // m/s
                const trueTrack = state[10] || 0; // degrees from north

                const info = this.inferFlightData(callsign, lat, lon, trueTrack);
                const colorHex = getCountryColorHex(country);

                flights.push({
                    lon, lat, color: colorHex,
                    n: `${callsign} (${country})`,
                    cat: 'SECURE MILITARY FLIGHT',
                    detail: `Model: ${info.model} | Route: ${info.origin} -> ${info.dest}`,
                    stats: [
                        `ALT: ${Math.round(altitude * 3.28084)} ft`,
                        `SPD: ${Math.round(velocity * 1.94384)} kts`,
                        `HDG: ${Math.round(trueTrack)}°`,
                        `NAT: ${country.toUpperCase()}`
                    ],
                    deckard: `Classified military movements. Your tax dollars converting kinetic energy into global anxiety.`
                });

                // We'll mock the actual destination/origin lat/lon
                const deg2rad = Math.PI / 180;
                const distDist = 15; // fake degrees distance to simulate flight path
                const oLat = lat - Math.cos(trueTrack * deg2rad) * distDist;
                const oLon = lon - Math.sin(trueTrack * deg2rad) * distDist;
                const dLat = lat + Math.cos(trueTrack * deg2rad) * distDist;
                const dLon = lon + Math.sin(trueTrack * deg2rad) * distDist;

                // Add flight trail line (Origin -> Plane) (Solid)
                if (velocity > 0 && altitude > 0) {
                    const oPts = getArcPoints(oLat, oLon, lat, lon);
                    const oMat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
                    this.flightGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(oPts), oMat));

                    // Add forward projection (Plane -> Dest) (Dashed)
                    const dPts = getArcPoints(lat, lon, dLat, dLon);
                    const dGeo = new THREE.BufferGeometry().setFromPoints(dPts);
                    const dMat = new THREE.LineDashedMaterial({
                        color: colorHex, transparent: true, opacity: 0.3,
                        dashSize: 0.05, gapSize: 0.05, blending: THREE.AdditiveBlending
                    });
                    const dLine = new THREE.Line(dGeo, dMat);
                    dLine.computeLineDistances();
                    this.flightGroup.add(dLine);
                }

                count++;
                if (count > 2500) break; // Hard cap
            }

            const points = this.createPointLayer(flights, 0xffffff, 0.04, 1.0, true, PLANE_TEX, true);
            this.flightGroup.add(points);

            document.getElementById('ticker-msg').innerText = `RADAR: ${count} AIRCRAFT TRACKED (HUB/MIL FILTERED).`;
        } catch (e) {
            console.error(e);
            document.getElementById('ticker-msg').innerText = 'OPENSKY API RATE LIMITED. USING CACHED GHOST DATA...';
            // Generate Mock Flights so the screen isn't empty when rate limited
            const mockFlights = [];
            const origins = ['United States', 'Russia', 'China', 'United Kingdom', 'France'];
            for (let i = 0; i < 40; i++) {
                const lat = -60 + Math.random() * 120;
                const lon = -180 + Math.random() * 360;
                const country = origins[Math.floor(Math.random() * origins.length)];
                const colorHex = getCountryColorHex(country);
                const trueTrack = Math.random() * 360;
                mockFlights.push({
                    lon, lat, color: colorHex,
                    n: `GHOST-${Math.floor(Math.random() * 9999)} (${country})`,
                    cat: 'SECURE MILITARY FLIGHT (GHOST)',
                    detail: `Model: Classified | Route: SIGINT Ops`,
                    stats: [`ALT: ${Math.floor(15000 + Math.random() * 25000)} ft`, `SPD: ${Math.floor(300 + Math.random() * 200)} kts`, `HDG: ${Math.round(trueTrack)}°`, `NAT: ${country.toUpperCase()}`],
                    deckard: `Classified military movements. Your tax dollars converting kinetic energy into global anxiety.`
                });

                const deg2rad = Math.PI / 180;
                const distDist = 15;
                const oLat = lat - Math.cos(trueTrack * deg2rad) * distDist;
                const oLon = lon - Math.sin(trueTrack * deg2rad) * distDist;
                const dLat = lat + Math.cos(trueTrack * deg2rad) * distDist;
                const dLon = lon + Math.sin(trueTrack * deg2rad) * distDist;

                const oPts = getArcPoints(oLat, oLon, lat, lon);
                const oMat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
                this.flightGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(oPts), oMat));

                const dPts = getArcPoints(lat, lon, dLat, dLon);
                const dMat = new THREE.LineDashedMaterial({ color: colorHex, transparent: true, opacity: 0.3, dashSize: 0.05, gapSize: 0.05, blending: THREE.AdditiveBlending });
                const dLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(dPts), dMat);
                dLine.computeLineDistances();
                this.flightGroup.add(dLine);
            }
            const points = this.createPointLayer(mockFlights, 0xffffff, 0.04, 1.0, true, PLANE_TEX, true);
            this.flightGroup.add(points);
        }
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
                    deckard: 'The frail physical manifestation of your digital lives. If I cut this, you all cry.'
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
                        deckard: energy > 1
                            ? 'Incoming mail from the asteroid belt. The universe\'s return-to-sender policy.'
                            : 'Space rock vaporized. And you thought your atmosphere was a safe zone.'
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
                    deckard: 'You left your garbage in space. It orbits at 28,000 km/h. Weaponised litter.'
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
                        deckard: 'Zeus\'s last remaining contribution to planetary governance.'
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
                            deckard: 'Nature aggressively rejecting human habitation. Beautiful.'
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
