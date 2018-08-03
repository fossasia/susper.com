import * as ts from 'typescript';
import { Program, Diagnostics } from './ngtools_api';
export declare class CancellationToken implements ts.CancellationToken {
    private _isCancelled;
    requestCancellation(): void;
    isCancellationRequested(): boolean;
    throwIfCancellationRequested(): void;
}
export declare function hasErrors(diags: Diagnostics): boolean;
export declare function gatherDiagnostics(program: ts.Program | Program, jitMode: boolean, benchmarkLabel: string, cancellationToken?: CancellationToken): Diagnostics;
