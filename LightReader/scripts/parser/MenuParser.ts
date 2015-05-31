/// <reference path="../libs/jquery/jquery.d.ts"/>

module LightReader
{
    export class MenuParser 
    {
        public static LIST_QUERY: string =
        "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";

        public onLightNovelListComplete;

        public novelList: Array<NovelContent> = new Array<NovelContent>();  

        //Get Light Novel list  
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
                table.each($.proxy(function (index, value)
                {
                    var novel = new NovelContent();
                    novel.title = $(value).find("a").attr("title");
                    novel.url = $(value).find("a").attr("href");

                    console.log("Found : " + novel.title + " - " + novel.url);

                    this.novelList.push(novel);

                }, this));
            }

            this.onLightNovelListComplete(this);
        }
    }        
} 