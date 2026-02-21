// All the monolithic geo data extracted for cleanliness
// 200+ cities organized by tier (t=1 megacities, t=2 major, t=3 notable, t=4 landmarks/towns)

export const CITIES = [
    // ════════════ TIER 1: Megacities (always visible) ════════════
    { n: 'Tokyo', lat: 35.68, lon: 139.65, pop: 37.4, t: 1 },
    { n: 'Delhi', lat: 28.61, lon: 77.21, pop: 32.9, t: 1 },
    { n: 'Shanghai', lat: 31.23, lon: 121.47, pop: 28.5, t: 1 },
    { n: 'São Paulo', lat: -23.55, lon: -46.63, pop: 22.4, t: 1 },
    { n: 'Mexico City', lat: 19.43, lon: -99.13, pop: 21.8, t: 1 },
    { n: 'Cairo', lat: 30.04, lon: 31.24, pop: 21.3, t: 1 },
    { n: 'Mumbai', lat: 19.08, lon: 72.88, pop: 21.0, t: 1 },
    { n: 'Beijing', lat: 39.90, lon: 116.41, pop: 20.9, t: 1 },
    { n: 'New York', lat: 40.71, lon: -74.01, pop: 18.8, t: 1 },
    { n: 'London', lat: 51.51, lon: -0.13, pop: 9.5, t: 1 },
    { n: 'Los Angeles', lat: 34.05, lon: -118.24, pop: 12.5, t: 1 },
    { n: 'Moscow', lat: 55.76, lon: 37.62, pop: 12.6, t: 1 },
    { n: 'Paris', lat: 48.86, lon: 2.35, pop: 11.1, t: 1 },
    { n: 'Istanbul', lat: 41.01, lon: 28.98, pop: 15.6, t: 1 },
    { n: 'Lagos', lat: 6.52, lon: 3.38, pop: 15.4, t: 1 },
    { n: 'Buenos Aires', lat: -34.60, lon: -58.38, pop: 15.4, t: 1 },

    // ════════════ TIER 2: Major cities (medium zoom) ════════════
    // Asia
    { n: 'Seoul', lat: 37.57, lon: 126.98, pop: 9.9, t: 2 },
    { n: 'Bangkok', lat: 13.76, lon: 100.50, pop: 10.7, t: 2 },
    { n: 'Dhaka', lat: 23.81, lon: 90.41, pop: 22.5, t: 2 },
    { n: 'Karachi', lat: 24.86, lon: 67.01, pop: 16.8, t: 2 },
    { n: 'Manila', lat: 14.60, lon: 120.98, pop: 14.2, t: 2 },
    { n: 'Kinshasa', lat: -4.32, lon: 15.31, pop: 15.6, t: 2 },
    { n: 'Hong Kong', lat: 22.32, lon: 114.17, pop: 7.6, t: 2 },
    { n: 'Singapore', lat: 1.35, lon: 103.82, pop: 5.9, t: 2 },
    { n: 'Riyadh', lat: 24.71, lon: 46.68, pop: 7.7, t: 2 },
    { n: 'Tehran', lat: 35.69, lon: 51.39, pop: 9.3, t: 2 },
    { n: 'Baghdad', lat: 33.31, lon: 44.37, pop: 7.5, t: 2 },
    { n: 'Chennai', lat: 13.08, lon: 80.27, pop: 11.2, t: 2 },
    { n: 'Taipei', lat: 25.03, lon: 121.57, pop: 7.0, t: 2 },
    { n: 'Osaka', lat: 34.69, lon: 135.50, pop: 19.3, t: 2 },
    { n: 'Jakarta', lat: -6.21, lon: 106.85, pop: 10.6, t: 2 },
    { n: 'Ho Chi Minh', lat: 10.82, lon: 106.63, pop: 9.0, t: 2 },
    { n: 'Kuala Lumpur', lat: 3.14, lon: 101.69, pop: 8.4, t: 2 },
    // Americas
    { n: 'Lima', lat: -12.05, lon: -77.04, pop: 10.7, t: 2 },
    { n: 'Bogotá', lat: 4.71, lon: -74.07, pop: 11.3, t: 2 },
    { n: 'Toronto', lat: 43.65, lon: -79.38, pop: 6.3, t: 2 },
    { n: 'Santiago', lat: -33.45, lon: -70.67, pop: 6.8, t: 2 },
    { n: 'Chicago', lat: 41.88, lon: -87.63, pop: 9.5, t: 2 },
    { n: 'Miami', lat: 25.76, lon: -80.19, pop: 6.2, t: 2 },
    { n: 'San Francisco', lat: 37.77, lon: -122.42, pop: 4.7, t: 2 },
    { n: 'Washington DC', lat: 38.91, lon: -77.04, pop: 5.3, t: 2 },
    { n: 'Rio de Janeiro', lat: -22.91, lon: -43.17, pop: 13.5, t: 2 },
    // Europe
    { n: 'Berlin', lat: 52.52, lon: 13.41, pop: 3.7, t: 2 },
    { n: 'Madrid', lat: 40.42, lon: -3.70, pop: 6.7, t: 2 },
    { n: 'Rome', lat: 41.90, lon: 12.50, pop: 4.3, t: 2 },
    { n: 'Amsterdam', lat: 52.37, lon: 4.90, pop: 2.5, t: 2 },
    { n: 'Vienna', lat: 48.21, lon: 16.37, pop: 2.0, t: 2 },
    { n: 'Munich', lat: 48.14, lon: 11.58, pop: 1.5, t: 2 },
    { n: 'Warsaw', lat: 52.23, lon: 21.01, pop: 1.8, t: 2 },
    { n: 'Kyiv', lat: 50.45, lon: 30.52, pop: 3.0, t: 2 },
    { n: 'Barcelona', lat: 41.39, lon: 2.17, pop: 5.6, t: 2 },
    // Africa
    { n: 'Johannesburg', lat: -26.20, lon: 28.04, pop: 6.1, t: 2 },
    { n: 'Nairobi', lat: -1.29, lon: 36.82, pop: 5.1, t: 2 },
    { n: 'Addis Ababa', lat: 9.02, lon: 38.75, pop: 5.2, t: 2 },
    { n: 'Casablanca', lat: 33.57, lon: -7.59, pop: 3.7, t: 2 },
    { n: 'Accra', lat: 5.56, lon: -0.19, pop: 4.1, t: 2 },
    { n: 'Dar es Salaam', lat: -6.79, lon: 39.28, pop: 7.0, t: 2 },
    // Oceania
    { n: 'Sydney', lat: -33.87, lon: 151.21, pop: 5.3, t: 2 },
    { n: 'Melbourne', lat: -37.81, lon: 144.96, pop: 5.1, t: 2 },
    { n: 'Auckland', lat: -36.85, lon: 174.76, pop: 1.7, t: 2 },

    // ════════════ TIER 3: Notable cities (close zoom) ════════════
    // Europe
    { n: 'Stockholm', lat: 59.33, lon: 18.07, pop: 1.6, t: 3 },
    { n: 'Copenhagen', lat: 55.68, lon: 12.57, pop: 1.4, t: 3 },
    { n: 'Oslo', lat: 59.91, lon: 10.75, pop: 1.0, t: 3 },
    { n: 'Helsinki', lat: 60.17, lon: 24.94, pop: 1.3, t: 3 },
    { n: 'Prague', lat: 50.08, lon: 14.44, pop: 1.3, t: 3 },
    { n: 'Budapest', lat: 47.50, lon: 19.04, pop: 1.8, t: 3 },
    { n: 'Lisbon', lat: 38.72, lon: -9.14, pop: 2.9, t: 3 },
    { n: 'Dublin', lat: 53.35, lon: -6.26, pop: 1.4, t: 3 },
    { n: 'Edinburgh', lat: 55.95, lon: -3.19, pop: 0.5, t: 3 },
    { n: 'Brussels', lat: 50.85, lon: 4.35, pop: 2.1, t: 3 },
    { n: 'Zurich', lat: 47.37, lon: 8.54, pop: 1.4, t: 3 },
    { n: 'Athens', lat: 37.98, lon: 23.73, pop: 3.2, t: 3 },
    { n: 'Bucharest', lat: 44.43, lon: 26.10, pop: 1.8, t: 3 },
    { n: 'Milan', lat: 45.46, lon: 9.19, pop: 3.1, t: 3 },
    { n: 'St Petersburg', lat: 59.93, lon: 30.32, pop: 5.4, t: 3 },
    { n: 'Reykjavik', lat: 64.15, lon: -21.94, pop: 0.2, t: 3 },
    // Asia
    { n: 'Pyongyang', lat: 39.03, lon: 125.75, pop: 3.3, t: 3 },
    { n: 'Ulaanbaatar', lat: 47.92, lon: 106.92, pop: 1.5, t: 3 },
    { n: 'Almaty', lat: 43.24, lon: 76.95, pop: 2.0, t: 3 },
    { n: 'Tashkent', lat: 41.30, lon: 69.28, pop: 2.6, t: 3 },
    { n: 'Kabul', lat: 34.53, lon: 69.17, pop: 4.4, t: 3 },
    { n: 'Colombo', lat: 6.93, lon: 79.85, pop: 0.8, t: 3 },
    { n: 'Kathmandu', lat: 27.72, lon: 85.32, pop: 1.5, t: 3 },
    { n: 'Yangon', lat: 16.87, lon: 96.20, pop: 5.4, t: 3 },
    { n: 'Hanoi', lat: 21.03, lon: 105.85, pop: 8.1, t: 3 },
    { n: 'Phnom Penh', lat: 11.56, lon: 104.93, pop: 2.1, t: 3 },
    { n: 'Doha', lat: 25.29, lon: 51.53, pop: 2.4, t: 3 },
    { n: 'Dubai', lat: 25.20, lon: 55.27, pop: 3.5, t: 3 },
    { n: 'Abu Dhabi', lat: 24.45, lon: 54.65, pop: 1.5, t: 3 },
    { n: 'Tel Aviv', lat: 32.08, lon: 34.78, pop: 4.2, t: 3 },
    { n: 'Beirut', lat: 33.89, lon: 35.50, pop: 2.4, t: 3 },
    { n: 'Muscat', lat: 23.59, lon: 58.59, pop: 1.4, t: 3 },
    // Americas
    { n: 'Boston', lat: 42.36, lon: -71.06, pop: 4.9, t: 3 },
    { n: 'Seattle', lat: 47.61, lon: -122.33, pop: 4.0, t: 3 },
    { n: 'Denver', lat: 39.74, lon: -104.99, pop: 2.9, t: 3 },
    { n: 'Houston', lat: 29.76, lon: -95.37, pop: 7.1, t: 3 },
    { n: 'Atlanta', lat: 33.75, lon: -84.39, pop: 6.1, t: 3 },
    { n: 'Dallas', lat: 32.78, lon: -96.80, pop: 7.6, t: 3 },
    { n: 'Phoenix', lat: 33.45, lon: -112.07, pop: 4.9, t: 3 },
    { n: 'Havana', lat: 23.11, lon: -82.37, pop: 2.1, t: 3 },
    { n: 'Panama City', lat: 8.98, lon: -79.52, pop: 1.9, t: 3 },
    { n: 'Medellín', lat: 6.25, lon: -75.56, pop: 4.0, t: 3 },
    { n: 'Quito', lat: -0.18, lon: -78.47, pop: 2.8, t: 3 },
    { n: 'Caracas', lat: 10.49, lon: -66.88, pop: 2.9, t: 3 },
    { n: 'Montevideo', lat: -34.88, lon: -56.17, pop: 1.8, t: 3 },
    { n: 'Montreal', lat: 45.50, lon: -73.57, pop: 4.2, t: 3 },
    { n: 'Vancouver', lat: 49.28, lon: -123.12, pop: 2.6, t: 3 },
    { n: 'Brasília', lat: -15.78, lon: -47.93, pop: 4.7, t: 3 },
    // Africa
    { n: 'Cape Town', lat: -33.93, lon: 18.42, pop: 4.6, t: 3 },
    { n: 'Abuja', lat: 9.06, lon: 7.49, pop: 3.6, t: 3 },
    { n: 'Luanda', lat: -8.84, lon: 13.23, pop: 8.3, t: 3 },
    { n: 'Kampala', lat: 0.35, lon: 32.58, pop: 3.7, t: 3 },
    { n: 'Maputo', lat: -25.97, lon: 32.57, pop: 1.8, t: 3 },
    { n: 'Tunis', lat: 36.81, lon: 10.18, pop: 2.4, t: 3 },
    { n: 'Algiers', lat: 36.75, lon: 3.06, pop: 3.4, t: 3 },
    { n: 'Khartoum', lat: 15.59, lon: 32.53, pop: 5.8, t: 3 },
    // Oceania
    { n: 'Brisbane', lat: -27.47, lon: 153.03, pop: 2.6, t: 3 },
    { n: 'Perth', lat: -31.95, lon: 115.86, pop: 2.1, t: 3 },
    { n: 'Wellington', lat: -41.29, lon: 174.78, pop: 0.4, t: 3 },
    { n: 'Fiji', lat: -18.14, lon: 178.44, pop: 0.09, t: 3 },

    // ════════════ TIER 4: Notable places & landmarks (closest zoom) ════════════
    // Arctic & Antarctic
    { n: 'Svalbard', lat: 78.22, lon: 15.63, pop: 0.003, t: 4 },
    { n: 'McMurdo', lat: -77.85, lon: 166.67, pop: 0.001, t: 4 },
    { n: 'Nuuk', lat: 64.17, lon: -51.74, pop: 0.02, t: 4 },
    { n: 'Tromsø', lat: 69.65, lon: 18.96, pop: 0.08, t: 4 },
    // Islands & Remote
    { n: 'Easter Island', lat: -27.11, lon: -109.35, pop: 0.008, t: 4 },
    { n: 'Honolulu', lat: 21.31, lon: -157.86, pop: 1.0, t: 4 },
    { n: 'Reykjavik', lat: 64.15, lon: -21.94, pop: 0.2, t: 4 },
    { n: 'Ushuaia', lat: -54.80, lon: -68.30, pop: 0.08, t: 4 },
    { n: 'Anchorage', lat: 61.22, lon: -149.89, pop: 0.3, t: 4 },
    { n: 'Tahiti', lat: -17.54, lon: -149.57, pop: 0.03, t: 4 },
    { n: 'Galápagos', lat: -0.95, lon: -90.97, pop: 0.03, t: 4 },
    { n: 'Madagascar', lat: -18.91, lon: 47.52, pop: 0.3, t: 4 },
    { n: 'Maldives', lat: 4.17, lon: 73.51, pop: 0.2, t: 4 },
    { n: 'Bora Bora', lat: -16.50, lon: -151.74, pop: 0.01, t: 4 },
    { n: 'Zanzibar', lat: -6.16, lon: 39.19, pop: 0.2, t: 4 },
    { n: 'Bermuda', lat: 32.32, lon: -64.76, pop: 0.06, t: 4 },
    // Historic & Cultural
    { n: 'Kyoto', lat: 35.01, lon: 135.77, pop: 1.5, t: 4 },
    { n: 'Venice', lat: 45.44, lon: 12.32, pop: 0.3, t: 4 },
    { n: 'Florence', lat: 43.77, lon: 11.25, pop: 0.4, t: 4 },
    { n: 'Jerusalem', lat: 31.77, lon: 35.23, pop: 0.9, t: 4 },
    { n: 'Mecca', lat: 21.43, lon: 39.83, pop: 2.0, t: 4 },
    { n: 'Lhasa', lat: 29.65, lon: 91.11, pop: 0.9, t: 4 },
    { n: 'Petra', lat: 30.33, lon: 35.44, pop: 0.03, t: 4 },
    { n: 'Machu Picchu', lat: -13.16, lon: -72.55, pop: 0.001, t: 4 },
    { n: 'Angkor Wat', lat: 13.41, lon: 103.87, pop: 0.001, t: 4 },
    { n: 'Chernobyl', lat: 51.39, lon: 30.10, pop: 0.001, t: 4 },
    { n: 'Pompeii', lat: 40.75, lon: 14.49, pop: 0.03, t: 4 },
    { n: 'Timbuktu', lat: 16.77, lon: -3.01, pop: 0.05, t: 4 },
    // Tech Hubs
    { n: 'Shenzhen', lat: 22.54, lon: 114.06, pop: 12.5, t: 4 },
    { n: 'Bangalore', lat: 12.97, lon: 77.59, pop: 12.3, t: 4 },
    { n: 'Austin', lat: 30.27, lon: -97.74, pop: 2.3, t: 4 },
    { n: 'Tel Aviv', lat: 32.08, lon: 34.78, pop: 4.2, t: 4 },
    { n: 'Tallinn', lat: 59.44, lon: 24.75, pop: 0.4, t: 4 },
    // Natural Wonders
    { n: 'Mt Everest', lat: 27.99, lon: 86.93, pop: 0, t: 4 },
    { n: 'Mariana Trench', lat: 11.33, lon: 142.20, pop: 0, t: 4 },
    { n: 'Grand Canyon', lat: 36.11, lon: -112.11, pop: 0, t: 4 },
    { n: 'Victoria Falls', lat: -17.92, lon: 25.86, pop: 0, t: 4 },
    { n: 'Great Barrier Reef', lat: -18.29, lon: 147.70, pop: 0, t: 4 },
    { n: 'Sahara', lat: 23.42, lon: 25.66, pop: 0, t: 4 },
    { n: 'Amazon Basin', lat: -3.47, lon: -62.22, pop: 0, t: 4 },
    { n: 'Yellowstone', lat: 44.43, lon: -110.59, pop: 0, t: 4 },
    { n: 'K2', lat: 35.88, lon: 76.51, pop: 0, t: 4 },
    { n: 'Kilimanjaro', lat: -3.07, lon: 37.35, pop: 0, t: 4 },
];

