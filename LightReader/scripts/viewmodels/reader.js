define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        swiper = require('swiper'),
        jquery = require('jquery'),
        Hammer = require('hammer'),
        semantic = require('semantic');


    function activate(volume, index)
    {
        var model      = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[0].volumeList[1];

        this.pages(lightNovel.GetPages());
    }

    function resize(e)
    {
        e.container.css({ height: document.body.clientHeight + 'px' });
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
        
        $('.ui.dropdown').dropdown();

        $('.main.menu').transition('slide down');
        
        
        var mc = new Hammer($('tapDetector').get(0));
        mc.on("press", function (ev)
        {
            if ($('.main.menu').transition('is visible') == false)
            {
                $('.main.menu').transition('slide down');
            }
        });

        mc = new Hammer($('tapDetector').get(0));
        mc.on("tap", function (ev)
        {
            if ($('.main.menu').transition('is visible') == true)
            {
                $('.main.menu').transition('slide down');
            }
        });
               
    }

    return {
        pages: ko.observable(),
        activate: activate,
        attached: attached,
    };

});

