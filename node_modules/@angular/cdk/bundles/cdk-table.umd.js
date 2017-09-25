/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs/operator/takeUntil'), require('rxjs/BehaviorSubject'), require('rxjs/Subject'), require('@angular/cdk/collections')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'rxjs/operator/takeUntil', 'rxjs/BehaviorSubject', 'rxjs/Subject', '@angular/cdk/collections'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.cdk = global.ng.cdk || {}, global.ng.cdk.table = global.ng.cdk.table || {}),global.ng.common,global.ng.core,global.Rx.Observable.prototype,global.Rx,global.Rx,global.ng.cdk.collections));
}(this, (function (exports,_angular_common,_angular_core,rxjs_operator_takeUntil,rxjs_BehaviorSubject,rxjs_Subject,_angular_cdk_collections) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * The row template that can be used by the md-table. Should not be used outside of the
 * material library.
 */
var CDK_ROW_TEMPLATE = "<ng-container cdkCellOutlet></ng-container>";
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 * @abstract
 */
var BaseRowDef = (function () {
    /**
     * @param {?} template
     * @param {?} _differs
     */
    function BaseRowDef(template, _differs) {
        this.template = template;
        this._differs = _differs;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    BaseRowDef.prototype.ngOnChanges = function (changes) {
        // Create a new columns differ if one does not yet exist. Initialize it based on initial value
        // of the columns property or an empty array if none is provided.
        var /** @type {?} */ columns = changes['columns'].currentValue || [];
        if (!this._columnsDiffer && columns) {
            this._columnsDiffer = this._differs.find(columns).create();
            this._columnsDiffer.diff(columns);
        }
    };
    /**
     * Returns the difference between the current columns and the columns from the last diff, or null
     * if there is no difference.
     * @return {?}
     */
    BaseRowDef.prototype.getColumnsDiff = function () {
        return this._columnsDiffer.diff(this.columns);
    };
    return BaseRowDef;
}());
/**
 * Header row definition for the CDK table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
var CdkHeaderRowDef = (function (_super) {
    __extends(CdkHeaderRowDef, _super);
    /**
     * @param {?} template
     * @param {?} _differs
     */
    function CdkHeaderRowDef(template, _differs) {
        return _super.call(this, template, _differs) || this;
    }
    return CdkHeaderRowDef;
}(BaseRowDef));
CdkHeaderRowDef.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdkHeaderRowDef]',
                inputs: ['columns: cdkHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderRowDef.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
    { type: _angular_core.IterableDiffers, },
]; };
/**
 * Data row definition for the CDK table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
var CdkRowDef = (function (_super) {
    __extends(CdkRowDef, _super);
    /**
     * @param {?} template
     * @param {?} _differs
     */
    function CdkRowDef(template, _differs) {
        return _super.call(this, template, _differs) || this;
    }
    return CdkRowDef;
}(BaseRowDef));
CdkRowDef.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[cdkRowDef]',
                inputs: ['columns: cdkRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
CdkRowDef.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
    { type: _angular_core.IterableDiffers, },
]; };
/**
 * Outlet for rendering cells inside of a row or header row.
 * \@docs-private
 */
var CdkCellOutlet = (function () {
    /**
     * @param {?} _viewContainer
     */
    function CdkCellOutlet(_viewContainer) {
        this._viewContainer = _viewContainer;
        CdkCellOutlet.mostRecentCellOutlet = this;
    }
    return CdkCellOutlet;
}());
CdkCellOutlet.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[cdkCellOutlet]' },] },
];
/**
 * @nocollapse
 */
CdkCellOutlet.ctorParameters = function () { return [
    { type: _angular_core.ViewContainerRef, },
]; };
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
var CdkHeaderRow = (function () {
    function CdkHeaderRow() {
    }
    return CdkHeaderRow;
}());
CdkHeaderRow.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'cdk-header-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'cdk-header-row',
                    'role': 'row',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderRow.ctorParameters = function () { return []; };
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
var CdkRow = (function () {
    function CdkRow() {
    }
    return CdkRow;
}());
CdkRow.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'cdk-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'cdk-row',
                    'role': 'row',
                },
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                encapsulation: _angular_core.ViewEncapsulation.None,
                preserveWhitespaces: false,
            },] },
];
/**
 * @nocollapse
 */
CdkRow.ctorParameters = function () { return []; };
/**
 * Cell definition for a CDK table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
var CdkCellDef = (function () {
    /**
     * @param {?} template
     */
    function CdkCellDef(template) {
        this.template = template;
    }
    return CdkCellDef;
}());
CdkCellDef.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[cdkCellDef]' },] },
];
/**
 * @nocollapse
 */
