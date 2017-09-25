import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { CDK_ROW_TEMPLATE, CDK_TABLE_TEMPLATE, CdkCell, CdkCellDef, CdkColumnDef, CdkHeaderCell, CdkHeaderCellDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkTable, CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { MdCommonModule } from '@angular/material/core';
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdTable = CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MdTable = (function (_super) {
    tslib_1.__extends(MdTable, _super);
    function MdTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdTable;
}(_MdTable));
MdTable.decorators = [
    { type: Component, args: [{ selector: 'md-table, mat-table',
                template: CDK_TABLE_TEMPLATE,
                styles: [".mat-table{display:block}.mat-header-row,.mat-row{display:flex;border-bottom-width:1px;border-bottom-style:solid;align-items:center;min-height:48px;padding:0 24px}.mat-cell,.mat-header-cell{flex:1}"],
                host: {
                    'class': 'mat-table',
                },
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
MdTable.ctorParameters = function () { return []; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdCellDef = CdkCellDef;
var _MdHeaderCellDef = CdkHeaderCellDef;
var _MdColumnDef = CdkColumnDef;
var _MdHeaderCell = CdkHeaderCell;
var _MdCell = CdkCell;
/**
 * Cell definition for the md-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
var MdCellDef = (function (_super) {
    tslib_1.__extends(MdCellDef, _super);
    function MdCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdCellDef;
}(_MdCellDef));
MdCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdCellDef], [matCellDef]',
                providers: [{ provide: CdkCellDef, useExisting: MdCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdCellDef.ctorParameters = function () { return []; };
/**
 * Header cell definition for the md-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
var MdHeaderCellDef = (function (_super) {
    tslib_1.__extends(MdHeaderCellDef, _super);
    function MdHeaderCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderCellDef;
}(_MdHeaderCellDef));
MdHeaderCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdHeaderCellDef], [matHeaderCellDef]',
                providers: [{ provide: CdkHeaderCellDef, useExisting: MdHeaderCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCellDef.ctorParameters = function () { return []; };
/**
 * Column definition for the md-table.
 * Defines a set of cells available for a table column.
 */
var MdColumnDef = (function (_super) {
    tslib_1.__extends(MdColumnDef, _super);
    function MdColumnDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MdColumnDef.prototype, "_matColumnDefName", {
        /**
         * @return {?}
         */
        get: function () { return this.name; },
        /**
         * @param {?} name
         * @return {?}
         */
        set: function (name) { this.name = name; },
        enumerable: true,
        configurable: true
    });
    return MdColumnDef;
}(_MdColumnDef));
MdColumnDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdColumnDef], [matColumnDef]',
                providers: [{ provide: CdkColumnDef, useExisting: MdColumnDef }],
            },] },
];
/**
 * @nocollapse
 */
