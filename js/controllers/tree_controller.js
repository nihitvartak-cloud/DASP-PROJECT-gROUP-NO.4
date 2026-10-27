/**
 * BST Controller
 * Handles user interactions, generates algorithm step timeline,
 * updates visualizer, pseudocode, python code, statistics, complexity, and trace log.
 */

class TreeController {
    constructor(app) {
        this.app = app;
        this.model = new BinarySearchTree();
        this.visualizer = null;

        // Step engine state
        this.steps = [];
        this.currentStepIdx = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 1.0;
        this.currentOpName = 'IDLE';

        // History for undo/redo
        this.history = [];
        this.historyIdx = -1;

        // Pseudocode and Python dictionaries
        this.codeDefs = {
            insert: {
                title: 'BST INSERTION',
                pseudocode: [
                    '1. if root == NULL then',
                    '2.     root ← createNode(value); return',
                    '3. current ← root',
                    '4. while current ≠ NULL do',
                    '5.     if value == current.value then return DUPLICATE',
                    '6.     else if value < current.value then',
                    '7.         if current.left == NULL then',
                    '8.             current.left ← createNode(value); return',
                    '9.         current ← current.left',
                    '10.    else',
                    '11.        if current.right == NULL then',
                    '12.            current.right ← createNode(value); return',
                    '13.        current ← current.right'
                ],
                python: [
                    'def insert(root, value):',
                    '    if not root:',
                    '        return Node(value)',
                    '    curr = root',
                    '    while curr:',
                    '        if value == curr.val:',
                    '            return None # Duplicate',
                    '        elif value < curr.val:',
                    '            if not curr.left:',
                    '                curr.left = Node(value); break',
                    '            curr = curr.left',
                    '        else:',
                    '            if not curr.right:',
                    '                curr.right = Node(value); break',
                    '            curr = curr.right',
                    '    return root'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(log n)',
                    worst: 'O(n)',
                    space: 'O(h) recursion or O(1) iterative',
                    why: 'At each node, binary comparison eliminates half the remaining subtree in balanced BSTs. In a degenerate skewed tree, height degrades to n.'
                }
            },
            search: {
                title: 'BST SEARCH',
                pseudocode: [
                    '1. current ← root',
                    '2. while current ≠ NULL do',
                    '3.     if value == current.value then',
                    '4.         return FOUND',
                    '5.     else if value < current.value then',
                    '6.         current ← current.left',
                    '7.     else',
                    '8.         current ← current.right',
                    '9. return NOT FOUND'
                ],
                python: [
                    'def search(root, value):',
                    '    curr = root',
                    '    while curr:',
                    '        if curr.val == value:',
                    '            return curr',
                    '        elif value < curr.val:',
                    '            curr = curr.left',
                    '        else:',
                    '            curr = curr.right',
                    '    return None'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(log n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Eliminates 50% of candidate search space on each comparison when balanced.'
                }
            },
            delete: {
                title: 'BST DELETION',
                pseudocode: [
                    '1. locate node to delete',
                    '2. if node < current then search left',
                    '3. else if node > current then search right',
                    '4. else target found:',
                    '5.   Case 1: Leaf node → detach from parent',
                    '6.   Case 2: One child → parent.child ← node.child',
                    '7.   Case 3: Two children:',
                    '8.     successor ← findMin(node.right)',
                    '9.     node.value ← successor.value',
                    '10.    delete(node.right, successor.value)'
                ],
                python: [
                    'def delete(root, val):',
                    '    if not root: return None',
                    '    if val < root.val:',
                    '        root.left = delete(root.left, val)',
                    '    elif val > root.val:',
                    '        root.right = delete(root.right, val)',
                    '    else:',
                    '        if not root.left and not root.right: return None',
                    '        if not root.left: return root.right',
                    '        if not root.right: return root.left',
                    '        succ = find_min(root.right)',
                    '        root.val = succ.val',
                    '        root.right = delete(root.right, succ.val)',
                    '    return root'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(log n)',
                    worst: 'O(n)',
                    space: 'O(h)',
                    why: 'Finding node takes O(h). Finding successor takes O(h). Successor deletion is at most O(h).'
                }
            },
            traversal: {
                title: 'BST TRAVERSAL',
                pseudocode: [
                    '1. Inorder: Traverse(left) → Visit(node) → Traverse(right)',
                    '2. Preorder: Visit(node) → Traverse(left) → Traverse(right)',
                    '3. Postorder: Traverse(left) → Traverse(right) → Visit(node)',
                    '4. Level Order: queue.push(root); while queue: pop & visit, push children'
                ],
                python: [
                    'def inorder(node):',
                    '    if not node: return',
                    '    inorder(node.left)',
                    '    visit(node.val)',
                    '    inorder(node.right)'
                ],
                complexity: {
                    best: 'O(n)',
                    avg: 'O(n)',
                    worst: 'O(n)',
                    space: 'O(h) for DFS, O(w) for BFS',
                    why: 'Every node in the tree must be visited exactly once.'
                }
            },
            minmax: {
                title: 'BST MIN / MAX',
                pseudocode: [
                    '1. current ← root',
                    '2. while current.left ≠ NULL do',
                    '3.     current ← current.left',
                    '4. return current.value'
                ],
                python: [
                    'def find_min(root):',
                    '    curr = root',
                    '    while curr and curr.left:',
                    '        curr = curr.left',
                    '    return curr.val if curr else None'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(log n)',
                    worst: 'O(n)',
                    space: 'O(1)',
                    why: 'Traverses straight down the leftmost (Min) or rightmost (Max) branch.'
                }
            }
        };
    }

    init() {
        this.visualizer = new TreeVisualizer('tree-canvas-container');
        this.loadPreset('balanced');
    }

    loadPreset(type) {
        this.model.clear();
        let values = [];
        if (type === 'balanced') {
            values = [50, 30, 70, 20, 40, 60, 80];
        } else if (type === 'left-skewed') {
            values = [80, 70, 60, 50, 40, 30];
        } else if (type === 'right-skewed') {
            values = [20, 30, 40, 50, 60, 70];
        } else if (type === 'random') {
            const count = 7;
            const set = new Set();
            while (set.size < count) {
                set.add(Math.floor(Math.random() * 90) + 10);
            }
            values = Array.from(set);
        }

        values.forEach(v => this.model.insert(v));
        this.recordHistory(`Preset: ${type}`);
        this.renderCurrentState();
        this.app.toast(`Loaded ${type} preset BST.`, 'info');
    }

    recordHistory(label) {
        // Snapshot tree values
        const vals = [];
        const collect = (n) => {
            if (!n) return;
            vals.push(n.value);
            collect(n.left);
            collect(n.right);
        };
        collect(this.model.root);

        this.history = this.history.slice(0, this.historyIdx + 1);
        this.history.push({ label, values: vals });
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
        item.values.forEach(v => this.model.insert(v));
        this.renderCurrentState();
        this.app.updateHistoryPanel(this.history, this.historyIdx);
        this.app.toast(`Restored: ${item.label}`, 'info');
    }

    reset() {
        this.model.clear();
        this.recordHistory('Clear Tree');
        this.renderCurrentState();
        this.app.toast('BST cleared.', 'info');
    }

    /* Operations triggering steps */

    handleInsert(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid numeric value.', 'error');
            return;
        }
        this.currentOpName = 'insert';
        this.steps = this.model.generateInsertSteps(num);
        this.recordHistory(`Insert ${num}`);
        this.startStepTimeline('insert');
    }

