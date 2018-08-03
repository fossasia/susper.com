/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { Direction, Directionality } from './directionality';
/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Would provide itself in case a component looks for the Directionality service
 */
export declare class Dir implements Directionality {
    /** Layout direction of the element. */
    _dir: Direction;
    /** Whether the `value` has been set to its initial value. */
    private _isInitialized;
    /** Event emitted when the direction changes. */
    change: EventEmitter<void>;
    /** @docs-private */
    dir: Direction;
    /** Current layout direction of the element. */
    readonly value: Direction;
    /** Initialize once default value has been set. */
    ngAfterContentInit(): void;
}
