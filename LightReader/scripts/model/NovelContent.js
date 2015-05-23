var LightReader;
(function (LightReader) {
    var Novel = (function () {
        function Novel() {
            this.volumeList = new Array();
        }
        return Novel;
    })();
    LightReader.Novel = Novel;
    var NovelVolume = (function () {
        function NovelVolume() {
            this.chapterList = new Array();
        }
        return NovelVolume;
    })();
    LightReader.NovelVolume = NovelVolume;
    var NovelChapter = (function () {
        function NovelChapter() {
            this.images = {};
        }
        return NovelChapter;
    })();
    LightReader.NovelChapter = NovelChapter;
    var NovelImage = (function () {
        function NovelImage() {
            this.isLocal = false;
            this.id = "";
            this.title = "";
            this.url = "";
            this.localUrl = "";
            this.isLocal = false;
        }
        return NovelImage;
    })();
    LightReader.NovelImage = NovelImage;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=NovelContent.js.map