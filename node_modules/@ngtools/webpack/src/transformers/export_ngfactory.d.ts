import * as ts from 'typescript';
export declare function exportNgFactory(shouldTransform: (fileName: string) => boolean, getEntryModule: () => {
    path: string;
    className: string;
}): ts.TransformerFactory<ts.SourceFile>;
