"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var path_1 = require('path');
var dev = Math.floor(Math.random() * 10000);
var VirtualStats = (function () {
    function VirtualStats(_path) {
        this._path = _path;
        this._ctime = new Date();
        this._mtime = new Date();
        this._atime = new Date();
        this._btime = new Date();
        this._dev = dev;
        this._ino = Math.floor(Math.random() * 100000);
        this._mode = parseInt('777', 8); // RWX for everyone.
        this._uid = process.env['UID'] || 0;
        this._gid = process.env['GID'] || 0;
    }
    VirtualStats.prototype.isFile = function () { return false; };
    VirtualStats.prototype.isDirectory = function () { return false; };
    VirtualStats.prototype.isBlockDevice = function () { return false; };
    VirtualStats.prototype.isCharacterDevice = function () { return false; };
    VirtualStats.prototype.isSymbolicLink = function () { return false; };
    VirtualStats.prototype.isFIFO = function () { return false; };
    VirtualStats.prototype.isSocket = function () { return false; };
    Object.defineProperty(VirtualStats.prototype, "dev", {
        get: function () { return this._dev; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ino", {
        get: function () { return this._ino; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "nlink", {
        get: function () { return 1; } // Default to 1 hard link.
        ,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "uid", {
        get: function () { return this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "gid", {
        get: function () { return this._gid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "rdev", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "size", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blksize", {
        get: function () { return 512; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blocks", {
        get: function () { return Math.ceil(this.size / this.blksize); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "atime", {
        get: function () { return this._atime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mtime", {
        get: function () { return this._mtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ctime", {
        get: function () { return this._ctime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "birthtime", {
        get: function () { return this._btime; },
        enumerable: true,
        configurable: true
    });
    return VirtualStats;
}());
exports.VirtualStats = VirtualStats;
var VirtualDirStats = (function (_super) {
    __extends(VirtualDirStats, _super);
    function VirtualDirStats(_fileName) {
        _super.call(this, _fileName);
    }
    VirtualDirStats.prototype.isDirectory = function () { return true; };
    Object.defineProperty(VirtualDirStats.prototype, "size", {
        get: function () { return 1024; },
        enumerable: true,
        configurable: true
    });
    return VirtualDirStats;
}(VirtualStats));
exports.VirtualDirStats = VirtualDirStats;
var VirtualFileStats = (function (_super) {
    __extends(VirtualFileStats, _super);
    function VirtualFileStats(_fileName, _content) {
        _super.call(this, _fileName);
        this._content = _content;
    }
    Object.defineProperty(VirtualFileStats.prototype, "content", {
        get: function () { return this._content; },
        set: function (v) {
            this._content = v;
            this._mtime = new Date();
        },
        enumerable: true,
        configurable: true
    });
    VirtualFileStats.prototype.getSourceFile = function (languageVersion, setParentNodes) {
        if (!this._sourceFile) {
            this._sourceFile = ts.createSourceFile(this._path, this._content, languageVersion, setParentNodes);
        }
        return this._sourceFile;
    };
    VirtualFileStats.prototype.isFile = function () { return true; };
    Object.defineProperty(VirtualFileStats.prototype, "size", {
        get: function () { return this._content.length; },
        enumerable: true,
        configurable: true
    });
    return VirtualFileStats;
}(VirtualStats));
exports.VirtualFileStats = VirtualFileStats;
var WebpackCompilerHost = (function () {
    function WebpackCompilerHost(_options, basePath) {
        this._options = _options;
        this._files = Object.create(null);
        this._directories = Object.create(null);
        this._changed = false;
        this._setParentNodes = true;
        this._delegate = ts.createCompilerHost(this._options, this._setParentNodes);
        this._basePath = this._normalizePath(basePath);
    }
    WebpackCompilerHost.prototype._normalizePath = function (path) {
        return path.replace(/\\/g, '/');
    };
    WebpackCompilerHost.prototype._resolve = function (path) {
        path = this._normalizePath(path);
        if (path[0] == '.') {
            return path_1.join(this.getCurrentDirectory(), path);
        }
        else if (path[0] == '/' || path.match(/^\w:\//)) {
            return path;
        }
        else {
            return path_1.join(this._basePath, path);
        }
    };
    WebpackCompilerHost.prototype._setFileContent = function (fileName, content) {
        this._files[fileName] = new VirtualFileStats(fileName, content);
        var p = path_1.dirname(fileName);
        while (p && !this._directories[p]) {
            this._directories[p] = new VirtualDirStats(p);
            p = path_1.dirname(p);
        }
        this._changed = true;
    };
    WebpackCompilerHost.prototype.populateWebpackResolver = function (resolver) {
        var fs = resolver.fileSystem;
        if (!this._changed) {
            return;
        }
        var isWindows = process.platform.startsWith('win');
        for (var _i = 0, _a = Object.keys(this._files); _i < _a.length; _i++) {
            var fileName = _a[_i];
            var stats = this._files[fileName];
            // If we're on windows, we need to populate with the proper path separator.
            var path = isWindows ? fileName.replace(/\//g, '\\') : fileName;
            fs._statStorage.data[path] = [null, stats];
            fs._readFileStorage.data[path] = [null, stats.content];
        }
        for (var _b = 0, _c = Object.keys(this._directories); _b < _c.length; _b++) {
            var dirName = _c[_b];
            var stats = this._directories[dirName];
            var dirs = this.getDirectories(dirName);
            var files = this.getFiles(dirName);
            // If we're on windows, we need to populate with the proper path separator.
            var path = isWindows ? dirName.replace(/\//g, '\\') : dirName;
            fs._statStorage.data[path] = [null, stats];
            fs._readdirStorage.data[path] = [null, files.concat(dirs)];
        }
        this._changed = false;
    };
    WebpackCompilerHost.prototype.fileExists = function (fileName) {
        fileName = this._resolve(fileName);
        return fileName in this._files || this._delegate.fileExists(fileName);
    };
    WebpackCompilerHost.prototype.readFile = function (fileName) {
        fileName = this._resolve(fileName);
        return (fileName in this._files)
            ? this._files[fileName].content
            : this._delegate.readFile(fileName);
    };
    WebpackCompilerHost.prototype.directoryExists = function (directoryName) {
        directoryName = this._resolve(directoryName);
        return (directoryName in this._directories) || this._delegate.directoryExists(directoryName);
    };
    WebpackCompilerHost.prototype.getFiles = function (path) {
        path = this._resolve(path);
        return Object.keys(this._files)
            .filter(function (fileName) { return path_1.dirname(fileName) == path; })
            .map(function (path) { return path_1.basename(path); });
    };
    WebpackCompilerHost.prototype.getDirectories = function (path) {
        path = this._resolve(path);
        var subdirs = Object.keys(this._directories)
            .filter(function (fileName) { return path_1.dirname(fileName) == path; })
            .map(function (path) { return path_1.basename(path); });
        var delegated;
        try {
            delegated = this._delegate.getDirectories(path);
        }
        catch (e) {
            delegated = [];
        }
        return delegated.concat(subdirs);
    };
    WebpackCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        fileName = this._resolve(fileName);
        if (!(fileName in this._files)) {
            return this._delegate.getSourceFile(fileName, languageVersion, onError);
        }
        return this._files[fileName].getSourceFile(languageVersion, this._setParentNodes);
    };
    WebpackCompilerHost.prototype.getCancellationToken = function () {
        return this._delegate.getCancellationToken();
    };
    WebpackCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return this._delegate.getDefaultLibFileName(options);
    };
    Object.defineProperty(WebpackCompilerHost.prototype, "writeFile", {
        // This is due to typescript CompilerHost interface being weird on writeFile. This shuts down
        // typings in WebStorm.
        get: function () {
            var _this = this;
            return function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                fileName = _this._resolve(fileName);
                _this._setFileContent(fileName, data);
            };
        },
        enumerable: true,
        configurable: true
    });
    WebpackCompilerHost.prototype.getCurrentDirectory = function () {
        return this._basePath !== null ? this._basePath : this._delegate.getCurrentDirectory();
    };
    WebpackCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        fileName = this._resolve(fileName);
        return this._delegate.getCanonicalFileName(fileName);
    };
    WebpackCompilerHost.prototype.useCaseSensitiveFileNames = function () {
        return this._delegate.useCaseSensitiveFileNames();
    };
    WebpackCompilerHost.prototype.getNewLine = function () {
        return this._delegate.getNewLine();
    };
    return WebpackCompilerHost;
}());
exports.WebpackCompilerHost = WebpackCompilerHost;
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/@ngtools/webpack/src/compiler_host.js.map