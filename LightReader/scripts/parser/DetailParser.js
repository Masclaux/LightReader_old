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
//# sourceMappingURL=DetailParser.js.map