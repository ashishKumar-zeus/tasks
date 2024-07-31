import { horizontalCnvCtx, verticalCnvCtx, spreadsheetCnvCtx, horizontalCanvas, verticalCanvas, spreadsheetCanvas } from "../index.js";

class HeaderCell {
    constructor(x, y, width, height, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = { "data": value };
        this.next = null;
        this.isSelected = false;
    }
}

export class MiniCanvas {
    constructor(numOfRows, numOfCols, initialWidthHorizontal, initialHeigthHorizontal, initialWidthVertical, initialHeigthVertical, resizeWidth,resizeHeight,  offsetSharpness) {

        this.horizontalArr = [];
        this.verticalArr = [];
        this.numOfCols = numOfCols;
        this.numOfRows = numOfRows;

        this.initialWidthHorizontal = initialWidthHorizontal;
        this.initialHeigthHorizontal = initialHeigthHorizontal;
        this.initialWidthVertical = initialWidthVertical;
        this.initialHeigthVertical = initialHeigthVertical;

        this.resizeWidth = resizeWidth;
        this.resizeHeight = resizeHeight;

        this.offsetSharpness = offsetSharpness;

        this.horizontallyScrolled = 0;
        this.verticallyScrolled = 0;

        this.accWidthHor = 0;
        this.accHeightVer = 0;
        this.currStartColInd = 0;
        this.currStartRowInd = 0;
        this.horStartPos = 0;
        this.verStartPos = 0;

        this.isResizingHor = false;
        this.isResizingVer = false;
        
        
        this.init();
        this.handleResizeHorizontal();
        this.handleResizeVertical();
    }

