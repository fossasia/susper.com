/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPresent } from '../facade/lang';
export var StylesCollectionEntry = (function () {
    /**
     * @param {?} time
     * @param {?} value
     */
    function StylesCollectionEntry(time, value) {
        this.time = time;
        this.value = value;
    }
    /**
     * @param {?} time
     * @param {?} value
     * @return {?}
     */
    StylesCollectionEntry.prototype.matches = function (time, value) {
        return time == this.time && value == this.value;
    };
    return StylesCollectionEntry;
}());
function StylesCollectionEntry_tsickle_Closure_declarations() {
    /** @type {?} */
    StylesCollectionEntry.prototype.time;
    /** @type {?} */
    StylesCollectionEntry.prototype.value;
}
export var StylesCollection = (function () {
    function StylesCollection() {
        this.styles = {};
    }
    /**
     * @param {?} property
     * @param {?} time
     * @param {?} value
     * @return {?}
     */
    StylesCollection.prototype.insertAtTime = function (property, time, value) {
        var /** @type {?} */ tuple = new StylesCollectionEntry(time, value);
        var /** @type {?} */ entries = this.styles[property];
        if (!isPresent(entries)) {
            entries = this.styles[property] = [];
        }
        // insert this at the right stop in the array
        // this way we can keep it sorted
        var /** @type {?} */ insertionIndex = 0;
        for (var /** @type {?} */ i = entries.length - 1; i >= 0; i--) {
            if (entries[i].time <= time) {
                insertionIndex = i + 1;
                break;
            }
        }
        entries.splice(insertionIndex, 0, tuple);
    };
    /**
     * @param {?} property
     * @param {?} index
     * @return {?}
     */
    StylesCollection.prototype.getByIndex = function (property, index) {
        var /** @type {?} */ items = this.styles[property];
        if (isPresent(items)) {
            return index >= items.length ? null : items[index];
        }
        return null;
    };
    /**
     * @param {?} property
     * @param {?} time
     * @return {?}
     */
    StylesCollection.prototype.indexOfAtOrBeforeTime = function (property, time) {
        var /** @type {?} */ entries = this.styles[property];
        if (isPresent(entries)) {
            for (var /** @type {?} */ i = entries.length - 1; i >= 0; i--) {
                if (entries[i].time <= time)
                    return i;
            }
        }
        return null;
    };
    return StylesCollection;
}());
function StylesCollection_tsickle_Closure_declarations() {
    /** @type {?} */
    StylesCollection.prototype.styles;
}
//# sourceMappingURL=styles_collection.js.map