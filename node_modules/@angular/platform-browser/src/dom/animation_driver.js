/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NoOpAnimationPlayer } from '../private_import_core';
/**
 * @experimental
 */
export var NoOpAnimationDriver = (function () {
    function NoOpAnimationDriver() {
    }
    /**
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    NoOpAnimationDriver.prototype.animate = function (element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        return new NoOpAnimationPlayer();
    };
    return NoOpAnimationDriver;
}());
/**
 * @abstract
 */
export var AnimationDriver = (function () {
    function AnimationDriver() {
    }
    /**
     * @abstract
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    AnimationDriver.prototype.animate = function (element, startingStyles, keyframes, duration, delay, easing, previousPlayers) { };
    AnimationDriver.NOOP = new NoOpAnimationDriver();
    return AnimationDriver;
}());
function AnimationDriver_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationDriver.NOOP;
}
//# sourceMappingURL=animation_driver.js.map