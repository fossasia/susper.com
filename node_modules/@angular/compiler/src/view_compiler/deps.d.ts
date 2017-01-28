/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileIdentifierMetadata } from '../compile_metadata';
export declare class ViewClassDependency {
    comp: CompileIdentifierMetadata;
    name: string;
    placeholder: CompileIdentifierMetadata;
    constructor(comp: CompileIdentifierMetadata, name: string, placeholder: CompileIdentifierMetadata);
}
export declare class ComponentFactoryDependency {
    comp: CompileIdentifierMetadata;
    placeholder: CompileIdentifierMetadata;
    constructor(comp: CompileIdentifierMetadata, placeholder: CompileIdentifierMetadata);
}
export declare class DirectiveWrapperDependency {
    dir: CompileIdentifierMetadata;
    name: string;
    placeholder: CompileIdentifierMetadata;
    constructor(dir: CompileIdentifierMetadata, name: string, placeholder: CompileIdentifierMetadata);
}
