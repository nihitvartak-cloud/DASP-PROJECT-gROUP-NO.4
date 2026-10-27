/**
 * Singly Linked List Model
 * Pure algorithmic logic and step generation. Decoupled from DOM/UI.
 */

class LLNode {
    constructor(value, id = null, address = null) {
        this.value = value;
        this.id = id || ('ll_' + Math.random().toString(36).substr(2, 9));
        this.next = null;
        this.address = address || ('0x' + (Math.floor(Math.random() * 0xEFFF) + 0x1000).toString(16).toUpperCase());
    }

    clone() {
        const copy = new LLNode(this.value, this.id, this.address);
        copy.next = this.next ? this.next.clone() : null;
        return copy;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this._size = 0;
    }

    cloneHead() {
        return this.head ? this.head.clone() : null;
    }

    size() {
        return this._size;
    }

    isEmpty() {
        return this.head === null;
    }

    clear() {
        this.head = null;
        this._size = 0;
    }

    toArray() {
        const result = [];
        let curr = this.head;
        while (curr) {
            result.push({
                id: curr.id,
                value: curr.value,
                address: curr.address,
                nextAddress: curr.next ? curr.next.address : 'NULL'
            });
            curr = curr.next;
        }
        return result;
    }

    insertBeginning(value) {
        const newNode = new LLNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this._size++;
        return true;
    }

    insertEnd(value) {
        const newNode = new LLNode(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let curr = this.head;
            while (curr.next) {
                curr = curr.next;
            }
            curr.next = newNode;
        }
        this._size++;
        return true;
    }

    insertAtPosition(value, pos) {
        if (pos < 0 || pos > this._size) return false;
        if (pos === 0) return this.insertBeginning(value);
        if (pos === this._size) return this.insertEnd(value);

        const newNode = new LLNode(value);
        let curr = this.head;
        for (let i = 0; i < pos - 1; i++) {
            curr = curr.next;
        }
        newNode.next = curr.next;
        curr.next = newNode;
        this._size++;
        return true;
    }

    deleteBeginning() {
        if (!this.head) return null;
        const val = this.head.value;
        this.head = this.head.next;
        this._size--;
        return val;
    }

    deleteEnd() {
        if (!this.head) return null;
        if (!this.head.next) {
            const val = this.head.value;
            this.head = null;
            this._size = 0;
            return val;
        }
        let curr = this.head;
        while (curr.next && curr.next.next) {
            curr = curr.next;
        }
        const val = curr.next.value;
        curr.next = null;
        this._size--;
        return val;
    }

    deleteAtPosition(pos) {
        if (pos < 0 || pos >= this._size || !this.head) return null;
        if (pos === 0) return this.deleteBeginning();

        let curr = this.head;
        for (let i = 0; i < pos - 1; i++) {
            curr = curr.next;
        }
        const target = curr.next;
        const val = target.value;
        curr.next = target.next;
        this._size--;
        return val;
    }

    search(value) {
        let curr = this.head;
        let index = 0;
        while (curr) {
            if (curr.value === value) return { node: curr, index };
            curr = curr.next;
            index++;
        }
        return null;
    }

