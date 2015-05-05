/// <reference path="model/NovelContent.ts"/>
/// <reference path="parser/BakaTsuki.ts"/>

/// <reference path="typings/jquery/jquery.d.ts"/>

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

        $.get("http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1").done(OnContentOk);        
    }

    function OnContentOk( data )
    {
        var content = new NovelContent();

        var parser = new BakaTsukiParser();
        parser.Parse(content, data);

        document.body.innerHTML = "<body>" + "test" + "</body>";
    }


}

