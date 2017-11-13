/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Compiler, CompilerFactory, CompilerOptions, PlatformRef, Provider, Type, ɵConsole as Console } from '@angular/core';
import { CompilerConfig } from '../config';
import * as i18n from '../i18n/index';
import { HtmlParser } from '../ml_parser/html_parser';
export declare function i18nHtmlParserFactory(parser: HtmlParser, translations: string, format: string, config: CompilerConfig, console: Console): i18n.I18NHtmlParser;
/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
export declare const COMPILER_PROVIDERS: Array<any | Type<any> | {
    [k: string]: any;
} | any[]>;
export declare class JitCompilerFactory implements CompilerFactory {
    private _defaultOptions;
    constructor(defaultOptions: CompilerOptions[]);
    createCompiler(options?: CompilerOptions[]): Compiler;
}
/**
 * A platform that included corePlatform and the compiler.
 *
 * @experimental
 */
export declare const platformCoreDynamic: (extraProviders?: Provider[] | undefined) => PlatformRef;
