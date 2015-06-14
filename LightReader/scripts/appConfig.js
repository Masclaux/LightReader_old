requirejs.config({
    paths: {
        'text': 'libs/require/text',
        'durandal': 'libs/durandal/js',
        'plugins': 'libs/durandal/js/plugins',
        'transitions': 'libs/durandal/js/transitions',
        'knockout': 'libs/knockout/knockout-3.1.0',
        'jquery': 'libs/jquery/jquery',
        'hammer': 'libs/hammer/hammer.min',
        'swiper': 'libs/swiper/swiper.min',
        'semantic': 'libs/semantic/semantic',
        'model': 'model',
        'constant': 'constant',
        'parser': 'parser',
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal Starter Kit';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/main', 'entrance');
    });
});