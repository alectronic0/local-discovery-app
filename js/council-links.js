/**
 * council-links.js — Handle council polygon interactions and popups
 * Shows council info with website links on click
 */

let activeInfoWindow = null;

/**
 * Set up click handlers for council boundaries
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} councilsData — Council metadata lookup: GSS code → council
 */
function setupCouncilClickHandlers(map, councilsData) {
    map.data.addListener('click', (event) => {
        // Close previous popup if open
        if (activeInfoWindow) {
            activeInfoWindow.close();
        }

        const gssCode = event.feature.getProperty('LAD24CD');
        const council = councilsData[gssCode];

        if (council) {
            showCouncilPopup(map, event.latLng, council);
        }
    });

    // Highlight on hover
    map.data.addListener('mouseover', (event) => {
        map.data.overrideStyle(event.feature, {
            fillOpacity: 0.35,
            strokeWeight: 2.5
        });
    });

    map.data.addListener('mouseout', (event) => {
        map.data.revertStyle(event.feature);
    });
}

/**
 * Show council popup with info and website link
 * @param {google.maps.Map} map — Google Maps instance
 * @param {google.maps.LatLng} position — Popup position
 * @param {Object} council — Council data object
 */
function showCouncilPopup(map, position, council) {
    const content = `
        <div class="council-popup" style="padding: 12px; min-width: 250px; font-size: 13px;">
            <strong style="font-size: 15px; display: block; margin-bottom: 8px;">${council.name}</strong>

            <div style="margin-bottom: 8px; color: #666;">
                <strong>Region:</strong> ${council.region}<br>
                <strong>Type:</strong> ${capitalizeFirstLetter(council.type)}<br>
                <strong>GSS Code:</strong> ${council.gss_code}
            </div>

            <div style="margin-bottom: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
                ${council.website ? `<a href="${council.website}" target="_blank" style="color: #0066cc; text-decoration: none; font-weight: bold;">🌐 Visit Council Website</a><br>` : ''}
                ${council.phone ? `<a href="tel:${council.phone}" style="color: #0066cc; text-decoration: none;">📞 ${council.phone}</a><br>` : ''}
                ${council.email ? `<a href="mailto:${council.email}" style="color: #0066cc; text-decoration: none;">📧 ${council.email}</a>` : ''}
            </div>

            <button onclick="this.parentElement.style.display='none'" style="margin-top: 8px; padding: 6px 12px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;">Close</button>
        </div>
    `;

    activeInfoWindow = new google.maps.InfoWindow({
        content: content,
        position: position
    });

    activeInfoWindow.open(map);
}

/**
 * Search for councils by name
 * @param {Object} councilsData — Council metadata lookup
 * @param {string} query — Search query
 * @returns {Array} Matching councils
 */
function searchCouncilsByName(councilsData, query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(councilsData).filter(council =>
        council.name.toLowerCase().includes(lowerQuery) ||
        council.region.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Zoom map to council bounds
 * @param {google.maps.Map} map — Google Maps instance
 * @param {Object} council — Council data object
 */
function zoomToCouncil(map, council) {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: council.lat - 0.1, lng: council.lng - 0.1 });
    bounds.extend({ lat: council.lat + 0.1, lng: council.lng + 0.1 });
    map.fitBounds(bounds);
}

/**
 * Helper: capitalize first letter
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
