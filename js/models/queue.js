/**
 * Queue Model (Array-based FIFO Queue)
 * Pure algorithmic logic and step generation. Decoupled from DOM/UI.
 */

class Queue {
    constructor(capacity = 7) {
        this.capacity = capacity;
        this.items = []; // Array of active values
        this.front = 0;
        this.rear = -1;
    }

    setCapacity(newCapacity) {
        this.capacity = Number(newCapacity);
        if (this.items.length > this.capacity) {
            this.items = this.items.slice(0, this.capacity);
            this.rear = this.items.length - 1;
            this.front = this.items.length === 0 ? 0 : 0;
        }
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    isFull() {
        return this.items.length >= this.capacity;
    }

    peekFront() {
        return this.isEmpty() ? null : this.items[0];
    }

    peekRear() {
        return this.isEmpty() ? null : this.items[this.items.length - 1];
    }

    enqueue(val) {
        if (this.isFull()) return false;
        this.items.push(val);
        this.rear = this.items.length - 1;
        this.front = 0;
        return true;
    }

    dequeue() {
        if (this.isEmpty()) return null;
        const val = this.items.shift();
        if (this.isEmpty()) {
            this.rear = -1;
            this.front = 0;
        } else {
            this.rear = this.items.length - 1;
        }
        return val;
    }

    clear() {
        this.items = [];
        this.front = 0;
        this.rear = -1;
    }

    getMemorySnapshot() {
        const slots = [];
        for (let i = 0; i < this.capacity; i++) {
            const hasVal = i < this.items.length;
            slots.push({
                index: i,
                value: hasVal ? this.items[i] : null,
                isFront: hasVal && i === 0,
                isRear: hasVal && i === this.items.length - 1,
                address: `0x8FFE${(i * 4).toString(16).padStart(2, '0').toUpperCase()}`
            });
        }
        return {
            slots,
            items: [...this.items],
            front: this.isEmpty() ? null : 0,
            rear: this.isEmpty() ? null : this.items.length - 1,
            size: this.size(),
            capacity: this.capacity,
            isEmpty: this.isEmpty(),
            isFull: this.isFull()
        };
    }

    /* =========================================================================
       STEP GENERATORS
       ========================================================================= */

    generateEnqueueSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid value "${value}". Enqueue requires a numeric value.`,
                why: 'Queue stores numeric data elements.',
                pseudocodeLine: 1,
                pythonLine: 1,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        // Step 1: Inspect full condition
        steps.push({
            action: 'enqueue-inspect',
            description: `Attempting ENQUEUE(${val}). Checking if Queue is Full: (size == capacity)? [${this.size()} == ${this.capacity}]`,
            why: 'Boundary check: Ensure memory capacity is not exceeded before adding to rear.',
            pseudocodeLine: 1,
            pythonLine: 2,
            incomingValue: val,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isFull()) {
            steps.push({
                action: 'queue-overflow',
                description: `⚠ QUEUE OVERFLOW! Queue is full (size = ${this.size()}, capacity = ${this.capacity}). Cannot enqueue ${val}.`,
                why: 'Queue Overflow occurs when an item is added to a queue that has no remaining capacity.',
                pseudocodeLine: 2,
                pythonLine: 3,
                incomingValue: val,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                error: 'QUEUE OVERFLOW',
                isTerminal: true
            });
            return steps;
        }

        // Step 2: Advance REAR pointer
        const newRear = this.items.length;
        steps.push({
            action: 'advance-rear',
            description: `Space available. Advance REAR pointer to index [${newRear}].`,
            why: 'In FIFO (First-In, First-Out), all incoming elements enter exclusively at the REAR.',
            pseudocodeLine: 3,
            pythonLine: 5,
            incomingValue: val,
            highlightRearIndex: newRear,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        // Step 3: Insert element at REAR
        this.enqueue(val);
        const finalMem = this.getMemorySnapshot();

        steps.push({
            action: 'enqueue-complete',
            description: `Inserted ${val} at REAR (index [${this.rear}]). FRONT remains at index [0]. Enqueue complete.`,
            why: `Element ${val} will wait in line behind all preceding elements.`,
            pseudocodeLine: 4,
            pythonLine: 6,
            highlightRearIndex: this.rear,
            memoryState: finalMem,
            sound: 'push',
            isTerminal: true
        });

        return steps;
    }

    generateDequeueSteps() {
        const steps = [];

        // Step 1: Check underflow
        steps.push({
            action: 'dequeue-inspect',
            description: `Attempting DEQUEUE(). Checking if Queue is Empty: (size == 0)? [${this.size()} == 0]`,
            why: 'Boundary check: cannot remove from an empty queue.',
            pseudocodeLine: 1,
            pythonLine: 2,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isEmpty()) {
            steps.push({
                action: 'queue-underflow',
                description: `⚠ QUEUE UNDERFLOW! The queue is empty. Cannot dequeue any element.`,
                why: 'Queue Underflow occurs when an attempt is made to remove from an empty queue.',
                pseudocodeLine: 2,
                pythonLine: 3,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                error: 'QUEUE UNDERFLOW',
                isTerminal: true
            });
            return steps;
        }

        const frontVal = this.items[0];

        // Step 2: Highlight front element to remove
        steps.push({
            action: 'read-front',
            description: `Reading element at FRONT (index [0]): ${frontVal}. Element will be removed first (FIFO).`,
            why: 'In FIFO, the longest-waiting element is always at the FRONT and is serviced first.',
            pseudocodeLine: 3,
            pythonLine: 5,
            highlightFrontIndex: 0,
            dequeuedValue: frontVal,
            memoryState: this.getMemorySnapshot(),
            sound: 'compare'
        });

        // Step 3: Dequeue and shift
        this.dequeue();
        const finalMem = this.getMemorySnapshot();

        steps.push({
            action: 'dequeue-complete',
            description: `Removed element ${frontVal} from FRONT. Remaining elements shift forward. Dequeue complete.`,
            why: `Next element in line is now at FRONT. New size = ${this.size()}.`,
            pseudocodeLine: 4,
            pythonLine: 6,
            dequeuedValue: frontVal,
            memoryState: finalMem,
            sound: 'pop',
            isTerminal: true
        });

        return steps;
    }

    generateFrontSteps() {
        const steps = [];
        steps.push({
            action: 'front-inspect',
            description: 'Inspecting FRONT element.',
            why: 'Front inspection examines the next element to be processed without modifying queue state.',
            pseudocodeLine: 1,
            pythonLine: 2,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isEmpty()) {
            steps.push({
                action: 'front-empty',
                description: 'Queue is empty. FRONT is NULL.',
                why: 'No elements in queue.',
                pseudocodeLine: 2,
                pythonLine: 3,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                isTerminal: true
            });
        } else {
            steps.push({
                action: 'front-result',
                description: `FRONT element is ${this.peekFront()} at index [0].`,
                why: 'Peek operation completed in O(1) time.',
                pseudocodeLine: 3,
                pythonLine: 5,
                highlightFrontIndex: 0,
                memoryState: this.getMemorySnapshot(),
                sound: 'success',
                isTerminal: true
            });
        }
        return steps;
    }

    generateRearSteps() {
        const steps = [];
        steps.push({
            action: 'rear-inspect',
            description: 'Inspecting REAR element.',
            why: 'Rear inspection examines the most recently inserted element.',
            pseudocodeLine: 1,
            pythonLine: 2,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isEmpty()) {
            steps.push({
                action: 'rear-empty',
                description: 'Queue is empty. REAR is NULL.',
                why: 'No elements in queue.',
                pseudocodeLine: 2,
                pythonLine: 3,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                isTerminal: true
            });
        } else {
            steps.push({
                action: 'rear-result',
                description: `REAR element is ${this.peekRear()} at index [${this.items.length - 1}].`,
                why: 'Peek operation completed in O(1) time.',
                pseudocodeLine: 3,
                pythonLine: 5,
                highlightRearIndex: this.items.length - 1,
                memoryState: this.getMemorySnapshot(),
                sound: 'success',
                isTerminal: true
            });
        }
        return steps;
    }

    generateClearSteps() {
        const steps = [];
        steps.push({
            action: 'clear-start',
            description: 'Clearing Queue: resetting front and rear pointers.',
            why: 'Reclaims all queue positions in O(1) time.',
            pseudocodeLine: 1,
            pythonLine: 1,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        this.clear();
        steps.push({
            action: 'clear-complete',
            description: 'Queue cleared. Size = 0.',
            why: 'Queue is now empty and ready for new enqueues.',
            pseudocodeLine: 2,
            pythonLine: 2,
            memoryState: this.getMemorySnapshot(),
            sound: 'delete',
            isTerminal: true
        });
        return steps;
    }
}

// Export for Node.js test environment or browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Queue };
}
