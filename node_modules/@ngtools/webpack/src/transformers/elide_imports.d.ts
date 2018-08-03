import * as ts from 'typescript';
import { TransformOperation } from './interfaces';
export declare function elideImports(sourceFile: ts.SourceFile, removedNodes: ts.Node[], getTypeChecker: () => ts.TypeChecker): TransformOperation[];
