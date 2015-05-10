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
        console.log("1");
        document.body.innerHTML = "<body>" + parser.model.chapterList[0].pages[0] + "</body>";
        console.log("2");
    }
})(LightReader || (LightReader = {}));
//# sourceMappingURL=reader.js.map