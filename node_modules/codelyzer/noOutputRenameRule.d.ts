import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NgWalker } from './angular/ngWalker';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE_STRING: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class OutputMetadataWalker extends NgWalker {
    visitNgOutput(property: ts.PropertyDeclaration, output: ts.Decorator, args: string[]): void;
}
