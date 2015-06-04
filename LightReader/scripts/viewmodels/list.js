define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        jquery = require('jquery'),
        chocolate = require('chocolate'),
        router = require('plugins/router');

    var datas = LightReader.AppModel.Inst();
    return {
        list: datas.novelList,
        onNovelSelected: function (that, site)
        {           
            var context = ko.contextFor(event.target);
            router.navigate( 'detail/'+context.$index() );
        }
    };
    
});

