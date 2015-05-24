//Application Stating point 
module LightReader
{
    "use strict";

    export module Application
    {
        export function initialize()
        {
            document.addEventListener('deviceready', onDeviceReady, false);
        }

        function onDeviceReady()
        {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
        }

        function onPause()
        {
        }

        function onResume()
        {
        }

    }

    window.onload = function ()
    {
        Application.initialize();
    }
}
