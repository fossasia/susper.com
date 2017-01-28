export interface SuppressEntryChunksWebpackPluginOptions {
    chunks: string[];
}
export declare class SuppressEntryChunksWebpackPlugin {
    private options;
    constructor(options: SuppressEntryChunksWebpackPluginOptions);
    apply(compiler: any): void;
}
