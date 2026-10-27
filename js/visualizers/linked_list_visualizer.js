/**
 * Linked List Visualizer
 * Renders Singly Linked List with:
 * - Dynamic [ Data | Next • ] node cells
 * - Heap memory addresses (e.g., 0x10A4)
 * - Animated pointer arrows to next node and NULL terminator
 * - Floating newNode staging area during insertion
 * - Multi-pointer indicators (HEAD, prev, curr, next) during reverse & traversal
 */

class LinkedListVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="ll-vis-container">
                <!-- Top Status Bar -->
                <div class="ll-badges-bar">
                    <div class="stat-pill"><span class="pill-label">HEAD:</span> <strong id="ll-head-badge">—</strong></div>
                    <div class="stat-pill"><span class="pill-label">NODE COUNT:</span> <strong id="ll-count-badge">0</strong></div>
                    <div class="stat-pill status-pill" id="ll-status-badge"><span>READY</span></div>
                </div>

                <!-- Staging Area for Newly Allocated Node -->
                <div class="ll-staging-area" id="ll-staging-area" style="display: none;">
                    <div class="staging-title">Allocated New Node (Heap Memory)</div>
                    <div class="staging-node-box" id="ll-staging-node"></div>
                </div>

                <!-- Main Linked List Chain Track -->
                <div class="ll-canvas-viewport">
                    <div class="ll-chain-track" id="ll-chain-track">
                        <!-- Chain rendered dynamically -->
                    </div>
                </div>

                <!-- Operation Banner -->
                <div class="op-status-card" id="ll-op-banner">
                    <div class="op-type" id="ll-op-type">Ready</div>
                    <div class="op-desc" id="ll-op-desc">Choose an operation (Insert, Delete, Search, Reverse) to begin.</div>
                </div>
            </div>
        `;
    }

    render(nodesArray, step = null) {
        const chainTrack = document.getElementById('ll-chain-track');
        const stagingArea = document.getElementById('ll-staging-area');
        const stagingNode = document.getElementById('ll-staging-node');
        const headBadge = document.getElementById('ll-head-badge');
        const countBadge = document.getElementById('ll-count-badge');
        const statusBadge = document.getElementById('ll-status-badge');
        const opType = document.getElementById('ll-op-type');
        const opDesc = document.getElementById('ll-op-desc');

        if (!chainTrack) return;

        const count = nodesArray ? nodesArray.length : 0;
        if (headBadge) headBadge.textContent = count > 0 ? nodesArray[0].address : 'NULL';
        if (countBadge) countBadge.textContent = count;

        if (statusBadge) {
            if (step && step.error) {
                statusBadge.className = 'stat-pill status-pill pill-error';
                statusBadge.innerHTML = `<span>${step.error}</span>`;
            } else if (count === 0) {
                statusBadge.className = 'stat-pill status-pill pill-info';
                statusBadge.innerHTML = `<span>EMPTY</span>`;
            } else {
                statusBadge.className = 'stat-pill status-pill pill-success';
                statusBadge.innerHTML = `<span>ACTIVE (${count} nodes)</span>`;
            }
        }

        if (opType && opDesc && step) {
            opType.textContent = step.action.replace('-', ' ').toUpperCase();
            opDesc.textContent = step.description;
            if (step.error) opType.className = 'op-type text-error';
            else opType.className = 'op-type text-accent';
        }

        // Render Staging Area for newNode if present in step
        if (step && step.newNode) {
            stagingArea.style.display = 'block';
            stagingNode.innerHTML = `
                <div class="ll-node-card node-new-staged">
                    <div class="ll-node-addr">${step.newNode.address}</div>
                    <div class="ll-node-body">
                        <div class="ll-val-part">${step.newNode.value}</div>
                        <div class="ll-ptr-part">
                            <span class="ptr-dot">●</span>
                            <span class="ptr-target">${step.newNode.nextAddress || 'NULL'}</span>
                        </div>
                    </div>
                    <div class="ll-pointer-label-new">newNode</div>
                </div>
            `;
        } else {
            if (stagingArea) stagingArea.style.display = 'none';
        }

        // Render Chain
        if (!nodesArray || nodesArray.length === 0) {
            chainTrack.innerHTML = `
                <div class="ll-head-pointer-box">
                    <span class="head-tag">HEAD</span>
                    <span class="head-arrow">➔</span>
                </div>
                <div class="ll-null-terminator">
                    <span class="null-box">NULL</span>
                    <span class="null-sub">(Empty List)</span>
                </div>
            `;
            return;
        }

        let html = `
            <div class="ll-head-pointer-box">
                <span class="head-tag">HEAD</span>
                <span class="head-arrow">➔</span>
            </div>
        `;

        nodesArray.forEach((node, idx) => {
            const isHighlight = step && (
                step.highlightNodeId === node.id ||
                step.foundNodeId === node.id
            );
            const isSecondary = step && step.secondaryHighlightId === node.id;
            const isFound = step && step.foundNodeId === node.id;
            const isReversedLink = step && step.reversedLinkId === node.id;

            // Check pointer annotations (prev, curr, next)
            const ptrState = step && step.pointerState ? step.pointerState : null;
            const isPrev = ptrState && ptrState.prevId === node.id;
            const isCurr = ptrState && ptrState.currId === node.id;
            const isNext = ptrState && ptrState.nextId === node.id;

            let nodeCardClass = 'll-node-card';
            if (isFound) nodeCardClass += ' node-found';
            else if (isHighlight) nodeCardClass += ' node-highlight';
            else if (isSecondary) nodeCardClass += ' node-secondary';

            // Active pointer badges above node
            const activePtrs = [];
            if (idx === 0) activePtrs.push('HEAD');
            if (isPrev) activePtrs.push('prev');
            if (isCurr) activePtrs.push('curr');
            if (isNext) activePtrs.push('next');

            html += `
                <div class="ll-chain-node-item">
                    ${activePtrs.length > 0 ? `
                        <div class="ll-floating-pointers">
                            ${activePtrs.map(p => `<span class="ptr-chip chip-${p.toLowerCase()}">${p} ↓</span>`).join('')}
                        </div>
                    ` : '<div class="ll-floating-pointers-spacer"></div>'}

                    <div class="${nodeCardClass}">
                        <div class="ll-node-addr">${node.address}</div>
                        <div class="ll-node-body">
                            <div class="ll-val-part">${node.value}</div>
                            <div class="ll-ptr-part ${isReversedLink ? 'ptr-reversed' : ''}">
                                <span class="ptr-dot">●</span>
                                <span class="ptr-target">${node.nextAddress}</span>
                            </div>
                        </div>
                        <div class="ll-node-idx">[${idx}]</div>
                    </div>

                    <!-- Arrow to Next Node -->
                    <div class="ll-connector-arrow">
                        <svg width="40" height="20" viewBox="0 0 40 20">
                            <line x1="2" y1="10" x2="32" y2="10" stroke="var(--color-border-hover)" stroke-width="2" />
                            <polygon points="32,6 38,10 32,14" fill="var(--color-border-hover)" />
                        </svg>
                    </div>
                </div>
            `;
        });

        // NULL Terminator at the end of the chain
        html += `
            <div class="ll-null-terminator">
                <div class="ll-floating-pointers-spacer"></div>
                <span class="null-box">NULL</span>
            </div>
        `;

        chainTrack.innerHTML = html;
    }
}
