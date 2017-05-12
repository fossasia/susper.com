/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { scheduleMicroTask } from '../facade/lang';
/**
 * @abstract
 */
export var AnimationPlayer = (function () {
    function AnimationPlayer() {
    }
    /**
     * @abstract
     * @param {?} fn
     * @return {?}
     */
    AnimationPlayer.prototype.onDone = function (fn) { };
    /**
     * @abstract
     * @param {?} fn
     * @return {?}
     */
    AnimationPlayer.prototype.onStart = function (fn) { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.init = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.hasStarted = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.play = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.pause = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.restart = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.finish = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.destroy = function () { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.reset = function () { };
    /**
     * @abstract
     * @param {?} p
     * @return {?}
     */
    AnimationPlayer.prototype.setPosition = function (p) { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationPlayer.prototype.getPosition = function () { };
    Object.defineProperty(AnimationPlayer.prototype, "parentPlayer", {
        /**
         * @return {?}
         */
        get: function () { throw new Error('NOT IMPLEMENTED: Base Class'); },
        /**
         * @param {?} player
         * @return {?}
         */
        set: function (player) { throw new Error('NOT IMPLEMENTED: Base Class'); },
        enumerable: true,
        configurable: true
    });
    return AnimationPlayer;
}());
export var NoOpAnimationPlayer = (function () {
    function NoOpAnimationPlayer() {
        var _this = this;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._started = false;
        this.parentPlayer = null;
        scheduleMicroTask(function () { return _this._onFinish(); });
    }
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype._onFinish = function () {
        this._onDoneFns.forEach(function (fn) { return fn(); });
        this._onDoneFns = [];
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.hasStarted = function () { return this._started; };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.init = function () { };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.play = function () {
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
        }
        this._started = true;
    };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.pause = function () { };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.restart = function () { };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.finish = function () { this._onFinish(); };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.destroy = function () { };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.reset = function () { };
    /**
     * @param {?} p
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.setPosition = function (p) { };
    /**
     * @return {?}
     */
    NoOpAnimationPlayer.prototype.getPosition = function () { return 0; };
    return NoOpAnimationPlayer;
}());
function NoOpAnimationPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    NoOpAnimationPlayer.prototype._onDoneFns;
    /** @type {?} */
    NoOpAnimationPlayer.prototype._onStartFns;
    /** @type {?} */
    NoOpAnimationPlayer.prototype._started;
    /** @type {?} */
    NoOpAnimationPlayer.prototype.parentPlayer;
}
//# sourceMappingURL=animation_player.js.map