
export class Functionalities {


    constructor(sheet) {

        //initial properties
        this.renderer = sheet.renderer;
        this.headerCellsMaker = sheet.headerCellsMaker;
        this.ll = sheet.ll;
        this.inputEle = sheet.inputEle;
        this.minorFunctions = sheet.minorFunctions;
        this.updateSelectedCellToUI = sheet.updateSelectedCellsInfo;
        this.handleApis = sheet.handleApis;
        //canvas
        this.horizontalCanvas = sheet.horizontalCanvas;
        this.verticalCanvas = sheet.verticalCanvas;
        this.spreadsheetCanvas = sheet.spreadsheetCanvas;

        //getting arrays
        this.horizontalArr = this.headerCellsMaker.getHorizontalArray();
        this.verticalArr = this.headerCellsMaker.getVerticalArray();

        //getting positions of start
        this.horStartPos = this.renderer.horStartPos;
        this.verStartPos = this.renderer.verStartPos;

        //getting curr index of first elements
        this.currStartColInd = this.renderer.currStartColInd;
        this.currStartRowInd = this.renderer.currStartRowInd;

        //property defined in renderer
        this.resizeWidth = this.renderer.resizeWidth;
        this.resizeHeight = this.renderer.resizeHeight;

        //some variables used here
        this.isInputOn = false;
        this.isDragging = false;
        this.startInputCell = null;
        this.endInputCell = null;

        //scroll
        this.scroll = null;

        this.sheet = sheet;

        //creating bounds for input selection and scrolling with selection
        this.handleMouseDownBound = this.handleMouseDown.bind(this);
        this.handleMouseMoveBound = this.handleMouseMove.bind(this);
        this.handleMouseUpBound = this.handleMouseUp.bind(this);


        this.init()


    }

    init() {

        //calling resize initiaters
        this.handleResizeHorizontal();
        this.handleResizeVertical();

        //calling event listerners activator
        this.handleMouseEventsOnSheet();
        this.handleKeyEventsOnSheet();

        this.handleContextMenu()


        this.handleDocumentClick()

    }


    //getter
    updateScrollChanges() {
        this.horStartPos = this.renderer.getHorStartPos();
        this.verStartPos = this.renderer.getVerStartPos();
        this.currStartColInd = this.renderer.getCurrColInd();
        this.currStartRowInd = this.renderer.getCurrRowInd();
    }

    //getter
    getUpdatedArrayValue() {
        this.horizontalArr = this.headerCellsMaker.getHorizontalArray();
        this.verticalArr = this.headerCellsMaker.getVerticalArray();
    }

    //getter
    getScrollInstance(scrollInstance) {
        this.scroll = scrollInstance;
    }


    getColOnHorizontalCanvas() {

    }

