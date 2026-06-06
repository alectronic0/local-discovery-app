/**
 * utils.js — Utility functions for postcode search, geocoding, validation
 */

/**
 * Validate UK postcode format
 * @param {string} postcode — Postcode to validate
 * @returns {boolean} Valid UK postcode
 */
function validatePostcode(postcode) {
    const postcodeRegex = /^[a-z]{1,2}[0-9]{1,2}[a-z]?\s?[0-9][a-z]{2}$/i;
    return postcodeRegex.test(postcode);
}

/**
 * Search by postcode and return geocoded result
 * Uses postcodes.io API (free, no key required)
 * @param {string} postcode — UK postcode
 * @returns {Promise<Object>} {lat, lng, districtGssCode} or null
 */
async function searchByPostcode(postcode) {
    if (!validatePostcode(postcode)) {
        throw new Error('Invalid UK postcode format (e.g., AL10 0LA)');
    }

    try {
        const response = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.toUpperCase())}`
        );
        const data = await response.json();

        if (!data.result) {
            throw new Error('Postcode not found');
        }

        return {
            lat: data.result.latitude,
            lng: data.result.longitude,
            districtGssCode: data.result.codes.admin_district,
            districtName: data.result.admin_district,
            region: data.result.region,
            country: data.result.country
        };
    } catch (error) {
        console.error('Error searching postcode:', error);
        throw error;
    }
}

/**
 * Build council lookup object from councils.json array
 * @param {Array} councilsArray — Array of council objects from councils.json
 * @returns {Object} Lookup map: GSS code → council object
 */
function buildCouncilLookup(councilsArray) {
    const lookup = {};
    councilsArray.forEach(council => {
        lookup[council.gss_code] = council;
    });
    return lookup;
}

/**
 * Get councils for a specific region
 * @param {Array} councilsArray — Array of council objects
 * @param {string} region — Region name to filter
 * @returns {Array} Councils in that region
 */
function getCouncilsByRegion(councilsArray, region) {
    return councilsArray.filter(council => council.region === region);
}

/**
 * Get councils for a specific country
 * @param {Array} councilsArray — Array of council objects
 * @param {string} country — Country name (England, Scotland, Wales, Northern Ireland)
 * @returns {Array} Councils in that country
 */
function getCouncilsByCountry(councilsArray, country) {
    return councilsArray.filter(council => council.country === country);
}

/**
 * Get unique regions from councils array
 * @param {Array} councilsArray — Array of council objects
 * @returns {Object} Grouped: {region: [councils], ...}
 */
function groupCouncilsByRegion(councilsArray) {
    const grouped = {};
    councilsArray.forEach(council => {
        if (!grouped[council.region]) {
            grouped[council.region] = [];
        }
        grouped[council.region].push(council);
    });
    return grouped;
}

/**
 * Calculate bounds for a set of councils
 * @param {Array} councils — Council objects with lat/lng
 * @returns {Object} {north, south, east, west} bounds
 */
function calculateBounds(councils) {
    if (!councils || councils.length === 0) return null;

    let north = -90, south = 90, east = -180, west = 180;

    councils.forEach(council => {
        if (council.lat) north = Math.max(north, council.lat);
        if (council.lat) south = Math.min(south, council.lat);
        if (council.lng) east = Math.max(east, council.lng);
        if (council.lng) west = Math.min(west, council.lng);
    });

    return { north, south, east, west };
}

/**
 * Zoom to bounds on map
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} bounds — {north, south, east, west}
 */
function zoomToBounds(map, bounds) {
    if (!bounds) return;
    const googleBounds = new google.maps.LatLngBounds(
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east }
    );
    map.fitBounds(googleBounds);
}
