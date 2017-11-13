import { SelectorRule } from './selectorNameBase';
import * as Lint from 'tslint';
export declare class Rule extends SelectorRule {
    static metadata: Lint.IRuleMetadata;
    handleType: string;
    getTypeFailure(): string;
    getStyleFailure(): string;
    getPrefixFailure(prefixes: string[]): string;
}
