/**
 * wgc-app.js
 * Main Orchestrator for LoveWGC V2
 * Loads static datasets, updates KPI strip, manages tab switching, and initializes modules.
 */

document.addEventListener("DOMContentLoaded", async () => {
    console.log("[LoveWGC] Initializing Welwyn Garden City V2...");

    try {
        // Fetch all datasets in parallel
        const [unitsRes, eventsRes, wishlistRes, analyticsRes] = await Promise.all([
            fetch("data/wgc/units.json"),
            fetch("data/wgc/events.json"),
            fetch("data/wgc/wishlist.json"),
            fetch("data/wgc/analytics.json")
        ]);

        const units = await unitsRes.json();
        const events = await eventsRes.json();
        const wishlist = await wishlistRes.json();
        const analytics = await analyticsRes.json();

        // 1. Populate KPI Strip
        populateKPIs(analytics, events, wishlist);

        // 2. Initialize Tab Switching
        initTabs();

        // 3. Initialize Modules
        if (window.WGCMap) WGCMap.init(units);
        if (window.WGCAnalytics) WGCAnalytics.render(analytics);
        if (window.WGCEvents) WGCEvents.render(events);
        if (window.WGCVoting) WGCVoting.init(wishlist);

        // Update tab count badges
        const eventBadge = document.getElementById("tab-event-count");
        if (eventBadge) eventBadge.textContent = events.length;

        const voteBadge = document.getElementById("tab-vote-count");
        if (voteBadge) voteBadge.textContent = wishlist.length;

        console.log("[LoveWGC] V2 Loaded successfully.");
    } catch (err) {
        console.error("[LoveWGC] Error loading data feeds:", err);
    }
});

function populateKPIs(analytics, events, wishlist) {
    if (!analytics || !analytics.summary) return;
    const s = analytics.summary;

    const elTotal = document.getElementById("kpi-total-units");
    const elVacant = document.getElementById("kpi-vacant-units");
    const elRate = document.getElementById("kpi-vacancy-rate");
    const elRent = document.getElementById("kpi-avg-rent");
    const elSqft = document.getElementById("kpi-sqft");
    const elEvents = document.getElementById("kpi-events");
    const elProps = document.getElementById("kpi-proposals");

    if (elTotal) elTotal.textContent = s.total_units;
    if (elVacant) elVacant.textContent = s.vacant_units;
    if (elRate) elRate.textContent = `${s.vacancy_rate_pct}%`;
    if (elRent) elRent.textContent = s.average_asking_rent_pa ? `£${s.average_asking_rent_pa.toLocaleString()}` : "N/A";
    if (elSqft) elSqft.textContent = s.total_tracked_sq_ft ? `${s.total_tracked_sq_ft.toLocaleString()} sq ft` : "--";
    if (elEvents) elEvents.textContent = events ? events.length : 0;
    if (elProps) elProps.textContent = wishlist ? wishlist.length : 0;
}

function initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add("active");
            }

            // Invalidate Leaflet map size if switching back to map tab
            if (targetId === "map-view" && window.WGCMap && WGCMap.map) {
                setTimeout(() => WGCMap.map.invalidateSize(), 150);
            }
        });
    });
}
