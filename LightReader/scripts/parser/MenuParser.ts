/// <reference path="../typings/jquery/jquery.d.ts"/>

module LightReader
{
    export class MenuParser 
    {
        public static LIST_QUERY: string =
        "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";

        public static VOLUME_QUERY: string =
        "http://baka-tsuki.org";

        public onParsingComplete;

        public Parse(lang: string)
        {
            var listUrl = MenuParser.LIST_QUERY + lang + ")";
            $.get(listUrl).done
                (
                $.proxy(this.OnMenuParsed, this)
                );
        }

        private OnMenuParsed(data)
        {
            console.info("Start parsing light novel list");

            var res = $.parseHTML(data);
            if (res != null)
            {
                var table = $(res).find(".mw-content-ltr ul li");
                table.each( $.proxy(function (index, value)
                {    
                    var link  = $(value).find("a").attr("href");
                    var title = $(value).find("a").attr("title");
                                   
                    //this.ParseVolumes(link, title);

                }, this));

            }

            this.ParseVolumes("/project/index.php?title=Zero_no_Tsukaima", "ZERo");
        }

        private ParseVolumes(url:string, title:string)
        {
            console.log("Parse Volumes : " + url + " - " + title);

            var volumeUrl = MenuParser.VOLUME_QUERY + url;
            $.get(volumeUrl).done
                (
                    $.proxy(this.OnVolumeParsed, this)
                );

        }

        
        private OnVolumeParsed(res)
        {
     
            var foundH3: boolean = false;
            var foundH2: boolean = false;
            var ready: boolean = false;

            var title: string = "test";

            var summary = $(res).find("#mw-content-text").find('h2,h3,a,p');//,p,div.thumb.tright,div.thumb');
            summary.each($.proxy(function (index, value)
            {
                switch (value.nodeName)
                {
                    case 'H2':
                        foundH2 = true;
                        if (foundH3)
                        {
                            foundH3 = false;
                            foundH2 = false;
                        }
                        break;

                    case 'H3': 
                        if (foundH2)
                        {
                            title=value.firstChild.innerHTML;
                            ready = true
                        }
                        break;

                    case "A":
                        if (ready)
                        {
                            console.log(title);
                            console.log(value.firstChild.textContent);
                        }
                        break;

                    case "P":
                        if (ready)
                        {
                            ready = false;
                        }
                        break;
                }
                               
            }, this));


        }
    }
} 