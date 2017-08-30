/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, QueryList } from '@angular/core';
import { FloatPlaceholderType, PlaceholderOptions } from '../core/placeholder/placeholder-options';
import { MdError } from './error';
import { MdFormFieldControl } from './form-field-control';
import { MdHint } from './hint';
import { MdPlaceholder } from './placeholder';
import { MdPrefix } from './prefix';
import { MdSuffix } from './suffix';
/** Container for form controls that applies Material Design styling and behavior. */
export declare class MdFormField implements AfterViewInit, AfterContentInit, AfterContentChecked {
    _elementRef: ElementRef;
    private _changeDetectorRef;
    private _placeholderOptions;
    /** Color of the form field underline, based on the theme. */
    color: 'primary' | 'accent' | 'warn';
    /** @deprecated Use `color` instead. */
    dividerColor: "primary" | "accent" | "warn";
    /** Whether the required marker should be hidden. */
    hideRequiredMarker: any;
    private _hideRequiredMarker;
    /** Override for the logic that disables the placeholder animation in certain cases. */
    private _showAlwaysAnimate;
    /** Whether the floating label should always float or not. */
    readonly _shouldAlwaysFloat: boolean;
    /** Whether the placeholder can float or not. */
    readonly _canPlaceholderFloat: boolean;
    /** State of the md-hint and md-error animations. */
    _subscriptAnimationState: string;
    /** Text for the form field hint. */
    hintLabel: string;
    private _hintLabel;
    _hintLabelId: string;
    /** Whether the placeholder should always float, never float or float as the user types. */
    floatPlaceholder: FloatPlaceholderType;
    private _floatPlaceholder;
    /** Reference to the form field's underline element. */
    underlineRef: ElementRef;
    _connectionContainerRef: ElementRef;
    private _placeholder;
    _control: MdFormFieldControl<any>;
    _placeholderChild: MdPlaceholder;
    _errorChildren: QueryList<MdError>;
    _hintChildren: QueryList<MdHint>;
    _prefixChildren: QueryList<MdPrefix>;
    _suffixChildren: QueryList<MdSuffix>;
    constructor(_elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, placeholderOptions: PlaceholderOptions);
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    _shouldForward(prop: string): boolean;
    /** Whether the form field has a placeholder. */
    _hasPlaceholder(): boolean;
    /** Determines whether to display hints or errors. */
    _getDisplayedMessages(): 'error' | 'hint';
    /** Animates the placeholder up and locks it in position. */
    _animateAndLockPlaceholder(): void;
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `md-placeholder` directive).
     */
    private _validatePlaceholders();
    /** Does any extra processing that is required when handling the hints. */
    private _processHints();
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    private _validateHints();
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    private _syncDescribedByIds();
    /** Throws an error if the form field's control is missing. */
    protected _validateControlChild(): void;
}
