import { CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef } from '@angular/cdk/table';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MatHeaderRowDef: typeof CdkHeaderRowDef;
export declare const _MatCdkRowDef: typeof CdkRowDef;
export declare const _MatHeaderRow: typeof CdkHeaderRow;
export declare const _MatRow: typeof CdkRow;
/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class MatHeaderRowDef extends _MatHeaderRowDef {
}
/**
 * Data row definition for the mat-table.
 * Captures the header row's template and other row properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export declare class MatRowDef<T> extends _MatCdkRowDef<T> {
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class MatHeaderRow extends _MatHeaderRow {
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class MatRow extends _MatRow {
}
