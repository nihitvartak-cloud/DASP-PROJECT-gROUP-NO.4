/**
 * Stack Visualizer
 * Dual representation:
 * 1. Vertical LIFO memory structure with animated TOP pointer
 * 2. Synchronized horizontal array representation with index tags
 */

class StackVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="stack-vis-container">
                <div class="stack-main-split">
                    <!-- Left: Vertical Memory Stack -->
                    <div class="stack-vertical-panel">
                        <div class="stack-column-header">
                            <span class="column-title">LIFO Memory Column</span>
                            <span class="column-subtitle">Growth Direction: ↑ UPWARDS</span>
                        </div>
                        <div class="stack-vertical-wrapper" id="stack-slots-wrapper">
                            <!-- Slots rendered dynamically -->
                        </div>
                    </div>

                    <!-- Right: Synchronized Array & Stats -->
                    <div class="stack-stats-panel">
                        <div class="stack-badges-bar">
                            <div class="stat-pill"><span class="pill-label">TOP INDEX:</span> <strong id="stack-top-badge">-1</strong></div>
                            <div class="stat-pill"><span class="pill-label">SIZE:</span> <strong id="stack-size-badge">0</strong></div>
                            <div class="stat-pill"><span class="pill-label">CAPACITY:</span> <strong id="stack-cap-badge">7</strong></div>
                            <div class="stat-pill status-pill" id="stack-status-badge"><span>READY</span></div>
                        </div>

                        <!-- Horizontal Memory Array Representation -->
                        <div class="array-rep-card">
                            <div class="card-title">Synchronized Array Representation (RAM View)</div>
                            <div class="array-slots-track" id="stack-array-track">
                                <!-- Array cells rendered dynamically -->
                            </div>
                        </div>

                        <!-- Active Operation Banner -->
                        <div class="op-status-card" id="stack-op-banner">
                            <div class="op-type" id="stack-op-type">Ready</div>
                            <div class="op-desc" id="stack-op-desc">Select an operation (Push, Pop, Peek) to begin.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(memoryState, step = null) {
        if (!memoryState) return;

        const slotsWrapper = document.getElementById('stack-slots-wrapper');
        const arrayTrack = document.getElementById('stack-array-track');
        const topBadge = document.getElementById('stack-top-badge');
        const sizeBadge = document.getElementById('stack-size-badge');
        const capBadge = document.getElementById('stack-cap-badge');
        const statusBadge = document.getElementById('stack-status-badge');
        const opType = document.getElementById('stack-op-type');
        const opDesc = document.getElementById('stack-op-desc');

        if (!slotsWrapper || !arrayTrack) return;

        // Update badges
        if (topBadge) topBadge.textContent = memoryState.top >= 0 ? memoryState.top : '— (EMPTY)';
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
            if (step.error) {
                opType.className = 'op-type text-error';
            } else {
                opType.className = 'op-type text-accent';
            }
        }

        // Render Vertical Stack Slots (from capacity - 1 down to 0)
        let slotsHtml = '';
        const cap = memoryState.capacity;
        for (let i = cap - 1; i >= 0; i--) {
            const slot = memoryState.slots.find(s => s.index === i) || { index: i, value: null, isTop: false, address: `0x7FFE${(i * 4).toString(16).padStart(2, '0').toUpperCase()}` };
            const isFilled = slot.value !== null;
            const isTop = slot.isTop;
            const isHighlighted = step && step.highlightIndex === i;

            let slotClass = 'stack-slot';
            if (isFilled) slotClass += ' slot-filled';
            else slotClass += ' slot-empty';
            if (isTop) slotClass += ' slot-top';
            if (isHighlighted) slotClass += ' slot-highlight';

            slotsHtml += `
                <div class="${slotClass}">
                    <div class="slot-addr">${slot.address}</div>
                    <div class="slot-idx-box">[${i}]</div>
                    <div class="slot-val-box">
                        ${isFilled ? `<span class="val-num">${slot.value}</span>` : '<span class="empty-label">EMPTY</span>'}
                    </div>
                    <div class="slot-pointer-zone">
                        ${isTop ? '<span class="top-pointer-badge">← TOP</span>' : ''}
                    </div>
                </div>
            `;
        }
        slotsWrapper.innerHTML = slotsHtml;

        // Render Horizontal Array Cells (0 to capacity - 1)
        let arrayHtml = '';
        for (let i = 0; i < cap; i++) {
            const slot = memoryState.slots.find(s => s.index === i) || { index: i, value: null, isTop: false };
            const isFilled = slot.value !== null;
            const isTop = slot.isTop;
            const isHighlighted = step && step.highlightIndex === i;

            let cellClass = 'array-cell';
            if (isFilled) cellClass += ' cell-filled';
            if (isTop) cellClass += ' cell-top';
            if (isHighlighted) cellClass += ' cell-highlight';

            arrayHtml += `
                <div class="array-column-item">
                    <div class="array-index-label">[${i}]</div>
                    <div class="${cellClass}">
                        ${isFilled ? slot.value : '—'}
                    </div>
                    <div class="array-pointer-mark">
                        ${isTop ? '<span class="arr-top-label">↑ TOP</span>' : '&nbsp;'}
                    </div>
                </div>
            `;
        }
        arrayTrack.innerHTML = arrayHtml;
    }
}
