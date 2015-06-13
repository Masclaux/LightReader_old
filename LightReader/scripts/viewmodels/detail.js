define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        semantic = require('semantic');

    var activate = function (id)
    {
        var model = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[id];

        
        this.list(lightNovel.volumeList);
        this.id(lightNovel.title);
    }


    return {
        id: ko.observable(),
        list : ko.observable(),
        activate: activate,
        attached: attached,
    };

    function attached(view)
    {
        $('.ui.dropdown').dropdown();
    }


});

