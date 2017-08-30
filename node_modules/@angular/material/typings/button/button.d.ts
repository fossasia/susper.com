/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { FocusOriginMonitor } from '../core';
import { CanDisable } from '../core/common-behaviors/disabled';
import { CanColor } from '../core/common-behaviors/color';
import { CanDisableRipple } from '../core/common-behaviors/disable-ripple';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdRaisedButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdIconButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdFab {
    constructor(button: MdButton, anchor: MdAnchor);
}
/**
 * Directive that targets mini-fab buttons and anchors. It's used to apply the `mat-` class
 * to all mini-fab buttons and also is responsible for setting the default color palette.
 * @docs-private
 */
export declare class MdMiniFab {
    constructor(button: MdButton, anchor: MdAnchor);
}
/** @docs-private */
export declare class MdButtonBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdButtonMixinBase: (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisable) & (new (...args: any[]) => CanDisableRipple) & typeof MdButtonBase;
/**
 * Material design button.
 */
export declare class MdButton extends _MdButtonMixinBase implements OnDestroy, CanDisable, CanColor, CanDisableRipple {
    private _platform;
    private _focusOriginMonitor;
    /** Whether the button is round. */
    _isRoundButton: boolean;
    /** Whether the button is icon button. */
    _isIconButton: boolean;
    constructor(renderer: Renderer2, elementRef: ElementRef, _platform: Platform, _focusOriginMonitor: FocusOriginMonitor);
    ngOnDestroy(): void;
    /** Focuses the button. */
    focus(): void;
    _getHostElement(): any;
    _isRippleDisabled(): boolean;
    /**
     * Gets whether the button has one of the given attributes
     * with either an 'md-' or 'mat-' prefix.
     */
    _hasAttributeWithPrefix(...unprefixedAttributeNames: string[]): boolean;
}
/**
 * Raised Material design button.
 */
export declare class MdAnchor extends MdButton {
    constructor(platform: Platform, focusOriginMonitor: FocusOriginMonitor, elementRef: ElementRef, renderer: Renderer2);
    _haltDisabledEvents(event: Event): void;
}
