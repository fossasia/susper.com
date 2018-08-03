export declare class WebpackResourceLoader {
    private _parentCompilation;
    private _context;
    private _uniqueId;
    private _resourceDependencies;
    private _cachedResources;
    constructor();
    update(parentCompilation: any): void;
    getResourceDependencies(filePath: string): string[];
    private _compile(filePath);
    private _evaluate({outputName, source});
    get(filePath: string): Promise<string>;
}
