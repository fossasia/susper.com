/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef } from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';
import { MdSort, MdSortable } from './sort';
import { MdSortHeaderIntl } from './sort-header-intl';
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MdSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
export declare class MdSortHeader implements MdSortable {
    _intl: MdSortHeaderIntl;
    _sort: MdSort;
    _cdkColumnDef: CdkColumnDef;
    private _rerenderSubscription;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     */
    id: string;
    /** Sets the position of the arrow that displays when sorted. */
    arrowPosition: 'before' | 'after';
    /** Overrides the sort start value of the containing MdSort for this MdSortable. */
    start: 'asc' | 'desc';
    /** Overrides the disable clear value of the containing MdSort for this MdSortable. */
    disableClear: boolean;
    private _disableClear;
    _id: string;
    constructor(_intl: MdSortHeaderIntl, changeDetectorRef: ChangeDetectorRef, _sort: MdSort, _cdkColumnDef: CdkColumnDef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Whether this MdSortHeader is currently sorted in either ascending or descending order. */
    _isSorted(): false | "" | "desc" | "asc";
}
