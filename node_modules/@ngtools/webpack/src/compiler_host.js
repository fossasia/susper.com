"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const path_1 = require("path");
const dev = Math.floor(Math.random() * 10000);
class VirtualStats {
    constructor(_path) {
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
    isFile() { return false; }
    isDirectory() { return false; }
    isBlockDevice() { return false; }
    isCharacterDevice() { return false; }
    isSymbolicLink() { return false; }
    isFIFO() { return false; }
    isSocket() { return false; }
    get dev() { return this._dev; }
    get ino() { return this._ino; }
    get mode() { return this._mode; }
    get nlink() { return 1; } // Default to 1 hard link.
    get uid() { return this._uid; }
    get gid() { return this._gid; }
    get rdev() { return 0; }
    get size() { return 0; }
    get blksize() { return 512; }
    get blocks() { return Math.ceil(this.size / this.blksize); }
    get atime() { return this._atime; }
    get mtime() { return this._mtime; }
    get ctime() { return this._ctime; }
    get birthtime() { return this._btime; }
}
exports.VirtualStats = VirtualStats;
class VirtualDirStats extends VirtualStats {
    constructor(_fileName) {
        super(_fileName);
    }
    isDirectory() { return true; }
    get size() { return 1024; }
}
exports.VirtualDirStats = VirtualDirStats;
class VirtualFileStats extends VirtualStats {
    constructor(_fileName, _content) {
        super(_fileName);
        this._content = _content;
    }
    get content() { return this._content; }
    set content(v) {
        this._content = v;
        this._mtime = new Date();
        this._sourceFile = null;
    }
    setSourceFile(sourceFile) {
        this._sourceFile = sourceFile;
    }
    getSourceFile(languageVersion, setParentNodes) {
        if (!this._sourceFile) {
            this._sourceFile = ts.createSourceFile(this._path, this._content, languageVersion, setParentNodes);
        }
        return this._sourceFile;
    }
    isFile() { return true; }
    get size() { return this._content.length; }
}
exports.VirtualFileStats = VirtualFileStats;
class WebpackCompilerHost {
    constructor(_options, basePath) {
        this._options = _options;
        this._files = Object.create(null);
        this._directories = Object.create(null);
        this._changedFiles = Object.create(null);
        this._changedDirs = Object.create(null);
        this._cache = false;
        this._setParentNodes = true;
        this._delegate = ts.createCompilerHost(this._options, this._setParentNodes);
        this._basePath = this._normalizePath(basePath);
    }
    _normalizePath(path) {
        return path.replace(/\\/g, '/');
    }
    _resolve(path) {
        path = this._normalizePath(path);
        if (path[0] == '.') {
            return this._normalizePath(path_1.join(this.getCurrentDirectory(), path));
        }
        else if (path[0] == '/' || path.match(/^\w:\//)) {
            return path;
        }
        else {
            return this._normalizePath(path_1.join(this._basePath, path));
        }
    }
    _setFileContent(fileName, content) {
        this._files[fileName] = new VirtualFileStats(fileName, content);
        let p = path_1.dirname(fileName);
        while (p && !this._directories[p]) {
            this._directories[p] = new VirtualDirStats(p);
            this._changedDirs[p] = true;
            p = path_1.dirname(p);
        }
        this._changedFiles[fileName] = true;
    }
    get dirty() {
        return Object.keys(this._changedFiles).length > 0;
    }
    enableCaching() {
        this._cache = true;
    }
    populateWebpackResolver(resolver) {
        const fs = resolver.fileSystem;
        if (!this.dirty) {
            return;
        }
        /**
         * storageDataSetter is a temporary hack to address these two issues:
         * - https://github.com/angular/angular-cli/issues/7113
         * - https://github.com/angular/angular-cli/issues/7136
         *
         * This way we set values correctly in both a Map (enhanced-resove>=3.4.0) and
         * object (enhanced-resolve >= 3.1.0 <3.4.0).
         *
         * The right solution is to create a virtual filesystem by decorating the filesystem,
         * instead of injecting data into the private cache of the filesystem.
         *
         * Doing it the right way should fix other related bugs, but meanwhile we hack it since:
         * - it's affecting a lot of users.
         * - the real solution is non-trivial.
         */
        function storageDataSetter(data, k, v) {
            if (data instanceof Map) {
                data.set(k, v);
            }
            else {
                data[k] = v;
            }
        }
        const isWindows = process.platform.startsWith('win');
        for (const fileName of this.getChangedFilePaths()) {
            const stats = this._files[fileName];
            if (stats) {
                // If we're on windows, we need to populate with the proper path separator.
                const path = isWindows ? fileName.replace(/\//g, '\\') : fileName;
                // fs._statStorage.data[path] = [null, stats];
                // fs._readFileStorage.data[path] = [null, stats.content];
                storageDataSetter(fs._statStorage.data, path, [null, stats]);
                storageDataSetter(fs._readFileStorage.data, path, [null, stats.content]);
            }
            else {
                // Support removing files as well.
                const path = isWindows ? fileName.replace(/\//g, '\\') : fileName;
                // fs._statStorage.data[path] = [new Error(), null];
                // fs._readFileStorage.data[path] = [new Error(), null];
                storageDataSetter(fs._statStorage.data, path, [new Error(), null]);
                storageDataSetter(fs._readFileStorage.data, path, [new Error(), null]);
            }
        }
        for (const dirName of Object.keys(this._changedDirs)) {
            const stats = this._directories[dirName];
            const dirs = this.getDirectories(dirName);
            const files = this.getFiles(dirName);
            // If we're on windows, we need to populate with the proper path separator.
            const path = isWindows ? dirName.replace(/\//g, '\\') : dirName;
            // fs._statStorage.data[path] = [null, stats];
            // fs._readdirStorage.data[path] = [null, files.concat(dirs)];
            storageDataSetter(fs._statStorage.data, path, [null, stats]);
            storageDataSetter(fs._readFileStorage.data, path, [null, files.concat(dirs)]);
        }
    }
    resetChangedFileTracker() {
        this._changedFiles = Object.create(null);
        this._changedDirs = Object.create(null);
    }
    getChangedFilePaths() {
        return Object.keys(this._changedFiles);
    }
    invalidate(fileName) {
        fileName = this._resolve(fileName);
        if (fileName in this._files) {
            this._files[fileName] = null;
            this._changedFiles[fileName] = true;
        }
    }
    fileExists(fileName) {
        fileName = this._resolve(fileName);
        return this._files[fileName] != null || this._delegate.fileExists(fileName);
    }
    readFile(fileName) {
        fileName = this._resolve(fileName);
        if (this._files[fileName] == null) {
            const result = this._delegate.readFile(fileName);
            if (result !== undefined && this._cache) {
                this._setFileContent(fileName, result);
                return result;
            }
            else {
                return result;
            }
        }
        return this._files[fileName].content;
    }
    directoryExists(directoryName) {
        directoryName = this._resolve(directoryName);
        return (this._directories[directoryName] != null)
            || this._delegate.directoryExists(directoryName);
    }
    getFiles(path) {
        path = this._resolve(path);
        return Object.keys(this._files)
            .filter(fileName => path_1.dirname(fileName) == path)
            .map(path => path_1.basename(path));
    }
    getDirectories(path) {
        path = this._resolve(path);
        const subdirs = Object.keys(this._directories)
            .filter(fileName => path_1.dirname(fileName) == path)
            .map(path => path_1.basename(path));
        let delegated;
        try {
            delegated = this._delegate.getDirectories(path);
        }
        catch (e) {
            delegated = [];
        }
        return delegated.concat(subdirs);
    }
    getSourceFile(fileName, languageVersion, _onError) {
        fileName = this._resolve(fileName);
        if (this._files[fileName] == null) {
            const content = this.readFile(fileName);
            if (!this._cache) {
                return ts.createSourceFile(fileName, content, languageVersion, this._setParentNodes);
            }
        }
        return this._files[fileName].getSourceFile(languageVersion, this._setParentNodes);
    }
    getCancellationToken() {
        return this._delegate.getCancellationToken();
    }
    getDefaultLibFileName(options) {
        return this._delegate.getDefaultLibFileName(options);
    }
    // This is due to typescript CompilerHost interface being weird on writeFile. This shuts down
    // typings in WebStorm.
    get writeFile() {
        return (fileName, data, _writeByteOrderMark, _onError, _sourceFiles) => {
            fileName = this._resolve(fileName);
            this._setFileContent(fileName, data);
        };
    }
    getCurrentDirectory() {
        return this._basePath !== null ? this._basePath : this._delegate.getCurrentDirectory();
    }
    getCanonicalFileName(fileName) {
        fileName = this._resolve(fileName);
        return this._delegate.getCanonicalFileName(fileName);
    }
    useCaseSensitiveFileNames() {
        return this._delegate.useCaseSensitiveFileNames();
    }
    getNewLine() {
        return this._delegate.getNewLine();
    }
}
exports.WebpackCompilerHost = WebpackCompilerHost;
//# sourceMappingURL=/users/hansl/sources/angular-cli/src/compiler_host.js.map