export declare const ngAppResolve: (resolvePath: string) => string;
export declare function getWebpackStatsConfig(verbose?: boolean): {
    colors: boolean;
    hash: boolean;
    timings: boolean;
    chunks: boolean;
    chunkModules: boolean;
    children: boolean;
    modules: boolean;
    reasons: boolean;
    warnings: boolean;
    assets: boolean;
    version: boolean;
};
export interface ExtraEntry {
    input: string;
    output?: string;
    lazy?: boolean;
    path?: string;
    entry?: string;
}
export declare function lazyChunksFilter(extraEntries: ExtraEntry[]): string[];
export declare function extraEntryParser(extraEntries: (string | ExtraEntry)[], appRoot: string, defaultEntry: string): ExtraEntry[];
export interface HashFormat {
    chunk: string;
    extract: string;
    file: string;
}
export declare function getOutputHashFormat(option: string, length?: number): HashFormat;
