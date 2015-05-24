module LightReader
{
    export class NovelImage
    {
        constructor()
        {
            this.id = "";
            this.title = "";
            this.url = "";
            this.localUrl = "";
            this.isLocal = false;
        }

        public id: string;

        public title: string;

        public url: string;

        public localUrl: string;

        public isLocal: boolean = false;
    }
} 