/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>

module LightReader
{
    export class BakaTsukiParser 
    {

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

                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Illustrations
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Prologue
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_1
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_2
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_3
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_4
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_5
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_6
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Chapter_7
                //http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Epilogue

                this.model.title = "Absolute_Duo";
                this.model.chapterList = new Array<NovelChapter>();
                
               /* var chapter: NovelChapter = new NovelChapter();
                chapter.title = "Volume_1_Illustrations";
                this.model.chapterList.push(chapter);

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Prologue";
                this.model.chapterList.push(chapter);*/

                chapter = new NovelChapter();
                chapter.title = "Volume_1_Chapter_1";
                this.model.chapterList.push(chapter);/*

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
           


            console.log("3");
        }

        public OnContentOk(data)
        {
            this.GetChapter(data);
        }

        public GetChapter(content: string)
        {
            console.info("Parsing Chapter");

            var tempParaText: string = "";
            var currentImage: number = 0;
            var tempWords: number    = 0; 

            this.model.chapterList[0].pages = new Array<String>();

            var res = $.parseHTML(content);
            if (res != null)
            {
                console.info("Parsing summary");

                var summary = $(res).find('h2,h3,p,div.thumb.tright');
                summary.each($.proxy(function (index, value)
                {   
                    switch (value.nodeName)
                    {
                        case 'H2':
                            tempParaText += "<h2>" + value.firstChild.textContent +"</h2>";
                            break;

                        case 'H3':
                            tempParaText += "<h3>" + value.firstChild.textContent + "</h3>";
                            break;

                        case 'P':
                            tempParaText += "<P>" + value.firstChild.textContent + "</P>";
                            break;
                        case 'DIV':
                            this.model.chapterList[0].pages.push(currentImage.toString());
                            this.currentImage++;
                            break;
                    }

                    tempWords += value.firstChild.textContent.split(" ").length;
                    if (tempWords >= 350 )
                    {
                        this.model.chapterList[0].pages.push(tempParaText);
                        tempWords    = 0;                        
                        tempParaText = "";
                    }
                },this));
            }


            this.onParsingComplete(this);

        }
    }
}