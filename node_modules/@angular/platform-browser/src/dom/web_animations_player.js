/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AUTO_STYLE } from '@angular/core';
import { isPresent } from '../facade/lang';
import { getDOM } from './dom_adapter';
export var WebAnimationsPlayer = (function () {
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @param {?=} previousPlayers
     */
    function WebAnimationsPlayer(element, keyframes, options, previousPlayers) {
        var _this = this;
        if (previousPlayers === void 0) { previousPlayers = []; }
        this.element = element;
        this.keyframes = keyframes;
        this.options = options;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._initialized = false;
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this.parentPlayer = null;
        this._duration = options['duration'];
        this.previousStyles = {};
        previousPlayers.forEach(function (player) {
            var styles = player._captureStyles();
            Object.keys(styles).forEach(function (prop) { return _this.previousStyles[prop] = styles[prop]; });
        });
    }
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.init = function () {
        var _this = this;
        if (this._initialized)
            return;
        this._initialized = true;
        var /** @type {?} */ keyframes = this.keyframes.map(function (styles) {
            var /** @type {?} */ formattedKeyframe = {};
            Object.keys(styles).forEach(function (prop, index) {
                var /** @type {?} */ value = styles[prop];
                if (value == AUTO_STYLE) {
                    value = _computeStyle(_this.element, prop);
                }
                if (value != undefined) {
                    formattedKeyframe[prop] = value;
                }
            });
            return formattedKeyframe;
        });
        var /** @type {?} */ previousStyleProps = Object.keys(this.previousStyles);
        if (previousStyleProps.length) {
            var /** @type {?} */ startingKeyframe_1 = findStartingKeyframe(keyframes);
            previousStyleProps.forEach(function (prop) {
                if (isPresent(startingKeyframe_1[prop])) {
                    startingKeyframe_1[prop] = _this.previousStyles[prop];
                }
            });
        }
        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
        this._finalKeyframe = _copyKeyframeStyles(keyframes[keyframes.length - 1]);
        // this is required so that the player doesn't start to animate right away
        this._resetDomPlayerState();
        this._player.addEventListener('finish', function () { return _this._onFinish(); });
    };
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @return {?}
     */
    WebAnimationsPlayer.prototype._triggerWebAnimation = function (element, keyframes, options) {
        return (element.animate(keyframes, options));
    };
    Object.defineProperty(WebAnimationsPlayer.prototype, "domPlayer", {
        /**
         * @return {?}
         */
        get: function () { return this._player; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.play = function () {
        this.init();
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
            this._started = true;
        }
        this._player.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.pause = function () {
        this.init();
        this._player.pause();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.finish = function () {
        this.init();
        this._onFinish();
        this._player.finish();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.reset = function () {
        this._resetDomPlayerState();
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._resetDomPlayerState = function () {
        if (this._player) {
            this._player.cancel();
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.restart = function () {
        this.reset();
        this.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.hasStarted = function () { return this._started; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._resetDomPlayerState();
            this._onFinish();
            this._destroyed = true;
        }
    };
    Object.defineProperty(WebAnimationsPlayer.prototype, "totalTime", {
        /**
         * @return {?}
         */
        get: function () { return this._duration; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} p
     * @return {?}
     */
    WebAnimationsPlayer.prototype.setPosition = function (p) { this._player.currentTime = p * this.totalTime; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.getPosition = function () { return this._player.currentTime / this.totalTime; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._captureStyles = function () {
        var _this = this;
        var /** @type {?} */ styles = {};
        if (this.hasStarted()) {
            Object.keys(this._finalKeyframe).forEach(function (prop) {
                if (prop != 'offset') {
                    styles[prop] =
                        _this._finished ? _this._finalKeyframe[prop] : _computeStyle(_this.element, prop);
                }
            });
        }
        return styles;
    };
    return WebAnimationsPlayer;
}());
function WebAnimationsPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    WebAnimationsPlayer.prototype._onDoneFns;
    /** @type {?} */
    WebAnimationsPlayer.prototype._onStartFns;
    /** @type {?} */
    WebAnimationsPlayer.prototype._player;
    /** @type {?} */
    WebAnimationsPlayer.prototype._duration;
    /** @type {?} */
    WebAnimationsPlayer.prototype._initialized;
    /** @type {?} */
    WebAnimationsPlayer.prototype._finished;
    /** @type {?} */
    WebAnimationsPlayer.prototype._started;
    /** @type {?} */
    WebAnimationsPlayer.prototype._destroyed;
    /** @type {?} */
    WebAnimationsPlayer.prototype._finalKeyframe;
    /** @type {?} */
    WebAnimationsPlayer.prototype.parentPlayer;
    /** @type {?} */
    WebAnimationsPlayer.prototype.previousStyles;
    /** @type {?} */
    WebAnimationsPlayer.prototype.element;
    /** @type {?} */
    WebAnimationsPlayer.prototype.keyframes;
    /** @type {?} */
    WebAnimationsPlayer.prototype.options;
}
/**
 * @param {?} element
 * @param {?} prop
 * @return {?}
 */
function _computeStyle(element, prop) {
    return getDOM().getComputedStyle(element)[prop];
}
/**
 * @param {?} styles
 * @return {?}
 */
function _copyKeyframeStyles(styles) {
    var /** @type {?} */ newStyles = {};
    Object.keys(styles).forEach(function (prop) {
        if (prop != 'offset') {
            newStyles[prop] = styles[prop];
        }
    });
    return newStyles;
}
/**
 * @param {?} keyframes
 * @return {?}
 */
function findStartingKeyframe(keyframes) {
    var /** @type {?} */ startingKeyframe = keyframes[0];
    // it's important that we find the LAST keyframe
    // to ensure that style overidding is final.
    for (var /** @type {?} */ i = 1; i < keyframes.length; i++) {
        var /** @type {?} */ kf = keyframes[i];
        var /** @type {?} */ offset = kf['offset'];
        if (offset !== 0)
            break;
        startingKeyframe = kf;
    }
    return startingKeyframe;
}
//# sourceMappingURL=web_animations_player.js.map