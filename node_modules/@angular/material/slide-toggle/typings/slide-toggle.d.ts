/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { CanColor, CanDisable, CanDisableRipple, HammerInput, HasTabIndex, MatRipple } from '@angular/material/core';
import { ControlValueAccessor } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
export declare const MAT_SLIDE_TOGGLE_VALUE_ACCESSOR: any;
/** Change event object emitted by a MatSlideToggle. */
export declare class MatSlideToggleChange {
    source: MatSlideToggle;
    checked: boolean;
}
/** @docs-private */
export declare class MatSlideToggleBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MatSlideToggleMixinBase: (new (...args: any[]) => HasTabIndex) & (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisableRipple) & (new (...args: any[]) => CanDisable) & typeof MatSlideToggleBase;
/** Represents a slidable "switch" toggle that can be moved between on and off. */
export declare class MatSlideToggle extends _MatSlideToggleMixinBase implements OnDestroy, AfterContentInit, ControlValueAccessor, CanDisable, CanColor, HasTabIndex, CanDisableRipple {
    private _platform;
    private _focusMonitor;
    private _changeDetectorRef;
    private onChange;
    private onTouched;
    private _uniqueId;
    private _slideRenderer;
    private _required;
    private _checked;
    /** Reference to the focus state ripple. */
    private _focusRipple;
    /** Name value will be applied to the input element if present */
    name: string | null;
    /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
    id: string;
    /** Whether the label should appear after or before the slide-toggle. Defaults to 'after' */
    labelPosition: 'before' | 'after';
    /** Whether the slide-toggle element is checked or not */
    /** Used to set the aria-label attribute on the underlying input element. */
    ariaLabel: string | null;
    /** Used to set the aria-labelledby attribute on the underlying input element. */
    ariaLabelledby: string | null;
    /** Whether the slide-toggle is required. */
    required: boolean;
    /** Whether the slide-toggle element is checked or not */
    checked: boolean;
    /** An event will be dispatched each time the slide-toggle changes its value. */
    change: EventEmitter<MatSlideToggleChange>;
    /** Returns the unique id for the visual hidden input. */
    readonly inputId: string;
    /** Reference to the underlying input element. */
    _inputElement: ElementRef;
    /** Reference to the ripple directive on the thumb container. */
    _ripple: MatRipple;
    constructor(elementRef: ElementRef, renderer: Renderer2, _platform: Platform, _focusMonitor: FocusMonitor, _changeDetectorRef: ChangeDetectorRef, tabIndex: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * This function will called if the underlying input changed its value through user interaction.
     */
    _onChangeEvent(event: Event): void;
    _onInputClick(event: Event): void;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    /** Focuses the slide-toggle. */
    focus(): void;
    /** Toggles the checked state of the slide-toggle. */
    toggle(): void;
    /** Function is called whenever the focus changes for the input element. */
    private _onInputFocusChange(focusOrigin);
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     */
    private _emitChangeEvent();
    _onDragStart(): void;
    _onDrag(event: HammerInput): void;
    _onDragEnd(): void;
    /** Method being called whenever the label text changes. */
    _onLabelTextChange(): void;
}
