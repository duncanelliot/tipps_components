// Taken from the website https://www.youtube.com/watch?v=F3zGFmPWQVU&t=18s
import { fetchWrapper } from "../../../../../utils/index.js";
import { LinkedList } from "./clsLinkedList.js";

const eTypes = {
  question: 10,
  answer: 20,
  // t_and_cs: 30,
  // info: 40,
};

export class Tree {
  children = new LinkedList();
  parent = null;
  id = "root"; //uniqueID();
  type = "";
  subtype = "";
  // hash sign makes the member private, you need a getter and setter to access them
  #next = null;
  payload = { text: null, next: null };

  constructor(id) {
    // if (!id || typeof id !== 'number' || id === 0) {
    //   throw new Error('id must be a number greater than 0');
    // }
    this.id = id;
  }
  get next() {
    return this.#next;
  }

  set next(node) {
    let next_node_id = node ? node.id : null;

    // guard clause
    if (next_node_id == this.id) {
      console.log("circular reference");
      debugger;
    }

    // update the private member
    this.#next = node;

    // if we are in persist mode, the changes are pushed to the database
    // if (window.app.persist & !(this.#next === null)) {
    if (window.app.persist) {
      fetchWrapper.put(`/cms/journey/message/next`, { data: { next: next_node_id }, where: { id: this.id } });

      // fetchWrapper.put('/cms/journey/message/next', { message_id: this.id, next_message_id: next_node_id });
    }
  }

  get parentNode() {
    return this.parent;
  }

  set parentNode(newParent) {
    if (newParent !== this.parentNode && (newParent === null || newParent instanceof Tree)) {
      // if the node having its parent changed already has a parent, we must remove it from the parent node
      if (this.parent) {
        this.parent.deleteChildNode(this);
      }

      this.parent = newParent;

      // we need to add the node to the map of the newParent
      if (newParent) {
        newParent.appendChildNode(this);
      }
    }
  }

  updateParentNode(newParent, position) {
    // check that we either got a null parent or a parent of type tree
    if (!(newParent === null || newParent instanceof Tree)) return;

    // check that we are not assigning the same parent
    let lateral_move = this.parentNode.id === newParent.id;

    // Remove the node from it's old parent
    if (this.parent) this.parent.children.delete(this.id);

    // update the node's parent
    if (!lateral_move) {
      this.parent = newParent;
      fetchWrapper.put("/cms/journey/message/parent", {
        data: { parent_id: newParent.id },
        where: { id: this.id },
      });
    }

    // set the position here
    newParent.children.insert(this, position);
  }

  get children() {
    // return Array.from(this.children.values());
    return this.children.values();
  }

  get childrenCount() {
    return this.children.size;
  }

  createChildNode(id, payload = {}, type, subtype) {
    console.log(`creating child node id ${id} and attaching it to ${this.id}`);
    const newNode = new Tree(id);

    newNode.payload = payload;

    newNode.parentNode = this;

    if (type) newNode.type = type;
    if (subtype) newNode.subtype = subtype;

    return newNode;
  }

  //* OK
  getTreeString = (node, spaceCount = 0) => {
    let str = "\n";
    node.children.forEach((child) => {
      str += `${"  ".repeat(spaceCount)}${child.id}${this.getTreeString(child, spaceCount + 2)}`;
    });
    return str;
  };

  //* OK
  getNodeIds = (node, node_list = []) => {
    node_list.push(node.id);
    node.children.forEach((child) => {
      child.getNodeIds(child, node_list);
    });
    return node_list;
  };

  //* OK
  getChildNode(id) {
    for (let child of this.children) {
      if (child.id === id) {
        return child;
      }
    }
  }

  //* OK
  print() {
    console.log(` \n${this.id}${this.getTreeString(this, 2)}`);
  }

  //! Not sure this will work with the linked list
  hasChildNode(id) {
    // if we supplied a node then simply ...
    if (id instanceof Tree) {
      return this.children.has(id.id);
    }

    // if we supplied a string or number, loop through the nodes and check
    for (let child of this.children) {
      if (child.id === id) return true;
    }
    return false;
  }

  appendChildNode(node) {
    if (!(node instanceof Tree) || this.hasChildNode(node)) {
      return;
    }
    if (node === this) throw new Error("Node cannot contain itself");

    let parent = this.parentNode;
    while (parent !== null) {
      if (parent === node) throw new Error("Child node cannot be one of its ancestors!");
      parent = parent.parentNode;
    }

    this.children.push(node);
    node.parentNode = this;
  }

  deleteChildNode(id) {
    id = parseInt(id);

    // check whether this node is a child of ours
    if (!this.hasChildNode(id)) return;

    // persist the change to the database
    let node = this.getChildNode(id);
    let node_list = this.getNodeIds(node);

    // get all the descendant nodes
    node_list.forEach((id) => {
      fetchWrapper.put("/cms/journey/message/delete", { where: { id: id } });
    });
    // remove the reference in the data structure
    this.children.delete(id);
  }

  traverse(cb) {
    for (let child of this.children) {
      // this next line of code allows us to escape the iteration as we have found what we were looking for
      if (cb(child) === true || child.traverse(cb) === true) {
        return true;
      }
    }
  }

  //* OK
  findNodeByid(id) {
    id = parseInt(id);

    let foundNode = null;

    if (this.id === id) return this;

    this.traverse((node) => {
      if (node.id === id) {
        foundNode = node;
        return true;
      }
    });
    return foundNode;
  }

  // To output a format that will work with the Tree component
  toArray(node = this, arr = []) {
    let obj = {
      id: node.id,
      parent: node.parent ? node.parent.id : "#",
      next: node.next ? node.next.id : "no next",
      text: node.payload.text,
      type: node.type,
      subtype: node.subtype,
      state: { properties: node.payload.properties },
    };

    if (node.subtype) {
      obj.state.properties.push({ key: "subtype", value: node.subtype });
    }

    arr.push(obj);

    node.children.forEach((child) => {
      child.toArray(child, arr);
    });
    return arr;
  }

  // orders each node's linked list according to its payload.next property
  reorder() {
    // this.children.printChainID();
    // console.log(this.getNodeIds());
    this.children.reorder();
    this.traverse((n) => {
      console.log(n.id);
      // if (n.id === 1033) debugger;
      n.children.reorder();
    });
  }
}

/**
 * @param  {} where clause in the SQL
 * @param  {} data key value pair to filter the update statement
 */

/*
const uniqueID = (() => {
  function* uniqueIdGenerator() {
    let id = Date.now();
    while (true) {
      yield id++;
    }
  }
  const gen = uniqueIdGenerator();
  return () => gen.next().value;
})();
*/
