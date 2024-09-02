export class HandleUpload {

    constructor(excelMaker) {
        this.excelMaker = excelMaker;
        this.handleEvents();
    }


    handleFileUploadEvents() {
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.currSheet = this.excelMaker.getCurrSheet();
            console.log(this.currSheet);
            this.currSheet.navFunctionalities.handleFileUpload(e);
        })
    }

    handleEvents() {
        this.handleFileUploadEvents();
    }


}