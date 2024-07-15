
class Node {
    constructor(row, col, data) {
        this.row = row;
        this.col = col;
        this.data = data;
        this.left = null;
        this.right = null;
        this.top = null;
        this.bottom = null;

    }
}

export class LinkedList {

    // Initialize Class Variables
    constructor(horizontalArr, verticalArr) {
        this.horizontalArr = horizontalArr;
        this.verticalArr = verticalArr;
        this.head = null;
        this.size = 0;
    }

    len() {
        return this.size
    }

    isempty() {
        return this.size == 0
    }

    createNewNode(row, col, data) {

        let newNode = new Node(row, col, data)


        //keep the head at first element
        if (this.isempty())
            this.head = newNode;

        //placing along row
        if (!this.verticalArr[row].next) {
            //if first element in row
            this.verticalArr[row].next = newNode;
        }
        else if (this.verticalArr[row].next.col > col) {
            //if first element in row but replaced 
            let tempNode = this.verticalArr[row].next;
            newNode.right = tempNode;
            this.verticalArr[row].next = newNode;
            tempNode.left = newNode;
        }
        else {
            let temp = this.verticalArr[row].next;
            while (temp.right != null && temp.right.data < col) {
                temp = temp.right;
            }
            if (temp.right != null) {
                newNode.right = temp.right;
                temp.right.left = newNode;
            }
            temp.right = newNode;
            newNode.left = temp;
        }

        //placing along column
        if (!this.horizontalArr[col].next) {
            //first element in col
            this.horizontalArr[col].next = newNode;
        } else if (this.horizontalArr[col].next.row > row) {
            //replaced first element in column
            let tempNode = this.horizontalArr[col].next;
            newNode.bottom = tempNode;
            this.horizontalArr[col].next = newNode;
            tempNode.top = newNode;
        }
        else {
            let temp = this.horizontalArr[col].next;
            while (temp.bottom != null && temp.bottom.data < row) {
                temp = temp.bottom;
            }
            if (temp.bottom != null) {
                newNode.bottom = temp.bottom;
                temp.bottom.top = newNode;
            }
            temp.bottom = newNode;
            newNode.top = temp;
        }
        this.size += 1
    }


    deleteNode(row,col){
        
        

    }




}


