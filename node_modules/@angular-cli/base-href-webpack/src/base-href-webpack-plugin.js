"use strict";
var BaseHrefWebpackPlugin = (function () {
    function BaseHrefWebpackPlugin(options) {
        this.options = options;
    }
    BaseHrefWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        // Ignore if baseHref is not passed
        if (!this.options.baseHref) {
            return;
        }
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
                // Check if base tag already exists
                var baseTagRegex = /<base.*?>/i;
                var baseTagMatches = htmlPluginData.html.match(baseTagRegex);
                if (!baseTagMatches) {
                    // Insert it in top of the head if not exist
                    htmlPluginData.html = htmlPluginData.html.replace(/<head>/i, '$&' + ("<base href=\"" + _this.options.baseHref + "\">"));
                }
                else {
                    // Replace only href attribute if exists
                    var modifiedBaseTag = baseTagMatches[0].replace(/href="\S+"/i, "href=\"" + _this.options.baseHref + "\"");
                    htmlPluginData.html = htmlPluginData.html.replace(baseTagRegex, modifiedBaseTag);
                }
                callback(null, htmlPluginData);
            });
        });
    };
    return BaseHrefWebpackPlugin;
}());
exports.BaseHrefWebpackPlugin = BaseHrefWebpackPlugin;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@angular-cli/base-href-webpack/src/base-href-webpack-plugin.js.map