export const NUCLEAR_SITES = [
    { n: 'TRINITY', lat: 33.68, lon: -106.48, tests: 1, yr: 1945, note: 'First detonation. It worked.' },
    { n: 'HIROSHIMA', lat: 34.39, lon: 132.45, tests: 1, yr: 1945, note: 'Combat. You opened the box.' },
    { n: 'NAGASAKI', lat: 32.77, lon: 129.87, tests: 1, yr: 1945, note: 'Combat. To prove it wasn\'t a fluke.' },
    { n: 'NEVADA TEST SITE', lat: 37.12, lon: -116.06, tests: 928, yr: 1951, note: 'Irradiating their own desert for science.' },
    { n: 'SEMIPALATINSK', lat: 50.07, lon: 78.43, tests: 456, yr: 1949, note: 'The Soviet sandbox. Still glows.' },
    { n: 'NOVAYA ZEMLYA', lat: 73.37, lon: 54.98, tests: 130, yr: 1955, note: 'Tsar Bomba. 50 Megatons of pure hubris.' },
    { n: 'BIKINI ATOLL', lat: 11.59, lon: 165.38, tests: 67, yr: 1946, note: 'Vaporized paradise.' },
    { n: 'MORUROA', lat: -21.87, lon: -138.90, tests: 181, yr: 1966, note: 'French imperialism with a bang.' },
    { n: 'LHASA (CHINA)', lat: 40.00, lon: 90.00, tests: 45, yr: 1964, note: 'Lop Nur. Desert echoes.' },
    { n: 'MARALINGA', lat: -30.16, lon: 131.61, tests: 7, yr: 1956, note: 'British bombs on Aboriginal sacred land.' },
    { n: 'CHRISTMAS ISLAND', lat: 1.99, lon: -157.47, tests: 31, yr: 1957, note: 'Pacific paradise, nuclear test site.' },
    { n: 'PUNGGYE-RI', lat: 41.28, lon: 129.08, tests: 6, yr: 2006, note: 'North Korea. Underground. Concerning.' },
];

