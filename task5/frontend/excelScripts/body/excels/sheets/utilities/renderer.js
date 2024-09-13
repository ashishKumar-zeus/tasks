
export class Renderer {
    constructor(sheet) {

        this.resizeWidth = 12;
        this.resizeHeight = 8;
        this.offsetSharpness = 0.5;

        this.headerCellsMaker = sheet.headerCellsMaker;

        this.horizontalCanvas = null;
        this.verticalCanvas = null;
        this.spreadsheetCanvas = null;
        [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas] = sheet.getCnv();

        // this.inputEle = sheet.inputEle;
        this.sheet = sheet;

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

        this.dashOffset = 0
        this.init();
    }

    init() {
        this.renderCanvas()
    }

    renderCanvas() {
        //creating canvases
        this.drawHorizontalCanvas(this.currStartColInd);
        this.drawVerticalCanvas(this.currStartRowInd);
        this.drawMainCanvas(this.currStartRowInd, this.currStartColInd);
    }

    getHorStartPos() {
        return this.horStartPos;
    }

    getVerStartPos() {
        return this.verStartPos;
    }

    getCurrColInd() {
        return this.currStartColInd
    }

    getCurrRowInd() {
        return this.currStartRowInd
    }

    renderCanvasOnScroll(horizontallyScrolled, verticallyScrolled) {

        if (this.horizontallyScrolled != horizontallyScrolled) {

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
            // console.log("hor updated", this.horStartPos, this.currStartColInd)

        }


        {
            // if (this.horizontallyScrolled != horizontallyScrolled) {

            //     horizontallyScrolled = parseInt(horizontallyScrolled)

            //     //for horizontal scrolling

            //     if (horizontallyScrolled >= this.horizontallyScrolled) {

            //         console.log("moving right")

            //         while (this.accWidthHor + this.horizontalArr[this.currStartColInd].width < horizontallyScrolled) {
            //             console.log("adding acc width")
            //             this.accWidthHor += this.horizontalArr[this.currStartColInd].width;
            //             this.currStartColInd += 1;
            //         }

            //         this.horStartPos = -horizontallyScrolled + this.accWidthHor;
            //         this.horizontallyScrolled = horizontallyScrolled;
            //         console.log(this.currStartColInd, this.horStartPos ,this.accWidthHor)
            //     }
            //     else {

            //         console.log("moving left")

            //         while (this.accWidthHor - this.horizontalArr[this.currStartColInd-1].width > horizontallyScrolled) {
            //             console.log("removing acc width")
            //             this.accWidthHor -= this.horizontalArr[this.currStartColInd-1].width;
            //             this.currStartColInd -= 1;
            //         }

            //         this.horStartPos = +horizontallyScrolled - this.accWidthHor;
            //         // this.horizontallyScrolled = horizontallyScrolled;
            //         console.log(this.currStartColInd, this.horStartPos,this.accWidthHor)
            //     }

            // }
        }

        if (this.verticallyScrolled != verticallyScrolled) {


            //for vertical scrolling
            this.verticallyScrolled = verticallyScrolled;
            let i = 0;
            this.accHeightVer = this.verticalArr[0].height;
            while (this.accHeightVer < this.verticallyScrolled) {
                i++;
                this.accHeightVer += this.verticalArr[i].height;
            }

            this.currStartRowInd = i;

            this.verStartPos = -this.verticallyScrolled + this.accHeightVer - this.verticalArr[i].height;

        }
        this.renderCanvas();
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

        let x = this.horStartPos - this.offsetSharpness;

        let position = this.horizontalArr[startInd].x;

        for (let j = startInd; position <= this.horizontalCanvas.clientWidth + this.horizontallyScrolled; j++) {


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

            position = this.horizontalArr[j + 1].x;


            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";

        }

        //making border
        this.horizontalCnvCtx.beginPath();
        this.horizontalCnvCtx.moveTo(0, this.horizontalCanvas.clientHeight - 1);
        this.horizontalCnvCtx.lineTo(this.horizontalCanvas.clientWidth, this.horizontalCanvas.clientHeight - 1);
        this.horizontalCnvCtx.stroke();

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

        let position = this.verticalArr[startInd].y;

        let y = this.verStartPos - this.offsetSharpness;
        for (let j = startInd; position <= this.verticalCanvas.clientHeight + this.verticallyScrolled; j++) {

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

            position = this.verticalArr[j + 1].y;

            (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";

        }

        //making border
        this.verticalCnvCtx.beginPath();
        this.verticalCnvCtx.moveTo(this.verticalCanvas.clientWidth - 1, 0);
        this.verticalCnvCtx.lineTo(this.verticalCanvas.clientWidth - 1, this.verticalCanvas.clientHeight);
        this.verticalCnvCtx.stroke();


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

            // Check if cell is outside the canvas
            if (currCol.x - this.horizontallyScrolled > this.spreadsheetCanvas.width) {
                break;
            }

            // Save canvas state
            this.spreadsheetCnvCtx.save();

            // Define clipping area (cell boundaries)
            this.spreadsheetCnvCtx.beginPath();
            this.spreadsheetCnvCtx.rect(
                currCol.x - this.horizontallyScrolled,
                currRow.y - this.verticallyScrolled,
                currCol.width,
                currRow.height
            );
            this.spreadsheetCnvCtx.clip();

            // Render the text within the clipping region
            this.spreadsheetCnvCtx.font = '14px Calibri';
            this.spreadsheetCnvCtx.textAlign = 'left';
            this.spreadsheetCnvCtx.textBaseline = 'bottom';
            this.spreadsheetCnvCtx.fillStyle = 'black';
            this.spreadsheetCnvCtx.fillText(
                currRowEle.data,
                currCol.x - this.horizontallyScrolled + 10,
                currRow.y - this.verticallyScrolled + currRow.height - 5
            );

            // Restore canvas state to avoid clipping other elements
            this.spreadsheetCnvCtx.restore();

            currRowEle = currRowEle.right;
        }

    }

