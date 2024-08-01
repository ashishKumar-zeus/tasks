import { Sheet } from "./sheet.js";

export class Excel {

    constructor(rowContainer, row, col) {
        this.rowContainer = rowContainer;
        this.col = col;
        this.row = row;
        
        //code for div scalling temporary to be removed

        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 15;

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
        this.element = excel;
        let sheet = new Sheet(excel,this.row,this.col,this.rowContainer);

    }

    

}

