/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, Optional, InjectionToken } from '@angular/core';
export declare type Direction = 'ltr' | 'rtl';
/**
 * Injection token used to inject the document into Directionality.
 * This is used so that the value can be faked in tests.
 *
 * We can't use the real document in tests because changing the real `dir` causes geometry-based
 * tests in Safari to fail.
 *
 * We also can't re-provide the DOCUMENT token from platform-brower because the unit tests
 * themselves use things like `querySelector` in test code.
 */
export declare const DIR_DOCUMENT: InjectionToken<Document>;
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
export declare class Directionality {
    readonly value: Direction;
    readonly change: EventEmitter<void>;
    constructor(_document?: any);
}
/** @docs-private */
export declare function DIRECTIONALITY_PROVIDER_FACTORY(parentDirectionality: any, _document: any): any;
/** @docs-private */
export declare const DIRECTIONALITY_PROVIDER: {
    provide: typeof Directionality;
    deps: Optional[][];
    useFactory: (parentDirectionality: any, _document: any) => any;
};
