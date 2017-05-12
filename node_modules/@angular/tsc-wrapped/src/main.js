/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var fs = require('fs');
var path = require('path');
var ts = require('typescript');
var tsc_1 = require('./tsc');
var compiler_host_1 = require('./compiler_host');
var cli_options_1 = require('./cli_options');
var tsc_2 = require('./tsc');
exports.UserError = tsc_2.UserError;
function main(project, cliOptions, codegen) {
    try {
        var projectDir = project;
        if (fs.lstatSync(project).isFile()) {
            projectDir = path.dirname(project);
        }
        // file names in tsconfig are resolved relative to this absolute path
        var basePath = path.resolve(process.cwd(), cliOptions.basePath || projectDir);
        // read the configuration options from wherever you store them
        var _a = tsc_1.tsc.readConfiguration(project, basePath), parsed_1 = _a.parsed, ngOptions_1 = _a.ngOptions;
        ngOptions_1.basePath = basePath;
        var createProgram_1 = function (host, oldProgram) {
            return ts.createProgram(parsed_1.fileNames, parsed_1.options, host, oldProgram);
        };
        var diagnostics_1 = parsed_1.options.diagnostics;
        if (diagnostics_1)
            ts.performance.enable();
        var host_1 = ts.createCompilerHost(parsed_1.options, true);
        // HACK: patch the realpath to solve symlink issue here:
        // https://github.com/Microsoft/TypeScript/issues/9552
        // todo(misko): remove once facade symlinks are removed
        host_1.realpath = function (path) { return path; };
        var program_1 = createProgram_1(host_1);
        var errors = program_1.getOptionsDiagnostics();
        tsc_1.check(errors);
        if (ngOptions_1.skipTemplateCodegen || !codegen) {
            codegen = function () { return Promise.resolve(null); };
        }
        if (diagnostics_1)
            console.time('NG codegen');
        return codegen(ngOptions_1, cliOptions, program_1, host_1).then(function () {
            if (diagnostics_1)
                console.timeEnd('NG codegen');
            var definitionsHost = host_1;
            if (!ngOptions_1.skipMetadataEmit) {
                definitionsHost = new compiler_host_1.MetadataWriterHost(host_1, ngOptions_1);
            }
            // Create a new program since codegen files were created after making the old program
            var programWithCodegen = createProgram_1(definitionsHost, program_1);
            tsc_1.tsc.typeCheck(host_1, programWithCodegen);
            var preprocessHost = host_1;
            var programForJsEmit = programWithCodegen;
            if (ngOptions_1.annotationsAs !== 'decorators') {
                if (diagnostics_1)
                    console.time('NG downlevel');
                var downlevelHost = new compiler_host_1.DecoratorDownlevelCompilerHost(preprocessHost, programForJsEmit);
                // A program can be re-used only once; save the programWithCodegen to be reused by
                // metadataWriter
                programForJsEmit = createProgram_1(downlevelHost);
                tsc_1.check(downlevelHost.diagnostics);
                preprocessHost = downlevelHost;
                if (diagnostics_1)
                    console.timeEnd('NG downlevel');
            }
            if (ngOptions_1.annotateForClosureCompiler) {
                if (diagnostics_1)
                    console.time('NG JSDoc');
                var tsickleHost = new compiler_host_1.TsickleCompilerHost(preprocessHost, programForJsEmit, ngOptions_1);
                programForJsEmit = createProgram_1(tsickleHost);
                tsc_1.check(tsickleHost.diagnostics);
                if (diagnostics_1)
                    console.timeEnd('NG JSDoc');
            }
            // Emit *.js and *.js.map
            tsc_1.tsc.emit(programForJsEmit);
            // Emit *.d.ts and maybe *.metadata.json
            // Not in the same emit pass with above, because tsickle erases
            // decorators which we want to read or document.
            // Do this emit second since TypeScript will create missing directories for us
            // in the standard emit.
            tsc_1.tsc.emit(programWithCodegen);
            if (diagnostics_1) {
                ts.performance.forEachMeasure(function (name, duration) { console.error("TS " + name + ": " + duration + "ms"); });
            }
        });
    }
    catch (e) {
        return Promise.reject(e);
    }
}
exports.main = main;
// CLI entry point
if (require.main === module) {
    var args_1 = require('minimist')(process.argv.slice(2));
    var project = args_1.p || args_1.project || '.';
    var cliOptions = new cli_options_1.CliOptions(args_1);
    main(project, cliOptions).then(function (exitCode) { return process.exit(exitCode); }).catch(function (e) {
        console.error(e.stack);
        console.error('Compilation failed');
        process.exit(1);
    });
}
//# sourceMappingURL=main.js.map