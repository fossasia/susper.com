import { CompileDirectiveMetadata, CompilePipeSummary } from '../compile_metadata';
import { CompilerConfig } from '../config';
import * as o from '../output/output_ast';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { TemplateAst } from '../template_parser/template_ast';
export declare class ViewCompileResult {
    statements: o.Statement[];
    viewClassVar: string;
    rendererTypeVar: string;
    constructor(statements: o.Statement[], viewClassVar: string, rendererTypeVar: string);
}
export declare class ViewCompiler {
    private _genConfigNext;
    private _schemaRegistry;
    constructor(_genConfigNext: CompilerConfig, _schemaRegistry: ElementSchemaRegistry);
    compileComponent(component: CompileDirectiveMetadata, template: TemplateAst[], styles: o.Expression, usedPipes: CompilePipeSummary[]): ViewCompileResult;
}
