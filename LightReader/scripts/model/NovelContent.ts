module LightReader 
{     

    export class NovelContent
    {
        constructor()
        {            
            this.url   = "";
            this.title = "";

            this.volumeList = new Array<NovelVolume>();
        }

        public url: string;

        public title: string;

        public synopsis: String = "test synopsis ";

        public volumeList: Array<NovelVolume>;
    }
}

