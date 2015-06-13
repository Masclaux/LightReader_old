define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        jquery = require('jquery'),       
        semantic = require('semantic'),
                Hammer = require('hammer'),

        router = require('plugins/router')
    ;

    return {
        name: ko.observable(),
        attached : attached,
        onClick: function () { router.navigate('list'); }
    };
    

    function attached(view)
    {
        $('.ui.dropdown').dropdown();

        var myElement = $('body');

        // create a simple instance
        // by default, it only adds horizontal recognizers
        var mc = new Hammer(myElement.get(0));

        // listen to events...
        mc.on("press", function (ev) {
            myElement.textContent = ev.type + " gesture detected.";
        });

        var mc2 = new Hammer(myElement.get(0));

        // listen to events...
        mc2.on("tap", function (ev) {
            myElement.textContent = ev.type + " gesture detected.";
        });

    }


});