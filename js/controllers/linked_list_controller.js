/**
 * Linked List Controller
 * Connects Singly Linked List model to step engine, pointer visualizer, and code views.
 */

class LinkedListController {
    constructor(app) {
        this.app = app;
        this.model = new LinkedList();
        this.visualizer = null;

        this.steps = [];
        this.currentStepIdx = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 1.0;

        this.history = [];
        this.historyIdx = -1;

        this.codeDefs = {
            insertBeginning: {
                title: 'LINKED LIST INSERT BEGINNING',
                pseudocode: [
                    '1. newNode ← allocateNode(value)',
                    '2. newNode.next ← HEAD',
                    '3. HEAD ← newNode; return SUCCESS'
                ],
                python: [
                    'def insert_beginning(head, val):',
                    '    new_node = Node(val)',
                    '    new_node.next = head',
                    '    return new_node'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Only requires re-pointing the head and new node pointers. No traversal needed.'
                }
            },
            insertEnd: {
                title: 'LINKED LIST INSERT END',
                pseudocode: [
                    '1. newNode ← allocateNode(value)',
                    '2. if HEAD == NULL then HEAD ← newNode; return',
                    '3. curr ← HEAD',
                    '4. while curr.next ≠ NULL do curr ← curr.next',
                    '5. curr.next ← newNode; return SUCCESS'
                ],
                python: [
                    'def insert_end(head, val):',
                    '    new_node = Node(val)',
                    '    if not head: return new_node',
                    '    curr = head',
                    '    while curr.next: curr = curr.next',
                    '    curr.next = new_node',
                    '    return head'
                ],
                complexity: {
                    best: 'O(1) (empty)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Must traverse all n nodes to reach the tail node when no tail pointer is kept.'
                }
            },
            insertPos: {
                title: 'LINKED LIST INSERT AT POSITION',
                pseudocode: [
                    '1. newNode ← allocateNode(value)',
                    '2. traverse to node at position - 1',
                    '3. newNode.next ← prev.next',
                    '4. prev.next ← newNode; return SUCCESS'
                ],
                python: [
                    'def insert_at(head, val, pos):',
                    '    if pos == 0: return insert_beginning(head, val)',
                    '    curr = head',
                    '    for _ in range(pos - 1): curr = curr.next',
                    '    new_node = Node(val)',
                    '    new_node.next = curr.next',
                    '    curr.next = new_node',
                    '    return head'
                ],
                complexity: {
                    best: 'O(1) (pos 0)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Takes O(k) time to traverse to position k, then O(1) pointer updates.'
                }
            },
            deleteBeginning: {
                title: 'LINKED LIST DELETE BEGINNING',
                pseudocode: [
                    '1. if HEAD == NULL then return UNDERFLOW',
                    '2. temp ← HEAD',
                    '3. HEAD ← HEAD.next',
                    '4. free(temp); return SUCCESS'
                ],
                python: [
                    'def delete_beginning(head):',
                    '    if not head: return None',
                    '    return head.next'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Advances the head pointer by one node in O(1) time.'
                }
            },
            deleteEnd: {
                title: 'LINKED LIST DELETE END',
                pseudocode: [
                    '1. if HEAD == NULL then return UNDERFLOW',
                    '2. if HEAD.next == NULL then HEAD ← NULL; return',
                    '3. curr ← HEAD',
                    '4. while curr.next.next ≠ NULL do curr ← curr.next',
                    '5. curr.next ← NULL; return SUCCESS'
                ],
                python: [
                    'def delete_end(head):',
                    '    if not head or not head.next: return None',
                    '    curr = head',
                    '    while curr.next.next: curr = curr.next',
                    '    curr.next = None',
                    '    return head'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Must traverse to the second-to-last node to sever the last node link.'
                }
            },
            deletePos: {
                title: 'LINKED LIST DELETE AT POSITION',
                pseudocode: [
                    '1. if HEAD == NULL then return UNDERFLOW',
                    '2. traverse to predecessor at pos - 1',
                    '3. target ← prev.next',
                    '4. prev.next ← target.next; free(target)'
                ],
                python: [
                    'def delete_at(head, pos):',
                    '    if pos == 0: return head.next if head else None',
                    '    curr = head',
                    '    for _ in range(pos - 1): curr = curr.next',
                    '    curr.next = curr.next.next',
                    '    return head'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Traversing to position k takes O(k) steps; splicing takes O(1).'
                }
            },
            search: {
                title: 'LINKED LIST LINEAR SEARCH',
                pseudocode: [
                    '1. curr ← HEAD; index ← 0',
                    '2. while curr ≠ NULL do',
                    '3.     if curr.value == target then return FOUND(index)',
                    '4.     curr ← curr.next; index ← index + 1',
                    '5. return NOT_FOUND'
                ],
                python: [
                    'def search(head, target):',
                    '    curr = head; idx = 0',
                    '    while curr:',
                    '        if curr.val == target: return idx',
                    '        curr = curr.next; idx += 1',
                    '    return -1'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Nodes are non-contiguous in memory; cannot use binary search; must scan sequentially.'
                }
            },
            reverse: {
                title: 'LINKED LIST IN-PLACE REVERSE',
                pseudocode: [
                    '1. prev ← NULL, curr ← HEAD, next ← NULL',
                    '2. while curr ≠ NULL do',
                    '3.     next ← curr.next',
                    '4.     curr.next ← prev',
                    '5.     prev ← curr',
                    '6.     curr ← next',
                    '7. HEAD ← prev; return SUCCESS'
                ],
                python: [
                    'def reverse(head):',
                    '    prev = None; curr = head',
                    '    while curr:',
                    '        nxt = curr.next',
                    '        curr.next = prev',
                    '        prev = curr',
                    '        curr = nxt',
                    '    return prev'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Iterates through each node exactly once, reversing pointers in place with O(1) auxiliary variables.'
                }
            }
        };
    }

