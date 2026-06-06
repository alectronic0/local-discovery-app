/**
 * app.js — Main application orchestration
 * Coordinates boundaries, layers, council links, and utilities
 * Modular architecture: loads js/boundaries.js, js/layers.js, js/council-links.js, js/utils.js
 */

// Globals
let map;
let allCouncils = [];
let councilsDataLookup = {};
let allVenues = [];
let venueMarkers = [];
let railMarkers = [];
let busMarkers = [];
let retailMarkers = [];

// Hertfordshire center for default view
const HERTS_CENTER = {
    lat: 51.825,
    lng: -0.22
};

/**
 * Initialize map and load all data
 */
window.addEventListener('load', initMap);

async function initMap() {
    // Create map centered on Hertfordshire (will expand to show UK on toggle)
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: HERTS_CENTER,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true
    });

    // Try to get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLoc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('User location:', userLoc);
                // TODO: zoom to user's district and fetch local venues
            },
            (error) => {
                console.log('Geolocation permission denied or unavailable');
            }
        );
    }

    // Load council data
    await loadCouncils();

    // Load and render UK boundaries
    await loadAndRenderBoundaries();

    // Set up layer toggles
    setupLayerToggles();

    // Load and render venue markers
    await loadVenues();

    // Load transport layers (rail and bus)
    await loadTransportLayers();

    // Load retail locations
    await loadRetailLayer();

    // Set up calendar toggle
    setupCalendarToggle();

    // Set up postcode search
    setupPostcodeSearch();
}

/**
 * Load councils.json and build lookup
 */
async function loadCouncils() {
    try {
        const response = await fetch('data/councils.json');
        allCouncils = await response.json();
        councilsDataLookup = buildCouncilLookup(allCouncils);
        console.log(`Loaded ${allCouncils.length} councils`);
    } catch (error) {
        console.error('Error loading councils:', error);
    }
}

/**
 * Load UK boundaries from ONS and render to map
 */
async function loadAndRenderBoundaries() {
    try {
        const geojson = await loadUKBoundaries();
        if (!geojson) {
            console.error('Failed to load boundaries');
            return;
        }

        renderBoundariesToMap(map, councilsDataLookup, (council) => {
            // Council click handler
            showCouncilPopup(map, { lat: council.lat, lng: council.lng }, council);
        });

        setupCouncilClickHandlers(map, councilsDataLookup);
        console.log('Boundaries loaded and rendered');
    } catch (error) {
        console.error('Error loading boundaries:', error);
    }
}

/**
 * Set up layer toggle controls
 */
function setupLayerToggles() {
    const filterPanel = document.querySelector('.filter-panel') || document.getElementById('filter-panel');
    if (!filterPanel) {
        console.error('Filter panel not found');
        return;
    }

    renderLayerToggles(filterPanel, (visibleRegions) => {
        // When regions are toggled, update boundary visibility
        toggleBoundariesByRegion(map, councilsDataLookup, visibleRegions);
    });
}

/**
 * Load venue markers from static JSON
 */
async function loadVenues() {
    try {
        const response = await fetch('data/venues/sample-venues.json');
        const data = await response.json();
        allVenues = data;

        // Add markers to map
        allVenues.forEach(venue => {
            const marker = new google.maps.Marker({
                position: { lat: venue.lat, lng: venue.lng },
                map: map,
                title: venue.name,
                icon: getMarkerIcon(venue.type)
            });

            // Add click listener
            marker.addListener('click', () => {
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="padding: 8px; font-size: 13px;">
                            <strong>${venue.name}</strong><br>
                            ${venue.address || ''}<br>
                            ${venue.phone ? `<a href="tel:${venue.phone}">${venue.phone}</a>` : ''}<br>
                            ${venue.website ? `<a href="${venue.website}" target="_blank">Website</a>` : ''}
                        </div>
                    `
                });
                infoWindow.open(map, marker);
            });

            venueMarkers.push({
                marker: marker,
                data: venue
            });
        });

        console.log(`Loaded ${allVenues.length} venues`);
    } catch (error) {
        console.error('Error loading venues:', error);
    }
}

/**
 * Get marker icon color based on venue type
 */
function getMarkerIcon(type) {
    const icons = {
        community_hall: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        leisure: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        nature: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        transport: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };
    return icons[type] || icons.community_hall;
}

/**
 * Load rail and bus routes, stations, and stops from OpenStreetMap
 */
async function loadTransportLayers() {
    try {
        const railGeoJSON = await loadRailLines();
        const busGeoJSON = await loadBusRoutes();
        const stationsGeoJSON = await loadRailStations();
        const stopsGeoJSON = await loadBusStops();

        if (railGeoJSON || busGeoJSON) {
            renderTransportToMap(map, railGeoJSON, busGeoJSON);
        }

        if (stationsGeoJSON) {
            renderStationsToMap(map, stationsGeoJSON);
        }

        if (stopsGeoJSON) {
            renderStopsToMap(map, stopsGeoJSON);
        }

        console.log('Transport layers loaded (routes, stations, stops)');
    } catch (error) {
        console.error('Error loading transport layers:', error);
    }
}

/**
 * Load retail locations from OpenStreetMap
 */
async function loadRetailLayer() {
    try {
        const retailGeoJSON = await loadRetailLocations();

        if (retailGeoJSON && retailGeoJSON.features.length > 0) {
            retailMarkers = renderRetailToMap(map, retailGeoJSON);
            console.log('Retail layer loaded');
        }
    } catch (error) {
        console.error('Error loading retail layer:', error);
    }
}

/**
 * Set up calendar toggle button
 */
function setupCalendarToggle() {
    const toggleBtn = document.getElementById('toggle-calendar-btn');
    const calendarSection = document.querySelector('.calendar-section');

    if (!toggleBtn || !calendarSection) {
        console.warn('Calendar toggle elements not found');
        return;
    }

    toggleBtn.addEventListener('click', () => {
        calendarSection.classList.toggle('hidden');
        toggleBtn.textContent = calendarSection.classList.contains('hidden') ? '▶' : '◀';
        toggleBtn.title = calendarSection.classList.contains('hidden') ? 'Show calendar' : 'Hide calendar';

        // Trigger map resize after animation completes
        setTimeout(() => {
            if (map) {
                google.maps.event.trigger(map, 'resize');
            }
        }, 300);
    });
}

/**
 * Set up postcode search
 */
function setupPostcodeSearch() {
    const input = document.getElementById('postcode-search');
    if (!input) {
        console.warn('Postcode search input not found');
        return;
    }

    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const postcode = input.value.trim().toUpperCase();
            if (postcode) {
                try {
                    const result = await searchByPostcode(postcode);
                    // Zoom to postcode location
                    map.setCenter({ lat: result.lat, lng: result.lng });
                    map.setZoom(14);
                    console.log(`Found postcode: ${result.districtName}`);
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
        }
    });
}