CdkCellDef.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * Header cell definition for a CDK table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
var CdkHeaderCellDef = (function () {
    /**
     * @param {?} template
     */
    function CdkHeaderCellDef(template) {
        this.template = template;
    }
    return CdkHeaderCellDef;
}());
CdkHeaderCellDef.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[cdkHeaderCellDef]' },] },
];
/**
 * @nocollapse
 */
CdkHeaderCellDef.ctorParameters = function () { return [
    { type: _angular_core.TemplateRef, },
]; };
/**
 * Column definition for the CDK table.
 * Defines a set of cells available for a table column.
 */
var CdkColumnDef = (function () {
    function CdkColumnDef() {
    }
    Object.defineProperty(CdkColumnDef.prototype, "name", {
        /**
         * Unique name for this column.
         * @return {?}
         */
        get: function () { return this._name; },
        /**
         * @param {?} name
         * @return {?}
         */
        set: function (name) {
            this._name = name;
            this.cssClassFriendlyName = name.replace(/[^a-z0-9_-]/ig, '-');
        },
        enumerable: true,
        configurable: true
    });
    return CdkColumnDef;
}());
CdkColumnDef.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[cdkColumnDef]' },] },
];
/**
 * @nocollapse
 */
CdkColumnDef.ctorParameters = function () { return []; };
CdkColumnDef.propDecorators = {
    'name': [{ type: _angular_core.Input, args: ['cdkColumnDef',] },],
    'cell': [{ type: _angular_core.ContentChild, args: [CdkCellDef,] },],
    'headerCell': [{ type: _angular_core.ContentChild, args: [CdkHeaderCellDef,] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
var CdkHeaderCell = (function () {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function CdkHeaderCell(columnDef, elementRef, renderer) {
        renderer.addClass(elementRef.nativeElement, "cdk-column-" + columnDef.cssClassFriendlyName);
    }
    return CdkHeaderCell;
}());
CdkHeaderCell.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'cdk-header-cell',
                host: {
                    'class': 'cdk-header-cell',
                    'role': 'columnheader',
                },
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Cell template container that adds the right classes and role.
 */
var CdkCell = (function () {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    function CdkCell(columnDef, elementRef, renderer) {
        renderer.addClass(elementRef.nativeElement, "cdk-column-" + columnDef.cssClassFriendlyName);
    }
    return CdkCell;
}());
CdkCell.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: 'cdk-cell',
                host: {
                    'class': 'cdk-cell',
                    'role': 'gridcell',
                },
            },] },
];
/**
 * @nocollapse
 */
