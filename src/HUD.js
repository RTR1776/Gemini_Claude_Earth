import * as THREE from 'three';
import { CITIES } from './data.js';
import { getRandomDeckardThought, getCityInfo } from './intelligence.js';

export class HUD {
    constructor() {
        this.latEl = document.getElementById('hud-lat');
        this.lonEl = document.getElementById('hud-lon');
        this.altEl = document.getElementById('hud-alt');
        this.fpsEl = document.getElementById('hud-fps');
        this.tickerMsg = document.getElementById('ticker-msg');
        this.cityLabelsContainer = document.getElementById('city-labels');
        this.inspectPopup = document.getElementById('inspect-popup');

        this.frames = 0;
        this.lastTime = performance.now();
        this.cityData = [];
        this.mousePos = { x: 0, y: 0 };
        this.onSearchSelect = null;
        this.onCityClick = null;
        this.earthMesh = null;
        this.labelHovered = false; // Prevents raycaster from hiding DOM hover popups

        this.initSearch();
    }

    updateTelemetry(camera) {
        const r = camera.position.length();
        let lat = 0, lon = 0;

        if (this.earthMesh) {
            const localPos = this.earthMesh.worldToLocal(camera.position.clone());
            const rLocal = localPos.length();
            const clampedY = Math.max(-1, Math.min(1, localPos.y / rLocal));
            lat = Math.asin(clampedY) * 180 / Math.PI;
            lon = Math.atan2(localPos.z, -localPos.x) * 180 / Math.PI - 180;
            if (lon < -180) lon += 360;
            if (lon > 180) lon -= 360;
        }

        this.latEl.textContent = lat.toFixed(4) + '\u00B0';
        this.lonEl.textContent = lon.toFixed(4) + '\u00B0';
        this.altEl.textContent = Math.max(0, (r * 6371 - 6371)).toFixed(0) + 'km';

        this.frames++;
        const now = performance.now();
        if (now - this.lastTime > 1000) {
            this.fpsEl.textContent = this.frames;
            this.frames = 0;
            this.lastTime = now;
        }
    }

