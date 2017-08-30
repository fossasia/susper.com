/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { SortDirection } from './sort-direction';
export interface MdSortable {
    id: string;
    start: 'asc' | 'desc';
    disableClear: boolean;
}
export interface Sort {
    active: string;
    direction: SortDirection;
}
/** Container for MdSortables to manage the sort state and provide default sort parameters. */
export declare class MdSort {
    /** Collection of all registered sortables that this directive manages. */
    sortables: Map<string, MdSortable>;
    /** The id of the most recently sorted MdSortable. */
    active: string;
    /**
     * The direction to set when an MdSortable is initially sorted.
     * May be overriden by the MdSortable's sort start.
     */
    start: 'asc' | 'desc';
    /** The sort direction of the currently active MdSortable. */
    direction: SortDirection;
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MdSortable's disable clear input.
     */
    disableClear: boolean;
    private _disableClear;
    _matSortActive: string;
    _matSortStart: "desc" | "asc";
    _matSortDirection: SortDirection;
    _matSortDisableClear: boolean;
    /** Event emitted when the user changes either the active sort or sort direction. */
    mdSortChange: EventEmitter<Sort>;
    /**
     * Register function to be used by the contained MdSortables. Adds the MdSortable to the
     * collection of MdSortables.
     */
    register(sortable: MdSortable): void;
    /**
     * Unregister function to be used by the contained MdSortables. Removes the MdSortable from the
     * collection of contained MdSortables.
     */
    deregister(sortable: MdSortable): void;
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MdSortable): void;
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MdSortable): SortDirection;
}
