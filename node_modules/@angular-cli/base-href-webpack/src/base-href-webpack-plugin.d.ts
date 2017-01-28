export interface BaseHrefWebpackPluginOptions {
    baseHref: string;
}
export declare class BaseHrefWebpackPlugin {
    private options;
    constructor(options: BaseHrefWebpackPluginOptions);
    apply(compiler: any): void;
}
