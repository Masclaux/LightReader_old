
///<reference path="model/AppModel.ts"/>

module LightReader {
    "use strict";

    export module Application 
    {
        var appModel: AppModel;


        export function initialize() 
        {
            this.appModel = AppModel.Inst();

            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() 
        {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

            var parser: MenuParser = new MenuParser();
            parser.onLightNovelListComplete = onLightNovelListComplete;
            parser.Parse("English");            
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

    }

    window.onload = function () 
    {
        Application.initialize();
    }

    //debug stuff
    function onLightNovelListComplete(parser: MenuParser)
    {
        console.info("Parsing complet found " + parser.novelList.length);
        AppModel.Inst().novelList = parser.novelList;
        
        var pa: DetailParser = new DetailParser();
        pa.onLightNovelDetailComplete = onLightNovelDetailComplete;
        pa.Parse(AppModel.Inst().novelList[0]);
    }

    function onLightNovelDetailComplete(parser: DetailParser)
    {
        console.info("Parsing detail complete  found " + parser.novel.volumeList.length);
        AppModel.Inst().novelList[0] = parser.novel;

        var pa: BakaTsukiParser = new BakaTsukiParser();
        pa.onParsingComplete = onParsingComplete;
        pa.Parse(AppModel.Inst().novelList[0].volumeList[1]);
    }
    
    function onParsingComplete(parser: BakaTsukiParser)
    {
        AppModel.Inst().novelList[0].volumeList[1] = parser.model; 
    }
}
