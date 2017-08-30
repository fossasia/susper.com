/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { CanDisable } from '../core/common-behaviors/disabled';
/** @docs-private */
export declare class MdTabLabelWrapperBase {
}
export declare const _MdTabLabelWrapperMixinBase: (new (...args: any[]) => CanDisable) & typeof MdTabLabelWrapperBase;
/**
 * Used in the `md-tab-group` view to display tab labels.
 * @docs-private
 */
export declare class MdTabLabelWrapper extends _MdTabLabelWrapperMixinBase implements CanDisable {
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    /** Sets focus on the wrapper element */
    focus(): void;
    getOffsetLeft(): number;
    getOffsetWidth(): number;
}
