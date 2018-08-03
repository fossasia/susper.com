import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NgWalker } from './angular/ngWalker';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
export declare class ClassMetadataWalker extends NgWalker {
    private rule;
    constructor(sourceFile: ts.SourceFile, rule: Rule);
    visitNgPipe(controller: ts.ClassDeclaration, decorator: ts.Decorator): void;
    private validateProperties(className, pipe);
    private extractArgument(pipe);
    private validateProperty(className, property);
    private createFailureArray(className);
}
