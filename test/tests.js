/**
 * Linked List Learning Simulator - Automated Test Suite
 * Tests all 4 types of Linked Lists:
 * 1. SinglyLinkedList (SLL)
 * 2. DoublyLinkedList (DLL)
 * 3. CircularSinglyLinkedList (CSLL)
 * 4. CircularDoublyLinkedList (CDLL)
 *
 * Runs in Node.js (`node test/tests.js`) and Browser (`test_runner.html`)
 */

(function () {
    let SLLClass, DLLClass, CSLLClass, CDLLClass;

    if (typeof require !== 'undefined') {
        const models = require('../script.js');
        SLLClass = models.SinglyLinkedList;
        DLLClass = models.DoublyLinkedList;
        CSLLClass = models.CircularSinglyLinkedList;
        CDLLClass = models.CircularDoublyLinkedList;
    } else {
        SLLClass = window.SinglyLinkedList;
        DLLClass = window.DoublyLinkedList;
        CSLLClass = window.CircularSinglyLinkedList;
        CDLLClass = window.CircularDoublyLinkedList;
    }

    const testResults = [];

    function assert(condition, testName, message = '') {
        if (condition) {
            testResults.push({ name: testName, status: 'PASS', message });
        } else {
            testResults.push({ name: testName, status: 'FAIL', message: message || 'Assertion failed' });
        }
    }

    function runAllTests() {
        testResults.length = 0;

        // ==========================================
        // 1. SINGLY LINKED LIST (SLL) TESTS
        // ==========================================
        const sll = new SLLClass();
        assert(sll.length === 0 && sll.head === null && sll.tail === null, 'SLL: Initialized empty');

        // Insert operations
        sll.insertEnd(10);
        sll.insertEnd(20);
        sll.insertEnd(30);
        assert(JSON.stringify(sll.toArray()) === JSON.stringify([10, 20, 30]), 'SLL: InsertEnd creates [10, 20, 30]');
        assert(sll.length === 3 && sll.head.value === 10 && sll.tail.value === 30, 'SLL: Head is 10, Tail is 30, Length is 3');

        sll.insertBeginning(5);
        assert(sll.head.value === 5 && sll.length === 4, 'SLL: InsertBeginning 5 updates head');
        assert(JSON.stringify(sll.toArray()) === JSON.stringify([5, 10, 20, 30]), 'SLL: Array is [5, 10, 20, 30]');

        sll.insertAt(15, 2);
        assert(JSON.stringify(sll.toArray()) === JSON.stringify([5, 10, 15, 20, 30]), 'SLL: InsertAt index 2 -> [5, 10, 15, 20, 30]');
        assert(sll.length === 5, 'SLL: Length is 5');

        // Search & Update
        assert(sll.search(15).index === 2, 'SLL: Search 15 finds index 2');
        assert(sll.search(999).index === -1, 'SLL: Search non-existent 999 returns index -1');
        assert(sll.updateAt(2, 18) === true, 'SLL: Update index 2 to 18 succeeds');
        assert(sll.search(18).index === 2, 'SLL: Search 18 finds index 2 after update');

        // Delete operations
        const delHead = sll.deleteBeginning();
        assert(delHead.value === 5 && sll.head.value === 10, 'SLL: DeleteBeginning returns 5 and head becomes 10');

        const delTail = sll.deleteEnd();
        assert(delTail.value === 30 && sll.tail.value === 20, 'SLL: DeleteEnd returns 30 and tail becomes 20');

        const delMid = sll.deleteAt(1); // was [10, 18, 20] -> deleting index 1 (18)
        assert(delMid.value === 18, 'SLL: DeleteAt index 1 returns 18');
        assert(JSON.stringify(sll.toArray()) === JSON.stringify([10, 20]), 'SLL: List is now [10, 20]');

        // Reverse
        sll.reverse();
        assert(JSON.stringify(sll.toArray()) === JSON.stringify([20, 10]), 'SLL: Reverse [10, 20] becomes [20, 10]');
        assert(sll.head.value === 20 && sll.tail.value === 10, 'SLL: Reverse properly swaps head and tail');

        // Delete remaining
        sll.deleteBeginning();
        sll.deleteBeginning();
        assert(sll.length === 0 && sll.head === null && sll.tail === null, 'SLL: Emptied list has null head and tail');
        assert(sll.deleteBeginning() === null, 'SLL: DeleteBeginning on empty returns null');
        assert(sll.deleteEnd() === null, 'SLL: DeleteEnd on empty returns null');

        // ==========================================
        // 2. DOUBLY LINKED LIST (DLL) TESTS
        // ==========================================
        const dll = new DLLClass();
        assert(dll.length === 0 && dll.head === null && dll.tail === null, 'DLL: Initialized empty');

        dll.insertEnd(100);
        assert(dll.head.value === 100 && dll.tail.value === 100 && dll.head.prev === null && dll.head.next === null, 'DLL: Single node has null prev and next');

        dll.insertEnd(200);
        dll.insertEnd(300);
        assert(JSON.stringify(dll.toArray()) === JSON.stringify([100, 200, 300]), 'DLL: InsertEnd [100, 200, 300]');
        assert(dll.tail.prev.value === 200 && dll.tail.prev.prev.value === 100, 'DLL: Backward traversal pointers are correct');

        dll.insertBeginning(50);
        assert(dll.head.value === 50 && dll.head.next.value === 100 && dll.head.next.prev.value === 50, 'DLL: InsertBeginning properly updates head and next.prev');

        dll.insertAt(150, 2);
        assert(JSON.stringify(dll.toArray()) === JSON.stringify([50, 100, 150, 200, 300]), 'DLL: InsertAt index 2 [50, 100, 150, 200, 300]');
        // Verify bidirectional integrity at index 2
        const n150 = dll.head.next.next;
        assert(n150.value === 150 && n150.prev.value === 100 && n150.next.value === 200, 'DLL: Bidirectional integrity verified at inserted node');

        // Delete operations
        const dllDelHead = dll.deleteBeginning();
        assert(dllDelHead.value === 50 && dll.head.value === 100 && dll.head.prev === null, 'DLL: DeleteBeginning resets head.prev to null');

        const dllDelTail = dll.deleteEnd();
        assert(dllDelTail.value === 300 && dll.tail.value === 200 && dll.tail.next === null, 'DLL: DeleteEnd resets tail.next to null');

        const dllDelMid = dll.deleteAt(1); // delete 150 from [100, 150, 200]
        assert(dllDelMid.value === 150, 'DLL: DeleteAt index 1 returns 150');
        assert(JSON.stringify(dll.toArray()) === JSON.stringify([100, 200]), 'DLL: List is now [100, 200]');
        assert(dll.head.next.value === 200 && dll.tail.prev.value === 100, 'DLL: Remaining nodes properly linked both ways');

        // Reverse DLL
        dll.reverse();
        assert(JSON.stringify(dll.toArray()) === JSON.stringify([200, 100]), 'DLL: Reverse produces [200, 100]');
        assert(dll.head.value === 200 && dll.tail.value === 100 && dll.head.prev === null && dll.tail.next === null, 'DLL: Reverse boundaries correct');

        // ==========================================
        // 3. CIRCULAR SINGLY LINKED LIST (CSLL) TESTS
        // ==========================================
        const csll = new CSLLClass();
        assert(csll.length === 0 && csll.head === null, 'CSLL: Initialized empty');

        csll.insertEnd(1);
        assert(csll.length === 1 && csll.head.value === 1 && csll.tail.value === 1, 'CSLL: Single node added');
        assert(csll.head.next === csll.head && csll.tail.next === csll.head, 'CSLL: Single node next points to itself (circular)');

        csll.insertEnd(2);
        csll.insertEnd(3);
        assert(JSON.stringify(csll.toArray()) === JSON.stringify([1, 2, 3]), 'CSLL: InsertEnd creates [1, 2, 3]');
        assert(csll.tail.next === csll.head, 'CSLL: Tail.next points to head');

        csll.insertBeginning(0);
        assert(csll.head.value === 0 && csll.tail.next === csll.head, 'CSLL: InsertBeginning 0 updates head and tail.next');
        assert(JSON.stringify(csll.toArray()) === JSON.stringify([0, 1, 2, 3]), 'CSLL: Array is [0, 1, 2, 3]');

        csll.insertAt(99, 2);
        assert(JSON.stringify(csll.toArray()) === JSON.stringify([0, 1, 99, 2, 3]), 'CSLL: InsertAt index 2 -> [0, 1, 99, 2, 3]');
        assert(csll.tail.next === csll.head, 'CSLL: Circular link intact after insertAt');

        // Search with cycle guard
        assert(csll.search(99).index === 2, 'CSLL: Search 99 finds index 2 without looping');
        assert(csll.search(777).index === -1, 'CSLL: Search absent value terminates safely at index -1');

        // Delete operations
        const csllDelHead = csll.deleteBeginning();
        assert(csllDelHead.value === 0 && csll.head.value === 1 && csll.tail.next === csll.head, 'CSLL: DeleteBeginning preserves circular tail.next');

        const csllDelTail = csll.deleteEnd();
        assert(csllDelTail.value === 3 && csll.tail.value === 2 && csll.tail.next === csll.head, 'CSLL: DeleteEnd preserves circular tail.next');

        const csllDelMid = csll.deleteAt(1); // delete 99 from [1, 99, 2]
        assert(csllDelMid.value === 99, 'CSLL: DeleteAt middle returns 99');
        assert(JSON.stringify(csll.toArray()) === JSON.stringify([1, 2]), 'CSLL: List is [1, 2]');
        assert(csll.tail.next === csll.head, 'CSLL: Circular link maintained');

        // Delete down to empty
        csll.deleteBeginning();
        csll.deleteBeginning();
        assert(csll.length === 0 && csll.head === null && csll.tail === null, 'CSLL: Emptied list has null pointers');

        // ==========================================
        // 4. CIRCULAR DOUBLY LINKED LIST (CDLL) TESTS
        // ==========================================
        const cdll = new CDLLClass();
        assert(cdll.length === 0 && cdll.head === null, 'CDLL: Initialized empty');

        cdll.insertEnd(10);
        assert(cdll.length === 1 && cdll.head.value === 10 && cdll.tail.value === 10, 'CDLL: Single node');
        assert(cdll.head.next === cdll.head && cdll.head.prev === cdll.head, 'CDLL: Single node next and prev point to itself');

        cdll.insertEnd(20);
        cdll.insertEnd(30);
        assert(JSON.stringify(cdll.toArray()) === JSON.stringify([10, 20, 30]), 'CDLL: InsertEnd creates [10, 20, 30]');
        assert(cdll.tail.next === cdll.head && cdll.head.prev === cdll.tail, 'CDLL: Circular next & prev are linked');

        cdll.insertBeginning(5);
        assert(cdll.head.value === 5 && cdll.tail.next === cdll.head && cdll.head.prev === cdll.tail, 'CDLL: InsertBeginning preserves bidirectional circularity');
        assert(JSON.stringify(cdll.toArray()) === JSON.stringify([5, 10, 20, 30]), 'CDLL: Array is [5, 10, 20, 30]');

        cdll.insertAt(15, 2);
        assert(JSON.stringify(cdll.toArray()) === JSON.stringify([5, 10, 15, 20, 30]), 'CDLL: InsertAt 2 -> [5, 10, 15, 20, 30]');
        assert(cdll.tail.next === cdll.head && cdll.head.prev === cdll.tail, 'CDLL: Tail-Head cycle intact after insertAt');

        // Search & Update
        assert(cdll.search(15).index === 2, 'CDLL: Search 15 finds index 2');
        assert(cdll.search(888).index === -1, 'CDLL: Search non-existent 888 returns -1');
        assert(cdll.updateAt(2, 25) === true, 'CDLL: Update index 2 to 25 succeeds');
        assert(cdll.search(25).index === 2, 'CDLL: Search updated value 25 finds index 2');

        // Delete operations
        const cdllDelHead = cdll.deleteBeginning();
        assert(cdllDelHead.value === 5 && cdll.head.value === 10, 'CDLL: DeleteBeginning returns 5');
        assert(cdll.head.prev === cdll.tail && cdll.tail.next === cdll.head, 'CDLL: Head prev is tail and tail next is head');

        const cdllDelTail = cdll.deleteEnd();
        assert(cdllDelTail.value === 30 && cdll.tail.value === 20, 'CDLL: DeleteEnd returns 30');
        assert(cdll.tail.next === cdll.head && cdll.head.prev === cdll.tail, 'CDLL: Circular links intact after deleteEnd');

        const cdllDelMid = cdll.deleteAt(1); // delete 25 from [10, 25, 20]
        assert(cdllDelMid.value === 25, 'CDLL: DeleteAt middle returns 25');
        assert(JSON.stringify(cdll.toArray()) === JSON.stringify([10, 20]), 'CDLL: Array is [10, 20]');
        assert(cdll.head.next.value === 20 && cdll.tail.prev.value === 10, 'CDLL: Inner links intact');
        assert(cdll.head.prev === cdll.tail && cdll.tail.next === cdll.head, 'CDLL: Outer circular links intact');

        // Delete to empty
        cdll.deleteBeginning();
        cdll.deleteBeginning();
        assert(cdll.length === 0 && cdll.head === null && cdll.tail === null, 'CDLL: Emptied list has null pointers');

        return testResults;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { runAllTests, testResults };
    }

    if (typeof window !== 'undefined') {
        window.runAllTests = runAllTests;
        window.testResults = testResults;
    }

    if (typeof require !== 'undefined' && require.main === module) {
        console.log('Running Linked List Simulator Test Suite...');
        const results = runAllTests();
        let pass = 0, fail = 0;
        for (const res of results) {
            if (res.status === 'PASS') {
                pass++;
                console.log(`  ✓ ${res.name}`);
            } else {
                fail++;
                console.error(`  ✗ ${res.name}: ${res.message}`);
            }
        }
        console.log(`\nTest Summary: ${pass} Passed, ${fail} Failed out of ${results.length} tests.`);
        if (fail > 0) process.exit(1);
    }
})();
