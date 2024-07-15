//imports
import { Scroll } from '../scripts/scroll.js'
// import {Canvas} from '../scripts/canvas.js'

import { MiniCanvas } from './scripts/miniCanvas.js';


import {LinkedList} from './scripts/linkedList.js'

//onPageLoaded
document.addEventListener('DOMContentLoaded', (e) => {

    console.log("DOM Content Loaded");

    //All Initializations
    const verticalBar = document.getElementById('verticalBar')
    const horizontalBar = document.getElementById('horizontalBar')
    const fullCanvas = document.getElementById('fullCanvas')
    const horizontalScroll = document.getElementById('horizontalScroll')
    const verticalScroll = document.getElementById('verticalScroll')


    const horizontalCanvas = document.getElementById('horizontalCanvas')
    const verticalCanvas = document.getElementById('verticalCanvas')
    const spreadsheetCanvas = document.getElementById('spreadsheetCanvas')

    //intiating ScrollFunctionalities
    new Scroll(fullCanvas,horizontalBar,horizontalScroll,verticalBar,verticalScroll);

    //initiating Canvas Formation
    const numOfCols = 20;
    const numOfRows = 50;
    const initialWidth = 100;
    const initialHeight = 30;


    let miniCanvas  = new MiniCanvas(10,10,100,30,60,30)
    // mini.resizeColumn(1,50)
    // mini.printArrs()

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;

    const ll = new LinkedList(horizontalArr,verticalArr);
    ll.createNewNode(1,1,"a");
    ll.createNewNode(2,3,"b");
    ll.createNewNode(1,3,"c");
    ll.createNewNode(1,2,"d");
    ll.createNewNode(2,2,"e");
    ll.createNewNode(5,4,"f");


    for (let i = 0; i < verticalArr.length; i++) {
       console.log(verticalArr[i].next)
       if(verticalArr[i].next){
        let temp = verticalArr[i].next;
        while(temp.right){
            // console.log(temp.data)
            temp=temp.right;
        }
       }
    }


})