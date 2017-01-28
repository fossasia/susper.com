import { AUTO_STYLE } from '@angular/core';
export var MockAnimationPlayer = (function () {
    function MockAnimationPlayer(startingStyles, keyframes, previousPlayers) {
        var _this = this;
        if (startingStyles === void 0) { startingStyles = {}; }
        if (keyframes === void 0) { keyframes = []; }
        if (previousPlayers === void 0) { previousPlayers = []; }
        this.startingStyles = startingStyles;
        this.keyframes = keyframes;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._finished = false;
        this._destroyed = false;
        this._started = false;
        this.parentPlayer = null;
        this.previousStyles = {};
        this.log = [];
        previousPlayers.forEach(function (player) {
            if (player instanceof MockAnimationPlayer) {
                var styles_1 = player._captureStyles();
                Object.keys(styles_1).forEach(function (prop) { return _this.previousStyles[prop] = styles_1[prop]; });
            }
        });
    }
    MockAnimationPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this.log.push('finish');
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    MockAnimationPlayer.prototype.init = function () { this.log.push('init'); };
    MockAnimationPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    MockAnimationPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    MockAnimationPlayer.prototype.hasStarted = function () { return this._started; };
    MockAnimationPlayer.prototype.play = function () {
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
            this._started = true;
        }
        this.log.push('play');
    };
    MockAnimationPlayer.prototype.pause = function () { this.log.push('pause'); };
    MockAnimationPlayer.prototype.restart = function () { this.log.push('restart'); };
    MockAnimationPlayer.prototype.finish = function () { this._onFinish(); };
    MockAnimationPlayer.prototype.reset = function () {
        this.log.push('reset');
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    };
    MockAnimationPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._destroyed = true;
            this.finish();
            this.log.push('destroy');
        }
    };
    MockAnimationPlayer.prototype.setPosition = function (p) { };
    MockAnimationPlayer.prototype.getPosition = function () { return 0; };
    MockAnimationPlayer.prototype._captureStyles = function () {
        var _this = this;
        var captures = {};
        if (this.hasStarted()) {
            // when assembling the captured styles, it's important that
            // we build the keyframe styles in the following order:
            // {startingStyles, ... other styles within keyframes, ... previousStyles }
            Object.keys(this.startingStyles).forEach(function (prop) {
                captures[prop] = _this.startingStyles[prop];
            });
            this.keyframes.forEach(function (kf) {
                var offset = kf[0], styles = kf[1];
                var newStyles = {};
                Object.keys(styles).forEach(function (prop) { captures[prop] = _this._finished ? styles[prop] : AUTO_STYLE; });
            });
        }
        Object.keys(this.previousStyles).forEach(function (prop) {
            captures[prop] = _this.previousStyles[prop];
        });
        return captures;
    };
    return MockAnimationPlayer;
}());
//# sourceMappingURL=mock_animation_player.js.map