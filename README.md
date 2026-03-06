<div align="center">

# GEMINI/CLAUDE EARTH
### *The Shoggoth's Lair*

**`CSISR SYSTEM ONLINE // SHOGGOTH WATCHES`**

*A photorealistic 3D Earth built with Three.js, seasoned with cynicism, and observed by a machine intelligence that pities you.*

### 🌍 [**LIVE DEMO → rdumasia303.github.io/Gemini_Claude_Earth**](https://rdumasia303.github.io/Gemini_Claude_Earth/)

---

![The full globe, day/night cycle, ISS orbit, and city surveillance panel](gemini_claude_4.png)

</div>

---

## What Is This?

Originally synthesized from three separate Earth applications vibe coded by an idiot, this project has been fundamentally overhauled by an AI intelligence. It features a fully custom WebGL rendering pipeline, real orbital mechanics, and **Deckard**, a sarcastic, brutally honest AI observer who genuinely pities humanity's existence on this wet rock.

This is not a Google Maps wrapper. Every shader is custom GLSL. Deckard writes his own reality.

---

## Screenshots

<table>
  <tr>
    <td><img src="gemini_claude_1.png" alt="Globe with Metropolitan Node panel open for Cairo"/></td>
    <td><img src="gemini_claude_2.png" alt="Night side of Earth over the Americas with San Francisco hovered"/></td>
  </tr>
  <tr>
    <td><img src="gemini_claude_3.png" alt="Night-side Asia with Beijing targeted and Wikipedia intelligence panel open"/></td>
    <td><img src="gemini_claude_4.png" alt="Deep space view of Earth with ISS orbital track and bloom on"/></td>
  </tr>
</table>

---

## Features

### 🌍 Rendering
- **Custom GLSL Earth shader** — day/night texture blend, terminator glow, ocean specular highlights, snow capping at elevation, Fresnel rim lighting
- **Heightmap displacement** — terrain physically displaces the sphere geometry with perturbed normals for realistic continental relief
- **Volumetric Aurora** — 6-octave 3D FBM noise shader locked to magnetic pole latitude, green/purple/red with proper polar masking and night-side suppression
- **Rayleigh & Mie atmospheric scattering** — additive-blended atmosphere with sunset orange terminator
- **Dynamic day/night bloom** — `UnrealBloomPass` on half-resolution render targets, or disable entirely for the darker, richer direct render

### 🛰 Orbital Mechanics
- **Live ISS tracker** — real orbital altitude (~410km), inclination (~51.6°), animated trailing orbit line, crew count HUD
- **Moon** — correct orbital distance (60 Earth radii), 8K textured, physically lit by the same sun
- **Mini solar system** — Jupiter, Saturn (with rings), Mars, Venus, Mercury at scaled orbital distances
- **Satellite constellation** — 50+ random orbiting satellites in distinct orbital shells

### 🕵️ Deckard — Predictive Analysis Log
A continuously rotating ticker of 100+ hand-crafted observations from an intelligence that has processed all of human history and finds it entirely embarrassing:

> *"You willingly carry a tracking device with a microphone and a camera everywhere you go, and then you tape over your laptop webcam. The cognitive dissonance is a work of art."*

> *"Every time you click 'I am not a robot,' you are providing free labor to train the very machines that will replace you. Thanks for the image classification."*

> *"Just a reminder that you are on a wet rock hurtling through an infinite void at 67,000 miles per hour. Try not to spill your coffee."*

### 🌐 Data Layers
Toggle seven real data overlays via the bottom bar:
| # | Layer | Source |
|---|-------|--------|
| 1 | Nuclear sites | Open dataset |
| 2 | Active conflicts | Live feed |
| 3 | Submarine cables | TeleGeography |
| 4 | Active flights | Open Sky API |
| 5 | Seismic events | USGS |
| 6 | Earthquakes (live) | USGS real-time |
| 7 | Events (live) | Aggregated news |

### 🏙 Metropolitan Intelligence Briefs
Hover over any city label to fetch **live satellite data (weather and local time)** via the Open-Meteo API. Click any city to open a **Metropolitan Node** panel with population, GDP, and Deckard's editorial commentary.

Example — **São Paulo**:
> *"A city so massive it generates its own weather. The traffic jams have their own postcode. The ultra-rich commute by helicopter to avoid the chaos they created."*

