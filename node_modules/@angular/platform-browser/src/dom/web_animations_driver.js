/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPresent } from '../facade/lang';
import { WebAnimationsPlayer } from './web_animations_player';
export var WebAnimationsDriver = (function () {
    function WebAnimationsDriver() {
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
    WebAnimationsDriver.prototype.animate = function (element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var /** @type {?} */ formattedSteps = [];
        var /** @type {?} */ startingStyleLookup = {};
        if (isPresent(startingStyles) && startingStyles.styles.length > 0) {
            startingStyleLookup = _populateStyles(startingStyles, {});
            startingStyleLookup['offset'] = 0;
            formattedSteps.push(startingStyleLookup);
        }
        keyframes.forEach(function (keyframe) {
            var /** @type {?} */ data = _populateStyles(keyframe.styles, startingStyleLookup);
            data['offset'] = Math.max(0, Math.min(1, keyframe.offset));
            formattedSteps.push(data);
        });
        // this is a special case when only styles are applied as an
        // animation. When this occurs we want to animate from start to
        // end with the same values. Removing the offset and having only
        // start/end values is suitable enough for the web-animations API
        if (formattedSteps.length == 1) {
            var /** @type {?} */ start = formattedSteps[0];
            start['offset'] = null;
            formattedSteps = [start, start];
        }
        var /** @type {?} */ playerOptions = {
            'duration': duration,
            'delay': delay,
            'fill': 'both' // we use `both` because it allows for styling at 0% to work with `delay`
        };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        // there may be a chance a NoOp player is returned depending
        // on when the previous animation was cancelled
        previousPlayers = previousPlayers.filter(filterWebAnimationPlayerFn);
        return new WebAnimationsPlayer(element, formattedSteps, playerOptions, /** @type {?} */ (previousPlayers));
    };
    return WebAnimationsDriver;
}());
/**
 * @param {?} styles
 * @param {?} defaultStyles
 * @return {?}
 */
function _populateStyles(styles, defaultStyles) {
    var /** @type {?} */ data = {};
    styles.styles.forEach(function (entry) { Object.keys(entry).forEach(function (prop) { data[prop] = entry[prop]; }); });
    Object.keys(defaultStyles).forEach(function (prop) {
        if (!isPresent(data[prop])) {
            data[prop] = defaultStyles[prop];
        }
    });
    return data;
}
/**
 * @param {?} player
 * @return {?}
 */
function filterWebAnimationPlayerFn(player) {
    return player instanceof WebAnimationsPlayer;
}
//# sourceMappingURL=web_animations_driver.js.map