/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../libs/jquery/jquery.d.ts"/>
/// <reference path="../model/NovelVolume.ts"/>
module LightReader
{
    export class BakaTsukiParser 
    {
        public static IMAGE_QUERY: string =
        "http://www.baka-tsuki.org/project/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=File:";

        public onParsingComplete;

        public model: NovelVolume;

        private nbImageDown:number = 0;

        private nbImageFound: number = 0;

        public Parse(volume:NovelVolume)
        {
            this.model = volume;

            console.info("Start parsing volume : " + volume.title );

            for (var c in this.model.chapterList)
            {
                this.retrieveChapter(c);
            }                            
        }

        private retrieveChapter(i: number)
        {
            var chapter: NovelChapter = this.model.chapterList[i];
            $.ajax({
                url: "http://www.baka-tsuki.org" + chapter.url,
                success: $.proxy(function (result) { this.GetChapter(result, i) }, this)
            });   
        }

        public GetChapter(content: string, chapter:number)
        {
            console.info("Parsing Chapter");

            var firstPartNotFound = false;

            var tempParaText: string = "";
            var tempWords: number = 0; 

            this.nbImageFound = 0;

            this.model.chapterList[chapter].pages  = new Array<string>();            

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
                            if (this.model.chapterList[chapter].pages.length > 0)
                            {
                                this.model.chapterList[chapter].pages.push(tempParaText);
                                tempWords = 0;
                                tempParaText = "";
                            }

                            tempParaText += "<h3>" + value.firstChild.textContent + "</h3>";
                            break;

                        case 'P':
                            tempParaText += "<P>" + value.firstChild.textContent + "</P>";
                            break;

                        case 'DIV':
                            this.nbImageFound++;   

                            var val = this.parseImage(value);

                            this.model.chapterList[chapter].pages.push("img;;" + val);
                            this.model.chapterList[chapter].images[val] = new NovelImage();
                            this.model.chapterList[chapter].images[val].id = val;
                            break;
                    }

                    tempWords += value.firstChild.textContent.split(" ").length;
                    if (tempWords >= 350 )
                    {
                        this.model.chapterList[chapter].pages.push(tempParaText);
                        tempWords    = 0;                        
                        tempParaText = "";
                    }
                }, this));

                if (tempParaText != "")
                {
                    this.model.chapterList[chapter].pages.push(tempParaText);
                }

            }

            //get all image from chapter 
            for (var pictureName in this.model.chapterList[chapter].images )
            {             
                this.retrieveImage(pictureName, chapter);
            }
        }

        private retrieveImage(pictureName:string, chapterIndex: number)
        {
            $.getJSON(BakaTsukiParser.IMAGE_QUERY + pictureName + "&").done //avoid warning with & at the end ><
                (
                $.proxy(function (results) { this.onGetImage(results, chapterIndex) }, this)
                );
        }

        public onGetImage(results, chapterIndex:number)
        {  
            this.nbImageDown++;

            console.info("Try to parse : " + results);
            for (var index in results.query.pages)
            {

                var id: string = results.query.pages[index].imageinfo[0].descriptionurl.split("File:")[1]; 
                var url: string = results.query.pages[index].imageinfo[0].url;

                this.model.chapterList[chapterIndex].images[id].url = url;
            }
           
            if (this.nbImageDown == this.nbImageFound)
            {
                this.onParsingComplete(this);
            }
        }
        
        public parseImage(link): string
        {    
            var fileUrl: string = "";
            if (link != null)
            {
                var url = $(link).find("a.image").attr('href');
                if (url != null)
                {
                    var splitUrl = url.split(","); // in read 
                    if (splitUrl.length > 0)
                    {
                        splitUrl = splitUrl[0].split("/");
                        for (var c in splitUrl)
                        {
                            if (splitUrl[c] != "thumb")
                            {                                
                                if (splitUrl[c].indexOf(".") != -1) //we found the file ? 
                                {
                                    var finalUrl = splitUrl[c].split("File:"); //get only page name
                                    if (finalUrl.length > 0)
                                    {
                                        fileUrl = finalUrl[1];//right part
                                    }
                                    break; // yes so we quit the loop
                                }
                            }
                        }
                    }
                }
            }
            
            console.info("Found Image : " + fileUrl);

            return fileUrl;
        }
    }
}