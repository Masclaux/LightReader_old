/// <reference path="model/NovelContent.ts"/>

module LightReader {
    "use strict";


    function initialize() {

        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.        
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.       
    }

    window.onload = function ()
    {

        console.error("onload");

        initialize();
        loadNovel();
    }

 

    function loadNovel() {
        
        var content = new NovelContent();
        content.content = "Hello";
        content.currentPage = 0;
        content.lastPos = 0;


        document.body.innerHTML = "<body>" + content.content +"</body>";
        
    }

}