    handleBatchInsert(rawInput) {
        const nums = rawInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
        if (nums.length === 0) {
            this.app.toast('Please enter comma-separated numbers.', 'error');
            return;
        }

        let combinedSteps = [];
        nums.forEach(n => {
            const opSteps = this.model.generateInsertSteps(n);
            combinedSteps = combinedSteps.concat(opSteps);
        });

        this.currentOpName = 'insert';
        this.steps = combinedSteps;
        this.recordHistory(`Batch Insert [${nums.join(', ')}]`);
        this.startStepTimeline('insert');
    }

    handleSearch(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid number to search.', 'error');
            return;
        }
        this.currentOpName = 'search';
        this.steps = this.model.generateSearchSteps(num);
        this.recordHistory(`Search ${num}`);
        this.startStepTimeline('search');
    }

    handleDelete(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid number to delete.', 'error');
            return;
        }
        this.currentOpName = 'delete';
        this.steps = this.model.generateDeleteSteps(num);
        this.recordHistory(`Delete ${num}`);
        this.startStepTimeline('delete');
    }

    handleTraversal(type) {
        this.currentOpName = 'traversal';
        this.steps = this.model.generateTraversalSteps(type);
        this.recordHistory(`Traversal: ${type}`);
        this.startStepTimeline('traversal');
    }

    handleFindMin() {
        this.currentOpName = 'minmax';
        this.steps = this.model.generateFindMinSteps();
        this.recordHistory('Find Minimum');
        this.startStepTimeline('minmax');
    }

    handleFindMax() {
        this.currentOpName = 'minmax';
        this.steps = this.model.generateFindMaxSteps();
        this.recordHistory('Find Maximum');
        this.startStepTimeline('minmax');
    }

    handleHeight() {
        this.currentOpName = 'traversal';
        this.steps = this.model.generateHeightSteps();
        this.startStepTimeline('traversal');
    }

    handleCountNodes() {
        this.currentOpName = 'traversal';
        this.steps = this.model.generateCountNodesSteps();
        this.startStepTimeline('traversal');
    }

    handleCountLeaves() {
        this.currentOpName = 'traversal';
        this.steps = this.model.generateCountLeavesSteps();
        this.startStepTimeline('traversal');
    }

    /* Step Playback Engine */

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

        // Render Tree in Visualizer
        this.visualizer.render(step.treeSnapshot, step);

        // Synchronize Active Line in Pseudocode and Python
        this.app.highlightCodeLine(step.pseudocodeLine, step.pythonLine);

        // Highlight Active Log Entry
        this.app.highlightTraceLogItem(index);

        // Update Educational "Why?" Card
        this.app.updateStudentExplanation(step.description, step.why);

        // Update Memory Table view
        this.app.updateBSTMemoryView(this.model);

        // Update Live Stats
        this.app.updateBSTStats(this.model.getStats());

        // Play Sound
        if (step.sound && window.sound) {
            window.sound.playSound(step.sound, { value: step.value });
        }
    }

    renderCurrentState() {
        this.steps = [];
        this.currentStepIdx = 0;
        this.visualizer.render(this.model.root);
        this.app.updateTimelineSlider(0, 0);
        this.app.populateTraceLog([]);
        this.app.updateBSTStats(this.model.getStats());
        this.app.updateBSTMemoryView(this.model);
        this.updateCodeDisplay('insert');
        this.updateComplexityDisplay('insert');
        this.app.updateStudentExplanation('Simulator Ready', 'Select an operation to step through execution.');
    }

    updateCodeDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.insert;
        this.app.renderCodePanels(def.title, def.pseudocode, def.python);
    }

    updateComplexityDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.insert;
        this.app.renderComplexityCard(def.complexity);
    }
}
