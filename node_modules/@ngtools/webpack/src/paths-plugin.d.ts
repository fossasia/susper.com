import * as ts from 'typescript';
import { ResolverPlugin, Callback, Tapable, NormalModuleFactory, NormalModuleFactoryRequest } from './webpack';
export declare function resolveWithPaths(request: NormalModuleFactoryRequest, callback: Callback<NormalModuleFactoryRequest>, compilerOptions: ts.CompilerOptions, host: ts.CompilerHost, cache?: ts.ModuleResolutionCache): void;
export interface PathsPluginOptions {
    nmf: NormalModuleFactory;
    tsConfigPath: string;
    compilerOptions?: ts.CompilerOptions;
    compilerHost?: ts.CompilerHost;
}
export declare class PathsPlugin implements Tapable {
    private _nmf;
    private _compilerOptions;
    private _host;
    source: string;
    target: string;
    private _absoluteBaseUrl;
    private static _loadOptionsFromTsConfig(tsConfigPath, host?);
    constructor(options: PathsPluginOptions);
    apply(resolver: ResolverPlugin): void;
}
