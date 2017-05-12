import { Summary, SummaryResolver } from '../summary_resolver';
import { StaticSymbol, StaticSymbolCache } from './static_symbol';
export interface AotSummaryResolverHost {
    /**
     * Loads an NgModule/Directive/Pipe summary file
     */
    loadSummary(filePath: string): string;
    /**
     * Returns whether a file is a source file or not.
     */
    isSourceFile(sourceFilePath: string): boolean;
}
export declare class AotSummaryResolver implements SummaryResolver<StaticSymbol> {
    private host;
    private staticSymbolCache;
    private summaryCache;
    private loadedFilePaths;
    constructor(host: AotSummaryResolverHost, staticSymbolCache: StaticSymbolCache);
    private _assertNoMembers(symbol);
    resolveSummary(staticSymbol: StaticSymbol): Summary<StaticSymbol>;
    getSymbolsOf(filePath: string): StaticSymbol[];
    private _loadSummaryFile(filePath);
}
