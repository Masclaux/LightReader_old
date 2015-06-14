define(function (require)
{
    var app = require('durandal/app'),
        ko = require('knockout'),
        swiper = require('swiper'),     
        Hammer = require('hammer'),
        semantic = require('semantic');
        
    //curent page index
    var currentPage = 0;

    var pageslist;

    var pages = ko.observableArray();

    var onMouve = false;

    function activate(volume, index)
    {
        pages([]);

        var model      = LightReader.AppModel.Inst();
        var lightNovel = model.novelList[0].volumeList[1];
             
        pageslist = lightNovel.GetPages();
        
        pageTo(0, 2);
    }

    function pageTo(start, end)
    {
        pages.removeAll();

        for (var i = start; i <= end; i++)
        {
            pages.push(pageslist[i]);
        }

        currentPage = end;
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
           });

        resize(swiper);

        // Add one more handler for this event
        swiper.on('onSlideChangeStart', function (p)
        {
            resize(p);                     
          
        });

        // Add one more handler for this event
        swiper.on('onSlideChangeEnd', function (p)
        {

            if (swiper.activeIndex == 2 || swiper.activeIndex == 0)
            {
                    if (swiper.activeIndex > swiper.previousIndex)
                    {                    
                        pageTo(currentPage-1, currentPage+1);
                    }
                    else
                    {
                        pageTo(currentPage - 3, currentPage-1);
                    }

                    swiper.slideTo(1, 0);                        
            }

            swiper.updateSlidesSize();
            swiper.updateProgress();
            
            resize(p);
            window.scrollTo(0, 0);

        });
        
        $('.ui.dropdown').dropdown();

        $('.main.menu').transition('slide down');
        
        
        var mc = new Hammer($('tapDetector').get(0));
        mc.on("press", function (ev)
        {
            if ($('.main.menu').transition('is visible') == false && swiper.progress == 0)
            {
                $('.main.menu').transition('slide down');
            }
        });

        mc = new Hammer($('tapDetector').get(0));
        mc.on("tap", function (ev)
        {
            if ($('.main.menu').transition('is visible') == true && swiper.progress == 0)
            {
                $('.main.menu').transition('slide down');
            }
        });
               
    }

    return {        
        activate: activate,
        pages: pages,
        attached: attached,
    };

});

