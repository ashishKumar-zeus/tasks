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

    handleSearch() {
        let searchInput = document.getElementById('searchInput');
        this.currSheet = this.excelMaker.getCurrSheet()
        document.getElementById('searchBtn').addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            console.log(searchTerm);
            this.currSheet.navFunctionalities.handleSearch(searchTerm);
        })


        document.getElementById('prevBtn').addEventListener('click',()=>{
            this.currSheet.navFunctionalities.goToPrevResult();
        })
        document.getElementById('nextBtn').addEventListener('click',()=>{
            this.currSheet.navFunctionalities.goToNextResult();
        })
    }


    handleGraphCreation() {

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
        this.handleSearch();
    }


}