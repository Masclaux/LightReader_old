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
        public id: string;

        public title: string;

        public url: string;

        public localUrl: string;

        public isLocal:boolean = false;
    }
}