import { BuildOptions } from './build-options';
import { NgCliWebpackConfig } from './webpack-config';
export interface WebpackTestOptions extends BuildOptions {
    codeCoverage?: boolean;
}
export declare class WebpackTestConfig extends NgCliWebpackConfig<WebpackTestOptions> {
    constructor(testOptions: WebpackTestOptions, appConfig: any);
    buildConfig(): any;
}
