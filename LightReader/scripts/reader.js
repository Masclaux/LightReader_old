/// <reference path="model/NovelContent.ts"/>
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
        $.get("http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1").done(OnContentOk);
    };
    function OnContentOk(data) {
        var content = new LightReader.NovelContent();
        content.content = "Hello";
        content.currentPage = 0;
        content.lastPos = 0;
        document.body.innerHTML = "<body>" + data + "</body>";
    }
    function loadNovel() {
        var content = new LightReader.NovelContent();
        content.content = "Hello";
        content.currentPage = 0;
        content.lastPos = 0;
        document.body.innerHTML = "<body>" + content.content + "</body>";
    }
})(LightReader || (LightReader = {}));
//# sourceMappingURL=reader.js.map