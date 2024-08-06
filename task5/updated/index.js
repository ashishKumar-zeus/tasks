import { ExcelController } from "../excelScripts/excelController.js";

function init(mainContainer) {

    new ExcelController(mainContainer,3,3);

}

document.addEventListener('DOMContentLoaded',()=>{

    console.log("DOM Content Loaded")
    const mainContainer = document.getElementById("mainContainer");
    

    init(mainContainer);

})