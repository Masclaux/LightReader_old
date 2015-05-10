/// <reference path="model/NovelContent.ts"/>
/// <reference path="parser/BakaTsuki.ts"/>
/// <reference path="typings/jquery/jquery.d.ts"/>
var LightReader;
(function (LightReader) {
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
    window.onload = function () {
        console.error("onload");
        initialize();
        // $.get("http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1").done(OnContentOk);        
        var parser = new LightReader.BakaTsukiParser();
        parser.onParsingComplete = onParsingComplete;
        parser.Parse("");
    };
    function onParsingComplete(parser) {
        var el = document.getElementById('container');
        var str = '<div class="swiper-container"><div class="swiper-wrapper">';
        var currentImage = -1;
        var center = "";
        for (var c in parser.model.chapterList[0].pages) {
            //image found 
            currentImage = parseInt(parser.model.chapterList[0].pages[c]);
            if (isNaN(currentImage) == false) {
                center = "<img src='" + parser.model.chapterList[0].images[currentImage] + "'style='width:100%'/>";
                console.log(parser.model.chapterList[0].images[currentImage]);
            }
            else {
                center = parser.model.chapterList[0].pages[c];
            }
            str += '<div class="swiper-slide" >' + center + '<div id="footer" >' + (parseInt(c) + 1) + '</div>' + '</div>';
        }
        str += '</div></div>';
        el.innerHTML = str;
        initSwiper();
    }
})(LightReader || (LightReader = {}));
//# sourceMappingURL=reader.js.map