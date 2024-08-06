// import { Sheet } from "./sheet.js";


export class Excel {
    /**
     * 
     * @param {HTMLElement} rowContainer 
     * @param {number} row 
     * @param {number} col 
     */

    constructor(rowContainer, row, col) {

        this.rowContainer = rowContainer;
        this.col = col;
        this.row = row;

        this.excel = null;

        //array for maintaining multiple sheets
        /**
         * @type {Sheet{}}
         */
        this.sheets = {};

        this.activeSheetIndex = 0;

        this.init();
    }

    init() {
        this.createExcelDOM();
        this.createNewSheet();
        this.createNewSheet();
        this.createNewSheet();
        this.deleteSheet(1);

        console.log(this.sheets)
    }

    updateFooterDisplay(){
        this.excel.querySelector('.sheetBtns').innerHTML = ''

        for (let key in this.sheets) {
            if (this.sheets.hasOwnProperty(key)) {
                let sheetBtn = document.createElement('div');
                sheetBtn.className = 'sheetBtn'
                sheetBtn.innerHTML = key;
                this.excel.querySelector('.sheetBtns').appendChild(sheetBtn)
            }
        }
    }

    updateSheetDisplay() {
        this.excel.querySelector('.sheetsDiv').innerHTML = ''
        this.excel.querySelector('.sheetsDiv').appendChild(this.sheets[`sheet${this.activeSheetIndex}`]);
    }

    createExcelDOM() {
        const excel = document.createElement('div');
        excel.className = 'excel'
        excel.setAttribute('id', `excel_${this.row}_${this.col}`);
        this.rowContainer.appendChild(excel);
        this.excel = excel;

        const sheetsDiv = document.createElement('div');
        sheetsDiv.className = 'sheetsDiv';
        excel.appendChild(sheetsDiv)

        const footer = document.createElement('div');
        footer.className = 'footer';

        const addNewSheetBtn = document.createElement('div');
        addNewSheetBtn.className = 'addBtn';
        addNewSheetBtn.innerHTML = '+'

        const sheetBtns = document.createElement('div');
        sheetBtns.className = 'sheetBtns';

        footer.appendChild(addNewSheetBtn)
        footer.appendChild(sheetBtns)

        excel.appendChild(footer)

    }

    createNewSheet() {
        const sheet = document.createElement('div');
        sheet.className = 'sheet';

        let numOfSheets = Object.keys(this.sheets).length;

        this.activeSheetIndex = numOfSheets+1;

        sheet.setAttribute('id', `sheet_${this.row}_${this.col}_${this.activeSheetIndex}`)
        this.sheets[`sheet${this.activeSheetIndex}`] = sheet;

        this.updateSheetDisplay();
        this.updateFooterDisplay();
    }

    deleteSheet(index) {
        //edgecase
        if (Object.keys(this.sheets).length <= 1) {
            alert("First Sheet can't be Deleted")
            return -1;
        }

        index==1 ? this.activeSheetIndex = index+1 : this.activeSheetIndex = index-1;
        
        delete this.sheets[`sheet${index}`]
        this.updateSheetDisplay();
        this.updateFooterDisplay();
    }

}