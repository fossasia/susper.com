/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Constructor } from './constructor';
import { CanDisable } from './disabled';
/** @docs-private */
export interface HasTabIndex {
    tabIndex: number;
}
/** Mixin to augment a directive with a `tabIndex` property. */
export declare function mixinTabIndex<T extends Constructor<CanDisable>>(base: T, defaultTabIndex?: number): Constructor<HasTabIndex> & T;
