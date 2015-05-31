/// <reference path="../libs/jquery/jquery.d.ts"/>

module LightReader
{
    export class DetailParser 
    {
        public static VOLUME_QUERY: string =
        "http://baka-tsuki.org";
        
        public onLightNovelDetailComplete;

        public novel: NovelContent;

        private volumes: Array<NovelVolume> = new Array<NovelVolume>();   


        //Get Light Novel list  
        public Parse(novel:NovelContent)
        {
            console.info("Stating Parsing detail for " + novel.title);

            this.novel = novel;
            this.ParseVolumes(novel.url, novel.title);
        }

        private ParseVolumes(url: string, title: string)
        {
            console.log("Parse Volumes : " + url + " - " + title);

            var volumeUrl = DetailParser.VOLUME_QUERY + url;
            $.get(volumeUrl).done
                (
                $.proxy(this.OnVolumeParsed, this)
                );
        }

        private OnVolumeParsed(res)
        {
            console.info("Start parse html");

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
                            volumeUrl = $(value).find("a").attr("href");
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

                            var charpterUrl: string = $(value).find("a").attr("href");
                            var charpterTitle: string = $(value).find("a").first().text();

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

            this.novel.volumeList = this.volumes;

            this.onLightNovelDetailComplete(this);
        }
    }
} 