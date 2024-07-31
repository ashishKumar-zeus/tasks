import { Sheet } from "./sheet.js";

export class Excel {

    constructor(rowContainer, row, col) {
        this.rowContainer = rowContainer;
        this.col = col;
        this.row = row;

        this.init();
    }

    init() {
        this.constructExcel();
    }

    constructExcel() {

        const excel = document.createElement('div');
        excel.className = 'excel';
        excel.setAttribute('id', `rowCol${this.row}_${this.col}`)
        this.rowContainer.appendChild(excel)
        new Sheet(excel,this.row,this.col,this.rowContainer);

    }

}