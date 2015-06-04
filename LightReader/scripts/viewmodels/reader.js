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

    function attached(view)
    {
        $.UIHideNavBar();

        var swiper = new Swiper('.swiper-container',
           {
               preloadImages: true,
               direction: 'horizontal',
           });

        // Add one more handler for this event
        swiper.on('onSlideChangeStart', function (p) {
            var activeSlideHeight = p.slides.eq(p.activeIndex).height();
            p.container.css({ height: activeSlideHeight + 'px' });
        });

        // Add one more handler for this event
        swiper.on('onSlideChangeEnd', function (p) {
            window.scrollTo(0, 0);
            var activeSlideHeight = p.slides.eq(p.activeIndex).height();
            p.container.css({ height: window.innerHeight + 'px' });
        });

        $('body').on('longtap', function () {
            $.UIShowNavBar();
        });

        $('swiper-container').on('singletap', function () {
            $.UIHideNavBar();
        });
    }

    return {
        pages: ko.observable(),
        activate: activate,
        attached: attached,
    };

});

