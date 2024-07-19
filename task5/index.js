
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

    //scalling horizontal canvas

    const horizontalCnvWidth = horizontalCanvas.clientWidth;
    const horizontalCnvHeight = horizontalCanvas.clientHeight;

    const scaleHor = window.devicePixelRatio;
    horizontalCanvas.width = Math.floor(horizontalCnvWidth*scaleHor)
    horizontalCanvas.height = Math.floor(horizontalCnvHeight*scaleHor)

    horizontalCnvCtx.scale(scaleHor,scaleHor)

    
    //scalling vertical canvas

    const verticalCnvWidth = verticalCanvas.clientWidth;
    const verticalCnvHeight = verticalCanvas.clientHeight;

    const scaleVer = window.devicePixelRatio;
    verticalCanvas.width = Math.floor(verticalCnvWidth*scaleVer)
    verticalCanvas.height = Math.floor(verticalCnvHeight*scaleVer)

    verticalCnvCtx.scale(scaleVer,scaleVer)

    
    
    //scalling vertical canvas

    const mainCnvWidth = spreadsheetCanvas.clientWidth;
    const mainCnvHeight = spreadsheetCanvas.clientHeight;

    const scaleMain = window.devicePixelRatio;
    spreadsheetCanvas.width = Math.floor(mainCnvWidth*scaleMain)
    spreadsheetCanvas.height = Math.floor(mainCnvHeight*scaleMain)

    spreadsheetCnvCtx.scale(scaleMain,scaleMain)



    //intiating ScrollFunctionalities
    new Scroll(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll);

    //initiating Canvas Formation
    const inititalNumOfCols = 40;
    const initialNumOfRows = 100;
    const initialWidthHorizontal = 100;
    const initialHeightHorizontal = 40;
    const initialWidthVertical = 60;
    const initialHeightVertical = 30;

    let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical)

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;


// {
//     // const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);
//     // ll.createNewNode(1, 1, "a");
//     // ll.createNewNode(1, 2, "a");
//     // ll.createNewNode(1, 3, "a");

//     // ll.createNewNode(2, 1, "b1");
//     // ll.createNewNode(2, 2, "b2");
//     // ll.createNewNode(2, 3, "b3");

//     // ll.createNewNode(3, 1, "c");
//     // ll.createNewNode(3, 2, "c");
//     // ll.createNewNode(3, 3, "c");

//     // ll.createNewNode(10,10,"shivendra")

//     // ll.insertACellInRowBeforeInd(2,2,"new")
//     // ll.insertAndShiftRight(1, 1, "afirst")
//     // ll.insertAndShiftRight(3, 3, "new 1")
//     // ll.insertAndShiftRight(3, 3, "new 2")
//     // ll.insertAndShiftRight(3, 3, "new 3")

//     // ll.insertAndShiftBottom(1,1,"new bottom")

//     // ll.insertAndShiftBottom(3,3,"new bottom")


//     // ll.insertARow(2);
//     // ll.insertACol(5);
//     // ll.createNewNode(5,5,"5 wala")
//     // ll.createNewNode(50,50,"50 wala")
//     // ll.insertARow(5);
//     // setTimeout(() => {

//     //     miniCanvas.printArrs()

//     // }, 2000);
//     // for (let i = 0; i < verticalArr.length; i++) {
//     //     console.log(verticalArr[i].next)
//     //     if (verticalArr[i].next) {
//     //         let temp = verticalArr[i].next;
//     //         while (temp.right) {
//     //             // console.log(temp.data)
//     //             temp = temp.right;
//     //         }
//     //     }
//     // }

//     // console.log("column wise")
//     // for (let i = 0; i < horizontalArr.length; i++) {
//     //     console.log(horizontalArr[i].next)
//     //     if (horizontalArr[i].next) {
//     //         let temp = horizontalArr[i].next;
//     //         while (temp.bottom) {
//     //             // console.log(temp.data)
//     //             temp = temp.bottom;
//     //         }
//     //     }
//     // }
// }



})

