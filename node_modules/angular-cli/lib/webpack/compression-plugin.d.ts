export interface CompressionPluginOptions {
    algorithm?: string;
    asset?: string;
    level?: number;
    flush?: boolean;
    chunkSize?: number;
    test?: RegExp | RegExp[];
    windowBits?: number;
    memLevel?: number;
    strategy?: number;
    dictionary?: any;
    threshold?: number;
    minRatio?: number;
}
export declare class CompressionPlugin {
    private asset;
    private algorithm;
    private compressionOptions;
    private test;
    private threshold;
    private minRatio;
    constructor(options?: CompressionPluginOptions);
    apply(compiler: any): void;
}
