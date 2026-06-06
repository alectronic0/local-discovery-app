/**
 * transport.js — Fetch and render rail and bus routes from OpenStreetMap
 * Uses Overpass API (free, no key required)
 * Includes real network colours, stations, and stops
 */

let cachedRailLines = null;
let cachedBusRoutes = null;
let cachedRailStations = null;
let cachedBusStops = null;

// Store rendered objects for toggling visibility
let transportRailPolylines = [];
let transportBusPolylines = [];
let transportRailMarkers = [];
let transportBusMarkers = [];
let currentMap = null;

// South East England bounds (includes Herts, London, surrounding counties)
const TRANSPORT_BOUNDS = {
    south: 51.30,  // South coast
    west: -0.80,   // West (Berkshire)
    north: 52.20,  // North (Cambridgeshire)
    east: 0.40     // East (Kent)
};

// Rail line colour mapping (based on TfL/Network Rail line names)
const RAIL_LINE_COLOURS = {
    'Great Northern': '#FDB913',      // Yellow
    'Thameslink': '#0019A8',          // Blue
    'Piccadilly': '#003EBA',          // Dark blue
    'Metropolitan': '#6B2C3B',        // Maroon
    'District': '#007D32',            // Green
    'Circle': '#FFD300',              // Yellow
    'Hammersmith & City': '#E21836',  // Pink
    'Central': '#E21836',             // Red
    'Northern': '#000000',            // Black
    'Jubilee': '#626262',             // Grey
    'Victoria': '#0098D4',            // Light blue
    'Bakerloo': '#B26300',            // Brown
    'London Overground': '#EE7E0B',   // Orange
    'DLR': '#00BFB3',                 // Teal
    'Eurostar': '#003498',            // Purple
    'default': '#CC0000'              // Red default
};

/**
 * Build Overpass API bbox query string
 * Format: (south,west,north,east)
 */
function getBboxString(bounds) {
    return `(${bounds.south},${bounds.west},${bounds.north},${bounds.east})`;
}

/**
 * Fetch rail lines — tries local GeoJSON first, then Overpass API as fallback
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
async function loadRailLines() {
    if (cachedRailLines) {
        return cachedRailLines;
    }

    // Try local static GeoJSON first
    try {
        console.log('Loading rail lines from static data...');
        const response = await fetch('data/rail-lines.geojson');
        if (response.ok) {
            cachedRailLines = await response.json();
            console.log(`Loaded ${cachedRailLines.features.length} rail lines from static data`);
            return cachedRailLines;
        }
    } catch (error) {
        console.warn('Could not load static rail data:', error.message);
    }

    // Fallback to Overpass API
    try {
        console.log('Falling back to Overpass API for rail lines...');
        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const bbox = getBboxString(TRANSPORT_BOUNDS);
        const query = `[bbox:${bbox}];way["railway"="rail"];out geom;`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for fallback

        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Overpass API error:', response.status);
            return cachedRailLines || null;
        }

        const data = await response.json();
        cachedRailLines = osmToGeoJSON(data, 'rail');
        console.log(`Loaded ${cachedRailLines.features.length} rail lines from Overpass`);
        return cachedRailLines;
    } catch (error) {
        console.warn('Overpass API unavailable:', error.message);
        return cachedRailLines || null;
    }
}

/**
 * Fetch bus routes — tries local GeoJSON first, then Overpass API as fallback
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
async function loadBusRoutes() {
    if (cachedBusRoutes) {
        return cachedBusRoutes;
    }

    // Try local static GeoJSON first
    try {
        console.log('Loading bus routes from static data...');
        const response = await fetch('data/bus-routes.geojson');
        if (response.ok) {
            cachedBusRoutes = await response.json();
            console.log(`Loaded ${cachedBusRoutes.features.length} bus routes from static data`);
            return cachedBusRoutes;
        }
    } catch (error) {
        console.warn('Could not load static bus data:', error.message);
    }

    // Fallback to Overpass API
    try {
        console.log('Falling back to Overpass API for bus routes...');
        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const bbox = getBboxString(TRANSPORT_BOUNDS);
        const query = `[bbox:${bbox}];way["route"="bus"];out geom;`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Overpass API error:', response.status);
            return cachedBusRoutes || null;
        }

        const data = await response.json();
        cachedBusRoutes = osmToGeoJSON(data, 'bus');
        console.log(`Loaded ${cachedBusRoutes.features.length} bus routes from Overpass`);
        return cachedBusRoutes;
    } catch (error) {
        console.warn('Overpass API unavailable:', error.message);
        return cachedBusRoutes || null;
    }
}

/**
 * Convert OpenStreetMap JSON to GeoJSON
 * Simplified: extracts ways with geometry
 * @param {Object} osmData — OSM Overpass API response
 * @param {string} type — 'rail' or 'bus'
 * @returns {Object} GeoJSON FeatureCollection
 */
