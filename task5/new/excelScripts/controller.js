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
    // updateGridTemplateRows() {
    //     this.mainContainer.style.gridTemplateRows = Array(this.currentRowCount).fill(`${100 / this.currentRowCount}%`).join(' ');
    // }

    // updateGridTemplateColumns(row) {
    //     const colCount = row.children.length;
    //     row.style.gridTemplateColumns = Array(colCount).fill(`${100 / colCount}%`).join(' ');
    // }

    // handleResize() {
    //     const MIN_SIZE = 50; // Minimum size in pixels
    //     let isResizing = false;
    //     let currentRow = null;
    //     let currentCol = null;
    //     let initialSize = 0;
    //     let initialMousePos = 0;
    //     let isColumn = false;

    //     const startResize = (e, element, column) => {
    //         isResizing = true;
    //         isColumn = column;
    //         if (isColumn) {
    //             currentCol = element;
    //             initialSize = element.offsetWidth;
    //         } else {
    //             currentRow = element.closest('.row');
    //             initialSize = currentRow.offsetHeight;
    //         }
    //         initialMousePos = isColumn ? e.clientX : e.clientY;
    //         document.addEventListener('mousemove', resize);
    //         document.addEventListener('mouseup', stopResize);
    //         if (isColumn) {
    //             currentCol.classList.add('resizing');
    //         } else {
    //             currentRow.classList.add('resizing');
    //         }
    //     };

    //     const resize = (e) => {
    //         if (!isResizing) return;
    //         const containerRect = this.mainContainer.getBoundingClientRect();
    //         const maxSize = isColumn ? containerRect.width : containerRect.height;

    //         const delta = (isColumn ? e.clientX : e.clientY) - initialMousePos;
    //         let newSize = Math.max(MIN_SIZE, Math.min(initialSize + delta, maxSize - (this.rowArr.length - 1) * MIN_SIZE));

    //         if (isColumn) {
    //             currentCol.style.width = `${newSize}px`;
    //         } else {
    //             currentRow.style.height = `${newSize}px`;
    //         }

    //         this.updateGridLayout();
    //     };

    //     const stopResize = () => {
    //         isResizing = false;
    //         document.removeEventListener('mousemove', resize);
    //         document.removeEventListener('mouseup', stopResize);
    //         if (isColumn) {
    //             currentCol.classList.remove('resizing');
    //         } else if (currentRow) {
    //             currentRow.classList.remove('resizing');
    //         }
    //         currentCol = null;
    //         currentRow = null;
    //     };

    //     this.mainContainer.addEventListener('mousemove', (e) => {
    //         console.log('moing')
    //         const target = e.target.closest('.excel');
    //         if (!target) return;

    //         const rect = target.getBoundingClientRect();
    //         const isNearRightEdge = Math.abs(e.clientX - rect.right) < 5;
    //         const isNearBottomEdge = Math.abs(e.clientY - rect.bottom) < 5;

    //         if (isNearRightEdge) {
    //             this.mainContainer.style.cursor = 'col-resize';
    //         } else if (isNearBottomEdge) {
    //             this.mainContainer.style.cursor = 'row-resize';
    //         } else {
    //             this.mainContainer.style.cursor = 'default';
    //         }
    //     });

    //     this.mainContainer.addEventListener('mousedown', (e) => {
    //         const target = e.target.closest('.excel');
    //         if (!target) return;

    //         const rect = target.getBoundingClientRect();
    //         const isNearRightEdge = Math.abs(e.clientX - rect.right) < 5;
    //         const isNearBottomEdge = Math.abs(e.clientY - rect.bottom) < 5;

    //         if (isNearRightEdge) {
    //             startResize(e, target, true);
    //         } else if (isNearBottomEdge) {
    //             startResize(e, target, false);
    //         }
    //     });
    // }

    // updateGridLayout() {
    //     const containerRect = this.mainContainer.getBoundingClientRect();
    //     const totalWidth = containerRect.width;
    //     const totalHeight = containerRect.height;

    //     // Update column widths
    //     this.rowArr.forEach(row => {
    //         const columns = row.map(excel => excel.element.offsetWidth);
    //         const rowTotalWidth = columns.reduce((a, b) => a + b, 0);



    //         const adjustedColWidth = columns.map(width => (width / rowTotalWidth) * totalWidth);

    //         console.log(columns)


    //         row[0].element.parentElement.style.gridTemplateColumns = columns.map(width => `${width / rowTotalWidth * 100}%`).join(' ');

    //         row.forEach((col,ind)=>{
    //             console.log(col,ind)
    //             console.log(adjustedColWidth[ind])
    //             col.element.parentElement.style.width = `${adjustedColWidth[ind]}px`;
    //         })
    //     });

    //     // Update row heights
    //     const rowHeights = this.rowArr.map(row => row[0].element.parentElement.offsetHeight);
    //     const totalRowHeight = rowHeights.reduce((a, b) => a + b, 0);

    //     // Adjust row heights to fit container
    //     const adjustedRowHeights = rowHeights.map(height => (height / totalRowHeight) * totalHeight);

    //     this.mainContainer.style.gridTemplateRows = adjustedRowHeights.map(height => `${height / totalHeight * 100}%`).join(' ');

    //     // Update each row's height
    //     this.rowArr.forEach((row, index) => {
    //         row[0].element.parentElement.style.height = `${adjustedRowHeights[index]}px`;
    //     });

    // }


    handleResize() {
        let isResizing = false;
        let currentElement = null;
        let startX, startY, startWidth, startHeight;

        const checkForResizeRange = (xPos, yPos) => {
            const threshold = 5; // threshold for detecting borders

            const boxes = this.mainContainer.querySelectorAll('.excel');

            for (const box of boxes) {
                const rect = box.getBoundingClientRect();

                const isOnLeftBorder = xPos >= rect.left - threshold && xPos <= rect.left + threshold && xPos > 5;
                const isOnRightBorder = xPos >= rect.right - threshold && xPos <= rect.right + threshold && xPos < this.mainContainer.clientWidth - 5;
                const isOnTopBorder = yPos >= rect.top - threshold && yPos <= rect.top + threshold && yPos > 5;
                const isOnBottomBorder = yPos >= rect.bottom - threshold && yPos <= rect.bottom + threshold && yPos < this.mainContainer.clientHeight - 5;

                if (isOnLeftBorder || isOnRightBorder) {
                    this.mainContainer.style.cursor = 'col-resize';
                    return { element: box, direction: isOnLeftBorder ? 'left' : 'right' };
                } else if (isOnTopBorder || isOnBottomBorder) {
                    this.mainContainer.style.cursor = 'row-resize';
                    return { element: box, direction: isOnTopBorder ? 'top' : 'bottom' };
                }
            }

            this.mainContainer.style.cursor = '';
            return null;
        };

        //added to check if resize code is working or not
        this.mainContainer.addEventListener('mousedown', (e) => {
            const resizeInfo = checkForResizeRange(e.clientX, e.clientY);
            if (resizeInfo) {
                isResizing = true;
                currentElement = resizeInfo.element;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = currentElement.offsetWidth;
                startHeight = currentElement.offsetHeight;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) {
                checkForResizeRange(e.clientX, e.clientY);
                return;
            }

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (this.mainContainer.style.cursor === 'col-resize') {
                const newWidth = startWidth + dx;
                currentElement.style.width = `${newWidth}px`;
            } else if (this.mainContainer.style.cursor === 'row-resize') {
                const newHeight = startHeight + dy;
                currentElement.style.height = `${newHeight}px`;
            }

            this.updateGridTemplateLayout();
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            currentElement = null;
        });
    }

    updateGridTemplateLayout() {
        // Update main container layout
        const rowWidths = [];
        const colHeights = [];

        for (let i = 0; i < this.currRow; i++) {
            const row = document.getElementById(`row${i}`);
            const rowHeight = row.offsetHeight;
            colHeights.push(rowHeight);

            const cols = row.querySelectorAll('.excel');
            cols.forEach((col, index) => {
                if (i === 0) {
                    rowWidths[index] = col.offsetWidth;
                } else {
                    rowWidths[index] = Math.max(rowWidths[index], col.offsetWidth);
                }
            });
        }

        this.mainContainer.style.gridTemplateRows = colHeights.map(h => `${h}px`).join(' ');
        this.mainContainer.style.gridTemplateColumns = rowWidths.map(w => `${w}px`).join(' ');

        // Update row layouts
        for (let i = 0; i < this.currRow; i++) {
            const row = document.getElementById(`row${i + 1}`);
            row.style.gridTemplateColumns = rowWidths.map(w => `${w}px`).join(' ');
        }
    }


    init() {

        // setInitialCss
        this.mainContainer.style.display = "grid";

        //adding First Row
        this.addNewRow();
        // this.addNewRow()

        // this.addNewCol(1)

        this.handleResize()
        // this.updateGridLayout()

    }
}







