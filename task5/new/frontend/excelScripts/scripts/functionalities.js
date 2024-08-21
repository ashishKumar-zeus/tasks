
export class Functionalities {
    constructor(sheet) {

        this.renderor = sheet.renderor;
        this.headerCellsMaker = sheet.headerCellsMaker;

        // console.log(sheet.ll);

        this.ll = sheet.ll;

        //canvas
        this.horizontalCanvas = sheet.horizontalCanvas;
        this.verticalCanvas = sheet.verticalCanvas;
        this.spreadsheetCanvas = sheet.spreadsheetCanvas;

        this.inputEle = sheet.inputEle;

        //getting arrays
        this.horizontalArr = sheet.headerCellsMaker.getHorizontalArray();
        this.verticalArr = sheet.headerCellsMaker.getVerticalArray();

        //getting positions of start
        this.horStartPos = this.renderor.horStartPos;
        this.verStartPos = this.renderor.verStartPos;

        //getting curr index of first elements
        this.currStartColInd = this.renderor.currStartColInd;
        this.currStartRowInd = this.renderor.currStartRowInd;

        //property defined in renderor
        this.resizeWidth = this.renderor.resizeWidth;
        this.resizeHeight = this.renderor.resizeHeight;

        this.isInputOn = false;
        this.isDragging = false;

        this.startInputCell = null;
        this.endInputCell = null;

        this.selectedCellsArray = [];

        this.init();


        this.scroll = null;




    }

    init() {
        this.handleResizeHorizontal();
        this.handleResizeVertical();


        this.handleMouseEventsOnSheet();


    }

    updateScrollChanges() {
        this.horStartPos = this.renderor.getHorStartPos()
        this.verStartPos = this.renderor.getVerStartPos()
        this.currStartColInd = this.renderor.getCurrColInd()
        this.currStartRowInd = this.renderor.getCurrRowInd()

    }

    getUpdatedArrayValue() {
        this.horizontalArr = sheet.headerCellsMaker.getHorizontalArray();
        this.verticalArr = sheet.headerCellsMaker.getVerticalArray();
    }


    getScrollInstance(scrollInstance) {
        this.scroll = scrollInstance;
    }



    handleResizeHorizontal() {

        let resizingColumn = 0;
        let startXPos = 0;
        let resizeWidth = this.resizeWidth;

        const checkForResizeRange = (pos) => {
            this.updateScrollChanges()
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
            isResizable ? this.horizontalCanvas.style.cursor = 'col-resize' : ""

            if (isResizable) {
                this.isResizingHor = true;
                resizingColumn = colInd
            }
        }

        const onMouseMove = (e) => {
            e.preventDefault();

            let endXPos = e.offsetX;

            let [isResizable, colInd] = checkForResizeRange(endXPos);
            isResizable ? this.horizontalCanvas.style.cursor = 'col-resize' : this.horizontalCanvas.style.cursor = "default";

            if (this.isResizingHor) {
                const diff = endXPos - startXPos;
                this.horizontalCanvas.style.cursor = 'col-resize';
                this.headerCellsMaker.resizeColumn(resizingColumn, diff)

                startXPos = endXPos;

                this.renderor.renderCanvas();
                this.updateInput()
                this.handleRectangleToMake()
            }
        }

        const onMouseUp = (e) => {
            e.preventDefault()
            if (this.isResizingHor) {
                this.isResizingHor = false;
            }
        }

        this.horizontalCanvas.addEventListener('mousedown', onMouseDown)
        this.horizontalCanvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);

