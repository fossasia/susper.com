/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, OnDestroy, OnInit, QueryList, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ConnectedOverlayDirective, Overlay, RepositionScrollStrategy, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { SelectionModel } from '@angular/cdk/collections';
import { CanColor } from '../core/common-behaviors/color';
import { CanDisable } from '../core/common-behaviors/disabled';
import { MdOptgroup, MdOption, MdOptionSelectionChange } from '../core/option/index';
import { FloatPlaceholderType, PlaceholderOptions } from '../core/placeholder/placeholder-options';
import { Platform } from '@angular/cdk/platform';
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */
/** The fixed height of every option element (option, group header etc.). */
export declare const SELECT_ITEM_HEIGHT = 48;
/** The max height of the select's overlay panel */
export declare const SELECT_PANEL_MAX_HEIGHT = 256;
/** The max number of options visible at once in the select panel. */
export declare const SELECT_MAX_OPTIONS_DISPLAYED: number;
/** The fixed height of the select's trigger element. */
export declare const SELECT_TRIGGER_HEIGHT = 30;
/**
 * Must adjust for the difference in height between the option and the trigger,
 * so the text will align on the y axis.
 */
export declare const SELECT_OPTION_HEIGHT_ADJUSTMENT: number;
/** The panel's padding on the x-axis */
export declare const SELECT_PANEL_PADDING_X = 16;
/** The panel's x axis padding if it is indented (e.g. there is an option group). */
export declare const SELECT_PANEL_INDENT_PADDING_X: number;
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * (SELECT_PADDING * 1.75) + 20 = 48
 * The padding is multiplied by 1.75 because the checkbox's margin is half the padding, and
 * the browser adds ~4px, because we're using inline elements.
 * The checkbox width is 20px.
 */
export declare const SELECT_MULTIPLE_PANEL_PADDING_X: number;
/**
 * The panel's padding on the y-axis. This padding indicates there are more
 * options available if you scroll.
 */
