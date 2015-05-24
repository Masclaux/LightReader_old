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
    }
}