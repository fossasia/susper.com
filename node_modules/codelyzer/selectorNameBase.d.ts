import * as Lint from 'tslint';
import * as ts from 'typescript';
import * as compiler from '@angular/compiler';
import { IOptions } from 'tslint';
export declare type SelectorType = 'element' | 'attribute';
export declare type SelectorTypeInternal = 'element' | 'attrs';
export declare type SelectorStyle = 'kebab-case' | 'camelCase';
export declare abstract class SelectorRule extends Lint.Rules.AbstractRule {
    handleType: string;
    prefixes: string[];
    types: SelectorTypeInternal[];
    style: SelectorStyle[];
    constructor(options: IOptions);
    validateType(selectors: compiler.CssSelector[]): boolean;
    validateStyle(selectors: compiler.CssSelector[]): boolean;
    validatePrefix(selectors: compiler.CssSelector[]): boolean;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
    abstract getTypeFailure(): string;
    abstract getStyleFailure(): string;
    abstract getPrefixFailure(prefixes: string[]): string;
    private getValidSelectors(selectors);
}
export declare class SelectorValidatorWalker extends Lint.RuleWalker {
    private rule;
    constructor(sourceFile: ts.SourceFile, rule: SelectorRule);
    visitClassDeclaration(node: ts.ClassDeclaration): void;
    private validateDecorator(className, decorator);
    private validateSelector(className, arg);
    private validateProperty(p);
    private isSupportedKind(kind);
    private extractMainSelector(i);
}
