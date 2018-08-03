"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignoreDep typescript
const ts = require("typescript");
const benchmark_1 = require("./benchmark");
class CancellationToken {
    constructor() {
        this._isCancelled = false;
    }
    requestCancellation() {
        this._isCancelled = true;
    }
    isCancellationRequested() {
        return this._isCancelled;
    }
    throwIfCancellationRequested() {
        if (this.isCancellationRequested()) {
            throw new ts.OperationCanceledException();
        }
    }
}
exports.CancellationToken = CancellationToken;
function hasErrors(diags) {
    return diags.some(d => d.category === ts.DiagnosticCategory.Error);
}
exports.hasErrors = hasErrors;
function gatherDiagnostics(program, jitMode, benchmarkLabel, cancellationToken) {
    const allDiagnostics = [];
    let checkOtherDiagnostics = true;
    function checkDiagnostics(diags) {
        if (diags) {
            allDiagnostics.push(...diags);
            return !hasErrors(diags);
        }
        return true;
    }
    if (jitMode) {
        const tsProgram = program;
        // Check syntactic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ts.getSyntacticDiagnostics`);
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(tsProgram.getSyntacticDiagnostics(undefined, cancellationToken));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ts.getSyntacticDiagnostics`);
        // Check semantic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ts.getSemanticDiagnostics`);
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(tsProgram.getSemanticDiagnostics(undefined, cancellationToken));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ts.getSemanticDiagnostics`);
    }
    else {
        const angularProgram = program;
        // Check TypeScript syntactic diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSyntacticDiagnostics`);
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(angularProgram.getTsSyntacticDiagnostics(undefined, cancellationToken));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSyntacticDiagnostics`);
        // Check TypeScript semantic and Angular structure diagnostics.
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSemanticDiagnostics`);
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(angularProgram.getTsSemanticDiagnostics(undefined, cancellationToken));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getTsSemanticDiagnostics`);
        // Check Angular semantic diagnostics
        benchmark_1.time(`${benchmarkLabel}.gatherDiagnostics.ng.getNgSemanticDiagnostics`);
        checkOtherDiagnostics = checkOtherDiagnostics &&
            checkDiagnostics(angularProgram.getNgSemanticDiagnostics(undefined, cancellationToken));
        benchmark_1.timeEnd(`${benchmarkLabel}.gatherDiagnostics.ng.getNgSemanticDiagnostics`);
    }
    return allDiagnostics;
}
exports.gatherDiagnostics = gatherDiagnostics;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/src/gather_diagnostics.js.map