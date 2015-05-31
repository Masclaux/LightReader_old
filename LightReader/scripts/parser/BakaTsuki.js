/// <reference path="../model/NovelContent.ts"/>
/// <reference path="../libs/jquery/jquery.d.ts"/>
/// <reference path="../model/NovelVolume.ts"/>
var LightReader;
(function (LightReader) {
    var BakaTsukiParser = (function () {
        function BakaTsukiParser() {
            this.nbImageDown = 0;
            this.nbImageFound = 0;
        }
        BakaTsukiParser.prototype.Parse = function (content) {
            console.info("Start parsing light novel volume");
            var res = $.parseHTML(content);
            if (res != null) {
                console.info("Parsing summary");
                var summary = $(res).find(".toc ul li.toclevel-1");
                summary.each(function (index, value) {
                    var link = $(value).find("a").attr("href");
                    var title = $(value).find(".toctext").first().text();
                    //console.log("found : " + title + " - " + link);
                });
            }
            this.model = new LightReader.NovelVolume();
            //Volume_1_Illustrations
            //Volume_1_Prologue
            //Volume_1_Chapter_1
            //Volume_1_Chapter_2
            //Volume_1_Chapter_3
            //Volume_1_Chapter_4
            //Volume_1_Chapter_5
            //Volume_1_Chapter_6
            //Volume_1_Chapter_7
            //Volume_1_Epilogue
            this.model.title = "Absolute_Duo";
            this.model.chapterList = new Array();
            var chapter = new LightReader.NovelChapter();
            chapter.title = "Volume_1_Chapter_1";
            this.model.chapterList.push(chapter);
            for (var c in this.model.chapterList) {
                var chapter = this.model.chapterList[c];
                $.get("http://www.baka-tsuki.org/project/index.php?title=" + this.model.title + ":" + chapter.title).done($.proxy(this.OnContentOk, this));
            }
        };
        BakaTsukiParser.prototype.OnContentOk = function (data) {
            this.GetChapter(data);
        };
        BakaTsukiParser.prototype.GetChapter = function (content) {
            console.info("Parsing Chapter");
            var firstPartNotFound = false;
            var tempParaText = "";
            var tempWords = 0;
            this.nbImageFound = 0;
            this.model.chapterList[0].pages = new Array();
            var res = $.parseHTML(content);
            if (res != null) {
                console.info("Parsing summary");
                var summary = $(res).find("#mw-content-text").find('h2,h3,p,div.thumb.tright,div.thumb');
                summary.each($.proxy(function (index, value) {
                    switch (value.nodeName) {
                        case 'H2':
                            tempParaText += "<h2>" + value.firstChild.textContent + "</h2>";
                            break;
                        case 'H3':
                            if (this.model.chapterList[0].pages.length > 0) {
                                this.model.chapterList[0].pages.push(tempParaText);
                                tempWords = 0;
                                tempParaText = "";
                            }
                            tempParaText += "<h3>" + value.firstChild.textContent + "</h3>";
                            break;
                        case 'P':
                            tempParaText += "<P>" + value.firstChild.textContent + "</P>";
                            break;
                        case 'DIV':
                            this.nbImageFound++;
                            var val = this.parseImage(value);
                            this.model.chapterList[0].pages.push("img;;" + val);
                            this.model.chapterList[0].images[val] = new LightReader.NovelImage();
                            this.model.chapterList[0].images[val].id = val;
                            break;
                    }
                    tempWords += value.firstChild.textContent.split(" ").length;
                    if (tempWords >= 350) {
                        this.model.chapterList[0].pages.push(tempParaText);
                        tempWords = 0;
                        tempParaText = "";
                    }
                }, this));
                if (tempParaText != "") {
                    this.model.chapterList[0].pages.push(tempParaText);
                }
            }
            for (var pictureName in this.model.chapterList[0].images) {
                $.getJSON(BakaTsukiParser.IMAGE_QUERY + pictureName + "&").done($.proxy(function (results) {
                    this.onGetImage(results);
                }, this));
            }
        };
        BakaTsukiParser.prototype.onGetImage = function (results) {
            this.nbImageDown++;
            console.info("Try to parse : " + results);
            for (var index in results.query.pages) {
                var id = results.query.pages[index].imageinfo[0].descriptionurl.split("File:")[1];
                var url = results.query.pages[index].imageinfo[0].url;
                this.model.chapterList[0].images[id].url = url;
            }
            if (this.nbImageDown == this.nbImageFound) {
                this.onParsingComplete(this);
            }
        };
        BakaTsukiParser.prototype.parseImage = function (link) {
            var fileUrl = "";
            if (link != null) {
                var url = $(link).find("a.image").attr('href');
                if (url != null) {
                    var splitUrl = url.split(","); // in read 
                    if (splitUrl.length > 0) {
                        splitUrl = splitUrl[0].split("/");
                        for (var c in splitUrl) {
                            if (splitUrl[c] != "thumb") {
                                if (splitUrl[c].indexOf(".") != -1) {
                                    var finalUrl = splitUrl[c].split("File:"); //get only page name
                                    if (finalUrl.length > 0) {
                                        fileUrl = finalUrl[1]; //right part
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            console.info("Found Image : " + fileUrl);
            return fileUrl;
        };
        BakaTsukiParser.IMAGE_QUERY = "http://www.baka-tsuki.org/project/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=File:";
        return BakaTsukiParser;
    })();
    LightReader.BakaTsukiParser = BakaTsukiParser;
})(LightReader || (LightReader = {}));
//# sourceMappingURL=BakaTsuki.js.map