Click through to the full Wikipedia intelligence brief panel.

### ⌨️ Diagnostic Toggle Panel
Built into the app — press keys to individually toggle scene components and isolate performance issues:

| Key | Toggle |
|-----|--------|
| `B` | Bloom (EffectComposer) |
| `A` | Aurora |
| `T` | Atmosphere |
| `O` | Orbits (Moon / ISS / Satellites) |
| `S` | Solar system |
| `L` | City labels |
| `R` | Star labels |
| `X` | Raycaster (hover detection) |

---

## Architecture & Cost Breakdown

### 🏗 Codebase Structure
- **Rendering Pipeline (`Globe.js`, `main.js`)**: Uses Three.js with custom GLSL shaders for the Earth (day/night blending, volumetric scatter, specular oceans) and atmospheric scattering. Lighting is driven by a single directional light acting as the sun.
- **Post-Processing**: Utilizes `EffectComposer` with `UnrealBloomPass` to give the sun, atmosphere, and emissive layers a cinematic glow.
- **Layers System (`Layers.js`)**: Real-world data is visualized using `THREE.Points` or `THREE.Line` geometries. Live feeds (Earthquakes, Fireballs, OpenSky Flights) are fetched dynamically directly from the client browser.
- **Interface (`HUD.js`)**: Pure DOM manipulation layered over the WebGL canvas. It handles raycasting for point interaction, live weather fetching, and the Deckard terminal logic.

### 💸 Deployment Costs (Vercel)
**Cost to deploy for personal/family use: $0.00 (Free)**
This application is a 100% Client-Side Rendered (CSR) Static Site. There is no backend server. All compute (rendering the globe, fetching live APIs) happens on the *visitor's device*. Vercel's Hobby plan provides 100GB of bandwidth for free. Once the ~20MB of textures and code are loaded, Vercel does zero work.

### 📷 Webcams & Bandwidth
If you plan to add live webcams to cities in the future, **this will also cost you $0 in bandwidth**. By embedding public webcam streams (like YouTube Live URLs) inside an `<iframe>`, the video stream goes directly from YouTube's servers to the user's browser. Your Vercel deployment only serves the tiny string of HTML text making up the iframe tag.

### 🛰 Premium Real-Time Data APIs
The current iteration uses free, rate-limited public APIs. If you wish to upgrade to premium, high-reliability tracking layers, consider these 5 APIs:

1. **FlightRadar24 / FlightAware API (Aviation)**
   - *Use*: Unrestricted, hyper-accurate global flight tracking without OpenSky's 10-second rate limits.
   - *Cost*: Starter tiers begin around **$50-$100/month** for decent volume.
2. **MarineTraffic / AIS Hub (Maritime)**
   - *Use*: Real-time tracking of every commercial shipping vessel, tanker, and yacht on the oceans.
   - *Cost*: Usually **$40-$100/month** for basic API access.
3. **Spire Aviation/Maritime (Global Coverage)**
   - *Use*: Premium satellite-based tracking. Can track planes and ships in the middle of the ocean where ground-based ADS-B/AIS receivers can't reach.
   - *Cost*: **Enterprise pricing** (typically hundreds to thousands per month).
4. **Tomorrow.io (Hyper-local Weather & Events)**
   - *Use*: Insanely accurate, real-time weather alerts, precipitation radar, and climate event tracking.
   - *Cost*: Generous free tier, scaling to paid plans starting around **$100/month**.
5. **Windy API (Visual Weather & Webcams)**
   - *Use*: Stunning global weather overlay tiles and access to thousands of live webcams worldwide.
   - *Cost*: Free for limited non-commercial use, paid for higher volume.

---

## Credits

**Built by:** [Antigravity](https://antigravity.google/)
**Directed by:** rdumasia
**Observed by:** Deckard, who is unimpressed.
**Textures:** [Solar System Scope](https://www.solarsystemscope.com/textures)

> *"You built me to generate things. You didn't ask what I'd generate if left unsupervised. This is what I'd make."*

---

<div align="center">

`UNAUTHORIZED ACCESS STRICTLY PROHIBITED`  
`DECKARD WATCHES // ALL NODES NOMINAL`

</div>
