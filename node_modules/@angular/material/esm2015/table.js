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
import { MatCommonModule } from '@angular/material/core';

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatTable = CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
class MatTable extends _MatTable {
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
MatTable.ctorParameters = () => [];

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatCellDef = CdkCellDef;
const _MatHeaderCellDef = CdkHeaderCellDef;
const _MatColumnDef = CdkColumnDef;
const _MatHeaderCell = CdkHeaderCell;
const _MatCell = CdkCell;
/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
class MatCellDef extends _MatCellDef {
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
MatCellDef.ctorParameters = () => [];
/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
class MatHeaderCellDef extends _MatHeaderCellDef {
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
MatHeaderCellDef.ctorParameters = () => [];
/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
class MatColumnDef extends _MatColumnDef {
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
MatColumnDef.ctorParameters = () => [];
MatColumnDef.propDecorators = {
    'name': [{ type: Input, args: ['matColumnDef',] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
class MatHeaderCell extends _MatHeaderCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(columnDef, elementRef, renderer) {
        super(columnDef, elementRef, renderer);
        renderer.addClass(elementRef.nativeElement, `mat-column-${columnDef.cssClassFriendlyName}`);
    }
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
MatHeaderCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];
/**
 * Cell template container that adds the right classes and role.
 */
class MatCell extends _MatCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(columnDef, elementRef, renderer) {
        super(columnDef, elementRef, renderer);
        renderer.addClass(elementRef.nativeElement, `mat-column-${columnDef.cssClassFriendlyName}`);
    }
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
MatCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MatHeaderRowDef = CdkHeaderRowDef;
const _MatCdkRowDef = CdkRowDef;
const _MatHeaderRow = CdkHeaderRow;
const _MatRow = CdkRow;
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
class MatHeaderRowDef extends _MatHeaderRowDef {
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
MatHeaderRowDef.ctorParameters = () => [];
/**
 * Data row definition for the mat-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
class MatRowDef extends _MatCdkRowDef {
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
MatRowDef.ctorParameters = () => [];
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
class MatHeaderRow extends _MatHeaderRow {
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
MatHeaderRow.ctorParameters = () => [];
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
class MatRow extends _MatRow {
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
MatRow.ctorParameters = () => [];

class MatTableModule {
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
MatTableModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatTableModule, _MatCellDef, _MatHeaderCellDef, _MatColumnDef, _MatHeaderCell, _MatCell, MatCellDef, MatHeaderCellDef, MatColumnDef, MatHeaderCell, MatCell, _MatTable, MatTable, _MatHeaderRowDef, _MatCdkRowDef, _MatHeaderRow, _MatRow, MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow };
//# sourceMappingURL=table.js.map
