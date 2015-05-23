module LightReader 
{     

    export class Novel
    {
        constructor()
        {
            this.volumeList = new Array<NovelVolume>();
        }

        public url: string;

        public title: string;

        public volumeList: Array<NovelVolume>;
    }

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
    }

    export class NovelChapter
    {
        public title: string;

        public url: string;

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