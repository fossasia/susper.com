/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgModule, Output, Renderer2, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { GestureConfig, MatCommonModule, MatRipple, MatRippleModule, applyCssTransform, mixinColor, mixinDisableRipple, mixinDisabled, mixinTabIndex } from '@angular/material/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// Increasing integer for generating unique ids for slide-toggle components.
let nextUniqueId = 0;
const MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSlideToggle),
    multi: true
};
/**
 * Change event object emitted by a MatSlideToggle.
 */
class MatSlideToggleChange {
}
/**
 * \@docs-private
 */
class MatSlideToggleBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatSlideToggleMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(MatSlideToggleBase)), 'accent'));
/**
 * Represents a slidable "switch" toggle that can be moved between on and off.
 */
class MatSlideToggle extends _MatSlideToggleMixinBase {
    /**
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _platform
     * @param {?} _focusMonitor
     * @param {?} _changeDetectorRef
     * @param {?} tabIndex
     */
    constructor(elementRef, renderer, _platform, _focusMonitor, _changeDetectorRef, tabIndex) {
        super(renderer, elementRef);
        this._platform = _platform;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this._uniqueId = `mat-slide-toggle-${++nextUniqueId}`;
        this._required = false;
        this._checked = false;
        /**
         * Name value will be applied to the input element if present
         */
        this.name = null;
        /**
         * A unique id for the slide-toggle input. If none is supplied, it will be auto-generated.
         */
        this.id = this._uniqueId;
        /**
         * Whether the label should appear after or before the slide-toggle. Defaults to 'after'
         */
        this.labelPosition = 'after';
        /**
         * Used to set the aria-label attribute on the underlying input element.
         */
        this.ariaLabel = null;
        /**
         * Used to set the aria-labelledby attribute on the underlying input element.
         */
        this.ariaLabelledby = null;
        /**
         * An event will be dispatched each time the slide-toggle changes its value.
         */
        this.change = new EventEmitter();
        this.tabIndex = parseInt(tabIndex) || 0;
    }
    /**
     * Whether the slide-toggle is required.
     * @return {?}
     */
    get required() { return this._required; }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) { this._required = coerceBooleanProperty(value); }
    /**
     * Whether the slide-toggle element is checked or not
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @param {?} value
     * @return {?}
     */
    set checked(value) {
        this._checked = !!value;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Returns the unique id for the visual hidden input.
     * @return {?}
     */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._slideRenderer = new SlideToggleRenderer(this._elementRef, this._platform);
        this._focusMonitor
            .monitor(this._inputElement.nativeElement, this._renderer, false)
            .subscribe(focusOrigin => this._onInputFocusChange(focusOrigin));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._inputElement.nativeElement);
    }
    /**
     * This function will called if the underlying input changed its value through user interaction.
     * @param {?} event
     * @return {?}
     */
    _onChangeEvent(event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Sync the value from the underlying input element with the slide-toggle component.
        this.checked = this._inputElement.nativeElement.checked;
        // Emit our custom change event if the native input emitted one.
        // It is important to only emit it, if the native input triggered one, because we don't want
        // to trigger a change event, when the `checked` variable changes programmatically.
        this._emitChangeEvent();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onInputClick(event) {
        // In some situations the user will release the mouse on the label element. The label element
        // redirects the click to the underlying input element and will result in a value change.
        // Prevent the default behavior if dragging, because the value will be set after drag.
        if (this._slideRenderer.dragging) {
            event.preventDefault();
        }
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.checked = !!value;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Focuses the slide-toggle.
     * @return {?}
     */
    focus() {
        this._focusMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    }
    /**
     * Toggles the checked state of the slide-toggle.
     * @return {?}
     */
    toggle() {
        this.checked = !this.checked;
    }
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    _onInputFocusChange(focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            // For keyboard focus show a persistent ripple as focus indicator.
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this.onTouched();
            // Fade out and clear the focus ripple if one is currently present.
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    }
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     * @return {?}
     */
    _emitChangeEvent() {
        let /** @type {?} */ event = new MatSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this.onChange(this.checked);
        this.change.emit(event);
    }
    /**
     * @return {?}
     */
    _onDragStart() {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onDrag(event) {
        if (this._slideRenderer.dragging) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    }
    /**
     * @return {?}
     */
    _onDragEnd() {
        if (this._slideRenderer.dragging) {
            let /** @type {?} */ _previousChecked = this.checked;
            this.checked = this._slideRenderer.dragPercentage > 50;
            if (_previousChecked !== this.checked) {
                this._emitChangeEvent();
            }
            // The drag should be stopped outside of the current event handler, because otherwise the
            // click event will be fired before and will revert the drag change.
            setTimeout(() => this._slideRenderer.stopThumbDrag());
        }
    }
    /**
     * Method being called whenever the label text changes.
     * @return {?}
     */
    _onLabelTextChange() {
        // This method is getting called whenever the label of the slide-toggle changes.
        // Since the slide-toggle uses the OnPush strategy we need to notify it about the change
        // that has been recognized by the cdkObserveContent directive.
        this._changeDetectorRef.markForCheck();
    }
}
MatSlideToggle.decorators = [
    { type: Component, args: [{selector: 'mat-slide-toggle',
                host: {
                    'class': 'mat-slide-toggle',
                    '[id]': 'id',
                    '[class.mat-checked]': 'checked',
                    '[class.mat-disabled]': 'disabled',
                    '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                },
                template: "<label class=\"mat-slide-toggle-label\" #label><div class=\"mat-slide-toggle-bar\" [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\"><input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"><div class=\"mat-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart()\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd()\"><div class=\"mat-slide-toggle-thumb\"></div><div class=\"mat-slide-toggle-ripple\" mat-ripple [matRippleTrigger]=\"label\" [matRippleCentered]=\"true\" [matRippleDisabled]=\"disableRipple || disabled\"></div></div></div><span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\"><ng-content></ng-content></span></label>",
                styles: [".mat-slide-toggle{display:inline-block;height:24px;line-height:24px;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px,0,0)}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{display:flex;flex:1;flex-direction:row;align-items:center;cursor:pointer}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}.mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-right:8px;margin-left:0}.mat-slide-toggle-label-before .mat-slide-toggle-bar,[dir=rtl] .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0,0,0);transition:all 80ms linear;transition-property:transform;cursor:-webkit-grab;cursor:grab}.mat-slide-toggle-thumb-container.mat-dragging,.mat-slide-toggle-thumb-container:active{cursor:-webkit-grabbing;cursor:grabbing;transition-duration:0s}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-thumb{background:#fff;border:solid 1px #000}}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;border-radius:8px}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-bar{background:#fff}}.mat-slide-toggle-input{bottom:0;left:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}.mat-slide-toggle-ripple{position:absolute;top:-13px;left:-13px;height:46px;width:46px;border-radius:50%;z-index:1;pointer-events:none}"],
                providers: [MAT_SLIDE_TOGGLE_VALUE_ACCESSOR],
                inputs: ['disabled', 'disableRipple', 'color', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MatSlideToggle.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: Platform, },
    { type: FocusMonitor, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Attribute, args: ['tabindex',] },] },
];
MatSlideToggle.propDecorators = {
    'name': [{ type: Input },],
    'id': [{ type: Input },],
    'labelPosition': [{ type: Input },],
    'ariaLabel': [{ type: Input, args: ['aria-label',] },],
    'ariaLabelledby': [{ type: Input, args: ['aria-labelledby',] },],
    'required': [{ type: Input },],
    'checked': [{ type: Input },],
    'change': [{ type: Output },],
    '_inputElement': [{ type: ViewChild, args: ['input',] },],
    '_ripple': [{ type: ViewChild, args: [MatRipple,] },],
};
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
class SlideToggleRenderer {
    /**
     * @param {?} elementRef
     * @param {?} platform
     */
    constructor(elementRef, platform) {
        /**
         * Whether the thumb is currently being dragged.
         */
        this.dragging = false;
        // We only need to interact with these elements when we're on the browser, so only grab
        // the reference in that case.
        if (platform.isBrowser) {
            this._thumbEl = elementRef.nativeElement.querySelector('.mat-slide-toggle-thumb-container');
            this._thumbBarEl = elementRef.nativeElement.querySelector('.mat-slide-toggle-bar');
        }
    }
    /**
     * Initializes the drag of the slide-toggle.
     * @param {?} checked
     * @return {?}
     */
    startThumbDrag(checked) {
        if (this.dragging) {
            return;
        }
        this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
        this._thumbEl.classList.add('mat-dragging');
        this._previousChecked = checked;
        this.dragging = true;
    }
    /**
     * Resets the current drag and returns the new checked value.
     * @return {?}
     */
    stopThumbDrag() {
        if (!this.dragging) {
            return false;
        }
        this.dragging = false;
        this._thumbEl.classList.remove('mat-dragging');
        // Reset the transform because the component will take care of the thumb position after drag.
        applyCssTransform(this._thumbEl, '');
        return this.dragPercentage > 50;
    }
    /**
     * Updates the thumb containers position from the specified distance.
     * @param {?} distance
     * @return {?}
     */
    updateThumbPosition(distance) {
        this.dragPercentage = this._getDragPercentage(distance);
        // Calculate the moved distance based on the thumb bar width.
        let /** @type {?} */ dragX = (this.dragPercentage / 100) * this._thumbBarWidth;
        applyCssTransform(this._thumbEl, `translate3d(${dragX}px, 0, 0)`);
    }
    /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     * @param {?} distance
     * @return {?}
     */
    _getDragPercentage(distance) {
        let /** @type {?} */ percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._previousChecked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    }
}

class MatSlideToggleModule {
}
MatSlideToggleModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatRippleModule, MatCommonModule, PlatformModule, ObserversModule, A11yModule],
                exports: [MatSlideToggle, MatCommonModule],
                declarations: [MatSlideToggle],
                providers: [
                    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
                ],
            },] },
];
/**
 * @nocollapse
 */
MatSlideToggleModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatSlideToggleModule, MAT_SLIDE_TOGGLE_VALUE_ACCESSOR, MatSlideToggleChange, MatSlideToggleBase, _MatSlideToggleMixinBase, MatSlideToggle };
//# sourceMappingURL=slide-toggle.js.map
