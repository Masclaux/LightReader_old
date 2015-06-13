var LightReader;
(function (LightReader) {
    var NovelVolume = (function () {
        function NovelVolume() {
            this.chapterList = new Array();
        }
        NovelVolume.prototype.GetPages = function () {
            var res = new Array();
            for (var c in this.chapterList) {
                for (var p in this.chapterList[c].pages) {
                    var page = this.chapterList[c].pages[p];
                    //image found 
                    var currentImage = page.search("img;;");
                    if (currentImage != -1) {
                        //get id 
                        var id = page.split(";;")[1];
                        page = "<img src='" + this.chapterList[c].images[id].url + "'style='width:100%'/>";
                    }
                    else {
                        res.push(page);
                    }
                    if (page.length == 10) {
                        return res;
                    }
                }
            }
            return res;
        };
        return NovelVolume;
    })();
    LightReader.NovelVolume = NovelVolume;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=NovelVolume.js.map