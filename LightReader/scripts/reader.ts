/// <reference path="model/NovelContent.ts"/>
/// <reference path="parser/BakaTsuki.ts"/>

/// <reference path="typings/jquery/jquery.d.ts"/>

module LightReader {
    "use strict";

    declare function initSwiper(vertical:boolean): void;

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

       // $.get("http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1").done(OnContentOk);        

        var parser = new BakaTsukiParser();
        parser.onParsingComplete = onParsingComplete;
        parser.Parse("");
    }

    function onParsingComplete(parser: BakaTsukiParser )
    {          
        var el: HTMLElement = document.getElementById('container');
      
        var str: string = '<div class="swiper-container"><div class="swiper-wrapper">';

        var center: string = "";
        for (var c in parser.model.chapterList[0].pages)
        {
            //image found 
            var currentImage:number = parser.model.chapterList[0].pages[c].search("img;;");
            if (currentImage != -1 )
            {
                //get id 
                var id: string = parser.model.chapterList[0].pages[c].split(";;")[1]; 
                center = "<img src='" + parser.model.chapterList[0].images[id].url + "'style='width:100%'/>";               
            }
            else
            {
                center = parser.model.chapterList[0].pages[c];
            }   
            
            str += '<div class="swiper-slide" >'
            +  center
            + '<div id="footer" >' + (parseInt(c) + 1) + '</div>'
            + '</div>';        
        }

        str += '</div></div>';
              
         
        el.innerHTML = str;  

        initSwiper(true);
    }
}

