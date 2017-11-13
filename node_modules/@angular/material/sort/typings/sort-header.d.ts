/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef } from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatSort, MatSortable } from './sort';
import { MatSortHeaderIntl } from './sort-header-intl';
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export declare class MatSortHeader implements MatSortable {
    _intl: MatSortHeaderIntl;
    _sort: MatSort;
    _cdkColumnDef: CdkColumnDef;
    private _rerenderSubscription;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     */
    id: string;
    /** Sets the position of the arrow that displays when sorted. */
    arrowPosition: 'before' | 'after';
    /** Overrides the sort start value of the containing MatSort for this MatSortable. */
    start: 'asc' | 'desc';
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    disableClear: boolean;
    private _disableClear;
    constructor(_intl: MatSortHeaderIntl, changeDetectorRef: ChangeDetectorRef, _sort: MatSort, _cdkColumnDef: CdkColumnDef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted(): boolean;
}
