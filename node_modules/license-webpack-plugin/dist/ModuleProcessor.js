"use strict";
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
var LicenseExtractor_1 = require("./LicenseExtractor");
var FileUtils_1 = require("./FileUtils");
var ModuleProcessor = (function () {
    function ModuleProcessor(context, options, errors) {
        var _this = this;
        this.context = context;
        this.options = options;
        this.errors = errors;
        this.modulePrefixes = options.modulesDirectories.map(function (dir) {
            return path.join(_this.context, dir);
        });
        this.licenseExtractor = new LicenseExtractor_1.LicenseExtractor(this.options, this.errors);
    }
    ModuleProcessor.prototype.processFile = function (filename) {
        if (!filename || filename.trim() === '') {
            return null;
        }
        var modulePrefix = this.findModulePrefix(filename);
        if (!this.isFromModuleDirectory(filename, modulePrefix)) {
            return null;
        }
        var packageName = this.extractPackageName(filename, modulePrefix);
        return this.processPackage(packageName, modulePrefix);
    };
    ModuleProcessor.prototype.processPackage = function (packageName, modulePrefix) {
        var isParsed = this.licenseExtractor.parsePackage(packageName, modulePrefix);
        return isParsed ? packageName : null;
    };
    ModuleProcessor.prototype.processExternalPackage = function (packageName) {
        var modulePrefix = null;
        try {
            for (var _a = __values(this.modulePrefixes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var currentModulePrefix = _b.value;
                if (FileUtils_1.FileUtils.isThere(path.join(currentModulePrefix, packageName))) {
                    modulePrefix = currentModulePrefix;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var isParsed = this.licenseExtractor.parsePackage(packageName, modulePrefix);
        return isParsed ? packageName : null;
        var e_1, _c;
    };
    ModuleProcessor.prototype.getPackageInfo = function (packageName) {
        return this.licenseExtractor.getCachedPackage(packageName);
    };
    ModuleProcessor.prototype.extractPackageName = function (filename, modulePrefix) {
        var tokens = filename
            .replace(modulePrefix + path.sep, '')
            .split(path.sep);
        return tokens[0].charAt(0) === '@'
            ? tokens.slice(0, 2).join('/')
            : tokens[0];
    };
    ModuleProcessor.prototype.isFromModuleDirectory = function (filename, modulePrefix) {
        var isPackageFile = false;
        if (modulePrefix) {
            // files like /path/to/node_modules/a.js do not count since they don't belong to any package
            isPackageFile =
                filename.replace(modulePrefix + path.sep, '').indexOf(path.sep) > -1;
        }
        return !!filename && !!modulePrefix && isPackageFile;
    };
    ModuleProcessor.prototype.findModulePrefix = function (filename) {
        try {
            for (var _a = __values(this.modulePrefixes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var modulePrefix = _b.value;
                if (filename.startsWith(modulePrefix)) {
                    return modulePrefix;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
        var e_2, _c;
    };
    return ModuleProcessor;
}());
exports.ModuleProcessor = ModuleProcessor;
