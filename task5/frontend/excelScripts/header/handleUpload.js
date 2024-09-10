export class HandleUpload {

    constructor(excelMaker) {

        this.excelMaker = excelMaker;
        
        this.barGraphBtn = document.getElementById("barGraphBtn")
        this.pieGraphBtn = document.getElementById("pieGraphBtn")
        this.lineGraphBtn = document.getElementById("lineGraphBtn")

        this.handleEvents();
    }


    handleFileUploadEvents() {
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.currSheet = this.excelMaker.getCurrSheet();
            this.currSheet.navFunctionalities.handleFileUpload(e);
        })
    }

    handleGraphCreation(){
        
        this.barGraphBtn.addEventListener("click", () => {
            this.currSheet = this.excelMaker.getCurrSheet();
            this.currSheet.graph.drawBarGraph();
        });

        this.lineGraphBtn.addEventListener("click", () => {
            this.currSheet = this.excelMaker.getCurrSheet();
            this.currSheet.graph.drawLineGraph();
        });

        this.pieGraphBtn.addEventListener("click", () => {
            this.currSheet = this.excelMaker.getCurrSheet();
            this.currSheet.graph.drawPieGraph();
        });
    }

    handleEvents() {
        this.handleFileUploadEvents();
        this.handleGraphCreation()
    }


}