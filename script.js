/**
 * Linked List Learning Simulator
 * Virtual Data Structures Laboratory
 * Comprehensive JavaScript Engine
 */

(function (global) {
    'use strict';

    // Unique ID generator for visual node tracking
    let nodeUidCounter = 1;
    function generateNodeUid() {
        return `node_${nodeUidCounter++}`;
    }

    // ==========================================
    // 1. DATA STRUCTURE MODELS
    // ==========================================

    class SinglyNode {
        constructor(value) {
            this.uid = generateNodeUid();
            this.value = value;
            this.next = null;
        }
    }

    class DoublyNode {
        constructor(value) {
            this.uid = generateNodeUid();
            this.value = value;
            this.prev = null;
            this.next = null;
        }
    }

    // ------------------------------------------
    // A. Singly Linked List (SLL)
    // ------------------------------------------
    class SinglyLinkedList {
        constructor() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.type = 'singly';
            this.lastSteps = [];
            this.lastResult = null;
        }

        clear() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.lastSteps = [];
            this.lastResult = null;
        }

        toArray() {
            const result = [];
            let curr = this.head;
            while (curr) {
                result.push(curr.value);
                curr = curr.next;
            }
            return result;
        }

        toSnapshot() {
            const nodes = [];
            let curr = this.head;
            let idx = 0;
            while (curr) {
                nodes.push({
                    uid: curr.uid,
                    index: idx++,
                    value: curr.value,
                    nextUid: curr.next ? curr.next.uid : null,
                    prevUid: null
                });
                curr = curr.next;
            }
            return {
                type: 'singly',
                length: this.length,
                headUid: this.head ? this.head.uid : null,
                tailUid: this.tail ? this.tail.uid : null,
                nodes
            };
        }

        insertBeginning(value) {
            const newNode = new SinglyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate New Node',
                description: `Created new node with value ${value}. Its next pointer currently points to null.`,
                codeLine: 1,
                highlightUid: newNode.uid,
                newNodeSnapshot: { uid: newNode.uid, value: newNode.value, nextUid: null }
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: List Was Empty',
                    description: `Since the list was empty, both HEAD and TAIL now point to the new node (${value}).`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                steps.push({
                    title: 'Step 2: Connect New Node to Head',
                    description: `Set newNode.next = head. The new node now references the former first node (${this.head.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid,
                    activePointer: { from: newNode.uid, to: this.head.uid }
                });

                this.head = newNode;
                this.length++;

                steps.push({
                    title: 'Step 3: Update HEAD Pointer',
                    description: `Updated HEAD pointer to point to newNode (${value}). The operation takes O(1) time.`,
                    codeLine: 4,
                    highlightUid: this.head.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at beginning.` };
            return true;
        }

        insertEnd(value) {
            const newNode = new SinglyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate New Node',
                description: `Created new node with value ${value}. Its next pointer points to null.`,
                codeLine: 1,
                highlightUid: newNode.uid,
                newNodeSnapshot: { uid: newNode.uid, value: newNode.value, nextUid: null }
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: Empty List Initialization',
                    description: `List was empty. Set both HEAD and TAIL to point to newNode (${value}).`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                steps.push({
                    title: 'Step 2: Link Former Tail to New Node',
                    description: `Using the maintained TAIL pointer, set tail.next = newNode. No traversal required!`,
                    codeLine: 3,
                    highlightUid: this.tail.uid,
                    activePointer: { from: this.tail.uid, to: newNode.uid }
                });

                this.tail.next = newNode;
                this.tail = newNode;
                this.length++;

                steps.push({
                    title: 'Step 3: Update TAIL Pointer',
                    description: `Moved TAIL to newNode (${value}). O(1) time complexity with tail pointer.`,
                    codeLine: 4,
                    highlightUid: this.tail.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at end.` };
            return true;
        }

        insertAt(value, index) {
            if (index < 0 || index > this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length}.` };
                return false;
            }

            if (index === 0) return this.insertBeginning(value);
            if (index === this.length) return this.insertEnd(value);

            const newNode = new SinglyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Create New Node',
                description: `Created new node with value ${value}. Target position is index ${index}.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            let prev = this.head;
            for (let i = 0; i < index - 1; i++) {
                steps.push({
                    title: `Step 2: Traverse (Node ${i})`,
                    description: `Traversing list to find insertion point. Currently at node with value ${prev.value}.`,
                    codeLine: 2,
                    highlightUid: prev.uid
                });
                prev = prev.next;
            }

            steps.push({
                title: 'Step 3: Found Predecessor Node',
                description: `Predecessor found: node (${prev.value}) at index ${index - 1}. We will splice newNode here.`,
                codeLine: 3,
                highlightUid: prev.uid
            });

            newNode.next = prev.next;
            steps.push({
                title: 'Step 4: Connect New Node to Successor',
                description: `Set newNode.next = prev.next (${prev.next.value}). This preserves the rest of the list!`,
                codeLine: 4,
                highlightUid: newNode.uid,
                activePointer: { from: newNode.uid, to: prev.next.uid }
            });

            prev.next = newNode;
            this.length++;

            steps.push({
                title: 'Step 5: Relink Predecessor to New Node',
                description: `Set prev.next = newNode. The list is now reconnected with ${value} at index ${index}.`,
                codeLine: 5,
                highlightUid: prev.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at position ${index}.` };
            return true;
        }

        deleteBeginning() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete from beginning.' };
                return null;
            }

            const removed = this.head;
            const steps = [];

            steps.push({
                title: 'Step 1: Identify Head Node to Delete',
                description: `Identified head node with value ${removed.value}.`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: List Had Only 1 Node',
                    description: 'The list had only 1 node. HEAD and TAIL are now set to null.',
                    codeLine: 2
                });
            } else {
                this.head = this.head.next;
                this.length--;

                steps.push({
                    title: 'Step 2: Advance HEAD Pointer',
                    description: `Moved HEAD to head.next (${this.head.value}). Old head is reclaimed. O(1) time.`,
                    codeLine: 3,
                    highlightUid: this.head.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from beginning.` };
            return removed;
        }

        deleteEnd() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete from end.' };
                return null;
            }

            const steps = [];
            const removed = this.tail;

            steps.push({
                title: 'Step 1: Identify Tail Node to Delete',
                description: `Targeting tail node with value ${removed.value}.`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: Single Node Deletion',
                    description: 'Only one node in the list. HEAD and TAIL reset to null.',
                    codeLine: 2
                });
            } else {
                let curr = this.head;
                while (curr.next !== this.tail) {
                    steps.push({
                        title: 'Step 2: Traverse to Second-to-Last Node',
                        description: `Singly linked list has no prev pointer. Must traverse from HEAD to find node before TAIL. Currently at ${curr.value}.`,
                        codeLine: 3,
                        highlightUid: curr.uid
                    });
                    curr = curr.next;
                }

                steps.push({
                    title: 'Step 3: Found Second-to-Last Node',
                    description: `Second-to-last node is (${curr.value}). Setting its next pointer to null.`,
                    codeLine: 4,
                    highlightUid: curr.uid
                });

                curr.next = null;
                this.tail = curr;
                this.length--;

                steps.push({
                    title: 'Step 4: Update TAIL Pointer',
                    description: `Updated TAIL to point to (${curr.value}). Notice this required O(n) traversal for SLL!`,
                    codeLine: 5,
                    highlightUid: this.tail.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from end.` };
            return removed;
        }

        deleteAt(index) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return null;
            }

            if (index === 0) return this.deleteBeginning();
            if (index === this.length - 1) return this.deleteEnd();

            const steps = [];
            let prev = this.head;

            for (let i = 0; i < index - 1; i++) {
                steps.push({
                    title: `Step 1: Traverse to Predecessor (Index ${i})`,
                    description: `Traversing towards index ${index}. Currently at node (${prev.value}).`,
                    codeLine: 1,
                    highlightUid: prev.uid
                });
                prev = prev.next;
            }

            const target = prev.next;
            steps.push({
                title: 'Step 2: Identify Node to Delete',
                description: `Node to delete is (${target.value}) at index ${index}. Predecessor is (${prev.value}).`,
                codeLine: 2,
                highlightUid: target.uid,
                action: 'delete'
            });

            prev.next = target.next;
            this.length--;

            steps.push({
                title: 'Step 3: Bypass Target Node',
                description: `Updated prev.next = target.next (${target.next.value}). Target is unlinked and freed.`,
                codeLine: 3,
                highlightUid: prev.uid,
                activePointer: { from: prev.uid, to: target.next.uid }
            });

            target.steps = steps;
            target.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed: target, steps, message: `Deleted node at index ${index} (value: ${target.value}).` };
            return target;
        }

        search(value) {
            const steps = [];
            let curr = this.head;
            let index = 0;

            while (curr) {
                steps.push({
                    title: `Searching Index ${index}`,
                    description: `Comparing target ${value} with current node value (${curr.value}).`,
                    codeLine: 1,
                    highlightUid: curr.uid,
                    status: curr.value === value ? 'found' : 'comparing'
                });

                if (curr.value === value) {
                    this.lastSteps = steps;
                    return { success: true, found: true, index, node: curr, steps, message: `Found ${value} at index ${index}.` };
                }
                curr = curr.next;
                index++;
            }

            this.lastSteps = steps;
            return { success: true, found: false, index: -1, node: null, steps, message: `Value ${value} not found in list.` };
        }

        updateAt(index, newValue) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return false;
            }

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                steps.push({
                    title: `Traversing to Index ${index}`,
                    description: `At index ${i} (${curr.value}). Moving forward...`,
                    highlightUid: curr.uid
                });
                curr = curr.next;
            }

            const oldValue = curr.value;
            curr.value = newValue;

            steps.push({
                title: 'Updated Node Value',
                description: `Replaced old value (${oldValue}) with new value (${newValue}) at index ${index}.`,
                highlightUid: curr.uid,
                status: 'updated'
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Updated index ${index} from ${oldValue} to ${newValue}.` };
            return true;
        }

        reverse() {
            if (!this.head || this.length <= 1) {
                this.lastSteps = [];
                return true;
            }

            const steps = [];
            let prev = null;
            let curr = this.head;
            let next = null;

            steps.push({
                title: 'Step 1: Initialize Pointers',
                description: 'Set prev = null, curr = head. We will invert next pointers one by one.',
                codeLine: 1,
                highlightUid: curr.uid
            });

            this.tail = this.head; // Old head becomes tail

            let stepCount = 2;
            while (curr) {
                next = curr.next;
                steps.push({
                    title: `Step ${stepCount++}: Save Next Pointer`,
                    description: `Saved next node reference (${next ? next.value : 'NULL'}).`,
                    codeLine: 2,
                    highlightUid: curr.uid
                });

                curr.next = prev;
                steps.push({
                    title: `Step ${stepCount++}: Invert Current Node Pointer`,
                    description: `Set curr.next = prev (${prev ? prev.value : 'NULL'}). Pointer now points backward!`,
                    codeLine: 3,
                    highlightUid: curr.uid
                });

                prev = curr;
                curr = next;
            }

            this.head = prev; // Prev is now the new head

            steps.push({
                title: 'Final Step: Update Head & Tail',
                description: `All pointers inverted! HEAD is now (${this.head.value}) and TAIL is (${this.tail.value}).`,
                codeLine: 4,
                highlightUid: this.head.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: 'Successfully reversed Singly Linked List.' };
            return true;
        }
    }

    // ------------------------------------------
    // B. Doubly Linked List (DLL)
    // ------------------------------------------
    class DoublyLinkedList {
        constructor() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.type = 'doubly';
            this.lastSteps = [];
            this.lastResult = null;
        }

        clear() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.lastSteps = [];
            this.lastResult = null;
        }

        toArray() {
            const result = [];
            let curr = this.head;
            while (curr) {
                result.push(curr.value);
                curr = curr.next;
            }
            return result;
        }

        toSnapshot() {
            const nodes = [];
            let curr = this.head;
            let idx = 0;
            while (curr) {
                nodes.push({
                    uid: curr.uid,
                    index: idx++,
                    value: curr.value,
                    prevUid: curr.prev ? curr.prev.uid : null,
                    nextUid: curr.next ? curr.next.uid : null
                });
                curr = curr.next;
            }
            return {
                type: 'doubly',
                length: this.length,
                headUid: this.head ? this.head.uid : null,
                tailUid: this.tail ? this.tail.uid : null,
                nodes
            };
        }

        insertBeginning(value) {
            const newNode = new DoublyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate Doubly Node',
                description: `Created new node (${value}) with both prev and next initialized to null.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: List Was Empty',
                    description: `List was empty. HEAD and TAIL both point to (${value}). Prev and Next remain null.`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                steps.push({
                    title: 'Step 2: Connect New Node forward',
                    description: `Set newNode.next = head (${this.head.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid,
                    activePointer: { from: newNode.uid, to: this.head.uid, dir: 'next' }
                });

                this.head.prev = newNode;
                steps.push({
                    title: 'Step 3: Connect Former Head backward',
                    description: `Set head.prev = newNode (${value}). Now bidirectional link is established.`,
                    codeLine: 4,
                    highlightUid: this.head.uid,
                    activePointer: { from: this.head.uid, to: newNode.uid, dir: 'prev' }
                });

                this.head = newNode;
                this.length++;

                steps.push({
                    title: 'Step 4: Update HEAD Pointer',
                    description: `Set HEAD = newNode. New node's prev remains null. O(1) time complexity.`,
                    codeLine: 5,
                    highlightUid: this.head.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at beginning of Doubly Linked List.` };
            return true;
        }

        insertEnd(value) {
            const newNode = new DoublyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate Doubly Node',
                description: `Created new node (${value}) with prev = null and next = null.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: Empty List Initialization',
                    description: `List was empty. HEAD and TAIL both point to (${value}).`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.prev = this.tail;
                steps.push({
                    title: 'Step 2: Connect New Node backward',
                    description: `Set newNode.prev = tail (${this.tail.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid,
                    activePointer: { from: newNode.uid, to: this.tail.uid, dir: 'prev' }
                });

                this.tail.next = newNode;
                steps.push({
                    title: 'Step 3: Connect Former Tail forward',
                    description: `Set tail.next = newNode (${value}). Two-way connection complete.`,
                    codeLine: 4,
                    highlightUid: this.tail.uid,
                    activePointer: { from: this.tail.uid, to: newNode.uid, dir: 'next' }
                });

                this.tail = newNode;
                this.length++;

                steps.push({
                    title: 'Step 4: Update TAIL Pointer',
                    description: `Set TAIL = newNode. Tail's next is null. O(1) time complexity.`,
                    codeLine: 5,
                    highlightUid: this.tail.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at end of Doubly Linked List.` };
            return true;
        }

        insertAt(value, index) {
            if (index < 0 || index > this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length}.` };
                return false;
            }

            if (index === 0) return this.insertBeginning(value);
            if (index === this.length) return this.insertEnd(value);

            const newNode = new DoublyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate Node for Insertion',
                description: `Created node (${value}). We will insert it at index ${index}.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            let curr;
            if (index <= this.length / 2) {
                curr = this.head;
                for (let i = 0; i < index; i++) {
                    steps.push({
                        title: `Step 2: Forward Traversal (Index ${i})`,
                        description: `Traversing forward from HEAD. Currently at node (${curr.value}).`,
                        codeLine: 2,
                        highlightUid: curr.uid
                    });
                    curr = curr.next;
                }
            } else {
                curr = this.tail;
                for (let i = this.length - 1; i > index; i--) {
                    steps.push({
                        title: `Step 2: Backward Traversal (Index ${i})`,
                        description: `Traversing backward from TAIL using prev pointer. Currently at node (${curr.value}).`,
                        codeLine: 2,
                        highlightUid: curr.uid
                    });
                    curr = curr.prev;
                }
            }

            const pred = curr.prev;
            steps.push({
                title: 'Step 3: Located Position and Neighbors',
                description: `Node (${curr.value}) will become the successor. Node (${pred.value}) is predecessor.`,
                codeLine: 3,
                highlightUid: curr.uid
            });

            newNode.next = curr;
            newNode.prev = pred;
            steps.push({
                title: 'Step 4: Link New Node to Neighbors',
                description: `Set newNode.next = curr (${curr.value}) and newNode.prev = pred (${pred.value}).`,
                codeLine: 4,
                highlightUid: newNode.uid
            });

            pred.next = newNode;
            curr.prev = newNode;
            this.length++;

            steps.push({
                title: 'Step 5: Relink Neighbors to New Node',
                description: `Set pred.next = newNode and curr.prev = newNode. 4 pointers updated in total!`,
                codeLine: 5,
                highlightUid: newNode.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at index ${index} in Doubly Linked List.` };
            return true;
        }

        deleteBeginning() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.head;
            const steps = [];

            steps.push({
                title: 'Step 1: Identify Head Node to Delete',
                description: `Identified head node (${removed.value}).`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: Single Node Deletion',
                    description: 'Only 1 node in list. Reset HEAD and TAIL to null.',
                    codeLine: 2
                });
            } else {
                this.head = this.head.next;
                this.head.prev = null; // Important: clear prev pointer of new head!
                this.length--;

                steps.push({
                    title: 'Step 2: Advance HEAD & Set Head.Prev = null',
                    description: `HEAD moved to (${this.head.value}). Set new head.prev = null to sever backward link. O(1) time.`,
                    codeLine: 3,
                    highlightUid: this.head.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from beginning.` };
            return removed;
        }

        deleteEnd() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.tail;
            const steps = [];

            steps.push({
                title: 'Step 1: Identify Tail Node to Delete',
                description: `Identified tail node (${removed.value}). Note: In DLL, tail has direct prev pointer!`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: Single Node Deletion',
                    description: 'Reset HEAD and TAIL to null.',
                    codeLine: 2
                });
            } else {
                this.tail = this.tail.prev;
                this.tail.next = null; // Sever forward link
                this.length--;

                steps.push({
                    title: 'Step 2: Move TAIL to tail.prev in O(1)!',
                    description: `Moved TAIL to (${this.tail.value}) and set tail.next = null. Unlike SLL which was O(n), DLL deleteEnd is O(1)!`,
                    codeLine: 3,
                    highlightUid: this.tail.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from end in O(1) time.` };
            return removed;
        }

        deleteAt(index) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return null;
            }

            if (index === 0) return this.deleteBeginning();
            if (index === this.length - 1) return this.deleteEnd();

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const pred = curr.prev;
            const succ = curr.next;

            steps.push({
                title: 'Step 1: Locate Target Node & Neighbors',
                description: `Target node (${curr.value}) at index ${index}. Predecessor: (${pred.value}), Successor: (${succ.value}).`,
                codeLine: 1,
                highlightUid: curr.uid,
                action: 'delete'
            });

            pred.next = succ;
            succ.prev = pred;
            this.length--;

            steps.push({
                title: 'Step 2: Relink Neighbors and Bypass Target',
                description: `Set pred.next = succ (${succ.value}) and succ.prev = pred (${pred.value}). Target is unlinked!`,
                codeLine: 2,
                highlightUid: pred.uid
            });

            curr.steps = steps;
            curr.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed: curr, steps, message: `Deleted node at index ${index} (value: ${curr.value}).` };
            return curr;
        }

        search(value) {
            const steps = [];
            let curr = this.head;
            let index = 0;

            while (curr) {
                steps.push({
                    title: `Searching Index ${index}`,
                    description: `Checking node (${curr.value}) against search target ${value}.`,
                    codeLine: 1,
                    highlightUid: curr.uid,
                    status: curr.value === value ? 'found' : 'comparing'
                });

                if (curr.value === value) {
                    this.lastSteps = steps;
                    return { success: true, found: true, index, node: curr, steps, message: `Found ${value} at index ${index}.` };
                }
                curr = curr.next;
                index++;
            }

            this.lastSteps = steps;
            return { success: true, found: false, index: -1, node: null, steps, message: `Value ${value} not found in Doubly Linked List.` };
        }

        updateAt(index, newValue) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return false;
            }

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const oldValue = curr.value;
            curr.value = newValue;

            steps.push({
                title: 'Updated Node Value',
                description: `Replaced old value (${oldValue}) with new value (${newValue}) at index ${index}.`,
                highlightUid: curr.uid,
                status: 'updated'
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Updated index ${index} from ${oldValue} to ${newValue}.` };
            return true;
        }

        reverse() {
            if (!this.head || this.length <= 1) {
                this.lastSteps = [];
                return true;
            }

            const steps = [];
            let curr = this.head;
            let temp = null;

            steps.push({
                title: 'Step 1: Begin DLL Reversal',
                description: 'In Doubly Linked List, reversing involves swapping prev and next pointers for each node.',
                codeLine: 1,
                highlightUid: curr.uid
            });

            while (curr) {
                temp = curr.prev;
                curr.prev = curr.next;
                curr.next = temp;

                steps.push({
                    title: `Swapped Pointers for Node (${curr.value})`,
                    description: `Swapped prev and next for node (${curr.value}). Its old next is now prev, and old prev is now next.`,
                    codeLine: 2,
                    highlightUid: curr.uid
                });

                curr = curr.prev; // Since prev and next were swapped, curr.prev points to the original next node!
            }

            // Swap HEAD and TAIL
            const oldHead = this.head;
            this.head = this.tail;
            this.tail = oldHead;

            steps.push({
                title: 'Final Step: Swap HEAD and TAIL',
                description: `Swapped HEAD and TAIL. HEAD is now (${this.head.value}) and TAIL is (${this.tail.value}).`,
                codeLine: 3,
                highlightUid: this.head.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: 'Successfully reversed Doubly Linked List.' };
            return true;
        }
    }

    // ------------------------------------------
    // C. Circular Singly Linked List (CSLL)
    // ------------------------------------------
    class CircularSinglyLinkedList {
        constructor() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.type = 'circular-singly';
            this.lastSteps = [];
            this.lastResult = null;
        }

        clear() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.lastSteps = [];
            this.lastResult = null;
        }

        toArray() {
            const result = [];
            if (!this.head) return result;
            let curr = this.head;
            let count = 0;
            do {
                result.push(curr.value);
                curr = curr.next;
                count++;
            } while (curr !== this.head && count < this.length);
            return result;
        }

        toSnapshot() {
            const nodes = [];
            if (!this.head) {
                return { type: 'circular-singly', length: 0, headUid: null, tailUid: null, nodes };
            }
            let curr = this.head;
            let idx = 0;
            let count = 0;
            do {
                nodes.push({
                    uid: curr.uid,
                    index: idx++,
                    value: curr.value,
                    nextUid: curr.next ? curr.next.uid : null,
                    prevUid: null
                });
                curr = curr.next;
                count++;
            } while (curr !== this.head && count < this.length);

            return {
                type: 'circular-singly',
                length: this.length,
                headUid: this.head ? this.head.uid : null,
                tailUid: this.tail ? this.tail.uid : null,
                nodes
            };
        }

        insertBeginning(value) {
            const newNode = new SinglyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate New Node',
                description: `Created new node with value ${value} for Circular Singly Linked List.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                newNode.next = newNode; // Circular link to self!
                this.length = 1;

                steps.push({
                    title: 'Step 2: Self-Referential Circle',
                    description: `First node created. In CSLL, newNode.next points to itself (${value}). HEAD and TAIL both point here.`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                steps.push({
                    title: 'Step 2: Connect New Node to Head',
                    description: `Set newNode.next = head (${this.head.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid,
                    activePointer: { from: newNode.uid, to: this.head.uid }
                });

                this.tail.next = newNode;
                steps.push({
                    title: 'Step 3: Relink Tail to New Node',
                    description: `Set tail.next = newNode (${value}). This preserves the circular loop!`,
                    codeLine: 4,
                    highlightUid: this.tail.uid,
                    activePointer: { from: this.tail.uid, to: newNode.uid }
                });

                this.head = newNode;
                this.length++;

                steps.push({
                    title: 'Step 4: Update HEAD Pointer',
                    description: `Updated HEAD pointer to (${value}). Tail still points back to this new HEAD.`,
                    codeLine: 5,
                    highlightUid: this.head.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at beginning of Circular Singly List.` };
            return true;
        }

        insertEnd(value) {
            const newNode = new SinglyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate New Node',
                description: `Created new node (${value}) to insert at end of CSLL.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                newNode.next = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: Self-Loop Initialization',
                    description: `List was empty. Set newNode.next = newNode. HEAD and TAIL point to (${value}).`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                steps.push({
                    title: 'Step 2: Point New Node to Head',
                    description: `Set newNode.next = head (${this.head.value}) so the circle will close at the end.`,
                    codeLine: 3,
                    highlightUid: newNode.uid,
                    activePointer: { from: newNode.uid, to: this.head.uid }
                });

                this.tail.next = newNode;
                steps.push({
                    title: 'Step 3: Connect Former Tail to New Node',
                    description: `Set tail.next = newNode (${value}).`,
                    codeLine: 4,
                    highlightUid: this.tail.uid,
                    activePointer: { from: this.tail.uid, to: newNode.uid }
                });

                this.tail = newNode;
                this.length++;

                steps.push({
                    title: 'Step 4: Update TAIL Pointer',
                    description: `Updated TAIL to newNode (${value}). Notice tail.next is now head. Circle complete!`,
                    codeLine: 5,
                    highlightUid: this.tail.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at end of Circular Singly List.` };
            return true;
        }

        insertAt(value, index) {
            if (index < 0 || index > this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length}.` };
                return false;
            }

            if (index === 0) return this.insertBeginning(value);
            if (index === this.length) return this.insertEnd(value);

            const newNode = new SinglyNode(value);
            const steps = [];

            let prev = this.head;
            for (let i = 0; i < index - 1; i++) {
                steps.push({
                    title: `Traversing (Node ${i})`,
                    description: `Seeking predecessor at index ${index - 1}. Currently at (${prev.value}).`,
                    highlightUid: prev.uid
                });
                prev = prev.next;
            }

            newNode.next = prev.next;
            steps.push({
                title: 'Link New Node to Successor',
                description: `Set newNode.next = prev.next (${prev.next.value}).`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            prev.next = newNode;
            this.length++;

            steps.push({
                title: 'Link Predecessor to New Node',
                description: `Set prev.next = newNode. Node (${value}) inserted at index ${index}.`,
                codeLine: 2,
                highlightUid: prev.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at index ${index} in CSLL.` };
            return true;
        }

        deleteBeginning() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.head;
            const steps = [];

            steps.push({
                title: 'Step 1: Target Head for Deletion',
                description: `Identified head node (${removed.value}) to remove.`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: List is Now Empty',
                    description: 'Removed the sole node in the circle. HEAD and TAIL reset to null.',
                    codeLine: 2
                });
            } else {
                this.head = this.head.next;
                this.tail.next = this.head; // Crucial for circularity!
                this.length--;

                steps.push({
                    title: 'Step 2: Advance Head and Relink Tail',
                    description: `HEAD moved to (${this.head.value}). Updated tail.next = new head to maintain circularity!`,
                    codeLine: 3,
                    highlightUid: this.head.uid,
                    activePointer: { from: this.tail.uid, to: this.head.uid }
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from beginning of CSLL.` };
            return removed;
        }

        deleteEnd() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.tail;
            const steps = [];

            steps.push({
                title: 'Step 1: Target Tail Node for Deletion',
                description: `Targeting tail node (${removed.value}).`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: List Reset to Empty',
                    description: 'Removed single node. Reset pointers.',
                    codeLine: 2
                });
            } else {
                let curr = this.head;
                while (curr.next !== this.tail) {
                    steps.push({
                        title: 'Traverse to Find Node Before Tail',
                        description: `Traversing circular list to locate predecessor of tail. At (${curr.value}).`,
                        highlightUid: curr.uid
                    });
                    curr = curr.next;
                }

                curr.next = this.head; // Loop back to head
                this.tail = curr;
                this.length--;

                steps.push({
                    title: 'Step 3: Relink Predecessor to Head & Update TAIL',
                    description: `Set (${curr.value}).next = head (${this.head.value}) and TAIL = (${curr.value}). Circle maintained!`,
                    codeLine: 3,
                    highlightUid: this.tail.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from end of CSLL.` };
            return removed;
        }

        deleteAt(index) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return null;
            }

            if (index === 0) return this.deleteBeginning();
            if (index === this.length - 1) return this.deleteEnd();

            const steps = [];
            let prev = this.head;
            for (let i = 0; i < index - 1; i++) {
                prev = prev.next;
            }

            const target = prev.next;
            steps.push({
                title: 'Locate Target Node',
                description: `Target node (${target.value}) at index ${index}. Predecessor: (${prev.value}).`,
                highlightUid: target.uid,
                action: 'delete'
            });

            prev.next = target.next;
            this.length--;

            steps.push({
                title: 'Bypass Target Node',
                description: `Set prev.next = target.next (${target.next.value}). Target deleted.`,
                highlightUid: prev.uid
            });

            target.steps = steps;
            target.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed: target, steps, message: `Deleted index ${index} (${target.value}) from CSLL.` };
            return target;
        }

        search(value) {
            const steps = [];
            if (!this.head) {
                this.lastSteps = [];
                return { success: true, found: false, index: -1, steps, message: 'List is empty.' };
            }

            let curr = this.head;
            let index = 0;
            let visitedCount = 0;

            do {
                steps.push({
                    title: `Checking Index ${index}`,
                    description: `Comparing search target ${value} with current node (${curr.value}).`,
                    highlightUid: curr.uid,
                    status: curr.value === value ? 'found' : 'comparing'
                });

                if (curr.value === value) {
                    this.lastSteps = steps;
                    return { success: true, found: true, index, node: curr, steps, message: `Found ${value} at index ${index} in CSLL.` };
                }

                curr = curr.next;
                index++;
                visitedCount++;
            } while (curr !== this.head && visitedCount < this.length);

            steps.push({
                title: 'Cycle Guard Terminated Search',
                description: `Reached head again without finding ${value}. Safely terminated search to prevent infinite loop.`,
                codeLine: 2
            });

            this.lastSteps = steps;
            return { success: true, found: false, index: -1, node: null, steps, message: `Value ${value} not found in CSLL.` };
        }

        updateAt(index, newValue) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return false;
            }

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const oldValue = curr.value;
            curr.value = newValue;

            steps.push({
                title: 'Updated Node Value',
                description: `Replaced old value (${oldValue}) with new value (${newValue}) at index ${index}.`,
                highlightUid: curr.uid,
                status: 'updated'
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Updated index ${index} from ${oldValue} to ${newValue}.` };
            return true;
        }
    }

    // ------------------------------------------
    // D. Circular Doubly Linked List (CDLL)
    // ------------------------------------------
    class CircularDoublyLinkedList {
        constructor() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.type = 'circular-doubly';
            this.lastSteps = [];
            this.lastResult = null;
        }

        clear() {
            this.head = null;
            this.tail = null;
            this.length = 0;
            this.lastSteps = [];
            this.lastResult = null;
        }

        toArray() {
            const result = [];
            if (!this.head) return result;
            let curr = this.head;
            let count = 0;
            do {
                result.push(curr.value);
                curr = curr.next;
                count++;
            } while (curr !== this.head && count < this.length);
            return result;
        }

        toSnapshot() {
            const nodes = [];
            if (!this.head) {
                return { type: 'circular-doubly', length: 0, headUid: null, tailUid: null, nodes };
            }
            let curr = this.head;
            let idx = 0;
            let count = 0;
            do {
                nodes.push({
                    uid: curr.uid,
                    index: idx++,
                    value: curr.value,
                    prevUid: curr.prev ? curr.prev.uid : null,
                    nextUid: curr.next ? curr.next.uid : null
                });
                curr = curr.next;
                count++;
            } while (curr !== this.head && count < this.length);

            return {
                type: 'circular-doubly',
                length: this.length,
                headUid: this.head ? this.head.uid : null,
                tailUid: this.tail ? this.tail.uid : null,
                nodes
            };
        }

        insertBeginning(value) {
            const newNode = new DoublyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate Doubly Node',
                description: `Created new node (${value}) for Circular Doubly Linked List.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                newNode.next = newNode;
                newNode.prev = newNode; // Points to itself in both directions!
                this.length = 1;

                steps.push({
                    title: 'Step 2: Self-Contained Bidirectional Circle',
                    description: `First node: newNode.next = newNode AND newNode.prev = newNode. Circle established!`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                newNode.prev = this.tail;
                steps.push({
                    title: 'Step 2: Link New Node to Head and Tail',
                    description: `Set newNode.next = head (${this.head.value}) and newNode.prev = tail (${this.tail.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid
                });

                this.head.prev = newNode;
                this.tail.next = newNode;
                this.head = newNode;
                this.length++;

                steps.push({
                    title: 'Step 3: Update Former Head, Tail, and Set HEAD',
                    description: `Former head.prev = newNode, tail.next = newNode, and HEAD = newNode (${value}). O(1) time.`,
                    codeLine: 4,
                    highlightUid: this.head.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at beginning of CDLL.` };
            return true;
        }

        insertEnd(value) {
            const newNode = new DoublyNode(value);
            const steps = [];

            steps.push({
                title: 'Step 1: Allocate Doubly Node',
                description: `Created new node (${value}) to append to CDLL.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
                newNode.next = newNode;
                newNode.prev = newNode;
                this.length = 1;

                steps.push({
                    title: 'Step 2: Self-Contained Circle',
                    description: `Single node circle: next and prev point to itself.`,
                    codeLine: 2,
                    highlightUid: newNode.uid
                });
            } else {
                newNode.next = this.head;
                newNode.prev = this.tail;
                steps.push({
                    title: 'Step 2: Wire New Node into Circular Ends',
                    description: `Set newNode.next = head (${this.head.value}) and newNode.prev = tail (${this.tail.value}).`,
                    codeLine: 3,
                    highlightUid: newNode.uid
                });

                this.tail.next = newNode;
                this.head.prev = newNode;
                this.tail = newNode;
                this.length++;

                steps.push({
                    title: 'Step 3: Update TAIL Pointer',
                    description: `Set tail.next = newNode, head.prev = newNode, and TAIL = newNode (${value}). O(1) time.`,
                    codeLine: 4,
                    highlightUid: this.tail.uid
                });
            }

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at end of CDLL.` };
            return true;
        }

        insertAt(value, index) {
            if (index < 0 || index > this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length}.` };
                return false;
            }

            if (index === 0) return this.insertBeginning(value);
            if (index === this.length) return this.insertEnd(value);

            const newNode = new DoublyNode(value);
            const steps = [];

            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const pred = curr.prev;
            newNode.next = curr;
            newNode.prev = pred;
            pred.next = newNode;
            curr.prev = newNode;
            this.length++;

            steps.push({
                title: 'Relinked 4 Pointers at Index',
                description: `Inserted (${value}) between (${pred.value}) and (${curr.value}). Both forward and backward loops intact.`,
                codeLine: 1,
                highlightUid: newNode.uid
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Inserted ${value} at position ${index} in CDLL.` };
            return true;
        }

        deleteBeginning() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.head;
            const steps = [];

            steps.push({
                title: 'Step 1: Identify Head to Delete',
                description: `Targeting head node (${removed.value}) in CDLL.`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: Reset Empty List',
                    description: 'Removed single node. Reset HEAD and TAIL to null.',
                    codeLine: 2
                });
            } else {
                this.head = this.head.next;
                this.head.prev = this.tail;
                this.tail.next = this.head;
                this.length--;

                steps.push({
                    title: 'Step 2: Update Head and Circular Boundary Pointers',
                    description: `Moved HEAD to (${this.head.value}). Set new head.prev = tail and tail.next = new head in O(1) time!`,
                    codeLine: 3,
                    highlightUid: this.head.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from beginning of CDLL.` };
            return removed;
        }

        deleteEnd() {
            if (!this.head) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: 'List is empty. Cannot delete.' };
                return null;
            }

            const removed = this.tail;
            const steps = [];

            steps.push({
                title: 'Step 1: Identify Tail to Delete in CDLL',
                description: `Targeting tail node (${removed.value}). Note: In CDLL, tail.prev is immediately accessible!`,
                codeLine: 1,
                highlightUid: removed.uid,
                action: 'delete'
            });

            if (this.head === this.tail) {
                this.head = null;
                this.tail = null;
                this.length = 0;

                steps.push({
                    title: 'Step 2: Reset Empty List',
                    description: 'Single node removed.',
                    codeLine: 2
                });
            } else {
                this.tail = this.tail.prev;
                this.tail.next = this.head;
                this.head.prev = this.tail;
                this.length--;

                steps.push({
                    title: 'Step 2: Move TAIL to tail.prev in O(1)!',
                    description: `Updated TAIL = (${this.tail.value}), tail.next = head, and head.prev = tail. O(1) time complexity!`,
                    codeLine: 3,
                    highlightUid: this.tail.uid
                });
            }

            removed.steps = steps;
            removed.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed, steps, message: `Deleted ${removed.value} from end of CDLL.` };
            return removed;
        }

        deleteAt(index) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return null;
            }

            if (index === 0) return this.deleteBeginning();
            if (index === this.length - 1) return this.deleteEnd();

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const pred = curr.prev;
            const succ = curr.next;

            pred.next = succ;
            succ.prev = pred;
            this.length--;

            steps.push({
                title: 'Bypassed Node at Index',
                description: `Removed (${curr.value}). Connected (${pred.value}) directly with (${succ.value}).`,
                highlightUid: pred.uid
            });

            curr.steps = steps;
            curr.success = true;
            this.lastSteps = steps;
            this.lastResult = { success: true, removed: curr, steps, message: `Deleted index ${index} (${curr.value}) from CDLL.` };
            return curr;
        }

        search(value) {
            const steps = [];
            if (!this.head) {
                this.lastSteps = [];
                return { success: true, found: false, index: -1, steps, message: 'List is empty.' };
            }

            let curr = this.head;
            let index = 0;
            let visitedCount = 0;

            do {
                steps.push({
                    title: `Checking Index ${index}`,
                    description: `Checking node (${curr.value}) against target ${value}.`,
                    highlightUid: curr.uid,
                    status: curr.value === value ? 'found' : 'comparing'
                });

                if (curr.value === value) {
                    this.lastSteps = steps;
                    return { success: true, found: true, index, node: curr, steps, message: `Found ${value} at index ${index} in CDLL.` };
                }

                curr = curr.next;
                index++;
                visitedCount++;
            } while (curr !== this.head && visitedCount < this.length);

            this.lastSteps = steps;
            return { success: true, found: false, index: -1, node: null, steps, message: `Value ${value} not found in CDLL.` };
        }

        updateAt(index, newValue) {
            if (index < 0 || index >= this.length) {
                this.lastSteps = [];
                this.lastResult = { success: false, steps: [], message: `Invalid index ${index}. Valid range: 0 to ${this.length - 1}.` };
                return false;
            }

            const steps = [];
            let curr = this.head;
            for (let i = 0; i < index; i++) {
                curr = curr.next;
            }

            const oldValue = curr.value;
            curr.value = newValue;

            steps.push({
                title: 'Updated Node Value',
                description: `Replaced old value (${oldValue}) with new value (${newValue}) at index ${index}.`,
                highlightUid: curr.uid,
                status: 'updated'
            });

            this.lastSteps = steps;
            this.lastResult = { success: true, steps, message: `Updated index ${index} from ${oldValue} to ${newValue}.` };
            return true;
        }
    }

    // ==========================================
    // 2. MULTI-LANGUAGE CODE TEMPLATES
    // ==========================================
    const CODE_TEMPLATES = {
        singly: {
            insertBeginning: {
                steps: [
                    "1. Allocate memory for the new node with given value.",
                    "2. Point the new node's next pointer to the current HEAD.",
                    "3. If list was empty, point TAIL to the new node as well.",
                    "4. Update the HEAD pointer to point to the new node.",
                    "5. Increment length of the list."
                ],
                pseudocode: `function insertBeginning(value):\n    newNode = allocate Node(value)\n    if head is NULL:\n        head = newNode\n        tail = newNode\n    else:\n        newNode.next = head\n        head = newNode\n    length = length + 1`,
                javascript: `insertBeginning(value) {\n    const newNode = new SinglyNode(value);\n    if (!this.head) {\n        this.head = newNode;\n        this.tail = newNode;\n    } else {\n        newNode.next = this.head;\n        this.head = newNode;\n    }\n    this.length++;\n}`,
                c: `void insertBeginning(Node** head_ref, Node** tail_ref, int value) {\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = *head_ref;\n    *head_ref = newNode;\n    if (*tail_ref == NULL) *tail_ref = newNode;\n}`,
                cpp: `void insertBeginning(int value) {\n    Node* newNode = new Node(value);\n    newNode->next = head;\n    head = newNode;\n    if (!tail) tail = newNode;\n    length++;\n}`,
                python: `def insert_beginning(self, value):\n    new_node = Node(value)\n    if not self.head:\n        self.head = new_node\n        self.tail = new_node\n    else:\n        new_node.next = self.head\n        self.head = new_node\n    self.length += 1`
            },
            insertEnd: {
                steps: [
                    "1. Allocate memory for new node with next = null.",
                    "2. If list is empty, assign both HEAD and TAIL to new node.",
                    "3. Otherwise, set tail.next to point to new node.",
                    "4. Update TAIL to point to the new node.",
                    "5. Increment list length."
                ],
                pseudocode: `function insertEnd(value):\n    newNode = allocate Node(value, next=NULL)\n    if head is NULL:\n        head = newNode\n        tail = newNode\n    else:\n        tail.next = newNode\n        tail = newNode\n    length = length + 1`,
                javascript: `insertEnd(value) {\n    const newNode = new SinglyNode(value);\n    if (!this.head) {\n        this.head = newNode;\n        this.tail = newNode;\n    } else {\n        this.tail.next = newNode;\n        this.tail = newNode;\n    }\n    this.length++;\n}`,
                c: `void insertEnd(Node** head_ref, Node** tail_ref, int value) {\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    newNode->next = NULL;\n    if (*head_ref == NULL) {\n        *head_ref = newNode;\n        *tail_ref = newNode;\n    } else {\n        (*tail_ref)->next = newNode;\n        *tail_ref = newNode;\n    }\n}`,
                cpp: `void insertEnd(int value) {\n    Node* newNode = new Node(value);\n    if (!head) {\n        head = tail = newNode;\n    } else {\n        tail->next = newNode;\n        tail = newNode;\n    }\n    length++;\n}`,
                python: `def insert_end(self, value):\n    new_node = Node(value)\n    if not self.head:\n        self.head = self.tail = new_node\n    else:\n        self.tail.next = new_node\n        self.tail = new_node\n    self.length += 1`
            },
            deleteBeginning: {
                steps: [
                    "1. Check if list is empty (head is null); return null/error if true.",
                    "2. Store temporary pointer to current HEAD node.",
                    "3. Advance HEAD pointer to head.next.",
                    "4. If list becomes empty, set TAIL to null.",
                    "5. Free memory of old head and decrement length."
                ],
                pseudocode: `function deleteBeginning():\n    if head is NULL: return NULL\n    temp = head\n    head = head.next\n    if head is NULL: tail = NULL\n    free temp\n    length = length - 1`,
                javascript: `deleteBeginning() {\n    if (!this.head) return null;\n    const removed = this.head;\n    this.head = this.head.next;\n    this.length--;\n    if (this.length === 0) this.tail = null;\n    return removed;\n}`,
                c: `int deleteBeginning(Node** head_ref, Node** tail_ref) {\n    if (*head_ref == NULL) return -1;\n    Node* temp = *head_ref;\n    int val = temp->data;\n    *head_ref = (*head_ref)->next;\n    if (*head_ref == NULL) *tail_ref = NULL;\n    free(temp);\n    return val;\n}`,
                cpp: `int deleteBeginning() {\n    if (!head) throw runtime_error("Empty list");\n    Node* temp = head;\n    int val = temp->data;\n    head = head->next;\n    delete temp;\n    length--;\n    if (length == 0) tail = nullptr;\n    return val;\n}`,
                python: `def delete_beginning(self):\n    if not self.head: return None\n    val = self.head.value\n    self.head = self.head.next\n    self.length -= 1\n    if self.length == 0: self.tail = None\n    return val`
            },
            deleteEnd: {
                steps: [
                    "1. Check if list is empty; return null if so.",
                    "2. If list has only 1 node, delete it and set HEAD & TAIL to null.",
                    "3. Otherwise, traverse from HEAD to find the second-to-last node (node whose next is TAIL).",
                    "4. Set second-to-last node's next to NULL.",
                    "5. Update TAIL to point to this second-to-last node and free old tail."
                ],
                pseudocode: `function deleteEnd():\n    if head is NULL: return NULL\n    if head == tail:\n        free head; head = tail = NULL\n    else:\n        curr = head\n        while curr.next != tail:\n            curr = curr.next\n        free tail\n        curr.next = NULL\n        tail = curr\n    length = length - 1`,
                javascript: `deleteEnd() {\n    if (!this.head) return null;\n    if (this.head === this.tail) {\n        const rem = this.head;\n        this.head = this.tail = null;\n        this.length = 0;\n        return rem;\n    }\n    let curr = this.head;\n    while (curr.next !== this.tail) {\n        curr = curr.next;\n    }\n    const rem = this.tail;\n    curr.next = null;\n    this.tail = curr;\n    this.length--;\n    return rem;\n}`,
                c: `int deleteEnd(Node** head_ref, Node** tail_ref) {\n    if (*head_ref == NULL) return -1;\n    if (*head_ref == *tail_ref) {\n        int v = (*head_ref)->data;\n        free(*head_ref);\n        *head_ref = *tail_ref = NULL;\n        return v;\n    }\n    Node* curr = *head_ref;\n    while (curr->next != *tail_ref) curr = curr->next;\n    int v = (*tail_ref)->data;\n    free(*tail_ref);\n    curr->next = NULL;\n    *tail_ref = curr;\n    return v;\n}`,
                cpp: `int deleteEnd() {\n    if (!head) throw runtime_error("Empty");\n    if (head == tail) {\n        int v = head->data;\n        delete head;\n        head = tail = nullptr;\n        length = 0;\n        return v;\n    }\n    Node* curr = head;\n    while (curr->next != tail) curr = curr->next;\n    int v = tail->data;\n    delete tail;\n    curr->next = nullptr;\n    tail = curr;\n    length--;\n    return v;\n}`,
                python: `def delete_end(self):\n    if not self.head: return None\n    if self.head == self.tail:\n        v = self.head.value\n        self.head = self.tail = None\n        self.length = 0\n        return v\n    curr = self.head\n    while curr.next != self.tail:\n        curr = curr.next\n    v = self.tail.value\n    curr.next = None\n    self.tail = curr\n    self.length -= 1\n    return v`
            },
            reverse: {
                steps: [
                    "1. Initialize three pointers: prev = NULL, curr = HEAD, next = NULL.",
                    "2. Loop while curr is not NULL:",
                    "   a. Store next = curr.next",
                    "   b. Reverse pointer: curr.next = prev",
                    "   c. Move prev forward: prev = curr",
                    "   d. Move curr forward: curr = next",
                    "3. Set TAIL = former HEAD, and HEAD = prev."
                ],
                pseudocode: `function reverse():\n    prev = NULL\n    curr = head\n    tail = head\n    while curr != NULL:\n        next = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next\n    head = prev`,
                javascript: `reverse() {\n    let prev = null, curr = this.head, next = null;\n    this.tail = this.head;\n    while (curr) {\n        next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    this.head = prev;\n}`,
                c: `void reverse(Node** head_ref, Node** tail_ref) {\n    Node *prev = NULL, *curr = *head_ref, *next = NULL;\n    *tail_ref = *head_ref;\n    while (curr != NULL) {\n        next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    *head_ref = prev;\n}`,
                cpp: `void reverse() {\n    Node* prev = nullptr;\n    Node* curr = head;\n    tail = head;\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    head = prev;\n}`,
                python: `def reverse(self):\n    prev = None\n    curr = self.head\n    self.tail = self.head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    self.head = prev`
            }
        },
        doubly: {
            insertBeginning: {
                steps: [
                    "1. Create newNode with data, prev = NULL, next = NULL.",
                    "2. If empty list, head = tail = newNode.",
                    "3. Otherwise, newNode.next = head, head.prev = newNode, head = newNode.",
                    "4. Increment length."
                ],
                pseudocode: `function insertBeginning(value):\n    newNode = allocate DoublyNode(value)\n    if head is NULL:\n        head = tail = newNode\n    else:\n        newNode.next = head\n        head.prev = newNode\n        head = newNode\n    length = length + 1`,
                javascript: `insertBeginning(value) {\n    const newNode = new DoublyNode(value);\n    if (!this.head) {\n        this.head = this.tail = newNode;\n    } else {\n        newNode.next = this.head;\n        this.head.prev = newNode;\n        this.head = newNode;\n    }\n    this.length++;\n}`,
                c: `void insertBeginning(DNode** head_ref, DNode** tail_ref, int value) {\n    DNode* newNode = (DNode*)malloc(sizeof(DNode));\n    newNode->data = value;\n    newNode->prev = NULL;\n    newNode->next = *head_ref;\n    if (*head_ref != NULL) (*head_ref)->prev = newNode;\n    else *tail_ref = newNode;\n    *head_ref = newNode;\n}`,
                cpp: `void insertBeginning(int value) {\n    DNode* newNode = new DNode(value);\n    newNode->next = head;\n    if (head) head->prev = newNode;\n    else tail = newNode;\n    head = newNode;\n    length++;\n}`,
                python: `def insert_beginning(self, value):\n    new_node = DNode(value)\n    if not self.head:\n        self.head = self.tail = new_node\n    else:\n        new_node.next = self.head\n        self.head.prev = new_node\n        self.head = new_node\n    self.length += 1`
            },
            deleteEnd: {
                steps: [
                    "1. Check if list is empty.",
                    "2. If head == tail, free node and set head = tail = null.",
                    "3. Otherwise, set tail = tail.prev, tail.next = null.",
                    "4. O(1) time complexity because tail node has direct prev pointer!"
                ],
                pseudocode: `function deleteEnd():\n    if head is NULL: return NULL\n    if head == tail:\n        free tail; head = tail = NULL\n    else:\n        tail = tail.prev\n        free tail.next\n        tail.next = NULL\n    length = length - 1`,
                javascript: `deleteEnd() {\n    if (!this.head) return null;\n    const rem = this.tail;\n    if (this.head === this.tail) {\n        this.head = this.tail = null;\n    } else {\n        this.tail = this.tail.prev;\n        this.tail.next = null;\n    }\n    this.length--;\n    return rem;\n}`,
                c: `int deleteEnd(DNode** head_ref, DNode** tail_ref) {\n    if (*tail_ref == NULL) return -1;\n    DNode* temp = *tail_ref;\n    int val = temp->data;\n    if (*head_ref == *tail_ref) {\n        *head_ref = *tail_ref = NULL;\n    } else {\n        *tail_ref = (*tail_ref)->prev;\n        (*tail_ref)->next = NULL;\n    }\n    free(temp);\n    return val;\n}`,
                cpp: `int deleteEnd() {\n    if (!tail) throw runtime_error("Empty");\n    DNode* temp = tail;\n    int val = temp->data;\n    if (head == tail) {\n        head = tail = nullptr;\n    } else {\n        tail = tail->prev;\n        tail->next = nullptr;\n    }\n    delete temp;\n    length--;\n    return val;\n}`,
                python: `def delete_end(self):\n    if not self.tail: return None\n    val = self.tail.value\n    if self.head == self.tail:\n        self.head = self.tail = None\n    else:\n        self.tail = self.tail.prev\n        self.tail.next = None\n    self.length -= 1\n    return val`
            }
        },
        circularSingly: {
            insertBeginning: {
                steps: [
                    "1. Allocate newNode(value).",
                    "2. If empty: newNode.next = newNode; head = tail = newNode.",
                    "3. Otherwise: newNode.next = head; tail.next = newNode; head = newNode.",
                    "4. Notice tail.next always points back to HEAD to keep circle intact."
                ],
                pseudocode: `function insertBeginning(value):\n    newNode = allocate Node(value)\n    if head is NULL:\n        newNode.next = newNode\n        head = tail = newNode\n    else:\n        newNode.next = head\n        tail.next = newNode\n        head = newNode\n    length = length + 1`,
                javascript: `insertBeginning(value) {\n    const newNode = new SinglyNode(value);\n    if (!this.head) {\n        newNode.next = newNode;\n        this.head = this.tail = newNode;\n    } else {\n        newNode.next = this.head;\n        this.tail.next = newNode;\n        this.head = newNode;\n    }\n    this.length++;\n}`,
                c: `void insertBeginning(Node** head_ref, Node** tail_ref, int value) {\n    Node* newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = value;\n    if (*head_ref == NULL) {\n        newNode->next = newNode;\n        *head_ref = *tail_ref = newNode;\n    } else {\n        newNode->next = *head_ref;\n        (*tail_ref)->next = newNode;\n        *head_ref = newNode;\n    }\n}`,
                cpp: `void insertBeginning(int value) {\n    Node* newNode = new Node(value);\n    if (!head) {\n        newNode->next = newNode;\n        head = tail = newNode;\n    } else {\n        newNode->next = head;\n        tail->next = newNode;\n        head = newNode;\n    }\n    length++;\n}`,
                python: `def insert_beginning(self, value):\n    new_node = Node(value)\n    if not self.head:\n        new_node.next = new_node\n        self.head = self.tail = new_node\n    else:\n        new_node.next = self.head\n        self.tail.next = new_node\n        self.head = new_node\n    self.length += 1`
            }
        },
        circularDoubly: {
            insertBeginning: {
                steps: [
                    "1. Allocate newNode(value).",
                    "2. If empty: newNode.next = newNode, newNode.prev = newNode, head = tail = newNode.",
                    "3. Otherwise: newNode.next = head, newNode.prev = tail, head.prev = newNode, tail.next = newNode, head = newNode.",
                    "4. Both directions are closed loops in O(1) time."
                ],
                pseudocode: `function insertBeginning(value):\n    newNode = allocate DNode(value)\n    if head is NULL:\n        newNode.next = newNode; newNode.prev = newNode\n        head = tail = newNode\n    else:\n        newNode.next = head\n        newNode.prev = tail\n        head.prev = newNode\n        tail.next = newNode\n        head = newNode\n    length = length + 1`,
                javascript: `insertBeginning(value) {\n    const newNode = new DoublyNode(value);\n    if (!this.head) {\n        newNode.next = newNode.prev = newNode;\n        this.head = this.tail = newNode;\n    } else {\n        newNode.next = this.head;\n        newNode.prev = this.tail;\n        this.head.prev = newNode;\n        this.tail.next = newNode;\n        this.head = newNode;\n    }\n    this.length++;\n}`,
                c: `void insertBeginning(DNode** head_ref, DNode** tail_ref, int value) {\n    DNode* newNode = (DNode*)malloc(sizeof(DNode));\n    newNode->data = value;\n    if (*head_ref == NULL) {\n        newNode->next = newNode->prev = newNode;\n        *head_ref = *tail_ref = newNode;\n    } else {\n        newNode->next = *head_ref;\n        newNode->prev = *tail_ref;\n        (*head_ref)->prev = newNode;\n        (*tail_ref)->next = newNode;\n        *head_ref = newNode;\n    }\n}`,
                cpp: `void insertBeginning(int value) {\n    DNode* newNode = new DNode(value);\n    if (!head) {\n        newNode->next = newNode->prev = newNode;\n        head = tail = newNode;\n    } else {\n        newNode->next = head;\n        newNode->prev = tail;\n        head->prev = newNode;\n        tail->next = newNode;\n        head = newNode;\n    }\n    length++;\n}`,
                python: `def insert_beginning(self, value):\n    new_node = DNode(value)\n    if not self.head:\n        new_node.next = new_node.prev = new_node\n        self.head = self.tail = new_node\n    else:\n        new_node.next = self.head\n        new_node.prev = self.tail\n        self.head.prev = new_node\n        self.tail.next = new_node\n        self.head = new_node\n    self.length += 1`
            }
        }
    };

    // ==========================================
    // 3. QUIZ QUESTION BANK (20 Questions across 3 Difficulties)
    // ==========================================
    const QUIZ_QUESTIONS = [
        {
            id: 1,
            difficulty: 'beginner',
            type: 'mcq',
            question: 'What is the primary advantage of a Linked List over a contiguous Array?',
            options: [
                'Faster random access via index in O(1)',
                'Dynamic size allocation and efficient O(1) insertions/deletions at the head',
                'Less memory overhead per element',
                'Automatic cache prefetching by the CPU'
            ],
            answer: 1,
            explanation: 'Linked lists allow nodes to be allocated individually on the heap, making head insertions O(1) and sizing fully dynamic without requiring array resizing or contiguous memory blocks.'
        },
        {
            id: 2,
            difficulty: 'beginner',
            type: 'true_false',
            question: 'In a standard Singly Linked List, inserting a node at the head (beginning) takes O(1) time.',
            options: ['True', 'False'],
            answer: 0,
            explanation: 'True! Only a constant number of pointer assignments (newNode.next = head, head = newNode) are required regardless of list size.'
        },
        {
            id: 3,
            difficulty: 'beginner',
            type: 'mcq',
            question: 'What does the next pointer of the last node in a standard Singly Linked List point to?',
            options: ['The HEAD node', 'NULL (or None/nullptr)', 'The node itself', 'Undefined memory address'],
            answer: 1,
            explanation: 'In a linear Singly Linked List, the tail node marks the end of the chain by pointing to NULL.'
        },
        {
            id: 4,
            difficulty: 'beginner',
            type: 'predict_output',
            question: 'Given list 10 -> 20 -> 30, what is the resulting list after performing insertBeginning(5)?',
            options: ['10 -> 20 -> 30 -> 5', '5 -> 10 -> 20 -> 30', '10 -> 5 -> 20 -> 30', '5 -> 5 -> 5'],
            answer: 1,
            explanation: 'Inserting 5 at the beginning places 5 before the existing head 10, resulting in 5 -> 10 -> 20 -> 30.'
        },
        {
            id: 5,
            difficulty: 'beginner',
            type: 'find_bug',
            question: 'Identify the bug in this Singly Linked List head insertion:\n\nvoid insertHead(int val) {\n    Node* n = new Node(val);\n    head = n;\n    n->next = head;\n}',
            options: [
                'Memory allocation failed',
                'Setting head = n before n->next creates an infinite circular loop to itself and loses the rest of the list',
                'Node data is not assigned',
                'head should be set to nullptr'
            ],
            answer: 1,
            explanation: 'Because `head` was overwritten before `n->next` was set to the former head, `n->next = head` points `n` back to itself, causing a memory leak of all existing nodes and a 1-node infinite loop!'
        },
        {
            id: 6,
            difficulty: 'intermediate',
            type: 'mcq',
            question: 'Why does deleting the last node (deleteEnd) take O(n) in a Singly Linked List even when a TAIL pointer is maintained?',
            options: [
                'Because the tail pointer cannot be dereferenced',
                'Because finding the second-to-last node requires traversing from the HEAD',
                'Because memory freeing takes O(n)',
                'Because Singly Linked Lists cannot store more than 100 elements'
            ],
            answer: 1,
            explanation: 'To update the tail pointer, we must find the node immediately preceding the tail. Since Singly Linked Lists do not have backward (prev) pointers, we must traverse from HEAD to find `curr` where `curr.next == tail`.'
        },
        {
            id: 7,
            difficulty: 'intermediate',
            type: 'pointer_tracing',
            question: 'In a Doubly Linked List with nodes [A <-> B <-> C], what happens if we execute: B.prev.next = B.next and B.next.prev = B.prev?',
            options: [
                'Node A is deleted',
                'Node B is bypassed and unlinked from the list',
                'Node C is reversed',
                'A circular loop between A and B is formed'
            ],
            answer: 1,
            explanation: 'Setting A.next = C and C.prev = A completely bypasses node B, which effectively removes B from the Doubly Linked List in O(1) time.'
        },
        {
            id: 8,
            difficulty: 'intermediate',
            type: 'true_false',
            question: 'In a Circular Singly Linked List, the tail node\'s next pointer points to NULL.',
            options: ['True', 'False'],
            answer: 1,
            explanation: 'False! In a Circular Singly Linked List, tail.next points back to the HEAD node, forming an unbroken cycle.'
        },
        {
            id: 9,
            difficulty: 'intermediate',
            type: 'mcq',
            question: 'What is the time complexity of deleteEnd in a Doubly Linked List with a maintained TAIL pointer?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
            answer: 2,
            explanation: 'O(1)! Because the tail node has a direct `prev` pointer (`tail = tail.prev; tail.next = null;`), no traversal is required.'
        },
        {
            id: 10,
            difficulty: 'intermediate',
            type: 'predict_output',
            question: 'List is 1 <-> 2 <-> 3 <-> 4. If we delete node at index 2 (0-indexed), what is the resulting sequence?',
            options: ['1 <-> 2 <-> 4', '1 <-> 3 <-> 4', '2 <-> 3 <-> 4', '1 <-> 2 <-> 3'],
            answer: 0,
            explanation: 'Index 0 is 1, index 1 is 2, and index 2 is 3. Deleting node at index 2 leaves 1 <-> 2 <-> 4.'
        },
        {
            id: 11,
            difficulty: 'intermediate',
            type: 'find_bug',
            question: 'What bug occurs if a standard `while(curr != null)` loop is used to traverse a Circular Linked List?',
            options: [
                'Null pointer exception immediately',
                'Infinite loop because curr will never become NULL',
                'Array index out of bounds',
                'Stack overflow exception'
            ],
            answer: 1,
            explanation: 'Since the circular list links tail back to head, `curr` will never equal `null`, causing an infinite loop. Circular lists require `do { ... } while (curr != head);` or a counter.'
        },
        {
            id: 12,
            difficulty: 'intermediate',
            type: 'mcq',
            question: 'How much memory overhead does a 64-bit Doubly Linked List node incur compared to a Singly Linked List node?',
            options: [
                'No extra memory',
                '1 additional pointer (8 bytes on 64-bit architecture) for prev',
                'Double the data payload',
                '16 extra bytes for cache alignment'
            ],
            answer: 1,
            explanation: 'Each Doubly Linked List node stores two pointers (`prev` and `next`) instead of just one (`next`), which requires 8 extra bytes on standard 64-bit architectures.'
        },
        {
            id: 13,
            difficulty: 'intermediate',
            type: 'true_false',
            question: 'In a Circular Doubly Linked List with a single node, that node\'s next and prev pointers both point to itself.',
            options: ['True', 'False'],
            answer: 0,
            explanation: 'True! In a single-node CDLL, `head.next == head` and `head.prev == head`.'
        },
        {
            id: 14,
            difficulty: 'advanced',
            type: 'mcq',
            question: 'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at speeds 1 and 2. What are its time and auxiliary space complexities?',
            options: [
                'Time: O(n), Space: O(1)',
                'Time: O(n log n), Space: O(n)',
                'Time: O(n^2), Space: O(1)',
                'Time: O(1), Space: O(n)'
            ],
            answer: 0,
            explanation: 'The fast pointer gains 1 step on the slow pointer in each iteration. They meet within one loop traversal in O(n) time and O(1) auxiliary space without hash sets.'
        },
        {
            id: 15,
            difficulty: 'advanced',
            type: 'pointer_tracing',
            question: 'Given SLL: 1 -> 2 -> 3 -> 4. What is the value of slow pointer when fast reaches NULL using fast = fast.next.next and slow = slow.next?',
            options: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
            answer: 2,
            explanation: 'Initial: slow=1, fast=1. Step 1: slow=2, fast=3. Step 2: slow=3, fast=null. When fast is null, slow is at Node 3 (the middle/second-half start).'
        },
        {
            id: 16,
            difficulty: 'advanced',
            type: 'mcq',
            question: 'In C/C++, what catastrophic error occurs if a node is unlinked from a Linked List without calling `free()` or `delete`?',
            options: [
                'Segmentation Fault',
                'Memory Leak',
                'Buffer Overflow',
                'Stack Overflow'
            ],
            answer: 1,
            explanation: 'Heap memory remains allocated in the process heap without any active pointers referencing it, resulting in a memory leak.'
        },
        {
            id: 17,
            difficulty: 'advanced',
            type: 'predict_output',
            question: 'We reverse list 10 -> 20 -> 30. During the second iteration, what does node 20\'s next pointer point to?',
            options: ['Node 30', 'Node 10', 'NULL', 'HEAD'],
            answer: 1,
            explanation: 'During reversal of node 20, its `next` pointer is updated to point to `prev`, which was set to node 10 during the first step.'
        },
        {
            id: 18,
            difficulty: 'advanced',
            type: 'find_bug',
            question: 'Consider deleting node `curr` in Doubly Linked List:\ncurr->prev->next = curr->next;\ncurr->next->prev = curr->prev;\nWhat edge case causes a crash with this code?',
            options: [
                'Deleting the middle node',
                'Deleting the HEAD (curr->prev is null) or TAIL (curr->next is null)',
                'Deleting when list has 5 nodes',
                'Updating node data'
            ],
            answer: 1,
            explanation: 'If `curr` is the HEAD node, `curr->prev` is NULL, so dereferencing `curr->prev->next` causes a null pointer crash. Similarly, deleting TAIL dereferences `curr->next->prev`.'
        },
        {
            id: 19,
            difficulty: 'advanced',
            type: 'mcq',
            question: 'Which real-world application is best modeled by a Circular Doubly Linked List?',
            options: [
                'Call stack execution frames in recursion',
                'Operating system round-robin process scheduler with bidirectional task cycling',
                'Binary search tree indexing',
                'LIFO compiler syntax checker'
            ],
            answer: 1,
            explanation: 'An OS process scheduler rotating continuously through tasks in both directions, or a media player looping playlists seamlessly backward and forward, is ideally modeled by a CDLL.'
        },
        {
            id: 20,
            difficulty: 'advanced',
            type: 'true_false',
            question: 'Can two sorted singly linked lists with lengths m and n be merged into a single sorted list in O(m + n) time and O(1) auxiliary space?',
            options: ['True', 'False'],
            answer: 0,
            explanation: 'True! By simply adjusting existing pointers (splicing nodes) with a dummy head node, no extra nodes need to be allocated, achieving O(1) auxiliary space.'
        }
    ];

    // ==========================================
    // 4. PRACTICE CHALLENGES (6 Real Tasks)
    // ==========================================
    const CHALLENGES = [
        {
            id: 'chal-1',
            title: 'Challenge 1: Insert at Position 3',
            difficulty: 'Beginner',
            listType: 'singly',
            initialValues: [10, 20, 30, 40, 50],
            targetAction: 'Insert value 99 at index 3',
            instructions: 'Use the interactive controls to insert value 99 at index 3 in the Singly Linked List.',
            expectedArray: [10, 20, 30, 99, 40, 50],
            hints: [
                'Index 3 means the 4th element (0-indexed: 0, 1, 2, 3).',
                'Select "Insert at Position", enter Value: 99 and Position: 3, then click Execute.',
                'Check that 99 appears between 30 and 40.'
            ],
            solutionExplanation: 'Inserting at index 3 requires traversing to index 2 (node 30), setting newNode.next = 40, and setting 30.next = newNode.'
        },
        {
            id: 'chal-2',
            title: 'Challenge 2: Delete a Specified Value',
            difficulty: 'Beginner',
            listType: 'singly',
            initialValues: [5, 12, 99, 25, 40],
            targetAction: 'Delete node with value 99',
            instructions: 'Find the node with value 99 (at index 2) and delete it from the list.',
            expectedArray: [5, 12, 25, 40],
            hints: [
                'First observe which index contains 99 (it is index 2).',
                'Select "Delete at Position" with Position = 2, or delete the specific position.',
                'After deletion, the list should contain [5, 12, 25, 40].'
            ],
            solutionExplanation: 'To delete node 99 at index 2, predecessor node 12 (index 1) has its next pointer set to node 25 (index 3), effectively bypassing 99.'
        },
        {
            id: 'chal-3',
            title: 'Challenge 3: Reverse a Singly Linked List',
            difficulty: 'Intermediate',
            listType: 'singly',
            initialValues: [1, 2, 3, 4, 5],
            targetAction: 'Reverse the entire list',
            instructions: 'Reverse the list so that the values become [5, 4, 3, 2, 1].',
            expectedArray: [5, 4, 3, 2, 1],
            hints: [
                'In reversal, every node\'s next pointer must point to its former predecessor.',
                'Click the "Reverse List" button in the simulator.',
                'Observe how HEAD and TAIL swap places.'
            ],
            solutionExplanation: 'Classic three-pointer reversal (prev, curr, next) inverts every link in O(n) time and O(1) space.'
        },
        {
            id: 'chal-4',
            title: 'Challenge 4: Find the Middle Node',
            difficulty: 'Intermediate',
            listType: 'singly',
            initialValues: [10, 20, 30, 40, 50],
            targetAction: 'Identify the middle node (value 30)',
            instructions: 'In this 5-node list, use two pointers (Tortoise and Hare) to determine the middle node.',
            expectedValue: 30,
            hints: [
                'Slow pointer moves 1 step per cycle; Fast pointer moves 2 steps.',
                'When fast reaches the last node (50), slow is exactly at index 2 (value 30).',
                'Search for value 30 or inspect index 2.'
            ],
            solutionExplanation: 'Floyd\'s slow-fast pointer method reaches the midpoint in n/2 iterations without counting the list length beforehand.'
        },
        {
            id: 'chal-5',
            title: 'Challenge 5: Verify Circular List Linkage',
            difficulty: 'Intermediate',
            listType: 'circular-singly',
            initialValues: [100, 200, 300],
            targetAction: 'Insert 400 at end and verify tail loops to head',
            instructions: 'In Circular Singly Linked List, insert 400 at the end. Verify tail.next links back to 100.',
            expectedArray: [100, 200, 300, 400],
            hints: [
                'Use "Insert End" with value 400.',
                'Notice that the circular loopback arrow now originates from 400 and loops back to 100.',
                'The list length becomes 4 and tail.next == head.'
            ],
            solutionExplanation: 'In CSLL, whenever a node is appended, tail.next is updated to head so that traversing past the tail cycles back to the start.'
        },
        {
            id: 'chal-6',
            title: 'Challenge 6: Doubly Linked List Two-Way Deletion',
            difficulty: 'Advanced',
            listType: 'doubly',
            initialValues: [15, 25, 35, 45],
            targetAction: 'Delete from end in O(1)',
            instructions: 'Delete the tail node (45) from the Doubly Linked List. Verify tail moves to 35 with next = NULL.',
            expectedArray: [15, 25, 35],
            hints: [
                'In Doubly Linked List, tail has a direct prev pointer to 35.',
                'Click "Delete End".',
                'Notice that no head traversal was required!'
            ],
            solutionExplanation: 'Because DLL maintains tail.prev, deleteEnd operates strictly in O(1) time.'
        },
        {
            id: 'chal-7',
            title: 'Challenge 7: Detect a Cycle',
            difficulty: 'Advanced',
            listType: 'circular-singly',
            initialValues: [5, 10, 15, 20],
            targetAction: 'Detect the cycle with slow and fast pointers',
            expectedCycle: true,
            hints: [
                'Start slow and fast pointers at HEAD.',
                'Move slow by one NEXT link and fast by two NEXT links.',
                'If they meet, the structure contains a cycle.'
            ],
            solutionExplanation: 'Floyd’s tortoise-and-hare algorithm detects this cycle in O(n) time and O(1) auxiliary space.'
        },
        {
            id: 'chal-8',
            title: 'Challenge 8: Merge Two Sorted Lists',
            difficulty: 'Advanced',
            listType: 'singly',
            initialValues: [1, 3, 5],
            secondValues: [2, 4, 6],
            targetAction: 'Merge [1, 3, 5] and [2, 4, 6] in sorted order',
            expectedArray: [1, 2, 3, 4, 5, 6],
            hints: [
                'Compare the current node from each list.',
                'Append the smaller node, then advance only that list.',
                'When one input ends, attach the other list remainder.'
            ],
            solutionExplanation: 'Merging by relinking existing nodes takes O(m + n) time and O(1) auxiliary space.'
        }
    ];

    // ==========================================
    // 5. STORAGE & PROGRESS MANAGEMENT
    // ==========================================
    const STORAGE_KEY = 'dsap_linked_list_simulator_progress';

    function loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved && typeof saved === 'object') {
                    return {
                        completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
                        quizzesCompleted: Number(saved.quizzesCompleted) || 0,
                        quizCorrectAnswers: Number(saved.quizCorrectAnswers) || 0,
                        quizHighScores: saved.quizHighScores && typeof saved.quizHighScores === 'object' ? saved.quizHighScores : {},
                        challengesSolved: Array.isArray(saved.challengesSolved) ? saved.challengesSolved : [],
                        operationsExecuted: Number(saved.operationsExecuted) || 0,
                        lastActivity: saved.lastActivity || new Date().toISOString()
                    };
                }
                console.warn('Stored learning progress has an invalid format; starting with empty progress.');
            }
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
        }
        return {
            completedLessons: [],
            quizzesCompleted: 0,
            quizCorrectAnswers: 0,
            quizHighScores: {},
            challengesSolved: [],
            operationsExecuted: 0,
            lastActivity: new Date().toISOString()
        };
    }

    function saveProgress(data) {
        try {
            data.lastActivity = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not write to localStorage:', e);
        }
    }

    function resetProgress() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
    }

    // ==========================================
    // 6. VISUALIZER & SVG RENDERER
    // ==========================================
    class LinkedListVisualizer {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
        }

        render(snapshot, options = {}) {
            if (!this.container) return;

            const {
                highlightUid = null,
                action = null, // 'delete', 'updated', etc.
                activePointer = null, // { from, to, dir }
                status = null,
                inspectCallback = null
            } = options;

            const nodes = snapshot.nodes || [];
            const isCircular = snapshot.type.startsWith('circular');
            const isDoubly = snapshot.type.includes('doubly');

            if (nodes.length === 0) {
                this.container.innerHTML = `
                    <div class="empty-list-visual">
                        <div class="empty-icon">⛓️</div>
                        <h4>List is Currently Empty</h4>
                        <p>HEAD = NULL &nbsp;|&nbsp; TAIL = NULL &nbsp;|&nbsp; Length = 0</p>
                        <span class="empty-hint">Use the operations panel below to insert nodes into this list!</span>
                    </div>
                `;
                return;
            }

            // Dimensions for SVG layout
            const nodeWidth = isDoubly ? 150 : 120;
            const nodeHeight = 64;
            const gap = 60;
            const startX = 40;
            const startY = 80;

            const totalWidth = Math.max(900, startX + nodes.length * (nodeWidth + gap) + 120);
            const totalHeight = isCircular ? 240 : 180;

            let svgHtml = `
                <svg class="ll-svg" width="100%" height="100%" viewBox="0 0 ${totalWidth} ${totalHeight}" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Forward Arrow Marker -->
                        <marker id="arrow-next" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
                        </marker>
                        <!-- Backward Arrow Marker -->
                        <marker id="arrow-prev" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7c3aed" />
                        </marker>
                        <!-- Loopback Arrow Marker -->
                        <marker id="arrow-loop" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
                        </marker>
                        <!-- Loopback Prev Marker -->
                        <marker id="arrow-loop-prev" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706" />
                        </marker>
                    </defs>
            `;

            // Node coordinates cache
            const coords = {};
            nodes.forEach((n, idx) => {
                const x = startX + idx * (nodeWidth + gap);
                const y = startY;
                coords[n.uid] = { x, y, index: idx, node: n };
            });

            // 1. Render Links / Connectors between sequential nodes
            for (let i = 0; i < nodes.length - 1; i++) {
                const curr = coords[nodes[i].uid];
                const next = coords[nodes[i + 1].uid];

                if (isDoubly) {
                    // Forward Next Arrow (upper)
                    const yFwd = curr.y + nodeHeight * 0.35;
                    const xStartFwd = curr.x + nodeWidth;
                    const xEndFwd = next.x;

                    svgHtml += `
                        <g class="arrow-group">
                            <line x1="${xStartFwd}" y1="${yFwd}" x2="${xEndFwd}" y2="${yFwd}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-next)" />
                            <text x="${(xStartFwd + xEndFwd) / 2}" y="${yFwd - 5}" font-size="10" fill="#2563eb" text-anchor="middle" font-weight="600">next</text>
                        </g>
                    `;

                    // Backward Prev Arrow (lower)
                    const yBwd = curr.y + nodeHeight * 0.72;
                    const xStartBwd = next.x;
                    const xEndBwd = curr.x + nodeWidth;

                    svgHtml += `
                        <g class="arrow-group">
                            <line x1="${xStartBwd}" y1="${yBwd}" x2="${xEndBwd}" y2="${yBwd}" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#arrow-prev)" />
                            <text x="${(xStartBwd + xEndBwd) / 2}" y="${yBwd + 13}" font-size="10" fill="#7c3aed" text-anchor="middle" font-weight="600">prev</text>
                        </g>
                    `;
                } else {
                    // Single Forward Arrow for SLL
                    const yMid = curr.y + nodeHeight / 2;
                    const xStart = curr.x + nodeWidth;
                    const xEnd = next.x;

                    svgHtml += `
                        <g class="arrow-group">
                            <line x1="${xStart}" y1="${yMid}" x2="${xEnd}" y2="${yMid}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-next)" />
                            <text x="${(xStart + xEnd) / 2}" y="${yMid - 6}" font-size="10" fill="#2563eb" text-anchor="middle" font-weight="600">next</text>
                        </g>
                    `;
                }
            }

            // 2. Render NULL terminator for non-circular lists
            if (!isCircular && nodes.length > 0) {
                const lastNode = coords[nodes[nodes.length - 1].uid];
                const xNull = lastNode.x + nodeWidth + 30;
                const yNull = lastNode.y + nodeHeight / 2;

                svgHtml += `
                    <g class="null-terminator">
                        <line x1="${lastNode.x + nodeWidth}" y1="${yNull}" x2="${xNull - 5}" y2="${yNull}" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow-next)" />
                        <rect x="${xNull}" y="${yNull - 14}" width="54" height="28" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
                        <text x="${xNull + 27}" y="${yNull + 4}" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">NULL</text>
                    </g>
                `;

                if (isDoubly) {
                    const firstNode = coords[nodes[0].uid];
                    const xNullPrev = firstNode.x - 70;
                    const yNullPrev = firstNode.y + nodeHeight * 0.72;

                    svgHtml += `
                        <g class="null-terminator">
                            <line x1="${firstNode.x}" y1="${yNullPrev}" x2="${xNullPrev + 59}" y2="${yNullPrev}" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow-prev)" />
                            <rect x="${xNullPrev}" y="${yNullPrev - 14}" width="54" height="28" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
                            <text x="${xNullPrev + 27}" y="${yNullPrev + 4}" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">NULL</text>
                        </g>
                    `;
                }
            }

            // 3. Render Circular Loopback Arrows
            if (isCircular && nodes.length > 0) {
                const firstNode = coords[nodes[0].uid];
                const lastNode = coords[nodes[nodes.length - 1].uid];

                if (nodes.length === 1) {
                    // Single node circular self-loop
                    const cx = firstNode.x + nodeWidth / 2;
                    const cy = firstNode.y + nodeHeight;
                    svgHtml += `
                        <g class="circular-loop">
                            <path d="M ${firstNode.x + nodeWidth * 0.75} ${firstNode.y + nodeHeight} C ${firstNode.x + nodeWidth + 40} ${cy + 60}, ${firstNode.x - 40} ${cy + 60}, ${firstNode.x + nodeWidth * 0.25} ${firstNode.y + nodeHeight}" fill="none" stroke="#059669" stroke-width="2.5" marker-end="url(#arrow-loop)" />
                            <text x="${cx}" y="${cy + 60}" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">loops to self (head)</text>
                        </g>
                    `;
                } else {
                    // Tail next -> Head forward loop (curving underneath)
                    const xTailEnd = lastNode.x + nodeWidth * 0.75;
                    const yTailEnd = lastNode.y + nodeHeight;
                    const xHeadStart = firstNode.x + nodeWidth * 0.25;
                    const yHeadStart = firstNode.y + nodeHeight;
                    const controlY = startY + nodeHeight + 65;

                    svgHtml += `
                        <g class="circular-loop">
                            <path d="M ${xTailEnd} ${yTailEnd} C ${xTailEnd} ${controlY}, ${xHeadStart} ${controlY}, ${xHeadStart} ${yHeadStart}" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#arrow-loop)" />
                            <rect x="${(xTailEnd + xHeadStart) / 2 - 60}" y="${controlY - 12}" width="120" height="22" rx="4" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" />
                            <text x="${(xTailEnd + xHeadStart) / 2}" y="${controlY + 3}" font-size="10.5" font-weight="700" fill="#059669" text-anchor="middle">tail.next ➔ HEAD</text>
                        </g>
                    `;

                    // If Circular Doubly: Head prev -> Tail loop (curving over the top!)
                    if (isDoubly) {
                        const xHeadPrev = firstNode.x + nodeWidth * 0.25;
                        const yHeadPrev = firstNode.y;
                        const xTailPrev = lastNode.x + nodeWidth * 0.75;
                        const yTailPrev = lastNode.y;
                        const controlYTop = startY - 45;

                        svgHtml += `
                            <g class="circular-loop-prev">
                                <path d="M ${xHeadPrev} ${yHeadPrev} C ${xHeadPrev} ${controlYTop}, ${xTailPrev} ${controlYTop}, ${xTailPrev} ${yTailPrev}" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6,3" marker-end="url(#arrow-loop-prev)" />
                                <rect x="${(xHeadPrev + xTailPrev) / 2 - 60}" y="${controlYTop - 11}" width="120" height="22" rx="4" fill="#fffbeb" stroke="#fde68a" stroke-width="1" />
                                <text x="${(xHeadPrev + xTailPrev) / 2}" y="${controlYTop + 4}" font-size="10.5" font-weight="700" fill="#d97706" text-anchor="middle">head.prev ➔ TAIL</text>
                            </g>
                        `;
                    }
                }
            }

            // 4. Render Nodes
            nodes.forEach((n, idx) => {
                const { x, y } = coords[n.uid];
                const isHead = n.uid === snapshot.headUid;
                const isTail = n.uid === snapshot.tailUid;
                const isHighlighted = n.uid === highlightUid;

                let strokeColor = '#3b82f6';
                let fillColor = '#ffffff';

                if (isHighlighted) {
                    if (action === 'delete') {
                        strokeColor = '#ef4444';
                        fillColor = '#fef2f2';
                    } else if (status === 'found') {
                        strokeColor = '#10b981';
                        fillColor = '#ecfdf5';
                    } else if (status === 'updated') {
                        strokeColor = '#8b5cf6';
                        fillColor = '#f5f3ff';
                    } else {
                        strokeColor = '#f59e0b';
                        fillColor = '#fffbeb';
                    }
                }

                svgHtml += `
                    <g class="ll-node ${isHighlighted ? 'active-node' : ''}" data-uid="${n.uid}" data-index="${idx}" data-value="${n.value}">
                        <!-- Node Body Box -->
                        <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="10" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isHighlighted ? '3.5' : '2'}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
                `;

                if (isDoubly) {
                    // Doubly Node Layout: [ PREV (28%) | DATA (44%) | NEXT (28%) ]
                    const prevWidth = nodeWidth * 0.28;
                    const dataWidth = nodeWidth * 0.44;
                    const nextWidth = nodeWidth * 0.28;

                    // Prev cell separator
                    svgHtml += `
                        <line x1="${x + prevWidth}" y1="${y}" x2="${x + prevWidth}" y2="${y + nodeHeight}" stroke="#e2e8f0" stroke-width="1.5" />
                        <rect x="${x}" y="${y}" width="${prevWidth}" height="${nodeHeight}" fill="#faf5ff" />
                        <text x="${x + prevWidth / 2}" y="${y + nodeHeight / 2 - 4}" font-size="9" fill="#7c3aed" text-anchor="middle" font-weight="700">PREV</text>
                        <text x="${x + prevWidth / 2}" y="${y + nodeHeight / 2 + 10}" font-size="10" fill="#a78bfa" text-anchor="middle">◀</text>

                        <!-- Data cell -->
                        <text x="${x + prevWidth + dataWidth / 2}" y="${y + nodeHeight / 2 - 8}" font-size="10" fill="#64748b" text-anchor="middle" font-weight="600">DATA</text>
                        <text x="${x + prevWidth + dataWidth / 2}" y="${y + nodeHeight / 2 + 14}" font-size="16" fill="#0f172a" text-anchor="middle" font-weight="800">${n.value}</text>

                        <!-- Next cell separator -->
                        <line x1="${x + prevWidth + dataWidth}" y1="${y}" x2="${x + prevWidth + dataWidth}" y2="${y + nodeHeight}" stroke="#e2e8f0" stroke-width="1.5" />
                        <rect x="${x + prevWidth + dataWidth}" y="${y}" width="${nextWidth}" height="${nodeHeight}" fill="#eff6ff" />
                        <text x="${x + prevWidth + dataWidth + nextWidth / 2}" y="${y + nodeHeight / 2 - 4}" font-size="9" fill="#2563eb" text-anchor="middle" font-weight="700">NEXT</text>
                        <text x="${x + prevWidth + dataWidth + nextWidth / 2}" y="${y + nodeHeight / 2 + 10}" font-size="10" fill="#60a5fa" text-anchor="middle">▶</text>
                    `;
                } else {
                    // Singly Node Layout: [ DATA (65%) | NEXT (35%) ]
                    const dataWidth = nodeWidth * 0.65;
                    const nextWidth = nodeWidth * 0.35;

                    svgHtml += `
                        <!-- Data cell -->
                        <text x="${x + dataWidth / 2}" y="${y + nodeHeight / 2 - 8}" font-size="10" fill="#64748b" text-anchor="middle" font-weight="600">DATA</text>
                        <text x="${x + dataWidth / 2}" y="${y + nodeHeight / 2 + 14}" font-size="16" fill="#0f172a" text-anchor="middle" font-weight="800">${n.value}</text>

                        <!-- Divider -->
                        <line x1="${x + dataWidth}" y1="${y}" x2="${x + dataWidth}" y2="${y + nodeHeight}" stroke="#e2e8f0" stroke-width="1.5" />
                        <rect x="${x + dataWidth}" y="${y}" width="${nextWidth}" height="${nodeHeight}" fill="#eff6ff" />
                        <text x="${x + dataWidth + nextWidth / 2}" y="${y + nodeHeight / 2 - 4}" font-size="9" fill="#2563eb" text-anchor="middle" font-weight="700">NEXT</text>
                        <text x="${x + dataWidth + nextWidth / 2}" y="${y + nodeHeight / 2 + 10}" font-size="10" fill="#60a5fa" text-anchor="middle">▶</text>
                    `;
                }

                // Index Tag below node
                svgHtml += `
                    <text x="${x + nodeWidth / 2}" y="${y + nodeHeight + 17}" font-size="10.5" font-weight="600" fill="#64748b" text-anchor="middle">Index [${idx}]</text>
                `;

                // HEAD Badge (above node)
                if (isHead) {
                    svgHtml += `
                        <g class="badge-head">
                            <rect x="${x + 6}" y="${y - 30}" width="50" height="20" rx="4" fill="#2563eb" />
                            <text x="${x + 31}" y="${y - 16}" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">HEAD</text>
                            <polygon points="${x + 28},${y - 10} ${x + 34},${y - 10} ${x + 31},${y - 6}" fill="#2563eb" />
                        </g>
                    `;
                }

                // TAIL Badge (above node, right side)
                if (isTail) {
                    svgHtml += `
                        <g class="badge-tail">
                            <rect x="${x + nodeWidth - 56}" y="${y - 30}" width="50" height="20" rx="4" fill="#7c3aed" />
                            <text x="${x + nodeWidth - 31}" y="${y - 16}" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">TAIL</text>
                            <polygon points="${x + nodeWidth - 34},${y - 10} ${x + nodeWidth - 28},${y - 10} ${x + nodeWidth - 31},${y - 6}" fill="#7c3aed" />
                        </g>
                    `;
                }

                svgHtml += `</g>`;
            });

            svgHtml += `</svg>`;
            this.container.innerHTML = svgHtml;

            // Attach click listener for node inspection
            const nodeEls = this.container.querySelectorAll('.ll-node');
            nodeEls.forEach(el => {
                el.addEventListener('click', () => {
                    const uid = el.getAttribute('data-uid');
                    const index = parseInt(el.getAttribute('data-index'), 10);
                    const val = el.getAttribute('data-value');
                    if (inspectCallback) {
                        inspectCallback({ uid, index, val });
                    }
                });
            });
        }
    }

    const STUDY_OPERATION_DETAILS = {
        insertBeginning: {
            objective: 'Place a new node before the current HEAD.',
            pseudocode: 'newNode = allocate(value)\nnewNode.next = HEAD\nif list is empty: TAIL = newNode\nHEAD = newNode\nlength = length + 1'
        },
        insertEnd: {
            objective: 'Attach a new node after the current TAIL.',
            pseudocode: 'newNode = allocate(value)\nif list is empty: HEAD = newNode\nelse: TAIL.next = newNode\nTAIL = newNode\nlength = length + 1'
        },
        insertAt: {
            objective: 'Find the insertion point, then connect the new node between its neighbors.',
            pseudocode: 'find predecessor at index - 1\nnewNode.next = predecessor.next\npredecessor.next = newNode\nif inserted at end: TAIL = newNode\nlength = length + 1'
        },
        deleteBeginning: {
            objective: 'Remove HEAD and make its next node the new HEAD.',
            pseudocode: 'if HEAD is NULL: stop\ntemp = HEAD\nHEAD = HEAD.next\nif HEAD is NULL: TAIL = NULL\nlength = length - 1'
        },
        deleteEnd: {
            objective: 'Remove TAIL and connect its predecessor to the list ending.',
            pseudocode: 'if TAIL is NULL: stop\nfind predecessor of TAIL\npredecessor.next = NULL\nTAIL = predecessor\nlength = length - 1'
        },
        deleteAt: {
            objective: 'Find the target node and bypass it from the chain.',
            pseudocode: 'find node at index and its predecessor\npredecessor.next = target.next\nif target is TAIL: TAIL = predecessor\nlength = length - 1'
        },
        search: {
            objective: 'Compare each node with the target until it is found or the list ends.',
            pseudocode: 'current = HEAD\nwhile current exists:\n    if current.value == target: return current\n    current = current.next\nreturn NOT_FOUND'
        },
        traverse: {
            objective: 'Visit each node once, following NEXT pointers from HEAD.',
            pseudocode: 'current = HEAD\nwhile current exists:\n    visit(current.value)\n    current = current.next'
        },
        updateAt: {
            objective: 'Locate a node by index and replace its stored value.',
            pseudocode: 'current = node at index\nif current does not exist: stop\ncurrent.value = newValue'
        },
        reverse: {
            objective: 'Reverse each NEXT link so the list order is flipped.',
            pseudocode: 'previous = NULL\ncurrent = HEAD\nTAIL = HEAD\nwhile current exists:\n    nextNode = current.next\n    current.next = previous\n    previous = current\n    current = nextNode\nHEAD = previous'
        }
    };

    function studySnapshot(type, nodes) {
        const circular = type.startsWith('circular');
        const doubly = type.includes('doubly');
        return {
            type,
            length: nodes.length,
            headUid: nodes.length ? nodes[0].uid : null,
            tailUid: nodes.length ? nodes[nodes.length - 1].uid : null,
            nodes: nodes.map((node, index) => ({
                uid: node.uid,
                index,
                value: node.value,
                prevUid: doubly ? (index > 0 ? nodes[index - 1].uid : (circular && nodes.length ? nodes[nodes.length - 1].uid : null)) : null,
                nextUid: index + 1 < nodes.length ? nodes[index + 1].uid : (circular && nodes.length ? nodes[0].uid : null)
            }))
        };
    }

    function buildStudySteps(type, operation, value, position, initialValues) {
        const nodes = initialValues.map((nodeValue, index) => ({ uid: `study-node-${index}`, value: nodeValue }));
        let nextUid = nodes.length;
        const steps = [];
        const pseudocode = STUDY_OPERATION_DETAILS[operation].pseudocode;
        const addStep = (title, description, highlightNode, codeLine = 1) => {
            steps.push({
                title,
                description,
                highlightUid: highlightNode ? highlightNode.uid : null,
                codeLine,
                pseudocode,
                snapshot: studySnapshot(type, nodes)
            });
        };
        const circular = type.startsWith('circular');
        const doubly = type.includes('doubly');

        addStep('Starting state', `The list starts with ${nodes.length ? nodes.map(node => node.value).join(' → ') : 'no nodes'}. HEAD identifies the first node${circular ? ', and TAIL links back to HEAD' : '.'}`, nodes[0]);

        if (operation === 'insertBeginning' || operation === 'insertEnd' || operation === 'insertAt') {
            let index = operation === 'insertBeginning' ? 0 : operation === 'insertEnd' ? nodes.length : position;
            if (!Number.isInteger(index) || index < 0 || index > nodes.length) {
                addStep('Position is out of range', `Choose an index from 0 through ${nodes.length}. The list is unchanged.`, null);
                return steps;
            }
            const newNode = { uid: `study-node-${nextUid++}`, value };
            addStep('Allocate the new node', `Create a node that stores ${value}. Its pointer fields are ready to be connected.`, null, 1);
            if (operation === 'insertAt' && index > 0 && index < nodes.length) {
                for (let i = 0; i < index; i++) {
                    addStep(`Traverse to index ${i}`, `Follow NEXT from HEAD. The current node contains ${nodes[i].value}.`, nodes[i], 2);
                }
            } else if (operation === 'insertEnd' && nodes.length && !doubly) {
                addStep('Use the maintained TAIL pointer', `TAIL already identifies ${nodes[nodes.length - 1].value}; no traversal is needed.`, nodes[nodes.length - 1], 2);
            }
            addStep('Connect the new node', index === 0
                ? `Set newNode.next to the former HEAD${doubly ? ' and set the former HEAD.prev back to newNode' : ''}.`
                : `Set newNode.next to the node currently at index ${index}${doubly ? ' and set newNode.prev to its predecessor' : ''}.`, nodes[Math.min(index, nodes.length - 1)], 3);
            nodes.splice(index, 0, newNode);
            addStep('Update the list boundary', `${index === 0 ? 'HEAD' : index === nodes.length - 1 ? 'TAIL' : 'The predecessor'} now links to ${value}.${circular ? ' Keep TAIL.next pointing to HEAD.' : ''} Length is ${nodes.length}.`, newNode, 4);
        } else if (operation === 'deleteBeginning' || operation === 'deleteEnd' || operation === 'deleteAt') {
            const index = operation === 'deleteBeginning' ? 0 : operation === 'deleteEnd' ? nodes.length - 1 : position;
            if (!nodes.length) {
                addStep('The list is empty', 'There is no node to remove, so the list remains unchanged.', null);
                return steps;
            }
            if (!Number.isInteger(index) || index < 0 || index >= nodes.length) {
                addStep('Position is out of range', `Choose an index from 0 through ${nodes.length - 1}. The list is unchanged.`, null);
                return steps;
            }
            if (operation === 'deleteEnd' && !doubly && nodes.length > 1) {
                for (let i = 0; i < nodes.length - 1; i++) {
                    addStep(`Find the predecessor (index ${i})`, `A singly linked list has no PREV pointer, so follow NEXT until reaching ${nodes[nodes.length - 2].value}.`, nodes[i], 2);
                }
            }
            const removed = nodes[index];
            addStep('Identify the node to remove', `The node at index ${index} stores ${removed.value}.`, removed, 2);
            nodes.splice(index, 1);
            addStep('Reconnect its neighbors', nodes.length
                ? `Bypass ${removed.value}. Update the neighboring pointer${doubly ? 's' : ''}${circular ? ' and preserve the loop back to HEAD' : ''}. The remaining list has ${nodes.length} node${nodes.length === 1 ? '' : 's'}.`
                : `Remove ${removed.value}; both HEAD and TAIL now become NULL.`, nodes[Math.min(index, nodes.length - 1)], 3);
        } else if (operation === 'search' || operation === 'traverse') {
            if (!nodes.length) {
                addStep('The list is empty', 'There are no nodes to visit.', null);
                return steps;
            }
            let found = false;
            for (let i = 0; i < nodes.length; i++) {
                const matches = operation === 'search' && nodes[i].value === value;
                addStep(operation === 'search' ? `Compare index ${i}` : `Visit index ${i}`,
                    operation === 'search' ? `Compare ${nodes[i].value} with ${value}${matches ? ': the values match.' : ': they are different, so follow NEXT.'}` : `Visit node ${nodes[i].value}, then follow NEXT.`,
                    nodes[i], 2);
                if (matches) {
                    found = true;
                    break;
                }
            }
            if (operation === 'search') addStep(found ? 'Value found' : 'Value not found', found ? `Found ${value} in the list.` : `Checked all ${nodes.length} nodes; ${value} is not present.`, null, 4);
            else addStep('Traversal complete', `Visited each of the ${nodes.length} nodes exactly once${circular ? '; stop after returning to HEAD' : ''}.`, null, 3);
        } else if (operation === 'updateAt') {
            if (!Number.isInteger(position) || position < 0 || position >= nodes.length) {
                addStep('Position is out of range', `Choose an index from 0 through ${nodes.length - 1}. The list is unchanged.`, null);
                return steps;
            }
            const target = nodes[position];
            addStep(`Locate index ${position}`, `Follow NEXT to the node containing ${target.value}.`, target, 2);
            target.value = value;
            addStep('Replace the stored value', `The node now stores ${value}; its NEXT${doubly ? ' and PREV' : ''} links are unchanged.`, target, 3);
        } else if (operation === 'reverse') {
            if (circular) {
                addStep('Reverse is not enabled for this list type', 'This simulator demonstrates reversal for the linear singly and doubly linked lists.', null);
                return steps;
            }
            if (nodes.length < 2) {
                addStep('No pointer changes are needed', 'An empty list or a one-node list is already reversed.', nodes[0]);
                return steps;
            }
            for (let i = 0; i < nodes.length; i++) {
                const currentView = nodes.slice(0, i + 1).reverse().concat(nodes.slice(i + 1));
                addStep(`Reverse link ${i + 1} of ${nodes.length}`, `Redirect the current node's NEXT pointer toward its former predecessor. Save the next node before changing the link.`, nodes[i], 4);
                steps[steps.length - 1].snapshot = studySnapshot(type, currentView);
            }
            nodes.reverse();
            addStep('Move HEAD to the former TAIL', `The list is now ${nodes.map(node => node.value).join(' → ')}. HEAD and TAIL have exchanged roles.`, nodes[0], 8);
        }

        addStep('Result', `Final list: ${nodes.length ? nodes.map(node => node.value).join(circular ? ' → ' : ' → ') : 'empty'}. Length = ${nodes.length}.`, nodes[0], pseudocode.split('\n').length);
        return steps;
    }

    function studyComplexity(operation, type, position, length) {
        const doubly = type.includes('doubly');
        let time = 'O(n)';
        if (operation === 'insertBeginning' || operation === 'deleteBeginning') time = 'O(1)';
        else if (operation === 'insertEnd') time = 'O(1) with the maintained TAIL pointer';
        else if (operation === 'deleteEnd') time = doubly ? 'O(1) with the maintained TAIL pointer and PREV link' : 'O(n), because the predecessor of TAIL must be found';
        else if (operation === 'insertAt' || operation === 'deleteAt') {
            time = doubly ? `O(min(k, n-k)) = O(n) worst case (start at the nearer end; k=${position}, n=${length})` : `O(k) = O(n) worst case (follow NEXT from HEAD; k=${position})`;
        } else if (operation === 'updateAt') time = 'O(n) worst case to locate the indexed node';
        return `Time: ${time}. Auxiliary space: O(1). The list keeps HEAD and TAIL; pointer changes use a constant number of extra references.`;
    }

    // ==========================================
    // 7. STUDY MODE CONTROLLER (Step Engine)
    // ==========================================
    class StudyModeController {
        constructor(visualizer, statusEl, stepInfoEl, pseudocodeEl) {
            this.visualizer = visualizer;
            this.statusEl = statusEl;
            this.stepInfoEl = stepInfoEl;
            this.pseudocodeEl = pseudocodeEl;

            this.steps = [];
            this.currentStepIdx = 0;
            this.isPlaying = false;
            this.playInterval = null;
            this.speedMs = 1200; // default speed (1x)
            this.baseSnapshot = null;
        }

        loadOperation(steps, baseSnapshot, codeSnippet = '') {
            this.pause();
            this.steps = steps || [];
            this.baseSnapshot = baseSnapshot;
            this.currentStepIdx = 0;

            if (this.pseudocodeEl && codeSnippet) {
                this.pseudocodeEl.textContent = codeSnippet;
            }

            this.renderStep(0);
        }

        renderStep(idx) {
            if (this.steps.length === 0) {
                if (this.stepInfoEl) {
                    this.stepInfoEl.innerHTML = '<p class="text-muted">No active study operation loaded. Select an operation below and click "Start Study Mode".</p>';
                }
                return;
            }

            this.currentStepIdx = Math.max(0, Math.min(idx, this.steps.length - 1));
            const step = this.steps[this.currentStepIdx];

            if (this.stepInfoEl) {
                this.stepInfoEl.innerHTML = `
                    <div class="step-card">
                        <div class="step-header">
                            <span class="step-badge">Step ${this.currentStepIdx + 1} of ${this.steps.length}</span>
                            <h4 class="step-title">${step.title}</h4>
                        </div>
                        <p class="step-desc">${step.description}</p>
                    </div>
                `;
            }

            if (this.statusEl) {
                this.statusEl.textContent = `Study Mode: ${step.title} (${this.currentStepIdx + 1}/${this.steps.length})`;
            }

            const pseudocodeEl = document.getElementById('study-pseudocode');
            if (pseudocodeEl && step.pseudocode) {
                const activeLine = step.codeLine || 1;
                pseudocodeEl.innerHTML = step.pseudocode.split('\n').map((line, index) => {
                    const safeLine = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return `<span class="${index + 1 === activeLine ? 'study-code-line-active' : ''}">${safeLine || ' '}</span>`;
                }).join('\n');
            }

            // Each step carries its own pointer snapshot, rather than replaying only the final state.
            if (this.visualizer && (step.snapshot || this.baseSnapshot)) {
                this.visualizer.render(step.snapshot || this.baseSnapshot, {
                    highlightUid: step.highlightUid,
                    action: step.action,
                    activePointer: step.activePointer,
                    status: step.status
                });
            }
        }

        nextStep() {
            if (this.currentStepIdx < this.steps.length - 1) {
                this.renderStep(this.currentStepIdx + 1);
            } else {
                this.pause();
            }
        }

        prevStep() {
            if (this.currentStepIdx > 0) {
                this.renderStep(this.currentStepIdx - 1);
            }
        }

        firstStep() {
            this.renderStep(0);
        }

        lastStep() {
            this.renderStep(this.steps.length - 1);
        }

        play() {
            if (this.isPlaying) return;
            this.isPlaying = true;

            if (this.currentStepIdx >= this.steps.length - 1) {
                this.currentStepIdx = 0;
            }

            this.playInterval = setInterval(() => {
                if (this.currentStepIdx < this.steps.length - 1) {
                    this.nextStep();
                } else {
                    this.pause();
                }
            }, this.speedMs);
        }

        pause() {
            this.isPlaying = false;
            if (this.playInterval) {
                clearInterval(this.playInterval);
                this.playInterval = null;
            }
            const playButton = document.getElementById('btn-study-play');
            if (playButton) playButton.textContent = '▶ Play';
        }

        setSpeed(multiplier) {
            this.speedMs = 1200 / multiplier;
            if (this.isPlaying) {
                this.pause();
                this.play();
            }
        }
    }

    // ==========================================
    // 8. INTERACTIVE UI CONTROLLER
    // ==========================================
    const SimulatorUI = {
        currentType: 'singly',
        activeList: null,
        visualizer: null,
        studyVisualizer: null,
        studyController: null,
        chalVisualizer: null,
        activeChallenge: null,
        activeChallengeList: null,
        challengeAttempt: null,
        currentHintIdx: 0,
        traversalTimer: null,
        selectedCodeLang: 'javascript',
        quizQuestions: QUIZ_QUESTIONS,
        currentQuizFilter: 'all',
        currentQuizIdx: 0,
        quizScore: 0,
        quizAnswered: 0,
        quizLocked: false,
        quizFinished: false,

        init() {
            if (typeof window === 'undefined' || typeof document === 'undefined') return;

            // Instantiate visualizers
            this.visualizer = new LinkedListVisualizer('simulator-canvas');
            this.studyVisualizer = new LinkedListVisualizer('study-canvas');

            const statusEl = document.getElementById('sim-status-text');
            const stepInfoEl = document.getElementById('study-step-info');
            this.studyController = new StudyModeController(this.studyVisualizer, statusEl, stepInfoEl, null);

            // Setup default Singly Linked List with initial 4 nodes
            this.activeList = new SinglyLinkedList();
            this.activeList.insertEnd(10);
            this.activeList.insertEnd(20);
            this.activeList.insertEnd(30);
            this.activeList.insertEnd(40);

            this.updateSimView();

            // Setup navigation event listeners
            document.querySelectorAll('[data-view]').forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
                    const view = item.getAttribute('data-view');
                    if (view) this.switchView(view);
                });
            });

            document.querySelectorAll('.list-type-link').forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
                    const type = item.getAttribute('data-type');
                    if (type) this.selectTypeAndGo(type);
                });
            });

            // Mobile toggle
            const mobileBtn = document.getElementById('mobile-toggle');
            const sidebar = document.getElementById('app-sidebar');
            if (mobileBtn && sidebar) {
                mobileBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('open');
                });
            }

            // Initialize other components
            this.updateCodeViewer();
            this.initQuiz();
            this.updateProgressView();
        },

        switchView(viewName) {
            document.querySelectorAll('.view-section').forEach(sec => {
                sec.classList.remove('active');
            });
            const targetSec = document.getElementById(`view-${viewName}`);
            if (targetSec) targetSec.classList.add('active');

            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.getAttribute('data-view') === viewName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            const titleEl = document.getElementById('current-view-title');
            if (titleEl) {
                const names = {
                    dashboard: 'Dashboard',
                    learn: 'Learn Linked Lists',
                    simulator: 'Interactive Simulator',
                    study: 'Step-by-Step Study Mode',
                    'code-viewer': 'Algorithm & Code Viewer',
                    complexity: 'Complexity Comparison',
                    quiz: 'Quiz & Practice',
                    challenges: 'Practice Challenges',
                    progress: 'Progress Dashboard',
                    about: 'About Project'
                };
                titleEl.textContent = viewName === 'simulator'
                    ? `${this.getTypeLabel(this.currentType)} Simulator`
                    : names[viewName] || viewName;
            }

            const sidebar = document.getElementById('app-sidebar');
            if (sidebar) sidebar.classList.remove('open');

            // View-specific refreshes
            if (viewName === 'simulator') {
                this.updateSimView();
            } else if (viewName === 'progress') {
                this.updateProgressView();
            }
        },

        selectTypeAndGo(type) {
            this.setListType(type);
            this.switchView('simulator');
        },

        setListType(type) {
            if (this.traversalTimer) {
                clearInterval(this.traversalTimer);
                this.traversalTimer = null;
            }
            this.currentType = type;

            document.querySelectorAll('.type-tab').forEach(tab => {
                if (tab.getAttribute('data-type') === type) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            document.querySelectorAll('.list-type-link').forEach(link => {
                const active = link.getAttribute('data-type') === type;
                link.classList.toggle('active', active);
                link.setAttribute('aria-current', active ? 'page' : 'false');
            });

            if (type === 'singly') this.activeList = new SinglyLinkedList();
            else if (type === 'doubly') this.activeList = new DoublyLinkedList();
            else if (type === 'circular-singly') this.activeList = new CircularSinglyLinkedList();
            else if (type === 'circular-doubly') this.activeList = new CircularDoublyLinkedList();

            // Populate sample nodes
            this.activeList.insertEnd(10);
            this.activeList.insertEnd(20);
            this.activeList.insertEnd(30);
            this.activeList.insertEnd(40);

            // Reversal only available for SLL and DLL
            const revBtn = document.getElementById('btn-reverse');
            if (revBtn) {
                revBtn.style.display = (type === 'singly' || type === 'doubly') ? 'inline-flex' : 'none';
            }

            const title = document.getElementById('simulator-title');
            const subtitle = document.getElementById('simulator-subtitle');
            const titleText = `${this.getTypeLabel(type)} Simulator`;
            const descriptions = {
                singly: 'A linear chain where each node points forward to the next, ending at NULL.',
                doubly: 'A two-way chain where every node links to both its previous and next neighbors.',
                'circular-singly': 'A forward-only chain whose tail points back to HEAD to complete the loop.',
                'circular-doubly': 'A two-way circular chain with TAIL.next linked to HEAD and HEAD.prev linked to TAIL.'
            };
            if (title) title.textContent = titleText;
            if (subtitle) subtitle.textContent = descriptions[type];
            this.updateSimView();
            this.showToast(`Switched to ${this.getTypeLabel(type)}`, 'info');
        },

        getTypeLabel(type) {
            const map = {
                'singly': 'Singly Linked List',
                'doubly': 'Doubly Linked List',
                'circular-singly': 'Circular Singly Linked List',
                'circular-doubly': 'Circular Doubly Linked List'
            };
            return map[type] || type;
        },

        updateSimView(highlightOpts = {}) {
            if (!this.visualizer || !this.activeList) return;

            const snapshot = this.activeList.toSnapshot();
            this.visualizer.render(snapshot, {
                ...highlightOpts,
                inspectCallback: (node) => this.openNodeModal(node)
            });

            // Update status & metadata
            const metaEl = document.getElementById('sim-list-meta');
            if (metaEl) {
                metaEl.textContent = `Length: ${this.activeList.length} | Type: ${this.getTypeLabel(this.currentType)}`;
            }

            const sideType = document.getElementById('sidebar-current-type');
            if (sideType) sideType.textContent = this.getTypeLabel(this.currentType);

            const sideCount = document.getElementById('sidebar-node-count');
            if (sideCount) sideCount.textContent = this.activeList.length;
            const nodeCount = document.getElementById('sim-node-count');
            if (nodeCount) nodeCount.textContent = this.activeList.length;
            const capacity = document.getElementById('sim-capacity');
            if (capacity) capacity.textContent = 'Dynamic';
        },

        loadExample() {
            this.activeList.clear();
            [10, 20, 30, 40].forEach(value => this.activeList.insertEnd(value));
            this.updateSimView();
            this.setSimStatus('Example loaded: 10 → 20 → 30 → 40.');
            this.showToast('Example list loaded.', 'success');
        },

        reverseExample() {
            if (this.currentType.startsWith('circular')) {
                this.showToast('Reverse Example is available for linear singly and doubly lists.', 'info');
                return;
            }
            this.activeList.reverse();
            this.updateSimView();
            this.setSimStatus(`Example reversed: ${this.activeList.toArray().join(' → ')}.`);
            this.showToast('Example reversed.', 'success');
        },

        resetList() {
            this.activeList.clear();
            this.updateSimView();
            this.setSimStatus('List reset. HEAD and TAIL are NULL.');
            this.showToast('List reset.', 'info');
        },

        readIntegerInput(id, label) {
            const el = document.getElementById(id);
            if (!el || el.value.trim() === '' || !Number.isInteger(Number(el.value))) {
                this.showToast(`${label} must be a whole number.`, 'error');
                if (el) el.focus();
                return null;
            }
            return Number(el.value);
        },

        getInputValue() {
            return this.readIntegerInput('sim-input-value', 'Node value');
        },

        getInputPos() {
            const position = this.readIntegerInput('sim-input-pos', 'Position');
            if (position !== null && position < 0) {
                this.showToast('Position must be zero or greater.', 'error');
                return null;
            }
            return position;
        },

        recordOp() {
            if (this.traversalTimer) {
                clearInterval(this.traversalTimer);
                this.traversalTimer = null;
            }
            const prog = loadProgress();
            prog.operationsExecuted = (prog.operationsExecuted || 0) + 1;
            saveProgress(prog);
        },

        completeLesson(lessonId) {
            const lessonIds = ['singly', 'doubly', 'circular-singly', 'circular-doubly'];
            if (!lessonIds.includes(lessonId)) return;
            const progress = loadProgress();
            if (!Array.isArray(progress.completedLessons)) progress.completedLessons = [];
            if (!progress.completedLessons.includes(lessonId)) {
                progress.completedLessons.push(lessonId);
                saveProgress(progress);
            }
            this.updateProgressView();
            this.showToast('Lesson marked complete. You can revisit it any time.', 'success');
        },

        // Simulator Operations
        execInsertBeg() {
            const val = this.getInputValue();
            if (val === null) return;
            this.activeList.insertBeginning(val);
            this.recordOp();
            const lastStep = this.activeList.lastSteps ? this.activeList.lastSteps[this.activeList.lastSteps.length - 1] : null;
            this.updateSimView({ highlightUid: lastStep ? lastStep.highlightUid : null, status: 'updated' });
            this.setSimStatus(`Inserted ${val} at beginning.`);
            this.showToast(`Inserted ${val} at beginning`, 'success');
        },

        execInsertEnd() {
            const val = this.getInputValue();
            if (val === null) return;
            this.activeList.insertEnd(val);
            this.recordOp();
            const lastStep = this.activeList.lastSteps ? this.activeList.lastSteps[this.activeList.lastSteps.length - 1] : null;
            this.updateSimView({ highlightUid: lastStep ? lastStep.highlightUid : null, status: 'updated' });
            this.setSimStatus(`Inserted ${val} at end.`);
            this.showToast(`Inserted ${val} at end`, 'success');
        },

        execInsertAt() {
            const val = this.getInputValue();
            const pos = this.getInputPos();
            if (val === null || pos === null) return;
            const success = this.activeList.insertAt(val, pos);
            if (!success) {
                this.showToast(`Invalid index ${pos}. Range: 0 to ${this.activeList.length}`, 'error');
                return;
            }
            this.recordOp();
            const lastStep = this.activeList.lastSteps ? this.activeList.lastSteps[this.activeList.lastSteps.length - 1] : null;
            this.updateSimView({ highlightUid: lastStep ? lastStep.highlightUid : null, status: 'updated' });
            this.setSimStatus(`Inserted ${val} at position ${pos}.`);
            this.showToast(`Inserted ${val} at index ${pos}`, 'success');
        },

        execDeleteBeg() {
            if (this.activeList.length === 0) {
                this.showToast('List is already empty!', 'error');
                return;
            }
            const removed = this.activeList.deleteBeginning();
            this.recordOp();
            this.updateSimView();
            this.setSimStatus(`Deleted node with value ${removed.value} from beginning.`);
            this.showToast(`Deleted ${removed.value} from beginning`, 'info');
        },

        execDeleteEnd() {
            if (this.activeList.length === 0) {
                this.showToast('List is already empty!', 'error');
                return;
            }
            const removed = this.activeList.deleteEnd();
            this.recordOp();
            this.updateSimView();
            this.setSimStatus(`Deleted node with value ${removed.value} from end.`);
            this.showToast(`Deleted ${removed.value} from end`, 'info');
        },

        execDeleteAt() {
            if (this.activeList.length === 0) {
                this.showToast('List is empty!', 'error');
                return;
            }
            const pos = this.getInputPos();
            if (pos === null) return;
            const removed = this.activeList.deleteAt(pos);
            if (!removed) {
                this.showToast(`Invalid position ${pos}. Range: 0 to ${this.activeList.length - 1}`, 'error');
                return;
            }
            this.recordOp();
            this.updateSimView();
            this.setSimStatus(`Deleted node with value ${removed.value} at position ${pos}.`);
            this.showToast(`Deleted node at index ${pos}`, 'info');
        },

        execSearch() {
            const val = this.getInputValue();
            if (val === null) return;
            this.recordOp();
            const res = this.activeList.search(val);
            if (res.found) {
                this.updateSimView({ highlightUid: res.node ? res.node.uid : null, status: 'found' });
                this.setSimStatus(`Found value ${val} at index ${res.index}!`);
                this.showToast(`Found ${val} at index ${res.index}`, 'success');
            } else {
                this.updateSimView();
                this.setSimStatus(`Value ${val} not found in list.`);
                this.showToast(`Value ${val} not found`, 'error');
            }
        },

        execUpdate() {
            const pos = this.getInputPos();
            const val = this.getInputValue();
            if (pos === null || val === null) return;
            const success = this.activeList.updateAt(pos, val);
            if (!success) {
                this.showToast(`Invalid index ${pos}`, 'error');
                return;
            }
            this.recordOp();
            this.updateSimView({ status: 'updated' });
            this.setSimStatus(`Updated index ${pos} with new value ${val}.`);
            this.showToast(`Updated index ${pos} to ${val}`, 'success');
        },

        execReverse() {
            if (this.currentType !== 'singly' && this.currentType !== 'doubly') {
                this.showToast('Reversal currently demonstrated for Singly & Doubly lists.', 'info');
                return;
            }
            this.activeList.reverse();
            this.recordOp();
            this.updateSimView();
            this.setSimStatus('Reversed list successfully.');
            this.showToast('List reversed!', 'success');
        },

        execTraverse() {
            if (this.traversalTimer) {
                clearInterval(this.traversalTimer);
                this.traversalTimer = null;
            }
            const snapshot = this.activeList.toSnapshot();
            if (!snapshot.nodes.length) {
                this.setSimStatus('The list is empty; there are no nodes to visit.');
                this.showToast('Cannot traverse an empty list.', 'error');
                return;
            }
            const nodes = snapshot.nodes;
            const values = nodes.map(node => node.value);
            let index = 0;
            this.recordOp();
            this.setSimStatus('Traversal started at HEAD.');
            this.traversalTimer = setInterval(() => {
                const node = nodes[index];
                this.updateSimView({ highlightUid: node.uid, status: 'updated' });
                this.setSimStatus(`Visiting index ${index}: ${node.value}`);
                index++;
                if (index >= nodes.length) {
                    clearInterval(this.traversalTimer);
                    this.traversalTimer = null;
                    this.setSimStatus(`Traversal complete: ${values.join(' → ')}. Visited ${values.length} nodes.`);
                }
            }, 450);
        },

        execRandom() {
            this.activeList.clear();
            const nums = [];
            while (nums.length < 4) {
                const r = Math.floor(Math.random() * 90) + 10;
                if (!nums.includes(r)) nums.push(r);
            }
            nums.forEach(n => this.activeList.insertEnd(n));
            this.updateSimView();
            this.setSimStatus(`Generated random nodes: ${nums.join(', ')}.`);
            this.showToast('Generated 4 random nodes', 'info');
        },

        execClear() {
            if (this.traversalTimer) {
                clearInterval(this.traversalTimer);
                this.traversalTimer = null;
            }
            this.activeList.clear();
            this.updateSimView();
            this.setSimStatus('List cleared. Memory reclaimed.');
            this.showToast('List cleared', 'info');
        },

        setSimStatus(msg) {
            const el = document.getElementById('sim-status-text');
            if (el) el.textContent = msg;
        },

        // Node Inspector Modal
        openNodeModal(nodeInfo) {
            const modal = document.getElementById('node-modal');
            const titleEl = document.getElementById('modal-node-title');
            const bodyEl = document.getElementById('modal-node-body');
            if (!modal || !titleEl || !bodyEl) return;

            const hexAddr = `0x7ffee0${(nodeInfo.index * 32).toString(16).padStart(4, '0')}`;
            const nextHexAddr = nodeInfo.index < this.activeList.length - 1 ? `0x7ffee0${((nodeInfo.index + 1) * 32).toString(16).padStart(4, '0')}` : (this.currentType.startsWith('circular') ? '0x7ffee00000 (HEAD)' : 'NULL (0x00000000)');
            const prevHexAddr = nodeInfo.index > 0 ? `0x7ffee0${((nodeInfo.index - 1) * 32).toString(16).padStart(4, '0')}` : (this.currentType.includes('doubly') && this.currentType.startsWith('circular') ? `0x7ffee0${((this.activeList.length - 1) * 32).toString(16).padStart(4, '0')} (TAIL)` : 'NULL (0x00000000)');

            titleEl.textContent = `Node Inspector: [Index ${nodeInfo.index}]`;
            bodyEl.innerHTML = `
                <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 13px; margin-bottom: 12px;">
                    <div><strong>Simulated Address:</strong> <span style="color: #2563eb;">${hexAddr}</span></div>
                    <div><strong>Data Value:</strong> <span style="color: #0f172a; font-weight: 700;">${nodeInfo.val}</span></div>
                    ${this.currentType.includes('doubly') ? `<div><strong>prev Pointer:</strong> <span style="color: #7c3aed;">${prevHexAddr}</span></div>` : ''}
                    <div><strong>next Pointer:</strong> <span style="color: #059669;">${nextHexAddr}</span></div>
                </div>
                <p>This node is an allocated heap chunk containing its payload value and 64-bit pointer references. In low-level languages like C/C++, dereferencing these addresses allows instant pointer traversal.</p>
            `;

            modal.classList.add('active');
        },

        closeNodeModal() {
            const modal = document.getElementById('node-modal');
            if (modal) modal.classList.remove('active');
        },

        showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icons = { success: '✓', error: '✕', info: 'ℹ' };
            toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.25s ease';
                setTimeout(() => toast.remove(), 260);
            }, 3000);
        },

        // Study Mode
        startStudyDemo() {
            const typeEl = document.getElementById('study-type-select');
            const operationEl = document.getElementById('study-op-select');
            const valueEl = document.getElementById('study-input-value');
            const positionEl = document.getElementById('study-input-pos');
            if (!typeEl || !operationEl || !valueEl || !positionEl) return;

            const type = typeEl.value;
            const operation = operationEl.value;
            const value = Number(valueEl.value);
            const position = Number(positionEl.value);
            if (!Number.isInteger(value)) {
                this.showToast('Enter a whole-number node value before loading the demo.', 'error');
                valueEl.focus();
                return;
            }
            if (!Number.isInteger(position) || position < 0) {
                this.showToast('Enter a non-negative whole-number position.', 'error');
                positionEl.focus();
                return;
            }
            if (operation === 'reverse' && type.startsWith('circular')) {
                this.showToast('Reverse is demonstrated for linear singly and doubly linked lists.', 'error');
                return;
            }

            const constructors = {
                singly: SinglyLinkedList,
                doubly: DoublyLinkedList,
                'circular-singly': CircularSinglyLinkedList,
                'circular-doubly': CircularDoublyLinkedList
            };
            const demoList = new constructors[type]();
            const initialValues = [10, 20, 30, 40];
            initialValues.forEach(nodeValue => demoList.insertEnd(nodeValue));

            let operationSucceeded = true;
            if (operation === 'insertBeginning') demoList.insertBeginning(value);
            else if (operation === 'insertEnd') demoList.insertEnd(value);
            else if (operation === 'insertAt') operationSucceeded = demoList.insertAt(value, position);
            else if (operation === 'deleteBeginning') operationSucceeded = Boolean(demoList.deleteBeginning());
            else if (operation === 'deleteEnd') operationSucceeded = Boolean(demoList.deleteEnd());
            else if (operation === 'deleteAt') operationSucceeded = Boolean(demoList.deleteAt(position));
            else if (operation === 'search') operationSucceeded = demoList.search(value).found;
            else if (operation === 'traverse') operationSucceeded = demoList.toArray().length > 0;
            else if (operation === 'updateAt') operationSucceeded = demoList.updateAt(position, value);
            else if (operation === 'reverse') demoList.reverse();

            const steps = buildStudySteps(type, operation, value, position, initialValues);
            const initialSnapshot = steps.length ? steps[0].snapshot : demoList.toSnapshot();
            const complexityEl = document.getElementById('study-complexity');
            if (complexityEl) complexityEl.textContent = studyComplexity(operation, type, position, initialValues.length);
            this.studyController.loadOperation(steps, initialSnapshot);
            if (!operationSucceeded && ['insertAt', 'deleteAt', 'updateAt'].includes(operation)) {
                this.showToast('The requested position is outside the demonstration list. Review the position range in the step panel.', 'error');
            } else if (operation === 'search' && !operationSucceeded) {
                this.showToast(`Value ${value} is not in the demonstration list; the steps show a full unsuccessful search.`, 'info');
            } else {
                this.showToast('Loaded guided step sequence.', 'info');
            }
        },

        studyFirst() { this.studyController.firstStep(); },
        studyPrev() { this.studyController.prevStep(); },
        studyNext() { this.studyController.nextStep(); },
        studyLast() { this.studyController.lastStep(); },
        studyReset() { this.studyController.firstStep(); },
        studyPlayToggle() {
            const btn = document.getElementById('btn-study-play');
            if (this.studyController.isPlaying) {
                this.studyController.pause();
                if (btn) btn.textContent = '▶ Play';
            } else {
                this.studyController.play();
                if (btn) btn.textContent = '⏸ Pause';
            }
        },
        setStudySpeed(val) {
            this.studyController.setSpeed(parseFloat(val));
        },

        // Code Viewer
        updateCodeViewer() {
            const typeEl = document.getElementById('code-list-type');
            const opEl = document.getElementById('code-operation');
            const block = document.getElementById('code-display-block');
            if (!typeEl || !opEl || !block) return;

            const listType = typeEl.value;
            const op = opEl.value;
            const lang = this.selectedCodeLang;

            const tplGroup = CODE_TEMPLATES[listType];
            const tplOp = tplGroup ? tplGroup[op] : null;
            const operationDetails = STUDY_OPERATION_DETAILS[op];
            const reverseUnavailable = op === 'reverse' && (listType === 'circularSingly' || listType === 'circularDoubly');

            if (reverseUnavailable) {
                block.textContent = 'Reverse is demonstrated for linear singly and doubly linked lists only.';
            } else if (lang === 'steps') {
                block.textContent = tplOp
                    ? (tplOp.steps || []).join('\n')
                    : operationDetails
                        ? `${operationDetails.objective}\n\n${operationDetails.pseudocode.split('\n').map((line, index) => `${index + 1}. ${line.trim()}`).join('\n')}`
                        : `${op} is not available for ${listType}.`;
            } else if (lang === 'pseudocode' && operationDetails) {
                block.textContent = operationDetails.pseudocode;
            } else if (lang === 'javascript' && operationDetails) {
                const constructors = {
                    singly: SinglyLinkedList,
                    doubly: DoublyLinkedList,
                    circularSingly: CircularSinglyLinkedList,
                    circularDoubly: CircularDoublyLinkedList
                };
                const methodNames = { traverse: 'toArray' };
                const methodName = methodNames[op] || op;
                const method = constructors[listType] && constructors[listType].prototype[methodName];
                block.textContent = typeof method === 'function'
                    ? method.toString()
                    : `${op} is not applicable to ${listType}.`;
            } else if (!tplOp) {
                block.textContent = `${op} reference code is not available in ${lang} for ${listType}. Use the pseudocode or JavaScript tab for this operation.`;
            } else {
                block.textContent = tplOp[lang] || tplOp.pseudocode || `No ${lang} example is available for this operation.`;
            }
        },

        setCodeLang(lang) {
            this.selectedCodeLang = lang;
            document.querySelectorAll('.lang-tab').forEach(t => {
                if (t.getAttribute('data-lang') === lang) t.classList.add('active');
                else t.classList.remove('active');
            });
            this.updateCodeViewer();
        },

        copyCode() {
            const block = document.getElementById('code-display-block');
            if (!block) return;
            navigator.clipboard.writeText(block.textContent).then(() => {
                this.showToast('Code copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Copied code!', 'success');
            });
        },

        // Quiz
        initQuiz() {
            this.filterQuiz('all');
        },

        filterQuiz(diff) {
            this.currentQuizFilter = diff;
            document.querySelectorAll('.diff-btn').forEach(b => {
                if (b.getAttribute('data-diff') === diff) b.classList.add('active');
                else b.classList.remove('active');
            });

            if (diff === 'all') {
                this.quizQuestions = QUIZ_QUESTIONS;
            } else {
                this.quizQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === diff);
            }

            this.currentQuizIdx = 0;
            this.quizScore = 0;
            this.quizAnswered = 0;
            this.quizLocked = false;
            this.quizFinished = false;
            this.renderQuizQuestion();
        },

        renderQuizQuestion() {
            const totalEl = document.getElementById('quiz-total-num');
            const currEl = document.getElementById('quiz-curr-num');
            const diffEl = document.getElementById('quiz-difficulty-tag');
            const textEl = document.getElementById('quiz-question-text');
            const optsContainer = document.getElementById('quiz-options-container');
            const expEl = document.getElementById('quiz-explanation');

            if (!textEl || !optsContainer) return;

            if (this.quizFinished) {
                const percentage = this.quizQuestions.length ? Math.round((this.quizScore / this.quizQuestions.length) * 100) : 0;
                if (currEl) currEl.textContent = this.quizQuestions.length;
                textEl.textContent = `Quiz complete — ${this.quizScore} out of ${this.quizQuestions.length} correct (${percentage}%).`;
                optsContainer.innerHTML = '';
                if (expEl) {
                    expEl.style.display = 'block';
                    expEl.textContent = 'Your result is saved locally. Choose Restart Quiz to try these questions again.';
                }
                const nextBtn = document.getElementById('btn-quiz-next');
                if (nextBtn) nextBtn.textContent = '↺ Restart Quiz';
                this.updateQuizStatsDisplay();
                return;
            }

            if (this.quizQuestions.length === 0) {
                textEl.textContent = 'No questions available for this filter.';
                optsContainer.innerHTML = '';
                return;
            }

            const q = this.quizQuestions[this.currentQuizIdx];
            if (totalEl) totalEl.textContent = this.quizQuestions.length;
            if (currEl) currEl.textContent = this.currentQuizIdx + 1;
            if (diffEl) diffEl.textContent = `${q.difficulty.toUpperCase()} • ${q.type.replace('_', ' ').toUpperCase()}`;

            textEl.textContent = q.question;
            const nextBtn = document.getElementById('btn-quiz-next');
            if (nextBtn) nextBtn.textContent = this.currentQuizIdx === this.quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question ▶';
            optsContainer.innerHTML = '';
            if (expEl) expEl.style.display = 'none';
            this.quizLocked = false;

            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.innerHTML = `<span style="font-weight: 700; width: 28px; color: var(--primary);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
                btn.onclick = () => this.selectQuizOption(idx);
                optsContainer.appendChild(btn);
            });

            this.updateQuizStatsDisplay();
        },

        selectQuizOption(idx) {
            if (this.quizLocked) return;
            this.quizLocked = true;

            const q = this.quizQuestions[this.currentQuizIdx];
            const opts = document.querySelectorAll('.quiz-opt-btn');
            opts.forEach(b => b.classList.add('locked'));

            this.quizAnswered++;
            const isCorrect = (idx === q.answer);
            if (isCorrect) {
                this.quizScore++;
                opts[idx].classList.add('correct');
                this.showToast('Correct! Great job.', 'success');
            } else {
                opts[idx].classList.add('incorrect');
                if (opts[q.answer]) opts[q.answer].classList.add('correct');
                this.showToast('Incorrect answer.', 'error');
            }

            const expEl = document.getElementById('quiz-explanation');
            if (expEl) {
                expEl.style.display = 'block';
                expEl.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
            }

            // Save progress
            const prog = loadProgress();
            prog.quizzesCompleted = (prog.quizzesCompleted || 0) + 1;
            prog.quizCorrectAnswers = (prog.quizCorrectAnswers || 0) + (isCorrect ? 1 : 0);
            const diffKey = this.currentQuizFilter;
            const oldBest = prog.quizHighScores[diffKey] || 0;
            if (this.quizScore > oldBest) {
                prog.quizHighScores[diffKey] = this.quizScore;
            }
            saveProgress(prog);

            this.updateQuizStatsDisplay();
        },

        nextQuizQuestion() {
            if (this.quizFinished) {
                this.filterQuiz(this.currentQuizFilter);
                const nextBtn = document.getElementById('btn-quiz-next');
                if (nextBtn) nextBtn.textContent = 'Next Question ▶';
                return;
            }
            if (!this.quizLocked) {
                this.showToast('Choose an answer before moving to the next question.', 'error');
                return;
            }
            if (this.currentQuizIdx < this.quizQuestions.length - 1) {
                this.currentQuizIdx++;
                this.renderQuizQuestion();
            } else {
                const percentage = Math.round((this.quizScore / this.quizQuestions.length) * 100);
                this.showToast(`Quiz Complete! Final Score: ${this.quizScore}/${this.quizQuestions.length} (${percentage}%)`, 'info');
                this.quizFinished = true;
                this.renderQuizQuestion();
            }
        },

        updateQuizStatsDisplay() {
            const scoreEl = document.getElementById('quiz-score-val');
            const ansEl = document.getElementById('quiz-answered-val');
            if (scoreEl) scoreEl.textContent = this.quizScore;
            if (ansEl) ansEl.textContent = this.quizAnswered;
        },

        // Challenges
        loadChallenge(idx) {
            const chal = CHALLENGES[idx];
            if (!chal) return;

            this.activeChallenge = chal;
            this.currentHintIdx = 0;
            this.challengeAttempt = null;

            const panel = document.getElementById('chal-active-panel');
            const badge = document.getElementById('chal-active-badge');
            const title = document.getElementById('chal-active-title');
            const instr = document.getElementById('chal-active-instr');
            const hintCount = document.getElementById('chal-hints-count');
            const hintDrawer = document.getElementById('chal-hint-drawer');

            if (panel) panel.style.display = 'block';
            if (badge) badge.textContent = `${chal.difficulty} • ${chal.listType.toUpperCase()}`;
            if (title) title.textContent = chal.title;
            if (instr) instr.textContent = chal.instructions;
            if (hintCount) hintCount.textContent = `0/${chal.hints.length}`;
            if (hintDrawer) hintDrawer.style.display = 'none';

            // Create fresh list instance
            if (chal.listType === 'singly') this.activeChallengeList = new SinglyLinkedList();
            else if (chal.listType === 'doubly') this.activeChallengeList = new DoublyLinkedList();
            else if (chal.listType === 'circular-singly') this.activeChallengeList = new CircularSinglyLinkedList();

            chal.initialValues.forEach(v => this.activeChallengeList.insertEnd(v));
            const challengeValue = document.getElementById('chal-input-value');
            const challengePosition = document.getElementById('chal-input-pos');
            const mergeInfo = document.getElementById('chal-merge-info');
            const mergeSecondValues = document.getElementById('chal-merge-second-values');
            if (challengeValue) {
                const matchedValue = chal.targetAction.match(/value (\d+)/i);
                challengeValue.value = matchedValue ? matchedValue[1] : (chal.expectedValue !== undefined ? chal.expectedValue : 99);
            }
            if (challengePosition) {
                const matchedPosition = chal.targetAction.match(/index (\d+)/i);
                challengePosition.value = matchedPosition ? matchedPosition[1] : 0;
            }
            if (mergeInfo) mergeInfo.style.display = chal.secondValues ? 'block' : 'none';
            if (mergeSecondValues) mergeSecondValues.textContent = chal.secondValues ? chal.secondValues.join(' → ') : '';

            if (!this.chalVisualizer) {
                this.chalVisualizer = new LinkedListVisualizer('chal-canvas');
            }
            this.chalVisualizer.render(this.activeChallengeList.toSnapshot());
            const challengeStatus = document.getElementById('chal-status');
            if (challengeStatus) challengeStatus.textContent = 'Perform the requested task using these controls, then check your solution.';

            panel.scrollIntoView({ behavior: 'smooth' });
            this.showToast(`Loaded ${chal.title}`, 'info');
        },

        challengeAction(operation) {
            if (!this.activeChallengeList || !this.activeChallenge) {
                this.showToast('Start a challenge before using its operation controls.', 'error');
                return;
            }
            const valueEl = document.getElementById('chal-input-value');
            const posEl = document.getElementById('chal-input-pos');
            const readChallengeInteger = (el, label) => {
                if (!el || el.value.trim() === '' || !Number.isInteger(Number(el.value))) {
                    this.showToast(`${label} must be a whole number.`, 'error');
                    if (el) el.focus();
                    return null;
                }
                return Number(el.value);
            };
            const value = readChallengeInteger(valueEl, 'Value');
            const position = readChallengeInteger(posEl, 'Position');
            if (value === null || position === null) return;
            if (position < 0) {
                this.showToast('Position must be zero or greater.', 'error');
                return;
            }

            let message = '';
            let success = true;
            let resultIndex = null;
            let detectedCycle = null;
            if (operation === 'insertBeginning') success = this.activeChallengeList.insertBeginning(value);
            else if (operation === 'insertEnd') success = this.activeChallengeList.insertEnd(value);
            else if (operation === 'insertAt') success = this.activeChallengeList.insertAt(value, position);
            else if (operation === 'deleteBeginning') {
                const removed = this.activeChallengeList.deleteBeginning();
                success = Boolean(removed);
                message = success ? `Removed ${removed.value} from the beginning.` : 'The list is empty.';
            } else if (operation === 'deleteEnd') {
                const removed = this.activeChallengeList.deleteEnd();
                success = Boolean(removed);
                message = success ? `Removed ${removed.value} from the end.` : 'The list is empty.';
            } else if (operation === 'deleteAt') {
                const removed = this.activeChallengeList.deleteAt(position);
                success = Boolean(removed);
                message = success ? `Removed ${removed.value} from index ${position}.` : `Index ${position} is outside the list.`;
            } else if (operation === 'search') {
                const result = this.activeChallengeList.search(value);
                success = result.found;
                resultIndex = result.index;
                message = success ? `Found ${value} at index ${result.index}.` : `${value} was not found.`;
            } else if (operation === 'detectCycle') {
                let slow = this.activeChallengeList.head;
                let fast = this.activeChallengeList.head;
                detectedCycle = false;
                while (fast && fast.next) {
                    slow = slow.next;
                    fast = fast.next.next;
                    if (slow === fast) {
                        detectedCycle = true;
                        break;
                    }
                }
                success = true;
                message = detectedCycle ? 'Cycle detected: the slow and fast pointers met.' : 'No cycle detected.';
            } else if (operation === 'mergeSorted') {
                const secondList = new SinglyLinkedList();
                (this.activeChallenge.secondValues || []).forEach(nodeValue => secondList.insertEnd(nodeValue));
                const firstList = this.activeChallengeList;
                const dummy = new SinglyNode(0);
                let mergedTail = dummy;
                let first = firstList.head;
                let second = secondList.head;
                while (first && second) {
                    if (first.value <= second.value) {
                        mergedTail.next = first;
                        first = first.next;
                    } else {
                        mergedTail.next = second;
                        second = second.next;
                    }
                    mergedTail = mergedTail.next;
                }
                mergedTail.next = first || second;
                while (mergedTail.next) mergedTail = mergedTail.next;
                firstList.head = dummy.next;
                firstList.tail = mergedTail;
                firstList.length += secondList.length;
                success = true;
                message = 'Merged both inputs by relinking their nodes.';
            } else if (operation === 'reverse') {
                if (this.activeChallenge.listType.startsWith('circular')) {
                    success = false;
                    message = 'Reverse is available for linear singly and doubly linked lists only.';
                } else {
                    this.activeChallengeList.reverse();
                    message = 'Reversed the list.';
                }
            }
            if (!success) {
                this.showToast(message || 'Operation could not be completed. Check the value or index.', 'error');
                return;
            }
            if (!message) message = `Completed ${operation}.`;
            this.challengeAttempt = { operation, value, position, index: resultIndex, detectedCycle };
            this.recordOp();
            if (this.chalVisualizer) this.chalVisualizer.render(this.activeChallengeList.toSnapshot());
            const status = document.getElementById('chal-status');
            if (status) status.textContent = `${message} Current list: ${this.activeChallengeList.toArray().join(' → ') || '(empty)'}.`;
            this.showToast(message, 'success');
        },

        revealNextHint() {
            if (!this.activeChallenge) return;
            const hints = this.activeChallenge.hints;
            if (this.currentHintIdx >= hints.length) {
                this.showToast('All hints revealed!', 'info');
                return;
            }

            const hintDrawer = document.getElementById('chal-hint-drawer');
            const hintCount = document.getElementById('chal-hints-count');
            if (hintDrawer) {
                hintDrawer.style.display = 'block';
                hintDrawer.innerHTML = `<strong>Hint ${this.currentHintIdx + 1}:</strong> ${hints[this.currentHintIdx]}`;
            }
            this.currentHintIdx++;
            if (hintCount) hintCount.textContent = `${this.currentHintIdx}/${hints.length}`;
        },

        verifyChallengeSolution() {
            if (!this.activeChallenge || !this.activeChallengeList) return;

            const chal = this.activeChallenge;
            const arr = this.activeChallengeList.toArray();

            let passed = false;
            if (chal.expectedArray) {
                passed = JSON.stringify(arr) === JSON.stringify(chal.expectedArray);
            } else if (chal.expectedValue !== undefined) {
                passed = Boolean(this.challengeAttempt)
                    && this.challengeAttempt.operation === 'search'
                    && this.challengeAttempt.value === chal.expectedValue
                    && this.challengeAttempt.index === Math.floor(arr.length / 2);
            } else if (chal.expectedCycle !== undefined) {
                passed = Boolean(this.challengeAttempt)
                    && this.challengeAttempt.operation === 'detectCycle'
                    && this.challengeAttempt.detectedCycle === chal.expectedCycle;
            }

            if (passed) {
                const prog = loadProgress();
                if (!prog.challengesSolved.includes(chal.id)) {
                    prog.challengesSolved.push(chal.id);
                    saveProgress(prog);
                }
                this.showToast(`🎉 Challenge Solved! ${chal.solutionExplanation}`, 'success');
            } else {
                this.showToast('Not quite there yet. Check hints and try again!', 'error');
            }
        },

        resetChallengePlayground() {
            if (!this.activeChallenge) return;
            const chal = this.activeChallenge;
            this.activeChallengeList.clear();
            chal.initialValues.forEach(v => this.activeChallengeList.insertEnd(v));
            this.challengeAttempt = null;
            const mergeInfo = document.getElementById('chal-merge-info');
            if (mergeInfo) mergeInfo.style.display = chal.secondValues ? 'block' : 'none';
            if (this.chalVisualizer) {
                this.chalVisualizer.render(this.activeChallengeList.toSnapshot());
            }
            const status = document.getElementById('chal-status');
            if (status) status.textContent = 'Playground reset to the challenge starting state.';
            this.showToast('Playground reset to initial state.', 'info');
        },

        // Progress
        updateProgressView() {
            const prog = loadProgress();
            const opsCount = document.getElementById('stat-ops-count');
            const chalCount = document.getElementById('stat-chal-count');
            const accuracy = document.getElementById('stat-quiz-accuracy');
            const lessonsCount = document.getElementById('stat-lessons-count');
            const topicsRemaining = document.getElementById('stat-topics-remaining');
            const completedLessons = Array.isArray(prog.completedLessons) ? prog.completedLessons.length : 0;

            if (opsCount) opsCount.textContent = prog.operationsExecuted || 0;
            if (chalCount) chalCount.textContent = `${(prog.challengesSolved || []).length}/${CHALLENGES.length}`;
            if (lessonsCount) lessonsCount.textContent = `${completedLessons}/4`;
            if (topicsRemaining) topicsRemaining.textContent = `${Math.max(0, 4 - completedLessons)} list-type lesson${4 - completedLessons === 1 ? '' : 's'} remaining.`;
            if (accuracy) {
                const totalQ = prog.quizzesCompleted || 0;
                const correct = prog.quizCorrectAnswers || 0;
                accuracy.textContent = totalQ > 0 ? `${Math.round((correct / totalQ) * 100)}%` : '0%';
            }
        },

        confirmResetProgress() {
            if (confirm('Are you sure you want to reset all your learning progress and statistics?')) {
                resetProgress();
                this.updateProgressView();
                this.showToast('Progress has been reset.', 'info');
            }
        }
    };

    // ==========================================
    // 9. GLOBAL EXPORTS & INITIALIZATION
    // ==========================================
    const SimulatorApp = {
        SinglyNode,
        DoublyNode,
        SinglyLinkedList,
        DoublyLinkedList,
        CircularSinglyLinkedList,
        CircularDoublyLinkedList,
        CODE_TEMPLATES,
        QUIZ_QUESTIONS,
        CHALLENGES,
        LinkedListVisualizer,
        StudyModeController,
        SimulatorUI,
        loadProgress,
        saveProgress,
        resetProgress
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SimulatorApp;
    }

    if (typeof window !== 'undefined') {
        window.SimulatorApp = SimulatorApp;
        window.SimulatorUI = SimulatorUI;
        window.SinglyLinkedList = SinglyLinkedList;
        window.DoublyLinkedList = DoublyLinkedList;
        window.CircularSinglyLinkedList = CircularSinglyLinkedList;
        window.CircularDoublyLinkedList = CircularDoublyLinkedList;

        document.addEventListener('DOMContentLoaded', () => {
            SimulatorUI.init();
        });
    }

})(typeof window !== 'undefined' ? window : global);
