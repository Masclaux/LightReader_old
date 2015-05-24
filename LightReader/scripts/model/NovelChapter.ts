module LightReader 
{
    export class NovelChapter
    {
        public title: string;

        public url: string;

        public images: { [id: string]: NovelImage; } = {};

        public pages: Array<string>;
    }
} 