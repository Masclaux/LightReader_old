define(function (require) {
    var app = require('durandal/app'),
       ko = require('knockout'),
       swiper = require('swiper'),
       semantic = require('semantic');

    function resize(e)
    {
        e.container.css({ height: document.body.clientHeight + 'px' });      
    }

    function attached(view) {
        var swiper = new Swiper('.swiper-container',
           {
               preloadImages: true,
               direction: 'horizontal',
           });

        resize(swiper);

        // Add one more handler for this event
        swiper.on('onSlideChangeStart', function (p) {
            resize(p);
        });

        // Add one more handler for this event
        swiper.on('onSlideChangeEnd', function (p) {          
            swiper.updateSlidesSize();
            swiper.updateProgress();

            resize(p);
            window.scrollTo(0, 0);

        });

        $('.ui.dropdown').dropdown();
        $('.main.menu').transition('slide down');
    }

    return {
        attached: attached,
    };

});