module LightReader 
{
    export class Source 
    {        
        public name: String;

        public url: String;

        public logoUrl: NovelImage;

        public synopsis: String;

        public novelList: Array<NovelContent>;

        constructor()
        {
            this.novelList = new Array<NovelContent>(); 
        }
    }
} 