CdkCell.ctorParameters = function () { return [
    { type: CdkColumnDef, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
/**
 * Returns an error to be thrown when attempting to find an unexisting column.
 * \@docs-private
 * @param {?} id Id whose lookup failed.
 * @return {?}
 */
function getTableUnknownColumnError(id) {
    return Error("cdk-table: Could not find column with id \"" + id + "\".");
}
/**
 * Returns an error to be thrown when two column definitions have the same name.
 * \@docs-private
 * @param {?} name
 * @return {?}
 */
function getTableDuplicateColumnNameError(name) {
    return Error("cdk-table: Duplicate column definition name provided: \"" + name + "\".");
}
/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * \@docs-private
 */
var RowPlaceholder = (function () {
    /**
     * @param {?} viewContainer
     */
    function RowPlaceholder(viewContainer) {
        this.viewContainer = viewContainer;
    }
    return RowPlaceholder;
}());
RowPlaceholder.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[rowPlaceholder]' },] },
];
/**
 * @nocollapse
 */
RowPlaceholder.ctorParameters = function () { return [
    { type: _angular_core.ViewContainerRef, },
]; };
/**
 * Provides a handle for the table to grab the view container's ng-container to insert the header.
 * \@docs-private
 */
var HeaderRowPlaceholder = (function () {
    /**
     * @param {?} viewContainer
     */
    function HeaderRowPlaceholder(viewContainer) {
        this.viewContainer = viewContainer;
    }
    return HeaderRowPlaceholder;
}());
HeaderRowPlaceholder.decorators = [
    { type: _angular_core.Directive, args: [{ selector: '[headerRowPlaceholder]' },] },
];
/**
 * @nocollapse
 */
HeaderRowPlaceholder.ctorParameters = function () { return [
    { type: _angular_core.ViewContainerRef, },
]; };
/**
 * The table template that can be used by the md-table. Should not be used outside of the
 * material library.
 */
var CDK_TABLE_TEMPLATE = "\n  <ng-container headerRowPlaceholder></ng-container>\n  <ng-container rowPlaceholder></ng-container>";
/**
 * A data table that connects with a data source to retrieve data of type `T` and renders
 * a header row and data rows. Updates the rows when new data is provided by the data source.
 */
var CdkTable = (function () {
    /**
     * @param {?} _differs
     * @param {?} _changeDetectorRef
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} role
     */
    function CdkTable(_differs, _changeDetectorRef, elementRef, renderer, role) {
        this._differs = _differs;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Subject that emits when the component has been destroyed.
         */
        this._onDestroy = new rxjs_Subject.Subject();
        /**
         * Latest data provided by the data source through the connect interface.
         */
        this._data = [];
        /**
         * Map of all the user's defined columns (header and data cell template) identified by name.
         */
        this._columnDefinitionsByName = new Map();
        /**
         * Stream containing the latest information on what rows are being displayed on screen.
         * Can be used by the data source to as a heuristic of what data should be provided.
         */
        this.viewChange = new rxjs_BehaviorSubject.BehaviorSubject({ start: 0, end: Number.MAX_VALUE });
        if (!role) {
            renderer.setAttribute(elementRef.nativeElement, 'role', 'grid');
        }
    }
    Object.defineProperty(CdkTable.prototype, "trackBy", {
        /**
         * @return {?}
         */
        get: function () { return this._trackByFn; },
        /**
         * Tracking function that will be used to check the differences in data changes. Used similarly
         * to `ngFor` `trackBy` function. Optimize row operations by identifying a row based on its data
         * relative to the function to know if a row should be added/removed/moved.
         * Accepts a function that takes two parameters, `index` and `item`.
         * @param {?} fn
         * @return {?}
         */
        set: function (fn) {
            if (_angular_core.isDevMode() &&
                fn != null && typeof fn !== 'function' && (console) && (console.warn)) {
                console.warn("trackBy must be a function, but received " + JSON.stringify(fn) + ".");
            }
            this._trackByFn = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkTable.prototype, "dataSource", {
        /**
         * Provides a stream containing the latest data array to render. Influenced by the table's
         * stream of view window (what rows are currently on screen).
         * @return {?}
         */
        get: function () { return this._dataSource; },
        /**
         * @param {?} dataSource
         * @return {?}
         */
        set: function (dataSource) {
            if (this._dataSource !== dataSource) {
                this._switchDataSource(dataSource);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CdkTable.prototype.ngOnInit = function () {
        // TODO(andrewseguin): Setup a listener for scrolling, emit the calculated view to viewChange
        this._dataDiffer = this._differs.find([]).create(this._trackByFn);
    };
    /**
     * @return {?}
     */
    CdkTable.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._cacheColumnDefinitionsByName();
        this._columnDefinitions.changes.subscribe(function () { return _this._cacheColumnDefinitionsByName(); });
        this._renderHeaderRow();
    };
    /**
     * @return {?}
     */
    CdkTable.prototype.ngAfterContentChecked = function () {
        this._renderUpdatedColumns();
        if (this.dataSource && !this._renderChangeSubscription) {
            this._observeRenderChanges();
        }
    };
    /**
     * @return {?}
     */
    CdkTable.prototype.ngOnDestroy = function () {
        this._rowPlaceholder.viewContainer.clear();
        this._headerRowPlaceholder.viewContainer.clear();
        this._onDestroy.next();
        this._onDestroy.complete();
        if (this.dataSource) {
            this.dataSource.disconnect(this);
        }
    };
    /**
     * Update the map containing the content's column definitions.
     * @return {?}
     */
    CdkTable.prototype._cacheColumnDefinitionsByName = function () {
        var _this = this;
        this._columnDefinitionsByName.clear();
        this._columnDefinitions.forEach(function (columnDef) {
            if (_this._columnDefinitionsByName.has(columnDef.name)) {
                throw getTableDuplicateColumnNameError(columnDef.name);
            }
            _this._columnDefinitionsByName.set(columnDef.name, columnDef);
        });
    };
    /**
     * Check if the header or rows have changed what columns they want to display. If there is a diff,
     * then re-render that section.
     * @return {?}
     */
    CdkTable.prototype._renderUpdatedColumns = function () {
        var _this = this;
        // Re-render the rows when the row definition columns change.
        this._rowDefinitions.forEach(function (rowDefinition) {
            if (!!rowDefinition.getColumnsDiff()) {
                // Reset the data to an empty array so that renderRowChanges will re-render all new rows.
                _this._dataDiffer.diff([]);
                _this._rowPlaceholder.viewContainer.clear();
                _this._renderRowChanges();
            }
        });
        // Re-render the header row if there is a difference in its columns.
        if (this._headerDefinition.getColumnsDiff()) {
            this._headerRowPlaceholder.viewContainer.clear();
            this._renderHeaderRow();
        }
    };
    /**
     * Switch to the provided data source by resetting the data and unsubscribing from the current
     * render change subscription if one exists. If the data source is null, interpret this by
     * clearing the row placeholder. Otherwise start listening for new data.
     * @param {?} dataSource
     * @return {?}
     */
    CdkTable.prototype._switchDataSource = function (dataSource) {
        this._data = [];
        if (this.dataSource) {
            this.dataSource.disconnect(this);
        }
        // Stop listening for data from the previous data source.
        if (this._renderChangeSubscription) {
            this._renderChangeSubscription.unsubscribe();
            this._renderChangeSubscription = null;
        }
        // Remove the table's rows if there is now no data source
        if (!dataSource) {
            this._rowPlaceholder.viewContainer.clear();
        }
        this._dataSource = dataSource;
    };
    /**
     * Set up a subscription for the data provided by the data source.
     * @return {?}
     */
    CdkTable.prototype._observeRenderChanges = function () {
        var _this = this;
        this._renderChangeSubscription = rxjs_operator_takeUntil.takeUntil.call(this.dataSource.connect(this), this._onDestroy)
            .subscribe(function (data) {
            _this._data = data;
            _this._renderRowChanges();
        });
    };
    /**
     * Create the embedded view for the header template and place it in the header row view container.
     * @return {?}
     */
    CdkTable.prototype._renderHeaderRow = function () {
        var /** @type {?} */ cells = this._getHeaderCellTemplatesForRow(this._headerDefinition);
        if (!cells.length) {
            return;
        }
        // TODO(andrewseguin): add some code to enforce that exactly
        //   one CdkCellOutlet was instantiated as a result
        //   of `createEmbeddedView`.
        this._headerRowPlaceholder.viewContainer
            .createEmbeddedView(this._headerDefinition.template, { cells: cells });
        cells.forEach(function (cell) {
            CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, {});
        });
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Check for changes made in the data and render each change (row added/removed/moved).
     * @return {?}
     */
    CdkTable.prototype._renderRowChanges = function () {
        var _this = this;
        var /** @type {?} */ changes = this._dataDiffer.diff(this._data);
        if (!changes) {
            return;
        }
        var /** @type {?} */ viewContainer = this._rowPlaceholder.viewContainer;
        changes.forEachOperation(function (item, adjustedPreviousIndex, currentIndex) {
            if (item.previousIndex == null) {
                _this._insertRow(_this._data[currentIndex], currentIndex);
            }
            else if (currentIndex == null) {
                viewContainer.remove(adjustedPreviousIndex);
            }
            else {
                var /** @type {?} */ view = viewContainer.get(adjustedPreviousIndex);
                viewContainer.move(/** @type {?} */ ((view)), currentIndex);
            }
        });
        this._updateRowContext();
    };
    /**
     * Create the embedded view for the data row template and place it in the correct index location
     * within the data row view container.
     * @param {?} rowData
     * @param {?} index
     * @return {?}
     */
    CdkTable.prototype._insertRow = function (rowData, index) {
        // TODO(andrewseguin): Add when predicates to the row definitions
        //   to find the right template to used based on
        //   the data rather than choosing the first row definition.
        var /** @type {?} */ row = this._rowDefinitions.first;
        // Row context that will be provided to both the created embedded row view and its cells.
        var /** @type {?} */ context = { $implicit: rowData };
        // TODO(andrewseguin): add some code to enforce that exactly one
        //   CdkCellOutlet was instantiated as a result  of `createEmbeddedView`.
        this._rowPlaceholder.viewContainer.createEmbeddedView(row.template, context, index);
        // Insert empty cells if there is no data to improve rendering time.
        var /** @type {?} */ cells = rowData ? this._getCellTemplatesForRow(row) : [];
        cells.forEach(function (cell) {
            CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, context);
        });
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Updates the context for each row to reflect any data changes that may have caused
     * rows to be added, removed, or moved. The view container contains the same context
     * that was provided to each of its cells.
     * @return {?}
     */
    CdkTable.prototype._updateRowContext = function () {
        var /** @type {?} */ viewContainer = this._rowPlaceholder.viewContainer;
        for (var /** @type {?} */ index = 0, /** @type {?} */ count = viewContainer.length; index < count; index++) {
            var /** @type {?} */ viewRef = (viewContainer.get(index));
            viewRef.context.index = index;
            viewRef.context.count = count;
            viewRef.context.first = index === 0;
            viewRef.context.last = index === count - 1;
            viewRef.context.even = index % 2 === 0;
            viewRef.context.odd = !viewRef.context.even;
        }
    };
    /**
     * Returns the cell template definitions to insert into the header
     * as defined by its list of columns to display.
     * @param {?} headerDef
     * @return {?}
     */
    CdkTable.prototype._getHeaderCellTemplatesForRow = function (headerDef) {
        var _this = this;
        if (!headerDef.columns) {
            return [];
        }
        return headerDef.columns.map(function (columnId) {
            var /** @type {?} */ column = _this._columnDefinitionsByName.get(columnId);
            if (!column) {
                throw getTableUnknownColumnError(columnId);
            }
            return column.headerCell;
        });
    };
    /**
     * Returns the cell template definitions to insert in the provided row
     * as defined by its list of columns to display.
     * @param {?} rowDef
     * @return {?}
     */
    CdkTable.prototype._getCellTemplatesForRow = function (rowDef) {
        var _this = this;
        if (!rowDef.columns) {
            return [];
        }
        return rowDef.columns.map(function (columnId) {
            var /** @type {?} */ column = _this._columnDefinitionsByName.get(columnId);
            if (!column) {
                throw getTableUnknownColumnError(columnId);
            }
            return column.cell;
        });
    };
    return CdkTable;
}());
CdkTable.decorators = [
    { type: _angular_core.Component, args: [{ selector: 'cdk-table',
                template: CDK_TABLE_TEMPLATE,
                host: {
                    'class': 'cdk-table',
                },
                encapsulation: _angular_core.ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
CdkTable.ctorParameters = function () { return [
    { type: _angular_core.IterableDiffers, },
    { type: _angular_core.ChangeDetectorRef, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['role',] },] },
]; };
CdkTable.propDecorators = {
    'trackBy': [{ type: _angular_core.Input },],
    'dataSource': [{ type: _angular_core.Input },],
    '_rowPlaceholder': [{ type: _angular_core.ViewChild, args: [RowPlaceholder,] },],
    '_headerRowPlaceholder': [{ type: _angular_core.ViewChild, args: [HeaderRowPlaceholder,] },],
    '_columnDefinitions': [{ type: _angular_core.ContentChildren, args: [CdkColumnDef,] },],
    '_headerDefinition': [{ type: _angular_core.ContentChild, args: [CdkHeaderRowDef,] },],
    '_rowDefinitions': [{ type: _angular_core.ContentChildren, args: [CdkRowDef,] },],
};
var EXPORTED_DECLARATIONS = [
    CdkTable,
    CdkRowDef,
    CdkCellDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkColumnDef,
    CdkCell,
    CdkRow,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    RowPlaceholder,
    HeaderRowPlaceholder,
];
var CdkTableModule = (function () {
    function CdkTableModule() {
    }
    return CdkTableModule;
}());
CdkTableModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_common.CommonModule],
                exports: [EXPORTED_DECLARATIONS],
                declarations: [EXPORTED_DECLARATIONS]
            },] },
];
/**
 * @nocollapse
 */
CdkTableModule.ctorParameters = function () { return []; };

exports.DataSource = _angular_cdk_collections.DataSource;
exports.CdkTableModule = CdkTableModule;
exports.RowPlaceholder = RowPlaceholder;
exports.HeaderRowPlaceholder = HeaderRowPlaceholder;
exports.CDK_TABLE_TEMPLATE = CDK_TABLE_TEMPLATE;
exports.CdkTable = CdkTable;
exports.CdkCellDef = CdkCellDef;
exports.CdkHeaderCellDef = CdkHeaderCellDef;
exports.CdkColumnDef = CdkColumnDef;
exports.CdkHeaderCell = CdkHeaderCell;
exports.CdkCell = CdkCell;
exports.CDK_ROW_TEMPLATE = CDK_ROW_TEMPLATE;
exports.BaseRowDef = BaseRowDef;
exports.CdkHeaderRowDef = CdkHeaderRowDef;
exports.CdkRowDef = CdkRowDef;
exports.CdkCellOutlet = CdkCellOutlet;
exports.CdkHeaderRow = CdkHeaderRow;
exports.CdkRow = CdkRow;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-table.umd.js.map
