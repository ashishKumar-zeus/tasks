
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

    //scalling horizontal canvas

    const horizontalCnvWidth = horizontalCanvas.clientWidth;
    const horizontalCnvHeight = horizontalCanvas.clientHeight;

    const scaleHor = window.devicePixelRatio;
    horizontalCanvas.width = Math.floor(horizontalCnvWidth * scaleHor)
    horizontalCanvas.height = Math.floor(horizontalCnvHeight * scaleHor)

    horizontalCnvCtx.scale(scaleHor, scaleHor)


    //scalling vertical canvas

    const verticalCnvWidth = verticalCanvas.clientWidth;
    const verticalCnvHeight = verticalCanvas.clientHeight;

    const scaleVer = window.devicePixelRatio;
    verticalCanvas.width = Math.floor(verticalCnvWidth * scaleVer)
    verticalCanvas.height = Math.floor(verticalCnvHeight * scaleVer)

    verticalCnvCtx.scale(scaleVer, scaleVer)

    //scalling main canvas

    const mainCnvWidth = spreadsheetCanvas.clientWidth;
    const mainCnvHeight = spreadsheetCanvas.clientHeight;

    const scaleMain = window.devicePixelRatio;
    spreadsheetCanvas.width = Math.floor(mainCnvWidth * scaleMain)
    spreadsheetCanvas.height = Math.floor(mainCnvHeight * scaleMain)

    spreadsheetCnvCtx.scale(scaleMain, scaleMain)


}

//onPageLoaded
document.addEventListener('DOMContentLoaded', (e) => {

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
    const ctxHor = horizontalCanvas.getContext('2d')
    const ctxVer = verticalCanvas.getContext('2d')
    const ctxMain = spreadsheetCanvas.getContext('2d')

    horizontalCnvCtx = ctxHor;
    verticalCnvCtx = ctxVer;
    spreadsheetCnvCtx = ctxMain;


    //scalling canvas
    scallingCanvas()

    //initiating Canvas Formation
    const inititalNumOfCols = 1000;
    const initialNumOfRows = 5;
    const initialWidthHorizontal = 100;
    const initialHeightHorizontal = horizontalCanvas.clientHeight;
    const initialWidthVertical = verticalCanvas.clientWidth;
    const initialHeightVertical = 30;

    let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical)

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;


    const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);


    //intiating ScrollFunctionalities
    new Scroll(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll, miniCanvas);

})
