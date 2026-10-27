/**
 * wgc-analytics.js
 * Renders Town Makeup, Oversaturated Categories, and Missing Priority Gaps
 */

const WGCAnalytics = {
    render(data) {
        if (!data || !data.gaps_scorecard) return;

        const { gaps_scorecard, distribution } = data;

        // 1. Render Oversaturated
        const overList = document.getElementById("oversaturated-list");
        if (overList && gaps_scorecard.oversaturated) {
            overList.innerHTML = gaps_scorecard.oversaturated.map(item => `
                <div class="gap-card">
                    <div class="gap-card-header">
                        <span class="gap-card-title">${item.category} (${item.count} stores)</span>
                        <span class="gap-badge badge-oversaturated">${item.share} share</span>
                    </div>
                    <p class="gap-card-note">${item.note}</p>
                </div>
            `).join("");
        }

        // 2. Render Missing Deficits
        const missList = document.getElementById("missing-list");
        if (missList && gaps_scorecard.missing_deficits) {
            missList.innerHTML = gaps_scorecard.missing_deficits.map(item => `
                <div class="gap-card">
                    <div class="gap-card-header">
                        <span class="gap-card-title">${item.amenity}</span>
                        <span class="gap-badge badge-demand">${item.community_demand}</span>
                    </div>
                    <div class="gap-card-rec">💡 <strong>Action:</strong> ${item.recommended_action}</div>
                </div>
            `).join("");
        }

        // 3. Render Distribution Bar Chart
        const barContainer = document.getElementById("distribution-bars");
        if (barContainer && distribution) {
            const catColors = {
                "vacant": "var(--vacant-red)",
                "barber_salon": "#7b2cbf",
                "charity_shop": "#d97706",
                "coffee_bakery": "#b0572b",
                "restaurant_food": "#16a34a",
                "retail_clothing": "#2563eb",
                "retail_lifestyle": "#3b82f6",
                "retail_discount": "#60a5fa",
                "services_bank": "#0891b2",
                "health_pharmacy": "#06b6d4",
                "leisure_culture": "#4f46e5",
                "leisure_fitness": "#6366f1",
                "department_store": "#1d4ed8",
                "civic_community": "#059669"
            };

            barContainer.innerHTML = distribution.map(d => {
                const color = catColors[d.category] || "var(--slate-500)";
                return `
                    <div class="dist-segment" 
                         style="width: ${d.percentage}%; background-color: ${color};" 
                         title="${d.label}: ${d.count} units (${d.percentage}%)">
                    </div>
                `;
            }).join("");
        }

        // 4. Render Distribution Table
        const tbody = document.getElementById("distribution-tbody");
        if (tbody && distribution) {
            tbody.innerHTML = distribution.map(d => {
                let statusBadge = `<span style="color: var(--slate-600)">Balanced</span>`;
                if (d.category === "vacant") {
                    statusBadge = `<strong style="color: var(--vacant-red)">🔴 High Priority for Lease</strong>`;
                } else if (d.category === "barber_salon" || d.category === "charity_shop") {
                    statusBadge = `<span style="color: #b45309; font-weight: 600;">⚠️ Oversaturated</span>`;
                }

                return `
                    <tr>
                        <td><strong>${d.label}</strong></td>
                        <td>${d.count}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="background: var(--slate-200); width: 80px; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: var(--wgc-green-600); width: ${d.percentage}%; height: 100%;"></div>
                                </div>
                                <span>${d.percentage}%</span>
                            </div>
                        </td>
                        <td>${statusBadge}</td>
                    </tr>
                `;
            }).join("");
        }
    }
};

window.WGCAnalytics = WGCAnalytics;
