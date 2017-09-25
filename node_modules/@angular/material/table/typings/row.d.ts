import { CdkHeaderRow, CdkRow, CdkRowDef, CdkHeaderRowDef } from '@angular/cdk/table';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MdHeaderRowDef: typeof CdkHeaderRowDef;
export declare const _MdCdkRowDef: typeof CdkRowDef;
export declare const _MdHeaderRow: typeof CdkHeaderRow;
export declare const _MdRow: typeof CdkRow;
/**
 * Header row definition for the md-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class MdHeaderRowDef extends _MdHeaderRowDef {
}
/** Mat-compatible version of MdHeaderRowDef */
export declare class MatHeaderRowDef extends _MdHeaderRowDef {
}
/**
 * Data row definition for the md-table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
export declare class MdRowDef extends _MdCdkRowDef {
}
/** Mat-compatible version of MdRowDef */
export declare class MatRowDef extends _MdCdkRowDef {
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class MdHeaderRow extends _MdHeaderRow {
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class MdRow extends _MdRow {
}
