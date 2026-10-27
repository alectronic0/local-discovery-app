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

        // 3. Render Distribution Table
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
