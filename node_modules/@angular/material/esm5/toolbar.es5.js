/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { MatCommonModule, mixinColor } from '@angular/material/core';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';

var MatToolbarRow = (function () {
    function MatToolbarRow() {
    }
    MatToolbarRow.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-toolbar-row',
                    exportAs: 'matToolbarRow',
                    host: { 'class': 'mat-toolbar-row' },
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbarRow.ctorParameters = function () { return []; };
    return MatToolbarRow;
}());
/**
 * \@docs-private
 */
var MatToolbarBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MatToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatToolbarBase;
}());
var _MatToolbarMixinBase = mixinColor(MatToolbarBase);
var MatToolbar = (function (_super) {
    __extends(MatToolbar, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MatToolbar(renderer, elementRef) {
        return _super.call(this, renderer, elementRef) || this;
    }
    MatToolbar.decorators = [
        { type: Component, args: [{selector: 'mat-toolbar',
                    exportAs: 'matToolbar',
                    template: "<div class=\"mat-toolbar-layout\"><mat-toolbar-row><ng-content></ng-content></mat-toolbar-row><ng-content select=\"mat-toolbar-row\"></ng-content></div>",
                    styles: [".mat-toolbar{display:flex;box-sizing:border-box;width:100%;padding:0 16px;flex-direction:column}.mat-toolbar .mat-toolbar-row{display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar{min-height:64px}.mat-toolbar-row{height:64px}@media (max-width:600px){.mat-toolbar{min-height:56px}.mat-toolbar-row{height:56px}}"],
                    inputs: ['color'],
                    host: {
                        'class': 'mat-toolbar',
                        'role': 'toolbar'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbar.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    return MatToolbar;
}(_MatToolbarMixinBase));

var MatToolbarModule = (function () {
    function MatToolbarModule() {
    }
    MatToolbarModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule],
                    exports: [MatToolbar, MatToolbarRow, MatCommonModule],
                    declarations: [MatToolbar, MatToolbarRow],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatToolbarModule.ctorParameters = function () { return []; };
    return MatToolbarModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MatToolbarModule, MatToolbarRow, MatToolbarBase, _MatToolbarMixinBase, MatToolbar };
//# sourceMappingURL=toolbar.es5.js.map
