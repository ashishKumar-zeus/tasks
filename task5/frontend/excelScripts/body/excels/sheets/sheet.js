
import { Scroll } from './utilities/scroll.js'
import { Renderer } from './utilities/renderer.js'
import { LinkedList } from './data/linkedList.js'
import { HeaderCellsMaker } from './utilities/headerCellMaker.js'
import { Functionalities } from './utilities/functionalities.js';
import { HandleApis } from './apis/handleApis.js';
import { NavFunctionalities } from './utilities/navFunctionalitites.js';
import { MinorFunctions } from './utilities/minorFunctions.js';
import { Graph } from './utilities/graph.js';

export class Sheet {

    constructor(currSheet, updateSelectedCellsInfoFunc) {

        this.id = currSheet.getAttribute('id')

        this.sheet = currSheet;

        this.createCanvas();
        this.createGraphs();

        this.updateSelectedCellsInfo = updateSelectedCellsInfoFunc;

        setTimeout(() => {
            this.init()
        }, 1);
    }

    createGraphs() {
        // Create the main graph div
        const graphDiv = document.createElement('div');
        graphDiv.classList.add('graph');
        graphDiv.setAttribute('id','graph')

        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.classList.add('graphClose');
        closeButton.innerHTML = 'X'

        // Create the canvas element
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'graphCanvas');

        // Append the button and canvas to the graph div
        graphDiv.appendChild(closeButton);
        graphDiv.appendChild(canvas);

        // Append the graph div to the container
        document.body.appendChild(graphDiv);

        // Event listener to close the graph when the close button is clicked
        closeButton.addEventListener('click', function () {
            graphDiv.remove();
        });
    }

    createCanvas() {

        let topSection = document.createElement('div');
        topSection.className = 'topSection';

        let nothing = document.createElement('div');
        nothing.className = 'nothing'

        let upperCanvas = document.createElement('upperCanvas');
        upperCanvas.className = 'upperCanvas';

        let horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.setAttribute('id', `horizontalCanvas${this.id}`);
        horizontalCanvas.className = 'horizontalCanvas'


        upperCanvas.appendChild(horizontalCanvas);
        topSection.appendChild(nothing)
        topSection.appendChild(upperCanvas);

        let middleSection = document.createElement('div');
        middleSection.className = 'middleSection';

        let verticalCanvas = document.createElement('canvas');
        verticalCanvas.setAttribute('id', `verticalCanvas${this.id}`);
        verticalCanvas.className = 'verticalCanvas'


        let fullCanvas = document.createElement('div');
        fullCanvas.setAttribute('id', `fullCanvas${this.id}`);
        fullCanvas.className = 'fullCanvas'


        let spreadsheetCanvas = document.createElement('canvas');
        spreadsheetCanvas.setAttribute('id', `spreadsheetCanvas${this.id}`);
        spreadsheetCanvas.className = 'spreadsheetCanvas'


        let verticalScroll = document.createElement('div');
        verticalScroll.setAttribute('id', `verticalScroll${this.id}`);
        verticalScroll.className = 'verticalScroll';


        let verticalBar = document.createElement('div');
        verticalBar.className = 'verticalBar'
        verticalBar.setAttribute('id', `verticalBar${this.id}`)


        verticalScroll.appendChild(verticalBar)


        let horizontalScroll = document.createElement('div');
        horizontalScroll.setAttribute('id', `horizontalScroll${this.id}`);
        horizontalScroll.className = 'horizontalScroll';


        let horizontalBar = document.createElement('div');
        horizontalBar.setAttribute('id', `horizontalBar${this.id}`)
        horizontalBar.className = 'horizontalBar'


        horizontalScroll.appendChild(horizontalBar);

        let inputEle = document.createElement('input');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('id', `cellInput${this.id}`)

        this.inputEle = inputEle;


        fullCanvas.appendChild(spreadsheetCanvas);
        fullCanvas.appendChild(verticalScroll);
        fullCanvas.appendChild(horizontalScroll);
        fullCanvas.appendChild(inputEle)

        middleSection.appendChild(verticalCanvas);
        middleSection.appendChild(fullCanvas);

        this.sheet.appendChild(topSection);
        this.sheet.appendChild(middleSection);

        //make all canvas and required variables
        this.horizontalCanvas = horizontalCanvas;
        this.verticalCanvas = verticalCanvas;
        this.horizontalScroll = horizontalScroll;
        this.verticalScroll = verticalScroll;
        this.horizontalBar = horizontalBar;
        this.verticalBar = verticalBar;
        this.spreadsheetCanvas = spreadsheetCanvas;
        this.fullCanvas = fullCanvas;


        //create CTX
        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');

    }

    init() {

        //scalling canvas
        this.scallingCanvas();

        this.handleApis = new HandleApis(this);

        this.headerCellsMaker = new HeaderCellsMaker(this.horizontalCanvas, this.verticalCanvas, this.handleApis);

        this.minorFunctions = new MinorFunctions(this);

        this.ll = new LinkedList(this.headerCellsMaker);

        this.renderer = new Renderer(this)

        this.functionality = new Functionalities(this)

        this.navFunctionalities = new NavFunctionalities(this);

        //intiating ScrollFunctionalities
        this.scroll = new Scroll(this);

        this.graph = new Graph(this);

        // Set up the ResizeObserver
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.spreadsheetCanvas);

    }


    getCnv() {
        return [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas]
    }

    scallingCanvas() {


        const dpr = window.devicePixelRatio;

        //scalling horizontal c
        this.horizontalCanvas.width = Math.floor(this.horizontalCanvas.clientWidth)
        this.horizontalCanvas.height = Math.floor(this.horizontalCanvas.clientHeight)

        this.horizontalCnvCtx.scale(dpr, dpr)

        //scalling vertical canvas

        this.verticalCanvas.width = Math.floor(this.verticalCanvas.clientWidth)
        this.verticalCanvas.height = Math.floor(this.verticalCanvas.clientHeight)

        this.verticalCnvCtx.scale(dpr, dpr)

        //scalling main canvas
        this.spreadsheetCanvas.width = Math.floor(this.spreadsheetCanvas.clientWidth)
        this.spreadsheetCanvas.height = Math.floor(this.spreadsheetCanvas.clientHeight)


        this.spreadsheetCnvCtx.scale(dpr, dpr)


    }


    handleResize() {
        this.scallingCanvas();
        this.renderer.renderCanvas();
    }



}