
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
    constructor(horizontalArr, verticalArr,miniCanvas) {
        this.horizontalArr = horizontalArr;
        this.verticalArr = verticalArr;
        this.miniCanvas = miniCanvas;
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

        let newNode = new Node(this.verticalArr[row].value, this.horizontalArr[col].value, data)

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
            while (temp.right != null && temp.right.col.data < col) {
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
            while (temp.bottom != null && temp.bottom.row.data < row) {
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



    deleteNode(row, col) {

        if (!this.verticalArr[row].next || this.verticalArr[row].next.row > row) {
            // not found
        }
        let temp = this.verticalArr[row].next;

        if (this.verticalArr[row].next.col == col) {
            // first element of row

            temp.right ? temp.right.left = null : "";

            this.horizontalArr[col].next == temp ? this.horizontalArr[col].next = temp.bottom : this.horizontalArr[col].next = null;
            this.verticalArr[row].next = temp.right;
        }
        else {
            // found else where

            while (temp != null && temp.col != col) {
                temp = temp.right;
            }

            temp.left ? temp.left.right = temp.right : ""
            temp.right ? temp.right.left = temp.left : ""
        }

        temp.top ? temp.top.bottom = temp.bottom : "";
        temp.bottom ? temp.bottom.top = temp.top : "";

        temp.left = null;
        temp.right = null;
        temp.top = null;
        temp.bottom = null;

    }


    insertARow(ind){
        this.miniCanvas.updateVerticalArrFromIndBy1(ind)
    }


    insertACellInRowBeforeInd(row,col,value){
        
        let newNode = new Node(this.verticalArr[row].value, this.horizontalArr[col].value, value);

        let temp = this.verticalArr[row].next;
        console.log(temp)

        while(temp.right!=null && temp.col < col){
            temp=temp.right;
        }
        if(temp.right== null){
            this.createNewNode(row,col,value)
            console.log("here")
            return;
        }

        let currEle = temp;

        let topOfCurr = currEle.top;
        let bottomOfCurr = currEle.bottom;
        let leftOfCurr = currEle.left;
        let rightOfCurr = currEle.right;
        
        if(leftOfCurr){

            leftOfCurr.right = newNode;
        } 
        newNode.left = leftOfCurr;
        newNode.right = currEle;
        currEle.left = newNode;

        newNode.top = topOfCurr;
        newNode.bottom = bottomOfCurr;

        topOfCurr.bottom = newNode;
        bottomOfCurr.top = newNode;

        temp = currEle;
        let nextEle = rightOfCurr;

        console.log(temp)

        while(temp.right!=null ){
            let ind = temp.col.data + 1 ;
            console.log(ind)
            console.log(temp.col)

            temp.col = this.horizontalArr[ind].value;
            temp.top = nextEle.top;
            temp.bottom = nextEle.bottom;
            nextEle=nextEle.right;
            temp=temp.right;
        }

        
    }



}

