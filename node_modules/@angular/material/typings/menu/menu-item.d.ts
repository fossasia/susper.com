/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption } from '@angular/cdk/a11y';
import { ElementRef, OnDestroy } from '@angular/core';
import { CanDisable } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
/** @docs-private */
export declare class MatMenuItemBase {
}
export declare const _MatMenuItemMixinBase: (new (...args: any[]) => CanDisable) & typeof MatMenuItemBase;
/**
 * This directive is intended to be used inside an mat-menu tag.
 * It exists mostly to set the role attribute.
 */
export declare class MatMenuItem extends _MatMenuItemMixinBase implements FocusableOption, CanDisable, OnDestroy {
    private _elementRef;
    /** Stream that emits when the menu item is hovered. */
    hover: Subject<MatMenuItem>;
    /** Whether the menu item is highlighted. */
    _highlighted: boolean;
    /** Whether the menu item acts as a trigger for a sub-menu. */
    _triggersSubmenu: boolean;
    constructor(_elementRef: ElementRef);
    /** Focuses the menu item. */
    focus(): void;
    ngOnDestroy(): void;
    /** Used to set the `tabindex`. */
    _getTabIndex(): string;
    /** Returns the host DOM element. */
    _getHostElement(): HTMLElement;
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event: Event): void;
    /** Emits to the hover stream. */
    _emitHoverEvent(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
}