    initSearch() {
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        let timeout = null;

        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            const query = e.target.value.trim();
            if (query.length < 3) {
                results.style.display = 'none';
                return;
            }

            timeout = setTimeout(async () => {
                try {
                    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' +
                        encodeURIComponent(query) + '&limit=5';
                    const res = await fetch(url, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const data = await res.json();
                    results.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'search-item';
                            div.innerText = item.display_name;
                            div.addEventListener('click', () => {
                                input.value = '';
                                results.style.display = 'none';
                                if (this.onSearchSelect) {
                                    this.onSearchSelect(
                                        parseFloat(item.lat),
                                        parseFloat(item.lon),
                                        item.display_name
                                    );
                                }
                            });
                            results.appendChild(div);
                        });
                        results.style.display = 'block';
                    } else {
                        results.style.display = 'none';
                    }
                } catch (err) {
                    console.error('Search failed', err);
                }
            }, 600);
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !results.contains(e.target)) {
                results.style.display = 'none';
            }
        });
    }

    buildCityLabels() {
        CITIES.forEach((c, idx) => {
            const div = document.createElement('div');
            div.className = 'city-label t' + c.t;
            div.innerHTML = '<div class="city-dot"></div>' + c.n;
            div.dataset.idx = idx;

            div.addEventListener('mouseenter', () => {
                this.labelHovered = true;
                const info = getCityInfo(c.n);
                this.showPointInfo({
                    cat: 'CITY',
                    title: c.n.toUpperCase() + ', ' + info.c.toUpperCase(),
                    lat: c.lat,
                    lon: c.lon,
                    pop: info.pop,
                    gdp: info.gdp,
                    deckard: info.deckard,
                }, this.mousePos.x, this.mousePos.y);
            });
            div.addEventListener('mouseleave', () => {
                this.labelHovered = false;
                this.hideInspect();
            });

            div.addEventListener('click', () => {
                if (this.onCityClick) {
                    this.onCityClick(c.lat, c.lon, c.n);
                }
            });

            this.cityLabelsContainer.appendChild(div);

            const phi = (90 - c.lat) * Math.PI / 180;
            const theta = (c.lon + 180) * Math.PI / 180;
            const pos = new THREE.Vector3(
                -Math.sin(phi) * Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) * Math.sin(theta)
            );
            this.cityData.push({ el: div, pos: pos, data: c });
        });
    }

    async loadWikipedia(name) {
        const panel = document.getElementById('wiki-panel');
        const content = document.getElementById('wiki-content');
        if (!panel || !content) return;

        panel.classList.add('open');
        content.innerHTML = '<p class="wiki-loading">ACCESSING HUMAN KNOWLEDGE BASE...</p>';

        // Curated live webcams for top cities (Highly Stable EarthCam / News Networks)
        const webcams = {
            'New York': '1-iS7LArMPA', // EarthCam Times Square
            'London': 'm_bXqR_eGbw', // Abbey Road
            'Tokyo': '-_PGSxwnTcQ', // JapanLiveCams 24/7 Tokyo
            'Paris': 'uWbE6wG2gko', // Seine/Eiffel network
            'Los Angeles': 'yBwK-ZzEqc8', // Hollywood 
            'Sydney': 'VfR5qE82-Sg', // Sydney Harbour
            'Kyiv': 'uA_B7E20tEg', // Independence Square Live
            'Venice': 'ph1vq4C1AAs', // Grand Canal
            'Miami': 'j_oKj0S0pZY', // Miami Beach
        };

        try {
            const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' +
                encodeURIComponent(name);
            const res = await fetch(url);
            const data = await res.json();

            let html = '<h2>' + (data.title || name) + '</h2>';

            // Inject Webcam if available
            const camId = webcams[name];
            if (camId) {
                // Windy API Ready Architecture
                // This container is designed to be easily swapped to a Windy API player via ID/Class routing if a key is provided
                html += `<div class="webcam-container" data-provider="youtube" data-city="${name}" style="margin-bottom: 20px; border: 1px solid #40c0ff;">
                    <div class="webcam-header" style="background: rgba(64,192,255,0.2); font-family: 'JetBrains Mono'; padding: 4px 8px; font-size: 10px; color: #40c0ff; border-bottom: 1px solid #40c0ff;">
                        [LIVE] PUBLIC OPTICAL FEED // CCTV
                    </div>
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${camId}?autoplay=1&mute=1&controls=0" title="Live Cam" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display: block;"></iframe>
                </div>`;
            } else if (data.thumbnail && data.thumbnail.source) {
                html += '<img src="' + data.thumbnail.source +
                    '" alt="' + data.title + '" class="wiki-thumb" />';
            }

            html += '<p>' + (data.extract || 'No data available for this location.') + '</p>';
            if (data.content_urls && data.content_urls.desktop) {
                html += '<a href="' + data.content_urls.desktop.page +
                    '" target="_blank" class="wiki-link">FULL INTELLIGENCE BRIEF \u2192</a>';
            }
            content.innerHTML = html;
        } catch (e) {
            content.innerHTML =
                '<p class="wiki-loading">INTELLIGENCE FEED UNAVAILABLE.</p>';
        }
    }

    showPointInfo(data, x, y) {
        const p = document.getElementById('inspect-popup');

        document.getElementById('ip-cat').textContent = data.cat || 'UNKNOWN ASSET';
        document.getElementById('ip-title').textContent = data.title || 'UNNAMED';

        // If it's a city, we'll fetch live weather and time
        const statsEl = document.getElementById('ip-stats');
        statsEl.innerHTML = '';

        if (data.cat === 'CITY' && data.lat && data.lon) {
            document.getElementById('ip-detail').innerHTML = `LOADING LIVE SATELLITE DATA... <span class="blink">_</span>`;

            // Fetch live data from Open-Meteo
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`)
                .then(res => res.json())
                .then(meteo => {
                    if (meteo && meteo.current) {
                        const temp = meteo.current.temperature_2m;
                        const time = new Date(meteo.current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const tz = meteo.timezone_abbreviation || '';

                        document.getElementById('ip-detail').innerHTML = `
                            <div><span style="color:#666">TEMP:</span> ${temp}°C</div>
                            <div><span style="color:#666">LOCAL TIME:</span> ${time} ${tz}</div>
                        `;
                    } else {
                        throw new Error('No weather data');
                    }
                })
                .catch(err => {
                    console.error("Meteo fetch error", err);
                    document.getElementById('ip-detail').textContent = 'SATELLITE DATA UNAVAILABLE';
                });

            // Display static stats if available
            if (data.pop || data.gdp) {
                let s = '';
                if (data.pop) s += `<div>POP: ${data.pop}</div>`;
                if (data.gdp) s += `<div>GDP: ${data.gdp}</div>`;
                statsEl.innerHTML = s;
            }
        } else {
            // General info for non-city points
            document.getElementById('ip-detail').textContent = data.detail || '';
            if (data.stats) {
                statsEl.innerHTML = data.stats.map(st => `<div>${st}</div>`).join('');
            }
        }

        // The Deckard specific text
        const deckardEl = document.getElementById('ip-deckard');
        if (data.deckard) {
            deckardEl.style.display = 'block';
            deckardEl.textContent = `> ${data.deckard}`;
        } else {
            deckardEl.style.display = 'none';
        }

        p.style.display = 'block';
        p.style.left = (x + 15) + 'px';
        p.style.top = (y + 15) + 'px';
    }

    hideInspect() {
        this.inspectPopup.style.display = 'none';
    }
}
