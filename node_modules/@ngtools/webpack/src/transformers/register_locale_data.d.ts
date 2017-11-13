import * as ts from 'typescript';
export declare function registerLocaleData(shouldTransform: (fileName: string) => boolean, getEntryModule: () => {
    path: string;
    className: string;
}, locale: string): ts.TransformerFactory<ts.SourceFile>;
