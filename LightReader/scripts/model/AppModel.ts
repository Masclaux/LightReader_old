﻿module LightReader 
{
    //Application model Singleton Instance
    export class AppModel
    {
        private static inst: AppModel = new AppModel();


        public sources: Array<Source> = new Array<Source>();      


        public novelList: Array<NovelContent> = new Array<NovelContent>();      

        //return object instance
        public static Inst(): AppModel
        {
            return AppModel.inst;
        }

        constructor()
        {
            if (AppModel.inst)
            {
                throw new Error("Error: Instantiation failed: Use AppModel.getInstance() instead of new.");
            }

            AppModel.inst = this;
         
        }        
    }
} 