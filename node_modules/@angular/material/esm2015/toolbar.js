/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { MatCommonModule, mixinColor } from '@angular/material/core';

class MatToolbarRow {
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
MatToolbarRow.ctorParameters = () => [];
/**
 * \@docs-private
 */
class MatToolbarBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatToolbarMixinBase = mixinColor(MatToolbarBase);
class MatToolbar extends _MatToolbarMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     */
    constructor(renderer, elementRef) {
        super(renderer, elementRef);
    }
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
MatToolbar.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
];

class MatToolbarModule {
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
MatToolbarModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatToolbarModule, MatToolbarRow, MatToolbarBase, _MatToolbarMixinBase, MatToolbar };
//# sourceMappingURL=toolbar.js.map
