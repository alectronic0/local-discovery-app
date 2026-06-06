// Map and data globals
let map;
let districtPolygons = [];
let venueMarkers = [];
let allVenues = [];
let activeFilters = new Set(['all']);

// Hertfordshire bounds
const HERTS_BOUNDS = {
    north: 52.0,
    south: 51.65,
    east: 0.25,
    west: -0.65
};

const HERTS_CENTER = {
    lat: 51.825,
    lng: -0.22
};

// GSS codes for Herts districts
const HERTS_DISTRICTS = {
    'E07000241': 'Welwyn Hatfield',
    'E07000240': 'St Albans',
    'E07000099': 'Hertsmere',
    'E07000103': 'Watford',
    'E07000102': 'Three Rivers',
    'E07000096': 'Dacorum',
    'E07000095': 'Broxbourne',
    'E07000242': 'East Hertfordshire',
    'E07000243': 'Stevenage',
    'E07000098': 'North Hertfordshire'
};

// Initialize map on page load
window.addEventListener('load', initMap);

async function initMap() {
    // Create map centered on Hertfordshire
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
                // TODO: zoom to user's district and fetch local venues
                console.log('User location:', userLoc);
            },
            (error) => {
                console.log('Geolocation permission denied or unavailable');
            }
        );
    }

    // Load district boundaries from ONS ArcGIS API
    await loadHertsDistricts();

    // Load venue markers from static JSON
    await loadVenues();

    // Set up filter buttons
    setupFilterButtons();

    // Set up postcode search
    setupPostcodeSearch();
}

/**
 * Fetch Hertfordshire district boundaries from ONS ArcGIS FeatureServer
 * Queries for all 10 Herts districts by name pattern matching
 */
async function loadHertsDistricts() {
    const ONS_API = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_May_2024_Boundaries_UK_BGC/FeatureServer/0/query';

    // Query pattern: match Herts district names
    const whereClause = "LAD24NM LIKE '%Hertf%' OR LAD24NM LIKE 'Welwyn%' OR LAD24NM LIKE 'Watford%' OR LAD24NM LIKE 'Stevenage%' OR LAD24NM LIKE 'Dacorum%' OR LAD24NM LIKE 'Broxbourne%' OR LAD24NM LIKE 'Hertsmere%' OR LAD24NM LIKE 'Three Rivers%' OR LAD24NM LIKE 'East Hertfordshire%' OR LAD24NM LIKE 'North Hertfordshire%'";

    const params = new URLSearchParams({
        where: whereClause,
        outFields: 'LAD24CD,LAD24NM',
        f: 'geojson'
    });

    try {
        const response = await fetch(`${ONS_API}?${params}`);
        const geojson = await response.json();

        if (!geojson.features || geojson.features.length === 0) {
            console.error('No Herts districts found from ONS API');
            return;
        }

        // Add GeoJSON to map
        map.data.addGeoJson(geojson);

        // Style all districts with default color
        map.data.setStyle((feature) => {
            const gssCode = feature.getProperty('LAD24CD');
            const isWelwynHatfield = gssCode === 'E07000241';

            return {
                fillColor: isWelwynHatfield ? '#EF9F27' : '#3B8BD4',
                fillOpacity: isWelwynHatfield ? 0.3 : 0.15,
                strokeColor: isWelwynHatfield ? '#854F0B' : '#185FA5',
                strokeWeight: isWelwynHatfield ? 2.5 : 1.5,
                clickable: true
            };
        });

        // Add click listener for districts
        map.data.addListener('click', (event) => {
            const gssCode = event.feature.getProperty('LAD24CD');
            const districtName = event.feature.getProperty('LAD24NM');
            console.log(`Clicked district: ${districtName} (${gssCode})`);
            // TODO: Show sidebar with district info
        });

        console.log(`Loaded ${geojson.features.length} Herts district boundaries`);
    } catch (error) {
        console.error('Error loading districts from ONS API:', error);
    }
}

/**
 * Load venue markers from static JSON file
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

            // Add click listener for popup
            marker.addListener('click', () => {
                showVenuePopup(marker, venue);
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
 * Show popup on venue marker click
 */
function showVenuePopup(marker, venue) {
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
}

/**
 * Set up filter button listeners
 */
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Toggle active state
            if (filter === 'all') {
                // "All" button: clear all filters and select "all"
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilters = new Set(['all']);
            } else {
                // Category button: toggle it, deselect "all" if any category is selected
                const allBtn = document.querySelector('[data-filter="all"]');
                allBtn.classList.remove('active');

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    activeFilters.delete(filter);
                } else {
                    btn.classList.add('active');
                    activeFilters.delete('all');
                    activeFilters.add(filter);
                }

                // If no filters selected, default to "all"
                if (activeFilters.size === 0) {
                    allBtn.classList.add('active');
                    activeFilters.add('all');
                }
            }

            // Apply filter to markers
            applyMarkerFilter();
        });
    });
}

/**
 * Apply active filters to venue markers
 */
function applyMarkerFilter() {
    venueMarkers.forEach(item => {
        const showMarker = activeFilters.has('all') || activeFilters.has(item.data.type);
        item.marker.setVisible(showMarker);
    });
}

/**
 * Set up postcode search
 */
function setupPostcodeSearch() {
    const input = document.getElementById('postcode-search');
    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const postcode = input.value.trim().toUpperCase();
            if (postcode) {
                await searchByPostcode(postcode);
            }
        }
    });
}

/**
 * Search and zoom to a postcode
 * Uses postcodes.io API (free, no key required)
 */
async function searchByPostcode(postcode) {
    // Validate postcode format (UK postcode pattern)
    const postcodeRegex = /^[a-z]{1,2}[0-9]{1,2}[a-z]?\s?[0-9][a-z]{2}$/i;
    if (!postcodeRegex.test(postcode)) {
        alert('Invalid UK postcode format (e.g., AL10 0LA)');
        return;
    }

    try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
        const data = await response.json();

        if (!data.result) {
            alert('Postcode not found');
            return;
        }

        const gssDistrict = data.result.codes.admin_district;
        const lat = data.result.latitude;
        const lng = data.result.longitude;

        // Zoom to postcode location
        map.setCenter({ lat, lng });
        map.setZoom(14);

        // Show venues for this district
        const venuesInDistrict = allVenues.filter(v => v.gss_district === gssDistrict);
        console.log(`Found ${venuesInDistrict.length} venues in ${gssDistrict}`);
        // TODO: highlight venues in this district
    } catch (error) {
        console.error('Error searching postcode:', error);
        alert('Error: Could not search postcode. Check the postcode format (e.g., AL10 0LA)');
    }
}
