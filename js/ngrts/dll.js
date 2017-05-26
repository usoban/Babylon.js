// ============================================
//  Fucking double linked list data structure.
// ============================================
function DoubleLinkedList () {
    this.head    = DoubleLinkedList.createNode(); // Head is always empty.
    this.tail    = this.head; // TODO: I don't think this should actually be the case ..... this is circullary connected??!!
                             //        if you check the tail, i think it should actually be empty if the list is empty;
                             //        so in the current implementation, you should only check emptiness via empty() function!!!
}

/**
 * Test whether a list is empty (only has an empty head and tail).
 */
DoubleLinkedList.prototype.isEmpty = function () {
  return this.head === this.tail;
};

/**
 * Adds a new node as the tail.
 */
DoubleLinkedList.prototype.append = function (value) {
  this.insertAfter(this.tail, value);
};

/**
 * Returns the first value of the list.
 */
DoubleLinkedList.prototype.firstValue = function () {
  return this.head.next.value;
};

/**
 * Returns the last value of the list.
 */
DoubleLinkedList.prototype.lastValue = function () {
  return this.tail.value;
};

/**
 * Inserts new node after a given node.
 */
DoubleLinkedList.prototype.insertAfter = function (afterNode, value) {
  var currentNextNode = afterNode.next,
      nextNode = DoubleLinkedList.createNode(value, afterNode, currentNextNode);

  afterNode.next = nextNode;

  if (currentNextNode !== null) {
    currentNextNode.prev = nextNode;
  } else {
    // 'afterNode' is actually a tail ...
    // ... set 'nextNode' as the new tail of the list.
    this.tail = nextNode;
  }

  return nextNode;
};

DoubleLinkedList.prototype.insertAfterAndDisposeTail = function (afterNode, value) {
  var newTailNode;

  if (afterNode === null) {
    afterNode = this.head;
  }

  newTailNode = this.insertAfter(afterNode, value);

  if (newTailNode.next !== null) {
    // Unlink current tail from the new tail node.
    newTailNode.next.prev = null;
    // Unlink current tail.
    newTailNode.next = null;
    // Make new tail actually the new tail :)
    this.tail = newTailNode;
  }
};

/**
 * Start a search forwards, and returns a node which satisfies a given predicate.
 *
 * If no such node exists, returns null.
 */
DoubleLinkedList.prototype.find = function (predicate) {
  var node = this.head.next;

  while (node != null) {
    if (predicate(node)) {
      return node;
    }

    node = node.next;
  }

  return null;
};

/**
 * Start a search backwards, and returns a node which satisfies a given predicate.
 *
 * If no such node exists, returns null.
 */
DoubleLinkedList.prototype.findBackwards = function (predicate) {
  var node = this.tail;

  while (node !== null && node !== this.head) {
    if (predicate(node)) {
      return node;
    }

    node = node.prev;
  }

  return null;
};

DoubleLinkedList.prototype.length = function () {
  var node = this.head.next,
      count = 0;

  while (node !== null) {
    count++;
    node = node.next;
  }

  return count;
};

/**
 * Removes the first element of the list, and points the head to currently
 * second element in the list, which becomes new first element.
 */
DoubleLinkedList.prototype.shortenFront = function () {
  var newFirst;

  if (this.isEmpty()) {
    // Nothing to do, list is empty;
    return;
  }

  // discover the next first element.
  newFirst = this.head.next.next;
  // wire next first element to the head of the list (backward link)
  newFirst.prev = this.head;
  // unlink current first element.
  this.head.next.next = null;
  this.head.next.prev = null;
  // link head to the new first element.
  this.head.next = newFirst;
};

// TODO: DoubleLinkedList.prototype.insertBefore(beforeNode, value)

/**
 * A convenient static function for creating new DLL nodes.
 */
DoubleLinkedList.createNode = function (value, prev, next) {
    return {
      value: value || null,
      prev: prev || null,
      next: next || null
    };
};
