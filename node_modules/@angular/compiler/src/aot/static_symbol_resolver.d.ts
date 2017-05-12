/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SummaryResolver } from '../summary_resolver';
import { StaticSymbol, StaticSymbolCache } from './static_symbol';
export declare class ResolvedStaticSymbol {
    symbol: StaticSymbol;
    metadata: any;
    constructor(symbol: StaticSymbol, metadata: any);
}
/**
 * The host of the SymbolResolverHost disconnects the implementation from TypeScript / other
 * language
 * services and from underlying file systems.
 */
export interface StaticSymbolResolverHost {
    /**
     * Return a ModuleMetadata for the given module.
     * Angular 2 CLI will produce this metadata for a module whenever a .d.ts files is
     * produced and the module has exported variables or classes with decorators. Module metadata can
     * also be produced directly from TypeScript sources by using MetadataCollector in tools/metadata.
     *
     * @param modulePath is a string identifier for a module as an absolute path.
     * @returns the metadata for the given module.
     */
    getMetadataFor(modulePath: string): {
        [key: string]: any;
    }[];
    /**
     * Converts a module name that is used in an `import` to a file path.
     * I.e.
     * `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
     */
    moduleNameToFileName(moduleName: string, containingFile: string): string;
}
/**
 * This class is responsible for loading metadata per symbol,
 * and normalizing references between symbols.
 */
export declare class StaticSymbolResolver {
    private host;
    private staticSymbolCache;
    private summaryResolver;
    private errorRecorder;
    private metadataCache;
    private resolvedSymbols;
    private resolvedFilePaths;
    constructor(host: StaticSymbolResolverHost, staticSymbolCache: StaticSymbolCache, summaryResolver: SummaryResolver<StaticSymbol>, errorRecorder?: (error: any, fileName: string) => void);
    resolveSymbol(staticSymbol: StaticSymbol): ResolvedStaticSymbol;
    private _resolveSymbolMembers(staticSymbol);
    private _resolveSymbolFromSummary(staticSymbol);
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    getStaticSymbol(declarationFile: string, name: string, members?: string[]): StaticSymbol;
    getSymbolsOf(filePath: string): StaticSymbol[];
    private _createSymbolsOf(filePath);
    private createResolvedSymbol(sourceSymbol, metadata);
    private reportError(error, context, path?);
    /**
     * @param module an absolute path to a module file.
     */
    private getModuleMetadata(module);
    getSymbolByModule(module: string, symbolName: string, containingFile?: string): StaticSymbol;
    private resolveModule(module, containingFile);
}
