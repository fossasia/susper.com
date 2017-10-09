/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { CanDisableRipple, MatLine } from '@angular/material/core';
/** @docs-private */
export declare class MatListBase {
}
export declare const _MatListMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MatListBase;
/** @docs-private */
export declare class MatListItemBase {
}
export declare const _MatListItemMixinBase: (new (...args: any[]) => CanDisableRipple) & typeof MatListItemBase;
/** Divider between items within a list. */
export declare class MatListDivider {
}
/** A Material Design list component. */
export declare class MatList extends _MatListMixinBase implements CanDisableRipple {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatNavListCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatDividerCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListAvatarCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListIconCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MatListSubheaderCssMatStyler {
}
/** An item within a Material Design list. */
export declare class MatListItem extends _MatListItemMixinBase implements AfterContentInit, CanDisableRipple {
    private _renderer;
    private _element;
    private _list;
    private _lineSetter;
    private _isNavList;
    _lines: QueryList<MatLine>;
    _hasAvatar: MatListAvatarCssMatStyler;
    constructor(_renderer: Renderer2, _element: ElementRef, _list: MatList, navList: MatNavListCssMatStyler);
    ngAfterContentInit(): void;
    /** Whether this list item should show a ripple effect when clicked.  */
    _isRippleDisabled(): boolean;
    _handleFocus(): void;
    _handleBlur(): void;
    /** Retrieves the DOM element of the component host. */
    _getHostElement(): HTMLElement;
}
