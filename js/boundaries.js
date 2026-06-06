/**
 * boundaries.js — Fetch and manage UK council boundaries from ONS ArcGIS API
 * Handles GeoJSON fetching, caching, and styling
 */

let cachedBoundaries = null;

/**
 * Fetch all UK council boundaries from ONS ArcGIS FeatureServer
 * Queries all local authorities across England, Scotland, Wales, NI
 * @returns {Promise<Object>} GeoJSON FeatureCollection with all boundaries
 */
async function loadUKBoundaries() {
    if (cachedBoundaries) {
        return cachedBoundaries;
    }

    const ONS_API = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_May_2024_Boundaries_UK_BGC/FeatureServer/0/query';

    // Query all UK authorities
    const whereClause = "LAD24CD LIKE 'E%' OR LAD24CD LIKE 'S%' OR LAD24CD LIKE 'W%' OR LAD24CD LIKE 'N%'";

    const params = new URLSearchParams({
        where: whereClause,
        outFields: 'LAD24CD,LAD24NM',
        f: 'geojson',
        returnGeometry: true
    });

    try {
        const response = await fetch(`${ONS_API}?${params}`);
        const geojson = await response.json();

        if (!geojson.features || geojson.features.length === 0) {
            console.error('No UK councils found from ONS API');
            return null;
        }

        cachedBoundaries = geojson;
        console.log(`Cached ${geojson.features.length} UK council boundaries from ONS`);
        return geojson;
    } catch (error) {
        console.error('Error loading UK boundaries from ONS API:', error);
        return null;
    }
}

/**
 * Add all boundaries to map with styling
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} councilsData — Lookup: GSS code → council metadata
 * @param {Function} onCouncilClick — Click handler callback
 */
function renderBoundariesToMap(map, councilsData, onCouncilClick) {
    // Add GeoJSON to map.data layer
    if (!cachedBoundaries) {
        console.error('No cached boundaries available');
        return;
    }

    map.data.addGeoJson(cachedBoundaries);

    // Style all councils based on region color
    map.data.setStyle((feature) => {
        const gssCode = feature.getProperty('LAD24CD');
        const council = councilsData[gssCode];

        if (!council) {
            return {
                fillColor: '#CCCCCC',
                fillOpacity: 0.1,
                strokeColor: '#999999',
                strokeWeight: 1,
                clickable: true
            };
        }

        return {
            fillColor: getRegionColor(council.region),
            fillOpacity: 0.15,
            strokeColor: getDarkerColor(getRegionColor(council.region)),
            strokeWeight: 1.5,
            clickable: true
        };
    });

    // Click listener for council selection
    map.data.addListener('click', (event) => {
        const gssCode = event.feature.getProperty('LAD24CD');
        const council = councilsData[gssCode];
        if (council && onCouncilClick) {
            onCouncilClick(council);
        }
    });

    console.log('Rendered boundaries to map');
}

/**
 * Get region color for styling
 * @param {string} region — Region name
 * @returns {string} Hex color code
 */
function getRegionColor(region) {
    const colors = {
        'East': '#3B8BD4',
        'East Midlands': '#1E90FF',
        'London': '#EF9F27',
        'North East': '#228B22',
        'North West': '#FF6347',
        'South East': '#4169E1',
        'South West': '#9370DB',
        'West Midlands': '#FF4500',
        'Yorkshire and Humber': '#32CD32',
        'Scotland': '#DC143C',
        'Wales': '#FFD700',
        'Northern Ireland': '#20B2AA'
    };
    return colors[region] || '#CCCCCC';
}

/**
 * Darken a hex color for stroke
 * @param {string} hex — Hex color code
 * @returns {string} Darker hex color
 */
function getDarkerColor(hex) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = -30;
    const usePound = true;
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return (usePound ? '#' : '') + (
        0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

/**
 * Show/hide boundaries by region
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} councilsData — Council metadata lookup
 * @param {Set<string>} visibleRegions — Set of region names to show
 */
function toggleBoundariesByRegion(map, councilsData, visibleRegions) {
    map.data.forEach((feature) => {
        const gssCode = feature.getProperty('LAD24CD');
        const council = councilsData[gssCode];
        if (council) {
            const isVisible = visibleRegions.size === 0 || visibleRegions.has(council.region);
            map.data.setStyle((feat) => {
                if (feat.getProperty('LAD24CD') === gssCode) {
                    return { visible: isVisible };
                }
            });
        }
    });
}