    init() {
        this.visualizer = new LinkedListVisualizer('ll-canvas-container');
        this.loadPreset('sorted');
    }

    loadPreset(type) {
        this.model.clear();
        let values = [];
        if (type === 'sorted') {
            values = [10, 20, 30, 40, 50];
        } else if (type === 'reverse-sorted') {
            values = [50, 40, 30, 20, 10];
        } else if (type === 'random') {
            for (let i = 0; i < 5; i++) values.push(Math.floor(Math.random() * 90) + 10);
        } else if (type === 'palindrome') {
            values = [15, 30, 45, 30, 15];
        }

        values.forEach(v => this.model.insertEnd(v));
        this.recordHistory(`Preset: ${type}`);
        this.renderCurrentState();
        this.app.toast(`Loaded ${type} Linked List preset.`, 'info');
    }

    recordHistory(label) {
        const arr = this.model.toArray().map(n => n.value);
        this.history = this.history.slice(0, this.historyIdx + 1);
        this.history.push({ label, values: arr });
        this.historyIdx = this.history.length - 1;
        this.app.updateHistoryPanel(this.history, this.historyIdx);
    }

    undo() {
        if (this.historyIdx > 0) {
            this.historyIdx--;
            this.restoreFromHistory(this.history[this.historyIdx]);
        }
    }

    redo() {
        if (this.historyIdx < this.history.length - 1) {
            this.historyIdx++;
            this.restoreFromHistory(this.history[this.historyIdx]);
        }
    }

    restoreFromHistory(item) {
        this.model.clear();
        item.values.forEach(v => this.model.insertEnd(v));
        this.renderCurrentState();
        this.app.updateHistoryPanel(this.history, this.historyIdx);
        this.app.toast(`Restored: ${item.label}`, 'info');
    }

    reset() {
        this.model.clear();
        this.recordHistory('Clear List');
        this.renderCurrentState();
        this.app.toast('Linked list cleared.', 'info');
    }