export declare const SELECT_PANEL_PADDING_Y = 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
export declare const SELECT_PANEL_VIEWPORT_PADDING = 8;
/** Injection token that determines the scroll handling while a select is open. */
export declare const MD_SELECT_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MD_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MD_SELECT_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => RepositionScrollStrategy;
};
/** Change event object that is emitted when the select value has changed. */
export declare class MdSelectChange {
    source: MdSelect;
    value: any;
    constructor(source: MdSelect, value: any);
}
/** @docs-private */
export declare class MdSelectBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdSelectMixinBase: (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisable) & typeof MdSelectBase;
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
export declare class MdSelectTrigger {
}
export declare class MdSelect extends _MdSelectMixinBase implements AfterContentInit, OnDestroy, OnInit, ControlValueAccessor, CanColor, CanDisable {
    private _viewportRuler;
    private _changeDetectorRef;
    private _overlay;
    private _platform;
    private _dir;
    private _parentForm;
    private _parentFormGroup;
    _control: NgControl;
    private _scrollStrategyFactory;
    /** Whether or not the overlay panel is open. */
    private _panelOpen;
    /** Subscriptions to option events. */
    private _optionSubscription;
    /** Subscription to changes in the option list. */
    private _changeSubscription;
    /** Subscription to tab events while overlay is focused. */
    private _tabSubscription;
    /** Whether filling out the select is required in the form.  */
    private _required;
    /** The scroll position of the overlay panel, calculated to center the selected option. */
    private _scrollTop;
    /** The placeholder displayed in the trigger of the select. */
    private _placeholder;
    /** Whether the component is in multiple selection mode. */
    private _multiple;
    /** Comparison function to specify which option is displayed. Defaults to object equality. */
    private _compareWith;
    /** Deals with the selection logic. */
    _selectionModel: SelectionModel<MdOption>;
    /** The animation state of the placeholder. */
    private _placeholderState;
    /** Tab index for the element. */
    private _tabIndex;
    /** Deals with configuring placeholder options */
    private _placeholderOptions;
    /**
     * The width of the trigger. Must be saved to set the min width of the overlay panel
     * and the width of the selected value.
     */
    _triggerWidth: number;
    /** Manages keyboard events for options in the panel. */
    _keyManager: FocusKeyManager<MdOption>;
    /**
     * The width of the selected option's value. Must be set programmatically
     * to ensure its overflow is clipped, as it's absolutely positioned.
     */
    _selectedValueWidth: number;
    /** View -> model callback called when value changes */
    _onChange: (value: any) => void;
    /** View -> model callback called when select has been touched */
    _onTouched: () => void;
    /** The IDs of child options to be passed to the aria-owns attribute. */
    _optionIds: string;
    /** The value of the select panel's transform-origin property. */
    _transformOrigin: string;
    /** Whether the panel's animation is done. */
    _panelDoneAnimating: boolean;
    /** Strategy that will be used to handle scrolling while the select panel is open. */
    _scrollStrategy: any;
    /**
     * The y-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text.
     * when the panel opens. Will change based on the y-position of the selected option.
     */
    _offsetY: number;
    /**
     * This position config ensures that the top "start" corner of the overlay
     * is aligned with with the top "start" of the origin by default (overlapping
     * the trigger completely). If the panel cannot fit below the trigger, it
     * will fall back to a position above the trigger.
     */
    _positions: {
        originX: string;
        originY: string;
        overlayX: string;
        overlayY: string;
    }[];
    /** Trigger that opens the select. */
    trigger: ElementRef;
    /** Overlay pane containing the options. */
    overlayDir: ConnectedOverlayDirective;
    /** All of the defined select options. */
    options: QueryList<MdOption>;
    /** All of the defined groups of options. */
    optionGroups: QueryList<MdOptgroup>;
    /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
    panelClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    /** User-supplied override of the trigger element. */
    customTrigger: MdSelectTrigger;
    /** Placeholder to be shown if no value has been selected. */
    placeholder: string;
    /** Whether the component is required. */
    required: any;
    /** Whether the user should be allowed to select multiple options. */
    multiple: boolean;
    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    compareWith: (o1: any, o2: any) => boolean;
    /** Whether to float the placeholder text. */
    floatPlaceholder: FloatPlaceholderType;
    private _floatPlaceholder;
    /** Tab index for the select element. */
    tabIndex: number;
    /** Value of the select control. */
    value: any;
    private _value;
    /** Whether ripples for all options in the select are disabled. */
    disableRipple: boolean;
    private _disableRipple;
    /** Aria label of the select. If not specified, the placeholder will be used as label. */
    ariaLabel: string;
    /** Input that can be used to specify the `aria-labelledby` attribute. */
    ariaLabelledby: string;
    /** Combined stream of all of the child options' change events. */
    readonly optionSelectionChanges: Observable<MdOptionSelectionChange>;
    /** Event emitted when the select has been opened. */
    onOpen: EventEmitter<void>;
    /** Event emitted when the select has been closed. */
    onClose: EventEmitter<void>;
    /** Event emitted when the selected value has been changed by the user. */
    change: EventEmitter<MdSelectChange>;
    /**
     * Event that emits whenever the raw value of the select changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    valueChange: EventEmitter<any>;
    constructor(_viewportRuler: ViewportRuler, _changeDetectorRef: ChangeDetectorRef, _overlay: Overlay, _platform: Platform, renderer: Renderer2, elementRef: ElementRef, _dir: Directionality, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _control: NgControl, tabIndex: string, placeholderOptions: PlaceholderOptions, _scrollStrategyFactory: any);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Toggles the overlay panel open or closed. */
    toggle(): void;
    /** Opens the overlay panel. */
    open(): void;
    /** Closes the overlay panel and focuses the host element. */
    close(): void;
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value: any): void;
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn: () => {}): void;
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    /** Whether or not the overlay panel is open. */
    readonly panelOpen: boolean;
    /** The currently selected option. */
    readonly selected: MdOption | MdOption[];
    /** The value displayed in the trigger. */
    readonly triggerValue: string;
    /** Whether the element is in RTL mode. */
    _isRtl(): boolean;
    /**
     * Sets the width of the trigger element. This is necessary to match
     * the overlay width to the trigger width.
     */
    private _setTriggerWidth();
    /** Handles the keyboard interactions of a closed select. */
    _handleClosedKeydown(event: KeyboardEvent): void;
    /** Handles keypresses inside the panel. */
    _handlePanelKeydown(event: KeyboardEvent): void;
    /**
     * When the panel element is finished transforming in (though not fading in), it
     * emits an event and focuses an option if the panel is open.
     */
    _onPanelDone(): void;
    /**
     * When the panel content is done fading in, the _panelDoneAnimating property is
     * set so the proper class can be added to the panel.
     */
    _onFadeInDone(): void;
    /**
     * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
     * "blur" to the panel when it opens, causing a false positive.
     */
    _onBlur(): void;
    /**
     * Callback that is invoked when the overlay panel has been attached.
     */
    _onAttached(): void;
    /** Whether the select has a value. */
    _hasValue(): boolean;
    /** Whether the select is in an error state. */
    _isErrorState(): boolean;
    /**
     * Sets the scroll position of the scroll container. This must be called after
     * the overlay pane is attached or the scroll container element will not yet be
     * present in the DOM.
     */
    private _setScrollTop();
    private _initializeSelection();
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     */
    private _setSelectionByValue(value, isUserInput?);
    /**
     * Finds and selects and option based on its value.
     * @returns Option that has the corresponding value.
     */
    private _selectValue(value, isUserInput?);
    /**
     * Clears the select trigger and deselects every option in the list.
     * @param skip Option that should not be deselected.
     */
    private _clearSelection(skip?);
    private _getTriggerRect();
    /** Sets up a key manager to listen to keyboard events on the overlay panel. */
    private _initKeyManager();
    /** Drops current option subscriptions and IDs and resets from scratch. */
    private _resetOptions();
    /** Listens to user-generated selection events on each option. */
    private _listenToOptions();
    /** Invoked when an option is clicked. */
    private _onSelect(option);
    /**
     * Sorts the model values, ensuring that they keep the same
     * order that they have in the panel.
     */
    private _sortValues();
    /** Unsubscribes from all option subscriptions. */
    private _dropSubscriptions();
    /** Emits change event to set the model value. */
    private _propagateChanges(fallbackValue?);
    /** Records option IDs to pass to the aria-owns property. */
    private _setOptionIds();
    /**
     * Sets the `multiple` property on each option. The promise is necessary
     * in order to avoid Angular errors when modifying the property after init.
     */
    private _setOptionMultiple();
    /** Sets the `disableRipple` property on each option. */
    private _setOptionDisableRipple();
    /**
     * Must set the width of the selected option's value programmatically
     * because it is absolutely positioned and otherwise will not clip
     * overflow. The selection arrow is 9px wide, add 4px of padding = 13
     */
    private _setValueWidth();
    /**
     * Focuses the selected item. If no option is selected, it will focus
     * the first item instead.
     */
    private _focusCorrectOption();
    /** Focuses the select element. */
    focus(): void;
    /** Gets the index of the provided option in the option list. */
    private _getOptionIndex(option);
    /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
    private _calculateOverlayPosition();
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     */
    _calculateOverlayScroll(selectedIndex: number, scrollBuffer: number, maxScroll: number): number;
    /**
     * Figures out the appropriate animation state for the placeholder.
     */
    _getPlaceholderAnimationState(): string;
    /**
     * Determines the CSS `opacity` of the placeholder element.
     */
    _getPlaceholderOpacity(): string;
    /** Returns the aria-label of the select component. */
    readonly _ariaLabel: string | null;
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     */
    private _calculateOverlayOffsetX();
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     */
    private _calculateOverlayOffsetY(selectedIndex, scrollBuffer, maxScroll);
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     */
    private _checkOverlayWithinViewport(maxScroll);
    /** Adjusts the overlay panel up to fit in the viewport. */
    private _adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
    /** Adjusts the overlay panel down to fit in the viewport. */
    private _adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
    /** Sets the transform origin point based on the selected option. */
    private _getOriginBasedOnOption();
    /** Figures out the floating placeholder state value. */
    private _floatPlaceholderState();
    /** Handles the user pressing the arrow keys on a closed select.  */
    private _handleArrowKey(event);
    /** Calculates the amount of items in the select. This includes options and group labels. */
    private _getItemCount();
}
