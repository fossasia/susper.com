import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { FloatPlaceholderType, PlaceholderOptions } from '@angular/material/core';
import { MatError } from './error';
import { MatFormFieldControl } from './form-field-control';
import { MatHint } from './hint';
import { MatPlaceholder } from './placeholder';
import { MatPrefix } from './prefix';
import { MatSuffix } from './suffix';
/** Container for form controls that applies Material Design styling and behavior. */
export declare class MatFormField implements AfterViewInit, AfterContentInit, AfterContentChecked {
    _elementRef: ElementRef;
    private _renderer;
    private _changeDetectorRef;
    private _placeholderOptions;
    /** Color of the form field underline, based on the theme. */
    color: 'primary' | 'accent' | 'warn';
    /** @deprecated Use `color` instead. */
    dividerColor: 'primary' | 'accent' | 'warn';
    /** Whether the required marker should be hidden. */
    hideRequiredMarker: any;
    private _hideRequiredMarker;
    /** Override for the logic that disables the placeholder animation in certain cases. */
    private _showAlwaysAnimate;
    /** Whether the floating label should always float or not. */
    readonly _shouldAlwaysFloat: boolean;
    /** Whether the placeholder can float or not. */
    readonly _canPlaceholderFloat: boolean;
    /** State of the mat-hint and mat-error animations. */
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
    _control: MatFormFieldControl<any>;
    _placeholderChild: MatPlaceholder;
    _errorChildren: QueryList<MatError>;
    _hintChildren: QueryList<MatHint>;
    _prefixChildren: QueryList<MatPrefix>;
    _suffixChildren: QueryList<MatSuffix>;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _changeDetectorRef: ChangeDetectorRef, placeholderOptions: PlaceholderOptions);
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
     * or child element with the `mat-placeholder` directive).
     */
    private _validatePlaceholders();
    /** Does any extra processing that is required when handling the hints. */
    private _processHints();
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
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
