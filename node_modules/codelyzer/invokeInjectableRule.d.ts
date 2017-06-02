import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NgWalker } from './angular/ngWalker';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE_STRING: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class ValidateInjectableWalker extends NgWalker {
    visitClassDeclaration(declaration: ts.ClassDeclaration): void;
}
