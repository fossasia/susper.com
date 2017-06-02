import { CompileNgModuleMetadata, CompileProviderMetadata } from './compile_metadata';
import * as o from './output/output_ast';
/**
 * This is currently not read, but will probably be used in the future.
 * We keep it as we already pass it through all the rigth places...
 */
export declare class ComponentFactoryDependency {
    compType: any;
    constructor(compType: any);
}
export declare class NgModuleCompileResult {
    statements: o.Statement[];
    ngModuleFactoryVar: string;
    dependencies: ComponentFactoryDependency[];
    constructor(statements: o.Statement[], ngModuleFactoryVar: string, dependencies: ComponentFactoryDependency[]);
}
export declare class NgModuleCompiler {
    compile(ngModuleMeta: CompileNgModuleMetadata, extraProviders: CompileProviderMetadata[]): NgModuleCompileResult;
}
