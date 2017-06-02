import { OutputEmitter } from './abstract_emitter';
import * as o from './output_ast';
import { ImportResolver } from './path_util';
export declare function debugOutputAstAsTypeScript(ast: o.Statement | o.Expression | o.Type | any[]): string;
export declare class TypeScriptEmitter implements OutputEmitter {
    private _importResolver;
    constructor(_importResolver: ImportResolver);
    emitStatements(srcFilePath: string, genFilePath: string, stmts: o.Statement[], exportedVars: string[], preamble?: string): string;
}
