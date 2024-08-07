
export class Functionalities {
    constructor(sheet) {

        this.renderor = sheet.renderor;
        this.headerCellsMaker = sheet.headerCellsMaker;

        console.log(sheet.ll);

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

        this.currSelectedCell = null;

        this.init();




    }

    init() {
        this.handleResizeHorizontal();
        this.handleResizeVertical();
        this.handleMouseEventsOnSheet()
    }

    updateScrollChanges() {
        this.horStartPos = this.renderor.getHorStartPos()
        this.verStartPos = this.renderor.getVerStartPos()
        this.currStartColInd = this.renderor.getCurrColInd()
        this.currStartRowInd = this.renderor.getCurrRowInd()

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
                this.renderor.renderCanvas();
                startXPos = endXPos;
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
        this.spreadsheetCanvas.addEventListener('mousemove', onMouseMove);

        this.horizontalCanvas.addEventListener('mouseup', onMouseUp);
        this.spreadsheetCanvas.addEventListener('mouseup', onMouseUp);


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
                this.renderor.renderCanvas();
                startYPos = endYPos;
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
        this.spreadsheetCanvas.addEventListener('mousemove', onMouseMove);

        this.verticalCanvas.addEventListener('mouseup', onMouseUp);
        this.spreadsheetCanvas.addEventListener('mouseup', onMouseUp);


    }


    getRowCol(xPos, yPos) {
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

        return { "rowInd": rowInd, "colInd": colInd, "rowStartPos": this.verticalArr[rowInd].y, "colStartPos": this.horizontalArr[colInd].x }
    }

    updateInput() {

        if (this.currSelectedCell == null) {
            return;
        }

        let currData = this.currSelectedCell;

        let cellWidth = this.horizontalArr[currData.colInd].width;
        let cellHeight = this.verticalArr[currData.rowInd].height;
        let rowStartPos = currData.rowStartPos - this.renderor.verticallyScrolled;
        let colStartPos = currData.colStartPos - this.renderor.horizontallyScrolled;

        //getting data
        this.inputEle.value = this.ll.getValueAtInd(currData.rowInd, currData.colInd);
        this.inputEle.style.display = 'inline-block';
        this.inputEle.style.top = `${rowStartPos}px`;
        this.inputEle.style.left = `${colStartPos}px`;
        this.inputEle.style.width = `${cellWidth}px`;
        this.inputEle.style.height = `${cellHeight}px`;

    }

    saveInputData(rowInd, colInd , data) {

        console.log(this.currSelectedCell)

        if(data == ''){
            console.log('deleting')
            this.ll.deleteNode(rowInd+1,colInd+1);
        }
        else{
            this.ll.setValueAtInd(rowInd, colInd, data);
        }

        this.renderor.renderCanvas()
    }

    resetInputBox(){
        this.inputEle.value = '';
    }

    handleMouseDown(e) {

        if(this.isInputOn){
            //some other input is clicked then save their values and reset input
            this.saveInputData(this.currSelectedCell.rowInd,this.currSelectedCell.colInd, this.inputEle.value);
            this.resetInputBox();
        }

        //setting input for this click
        this.isInputOn = true;

        e.preventDefault();

        //dealing with new input cell on mousedown
        this.currSelectedCell = this.getRowCol(e.offsetX, e.offsetY);
        this.updateInput();
    }

    handleMouseMove(e) {
        
        if (this.isInputOn) {
            this.isDragging = true;
        }
    }

    handleMultipleSelecting(){
        if(this.isDragging){
            
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }


    handleMouseEventsOnSheet() {

        this.spreadsheetCanvas.addEventListener('mousedown', (e) => { this.handleMouseDown(e) })
        this.spreadsheetCanvas.addEventListener('mousemove', (e) => { this.handleMouseMove(e) })
        this.spreadsheetCanvas.addEventListener('mouseup', (e) => { this.handleMouseUp(e) })


    }


}