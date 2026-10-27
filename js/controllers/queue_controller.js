/**
 * Queue Controller
 * Connects Queue model with step playback engine, pipeline visualizer, and code views.
 */

class QueueController {
    constructor(app) {
        this.app = app;
        this.model = new Queue(7);
        this.visualizer = null;

        this.steps = [];
        this.currentStepIdx = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 1.0;

        this.history = [];
        this.historyIdx = -1;

        this.codeDefs = {
            enqueue: {
                title: 'QUEUE ENQUEUE(X)',
                pseudocode: [
                    '1. if size == capacity then',
                    '2.     return QUEUE_OVERFLOW',
                    '3. rear ← rear + 1',
                    '4. array[rear] ← value',
                    '5. size ← size + 1; return SUCCESS'
                ],
                python: [
                    'def enqueue(queue, val, capacity):',
                    '    if len(queue) >= capacity:',
                    '        raise OverflowError("Queue Overflow")',
                    '    queue.append(val)',
                    '    return queue'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Appending an element to the rear of the queue executes in constant O(1) time.'
                }
            },
            dequeue: {
                title: 'QUEUE DEQUEUE()',
                pseudocode: [
                    '1. if size == 0 then',
                    '2.     return QUEUE_UNDERFLOW',
                    '3. value ← array[front]',
                    '4. front ← front + 1',
                    '5. size ← size - 1; return value'
                ],
                python: [
                    'def dequeue(queue):',
                    '    if not queue:',
                    '        raise IndexError("Queue Underflow")',
                    '    return queue.pop(0) # or deque.popleft() in O(1)'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Removing the front element in an array with circular/pointer tracking is O(1).'
                }
            },
            peek: {
                title: 'QUEUE PEEK (FRONT / REAR)',
                pseudocode: [
                    '1. if size == 0 then return NULL',
                    '2. return array[front] (or array[rear])'
                ],
                python: [
                    'def peek_front(queue):',
                    '    return queue[0] if queue else None'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Direct index lookup at front or rear pointer takes O(1) time.'
                }
            }
        };
    }

    init() {
        this.visualizer = new QueueVisualizer('queue-canvas-container');
        this.loadPreset('half-full');
    }

    setCapacity(cap) {
        this.model.setCapacity(cap);
        this.recordHistory(`Capacity set to ${cap}`);
        this.renderCurrentState();
        this.app.toast(`Queue capacity updated to ${cap}.`, 'info');
    }

    loadPreset(type) {
        this.model.clear();
        const cap = this.model.capacity;
        if (type === 'empty') {
            // empty
        } else if (type === 'half-full') {
            const count = Math.floor(cap / 2);
            for (let i = 1; i <= count; i++) this.model.enqueue(i * 12);
        } else if (type === 'full') {
            for (let i = 1; i <= cap; i++) this.model.enqueue(i * 10);
        } else if (type === 'random') {
            const count = Math.floor(Math.random() * (cap - 1)) + 1;
            for (let i = 0; i < count; i++) this.model.enqueue(Math.floor(Math.random() * 90) + 10);
        }

        this.recordHistory(`Preset: ${type}`);
        this.renderCurrentState();
        this.app.toast(`Loaded ${type} Queue preset.`, 'info');
    }

    recordHistory(label) {
        this.history = this.history.slice(0, this.historyIdx + 1);
        this.history.push({ label, items: [...this.model.items], capacity: this.model.capacity });
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
        this.model.capacity = item.capacity;
        this.model.items = [...item.items];
        this.model.rear = this.model.items.length - 1;
        this.renderCurrentState();
        this.app.updateHistoryPanel(this.history, this.historyIdx);
        this.app.toast(`Restored: ${item.label}`, 'info');
    }

    reset() {
        this.model.clear();
        this.recordHistory('Clear Queue');
        this.renderCurrentState();
        this.app.toast('Queue cleared.', 'info');
    }

    handleEnqueue(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid numeric value to enqueue.', 'error');
            return;
        }
        this.steps = this.model.generateEnqueueSteps(num);
        this.recordHistory(`Enqueue ${num}`);
        this.startStepTimeline('enqueue');
    }

    handleDequeue() {
        this.steps = this.model.generateDequeueSteps();
        this.recordHistory('Dequeue');
        this.startStepTimeline('dequeue');
    }

    handleFront() {
        this.steps = this.model.generateFrontSteps();
        this.startStepTimeline('peek');
    }

    handleRear() {
        this.steps = this.model.generateRearSteps();
        this.startStepTimeline('peek');
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

        this.visualizer.render(step.memoryState, step);
        this.app.highlightCodeLine(step.pseudocodeLine, step.pythonLine);
        this.app.highlightTraceLogItem(index);
        this.app.updateStudentExplanation(step.description, step.why);
        this.app.updateQueueMemoryView(step.memoryState);

        if (step.sound && window.sound) {
            window.sound.playSound(step.sound);
        }
    }

    renderCurrentState() {
        this.steps = [];
        this.currentStepIdx = 0;
        const mem = this.model.getMemorySnapshot();
        this.visualizer.render(mem);
        this.app.updateTimelineSlider(0, 0);
        this.app.populateTraceLog([]);
        this.app.updateQueueMemoryView(mem);
        this.updateCodeDisplay('enqueue');
        this.updateComplexityDisplay('enqueue');
        this.app.updateStudentExplanation('Queue Ready', 'Enqueue at REAR, Dequeue at FRONT to explore FIFO mechanics.');
    }

    updateCodeDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.enqueue;
        this.app.renderCodePanels(def.title, def.pseudocode, def.python);
    }

    updateComplexityDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.enqueue;
        this.app.renderComplexityCard(def.complexity);
    }
}
