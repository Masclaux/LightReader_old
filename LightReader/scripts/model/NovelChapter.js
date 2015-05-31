var LightReader;
(function (LightReader) {
    var NovelChapter = (function () {
        function NovelChapter() {
            this.images = {};
            this.url = "";
            this.title = "";
            this.pages = new Array();
        }
        return NovelChapter;
    })();
    LightReader.NovelChapter = NovelChapter;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=NovelChapter.js.map