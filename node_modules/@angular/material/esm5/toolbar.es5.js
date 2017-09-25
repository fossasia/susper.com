import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { MATERIAL_COMPATIBILITY_MODE, MdCommonModule, mixinColor } from '@angular/material/core';
var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    return MdToolbarRow;
}());
MdToolbarRow.decorators = [
    { type: Directive, args: [{
                selector: 'md-toolbar-row, mat-toolbar-row',
                host: { 'class': 'mat-toolbar-row' },
            },] },
];
/**
 * @nocollapse
 */
MdToolbarRow.ctorParameters = function () { return []; };
/**
 * \@docs-private
 */
var MdToolbarBase = (function () {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    function MdToolbarBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MdToolbarBase;
}());
var _MdToolbarMixinBase = mixinColor(MdToolbarBase);
var MdToolbar = (function (_super) {
    tslib_1.__extends(MdToolbar, _super);
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    function MdToolbar(renderer, elementRef) {
        return _super.call(this, renderer, elementRef) || this;
    }
    return MdToolbar;
}(_MdToolbarMixinBase));
MdToolbar.decorators = [
    { type: Component, args: [{ selector: 'md-toolbar, mat-toolbar',
                template: "<div class=\"mat-toolbar-layout\"><mat-toolbar-row><ng-content></ng-content></mat-toolbar-row><ng-content select=\"md-toolbar-row, mat-toolbar-row\"></ng-content></div>",
                styles: [".mat-toolbar{display:flex;box-sizing:border-box;width:100%;padding:0 16px;flex-direction:column}.mat-toolbar .mat-toolbar-row{display:flex;box-sizing:border-box;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar{min-height:64px}.mat-toolbar-row{height:64px}@media (max-width:600px){.mat-toolbar{min-height:56px}.mat-toolbar-row{height:56px}}"],
                inputs: ['color'],
                host: {
                    'class': 'mat-toolbar',
                    'role': 'toolbar'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                viewProviders: [{ provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }],
            },] },
];
/**
 * @nocollapse
 */
MdToolbar.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    return MdToolbarModule;
}());
MdToolbarModule.decorators = [
    { type: NgModule, args: [{
                imports: [MdCommonModule],
                exports: [MdToolbar, MdToolbarRow, MdCommonModule],
                declarations: [MdToolbar, MdToolbarRow],
            },] },
];
/**
 * @nocollapse
 */
MdToolbarModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdToolbarModule, MdToolbarRow, MdToolbarBase, _MdToolbarMixinBase, MdToolbar, MdToolbar as MatToolbar, MdToolbarBase as MatToolbarBase, MdToolbarModule as MatToolbarModule, MdToolbarRow as MatToolbarRow };
//# sourceMappingURL=toolbar.es5.js.map
