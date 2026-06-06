/**
 * layers.js — Manage hierarchical layer toggles for UK regions/countries
 * Generates nested accordion of checkboxes and wires visibility controls
 */

// Track visibility state: Map<region, isVisible>
const regionVisibility = new Map();

// Track transport layer visibility
const transportVisibility = {
    rail: true,
    bus: true
};

/**
 * Initialize region visibility states based on UK hierarchy
 */
function initializeRegionVisibility() {
    const regions = [
        // England
        'East', 'East Midlands', 'London', 'North East', 'North West',
        'South East', 'South West', 'West Midlands', 'Yorkshire and Humber',
        // Scotland
        'Lothian', 'West Scotland', 'Grampian', 'Central Scotland', 'Tayside',
        'Fife', 'Highlands', 'Northern Isles', 'South Scotland', 'South West Scotland',
        // Wales
        'North Wales', 'South Wales', 'Mid Wales', 'South West Wales',
        // Northern Ireland
        'Northern Ireland'
    ];

    regions.forEach(region => regionVisibility.set(region, true));
}

/**
 * Render layer toggle panel into the DOM
 * Generates nested checkboxes grouped by country → region
 * @param {HTMLElement} container — Where to render the toggle panel
 * @param {Function} onToggle — Callback when visibility changes
 */
function renderLayerToggles(container, onToggle) {
    initializeRegionVisibility();

    const html = `
        <div id="layer-controls" class="layer-controls">
            <button id="toggle-layers-btn" class="toggle-btn">▼ Show Layers</button>
            <div id="layer-tree" class="layer-tree">

                <!-- TRANSPORT LAYERS -->
                <div class="country-group">
                    <div class="region-list">
                        <label><input type="checkbox" id="toggle-rail" class="transport-checkbox" data-transport="rail" checked> 🚂 Rail Lines & Stations</label>
                        <label><input type="checkbox" id="toggle-bus" class="transport-checkbox" data-transport="bus" checked> 🚌 Bus Routes & Stops</label>
                    </div>
                </div>

                <!-- ENGLAND -->
                <div class="country-group">
                    <label class="country-toggle">
                        <input type="checkbox" class="country-checkbox" data-country="England" checked>
                        <strong>England</strong>
                    </label>
                    <div class="region-list">
                        <label><input type="checkbox" class="region-checkbox" data-region="East" checked> East of England</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="East Midlands" checked> East Midlands</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="London" checked> London</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="North East" checked> North East</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="North West" checked> North West</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South East" checked> South East</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South West" checked> South West</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="West Midlands" checked> West Midlands</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Yorkshire and Humber" checked> Yorkshire & Humber</label>
                    </div>
                </div>

                <!-- SCOTLAND -->
                <div class="country-group">
                    <label class="country-toggle">
                        <input type="checkbox" class="country-checkbox" data-country="Scotland" checked>
                        <strong>Scotland</strong>
                    </label>
                    <div class="region-list">
                        <label><input type="checkbox" class="region-checkbox" data-region="Lothian" checked> Lothian</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="West Scotland" checked> West Scotland</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Grampian" checked> Grampian</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Central Scotland" checked> Central Scotland</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Tayside" checked> Tayside</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Fife" checked> Fife</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Highlands" checked> Highlands</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Northern Isles" checked> Northern Isles</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South Scotland" checked> South Scotland</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South West Scotland" checked> South West Scotland</label>
                    </div>
                </div>

                <!-- WALES -->
                <div class="country-group">
                    <label class="country-toggle">
                        <input type="checkbox" class="country-checkbox" data-country="Wales" checked>
                        <strong>Wales</strong>
                    </label>
                    <div class="region-list">
                        <label><input type="checkbox" class="region-checkbox" data-region="North Wales" checked> North Wales</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South Wales" checked> South Wales</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="Mid Wales" checked> Mid Wales</label>
                        <label><input type="checkbox" class="region-checkbox" data-region="South West Wales" checked> South West Wales</label>
                    </div>
                </div>

                <!-- NORTHERN IRELAND -->
                <div class="country-group">
                    <label class="country-toggle">
                        <input type="checkbox" class="country-checkbox" data-country="Northern Ireland" checked>
                        <strong>Northern Ireland</strong>
                    </label>
                    <div class="region-list">
                        <label><input type="checkbox" class="region-checkbox" data-region="Northern Ireland" checked> All Councils</label>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);

    // Wire up toggle button
    const toggleBtn = document.getElementById('toggle-layers-btn');
    const layerTree = document.getElementById('layer-tree');
    toggleBtn.addEventListener('click', () => {
        layerTree.hidden = !layerTree.hidden;
        toggleBtn.textContent = layerTree.hidden ? '▶ Show Layers' : '▼ Hide Layers';
    });

    // Wire up country checkboxes (toggle all regions within country)
    document.querySelectorAll('.country-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const country = e.target.dataset.country;
            const isChecked = e.target.checked;
            const parent = e.target.closest('.country-group');
            parent.querySelectorAll('.region-checkbox').forEach(regionCheckbox => {
                regionCheckbox.checked = isChecked;
                regionVisibility.set(regionCheckbox.dataset.region, isChecked);
            });
            if (onToggle) onToggle(getVisibleRegions());
        });
    });

    // Wire up region checkboxes
    document.querySelectorAll('.region-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const region = e.target.dataset.region;
            regionVisibility.set(region, e.target.checked);
            if (onToggle) onToggle(getVisibleRegions());
        });
    });

    // Wire up transport layer checkboxes
    document.querySelectorAll('.transport-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const transport = e.target.dataset.transport;
            transportVisibility[transport] = e.target.checked;
            toggleTransportVisibility(transportVisibility.rail, transportVisibility.bus);
        });
    });
}

/**
 * Get set of currently visible regions
 * @returns {Set<string>} Region names with visibility=true
 */
function getVisibleRegions() {
    const visible = new Set();
    regionVisibility.forEach((isVisible, region) => {
        if (isVisible) visible.add(region);
    });
    return visible;
}

/**
 * Set visibility for a specific region
 * @param {string} region — Region name
 * @param {boolean} isVisible — Show/hide
 */
function setRegionVisibility(region, isVisible) {
    regionVisibility.set(region, isVisible);
}
