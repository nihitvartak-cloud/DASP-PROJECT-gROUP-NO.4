/**
 * Binary Search Tree Model
 * Pure algorithmic logic and step generation. Completely decoupled from DOM/UI.
 */

class BSTNode {
    constructor(value, id = null) {
        this.value = value;
        this.id = id || ('node_' + Math.random().toString(36).substr(2, 9));
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.mod = 0;
    }

    clone() {
        const copy = new BSTNode(this.value, this.id);
        copy.x = this.x;
        copy.y = this.y;
        copy.left = this.left ? this.left.clone() : null;
        copy.right = this.right ? this.right.clone() : null;
        return copy;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this._nodeCount = 0;
    }

    cloneRoot() {
        return this.root ? this.root.clone() : null;
    }

    clear() {
        this.root = null;
        this._nodeCount = 0;
    }

    insert(value) {
        const val = Number(value);
        if (isNaN(val)) return false;
        if (!this.root) {
            this.root = new BSTNode(val);
            this._nodeCount = 1;
            this.computeLayout();
            return true;
        }

        let curr = this.root;
        while (curr) {
            if (val === curr.value) return false; // Duplicate
            if (val < curr.value) {
                if (!curr.left) {
                    curr.left = new BSTNode(val);
                    this._nodeCount++;
                    this.computeLayout();
                    return true;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = new BSTNode(val);
                    this._nodeCount++;
                    this.computeLayout();
                    return true;
                }
                curr = curr.right;
            }
        }
        return false;
    }

    search(value) {
        let curr = this.root;
        while (curr) {
            if (curr.value === value) return curr;
            if (value < curr.value) curr = curr.left;
            else curr = curr.right;
        }
        return null;
    }

    findMin(node = this.root) {
        if (!node) return null;
        let curr = node;
        while (curr.left) curr = curr.left;
        return curr;
    }

    findMax(node = this.root) {
        if (!node) return null;
        let curr = node;
        while (curr.right) curr = curr.right;
        return curr;
    }

    height(node = this.root) {
        if (!node) return -1;
        return 1 + Math.max(this.height(node.left), this.height(node.right));
    }

