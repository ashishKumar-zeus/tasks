
//imports
import { Scroll } from './scripts/scroll.js'
import { MiniCanvas } from './scripts/miniCanvas.js';
import { LinkedList } from './scripts/linkedList.js'

export class Sheet {

    constructor(excel,row,col) {
        this.row = row ;
        this.col = col;


        this.scale = 1;
        this.maxScale = 15;
        this.minScale = 0.5;
        
        this.excel = excel;
        this.horizontalCnvCtx = null;
        this.verticalCnvCtx = null;
        this.spreadsheetCnvCtx = null;
        

        this.horizontalCanvas = null;
        this.verticalCanvas = null;
        this.spreadsheetCanvas = null;


        this.verticalBar = null;
        this.horizontalBar = null;
        this.fullCanvas = null;
        this.horizontalScroll = null;
        this.verticalScroll = null;

        this.createCanvas()
    }

    createCanvas() {
        
        //mutation observer observes whether the excel is modified and as modified then the init is called
        const observer = new MutationObserver((mutationsList,observer)=>{

            for(let mutation of mutationsList){
                if(mutation.type === 'childList'){
                    this.init();
                    observer.disconnect();
                }
            }
        });

        observer.observe(this.excel,{childList: true});


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

        fullCanvas.appendChild(spreadsheetCanvas);
        fullCanvas.appendChild(verticalScroll);
        fullCanvas.appendChild(horizontalScroll);

        middleSection.appendChild(verticalCanvas);
        middleSection.appendChild(fullCanvas);

        let inputEle = document.createElement('input');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('id', 'cellInput')

        this.excel.appendChild(topSection);
        this.excel.appendChild(middleSection);
        this.excel.appendChild(inputEle)

        //make all canvas and required variables
        this.horizontalCanvas = horizontalCanvas;
        this.verticalCanvas = verticalCanvas;
        this.horizontalScroll = horizontalScroll;
        this.verticalScroll = verticalScroll;
        this.horizontalBar = horizontalBar;
        this.verticalBar = verticalBar;
        this.spreadsheetCanvas = spreadsheetCanvas;
        this.fullCanvas = fullCanvas;

        // console.log(horizontalCanvas,verticalCanvas)

    }

    init() {

        //create CTX
        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');

        //scalling canvas
        this.scallingCanvas();


        //initiating Canvas Formation
        const inititalNumOfCols = 1000;
        const initialNumOfRows = 500;
        const initialWidthHorizontal = 100;
        const initialHeightHorizontal = this.horizontalCanvas.clientHeight;
        const initialWidthVertical = this.verticalCanvas.clientWidth;
        const initialHeightVertical = 30;
        const resizeWidth = 12;
        const resizeHeight = 8;
        const offsetSharpness = 0.5;

        let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth, resizeHeight, offsetSharpness, this.getCnv, this.getCtx)

        const horizontalArr = miniCanvas.horizontalArr;
        const verticalArr = miniCanvas.verticalArr;

        const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

        //intiating ScrollFunctionalities
        new Scroll(this.fullCanvas, this.horizontalBar, this.horizontalScroll, this.verticalBar, this.verticalScroll, miniCanvas);

    }

    get getCtx() {
        return [this.horizontalCnvCtx, this.verticalCnvCtx, this.spreadsheetCnvCtx];
    }

    get getCnv() {
        return [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas]
    }

    scallingCanvas() {

        const dpr = window.devicePixelRatio;

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


    }


    // draw() {


    //     this.horizontalCnvCtx.scale(this.scale,this.scale)
    //     this.verticalCnvCtx.scale(this.scale,this.scale)
    //     this.spreadsheetCnvCtx.scale(this.scale,this.scale)

        
    //    //initiating Canvas Formation
    //    const inititalNumOfCols = 1000;
    //    const initialNumOfRows = 500;
    //    const initialWidthHorizontal = 100;
    //    const initialHeightHorizontal = this.horizontalCanvas.clientHeight;
    //    const initialWidthVertical = this.verticalCanvas.clientWidth;
    //    const initialHeightVertical = 30;
    //    const resizeWidth = 12;
    //    const resizeHeight = 8;
    //    const offsetSharpness = 0.5;

    //    let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth, resizeHeight, offsetSharpness, this.getCnv, this.getCtx)

    //    const horizontalArr = miniCanvas.horizontalArr;
    //    const verticalArr = miniCanvas.verticalArr;

    //    const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

    //    //intiating ScrollFunctionalities
    //    new Scroll(this.fullCanvas, this.horizontalBar, this.horizontalScroll, this.verticalBar, this.verticalScroll, miniCanvas);

    // }

    // resizeCanvas() {
    //     let rect = this.spreadsheetCanvas.getBoundingClientRect();
    //     console.log(rect)
    //     this.spreadsheetCanvas.width = rect.width * window.devicePixelRatio;
    //     this.spreadsheetCanvas.height = rect.height * window.devicePixelRatio;
    //     this.spreadsheetCnvCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

        

    //      rect = this.horizontalCanvas.getBoundingClientRect();
    //     console.log(rect)
    //     this.horizontalCanvas.width = rect.width * window.devicePixelRatio;
    //     this.horizontalCanvas.height = rect.height * window.devicePixelRatio;
    //     this.horizontalCnvCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

        
    //      rect = this.verticalCanvas.getBoundingClientRect();
    //     console.log(rect)
    //     this.verticalCanvas.width = rect.width * window.devicePixelRatio;
    //     this.verticalCanvas.height = rect.height * window.devicePixelRatio;
    //     this.verticalCnvCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    //     this.draw(); // Redraw the canvas content
    // }

    // scallingCnv(){
    //     this.fullCanvas.addEventListener('wheel', (event) => {
    //         event.preventDefault();
    //         console.log(event)
    //         if (event.deltaY < 0) {
    //             this.scale = Math.min(this.scale * 1.1, this.maxScale); // Zoom in
    //         } else {
    //             this.scale = Math.max(this.scale / 1.1, this.minScale); // Zoom out
    //         }
    //         this.resizeCanvas();
    //     });
    // }
    



}