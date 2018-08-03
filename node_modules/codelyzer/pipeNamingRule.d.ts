import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NgWalker } from './angular/ngWalker';
import { IOptions } from 'tslint';
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE_WITHOUT_PREFIX: string;
    static FAILURE_WITH_PREFIX: string;
    prefix: string;
    hasPrefix: boolean;
    private prefixChecker;
    private validator;
    constructor(options: IOptions);
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
    validateName(name: string): boolean;
    validatePrefix(prefix: string): boolean;
}
export declare class ClassMetadataWalker extends NgWalker {
    private rule;
    constructor(sourceFile: ts.SourceFile, rule: Rule);
    visitNgPipe(controller: ts.ClassDeclaration, decorator: ts.Decorator): void;
    private validateProperties(className, pipe);
    private extractArgument(pipe);
    private validateProperty(className, property);
    private createFailureArray(className, pipeName);
}
