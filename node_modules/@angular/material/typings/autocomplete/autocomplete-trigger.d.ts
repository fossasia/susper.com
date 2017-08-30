/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, InjectionToken, NgZone, OnDestroy, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, RepositionScrollStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { MdFormField } from '../form-field/index';
import { MdOption, MdOptionSelectionChange } from '../core/option/option';
import { MdAutocomplete } from './autocomplete';
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the scrollTop of the panel. Because we are not
 * actually focusing the active item, scroll must be handled manually.
 */
/** The height of each autocomplete option. */
export declare const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/** The total height of the autocomplete panel. */
export declare const AUTOCOMPLETE_PANEL_HEIGHT = 256;
/** Injection token that determines the scroll handling while the autocomplete panel is open. */
export declare const MD_AUTOCOMPLETE_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy;
/** @docs-private */
export declare const MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: typeof Overlay[];
    useFactory: (overlay: Overlay) => () => RepositionScrollStrategy;
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * @docs-private
 */
export declare const MD_AUTOCOMPLETE_VALUE_ACCESSOR: any;
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 */
export declare function getMdAutocompleteMissingPanelError(): Error;
export declare class MdAutocompleteTrigger implements ControlValueAccessor, OnDestroy {
    private _element;
    private _overlay;
    private _viewContainerRef;
    private _zone;
    private _changeDetectorRef;
    private _scrollStrategy;
    private _dir;
    private _formField;
    private _document;
    private _overlayRef;
    private _portal;
    private _panelOpen;
    /** Strategy that is used to position the panel. */
    private _positionStrategy;
    /** Whether or not the placeholder state is being overridden. */
    private _manuallyFloatingPlaceholder;
    /** The subscription for closing actions (some are bound to document). */
    private _closingActionsSubscription;
    /** View -> model callback called when value changes */
    _onChange: (value: any) => void;
    /** View -> model callback called when autocomplete has been touched */
    _onTouched: () => void;
    autocomplete: MdAutocomplete;
    /** Property with mat- prefix for no-conflict mode. */
    _matAutocomplete: MdAutocomplete;
    constructor(_element: ElementRef, _overlay: Overlay, _viewContainerRef: ViewContainerRef, _zone: NgZone, _changeDetectorRef: ChangeDetectorRef, _scrollStrategy: any, _dir: Directionality, _formField: MdFormField, _document: any);
    ngOnDestroy(): void;
    readonly panelOpen: boolean;
    /** Opens the autocomplete suggestion panel. */
    openPanel(): void;
    /** Closes the autocomplete suggestion panel. */
    closePanel(): void;
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     */
    readonly panelClosingActions: Observable<MdOptionSelectionChange>;
    /** Stream of autocomplete option selections. */
    readonly optionSelections: Observable<MdOptionSelectionChange>;
    /** The currently active option, coerced to MdOption type. */
    readonly activeOption: MdOption | null;
    /** Stream of clicks outside of the autocomplete panel. */
    private readonly _outsideClickStream;
    /**
     * Sets the autocomplete's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value: any): void;
    /**
     * Saves a callback function to be invoked when the autocomplete's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn: (value: any) => {}): void;
    /**
     * Saves a callback function to be invoked when the autocomplete is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn: () => {}): void;
    _handleKeydown(event: KeyboardEvent): void;
    _handleInput(event: KeyboardEvent): void;
    _handleFocus(): void;
    /**
     * In "auto" mode, the placeholder will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the placeholder until the panel can be closed.
     * @param shouldAnimate Whether the placeholder should be animated when it is floated.
     */
    private _floatPlaceholder(shouldAnimate?);
    /** If the placeholder has been manually elevated, return it to its normal state. */
    private _resetPlaceholder();
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     */
    private _scrollToOption();
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    private _subscribeToClosingActions();
    /** Destroys the autocomplete suggestion panel. */
    private _destroyPanel();
    private _setTriggerValue(value);
    /**
    * This method closes the panel, and if a value is specified, also sets the associated
    * control to that value. It will also mark the control as dirty if this interaction
    * stemmed from the user.
    */
    private _setValueAndClose(event);
    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    private _clearPreviousSelectedOption(skip);
    private _attachOverlay();
    private _getOverlayConfig();
    private _getOverlayPosition();
    private _getConnectedElement();
    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth();
    /** Reset active item to -1 so arrow events will activate the correct options.*/
    private _resetActiveItem();
}
