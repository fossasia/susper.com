// replace with the real thing when PR is merged
// https://github.com/angular/universal/pull/464
"use strict";
var PrerenderWebpackPlugin = (function () {
    function PrerenderWebpackPlugin(options) {
        this.options = options;
        // maintain your platform instance
        this.bootloader = require(this.options.configPath).getBootloader();
    }
    PrerenderWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('emit', function (compilation, callback) {
            if (compilation.assets.hasOwnProperty(_this.options.templatePath)) {
                // we need to cache the template file to be able to re-serialize it
                // even when it is not being emitted
                _this.cachedTemplate = compilation.assets[_this.options.templatePath].source();
            }
            if (_this.cachedTemplate) {
                _this.decacheAppFiles();
                require(_this.options.configPath).serialize(_this.bootloader, _this.cachedTemplate)
                    .then(function (html) {
                    compilation.assets[_this.options.templatePath] = {
                        source: function () { return html; },
                        size: function () { return html.length; }
                    };
                    callback();
                });
            }
            else {
                callback();
            }
        });
    };
    PrerenderWebpackPlugin.prototype.decacheAppFiles = function () {
        var _this = this;
        // delete all app files from cache, but keep libs
        // this is needed so that the config file can reimport up to date
        // versions of the app files
        delete require.cache[this.options.configPath];
        Object.keys(require.cache)
            .filter(function (key) { return key.startsWith(_this.options.appPath); })
            .forEach(function (key) {
            // console.log('===', key);
            delete require.cache[key];
        });
    };
    return PrerenderWebpackPlugin;
}());
exports.PrerenderWebpackPlugin = PrerenderWebpackPlugin;
;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/utilities/prerender-webpack-plugin.js.map