    init() {
        //putting values the array
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.numOfCols; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthHorizontal, this.initialHeigthHorizontal, i + 1);
            this.horizontalArr[i] = cell;
            x += this.initialWidthHorizontal;
        }

        x = 0;
        y = 0;
        for (let i = 0; i < this.numOfRows; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthVertical, this.initialHeigthVertical, i + 1);
            this.verticalArr[i] = cell;
            y += this.initialHeigthVertical;
        }


        this.renderCanvas()
    }

    renderCanvas() {
        this.drawHorizontalCanvas(this.currStartColInd);
        this.drawVerticalCanvas(this.currStartRowInd);
        this.drawMainCanvas(this.currStartRowInd, this.currStartColInd);
    }

    renderCanvasOnScroll(horizontallyScrolled, verticallyScrolled) {

        //for horizontal scrolling
        this.horizontallyScrolled = horizontallyScrolled;
        let i = 0;
        this.accWidthHor = this.horizontalArr[0].width;
        while (this.accWidthHor < this.horizontallyScrolled) {
            i++;
            this.accWidthHor += this.horizontalArr[i].width;
        }

        this.currStartColInd = i;

        this.horStartPos = -this.horizontallyScrolled + this.accWidthHor - this.horizontalArr[i].width;

        //for vertical scrolling
        this.verticallyScrolled = verticallyScrolled;
        i = 0;
        this.accHeightVer = this.verticalArr[0].height;
        while (this.accHeightVer < this.verticallyScrolled) {
            i++;
            this.accHeightVer += this.verticalArr[i].height;
        }

        this.currStartRowInd = i;

        this.verStartPos = -this.verticallyScrolled + this.accHeightVer - this.verticalArr[i].height;

        //updating
        this.drawHorizontalCanvas(this.currStartColInd);
        this.drawVerticalCanvas(this.currStartRowInd);
        this.drawMainCanvas(this.currStartRowInd, this.currStartColInd);
    }


    getColName(n) {
        let columnName = '';
        while (n > 0) {
            let remainder = (n - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            n = Math.floor((n - 1) / 26);
        }
        return columnName;

    }

    drawHorizontalCanvas(startInd) {

        if (!horizontalCnvCtx) {
            alert("Horizontal Canvas ctx not found")
            return;
        }

        horizontalCnvCtx.clearRect(0, 0, horizontalCanvas.width, horizontalCanvas.height);

        //using stroke
        horizontalCnvCtx.strokeStyle = '#D3D3D3';
        horizontalCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let x = this.horStartPos;

        for (let j = startInd; j <= this.horizontalArr.length; j++) {
            //making vertical line
            horizontalCnvCtx.beginPath();
            horizontalCnvCtx.moveTo(x, 0);
            horizontalCnvCtx.lineTo(x, this.initialHeigthHorizontal);
            horizontalCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= horizontalCanvas.width) {
                break;
            }

            //making text
            let currCell = this.horizontalArr[j];
            horizontalCnvCtx.font = ' 14px Calibri ';
            horizontalCnvCtx.textAlign = 'center';
            horizontalCnvCtx.textBaseline = 'middle';
            horizontalCnvCtx.fillStyle = '#000';

            horizontalCnvCtx.fillText(this.getColName(currCell.value.data), x + currCell.width / 2, currCell.y + currCell.height / 2);

            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";

        }

    }

    drawVerticalCanvas(startInd) {

        //using strokes
        if (!verticalCnvCtx) {
            alert("Vertical Canvas ctx not found")
            return;
        }

        verticalCnvCtx.clearRect(0, 0, verticalCanvas.width, verticalCanvas.height);

        verticalCnvCtx.strokeStyle = '#D3D3D3';
        verticalCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let y = this.verStartPos;
        for (let j = startInd; j <= this.verticalArr.length; j++) {
            // console.log(j)

            //making horizontal lines
            verticalCnvCtx.beginPath();
            verticalCnvCtx.moveTo(0, y);
            verticalCnvCtx.lineTo(this.initialWidthVertical, y);
            verticalCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= verticalCanvas.height) {
                break;
            }
            //making text
            let currCell = this.verticalArr[j];
            verticalCnvCtx.font = '14px Calibri';
            verticalCnvCtx.textAlign = 'right';
            verticalCnvCtx.textBaseline = 'bottom';
            verticalCnvCtx.fillStyle = '#000';
            verticalCnvCtx.fillText(currCell.value.data, currCell.x + currCell.width - 10, y + currCell.height - 5);

            (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";

        }

    }

    drawCellContentAtRow(currRow, startColInd) {

        if (!currRow.next) {
            return;
        }
        let currRowEle = currRow.next;

        while (currRowEle != null && (currRowEle.col.data - 1) < startColInd) {
            currRowEle = currRowEle.right;
        }

        while (currRowEle != null) {

            let currCol = this.horizontalArr[currRowEle.col.data - 1];

            if (currCol.x - this.horizontallyScrolled > spreadsheetCanvas.width) {
                break;
            }

            //making text
            spreadsheetCnvCtx.font = '14px Calibri light';
            spreadsheetCnvCtx.textAlign = 'right';
            spreadsheetCnvCtx.textBaseline = 'bottom';
            spreadsheetCnvCtx.fillStyle = '#000';
            spreadsheetCnvCtx.fillText(currRowEle.data, currCol.x - this.horizontallyScrolled + currCol.width - 10, currRow.y - this.verticallyScrolled + currRow.height - 5)

            currRowEle = currRowEle.right;

        }

    }

    drawMainCanvas(startRowInd, startColInd) {

        if (!spreadsheetCnvCtx) {
            alert("main Canvas ctx not found")
            return;
        }

        spreadsheetCnvCtx.clearRect(0, 0, spreadsheetCanvas.width, spreadsheetCanvas.height);

        spreadsheetCnvCtx.strokeStyle = '#D3D3D3';
        spreadsheetCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let x = this.horStartPos;
        for (let j = startColInd; j <= this.horizontalArr.length; j++) {
            spreadsheetCnvCtx.beginPath();
            spreadsheetCnvCtx.moveTo(x, 0);
            spreadsheetCnvCtx.lineTo(x, spreadsheetCanvas.height);
            spreadsheetCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= horizontalCanvas.width) {
                break;
            }

            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";
        }

        let y = this.verStartPos;
        for (let j = startRowInd; j <= this.verticalArr.length; j++) {
            spreadsheetCnvCtx.beginPath();
            spreadsheetCnvCtx.moveTo(0, y);
            spreadsheetCnvCtx.lineTo(spreadsheetCanvas.width, y);
            spreadsheetCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= verticalCanvas.height) {
                break;
            }
            this.drawCellContentAtRow(this.verticalArr[j], startColInd);

            (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";
        }
    }

    printArrs() {
        for (let i = 0; i < this.horizontalArr.length; i++) {
            console.log(this.horizontalArr[i])

        }

        for (let i = 0; i < this.verticalArr.length; i++) {
            console.log(this.verticalArr[i])

        }
    }

    resizeColumn(index, diff) {
        let MIN_WIDTH = 50;
        this.horizontalArr[index].width = Math.max(MIN_WIDTH, this.horizontalArr[index].width + diff);
        for (let i = index + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].x = this.horizontalArr[i - 1].x + this.horizontalArr[i - 1].width;
        }
        this.renderCanvas();
    }

    resizeRow(index, diff) {

        let MIN_HEIGHT = 15;
        this.verticalArr[index].height = Math.max(MIN_HEIGHT, this.verticalArr[index].height + diff);
        for (let i = index + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].y = this.verticalArr[i - 1].y + this.verticalArr[i - 1].height;
        }
        this.renderCanvas();
        
        // let MIN_HEIGHT = 10;
        // this.verticalArr[index].height += diff;
        // for (let i = index + 1; i < this.verticalArr.length; i++) {
        //     this.verticalArr[i].y += diff;
        // }
    }

    addRowAtInd(ind) {

        let oldRow = this.verticalArr[ind];

        let newRow = new HeaderCell(oldRow.x, oldRow.y, this.initialWidthVertical, this.initialHeigthVertical, ind + 1);

        this.verticalArr.splice(ind, 0, newRow)

        for (let i = ind + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data += 1;
            this.verticalArr[i].y += this.initialHeigthVertical;
        }
    }


    deleteRowAtInd(ind) {

        let rowToBeDeleted = this.verticalArr[ind];

        this.verticalArr.splice(ind, 1)

        for (let i = ind; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data -= 1;
            this.verticalArr[i].y -= this.initialHeigthVertical;
        }
    }


    deleteColAtInd(ind) {

        let colToBeDeleted = this.horizontalArr[ind];
        let widthOfCol = colToBeDeleted.width;

        this.horizontalArr.splice(ind, 1);

        for (let i = ind; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data -= 1;
            this.horizontalArr[i].x -= widthOfCol;
        }
    }

    addColAtInd(ind) {

        let oldCol = this.horizontalArr[ind];

        let newCol = new HeaderCell(oldCol.x, oldCol.y, this.initialWidthHorizontal, this.initialHeigthHorizontal, ind + 1);

        this.horizontalArr.splice(ind, 0, newCol)

        for (let i = ind + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data += 1;
            this.horizontalArr[i].x += this.initialWidthHorizontal;
        }
    }

    handleResizeHorizontal() {

        let resizingColumn = 0;
        let startXPos = 0;
        let resizeWidth = this.resizeWidth;

        const checkForResizeRange = (pos) => {
            let colStartPosition = this.horStartPos;
            let colInd = this.currStartColInd;
            while (colStartPosition + resizeWidth < pos) {
                // The resize Width is added for getting correct Col start index , adding resizeWidth let us get correct Index by giving us extra space needed
                colStartPosition += this.horizontalArr[colInd].width;
                colInd += 1
            }
            if (colInd > 0 && Math.abs(pos - colStartPosition) < resizeWidth / 2) {
                return [true, colInd - 1]
            }
            return [false, ""]
        }

        const onMouseDown = (e) => {
            e.preventDefault()
            startXPos = e.offsetX;

            let [isResizable, colInd] = checkForResizeRange(startXPos);
            isResizable ? horizontalCanvas.style.cursor = 'col-resize' : ""

            if (isResizable) {
                this.isResizingHor = true;
                resizingColumn = colInd
            }
        }

        const onMouseMove = (e) => {
            e.preventDefault();

            let endXPos = e.offsetX;

            let [isResizable, colInd] = checkForResizeRange(endXPos);
            isResizable ? horizontalCanvas.style.cursor = 'col-resize' : horizontalCanvas.style.cursor = "default";

            if (this.isResizingHor) {
                const diff = endXPos - startXPos;
                horizontalCanvas.style.cursor = 'col-resize';
                this.resizeColumn(resizingColumn, diff)
                startXPos = endXPos;
            }
        }

        const onMouseUp = (e) => {
            e.preventDefault()
            if (this.isResizingHor) {
                this.isResizingHor = false;
            }
        }

        horizontalCanvas.addEventListener('mousedown', onMouseDown)
        horizontalCanvas.addEventListener('mousemove', onMouseMove);
        spreadsheetCanvas.addEventListener('mousemove', onMouseMove);

        horizontalCanvas.addEventListener('mouseup', onMouseUp);
        spreadsheetCanvas.addEventListener('mouseup', onMouseUp);


    }

    handleResizeVertical() {

        let resizingRow = 0;
        let startYPos = 0;
        let resizeHeight = this.resizeHeight;

        const checkForResizeRange = (pos) => {
            let rowStartPosition = this.verStartPos;
            let rowInd = this.currStartRowInd;
            while (rowStartPosition + resizeHeight < pos) {
                // The resize Width is added for getting correct Col start index , adding resizeWidth let us get correct Index by giving us extra space needed
                rowStartPosition += this.verticalArr[rowInd].height;
                rowInd += 1
            }
            if (rowInd > 0 && Math.abs(pos - rowStartPosition) < resizeHeight / 2) {
                return [true, rowInd - 1]
            }
            return [false, ""]
        }

        const onMouseDown = (e) => {
            e.preventDefault()
            startYPos = e.offsetY;

            let [isResizable, rowInd] = checkForResizeRange(startYPos);
            isResizable ? verticalCanvas.style.cursor = 'row-resize' : ""

            if (isResizable) {
                this.isResizingVer = true;
                resizingRow = rowInd
            }
        }

        const onMouseMove = (e) => {
            e.preventDefault();
            // console.log("here")

            let endYPos = e.offsetY;


            let [isResizable, rowInd] = checkForResizeRange(endYPos);
            isResizable ? verticalCanvas.style.cursor = 'row-resize' : verticalCanvas.style.cursor = "default";


            if (this.isResizingVer) {
                const diff = endYPos - startYPos;
                verticalCanvas.style.cursor = 'row-resize';
                this.resizeRow(resizingRow, diff)
                startYPos = endYPos;
            }
        }

        const onMouseUp = (e) => {
            e.preventDefault()
            if (this.isResizingVer) {
                this.isResizingVer = false;
            }
        }

        verticalCanvas.addEventListener('mousedown', onMouseDown)
        verticalCanvas.addEventListener('mousemove', onMouseMove);
        spreadsheetCanvas.addEventListener('mousemove', onMouseMove);

        verticalCanvas.addEventListener('mouseup', onMouseUp);
        spreadsheetCanvas.addEventListener('mouseup', onMouseUp);


    }


}