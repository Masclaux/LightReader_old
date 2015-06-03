define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        jquery = require('jquery'),
        chocolate = require('chocolate'),
        router = require('plugins/router');

    return {
        name: ko.observable(),
        onClick: function () { router.navigate('list'); }
    };
});