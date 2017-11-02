import * as ts from 'typescript';
import { StandardTransform } from './interfaces';
export declare function makeTransform(standardTransform: StandardTransform): ts.TransformerFactory<ts.SourceFile>;
