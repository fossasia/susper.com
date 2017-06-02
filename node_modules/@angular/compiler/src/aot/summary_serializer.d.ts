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
export declare function serializeSummaries(summaryResolver: SummaryResolver<StaticSymbol>, symbolResolver: StaticSymbolResolver, symbols: ResolvedStaticSymbol[], types: CompileTypeSummary[]): {
    json: string;
    exportAs: {
        symbol: StaticSymbol;
        exportAs: string;
    }[];
};
export declare function deserializeSummaries(symbolCache: StaticSymbolCache, json: string): {
    summaries: Summary<StaticSymbol>[];
    importAs: {
        symbol: StaticSymbol;
        importAs: string;
    }[];
};
