/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/keycodes'), require('@angular/cdk/coercion'), require('@angular/cdk/bidi'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/cdk/keycodes', '@angular/cdk/coercion', '@angular/cdk/bidi', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.stepper = global.ng.cdk.stepper || {}),global.ng.core,global.ng.cdk.keycodes,global.ng.cdk.coercion,global.ng.cdk.bidi,global.ng.common));
}(this, (function (exports,_angular_core,_angular_cdk_keycodes,_angular_cdk_coercion,_angular_cdk_bidi,_angular_common) { 'use strict';

var CdkStepLabel = (function () {
    /**
     * @param {?} template
     */
    function CdkStepLabel(template) {
        this.template = template;
    }
    CdkStepLabel.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[cdkStepLabel]',
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStepLabel.ctorParameters = function () { return [
        { type: _angular_core.TemplateRef, },
    ]; };
    return CdkStepLabel;
}());

/**
 * Used to generate unique ID for each stepper component.
 */
var nextId = 0;
/**
 * Change event emitted on selection changes.
 */
var StepperSelectionEvent = (function () {
    function StepperSelectionEvent() {
    }
    return StepperSelectionEvent;
}());
var CdkStep = (function () {
    /**
     * @param {?} _stepper
     */
    function CdkStep(_stepper) {
        this._stepper = _stepper;
        /**
         * Whether user has seen the expanded step content or not.
         */
        this.interacted = false;
        this._editable = true;
        this._optional = false;
        this._customCompleted = null;
    }
    Object.defineProperty(CdkStep.prototype, "editable", {
        /**
         * @return {?}
         */
        get: function () { return this._editable; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._editable = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkStep.prototype, "optional", {
        /**
         * Whether the completion of step is optional or not.
         * @return {?}
         */
        get: function () { return this._optional; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._optional = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkStep.prototype, "completed", {
        /**
         * Return whether step is completed or not.
         * @return {?}
         */
        get: function () {
            return this._customCompleted == null ? this._defaultCompleted : this._customCompleted;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._customCompleted = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkStep.prototype, "_defaultCompleted", {
        /**
         * @return {?}
         */
        get: function () {
            return this.stepControl ? this.stepControl.valid && this.interacted : this.interacted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects this step component.
     * @return {?}
     */
    CdkStep.prototype.select = function () {
        this._stepper.selected = this;
    };
    /**
     * @return {?}
     */
    CdkStep.prototype.ngOnChanges = function () {
        // Since basically all inputs of the MdStep get proxied through the view down to the
        // underlying MdStepHeader, we have to make sure that change detection runs correctly.
        this._stepper._stateChanged();
    };
    CdkStep.decorators = [
        { type: _angular_core.Component, args: [{selector: 'cdk-step',
                    exportAs: 'cdkStep',
                    template: "<ng-template><ng-content></ng-content></ng-template>",
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStep.ctorParameters = function () { return [
        { type: CdkStepper, decorators: [{ type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return CdkStepper; }),] },] },
    ]; };
    CdkStep.propDecorators = {
        'stepLabel': [{ type: _angular_core.ContentChild, args: [CdkStepLabel,] },],
        'content': [{ type: _angular_core.ViewChild, args: [_angular_core.TemplateRef,] },],
        'stepControl': [{ type: _angular_core.Input },],
        'label': [{ type: _angular_core.Input },],
        'editable': [{ type: _angular_core.Input },],
        'optional': [{ type: _angular_core.Input },],
        'completed': [{ type: _angular_core.Input },],
    };
    return CdkStep;
}());
var CdkStepper = (function () {
    /**
     * @param {?} _dir
     * @param {?} _changeDetectorRef
     */
    function CdkStepper(_dir, _changeDetectorRef) {
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this._linear = false;
        this._selectedIndex = 0;
        /**
         * Event emitted when the selected step has changed.
         */
        this.selectionChange = new _angular_core.EventEmitter();
        /**
         * The index of the step that the focus can be set.
         */
        this._focusIndex = 0;
        this._groupId = nextId++;
    }
    Object.defineProperty(CdkStepper.prototype, "linear", {
        /**
         * Whether the validity of previous steps should be checked or not.
         * @return {?}
         */
        get: function () { return this._linear; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._linear = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkStepper.prototype, "selectedIndex", {
        /**
         * The index of the selected step.
         * @return {?}
         */
        get: function () { return this._selectedIndex; },
        /**
         * @param {?} index
         * @return {?}
         */
        set: function (index) {
            if (this._anyControlsInvalid(index)
                || index < this._selectedIndex && !this._steps.toArray()[index].editable) {
                // remove focus from clicked step header if the step is not able to be selected
                this._stepHeader.toArray()[index].nativeElement.blur();
            }
            else if (this._selectedIndex != index) {
                this._emitStepperSelectionEvent(index);
                this._focusIndex = this._selectedIndex;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkStepper.prototype, "selected", {
        /**
         * The step that is selected.
         * @return {?}
         */
        get: function () { return this._steps.toArray()[this.selectedIndex]; },
        /**
         * @param {?} step
         * @return {?}
         */
        set: function (step) {
            this.selectedIndex = this._steps.toArray().indexOf(step);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects and focuses the next step in list.
     * @return {?}
     */
    CdkStepper.prototype.next = function () {
        this.selectedIndex = Math.min(this._selectedIndex + 1, this._steps.length - 1);
    };
    /**
     * Selects and focuses the previous step in list.
     * @return {?}
     */
    CdkStepper.prototype.previous = function () {
        this.selectedIndex = Math.max(this._selectedIndex - 1, 0);
    };
    /**
     * Returns a unique id for each step label element.
     * @param {?} i
     * @return {?}
     */
    CdkStepper.prototype._getStepLabelId = function (i) {
        return "mat-step-label-" + this._groupId + "-" + i;
    };
    /**
     * Returns unique id for each step content element.
     * @param {?} i
     * @return {?}
     */
    CdkStepper.prototype._getStepContentId = function (i) {
        return "mat-step-content-" + this._groupId + "-" + i;
    };
    /**
     * Marks the component to be change detected.
     * @return {?}
     */
    CdkStepper.prototype._stateChanged = function () {
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Returns position state of the step with the given index.
     * @param {?} index
     * @return {?}
     */
    CdkStepper.prototype._getAnimationDirection = function (index) {
        var /** @type {?} */ position = index - this._selectedIndex;
        if (position < 0) {
            return this._layoutDirection() === 'rtl' ? 'next' : 'previous';
        }
        else if (position > 0) {
            return this._layoutDirection() === 'rtl' ? 'previous' : 'next';
        }
        return 'current';
    };
    /**
     * Returns the type of icon to be displayed.
     * @param {?} index
     * @return {?}
     */
    CdkStepper.prototype._getIndicatorType = function (index) {
        var /** @type {?} */ step = this._steps.toArray()[index];
        if (!step.completed || this._selectedIndex == index) {
            return 'number';
        }
        else {
            return step.editable ? 'edit' : 'done';
        }
    };
    /**
     * @param {?} newIndex
     * @return {?}
     */
    CdkStepper.prototype._emitStepperSelectionEvent = function (newIndex) {
        var /** @type {?} */ stepsArray = this._steps.toArray();
        this.selectionChange.emit({
            selectedIndex: newIndex,
            previouslySelectedIndex: this._selectedIndex,
            selectedStep: stepsArray[newIndex],
            previouslySelectedStep: stepsArray[this._selectedIndex],
        });
        this._selectedIndex = newIndex;
        this._stateChanged();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CdkStepper.prototype._onKeydown = function (event) {
        switch (event.keyCode) {
            case _angular_cdk_keycodes.RIGHT_ARROW:
                if (this._layoutDirection() === 'rtl') {
                    this._focusPreviousStep();
                }
                else {
                    this._focusNextStep();
                }
                break;
            case _angular_cdk_keycodes.LEFT_ARROW:
                if (this._layoutDirection() === 'rtl') {
                    this._focusNextStep();
                }
                else {
                    this._focusPreviousStep();
                }
                break;
            case _angular_cdk_keycodes.SPACE:
            case _angular_cdk_keycodes.ENTER:
                this.selectedIndex = this._focusIndex;
                break;
            default:
                // Return to avoid calling preventDefault on keys that are not explicitly handled.
                return;
        }
        event.preventDefault();
    };
    /**
     * @return {?}
     */
    CdkStepper.prototype._focusNextStep = function () {
        this._focusStep((this._focusIndex + 1) % this._steps.length);
    };
    /**
     * @return {?}
     */
    CdkStepper.prototype._focusPreviousStep = function () {
        this._focusStep((this._focusIndex + this._steps.length - 1) % this._steps.length);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    CdkStepper.prototype._focusStep = function (index) {
        this._focusIndex = index;
        this._stepHeader.toArray()[this._focusIndex].nativeElement.focus();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    CdkStepper.prototype._anyControlsInvalid = function (index) {
        this._steps.toArray()[this._selectedIndex].interacted = true;
        if (this._linear && index >= 0) {
            return this._steps.toArray().slice(0, index).some(function (step) { return step.stepControl.invalid; });
        }
        return false;
    };
    /**
     * @return {?}
     */
    CdkStepper.prototype._layoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    CdkStepper.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: '[cdkStepper]',
                    exportAs: 'cdkStepper',
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStepper.ctorParameters = function () { return [
        { type: _angular_cdk_bidi.Directionality, decorators: [{ type: _angular_core.Optional },] },
        { type: _angular_core.ChangeDetectorRef, },
    ]; };
    CdkStepper.propDecorators = {
        '_steps': [{ type: _angular_core.ContentChildren, args: [CdkStep,] },],
        'linear': [{ type: _angular_core.Input },],
        'selectedIndex': [{ type: _angular_core.Input },],
        'selected': [{ type: _angular_core.Input },],
        'selectionChange': [{ type: _angular_core.Output },],
    };
    return CdkStepper;
}());

/**
 * Button that moves to the next step in a stepper workflow.
 */
var CdkStepperNext = (function () {
    /**
     * @param {?} _stepper
     */
    function CdkStepperNext(_stepper) {
        this._stepper = _stepper;
    }
    CdkStepperNext.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'button[cdkStepperNext]',
                    host: { '(click)': '_stepper.next()' }
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStepperNext.ctorParameters = function () { return [
        { type: CdkStepper, },
    ]; };
    return CdkStepperNext;
}());
/**
 * Button that moves to the previous step in a stepper workflow.
 */
var CdkStepperPrevious = (function () {
    /**
     * @param {?} _stepper
     */
    function CdkStepperPrevious(_stepper) {
        this._stepper = _stepper;
    }
    CdkStepperPrevious.decorators = [
        { type: _angular_core.Directive, args: [{
                    selector: 'button[cdkStepperPrevious]',
                    host: { '(click)': '_stepper.previous()' }
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStepperPrevious.ctorParameters = function () { return [
        { type: CdkStepper, },
    ]; };
    return CdkStepperPrevious;
}());

var CdkStepperModule = (function () {
    function CdkStepperModule() {
    }
    CdkStepperModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [_angular_cdk_bidi.BidiModule, _angular_common.CommonModule],
                    exports: [CdkStep, CdkStepper, CdkStepLabel, CdkStepperNext, CdkStepperPrevious],
                    declarations: [CdkStep, CdkStepper, CdkStepLabel, CdkStepperNext, CdkStepperPrevious]
                },] },
    ];
    /**
     * @nocollapse
     */
    CdkStepperModule.ctorParameters = function () { return []; };
    return CdkStepperModule;
}());

exports.StepperSelectionEvent = StepperSelectionEvent;
exports.CdkStep = CdkStep;
exports.CdkStepper = CdkStepper;
exports.CdkStepLabel = CdkStepLabel;
exports.CdkStepperNext = CdkStepperNext;
exports.CdkStepperPrevious = CdkStepperPrevious;
exports.CdkStepperModule = CdkStepperModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-stepper.umd.js.map
