import * as Lint from 'tslint';
import * as ts from 'typescript';
import { IOptions } from 'tslint';
export interface IUsePropertyDecoratorConfig {
    propertyName: string;
    decoratorName: string | string[];
    errorMessage: string;
}
export declare class UsePropertyDecorator extends Lint.Rules.AbstractRule {
    private config;
    static formatFailureString(config: IUsePropertyDecoratorConfig, decoratorName: string, className: string): string;
    constructor(config: IUsePropertyDecoratorConfig, options: IOptions);
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
