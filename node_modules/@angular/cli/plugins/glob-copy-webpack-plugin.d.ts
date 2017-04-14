export interface Pattern {
    glob: string;
    input?: string;
    output?: string;
}
export interface GlobCopyWebpackPluginOptions {
    patterns: (string | Pattern)[];
    globOptions: any;
}
export declare class GlobCopyWebpackPlugin {
    private options;
    constructor(options: GlobCopyWebpackPluginOptions);
    apply(compiler: any): void;
}
