/**
 * Stack Controller
 * Handles Stack user actions, playback timeline, memory view, and code synchronization.
 */

class StackController {
    constructor(app) {
        this.app = app;
        this.model = new Stack(7);
        this.visualizer = null;

        this.steps = [];
        this.currentStepIdx = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 1.0;

        this.history = [];
        this.historyIdx = -1;

        this.codeDefs = {
            push: {
                title: 'STACK PUSH(X)',
                pseudocode: [
                    '1. if top == capacity - 1 then',
                    '2.     return STACK_OVERFLOW',
                    '3. top ← top + 1',
                    '4. array[top] ← value',
                    '5. return SUCCESS'
                ],
                python: [
                    'def push(stack, val, capacity):',
                    '    if len(stack) >= capacity:',
                    '        raise OverflowError("Stack Overflow")',
                    '    stack.append(val)',
                    '    return stack'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Direct array index increment and assignment takes constant time O(1).'
                }
            },
            pop: {
                title: 'STACK POP()',
                pseudocode: [
                    '1. if top == -1 then',
                    '2.     return STACK_UNDERFLOW',
                    '3. value ← array[top]',
                    '4. top ← top - 1',
                    '5. return value'
                ],
                python: [
                    'def pop(stack):',
                    '    if not stack:',
                    '        raise IndexError("Stack Underflow")',
                    '    return stack.pop()'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Decrementing the top pointer and reading the last element is strictly O(1).'
                }
            },
            peek: {
                title: 'STACK PEEK()',
                pseudocode: [
                    '1. if top == -1 then',
                    '2.     return NULL',
                    '3. return array[top]'
                ],
                python: [
                    'def peek(stack):',
                    '    if not stack: return None',
                    '    return stack[-1]'
                ],
                complexity: {
                    best: 'O(1)',
                    avg: 'O(1)',
                    worst: 'O(1)',
                    space: 'O(1)',
                    why: 'Reading array[top] directly without altering the pointer takes O(1) time.'
                }
            }
        };
    }

    init() {
        this.visualizer = new StackVisualizer('stack-canvas-container');
        this.loadPreset('half-full');
    }

    setCapacity(cap) {
        this.model.setCapacity(cap);
        this.recordHistory(`Capacity set to ${cap}`);
        this.renderCurrentState();
        this.app.toast(`Stack capacity updated to ${cap}.`, 'info');
    }

    loadPreset(type) {
        this.model.clear();
        const cap = this.model.capacity;
        if (type === 'empty') {
            // keep empty
        } else if (type === 'half-full') {
            const count = Math.floor(cap / 2);
            for (let i = 1; i <= count; i++) this.model.push(i * 15);
        } else if (type === 'full') {
            for (let i = 1; i <= cap; i++) this.model.push(i * 10);
        } else if (type === 'random') {
            const count = Math.floor(Math.random() * (cap - 1)) + 1;
            for (let i = 0; i < count; i++) this.model.push(Math.floor(Math.random() * 90) + 10);
        }

        this.recordHistory(`Preset: ${type}`);
        this.renderCurrentState();
        this.app.toast(`Loaded ${type} Stack preset.`, 'info');
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
        this.model.top = this.model.items.length - 1;
        this.renderCurrentState();
        this.app.updateHistoryPanel(this.history, this.historyIdx);
        this.app.toast(`Restored: ${item.label}`, 'info');
    }

    reset() {
        this.model.clear();
        this.recordHistory('Clear Stack');
        this.renderCurrentState();
        this.app.toast('Stack cleared.', 'info');
    }

    handlePush(val) {
        const num = Number(val);
        if (isNaN(num)) {
            this.app.toast('Please enter a valid numeric value to push.', 'error');
            return;
        }
        this.steps = this.model.generatePushSteps(num);
        this.recordHistory(`Push ${num}`);
        this.startStepTimeline('push');
    }

    handlePop() {
        this.steps = this.model.generatePopSteps();
        this.recordHistory('Pop');
        this.startStepTimeline('pop');
    }

    handlePeek() {
        this.steps = this.model.generatePeekSteps();
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
        this.app.updateStackMemoryView(step.memoryState);

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
        this.app.updateStackMemoryView(mem);
        this.updateCodeDisplay('push');
        this.updateComplexityDisplay('push');
        this.app.updateStudentExplanation('Stack Ready', 'Push, Pop, or Peek elements to observe LIFO memory mutations.');
    }

    updateCodeDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.push;
        this.app.renderCodePanels(def.title, def.pseudocode, def.python);
    }

    updateComplexityDisplay(key) {
        const def = this.codeDefs[key] || this.codeDefs.push;
        this.app.renderComplexityCard(def.complexity);
    }
}