export const CONFLICT_ZONES = [
    { n: 'UKRAINE', lat: 48.38, lon: 37.62, sev: 1.0, note: 'Trench warfare with drones.' },
    { n: 'GAZA', lat: 31.35, lon: 34.31, sev: 1.0, note: 'Maximum destruction, minimum space.' },
    { n: 'YEMEN', lat: 15.35, lon: 44.21, sev: .8, note: 'The forgotten catastrophe.' },
    { n: 'SUDAN', lat: 15.50, lon: 32.53, sev: .9, note: 'Civil war over resources that don\'t exist.' },
    { n: 'MYANMAR', lat: 19.76, lon: 96.07, sev: .7, note: 'Junta vs everyone.' },
    { n: 'DR CONGO', lat: -1.67, lon: 29.22, sev: .7, note: 'Bleeding for your smartphone batteries.' },
    { n: 'ETHIOPIA (TIGRAY)', lat: 13.50, lon: 39.47, sev: .6, note: 'Famine as a weapon of war.' },
    { n: 'SOMALIA', lat: 2.05, lon: 45.32, sev: .6, note: 'Failed state, ongoing tragedy.' },
    { n: 'SYRIA', lat: 35.00, lon: 38.00, sev: .5, note: 'More factions than solutions.' },
];

export const CABLES = [
    { from: [50.0, -5.5], to: [40.7, -74.0], n: 'TAT-14' },
    { from: [1.3, 103.8], to: [34.0, 136.0], n: 'SJC' },
    { from: [22.3, 114.2], to: [-33.9, 151.2], n: 'APCN-2' },
    { from: [6.5, 3.4], to: [-23.0, -43.2], n: 'SAIL' },
    { from: [36.8, -5.7], to: [36.9, 10.2], n: 'SEA-ME-WE 4' },
    { from: [51.5, -0.1], to: [1.3, 103.8], n: 'FLAG' },
    { from: [37.8, -122.4], to: [35.7, 139.7], n: 'UNITY' },
    { from: [25.8, -80.2], to: [-34.6, -58.4], n: 'SAm-1' },
    { from: [-33.9, 18.4], to: [19.1, 72.9], n: '2Africa' },
    { from: [33.6, -7.6], to: [6.5, 3.4], n: 'MainOne' },
];