    handleInsertBeginning(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid numeric value.', 'error');
            return;
        }
        this.steps = this.model.generateInsertBeginningSteps(num);
        this.recordHistory(`Insert Beg ${num}`);
        this.startStepTimeline('insertBeginning');
    }

    handleInsertEnd(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid numeric value.', 'error');
            return;
        }
        this.steps = this.model.generateInsertEndSteps(num);
        this.recordHistory(`Insert End ${num}`);
        this.startStepTimeline('insertEnd');
    }

    handleInsertAtPosition(val, pos) {
        const num = Number(val);
        const position = Number(pos);
        if (isNaN(num) || isNaN(position)) {
            this.app.toast('Please enter valid value and position.', 'error');
            return;
        }
        this.steps = this.model.generateInsertAtPositionSteps(num, position);
        this.recordHistory(`Insert At Pos ${position} (${num})`);
        this.startStepTimeline('insertPos');
    }

    handleDeleteBeginning() {
        this.steps = this.model.generateDeleteBeginningSteps();
        this.recordHistory('Delete Beg');
        this.startStepTimeline('deleteBeginning');
    }

    handleDeleteEnd() {
        this.steps = this.model.generateDeleteEndSteps();
        this.recordHistory('Delete End');
        this.startStepTimeline('deleteEnd');
    }

    handleDeleteAtPosition(pos) {
        const position = Number(pos);
        if (isNaN(position)) {
            this.app.toast('Please enter a valid position to delete.', 'error');
            return;
        }
        this.steps = this.model.generateDeleteAtPositionSteps(position);
        this.recordHistory(`Delete Pos ${position}`);
        this.startStepTimeline('deletePos');
    }

    handleSearch(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid search key.', 'error');
            return;
        }
        this.steps = this.model.generateSearchSteps(num);
        this.recordHistory(`Search ${num}`);
        this.startStepTimeline('search');
    }

    handleReverse() {
        this.steps = this.model.generateReverseSteps();
        this.recordHistory('Reverse List');
        this.startStepTimeline('reverse');
    }

    startStepTimeline(codeKey) {
        this.pause();
        this.currentStepIdx = 0;
        this.updateCodeDisplay(codeKey);
        this.updateComplexityDisplay(codeKey);
        this.app.updateTimelineSlider(0, this.steps.length);
        this.app.populateTraceLog(this.steps);
        this.renderStep(0);
        this.play();
    }

    play() {
        if (this.steps.length === 0) return;
        this.isPlaying = true;
        this.app.setPlayPauseState(true);
        this.scheduleNextTick();
    }

    pause() {
        this.isPlaying = false;
        this.app.setPlayPauseState(false);
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    togglePlayPause() {
        if (this.isPlaying) this.pause();
        else {
            if (this.currentStepIdx >= this.steps.length - 1) {
                this.jumpToStep(0);
            }
            this.play();
        }
    }

    scheduleNextTick() {
        if (!this.isPlaying) return;
        if (this.currentStepIdx >= this.steps.length - 1) {
            this.pause();
            return;
        }

        const baseMs = 900;
        const delay = this.speed === Infinity ? 0 : baseMs / this.speed;

        this.timer = setTimeout(() => {
            if (!this.isPlaying) return;
            this.nextStep();
            this.scheduleNextTick();
        }, delay);
    }

    nextStep() {
        if (this.currentStepIdx < this.steps.length - 1) {
            this.jumpToStep(this.currentStepIdx + 1);
        } else {
            this.pause();
        }
    }

    prevStep() {
        if (this.currentStepIdx > 0) {
            this.jumpToStep(this.currentStepIdx - 1);
        }
    }

    restart() {
        this.pause();
        this.jumpToStep(0);
    }

    jumpToStep(index) {
        if (this.steps.length === 0) return;
        this.currentStepIdx = Math.max(0, Math.min(this.steps.length - 1, index));
        this.renderStep(this.currentStepIdx);
        this.app.updateTimelineSlider(this.currentStepIdx, this.steps.length);
    }

    setSpeed(spd) {
        this.speed = spd;
    }

    renderStep(index) {
        const step = this.steps[index];
        if (!step) return;

        this.visualizer.render(step.nodes, step);
        this.app.highlightCodeLine(step.pseudocodeLine, step.pythonLine);
        this.app.highlightTraceLogItem(index);
        this.app.updateStudentExplanation(step.description, step.why);
        this.app.updateLLMemoryView(step.nodes);

        if (step.sound && window.sound) {
            window.sound.playSound(step.sound);
        }
    }

    renderCurrentState() {
        this.steps = [];
        this.currentStepIdx = 0;
        const nodes = this.model.toArray();
        this.visualizer.render(nodes);
        this.app.updateTimelineSlider(0, 0);
        this.app.populateTraceLog([]);
        this.app.updateLLMemoryView(nodes);
        this.updateCodeDisplay('insertBeginning');
        this.updateComplexityDisplay('insertBeginning');
        this.app.updateStudentExplanation('Linked List Ready', 'Insert, Delete, Search or Reverse nodes to inspect pointer manipulations.');
    }

    updateCodeDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.insertBeginning;
        this.app.renderCodePanels(def.title, def.pseudocode, def.python);
    }

    updateComplexityDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.insertBeginning;
        this.app.renderComplexityCard(def.complexity);
    }
}
