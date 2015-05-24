// FULL_URL = "http://www.baka-tsuki.org/project/index.php?title=";  
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var LightReader;
(function (LightReader) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            var parser = new LightReader.BakaTsukiParser();
            parser.onParsingComplete = onParsingComplete;
            //parser.Parse("");
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
    function onParsingComplete(parser) {
    }
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    //Application model Singleton Instance;
    var AppModel = (function () {
        function AppModel() {
            this.test = -1;
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
var LightReader;
(function (LightReader) {
    var NovelChapter = (function () {
        function NovelChapter() {
            this.images = {};
        }
        return NovelChapter;
    })();
    LightReader.NovelChapter = NovelChapter;
})(LightReader || (LightReader = {}));
var LightReader;
(function (LightReader) {
    var Novel = (function () {
        function Novel() {
            this.volumeList = new Array();
        }
        return Novel;
    })();
    LightReader.Novel = Novel;
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
/// <reference path="../typings/jquery/jquery.d.ts"/>
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
/// <reference path="../typings/jquery/jquery.d.ts"/>
var LightReader;
(function (LightReader) {
    var MenuParser = (function () {
        function MenuParser() {
            this.volumes = new Array();
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
                    var link = $(value).find("a").attr("href");
                    var title = $(value).find("a").attr("title");
                    //                    this.ParseVolumes(link, title);
                }, this));
            }
            this.ParseVolumes("/project/index.php?title=Absolute_Duo", "ZERo"); //
        };
        MenuParser.prototype.ParseVolumes = function (url, title) {
            console.log("Parse Volumes : " + url + " - " + title);
            var volumeUrl = MenuParser.VOLUME_QUERY + url;
            $.get(volumeUrl).done($.proxy(this.OnVolumeParsed, this));
        };
        MenuParser.prototype.OnVolumeParsed = function (res) {
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
            this.volumes.push(currentNovelVolume);
            for (var v in this.volumes) {
                console.log(this.volumes[v].title);
                for (var c in this.volumes[v].chapterList) {
                    console.log(this.volumes[v].chapterList[c].title);
                }
            }
        };
        MenuParser.LIST_QUERY = "http://baka-tsuki.org/project/index.php?title=Category:Light_novel_(";
        MenuParser.VOLUME_QUERY = "http://baka-tsuki.org";
        return MenuParser;
    })();
    LightReader.MenuParser = MenuParser;
})(LightReader || (LightReader = {}));
// Platform specific overrides will be placed in the merges folder versions of this file 
//# sourceMappingURL=app.js.map