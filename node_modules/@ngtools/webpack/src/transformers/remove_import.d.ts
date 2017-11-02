import * as ts from 'typescript';
import { TransformOperation } from './interfaces';
export declare function removeImport(sourceFile: ts.SourceFile, removedIdentifiers: ts.Identifier[]): TransformOperation[];
