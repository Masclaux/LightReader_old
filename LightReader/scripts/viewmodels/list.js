define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout');

    var datas = LightReader.AppModel.Inst();
    return {
        list: datas.novelList,
        };
});

