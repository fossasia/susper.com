export interface IWebpackPrerender {
    templatePath: string;
    configPath: string;
    appPath: string;
}
export declare class PrerenderWebpackPlugin {
    private options;
    private bootloader;
    private cachedTemplate;
    constructor(options: IWebpackPrerender);
    apply(compiler: any): void;
    decacheAppFiles(): void;
}
