var LightReader;
(function (LightReader) {
    var AppModel = (function () {
        function AppModel() {
            this.sources = new Array();
            this.novelList = new Array();
            if (AppModel.inst) {
                throw new Error("Error: Instantiation failed: Use AppModel.getInstance() instead of new.");
            }
            AppModel.inst = this;
        }
        AppModel.Inst = function () {
            return AppModel.inst;
        };
        AppModel.inst = new AppModel();
        return AppModel;
    })();
    LightReader.AppModel = AppModel;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    "use strict";
    var Application;
    (function (Application) {
        var appModel;
        function initialize() {
            this.appModel = LightReader.AppModel.Inst();
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            var parser = new LightReader.MenuParser();
            parser.onLightNovelListComplete = onLightNovelListComplete;
            parser.Parse("English");
        }
        function onPause() {
        }
        function onResume() {
        }
    })(Application = LightReader.Application || (LightReader.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
    function onLightNovelListComplete(parser) {
        console.info("Parsing complet found " + parser.novelList.length);
        LightReader.AppModel.Inst().novelList = parser.novelList;
        var pa = new LightReader.DetailParser();
        pa.onLightNovelDetailComplete = onLightNovelDetailComplete;
        pa.Parse(LightReader.AppModel.Inst().novelList[0]);
    }
    function onLightNovelDetailComplete(parser) {
        console.info("Parsing detail complete  found " + parser.novel.volumeList.length);
        LightReader.AppModel.Inst().novelList[0] = parser.novel;
        var pa = new LightReader.BakaTsukiParser();
        pa.onParsingComplete = onParsingComplete;
        pa.Parse(LightReader.AppModel.Inst().novelList[0].volumeList[1]);
    }
    function onParsingComplete(parser) {
        LightReader.AppModel.Inst().novelList[0].volumeList[1] = parser.model;
    }
})(LightReader || (LightReader = {}));
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
var LightReader;
(function (LightReader) {
    var NovelContent = (function () {
        function NovelContent() {
            this.synopsis = "test synopsis ";
            this.url = "";
            this.title = "";
            this.volumeList = new Array();
        }
        return NovelContent;
    })();
    LightReader.NovelContent = NovelContent;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
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
                    var currentImage = page.search("img;;");
                    if (currentImage != -1) {
                        var id = page.split(";;")[1];
                        page = "<img src='" + this.chapterList[c].images[id].url + "'style='width:100%'/>";
                    }
                    res.push(page);
                }
            }
            return res;
        };
        return NovelVolume;
    })();
    LightReader.NovelVolume = NovelVolume;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    var Source = (function () {
        function Source() {
            this.novelList = new Array();
        }
        return Source;
    })();
    LightReader.Source = Source;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    var BakaTsukiParser = (function () {
        function BakaTsukiParser() {
            this.nbImageDown = 0;
            this.nbImageFound = 0;
        }
        BakaTsukiParser.prototype.Parse = function (volume) {
            this.model = volume;
            console.info("Start parsing volume : " + volume.title);
            for (var c in this.model.chapterList) {
                this.retrieveChapter(c);
            }
        };
        BakaTsukiParser.prototype.retrieveChapter = function (i) {
            var chapter = this.model.chapterList[i];
            $.ajax({
                url: "http://www.baka-tsuki.org" + chapter.url,
                success: $.proxy(function (result) {
                    this.GetChapter(result, i);
                }, this)
            });
        };
        BakaTsukiParser.prototype.GetChapter = function (content, chapter) {
            console.info("Parsing Chapter");
            var firstPartNotFound = false;
            var tempParaText = "";
            var tempWords = 0;
            this.nbImageFound = 0;
            this.model.chapterList[chapter].pages = new Array();
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
                            if (this.model.chapterList[chapter].pages.length > 0) {
                                this.model.chapterList[chapter].pages.push(tempParaText);
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
                            this.model.chapterList[chapter].pages.push("img;;" + val);
                            this.model.chapterList[chapter].images[val] = new LightReader.NovelImage();
                            this.model.chapterList[chapter].images[val].id = val;
                            break;
                    }
                    tempWords += value.firstChild.textContent.split(" ").length;
                    if (tempWords >= 350) {
                        this.model.chapterList[chapter].pages.push(tempParaText);
                        tempWords = 0;
                        tempParaText = "";
                    }
                }, this));
                if (tempParaText != "") {
                    this.model.chapterList[chapter].pages.push(tempParaText);
                }
            }
            for (var pictureName in this.model.chapterList[chapter].images) {
                this.retrieveImage(pictureName, chapter);
            }
        };
        BakaTsukiParser.prototype.retrieveImage = function (pictureName, chapterIndex) {
            $.getJSON(BakaTsukiParser.IMAGE_QUERY + pictureName + "&").done($.proxy(function (results) {
                this.onGetImage(results, chapterIndex);
            }, this));
        };
        BakaTsukiParser.prototype.onGetImage = function (results, chapterIndex) {
            this.nbImageDown++;
            console.info("Try to parse : " + results);
            for (var index in results.query.pages) {
                var id = results.query.pages[index].imageinfo[0].descriptionurl.split("File:")[1];
                var url = results.query.pages[index].imageinfo[0].url;
                this.model.chapterList[chapterIndex].images[id].url = url;
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
                    var splitUrl = url.split(",");
                    if (splitUrl.length > 0) {
                        splitUrl = splitUrl[0].split("/");
                        for (var c in splitUrl) {
                            if (splitUrl[c] != "thumb") {
                                if (splitUrl[c].indexOf(".") != -1) {
                                    var finalUrl = splitUrl[c].split("File:");
                                    if (finalUrl.length > 0) {
                                        fileUrl = finalUrl[1];
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
var LightReader;
(function (LightReader) {
    var DetailParser = (function () {
        function DetailParser() {
            this.volumes = new Array();
        }
        DetailParser.prototype.Parse = function (novel) {
            console.info("Stating Parsing detail for " + novel.title);
            this.novel = novel;
            this.ParseVolumes(novel.url, novel.title);
        };
        DetailParser.prototype.ParseVolumes = function (url, title) {
            console.log("Parse Volumes : " + url + " - " + title);
            var volumeUrl = DetailParser.VOLUME_QUERY + url;
            $.get(volumeUrl).done($.proxy(this.OnVolumeParsed, this));
        };
        DetailParser.prototype.OnVolumeParsed = function (res) {
            console.info("Start parse html");
            var foundH2 = false;
            var ready = false;
            var firstPass = false;
            var volumeTitle = "";
            var volumeUrl = "";
            var currentNovelVolume = new LightReader.NovelVolume();
            var summary = $(res).find("#mw-content-text").find('h2,h3,li,p');
            summary.each($.proxy(function (index, value) {
                switch (value.nodeName) {
                    case 'H2':
                        foundH2 = $(value).find("span").first().text().indexOf("by") != -1;
                        break;
                    case 'H3':
                        if (foundH2) {
                            volumeTitle = $(value).find("span").first().text();
                            volumeUrl = $(value).find("a").attr("href");
                            ready = true;
                        }
                        break;
                    case "LI":
                        if (ready) {
                            if (currentNovelVolume.title != volumeTitle) {
                                if (firstPass && currentNovelVolume.chapterList.length > 0) {
                                    this.volumes.push(currentNovelVolume);
                                }
                                firstPass = true;
                                currentNovelVolume = new LightReader.NovelVolume();
                                currentNovelVolume.url = volumeUrl;
                                currentNovelVolume.title = volumeTitle;
                            }
                            var charpterUrl = $(value).find("a").attr("href");
                            var charpterTitle = $(value).find("a").first().text();
                            if (charpterUrl != undefined) {
                                var chaper = new LightReader.NovelChapter();
                                chaper.url = charpterUrl;
                                chaper.title = charpterTitle;
                                currentNovelVolume.chapterList.push(chaper);
                            }
                        }
                        break;
                    case "P":
                        ready = !ready;
                        break;
                }
            }, this));
            this.novel.volumeList = this.volumes;
            this.onLightNovelDetailComplete(this);
        };
        DetailParser.VOLUME_QUERY = "http://baka-tsuki.org";
        return DetailParser;
    })();
    LightReader.DetailParser = DetailParser;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    var MenuParser = (function () {
        function MenuParser() {
            this.novelList = new Array();
        }
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