    countNodes(node = this.root) {
        if (!node) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    countLeaves(node = this.root) {
        if (!node) return 0;
        if (!node.left && !node.right) return 1;
        return this.countLeaves(node.left) + this.countLeaves(node.right);
    }

    delete(value) {
        const initialCount = this.countNodes();
        this.root = this._deleteNode(this.root, value);
        this._nodeCount = this.countNodes();
        this.computeLayout();
        return this._nodeCount < initialCount;
    }

    _deleteNode(node, value) {
        if (!node) return null;
        if (value < node.value) {
            node.left = this._deleteNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this._deleteNode(node.right, value);
            return node;
        } else {
            // Case 1: Leaf
            if (!node.left && !node.right) return null;
            // Case 2: One child
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            // Case 3: Two children
            let successor = this.findMin(node.right);
            node.value = successor.value;
            node.right = this._deleteNode(node.right, successor.value);
            return node;
        }
    }

    /**
     * Collision-resistant layout engine for tree visualization
     * Uses subtree width bounding to guarantee nodes never overlap.
     */
    computeLayout(canvasWidth = 900, canvasHeight = 500) {
        if (!this.root) return;

        const nodeRadius = 24;
        const levelHeight = 70;
        const minHorizontalSpacing = 58;

        // Step 1: Assign depths and temporary relative positions
        const assignPositions = (node, depth = 0) => {
            if (!node) return { width: 0, leftOffset: 0, rightOffset: 0 };
            node.y = 50 + depth * levelHeight;

            if (!node.left && !node.right) {
                return { width: minHorizontalSpacing, leftOffset: 0, rightOffset: 0 };
            }

            const leftInfo = node.left ? assignPositions(node.left, depth + 1) : { width: 0, leftOffset: 0, rightOffset: 0 };
            const rightInfo = node.right ? assignPositions(node.right, depth + 1) : { width: 0, leftOffset: 0, rightOffset: 0 };

            const totalWidth = Math.max(minHorizontalSpacing, leftInfo.width + rightInfo.width);
            return { width: totalWidth, leftOffset: leftInfo.width, rightOffset: rightInfo.width };
        };

        assignPositions(this.root);

        // Step 2: In-order traversal gives natural non-overlapping X ordering
        let currentX = 50;
        const setXCoordinates = (node) => {
            if (!node) return;
            setXCoordinates(node.left);
            node.x = currentX;
            currentX += minHorizontalSpacing;
            setXCoordinates(node.right);
        };

        setXCoordinates(this.root);

        // Step 3: Center parents between children recursively
        const centerParents = (node) => {
            if (!node) return;
            centerParents(node.left);
            centerParents(node.right);
            if (node.left && node.right) {
                node.x = (node.left.x + node.right.x) / 2;
            } else if (node.left) {
                node.x = node.left.x + minHorizontalSpacing * 0.7;
            } else if (node.right) {
                node.x = node.right.x - minHorizontalSpacing * 0.7;
            }
        };
        centerParents(this.root);

        // Step 4: Center overall tree in canvas
        const allNodes = [];
        const collect = (n) => {
            if (!n) return;
            allNodes.push(n);
            collect(n.left);
            collect(n.right);
        };
        collect(this.root);

        if (allNodes.length > 0) {
            const minX = Math.min(...allNodes.map(n => n.x));
            const maxX = Math.max(...allNodes.map(n => n.x));
            const treeWidth = maxX - minX;
            const targetCenter = canvasWidth / 2;
            const currentCenter = (minX + maxX) / 2;
            const shiftX = targetCenter - currentCenter;
            allNodes.forEach(n => { n.x += shiftX; });
        }
    }

    getStats() {
        return {
            root: this.root ? this.root.value : '—',
            count: this.countNodes(),
            height: this.height(),
            leaves: this.countLeaves(),
            min: this.findMin() ? this.findMin().value : '—',
            max: this.findMax() ? this.findMax().value : '—'
        };
    }

    getAllNodesList() {
        const list = [];
        const traverse = (node) => {
            if (!node) return;
            list.push(node);
            traverse(node.left);
            traverse(node.right);
        };
        traverse(this.root);
        return list;
    }

    /* =========================================================================
       STEP GENERATORS (Step Engine Requirement - Independent of UI)
       ========================================================================= */

    generateInsertSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val)) {
            steps.push({
                action: 'error',
                description: `Invalid input: "${value}" is not a valid number.`,
                why: 'A Binary Search Tree requires comparable numerical values.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: this.cloneRoot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        // Case: Empty Tree
        if (!this.root) {
            const initialSnapshot = null;
            steps.push({
                action: 'check-root',
                description: `Tree is empty. Root is NULL.`,
                why: 'When the tree is empty, the new node immediately becomes the root.',
                pseudocodeLine: 2,
                pythonLine: 2,
                nodeStates: {},
                treeSnapshot: initialSnapshot,
                sound: 'step'
            });

            this.insert(val);
            const insertedSnapshot = this.cloneRoot();
            const nodeStates = {};
            nodeStates[this.root.id] = 'inserted';

            steps.push({
                action: 'insert-root',
                description: `Created root node with value ${val}.`,
                why: 'The root node is the entry point for all future BST operations.',
                pseudocodeLine: 3,
                pythonLine: 3,
                highlightNodes: [this.root.id],
                nodeStates,
                treeSnapshot: insertedSnapshot,
                sound: 'insert',
                isTerminal: true
            });
            return steps;
        }

        // Tree already has nodes - search down for insertion position
        let curr = this.root;
        let parent = null;
        let branch = null; // 'left' | 'right'

        steps.push({
            action: 'start-insert',
            description: `Starting insertion of value ${val} at root ${this.root.value}.`,
            why: 'Every BST operation begins at the root node.',
            pseudocodeLine: 4,
            pythonLine: 5,
            highlightNodes: [this.root.id],
            nodeStates: { [this.root.id]: 'comparing' },
            treeSnapshot: this.cloneRoot(),
            sound: 'compare'
        });

        while (curr) {
            if (val === curr.value) {
                // Duplicate value error
                steps.push({
                    action: 'duplicate-error',
                    description: `Value ${val} already exists in the BST! Duplicates are not allowed.`,
                    why: 'Standard Binary Search Trees maintain strict inequalities (< and >) for unambiguous ordering.',
                    pseudocodeLine: 6,
                    pythonLine: 8,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'error' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'error',
                    isTerminal: true
                });
                return steps;
            }

            if (val < curr.value) {
                // Must go left
                steps.push({
                    action: 'compare-less',
                    description: `Compare ${val} < ${curr.value}: Value is smaller, move to LEFT subtree.`,
                    why: `By the BST property, all elements in the left subtree must be strictly less than ${curr.value}.`,
                    pseudocodeLine: 7,
                    pythonLine: 9,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });

                if (!curr.left) {
                    parent = curr;
                    branch = 'left';
                    steps.push({
                        action: 'found-slot',
                        description: `Left child of ${curr.value} is NULL. Insert ${val} here.`,
                        why: 'We reached an empty spot where the BST ordering property is satisfied.',
                        pseudocodeLine: 8,
                        pythonLine: 10,
                        highlightNodes: [curr.id],
                        nodeStates: { [curr.id]: 'selected' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'step'
                    });
                    break;
                } else {
                    const edge = [curr.id, curr.left.id];
                    steps.push({
                        action: 'move-left',
                        description: `Moving left from ${curr.value} to ${curr.left.value}.`,
                        why: `Navigating to node ${curr.left.value} to continue comparison.`,
                        pseudocodeLine: 9,
                        pythonLine: 11,
                        highlightNodes: [curr.left.id],
                        highlightEdges: [edge],
                        nodeStates: { [curr.id]: 'visiting', [curr.left.id]: 'comparing' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'move'
                    });
                    curr = curr.left;
                }
            } else {
                // Must go right
                steps.push({
                    action: 'compare-greater',
                    description: `Compare ${val} > ${curr.value}: Value is greater, move to RIGHT subtree.`,
                    why: `By the BST property, all elements in the right subtree must be strictly greater than ${curr.value}.`,
                    pseudocodeLine: 10,
                    pythonLine: 12,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });

                if (!curr.right) {
                    parent = curr;
                    branch = 'right';
                    steps.push({
                        action: 'found-slot',
                        description: `Right child of ${curr.value} is NULL. Insert ${val} here.`,
                        why: 'We reached an empty spot where the BST ordering property is satisfied.',
                        pseudocodeLine: 11,
                        pythonLine: 13,
                        highlightNodes: [curr.id],
                        nodeStates: { [curr.id]: 'selected' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'step'
                    });
                    break;
                } else {
                    const edge = [curr.id, curr.right.id];
                    steps.push({
                        action: 'move-right',
                        description: `Moving right from ${curr.value} to ${curr.right.value}.`,
                        why: `Navigating to node ${curr.right.value} to continue comparison.`,
                        pseudocodeLine: 12,
                        pythonLine: 14,
                        highlightNodes: [curr.right.id],
                        highlightEdges: [edge],
                        nodeStates: { [curr.id]: 'visiting', [curr.right.id]: 'comparing' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'move'
                    });
                    curr = curr.right;
                }
            }
        }

        // Perform actual model insertion
        const newNode = new BSTNode(val);
        if (branch === 'left') parent.left = newNode;
        else parent.right = newNode;
        this._nodeCount++;
        this.computeLayout();

        const finalSnapshot = this.cloneRoot();
        const finalStates = {};
        finalStates[newNode.id] = 'inserted';
        if (parent) finalStates[parent.id] = 'selected';

        steps.push({
            action: 'node-inserted',
            description: `Node with value ${val} successfully inserted as ${branch} child of ${parent.value}.`,
            why: `Insertion complete. BST property preserved for all subtrees.`,
            pseudocodeLine: 13,
            pythonLine: 16,
            highlightNodes: [newNode.id],
            highlightEdges: [[parent.id, newNode.id]],
            nodeStates: finalStates,
            treeSnapshot: finalSnapshot,
            sound: 'insert',
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
                why: 'A numeric search key is required.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: this.cloneRoot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        if (!this.root) {
            steps.push({
                action: 'empty-tree',
                description: `Tree is empty. Cannot search for ${val}.`,
                why: 'An empty tree contains zero nodes; return NOT FOUND.',
                pseudocodeLine: 2,
                pythonLine: 2,
                nodeStates: {},
                treeSnapshot: null,
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        let curr = this.root;
        steps.push({
            action: 'start-search',
            description: `Start search for ${val} at root (${this.root.value}).`,
            why: 'Binary search begins at the root node.',
            pseudocodeLine: 1,
            pythonLine: 2,
            highlightNodes: [this.root.id],
            nodeStates: { [this.root.id]: 'comparing' },
            treeSnapshot: this.cloneRoot(),
            sound: 'compare'
        });

        while (curr) {
            if (curr.value === val) {
                const states = { [curr.id]: 'found' };
                steps.push({
                    action: 'found',
                    description: `Target value ${val} FOUND at node ${curr.value}!`,
                    why: `Found exact match (${val} === ${curr.value}). Search terminates in O(h) time.`,
                    pseudocodeLine: 4,
                    pythonLine: 5,
                    highlightNodes: [curr.id],
                    nodeStates: states,
                    treeSnapshot: this.cloneRoot(),
                    sound: 'found',
                    isTerminal: true
                });
                return steps;
            }

            if (val < curr.value) {
                steps.push({
                    action: 'compare-less',
                    description: `Compare ${val} < ${curr.value}: Move to LEFT subtree.`,
                    why: `Since ${val} is strictly less than ${curr.value}, it can only exist in the left subtree.`,
                    pseudocodeLine: 5,
                    pythonLine: 6,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });

                if (!curr.left) {
                    steps.push({
                        action: 'not-found',
                        description: `Left child is NULL. Value ${val} is NOT FOUND in the BST.`,
                        why: 'Reached a dead end where value should have been. Value does not exist in the tree.',
                        pseudocodeLine: 9,
                        pythonLine: 10,
                        highlightNodes: [curr.id],
                        nodeStates: { [curr.id]: 'error' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'error',
                        isTerminal: true
                    });
                    return steps;
                }

                const edge = [curr.id, curr.left.id];
                curr = curr.left;
                steps.push({
                    action: 'move-left',
                    description: `Moved left to node ${curr.value}.`,
                    why: `Continuing search in the left subtree.`,
                    pseudocodeLine: 6,
                    pythonLine: 7,
                    highlightNodes: [curr.id],
                    highlightEdges: [edge],
                    nodeStates: { [curr.id]: 'visiting' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'move'
                });
            } else {
                steps.push({
                    action: 'compare-greater',
                    description: `Compare ${val} > ${curr.value}: Move to RIGHT subtree.`,
                    why: `Since ${val} is strictly greater than ${curr.value}, it can only exist in the right subtree.`,
                    pseudocodeLine: 7,
                    pythonLine: 8,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });

                if (!curr.right) {
                    steps.push({
                        action: 'not-found',
                        description: `Right child is NULL. Value ${val} is NOT FOUND in the BST.`,
                        why: 'Reached a dead end where value should have been. Value does not exist in the tree.',
                        pseudocodeLine: 9,
                        pythonLine: 10,
                        highlightNodes: [curr.id],
                        nodeStates: { [curr.id]: 'error' },
                        treeSnapshot: this.cloneRoot(),
                        sound: 'error',
                        isTerminal: true
                    });
                    return steps;
                }

                const edge = [curr.id, curr.right.id];
                curr = curr.right;
                steps.push({
                    action: 'move-right',
                    description: `Moved right to node ${curr.value}.`,
                    why: `Continuing search in the right subtree.`,
                    pseudocodeLine: 8,
                    pythonLine: 9,
                    highlightNodes: [curr.id],
                    highlightEdges: [edge],
                    nodeStates: { [curr.id]: 'visiting' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'move'
                });
            }
        }

        return steps;
    }

    generateDeleteSteps(value) {
        const val = Number(value);
        const steps = [];

        if (isNaN(val) || !this.root) {
            steps.push({
                action: 'error',
                description: !this.root ? 'Tree is empty. Nothing to delete.' : `Invalid value ${value}.`,
                why: 'Deletion requires a valid value and non-empty tree.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: this.cloneRoot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        // Phase 1: Search for target node
        let curr = this.root;
        let parent = null;
        let isLeftChild = false;

        steps.push({
            action: 'search-target',
            description: `Searching for node ${val} to delete starting from root (${this.root.value}).`,
            why: 'Before a node can be deleted, it must first be located in the BST.',
            pseudocodeLine: 1,
            pythonLine: 2,
            highlightNodes: [curr.id],
            nodeStates: { [curr.id]: 'comparing' },
            treeSnapshot: this.cloneRoot(),
            sound: 'compare'
        });

        while (curr && curr.value !== val) {
            parent = curr;
            if (val < curr.value) {
                isLeftChild = true;
                steps.push({
                    action: 'compare-less',
                    description: `${val} < ${curr.value}: Search left.`,
                    why: `Target ${val} is smaller than ${curr.value}.`,
                    pseudocodeLine: 2,
                    pythonLine: 4,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });
                curr = curr.left;
            } else {
                isLeftChild = false;
                steps.push({
                    action: 'compare-greater',
                    description: `${val} > ${curr.value}: Search right.`,
                    why: `Target ${val} is larger than ${curr.value}.`,
                    pseudocodeLine: 3,
                    pythonLine: 6,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'comparing' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'compare'
                });
                curr = curr.right;
            }

            if (curr) {
                steps.push({
                    action: 'move-step',
                    description: `Moved to node ${curr.value}.`,
                    why: `Inspecting node ${curr.value}.`,
                    pseudocodeLine: 4,
                    pythonLine: 7,
                    highlightNodes: [curr.id],
                    nodeStates: { [curr.id]: 'visiting' },
                    treeSnapshot: this.cloneRoot(),
                    sound: 'move'
                });
            }
        }

        if (!curr) {
            steps.push({
                action: 'not-found',
                description: `Node with value ${val} not found in the tree. Nothing deleted.`,
                why: 'Cannot delete a value that does not exist in the BST.',
                pseudocodeLine: 5,
                pythonLine: 8,
                nodeStates: {},
                treeSnapshot: this.cloneRoot(),
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        // Target located!
        const targetId = curr.id;
        steps.push({
            action: 'target-located',
            description: `Target node ${val} found. Analyzing deletion case.`,
            why: `BST deletion has 3 distinct cases based on the number of children: 0, 1, or 2 children.`,
            pseudocodeLine: 6,
            pythonLine: 9,
            highlightNodes: [targetId],
            nodeStates: { [targetId]: 'deleting' },
            treeSnapshot: this.cloneRoot(),
            sound: 'found'
        });

        // Case 1: Leaf node (no children)
        if (!curr.left && !curr.right) {
            steps.push({
                action: 'case-leaf',
                description: `Case 1 — Leaf Node: ${val} has no children. Detach node directly.`,
                why: 'A leaf node can be safely detached without violating any BST invariants.',
                pseudocodeLine: 7,
                pythonLine: 11,
                highlightNodes: [targetId],
                nodeStates: { [targetId]: 'deleting' },
                treeSnapshot: this.cloneRoot(),
                sound: 'step'
            });

            // Perform deletion
            this.delete(val);
            const afterSnap = this.cloneRoot();

            steps.push({
                action: 'leaf-deleted',
                description: `Node ${val} detached. Tree restructured.`,
                why: 'Parent pointer set to NULL. Leaf successfully removed.',
                pseudocodeLine: 8,
                pythonLine: 12,
                nodeStates: {},
                treeSnapshot: afterSnap,
                sound: 'delete',
                isTerminal: true
            });
            return steps;
        }

        // Case 2: One child
        if (!curr.left || !curr.right) {
            const child = curr.left || curr.right;
            const childSide = curr.left ? 'left' : 'right';

            steps.push({
                action: 'case-one-child',
                description: `Case 2 — One Child: ${val} has exactly one child (${child.value} on the ${childSide}).`,
                why: `We bypass node ${val} by connecting its parent directly to its single child ${child.value}.`,
                pseudocodeLine: 9,
                pythonLine: 14,
                highlightNodes: [targetId, child.id],
                highlightEdges: [[targetId, child.id]],
                nodeStates: { [targetId]: 'deleting', [child.id]: 'selected' },
                treeSnapshot: this.cloneRoot(),
                sound: 'step'
            });

            this.delete(val);
            const afterSnap = this.cloneRoot();

            steps.push({
                action: 'one-child-deleted',
                description: `Node ${val} removed. Reconnected parent to ${child.value}.`,
                why: `Bypassing preserves the BST ordering for all descendants of ${child.value}.`,
                pseudocodeLine: 10,
                pythonLine: 16,
                highlightNodes: [child.id],
                nodeStates: { [child.id]: 'inserted' },
                treeSnapshot: afterSnap,
                sound: 'delete',
                isTerminal: true
            });
            return steps;
        }

        // Case 3: Two children
        // Demonstrate: Find inorder successor -> smallest in right subtree -> copy value -> delete successor
        steps.push({
            action: 'case-two-children',
            description: `Case 3 — Two Children: ${val} has two children. Finding inorder successor in right subtree.`,
            why: 'Inorder successor is the smallest value in the right subtree. It can replace the node without violating BST properties.',
            pseudocodeLine: 11,
            pythonLine: 18,
            highlightNodes: [targetId],
            nodeStates: { [targetId]: 'deleting' },
            treeSnapshot: this.cloneRoot(),
            sound: 'step'
        });

        // Search for inorder successor step by step
        let succ = curr.right;
        let succParent = curr;

        steps.push({
            action: 'move-right-successor',
            description: `Step to right child ${succ.value} to begin successor search.`,
            why: 'The inorder successor is always located in the right subtree.',
            pseudocodeLine: 12,
            pythonLine: 20,
            highlightNodes: [targetId, succ.id],
            highlightEdges: [[targetId, succ.id]],
            nodeStates: { [targetId]: 'deleting', [succ.id]: 'visiting' },
            treeSnapshot: this.cloneRoot(),
            sound: 'move'
        });

        while (succ.left) {
            succParent = succ;
            succ = succ.left;
            steps.push({
                action: 'find-successor-min',
                description: `Traverse left to ${succ.value} to find minimum value in right subtree.`,
                why: 'The minimum value in any binary search subtree is the leftmost node.',
                pseudocodeLine: 13,
                pythonLine: 22,
                highlightNodes: [targetId, succ.id],
                highlightEdges: [[succParent.id, succ.id]],
                nodeStates: { [targetId]: 'deleting', [succ.id]: 'comparing' },
                treeSnapshot: this.cloneRoot(),
                sound: 'compare'
            });
        }

        const successorVal = succ.value;
        const successorId = succ.id;

        steps.push({
            action: 'successor-found',
            description: `Inorder successor found: ${successorVal}. It has at most one child.`,
            why: `Because ${successorVal} is the leftmost node in the right subtree, it is guaranteed to have no left child.`,
            pseudocodeLine: 14,
            pythonLine: 24,
            highlightNodes: [targetId, successorId],
            nodeStates: { [targetId]: 'deleting', [successorId]: 'successor' },
            treeSnapshot: this.cloneRoot(),
            sound: 'found'
        });

        // Copy successor value to target
        steps.push({
            action: 'copy-successor',
            description: `Copy successor value (${successorVal}) into deleted node position (${val} → ${successorVal}).`,
            why: `Replacing ${val} with ${successorVal} maintains BST order because ${successorVal} is greater than all left descendants and smaller than all remaining right descendants.`,
            pseudocodeLine: 15,
            pythonLine: 25,
            highlightNodes: [targetId, successorId],
            nodeStates: { [targetId]: 'successor', [successorId]: 'deleting' },
            treeSnapshot: this.cloneRoot(),
            sound: 'step'
        });

        // Now actually perform deletion on tree model
        this.delete(val);
        const finalSnap = this.cloneRoot();

        steps.push({
            action: 'delete-successor-node',
            description: `Successor node ${successorVal} detached. Node ${val} successfully deleted!`,
            why: 'Tree restructured and layout recomputed. BST invariants preserved.',
            pseudocodeLine: 16,
            pythonLine: 26,
            nodeStates: {},
            treeSnapshot: finalSnap,
            sound: 'delete',
            isTerminal: true
        });

        return steps;
    }

    generateTraversalSteps(type) {
        const steps = [];
        if (!this.root) {
            steps.push({
                action: 'empty-tree',
                description: 'Tree is empty. Traversal produces empty sequence.',
                why: 'Traversing an empty tree visits 0 nodes.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: null,
                traversalResult: [],
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        const accumulatedResult = [];

        if (type === 'inorder') {
            const traverse = (node) => {
                if (!node) return;
                // Left
                traverse(node.left);
                // Visit root
                accumulatedResult.push(node.value);
                const states = {};
                accumulatedResult.forEach(v => {
                    const found = this.search(v);
                    if (found) states[found.id] = 'found';
                });
                states[node.id] = 'visiting';

                steps.push({
                    action: 'visit-node',
                    description: `Inorder: Visit node ${node.value} (Left → Root → Right).`,
                    why: 'In a BST, Inorder traversal visits keys in monotonically ascending order.',
                    pseudocodeLine: 3,
                    pythonLine: 4,
                    highlightNodes: [node.id],
                    nodeStates: { ...states },
                    treeSnapshot: this.cloneRoot(),
                    traversalResult: [...accumulatedResult],
                    sound: 'visit',
                    value: node.value
                });
                // Right
                traverse(node.right);
            };
            traverse(this.root);
        } else if (type === 'preorder') {
            const traverse = (node) => {
                if (!node) return;
                // Visit root
                accumulatedResult.push(node.value);
                const states = {};
                accumulatedResult.forEach(v => {
                    const found = this.search(v);
                    if (found) states[found.id] = 'found';
                });
                states[node.id] = 'visiting';

                steps.push({
                    action: 'visit-node',
                    description: `Preorder: Visit node ${node.value} (Root → Left → Right).`,
                    why: 'Preorder traversal visits parents before children, useful for cloning or serializing trees.',
                    pseudocodeLine: 2,
                    pythonLine: 3,
                    highlightNodes: [node.id],
                    nodeStates: { ...states },
                    treeSnapshot: this.cloneRoot(),
                    traversalResult: [...accumulatedResult],
                    sound: 'visit',
                    value: node.value
                });
                // Left
                traverse(node.left);
                // Right
                traverse(node.right);
            };
            traverse(this.root);
        } else if (type === 'postorder') {
            const traverse = (node) => {
                if (!node) return;
                // Left
                traverse(node.left);
                // Right
                traverse(node.right);
                // Visit root
                accumulatedResult.push(node.value);
                const states = {};
                accumulatedResult.forEach(v => {
                    const found = this.search(v);
                    if (found) states[found.id] = 'found';
                });
                states[node.id] = 'visiting';

                steps.push({
                    action: 'visit-node',
                    description: `Postorder: Visit node ${node.value} (Left → Right → Root).`,
                    why: 'Postorder traversal visits children before parents, ideal for deleting subtrees or evaluating expressions.',
                    pseudocodeLine: 4,
                    pythonLine: 5,
                    highlightNodes: [node.id],
                    nodeStates: { ...states },
                    treeSnapshot: this.cloneRoot(),
                    traversalResult: [...accumulatedResult],
                    sound: 'visit',
                    value: node.value
                });
            };
            traverse(this.root);
        } else if (type === 'levelorder') {
            // BFS with Queue
            const queue = [this.root];
            const queueValues = [this.root.value];

            steps.push({
                action: 'bfs-start',
                description: `Level Order (BFS): Enqueue root ${this.root.value} into traversal queue.`,
                why: 'Breadth-First Search uses a FIFO Queue to visit nodes level-by-level.',
                pseudocodeLine: 1,
                pythonLine: 2,
                highlightNodes: [this.root.id],
                nodeStates: { [this.root.id]: 'selected' },
                treeSnapshot: this.cloneRoot(),
                traversalResult: [],
                auxiliaryQueue: [...queueValues],
                sound: 'step'
            });

            while (queue.length > 0) {
                const node = queue.shift();
                queueValues.shift();
                accumulatedResult.push(node.value);

                const states = {};
                accumulatedResult.forEach(v => {
                    const found = this.search(v);
                    if (found) states[found.id] = 'found';
                });
                states[node.id] = 'visiting';

                if (node.left) {
                    queue.push(node.left);
                    queueValues.push(node.left.value);
                }
                if (node.right) {
                    queue.push(node.right);
                    queueValues.push(node.right.value);
                }

                steps.push({
                    action: 'visit-node',
                    description: `Dequeue & Visit ${node.value}. Enqueued children: [${[node.left ? node.left.value : null, node.right ? node.right.value : null].filter(Boolean).join(', ')}].`,
                    why: 'Level-order guarantees visiting all nodes at depth d before moving to depth d+1.',
                    pseudocodeLine: 4,
                    pythonLine: 5,
                    highlightNodes: [node.id],
                    nodeStates: { ...states },
                    treeSnapshot: this.cloneRoot(),
                    traversalResult: [...accumulatedResult],
                    auxiliaryQueue: [...queueValues],
                    sound: 'visit',
                    value: node.value
                });
            }
        }

        // Completion step
        steps.push({
            action: 'traversal-complete',
            description: `${type.toUpperCase()} Traversal complete! Order: [ ${accumulatedResult.join(' → ')} ]`,
            why: `All ${accumulatedResult.length} nodes visited in sequence.`,
            pseudocodeLine: 5,
            pythonLine: 6,
            nodeStates: (() => {
                const s = {};
                accumulatedResult.forEach(v => {
                    const n = this.search(v);
                    if (n) s[n.id] = 'found';
                });
                return s;
            })(),
            treeSnapshot: this.cloneRoot(),
            traversalResult: [...accumulatedResult],
            auxiliaryQueue: [],
            sound: 'success',
            isTerminal: true
        });

        return steps;
    }

    generateFindMinSteps() {
        const steps = [];
        if (!this.root) {
            steps.push({
                action: 'empty-tree',
                description: 'Tree is empty. Minimum does not exist.',
                why: 'An empty tree has no nodes.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: null,
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        let curr = this.root;
        steps.push({
            action: 'start-min',
            description: `Start at root ${curr.value}. In a BST, minimum is the leftmost node.`,
            why: 'Because all left descendants are smaller than their parent, the minimum is found by traversing left until NULL.',
            pseudocodeLine: 2,
            pythonLine: 2,
            highlightNodes: [curr.id],
            nodeStates: { [curr.id]: 'comparing' },
            treeSnapshot: this.cloneRoot(),
            sound: 'compare'
        });

        while (curr.left) {
            const edge = [curr.id, curr.left.id];
            curr = curr.left;
            steps.push({
                action: 'move-left',
                description: `Move left to ${curr.value}.`,
                why: 'Left child is smaller.',
                pseudocodeLine: 3,
                pythonLine: 3,
                highlightNodes: [curr.id],
                highlightEdges: [edge],
                nodeStates: { [curr.id]: 'visiting' },
                treeSnapshot: this.cloneRoot(),
                sound: 'move'
            });
        }

        steps.push({
            action: 'min-found',
            description: `Minimum value is ${curr.value} (no left child).`,
            why: `Leftmost node reached. Minimum = ${curr.value}.`,
            pseudocodeLine: 4,
            pythonLine: 4,
            highlightNodes: [curr.id],
            nodeStates: { [curr.id]: 'found' },
            treeSnapshot: this.cloneRoot(),
            sound: 'found',
            isTerminal: true
        });
        return steps;
    }

    generateFindMaxSteps() {
        const steps = [];
        if (!this.root) {
            steps.push({
                action: 'empty-tree',
                description: 'Tree is empty. Maximum does not exist.',
                why: 'An empty tree has no nodes.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: null,
                sound: 'error',
                isTerminal: true
            });
            return steps;
        }

        let curr = this.root;
        steps.push({
            action: 'start-max',
            description: `Start at root ${curr.value}. In a BST, maximum is the rightmost node.`,
            why: 'Because all right descendants are greater than their parent, the maximum is found by traversing right until NULL.',
            pseudocodeLine: 2,
            pythonLine: 2,
            highlightNodes: [curr.id],
            nodeStates: { [curr.id]: 'comparing' },
            treeSnapshot: this.cloneRoot(),
            sound: 'compare'
        });

        while (curr.right) {
            const edge = [curr.id, curr.right.id];
            curr = curr.right;
            steps.push({
                action: 'move-right',
                description: `Move right to ${curr.value}.`,
                why: 'Right child is greater.',
                pseudocodeLine: 3,
                pythonLine: 3,
                highlightNodes: [curr.id],
                highlightEdges: [edge],
                nodeStates: { [curr.id]: 'visiting' },
                treeSnapshot: this.cloneRoot(),
                sound: 'move'
            });
        }

        steps.push({
            action: 'max-found',
            description: `Maximum value is ${curr.value} (no right child).`,
            why: `Rightmost node reached. Maximum = ${curr.value}.`,
            pseudocodeLine: 4,
            pythonLine: 4,
            highlightNodes: [curr.id],
            nodeStates: { [curr.id]: 'found' },
            treeSnapshot: this.cloneRoot(),
            sound: 'found',
            isTerminal: true
        });
        return steps;
    }

    generateHeightSteps() {
        const steps = [];
        if (!this.root) {
            steps.push({
                action: 'empty-tree',
                description: 'Tree is empty. Height is -1 (or 0 levels).',
                why: 'An empty tree has height -1 by standard convention.',
                pseudocodeLine: 1,
                pythonLine: 1,
                nodeStates: {},
                treeSnapshot: null,
                sound: 'step',
                isTerminal: true
            });
            return steps;
        }

        const h = this.height();
        steps.push({
            action: 'height-calc',
            description: `Tree height = ${h} (longest path from root to leaf has ${h} edges).`,
            why: 'Height determines the worst-case time complexity of BST operations: O(h).',
            pseudocodeLine: 2,
            pythonLine: 3,
            highlightNodes: [this.root.id],
            nodeStates: { [this.root.id]: 'found' },
            treeSnapshot: this.cloneRoot(),
            sound: 'success',
            isTerminal: true
        });
        return steps;
    }

    generateCountNodesSteps() {
        const steps = [];
        const count = this.countNodes();
        steps.push({
            action: 'count-nodes',
            description: `Total nodes count = ${count}.`,
            why: 'Every node in the tree was traversed and tallied.',
            pseudocodeLine: 1,
            pythonLine: 2,
            nodeStates: {},
            treeSnapshot: this.cloneRoot(),
            sound: 'success',
            isTerminal: true
        });
        return steps;
    }

    generateCountLeavesSteps() {
        const steps = [];
        const leaves = [];
        const collectLeaves = (node) => {
            if (!node) return;
            if (!node.left && !node.right) leaves.push(node);
            collectLeaves(node.left);
            collectLeaves(node.right);
        };
        collectLeaves(this.root);

        const states = {};
        leaves.forEach(l => { states[l.id] = 'found'; });

        steps.push({
            action: 'count-leaves',
            description: `Leaf nodes count = ${leaves.length}. Leaves: [ ${leaves.map(l => l.value).join(', ')} ]`,
            why: 'Leaf nodes have zero children (both left and right pointers are NULL).',
            pseudocodeLine: 1,
            pythonLine: 2,
            highlightNodes: leaves.map(l => l.id),
            nodeStates: states,
            treeSnapshot: this.cloneRoot(),
            sound: 'success',
            isTerminal: true
        });
        return steps;
    }
}

// Export for Node.js test environment or browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BinarySearchTree, BSTNode };
}
