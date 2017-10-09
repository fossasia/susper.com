import { CdkTable } from '@angular/cdk/table';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MatTable: typeof CdkTable;
/**
 * Wrapper for the CdkTable with Material design styles.
 */
export declare class MatTable<T> extends _MatTable<T> {
}
