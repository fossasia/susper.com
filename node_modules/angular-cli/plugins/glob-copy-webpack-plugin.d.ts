export interface GlobCopyWebpackPluginOptions {
    patterns: string[];
    globOptions: any;
}
export declare class GlobCopyWebpackPlugin {
    private options;
    constructor(options: GlobCopyWebpackPluginOptions);
    apply(compiler: any): void;
}
