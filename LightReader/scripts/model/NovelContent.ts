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

        public images: Array<string>;         

        public pages: Array<string>;  
    }
}