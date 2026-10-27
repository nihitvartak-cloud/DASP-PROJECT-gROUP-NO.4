/**
 * Queue Visualizer
 * Dual representation:
 * 1. Horizontal FIFO Queue pipeline with dynamic FRONT & REAR pointers
 * 2. Synchronized memory array representation with addresses and indicators
 */

class QueueVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="queue-vis-container">
                <div class="queue-badges-bar">
                    <div class="stat-pill"><span class="pill-label">FRONT POINTER:</span> <strong id="queue-front-badge">0</strong></div>
                    <div class="stat-pill"><span class="pill-label">REAR POINTER:</span> <strong id="queue-rear-badge">-1</strong></div>
                    <div class="stat-pill"><span class="pill-label">SIZE:</span> <strong id="queue-size-badge">0</strong></div>
                    <div class="stat-pill"><span class="pill-label">CAPACITY:</span> <strong id="queue-cap-badge">7</strong></div>
                    <div class="stat-pill status-pill" id="queue-status-badge"><span>READY</span></div>
                </div>

                <!-- Main Queue Pipeline -->
                <div class="queue-pipeline-card">
                    <div class="pipeline-header">
                        <span class="card-title">FIFO Queue Pipeline</span>
                        <span class="pipeline-flow-info">Service Direction: Dequeue at FRONT ← | Enqueue at REAR ←</span>
                    </div>

                    <div class="queue-flow-area">
                        <div class="queue-pointer-portal front-portal">
                            <span class="portal-badge badge-front">FRONT ➔</span>
                            <span class="portal-sub">Dequeue End</span>
                        </div>

                        <div class="queue-slots-container" id="queue-slots-track">
                            <!-- Queue cells rendered dynamically -->
                        </div>

                        <div class="queue-pointer-portal rear-portal">
                            <span class="portal-badge badge-rear">➔ REAR</span>
                            <span class="portal-sub">Enqueue End</span>
                        </div>
                    </div>
                </div>

                <!-- Synchronized RAM / Memory Array Card -->
                <div class="array-rep-card">
                    <div class="card-title">Synchronized Memory Array Representation</div>
                    <div class="array-slots-track" id="queue-array-track">
                        <!-- Memory array cells -->
                    </div>
                </div>

                <!-- Operation Trace Banner -->
                <div class="op-status-card" id="queue-op-banner">
                    <div class="op-type" id="queue-op-type">Ready</div>
                    <div class="op-desc" id="queue-op-desc">Select an operation (Enqueue, Dequeue, Front, Rear) to begin.</div>
                </div>
            </div>
        `;
    }

    render(memoryState, step = null) {
        if (!memoryState) return;

        const slotsTrack = document.getElementById('queue-slots-track');
        const arrayTrack = document.getElementById('queue-array-track');
        const frontBadge = document.getElementById('queue-front-badge');
        const rearBadge = document.getElementById('queue-rear-badge');
        const sizeBadge = document.getElementById('queue-size-badge');
        const capBadge = document.getElementById('queue-cap-badge');
        const statusBadge = document.getElementById('queue-status-badge');
        const opType = document.getElementById('queue-op-type');
        const opDesc = document.getElementById('queue-op-desc');

        if (!slotsTrack || !arrayTrack) return;

        // Update stats
        if (frontBadge) frontBadge.textContent = memoryState.front !== null ? `[${memoryState.front}]` : '—';
        if (rearBadge) rearBadge.textContent = memoryState.rear !== null ? `[${memoryState.rear}]` : '—';
        if (sizeBadge) sizeBadge.textContent = memoryState.size;
        if (capBadge) capBadge.textContent = memoryState.capacity;

        if (statusBadge) {
            if (step && step.error) {
                statusBadge.className = 'stat-pill status-pill pill-error';
                statusBadge.innerHTML = `<span>${step.error}</span>`;
            } else if (memoryState.isFull) {
                statusBadge.className = 'stat-pill status-pill pill-warn';
                statusBadge.innerHTML = `<span>FULL</span>`;
            } else if (memoryState.isEmpty) {
                statusBadge.className = 'stat-pill status-pill pill-info';
                statusBadge.innerHTML = `<span>EMPTY</span>`;
            } else {
                statusBadge.className = 'stat-pill status-pill pill-success';
                statusBadge.innerHTML = `<span>ACTIVE</span>`;
            }
        }

        if (opType && opDesc && step) {
            opType.textContent = step.action.replace('-', ' ').toUpperCase();
            opDesc.textContent = step.description;
            if (step.error) opType.className = 'op-type text-error';
            else opType.className = 'op-type text-accent';
        }

        // Render Pipeline Elements
        let pipelineHtml = '';
        if (memoryState.isEmpty) {
            pipelineHtml = `<div class="queue-empty-indicator">Queue is Empty — No waiting elements</div>`;
        } else {
            memoryState.items.forEach((val, idx) => {
                const isFront = idx === 0;
                const isRear = idx === memoryState.items.length - 1;
                const isHighlight = step && (
                    (step.highlightFrontIndex === idx) ||
                    (step.highlightRearIndex === idx)
                );

                let cellClass = 'queue-pipe-cell';
                if (isFront) cellClass += ' cell-is-front';
                if (isRear) cellClass += ' cell-is-rear';
                if (isHighlight) cellClass += ' cell-highlight';

                pipelineHtml += `
                    <div class="${cellClass}">
                        <div class="pipe-cell-idx">Pos ${idx}</div>
                        <div class="pipe-cell-val">${val}</div>
                        <div class="pipe-cell-badge">
                            ${isFront ? '<span class="mini-tag tag-front">FRONT</span>' : ''}
                            ${isRear ? '<span class="mini-tag tag-rear">REAR</span>' : ''}
                        </div>
                    </div>
                `;
            });
        }
        slotsTrack.innerHTML = pipelineHtml;

        // Render Synchronized Array Memory Cells (0 to capacity - 1)
        let arrayHtml = '';
        const cap = memoryState.capacity;
        for (let i = 0; i < cap; i++) {
            const slot = memoryState.slots.find(s => s.index === i) || { index: i, value: null, isFront: false, isRear: false, address: `0x8FFE${(i * 4).toString(16).padStart(2, '0').toUpperCase()}` };
            const isFilled = slot.value !== null;
            const isFront = slot.isFront;
            const isRear = slot.isRear;
            const isHighlight = step && (
                (step.highlightFrontIndex === i) ||
                (step.highlightRearIndex === i)
            );

            let cellClass = 'array-cell';
            if (isFilled) cellClass += ' cell-filled';
            if (isFront) cellClass += ' cell-front';
            if (isRear) cellClass += ' cell-rear';
            if (isHighlight) cellClass += ' cell-highlight';

            let ptrLabels = [];
            if (isFront) ptrLabels.push('FRONT');
            if (isRear) ptrLabels.push('REAR');

            arrayHtml += `
                <div class="array-column-item">
                    <div class="array-slot-addr">${slot.address}</div>
                    <div class="array-index-label">[${i}]</div>
                    <div class="${cellClass}">
                        ${isFilled ? slot.value : '—'}
                    </div>
                    <div class="array-pointer-mark">
                        ${ptrLabels.length > 0 ? `<span class="arr-ptr-tag">${ptrLabels.join(' & ')}</span>` : '&nbsp;'}
                    </div>
                </div>
            `;
        }
        arrayTrack.innerHTML = arrayHtml;
    }
}
