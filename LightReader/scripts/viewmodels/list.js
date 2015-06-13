define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        jquery = require('jquery'),
        semantic = require('semantic'),
        router = require('plugins/router');

    var datas = LightReader.AppModel.Inst();
    return {
        list: datas.novelList,
        attached: attached,
        onNovelSelected: function (that, site)
        {           
            var context = ko.contextFor(event.target);
            router.navigate( 'detail/'+context.$index() );
        }
    };


    function attached(view)
    {
        $('.ui.dropdown').dropdown();
    }
    
});