    reverse() {
        let prev = null;
        let curr = this.head;
        while (curr) {
            const next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        this.head = prev;
    }

    /* =========================================================================
       STEP GENERATORS
       ========================================================================= */

    generateInsertBeginningSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid value "${value}". Number required.`,
                why: 'Node data must be a valid number.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        const tempNode = new LLNode(val);

        // Step 1: Create node
        steps.push({
            action: 'create-node',
            description: `Allocated new node with value ${val} at heap address ${tempNode.address}.`,
            why: 'Dynamic memory allocation creates the node with next = NULL.',
            pseudocodeLine: 1,
            pythonLine: 2,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
            nodes: this.toArray(),
            sound: 'step'
        });

        // Step 2: Point newNode.next = HEAD
        steps.push({
            action: 'point-next',
            description: `Set newNode.next = HEAD (${this.head ? this.head.address : 'NULL'}).`,
            why: 'Linking new node to current head preserves the rest of the list before moving head pointer.',
            pseudocodeLine: 2,
            pythonLine: 3,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address, nextAddress: this.head ? this.head.address : 'NULL' },
            nodes: this.toArray(),
            sound: 'move'
        });

        // Step 3: Update HEAD = newNode
        this.insertBeginning(val);
        steps.push({
            action: 'update-head',
            description: `Set HEAD = newNode. Node ${val} is now the first node. Insertion complete.`,
            why: 'O(1) insertion at beginning because no traversal is required.',
            pseudocodeLine: 3,
            pythonLine: 4,
            highlightNodeId: this.head.id,
            nodes: this.toArray(),
            sound: 'insert',
            isTerminal: true
        });

        return steps;
    }

    generateInsertEndSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid value "${value}".`,
                why: 'Node data must be a valid number.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        const tempNode = new LLNode(val);

        // Step 1: Create node
        steps.push({
            action: 'create-node',
            description: `Allocated new node with value ${val} at address ${tempNode.address}.`,
            why: 'Dynamic memory allocation prepares the node.',
            pseudocodeLine: 1,
            pythonLine: 2,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
            nodes: this.toArray(),
            sound: 'step'
        });

        if (!this.head) {
            steps.push({
                action: 'empty-list-head',
                description: `List is empty (HEAD == NULL). Set HEAD = newNode.`,
                why: 'When list is empty, inserting at end is identical to inserting at beginning.',
                pseudocodeLine: 2,
                pythonLine: 4,
                newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
                nodes: this.toArray(),
                sound: 'move'
            });

            this.insertEnd(val);
            steps.push({
                action: 'insert-end-done',
                description: `Node ${val} is now the HEAD. Insertion complete.`,
                why: 'List now has 1 element.',
                pseudocodeLine: 3,
                pythonLine: 5,
                highlightNodeId: this.head.id,
                nodes: this.toArray(),
                sound: 'insert',
                isTerminal: true
            });
            return steps;
        }

        // Traverse to last node
        let curr = this.head;
        let index = 0;
        steps.push({
            action: 'start-traverse',
            description: `List has nodes. Starting traversal from HEAD (${curr.value}) to find last node.`,
            why: 'Singly linked list without tail pointer requires O(n) traversal to find end.',
            pseudocodeLine: 4,
            pythonLine: 7,
            highlightNodeId: curr.id,
            nodes: this.toArray(),
            sound: 'step'
        });

        while (curr.next) {
            curr = curr.next;
            index++;
            steps.push({
                action: 'traverse-step',
                description: `Traverse to node [${index}]: ${curr.value}.`,
                why: 'Following next pointers.',
                pseudocodeLine: 5,
                pythonLine: 8,
                highlightNodeId: curr.id,
                nodes: this.toArray(),
                sound: 'move'
            });
        }

        steps.push({
            action: 'found-last',
            description: `Reached last node: ${curr.value} (next is NULL).`,
            why: 'We can now attach the new node here.',
            pseudocodeLine: 6,
            pythonLine: 9,
            highlightNodeId: curr.id,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
            nodes: this.toArray(),
            sound: 'compare'
        });

        this.insertEnd(val);
        const finalNodes = this.toArray();
        const lastNode = finalNodes[finalNodes.length - 1];

        steps.push({
            action: 'attach-node',
            description: `Set lastNode.next = newNode. Node ${val} appended to end of list.`,
            why: 'Last node now points to new node, and new node points to NULL.',
            pseudocodeLine: 7,
            pythonLine: 10,
            highlightNodeId: lastNode.id,
            nodes: finalNodes,
            sound: 'insert',
            isTerminal: true
        });

        return steps;
    }

