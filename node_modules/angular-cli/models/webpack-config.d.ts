export declare class NgCliWebpackConfig {
    ngCliProject: any;
    target: string;
    environment: string;
    config: any;
    constructor(ngCliProject: any, target: string, environment: string, outputDir?: string, baseHref?: string, i18nFile?: string, i18nFormat?: string, locale?: string, isAoT?: boolean, sourcemap?: boolean, vendorChunk?: boolean, verbose?: boolean, progress?: boolean);
    getTargetConfig(projectRoot: string, appConfig: any, sourcemap: boolean, verbose: boolean): any;
}
