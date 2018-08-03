import * as ts from 'typescript';
export declare function removeDecorators(shouldTransform: (fileName: string) => boolean, getTypeChecker: () => ts.TypeChecker): ts.TransformerFactory<ts.SourceFile>;
