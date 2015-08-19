define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
              { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
              { route: 'list', title: 'List', moduleId: 'viewmodels/list', nav: true },
              { route: 'detail/:id', title: 'Detail', moduleId: 'viewmodels/detail', nav: true },
              { route: 'reader/:id/:vid', title: 'Reader', moduleId: 'viewmodels/reader', nav: true },
              { route: 'readerdebug', title: 'Reader Debug', moduleId: 'viewmodels/debug/debugreader', nav: true },
            ]).mapUnknownRoutes('hello/index', 'not-found')
              .activate();
        }
    };
});
