/// <reference path="../libs/jquery/jquery.d.ts"/>
var LightReader;
(function (LightReader) {
    var MenuParser = (function () {
        function MenuParser() {
            this.novelList = new Array();
        }
        //Get Light Novel list  
        MenuParser.prototype.Parse = function (lang) {
            var listUrl = MenuParser.LIST_QUERY + lang + ")";
            $.get(listUrl).done($.proxy(this.OnMenuParsed, this));
        };
        MenuParser.prototype.OnMenuParsed = function (data) {
            console.info("Start parsing light novel list");
            var res = $.parseHTML(data);
            if (res != null) {
                var table = $(res).find(".mw-content-ltr ul li");
                table.each($.proxy(function (index, value) {
                    var novel = new LightReader.NovelContent();
                    novel.title = $(value).find("a").attr("title");
                    novel.url = $(value).find("a").attr("href");
                    console.log("Found : " + novel.title + " - " + novel.url);
                    this.novelList.push(novel);
                }, this));
            }
            this.onLightNovelListComplete(this);
        };
        MenuParser.LIST_QUERY = "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";
        return MenuParser;
    })();
    LightReader.MenuParser = MenuParser;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=MenuParser.js.map