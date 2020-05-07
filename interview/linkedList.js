class Node {
    // constructor 
    constructor(value) {
        this.value = value;
        this.next = null
    }
}

class LinkedList {

    constructor() {
        this.head = null;
        this.size = 0;
    }

    //size() - returns number of data values in list
    size() {
        return this.size;
    }

    //  empty() - bool returns true if empty
    empty() {
        return this.size === 0;
    }

    //  value_at(index) - returns the value of the nth item (starting at 0 for first)
    value_at(index) {

        if (index < 0 || index > this.size - 1) {
            throw "Index out of bounds";
        }
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current.value;
    }

    //  push_front(value) - adds an item to the front of the list returns length
    push_front(value) {
        const node = new Node(value);
        if (this.head !== null) {
            const next = this.head;
            this.head = node;
            this.head.next = next;
        } else {
            this.head = node;
        }

        this.size++;
    }

    //  pop_front() - remove front item and return its value
    pop_front() {
        if (this.size) {
            const head = this.head;
            this.head = this.head.next;
            this.size--;
            return head.value;
        } else throw "Linked list is already empty"
    }

    //  push_back(value) - adds an item at the end
    push_back(value) {
        const node = new Node(value);
        if (this.head !== null) {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = node;
        } else {
            this.head = node;
        }

        this.size++;
    }

    //  pop_back() - removes end item and returns its value
    pop_back() {
        if (this.size) {
            let current = this.head, prev = null;
            if (this.size === 1) {
                this.head = null;

            } else {
                while (current.next) {
                    prev = current
                    current = current.next;
                }
                prev.next = null;
            }
            this.size--;
            return current.value;
        } else throw "Linked list is already empty"
    }

    //  front() - get value of front item
    front() {
        if (this.size) {
            return this.head.value
        } else throw "Linked list is empty"
    }

    //  back() - get value of end item
    back() {
        if (this.size) {
            let current = this.head, prev;
            while (current.next) {
                prev = current
                current = current.next;
            }
            return current.value;
        } else throw "Linked list is empty"
    }
    //  insert(index, value) - insert value at index, so current item at that index is pointed to by new item at index
    insert(index, value) {
        if (index < 0 && index > this.size) {
            throw "Index out of bounds";
        }
        let node = new Node(value);
        let current = this.head;
        this.size++;
        if (index === 0) {
            this.head = node;
            this.head.next = current;
            return;
        }
        let prev;
        for (let i = 0; i < index; i++) {
            prev = current;
            current = current.next;
        }
        prev.next = node
        node.next = current
    }

    //  erase(index) - removes node at given index
    erase(index) {
        if (index < 0 || index > this.size - 1 || !this.size) {
            throw "Index out of bounds";
        }
        let current = this.head;
        this.size--;
        if (this.size === 1) {
            this.head = null;
            return;
        }
        if (index === 0) {
            this.head = this.head.next;
            return;
        }
        let prev;
        for (let i = 0; i < index; i++) {
            prev = current;
            current = current.next;
        }
        prev.next = current.next
    }
    //  value_n_from_end(n) - returns the value of the node at nth position from the end of the list
    value_n_from_end(n) {
        return this.value_at(this.size - n - 1)
    }
    //  reverse() - reverses the list
    reverse() {
        let current = this.head, prev, next = null;
        while (current) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.head = prev;
    }
    //  remove_value(value) - removes the first item in the list with this value
    remove_value(value) {
        if (this.size) {
            let current = this.head, prev = null;
            while (current) {
                if (current.value === value && prev === null) {
                    this.head = current.next;
                    this.size--;
                } else if (current.value === value) {
                    prev.next = current.next;
                    this.size--;
                }
                prev = current;
                current = current.next;
            }

        } else throw "Linked list is empty"
    }
}


a = new LinkedList()
a.push_front(6)
a.push_front(5)
a.push_front(6)
a.push_front(5)
a.push_front(6)
a.push_front(5)
a.push_front(6)
a.push_front(5)
a.pop_front()
a.pop_front()
a.push_back(542651265465)
a.pop_back()