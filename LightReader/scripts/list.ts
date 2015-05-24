/*/// <reference path="model/NovelContent.ts"/>
/// <reference path="parser/MenuParser.ts"/>
/// <reference path="typings/jquery/jquery.d.ts"/>


module LightReader
{
    "use strict";

    declare function initSwiper(vertical: boolean): void;

    function initialize()
    {

        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
    }

    function onPause()
    {
        // TODO: This application has been suspended. Save application state here.        
    }

    function onResume()
    {
        // TODO: This application has been reactivated. Restore application state here.       
    }

    window.onload = function ()
    {
        initialize();
        
       /* var menuParser: MenuParser = new MenuParser();
        menuParser.Parse("English");       
    }

    function onParsingComplete(parser: BakaTsukiParser)
    {

    }
}

 */