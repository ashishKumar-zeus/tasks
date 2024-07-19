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
    constructor(numOfRows, numOfCols, initialWidthHorizontal, initialHeigthHorizontal, initialWidthVertical, initialHeigthVertical) {
        this.horizontalArr = [];
        this.verticalArr = [];
        this.numOfCols = numOfCols;
        this.numOfRows = numOfRows;
        this.initialWidthHorizontal = initialWidthHorizontal;
        this.initialHeigthHorizontal = initialHeigthHorizontal;
        this.initialWidthVertical = initialWidthVertical;
        this.initialHeigthVertical = initialHeigthVertical;

        this.init()
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

        this.drawHorizontalCanvas(0);
        this.drawVerticalCanvas(0);
        this.drawMainCanvas(0, 0)
    }

    drawHorizontalCanvas(startInd) {

        if (!horizontalCnvCtx) {
            alert("Horizontal Canvas ctx not found")
            return;
        }


        //using stroke
        //     {
        //         // horizontalCnvCtx.strokeStyle = '#D3D3D3';
        //         // horizontalCnvCtx.lineWidth = 1;

        //         // let x = 0;
        //         // for (let j = startInd; j <= this.horizontalArr.length; j++) {
        //         //     horizontalCnvCtx.beginPath();
        //         //     horizontalCnvCtx.moveTo(x, 0);
        //         //     horizontalCnvCtx.lineTo(x, this.initialHeigthHorizontal);
        //         //     horizontalCnvCtx.stroke();
        //         //     (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";
        //         // }
        //         // horizontalCnvCtx.fillStyle = '#D3D3D3';
        // }

        //using rect
        horizontalCnvCtx.strokeStyle = '#D3D3D3';
        horizontalCnvCtx.lineWidth = 1;

        for (let j = startInd; j <= this.horizontalArr.length; j++) {
            if (!this.horizontalArr[j]) {
                return;
            }

            const currCell = this.horizontalArr[j];
            //making rectangles
            horizontalCnvCtx.strokeRect(currCell.x, currCell.y, currCell.width, currCell.height);

            //making text
            horizontalCnvCtx.font = ' 14px Calibri ';
            horizontalCnvCtx.textAlign = 'center';
            horizontalCnvCtx.textBaseline = 'middle';
            horizontalCnvCtx.fillStyle = '#000';

            horizontalCnvCtx.fillText((currCell.value.data + 9).toString(36).toUpperCase(), currCell.x + currCell.width / 2, currCell.y + currCell.height / 2);
        }



    }

    drawVerticalCanvas(startInd) {

        //using strokes
        //         {
        //         // if (!verticalCnvCtx) {
        //         //     alert("Vertical Canvas ctx not found")
        //         //     return;
        //         // }

        //         // verticalCnvCtx.strokeStyle = '#D3D3D3';
        //         // verticalCnvCtx.lineWidth = 1;

        //         // let y = 0;
        //         // for (let j = startInd; j <= this.verticalArr.length; j++) {
        //         //     verticalCnvCtx.beginPath();
        //         //     verticalCnvCtx.moveTo(0, y);
        //         //     verticalCnvCtx.lineTo(this.initialWidthVertical,y);
        //         //     verticalCnvCtx.stroke();
        //         //     (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";
        //         // }
        // }

        //using rect
        verticalCnvCtx.strokeStyle = '#D3D3D3';
        verticalCnvCtx.lineWidth = 1;

        for (let j = startInd; j <= this.verticalArr.length; j++) {
            if (!this.verticalArr[j]) {
                return;
            }
            const currCell = this.verticalArr[j];
            //making rectangles
            verticalCnvCtx.strokeRect(currCell.x, currCell.y, currCell.width, currCell.height);

            //making text
            verticalCnvCtx.font = '14px Calibri';
            verticalCnvCtx.textAlign = 'right';
            verticalCnvCtx.textBaseline = 'bottom';
            verticalCnvCtx.fillStyle = '#000';
            verticalCnvCtx.fillText(currCell.value.data, currCell.x + 50, currCell.y + currCell.height - 5);
        }

    }

    drawMainCanvas(startRowInd, startColInd) {

        if (!spreadsheetCnvCtx) {
            alert("main Canvas ctx not found")
            return;
        }
        // {
        //         spreadsheetCnvCtx.strokeStyle = '#D3D3D3';
        //         spreadsheetCnvCtx.lineWidth = 1;

        //         let x = 0;
        //         for (let j = startColInd; j <= this.horizontalArr.length; j++) {
        //             spreadsheetCnvCtx.beginPath();
        //             spreadsheetCnvCtx.moveTo(x, 0);
        //             spreadsheetCnvCtx.lineTo(x, spreadsheetCanvas.height);
        //             spreadsheetCnvCtx.stroke();
        //             (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";
        //         }

        //         let y = 0;
        //         for (let j = startRowInd; j <= this.verticalArr.length; j++) {
        //             spreadsheetCnvCtx.beginPath();
        //             spreadsheetCnvCtx.moveTo(0, y);
        //             spreadsheetCnvCtx.lineTo(spreadsheetCanvas.width, y);
        //             spreadsheetCnvCtx.stroke();
        //             (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";
        //         }


        spreadsheetCnvCtx.strokeStyle = '#D3D3D3';
        spreadsheetCnvCtx.lineWidth = 1;


        for (let j = 0; j < this.verticalArr.length; j++) {


            for (let j = startInd; j <= this.horizontalArr.length; j++) {
                if (!this.horizontalArr[j]) {
                    return;
                }

                const currCell = this.horizontalArr[j];
                //making rectangles
                horizontalCnvCtx.strokeRect(currCell.x, currCell.y, currCell.width, currCell.height);

                //making text
                horizontalCnvCtx.font = ' 14px Calibri ';
                horizontalCnvCtx.textAlign = 'center';
                horizontalCnvCtx.textBaseline = 'middle';
                horizontalCnvCtx.fillStyle = '#000';

                horizontalCnvCtx.fillText((currCell.value.data + 9).toString(36).toUpperCase(), currCell.x + currCell.width / 2, currCell.y + currCell.height / 2);
            }
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
        this.horizontalArr[index].width += diff;
        for (let i = index + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].x += diff;
        }
    }


    resizeRow(index, diff) {
        this.verticalArr[index].height += diff;
        for (let i = index + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].y += diff;
        }
    }

    addRowAtInd(ind) {

        let oldRow = this.verticalArr[ind];

        let newRow = new HeaderCell(oldRow.x, oldRow.y, this.initialWidthHorizontal, this.initialHeigthHorizontal, ind + 1);

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

        this.horizontalArr.splice(ind, 1)

        for (let i = ind; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data -= 1;
            this.horizontalArr[i].x -= this.initialWidthHorizontal;
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




}