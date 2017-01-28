"use strict";
var fs_1 = require('fs');
var vm = require('vm');
var path = require('path');
var NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
var NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
var LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var WebpackResourceLoader = (function () {
    function WebpackResourceLoader(_parentCompilation) {
        this._parentCompilation = _parentCompilation;
        this._uniqueId = 0;
        this._context = _parentCompilation.context;
    }
    WebpackResourceLoader.prototype._compile = function (filePath, content) {
        var _this = this;
        var compilerName = "compiler(" + this._uniqueId++ + ")";
        var outputOptions = { filename: filePath };
        var relativePath = path.relative(this._context || '', filePath);
        var childCompiler = this._parentCompilation.createChildCompiler(relativePath, outputOptions);
        childCompiler.context = this._context;
        childCompiler.apply(new NodeTemplatePlugin(outputOptions), new NodeTargetPlugin(), new SingleEntryPlugin(this._context, filePath), new LoaderTargetPlugin('node'));
        // Store the result of the parent compilation before we start the child compilation
        var assetsBeforeCompilation = Object.assign({}, this._parentCompilation.assets[outputOptions.filename]);
        // Fix for "Uncaught TypeError: __webpack_require__(...) is not a function"
        // Hot module replacement requires that every child compiler has its own
        // cache. @see https://github.com/ampedandwired/html-webpack-plugin/pull/179
        childCompiler.plugin('compilation', function (compilation) {
            if (compilation.cache) {
                if (!compilation.cache[compilerName]) {
                    compilation.cache[compilerName] = {};
                }
                compilation.cache = compilation.cache[compilerName];
            }
        });
        // Compile and return a promise
        return new Promise(function (resolve, reject) {
            childCompiler.runAsChild(function (err, entries, childCompilation) {
                // Resolve / reject the promise
                if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
                    var errorDetails = childCompilation.errors.map(function (error) {
                        return error.message + (error.error ? ':\n' + error.error : '');
                    }).join('\n');
                    reject(new Error('Child compilation failed:\n' + errorDetails));
                }
                else if (err) {
                    reject(err);
                }
                else {
                    // Replace [hash] placeholders in filename
                    var outputName = _this._parentCompilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
                        hash: childCompilation.hash,
                        chunk: entries[0]
                    });
                    // Restore the parent compilation to the state like it was before the child compilation.
                    _this._parentCompilation.assets[outputName] = assetsBeforeCompilation[outputName];
                    if (assetsBeforeCompilation[outputName] === undefined) {
                        // If it wasn't there - delete it.
                        delete _this._parentCompilation.assets[outputName];
                    }
                    resolve({
                        // Hash of the template entry point.
                        hash: entries[0].hash,
                        // Output name.
                        outputName: outputName,
                        // Compiled code.
                        content: childCompilation.assets[outputName].source()
                    });
                }
            });
        });
    };
    WebpackResourceLoader.prototype._evaluate = function (fileName, source) {
        try {
            var vmContext = vm.createContext(Object.assign({ require: require }, global));
            var vmScript = new vm.Script(source, { filename: fileName });
            // Evaluate code and cast to string
            var newSource = void 0;
            newSource = vmScript.runInContext(vmContext);
            if (typeof newSource == 'string') {
                return Promise.resolve(newSource);
            }
            return Promise.reject('The loader "' + fileName + '" didn\'t return a string.');
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    WebpackResourceLoader.prototype.get = function (filePath) {
        var _this = this;
        return this._compile(filePath, fs_1.readFileSync(filePath, 'utf8'))
            .then(function (result) { return _this._evaluate(result.outputName, result.content); });
    };
    return WebpackResourceLoader;
}());
exports.WebpackResourceLoader = WebpackResourceLoader;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@ngtools/webpack/src/resource_loader.js.map