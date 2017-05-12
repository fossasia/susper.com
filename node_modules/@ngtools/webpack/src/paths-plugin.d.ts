import * as ts from 'typescript';
import { ResolverPlugin, Callback, Tapable } from './webpack';
export interface PathsPluginOptions {
    tsConfigPath: string;
    compilerOptions?: ts.CompilerOptions;
    compilerHost?: ts.CompilerHost;
}
export declare class PathsPlugin implements Tapable {
    private _tsConfigPath;
    private _compilerOptions;
    private _host;
    source: string;
    target: string;
    private mappings;
    private _absoluteBaseUrl;
    private static _loadOptionsFromTsConfig(tsConfigPath, host?);
    constructor(options: PathsPluginOptions);
    apply(resolver: ResolverPlugin): void;
    resolve(resolver: ResolverPlugin, mapping: any, request: any, callback: Callback<any>): any;
    createPlugin(resolver: ResolverPlugin, mapping: any): any;
}
