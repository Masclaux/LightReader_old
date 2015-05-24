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
}