    handleResizeHorizontal() {

        let resizingColumn = 0;
        let startXPos = 0;
        let resizeWidth = this.resizeWidth;


        this.selectColumnStart = 0;
        this.selectColumnEnd = 0;



        const getCurrColIndex = (pos) => {
            this.updateScrollChanges();
            let colStartPosition = this.horStartPos;
            let colInd = this.currStartColInd;
            while (colInd < this.horizontalArr.length && colStartPosition < pos) {
                colStartPosition += this.horizontalArr[colInd].width;
                colInd += 1;
            }

            return colInd
        }



        const checkForResizeRange = (pos) => {
            this.updateScrollChanges();
            let colStartPosition = this.horStartPos;
            let colInd = this.currStartColInd;
            while (colInd < this.horizontalArr.length && colStartPosition + resizeWidth < pos) {
                colStartPosition += this.horizontalArr[colInd].width;
                colInd += 1;
            }
            if (colInd > 0 && Math.abs(pos - colStartPosition) < resizeWidth / 2) {
                return [true, colInd - 1];
            }
            return [false, colInd];
        };

        const onMouseDown = (e) => {

            e.preventDefault()
            e.stopPropagation();


            startXPos = e.offsetX;

            let [isResizable, colInd] = checkForResizeRange(startXPos);
            isResizable && !this.isSelectingColumn ? this.horizontalCanvas.style.cursor = 'col-resize' : "";

            if (isResizable) {
                this.isResizingHor = true;
                resizingColumn = colInd;
                this.handleSelection()

            }
            else {
                if (e.button == 0) {

                    this.selectedCells = []
                    this.startInputCell = null
                    this.endInputCell = null
                    this.hideInputElement()
                    this.isInputOn = false;
                    this.handleRowOn = false;
                    this.isSelectingColumn = true;
                    this.selectColumnStart = getCurrColIndex(startXPos);
                    this.selectColumnEnd = this.selectColumnStart;
                    this.handleColumnOn = true;

                    this.handleSelection()

                }
            }
            // console.log("a")


        };

        const onMouseMove = (e) => {

            e.preventDefault()
            e.stopPropagation();
            let endXPos = e.offsetX;

            let [isResizable, colInd] = checkForResizeRange(endXPos);
            isResizable && !this.isSelectingColumn ? this.horizontalCanvas.style.cursor = 'col-resize' : this.horizontalCanvas.style.cursor = "default";

            if (this.isResizingHor && !this.isSelectingColumn) {
                const diff = endXPos - startXPos;
                this.horizontalCanvas.style.cursor = 'col-resize';
                this.headerCellsMaker.resizeColumn(resizingColumn, diff);

                startXPos = endXPos;

                this.renderer.renderCanvas();
                this.updateInputPositionAndValue();
                this.handleRectangleToMake();
                this.handleSelection();

            }
            else if (this.isSelectingColumn) {
                this.isInputOn = false
                this.selectColumnEnd = getCurrColIndex(endXPos)

                this.handleScrolling(e)
                this.handleSelection();


            }
            // console.log("a")

        };


        const onMouseUp = (e) => {

            e.preventDefault()
            e.stopPropagation();
            if (this.isResizingHor) {
                this.isResizingHor = false;
            }

            if (this.isSelectingColumn) {
                this.isSelectingColumn = false;
            }
        };

        this.horizontalCanvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);

        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);

    }



    handleResizeVertical() {
        let resizingRow = 0;
        let startYPos = 0;
        let resizeHeight = this.resizeHeight;

        this.selectRowStart = 0;
        this.selectRowEnd = 0;


        const getCurrRowIndex = (pos) => {
            this.updateScrollChanges();
            let rowStartPosition = this.verStartPos;
            let rowInd = this.currStartRowInd;
            while (rowInd < this.verticalArr.length && rowStartPosition < pos) {
                rowStartPosition += this.verticalArr[rowInd].height;
                rowInd += 1;
            }

            return rowInd
        }

        const checkForResizeRange = (pos) => {
            this.updateScrollChanges();
            let rowStartPosition = this.verStartPos;
            let rowInd = this.currStartRowInd;
            while (rowInd < this.verticalArr.length && rowStartPosition + resizeHeight < pos) {
                rowStartPosition += this.verticalArr[rowInd].height;
                rowInd += 1;
            }
            if (rowInd > 0 && Math.abs(pos - rowStartPosition) < resizeHeight / 2) {
                return [true, rowInd - 1];
            }
            return [false, ""];
        };

        const onMouseDown = (e) => {
            e.preventDefault()
            e.stopPropagation();
            startYPos = e.offsetY;

            let [isResizable, rowInd] = checkForResizeRange(startYPos);
            isResizable ? this.verticalCanvas.style.cursor = 'row-resize' : "";

            if (isResizable) {
                this.isResizingVer = true;
                resizingRow = rowInd;
                this.handleSelection()

            }
            else {

                if (e.button == 0) {

                    this.selectedCells = []
                    this.startInputCell = null
                    this.endInputCell = null
                    this.hideInputElement()
                    this.isInputOn = false;
                    this.handleColumnOn = false;
                    this.isSelectingRow = true;
                    this.isMarching = false;
                    this.selectRowStart = getCurrRowIndex(startYPos);
                    this.selectRowEnd = this.selectRowStart;
                    this.handleRowOn = true;
                    this.handleSelection()


                }
            }
            // console.log("a")


        };

        const onMouseMove = (e) => {
            e.preventDefault()
            e.stopPropagation();
            let endYPos = e.offsetY;

            let [isResizable, rowInd] = checkForResizeRange(endYPos);
            isResizable ? this.verticalCanvas.style.cursor = 'row-resize' : this.verticalCanvas.style.cursor = "default";

            if (this.isResizingVer && !this.isSelectingColumn) {
                const diff = endYPos - startYPos;
                this.verticalCanvas.style.cursor = 'row-resize';
                this.headerCellsMaker.resizeRow(resizingRow, diff);

                startYPos = endYPos;

                this.renderer.renderCanvas();
                // this.updateInputPositionAndValue();
                this.handleRectangleToMake();
                this.handleSelection()

            }
            else if (this.isSelectingRow) {

                this.isInputOn = false
                this.selectRowEnd = getCurrRowIndex(endYPos)

                this.handleScrolling(e)
                this.handleSelection()


            }
            // console.log("a")


        };

        const onMouseUp = (e) => {
            e.preventDefault()
            e.stopPropagation();
            if (this.isResizingVer) {
                this.isResizingVer = false;
            }
            if (this.isSelectingRow) {
                this.isSelectingRow = false;
            }
        };

        this.verticalCanvas.addEventListener('mousedown', onMouseDown);
        this.verticalCanvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousemove', onMouseMove);

        this.verticalCanvas.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
    }

    //getter
    getRowColFromCanvasPosition(xPos, yPos) {
        this.updateScrollChanges();

        let newXPos = xPos + this.renderer.horizontallyScrolled;
        let newYPos = yPos + this.renderer.verticallyScrolled;

        let colInd = this.currStartColInd;
        while (this.horizontalArr[colInd].x + this.horizontalArr[colInd].width < newXPos) {
            colInd += 1;
        }

        let rowInd = this.currStartRowInd;
        while (this.verticalArr[rowInd].y + this.verticalArr[rowInd].height < newYPos) {
            rowInd += 1;
        }

        return { rowInd: rowInd, colInd: colInd };
    }

    //getter
    getAdjestedPositions(xPos, yPos) {
        const rect = this.spreadsheetCanvas.getBoundingClientRect();
        // Calculate the relative coordinates
        const relativeX = xPos - rect.left;
        const relativeY = yPos - rect.top;
        return { relativeX, relativeY }
    }


    updateInputPositionAndValue() {
        if (!this.startInputCell || this.handleColumnOn) {
            return;
        }

        let currData = this.startInputCell;
        let cellWidth = this.horizontalArr[currData.colInd].width;
        let cellHeight = this.verticalArr[currData.rowInd].height;
        let rowStartPos = this.verticalArr[currData.rowInd].y - this.renderer.verticallyScrolled;
        let colStartPos = this.horizontalArr[currData.colInd].x - this.renderer.horizontallyScrolled;

        this.inputEle.value = this.ll.getValueAtInd(currData.rowInd, currData.colInd);

        this.inputEle.style.display = 'inline';
        this.inputEle.style.top = `${rowStartPos}px`;
        this.inputEle.style.left = `${colStartPos}px`;
        this.inputEle.style.width = `${cellWidth - 4}px`;
        this.inputEle.style.height = `${cellHeight - 4}px`;
        this.inputEle.blur();

    }

    hideInputElement() {
        if (this.isInputOn) {
            this.inputEle.style.display = 'none';

        }
    }

    handleDocumentClick() {
        window.addEventListener("click", (e) => {

            if (!this.sheet.sheet.contains(e.target)) {
                this.hideInputElement();
            }
        });
    }



    saveInputData() {
        if (!this.startInputCell) {
            return;
        }

        let rowInd = this.startInputCell.rowInd;
        let colInd = this.startInputCell.colInd;
        let data = this.inputEle.value;

        // if (data === '') {
        //     this.ll.deleteNode(rowInd + 1, colInd + 1);
        //     this.handleApis.updateCellToBackend(rowInd,colInd,data)

        // } else {
        this.ll.setValueAtInd(rowInd, colInd, data);
        this.handleApis.updateCellToBackend(rowInd, colInd, data)
        // }

        this.renderer.renderCanvas();
    }

    resetInputBox() {
        // console.log("resetting input");
        this.inputEle.value = '';
    }

    handleMouseDown(e) {
        e.preventDefault();

        // console.log("mouse down");

        if (this.isInputOn) {
            this.saveInputData();
            this.resetInputBox();
        }

        this.isInputOn = true;


        this.handleColumnOn = false;
        this.selectColumnStart = null;
        this.selectColumnEnd = null;

        //reset marching ants event if present
        this.handleColumnOn = false;
        this.handleRowOn = false;
        this.renderer.endMarchingAnts();
        this.isMarching = false;

        this.startInputCell = this.getRowColFromCanvasPosition(e.offsetX, e.offsetY);
        this.endInputCell = this.startInputCell;

        this.updateInputPositionAndValue();

        this.isDragging = true;
        this.selectedCells = [];

        if (this.startInputCell && !this.isSelectingColumn) {
            this.updateSelectionData(this.startInputCell, this.startInputCell);
        }
        this.handleRectangleToMake(e);

        // Add event listeners for mousemove and mouseup
        this.addMouseEventListeners();
    }

    handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isSelectingColumn) {
            return;
        }

        if (this.isInputOn && this.isDragging) {
            this.handleScrolling(e);

            const { relativeX, relativeY } = this.getAdjestedPositions(e.clientX, e.clientY);
            let currCell = this.getRowColFromCanvasPosition(relativeX, relativeY);

            if (currCell.colInd != this.endInputCell.colInd || currCell.rowInd != this.endInputCell.rowInd) {
                // console.log("moved to another cell then only render")
                this.endInputCell = currCell;
                // this.renderer.renderCanvas();
                this.updateSelectionData(this.startInputCell, this.endInputCell)
                this.handleRectangleToMake();
            }

        }
    }

    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        this.isDragging = false;
        this.removeMouseEventListeners();
    }

    handleScrolling(event) {
        event.preventDefault();
        event.stopPropagation();

        // console.log("handling scrolling with selecting");

        const { relativeX, relativeY } = this.getAdjestedPositions(event.clientX, event.clientY);
        const edgeDistance = 50;
        const canvas = this.spreadsheetCanvas;

        if (relativeX < edgeDistance && event.movementX < 0) {
            this.scroll.updateScrollByDiffHor(-10);
        } else if (relativeX > canvas.clientWidth - edgeDistance && event.movementX > 0) {
            this.scroll.updateScrollByDiffHor(+10);
        }

        if (relativeY < edgeDistance && event.movementY < 0) {
            this.scroll.handleWheelScrollVer(-10);
        } else if (relativeY > canvas.clientHeight - edgeDistance && event.movementY > 0) {
            this.scroll.handleWheelScrollVer(+10);
        }
    }

    getXWidthForColumnSelect(colStartInd, colEndInd) {
        let colStartLeft = this.horizontalArr[colStartInd - 1].x;
        let colStartRight = this.horizontalArr[colStartInd - 1].x + this.horizontalArr[colStartInd - 1].width;
        // console.log(colStartLeft,colStartRight)

        let colEndLeft = this.horizontalArr[colEndInd - 1].x;
        let colEndRight = this.horizontalArr[colEndInd - 1].x + this.horizontalArr[colEndInd - 1].width;
        // console.log(colEndLeft,colEndRight)


        let x = Math.min(colStartLeft, colEndLeft)
        let end = Math.max(colStartRight, colEndRight)

        return [x, end - x]

    }

    getYHeightForRowSelect(rowStartInd, rowEndInd) {
        let rowStartTop = this.verticalArr[rowStartInd - 1].y;
        let rowStartBottom = this.verticalArr[rowStartInd - 1].y + this.verticalArr[rowStartInd - 1].height;
        // console.log(colStartLeft,colStartRight)

        let rowEndTop = this.verticalArr[rowEndInd - 1].y;
        let rowEndBottom = this.verticalArr[rowEndInd - 1].y + this.verticalArr[rowEndInd - 1].height;
        // console.log(colEndLeft,colEndRight)


        let y = Math.min(rowStartTop, rowEndTop)
        let end = Math.max(rowStartBottom, rowEndBottom)

        return [y, end - y]

    }

    getScrolls() {
        let horizontallyScrolled = this.sheet.scroll.getHorizontallyScrolled();
        let verticallyScrolled = this.sheet.scroll.getVerticallyScrolled();
        return [horizontallyScrolled, verticallyScrolled]
    }

    handleColumnSelection(horizontallyScrolled) {
        let headerColorOnSelect = 'rgb(37,160,84,0.8';
        this.renderer.renderCanvas();
        let [x, width] = this.getXWidthForColumnSelect(this.selectColumnStart, this.selectColumnEnd)
        this.renderer.drawRectangleOnHorizontalCanvas(x - horizontallyScrolled, width, headerColorOnSelect);
        this.renderer.drawRectangleOnVerticalCanvas(0, this.spreadsheetCanvas.height)
        this.renderer.drawRectangleOnMainCanvas(x - horizontallyScrolled, 0, width, this.spreadsheetCanvas.height)
    }


    handleRowSelection(verticallyScrolled) {
        let headerColorOnSelect = 'rgb(37,160,84,0.8';
        this.renderer.renderCanvas();
        let [y, height] = this.getYHeightForRowSelect(this.selectRowStart, this.selectRowEnd)
        this.renderer.drawRectangleOnHorizontalCanvas(0, this.spreadsheetCanvas.width);
        this.renderer.drawRectangleOnVerticalCanvas(y - verticallyScrolled, height, headerColorOnSelect)
        this.renderer.drawRectangleOnMainCanvas(0, y - verticallyScrolled, this.spreadsheetCanvas.width, height)
    }

    handleSelection() {
        let [horizontallyScrolled, verticallyScrolled] = this.getScrolls()
        this.renderer.renderCanvas();
        if (this.startInputCell && this.endInputCell) {
            // console.log("calling handle rect to make ", this.startInputCell, this.endInputCell)
            this.handleRectangleToMake();
        }
        else if (this.handleColumnOn) {
            // console.log("calling column select ", this.handleColumnOn)
            this.handleColumnSelection(horizontallyScrolled)
        }
        else if (this.handleRowOn) {
            // console.log("calling row select ", this.handleRowOn)
            this.handleRowSelection(verticallyScrolled)
        }
    }

    handleRectangleToMake() {

        // console.log(this.startInputCell, this.endInputCell)
        if (!this.startInputCell || !this.endInputCell) {
            return;
        }

        let startCellXTop = this.horizontalArr[this.startInputCell.colInd].x - this.renderer.horizontallyScrolled;
        let startCellYTop = this.verticalArr[this.startInputCell.rowInd].y - this.renderer.verticallyScrolled;
        let startCellXBottom = this.horizontalArr[this.startInputCell.colInd].x + this.horizontalArr[this.startInputCell.colInd].width - this.renderer.horizontallyScrolled;
        let startCellYBottom = this.verticalArr[this.startInputCell.rowInd].y + this.verticalArr[this.startInputCell.rowInd].height - this.renderer.verticallyScrolled;

        let currCell = this.endInputCell;

        let currCellXTop = this.horizontalArr[currCell.colInd].x - this.renderer.horizontallyScrolled;
        let currCellYTop = this.verticalArr[currCell.rowInd].y - this.renderer.verticallyScrolled;
        let currCellXBottom = this.horizontalArr[currCell.colInd].x + this.horizontalArr[currCell.colInd].width - this.renderer.horizontallyScrolled;
        let currCellYBottom = this.verticalArr[currCell.rowInd].y + this.verticalArr[currCell.rowInd].height - this.renderer.verticallyScrolled;

        const minX = Math.min(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const minY = Math.min(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);
        const maxX = Math.max(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const maxY = Math.max(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);

        if (this.isMarching) {
            this.renderer.endMarchingAnts()
            this.renderer.drawMarchingAnts(minX, minY, maxX - minX, maxY - minY);
        }

        this.renderer.drawSelectionRectangles(minX, minY, maxX - minX, maxY - minY);
    }

    getStartIndexEndIndex() {
        return [this.startInputCell, this.endInputCell]
    }

    getSelectedCells() {
        return this.selectedCells;
    }

    updateSelectionData(startCell, endCell) {

        const minRow = Math.min(startCell.rowInd, endCell.rowInd);
        const maxRow = Math.max(startCell.rowInd, endCell.rowInd);
        const minCol = Math.min(startCell.colInd, endCell.colInd);
        const maxCol = Math.max(startCell.colInd, endCell.colInd);

        this.selectedCells = Array.from({ length: maxRow - minRow + 1 }, () => Array(maxCol - minCol + 1).fill(''));

        let x = 0;
        for (let row = minRow; row <= maxRow; row++) {
            let y = 0;
            for (let col = minCol; col <= maxCol; col++) {
                let ele = this.ll.getValueAtInd(row, col);
                if (ele !== "") {
                    this.selectedCells[x][y] = ele;
                }
                y++;
            }
            x++;
        }

        let obj = this.minorFunctions.get_Min_Max_Avg_Sum_Count_OfArray(this.selectedCells);
        this.updateSelectedCellToUI(obj);

    }


    addMouseEventListeners() {
        document.addEventListener('pointermove', this.handleMouseMoveBound);
        document.addEventListener('pointerup', this.handleMouseUpBound);
    }

    removeMouseEventListeners() {
        document.removeEventListener('pointermove', this.handleMouseMoveBound);
        document.removeEventListener('pointerup', this.handleMouseUpBound);
    }

    handleMouseEventsOnSheet() {
        this.spreadsheetCanvas.addEventListener('pointerdown', this.handleMouseDownBound);
    }

    getXYWidthHeight() {

        if (!this.startInputCell || !this.endInputCell) {
            return;
        }

        let startCellXTop = this.horizontalArr[this.startInputCell.colInd].x - this.renderer.horizontallyScrolled;
        let startCellYTop = this.verticalArr[this.startInputCell.rowInd].y - this.renderer.verticallyScrolled;
        let startCellXBottom = this.horizontalArr[this.startInputCell.colInd].x + this.horizontalArr[this.startInputCell.colInd].width - this.renderer.horizontallyScrolled;
        let startCellYBottom = this.verticalArr[this.startInputCell.rowInd].y + this.verticalArr[this.startInputCell.rowInd].height - this.renderer.verticallyScrolled;

        let currCell = this.endInputCell;

        let currCellXTop = this.horizontalArr[currCell.colInd].x - this.renderer.horizontallyScrolled;
        let currCellYTop = this.verticalArr[currCell.rowInd].y - this.renderer.verticallyScrolled;
        let currCellXBottom = this.horizontalArr[currCell.colInd].x + this.horizontalArr[currCell.colInd].width - this.renderer.horizontallyScrolled;
        let currCellYBottom = this.verticalArr[currCell.rowInd].y + this.verticalArr[currCell.rowInd].height - this.renderer.verticallyScrolled;

        const minX = Math.min(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const minY = Math.min(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);
        const maxX = Math.max(startCellXTop, startCellXBottom, currCellXTop, currCellXBottom);
        const maxY = Math.max(startCellYTop, startCellYBottom, currCellYTop, currCellYBottom);

        return { minX, minY, maxX, maxY }

    }

    handleKeyEventsOnSheet() {
        window.addEventListener('keydown', (e) => {

            if (((e.ctrlKey && e.key === 'c' && this.isDragging == false) || (e.ctrlKey && e.key === 'x' && this.isDragging == false))) {
                this.renderer.endMarchingAnts();//if exists
                this.isMarching = false;
                let { minX, minY, maxX, maxY } = this.getXYWidthHeight();
                this.minorFunctions.copyToClipboard2DArr(this.selectedCells);
                // console.log("marching ants ")
                this.renderer.drawMarchingAnts(minX, minY, maxX - minX, maxY - minY);
                this.isMarching = true;
            }
            else if ((e.ctrlKey && e.key === 'v' && this.isDragging == false)) {
                this.isMarching = false;
                this.minorFunctions.pasteClipboard(this.startInputCell, this.endInputCell);


                this.renderer.renderCanvas();
                this.updateInputPositionAndValue();
                this.handleRectangleToMake();

            }
            else if ((e.key === 'Delete') && !this.handleColumnOn && !this.handleRowOn) {
                this.minorFunctions.deleteFromLinkedList(this.startInputCell, this.endInputCell);


                this.renderer.renderCanvas();
                this.updateInputPositionAndValue();
                this.handleRectangleToMake();
            }
            else if (e.key == 'Enter' && this.isInputOn) {
                this.startInputCell = null;
                this.endInputCell = null;
                this.selectedCells = [];
                this.hideInputElement();
                this.renderer.renderCanvas()
                // this.updateInputPositionAndValue()
            }
            else if ((e.key === 'Delete' && this.handleColumnOn)) {
                //delete whole column
                console.log("delete whole column")
            }
            else if ((e.key === 'Delete' && this.handleRowOn)) {
                //delete whole row
                console.log("delete whole row")
                this.deleteSelectedRows();
            }
            else if ((e.key === 'i' && this.handleRowOn)) {
                console.log("inserting");
                this.insertRows(1)
            }
        })
    }

    deleteSelectedRows() {
        let listOfRowInd = [];
        for (let i = this.selectRowStart; i <= this.selectRowEnd; i++) {
            listOfRowInd.push(this.verticalArr[i - 1].next.data);
        }
        this.sheet.handleApis.deleteRows(listOfRowInd);
        console.log(listOfRowInd)

        this.sheet.ll.deleteRowsBulk(this.selectRowStart, this.selectRowEnd)

        this.sheet.renderer.renderCanvas();
        // console.log("a")

        this.handleSelection()
    }



    handleContextMenu() {
        let contextMenu = document.getElementById('contextMenuHeaders')

        this.sheet.verticalCanvas.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent the default context menu

            if(!this.handleRowOn){
                return
            }

            // Get the x and y coordinates of the click
            const x = e.clientX;
            const y = e.clientY;

            console.log(x, y)

            // Set the position of the context menu
            contextMenu.style.top = `${y}px`;
            contextMenu.style.left = `${x}px`;

            // Show the context menu
            contextMenu.style.display = 'block';
        })

        // Hide the context menu when clicking outside
        document.addEventListener('click', function (event) {
            // if (!contextMenu.contains(event.target)) {
                contextMenu.style.display = 'none'; // Hide the context menu
            // }
        });

        this.handleContextMenuEvents()
    }

    insertRowsAfter(numOfRows){
        this.sheet.handleApis.insertRows(this.selectRowStart, numOfRows);
        this.sheet.ll.insertRows(this.selectRowStart, numOfRows);
        this.sheet.renderer.renderCanvas();
    }
    
    insertRowsBefore(numOfRows){
        this.sheet.handleApis.insertRows(this.selectRowStart-1, numOfRows);
        this.sheet.ll.insertRows(this.selectRowStart-1, numOfRows);
        this.sheet.renderer.renderCanvas();
    }

    handleContextMenuEvents() {
        document.getElementById('deleteRowBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteSelectedRows();
        })

        document.getElementById('insertRowAfterBtn').addEventListener('click', (e)=>{
            e.preventDefault();
            let numOfRows = parseInt(prompt("Number of Rows to insert "));
            console.log(numOfRows)
            this.insertRowsAfter(numOfRows);
        })

        
        document.getElementById('insertRowBeforeBtn').addEventListener('click', (e)=>{
            e.preventDefault();
            let numOfRows = parseInt(prompt("Number of Rows to insert "));
            console.log(numOfRows)
            this.insertRowsBefore(numOfRows);
        })
    }


}