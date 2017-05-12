// replace with the real thing when PR is merged
// https://github.com/angular/universal/pull/464
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrerenderWebpackPlugin {
    constructor(options) {
        this.options = options;
        // maintain your platform instance
        this.bootloader = require(this.options.configPath).getBootloader();
    }
    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            if (compilation.assets.hasOwnProperty(this.options.templatePath)) {
                // we need to cache the template file to be able to re-serialize it
                // even when it is not being emitted
                this.cachedTemplate = compilation.assets[this.options.templatePath].source();
            }
            if (this.cachedTemplate) {
                this.decacheAppFiles();
                require(this.options.configPath).serialize(this.bootloader, this.cachedTemplate)
                    .then((html) => {
                    compilation.assets[this.options.templatePath] = {
                        source: () => html,
                        size: () => html.length
                    };
                    callback();
                });
            }
            else {
                callback();
            }
        });
    }
    decacheAppFiles() {
        // delete all app files from cache, but keep libs
        // this is needed so that the config file can reimport up to date
        // versions of the app files
        delete require.cache[this.options.configPath];
        Object.keys(require.cache)
            .filter(key => key.startsWith(this.options.appPath))
            .forEach(function (key) {
            // console.log('===', key);
            delete require.cache[key];
        });
    }
}
exports.PrerenderWebpackPlugin = PrerenderWebpackPlugin;
;
//# sourceMappingURL=/users/hansl/sources/angular-cli/utilities/prerender-webpack-plugin.js.map