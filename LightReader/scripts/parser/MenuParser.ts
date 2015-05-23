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

        public volumes: Array<NovelVolume> = new Array<NovelVolume>();   


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

            this.ParseVolumes("/project/index.php?title=Absolute_Duo", "ZERo");
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

            var firstPass: boolean = false;

            var volumeTitle: string = "";
            var volumeUrl: string = "";

            var currentNovelVolume: NovelVolume = new NovelVolume();

            var summary = $(res).find("#mw-content-text").find('h2,h3,li,p');//,p,div.thumb.tright,div.thumb');
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
                                if (firstPass)
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
                        if (ready)
                        {
                            ready = false;
                        }
                        break;
                }
                               
            }, this));

            this.volumes.push(currentNovelVolume);

            for (var v in this.volumes)
            {
                console.log(this.volumes[v].title);

                for (var c in this.volumes[v].chapterList)
                {
                    console.log(this.volumes[v].chapterList[c].title);
                }
            }
            
        }
    }
} 