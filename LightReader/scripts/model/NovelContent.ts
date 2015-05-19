module LightReader {
        
    export class NovelContent 
    {
        public title: string;
        
        public chapterList: Array<NovelChapter>;   

        public currentPage: Number;

        public lastPos: Number;
    }

    export class NovelChapter
    {
        public title: string;

        public images: { [id: string]: NovelImage; } = {};        

        public pages: Array<string>;  
    }

    export class NovelImage
    {
        constructor()
        {
            this.id     = "";
            this.title  = "";
            this.url    = "";
            this.localUrl = "";
            this.isLocal  = false;
        }

        public id: string;

        public title: string;

        public url: string;

        public localUrl: string;

        public isLocal:boolean = false;
    }
}