export const FLIGHT_ROUTES = [
    { from: [51.47, -0.46], to: [40.64, -73.78], n: 'LHR-JFK' },
    { from: [25.25, 55.36], to: [1.36, 103.99], n: 'DXB-SIN' },
    { from: [35.55, 139.78], to: [33.94, -118.41], n: 'NRT-LAX' },
    { from: [49.01, 2.55], to: [22.31, 113.91], n: 'CDG-HKG' },
    { from: [40.64, -73.78], to: [33.94, -118.41], n: 'JFK-LAX' },
    { from: [-33.95, 151.18], to: [1.36, 103.99], n: 'SYD-SIN' },
    { from: [51.47, -0.46], to: [25.25, 55.36], n: 'LHR-DXB' },
    { from: [49.01, 2.55], to: [40.64, -73.78], n: 'CDG-JFK' },
    { from: [-23.63, -46.66], to: [38.77, -9.13], n: 'GRU-LIS' },
    { from: [37.46, 126.44], to: [35.55, 139.78], n: 'ICN-NRT' },
];

export const SEISMIC_ZONES = [
    { n: 'RING OF FIRE - W.PACIFIC', lat: 35.0, lon: 140.0, mag: 9.1 },
    { n: 'RING OF FIRE - E.PACIFIC', lat: -33.0, lon: -72.0, mag: 9.5 },
    { n: 'SAN ANDREAS FAULT', lat: 36.0, lon: -120.5, mag: 7.9 },
    { n: 'ANATOLIAN FAULT', lat: 37.5, lon: 36.0, mag: 7.8 },
    { n: 'HIMALAYAN FRONT', lat: 28.5, lon: 84.5, mag: 8.0 },
    { n: 'MID-ATLANTIC RIDGE', lat: 33.0, lon: -40.0, mag: 6.5 },
    { n: 'JAVA TRENCH', lat: -8.0, lon: 110.0, mag: 9.1 },
    { n: 'EAST AFRICAN RIFT', lat: -2.5, lon: 35.5, mag: 7.0 },
    { n: 'CASCADIA ZONE', lat: 45.0, lon: -124.0, mag: 9.0 },
    { n: 'NEW MADRID ZONE', lat: 36.5, lon: -89.6, mag: 7.5 },
];

