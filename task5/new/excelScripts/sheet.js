
//imports
import { Scroll } from './scripts/scroll.js'
import { MiniCanvas } from './scripts/miniCanvas.js';
import { LinkedList } from './scripts/linkedList.js'

export class Sheet {

    constructor(container) {
        this.mainContainer = container;
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

        this.init();
    }


    init() {
        this.createCanvas(this.mainContainer);


        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');



        //scalling canvas
        this.scallingCanvas()


        //initiating Canvas Formation
        const inititalNumOfCols = 100;
        const initialNumOfRows = 20;
        const initialWidthHorizontal = 100;
        const initialHeightHorizontal = this.horizontalCanvas.clientHeight;
        const initialWidthVertical = this.verticalCanvas.clientWidth;
        const initialHeightVertical = 30;
        const resizeWidth = 12;
        const resizeHeight = 8;

        const offsetSharpness = 0.5;

        

        let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth, resizeHeight, offsetSharpness,this.getCnv,this.getCtx)

        const horizontalArr = miniCanvas.horizontalArr;
        const verticalArr = miniCanvas.verticalArr;

        const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

        //intiating ScrollFunctionalities
        new Scroll(this.fullCanvas, this.horizontalBar, this.horizontalScroll, this.verticalBar, this.verticalScroll, miniCanvas);

    }

    
     get getCtx(){
        return [this.horizontalCnvCtx,this.verticalCnvCtx,this.spreadsheetCnvCtx];
    }

    get getCnv(){
        return [this.horizontalCanvas,this.verticalCanvas,this.spreadsheetCanvas]
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

    createCanvas(mainContainer) {
        const topSection = document.createElement('div');
        topSection.className = 'topSection';

        const nothing = document.createElement('div');
        nothing.className = 'nothing'

        const upperCanvas = document.createElement('upperCanvas');
        upperCanvas.className = 'upperCanvas';

        const horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.setAttribute('id', 'horizontalCanvas');

        this.horizontalCanvas = horizontalCanvas;

        upperCanvas.appendChild(horizontalCanvas);
        topSection.appendChild(nothing)
        topSection.appendChild(upperCanvas);

        const middleSection = document.createElement('div');
        middleSection.className = 'middleSection';

        const verticalCanvas = document.createElement('canvas');
        verticalCanvas.setAttribute('id', 'verticalCanvas');

        this.verticalCanvas = verticalCanvas;

        const fullCanvas = document.createElement('div');
        fullCanvas.setAttribute('id', 'fullCanvas');

        this.fullCanvas = fullCanvas;

        const spreadsheetCanvas = document.createElement('canvas');
        spreadsheetCanvas.setAttribute('id', 'spreadsheetCanvas');

        this.spreadsheetCanvas = spreadsheetCanvas;

        const verticalScroll = document.createElement('div');
        verticalScroll.setAttribute('id', 'verticalScroll');
        verticalScroll.className = 'verticalScroll';

        this.verticalScroll = verticalScroll;

        const verticalBar = document.createElement('div');
        verticalBar.setAttribute('id', 'verticalBar')

        this.verticalBar = verticalBar;

        verticalScroll.appendChild(verticalBar)


        const horizontalScroll = document.createElement('div');
        horizontalScroll.setAttribute('id', 'horizontalScroll');
        horizontalScroll.className = 'horizontalScroll';

        this.horizontalScroll = horizontalScroll;

        const horizontalBar = document.createElement('div');
        horizontalBar.setAttribute('id', 'horizontalBar')

        this.horizontalBar = horizontalBar;

        horizontalScroll.appendChild(horizontalBar);

        fullCanvas.appendChild(spreadsheetCanvas);
        fullCanvas.appendChild(verticalScroll);
        fullCanvas.appendChild(horizontalScroll);

        middleSection.appendChild(verticalCanvas);
        middleSection.appendChild(fullCanvas);

        const inputEle = document.createElement('input');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('id', 'cellInput')

        mainContainer.appendChild(topSection);
        mainContainer.appendChild(middleSection);
        mainContainer.appendChild(inputEle)


        let mainContainerCss = `
        height: 80%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background-color: aliceblue;`

        let topSectionCss = `
            height: 5%;
            width: 100%;
            box-sizing: border-box;
            display: flex;`

        let nothingCss = `
                width: 3%;
                height: 100%;`;

        let upperCanvasCss = `
                width: 97%;
                height: 100%;`

        let horizontalCanvasCss = `
                    width: 99%;
                    height: 100%;`

        let middleSectionCss = `
            height: 95%;
            display: flex;
            width: 100%;
            box-sizing: border-box;`

        let verticalCanvasCss = `
                width: 3%;
                box-sizing: border-box;
                height: 98%;
                background-color: aliceblue;`;

        let fullCanvasCss = `
                width: 97%;
                display: flex;
                box-sizing: border-box;
                position: relative;`

        let spreadsheetCanvasCss = `
                    width: 99%;
                    height: 98%;
                    box-sizing: border-box;
                    background-color: white;`

        let horizontalScrollCss = `
                    box-sizing: border-box;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2%;
                    width: 99%;
                    display: flex;
                    justify-content: center;
                    align-items: center;`

        let horizontalBarCss = `
                        height: 80%;
                        width: 80%;
                        background-color: gray;
                        position: absolute;
                        left: 0px;
                        transition: all 0.1s;
                        border-radius: 25px;`

        let verticalScrollCss = `transition: all 0.1s;
                    box-sizing: border-box;
                    position: absolute;
                    height: 98%;
                    top: 0;
                    right: 0;
                    width: 1%;
                    display: flex;
                    justify-content: center;
                    align-items: center;`

        let verticalBarCss = `
                        height: 80%;
                        width: 80%;
                        background-color: gray;
                        position: absolute;
                        top: 0;
                        transition: all 0.1s;
                        border-radius: 25px;`

        let inputCss = `
            display: none;`



        mainContainer.setAttribute('style', mainContainerCss)
        topSection.setAttribute('style', topSectionCss)
        nothing.setAttribute('style', nothingCss)
        upperCanvas.setAttribute('style', upperCanvasCss)
        horizontalCanvas.setAttribute('style', horizontalCanvasCss)
        middleSection.setAttribute('style', middleSectionCss)
        verticalCanvas.setAttribute('style', verticalCanvasCss)
        fullCanvas.setAttribute('style', fullCanvasCss)
        spreadsheetCanvas.setAttribute('style', spreadsheetCanvasCss)
        horizontalScroll.setAttribute('style', horizontalScrollCss)
        horizontalBar.setAttribute('style', horizontalBarCss)
        verticalScroll.setAttribute('style', verticalScrollCss)
        verticalBar.setAttribute('style', verticalBarCss)
        inputEle.setAttribute('style', inputCss)


    }


}