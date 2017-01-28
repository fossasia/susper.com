"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path_1 = require('path');
var fs_1 = require('fs');
var os_1 = require('os');
var sourceMapSupport = require('source-map-support');
var extend = require('xtend');
var arrify = require('arrify');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var make_error_1 = require('make-error');
var tsconfig_1 = require('tsconfig');
var pkg = require('../package.json');
var oldHandlers = {};
exports.VERSION = pkg.version;
var DEFAULT_OPTIONS = {
    getFile: getFile,
    getVersion: getVersion,
    fileExists: fileExists,
    cache: process.env.TS_NODE_CACHE,
    cacheDirectory: process.env.TS_NODE_CACHE_DIRECTORY || path_1.join(os_1.tmpdir(), 'ts-node'),
    disableWarnings: process.env.TS_NODE_DISABLE_WARNINGS,
    compiler: process.env.TS_NODE_COMPILER,
    project: process.env.TS_NODE_PROJECT,
    ignoreWarnings: process.env.TS_NODE_IGNORE_WARNINGS,
    fast: process.env.TS_NODE_FAST
};
function register(opts) {
    var options = extend(DEFAULT_OPTIONS, opts);
    var result;
    options.compiler = options.compiler || 'typescript';
    options.ignoreWarnings = arrify(options.ignoreWarnings).map(Number);
    options.compilerOptions = typeof options.compilerOptions === 'string' ?
        JSON.parse(options.compilerOptions) :
        options.compilerOptions;
    function load() {
        var project = { version: 0, files: {}, versions: {}, maps: {} };
        sourceMapSupport.install({
            environment: 'node',
            retrieveSourceMap: function (fileName) {
                if (project.maps[fileName]) {
                    return {
                        url: project.maps[fileName],
                        map: options.getFile(project.maps[fileName])
                    };
                }
            }
        });
        var cwd = process.cwd();
        var ts = require(options.compiler);
        var config = readConfig(options, cwd, ts);
        var configDiagnostics = formatDiagnostics(config.errors, options, cwd, ts);
        var cachedir = path_1.join(path_1.resolve(cwd, options.cacheDirectory), getCompilerDigest(ts, options, config));
        mkdirp.sync(cachedir);
        if (configDiagnostics.length) {
            throw new TSError(configDiagnostics);
        }
        if (config.options.allowJs) {
            registerExtension('.js');
        }
        for (var _i = 0, _a = config.fileNames; _i < _a.length; _i++) {
            var fileName = _a[_i];
            project.files[fileName] = true;
        }
        var getOutput = function (fileName, contents) {
            var result = ts.transpileModule(contents, {
                fileName: fileName,
                compilerOptions: config.options,
                reportDiagnostics: true
            });
            var diagnosticList = result.diagnostics ?
                formatDiagnostics(result.diagnostics, options, cwd, ts) :
                [];
            if (diagnosticList.length) {
                throw new TSError(diagnosticList);
            }
            return [result.outputText, result.sourceMapText];
        };
        var compile = readThrough(cachedir, options, project, getOutput);
        var getTypeInfo = function (fileName, position) {
            throw new TypeError("No type information available under \"--fast\" mode");
        };
        if (!options.fast) {
            var serviceHost = {
                getScriptFileNames: function () { return Object.keys(project.files); },
                getProjectVersion: function () { return String(project.version); },
                getScriptVersion: function (fileName) { return versionFile_1(fileName); },
                getScriptSnapshot: function (fileName) {
                    if (!options.fileExists(fileName)) {
                        return undefined;
                    }
                    return ts.ScriptSnapshot.fromString(options.getFile(fileName));
                },
                getDirectories: getDirectories,
                directoryExists: directoryExists,
                getNewLine: function () { return os_1.EOL; },
                getCurrentDirectory: function () { return cwd; },
                getCompilationSettings: function () { return config.options; },
                getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(config.options); }
            };
            var service_1 = ts.createLanguageService(serviceHost);
            var addAndVersionFile_1 = function (fileName) {
                project.files[fileName] = true;
                var currentVersion = project.versions[fileName];
                var newVersion = versionFile_1(fileName);
                if (currentVersion !== newVersion) {
                    project.version++;
                }
                return newVersion;
            };
            var versionFile_1 = function (fileName) {
                var version = options.getVersion(fileName);
                project.versions[fileName] = version;
                return version;
            };
            getOutput = function (fileName) {
                var output = service_1.getEmitOutput(fileName);
                var diagnostics = service_1.getCompilerOptionsDiagnostics()
                    .concat(service_1.getSyntacticDiagnostics(fileName))
                    .concat(service_1.getSemanticDiagnostics(fileName));
                var diagnosticList = formatDiagnostics(diagnostics, options, cwd, ts);
                if (output.emitSkipped) {
                    diagnosticList.push(path_1.relative(cwd, fileName) + ": Emit skipped");
                }
                if (diagnosticList.length) {
                    throw new TSError(diagnosticList);
                }
                return [output.outputFiles[1].text, output.outputFiles[0].text];
            };
            compile = readThrough(cachedir, options, project, function (fileName, contents) {
                addAndVersionFile_1(fileName);
                return getOutput(fileName, contents);
            });
            getTypeInfo = function (fileName, position) {
                addAndVersionFile_1(fileName);
                var info = service_1.getQuickInfoAtPosition(fileName, position);
                var name = ts.displayPartsToString(info ? info.displayParts : []);
                var comment = ts.displayPartsToString(info ? info.documentation : []);
                return { name: name, comment: comment };
            };
        }
        return { cwd: cwd, compile: compile, getOutput: getOutput, getTypeInfo: getTypeInfo };
    }
    function service() {
        return result || (result = load());
    }
    function loader(m, fileName) {
        return m._compile(service().compile(fileName), fileName);
    }
    function shouldIgnore(filename) {
        return path_1.relative(service().cwd, filename).split(path_1.sep).indexOf('node_modules') > -1;
    }
    function registerExtension(ext) {
        var old = oldHandlers[ext] || oldHandlers['.js'] || require.extensions['.js'];
        oldHandlers[ext] = require.extensions[ext];
        require.extensions[ext] = function (m, filename) {
            if (shouldIgnore(filename)) {
                return old(m, filename);
            }
            return loader(m, filename);
        };
    }
    registerExtension('.ts');
    registerExtension('.tsx');
    if (!options.lazy) {
        service();
    }
    return service;
}
exports.register = register;
function readConfig(options, cwd, ts) {
    var result = tsconfig_1.loadSync(cwd, options.project);
    result.config.compilerOptions = extend({
        target: 'es5',
        module: 'commonjs'
    }, result.config.compilerOptions, options.compilerOptions, {
        sourceMap: true,
        inlineSourceMap: false,
        inlineSources: true,
        declaration: false,
        noEmit: false,
        outDir: '$$ts-node$$'
    });
    delete result.config.compilerOptions.out;
    delete result.config.compilerOptions.outFile;
    var basePath = result.path ? path_1.dirname(result.path) : cwd;
    if (typeof ts.parseConfigFile === 'function') {
        return ts.parseConfigFile(result.config, ts.sys, basePath);
    }
    return ts.parseJsonConfigFileContent(result.config, ts.sys, basePath, null, result.path);
}
function readThrough(cachedir, options, project, compile) {
    if (options.cache === false) {
        return function (fileName) {
            var contents = options.getFile(fileName);
            var cachePath = path_1.join(cachedir, getCacheName(contents, fileName));
            var sourceMapPath = cachePath + ".js.map";
            var out = compile(fileName, contents);
            project.maps[fileName] = sourceMapPath;
            var output = updateOutput(out[0], fileName, sourceMapPath);
            var sourceMap = updateSourceMap(out[1], fileName);
            fs_1.writeFileSync(sourceMapPath, sourceMap);
            return output;
        };
    }
    return function (fileName) {
        var contents = options.getFile(fileName);
        var cachePath = path_1.join(cachedir, getCacheName(contents, fileName));
        var outputPath = cachePath + ".js";
        var sourceMapPath = cachePath + ".js.map";
        project.maps[fileName] = sourceMapPath;
        if (options.fileExists(outputPath)) {
            return options.getFile(outputPath);
        }
        var out = compile(fileName, contents);
        var output = updateOutput(out[0], fileName, sourceMapPath);
        var sourceMap = updateSourceMap(out[1], fileName);
        fs_1.writeFileSync(outputPath, output);
        fs_1.writeFileSync(sourceMapPath, sourceMap);
        return output;
    };
}
function updateOutput(outputText, fileName, sourceMapPath) {
    var ext = path_1.extname(fileName);
    var originalPath = path_1.basename(fileName).slice(0, -ext.length) + '.js.map';
    return outputText.slice(0, -originalPath.length) + sourceMapPath.replace(/\\/g, '/');
}
function updateSourceMap(sourceMapText, fileName) {
    var sourceMap = JSON.parse(sourceMapText);
    sourceMap.file = fileName;
    sourceMap.sources = [fileName];
    delete sourceMap.sourceRoot;
    return JSON.stringify(sourceMap);
}
function getCacheName(sourceCode, fileName) {
    return crypto.createHash('sha1')
        .update(path_1.extname(fileName), 'utf8')
        .update('\0', 'utf8')
        .update(sourceCode, 'utf8')
        .digest('hex');
}
function getCompilerDigest(ts, options, config) {
    return path_1.join(crypto.createHash('sha1')
        .update(ts.version, 'utf8')
        .update('\0', 'utf8')
        .update(JSON.stringify(options), 'utf8')
        .update('\0', 'utf8')
        .update(JSON.stringify(config), 'utf8')
        .digest('hex'));
}
function getVersion(fileName) {
    return String(fs_1.statSync(fileName).mtime.getTime());
}
exports.getVersion = getVersion;
function fileExists(fileName) {
    try {
        var stats = fs_1.statSync(fileName);
        return stats.isFile() || stats.isFIFO();
    }
    catch (err) {
        return false;
    }
}
exports.fileExists = fileExists;
function getDirectories(path) {
    return fs_1.readdirSync(path).filter(function (name) { return directoryExists(path_1.join(path, name)); });
}
exports.getDirectories = getDirectories;
function directoryExists(path) {
    try {
        return fs_1.statSync(path).isDirectory();
    }
    catch (err) {
        return false;
    }
}
exports.directoryExists = directoryExists;
function getFile(fileName) {
    return fs_1.readFileSync(fileName, 'utf8');
}
exports.getFile = getFile;
function formatDiagnostics(diagnostics, options, cwd, ts) {
    if (options.disableWarnings) {
        return [];
    }
    return diagnostics
        .filter(function (diagnostic) {
        return options.ignoreWarnings.indexOf(diagnostic.code) === -1;
    })
        .map(function (diagnostic) {
        return formatDiagnostic(diagnostic, cwd, ts);
    });
}
function formatDiagnostic(diagnostic, cwd, ts) {
    var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
        var path = path_1.relative(cwd, diagnostic.file.fileName);
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        return path + " (" + (line + 1) + "," + (character + 1) + "): " + message + " (" + diagnostic.code + ")";
    }
    return message + " (" + diagnostic.code + ")";
}
var TSError = (function (_super) {
    __extends(TSError, _super);
    function TSError(diagnostics) {
        _super.call(this, "\u2A2F Unable to compile TypeScript\n" + diagnostics.join('\n'));
        this.name = 'TSError';
        this.diagnostics = diagnostics;
    }
    return TSError;
}(make_error_1.BaseError));
exports.TSError = TSError;
//# sourceMappingURL=index.js.map