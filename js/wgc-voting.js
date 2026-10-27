/**
 * wgc-voting.js
 * Community Wishlist & Town Centre Voting System
 * Supports upvoting, downvoting, localStorage persistence, proposal submission, and JSON export.
 */

const WGCVoting = {
    proposals: [],
    userVotes: {}, // { id: 1 or -1 }

    init(seedProposals) {
        this.loadStorage(seedProposals);
        this.bindEvents();
        this.render();
    },

    loadStorage(seedProposals) {
        // Load user voted state
        try {
            const savedVotes = localStorage.getItem("lovewgc_user_votes_v2");
            if (savedVotes) {
                this.userVotes = JSON.parse(savedVotes);
            }
        } catch (e) {
            console.warn("Could not load user votes from localStorage", e);
        }

        // Load custom user submitted proposals
        let customProposals = [];
        try {
            const savedCustom = localStorage.getItem("lovewgc_custom_proposals_v2");
            if (savedCustom) {
                customProposals = JSON.parse(savedCustom);
            }
        } catch (e) {
            console.warn("Could not load custom proposals", e);
        }

        // Combine seed + custom
        this.proposals = [...seedProposals, ...customProposals];

        // Apply vote delta from user votes
        this.proposals.forEach(p => {
            if (this.userVotes[p.id]) {
                p.votes = (p.votes || 0) + this.userVotes[p.id];
            }
        });

        // Sort descending by votes
        this.proposals.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    },

    saveStorage() {
        try {
            localStorage.setItem("lovewgc_user_votes_v2", JSON.stringify(this.userVotes));
        } catch (e) {
            console.error("Failed to save votes to localStorage", e);
        }
    },

    vote(id, delta) {
        const item = this.proposals.find(p => p.id === id);
        if (!item) return;

        const currentVote = this.userVotes[id] || 0;

        if (currentVote === delta) {
            // Undo vote
            item.votes -= delta;
            delete this.userVotes[id];
        } else {
            // Apply new vote (or flip from -1 to +1)
            item.votes = item.votes - currentVote + delta;
            this.userVotes[id] = delta;
        }

        this.saveStorage();
        this.proposals.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        this.render();
    },

    addProposal(newProposal) {
        this.proposals.unshift(newProposal);

        // Store custom proposals
        try {
            const savedCustom = localStorage.getItem("lovewgc_custom_proposals_v2");
            const list = savedCustom ? JSON.parse(savedCustom) : [];
            list.push(newProposal);
            localStorage.setItem("lovewgc_custom_proposals_v2", JSON.stringify(list));
        } catch (e) {
            console.error("Failed to save custom proposal", e);
        }

        // Automatically give it the creator's upvote
        this.vote(newProposal.id, 1);
    },

    bindEvents() {
        const modal = document.getElementById("propose-modal");
        const openBtn = document.getElementById("open-propose-modal-btn");
        const closeBtn = document.getElementById("close-modal-btn");
        const cancelBtn = document.getElementById("cancel-modal-btn");
        const form = document.getElementById("propose-form");
        const exportBtn = document.getElementById("export-votes-btn");
        const resetBtn = document.getElementById("reset-votes-btn");

        if (openBtn) openBtn.onclick = () => modal.classList.remove("hidden");
        if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");
        if (cancelBtn) cancelBtn.onclick = () => modal.classList.add("hidden");

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const title = document.getElementById("prop-title").value.trim();
                const category = document.getElementById("prop-category").value;
                const location = document.getElementById("prop-location").value.trim() || "WGC Town Centre";
                const desc = document.getElementById("prop-desc").value.trim();

                if (!title || !desc) return;

                const newProp = {
                    id: "custom-" + Date.now(),
                    title: title,
                    category: category,
                    target_area: location,
                    votes: 1,
                    description: desc,
                    benefits: "Community submitted idea.",
                    feasibility: "Community Proposal",
                    status: "Under Review"
                };

                this.addProposal(newProp);
                form.reset();
                modal.classList.add("hidden");
            };
        }

        if (exportBtn) {
            exportBtn.onclick = () => this.exportJSON();
        }

        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm("Reset all your personal local votes?")) {
                    localStorage.removeItem("lovewgc_user_votes_v2");
                    localStorage.removeItem("lovewgc_custom_proposals_v2");
                    location.reload();
                }
            };
        }
    },

    exportJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.proposals, null, 2));
        const dlAnchor = document.createElement("a");
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `lovewgc_community_votes_${new Date().toISOString().slice(0,10)}.json`);
        dlAnchor.click();
    },

    render() {
        const grid = document.getElementById("wishlist-grid");
        if (!grid) return;

        // Update tab count badge
        const badge = document.getElementById("tab-vote-count");
        if (badge) badge.textContent = this.proposals.length;

        grid.innerHTML = this.proposals.map(p => {
            const userVote = this.userVotes[p.id] || 0;
            const isUpvoted = userVote === 1;

            return `
                <div class="wishlist-card">
                    <div class="vote-control">
                        <button class="vote-btn ${isUpvoted ? 'upvoted' : ''}" 
                                onclick="WGCVoting.vote('${p.id}', 1)" 
                                title="Upvote this proposal">
                            ${isUpvoted ? '▲' : '△'}
                        </button>
                        <span class="vote-count">${p.votes || 0}</span>
                    </div>
                    <div class="wishlist-body">
                        <div class="wishlist-header">
                            <h3 class="wishlist-title">${p.title}</h3>
                            <span class="wishlist-cat">${p.category}</span>
                        </div>
                        <div class="wishlist-location">📍 Target Area: ${p.target_area || "Welwyn Garden City"}</div>
                        <p class="wishlist-desc">${p.description}</p>
                        ${p.benefits ? `<div class="wishlist-impact">✨ <strong>Community Impact:</strong> ${p.benefits}</div>` : ""}
                    </div>
                </div>
            `;
        }).join("");
    }
};

window.WGCVoting = WGCVoting;
