"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const process = require("process");
const ts = require("typescript");
const chalk_1 = require("chalk");
const compiler_host_1 = require("./compiler_host");
const benchmark_1 = require("./benchmark");
const gather_diagnostics_1 = require("./gather_diagnostics");
const ngtools_api_1 = require("./ngtools_api");
// Force basic color support on terminals with no color support.
// Chalk typings don't have the correct constructor parameters.
const chalkCtx = new chalk_1.default.constructor(chalk_1.default.supportsColor ? {} : { level: 1 });
const { bold, red, yellow } = chalkCtx;
var MESSAGE_KIND;
(function (MESSAGE_KIND) {
    MESSAGE_KIND[MESSAGE_KIND["Init"] = 0] = "Init";
    MESSAGE_KIND[MESSAGE_KIND["Update"] = 1] = "Update";
})(MESSAGE_KIND = exports.MESSAGE_KIND || (exports.MESSAGE_KIND = {}));
class TypeCheckerMessage {
    constructor(kind) {
        this.kind = kind;
    }
}
exports.TypeCheckerMessage = TypeCheckerMessage;
class InitMessage extends TypeCheckerMessage {
    constructor(compilerOptions, basePath, jitMode, rootNames) {
        super(MESSAGE_KIND.Init);
        this.compilerOptions = compilerOptions;
        this.basePath = basePath;
        this.jitMode = jitMode;
        this.rootNames = rootNames;
    }
}
exports.InitMessage = InitMessage;
class UpdateMessage extends TypeCheckerMessage {
    constructor(rootNames, changedCompilationFiles) {
        super(MESSAGE_KIND.Update);
        this.rootNames = rootNames;
        this.changedCompilationFiles = changedCompilationFiles;
    }
}
exports.UpdateMessage = UpdateMessage;
let typeChecker;
let lastCancellationToken;
process.on('message', (message) => {
    benchmark_1.time('TypeChecker.message');
    switch (message.kind) {
        case MESSAGE_KIND.Init:
            const initMessage = message;
            typeChecker = new TypeChecker(initMessage.compilerOptions, initMessage.basePath, initMessage.jitMode, initMessage.rootNames);
            break;
        case MESSAGE_KIND.Update:
            if (!typeChecker) {
                throw new Error('TypeChecker: update message received before initialization');
            }
            if (lastCancellationToken) {
                // This cancellation token doesn't seem to do much, messages don't seem to be processed
                // before the diagnostics finish.
                lastCancellationToken.requestCancellation();
            }
            const updateMessage = message;
            lastCancellationToken = new gather_diagnostics_1.CancellationToken();
            typeChecker.update(updateMessage.rootNames, updateMessage.changedCompilationFiles, lastCancellationToken);
            break;
        default:
            throw new Error(`TypeChecker: Unexpected message received: ${message}.`);
    }
    benchmark_1.timeEnd('TypeChecker.message');
});
class TypeChecker {
    constructor(_compilerOptions, _basePath, _JitMode, _rootNames) {
        this._compilerOptions = _compilerOptions;
        this._JitMode = _JitMode;
        this._rootNames = _rootNames;
        benchmark_1.time('TypeChecker.constructor');
        const compilerHost = new compiler_host_1.WebpackCompilerHost(_compilerOptions, _basePath);
        compilerHost.enableCaching();
        // We don't set a async resource loader on the compiler host because we only support
        // html templates, which are the only ones that can throw errors, and those can be loaded
        // synchronously.
        // If we need to also report errors on styles then we'll need to ask the main thread
        // for these resources.
        this._compilerHost = ngtools_api_1.createCompilerHost({
            options: this._compilerOptions,
            tsHost: compilerHost
        });
        benchmark_1.timeEnd('TypeChecker.constructor');
    }
    _update(rootNames, changedCompilationFiles) {
        benchmark_1.time('TypeChecker._update');
        this._rootNames = rootNames;
        changedCompilationFiles.forEach((fileName) => {
            this._compilerHost.invalidate(fileName);
        });
        benchmark_1.timeEnd('TypeChecker._update');
    }
    _createOrUpdateProgram() {
        if (this._JitMode) {
            // Create the TypeScript program.
            benchmark_1.time('TypeChecker._createOrUpdateProgram.ts.createProgram');
            this._program = ts.createProgram(this._rootNames, this._compilerOptions, this._compilerHost, this._program);
            benchmark_1.timeEnd('TypeChecker._createOrUpdateProgram.ts.createProgram');
        }
        else {
            benchmark_1.time('TypeChecker._createOrUpdateProgram.ng.createProgram');
            // Create the Angular program.
            this._program = ngtools_api_1.createProgram({
                rootNames: this._rootNames,
                options: this._compilerOptions,
                host: this._compilerHost,
                oldProgram: this._program
            });
            benchmark_1.timeEnd('TypeChecker._createOrUpdateProgram.ng.createProgram');
        }
    }
    _diagnose(cancellationToken) {
        const allDiagnostics = gather_diagnostics_1.gatherDiagnostics(this._program, this._JitMode, 'TypeChecker', cancellationToken);
        // Report diagnostics.
        if (!cancellationToken.isCancellationRequested()) {
            const errors = allDiagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
            const warnings = allDiagnostics.filter((d) => d.category === ts.DiagnosticCategory.Warning);
            if (errors.length > 0) {
                const message = ngtools_api_1.formatDiagnostics(errors);
                console.error(bold(red('ERROR in ' + message)));
            }
            else {
                // Reset the changed file tracker only if there are no errors.
                this._compilerHost.resetChangedFileTracker();
            }
            if (warnings.length > 0) {
                const message = ngtools_api_1.formatDiagnostics(warnings);
                console.log(bold(yellow('WARNING in ' + message)));
            }
        }
    }
    update(rootNames, changedCompilationFiles, cancellationToken) {
        this._update(rootNames, changedCompilationFiles);
        this._createOrUpdateProgram();
        this._diagnose(cancellationToken);
    }
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/type_checker.js.map