/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, EventEmitter, Injectable, Input, NgModule, Optional, Output, ViewEncapsulation, isDevMode } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkColumnDef } from '@angular/cdk/table';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';
import { CommonModule } from '@angular/common';

/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/**
 * \@docs-private
 * @param {?} direction
 * @return {?}
 */
function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

/**
 * Container for MatSortables to manage the sort state and provide default sort parameters.
 */
class MatSort {
    constructor() {
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.sortChange = new EventEmitter();
    }
    /**
     * The sort direction of the currently active MatSortable.
     * @param {?} direction
     * @return {?}
     */
    set direction(direction) {
        if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * @return {?}
     */
    get direction() { return this._direction; }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    register(sortable) {
        if (!sortable.id) {
            throw getSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getSortDuplicateSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    sort(sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.next({ active: this.active, direction: this.direction });
    }
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    getNextSortDirection(sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        const /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        let /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        let /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
}
MatSort.decorators = [
    { type: Directive, args: [{
                selector: '[matSort]',
            },] },
];
/**
 * @nocollapse
 */
MatSort.ctorParameters = () => [];
MatSort.propDecorators = {
    'active': [{ type: Input, args: ['matSortActive',] },],
    'start': [{ type: Input, args: ['matSortStart',] },],
    'direction': [{ type: Input, args: ['matSortDirection',] },],
    'disableClear': [{ type: Input, args: ['matSortDisableClear',] },],
    'sortChange': [{ type: Output, args: ['matSortChange',] },],
};
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    let /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
class MatSortHeaderIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = (id) => {
            return `Change sorting for ${id}`;
        };
        /**
         * A label to describe the current sort (visible only to screenreaders).
         */
        this.sortDescriptionLabel = (id, direction) => {
            return `Sorted by ${id} ${direction == 'asc' ? 'ascending' : 'descending'}`;
        };
    }
}
MatSortHeaderIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MatSortHeaderIntl.ctorParameters = () => [];

const SORT_ANIMATION_TRANSITION = AnimationDurations.ENTERING + ' ' + AnimationCurves.STANDARD_CURVE;
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
class MatSortHeader {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    constructor(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _intl.changes).subscribe(() => {
            changeDetectorRef.markForCheck();
        });
    }
    /**
     * Overrides the disable clear value of the containing MatSort for this MatSortable.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        this._sort.register(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Whether this MatSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    _isSorted() {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    }
}
MatSortHeader.decorators = [
    { type: Component, args: [{selector: '[mat-sort-header]',
                template: "<div class=\"mat-sort-header-container\" [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"><button class=\"mat-sort-header-button\" type=\"button\" [attr.aria-label]=\"_intl.sortButtonLabel(id)\"><ng-content></ng-content></button><div *ngIf=\"_isSorted()\" class=\"mat-sort-header-arrow\" [@indicatorToggle]=\"_sort.direction\"><div class=\"mat-sort-header-stem\"></div><div class=\"mat-sort-header-indicator\" [@indicator]=\"_sort.direction\"><div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_sort.direction\"></div><div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_sort.direction\"></div><div class=\"mat-sort-header-pointer-middle\"></div></div></div></div><span class=\"cdk-visually-hidden\" *ngIf=\"_isSorted()\">{{_intl.sortDescriptionLabel(id, _sort.direction)}}</span>",
                styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:pointer;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{height:12px;width:12px;margin:0 0 0 6px;position:relative;display:flex}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0;transition:225ms cubic-bezier(.4,0,.2,1)}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;transition:225ms cubic-bezier(.4,0,.2,1);position:absolute;top:0}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}"],
                host: {
                    '(click)': '_sort.sort(this)',
                    '[class.mat-sort-header-sorted]': '_isSorted()',
                },
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('indicator', [
                        state('asc', style({ transform: 'translateY(0px)' })),
                        // 10px is the height of the sort indicator, minus the width of the pointers
                        state('desc', style({ transform: 'translateY(10px)' })),
                        transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
                    ]),
                    trigger('leftPointer', [
                        state('asc', style({ transform: 'rotate(-45deg)' })),
                        state('desc', style({ transform: 'rotate(45deg)' })),
                        transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
                    ]),
                    trigger('rightPointer', [
                        state('asc', style({ transform: 'rotate(45deg)' })),
                        state('desc', style({ transform: 'rotate(-45deg)' })),
                        transition('asc <=> desc', animate(SORT_ANIMATION_TRANSITION))
                    ]),
                    trigger('indicatorToggle', [
                        transition('void => asc', animate(SORT_ANIMATION_TRANSITION, keyframes([
                            style({ transform: 'translateY(25%)', opacity: 0 }),
                            style({ transform: 'none', opacity: 1 })
                        ]))),
                        transition('asc => void', animate(SORT_ANIMATION_TRANSITION, keyframes([
                            style({ transform: 'none', opacity: 1 }),
                            style({ transform: 'translateY(-25%)', opacity: 0 })
                        ]))),
                        transition('void => desc', animate(SORT_ANIMATION_TRANSITION, keyframes([
                            style({ transform: 'translateY(-25%)', opacity: 0 }),
                            style({ transform: 'none', opacity: 1 })
                        ]))),
                        transition('desc => void', animate(SORT_ANIMATION_TRANSITION, keyframes([
                            style({ transform: 'none', opacity: 1 }),
                            style({ transform: 'translateY(25%)', opacity: 0 })
                        ]))),
                    ])
                ]
            },] },
];
/**
 * @nocollapse
 */
MatSortHeader.ctorParameters = () => [
    { type: MatSortHeaderIntl, },
    { type: ChangeDetectorRef, },
    { type: MatSort, decorators: [{ type: Optional },] },
    { type: CdkColumnDef, decorators: [{ type: Optional },] },
];
MatSortHeader.propDecorators = {
    'id': [{ type: Input, args: ['mat-sort-header',] },],
    'arrowPosition': [{ type: Input },],
    'start': [{ type: Input, args: ['start',] },],
    'disableClear': [{ type: Input },],
};

class MatSortModule {
}
MatSortModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MatSort, MatSortHeader],
                declarations: [MatSort, MatSortHeader],
                providers: [MatSortHeaderIntl]
            },] },
];
/**
 * @nocollapse
 */
MatSortModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { MatSortModule, MatSortHeader, MatSortHeaderIntl, MatSort };
//# sourceMappingURL=sort.js.map
