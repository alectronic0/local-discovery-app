/**
 * retail.js — Fetch and render retail locations from OpenStreetMap
 * Uses Overpass API for shops, supermarkets, restaurants, etc.
 */

let cachedRetailLocations = null;

// Hertfordshire bounds (for retail layer)
const RETAIL_BOUNDS = {
    south: 51.65,
    west: -0.65,
    north: 52.0,
    east: 0.25
};

/**
 * Build Overpass API bbox query string
 */
function getBboxString(bounds) {
    return `(${bounds.south},${bounds.west},${bounds.north},${bounds.east})`;
}

/**
 * Fetch retail locations from OpenStreetMap
 * Includes: supermarkets, shops, restaurants, cafes, pubs
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
async function loadRetailLocations() {
    if (cachedRetailLocations) {
        return cachedRetailLocations;
    }

    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    // Query for retail and food venues in Hertfordshire
    const query = `
        [bbox:${getBboxString(RETAIL_BOUNDS)}];
        (
            node["shop"];
            node["amenity"~"supermarket|restaurant|cafe|pub|fast_food"];
            way["shop"];
            way["amenity"~"supermarket|restaurant|cafe|pub|fast_food"];
        );
        out center;
    `;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

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

        // Convert to GeoJSON
        cachedRetailLocations = osmRetailToGeoJSON(data);
        console.log(`Loaded ${cachedRetailLocations.features.length} retail locations`);
        return cachedRetailLocations;
    } catch (error) {
        console.error('Error loading retail locations:', error.message);
        return null;
    }
}

/**
 * Convert OpenStreetMap retail data to GeoJSON
 * @param {Object} osmData — OSM Overpass API response
 * @returns {Object} GeoJSON FeatureCollection
 */
function osmRetailToGeoJSON(osmData) {
    const features = [];

    if (!osmData.elements) {
        return { type: 'FeatureCollection', features: [] };
    }

    osmData.elements.forEach(element => {
        let lat, lng, type, name;

        // Extract coordinates
        if (element.type === 'node') {
            lat = element.lat;
            lng = element.lon;
        } else if (element.type === 'way' && element.center) {
            lat = element.center.lat;
            lng = element.center.lon;
        } else {
            return; // Skip if no valid coordinates
        }

        // Determine type
        if (element.tags?.shop) {
            type = element.tags.shop;
        } else if (element.tags?.amenity) {
            type = element.tags.amenity;
        } else {
            type = 'retail';
        }

        name = element.tags?.name || type;

        features.push({
            type: 'Feature',
            properties: {
                id: element.id,
                type: type,
                name: name,
                operator: element.tags?.operator || '',
                phone: element.tags?.phone || '',
                website: element.tags?.website || ''
            },
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            }
        });
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}

/**
 * Render retail markers to map with clustering for density
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} retailGeoJSON — Retail locations GeoJSON
 */
function renderRetailToMap(map, retailGeoJSON) {
    if (!retailGeoJSON || retailGeoJSON.features.length === 0) {
        console.log('No retail locations to render');
        return;
    }

    const markers = [];

    retailGeoJSON.features.forEach(feature => {
        const { lng, lat } = feature.geometry.coordinates.reverse();
        const { name, type, phone, website } = feature.properties;

        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: name,
            icon: getRetailIcon(type)
        });

        // Add click popup
        marker.addListener('click', () => {
            const content = `
                <div style="padding: 8px; font-size: 12px; max-width: 200px;">
                    <strong>${name}</strong><br>
                    <em>${type}</em><br>
                    ${phone ? `📞 <a href="tel:${phone}">${phone}</a><br>` : ''}
                    ${website ? `🌐 <a href="${website}" target="_blank">Website</a>` : ''}
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({ content });
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });

    console.log(`Rendered ${markers.length} retail markers to map`);
    return markers;
}

/**
 * Get icon color/URL based on retail type
 * @param {string} type — Shop or amenity type
 * @returns {string} Icon URL or color string
 */
function getRetailIcon(type) {
    const icons = {
        supermarket: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        restaurant: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        cafe: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        pub: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        fast_food: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        shop: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    return icons[type] || 'https://maps.google.com/mapfiles/ms/icons/grey-dot.png';
}

/**
 * Group retail by type for filtering
 * @param {Array} features — GeoJSON features
 * @returns {Object} Grouped: {type: [features], ...}
 */
function groupRetailByType(features) {
    const grouped = {};
    features.forEach(feature => {
        const type = feature.properties.type;
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(feature);
    });
    return grouped;
}
