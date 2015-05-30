﻿/// <reference path="../libs/jquery/jquery.d.ts"/>

module LightReader
{
    export class MenuParser 
    {
        public static LIST_QUERY: string =
        "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";

        public static VOLUME_QUERY: string =
        "http://baka-tsuki.org";

        public onParsingComplete;

        public volumes: Array<NovelVolume> = new Array<NovelVolume>();   

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
                table.each( $.proxy(function (index, value)
                {    
                    var novel = new NovelContent();
                    novel.title = $(value).find("a").attr("title");                                 
                    novel.url = $(value).find("a").attr("href");

                    console.log("Found : " + novel.title + " - " + novel.url);

                    this.novelList.push(novel);

                }, this));
            }

            this.onParsingComplete(this);
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
            var foundH2: boolean = false;
            var ready: boolean = false;

            var firstPass: boolean = false;

            var volumeTitle: string = "";
            var volumeUrl: string = "";

            var currentNovelVolume: NovelVolume = new NovelVolume();
            
            var summary = $(res).find("#mw-content-text").find('h2,h3,li,p');
            summary.each($.proxy(function (index, value)
            {
                switch (value.nodeName)
                {
                    case 'H2':
                        foundH2 = $(value).find("span").first().text().indexOf("by") != -1;
                        break;

                    case 'H3':
                        if (foundH2)
                        {
                            volumeTitle = $(value).find("span").first().text();  
                            volumeUrl   = $(value).find("a").attr("href");  
                            ready = true
                        }
                        break;

                    case "LI":
                        if (ready)
                        {
                            if (currentNovelVolume.title != volumeTitle)
                            {                               
                                //new volume 
                                if (firstPass && currentNovelVolume.chapterList.length > 0)
                                {
                                    this.volumes.push(currentNovelVolume);
                                }

                                firstPass = true;

                                currentNovelVolume = new NovelVolume();
                                currentNovelVolume.url = volumeUrl;
                                currentNovelVolume.title = volumeTitle;
                            }

                            var charpterUrl:string   = $(value).find("a").attr("href");  
                            var charpterTitle:string = $(value).find("a").first().text();

                            if (charpterUrl != undefined) // invalid chapter 
                            {
                                var chaper: NovelChapter = new NovelChapter();
                                chaper.url = charpterUrl;
                                chaper.title = charpterTitle;

                                currentNovelVolume.chapterList.push(chaper);
                            }
                        }
                        break;

                    case "P":
                        ready = !ready;                        
                        break;
                }
                               
            }, this));

            this.volumes.push(currentNovelVolume);                                  
        }
    }
} 