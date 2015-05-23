/// <reference path="../typings/jquery/jquery.d.ts"/>

module LightReader
{
    export class MenuParser 
    {
        public static LIST_QUERY: string =
        "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";

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
                table.each(function (index, value)
                {    
                    var link  = $(value).find("a").attr("href");
                    var title = $(value).find("a").attr("title");
                                   
                    console.log("found : " + title + " - " + link);
                });

            }
        }
    }
} 