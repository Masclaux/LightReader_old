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

        public volumeList: Array<NovelVolume>;
    }
}

