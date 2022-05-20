// taken from https://www.youtube.com/watch?v=ZBdE8DElQQU&t=1067s
export class LinkedList {
  size = 0;
  #head = null;

  get isEmpty() {
    return this.size === 0;
  }

  get head() {
    return this.#head;
  }

  set head(node) {
    this.#head = node;
    // if (node === null) debugger;
  }

  push(node) {
    if (this.head === null) {
      this.head = node;
      node.next = null;
    } else {
      let current = this.getNodeAt(this.size - 1);
      current.next = node;
    }
    this.size += 1;
    return this.size;
  }

  remove(index = 0) {
    // guard clauses
    if (index < 0 || index >= this.size) return null;

    // start at the top of the list
    let removedNode = this.head;

    // special case where we are removing the head
    if (index === 0) return (this.head = this.head.next);

    // otherwise find the prior node to the one being deleted and set the next to be the next of the deleted node
    let previous = this.getNodeAt(index - 1);
    removedNode = previous.next;
    previous.next = removedNode.next ? removedNode.next : null;

    this.size -= 1;
    return removedNode;
  }

  toString() {
    if (!this.size) return "";

    let str = `${this.head.el}`;
    let current = this.head;

    for (let i = 0; i < this.size - 1; i++) {
      current = current.next;
      str += `,${current.el}`;
    }
    return str;
  }

  print() {
    let arr = [];
    if (this.size) {
      let current = this.head;
      for (let i = 0; i < this.size; i++) {
        arr.push(current ?? "no node found");
        current = current.next;
      }
    }
    console.log(arr);
  }

  printChainID() {
    // debugger;
    console.log("***********");
    let id = 0;
    let tmp = [];
    try {
      this.forEach((n) => {
        id += 1;
        if (tmp.find((el) => el === n.id)) throw new Error(`Recursion found at ${n.id}, it has already been printed`);
        console.log(id + ". node id " + n.id + ", payload.next " + n.payload.next);
        if (id === 100) {
          debugger;
          throw new Error("Error, over 100 iterations reached, aborting");
        }
        tmp.push(n.id);
      });
    } catch (error) {
      console.log(error.message);
    }
    console.log("***********");
    // debugger;
  }

  // note that this is for a new node only
  insert(node, index = 0) {
    if (index < 0 || index > this.size) return false;
    // const node = this.createNode(el);

    if (index === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let previous = this.getNodeAt(index - 1);
      node.next = previous.next;
      previous.next = node;
    }
    // debugger;
    console.log("inserted node " + node.id);
    this.size += 1;
    return true;
  }

  reorder() {
    // debugger;
    // no point in reordering if the list only has one node
    if (this.size < 2) return;
    console.log(`Reordering the ${this.size} children of node ${this.head.parent.payload.text}`);

    // we need to dump the nodes in a map as the order will change as we move and iterate
    let arr = [];
    this.forEach((n) => arr.push(n));

    // find the true head of the linked list
    let node = arr[0];

    // Find the head
    let i = 0;
    console.log(`Reordering the nodes starting at node: ${node.id} ${node.payload.text}`);
    while (node) {
      console.log();
      this.head = node;
      node = arr.find((n) => n.payload.next === node.id);
      i++;
      if (i > 1000) {
        debugger;
        return alert("too many iterations");
      }
    }
    console.log(`Head of the linked list located at node id: ${this.head.id}`);

    // Remove the head from the array
    arr.splice(
      arr.findIndex((n) => n.id === this.head.id),
      1
    );

    // Recreate the chain
    let current = this.head;
    i = 0;
    while (current) {
      if (current.payload.next === null) {
        current.next = null;
        console.log(`End of the linked list gracefully reached. ${current.id} does not have a next value`);
        break;
      }
      let index = arr.findIndex((n) => n.id === current.payload.next);
      if (index === -1) {
        current.next = null;
        console.error(`chain broken looking for ${current.payload.next}`);
        break;
      } else {
        current.next = arr[index];
        current = current.next;
        arr.splice(index, 1);
      }
      i++;
      if (i > 1000) debugger;
    }
    // Stick the stragglers at the back and update the API such that the new order is persisted
    if (arr.length) {
      console.log(arr[0].parent.id + " has orphaned children");
      window.app.persist = true;
      arr.forEach((n) => {
        current.next = n;
        current = n;
        current.next = null;
      });
    }

    if (window.app.debug) {
      this.printChainID();
      console.log("operation succeeded!");
    }
  }

  get(index) {
    const node = this.getNodeAt(index);
    return node ? node.el : null;
  }

  getNodeAt(index) {
    if (index === undefined || index < 0 || index >= this.size) return null;

    if (index === 0) return this.head;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      if (current.next === null) debugger;

      current = current.next;
    }
    return current;
  }

  // Used to slot in a node after its prior
  indexOf(node) {
    var current = this.head;
    for (let i = 0; i < this.size; i++) {
      // console.log('node: ' + current.id);
      if (current.id === node.id) return i;
      current = current.next;
    }
    return -1;
  }

  contains(el) {
    return this.indexOf(el) != -1;
  }

  // ADDED BY DE SEPT 21
  values() {
    var arr;
    this.forEach((current) => {
      arr.push(current.el);
    });

    return arr;
  }

  *[Symbol.iterator]() {
    // define the default iterator for this class
    let node = this.head; // get first node
    while (node) {
      // while we have not reached the end of the list
      yield node; // ... yield the current node's data
      node = node.next; // and move to the next node
    }
  }

  forEach_without_iterator(cb) {
    let current = this.head;
    // I am not sure whether this will always loop through all the entries or whether it can be escaped
    while (current) {
      cb(current);
    }
  }

  //https://stackoverflow.com/questions/64198952/how-to-implement-foreach-loop-for-a-javascript-linked-list
  forEach(cb) {
    for (let head of this) cb(head);
  }

  has(id) {
    for (let head of this) {
      if (head.id === id) return true;
    }
    return false;
  }

  getNodeID(id) {
    for (let head of this) {
      if (head.id === id) return head;
    }
    return;
  }

  getPrevious(id) {
    for (let head of this) {
      if (!head.next) continue;
      // console.log('node id = ' + id + ' next node id = ' + head.next.id);
      if (head.next.id === id) {
        console.log(id + " prior found in node id = " + head.id);
        return head;
      }
    }
    console.log(id + " prior not found!");
    return;
  }

  // flying by the seat of my pants here
  // ! test that the foreach loop is escaped
  delete(id) {
    let index = 0;
    this.forEach((node) => {
      if (node.id === id) return this.remove(index);
      index++;
    });
    return;
  }
}
/**
 * @param  {} where clause in the SQL
 * @param  {} data key value pair to filter the update statement
 */
