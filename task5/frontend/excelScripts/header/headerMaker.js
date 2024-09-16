import { HandleUpload } from "./handleUpload.js";

export class HeaderMaker {
    constructor(headerElement, excelMaker) {

        this.headerElement = headerElement;

        this.excelMaker = excelMaker;

        // this.createHeaderElements();
        new HandleUpload(this.excelMaker);
        this.handleEvents();

        // this.sheetInstance.
    }

    createHeaderElements() {
        // Create the nav div
        const navDiv = document.createElement('div');
        navDiv.className = 'nav';

        // Create the form element
        const uploadForm = document.createElement('form');
        uploadForm.id = 'uploadForm';

        // Create the file input
        const uploadFileInput = document.createElement('input');
        uploadFileInput.type = 'file';
        uploadFileInput.id = 'uploadFileInput';

        // Create the submit button
        const uploadButton = document.createElement('button');
        uploadButton.type = 'submit';
        uploadButton.textContent = 'Upload';

        // Append the file input and submit button to the form
        uploadForm.appendChild(uploadFileInput);
        uploadForm.appendChild(uploadButton);

        // Append the form to the nav div
        navDiv.appendChild(uploadForm);

        // Create the tools div
        const toolsDiv = document.createElement('div');
        toolsDiv.className = 'tools';

        const progressBar = document.createElement('progress');
        progressBar.setAttribute("id", "progressBar");
        progressBar.className = 'progressBar'
        progressBar.setAttribute("value", 0);
        progressBar.setAttribute("max", 100);

        const pBarLabel = document.createElement('p');
        pBarLabel.className = 'pBarLabel'
        pBarLabel.innerHTML = `${0}%`;


        // Append both the nav and tools divs to the header element
        this.headerElement.appendChild(navDiv);
        this.headerElement.appendChild(toolsDiv);

        this.headerElement.appendChild(progressBar);
        this.headerElement.appendChild(pBarLabel)


        const barGraphBtn = document.createElement('button');
        barGraphBtn.className = ' graphBtns';
        barGraphBtn.setAttribute('id', 'barGraphBtn')
        barGraphBtn.innerHTML = 'Bar';


        const pieGraphBtn = document.createElement('button');
        pieGraphBtn.className = 'graphBtns';
        pieGraphBtn.setAttribute('id', 'pieGraphBtn')

        pieGraphBtn.innerHTML = 'Pie';

        const lineGraphBtn = document.createElement('button');
        lineGraphBtn.className = 'lineGraphBtn graphBtns';
        lineGraphBtn.setAttribute('id', 'lineGraphBtn');
        lineGraphBtn.innerHTML = 'Line';


        const search = document.createElement('div');
        search.className = 'searchElements'


        // Input box
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('id', 'searchInput');
        searchInput.setAttribute('placeholder', 'Search text...');

        // Search button
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('id', 'searchBtn');
        searchBtn.innerText = 'Search';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.setAttribute('id', 'prevBtn');
        prevBtn.innerText = 'Prev';

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.setAttribute('id', 'nextBtn');
        nextBtn.innerText = 'Next';

        const resultDisplay = document.createElement('p');
        resultDisplay.setAttribute('id','resultDisplay')
        resultDisplay.innerHTML = '';


        search.appendChild(searchInput)
        search.appendChild(searchBtn)
        search.appendChild(prevBtn)
        search.appendChild(nextBtn)
        search.appendChild(resultDisplay)


        this.headerElement.appendChild(barGraphBtn)
        this.headerElement.appendChild(pieGraphBtn)
        this.headerElement.appendChild(lineGraphBtn)
        this.headerElement.appendChild(search)


    }

    handleEvents(){

        

    }

}







