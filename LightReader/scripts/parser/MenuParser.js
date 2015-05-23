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
                    //this.ParseVolumes(link, title);
                }, this));
            }
            this.ParseVolumes("/project/index.php?title=Absolute_Duo", "ZERo");
        };
        MenuParser.prototype.ParseVolumes = function (url, title) {
            console.log("Parse Volumes : " + url + " - " + title);
            var volumeUrl = MenuParser.VOLUME_QUERY + url;
            $.get(volumeUrl).done($.proxy(this.OnVolumeParsed, this));
        };
        MenuParser.prototype.OnVolumeParsed = function (res) {
            var foundH3 = false;
            var foundH2 = false;
            var ready = false;
            var firstPass = false;
            var volumeTitle = "";
            var volumeUrl = "";
            var currentNovelVolume = new LightReader.NovelVolume();
            var summary = $(res).find("#mw-content-text").find('h2,h3,li,p'); //,p,div.thumb.tright,div.thumb');
            summary.each($.proxy(function (index, value) {
                switch (value.nodeName) {
                    case 'H2':
                        foundH2 = true;
                        if (foundH3) {
                            foundH3 = false;
                            foundH2 = false;
                        }
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
                                if (firstPass) {
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
                        if (ready) {
                            ready = false;
                        }
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
//# sourceMappingURL=MenuParser.js.map