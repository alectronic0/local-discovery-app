/**
 * wgc-map.js
 * Interactive Leaflet Map & Town Centre Unit Directory for Welwyn Garden City
 */

const WGCMap = {
    map: null,
    markers: [],
    allUnits: [],
    filteredUnits: [],
    activeFilter: "all",
    searchQuery: "",

    init(units) {
        this.allUnits = units || [];
        this.filteredUnits = [...this.allUnits];
        this.initLeaflet();
        this.bindControls();
        this.render();
    },

    initLeaflet() {
        const mapContainer = document.getElementById("wgc-leaflet-map");
        if (!mapContainer) return;

        // Welwyn Garden City Town Centre coordinates
        const WGC_CENTRE = [51.8018, -0.2065];

        this.map = L.map("wgc-leaflet-map", {
            center: WGC_CENTRE,
            zoom: 16,
            minZoom: 14,
            maxZoom: 19
        });

        // Reliable key-free OpenStreetMap tile layer (zero API key required)
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Fix leaflet size on tab changes
        setTimeout(() => this.map.invalidateSize(), 200);
    },

    getCategoryStyle(category, status) {
        if (status === "vacant") {
            return { className: "pin-vacant", icon: "🔴", label: "Vacant" };
        }
        switch (category) {
            case "coffee_bakery":
                return { className: "pin-coffee", icon: "☕", label: "Coffee / Bakery" };
            case "barber_salon":
                return { className: "pin-barber", icon: "✂️", label: "Barber / Salon" };
            case "charity_shop":
                return { className: "pin-charity", icon: "🎁", label: "Charity Shop" };
            case "restaurant_food":
                return { className: "pin-food", icon: "🍽️", label: "Restaurant / Pub" };
            case "retail_clothing":
            case "retail_lifestyle":
            case "retail_discount":
            case "department_store":
                return { className: "pin-retail", icon: "🛍️", label: "Retail / Shop" };
            case "services_bank":
            case "health_pharmacy":
                return { className: "pin-services", icon: "🏥", label: "Services / Health" };
            case "leisure_culture":
            case "leisure_fitness":
            case "civic_community":
                return { className: "pin-leisure", icon: "🎭", label: "Leisure / Civic" };
            default:
                return { className: "pin-default", icon: "📍", label: "Local Unit" };
        }
    },

    bindControls() {
        // Filter chips
        const chips = document.querySelectorAll(".filter-chip");
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                chips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                this.activeFilter = chip.getAttribute("data-filter");
                this.applyFilters();
            });
        });

        // Search box
        const searchInput = document.getElementById("unit-search");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.applyFilters();
            });
        }
    },

    applyFilters() {
        this.filteredUnits = this.allUnits.filter(u => {
            // Category filter
            let matchesCategory = false;
            if (this.activeFilter === "all") {
                matchesCategory = true;
            } else if (this.activeFilter === "vacant") {
                matchesCategory = u.status === "vacant";
            } else if (this.activeFilter === "retail") {
                matchesCategory = u.category.startsWith("retail") || u.category === "department_store";
            } else if (this.activeFilter === "services") {
                matchesCategory = u.category === "services_bank" || u.category === "health_pharmacy";
            } else {
                matchesCategory = u.category === this.activeFilter;
            }

            // Search query
            let matchesSearch = true;
            if (this.searchQuery) {
                const text = `${u.name} ${u.trading_as || ""} ${u.street} ${u.notes || ""}`.toLowerCase();
                matchesSearch = text.includes(this.searchQuery);
            }

            return matchesCategory && matchesSearch;
        });

        this.render();
    },

    render() {
        if (!this.map) return;

        // Clear existing markers
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        // Update drawer count
        const countBadge = document.getElementById("visible-unit-count");
        if (countBadge) {
            countBadge.textContent = `${this.filteredUnits.length} units`;
        }

        const unitList = document.getElementById("unit-list");
        if (unitList) {
            unitList.innerHTML = "";
        }

        this.filteredUnits.forEach(u => {
            const style = this.getCategoryStyle(u.category, u.status);
            const isVacant = u.status === "vacant";

            // 1. Create Leaflet Custom Marker
            const customIcon = L.divIcon({
                className: `custom-pin ${style.className}`,
                html: style.icon,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                popupAnchor: [0, -14]
            });

            const marker = L.marker([u.lat, u.lng], { icon: customIcon });

            // Popup HTML
            const rentInfo = isVacant && u.rent_pa 
                ? `<div style="margin: 0.35rem 0; font-size: 0.9rem; font-weight: 800; color: #d90429;">Rent: £${u.rent_pa.toLocaleString()} / year (${u.sq_ft ? `${u.sq_ft} sq ft` : ""})</div>`
                : "";

            const agentInfo = isVacant && u.landlord_agent
                ? `<div style="font-size: 0.75rem; color: #475569;"><strong>Agent:</strong> ${u.landlord_agent}</div>`
                : "";

            marker.bindPopup(`
                <div style="font-family: var(--font-sans); min-width: 200px;">
                    <div style="font-size: 0.7rem; font-weight: 700; color: ${isVacant ? '#d90429' : '#2d6a4f'}; text-transform: uppercase;">
                        ${isVacant ? '🔴 VACANT LOT' : style.label}
                    </div>
                    <h3 style="font-size: 1rem; margin: 0.2rem 0; font-weight: 700;">${u.name}</h3>
                    <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.35rem;">📍 ${u.street}</div>
                    ${rentInfo}
                    ${agentInfo}
                    <p style="font-size: 0.8rem; color: #334155; margin-top: 0.35rem; line-height: 1.3;">${u.notes || ""}</p>
                </div>
            `);

            marker.addTo(this.map);
            this.markers.push(marker);

            // 2. Create Drawer Card
            if (unitList) {
                const card = document.createElement("div");
                card.className = `unit-card ${isVacant ? 'card-vacant' : ''}`;
                card.id = `drawer-card-${u.id}`;

                card.innerHTML = `
                    <div class="unit-card-header">
                        <span class="unit-card-title">${u.name}</span>
                        <span class="unit-category-badge ${isVacant ? 'badge-vacant-status' : ''}">
                            ${isVacant ? 'Vacant' : style.label}
                        </span>
                    </div>
                    <div class="unit-street">📍 ${u.street}</div>
                    ${isVacant ? `
                        <div class="unit-financials">
                            <span class="unit-rent">${u.rent_pa ? `£${u.rent_pa.toLocaleString()} / yr` : 'Rent on App.'}</span>
                            <span class="unit-sqft">${u.sq_ft ? `${u.sq_ft} sq ft` : ''}</span>
                        </div>
                    ` : ''}
                    <div class="unit-notes">${u.notes || ''}</div>
                `;

                // Connect card click to map pin
                card.addEventListener("click", () => {
                    document.querySelectorAll(".unit-card").forEach(c => c.classList.remove("active-unit"));
                    card.classList.add("active-unit");
                    this.map.flyTo([u.lat, u.lng], 18, { duration: 0.8 });
                    marker.openPopup();
                });

                // Connect marker click to highlight card
                marker.on("click", () => {
                    document.querySelectorAll(".unit-card").forEach(c => c.classList.remove("active-unit"));
                    card.classList.add("active-unit");
                    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
                });

                unitList.appendChild(card);
            }
        });
    }
};

window.WGCMap = WGCMap;
