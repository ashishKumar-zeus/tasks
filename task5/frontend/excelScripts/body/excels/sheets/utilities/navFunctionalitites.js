export class NavFunctionalities {

    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {

        this.handleToggleNav();
        this.listOfResultIds = [];
        this.currResult = 0;
        
        let subNavigations = document.querySelectorAll('.subNavIndividual');

        let navButtons = document.querySelectorAll('.navButtons');

        subNavigations[0].classList.add('active')
        navButtons[0].classList.add('active')


    }

    async handleFileUpload(e) {

        e.preventDefault();
        console.log("uploaded file");

        const fileInput = document.getElementById('uploadFileInput');
        const file = fileInput.files[0];

        if (file) {

            const formData = new FormData();
            formData.append('file', file);

            this.sheet.handleApis.uploadFile(formData);

        } else {
            alert('Please select a file to upload.');
        }


    }




    handleToggleNav(){
        let subNavigations = document.querySelectorAll('.subNavIndividual');

        let navButtons = document.querySelectorAll('.navButtons');

        console.log(navButtons)

        for (let i = 0; i < navButtons.length; i++) {
            navButtons[i].addEventListener('click', (e)=>{
                e.preventDefault();

                //reset all other to display none

                for(let j=0;j<navButtons.length;j++){
                    navButtons[j].classList.remove('active')
                    subNavigations[j].classList.remove('active')
                }

                //set nav as active
                navButtons[i].classList.add('active');
                subNavigations[i].classList.add('active')
            });
          }
         

    }













    //find



    scrollToRowInd(rowInd) {
        let currRow = this.sheet.renderer.getCurrRowInd();

        let startRowPos = this.sheet.headerCellsMaker.verticalArr[currRow].y;
        let endRowPos = this.sheet.headerCellsMaker.verticalArr[rowInd].y;

        console.log('current start is ', startRowPos)
        console.log("currernt end will be ", endRowPos)

        //another way
        this.sheet.scroll.scrollTillRowInd(rowInd);

        console.log(this.sheet.scroll.verticallyScrolled);

    }
    // Update the result display with the current result and total results
    updateResultDisplay() {
        document.getElementById('resultDisplay').innerHTML = `${this.currResult + 1} of ${this.listOfResultIds.length}`;
    }

    // Navigate to the next result
    goToNextResult() {
        if (this.currResult < this.listOfResultIds.length - 1) {
            this.currResult++; // Move to the next result
            this.scrollToRowInd(this.listOfResultIds[this.currResult]);
            this.updateResultDisplay(); // Update the display
        } else {
            console.log('Reached the last result');
        }
    }

    // Navigate to the previous result
    goToPrevResult() {
        if (this.currResult > 0) {
            this.currResult--; // Move to the previous result
            this.scrollToRowInd(this.listOfResultIds[this.currResult]);
            this.updateResultDisplay(); // Update the display
        } else {
            console.log('Reached the first result');
        }
    }


    async handleSearch(searchTerm) {
        console.log("Finding the search string...");

        // Fetch the list of matching row indices for the search term
        this.listOfResultIds = await this.sheet.handleApis.search(searchTerm);
        this.currResult = 0; // Start with the first result

        console.log(this.listOfResultIds);

        // If no results, display a message
        if (this.listOfResultIds.length === 0) {
            document.getElementById('resultDisplay').innerHTML = 'No results found';
            return;
        }

        // Display the current match number and total matches
        this.updateResultDisplay();

        // Scroll to the first match
        this.scrollToRowInd(this.listOfResultIds[this.currResult]);
    }



}