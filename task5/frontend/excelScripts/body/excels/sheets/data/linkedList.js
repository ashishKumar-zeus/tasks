

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
    constructor(headerCellsMaker, handleApis) {

        this.headerCellsMaker = headerCellsMaker;
        this.handleApis = handleApis;

        this.head = null;
        this.size = 0;

        this.getUpdatedArray()

    }

    getUpdatedArray() {

        this.horizontalArr = this.headerCellsMaker.getHorizontalArray();
        this.verticalArr = this.headerCellsMaker.getVerticalArray();

    }

    len() {
        return this.size
    }

    isempty() {
        return this.size == 0
    }

    findAtIndex(rowInd, colInd) {
        this.getUpdatedArray();

        if (rowInd >= this.verticalArr.length || colInd >= this.horizontalArr.length) {
            return null;
        }

        let currEle = this.verticalArr[rowInd].next;

        while (currEle && currEle.col.data - 1 < colInd) {
            currEle = currEle.right;
        }

        if (currEle && currEle.col.data - 1 === colInd) {
            // Found data at that position
            return currEle;
        }
        return null;
    }


    getValueAtInd(rowInd, colInd) {

        let currEle = this.findAtIndex(rowInd, colInd);
        if (currEle) {
            return currEle.data;
        }
        return ""
    }



    setValueAtInd(rowInd, colInd, newValue) {

        let currEle = this.findAtIndex(rowInd, colInd);
        if (currEle) {
            if (currEle.data == newValue) {
                return;
            }
            currEle.data = newValue;
        }
        else {
            // console.log(rowInd, colInd, newValue)
            // console.log("new data added")
            this.createNewNode(rowInd + 1, colInd + 1, newValue)
        }


    }


    insertMultipleDataInLL(jsonData, startInd) {

        if (startInd == 0) {

            Object.keys(jsonData[0]).forEach((d, i) => {
                this.createNewNode(1, i + 1, d);;
            });
            startInd++;

        }


        //inserts multiple data from json to LL
        for (let i = 1; i <= jsonData.length; i++) {
            let j = 1;

            Object.keys(jsonData[i - 1]).forEach(key => {

                if (jsonData[i - 1]) {
                    this.createNewNode(i + startInd, j, jsonData[i - 1][key]);
                    j++;
                }

            })

        }

    }




    createNewNode(row, col, data) {

        let rowInd = row - 1;
        let colInd = col - 1;

        // this.ensurePresenceOfNode(row,col);
        this.getUpdatedArray();

        // console.log(rowInd,colInd)

        let newNode = new Node(this.verticalArr[rowInd].value, this.horizontalArr[colInd].value, data)
        // console.log("new node created at", this.verticalArr[rowInd].value, this.horizontalArr[colInd].value, data)
        //keep the head at first element
        if (this.isempty())
            this.head = newNode;

        //placing along row
        if (!this.verticalArr[rowInd].next) {
            //if first element in row
            this.verticalArr[rowInd].next = newNode;
        }
        else if (this.verticalArr[rowInd].next.col > col) {
            //if first element in row but replaced
            let tempNode = this.verticalArr[row].next;
            newNode.right = tempNode;
            this.verticalArr[rowInd].next = newNode;
            tempNode.left = newNode;
        }
        else {
            let temp = this.verticalArr[rowInd].next;
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
        if (!this.horizontalArr[colInd].next) {
            //first element in col
            this.horizontalArr[colInd].next = newNode;
        } else if (this.horizontalArr[colInd].next.row.data > row) {
            //replaced first element in column
            let tempNode = this.horizontalArr[colInd].next;
            newNode.bottom = tempNode;
            this.horizontalArr[colInd].next = newNode;
            tempNode.top = newNode;
        }
        else {
            let temp = this.horizontalArr[colInd].next;
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
        this.size += 1;

        // this.miniCanvas.renderCanvas();
    }

    deleteNode(row, col) {

        console.log("called delete for ", row, col)
        let rowInd = row - 1;
        let colInd = col - 1;

        if (!this.verticalArr[rowInd].next || this.verticalArr[rowInd].next.col.data > col) {
            // not found
            console.log("not found")
            return;
        }
        let temp = this.verticalArr[rowInd].next;

        if (this.verticalArr[rowInd].next.col.data == col) {
            // first element of row

            temp.right ? temp.right.left = null : "";

            this.horizontalArr[colInd].next == temp ? this.horizontalArr[colInd].next = temp.bottom : this.horizontalArr[colInd].next = null;
            this.verticalArr[rowInd].next = temp.right;
        }
        else {
            // found else where

            while (temp.right != null && temp.col.data != col) {
                temp = temp.right;
            }
            if (temp.col.data == col) {
                temp.left ? temp.left.right = temp.right : ""
                temp.right ? temp.right.left = temp.left : ""
            }
        }


        temp.top ? temp.top.bottom = temp.bottom : "";
        temp.bottom ? temp.bottom.top = temp.top : "";

        temp.left = null;
        temp.right = null;
        temp.top = null;
        temp.bottom = null;

        // this.miniCanvas.renderCanvas();

    }

    insertRows(startRow, numOfRows) {
        let startRowInd = startRow - 1;

        //updating data
        for (let i = this.verticalArr.length - 1; i > startRowInd + 1; i--) {
            this.verticalArr[i - 1].next.data += numOfRows;
        }


        for (let i = this.verticalArr.length - 1; i > startRowInd + numOfRows; i--) {
            this.verticalArr[i].next = this.verticalArr[i - numOfRows].next;
        }

        for (let i = startRowInd; i < numOfRows + startRowInd; i++) {
            this.verticalArr[i + 1].next = null;
            console.log(i + 1);
            this.createNewNode(i + 2, 1, i + 1);
        }

    }



    deleteRowsBulk(startIndex, endIndex) {
        let startRowInd = startIndex - 1;
        let endRowInd = endIndex - 1;

        console.log(`Deleting rows from index ${startIndex} to ${endIndex}`);

        // Loop through the rows from startIndex to endIndex and unlink them
        for (let rowInd = startRowInd; rowInd <= endRowInd; rowInd++) {
            let tempCurr = this.verticalArr[rowInd].next;

            while (tempCurr != null) {
                let colInd = tempCurr.col.data - 1;

                // Adjust the links between top and bottom cells
                tempCurr.top ? tempCurr.top.bottom = tempCurr.bottom : this.horizontalArr[colInd].next = tempCurr.bottom;
                tempCurr.bottom ? tempCurr.bottom.top = tempCurr.top : "";

                tempCurr = tempCurr.right;
            }
        }

        // After deleting the rows, shift the remaining rows upwards
        let rowsToDelete = endRowInd - startRowInd + 1;

        for (let i = startRowInd; i + rowsToDelete < this.verticalArr.length; i++) {
            console.log(`Shifting row ${i + rowsToDelete} to ${i}`);
            this.verticalArr[i + rowsToDelete].next.data = i;
            this.verticalArr[i].next = this.verticalArr[i + rowsToDelete].next;
        }

        // Adjust the length of the vertical array to remove the deleted rows
        this.verticalArr.length = this.verticalArr.length - rowsToDelete;

        console.log(`Successfully deleted rows from ${startIndex} to ${endIndex}`);
    }

    deleteACol(ind) {
        let colInd = ind - 1;
        let tempCurr = this.horizontalArr[colInd].next;

        while (tempCurr != null) {

            let rowInd = tempCurr.row.data - 1;

            tempCurr.left ? tempCurr.left.right = tempCurr.right : this.verticalArr[rowInd].next = tempCurr.right;
            tempCurr.right ? tempCurr.right.left = tempCurr.left : ""

            tempCurr = tempCurr.bottom;
        }

        // this.miniCanvas.deleteColAtInd(colInd);
        // this.miniCanvas.renderCanvas();
    }


    insertAndShiftRight(row, col, value) {

        let newNode = new Node(this.verticalArr[row - 1].value, this.horizontalArr[col - 1].value, value);

        let temp = this.verticalArr[row - 1].next;
        // console.log(temp)

        while (temp.col.data < col) {
            temp = temp.right;
        }

        let currEle = temp;

        let topOfCurr = currEle.top;
        let bottomOfCurr = currEle.bottom;
        let leftOfCurr = currEle.left;
        let rightOfCurr = currEle.right;

        if (leftOfCurr) {
            leftOfCurr.right = newNode;
        }
        else {
            this.verticalArr[row - 1].next = newNode;
        }

        newNode.left = leftOfCurr;
        newNode.right = currEle;
        currEle.left = newNode;

        newNode.top = topOfCurr;
        newNode.bottom = bottomOfCurr;

        topOfCurr ? topOfCurr.bottom = newNode : ""
        bottomOfCurr ? bottomOfCurr.top = newNode : ""

        if (this.horizontalArr[row - 1].next == currEle) {
            this.horizontalArr[row - 1].next = newNode;
        }

        temp = currEle;
        let nextEle = rightOfCurr;

        // console.log(temp)

        while (temp != null) {
            let ind = temp.col.data;
            // console.log(ind)
            // console.log(temp.col.data)
            // console.log(temp)
            temp.col = this.horizontalArr[ind].value;
            if (nextEle != null) {

                temp.top = nextEle.top;
                temp.bottom = nextEle.bottom;

                nextEle.top ? nextEle.top.bottom = temp : this.horizontalArr[nextEle.col.data - 1].next = temp;
                nextEle.bottom ? nextEle.bottom.top = temp : ""

                nextEle = nextEle.right;

            }
            else {
                let nextColInd = temp.col.data - 1;
                // console.log(nextColInd , temp,nextEle)
                let verticalTemp = this.horizontalArr[nextColInd].next;

                if (verticalTemp == null) {
                    this.horizontalArr[nextColInd].next = temp;
                    temp.bottom = null;
                    temp.top = null;
                }
                else {
                    // console.log(verticalTemp)
                    // console.log(row,col,value)
                    while (verticalTemp.bottom != null && verticalTemp.row.data < row) {
                        verticalTemp = verticalTemp.bottom;
                    }
                    temp.bottom = verticalTemp.bottom;
                    temp.top = verticalTemp;

                    verticalTemp.bottom ? verticalTemp.bottom.top = temp : ""
                    verticalTemp.bottom = temp;

                }

            }
            temp = temp.right;
        }
        // this.miniCanvas.renderCanvas();


    }


    insertAndShiftBottom(row, col, value) {

        console.log("shifting botttom")

        let newNode = new Node(this.verticalArr[row - 1].value, this.horizontalArr[col - 1].value, value);

        let temp = this.horizontalArr[col - 1].next;
        // console.log(temp)

        while (temp.row.data < row) {
            temp = temp.bottom;
        }

        let currEle = temp;

        let topOfCurr = currEle.top;
        let bottomOfCurr = currEle.bottom;
        let leftOfCurr = currEle.left;
        let rightOfCurr = currEle.right;

        if (topOfCurr) {
            topOfCurr.bottom = newNode;
        }
        else {
            this.horizontalArr[col - 1].next = newNode;
        }

        newNode.top = topOfCurr;
        newNode.bottom = currEle;
        currEle.top = newNode;

        newNode.left = leftOfCurr;
        newNode.right = rightOfCurr;

        leftOfCurr ? leftOfCurr.right = newNode : ""
        rightOfCurr ? rightOfCurr.left = newNode : ""

        if (this.verticalArr[col - 1].next == currEle) {
            this.verticalArr[col - 1].next = newNode;
        }

        temp = currEle;
        let nextEle = bottomOfCurr;

        // console.log(temp)

        while (temp != null) {
            let ind = temp.row.data;
            // console.log(ind)
            // console.log(temp.row.data)
            // console.log(temp)
            temp.row = this.verticalArr[ind].value;
            if (nextEle != null) {

                console.log("nextEle is not null")

                temp.left = nextEle.left;
                temp.right = nextEle.right;

                nextEle.left ? nextEle.left.right = temp : this.verticalArr[nextEle.row.data - 1].next = temp;
                nextEle.right ? nextEle.right.left = temp : ""

                nextEle = nextEle.bottom;

            }
            else {

                console.log("next ele is null")
                let nextRowInd = temp.row.data - 1;
                // console.log(nextRowInd , temp,nextEle)
                console.log("next row indes is ", nextRowInd)
                let horizontalTemp = this.verticalArr[nextRowInd].next;
                console.log(horizontalTemp)

                if (horizontalTemp == null) {
                    this.verticalArr[nextRowInd].next = temp;
                    console.log("worked")
                    temp.right = null;
                    temp.left = null;
                }
                else {
                    // console.log(horizontalTemp)
                    // console.log(row,col,value)
                    while (horizontalTemp.right != null && horizontalTemp.col.data < col) {
                        horizontalTemp = horizontalTemp.right;
                    }

                    console.log(horizontalTemp)
                    temp.right = horizontalTemp.right;
                    temp.left = horizontalTemp;

                    horizontalTemp.right ? horizontalTemp.right.left = temp : ""
                    horizontalTemp.right = temp;
                }

            }
            temp = temp.bottom;
        }
        // this.miniCanvas.renderCanvas();


    }

}