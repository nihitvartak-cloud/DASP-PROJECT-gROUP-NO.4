/**
 * Stack Model (Array-based LIFO)
 * Pure algorithmic logic and step generation. Completely decoupled from DOM/UI.
 */

class Stack {
    constructor(capacity = 7) {
        this.capacity = capacity;
        this.items = []; // Array of elements up to capacity
        this.top = -1;
    }

    setCapacity(newCapacity) {
        this.capacity = Number(newCapacity);
        if (this.items.length > this.capacity) {
            this.items = this.items.slice(0, this.capacity);
            this.top = this.items.length - 1;
        }
    }

    isEmpty() {
        return this.top === -1;
    }

    isFull() {
        return this.top === this.capacity - 1;
    }

    size() {
        return this.top + 1;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.top];
    }

    push(val) {
        if (this.isFull()) return false;
        this.top++;
        this.items[this.top] = val;
        return true;
    }

    pop() {
        if (this.isEmpty()) return null;
        const val = this.items[this.top];
        this.items.pop();
        this.top--;
        return val;
    }

    clear() {
        this.items = [];
        this.top = -1;
    }

    getMemorySnapshot() {
        const slots = [];
        for (let i = 0; i < this.capacity; i++) {
            slots.push({
                index: i,
                value: i <= this.top ? this.items[i] : null,
                isTop: i === this.top,
                address: `0x7FFE${(i * 4).toString(16).padStart(2, '0').toUpperCase()}`
            });
        }
        return {
            slots,
            top: this.top,
            size: this.size(),
            capacity: this.capacity,
            isEmpty: this.isEmpty(),
            isFull: this.isFull()
        };
    }

    /* =========================================================================
       STEP GENERATORS
       ========================================================================= */

    generatePushSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid value "${value}". Push requires a numeric input.`,
                why: 'Stack requires a valid data element to store in memory.',
                pseudocodeLine: 1,
                pythonLine: 1,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        // Step 1: New value enters & check overflow
        steps.push({
            action: 'push-inspect',
            description: `Attempting PUSH(${val}). First checking if Stack is Full: (top == capacity - 1)? [${this.top} == ${this.capacity - 1}]`,
            why: 'Boundary condition check: preventing buffer overflow before allocating space.',
            pseudocodeLine: 1,
            pythonLine: 2,
            incomingValue: val,
            highlightIndex: this.top,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        // Overflow condition
        if (this.isFull()) {
            steps.push({
                action: 'stack-overflow',
                description: `⚠ STACK OVERFLOW! Current size (${this.size()}) equals capacity (${this.capacity}). Cannot push ${val}.`,
                why: 'Stack Overflow occurs when an attempt is made to push an item onto a full stack.',
                pseudocodeLine: 2,
                pythonLine: 3,
                incomingValue: val,
                highlightIndex: this.top,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                error: 'STACK OVERFLOW',
                isTerminal: true
            });
            return steps;
        }

        // Step 2: Increment TOP pointer
        const prevTop = this.top;
        const newTop = prevTop + 1;

        steps.push({
            action: 'increment-top',
            description: `Space available. Increment TOP pointer: TOP = TOP + 1 (${prevTop} → ${newTop}).`,
            why: 'In an array-based stack, incrementing the top pointer allocates the next available memory slot.',
            pseudocodeLine: 3,
            pythonLine: 5,
            incomingValue: val,
            highlightIndex: newTop,
            memoryState: {
                ...this.getMemorySnapshot(),
                top: newTop,
                slots: this.getMemorySnapshot().slots.map(s => ({
                    ...s,
                    isTop: s.index === newTop
                }))
            },
            sound: 'step'
        });

        // Step 3: Store value in array[TOP]
        this.push(val);
        const finalMem = this.getMemorySnapshot();

        steps.push({
            action: 'store-value',
            description: `Store value ${val} at memory index [${newTop}]. PUSH operation completed.`,
            why: `Element ${val} is now at the top of the stack. Next POP will retrieve this element (LIFO).`,
            pseudocodeLine: 4,
            pythonLine: 6,
            highlightIndex: newTop,
            memoryState: finalMem,
            sound: 'push',
            isTerminal: true
        });

        return steps;
    }

    generatePopSteps() {
        const steps = [];

        // Step 1: Check underflow
        steps.push({
            action: 'pop-inspect',
            description: `Attempting POP(). First checking if Stack is Empty: (top == -1)? [${this.top} == -1]`,
            why: 'Boundary condition check: ensuring an element exists before attempting removal.',
            pseudocodeLine: 1,
            pythonLine: 2,
            highlightIndex: this.top >= 0 ? this.top : null,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isEmpty()) {
            steps.push({
                action: 'stack-underflow',
                description: `⚠ STACK UNDERFLOW! The stack is empty (top == -1). Cannot pop any element.`,
                why: 'Stack Underflow occurs when an attempt is made to pop from an empty stack.',
                pseudocodeLine: 2,
                pythonLine: 3,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                error: 'STACK UNDERFLOW',
                isTerminal: true
            });
            return steps;
        }

        const poppedVal = this.items[this.top];
        const oldTop = this.top;

        // Step 2: Highlight TOP and read value
        steps.push({
            action: 'read-top',
            description: `Stack has elements. Reading value from TOP slot [${oldTop}]: ${poppedVal}.`,
            why: 'LIFO (Last-In, First-Out) dictates that the most recently added item is accessed first.',
            pseudocodeLine: 3,
            pythonLine: 5,
            highlightIndex: oldTop,
            poppedValue: poppedVal,
            memoryState: this.getMemorySnapshot(),
            sound: 'compare'
        });

        // Step 3: Remove value and decrement TOP
        this.pop();
        const finalMem = this.getMemorySnapshot();

        steps.push({
            action: 'decrement-top',
            description: `Value ${poppedVal} removed. Decrement TOP: TOP = TOP - 1 (${oldTop} → ${this.top}). POP complete.`,
            why: 'Decrementing the pointer marks the memory slot as available for future pushes.',
            pseudocodeLine: 4,
            pythonLine: 6,
            highlightIndex: this.top >= 0 ? this.top : null,
            poppedValue: poppedVal,
            memoryState: finalMem,
            sound: 'pop',
            isTerminal: true
        });

        return steps;
    }

    generatePeekSteps() {
        const steps = [];
        steps.push({
            action: 'peek-check',
            description: `PEEK: Inspecting element at TOP without modifying the stack.`,
            why: 'PEEK inspects the top element with O(1) time complexity without altering stack state.',
            pseudocodeLine: 1,
            pythonLine: 2,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        if (this.isEmpty()) {
            steps.push({
                action: 'peek-empty',
                description: `Stack is empty. PEEK returns NULL.`,
                why: 'No elements available to inspect.',
                pseudocodeLine: 2,
                pythonLine: 3,
                memoryState: this.getMemorySnapshot(),
                sound: 'error',
                isTerminal: true
            });
        } else {
            steps.push({
                action: 'peek-result',
                description: `PEEK result: Value at TOP index [${this.top}] is ${this.peek()}.`,
                why: `Top element is ${this.peek()}. Stack pointer remains unchanged at index ${this.top}.`,
                pseudocodeLine: 3,
                pythonLine: 5,
                highlightIndex: this.top,
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
            description: 'Resetting Stack: Setting TOP = -1 and clearing memory array.',
            why: 'Clearing the stack reclaims all slots in O(1) time by resetting the pointer.',
            pseudocodeLine: 1,
            pythonLine: 1,
            memoryState: this.getMemorySnapshot(),
            sound: 'step'
        });

        this.clear();
        steps.push({
            action: 'clear-complete',
            description: 'Stack cleared. Size = 0, TOP = -1.',
            why: 'All memory slots are now marked EMPTY.',
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
    module.exports = { Stack };
}
