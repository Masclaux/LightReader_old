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
    var allowClick = true;


    var pages = ko.observableArray();
    var novel;

    function activate(volume, index)
    {
        pages([]);
      
       this.novel =  LightReader.AppModel.Inst().novelList[0].volumeList[1];             
       pageslist = this.novel.GetPages();
        
        pageTo(0, 2);       
    }

    function pageTo(start, end)
    {
        if (start >= 0) {
            pages.removeAll();

            for (var i = start; i <= end; i++) {
                pages.push({ index: i + 1, content: pageslist[i], visible: pageslist[i].indexOf("<img sr") != 0 });
            }

            currentPage = end;
        }
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
        swiper.on('onTransitionEnd', function (p)
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

                    allowClick = true;
            }
                       

            swiper.updateSlidesSize();
            swiper.updateProgress();
            
            resize(p);
            window.scrollTo(0, 0);

        });

        swiper.on("onSliderMove", function (ev)
        {
            allowClick = false;         
        });
        
        $('.ui.dropdown').dropdown();

       $('.main.menu').transition('slide down');

       $('.ui.sidebar')
           .sidebar('attach events', '.launch.button', 'slide out');
        
        
        var mc = new Hammer($('tapDetector').get(0));
        mc.on("press", function (ev)
        {
            if ($('.main.menu').first().transition('is visible')== false)// && allowClick)
            {               
                $('.main.menu').transition('slide down');
            }
        });

        mc = new Hammer($('tapDetector').get(0));
        mc.on("tap", function (ev)
        {
            if ($('.main.menu').first().transition('is visible') == true)// && allowClick)
            {
                $('.main.menu').transition('slide down');
            }
        });                         
    }

    return {        
        activate: activate,
        pages: pages,
        attached: attached,
        novel: ko.observable(),
    };
});

