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
var path = require('path');
var ts = require('typescript');
var UserError = (function (_super) {
    __extends(UserError, _super);
    function UserError(message) {
        // Errors don't use current this, instead they create a new instance.
        // We have to do forward all of our api to the nativeInstance.
        var nativeError = _super.call(this, message);
        this._nativeError = nativeError;
    }
    Object.defineProperty(UserError.prototype, "message", {
        get: function () { return this._nativeError.message; },
        set: function (message) { this._nativeError.message = message; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserError.prototype, "name", {
        get: function () { return 'UserError'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserError.prototype, "stack", {
        get: function () { return this._nativeError.stack; },
        set: function (value) { this._nativeError.stack = value; },
        enumerable: true,
        configurable: true
    });
    UserError.prototype.toString = function () { return this._nativeError.toString(); };
    return UserError;
}(Error));
exports.UserError = UserError;
var DEBUG = false;
function debug(msg) {
    var o = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        o[_i - 1] = arguments[_i];
    }
    // tslint:disable-next-line:no-console
    if (DEBUG)
        console.log.apply(console, [msg].concat(o));
}
function formatDiagnostics(diags) {
    return diags
        .map(function (d) {
        var res = ts.DiagnosticCategory[d.category];
        if (d.file) {
            res += ' at ' + d.file.fileName + ':';
            var _a = d.file.getLineAndCharacterOfPosition(d.start), line = _a.line, character = _a.character;
            res += (line + 1) + ':' + (character + 1) + ':';
        }
        res += ' ' + ts.flattenDiagnosticMessageText(d.messageText, '\n');
        return res;
    })
        .join('\n');
}
exports.formatDiagnostics = formatDiagnostics;
function check(diags) {
    if (diags && diags.length && diags[0]) {
        throw new UserError(formatDiagnostics(diags));
    }
}
exports.check = check;
function validateAngularCompilerOptions(options) {
    if (options.annotationsAs) {
        switch (options.annotationsAs) {
            case 'decorators':
            case 'static fields':
                break;
            default:
                return [{
                        file: null,
                        start: null,
                        length: null,
                        messageText: 'Angular compiler options "annotationsAs" only supports "static fields" and "decorators"',
                        category: ts.DiagnosticCategory.Error,
                        code: 0
                    }];
        }
    }
}
exports.validateAngularCompilerOptions = validateAngularCompilerOptions;
var Tsc = (function () {
    function Tsc(readFile, readDirectory) {
        if (readFile === void 0) { readFile = ts.sys.readFile; }
        if (readDirectory === void 0) { readDirectory = ts.sys.readDirectory; }
        this.readFile = readFile;
        this.readDirectory = readDirectory;
    }
    Tsc.prototype.readConfiguration = function (project, basePath) {
        this.basePath = basePath;
        // Allow a directory containing tsconfig.json as the project value
        // Note, TS@next returns an empty array, while earlier versions throw
        try {
            if (this.readDirectory(project).length > 0) {
                project = path.join(project, 'tsconfig.json');
            }
        }
        catch (e) {
        }
        var _a = ts.readConfigFile(project, this.readFile), config = _a.config, error = _a.error;
        check([error]);
        // Do not inline `host` into `parseJsonConfigFileContent` until after
        // g3 is updated to the latest TypeScript.
        // The issue is that old typescript only has `readDirectory` while
        // the newer TypeScript has additional `useCaseSensitiveFileNames` and
        // `fileExists`. Inlining will trigger an error of extra parameters.
        var host = {
            useCaseSensitiveFileNames: true,
            fileExists: fs_1.existsSync,
            readDirectory: this.readDirectory
        };
        this.parsed = ts.parseJsonConfigFileContent(config, host, basePath);
        check(this.parsed.errors);
        // Default codegen goes to the current directory
        // Parsed options are already converted to absolute paths
        this.ngOptions = config.angularCompilerOptions || {};
        this.ngOptions.genDir = path.join(basePath, this.ngOptions.genDir || '.');
        for (var _i = 0, _b = Object.keys(this.parsed.options); _i < _b.length; _i++) {
            var key = _b[_i];
            this.ngOptions[key] = this.parsed.options[key];
        }
        check(validateAngularCompilerOptions(this.ngOptions));
        return { parsed: this.parsed, ngOptions: this.ngOptions };
    };
    Tsc.prototype.typeCheck = function (compilerHost, program) {
        debug('Checking global diagnostics...');
        check(program.getGlobalDiagnostics());
        var diagnostics = [];
        debug('Type checking...');
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sf = _a[_i];
            diagnostics.push.apply(diagnostics, ts.getPreEmitDiagnostics(program, sf));
        }
        check(diagnostics);
    };
    Tsc.prototype.emit = function (program) {
        debug('Emitting outputs...');
        var emitResult = program.emit();
        var diagnostics = [];
        diagnostics.push.apply(diagnostics, emitResult.diagnostics);
        return emitResult.emitSkipped ? 1 : 0;
    };
    return Tsc;
}());
exports.Tsc = Tsc;
exports.tsc = new Tsc();
//# sourceMappingURL=tsc.js.map