var LightReader;
(function (LightReader) {
    var NovelContent = (function () {
        function NovelContent() {
        }
        return NovelContent;
    })();
    LightReader.NovelContent = NovelContent;
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
        }
        return NovelImage;
    })();
    LightReader.NovelImage = NovelImage;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=NovelContent.js.map