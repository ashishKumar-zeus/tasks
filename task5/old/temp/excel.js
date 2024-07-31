
export class Excel{
    constructor(excelHeight, excelWidth, mainContainer){
        this.excelHeight = excelHeight;
        this.excelWidth = excelWidth;
        this.mainContainer = mainContainer;
        this.init();
    }

    init(){
        this.constructExcel();
    }

    constructExcel(){
        
        const excel = document.createElement('div');
        excel.className = 'excel';

        excel.style.width = `${this.excelWidth}px`;
        excel.style.height = `${this.excelWidth}px`;
        
        this.mainContainer.appendChild(excel)
        
    }

    
}