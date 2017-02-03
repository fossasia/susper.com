#!/usr/bin/env node
"use strict";
var fs = require('fs');
var minimist = require('minimist');
var mkdirp = require('mkdirp');
var path = require('path');
var ts = require('typescript');
var cliSupport = require('./cli_support');
var tsickle = require('./tsickle');
var util_1 = require('./util');
function usage() {
    console.error("usage: tsickle [tsickle options] -- [tsc options]\n\nexample:\n  tsickle --externs=foo/externs.js -- -p src --noImplicitAny\n\ntsickle flags are:\n  --externs=PATH     save generated Closure externs.js to PATH\n  --untyped          convert every type in TypeScript to the Closure {?} type\n");
}
/**
 * Parses the command-line arguments, extracting the tsickle settings and
 * the arguments to pass on to tsc.
 */
function loadSettingsFromArgs(args) {
    var settings = { isUntyped: false };
    var parsedArgs = minimist(args);
    for (var _i = 0, _a = Object.keys(parsedArgs); _i < _a.length; _i++) {
        var flag = _a[_i];
        switch (flag) {
            case 'h':
            case 'help':
                usage();
                process.exit(0);
                break;
            case 'externs':
                settings.externsPath = parsedArgs[flag];
                break;
            case 'untyped':
                settings.isUntyped = true;
                break;
            case 'verbose':
                settings.verbose = true;
                break;
            case '_':
                // This is part of the minimist API, and holds args after the '--'.
                break;
            default:
                console.error("unknown flag '--" + flag + "'");
                usage();
                process.exit(1);
        }
    }
    // Arguments after the '--' arg are arguments to tsc.
    var tscArgs = parsedArgs['_'];
    return { settings: settings, tscArgs: tscArgs };
}
/**
 * Loads the tsconfig.json from a directory.
 * Unfortunately there's a ton of logic in tsc.ts related to searching
 * for tsconfig.json etc. that we don't really want to replicate, e.g.
 * tsc appears to allow -p path/to/tsconfig.json while this only works
 * with -p path/to/containing/dir.
 *
 * @param args tsc command-line arguments.
 */
function loadTscConfig(args, allDiagnostics) {
    // Gather tsc options/input files from command line.
    // Bypass visibilty of parseCommandLine, see
    // https://github.com/Microsoft/TypeScript/issues/2620
    var _a = ts.parseCommandLine(args), options = _a.options, fileNames = _a.fileNames, errors = _a.errors;
    if (errors.length > 0) {
        allDiagnostics.push.apply(allDiagnostics, errors);
        return null;
    }
    // Store file arguments
    var tsFileArguments = fileNames;
    // Read further settings from tsconfig.json.
    var projectDir = options.project || '.';
    var configFileName = path.join(projectDir, 'tsconfig.json');
    var _b = ts.readConfigFile(configFileName, function (path) { return fs.readFileSync(path, 'utf-8'); }), json = _b.config, error = _b.error;
    if (error) {
        allDiagnostics.push(error);
        return null;
    }
    (_c = ts.parseJsonConfigFileContent(json, ts.sys, projectDir, options, configFileName), options = _c.options, fileNames = _c.fileNames, errors = _c.errors, _c);
    if (errors.length > 0) {
        allDiagnostics.push.apply(allDiagnostics, errors);
        return null;
    }
    // if file arguments were given to the typescript transpiler than transpile only those files
    fileNames = tsFileArguments.length > 0 ? tsFileArguments : fileNames;
    return { options: options, fileNames: fileNames };
    var _c;
}
/**
 * Compiles TypeScript code into Closure-compiler-ready JS.
 * Doesn't write any files to disk; all JS content is returned in a map.
 */
function toClosureJS(options, fileNames, settings, allDiagnostics, files) {
    // Parse and load the program without tsickle processing.
    // This is so:
    // - error messages point at the original source text
    // - tsickle can use the result of typechecking for annotation
    var program = files === undefined ?
        ts.createProgram(fileNames, options) :
        ts.createProgram(fileNames, options, util_1.createSourceReplacingCompilerHost(files, ts.createCompilerHost(options)));
    {
        var diagnostics_1 = ts.getPreEmitDiagnostics(program);
        if (diagnostics_1.length > 0) {
            allDiagnostics.push.apply(allDiagnostics, diagnostics_1);
            return null;
        }
    }
    var tsickleCompilerHostOptions = {
        googmodule: true,
        es5Mode: false,
        untyped: settings.isUntyped,
    };
    var tsickleHost = {
        shouldSkipTsickleProcessing: function (fileName) { return fileNames.indexOf(fileName) === -1; },
        pathToModuleName: cliSupport.pathToModuleName,
        shouldIgnoreWarningsForPath: function (filePath) { return false; },
        fileNameToModuleId: function (fileName) { return fileName; },
    };
    var jsFiles = new Map();
    var hostDelegate = util_1.createOutputRetainingCompilerHost(jsFiles, ts.createCompilerHost(options));
    // Reparse and reload the program, inserting the tsickle output in
    // place of the original source.
    var host = new tsickle.TsickleCompilerHost(hostDelegate, options, tsickleCompilerHostOptions, tsickleHost, { oldProgram: program, pass: tsickle.Pass.CLOSURIZE });
    program = ts.createProgram(fileNames, options, host);
    var diagnostics = program.emit(undefined).diagnostics;
    if (diagnostics.length > 0) {
        allDiagnostics.push.apply(allDiagnostics, diagnostics);
        return null;
    }
    return { jsFiles: jsFiles, externs: host.getGeneratedExterns() };
}
exports.toClosureJS = toClosureJS;
function main(args) {
    var _a = loadSettingsFromArgs(args), settings = _a.settings, tscArgs = _a.tscArgs;
    var diagnostics = [];
    var config = loadTscConfig(tscArgs, diagnostics);
    if (config === null) {
        console.error(tsickle.formatDiagnostics(diagnostics));
        return 1;
    }
    // Run tsickle+TSC to convert inputs to Closure JS files.
    var closure = toClosureJS(config.options, config.fileNames, settings, diagnostics);
    if (closure === null) {
        console.error(tsickle.formatDiagnostics(diagnostics));
        return 1;
    }
    for (var _i = 0, _b = util_1.toArray(closure.jsFiles.keys()); _i < _b.length; _i++) {
        var fileName = _b[_i];
        mkdirp.sync(path.dirname(fileName));
        fs.writeFileSync(fileName, closure.jsFiles.get(fileName));
    }
    if (settings.externsPath) {
        mkdirp.sync(path.dirname(settings.externsPath));
        fs.writeFileSync(settings.externsPath, closure.externs);
    }
    return 0;
}
// CLI entry point
if (require.main === module) {
    process.exit(main(process.argv.splice(2)));
}

//# sourceMappingURL=main.js.map
