/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Host, Inject, InjectionToken, Input, NgModule, NgZone, Optional, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { MdCommonModule, MdOptgroup, MdOption, MdOptionModule } from '@angular/material/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { TemplatePortal } from '@angular/cdk/portal';
import { RxChain, filter, first, map, switchMap } from '@angular/cdk/rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdFormField } from '@angular/material/form-field';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';

/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;
/**
 * Event object that is emitted when an autocomplete option is selected
 */
class MdAutocompleteSelectedEvent {
    /**
     * @param {?} source
     * @param {?} option
     */
    constructor(source, option) {
        this.source = source;
        this.option = option;
    }
}
class MdAutocomplete {
    /**
     * @param {?} _changeDetectorRef
     */
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Whether the autocomplete panel should be visible, depending on option length.
         */
        this.showPanel = false;
        /**
         * Function that maps an option's control value to its display value in the trigger.
         */
        this.displayWith = null;
        /**
         * Event that is emitted whenever an option from the list is selected.
         */
        this.optionSelected = new EventEmitter();
        /**
         * Unique ID to be used by autocomplete trigger's "aria-owns" property.
         */
        this.id = `md-autocomplete-${_uniqueAutocompleteIdCounter++}`;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     * @param {?} scrollTop
     * @return {?}
     */
    _setScrollTop(scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }
    /**
     * Returns the panel's scrollTop.
     * @return {?}
     */
    _getScrollTop() {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }
    /**
     * Panel should hide itself when the option list is empty.
     * @return {?}
     */
    _setVisibility() {
        Promise.resolve().then(() => {
            this.showPanel = !!this.options.length;
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * Emits the `select` event.
     * @param {?} option
     * @return {?}
     */
    _emitSelectEvent(option) {
        const /** @type {?} */ event = new MdAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    }
    /**
     * Sets a class on the panel based on whether it is visible.
     * @return {?}
     */
    _getClassList() {
        return {
            'mat-autocomplete-visible': this.showPanel,
            'mat-autocomplete-hidden': !this.showPanel
        };
    }
}
MdAutocomplete.decorators = [
    { type: Component, args: [{selector: 'md-autocomplete, mat-autocomplete',
                template: "<ng-template><div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_getClassList()\" #panel><ng-content></ng-content></div></ng-template>",
                styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative}.mat-autocomplete-panel:not([class*=mat-elevation-z]){box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                exportAs: 'mdAutocomplete, matAutocomplete',
                host: {
                    'class': 'mat-autocomplete'
                }
            },] },
];
/**
 * @nocollapse
 */
MdAutocomplete.ctorParameters = () => [
    { type: ChangeDetectorRef, },
];
MdAutocomplete.propDecorators = {
    'template': [{ type: ViewChild, args: [TemplateRef,] },],
    'panel': [{ type: ViewChild, args: ['panel',] },],
    'options': [{ type: ContentChildren, args: [MdOption, { descendants: true },] },],
    'optionGroups': [{ type: ContentChildren, args: [MdOptgroup,] },],
    'displayWith': [{ type: Input },],
    'optionSelected': [{ type: Output },],
};

/**
 * The height of each autocomplete option.
 */
const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 */
const AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Injection token that determines the scroll handling while the autocomplete panel is open.
 */
const MD_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('md-autocomplete-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/**
 * \@docs-private
 */
const MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER = {
    provide: MD_AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * \@docs-private
 */
const MD_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MdAutocompleteTrigger),
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @return {?}
 */
function getMdAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `md-autocomplete`. ' +
        'Make sure that the id passed to the `mdAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
}
class MdAutocompleteTrigger {
    /**
     * @param {?} _element
     * @param {?} _overlay
     * @param {?} _viewContainerRef
     * @param {?} _zone
     * @param {?} _changeDetectorRef
     * @param {?} _scrollStrategy
     * @param {?} _dir
     * @param {?} _formField
     * @param {?} _document
     */
    constructor(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, _scrollStrategy, _dir, _formField, _document) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._formField = _formField;
        this._document = _document;
        this._panelOpen = false;
        /**
         * Whether or not the placeholder state is being overridden.
         */
        this._manuallyFloatingPlaceholder = false;
        /**
         * View -> model callback called when value changes
         */
        this._onChange = () => { };
        /**
         * View -> model callback called when autocomplete has been touched
         */
        this._onTouched = () => { };
    }
    /**
     * Property with mat- prefix for no-conflict mode.
     * @return {?}
     */
    get _matAutocomplete() {
        return this.autocomplete;
    }
    /**
     * @param {?} autocomplete
     * @return {?}
     */
    set _matAutocomplete(autocomplete) {
        this.autocomplete = autocomplete;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyPanel();
    }
    /**
     * @return {?}
     */
    get panelOpen() {
        return this._panelOpen && this.autocomplete.showPanel;
    }
    /**
     * Opens the autocomplete suggestion panel.
     * @return {?}
     */
    openPanel() {
        this._attachOverlay();
        this._floatPlaceholder();
    }
    /**
     * Closes the autocomplete suggestion panel.
     * @return {?}
     */
    closePanel() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }
        this._resetPlaceholder();
        if (this._panelOpen) {
            this._panelOpen = false;
            // We need to trigger change detection manually, because
            // `fromEvent` doesn't seem to do it at the proper time.
            // This ensures that the placeholder is reset when the
            // user clicks outside.
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     * @return {?}
     */
    get panelClosingActions() {
        return merge(this.optionSelections, this.autocomplete._keyManager.tabOut, this._outsideClickStream);
    }
    /**
     * Stream of autocomplete option selections.
     * @return {?}
     */
    get optionSelections() {
        return merge(...this.autocomplete.options.map(option => option.onSelectionChange));
    }
    /**
     * The currently active option, coerced to MdOption type.
     * @return {?}
     */
    get activeOption() {
        if (this.autocomplete && this.autocomplete._keyManager) {
            return this.autocomplete._keyManager.activeItem;
        }
        return null;
    }
    /**
     * Stream of clicks outside of the autocomplete panel.
     * @return {?}
     */
    get _outsideClickStream() {
        if (!this._document) {
            return of(null);
        }
        return RxChain.from(merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'touchend'))).call(filter, (event) => {
            const /** @type {?} */ clickTarget = (event.target);
            const /** @type {?} */ formField = this._formField ?
                this._formField._elementRef.nativeElement : null;
            return this._panelOpen &&
                clickTarget !== this._element.nativeElement &&
                (!formField || !formField.contains(clickTarget)) &&
                (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
        }).result();
    }
    /**
     * Sets the autocomplete's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} value New value to be written to the model.
     * @return {?}
     */
    writeValue(value) {
        Promise.resolve(null).then(() => this._setTriggerValue(value));
    }
    /**
     * Saves a callback function to be invoked when the autocomplete's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the value changes.
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Saves a callback function to be invoked when the autocomplete is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param {?} fn Callback to be triggered when the component has been touched.
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        if (event.keyCode === ESCAPE && this.panelOpen) {
            this._resetActiveItem();
            this.closePanel();
            event.stopPropagation();
        }
        else if (this.activeOption && event.keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else {
            const /** @type {?} */ prevActiveItem = this.autocomplete._keyManager.activeItem;
            const /** @type {?} */ isArrowKey = event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW;
            if (this.panelOpen) {
                this.autocomplete._keyManager.onKeydown(event);
            }
            else if (isArrowKey) {
                this.openPanel();
            }
            Promise.resolve().then(() => {
                if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
                    this._scrollToOption();
                }
            });
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleInput(event) {
        // We need to ensure that the input is focused, because IE will fire the `input`
        // event on focus/blur/load if the input has a placeholder. See:
        // https://connect.microsoft.com/IE/feedback/details/885747/
        if (document.activeElement === event.target) {
            this._onChange(((event.target)).value);
            this.openPanel();
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        this._attachOverlay();
        this._floatPlaceholder(true);
    }
    /**
     * In "auto" mode, the placeholder will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the placeholder until the panel can be closed.
     * @param {?=} shouldAnimate Whether the placeholder should be animated when it is floated.
     * @return {?}
     */
    _floatPlaceholder(shouldAnimate = false) {
        if (this._formField && this._formField.floatPlaceholder === 'auto') {
            if (shouldAnimate) {
                this._formField._animateAndLockPlaceholder();
            }
            else {
                this._formField.floatPlaceholder = 'always';
            }
            this._manuallyFloatingPlaceholder = true;
        }
    }
    /**
     * If the placeholder has been manually elevated, return it to its normal state.
     * @return {?}
     */
    _resetPlaceholder() {
        if (this._manuallyFloatingPlaceholder) {
            this._formField.floatPlaceholder = 'auto';
            this._manuallyFloatingPlaceholder = false;
        }
    }
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     * @return {?}
     */
    _scrollToOption() {
        const /** @type {?} */ activeOptionIndex = this.autocomplete._keyManager.activeItemIndex || 0;
        const /** @type {?} */ labelCount = MdOption.countGroupLabelsBeforeOption(activeOptionIndex, this.autocomplete.options, this.autocomplete.optionGroups);
        const /** @type {?} */ optionOffset = (activeOptionIndex + labelCount) * AUTOCOMPLETE_OPTION_HEIGHT;
        const /** @type {?} */ panelTop = this.autocomplete._getScrollTop();
        if (optionOffset < panelTop) {
            // Scroll up to reveal selected option scrolled above the panel top
            this.autocomplete._setScrollTop(optionOffset);
        }
        else if (optionOffset + AUTOCOMPLETE_OPTION_HEIGHT > panelTop + AUTOCOMPLETE_PANEL_HEIGHT) {
            // Scroll down to reveal selected option scrolled below the panel bottom
            const /** @type {?} */ newScrollTop = Math.max(0, optionOffset - AUTOCOMPLETE_PANEL_HEIGHT + AUTOCOMPLETE_OPTION_HEIGHT);
            this.autocomplete._setScrollTop(newScrollTop);
        }
    }
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     * @return {?}
     */
    _subscribeToClosingActions() {
        const /** @type {?} */ firstStable = first.call(this._zone.onStable.asObservable());
        const /** @type {?} */ optionChanges = map.call(this.autocomplete.options.changes, () => this._positionStrategy.recalculateLastPosition());
        // When the zone is stable initially, and when the option list changes...
        return RxChain.from(merge(firstStable, optionChanges))
            .call(switchMap, () => {
            this._resetActiveItem();
            this.autocomplete._setVisibility();
            return this.panelClosingActions;
        })
            .call(first)
            .subscribe(event => this._setValueAndClose(event));
    }
    /**
     * Destroys the autocomplete suggestion panel.
     * @return {?}
     */
    _destroyPanel() {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _setTriggerValue(value) {
        const /** @type {?} */ toDisplay = this.autocomplete.displayWith ? this.autocomplete.displayWith(value) : value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        const /** @type {?} */ inputValue = toDisplay != null ? toDisplay : '';
        // If it's used within a `MdFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = inputValue;
        }
        else {
            this._element.nativeElement.value = inputValue;
        }
    }
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     * @param {?} event
     * @return {?}
     */
    _setValueAndClose(event) {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
            this._element.nativeElement.focus();
            this.autocomplete._emitSelectEvent(event.source);
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     * @param {?} skip
     * @return {?}
     */
    _clearPreviousSelectedOption(skip) {
        this.autocomplete.options.forEach(option => {
            if (option != skip && option.selected) {
                option.deselect();
            }
        });
    }
    /**
     * @return {?}
     */
    _attachOverlay() {
        if (!this.autocomplete) {
            throw getMdAutocompleteMissingPanelError();
        }
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
            this._overlayRef = this._overlay.create(this._getOverlayConfig());
        }
        else {
            /** Update the panel width, in case the host width has changed */
            this._overlayRef.getState().width = this._getHostWidth();
            this._overlayRef.updateSize();
        }
        if (this._overlayRef && !this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        this.autocomplete._setVisibility();
        this._panelOpen = true;
    }
    /**
     * @return {?}
     */
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getHostWidth(),
            direction: this._dir ? this._dir.value : 'ltr'
        });
    }
    /**
     * @return {?}
     */
    _getOverlayPosition() {
        this._positionStrategy = this._overlay.position().connectedTo(this._getConnectedElement(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
        return this._positionStrategy;
    }
    /**
     * @return {?}
     */
    _getConnectedElement() {
        return this._formField ? this._formField._connectionContainerRef : this._element;
    }
    /**
     * Returns the width of the input element, so the panel width can match it.
     * @return {?}
     */
    _getHostWidth() {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    }
    /**
     * Reset active item to -1 so arrow events will activate the correct options.
     * @return {?}
     */
    _resetActiveItem() {
        this.autocomplete._keyManager.setActiveItem(-1);
    }
}
MdAutocompleteTrigger.decorators = [
    { type: Directive, args: [{
                selector: `input[mdAutocomplete], input[matAutocomplete],
             textarea[mdAutocomplete], textarea[matAutocomplete]`,
                host: {
                    'role': 'combobox',
                    'autocomplete': 'off',
                    'aria-autocomplete': 'list',
                    'aria-multiline': 'false',
                    '[attr.aria-activedescendant]': 'activeOption?.id',
                    '[attr.aria-expanded]': 'panelOpen.toString()',
                    '[attr.aria-owns]': 'autocomplete?.id',
                    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                    // a little earlier. This avoids issues where IE delays the focusing of the input.
                    '(focusin)': '_handleFocus()',
                    '(blur)': '_onTouched()',
                    '(input)': '_handleInput($event)',
                    '(keydown)': '_handleKeydown($event)',
                },
                providers: [MD_AUTOCOMPLETE_VALUE_ACCESSOR]
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteTrigger.ctorParameters = () => [
    { type: ElementRef, },
    { type: Overlay, },
    { type: ViewContainerRef, },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MD_AUTOCOMPLETE_SCROLL_STRATEGY,] },] },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: MdFormField, decorators: [{ type: Optional }, { type: Host },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
];
MdAutocompleteTrigger.propDecorators = {
    'autocomplete': [{ type: Input, args: ['mdAutocomplete',] },],
    '_matAutocomplete': [{ type: Input, args: ['matAutocomplete',] },],
};

class MdAutocompleteModule {
}
MdAutocompleteModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdOptionModule, OverlayModule, MdCommonModule, CommonModule],
                exports: [MdAutocomplete, MdOptionModule, MdAutocompleteTrigger, MdCommonModule],
                declarations: [MdAutocomplete, MdAutocompleteTrigger],
                providers: [MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER],
            },] },
];
/**
 * @nocollapse
 */
MdAutocompleteModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdAutocompleteSelectedEvent, MdAutocomplete, MdAutocompleteModule, AUTOCOMPLETE_OPTION_HEIGHT, AUTOCOMPLETE_PANEL_HEIGHT, MD_AUTOCOMPLETE_SCROLL_STRATEGY, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER, MD_AUTOCOMPLETE_VALUE_ACCESSOR, getMdAutocompleteMissingPanelError, MdAutocompleteTrigger, MD_AUTOCOMPLETE_SCROLL_STRATEGY as MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER as MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER, MD_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY as MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY, MD_AUTOCOMPLETE_VALUE_ACCESSOR as MAT_AUTOCOMPLETE_VALUE_ACCESSOR, MdAutocomplete as MatAutocomplete, MdAutocompleteModule as MatAutocompleteModule, MdAutocompleteTrigger as MatAutocompleteTrigger };
//# sourceMappingURL=autocomplete.js.map
