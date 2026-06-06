// Structure View - Render hierarchical UK area metadata

function renderStructureTree(container, rootArea) {
    const html = renderAreaNode(rootArea);
    container.innerHTML = html;
    attachTreeToggleHandlers();
}

function renderAreaNode(area) {
    const hasChildren = area.children && area.children.length > 0;
    const toggleIcon = hasChildren ? '▼' : '◦';
    const toggleClass = hasChildren ? 'expandable' : '';

    let html = `
        <div class="tree-item">
            <div class="tree-header level-${area.level}" data-area-id="${area.id}">
                <div class="tree-toggle">${hasChildren ? toggleIcon : '◦'}</div>
                <div class="tree-title">
                    <span class="flag-icon">${area.flag}</span>
                    <span>${area.name}</span>
                </div>
                <span>${hasChildren ? '▼' : ''}</span>
            </div>
            <div class="tree-content ${hasChildren ? 'children' : ''}">
                ${renderMetadata(area)}
                ${hasChildren ? renderChildren(area.children) : ''}
            </div>
        </div>
    `;

    return html;
}

function renderMetadata(area) {
    let html = '<div class="metadata">';

    for (const [label, value] of Object.entries(area.metadata)) {
        html += `
            <div class="metadata-row">
                <div class="metadata-label">${label}</div>
                <div class="metadata-value">${value}</div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function renderChildren(children) {
    let html = '<div class="children-container">';
    for (const child of children) {
        html += renderAreaNode(child);
    }
    html += '</div>';
    return html;
}

function attachTreeToggleHandlers() {
    document.querySelectorAll('.tree-header').forEach(header => {
        header.addEventListener('click', function(e) {
            const content = this.nextElementSibling;
            const childrenContainer = content.querySelector('.children-container');

            if (childrenContainer) {
                content.classList.toggle('open');
                const toggle = this.querySelector('.tree-toggle');
                toggle.textContent = content.classList.contains('open') ? '▼' : '▶';
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('structureTree');
    if (container && typeof areaStructure !== 'undefined') {
        renderStructureTree(container, areaStructure);
    }
});