    drawMainCanvas(startRowInd, startColInd) {

        // this.functionality.updateInputPositionAndValue();

        if (!this.spreadsheetCnvCtx) {
            alert("main Canvas ctx not found")
            return;
        }

        this.spreadsheetCnvCtx.clearRect(0, 0, this.spreadsheetCanvas.width, this.spreadsheetCanvas.height);

        this.spreadsheetCnvCtx.strokeStyle = 'black';
        this.spreadsheetCnvCtx.lineWidth = 1 - this.offsetSharpness;

        let x = this.horStartPos - this.offsetSharpness;
        for (let j = startColInd; j <= this.horizontalArr.length; j++) {
            this.spreadsheetCnvCtx.beginPath();
            this.spreadsheetCnvCtx.moveTo(x, 0);
            this.spreadsheetCnvCtx.setLineDash([])
            this.spreadsheetCnvCtx.lineTo(x, this.spreadsheetCanvas.height);
            this.spreadsheetCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= this.horizontalCanvas.width) {
                break;
            }


            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";
        }

        let y = this.verStartPos - this.offsetSharpness;
        for (let j = startRowInd; j <= this.verticalArr.length; j++) {
            this.spreadsheetCnvCtx.beginPath();
            this.spreadsheetCnvCtx.moveTo(0, y);
            this.spreadsheetCnvCtx.setLineDash([])

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


    fillRect(x, y, width, height) {

        this.spreadsheetCnvCtx.beginPath();
        this.spreadsheetCnvCtx.fillStyle = 'rgb(0, 128, 0, 0.1)'
        this.spreadsheetCnvCtx.fillRect(x, y, width, height);
    }


    drawRectangleOnMainCanvas(x, y, width, height) {
        this.spreadsheetCnvCtx.beginPath();
        this.spreadsheetCnvCtx.fillStyle = 'rgb(0, 128, 0, 0.1)'
        this.spreadsheetCnvCtx.fillRect(x, y, width, height);
        this.spreadsheetCnvCtx.rect(x, y, width, height);
        this.spreadsheetCnvCtx.strokeStyle = 'green';
        this.spreadsheetCnvCtx.lineWidth = 3;
        this.spreadsheetCnvCtx.stroke();
    }

    startMarchingAnts(x, y, width, height) {
        this.dashOffset++;
        if (this.dashOffset > 16) {
            this.dashOffset = 0;
        }
        this.drawDottedRect(x, y, width, height);
        this.wafId = window.requestAnimationFrame(() => {
            this.drawMainCanvas(this.currStartRowInd, this.currStartColInd);
            this.fillRect(x, y, width, height)

            this.startMarchingAnts(x, y, width, height);
        });
    }

    drawDottedRect(x, y, width, height) {
        this.spreadsheetCnvCtx.setLineDash([5, 5]);
        this.spreadsheetCnvCtx.lineDashOffset = -this.dashOffset;
        this.spreadsheetCnvCtx.strokeStyle = "rgba(0, 128, 0, 0.9)";
        this.spreadsheetCnvCtx.lineWidth = 4;
        this.spreadsheetCnvCtx.strokeRect(
            x, y, width, height
        );
        this.spreadsheetCnvCtx.setLineDash([]);
    }

    drawRectangleOnHorizontalCanvas(x, width,color = 'rgb(0, 128, 0, 0.1)' ) {
        this.horizontalCnvCtx.beginPath();
        this.horizontalCnvCtx.fillStyle = color;
        this.horizontalCnvCtx.fillRect(x, this.horizontalArr[0].y, width, this.horizontalArr[0].height);

        this.drawLine(this.horizontalCnvCtx, 'green', 4, x, this.horizontalArr[0].y + this.horizontalArr[0].height, x + width, this.horizontalArr[0].y + this.horizontalArr[0].height)
    }

    drawLine(ctx, color, lineWidth, x1, y1, x2, y2) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawRectangleOnVerticalCanvas(y, height,color='rgb(0, 128, 0, 0.1)') {
        

        this.verticalCnvCtx.beginPath();
        this.verticalCnvCtx.fillStyle = color;
        this.verticalCnvCtx.fillRect(this.verticalArr[0].x, y, this.verticalArr[0].width, height);

        this.drawLine(this.verticalCnvCtx, 'green', 4, this.verticalArr[0].x + this.verticalArr[0].width, y, this.verticalArr[0].x + this.verticalArr[0].width, y + height)
    }

    drawSelectionRectangles(x, y, width, height) {
        let color = 'rgb(0, 128, 0, 0.1)'
        this.renderCanvas();
        this.drawRectangleOnMainCanvas(x, y, width, height);
        this.drawRectangleOnHorizontalCanvas(x, width,color)
        this.drawRectangleOnVerticalCanvas(y, height,color)
    }

    drawMarchingAnts(x, y, width, height) {
        let color = 'rgb(0, 128, 0, 0.1)'
        this.renderCanvas();
        this.startMarchingAnts(x, y, width, height);
        this.drawRectangleOnHorizontalCanvas(x, width,color)
        this.drawRectangleOnVerticalCanvas(y, height,color);
    }

    endMarchingAnts() {
        if (this.wafId) {
            window.cancelAnimationFrame(this.wafId);
        }
        this.wafId = null;
    }

}