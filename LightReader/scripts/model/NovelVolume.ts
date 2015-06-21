module LightReader 
{
    export class NovelVolume 
    {
        constructor()
        {
            this.chapterList = new Array<NovelChapter>();
        }

        public title: string;

        public url: string;

        public chapterList: Array<NovelChapter>;

        public currentPage: Number;

        public lastPos: Number;
              
        public GetPages(): Array<string>
        {
            var res: Array<string> = new Array<string>();           

            for (var c in this.chapterList)
            {
                for (var p in this.chapterList[c].pages)
                {
                    var page: string = this.chapterList[c].pages[p];

                    //image found 
                    var currentImage: number = page.search("img;;");
                    if (currentImage != -1) {
                        //get id 
                        var id: string = page.split(";;")[1];
                        page = "<img src='" + this.chapterList[c].images[id].url + "'style='width:100%'/>";
                    }

                    res.push(page);                              
                }                            
            }
            return res;
        }        
    }
}