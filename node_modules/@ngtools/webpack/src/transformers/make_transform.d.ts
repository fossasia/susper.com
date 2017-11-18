import * as ts from 'typescript';
import { StandardTransform } from './interfaces';
export declare function makeTransform(standardTransform: StandardTransform, getTypeChecker?: () => ts.TypeChecker): ts.TransformerFactory<ts.SourceFile>;
