import * as ts from 'typescript';
export declare enum OPERATION_KIND {
    Remove = 0,
    Add = 1,
    Replace = 2,
}
export interface StandardTransform {
    (sourceFile: ts.SourceFile): TransformOperation[];
}
export declare abstract class TransformOperation {
    kind: OPERATION_KIND;
    sourceFile: ts.SourceFile;
    target: ts.Node;
    constructor(kind: OPERATION_KIND, sourceFile: ts.SourceFile, target: ts.Node);
}
export declare class RemoveNodeOperation extends TransformOperation {
    constructor(sourceFile: ts.SourceFile, target: ts.Node);
}
export declare class AddNodeOperation extends TransformOperation {
    before: ts.Node;
    after: ts.Node;
    constructor(sourceFile: ts.SourceFile, target: ts.Node, before?: ts.Node, after?: ts.Node);
}
export declare class ReplaceNodeOperation extends TransformOperation {
    replacement: ts.Node;
    kind: OPERATION_KIND.Replace;
    constructor(sourceFile: ts.SourceFile, target: ts.Node, replacement: ts.Node);
}
