/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { getDOM } from '../dom_adapter';
import { EventManagerPlugin } from './event_manager';
var /** @type {?} */ MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
var /** @type {?} */ MODIFIER_KEY_GETTERS = {
    'alt': function (event) { return event.altKey; },
    'control': function (event) { return event.ctrlKey; },
    'meta': function (event) { return event.metaKey; },
    'shift': function (event) { return event.shiftKey; }
};
/**
 * @experimental
 */
export var KeyEventsPlugin = (function (_super) {
    __extends(KeyEventsPlugin, _super);
    function KeyEventsPlugin() {
        _super.call(this);
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    KeyEventsPlugin.prototype.supports = function (eventName) { return KeyEventsPlugin.parseEventName(eventName) != null; };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    KeyEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var /** @type {?} */ parsedEvent = KeyEventsPlugin.parseEventName(eventName);
        var /** @type {?} */ outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(function () {
            return getDOM().onAndCancel(element, parsedEvent['domEventName'], outsideHandler);
        });
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    KeyEventsPlugin.parseEventName = function (eventName) {
        var /** @type {?} */ parts = eventName.toLowerCase().split('.');
        var /** @type {?} */ domEventName = parts.shift();
        if ((parts.length === 0) || !(domEventName === 'keydown' || domEventName === 'keyup')) {
            return null;
        }
        var /** @type {?} */ key = KeyEventsPlugin._normalizeKey(parts.pop());
        var /** @type {?} */ fullKey = '';
        MODIFIER_KEYS.forEach(function (modifierName) {
            var /** @type {?} */ index = parts.indexOf(modifierName);
            if (index > -1) {
                parts.splice(index, 1);
                fullKey += modifierName + '.';
            }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
            // returning null instead of throwing to let another plugin process the event
            return null;
        }
        var /** @type {?} */ result = {};
        result['domEventName'] = domEventName;
        result['fullKey'] = fullKey;
        return result;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    KeyEventsPlugin.getEventFullKey = function (event) {
        var /** @type {?} */ fullKey = '';
        var /** @type {?} */ key = getDOM().getEventKey(event);
        key = key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        MODIFIER_KEYS.forEach(function (modifierName) {
            if (modifierName != key) {
                var /** @type {?} */ modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        fullKey += key;
        return fullKey;
    };
    /**
     * @param {?} fullKey
     * @param {?} handler
     * @param {?} zone
     * @return {?}
     */
    KeyEventsPlugin.eventCallback = function (fullKey, handler, zone) {
        return function (event /** TODO #9100 */) {
            if (KeyEventsPlugin.getEventFullKey(event) === fullKey) {
                zone.runGuarded(function () { return handler(event); });
            }
        };
    };
    /**
     * @param {?} keyName
     * @return {?}
     */
    KeyEventsPlugin._normalizeKey = function (keyName) {
        // TODO: switch to a Map if the mapping grows too much
        switch (keyName) {
            case 'esc':
                return 'escape';
            default:
                return keyName;
        }
    };
    KeyEventsPlugin.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    KeyEventsPlugin.ctorParameters = function () { return []; };
    return KeyEventsPlugin;
}(EventManagerPlugin));
function KeyEventsPlugin_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyEventsPlugin.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    KeyEventsPlugin.ctorParameters;
}
//# sourceMappingURL=key_events.js.map