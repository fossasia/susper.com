/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { MATERIAL_COMPATIBILITY_MODE, MdCommonModule, mixinColor } from '@angular/material/core';

class MdToolbarRow {
}
MdToolbarRow.decorators = [
    { type: Directive, args: [{
                selector: 'md-toolbar-row, mat-toolbar-row',
                host: { 'class': 'mat-toolbar-row' },
            },] },
];
/**
 * @nocollapse
 */
MdToolbarRow.ctorParameters = () => [];
/**
 * \@docs-private
 */
class MdToolbarBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MdToolbarMixinBase = mixinColor(MdToolbarBase);
class MdToolbar extends _MdToolbarMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    constructor(renderer, elementRef) {
        super(renderer, elementRef);
    }
}
MdToolbar.decorators = [
    { type: Component, args: [{selector: 'md-toolbar, mat-toolbar',
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
MdToolbar.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
];

class MdToolbarModule {
}
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
MdToolbarModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdToolbarModule, MdToolbarRow, MdToolbarBase, _MdToolbarMixinBase, MdToolbar, MdToolbar as MatToolbar, MdToolbarBase as MatToolbarBase, MdToolbarModule as MatToolbarModule, MdToolbarRow as MatToolbarRow };
//# sourceMappingURL=toolbar.js.map
