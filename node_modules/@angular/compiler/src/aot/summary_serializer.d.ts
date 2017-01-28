/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileTypeSummary } from '../compile_metadata';
import { Summary, SummaryResolver } from '../summary_resolver';
import { StaticSymbol, StaticSymbolCache } from './static_symbol';
import { ResolvedStaticSymbol, StaticSymbolResolver } from './static_symbol_resolver';
export interface AotSummarySerializerHost {
    /**
     * Returns the output file path of a source file.
     * E.g.
     * `some_file.ts` -> `some_file.d.ts`
     */
    getOutputFileName(sourceFilePath: string): string;
    /**
     * Returns whether a file is a source file or not.
     */
    isSourceFile(sourceFilePath: string): boolean;
}
export declare function serializeSummaries(host: AotSummarySerializerHost, summaryResolver: SummaryResolver<StaticSymbol>, symbolResolver: StaticSymbolResolver, symbols: ResolvedStaticSymbol[], types: CompileTypeSummary[]): string;
export declare function deserializeSummaries(symbolCache: StaticSymbolCache, json: string): Summary<StaticSymbol>[];
export declare function summaryFileName(fileName: string): string;
