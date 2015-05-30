// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
module LightReader {
    "use strict";

    export module Application 
    {
        var model: AppModel;

        export function initialize() 
        {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady() 
        {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

            var parser: MenuParser = new MenuParser();
            parser.onParsingComplete = onParsingComplete;
           // parser.Parse("English");

            
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

    function onParsingComplete(parser: BakaTsukiParser)
    {
        console.info("Parsing Complete");
    }
}
