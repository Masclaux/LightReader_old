/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>

module LightReader
{
    export class BakaTsukiParser 
    {

        public static IMAGE_QUERY: string =
        "http://www.baka-tsuki.org/project/api.php?action=query&generator=images&prop=imageinfo&iiprop=url|dimensions|mime&format=json&titles=";

        public onParsingComplete;

        public model: NovelContent;

        public Parse(content: string)
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

                    //console.log("found : " + title + " - " + link);
                });
            }
                this.model = new NovelContent();

               //Volume_1_Illustrations
               //Volume_1_Prologue
               //Volume_1_Chapter_1
               //Volume_1_Chapter_2
               //Volume_1_Chapter_3
               //Volume_1_Chapter_4
               //Volume_1_Chapter_5
               //Volume_1_Chapter_6
               //Volume_1_Chapter_7
               //Volume_1_Epilogue
          
                this.model.title = "Absolute_Duo";
                this.model.chapterList = new Array<NovelChapter>();
                
                var chapter: NovelChapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_1";
                this.model.chapterList.push(chapter);

                /*chapter = new NovelChapter();
                chapter.title = "Volume_1_Prologue";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_1";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_2";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_3";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_4";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_5";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_6";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_7";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Epilogue";
                this.model.chapterList.push(chapter);*/
               
                for (var c in this.model.chapterList)
                {
                    var chapter: NovelChapter = this.model.chapterList[c];
                   
                    $.get("http://www.baka-tsuki.org/project/index.php?title=" + this.model.title + ":" + chapter.title).done
                    (
                       $.proxy(this.OnContentOk, this)
                    );
                }                            
        }

        public OnContentOk(data)
        {
            this.GetChapter(data);
        }

        public GetChapter(content: string)
        {
            console.info("Parsing Chapter");

            var firstPartNotFound = false;

            var tempParaText: string = "";
            var currentImage: number = 0;
            var tempWords: number    = 0; 

            this.model.chapterList[0].pages = new Array<string>();

            var res = $.parseHTML(content);
            if (res != null)
            {
                console.info("Parsing summary");

                var summary = $(res).find("#mw-content-text").find('h2,h3,p,div.thumb.tright,div.thumb');
                summary.each($.proxy(function (index, value)
                {   
                    switch (value.nodeName)
                    {
                        case 'H2':
                            tempParaText += "<h2>" + value.firstChild.textContent +"</h2>";
                            break;

                        case 'H3':
                            if (this.model.chapterList[0].pages.length > 0)
                            {
                                this.model.chapterList[0].pages.push(tempParaText);
                                tempWords = 0;
                                tempParaText = "";
                            }

                            tempParaText += "<h3>" + value.firstChild.textContent + "</h3>";
                            break;

                        case 'P':
                            tempParaText += "<P>" + value.firstChild.textContent + "</P>";
                            break;

                        case 'DIV':
                            this.model.chapterList[0].pages.push(currentImage);
                            currentImage++;   

                            this.parseImage2(value);

                            break;
                    }

                    tempWords += value.firstChild.textContent.split(" ").length;
                    if (tempWords >= 350 )
                    {
                        this.model.chapterList[0].pages.push(tempParaText);
                        tempWords    = 0;                        
                        tempParaText = "";
                    }
                }, this));

                if (tempParaText != "")
                {
                    this.model.chapterList[0].pages.push(tempParaText);
                }

            }

            //get all image from chapter 
            $.getJSON(BakaTsukiParser.IMAGE_QUERY +"Absolute_Duo:Volume_1_Illustrations").done
                (
                    $.proxy(this.parseImage, this)
                );           
        }

        public parseImage(data)
        {
            console.info("Image found start parsing");

            this.model.chapterList[0].images = new Array<string>();

            for (var index in data.query.pages)
            {
                this.model.chapterList[0].images.push(data.query.pages[index].imageinfo[0].url );
            }
            
            this.onParsingComplete(this);
        }


        public parseImage2(link): string
        {
            console.info("Image found start parsing");

            var fileUrl: string = "";


            var res = link;//$.parseHTML(link);
            if (res != null)
            {
                var url = $(res).find("a.image").prop('href');
                if (url != null)
                {
                    var test = url.split(",");
                    if (test.length > 0)
                    {
                        test = test[0].split("/");
                        for (var c in test)
                        {
                            if (test[c] != "thumb")
                            {
                                fileUrl += "/" + test[c];

                                if (test[c].indexOf(".") != -1) //we found the file ? 
                                {
                                    break; // yes so we quit the loop
                                }
                            }
                        }
                    }
                }
            }

            return "http://www.baka-tsuki.org" + fileUrl;
        }
    }
}