function osmToGeoJSON(osmData, type) {
    const features = [];

    if (!osmData.elements) {
        console.warn(`No elements found in OSM data for type: ${type}`);
        return { type: 'FeatureCollection', features: [] };
    }

    console.log(`Processing ${osmData.elements.length} OSM elements for type: ${type}`);

    osmData.elements.forEach(element => {
        console.log(`Element type: ${element.type}, has geometry: ${!!element.geometry}, tags:`, element.tags);

        if (element.type === 'way' && element.geometry) {
            const coordinates = element.geometry.map(node => [node.lon, node.lat]);

            features.push({
                type: 'Feature',
                properties: {
                    id: element.id,
                    type: type,
                    name: element.tags?.name || `${type} route`,
                    ref: element.tags?.ref || '',
                    operator: element.tags?.operator || ''
                },
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }
    });

    console.log(`Converted ${features.length} features for type: ${type}`);
    return {
        type: 'FeatureCollection',
        features: features
    };
}

/**
 * Get rail line colour by name (TfL brand colours)
 * @param {string} lineName — Rail line name from OSM data
 * @returns {string} Hex colour code
 */
function getRailLineColour(lineName) {
    if (!lineName) return RAIL_LINE_COLOURS.default;
    const normalized = lineName.trim().toLowerCase();

    // Check direct matches
    for (const [name, colour] of Object.entries(RAIL_LINE_COLOURS)) {
        if (name !== 'default' && normalized === name.toLowerCase()) {
            return colour;
        }
    }

    // Check partial matches for flexibility
    if (normalized.includes('great northern')) return RAIL_LINE_COLOURS['Great Northern'];
    if (normalized.includes('thameslink')) return RAIL_LINE_COLOURS['Thameslink'];
    if (normalized.includes('piccadilly')) return RAIL_LINE_COLOURS['Piccadilly'];
    if (normalized.includes('metropolitan')) return RAIL_LINE_COLOURS['Metropolitan'];
    if (normalized.includes('district')) return RAIL_LINE_COLOURS['District'];
    if (normalized.includes('circle')) return RAIL_LINE_COLOURS['Circle'];
    if (normalized.includes('hammersmith')) return RAIL_LINE_COLOURS['Hammersmith & City'];
    if (normalized.includes('central')) return RAIL_LINE_COLOURS['Central'];
    if (normalized.includes('northern')) return RAIL_LINE_COLOURS['Northern'];
    if (normalized.includes('jubilee')) return RAIL_LINE_COLOURS['Jubilee'];
    if (normalized.includes('victoria')) return RAIL_LINE_COLOURS['Victoria'];
    if (normalized.includes('bakerloo')) return RAIL_LINE_COLOURS['Bakerloo'];
    if (normalized.includes('overground')) return RAIL_LINE_COLOURS['London Overground'];
    if (normalized.includes('dlr')) return RAIL_LINE_COLOURS['DLR'];
    if (normalized.includes('eurostar')) return RAIL_LINE_COLOURS['Eurostar'];

    return RAIL_LINE_COLOURS.default;
}

/**
 * Get bus route colour by operator
 * @param {string} operator — Bus operator name from OSM data
 * @returns {string} Hex colour code
 */
function getBusRouteColour(operator) {
    if (!operator) return '#0066CC'; // Default blue
    const normalized = operator.trim().toLowerCase();

    // Major operators in South East
    if (normalized.includes('metroline')) return '#DC241F'; // Red
    if (normalized.includes('arriva')) return '#0070C0'; // Blue
    if (normalized.includes('stagecoach')) return '#E31E24'; // Red
    if (normalized.includes('go-ahead') || normalized.includes('goahead')) return '#003DA5'; // Blue
    if (normalized.includes('reading buses')) return '#FFA500'; // Orange
    if (normalized.includes('first')) return '#004B87'; // Dark blue
    if (normalized.includes('national express')) return '#FFD700'; // Gold
    if (normalized.includes('london buses') || normalized.includes('tfl')) return '#DC241F'; // Red

    return '#0066CC'; // Default
}

/**
 * Render rail and bus lines to map with network colours
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} railGeoJSON — Rail lines GeoJSON
 * @param {Object} busGeoJSON — Bus routes GeoJSON
 */
function renderTransportToMap(map, railGeoJSON, busGeoJSON) {
    // Store map reference for toggle operations
    currentMap = map;

    // Clear previous polylines
    transportRailPolylines = [];
    transportBusPolylines = [];

    // Add rail lines with TfL colours
    if (railGeoJSON && railGeoJSON.features.length > 0) {
        railGeoJSON.features.forEach(feature => {
            const lineName = feature.properties.name || feature.properties.ref || 'Rail';
            const colour = getRailLineColour(lineName);

            const polyline = new google.maps.Polyline({
                path: feature.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
                geodesic: true,
                strokeColor: colour,
                strokeOpacity: 0.8,
                strokeWeight: 3,
                map: map,
                title: lineName
            });

            transportRailPolylines.push(polyline);
        });
        console.log('Rendered rail lines to map with network colours');
    }

    // Add bus routes with operator colours
    if (busGeoJSON && busGeoJSON.features.length > 0) {
        busGeoJSON.features.forEach(feature => {
            const routeName = feature.properties.name || feature.properties.ref || 'Bus Route';
            const operator = feature.properties.operator || '';
            const colour = getBusRouteColour(operator);

            const polyline = new google.maps.Polyline({
                path: feature.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
                geodesic: true,
                strokeColor: colour,
                strokeOpacity: 0.6,
                strokeWeight: 2,
                map: map,
                title: `${routeName} (${operator})`
            });

            transportBusPolylines.push(polyline);
        });
        console.log('Rendered bus routes to map with operator colours');
    }
}

/**
 * Fetch rail stations — tries local GeoJSON first, then Overpass API as fallback
 * @returns {Promise<Object>} GeoJSON FeatureCollection of stations
 */
async function loadRailStations() {
    if (cachedRailStations) {
        return cachedRailStations;
    }

    // Try local static GeoJSON first
    try {
        console.log('Loading rail stations from static data...');
        const response = await fetch('data/rail-stations.geojson');
        if (response.ok) {
            cachedRailStations = await response.json();
            console.log(`Loaded ${cachedRailStations.features.length} rail stations from static data`);
            return cachedRailStations;
        }
    } catch (error) {
        console.warn('Could not load static stations data:', error.message);
    }

    // Fallback to Overpass API
    try {
        console.log('Falling back to Overpass API for rail stations...');
        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const bbox = getBboxString(TRANSPORT_BOUNDS);
        const query = `[bbox:${bbox}];node["railway"="station"];out center;`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Overpass API error:', response.status);
            return cachedRailStations || null;
        }

        const data = await response.json();
        cachedRailStations = osmStationsToGeoJSON(data, 'rail');
        console.log(`Loaded ${cachedRailStations.features.length} rail stations from Overpass`);
        return cachedRailStations;
    } catch (error) {
        console.warn('Overpass API unavailable:', error.message);
        return cachedRailStations || null;
    }
}

/**
 * Fetch bus stops from OpenStreetMap (Overpass API)
 * @returns {Promise<Object>} GeoJSON FeatureCollection of stops
 */
async function loadBusStops() {
    if (cachedBusStops) {
        return cachedBusStops;
    }

    // Try local static GeoJSON first
    try {
        console.log('Loading bus stops from static data...');
        const response = await fetch('data/bus-stops.geojson');
        if (response.ok) {
            cachedBusStops = await response.json();
            console.log(`Loaded ${cachedBusStops.features.length} bus stops from static data`);
            return cachedBusStops;
        }
    } catch (error) {
        console.warn('Could not load static bus stops data:', error.message);
    }

    // Fallback to Overpass API
    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    const bbox = getBboxString(TRANSPORT_BOUNDS);
    const query = `[bbox:${bbox}];node["highway"="bus_stop"];out center;`;

    try {
        console.log('Falling back to Overpass API for bus stops...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Overpass API error:', response.status);
            return null;
        }

        const data = await response.json();
        cachedBusStops = osmStopsToGeoJSON(data, 'bus');
        console.log(`Loaded ${cachedBusStops.features.length} bus stops`);
        return cachedBusStops;
    } catch (error) {
        console.error('Error loading bus stops:', error.message);
        return null;
    }
}

