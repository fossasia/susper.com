/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs/Subject';
import { Injectable, Optional, SkipSelf } from '@angular/core';

/**
 * @abstract
 */
var DataSource = (function () {
    function DataSource() {
    }
    /**
     * Connects a collection viewer (such as a data-table) to this data source. Note that
     * the stream provided will be accessed during change detection and should not directly change
     * values that are bound in template views.
     * @abstract
     * @param {?} collectionViewer The component that exposes a view over the data provided by this
     *     data source.
     * @return {?} Observable that emits a new value when the data changes.
     */
    DataSource.prototype.connect = function (collectionViewer) { };
    /**
     * Disconnects a collection viewer (such as a data-table) from this data source. Can be used
     * to perform any clean-up or tear-down operations when a view is being destroyed.
     *
     * @abstract
     * @param {?} collectionViewer The component that exposes a view over the data provided by this
     *     data source.
     * @return {?}
     */
    DataSource.prototype.disconnect = function (collectionViewer) { };
    return DataSource;
}());

/**
 * Class to be used to power selecting one or more options from a list.
 */
var SelectionModel = (function () {
    /**
     * @param {?=} _isMulti
     * @param {?=} initiallySelectedValues
     * @param {?=} _emitChanges
     */
    function SelectionModel(_isMulti, initiallySelectedValues, _emitChanges) {
        if (_isMulti === void 0) { _isMulti = false; }
        if (_emitChanges === void 0) { _emitChanges = true; }
        var _this = this;
        this._isMulti = _isMulti;
        this._emitChanges = _emitChanges;
        /**
         * Currently-selected values.
         */
        this._selection = new Set();
        /**
         * Keeps track of the deselected options that haven't been emitted by the change event.
         */
        this._deselectedToEmit = [];
        /**
         * Keeps track of the selected option that haven't been emitted by the change event.
         */
        this._selectedToEmit = [];
        /**
         * Event emitted when the value has changed.
         */
        this.onChange = this._emitChanges ? new Subject() : null;
        if (initiallySelectedValues) {
            if (_isMulti) {
                initiallySelectedValues.forEach(function (value) { return _this._markSelected(value); });
            }
            else {
                this._markSelected(initiallySelectedValues[0]);
            }
            // Clear the array in order to avoid firing the change event for preselected values.
            this._selectedToEmit.length = 0;
        }
    }
    Object.defineProperty(SelectionModel.prototype, "selected", {
        /**
         * Selected value(s).
         * @return {?}
         */
        get: function () {
            if (!this._selected) {
                this._selected = Array.from(this._selection.values());
            }
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects a value or an array of values.
     * @param {...?} values
     * @return {?}
     */
    SelectionModel.prototype.select = function () {
        var _this = this;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this._verifyValueAssignment(values);
        values.forEach(function (value) { return _this._markSelected(value); });
        this._emitChangeEvent();
    };
    /**
     * Deselects a value or an array of values.
     * @param {...?} values
     * @return {?}
     */
    SelectionModel.prototype.deselect = function () {
        var _this = this;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this._verifyValueAssignment(values);
        values.forEach(function (value) { return _this._unmarkSelected(value); });
        this._emitChangeEvent();
    };
    /**
     * Toggles a value between selected and deselected.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.toggle = function (value) {
        this.isSelected(value) ? this.deselect(value) : this.select(value);
    };
    /**
     * Clears all of the selected values.
     * @return {?}
     */
    SelectionModel.prototype.clear = function () {
        this._unmarkAll();
        this._emitChangeEvent();
    };
    /**
     * Determines whether a value is selected.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype.isSelected = function (value) {
        return this._selection.has(value);
    };
    /**
     * Determines whether the model does not have a value.
     * @return {?}
     */
    SelectionModel.prototype.isEmpty = function () {
        return this._selection.size === 0;
    };
    /**
     * Determines whether the model has a value.
     * @return {?}
     */
    SelectionModel.prototype.hasValue = function () {
        return !this.isEmpty();
    };
    /**
     * Sorts the selected values based on a predicate function.
     * @param {?=} predicate
     * @return {?}
     */
    SelectionModel.prototype.sort = function (predicate) {
        if (this._isMulti && this._selected) {
            this._selected.sort(predicate);
        }
    };
    /**
     * Emits a change event and clears the records of selected and deselected values.
     * @return {?}
     */
    SelectionModel.prototype._emitChangeEvent = function () {
        if (this._selectedToEmit.length || this._deselectedToEmit.length) {
            var /** @type {?} */ eventData = new SelectionChange(this._selectedToEmit, this._deselectedToEmit);
            if (this.onChange) {
                this.onChange.next(eventData);
            }
            this._deselectedToEmit = [];
            this._selectedToEmit = [];
        }
        this._selected = null;
    };
    /**
     * Selects a value.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype._markSelected = function (value) {
        if (!this.isSelected(value)) {
            if (!this._isMulti) {
                this._unmarkAll();
            }
            this._selection.add(value);
            if (this._emitChanges) {
                this._selectedToEmit.push(value);
            }
        }
    };
    /**
     * Deselects a value.
     * @param {?} value
     * @return {?}
     */
    SelectionModel.prototype._unmarkSelected = function (value) {
        if (this.isSelected(value)) {
            this._selection.delete(value);
            if (this._emitChanges) {
                this._deselectedToEmit.push(value);
            }
        }
    };
    /**
     * Clears out the selected values.
     * @return {?}
     */
    SelectionModel.prototype._unmarkAll = function () {
        var _this = this;
        if (!this.isEmpty()) {
            this._selection.forEach(function (value) { return _this._unmarkSelected(value); });
        }
    };
    /**
     * Verifies the value assignment and throws an error if the specified value array is
     * including multiple values while the selection model is not supporting multiple values.
     * @param {?} values
     * @return {?}
     */
    SelectionModel.prototype._verifyValueAssignment = function (values) {
        if (values.length > 1 && !this._isMulti) {
            throw getMultipleValuesInSingleSelectionError();
        }
    };
    return SelectionModel;
}());
/**
 * Describes an event emitted when the value of a MatSelectionModel has changed.
 * \@docs-private
 */
var SelectionChange = (function () {
    /**
     * @param {?=} added
     * @param {?=} removed
     */
    function SelectionChange(added, removed) {
        this.added = added;
        this.removed = removed;
    }
    return SelectionChange;
}());
/**
 * Returns an error that reports that multiple values are passed into a selection model
 * with a single value.
 * @return {?}
 */
function getMultipleValuesInSingleSelectionError() {
    return Error('Cannot pass multiple values into SelectionModel with single-value mode.');
}

/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var UniqueSelectionDispatcher = (function () {
    function UniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /**
     * Notify other items that selection for the given name has been set.
     * @param {?} id ID of the item.
     * @param {?} name Name of the item.
     * @return {?}
     */
    UniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /**
     * Listen for future changes to item selection.
     * @param {?} listener
     * @return {?} Function used to deregister listener
     */
    UniqueSelectionDispatcher.prototype.listen = function (listener) {
        var _this = this;
        this._listeners.push(listener);
        return function () {
            _this._listeners = _this._listeners.filter(function (registered) {
                return listener !== registered;
            });
        };
    };
    UniqueSelectionDispatcher.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    UniqueSelectionDispatcher.ctorParameters = function () { return []; };
    return UniqueSelectionDispatcher;
}());
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @return {?}
 */
function UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new UniqueSelectionDispatcher();
}
/**
 * \@docs-private
 */
var UNIQUE_SELECTION_DISPATCHER_PROVIDER = {
    // If there is already a dispatcher available, use that. Otherwise, provide a new one.
    provide: UniqueSelectionDispatcher,
    deps: [[new Optional(), new SkipSelf(), UniqueSelectionDispatcher]],
    useFactory: UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY
};

/**
 * Generated bundle index. Do not edit.
 */

export { UniqueSelectionDispatcher, UNIQUE_SELECTION_DISPATCHER_PROVIDER, DataSource, SelectionModel, SelectionChange, getMultipleValuesInSingleSelectionError, UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY as ɵa };
//# sourceMappingURL=collections.es5.js.map
