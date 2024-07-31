
//imports
import { Scroll } from '../scripts/scroll.js'
import { MiniCanvas } from './scripts/miniCanvas.js';
import { LinkedList } from './scripts/linkedList.js'

//global varaibles that are to be used in other files too

export let horizontalCnvCtx = null;
export let verticalCnvCtx = null;
export let spreadsheetCnvCtx = null;

export let horizontalCanvas = null;
export let verticalCanvas = null;
export let spreadsheetCanvas = null;

function scallingCanvas() {

    const dpr = window.devicePixelRatio;

    //scalling horizontal canvas

    horizontalCanvas.width = Math.floor(horizontalCanvas.clientWidth * dpr)
    horizontalCanvas.height = Math.floor(horizontalCanvas.clientHeight * dpr)

    horizontalCnvCtx.scale(dpr, dpr)

    //scalling vertical canvas

    verticalCanvas.width = Math.floor(verticalCanvas.clientWidth * dpr)
    verticalCanvas.height = Math.floor(verticalCanvas.clientHeight * dpr)

    verticalCnvCtx.scale(dpr, dpr)

    //scalling main canvas
    spreadsheetCanvas.width = Math.floor(spreadsheetCanvas.clientWidth * dpr)
    spreadsheetCanvas.height = Math.floor(spreadsheetCanvas.clientHeight * dpr)


    spreadsheetCnvCtx.scale(dpr, dpr)


}

function createCanvas(mainContainer) {
    const topSection = document.createElement('div');
    topSection.className = 'topSection';

    const nothing = document.createElement('div');
    nothing.className = 'nothing'

    const upperCanvas = document.createElement('upperCanvas');
    upperCanvas.className = 'upperCanvas';

    const horizontalCanvas = document.createElement('canvas');
    horizontalCanvas.setAttribute('id', 'horizontalCanvas');

    upperCanvas.appendChild(horizontalCanvas);
    topSection.appendChild(nothing)
    topSection.appendChild(upperCanvas);

    const middleSection = document.createElement('div');
    middleSection.className = 'middleSection';

    const verticalCanvas = document.createElement('canvas');
    verticalCanvas.setAttribute('id', 'verticalCanvas');

    const fullCanvas = document.createElement('div');
    fullCanvas.setAttribute('id', 'fullCanvas');

    const spreadsheetCanvas = document.createElement('canvas');
    spreadsheetCanvas.setAttribute('id', 'spreadsheetCanvas');

    const verticalScroll = document.createElement('div');
    verticalScroll.setAttribute('id', 'verticalScroll');
    verticalScroll.className = 'verticalScroll';

    const verticalBar = document.createElement('div');
    verticalBar.setAttribute('id', 'verticalBar')

    verticalScroll.appendChild(verticalBar)


    const horizontalScroll = document.createElement('div');
    horizontalScroll.setAttribute('id', 'horizontalScroll');
    horizontalScroll.className = 'horizontalScroll';

    const horizontalBar = document.createElement('div');
    horizontalBar.setAttribute('id', 'horizontalBar')

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

//onPageLoaded
document.addEventListener('DOMContentLoaded', (e) => {


    const mainContainer = document.querySelector('.mainContainer')
    console.log(mainContainer)

    //create html elements
    createCanvas(mainContainer)



    console.log("DOM Content Loaded");

    //All Initializations
    const verticalBar = document.getElementById('verticalBar')
    const horizontalBar = document.getElementById('horizontalBar')
    const fullCanvas = document.getElementById('fullCanvas')
    const horizontalScroll = document.getElementById('horizontalScroll')
    const verticalScroll = document.getElementById('verticalScroll')


    horizontalCanvas = document.getElementById('horizontalCanvas')
    verticalCanvas = document.getElementById('verticalCanvas')
    spreadsheetCanvas = document.getElementById('spreadsheetCanvas')

    horizontalCnvCtx = horizontalCanvas.getContext('2d');
    verticalCnvCtx = verticalCanvas.getContext('2d');
    spreadsheetCnvCtx = spreadsheetCanvas.getContext('2d');

    //scalling canvas
    scallingCanvas()

    //initiating Canvas Formation
    const inititalNumOfCols = 1000;
    const initialNumOfRows = 500;
    const initialWidthHorizontal = 100;
    const initialHeightHorizontal = horizontalCanvas.clientHeight;
    const initialWidthVertical = verticalCanvas.clientWidth;
    const initialHeightVertical = 30;
    const resizeWidth = 12;
    const resizeHeight = 8;

    const offsetSharpness = 0.5;

    let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth, resizeHeight, offsetSharpness)

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;

    const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

    //intiating ScrollFunctionalities
    new Scroll(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas);

})

