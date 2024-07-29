import { Controller } from "../excelScripts/controller.js";

function init(mainContainer) {

    new Controller(mainContainer,3,3);

}

document.addEventListener('DOMContentLoaded',()=>{

    console.log("DOM Content Loaded")
    const mainContainer = document.getElementById("mainContainer");

    init(mainContainer);
})