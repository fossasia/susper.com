import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { TemplateAst } from '../template_parser/template_ast';
import { CompileView } from './compile_view';
export declare function bindView(view: CompileView, parsedTemplate: TemplateAst[], schemaRegistry: ElementSchemaRegistry): void;