    generateInsertAtPositionSteps(value, position) {
        const val = Number(value);
        const pos = Number(position);
        const steps = [];

        if (isNaN(val) || isNaN(pos) || pos < 0 || pos > this._size) {
            steps.push({
                action: 'error',
                description: `Invalid position ${pos}! Valid range: 0 to ${this._size}.`,
                why: 'Index out of bounds for linked list.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        if (pos === 0) return this.generateInsertBeginningSteps(val);
        if (pos === this._size) return this.generateInsertEndSteps(val);

        const tempNode = new LLNode(val);

        steps.push({
            action: 'create-node-pos',
            description: `Allocated new node (${val}) to insert at position ${pos}.`,
            why: 'Dynamic allocation prepared.',
            pseudocodeLine: 1,
            pythonLine: 2,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
            nodes: this.toArray(),
            sound: 'step'
        });

        // Traverse to pos - 1
        let curr = this.head;
        for (let i = 0; i < pos - 1; i++) {
            steps.push({
                action: 'traverse-pos',
                description: `Traverse to node [${i}]: ${curr.value}. Moving toward position ${pos - 1}.`,
                why: 'Need to reach predecessor node to update its next pointer.',
                pseudocodeLine: 2,
                pythonLine: 5,
                highlightNodeId: curr.id,
                nodes: this.toArray(),
                sound: 'move'
            });
            curr = curr.next;
        }

        const predNode = curr;
        const succNode = curr.next;

        steps.push({
            action: 'found-predecessor',
            description: `Predecessor node located: ${predNode.value} (index ${pos - 1}).`,
            why: 'Predecessor will be reconnected to new node.',
            pseudocodeLine: 3,
            pythonLine: 7,
            highlightNodeId: predNode.id,
            secondaryHighlightId: succNode ? succNode.id : null,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address },
            nodes: this.toArray(),
            sound: 'compare'
        });

        steps.push({
            action: 'link-new-to-succ',
            description: `Set newNode.next = predecessor.next (${succNode.value}).`,
            why: 'Linking new node to successor first avoids losing the remainder of the list.',
            pseudocodeLine: 4,
            pythonLine: 8,
            highlightNodeId: predNode.id,
            secondaryHighlightId: succNode ? succNode.id : null,
            newNode: { id: tempNode.id, value: tempNode.value, address: tempNode.address, nextAddress: succNode.address },
            nodes: this.toArray(),
            sound: 'move'
        });

        this.insertAtPosition(val, pos);
        const finalNodes = this.toArray();

        steps.push({
            action: 'link-pred-to-new',
            description: `Set predecessor.next = newNode. Node ${val} inserted at position ${pos}.`,
            why: 'Splicing complete. Order restored.',
            pseudocodeLine: 5,
            pythonLine: 9,
            highlightNodeId: finalNodes[pos].id,
            nodes: finalNodes,
            sound: 'insert',
            isTerminal: true
        });

        return steps;
    }

    generateDeleteBeginningSteps() {
        const steps = [];

        if (!this.head) {
            steps.push({
                action: 'empty-list',
                description: '⚠ List is empty. Cannot delete from beginning.',
                why: 'Underflow: HEAD is NULL.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: [],
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        const target = this.head;
        const nextNode = this.head.next;

        steps.push({
            action: 'inspect-head',
            description: `Mark HEAD node ${target.value} for deletion.`,
            why: 'HEAD points to the first node.',
            pseudocodeLine: 2,
            pythonLine: 3,
            highlightNodeId: target.id,
            nodes: this.toArray(),
            sound: 'step'
        });

        steps.push({
            action: 'advance-head',
            description: `Set HEAD = HEAD.next (${nextNode ? nextNode.value : 'NULL'}).`,
            why: 'Bypassing first node so second node becomes the new HEAD.',
            pseudocodeLine: 3,
            pythonLine: 4,
            highlightNodeId: target.id,
            secondaryHighlightId: nextNode ? nextNode.id : null,
            nodes: this.toArray(),
            sound: 'move'
        });

        this.deleteBeginning();
        steps.push({
            action: 'delete-head-done',
            description: `Node ${target.value} deallocated. New size = ${this._size}.`,
            why: 'O(1) deletion at beginning.',
            pseudocodeLine: 4,
            pythonLine: 5,
            nodes: this.toArray(),
            sound: 'delete',
            isTerminal: true
        });

        return steps;
    }

    generateDeleteEndSteps() {
        const steps = [];

        if (!this.head) {
            steps.push({
                action: 'empty-list',
                description: '⚠ List is empty. Cannot delete from end.',
                why: 'Underflow.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: [],
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        if (!this.head.next) {
            const singleVal = this.head.value;
            steps.push({
                action: 'single-node-delete',
                description: `List has only one node (${singleVal}). Setting HEAD = NULL.`,
                why: 'Deleting the only element leaves the list empty.',
                pseudocodeLine: 2,
                pythonLine: 3,
                highlightNodeId: this.head.id,
                nodes: this.toArray(),
                sound: 'step'
            });

            this.deleteEnd();
            steps.push({
                action: 'delete-end-done',
                description: `Node ${singleVal} removed. List is now empty.`,
                why: 'List size = 0.',
                pseudocodeLine: 3,
                pythonLine: 4,
                nodes: [],
                sound: 'delete',
                isTerminal: true
            });
            return steps;
        }

        // Traverse to second-to-last node
        let curr = this.head;
        steps.push({
            action: 'traverse-second-last',
            description: `Traversing to find second-to-last node.`,
            why: 'Need second-to-last node to set its next pointer to NULL.',
            pseudocodeLine: 4,
            pythonLine: 6,
            highlightNodeId: curr.id,
            nodes: this.toArray(),
            sound: 'step'
        });

        while (curr.next && curr.next.next) {
            curr = curr.next;
            steps.push({
                action: 'traverse-step',
                description: `Inspecting node ${curr.value}.`,
                why: 'Checking if curr.next.next is NULL.',
                pseudocodeLine: 5,
                pythonLine: 7,
                highlightNodeId: curr.id,
                nodes: this.toArray(),
                sound: 'move'
            });
        }

        const secondLast = curr;
        const lastNode = curr.next;

        steps.push({
            action: 'found-second-last',
            description: `Found second-to-last node: ${secondLast.value}. Target to delete is ${lastNode.value}.`,
            why: 'Second-to-last node identified.',
            pseudocodeLine: 6,
            pythonLine: 8,
            highlightNodeId: secondLast.id,
            secondaryHighlightId: lastNode.id,
            nodes: this.toArray(),
            sound: 'compare'
        });

        this.deleteEnd();
        steps.push({
            action: 'delete-end-done',
            description: `Set ${secondLast.value}.next = NULL. Node ${lastNode.value} deleted.`,
            why: 'End node successfully detached.',
            pseudocodeLine: 7,
            pythonLine: 9,
            highlightNodeId: secondLast.id,
            nodes: this.toArray(),
            sound: 'delete',
            isTerminal: true
        });

        return steps;
    }

    generateDeleteAtPositionSteps(position) {
        const pos = Number(position);
        const steps = [];

        if (isNaN(pos) || pos < 0 || pos >= this._size || !this.head) {
            steps.push({
                action: 'error',
                description: `Invalid position ${pos}! Valid range: 0 to ${Math.max(0, this._size - 1)}.`,
                why: 'Index out of bounds.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        if (pos === 0) return this.generateDeleteBeginningSteps();
        if (pos === this._size - 1) return this.generateDeleteEndSteps();

        // Traverse to pos - 1
        let curr = this.head;
        for (let i = 0; i < pos - 1; i++) {
            steps.push({
                action: 'traverse-del-pos',
                description: `Traverse to node [${i}]: ${curr.value}. Target is at position ${pos}.`,
                why: 'Finding predecessor.',
                pseudocodeLine: 2,
                pythonLine: 4,
                highlightNodeId: curr.id,
                nodes: this.toArray(),
                sound: 'move'
            });
            curr = curr.next;
        }

        const pred = curr;
        const target = curr.next;
        const succ = target.next;

        steps.push({
            action: 'identify-nodes',
            description: `Predecessor: ${pred.value}, Target to delete: ${target.value}, Successor: ${succ ? succ.value : 'NULL'}.`,
            why: 'To delete target, update predecessor.next = target.next.',
            pseudocodeLine: 3,
            pythonLine: 6,
            highlightNodeId: target.id,
            secondaryHighlightId: pred.id,
            nodes: this.toArray(),
            sound: 'compare'
        });

        this.deleteAtPosition(pos);
        const finalNodes = this.toArray();

        steps.push({
            action: 'unlink-target',
            description: `Set ${pred.value}.next = ${succ ? succ.value : 'NULL'}. Node ${target.value} removed.`,
            why: 'Node unlinked from chain.',
            pseudocodeLine: 4,
            pythonLine: 7,
            highlightNodeId: pred.id,
            nodes: finalNodes,
            sound: 'delete',
            isTerminal: true
        });

        return steps;
    }

    generateSearchSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid search value "${value}".`,
                why: 'Number required.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        if (!this.head) {
            steps.push({
                action: 'empty-search',
                description: `List is empty. Value ${val} NOT FOUND.`,
                why: 'Empty list has no elements.',
                pseudocodeLine: 1,
                pythonLine: 2,
                nodes: [],
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        let curr = this.head;
        let index = 0;

        steps.push({
            action: 'start-search',
            description: `Start linear search for ${val} at HEAD (index 0).`,
            why: 'Singly linked list must be searched linearly from HEAD.',
            pseudocodeLine: 2,
            pythonLine: 3,
            highlightNodeId: curr.id,
            nodes: this.toArray(),
            sound: 'step'
        });

        while (curr) {
            steps.push({
                action: 'compare-search',
                description: `Compare node [${index}] value (${curr.value}) with target (${val}).`,
                why: 'Checking equality.',
                pseudocodeLine: 3,
                pythonLine: 5,
                highlightNodeId: curr.id,
                nodes: this.toArray(),
                sound: 'compare'
            });

            if (curr.value === val) {
                steps.push({
                    action: 'search-found',
                    description: `Target value ${val} FOUND at index [${index}] (Address ${curr.address})!`,
                    why: `Found after ${index + 1} comparisons. O(n) worst-case.`,
                    pseudocodeLine: 4,
                    pythonLine: 6,
                    foundNodeId: curr.id,
                    highlightNodeId: curr.id,
                    nodes: this.toArray(),
                    sound: 'found',
                    isTerminal: true
                });
                return steps;
            }

            curr = curr.next;
            index++;

            if (curr) {
                steps.push({
                    action: 'move-next-search',
                    description: `Mismatch. Move to next node (index [${index}]).`,
                    why: 'Proceeding along next pointer.',
                    pseudocodeLine: 5,
                    pythonLine: 7,
                    highlightNodeId: curr.id,
                    nodes: this.toArray(),
                    sound: 'move'
                });
            }
        }

        steps.push({
            action: 'search-not-found',
            description: `Reached NULL. Target value ${val} NOT FOUND in list.`,
            why: 'Linear search exhausted all nodes without match.',
            pseudocodeLine: 6,
            pythonLine: 8,
            nodes: this.toArray(),
            sound: 'error',
            isTerminal: true
        });

        return steps;
    }

    generateReverseSteps() {
        const steps = [];

        if (!this.head || !this.head.next) {
            steps.push({
                action: 'trivial-reverse',
                description: `List has ${this._size} nodes. Reversal is trivial.`,
                why: 'A list with 0 or 1 element is already reversed.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodes: this.toArray(),
                sound: 'step',
                isTerminal: true
            });
            return steps;
        }

        // Demonstrate: previous, current, next pointers step-by-step
        let prev = null;
        let curr = this.head;

        steps.push({
            action: 'reverse-init',
            description: `Initialize three pointers: prev = NULL, curr = HEAD (${curr.value}), next = NULL.`,
            why: 'Three-pointer technique allows in-place reversal in O(n) time and O(1) space.',
            pseudocodeLine: 2,
            pythonLine: 2,
            pointerState: {
                prevId: null,
                currId: curr.id,
                nextId: curr.next ? curr.next.id : null
            },
            highlightNodeId: curr.id,
            nodes: this.toArray(),
            sound: 'step'
        });

        let stepCount = 1;
        while (curr) {
            const next = curr.next;

            // Step A: Save next
            steps.push({
                action: 'save-next',
                description: `[Step ${stepCount}a] Save next pointer: next = curr.next (${next ? next.value : 'NULL'}).`,
                why: 'Must store next node before breaking the forward pointer.',
                pseudocodeLine: 3,
                pythonLine: 4,
                pointerState: {
                    prevId: prev ? prev.id : null,
                    currId: curr.id,
                    nextId: next ? next.id : null
                },
                highlightNodeId: curr.id,
                secondaryHighlightId: next ? next.id : null,
                nodes: this.toArray(),
                sound: 'step'
            });

            // Step B: Reverse pointer
            steps.push({
                action: 'reverse-link',
                description: `[Step ${stepCount}b] Reverse link: curr.next = prev (${prev ? prev.value : 'NULL'}).`,
                why: `Node ${curr.value} now points backwards to ${prev ? prev.value : 'NULL'}.`,
                pseudocodeLine: 4,
                pythonLine: 5,
                pointerState: {
                    prevId: prev ? prev.id : null,
                    currId: curr.id,
                    nextId: next ? next.id : null
                },
                highlightNodeId: curr.id,
                reversedLinkId: curr.id,
                nodes: this.toArray(),
                sound: 'reverse'
            });

            // Step C: Advance prev and curr
            prev = curr;
            curr = next;

            steps.push({
                action: 'advance-pointers',
                description: `[Step ${stepCount}c] Advance: prev = curr (${prev.value}), curr = next (${curr ? curr.value : 'NULL'}).`,
                why: 'Shifting window forward by one node.',
                pseudocodeLine: 5,
                pythonLine: 6,
                pointerState: {
                    prevId: prev.id,
                    currId: curr ? curr.id : null,
                    nextId: null
                },
                highlightNodeId: prev.id,
                nodes: this.toArray(),
                sound: 'move'
            });

            stepCount++;
        }

        // Finalize model reverse
        this.reverse();
        const finalNodes = this.toArray();

        steps.push({
            action: 'reverse-done',
            description: `curr reached NULL. Set HEAD = prev (${prev.value}). Linked list successfully reversed!`,
            why: 'In-place reversal complete. Head pointer now points to original tail.',
            pseudocodeLine: 6,
            pythonLine: 8,
            pointerState: {
                prevId: null,
                currId: null,
                nextId: null
            },
            highlightNodeId: finalNodes[0].id,
            nodes: finalNodes,
            sound: 'success',
            isTerminal: true
        });

        return steps;
    }

    generateClearSteps() {
        const steps = [];
        steps.push({
            action: 'clear-start',
            description: 'Resetting Linked List: setting HEAD = NULL.',
            why: 'Deallocates all node references.',
            pseudocodeLine: 1,
            pythonLine: 1,
            nodes: this.toArray(),
            sound: 'step'
        });

        this.clear();
        steps.push({
            action: 'clear-done',
            description: 'Linked list cleared. HEAD = NULL, Size = 0.',
            why: 'List is now empty.',
            pseudocodeLine: 2,
            pythonLine: 2,
            nodes: [],
            sound: 'delete',
            isTerminal: true
        });

        return steps;
    }
}

// Export for Node.js test environment or browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LinkedList, LLNode };
}
