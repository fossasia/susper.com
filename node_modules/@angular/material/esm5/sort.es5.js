/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, EventEmitter, Injectable, Input, NgModule, Optional, Output, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
function getMdSortDuplicateMdSortableIdError(id) {
    return Error("Cannot have two MdSortables with the same id (" + id + ").");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderNotContainedWithinMdSortError() {
    return Error("MdSortHeader must be placed within a parent element with the MdSort directive.");
}
/**
 * \@docs-private
 * @return {?}
 */
function getMdSortHeaderMissingIdError() {
    return Error("MdSortHeader must be provided with a unique id.");
}
/**
 * Container for MdSortables to manage the sort state and provide default sort parameters.
 */
var MdSort = (function () {
    function MdSort() {
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * The direction to set when an MdSortable is initially sorted.
         * May be overriden by the MdSortable's sort start.
         */
        this.start = 'asc';
        /**
         * The sort direction of the currently active MdSortable.
         */
        this.direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.sortChange = new EventEmitter();
    }
    Object.defineProperty(MdSort.prototype, "disableClear", {
        /**
         * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
         * May be overriden by the MdSortable's disable clear input.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortActive", {
        /**
         * @return {?}
         */
        get: function () { return this.active; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.active = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortStart", {
        /**
         * @return {?}
         */
        get: function () { return this.start; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.start = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortDirection", {
        /**
         * @return {?}
         */
        get: function () { return this.direction; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.direction = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortDisableClear", {
        /**
         * @return {?}
         */
        get: function () { return this.disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.disableClear = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSort.prototype, "_matSortChange", {
        /**
         * @return {?}
         */
        get: function () { return this.sortChange; },
        enumerable: true,
        configurable: true
    });
    /**
     * Register function to be used by the contained MdSortables. Adds the MdSortable to the
     * collection of MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.register = function (sortable) {
        if (!sortable.id) {
            throw getMdSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getMdSortDuplicateMdSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    };
    /**
     * Unregister function to be used by the contained MdSortables. Removes the MdSortable from the
     * collection of contained MdSortables.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.deregister = function (sortable) {
        this.sortables.delete(sortable.id);
    };
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.sort = function (sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.next({ active: this.active, direction: this.direction });
    };
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    MdSort.prototype.getNextSortDirection = function (sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        var /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        var /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        var /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    };
    return MdSort;
}());
MdSort.decorators = [
    { type: Directive, args: [{
                selector: '[mdSort], [matSort]',
            },] },
];
/**
 * @nocollapse
 */
MdSort.ctorParameters = function () { return []; };
MdSort.propDecorators = {
    'active': [{ type: Input, args: ['mdSortActive',] },],
    'start': [{ type: Input, args: ['mdSortStart',] },],
    'direction': [{ type: Input, args: ['mdSortDirection',] },],
    'disableClear': [{ type: Input, args: ['mdSortDisableClear',] },],
    '_matSortActive': [{ type: Input, args: ['matSortActive',] },],
    '_matSortStart': [{ type: Input, args: ['matSortStart',] },],
    '_matSortDirection': [{ type: Input, args: ['matSortDirection',] },],
    '_matSortDisableClear': [{ type: Input, args: ['matSortDisableClear',] },],
    'sortChange': [{ type: Output, args: ['mdSortChange',] },],
    '_matSortChange': [{ type: Output, args: ['matSortChange',] },],
};
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    var /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}
/**
 * To modify the labels and text displayed, create a new instance of MdSortHeaderIntl and
 * include it in a custom provider.
 */
var MdSortHeaderIntl = (function () {
    function MdSortHeaderIntl() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = function (id) {
            return "Change sorting for " + id;
        };
        /**
         * A label to describe the current sort (visible only to screenreaders).
         */
        this.sortDescriptionLabel = function (id, direction) {
            return "Sorted by " + id + " " + (direction == 'asc' ? 'ascending' : 'descending');
        };
    }
    return MdSortHeaderIntl;
}());
MdSortHeaderIntl.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MdSortHeaderIntl.ctorParameters = function () { return []; };
var SORT_ANIMATION_TRANSITION = AnimationDurations.ENTERING + ' ' + AnimationCurves.STANDARD_CURVE;
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MdSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
var MdSortHeader = (function () {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    function MdSortHeader(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getMdSortHeaderNotContainedWithinMdSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _intl.changes).subscribe(function () {
            changeDetectorRef.markForCheck();
        });
    }
    Object.defineProperty(MdSortHeader.prototype, "disableClear", {
        /**
         * Overrides the disable clear value of the containing MdSort for this MdSortable.
         * @return {?}
         */
        get: function () { return this._disableClear; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this._disableClear = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSortHeader.prototype, "_id", {
        /**
         * @return {?}
         */
        get: function () { return this.id; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) { this.id = v; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnInit = function () {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        this._sort.register(this);
    };
    /**
     * @return {?}
     */
    MdSortHeader.prototype.ngOnDestroy = function () {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    };
    /**
     * Whether this MdSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    MdSortHeader.prototype._isSorted = function () {
        return this._sort.active == this.id && this._sort.direction;
    };
    return MdSortHeader;
}());
MdSortHeader.decorators = [
    { type: Component, args: [{ selector: '[md-sort-header], [mat-sort-header]',
                template: "<div class=\"mat-sort-header-container\" [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"><button class=\"mat-sort-header-button\" type=\"button\" [attr.aria-label]=\"_intl.sortButtonLabel(id)\"><ng-content></ng-content></button><div *ngIf=\"_isSorted()\" class=\"mat-sort-header-arrow\"><div class=\"mat-sort-header-stem\"></div><div class=\"mat-sort-header-indicator\" [@indicator]=\"_sort.direction\"><div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_sort.direction\"></div><div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_sort.direction\"></div><div class=\"mat-sort-header-pointer-middle\"></div></div></div></div><span class=\"cdk-visually-hidden\" *ngIf=\"_isSorted()\">{{_intl.sortDescriptionLabel(id, _sort.direction)}}</span>",
                styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:pointer;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{height:12px;width:12px;margin:0 0 0 6px;position:relative;display:flex}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;transition:225ms cubic-bezier(.4,0,.2,1)}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;transition:225ms cubic-bezier(.4,0,.2,1);position:absolute}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}"],
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
                    ])
                ]
            },] },
];
/**
 * @nocollapse
 */
MdSortHeader.ctorParameters = function () { return [
    { type: MdSortHeaderIntl, },
    { type: ChangeDetectorRef, },
    { type: MdSort, decorators: [{ type: Optional },] },
    { type: CdkColumnDef, decorators: [{ type: Optional },] },
]; };
MdSortHeader.propDecorators = {
    'id': [{ type: Input, args: ['md-sort-header',] },],
    'arrowPosition': [{ type: Input },],
    'start': [{ type: Input, args: ['start',] },],
    'disableClear': [{ type: Input },],
    '_id': [{ type: Input, args: ['mat-sort-header',] },],
};
var MdSortModule = (function () {
    function MdSortModule() {
    }
    return MdSortModule;
}());
MdSortModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MdSort, MdSortHeader],
                declarations: [MdSort, MdSortHeader],
                providers: [MdSortHeaderIntl]
            },] },
];
/**
 * @nocollapse
 */
MdSortModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { MdSortModule, MdSortHeader, MdSortHeaderIntl, MdSort, MdSort as MatSort, MdSortHeader as MatSortHeader, MdSortHeaderIntl as MatSortHeaderIntl, MdSortModule as MatSortModule };
//# sourceMappingURL=sort.es5.js.map