MdColumnDef.ctorParameters = function () { return []; };
MdColumnDef.propDecorators = {
    'name': [{ type: Input, args: ['mdColumnDef',] },],
    '_matColumnDefName': [{ type: Input, args: ['matColumnDef',] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
var MdHeaderCell = (function (_super) {
    tslib_1.__extends(MdHeaderCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdHeaderCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    return MdHeaderCell;
}(_MdHeaderCell));
MdHeaderCell.decorators = [
    { type: Directive, args: [{
                selector: 'md-header-cell, mat-header-cell',
                host: {
                    'class': 'mat-header-cell',
                    'role': 'columnheader',
                },
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
/**
 * Cell template container that adds the right classes and role.
 */
var MdCell = (function (_super) {
    tslib_1.__extends(MdCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MdCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    return MdCell;
}(_MdCell));
MdCell.decorators = [
    { type: Directive, args: [{
                selector: 'md-cell, mat-cell',
                host: {
                    'class': 'mat-cell',
                    'role': 'gridcell',
                },
            },] },
];
/**
 * @nocollapse
 */
MdCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
]; };
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MdHeaderRowDef = CdkHeaderRowDef;
var _MdCdkRowDef = CdkRowDef;
var _MdHeaderRow = CdkHeaderRow;
var _MdRow = CdkRow;
/**
 * Header row definition for the md-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
var MdHeaderRowDef = (function (_super) {
    tslib_1.__extends(MdHeaderRowDef, _super);
    function MdHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderRowDef;
}(_MdHeaderRowDef));
MdHeaderRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdHeaderRowDef]',
                providers: [{ provide: CdkHeaderRowDef, useExisting: MdHeaderRowDef }],
                inputs: ['columns: mdHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
MdHeaderRowDef.ctorParameters = function () { return []; };
/**
 * Mat-compatible version of MdHeaderRowDef
 */
var MatHeaderRowDef = (function (_super) {
    tslib_1.__extends(MatHeaderRowDef, _super);
    function MatHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatHeaderRowDef;
}(_MdHeaderRowDef));
MatHeaderRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[matHeaderRowDef]',
                providers: [{ provide: CdkHeaderRowDef, useExisting: MatHeaderRowDef }],
                inputs: ['columns: matHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
MatHeaderRowDef.ctorParameters = function () { return []; };
/**
 * Data row definition for the md-table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
var MdRowDef = (function (_super) {
    tslib_1.__extends(MdRowDef, _super);
    function MdRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdRowDef;
}(_MdCdkRowDef));
MdRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdRowDef]',
                providers: [{ provide: CdkRowDef, useExisting: MdRowDef }],
                inputs: ['columns: mdRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
MdRowDef.ctorParameters = function () { return []; };
/**
 * Mat-compatible version of MdRowDef
 */
var MatRowDef = (function (_super) {
    tslib_1.__extends(MatRowDef, _super);
    function MatRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MatRowDef;
}(_MdCdkRowDef));
MatRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[matRowDef]',
                providers: [{ provide: CdkRowDef, useExisting: MatRowDef }],
                inputs: ['columns: matRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
MatRowDef.ctorParameters = function () { return []; };
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
var MdHeaderRow = (function (_super) {
    tslib_1.__extends(MdHeaderRow, _super);
    function MdHeaderRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdHeaderRow;
}(_MdHeaderRow));
MdHeaderRow.decorators = [
    { type: Component, args: [{ selector: 'md-header-row, mat-header-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-header-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdHeaderRow.ctorParameters = function () { return []; };
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
var MdRow = (function (_super) {
    tslib_1.__extends(MdRow, _super);
    function MdRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MdRow;
}(_MdRow));
MdRow.decorators = [
    { type: Component, args: [{ selector: 'md-row, mat-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'mat-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
MdRow.ctorParameters = function () { return []; };
var MdTableModule = (function () {
    function MdTableModule() {
    }
    return MdTableModule;
}());
MdTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [CdkTableModule, CommonModule, MdCommonModule],
                exports: [MdTable, MdCellDef, MdHeaderCellDef, MdColumnDef,
                    MdHeaderRowDef, MdRowDef,
                    MdHeaderCell, MdCell, MdHeaderRow, MdRow,
                    MatHeaderRowDef, MatRowDef],
                declarations: [MdTable, MdCellDef, MdHeaderCellDef, MdColumnDef,
                    MdHeaderRowDef, MdRowDef,
                    MdHeaderCell, MdCell, MdHeaderRow, MdRow,
                    MatHeaderRowDef, MatRowDef],
            },] },
];
/**
 * @nocollapse
 */
MdTableModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdTableModule, _MdCellDef, _MdHeaderCellDef, _MdColumnDef, _MdHeaderCell, _MdCell, MdCellDef, MdHeaderCellDef, MdColumnDef, MdHeaderCell, MdCell, _MdTable, MdTable, _MdHeaderRowDef, _MdCdkRowDef, _MdHeaderRow, _MdRow, MdHeaderRowDef, MatHeaderRowDef, MdRowDef, MatRowDef, MdHeaderRow, MdRow, MdCell as MatCell, MdCellDef as MatCellDef, MdColumnDef as MatColumnDef, MdHeaderCell as MatHeaderCell, MdHeaderCellDef as MatHeaderCellDef, MdHeaderRow as MatHeaderRow, MdRow as MatRow, MdTable as MatTable, MdTableModule as MatTableModule };
//# sourceMappingURL=table.es5.js.map
