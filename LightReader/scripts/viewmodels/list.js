define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        jquery = require('jquery');
        chocolate = require('chocolate');

    var datas = LightReader.AppModel.Inst();
    return {
        list: datas.novelList,
        };
});

