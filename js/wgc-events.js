/**
 * wgc-events.js
 * Renders Upcoming Hertfordshire and WGC Town Centre Activities
 */

const WGCEvents = {
    render(events) {
        const grid = document.getElementById("events-grid");
        if (!grid) return;

        if (!events || events.length === 0) {
            grid.innerHTML = `<p style="padding: 1rem; color: var(--slate-500);">No upcoming events recorded.</p>`;
            return;
        }

        grid.innerHTML = events.map(evt => {
            const dateObj = new Date(evt.date);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            });

            return `
                <article class="event-card">
                    <div class="event-meta-row">
                        <span class="event-date-badge">📅 ${formattedDate}</span>
                        <span class="event-category-badge">${evt.category}</span>
                    </div>
                    <h3 class="event-title">${evt.title}</h3>
                    <div class="event-location">📍 ${evt.location} ${evt.time ? `• ⏰ ${evt.time}` : ""}</div>
                    <p class="event-desc">${evt.description}</p>
                </article>
            `;
        }).join("");
    }
};

window.WGCEvents = WGCEvents;
