/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
var LightReader;
(function (LightReader) {
    var BakaTsukiParser = (function () {
        function BakaTsukiParser() {
        }
        BakaTsukiParser.prototype.Parse = function (model, content) {
            console.info("Start parsing light novel volume");
            var res = $.parseHTML(content);
            if (res != null) {
                console.info("Parsing summary");
                var summary = $(res).find(".toc ul li.toclevel-1");
                summary.each(function (index, value) {
                    var link = $(value).find("a").attr("href");
                    var title = $(value).find(".toctext").first().text();
                    console.log("found : " + title + " - " + link);
                });
                $.get("http://www.baka-tsuki.org/project/index.php?title=Absolute_Duo:Volume_1_Prologue").done($.proxy(this.OnContentOk, this));
            }
        };
        BakaTsukiParser.prototype.OnContentOk = function (data) {
            this.GetChapter(data);
        };
        BakaTsukiParser.prototype.GetChapter = function (content) {
            console.info("Get Chapter " + content);
        };
        return BakaTsukiParser;
    })();
    LightReader.BakaTsukiParser = BakaTsukiParser;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=BakaTsuki.js.map