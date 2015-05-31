// FULL_URL = "http://www.baka-tsuki.org/project/index.php?title=";  
var LightReader;
(function (LightReader) {
    //Application model Singleton Instance
    var AppModel = (function () {
        function AppModel() {
            this.novelList = new Array();
            if (AppModel.inst) {
                throw new Error("Error: Instantiation failed: Use AppModel.getInstance() instead of new.");
            }
            AppModel.inst = this;
        }
        //return object instance
        AppModel.Inst = function () {
            return AppModel.inst;
        };
        AppModel.inst = new AppModel();
        return AppModel;
    })();
    LightReader.AppModel = AppModel;
})(LightReader || (LightReader = {}));
///<reference path="model/AppModel.ts"/>
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
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            var parser = new LightReader.MenuParser();
            parser.onLightNovelListComplete = onLightNovelListComplete;
            parser.Parse("English");
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
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
        console.info("Parsing complet found " + parser.novel.volumeList.length);
        LightReader.AppModel.Inst().novelList[0] = parser.novel;
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
        return NovelVolume;
    })();
    LightReader.NovelVolume = NovelVolume;
})(LightReader || (LightReader = {}));
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
            //get all image from chapter 
            for (var pictureName in this.model.chapterList[0].images) {
                $.getJSON(BakaTsukiParser.IMAGE_QUERY + pictureName + "&").done //avoid warning with & at the end ><
                ($.proxy(function (results) { this.onGetImage(results); }, this));
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
                                    break; // yes so we quit the loop
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
/// <reference path="../libs/jquery/jquery.d.ts"/>
var LightReader;
(function (LightReader) {
    var DetailParser = (function () {
        function DetailParser() {
            this.volumes = new Array();
        }
        //Get Light Novel list  
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
                                //new volume 
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
// Platform specific overrides will be placed in the merges folder versions of this file 
//# sourceMappingURL=app.js.map