
export class Renderor {
    constructor(sheet) {

        this.resizeWidth = 12;
        this.resizeHeight = 8;
        this.offsetSharpness = 0.5;
        
        this.headerCellsMaker = sheet.headerCellsMaker;
        
        this.isResizingHor = false;
        this.isResizingVer = false;
        
        this.horizontalCanvas = null;
        this.verticalCanvas = null;
        this.spreadsheetCanvas = null;
        [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas] = sheet.getCnv();
        
        this.inputEle = sheet.inputEle;
        
        this.horizontalArr = sheet.headerCellsMaker.getHorizontalArray()
        this.verticalArr = sheet.headerCellsMaker.getVerticalArray()
        
        this.horizontalCnvCtx = sheet.horizontalCnvCtx;
        this.verticalCnvCtx = sheet.verticalCnvCtx;
        this.spreadsheetCnvCtx = sheet.spreadsheetCnvCtx;

        this.horizontallyScrolled = 0;
        this.verticallyScrolled = 0;

        this.accWidthHor = 0;
        this.accHeightVer = 0;
        this.currStartColInd = 0;
        this.currStartRowInd = 0;
        this.horStartPos = 0;
        this.verStartPos = 0;

        this.init();
    }

    init() {
        this.renderCanvas()
    }

    renderCanvas() {
        // this.horizontalCnvCtx.reset()
        // this.verticalCnvCtx.reset();
        // this.spreadsheetCnvCtx.reset();

        this.drawHorizontalCanvas(this.currStartColInd);
        this.drawVerticalCanvas(this.currStartRowInd);
        this.drawMainCanvas(this.currStartRowInd, this.currStartColInd);
    }

    getHorStartPos(){
        return this.horStartPos;
    }
    
    getVerStartPos(){
        return this.verStartPos;
    }

    getCurrColInd(){
        return this.currStartColInd
    }

    getCurrRowInd(){
        return this.currStartRowInd
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
        console.log("hor updated",this.horStartPos, this.currStartColInd)


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

        if (!this.horizontalCnvCtx) {
            alert("Horizontal Canvas ctx not found")
            return;
        }

        this.horizontalCnvCtx.clearRect(0, 0, this.horizontalCanvas.width, this.horizontalCanvas.height);

        //using stroke
        this.horizontalCnvCtx.strokeStyle = 'black';
        this.horizontalCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let x = this.horStartPos;

        for (let j = startInd; j <= this.horizontalArr.length; j++) {


            //making vertical line
            this.horizontalCnvCtx.beginPath();
            this.horizontalCnvCtx.moveTo(x, 0);
            this.horizontalCnvCtx.lineTo(x, this.horizontalCanvas.clientHeight);
            this.horizontalCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= this.horizontalCanvas.width) {
                break;
            }

            //making text
            let currCell = this.horizontalArr[j];
            this.horizontalCnvCtx.font = ' 14px Calibri ';
            this.horizontalCnvCtx.textAlign = 'center';
            this.horizontalCnvCtx.textBaseline = 'middle';
            this.horizontalCnvCtx.fillStyle = '#000';

            this.horizontalCnvCtx.fillText(this.getColName(currCell.value.data), x + currCell.width / 2, currCell.y + currCell.height / 2);



            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";

        }

    }

    drawVerticalCanvas(startInd) {

        //using strokes
        if (!this.verticalCnvCtx) {
            alert("Vertical Canvas ctx not found")
            return;
        }

        this.verticalCnvCtx.clearRect(0, 0, this.verticalCanvas.width, this.verticalCanvas.height);

        this.verticalCnvCtx.strokeStyle = 'black';
        this.verticalCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let y = this.verStartPos;
        for (let j = startInd; j <= this.verticalArr.length; j++) {

            //making horizontal lines
            this.verticalCnvCtx.beginPath();
            this.verticalCnvCtx.moveTo(0, y);
            this.verticalCnvCtx.lineTo(this.verticalCanvas.clientWidth, y);
            this.verticalCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= this.verticalCanvas.height) {
                break;
            }
            //making text

            let currCell = this.verticalArr[j];
            this.verticalCnvCtx.font = '14px Calibri';
            this.verticalCnvCtx.textAlign = 'right';
            this.verticalCnvCtx.textBaseline = 'bottom';
            this.verticalCnvCtx.fillStyle = '#000';
            this.verticalCnvCtx.fillText(currCell.value.data, currCell.x + currCell.width - 10, y + currCell.height - 5);

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

            if (currCol.x - this.horizontallyScrolled > this.spreadsheetCanvas.width) {
                break;
            }

            //making text
            this.spreadsheetCnvCtx.font = '14px Calibri';
            this.spreadsheetCnvCtx.textAlign = 'right';
            this.spreadsheetCnvCtx.textBaseline = 'bottom';
            this.spreadsheetCnvCtx.fillStyle = 'black';
            this.spreadsheetCnvCtx.fillText(currRowEle.data, currCol.x - this.horizontallyScrolled + currCol.width - 10, currRow.y - this.verticallyScrolled + currRow.height - 5)

            currRowEle = currRowEle.right;

        }

    }

    drawMainCanvas(startRowInd, startColInd) {

        if (!this.spreadsheetCnvCtx) {
            alert("main Canvas ctx not found")
            return;
        }

        this.spreadsheetCnvCtx.clearRect(0, 0, this.spreadsheetCanvas.width, this.spreadsheetCanvas.height);

        this.spreadsheetCnvCtx.strokeStyle = 'black';
        this.spreadsheetCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let x = this.horStartPos;
        for (let j = startColInd; j <= this.horizontalArr.length; j++) {
            this.spreadsheetCnvCtx.beginPath();
            this.spreadsheetCnvCtx.moveTo(x, 0);
            this.spreadsheetCnvCtx.lineTo(x, this.spreadsheetCanvas.height);
            this.spreadsheetCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= this.horizontalCanvas.width) {
                break;
            }


            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";
        }

        let y = this.verStartPos;
        for (let j = startRowInd; j <= this.verticalArr.length; j++) {
            this.spreadsheetCnvCtx.beginPath();
            this.spreadsheetCnvCtx.moveTo(0, y);
            this.spreadsheetCnvCtx.lineTo(this.spreadsheetCanvas.width, y);
            this.spreadsheetCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= this.verticalCanvas.height) {
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


}