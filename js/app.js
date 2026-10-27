/**
 * DSA Simulator - Main Application Orchestrator
 * Coordinates controllers, views, theme, sound, timeline scrubber,
 * code panels, live memory view, quiz mode, and keyboard shortcuts.
 */

class App {
    constructor() {
        this.activeView = 'home';
        this.currentController = null;
        this.studentMode = true;
        this.quizMode = false;
        this.quizState = {
            currentQuestionIdx: 0,
            score: 0,
            totalAnswered: 0
        };

        // Initialize controllers map
        this.controllers = {};

        // Active code tab: 'pseudo' or 'python'
        this.activeCodeTab = 'pseudo';
    }

    init() {
        // Initialize Theme from localStorage
        this.initTheme();

        // Initialize Sound setting
        this.initSound();

        // Initialize Speed setting
        this.initSpeed();

        // Initialize Student Mode
        this.initStudentMode();

        // Instantiate Structure Controllers
        this.controllers.bst = new TreeController(this);
        this.controllers.stack = new StackController(this);
        this.controllers.queue = new QueueController(this);
        this.controllers.ll = new LinkedListController(this);

        // Bind DOM Events
        this.bindNavEvents();
        this.bindPlaybackEvents();
        this.bindInputEvents();
        this.bindCodeTabEvents();
        this.bindKeyboardShortcuts();
        this.bindQuizEvents();

        // Route to initial view (check URL hash first, then saved preference, default to 'home')
        const hash = window.location.hash.replace('#', '').trim();
        const validRoutes = ['home', 'bst', 'stack', 'queue', 'll'];
        const initialView = validRoutes.includes(hash) ? hash : (localStorage.getItem('dsa_active_view') || 'home');
        this.switchView(initialView, true);

        // Listen for browser back/forward and hash changes
        window.addEventListener('hashchange', () => {
            const currentHash = window.location.hash.replace('#', '').trim();
            if (validRoutes.includes(currentHash) && currentHash !== this.activeView) {
                this.switchView(currentHash, false);
            }
        });

        // Toast welcome
        setTimeout(() => {
            this.toast('Welcome to DSA Simulator — Lab Edition!', 'info');
        }, 300);
    }

    /* =========================================================================
       THEME & SOUND SETTINGS
       ========================================================================= */