        this.horizontalCanvas.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);


    }

    handleResizeVertical() {

        let resizingRow = 0;
        let startYPos = 0;
        let resizeHeight = this.resizeHeight;

        const checkForResizeRange = (pos) => {
            this.updateScrollChanges()
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
            isResizable ? this.verticalCanvas.style.cursor = 'row-resize' : ""

            if (isResizable) {
                this.isResizingVer = true;
                resizingRow = rowInd
            }
        }

        const onMouseMove = (e) => {
            e.preventDefault();

            let endYPos = e.offsetY;

            let [isResizable, rowInd] = checkForResizeRange(endYPos);
            isResizable ? this.verticalCanvas.style.cursor = 'row-resize' : this.verticalCanvas.style.cursor = "default";


            if (this.isResizingVer) {

                const diff = endYPos - startYPos;
                this.verticalCanvas.style.cursor = 'row-resize';
                this.headerCellsMaker.resizeRow(resizingRow, diff)

                startYPos = endYPos;

                this.renderor.renderCanvas();
                this.updateInput()
                this.handleRectangleToMake()
            }
        }

        const onMouseUp = (e) => {
            e.preventDefault()
            if (this.isResizingVer) {
                this.isResizingVer = false;
            }
        }

        this.verticalCanvas.addEventListener('mousedown', onMouseDown)
        this.verticalCanvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);

        this.verticalCanvas.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);

    }


    getRowColFromCanvasPosition(xPos, yPos) {
        //this function returns row and col index of positions and also the colStartPosition and rowStart POsition with respect to 
        this.updateScrollChanges()

        let newXPos = xPos + this.renderor.horizontallyScrolled;
        let newYPos = yPos + this.renderor.verticallyScrolled;

        let colInd = this.currStartColInd;

        while (this.horizontalArr[colInd].x + this.horizontalArr[colInd].width < newXPos) {
            //while column start position is less than xpos loop through
            colInd += 1;
        }

        let rowInd = this.currStartRowInd;

        while (this.verticalArr[rowInd].y + this.verticalArr[rowInd].height < newYPos) {
            //while row start position is less than ypos loop through
            rowInd += 1;
        }

        return { "rowInd": rowInd, "colInd": colInd }
    }

    updateInput() {

        if (this.startInputCell == null) {
            return;
        }

        let currData = this.startInputCell;

        let cellWidth = this.horizontalArr[currData.colInd].width;
        let cellHeight = this.verticalArr[currData.rowInd].height;
        let rowStartPos = this.verticalArr[currData.rowInd].y - this.renderor.verticallyScrolled;
        let colStartPos = this.horizontalArr[currData.colInd].x - this.renderor.horizontallyScrolled;

        //getting data
        this.inputEle.value = this.ll.getValueAtInd(currData.rowInd, currData.colInd);

        //setting input
        this.inputEle.style.display = 'inline-block';
        this.inputEle.style.top = `${rowStartPos}px`;
        this.inputEle.style.left = `${colStartPos}px`;
        this.inputEle.style.width = `${cellWidth - 4}px`;// 4 is subtracted inorder to make the rectangle drawn visible
        this.inputEle.style.height = `${cellHeight - 4}px`;

        this.inputEle.addEventListener('blur', (e) => {
            this.isDragging = false;
        })

    }

    saveInputData() {

        if (!this.startInputCell) {
            return;
        }

        let rowInd = this.startInputCell.rowInd;
        let colInd = this.startInputCell.colInd;
        let data = this.inputEle.value;
        // console.log(this.startInputCell)

        if (data == '') {
            this.ll.deleteNode(rowInd + 1, colInd + 1);
        }
        else {
            this.ll.setValueAtInd(rowInd, colInd, data);
        }

        this.renderor.renderCanvas()
    }

    resetInputBox() {
        this.inputEle.value = '';
    }



    // mouse events


    handleMouseDown(e) {
        e.preventDefault();

        if (this.isInputOn) {
            // Some other input is clicked then save their values and reset input
            this.saveInputData();
            this.resetInputBox();
        }

        // console.log("down ", e.target)

        // Setting input for this click
        this.isInputOn = true;

        // Dealing with new input cell on mousedown
        this.startInputCell = this.getRowColFromCanvasPosition(e.offsetX, e.offsetY);
        this.endInputCell = this.startInputCell;
        this.updateInput();

        this.isDragging = true;

        this.selectedCells = []; // Clear previously selected cells

        if (this.startInputCell) {
            this.updateSelectionData(this.startInputCell, this.startInputCell);
        }
        this.handleRectangleToMake(e);

        // Add event listeners for mousemove and mouseup
        document.addEventListener('mousemove', this.handleMouseMoveBound);
        document.addEventListener('mouseup', this.handleMouseUpBound);
    }


    handleScrolling(event) {

        const { relativeX, relativeY } = this.getAdjestedPositions(event.clientX, event.clientY)


        // Check if the pointer is near the edges to trigger scrolling
        const edgeDistance = 50; // Distance from edge to start scrolling

        const canvas = this.spreadsheetCanvas;

        if (relativeX < edgeDistance && event.movementX < 0) {
            this.scroll.updateScrollByDiffHor(-10)//scroll left
        } else if (
            relativeX > canvas.clientWidth - edgeDistance &&
            event.movementX > 0
        ) {
            this.scroll.updateScrollByDiffHor(+10)//scroll right
        }

        if (relativeY < edgeDistance && event.movementY < 0) {
            this.scroll.updateScrollByDiffVer(-5)//scroll up
        } else if (
            relativeY > canvas.clientHeight - edgeDistance &&
            event.movementY > 0
        ) {
            this.scroll.updateScrollByDiffVer(+5)//scroll up
        }
    }

    getAdjestedPositions(xPos, yPos) {
        const rect = this.spreadsheetCanvas.getBoundingClientRect();
        // Calculate the relative coordinates
        const relativeX = xPos - rect.left;
        const relativeY = yPos - rect.top;
        return { relativeX, relativeY }
    }

    handleMouseMove(e) {
        e.preventDefault();

        if (this.isInputOn && this.isDragging) {


            this.handleScrolling(e)

            //as the event is triggerred with respect to document hence we have adjusted the positions with respect to canvas
            const { relativeX, relativeY } = this.getAdjestedPositions(e.clientX, e.clientY)

            //check if you are trying to scroll along with selecting
            let currCell = this.getRowColFromCanvasPosition(relativeX, relativeY);

            this.endInputCell = currCell;
            this.renderor.renderCanvas();
            this.handleRectangleToMake();
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;

        // console.log("up ", e.target)


        // Remove event listeners for mousemove and mouseup
        document.removeEventListener('mousemove', this.handleMouseMoveBound);
        document.removeEventListener('mouseup', this.handleMouseUpBound);
    }

    handleRectangleToMake() {

        if (!this.startInputCell || !this.endInputCell) {
            return;
        }

        let startCellXTop = this.horizontalArr[this.startInputCell.colInd].x - this.renderor.horizontallyScrolled;
        let startCellYTop = this.verticalArr[this.startInputCell.rowInd].y - this.renderor.verticallyScrolled;
        let startCellXBottom = this.horizontalArr[this.startInputCell.colInd].x + this.horizontalArr[this.startInputCell.colInd].width - this.renderor.horizontallyScrolled;
        let startCellYBottom = this.verticalArr[this.startInputCell.rowInd].y + this.verticalArr[this.startInputCell.rowInd].height - this.renderor.verticallyScrolled;

        let currCell = this.endInputCell;

        if (this.startInputCell) {
            this.updateSelectionData(this.startInputCell, currCell);
        }

        let currCellXTop = this.horizontalArr[currCell.colInd].x - this.renderor.horizontallyScrolled;
        let currCellYTop = this.verticalArr[currCell.rowInd].y - this.renderor.verticallyScrolled;
        let currCellXBottom = this.horizontalArr[currCell.colInd].x + this.horizontalArr[currCell.colInd].width - this.renderor.horizontallyScrolled;
        let currCellYBottom = this.verticalArr[currCell.rowInd].y + this.verticalArr[currCell.rowInd].height - this.renderor.verticallyScrolled;

        // Get the rectangle's start and end points
        const minX = Math.min(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const minY = Math.min(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);
        const maxX = Math.max(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const maxY = Math.max(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);
        this.renderor.drawSelectionRectangles(minX, minY, maxX - minX, maxY - minY)
    }


    updateSelectionData(startCell, endCell) {

        const minRow = Math.min(startCell.rowInd, endCell.rowInd);
        const maxRow = Math.max(startCell.rowInd, endCell.rowInd);
        const minCol = Math.min(startCell.colInd, endCell.colInd);
        const maxCol = Math.max(startCell.colInd, endCell.colInd);

        // Reset selectedCells array to cover the new selection
        this.selectedCells = Array.from({ length: maxRow - minRow + 1 }, () => Array(maxCol - minCol + 1).fill(''));

        let x = 0;
        for (let row = minRow; row <= maxRow; row++) {
            let y = 0;
            for (let col = minCol; col <= maxCol; col++) {
                let ele = this.ll.getValueAtInd(row, col);
                if (ele != "") {
                    this.selectedCells[x][y] = ele;
                }
                y++;
            }
            x++;
        }

        // console.log(this.selectedCells)

    }


    removeEventListeners() {
        this.spreadsheetCanvas.removeEventListener('mousedown', this.handleMouseDownBound);
        document.removeEventListener('mousemove', this.handleMouseMoveBound);
        document.removeEventListener('mouseup', this.handleMouseUpBound);
    }

    handleMouseEventsOnSheet() {

        // Bind event handlers
        this.handleMouseDownBound = this.handleMouseDown.bind(this);
        this.handleMouseMoveBound = this.handleMouseMove.bind(this);
        this.handleMouseUpBound = this.handleMouseUp.bind(this);
        this.spreadsheetCanvas.addEventListener('mousedown', this.handleMouseDownBound);

    }
}