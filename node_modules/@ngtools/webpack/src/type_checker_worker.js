"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const benchmark_1 = require("./benchmark");
const gather_diagnostics_1 = require("./gather_diagnostics");
const type_checker_1 = require("./type_checker");
let typeChecker;
let lastCancellationToken;
// only listen to messages if started from the AngularCompilerPlugin
if (process.argv.indexOf(type_checker_1.AUTO_START_ARG) >= 0) {
    process.on('message', (message) => {
        benchmark_1.time('TypeChecker.message');
        switch (message.kind) {
            case type_checker_1.MESSAGE_KIND.Init:
                const initMessage = message;
                typeChecker = new type_checker_1.TypeChecker(initMessage.compilerOptions, initMessage.basePath, initMessage.jitMode, initMessage.rootNames);
                break;
            case type_checker_1.MESSAGE_KIND.Update:
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
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/type_checker_worker.js.map