module LightReader 
{
    export class NovelChapter
    {
        constructor()
        {
            this.url = "";

            this.title = "";

            this.pages = new Array<string>();
        }

        public title: string;

        public url: string;

        public images: { [id: string]: NovelImage; } = {};

        public pages: Array<string>;
    }
} 