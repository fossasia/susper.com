import { BuildOptions } from './build-options';
export interface WebpackConfigOptions<T extends BuildOptions = BuildOptions> {
    projectRoot: string;
    buildOptions: T;
    appConfig: any;
    tsConfig: any;
}
export declare class NgCliWebpackConfig<T extends BuildOptions = BuildOptions> {
    config: any;
    wco: WebpackConfigOptions<T>;
    constructor(buildOptions: T, appConfig: any);
    buildConfig(): any;
    getTargetConfig(webpackConfigOptions: WebpackConfigOptions<T>): any;
    validateBuildOptions(buildOptions: BuildOptions): void;
    addTargetDefaults(buildOptions: T): T;
    mergeConfigs(buildOptions: T, appConfig: any, projectRoot: string): T;
    addAppConfigDefaults(appConfig: any): any;
}
