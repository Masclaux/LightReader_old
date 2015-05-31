define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout');   

    var activate = function (index) 
    {
        var model      = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[index];
                    
        this.id(lightNovel.title);
    }


    return {                
        id: ko.observable(),
        activate: activate,
    };



});

