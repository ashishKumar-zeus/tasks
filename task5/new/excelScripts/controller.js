import { Excel } from '../excelScripts/excel.js';

export class Controller {

    //this is a controller class responsible for controlling number of excels and various excels to be opened.

    constructor(mainContainer, maxRow, maxCol) {

        this.mainContainer = mainContainer;//refrence to mainContainer
        this.maxRow = maxRow;
        this.maxCol = maxCol; //max number of rows and columns able to be made

        this.currRow = 0; //how many rows are there currently

        this.rowArr = []; //array of rows that contains excel refrence

        this.init();

    }

    addNewRow() {

        if (this.currRow >= this.maxRow) {
            alert("No more excel can be added")
            return;
        }

        //increase row Value
        this.currRow += 1;

        //creating row div
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('id', `row${this.currRow}`)
        row.style.display = 'grid'
        row.style.gridTemplateColumns = '100%';

        const excel = new Excel(row, this.currRow, 1);

        this.rowArr[this.currRow - 1] = [excel];


        this.mainContainer.appendChild(row);

        //applying changes to main grid % values
        let newGTR = ""
        for (let i = 0; i < this.currRow; i++) {
            newGTR += `${100 / this.currRow}% `;
        }


        this.mainContainer.style.gridTemplateRows = newGTR;
        this.mainContainer.style.gridTemplateColumns = '';

    }

    addNewCol(rowNum) {

        //getting the row element


        let colNum = this.rowArr[rowNum - 1].length;

        if (colNum >= this.maxCol) {
            alert("No more excel can be added")
            return;
        }

        let rowRef = document.getElementById(`row${rowNum}`);

        colNum += 1;

        const excel = new Excel(rowRef, rowNum, colNum);

        this.rowArr[rowNum - 1].push(excel);

        //applying changes to main grid % values
        let newGTC = ""
        for (let i = 0; i < colNum; i++) {
            newGTC += `${100 / colNum}% `;
        }

        rowRef.style.gridTemplateColumns = newGTC;
        rowRef.style.gridTemplateRows = '';

    }

    interchangeLayout() {

        //main container interchange
        let gtC = this.mainContainer.style.gridTemplateColumns;
        let gtR = this.mainContainer.style.gridTemplateRows;

        this.mainContainer.style.gridTemplateColumns = gtR;
        this.mainContainer.style.gridTemplateRows = gtC;


        //for each rows

        for (let i = 0; i < this.currRow; i++) {
            let currEle = document.getElementById(`row${i + 1}`);

            let gtC = currEle.style.gridTemplateColumns;
            let gtR = currEle.style.gridTemplateRows;

            currEle.style.gridTemplateColumns = gtR;
            currEle.style.gridTemplateRows = gtC;
        }

    }

    handleResize() {
        const checkForResizeRange = (xPos, yPos) => {
            const threshold = 5; // threshold for detecting borders

            const boxes = this.mainContainer.querySelectorAll('.excel');

            boxes.forEach((box) => {
                const rect = box.getBoundingClientRect();

                const isOnLeftBorder = xPos >= rect.left - threshold && xPos <= rect.left + threshold && xPos > 5;
                const isOnRightBorder = xPos >= rect.right - threshold && xPos <= rect.right + threshold && xPos < this.mainContainer.clientWidth - 5;
                const isOnTopBorder = yPos >= rect.top - threshold && yPos <= rect.top + threshold && xPos > 5;
                const isOnBottomBorder = yPos >= rect.bottom - threshold && yPos <= rect.bottom + threshold && xPos < this.mainContainer.clientHeight - 5;

                if (isOnLeftBorder || isOnRightBorder) {
                    this.mainContainer.style.cursor = 'col-resize'; // change cursor to resize
                } else if (isOnTopBorder || isOnBottomBorder) {
                    this.mainContainer.style.cursor = 'row-resize'; // change cursor to resize
                }
                else {
                    this.mainContainer.style.cursor = ''; // reset cursor
                }
            });

            return
        };

        this.mainContainer.addEventListener('mousemove', (e) => {
            let xPos = e.clientX;
            let yPos = e.clientY;

            [] = checkForResizeRange(xPos, yPos);
        });
    }


    init() {

        // setInitialCss
        this.mainContainer.style.display = "grid";

        //adding First Row
        this.addNewRow();



        // this.addNewRow()
        // this.addNewCol(1)
        // this.addNewCol(2)

        // this.addNewCol(1)
        // this.addNewCol(2)




        // this.handleResize();

    }
}







