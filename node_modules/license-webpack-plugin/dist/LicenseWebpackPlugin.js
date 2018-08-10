"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var ejs = require("ejs");
var webpack_sources_1 = require("webpack-sources");
var LicenseWebpackPluginError_1 = require("./LicenseWebpackPluginError");
var ErrorMessage_1 = require("./ErrorMessage");
var FileUtils_1 = require("./FileUtils");
var ModuleProcessor_1 = require("./ModuleProcessor");
var LicenseWebpackPlugin = (function () {
    function LicenseWebpackPlugin(options) {
        this.errors = [];
        if (!options || !options.pattern || !(options.pattern instanceof RegExp)) {
            throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.NO_PATTERN);
        }
        if (options.unacceptablePattern !== undefined &&
            options.unacceptablePattern !== null &&
            !(options.unacceptablePattern instanceof RegExp)) {
            throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.UNACCEPTABLE_PATTERN_NOT_REGEX);
        }
        if (options.modulesDirectories !== undefined &&
            options.modulesDirectories !== null &&
            (!Array.isArray(options.modulesDirectories) ||
                options.modulesDirectories.length === 0)) {
            throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.INVALID_MODULES_DIRECTORIES);
        }
        this.options = __assign({
            licenseFilenames: [
                'LICENSE',
                'LICENSE.md',
                'LICENSE.txt',
                'license',
                'license.md',
                'license.txt',
                'LICENCE',
                'LICENCE.md',
                'LICENCE.txt',
                'licence',
                'licence.md',
                'licence.txt'
            ],
            perChunkOutput: true,
            outputTemplate: path.resolve(__dirname, '../output.template.ejs'),
            outputFilename: options.perChunkOutput === false
                ? 'licenses.txt'
                : '[name].licenses.txt',
            suppressErrors: false,
            includePackagesWithoutLicense: false,
            abortOnUnacceptableLicense: false,
            addBanner: false,
            bannerTemplate: '/*! 3rd party license information is available at <%- filename %> */',
            includedChunks: [],
            excludedChunks: [],
            additionalPackages: [],
            modulesDirectories: ['node_modules']
        }, options);
        if (!FileUtils_1.FileUtils.isThere(this.options.outputTemplate)) {
            throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.OUTPUT_TEMPLATE_NOT_EXIST, this.options.outputTemplate);
        }
        var templateString = fs.readFileSync(this.options.outputTemplate, 'utf8');
        this.template = ejs.compile(templateString);
    }
    LicenseWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (this.options.buildRoot && !FileUtils_1.FileUtils.isThere(this.options.buildRoot)) {
            throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.BUILD_ROOT_NOT_EXIST, this.options.buildRoot);
        }
        this.buildRoot =
            this.options.buildRoot || this.findBuildRoot(compiler.context);
        this.moduleProcessor = new ModuleProcessor_1.ModuleProcessor(this.buildRoot, this.options, this.errors);
        var emitCallback = function (compilation, callback) {
            var totalChunkModuleMap = {};
            compilation.chunks.forEach(function (chunk) {
                if (_this.options.excludedChunks.indexOf(chunk.name) > -1) {
                    return;
                }
                if (_this.options.includedChunks.length > 0 &&
                    _this.options.includedChunks.indexOf(chunk.name) === -1) {
                    return;
                }
                var outputPath = compilation.getPath(_this.options.outputFilename, _this.options.perChunkOutput
                    ? {
                        chunk: chunk
                    }
                    : compilation);
                var chunkModuleMap = {};
                var fileCallback = function (filename) {
                    var packageName = _this.moduleProcessor.processFile(filename);
                    if (packageName) {
                        chunkModuleMap[packageName] = true;
                        totalChunkModuleMap[packageName] = true;
                    }
                };
                var moduleCallback = function (chunkModule) {
                    fileCallback(chunkModule.resource ||
                        (chunkModule.rootModule && chunkModule.rootModule.resource));
                    if (Array.isArray(chunkModule.fileDependencies)) {
                        var fileDependencies = chunkModule.fileDependencies;
                        fileDependencies.forEach(fileCallback);
                    }
                };
                // scan all files used in compilation for this chunk
                if (typeof chunk.modulesIterable !== 'undefined') {
                    try {
                        for (var _a = __values(chunk.modulesIterable), _b = _a.next(); !_b.done; _b = _a.next()) {
                            var module_1 = _b.value;
                            moduleCallback(module_1);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else if (typeof chunk.forEachModule === 'function') {
                    // chunk.forEachModule was deprecated in webpack v4
                    chunk.forEachModule(moduleCallback);
                }
                else {
                    chunk.modules.forEach(moduleCallback); // chunk.modules was deprecated in webpack v3
                }
                _this.options.additionalPackages.forEach(function (packageName) {
                    _this.moduleProcessor.processExternalPackage(packageName);
                    chunkModuleMap[packageName] = true;
                    totalChunkModuleMap[packageName] = true;
                });
                var renderedFile = _this.renderLicenseFile(Object.keys(chunkModuleMap));
                // Only write license file if there is something to write.
                if (renderedFile.trim() !== '') {
                    if (_this.options.addBanner) {
                        chunk.files
                            .filter(function (file) { return /\.js$/.test(file); })
                            .forEach(function (file) {
                            compilation.assets[file] = new webpack_sources_1.ConcatSource(ejs.render(_this.options.bannerTemplate, {
                                filename: outputPath,
                                licenseInfo: renderedFile.replace(/\*\//g, '') // remove premature comment endings
                            }), '\n', compilation.assets[file]);
                        });
                    }
                    if (_this.options.perChunkOutput) {
                        compilation.assets[outputPath] = new webpack_sources_1.RawSource(renderedFile);
                    }
                }
                var e_1, _c;
            });
            if (!_this.options.perChunkOutput) {
                // produce master licenses file
                var outputPath = compilation.getPath(_this.options.outputFilename, compilation);
                var renderedFile = _this.renderLicenseFile(Object.keys(totalChunkModuleMap));
                if (renderedFile.trim() !== '') {
                    compilation.assets[outputPath] = new webpack_sources_1.RawSource(renderedFile);
                }
            }
            if (!_this.options.suppressErrors) {
                _this.errors.forEach(function (error) { return console.error(error.message); });
            }
            callback();
        };
        if (typeof compiler.hooks !== 'undefined') {
            compiler.hooks.emit.tapAsync('LicenseWebpackPlugin', emitCallback);
        }
        else {
            compiler.plugin('emit', emitCallback);
        }
    };
    LicenseWebpackPlugin.prototype.renderLicenseFile = function (packageNames) {
        var packages = packageNames.map(this.moduleProcessor.getPackageInfo, this.moduleProcessor);
        return this.template({ packages: packages });
    };
    LicenseWebpackPlugin.prototype.findBuildRoot = function (context) {
        var buildRoot = context;
        var lastPathSepIndex;
        if (buildRoot.indexOf(FileUtils_1.FileUtils.NODE_MODULES) > -1) {
            buildRoot = buildRoot.substring(0, buildRoot.indexOf(FileUtils_1.FileUtils.NODE_MODULES) - 1);
        }
        else {
            var oldBuildRoot = null;
            while (!FileUtils_1.FileUtils.isThere(path.join(buildRoot, FileUtils_1.FileUtils.NODE_MODULES))) {
                lastPathSepIndex = buildRoot.lastIndexOf(path.sep);
                if (lastPathSepIndex === -1 || oldBuildRoot === buildRoot) {
                    throw new LicenseWebpackPluginError_1.LicenseWebpackPluginError(ErrorMessage_1.ErrorMessage.NO_PROJECT_ROOT);
                }
                oldBuildRoot = buildRoot;
                buildRoot = buildRoot.substring(0, buildRoot.lastIndexOf(path.sep));
            }
        }
        return buildRoot;
    };
    return LicenseWebpackPlugin;
}());
exports.LicenseWebpackPlugin = LicenseWebpackPlugin;
