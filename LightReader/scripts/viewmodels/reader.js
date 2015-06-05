define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        swiper = require('swiper'),
        jquery = require('jquery'),
        chocolate = require('chocolate');


    function activate(volume, index)
    {
        var model      = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[0].volumeList[1];

        this.pages(lightNovel.GetPages());
    }

    function resize(e)
    {
        var activeSlideHeight = e.slides.eq(e.activeIndex).height();
        e.container.css({ height: activeSlideHeight + 'px' });
    }

    function attached(view)
    {
        var swiper = new Swiper('.swiper-container',
           {
               preloadImages: true,
               direction: 'horizontal',
               simulateTouch: true,
               preventClicksPropagation: false,
           });

        $.UIHideNavBar();

        resize(swiper);

        // Add one more handler for this event
        swiper.on('onSlideChangeStart', function (p) {
            resize(p);           
        });

        // Add one more handler for this event
        swiper.on('onSlideChangeEnd', function (p) {
            resize(p);
            window.scrollTo(0, 0);
        });

        $('tapDetector').on('singletap', function (p){
            $.UIHideNavBar();
        });

        $('body').on('longtap', function (e){            
            $.UIShowNavBar();
        });     
    }

    return {
        pages: ko.observable(),
        activate: activate,
        attached: attached,
    };

});