/**
 * Convert OSM stations to GeoJSON
 * @param {Object} osmData — OSM Overpass API response
 * @param {string} type — 'rail' or 'tram'
 * @returns {Object} GeoJSON FeatureCollection
 */
function osmStationsToGeoJSON(osmData, type) {
    const features = [];

    if (!osmData.elements) {
        return { type: 'FeatureCollection', features: [] };
    }

    osmData.elements.forEach(element => {
        if (element.type === 'node') {
            features.push({
                type: 'Feature',
                properties: {
                    id: element.id,
                    type: type,
                    name: element.tags?.name || 'Station',
                    ref: element.tags?.ref || ''
                },
                geometry: {
                    type: 'Point',
                    coordinates: [element.lon, element.lat]
                }
            });
        }
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}

/**
 * Convert OSM bus stops to GeoJSON
 * @param {Object} osmData — OSM Overpass API response
 * @param {string} type — 'bus' or 'tram'
 * @returns {Object} GeoJSON FeatureCollection
 */
function osmStopsToGeoJSON(osmData, type) {
    const features = [];

    if (!osmData.elements) {
        return { type: 'FeatureCollection', features: [] };
    }

    osmData.elements.forEach(element => {
        if (element.type === 'node') {
            features.push({
                type: 'Feature',
                properties: {
                    id: element.id,
                    type: type,
                    name: element.tags?.name || 'Stop',
                    ref: element.tags?.ref || ''
                },
                geometry: {
                    type: 'Point',
                    coordinates: [element.lon, element.lat]
                }
            });
        }
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}

/**
 * Render rail stations to map
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} stationsGeoJSON — Stations GeoJSON
 */
function renderStationsToMap(map, stationsGeoJSON) {
    if (!stationsGeoJSON || stationsGeoJSON.features.length === 0) {
        return;
    }

    transportRailMarkers = [];

    stationsGeoJSON.features.forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: feature.properties.name,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding: 8px; font-size: 12px;">
                    <strong>${feature.properties.name}</strong><br>
                    <em>Rail Station</em>
                </div>`
            });
            infoWindow.open(map, marker);
        });

        transportRailMarkers.push(marker);
    });

    console.log(`Rendered ${stationsGeoJSON.features.length} rail stations`);
}

/**
 * Render bus stops to map
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} stopsGeoJSON — Stops GeoJSON
 */
function renderStopsToMap(map, stopsGeoJSON) {
    if (!stopsGeoJSON || stopsGeoJSON.features.length === 0) {
        return;
    }

    transportBusMarkers = [];

    stopsGeoJSON.features.forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: feature.properties.name,
            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding: 8px; font-size: 12px;">
                    <strong>${feature.properties.name}</strong><br>
                    <em>Bus Stop</em>
                </div>`
            });
            infoWindow.open(map, marker);
        });

        transportBusMarkers.push(marker);
    });

    console.log(`Rendered ${stopsGeoJSON.features.length} bus stops`);
}

/**
 * Toggle visibility of transport layers
 * @param {boolean} showRail — Show rail lines and stations
 * @param {boolean} showBus — Show bus routes and stops
 */
function toggleTransportVisibility(showRail, showBus) {
    if (!currentMap) {
        console.warn('Map reference not available for toggle');
        return;
    }

    // Toggle rail polylines
    transportRailPolylines.forEach(polyline => {
        polyline.setMap(showRail ? currentMap : null);
    });
    transportRailMarkers.forEach(marker => {
        marker.setMap(showRail ? currentMap : null);
    });

    // Toggle bus polylines
    transportBusPolylines.forEach(polyline => {
        polyline.setMap(showBus ? currentMap : null);
    });
    transportBusMarkers.forEach(marker => {
        marker.setMap(showBus ? currentMap : null);
    });

    console.log(`Transport visibility: Rail=${showRail}, Bus=${showBus}`);
}
