define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        semantic = require('semantic'),
        router = require('plugins/router');

    var novelIndex = -1;

    var activate = function (id)
    {
        var model = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[id];
                
        this.list(lightNovel.volumeList);
        this.id(lightNovel.title);
        novelIndex = id;
    }


    return {
        id: ko.observable(),
        list : ko.observable(),
        activate: activate,
        attached: attached,
        
        onVolumeSelected: function (that, site)
        {
            var context = ko.contextFor(event.target);
            router.navigate('reader/' + novelIndex + '/' + context.$index());
        }
    };

    function attached(view)
    {
        $('.ui.dropdown').dropdown();
    }
});