    initTheme() {
        const savedTheme = localStorage.getItem('dsa_theme') || 'dark';
        this.setTheme(savedTheme);

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            this.setTheme(next);
        });
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('dsa_theme', theme);
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    initSound() {
        const soundBtn = document.getElementById('sound-toggle');
        const updateSoundBtn = () => {
            if (soundBtn) {
                soundBtn.innerHTML = window.sound.enabled ? '🔊 <span class="btn-text">Sound ON</span>' : '🔇 <span class="btn-text">Sound OFF</span>';
            }
        };
        updateSoundBtn();

        soundBtn?.addEventListener('click', () => {
            const enabled = window.sound.toggle();
            updateSoundBtn();
            this.toast(enabled ? 'Sound enabled.' : 'Sound muted.', 'info');
        });
    }

    initSpeed() {
        const speedSelect = document.getElementById('playback-speed-select');
        const savedSpeed = localStorage.getItem('dsa_speed') || '1';
        if (speedSelect) {
            speedSelect.value = savedSpeed;
            speedSelect.addEventListener('change', (e) => {
                const spd = e.target.value === 'Instant' ? Infinity : Number(e.target.value);
                localStorage.setItem('dsa_speed', e.target.value);
                if (this.currentController) {
                    this.currentController.setSpeed(spd);
                }
            });
        }
    }

    initStudentMode() {
        const toggle = document.getElementById('student-mode-toggle');
        const saved = localStorage.getItem('dsa_student_mode');
        this.studentMode = saved !== null ? saved === 'true' : true;
        if (toggle) {
            toggle.checked = this.studentMode;
            toggle.addEventListener('change', (e) => {
                this.studentMode = e.target.checked;
                localStorage.setItem('dsa_student_mode', this.studentMode);
                document.body.classList.toggle('student-mode-active', this.studentMode);
                this.toast(`Student Mode ${this.studentMode ? 'Enabled' : 'Disabled'}.`, 'info');
            });
        }
        document.body.classList.toggle('student-mode-active', this.studentMode);
    }

    /* =========================================================================
       NAVIGATION & VIEW SWITCHING
       ========================================================================= */

    bindNavEvents() {
        document.querySelectorAll('[data-route]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const route = el.getAttribute('data-route');
                this.switchView(route);
            });
        });

        // Shortcuts modal trigger
        document.getElementById('btn-shortcuts-modal')?.addEventListener('click', () => {
            this.toggleShortcutsModal(true);
        });
        document.getElementById('close-shortcuts-modal')?.addEventListener('click', () => {
            this.toggleShortcutsModal(false);
        });

        // Quiz Mode trigger
        document.getElementById('btn-quiz-toggle')?.addEventListener('click', () => {
            this.toggleQuizModal();
        });
        document.getElementById('close-quiz-modal')?.addEventListener('click', () => {
            this.toggleQuizModal(false);
        });

        // Side Deck Collapse / Expand toggle
        const toggleDeck = () => {
            const split = document.querySelector('.simulator-main-split');
            if (!split) return;
            const isCollapsed = split.classList.toggle('deck-collapsed');
            const toggleBtn = document.getElementById('btn-toggle-deck');
            if (toggleBtn) {
                toggleBtn.innerHTML = isCollapsed ? '◀ Deck' : '⮞';
                toggleBtn.title = isCollapsed ? 'Expand Control Deck' : 'Collapse Side Deck (Maximize Canvas)';
            }
            this.toast(isCollapsed ? 'Deck collapsed: Canvas maximized.' : 'Deck expanded.', 'info');
        };
        document.getElementById('btn-toggle-deck')?.addEventListener('click', toggleDeck);
        document.getElementById('btn-collapse-deck-header')?.addEventListener('click', toggleDeck);
    }

    switchView(viewName, updateHash = true) {
        // Pause active controller playback if leaving a simulator
        if (this.currentController) {
            this.currentController.pause();
        }

        this.activeView = viewName;
        localStorage.setItem('dsa_active_view', viewName);

        // Update URL hash so the address bar reflects the exact domain route
        if (updateHash && window.location.hash !== `#${viewName}`) {
            history.pushState(null, '', `#${viewName}`);
        }

        // Update nav item active classes
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-route') === viewName);
        });

        // Hide all views
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.style.display = 'none';
        });

        // Show target view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.style.display = 'block';
        }

        // Set current controller
        if (viewName === 'bst') {
            this.currentController = this.controllers.bst;
            this.currentController.init();
        } else if (viewName === 'stack') {
            this.currentController = this.controllers.stack;
            this.currentController.init();
        } else if (viewName === 'queue') {
            this.currentController = this.controllers.queue;
            this.currentController.init();
        } else if (viewName === 'll') {
            this.currentController = this.controllers.ll;
            this.currentController.init();
        } else {
            this.currentController = null;
        }

        // Update speed on new controller
        if (this.currentController) {
            const speedSelect = document.getElementById('playback-speed-select');
            const spd = speedSelect && speedSelect.value === 'Instant' ? Infinity : Number(speedSelect ? speedSelect.value : 1);
            this.currentController.setSpeed(spd);
        }

        // Auto-scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* =========================================================================
       PLAYBACK CONTROLS & TIMELINE SCRUBBER
       ========================================================================= */

    bindPlaybackEvents() {
        document.getElementById('btn-play-pause')?.addEventListener('click', () => {
            this.currentController?.togglePlayPause();
        });

        document.getElementById('btn-prev-step')?.addEventListener('click', () => {
            this.currentController?.prevStep();
        });

        document.getElementById('btn-next-step')?.addEventListener('click', () => {
            this.currentController?.nextStep();
        });

        document.getElementById('btn-restart-step')?.addEventListener('click', () => {
            this.currentController?.restart();
        });

        const slider = document.getElementById('timeline-slider');
        slider?.addEventListener('input', (e) => {
            const idx = Number(e.target.value);
            this.currentController?.jumpToStep(idx);
        });

        // Undo, Redo, Reset history buttons
        document.getElementById('btn-history-undo')?.addEventListener('click', () => {
            this.currentController?.undo();
        });
        document.getElementById('btn-history-redo')?.addEventListener('click', () => {
            this.currentController?.redo();
        });
        document.getElementById('btn-history-reset')?.addEventListener('click', () => {
            this.currentController?.reset();
        });
    }

    setPlayPauseState(isPlaying) {
        const btn = document.getElementById('btn-play-pause');
        if (btn) {
            btn.innerHTML = isPlaying ? '⏸' : '▶';
            btn.title = isPlaying ? 'Pause (Space)' : 'Play (Space)';
            btn.classList.toggle('playing', isPlaying);
        }
    }

    updateTimelineSlider(currentIdx, totalSteps) {
        const slider = document.getElementById('timeline-slider');
        const counter = document.getElementById('step-counter-label');
        if (slider) {
            slider.max = Math.max(0, totalSteps - 1);
            slider.value = currentIdx;
            slider.disabled = totalSteps <= 1;
        }
        if (counter) {
            counter.textContent = totalSteps > 0 ? `Step ${currentIdx + 1} / ${totalSteps}` : 'Step 0 / 0';
        }
    }

    /* =========================================================================
       CODE TABS (PSEUDOCODE & PYTHON)
       ========================================================================= */

    bindCodeTabEvents() {
        const pseudoTab = document.getElementById('tab-pseudocode');
        const pythonTab = document.getElementById('tab-python');
        const pseudoPanel = document.getElementById('panel-pseudocode');
        const pythonPanel = document.getElementById('panel-python');

        pseudoTab?.addEventListener('click', () => {
            this.activeCodeTab = 'pseudo';
            pseudoTab.classList.add('active');
            pythonTab?.classList.remove('active');
            if (pseudoPanel) pseudoPanel.style.display = 'block';
            if (pythonPanel) pythonPanel.style.display = 'none';
        });

        pythonTab?.addEventListener('click', () => {
            this.activeCodeTab = 'python';
            pythonTab.classList.add('active');
            pseudoTab?.classList.remove('active');
            if (pythonPanel) pythonPanel.style.display = 'block';
            if (pseudoPanel) pseudoPanel.style.display = 'none';
        });
    }

    renderCodePanels(title, pseudoLines, pythonLines) {
        const titleEl = document.getElementById('code-operation-title');
        if (titleEl) titleEl.textContent = title;

        const pseudoContainer = document.getElementById('pseudocode-lines');
        if (pseudoContainer) {
            pseudoContainer.innerHTML = pseudoLines.map((line, i) => `
                <div class="code-line" data-line="${i + 1}">
                    <span class="code-line-num">${i + 1}</span>
                    <span class="code-line-text">${this.escapeHtml(line)}</span>
                </div>
            `).join('');
        }

        const pythonContainer = document.getElementById('python-lines');
        if (pythonContainer) {
            pythonContainer.innerHTML = pythonLines.map((line, i) => `
                <div class="code-line" data-line="${i + 1}">
                    <span class="code-line-num">${i + 1}</span>
                    <span class="code-line-text">${this.escapeHtml(line)}</span>
                </div>
            `).join('');
        }
    }

    highlightCodeLine(pseudoLineNum, pythonLineNum) {
        // Highlight pseudocode
        document.querySelectorAll('#pseudocode-lines .code-line').forEach(el => {
            const isMatch = Number(el.getAttribute('data-line')) === pseudoLineNum;
            el.classList.toggle('active-line', isMatch);
            if (isMatch) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });

        // Highlight python code
        document.querySelectorAll('#python-lines .code-line').forEach(el => {
            const isMatch = Number(el.getAttribute('data-line')) === pythonLineNum;
            el.classList.toggle('active-line', isMatch);
            if (isMatch) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
    }

    /* =========================================================================
       TRACE LOG & LIVE STATS
       ========================================================================= */

    populateTraceLog(steps) {
        const logContainer = document.getElementById('trace-log-list');
        if (!logContainer) return;

        if (steps.length === 0) {
            logContainer.innerHTML = '<div class="trace-empty-message">No active trace. Run an operation above.</div>';
            return;
        }

        logContainer.innerHTML = steps.map((s, i) => `
            <div class="trace-item" data-step-idx="${i}">
                <span class="trace-idx">[${i + 1}]</span>
                <span class="trace-text">${s.description}</span>
            </div>
        `).join('');
    }

    highlightTraceLogItem(stepIdx) {
        document.querySelectorAll('#trace-log-list .trace-item').forEach(el => {
            const isMatch = Number(el.getAttribute('data-step-idx')) === stepIdx;
            el.classList.toggle('active-trace', isMatch);
            if (isMatch) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
    }

    updateStudentExplanation(desc, why) {
        const descEl = document.getElementById('student-explanation-desc');
        const whyEl = document.getElementById('student-explanation-why');
        if (descEl) descEl.textContent = desc || '—';
        if (whyEl) whyEl.textContent = why || '—';
    }

    renderComplexityCard(complexity) {
        if (!complexity) return;
        const bestEl = document.getElementById('cplx-best');
        const avgEl = document.getElementById('cplx-avg');
        const worstEl = document.getElementById('cplx-worst');
        const spaceEl = document.getElementById('cplx-space');
        const whyEl = document.getElementById('cplx-why');

        if (bestEl) bestEl.textContent = complexity.best || 'O(1)';
        if (avgEl) avgEl.textContent = complexity.avg || 'O(n)';
        if (worstEl) worstEl.textContent = complexity.worst || 'O(n)';
        if (spaceEl) spaceEl.textContent = complexity.space || 'O(1)';
        if (whyEl) whyEl.textContent = complexity.why || '';
    }

    updateHistoryPanel(history, currentIdx) {
        const list = document.getElementById('history-items-list');
        if (!list) return;

        if (history.length === 0) {
            list.innerHTML = '<div class="history-empty">No past operations.</div>';
            return;
        }

        list.innerHTML = history.map((item, idx) => `
            <div class="history-item ${idx === currentIdx ? 'history-active' : ''}">
                <span class="history-check">✓</span>
                <span class="history-label">${item.label}</span>
            </div>
        `).join('');

        const undoBtn = document.getElementById('btn-history-undo');
        const redoBtn = document.getElementById('btn-history-redo');
        if (undoBtn) undoBtn.disabled = currentIdx <= 0;
        if (redoBtn) redoBtn.disabled = currentIdx >= history.length - 1;
    }

    /* =========================================================================
       MEMORY VIEW TABLE UPDATES
       ========================================================================= */

    updateBSTMemoryView(bstModel) {
        const container = document.getElementById('memory-view-table');
        if (!container || !bstModel) return;

        const nodes = bstModel.getAllNodesList();
        if (nodes.length === 0) {
            container.innerHTML = '<div class="mem-empty">Memory is empty (Tree has 0 nodes).</div>';
            return;
        }

        let html = `
            <table class="mem-table">
                <thead>
                    <tr>
                        <th>Node ID</th>
                        <th>Value</th>
                        <th>Left Pointer</th>
                        <th>Right Pointer</th>
                        <th>Memory Offset</th>
                    </tr>
                </thead>
                <tbody>
        `;

        nodes.forEach(n => {
            html += `
                <tr>
                    <td><code>${n.id}</code></td>
                    <td><strong>${n.value}</strong></td>
                    <td>${n.left ? `<code>${n.left.id}</code> (${n.left.value})` : '<span class="text-muted">NULL</span>'}</td>
                    <td>${n.right ? `<code>${n.right.id}</code> (${n.right.value})` : '<span class="text-muted">NULL</span>'}</td>
                    <td><code>0x${Math.abs(n.value * 128).toString(16).padStart(4, '0').toUpperCase()}</code></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    updateBSTStats(stats) {
        document.getElementById('bst-stat-root')?.replaceChildren(document.createTextNode(stats.root));
        document.getElementById('bst-stat-count')?.replaceChildren(document.createTextNode(stats.count));
        document.getElementById('bst-stat-height')?.replaceChildren(document.createTextNode(stats.height));
        document.getElementById('bst-stat-leaves')?.replaceChildren(document.createTextNode(stats.leaves));
        document.getElementById('bst-stat-min')?.replaceChildren(document.createTextNode(stats.min));
        document.getElementById('bst-stat-max')?.replaceChildren(document.createTextNode(stats.max));
    }

    updateStackMemoryView(memState) {
        const container = document.getElementById('memory-view-table');
        if (!container || !memState) return;

        let html = `
            <table class="mem-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Address</th>
                        <th>Value</th>
                        <th>Pointer Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        memState.slots.forEach(s => {
            html += `
                <tr class="${s.isTop ? 'mem-row-top' : ''}">
                    <td><code>[${s.index}]</code></td>
                    <td><code>${s.address}</code></td>
                    <td><strong>${s.value !== null ? s.value : '<span class="text-muted">EMPTY</span>'}</strong></td>
                    <td>${s.isTop ? '<span class="badge-accent">← TOP</span>' : '—'}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    updateQueueMemoryView(memState) {
        const container = document.getElementById('memory-view-table');
        if (!container || !memState) return;

        let html = `
            <table class="mem-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Address</th>
                        <th>Value</th>
                        <th>Pointer Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        memState.slots.forEach(s => {
            let tags = [];
            if (s.isFront) tags.push('<span class="badge-front">FRONT</span>');
            if (s.isRear) tags.push('<span class="badge-rear">REAR</span>');

            html += `
                <tr>
                    <td><code>[${s.index}]</code></td>
                    <td><code>${s.address}</code></td>
                    <td><strong>${s.value !== null ? s.value : '<span class="text-muted">EMPTY</span>'}</strong></td>
                    <td>${tags.length > 0 ? tags.join(' ') : '—'}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    updateLLMemoryView(nodes) {
        const container = document.getElementById('memory-view-table');
        if (!container) return;

        if (!nodes || nodes.length === 0) {
            container.innerHTML = '<div class="mem-empty">Memory is empty (List has 0 nodes).</div>';
            return;
        }

        let html = `
            <table class="mem-table">
                <thead>
                    <tr>
                        <th>Node Address</th>
                        <th>Data</th>
                        <th>Next Address</th>
                    </tr>
                </thead>
                <tbody>
        `;

        nodes.forEach((n, idx) => {
            html += `
                <tr>
                    <td><code>${n.address}</code> ${idx === 0 ? '<span class="badge-accent">HEAD</span>' : ''}</td>
                    <td><strong>${n.value}</strong></td>
                    <td><code>${n.nextAddress}</code></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /* =========================================================================
       INPUT & CONTROLLER BUTTON BINDINGS
       ========================================================================= */

    bindInputEvents() {
        // BST Buttons
        document.getElementById('btn-bst-insert')?.addEventListener('click', () => {
            const input = document.getElementById('bst-input-val');
            if (input && input.value.trim()) {
                this.controllers.bst.handleInsert(input.value.trim());
                input.value = '';
            }
        });
        document.getElementById('bst-input-val')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-bst-insert')?.click();
        });

        document.getElementById('btn-bst-batch-insert')?.addEventListener('click', () => {
            const input = document.getElementById('bst-batch-input');
            if (input && input.value.trim()) {
                this.controllers.bst.handleBatchInsert(input.value.trim());
                input.value = '';
            }
        });

        document.getElementById('btn-bst-search')?.addEventListener('click', () => {
            const input = document.getElementById('bst-input-search');
            if (input && input.value.trim()) {
                this.controllers.bst.handleSearch(input.value.trim());
            }
        });
        document.getElementById('bst-input-search')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-bst-search')?.click();
        });

        document.getElementById('btn-bst-delete')?.addEventListener('click', () => {
            const input = document.getElementById('bst-input-delete');
            if (input && input.value.trim()) {
                this.controllers.bst.handleDelete(input.value.trim());
            }
        });
        document.getElementById('bst-input-delete')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-bst-delete')?.click();
        });

        // BST Traversals
        document.getElementById('btn-bst-inorder')?.addEventListener('click', () => this.controllers.bst.handleTraversal('inorder'));
        document.getElementById('btn-bst-preorder')?.addEventListener('click', () => this.controllers.bst.handleTraversal('preorder'));
        document.getElementById('btn-bst-postorder')?.addEventListener('click', () => this.controllers.bst.handleTraversal('postorder'));
        document.getElementById('btn-bst-levelorder')?.addEventListener('click', () => this.controllers.bst.handleTraversal('levelorder'));

        // BST Metrics
        document.getElementById('btn-bst-min')?.addEventListener('click', () => this.controllers.bst.handleFindMin());
        document.getElementById('btn-bst-max')?.addEventListener('click', () => this.controllers.bst.handleFindMax());
        document.getElementById('btn-bst-height')?.addEventListener('click', () => this.controllers.bst.handleHeight());
        document.getElementById('btn-bst-count-nodes')?.addEventListener('click', () => this.controllers.bst.handleCountNodes());
        document.getElementById('btn-bst-count-leaves')?.addEventListener('click', () => this.controllers.bst.handleCountLeaves());
        document.getElementById('btn-bst-clear')?.addEventListener('click', () => this.controllers.bst.reset());

        // BST Presets
        document.querySelectorAll('[data-bst-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-bst-preset');
                this.controllers.bst.loadPreset(preset);
            });
        });

        // STACK Buttons
        document.getElementById('btn-stack-push')?.addEventListener('click', () => {
            const input = document.getElementById('stack-input-val');
            if (input && input.value.trim()) {
                this.controllers.stack.handlePush(input.value.trim());
                input.value = '';
            }
        });
        document.getElementById('stack-input-val')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-stack-push')?.click();
        });

        document.getElementById('btn-stack-pop')?.addEventListener('click', () => this.controllers.stack.handlePop());
        document.getElementById('btn-stack-peek')?.addEventListener('click', () => this.controllers.stack.handlePeek());
        document.getElementById('btn-stack-clear')?.addEventListener('click', () => this.controllers.stack.reset());

        document.getElementById('stack-cap-select')?.addEventListener('change', (e) => {
            this.controllers.stack.setCapacity(e.target.value);
        });

        document.querySelectorAll('[data-stack-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-stack-preset');
                this.controllers.stack.loadPreset(preset);
            });
        });

        // QUEUE Buttons
        document.getElementById('btn-queue-enqueue')?.addEventListener('click', () => {
            const input = document.getElementById('queue-input-val');
            if (input && input.value.trim()) {
                this.controllers.queue.handleEnqueue(input.value.trim());
                input.value = '';
            }
        });
        document.getElementById('queue-input-val')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btn-queue-enqueue')?.click();
        });

        document.getElementById('btn-queue-dequeue')?.addEventListener('click', () => this.controllers.queue.handleDequeue());
        document.getElementById('btn-queue-front')?.addEventListener('click', () => this.controllers.queue.handleFront());
        document.getElementById('btn-queue-rear')?.addEventListener('click', () => this.controllers.queue.handleRear());
        document.getElementById('btn-queue-clear')?.addEventListener('click', () => this.controllers.queue.reset());

        document.getElementById('queue-cap-select')?.addEventListener('change', (e) => {
            this.controllers.queue.setCapacity(e.target.value);
        });

        document.querySelectorAll('[data-queue-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-queue-preset');
                this.controllers.queue.loadPreset(preset);
            });
        });

        // LINKED LIST Buttons
        document.getElementById('btn-ll-insert-beg')?.addEventListener('click', () => {
            const input = document.getElementById('ll-input-val');
            if (input && input.value.trim()) {
                this.controllers.ll.handleInsertBeginning(input.value.trim());
                input.value = '';
            }
        });

        document.getElementById('btn-ll-insert-end')?.addEventListener('click', () => {
            const input = document.getElementById('ll-input-val');
            if (input && input.value.trim()) {
                this.controllers.ll.handleInsertEnd(input.value.trim());
                input.value = '';
            }
        });

        document.getElementById('btn-ll-insert-pos')?.addEventListener('click', () => {
            const valInput = document.getElementById('ll-input-val');
            const posInput = document.getElementById('ll-input-pos');
            if (valInput && posInput && valInput.value.trim() && posInput.value.trim()) {
                this.controllers.ll.handleInsertAtPosition(valInput.value.trim(), posInput.value.trim());
                valInput.value = '';
            }
        });

        document.getElementById('btn-ll-del-beg')?.addEventListener('click', () => this.controllers.ll.handleDeleteBeginning());
        document.getElementById('btn-ll-del-end')?.addEventListener('click', () => this.controllers.ll.handleDeleteEnd());

        document.getElementById('btn-ll-del-pos')?.addEventListener('click', () => {
            const posInput = document.getElementById('ll-input-del-pos');
            if (posInput && posInput.value.trim()) {
                this.controllers.ll.handleDeleteAtPosition(posInput.value.trim());
            }
        });

        document.getElementById('btn-ll-search')?.addEventListener('click', () => {
            const input = document.getElementById('ll-input-search');
            if (input && input.value.trim()) {
                this.controllers.ll.handleSearch(input.value.trim());
            }
        });

        document.getElementById('btn-ll-reverse')?.addEventListener('click', () => this.controllers.ll.handleReverse());
        document.getElementById('btn-ll-clear')?.addEventListener('click', () => this.controllers.ll.reset());

        document.querySelectorAll('[data-ll-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-ll-preset');
                this.controllers.ll.loadPreset(preset);
            });
        });
    }

    /* =========================================================================
       KEYBOARD SHORTCUTS
       ========================================================================= */

    bindKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ignore when typing inside input elements
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.currentController?.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.currentController?.prevStep();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.currentController?.nextStep();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    this.currentController?.restart();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.switchView('home');
                    this.toggleShortcutsModal(false);
                    this.toggleQuizModal(false);
                    break;
                case 'Digit1':
                    this.switchView('bst');
                    break;
                case 'Digit2':
                    this.switchView('stack');
                    break;
                case 'Digit3':
                    this.switchView('queue');
                    break;
                case 'Digit4':
                    this.switchView('ll');
                    break;
                case 'Slash':
                    if (e.shiftKey) { // '?' key
                        this.toggleShortcutsModal();
                    }
                    break;
            }
        });
    }

    toggleShortcutsModal(forceState = null) {
        const modal = document.getElementById('shortcuts-modal');
        if (!modal) return;
        const isShown = forceState !== null ? forceState : modal.style.display !== 'flex';
        modal.style.display = isShown ? 'flex' : 'none';
    }

    /* =========================================================================
       QUIZ MODE
       ========================================================================= */

    bindQuizEvents() {
        this.quizQuestions = [
            {
                ds: 'bst',
                question: 'What is the time complexity of searching for a value in a balanced BST with n nodes?',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                correct: 1,
                explanation: 'A balanced BST cuts the remaining search space in half at each step, yielding logarithmic O(log n) time complexity.'
            },
            {
                ds: 'bst',
                question: 'In a BST deletion of a node with two children, which node is commonly used to replace it?',
                options: ['Root of tree', 'Inorder successor (smallest in right subtree)', 'Left child directly', 'Largest leaf in left subtree only'],
                correct: 1,
                explanation: 'The inorder successor (minimum value in the right subtree) maintains all BST inequalities when copied into the deleted slot.'
            },
            {
                ds: 'stack',
                question: 'What condition triggers a STACK OVERFLOW in a bounded array-based stack?',
                options: ['top == 0', 'top == -1', 'top == capacity - 1 and PUSH is called', 'peek() returns NULL'],
                correct: 2,
                explanation: 'When top reaches capacity - 1, the allocated array is saturated; any further PUSH causes a Stack Overflow.'
            },
            {
                ds: 'queue',
                question: 'In a FIFO Queue, from which end are elements dequeued (serviced)?',
                options: ['REAR', 'FRONT', 'Middle', 'Top'],
                correct: 1,
                explanation: 'FIFO (First-In, First-Out) guarantees that elements are added at the REAR and serviced/dequeued at the FRONT.'
            },
            {
                ds: 'll',
                question: 'What is the time complexity of reversing a singly linked list with n nodes in-place?',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correct: 2,
                explanation: 'Reversing with the 3-pointer method (prev, curr, next) traverses every node once, taking O(n) time and O(1) auxiliary space.'
            }
        ];
    }

    toggleQuizModal(forceState = null) {
        const modal = document.getElementById('quiz-modal');
        if (!modal) return;
        const isShown = forceState !== null ? forceState : modal.style.display !== 'flex';
        modal.style.display = isShown ? 'flex' : 'none';
        if (isShown) {
            this.renderQuizQuestion();
        }
    }

    renderQuizQuestion() {
        const qContainer = document.getElementById('quiz-content');
        if (!qContainer) return;

        const q = this.quizQuestions[this.quizState.currentQuestionIdx % this.quizQuestions.length];
        qContainer.innerHTML = `
            <div class="quiz-badge">Question ${this.quizState.currentQuestionIdx + 1} of ${this.quizQuestions.length}</div>
            <h3 class="quiz-q-title">${q.question}</h3>
            <div class="quiz-options-list">
                ${q.options.map((opt, i) => `
                    <button class="quiz-opt-btn" data-opt-idx="${i}">
                        <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="opt-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
            <div id="quiz-feedback-box" class="quiz-feedback-box" style="display: none;"></div>
            <div class="quiz-stats-footer">
                <span>Score: <strong>${this.quizState.score} / ${this.quizState.totalAnswered}</strong></span>
                <button class="btn-sm btn-primary" id="btn-next-quiz-q" style="display: none;">Next Question ➔</button>
            </div>
        `;

        // Bind option clicks
        qContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = Number(btn.getAttribute('data-opt-idx'));
                this.handleQuizAnswer(selected, q);
            });
        });

        document.getElementById('btn-next-quiz-q')?.addEventListener('click', () => {
            this.quizState.currentQuestionIdx++;
            this.renderQuizQuestion();
        });
    }

    handleQuizAnswer(selectedIdx, question) {
        const feedbackBox = document.getElementById('quiz-feedback-box');
        const nextBtn = document.getElementById('btn-next-quiz-q');
        if (!feedbackBox) return;

        this.quizState.totalAnswered++;
        const isCorrect = selectedIdx === question.correct;
        if (isCorrect) this.quizState.score++;

        // Disable all option buttons
        document.querySelectorAll('.quiz-opt-btn').forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === question.correct) btn.classList.add('opt-correct');
            else if (idx === selectedIdx && !isCorrect) btn.classList.add('opt-incorrect');
        });

        feedbackBox.style.display = 'block';
        feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-incorrect'}`;
        feedbackBox.innerHTML = `
            <div class="fb-title">${isCorrect ? '✔ Correct!' : '✖ Incorrect'}</div>
            <div class="fb-explanation">${question.explanation}</div>
        `;

        if (window.sound) {
            window.sound.playSound(isCorrect ? 'success' : 'error');
        }

        if (nextBtn) nextBtn.style.display = 'inline-block';
    }

    /* =========================================================================
       TOAST NOTIFICATIONS
       ========================================================================= */

    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-card toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✔' : type === 'error' ? '⚠' : 'ℹ'}</span>
            <span class="toast-text">${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Global App Instance
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
