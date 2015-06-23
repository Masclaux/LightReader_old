define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),  
        semantic = require('semantic'),
        router = require('plugins/router')
    ;

    return {
        name: ko.observable(),
        attached : attached,
        onClick: function () { router.navigate('list') },
        onClickDebug: function () { router.navigate('readerdebug'); }
    };
    

    function attached(view)
    {
        $('.ui.dropdown').dropdown();   
    }


});