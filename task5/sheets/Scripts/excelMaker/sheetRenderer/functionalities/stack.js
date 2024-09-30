export class Stack {
    constructor() {
        this.stack = []; // Internal array to store the stack elements
    }

    // Push an element onto the stack
    push(element) {
        this.stack.push(element);
    }

    // Pop an element from the stack (removes and returns the top element)
    pop() {
        if (this.isEmpty()) {
            return null; // Return null if the stack is empty
        }
        return this.stack.pop();
    }

    // Peek at the top element of the stack (without removing it)
    peek() {
        if (this.isEmpty()) {
            return null; // Return null if the stack is empty
        }
        return this.stack[this.stack.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.stack.length === 0;
    }

    // Return the size of the stack
    size() {
        return this.stack.length;
    }

    // Clear the stack (remove all elements)
    clear() {
        this.stack = [];
    }

    // Print the stack elements
    print() {
        console.log(this.stack.join(' '));
    }
}