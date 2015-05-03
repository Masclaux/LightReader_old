/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>

module LightReader
{
    export class BakaTsukiParser 
    {
        public static Parse(model: NovelContent, content: string)
        {
            console.info("Start parsing light novel volume");
            var res = $.parseHTML(content);
            if (res != null)
            {
                console.info("Parsing summary");

                var summary = $(res).find(".toc ul li.toclevel-1");
                summary.each(function (index, value)
                {
                    var link = $(value).find("a").attr("href");
                    var title = $(value).find(".toctext").first().text();

                    console.log("found : " + title + " - " + link);


                });


                BakaTsukiParser.GetChapter(content);
            }

        }

        public static GetChapter(content: string)
        {
            console.info("Get Chapter");
        }
    }
}