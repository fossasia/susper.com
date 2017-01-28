/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('raw-loader')
 * require('style-loader')
 * require('postcss-loader')
 * require('css-loader')
 * require('stylus-loader')
 * require('less-loader')
 * require('sass-loader')
 *
 * require('node-sass')
 * require('less')
 * require('stylus')
 */
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
export declare function makeCssLoaders(stylePaths?: string[]): any;
export declare function extraEntryParser(extraEntries: (string | ExtraEntry)[], appRoot: string, defaultEntry: string): ExtraEntry[];
