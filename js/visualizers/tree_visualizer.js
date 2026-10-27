/**
 * Tree Visualizer (SVG-based)
 * Renders Binary Search Tree with dynamic pan/zoom, collision-resistant layout,
 * node states, comparison markers, traversal sequences, and BFS queue view.
 */

class TreeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svg = null;
        this.g = null; // Main zoom/pan transform group
        this.edgesG = null;
        this.nodesG = null;
        this.labelsG = null;
        this.traversalBar = null;
        this.bfsQueueBar = null;

        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.startX = 0;
        this.startY = 0;

        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = '';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'tree-vis-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.overflow = 'hidden';

        // Traversal result bar
        this.traversalBar = document.createElement('div');
        this.traversalBar.className = 'traversal-result-bar';
        this.traversalBar.style.display = 'none';
        wrapper.appendChild(this.traversalBar);

        // BFS queue bar
        this.bfsQueueBar = document.createElement('div');
        this.bfsQueueBar.className = 'bfs-queue-bar';
        this.bfsQueueBar.style.display = 'none';
        wrapper.appendChild(this.bfsQueueBar);

        // Floating Zoom/Pan Controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'canvas-floating-controls';
        zoomControls.innerHTML = `
            <button class="icon-btn-sm" id="btn-tree-zoom-in" title="Zoom In">+</button>
            <button class="icon-btn-sm" id="btn-tree-zoom-out" title="Zoom Out">−</button>
            <button class="icon-btn-sm" id="btn-tree-zoom-reset" title="Reset View">⟲</button>
            <button class="icon-btn-sm" id="btn-tree-fit" title="Fit Entire Tree to Canvas">⛶ Fit</button>
        `;
        wrapper.appendChild(zoomControls);

        // SVG Canvas
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'tree-svg-canvas');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.style.cursor = 'grab';

        // Defs for glowing filters and markers
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border-hover, #64748b)" />
            </marker>
        `;
        this.svg.appendChild(defs);

        // Main transform group
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.edgesG.setAttribute('class', 'edges-layer');
        this.nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.nodesG.setAttribute('class', 'nodes-layer');
        this.labelsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.labelsG.setAttribute('class', 'labels-layer');

        this.g.appendChild(this.edgesG);
        this.g.appendChild(this.nodesG);
        this.g.appendChild(this.labelsG);
        this.svg.appendChild(this.g);

        wrapper.appendChild(this.svg);
        this.container.appendChild(wrapper);

        // Bind Pan & Zoom
        this.bindEvents();

        // Bind zoom buttons
        document.getElementById('btn-tree-zoom-in')?.addEventListener('click', () => this.zoomBy(1.2));
        document.getElementById('btn-tree-zoom-out')?.addEventListener('click', () => this.zoomBy(0.8));
        document.getElementById('btn-tree-zoom-reset')?.addEventListener('click', () => this.resetView());
        document.getElementById('btn-tree-fit')?.addEventListener('click', () => this.fitTree());
    }

    bindEvents() {
        this.svg.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            this.isPanning = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
            this.svg.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isPanning) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.applyTransform();
        });

        window.addEventListener('mouseup', () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.svg.style.cursor = 'grab';
            }
        });

        this.svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            this.zoomAtPoint(zoomFactor, e.clientX, e.clientY);
        }, { passive: false });
    }

    zoomBy(factor) {
        const rect = this.svg.getBoundingClientRect();
        this.zoomAtPoint(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    zoomAtPoint(factor, clientX, clientY) {
        const rect = this.svg.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const newZoom = Math.max(0.3, Math.min(3.5, this.zoom * factor));
        const zoomDelta = newZoom / this.zoom;

        this.panX = mouseX - (mouseX - this.panX) * zoomDelta;
        this.panY = mouseY - (mouseY - this.panY) * zoomDelta;
        this.zoom = newZoom;

        this.applyTransform();
    }

    resetView() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
    }

    fitTree() {
        if (!this.currentNodeList || this.currentNodeList.length === 0) {
            this.resetView();
            return;
        }
        const minX = Math.min(...this.currentNodeList.map(n => n.x)) - 60;
        const maxX = Math.max(...this.currentNodeList.map(n => n.x)) + 60;
        const minY = Math.min(...this.currentNodeList.map(n => n.y)) - 60;
        const maxY = Math.max(...this.currentNodeList.map(n => n.y)) + 60;
        const treeW = maxX - minX;
        const treeH = maxY - minY;

        const rect = this.svg.getBoundingClientRect();
        const viewW = rect.width || 800;
        const viewH = rect.height || 540;

        const scaleX = viewW / Math.max(treeW, 100);
        const scaleY = viewH / Math.max(treeH, 100);
        this.zoom = Math.max(0.35, Math.min(1.4, Math.min(scaleX, scaleY) * 0.88));

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        this.panX = (viewW / 2) - (centerX * this.zoom);
        this.panY = (viewH / 2) - (centerY * this.zoom) + 20;

        this.applyTransform();
    }

    applyTransform() {
        if (this.g) {
            this.g.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
        }
    }

    /**
     * Render given tree snapshot and step highlight states
     */
    render(treeRoot, step = null) {
        if (!this.edgesG || !this.nodesG) return;

        this.edgesG.innerHTML = '';
        this.nodesG.innerHTML = '';
        this.labelsG.innerHTML = '';

        // Handle Traversal Result Bar
        if (step && step.traversalResult && step.traversalResult.length > 0) {
            this.traversalBar.style.display = 'flex';
            this.traversalBar.innerHTML = `
                <span class="traversal-label">Traversal Sequence:</span>
                <div class="traversal-pills">
                    ${step.traversalResult.map((val, idx) => `
                        <span class="traversal-pill ${idx === step.traversalResult.length - 1 ? 'latest' : ''}">${val}</span>
                        ${idx < step.traversalResult.length - 1 ? '<span class="traversal-arrow">→</span>' : ''}
                    `).join('')}
                </div>
            `;
        } else {
            this.traversalBar.style.display = 'none';
        }

        // Handle BFS Queue Bar
        if (step && step.auxiliaryQueue !== undefined) {
            this.bfsQueueBar.style.display = 'flex';
            this.bfsQueueBar.innerHTML = `
                <span class="queue-vis-label">Level Order Queue:</span>
                <div class="queue-track-mini">
                    <span class="queue-end-label">FRONT</span>
                    ${step.auxiliaryQueue.length === 0 ? '<span class="queue-empty-tag">(Empty)</span>' : ''}
                    ${step.auxiliaryQueue.map((v, i) => `<span class="queue-pill ${i === 0 ? 'head' : ''}">${v}</span>`).join('')}
                    <span class="queue-end-label">REAR</span>
                </div>
            `;
        } else {
            this.bfsQueueBar.style.display = 'none';
        }

        if (!treeRoot) {
            // Empty tree view
            const emptyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            emptyText.setAttribute('x', '450');
            emptyText.setAttribute('y', '220');
            emptyText.setAttribute('text-anchor', 'middle');
            emptyText.setAttribute('class', 'empty-tree-text');
            emptyText.textContent = 'Tree is empty. Insert a value or choose a preset above.';
            this.nodesG.appendChild(emptyText);
            return;
        }

        const nodeStates = step && step.nodeStates ? step.nodeStates : {};
        const highlightEdges = step && step.highlightEdges ? step.highlightEdges : [];

        // Collect all nodes and edges
        const nodesList = [];
        const edgesList = [];

        const collect = (node) => {
            if (!node) return;
            nodesList.push(node);
            if (node.left) {
                edgesList.push({ from: node, to: node.left, isLeft: true });
                collect(node.left);
            }
            if (node.right) {
                edgesList.push({ from: node, to: node.right, isLeft: false });
                collect(node.right);
            }
        };

        collect(treeRoot);
        this.currentNodeList = nodesList;

        // Render Edges
        edgesList.forEach(({ from, to, isLeft }) => {
            const isHighlighted = highlightEdges.some(
                ([fId, tId]) => (fId === from.id && tId === to.id) || (fId === to.id && tId === from.id)
            );

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // Curved or direct connection from edge of circle to edge of child
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const r = 24;

            const startX = from.x + (dx / dist) * r;
            const startY = from.y + (dy / dist) * r;
            const endX = to.x - (dx / dist) * r;
            const endY = to.y - (dy / dist) * r;

            path.setAttribute('d', `M ${startX} ${startY} L ${endX} ${endY}`);
            path.setAttribute('class', `tree-edge ${isHighlighted ? 'edge-active' : ''}`);
            this.edgesG.appendChild(path);

            // Small branch direction indicator (L / R)
            const labelX = (startX + endX) / 2 + (isLeft ? -10 : 10);
            const labelY = (startY + endY) / 2;
            const branchLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            branchLabel.setAttribute('x', labelX);
            branchLabel.setAttribute('y', labelY);
            branchLabel.setAttribute('class', 'edge-branch-label');
            branchLabel.setAttribute('text-anchor', 'middle');
            branchLabel.textContent = isLeft ? 'L' : 'R';
            this.labelsG.appendChild(branchLabel);
        });

        // Render Nodes
        nodesList.forEach((node) => {
            const state = nodeStates[node.id] || 'normal';

            const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gNode.setAttribute('class', `tree-node-group state-${state}`);
            gNode.setAttribute('transform', `translate(${node.x}, ${node.y})`);

            // Outer pulse/halo circle for active states
            if (state !== 'normal') {
                const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                halo.setAttribute('r', '29');
                halo.setAttribute('class', `node-halo halo-${state}`);
                gNode.appendChild(halo);
            }

            // Main node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '24');
            circle.setAttribute('class', `node-circle circle-${state}`);
            gNode.appendChild(circle);

            // Node text value
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('class', 'node-text');
            text.textContent = node.value;
            gNode.appendChild(text);

            // State Badge above node (e.g., Comparing, Successor, Target)
            if (state === 'successor') {
                const badge = this.createBadge(0, -36, 'SUCCESSOR', 'badge-purple');
                gNode.appendChild(badge);
            } else if (state === 'deleting') {
                const badge = this.createBadge(0, -36, 'DELETING', 'badge-red');
                gNode.appendChild(badge);
            } else if (state === 'comparing') {
                const badge = this.createBadge(0, -36, 'COMPARING', 'badge-yellow');
                gNode.appendChild(badge);
            } else if (state === 'found') {
                const badge = this.createBadge(0, -36, 'FOUND', 'badge-green');
                gNode.appendChild(badge);
            }

            this.nodesG.appendChild(gNode);
        });
    }

    createBadge(x, y, text, cssClass) {
        const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badgeG.setAttribute('transform', `translate(${x}, ${y})`);
        badgeG.setAttribute('class', `node-badge ${cssClass}`);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '-38');
        rect.setAttribute('y', '-11');
        rect.setAttribute('width', '76');
        rect.setAttribute('height', '18');
        rect.setAttribute('rx', '4');

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('font-size', '9');
        label.setAttribute('font-weight', '700');
        label.textContent = text;

        badgeG.appendChild(rect);
        badgeG.appendChild(label);
        return badgeG;
    }
}
