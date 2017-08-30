/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { MdLine } from '../core';
import { CanDisableRipple } from '../core/common-behaviors/disable-ripple';
/** @docs-private */
export declare class MdListBase {
}
export declare const _MdListMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MdListBase;
/** @docs-private */
export declare class MdListItemBase {
}
export declare const _MdListItemMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MdListItemBase;
export declare class MdListDivider {
}
export declare class MdList extends _MdListMixinBase implements CanDisableRipple {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdNavListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdDividerCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdListAvatarCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdListIconCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdListSubheaderCssMatStyler {
}
export declare class MdListItem extends _MdListItemMixinBase implements AfterContentInit, CanDisableRipple {
    private _renderer;
    private _element;
    private _list;
    private _lineSetter;
    private _isNavList;
    _lines: QueryList<MdLine>;
    _hasAvatar: MdListAvatarCssMatStyler;
    constructor(_renderer: Renderer2, _element: ElementRef, _list: MdList, navList: MdNavListCssMatStyler);
    ngAfterContentInit(): void;
    /** Whether this list item should show a ripple effect when clicked.  */
    isRippleEnabled(): boolean;
    _handleFocus(): void;
    _handleBlur(): void;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
}
