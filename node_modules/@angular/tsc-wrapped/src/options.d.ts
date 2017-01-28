/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
interface Options extends ts.CompilerOptions {
    genDir?: string;
    basePath?: string;
    skipMetadataEmit?: boolean;
    strictMetadataEmit?: boolean;
    skipTemplateCodegen?: boolean;
    generateCodeForLibraries?: boolean;
    annotateForClosureCompiler?: boolean;
    annotationsAs?: 'decorators' | 'static fields';
    trace?: boolean;
    debug?: boolean;
}
export default Options;
