import * as ts from 'typescript';
import { RuleWalker, RuleFailure, IOptions, Fix, Replacement } from 'tslint';
import { CodeWithSourceMap } from './metadata';
export declare function isLineBreak(ch: number): boolean;
export declare class SourceMappingVisitor extends RuleWalker {
    protected codeWithMap: CodeWithSourceMap;
    protected basePosition: number;
    private consumer;
    constructor(sourceFile: ts.SourceFile, options: IOptions, codeWithMap: CodeWithSourceMap, basePosition: number);
    createFailure(s: number, l: number, message: string, fix?: Fix): RuleFailure;
    createReplacement(s: number, l: number, replacement: string): Replacement;
    getSourcePosition(pos: number): number;
    private getMappedInterval(start, length);
}
