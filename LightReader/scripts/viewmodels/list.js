define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout');

    return {
        name: ko.observable(),
        showDetail: function () {
            alert("test");
        }
    };
});