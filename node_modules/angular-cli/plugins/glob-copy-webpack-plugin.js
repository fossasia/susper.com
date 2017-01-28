"use strict";
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var denodeify = require('denodeify');
var globPromise = denodeify(glob);
var statPromise = denodeify(fs.stat);
var GlobCopyWebpackPlugin = (function () {
    function GlobCopyWebpackPlugin(options) {
        this.options = options;
    }
    GlobCopyWebpackPlugin.prototype.apply = function (compiler) {
        var _a = this.options, patterns = _a.patterns, globOptions = _a.globOptions;
        var context = globOptions.cwd || compiler.options.context;
        // convert dir patterns to globs
        patterns = patterns.map(function (pattern) { return fs.statSync(path.resolve(context, pattern)).isDirectory()
            ? pattern += '/**/*'
            : pattern; });
        // force nodir option, since we can't add dirs to assets
        globOptions.nodir = true;
        compiler.plugin('emit', function (compilation, cb) {
            var globs = patterns.map(function (pattern) { return globPromise(pattern, globOptions); });
            var addAsset = function (relPath) { return compilation.assets[relPath]
                ? Promise.resolve()
                : statPromise(path.resolve(context, relPath))
                    .then(function (stat) { return compilation.assets[relPath] = {
                    size: function () { return stat.size; },
                    source: function () { return fs.readFileSync(path.resolve(context, relPath)); }
                }; }); };
            Promise.all(globs)
                .then(function (globResults) { return [].concat.apply([], globResults); })
                .then(function (relPaths) { return relPaths.forEach(function (relPath) { return addAsset(relPath); }); })
                .catch(function (err) { return compilation.errors.push(err); })
                .then(cb);
        });
    };
    return GlobCopyWebpackPlugin;
}());
exports.GlobCopyWebpackPlugin = GlobCopyWebpackPlugin;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/plugins/glob-copy-webpack-plugin.js.map