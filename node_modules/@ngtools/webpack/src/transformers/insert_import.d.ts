import * as ts from 'typescript';
import { TransformOperation } from './interfaces';
export declare function insertStarImport(sourceFile: ts.SourceFile, identifier: ts.Identifier, modulePath: string, target?: ts.Node, before?: boolean): TransformOperation[];
export declare function insertImport(sourceFile: ts.SourceFile, symbolName: string, modulePath: string): TransformOperation[];
