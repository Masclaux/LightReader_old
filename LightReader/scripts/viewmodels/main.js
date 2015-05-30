define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
              { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
              { route: 'list', title: 'List', moduleId: 'viewmodels/list', nav: true },
              { route: 'reader/:id', title: 'Reader', moduleId: 'viewmodels/reader', nav: true },
            ]).mapUnknownRoutes('hello/index', 'not-found')
              .activate();
        }
    };
});
