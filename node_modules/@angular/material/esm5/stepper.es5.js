/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStep, CdkStepLabel, CdkStepper, CdkStepperModule, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, Inject, Injectable, Input, NgModule, Renderer2, SkipSelf, TemplateRef, ViewChildren, ViewEncapsulation, forwardRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import { Subject } from 'rxjs/Subject';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStepLabel = CdkStepLabel;
var MatStepLabel = (function (_super) {
    __extends(MatStepLabel, _super);
    /**
     * @param {?} template
     */
    function MatStepLabel(template) {
        return _super.call(this, template) || this;
    }
    MatStepLabel.decorators = [
        { type: Directive, args: [{
                    selector: '[matStepLabel]',
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepLabel.ctorParameters = function () { return [
        { type: TemplateRef, },
    ]; };
    return MatStepLabel;
}(_MatStepLabel));

/**
 * Stepper data that is required for internationalization.
 */
var MatStepperIntl = (function () {
    function MatStepperIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * Label that is rendered below optional steps.
         */
        this.optionalLabel = 'Optional';
    }
    MatStepperIntl.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    MatStepperIntl.ctorParameters = function () { return []; };
    return MatStepperIntl;
}());

var MatStepHeader = (function () {
    /**
     * @param {?} _intl
     * @param {?} _focusMonitor
     * @param {?} _element
     * @param {?} renderer
     * @param {?} changeDetectorRef
     */
    function MatStepHeader(_intl, _focusMonitor, _element, renderer, changeDetectorRef) {
        this._intl = _intl;
        this._focusMonitor = _focusMonitor;
        this._element = _element;
        _focusMonitor.monitor(_element.nativeElement, renderer, true);
        this._intlSubscription = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
    }
    Object.defineProperty(MatStepHeader.prototype, "index", {
        /**
         * Index of the given step.
         * @return {?}
         */
        get: function () { return this._index; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._index = coerceNumberProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "selected", {
        /**
         * Whether the given step is selected.
         * @return {?}
         */
        get: function () { return this._selected; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._selected = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "active", {
        /**
         * Whether the given step label is active.
         * @return {?}
         */
        get: function () { return this._active; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._active = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatStepHeader.prototype, "optional", {
        /**
         * Whether the given step is optional.
         * @return {?}
         */
        get: function () { return this._optional; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._optional = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatStepHeader.prototype.ngOnDestroy = function () {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element.nativeElement);
    };
    /**
     * Returns string label of given step if it is a text label.
     * @return {?}
     */
    MatStepHeader.prototype._stringLabel = function () {
        return this.label instanceof MatStepLabel ? null : this.label;
    };
    /**
     * Returns MatStepLabel if the label of given step is a template label.
     * @return {?}
     */
    MatStepHeader.prototype._templateLabel = function () {
        return this.label instanceof MatStepLabel ? this.label : null;
    };
    /**
     * Returns the host HTML element.
     * @return {?}
     */
    MatStepHeader.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    MatStepHeader.decorators = [
        { type: Component, args: [{selector: 'mat-step-header',
                    template: "<div class=\"mat-step-header-ripple\" mat-ripple [matRippleTrigger]=\"_getHostElement()\"></div><div [class.mat-step-icon]=\"icon !== 'number' || selected\" [class.mat-step-icon-not-touched]=\"icon == 'number' && !selected\" [ngSwitch]=\"icon\"><span *ngSwitchCase=\"'number'\">{{index + 1}}</span><mat-icon *ngSwitchCase=\"'edit'\">create</mat-icon><mat-icon *ngSwitchCase=\"'done'\">done</mat-icon></div><div class=\"mat-step-label\" [class.mat-step-label-active]=\"active\" [class.mat-step-label-selected]=\"selected\"><ng-container *ngIf=\"_templateLabel()\" [ngTemplateOutlet]=\"label.template\"></ng-container><div class=\"mat-step-text-label\" *ngIf=\"_stringLabel()\">{{label}}</div><div class=\"mat-step-optional\" *ngIf=\"optional\">{{_intl.optionalLabel}}</div></div>",
                    styles: [".mat-step-header{overflow:hidden;outline:0;cursor:pointer;position:relative}.mat-step-optional{font-size:12px}.mat-step-icon,.mat-step-icon-not-touched{border-radius:50%;height:24px;width:24px;align-items:center;justify-content:center;display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"],
                    host: {
                        'class': 'mat-step-header',
                        'role': 'tab',
                    },
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepHeader.ctorParameters = function () { return [
        { type: MatStepperIntl, },
        { type: FocusMonitor, },
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ChangeDetectorRef, },
    ]; };
    MatStepHeader.propDecorators = {
        'icon': [{ type: Input },],
        'label': [{ type: Input },],
        'index': [{ type: Input },],
        'selected': [{ type: Input },],
        'active': [{ type: Input },],
        'optional': [{ type: Input },],
    };
    return MatStepHeader;
}());

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStep = CdkStep;
var _MatStepper = CdkStepper;
var MatStep = (function (_super) {
    __extends(MatStep, _super);
    /**
     * @param {?} stepper
     * @param {?} _errorStateMatcher
     */
    function MatStep(stepper, _errorStateMatcher) {
        var _this = _super.call(this, stepper) || this;
        _this._errorStateMatcher = _errorStateMatcher;
        return _this;
    }
    /**
     * Custom error state matcher that additionally checks for validity of interacted form.
     * @param {?} control
     * @param {?} form
     * @return {?}
     */
    MatStep.prototype.isErrorState = function (control, form) {
        var /** @type {?} */ originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        var /** @type {?} */ customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    };
    MatStep.decorators = [
        { type: Component, args: [{selector: 'mat-step',
                    template: "<ng-template><ng-content></ng-content></ng-template>",
                    providers: [{ provide: ErrorStateMatcher, useExisting: MatStep }],
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matStep',
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStep.ctorParameters = function () { return [
        { type: MatStepper, decorators: [{ type: Inject, args: [forwardRef(function () { return MatStepper; }),] },] },
        { type: ErrorStateMatcher, decorators: [{ type: SkipSelf },] },
    ]; };
    MatStep.propDecorators = {
        'stepLabel': [{ type: ContentChild, args: [MatStepLabel,] },],
    };
    return MatStep;
}(_MatStep));
var MatStepper = (function (_super) {
    __extends(MatStepper, _super);
    function MatStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatStepper.decorators = [
        { type: Directive, args: [{
                    selector: '[matStepper]'
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepper.ctorParameters = function () { return []; };
    MatStepper.propDecorators = {
        '_stepHeader': [{ type: ViewChildren, args: [MatStepHeader, { read: ElementRef },] },],
        '_steps': [{ type: ContentChildren, args: [MatStep,] },],
    };
    return MatStepper;
}(_MatStepper));
var MatHorizontalStepper = (function (_super) {
    __extends(MatHorizontalStepper, _super);
    function MatHorizontalStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatHorizontalStepper.decorators = [
        { type: Component, args: [{selector: 'mat-horizontal-stepper',
                    exportAs: 'matHorizontalStepper',
                    template: "<div class=\"mat-horizontal-stepper-header-container\"><ng-container *ngFor=\"let step of _steps; let i = index; let isLast = last\"><mat-step-header class=\"mat-horizontal-stepper-header\" (click)=\"step.select()\" (keydown)=\"_onKeydown($event)\" [tabIndex]=\"_focusIndex === i ? 0 : -1\" [id]=\"_getStepLabelId(i)\" [attr.aria-controls]=\"_getStepContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [index]=\"i\" [icon]=\"_getIndicatorType(i)\" [label]=\"step.stepLabel || step.label\" [selected]=\"selectedIndex === i\" [active]=\"step.completed || selectedIndex === i\" [optional]=\"step.optional\"></mat-step-header><div *ngIf=\"!isLast\" class=\"mat-stepper-horizontal-line\"></div></ng-container></div><div class=\"mat-horizontal-content-container\"><div *ngFor=\"let step of _steps; let i = index\" class=\"mat-horizontal-stepper-content\" role=\"tabpanel\" [@stepTransition]=\"_getAnimationDirection(i)\" [id]=\"_getStepContentId(i)\" [attr.aria-labelledby]=\"_getStepLabelId(i)\" [attr.aria-expanded]=\"selectedIndex === i\"><ng-container [ngTemplateOutlet]=\"step.content\"></ng-container></div></div>",
                    styles: [".mat-stepper-horizontal,.mat-stepper-vertical{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon,.mat-horizontal-stepper-header .mat-step-icon-not-touched{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon,[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon-not-touched{margin-right:0;margin-left:8px}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;max-height:24px}.mat-vertical-stepper-header .mat-step-icon,.mat-vertical-stepper-header .mat-step-icon-not-touched{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon,[dir=rtl] .mat-vertical-stepper-header .mat-step-icon-not-touched{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{overflow:hidden}.mat-horizontal-stepper-content[aria-expanded=false]{height:0}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:'';position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}"],
                    inputs: ['selectedIndex'],
                    host: {
                        'class': 'mat-stepper-horizontal',
                        'role': 'tablist',
                    },
                    animations: [
                        trigger('stepTransition', [
                            state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
                            state('current', style({ transform: 'none', visibility: 'visible' })),
                            state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
                            transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
                        ])
                    ],
                    providers: [{ provide: MatStepper, useExisting: MatHorizontalStepper }],
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatHorizontalStepper.ctorParameters = function () { return []; };
    return MatHorizontalStepper;
}(MatStepper));
var MatVerticalStepper = (function (_super) {
    __extends(MatVerticalStepper, _super);
    function MatVerticalStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatVerticalStepper.decorators = [
        { type: Component, args: [{selector: 'mat-vertical-stepper',
                    exportAs: 'matVerticalStepper',
                    template: "<div class=\"mat-step\" *ngFor=\"let step of _steps; let i = index; let isLast = last\"><mat-step-header class=\"mat-vertical-stepper-header\" (click)=\"step.select()\" (keydown)=\"_onKeydown($event)\" [tabIndex]=\"_focusIndex == i ? 0 : -1\" [id]=\"_getStepLabelId(i)\" [attr.aria-controls]=\"_getStepContentId(i)\" [attr.aria-selected]=\"selectedIndex === i\" [index]=\"i\" [icon]=\"_getIndicatorType(i)\" [label]=\"step.stepLabel || step.label\" [selected]=\"selectedIndex === i\" [active]=\"step.completed || selectedIndex === i\" [optional]=\"step.optional\"></mat-step-header><div class=\"mat-vertical-content-container\" [class.mat-stepper-vertical-line]=\"!isLast\"><div class=\"mat-vertical-stepper-content\" role=\"tabpanel\" [@stepTransition]=\"_getAnimationDirection(i)\" [id]=\"_getStepContentId(i)\" [attr.aria-labelledby]=\"_getStepLabelId(i)\" [attr.aria-expanded]=\"selectedIndex === i\"><div class=\"mat-vertical-content\"><ng-container [ngTemplateOutlet]=\"step.content\"></ng-container></div></div></div></div>",
                    styles: [".mat-stepper-horizontal,.mat-stepper-vertical{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon,.mat-horizontal-stepper-header .mat-step-icon-not-touched{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon,[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon-not-touched{margin-right:0;margin-left:8px}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;max-height:24px}.mat-vertical-stepper-header .mat-step-icon,.mat-vertical-stepper-header .mat-step-icon-not-touched{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon,[dir=rtl] .mat-vertical-stepper-header .mat-step-icon-not-touched{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{overflow:hidden}.mat-horizontal-stepper-content[aria-expanded=false]{height:0}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:'';position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}"],
                    inputs: ['selectedIndex'],
                    host: {
                        'class': 'mat-stepper-vertical',
                        'role': 'tablist',
                    },
                    animations: [
                        trigger('stepTransition', [
                            state('previous', style({ height: '0px', visibility: 'hidden' })),
                            state('next', style({ height: '0px', visibility: 'hidden' })),
                            state('current', style({ height: '*', visibility: 'visible' })),
                            transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
                        ])
                    ],
                    providers: [{ provide: MatStepper, useExisting: MatVerticalStepper }],
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatVerticalStepper.ctorParameters = function () { return []; };
    return MatVerticalStepper;
}(MatStepper));

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatStepperNext = CdkStepperNext;
var _MatStepperPrevious = CdkStepperPrevious;
/**
 * Button that moves to the next step in a stepper workflow.
 */
var MatStepperNext = (function (_super) {
    __extends(MatStepperNext, _super);
    function MatStepperNext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatStepperNext.decorators = [
        { type: Directive, args: [{
                    selector: 'button[matStepperNext]',
                    host: { '(click)': '_stepper.next()' },
                    providers: [{ provide: CdkStepper, useExisting: MatStepper }]
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepperNext.ctorParameters = function () { return []; };
    return MatStepperNext;
}(_MatStepperNext));
/**
 * Button that moves to the previous step in a stepper workflow.
 */
var MatStepperPrevious = (function (_super) {
    __extends(MatStepperPrevious, _super);
    function MatStepperPrevious() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatStepperPrevious.decorators = [
        { type: Directive, args: [{
                    selector: 'button[matStepperPrevious]',
                    host: { '(click)': '_stepper.previous()' },
                    providers: [{ provide: CdkStepper, useExisting: MatStepper }]
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepperPrevious.ctorParameters = function () { return []; };
    return MatStepperPrevious;
}(_MatStepperPrevious));

var MatStepperModule = (function () {
    function MatStepperModule() {
    }
    MatStepperModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        MatCommonModule,
                        CommonModule,
                        PortalModule,
                        MatButtonModule,
                        CdkStepperModule,
                        MatIconModule,
                        A11yModule,
                        MatRippleModule,
                    ],
                    exports: [
                        MatCommonModule,
                        MatHorizontalStepper,
                        MatVerticalStepper,
                        MatStep,
                        MatStepLabel,
                        MatStepper,
                        MatStepperNext,
                        MatStepperPrevious,
                        MatStepHeader
                    ],
                    declarations: [MatHorizontalStepper, MatVerticalStepper, MatStep, MatStepLabel, MatStepper,
                        MatStepperNext, MatStepperPrevious, MatStepHeader],
                    providers: [MatStepperIntl, ErrorStateMatcher],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatStepperModule.ctorParameters = function () { return []; };
    return MatStepperModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MatStepperModule, _MatStepLabel, MatStepLabel, _MatStep, _MatStepper, MatStep, MatStepper, MatHorizontalStepper, MatVerticalStepper, _MatStepperNext, _MatStepperPrevious, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIntl };
//# sourceMappingURL=stepper.es5.js.map
