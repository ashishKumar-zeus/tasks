
//imports
import { Scroll } from './scripts/scroll.js'
import { Renderor } from './scripts/renderor.js';
import { LinkedList } from './scripts/linkedList.js';
import { HeaderCellsMaker } from './scripts/headerCellsMaker.js';
import { Functionalities } from './scripts/functionalities.js'

export class Sheet {

    constructor(excel, row, col) {
        this.row = row;
        this.col = col;

        this.scale = 1;
        this.maxScale = 15;
        this.minScale = 0.5;

        this.excel = excel;

        this.createCanvas()

        setTimeout(() => {
            this.init()
        }, 1);
    }

    createCanvas() {

        let topSection = document.createElement('div');
        topSection.className = 'topSection';

        let nothing = document.createElement('div');
        nothing.className = 'nothing'

        let upperCanvas = document.createElement('upperCanvas');
        upperCanvas.className = 'upperCanvas';

        let horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.setAttribute('id', `horizontalCanvas${this.row}_${this.col}`);
        horizontalCanvas.className = 'horizontalCanvas'


        upperCanvas.appendChild(horizontalCanvas);
        topSection.appendChild(nothing)
        topSection.appendChild(upperCanvas);

        let middleSection = document.createElement('div');
        middleSection.className = 'middleSection';

        let verticalCanvas = document.createElement('canvas');
        verticalCanvas.setAttribute('id', `verticalCanvas${this.row}_${this.col}`);
        verticalCanvas.className = 'verticalCanvas'


        let fullCanvas = document.createElement('div');
        fullCanvas.setAttribute('id', `fullCanvas${this.row}_${this.col}`);
        fullCanvas.className = 'fullCanvas'


        let spreadsheetCanvas = document.createElement('canvas');
        spreadsheetCanvas.setAttribute('id', `spreadsheetCanvas${this.row}_${this.col}`);
        spreadsheetCanvas.className = 'spreadsheetCanvas'


        let verticalScroll = document.createElement('div');
        verticalScroll.setAttribute('id', `verticalScroll${this.row}_${this.col}`);
        verticalScroll.className = 'verticalScroll';


        let verticalBar = document.createElement('div');
        verticalBar.className = 'verticalBar'
        verticalBar.setAttribute('id', `verticalBar${this.row}_${this.col}`)


        verticalScroll.appendChild(verticalBar)


        let horizontalScroll = document.createElement('div');
        horizontalScroll.setAttribute('id', `horizontalScroll${this.row}_${this.col}`);
        horizontalScroll.className = 'horizontalScroll';


        let horizontalBar = document.createElement('div');
        horizontalBar.setAttribute('id', `horizontalBar${this.row}_${this.col}`)
        horizontalBar.className = 'horizontalBar'


        horizontalScroll.appendChild(horizontalBar);

        let inputEle = document.createElement('input');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('id', 'cellInput')

        fullCanvas.appendChild(spreadsheetCanvas);
        fullCanvas.appendChild(verticalScroll);
        fullCanvas.appendChild(horizontalScroll);
        fullCanvas.appendChild(inputEle)

        middleSection.appendChild(verticalCanvas);
        middleSection.appendChild(fullCanvas);

        this.excel.appendChild(topSection);
        this.excel.appendChild(middleSection);

        //make all canvas and required variables
        this.horizontalCanvas = horizontalCanvas;
        this.verticalCanvas = verticalCanvas;
        this.horizontalScroll = horizontalScroll;
        this.verticalScroll = verticalScroll;
        this.horizontalBar = horizontalBar;
        this.verticalBar = verticalBar;
        this.spreadsheetCanvas = spreadsheetCanvas;
        this.fullCanvas = fullCanvas;
        this.inputEle = inputEle;


        //create CTX
        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');


    }

    init() {


        //scalling canvas
        this.scallingCanvas();

        this.headerCellsMaker = new HeaderCellsMaker(this.horizontalCanvas, this.verticalCanvas);

        this.ll = new LinkedList(this.headerCellsMaker);

        this.renderor = new Renderor(this)

        this.functionality = new Functionalities(this)

        //intiating ScrollFunctionalities
        this.scroll = new Scroll(this);

                
        // Set up the ResizeObserver
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.spreadsheetCanvas);


        // this.scallingCanvas();

    }


    getCnv() {
        return [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas]
    }

    scallingCanvas() {

        // console.log('this is called');


        const dpr = window.devicePixelRatio;


        console.log("before ")
        console.log(this.spreadsheetCanvas.width, this.spreadsheetCanvas.clientWidth)

        //scalling horizontal canvas

        this.horizontalCanvas.width = Math.floor(this.horizontalCanvas.clientWidth * dpr)
        this.horizontalCanvas.height = Math.floor(this.horizontalCanvas.clientHeight * dpr)

        this.horizontalCnvCtx.scale(dpr, dpr)

        //scalling vertical canvas

        this.verticalCanvas.width = Math.floor(this.verticalCanvas.clientWidth * dpr)
        this.verticalCanvas.height = Math.floor(this.verticalCanvas.clientHeight * dpr)

        this.verticalCnvCtx.scale(dpr, dpr)

        //scalling main canvas
        this.spreadsheetCanvas.width = Math.floor(this.spreadsheetCanvas.clientWidth * dpr)
        this.spreadsheetCanvas.height = Math.floor(this.spreadsheetCanvas.clientHeight * dpr)


        this.spreadsheetCnvCtx.scale(dpr, dpr)

        console.log("After")
        console.log(this.spreadsheetCanvas.width, this.spreadsheetCanvas.clientWidth)




    }


    secondScaleing(){
        
        // Set up the ResizeObserver
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.spreadsheetCanvas);
        this.resizeObserver.observe(this.horizontalCanvas);
        this.resizeObserver.observe(this.verticalCanvas);

    
        this.resizeCanvases();

    }

    
    resizeCanvases() {
        const dpr = window.devicePixelRatio;
        this.updateCanvasDimensions(this.horizontalCanvas,dpr)
        this.updateCanvasDimensions(this.verticalCanvas, dpr)
        this.updateCanvasDimensions(this.spreadsheetCanvas,dpr)
        // Object.values(this.canvases).forEach(canvas => this.updateCanvasDimensions(canvas, dpr));
        this.renderor.renderCanvas();
    }

    updateCanvasDimensions(canvas, dpr) {
        const rect = canvas.getBoundingClientRect();

        console.log("before",canvas , rect.width , canvas.clientWidth)

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        console.log("after",canvas , rect.width , canvas.clientWidth)

    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.canvases.spreadsheet.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }

    handleResize() {
        this.resizeCanvases();
         
    }

}