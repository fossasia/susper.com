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
const _MdTable = CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
class MdTable extends _MdTable {
}
MdTable.decorators = [
    { type: Component, args: [{selector: 'md-table, mat-table',
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
MdTable.ctorParameters = () => [];

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MdCellDef = CdkCellDef;
const _MdHeaderCellDef = CdkHeaderCellDef;
const _MdColumnDef = CdkColumnDef;
const _MdHeaderCell = CdkHeaderCell;
const _MdCell = CdkCell;
/**
 * Cell definition for the md-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
class MdCellDef extends _MdCellDef {
}
MdCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdCellDef], [matCellDef]',
                providers: [{ provide: CdkCellDef, useExisting: MdCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdCellDef.ctorParameters = () => [];
/**
 * Header cell definition for the md-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
class MdHeaderCellDef extends _MdHeaderCellDef {
}
MdHeaderCellDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdHeaderCellDef], [matHeaderCellDef]',
                providers: [{ provide: CdkHeaderCellDef, useExisting: MdHeaderCellDef }]
            },] },
];
/**
 * @nocollapse
 */
MdHeaderCellDef.ctorParameters = () => [];
/**
 * Column definition for the md-table.
 * Defines a set of cells available for a table column.
 */
class MdColumnDef extends _MdColumnDef {
    /**
     * @return {?}
     */
    get _matColumnDefName() { return this.name; }
    /**
     * @param {?} name
     * @return {?}
     */
    set _matColumnDefName(name) { this.name = name; }
}
MdColumnDef.decorators = [
    { type: Directive, args: [{
                selector: '[mdColumnDef], [matColumnDef]',
                providers: [{ provide: CdkColumnDef, useExisting: MdColumnDef }],
            },] },
];
/**
 * @nocollapse
 */
MdColumnDef.ctorParameters = () => [];
MdColumnDef.propDecorators = {
    'name': [{ type: Input, args: ['mdColumnDef',] },],
    '_matColumnDefName': [{ type: Input, args: ['matColumnDef',] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
class MdHeaderCell extends _MdHeaderCell {
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
MdHeaderCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];
/**
 * Cell template container that adds the right classes and role.
 */
class MdCell extends _MdCell {
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
MdCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _MdHeaderRowDef = CdkHeaderRowDef;
const _MdCdkRowDef = CdkRowDef;
const _MdHeaderRow = CdkHeaderRow;
const _MdRow = CdkRow;
/**
 * Header row definition for the md-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
class MdHeaderRowDef extends _MdHeaderRowDef {
}
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
MdHeaderRowDef.ctorParameters = () => [];
/**
 * Mat-compatible version of MdHeaderRowDef
 */
class MatHeaderRowDef extends _MdHeaderRowDef {
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
 * Data row definition for the md-table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
class MdRowDef extends _MdCdkRowDef {
}
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
MdRowDef.ctorParameters = () => [];
/**
 * Mat-compatible version of MdRowDef
 */
class MatRowDef extends _MdCdkRowDef {
}
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
MatRowDef.ctorParameters = () => [];
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
class MdHeaderRow extends _MdHeaderRow {
}
MdHeaderRow.decorators = [
    { type: Component, args: [{selector: 'md-header-row, mat-header-row',
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
MdHeaderRow.ctorParameters = () => [];
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
class MdRow extends _MdRow {
}
MdRow.decorators = [
    { type: Component, args: [{selector: 'md-row, mat-row',
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
MdRow.ctorParameters = () => [];

class MdTableModule {
}
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
MdTableModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MdTableModule, _MdCellDef, _MdHeaderCellDef, _MdColumnDef, _MdHeaderCell, _MdCell, MdCellDef, MdHeaderCellDef, MdColumnDef, MdHeaderCell, MdCell, _MdTable, MdTable, _MdHeaderRowDef, _MdCdkRowDef, _MdHeaderRow, _MdRow, MdHeaderRowDef, MatHeaderRowDef, MdRowDef, MatRowDef, MdHeaderRow, MdRow, MdCell as MatCell, MdCellDef as MatCellDef, MdColumnDef as MatColumnDef, MdHeaderCell as MatHeaderCell, MdHeaderCellDef as MatHeaderCellDef, MdHeaderRow as MatHeaderRow, MdRow as MatRow, MdTable as MatTable, MdTableModule as MatTableModule };
//# sourceMappingURL=table.js.map
