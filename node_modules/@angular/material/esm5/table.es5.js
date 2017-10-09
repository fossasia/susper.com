/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, NgModule, Renderer2, ViewEncapsulation } from '@angular/core';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import { CDK_ROW_TEMPLATE, CDK_TABLE_TEMPLATE, CdkCell, CdkCellDef, CdkColumnDef, CdkHeaderCell, CdkHeaderCellDef, CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef, CdkTable, CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatTable = CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
var MatTable = (function (_super) {
    __extends(MatTable, _super);
    function MatTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatTable.decorators = [
        { type: Component, args: [{selector: 'mat-table',
                    exportAs: 'matTable',
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
    MatTable.ctorParameters = function () { return []; };
    return MatTable;
}(_MatTable));

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatCellDef = CdkCellDef;
var _MatHeaderCellDef = CdkHeaderCellDef;
var _MatColumnDef = CdkColumnDef;
var _MatHeaderCell = CdkHeaderCell;
var _MatCell = CdkCell;
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
var MatCellDef = (function (_super) {
    __extends(MatCellDef, _super);
    function MatCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatCellDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matCellDef]',
                    providers: [{ provide: CdkCellDef, useExisting: MatCellDef }]
                },] },
    ];
    /**
     * @nocollapse
     */
    MatCellDef.ctorParameters = function () { return []; };
    return MatCellDef;
}(_MatCellDef));
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
var MatHeaderCellDef = (function (_super) {
    __extends(MatHeaderCellDef, _super);
    function MatHeaderCellDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatHeaderCellDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matHeaderCellDef]',
                    providers: [{ provide: CdkHeaderCellDef, useExisting: MatHeaderCellDef }]
                },] },
    ];
    /**
     * @nocollapse
     */
    MatHeaderCellDef.ctorParameters = function () { return []; };
    return MatHeaderCellDef;
}(_MatHeaderCellDef));
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
var MatColumnDef = (function (_super) {
    __extends(MatColumnDef, _super);
    function MatColumnDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatColumnDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matColumnDef]',
                    providers: [{ provide: CdkColumnDef, useExisting: MatColumnDef }],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatColumnDef.ctorParameters = function () { return []; };
    MatColumnDef.propDecorators = {
        'name': [{ type: Input, args: ['matColumnDef',] },],
    };
    return MatColumnDef;
}(_MatColumnDef));
/**
 * Header cell template container that adds the right classes and role.
 */
var MatHeaderCell = (function (_super) {
    __extends(MatHeaderCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MatHeaderCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    MatHeaderCell.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-header-cell',
                    host: {
                        'class': 'mat-header-cell',
                        'role': 'columnheader',
                    },
                },] },
    ];
    /**
     * @nocollapse
     */
    MatHeaderCell.ctorParameters = function () { return [
        { type: CdkColumnDef, },
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    return MatHeaderCell;
}(_MatHeaderCell));
/**
 * Cell template container that adds the right classes and role.
 */
var MatCell = (function (_super) {
    __extends(MatCell, _super);
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function MatCell(columnDef, elementRef, renderer) {
        var _this = _super.call(this, columnDef, elementRef, renderer) || this;
        renderer.addClass(elementRef.nativeElement, "mat-column-" + columnDef.cssClassFriendlyName);
        return _this;
    }
    MatCell.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-cell',
                    host: {
                        'class': 'mat-cell',
                        'role': 'gridcell',
                    },
                },] },
    ];
    /**
     * @nocollapse
     */
    MatCell.ctorParameters = function () { return [
        { type: CdkColumnDef, },
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    return MatCell;
}(_MatCell));

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _MatHeaderRowDef = CdkHeaderRowDef;
var _MatCdkRowDef = CdkRowDef;
var _MatHeaderRow = CdkHeaderRow;
var _MatRow = CdkRow;
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
var MatHeaderRowDef = (function (_super) {
    __extends(MatHeaderRowDef, _super);
    function MatHeaderRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    return MatHeaderRowDef;
}(_MatHeaderRowDef));
/**
 * Data row definition for the mat-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
var MatRowDef = (function (_super) {
    __extends(MatRowDef, _super);
    function MatRowDef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatRowDef.decorators = [
        { type: Directive, args: [{
                    selector: '[matRowDef]',
                    providers: [{ provide: CdkRowDef, useExisting: MatRowDef }],
                    inputs: ['columns: matRowDefColumns', 'when: matRowDefWhen'],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatRowDef.ctorParameters = function () { return []; };
    return MatRowDef;
}(_MatCdkRowDef));
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
var MatHeaderRow = (function (_super) {
    __extends(MatHeaderRow, _super);
    function MatHeaderRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatHeaderRow.decorators = [
        { type: Component, args: [{selector: 'mat-header-row',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-header-row',
                        'role': 'row',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matHeaderRow',
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatHeaderRow.ctorParameters = function () { return []; };
    return MatHeaderRow;
}(_MatHeaderRow));
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
var MatRow = (function (_super) {
    __extends(MatRow, _super);
    function MatRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatRow.decorators = [
        { type: Component, args: [{selector: 'mat-row',
                    template: CDK_ROW_TEMPLATE,
                    host: {
                        'class': 'mat-row',
                        'role': 'row',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matRow',
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatRow.ctorParameters = function () { return []; };
    return MatRow;
}(_MatRow));

var MatTableModule = (function () {
    function MatTableModule() {
    }
    MatTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CdkTableModule, CommonModule, MatCommonModule],
                    exports: [MatTable, MatCellDef, MatHeaderCellDef, MatColumnDef,
                        MatHeaderCell, MatCell, MatHeaderRow, MatRow,
                        MatHeaderRowDef, MatRowDef],
                    declarations: [MatTable, MatCellDef, MatHeaderCellDef, MatColumnDef,
                        MatHeaderCell, MatCell, MatHeaderRow, MatRow,
                        MatHeaderRowDef, MatRowDef],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatTableModule.ctorParameters = function () { return []; };
    return MatTableModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { MatTableModule, _MatCellDef, _MatHeaderCellDef, _MatColumnDef, _MatHeaderCell, _MatCell, MatCellDef, MatHeaderCellDef, MatColumnDef, MatHeaderCell, MatCell, _MatTable, MatTable, _MatHeaderRowDef, _MatCdkRowDef, _MatHeaderRow, _MatRow, MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow };
//# sourceMappingURL=table.es5.js.map
