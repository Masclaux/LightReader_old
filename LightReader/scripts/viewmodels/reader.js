define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout');   

    var activate = function (routeData) 
    {
        var model      = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[routeData];
                    
        this.id(lightNovel.title);
    }


    return {                
        id: ko.observable(),
        activate: activate,
    };



});