export const POP_CENTERS = [
    { n: 'Ganges Delta', lat: 22.5, lon: 90.0, d: 1.0 },
    { n: 'Yangtze Delta', lat: 31.0, lon: 121.5, d: 0.95 },
    { n: 'Tokyo Metro', lat: 35.7, lon: 139.7, d: 0.92 },
    { n: 'Java', lat: -7.0, lon: 110.0, d: 0.88 },
    { n: 'Nile Valley', lat: 30.0, lon: 31.2, d: 0.85 },
    { n: 'Pearl River', lat: 23.0, lon: 113.5, d: 0.82 },
    { n: 'US NE Corridor', lat: 40.5, lon: -74.0, d: 0.75 },
    { n: 'Rhine-Ruhr', lat: 51.2, lon: 7.0, d: 0.7 },
    { n: 'Lagos Basin', lat: 6.5, lon: 3.5, d: 0.78 },
    { n: 'São Paulo Metro', lat: -23.5, lon: -46.6, d: 0.72 },
];

// ════════════════════════════════════════════════════════════════
// VOLCANOES — Major active/dormant volcanoes worldwide
// Source: Smithsonian Global Volcanism Program
// ════════════════════════════════════════════════════════════════
export const VOLCANOES = [
    // Pacific Ring of Fire - Western Pacific
    { n: 'MOUNT FUJI', lat: 35.36, lon: 138.73, type: 'Stratovolcano', status: 'Active', lastEruption: '1707', note: 'Sacred mountain that will eventually betray every postcard printed of it.' },
    { n: 'SAKURAJIMA', lat: 31.58, lon: 130.66, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Erupts almost daily. The neighbours pretend this is fine.' },
    { n: 'MOUNT ASO', lat: 32.88, lon: 131.10, type: 'Caldera', status: 'Active', lastEruption: '2021', note: 'Largest caldera in Japan. The tourists are inside it.' },
    { n: 'PINATUBO', lat: 15.14, lon: 120.35, type: 'Stratovolcano', status: 'Active', lastEruption: '1991', note: 'Cooled the planet by 0.5°C. Briefly undid human damage. Briefly.' },
    { n: 'TAAL', lat: 14.01, lon: 120.99, type: 'Caldera', status: 'Active', lastEruption: '2022', note: 'A volcano on an island in a lake on an island. Geology trolling geography.' },
    { n: 'KRAKATOA', lat: -6.10, lon: 105.42, type: 'Caldera', status: 'Active', lastEruption: '2023', note: 'Destroyed itself in 1883 then rebuilt. The cockroach of volcanoes.' },
    { n: 'MERAPI', lat: -7.54, lon: 110.45, type: 'Stratovolcano', status: 'Active', lastEruption: '2023', note: 'Most active in Indonesia. A country of 127 active volcanoes.' },
    { n: 'MOUNT AGUNG', lat: -8.34, lon: 115.51, type: 'Stratovolcano', status: 'Active', lastEruption: '2019', note: 'Bali\'s sacred destroyer. The tourists still come.' },
    { n: 'MOUNT SEMERU', lat: -8.11, lon: 112.92, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Java\'s tallest. Currently having a tantrum.' },
    { n: 'MOUNT RUAPEHU', lat: -39.28, lon: 175.57, type: 'Stratovolcano', status: 'Active', lastEruption: '2007', note: 'They built a ski resort on it. Peak human decision-making.' },
    { n: 'WHITE ISLAND', lat: -37.52, lon: 177.18, type: 'Stratovolcano', status: 'Active', lastEruption: '2019', note: 'Tour operators took tourists into the crater. It ended predictably.' },
    // Pacific Ring of Fire - Eastern Pacific
    { n: 'MOUNT ST. HELENS', lat: 46.20, lon: -122.18, type: 'Stratovolcano', status: 'Active', lastEruption: '2008', note: 'Blew its top in 1980. Literally. The mountain is shorter now.' },
    { n: 'MOUNT RAINIER', lat: 46.85, lon: -121.76, type: 'Stratovolcano', status: 'Active', lastEruption: '1894', note: 'Seattle built a city in its lahar zone. Bold.' },
    { n: 'MOUNT SHASTA', lat: 41.41, lon: -122.19, type: 'Stratovolcano', status: 'Active', lastEruption: '1250', note: 'Dormant, plotting, covered in New Age conspiracy theories.' },
    { n: 'YELLOWSTONE', lat: 44.43, lon: -110.59, type: 'Supervolcano', status: 'Active', lastEruption: '-70000', note: 'Extinction-level event parked under a national park. Humans camp on it.' },
    { n: 'KILAUEA', lat: 19.42, lon: -155.29, type: 'Shield', status: 'Erupting', lastEruption: '2024', note: 'Continuously creating and destroying real estate simultaneously.' },
    { n: 'MAUNA LOA', lat: 19.48, lon: -155.61, type: 'Shield', status: 'Active', lastEruption: '2022', note: 'Largest active volcano on Earth. The ocean hides most of it.' },
    { n: 'POPOCATÉPETL', lat: 19.02, lon: -98.63, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: '25 million people live within blast radius. Mexico City doesn\'t care.' },
    { n: 'COLIMA', lat: 19.51, lon: -103.62, type: 'Stratovolcano', status: 'Active', lastEruption: '2019', note: 'Most active in Mexico. A persistent geological complaint.' },
    // South America
    { n: 'COTOPAXI', lat: -0.68, lon: -78.44, type: 'Stratovolcano', status: 'Active', lastEruption: '2023', note: 'Perfect cone. Will destroy Quito. Very photogenic.' },
    { n: 'VILLARRICA', lat: -39.42, lon: -71.93, type: 'Stratovolcano', status: 'Active', lastEruption: '2024', note: 'Chile\'s most active. They ski on it. Of course they do.' },
    // Europe & Atlantic
    { n: 'MOUNT ETNA', lat: 37.75, lon: 14.99, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Europe\'s most active. Sicily treats it as a tourist attraction. Correct.' },
    { n: 'STROMBOLI', lat: 38.79, lon: 15.21, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Has been erupting for 2000 years. The original lighthouse.' },
    { n: 'VESUVIUS', lat: 40.82, lon: 14.43, type: 'Stratovolcano', status: 'Active', lastEruption: '1944', note: 'Buried Pompeii. 3 million now live in the danger zone. Lesson: unlearned.' },
    { n: 'EYJAFJALLAJÖKULL', lat: 63.63, lon: -19.61, type: 'Stratovolcano', status: 'Active', lastEruption: '2010', note: 'Grounded all European flights. A volcano no newsreader could pronounce.' },
    { n: 'KATLA', lat: 63.59, lon: -19.05, type: 'Subglacial', status: 'Active', lastEruption: '1918', note: 'Overdue. Under a glacier. Will produce biblical flooding.' },
    { n: 'BÁRÐARBUNGA', lat: 64.64, lon: -17.53, type: 'Stratovolcano', status: 'Active', lastEruption: '2015', note: 'Iceland\'s largest caldera. Produced the biggest lava flow in 200 years.' },
    { n: 'FAGRADALSFJALL', lat: 63.88, lon: -22.27, type: 'Shield', status: 'Erupting', lastEruption: '2024', note: 'Keeps erupting near Reykjavik. The Icelanders grill hotdogs and watch.' },
    { n: 'LA PALMA (CUMBRE VIEJA)', lat: 28.57, lon: -17.84, type: 'Stratovolcano', status: 'Active', lastEruption: '2021', note: 'Buried a town in lava. The conspiracy theorists wanted a mega-tsunami.' },
    // Africa & Middle East
    { n: 'MOUNT NYIRAGONGO', lat: -1.52, lon: 29.25, type: 'Stratovolcano', status: 'Active', lastEruption: '2021', note: 'World\'s largest lava lake. Looms over Goma. 2 million in the path.' },
    { n: 'ERTA ALE', lat: 13.60, lon: 40.67, type: 'Shield', status: 'Erupting', lastEruption: '2024', note: 'Permanent lava lake in the Danakil Depression. Hottest place on Earth.' },
    { n: 'MOUNT KILIMANJARO', lat: -3.07, lon: 37.35, type: 'Stratovolcano', status: 'Dormant', lastEruption: '-360000', note: 'Not dead, just sleeping. The glaciers are melting off it regardless.' },
    { n: 'OL DOINYO LENGAI', lat: -2.76, lon: 35.91, type: 'Stratovolcano', status: 'Active', lastEruption: '2024', note: 'Only volcano that erupts carbonatite lava. Cool to the touch. Literally.' },
    // Indonesia extended
    { n: 'MOUNT TAMBORA', lat: -8.25, lon: 118.00, type: 'Stratovolcano', status: 'Active', lastEruption: '1967', note: '1815 eruption caused "Year Without a Summer." Global famine. VEI 7.' },
    { n: 'MOUNT SINABUNG', lat: 3.17, lon: 98.39, type: 'Stratovolcano', status: 'Active', lastEruption: '2021', note: 'Woke up in 2010 after 400 years. Currently very grumpy.' },
    // Russia / Kamchatka
    { n: 'KLYUCHEVSKOY', lat: 56.06, lon: 160.64, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Highest active volcano in Eurasia. Erupts roughly every year.' },
    { n: 'SHIVELUCH', lat: 56.65, lon: 161.36, type: 'Stratovolcano', status: 'Active', lastEruption: '2023', note: 'Most explosive in Kamchatka. No one lives near it. Wise.' },
    // Caribbean
    { n: 'SOUFRIÈRE HILLS', lat: 16.72, lon: -62.18, type: 'Stratovolcano', status: 'Active', lastEruption: '2013', note: 'Destroyed Montserrat\'s capital. Two-thirds of the island evacuated permanently.' },
    { n: 'LA SOUFRIÈRE', lat: 13.33, lon: -61.18, type: 'Stratovolcano', status: 'Active', lastEruption: '2021', note: 'St. Vincent. Erupted during a pandemic. The universe piling on.' },
    // Antarctica
    { n: 'MOUNT EREBUS', lat: -77.53, lon: 167.17, type: 'Stratovolcano', status: 'Erupting', lastEruption: '2024', note: 'Southernmost active volcano. Lava lake at the bottom of the world.' },
    // Western US
    { n: 'MOUNT HOOD', lat: 45.37, lon: -121.70, type: 'Stratovolcano', status: 'Active', lastEruption: '1866', note: 'Oregon\'s highest. Portland\'s scenic time bomb.' },
    // Philippines extended
    { n: 'MAYON', lat: 13.26, lon: 123.69, type: 'Stratovolcano', status: 'Active', lastEruption: '2024', note: 'The world\'s most perfect volcanic cone. Deadly and beautiful.' },
    // New Zealand
    { n: 'MOUNT TARANAKI', lat: -39.30, lon: 174.06, type: 'Stratovolcano', status: 'Active', lastEruption: '1854', note: 'Overdue. The insurance industry is nervous.' },
    // Japan extended
    { n: 'MOUNT UNZEN', lat: 32.76, lon: 130.29, type: 'Stratovolcano', status: 'Active', lastEruption: '1996', note: 'Killed 43 with pyroclastic flows in 1991. Including the volcanologists filming it.' },
];

// ════════════════════════════════════════════════════════════════
// SHIPPING ROUTES — Top 40 global maritime trade routes
// Source: IMO major shipping lane data
// ════════════════════════════════════════════════════════════════
export const SHIPPING_ROUTES = [
    // Asia - Europe (via Suez)
    { from: [31.27, 32.31], to: [22.28, 114.17], n: 'SUEZ-HONG KONG', note: 'The jugular vein of global trade.' },
    { from: [1.26, 103.84], to: [31.27, 32.31], n: 'SINGAPORE-SUEZ', note: 'Every container of cheap goods passes through here.' },
    { from: [51.89, 4.47], to: [31.27, 32.31], n: 'ROTTERDAM-SUEZ', note: 'Europe\'s artery to Asia. One stuck ship paralysed it in 2021.' },
    { from: [53.55, 9.99], to: [22.28, 114.17], n: 'HAMBURG-HONG KONG', note: 'German engineering meets Chinese manufacturing.' },
    // Trans-Pacific
    { from: [34.74, 135.19], to: [33.72, -118.26], n: 'OSAKA-LOS ANGELES', note: 'The Pacific highway of consumer electronics.' },
    { from: [22.28, 114.17], to: [33.72, -118.26], n: 'HONG KONG-LA', note: 'Where your Amazon packages begin their journey.' },
    { from: [31.23, 121.47], to: [47.61, -122.34], n: 'SHANGHAI-SEATTLE', note: 'Container ships the size of aircraft carriers.' },
    { from: [35.17, 129.08], to: [49.29, -123.11], n: 'BUSAN-VANCOUVER', note: 'South Korea to Canada. K-pop by sea.' },
    { from: [1.26, 103.84], to: [33.72, -118.26], n: 'SINGAPORE-LA', note: 'Southeast Asia to the US. 7,800 nautical miles of freight.' },
    // Trans-Atlantic
    { from: [51.89, 4.47], to: [40.67, -74.04], n: 'ROTTERDAM-NEW YORK', note: 'The old world sending goods to the new. Again.' },
    { from: [53.55, 9.99], to: [29.95, -90.07], n: 'HAMBURG-NEW ORLEANS', note: 'Into the Gulf. Oil, grain, chemicals.' },
    { from: [50.95, 1.86], to: [42.35, -71.06], n: 'CALAIS-BOSTON', note: 'Cross-Atlantic express.' },
    // Middle East Oil Routes
    { from: [26.23, 50.21], to: [1.26, 103.84], n: 'BAHRAIN-SINGAPORE', note: 'Liquid dinosaurs heading east.' },
    { from: [25.42, 56.37], to: [34.74, 135.19], n: 'FUJAIRAH-OSAKA', note: 'Hormuz Strait oil. The world\'s most valuable chokepoint.' },
    { from: [26.23, 50.21], to: [22.28, 114.17], n: 'PERSIAN GULF-HK', note: 'Oil feeding the factory of the world.' },
    { from: [25.42, 56.37], to: [51.89, 4.47], n: 'FUJAIRAH-ROTTERDAM', note: 'Arab oil to European refineries.' },
    { from: [25.42, 56.37], to: [40.67, -74.04], n: 'FUJAIRAH-NEW YORK', note: 'The tanker highway across the Atlantic.' },
    // Panama Canal routes
    { from: [9.0, -79.5], to: [40.67, -74.04], n: 'PANAMA-NEW YORK', note: 'Shortcut between oceans. Humans carved through a continent for this.' },
    { from: [22.28, 114.17], to: [9.0, -79.5], n: 'HONG KONG-PANAMA', note: 'Asia to the Americas via the ditch.' },
    { from: [9.0, -79.5], to: [-23.55, -46.63], n: 'PANAMA-SAO PAULO', note: 'Latin American trade loop.' },
    // Africa & South routes
    { from: [-33.92, 18.42], to: [51.89, 4.47], n: 'CAPE TOWN-ROTTERDAM', note: 'Around the Cape. The original route before Suez.' },
    { from: [6.45, 3.39], to: [51.89, 4.47], n: 'LAGOS-ROTTERDAM', note: 'Nigerian oil heading north.' },
    { from: [-33.92, 18.42], to: [22.28, 114.17], n: 'CAPE TOWN-HONG KONG', note: 'The long way around. When Suez gets jammed.' },
    { from: [-33.87, 151.21], to: [31.23, 121.47], n: 'SYDNEY-SHANGHAI', note: 'Iron ore and coal. Australia\'s real export.' },
    // Strait of Malacca
    { from: [1.26, 103.84], to: [-6.12, 106.85], n: 'SINGAPORE-JAKARTA', note: 'The narrowest bottleneck in global trade.' },
    { from: [1.26, 103.84], to: [13.76, 100.50], n: 'SINGAPORE-BANGKOK', note: 'Intra-ASEAN trade corridor.' },
    // Arctic emerging
    { from: [69.65, 18.96], to: [35.17, 129.08], n: 'TROMSØ-BUSAN (ARCTIC)', note: 'Northern Sea Route. Climate change opened a shortcut. Silver lining of doom.' },
    // India trade
    { from: [19.08, 72.88], to: [1.26, 103.84], n: 'MUMBAI-SINGAPORE', note: 'India to Southeast Asia. Spice route modernised.' },
    { from: [19.08, 72.88], to: [51.89, 4.47], n: 'MUMBAI-ROTTERDAM', note: 'Indian goods heading west through Suez.' },
    // South America
    { from: [-23.55, -46.63], to: [51.89, 4.47], n: 'SANTOS-ROTTERDAM', note: 'Brazilian commodities feeding Europe.' },
    { from: [-34.60, -58.38], to: [22.28, 114.17], n: 'B.AIRES-HONG KONG', note: 'Soybeans and beef crossing the globe.' },
    // Grain routes
    { from: [46.48, 30.74], to: [30.04, 31.24], n: 'ODESSA-ALEXANDRIA', note: 'Ukrainian grain. When the war allows it.' },
    { from: [29.95, -90.07], to: [6.45, 3.39], n: 'NEW ORLEANS-LAGOS', note: 'American grain to West Africa.' },
];
