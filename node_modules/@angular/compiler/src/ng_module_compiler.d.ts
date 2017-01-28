/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileIdentifierMetadata, CompileNgModuleMetadata, CompileProviderMetadata } from './compile_metadata';
import * as o from './output/output_ast';
export declare class ComponentFactoryDependency {
    comp: CompileIdentifierMetadata;
    placeholder: CompileIdentifierMetadata;
    constructor(comp: CompileIdentifierMetadata, placeholder: CompileIdentifierMetadata);
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
