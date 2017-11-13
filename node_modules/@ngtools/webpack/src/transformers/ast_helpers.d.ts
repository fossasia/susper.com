import * as ts from 'typescript';
export declare function collectDeepNodes<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T[];
export declare function getFirstNode(sourceFile: ts.SourceFile): ts.Node | null;
export declare function getLastNode(sourceFile: ts.SourceFile): ts.Node | null;
export declare function transformTypescript(content: string, transformers: ts.TransformerFactory<ts.SourceFile>[]): string;
