///<reference path="model/AppModel.ts"/>
var LightReader;
(function (LightReader) {
    "use strict";
    var Application;
    (function (Application) {
        var appModel;
        function initialize() {
            this.appModel = LightReader.AppModel.Inst();
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            var parser = new LightReader.MenuParser();
            parser.onLightNovelListComplete = onLightNovelListComplete;
            parser.Parse("English");
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = LightReader.Application || (LightReader.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
    //debug stuff
    function onLightNovelListComplete(parser) {
        console.info("Parsing complet found " + parser.novelList.length);
        LightReader.AppModel.Inst().novelList = parser.novelList;
        var pa = new LightReader.DetailParser();
        pa.onLightNovelDetailComplete = onLightNovelDetailComplete;
        pa.Parse(LightReader.AppModel.Inst().novelList[0]);
    }
    function onLightNovelDetailComplete(parser) {
        console.info("Parsing detail complete  found " + parser.novel.volumeList.length);
        LightReader.AppModel.Inst().novelList[0] = parser.novel;
        var pa = new LightReader.BakaTsukiParser();
        pa.onParsingComplete = onParsingComplete;
        pa.Parse(LightReader.AppModel.Inst().novelList[0].volumeList[1]);
    }
    function onParsingComplete(parser) {
        LightReader.AppModel.Inst().novelList[0].volumeList[1] = parser.model;
        LightReader.AppModel.Inst().novelList[0].volumeList[1].GetPages();
    }
})(LightReader || (LightReader = {}));
//# sourceMappingURL=index.js.map