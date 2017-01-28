/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs_1 = require('fs');
var tsickle = require('tsickle');
var ts = require('typescript');
var collector_1 = require('./collector');
function formatDiagnostics(d) {
    var host = {
        getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
        getNewLine: function () { return ts.sys.newLine; },
        getCanonicalFileName: function (f) { return f; }
    };
    return ts.formatDiagnostics(d, host);
}
exports.formatDiagnostics = formatDiagnostics;
/**
 * Implementation of CompilerHost that forwards all methods to another instance.
 * Useful for partial implementations to override only methods they care about.
 */
var DelegatingHost = (function () {
    function DelegatingHost(delegate) {
        var _this = this;
        this.delegate = delegate;
        this.getSourceFile = function (fileName, languageVersion, onError) {
            return _this.delegate.getSourceFile(fileName, languageVersion, onError);
        };
        this.getCancellationToken = function () { return _this.delegate.getCancellationToken(); };
        this.getDefaultLibFileName = function (options) {
            return _this.delegate.getDefaultLibFileName(options);
        };
        this.getDefaultLibLocation = function () { return _this.delegate.getDefaultLibLocation(); };
        this.writeFile = this.delegate.writeFile;
        this.getCurrentDirectory = function () { return _this.delegate.getCurrentDirectory(); };
        this.getDirectories = function (path) {
            return _this.delegate.getDirectories ? _this.delegate.getDirectories(path) : [];
        };
        this.getCanonicalFileName = function (fileName) { return _this.delegate.getCanonicalFileName(fileName); };
        this.useCaseSensitiveFileNames = function () { return _this.delegate.useCaseSensitiveFileNames(); };
        this.getNewLine = function () { return _this.delegate.getNewLine(); };
        this.fileExists = function (fileName) { return _this.delegate.fileExists(fileName); };
        this.readFile = function (fileName) { return _this.delegate.readFile(fileName); };
        this.trace = function (s) { return _this.delegate.trace(s); };
        this.directoryExists = function (directoryName) { return _this.delegate.directoryExists(directoryName); };
    }
    return DelegatingHost;
}());
exports.DelegatingHost = DelegatingHost;
var DecoratorDownlevelCompilerHost = (function (_super) {
    __extends(DecoratorDownlevelCompilerHost, _super);
    function DecoratorDownlevelCompilerHost(delegate, program) {
        var _this = this;
        _super.call(this, delegate);
        this.program = program;
        this.ANNOTATION_SUPPORT = "\ninterface DecoratorInvocation {\n  type: Function;\n  args?: any[];\n}\n";
        /** Error messages produced by tsickle, if any. */
        this.diagnostics = [];
        this.getSourceFile = function (fileName, languageVersion, onError) {
            var originalContent = _this.delegate.readFile(fileName);
            var newContent = originalContent;
            if (!/\.d\.ts$/.test(fileName)) {
                try {
                    var converted = tsickle.convertDecorators(_this.program.getTypeChecker(), _this.program.getSourceFile(fileName));
                    if (converted.diagnostics) {
                        (_a = _this.diagnostics).push.apply(_a, converted.diagnostics);
                    }
                    newContent = converted.output + _this.ANNOTATION_SUPPORT;
                }
                catch (e) {
                    console.error('Cannot convertDecorators on file', fileName);
                    throw e;
                }
            }
            return ts.createSourceFile(fileName, newContent, languageVersion, true);
            var _a;
        };
    }
    return DecoratorDownlevelCompilerHost;
}(DelegatingHost));
exports.DecoratorDownlevelCompilerHost = DecoratorDownlevelCompilerHost;
var TsickleCompilerHost = (function (_super) {
    __extends(TsickleCompilerHost, _super);
    function TsickleCompilerHost(delegate, oldProgram, options) {
        var _this = this;
        _super.call(this, delegate);
        this.oldProgram = oldProgram;
        this.options = options;
        /** Error messages produced by tsickle, if any. */
        this.diagnostics = [];
        this.getSourceFile = function (fileName, languageVersion, onError) {
            var sourceFile = _this.oldProgram.getSourceFile(fileName);
            var isDefinitions = /\.d\.ts$/.test(fileName);
            // Don't tsickle-process any d.ts that isn't a compilation target;
            // this means we don't process e.g. lib.d.ts.
            if (isDefinitions)
                return sourceFile;
            var _a = tsickle.annotate(_this.oldProgram, sourceFile, { untyped: true }), output = _a.output, externs = _a.externs, diagnostics = _a.diagnostics;
            _this.diagnostics = diagnostics;
            return ts.createSourceFile(fileName, output, languageVersion, true);
        };
    }
    return TsickleCompilerHost;
}(DelegatingHost));
exports.TsickleCompilerHost = TsickleCompilerHost;
var IGNORED_FILES = /\.ngfactory\.js$|\.ngstyle\.js$/;
var MetadataWriterHost = (function (_super) {
    __extends(MetadataWriterHost, _super);
    function MetadataWriterHost(delegate, ngOptions) {
        var _this = this;
        _super.call(this, delegate);
        this.ngOptions = ngOptions;
        this.metadataCollector = new collector_1.MetadataCollector({ quotedNames: true });
        this.metadataCollector1 = new collector_1.MetadataCollector({ version: 1 });
        this.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            if (/\.d\.ts$/.test(fileName)) {
                // Let the original file be written first; this takes care of creating parent directories
                _this.delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
                // TODO: remove this early return after https://github.com/Microsoft/TypeScript/pull/8412
                // is
                // released
                return;
            }
            if (IGNORED_FILES.test(fileName)) {
                return;
            }
            if (!sourceFiles) {
                throw new Error('Metadata emit requires the sourceFiles are passed to WriteFileCallback. ' +
                    'Update to TypeScript ^1.9.0-dev');
            }
            if (sourceFiles.length > 1) {
                throw new Error('Bundled emit with --out is not supported');
            }
            _this.writeMetadata(fileName, sourceFiles[0]);
        };
    }
    MetadataWriterHost.prototype.writeMetadata = function (emitFilePath, sourceFile) {
        // TODO: replace with DTS filePath when https://github.com/Microsoft/TypeScript/pull/8412 is
        // released
        if (/\.js$/.test(emitFilePath)) {
            var path_1 = emitFilePath.replace(/*DTS*/ /\.js$/, '.metadata.json');
            var metadata = this.metadataCollector.getMetadata(sourceFile, !!this.ngOptions.strictMetadataEmit);
            var metadata1 = this.metadataCollector1.getMetadata(sourceFile, false);
            var metadatas = [metadata, metadata1].filter(function (e) { return !!e; });
            if (metadatas.length) {
                var metadataText = JSON.stringify(metadatas);
                fs_1.writeFileSync(path_1, metadataText, { encoding: 'utf-8' });
            }
        }
    };
    return MetadataWriterHost;
}(DelegatingHost));
exports.MetadataWriterHost = MetadataWriterHost;
//# sourceMappingURL=compiler_host.js.map