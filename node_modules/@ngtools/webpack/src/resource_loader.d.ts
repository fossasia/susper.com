import { ResourceLoader } from '@angular/compiler';
export declare class WebpackResourceLoader implements ResourceLoader {
    private _parentCompilation;
    private _context;
    private _uniqueId;
    constructor(_parentCompilation: any);
    private _compile(filePath, content);
    private _evaluate(fileName, source);
    get(filePath: string): Promise<string>;
}
