/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ApplicationRef } from '@angular/core';
import { getDOM } from '../../dom/dom_adapter';
import { window } from '../../facade/browser';
import { isPresent } from '../../facade/lang';
export var ChangeDetectionPerfRecord = (function () {
    /**
     * @param {?} msPerTick
     * @param {?} numTicks
     */
    function ChangeDetectionPerfRecord(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
    }
    return ChangeDetectionPerfRecord;
}());
function ChangeDetectionPerfRecord_tsickle_Closure_declarations() {
    /** @type {?} */
    ChangeDetectionPerfRecord.prototype.msPerTick;
    /** @type {?} */
    ChangeDetectionPerfRecord.prototype.numTicks;
}
/**
 *  Entry point for all Angular debug tools. This object corresponds to the `ng`
  * global variable accessible in the dev console.
 */
export var AngularTools = (function () {
    /**
     * @param {?} ref
     */
    function AngularTools(ref) {
        this.profiler = new AngularProfiler(ref);
    }
    return AngularTools;
}());
function AngularTools_tsickle_Closure_declarations() {
    /** @type {?} */
    AngularTools.prototype.profiler;
}
/**
 *  Entry point for all Angular profiling-related debug tools. This object
  * corresponds to the `ng.profiler` in the dev console.
 */
export var AngularProfiler = (function () {
    /**
     * @param {?} ref
     */
    function AngularProfiler(ref) {
        this.appRef = ref.injector.get(ApplicationRef);
    }
    /**
     *  Exercises change detection in a loop and then prints the average amount of
      * time in milliseconds how long a single round of change detection takes for
      * the current state of the UI. It runs a minimum of 5 rounds for a minimum
      * of 500 milliseconds.
      * *
      * Optionally, a user may pass a `config` parameter containing a map of
      * options. Supported options are:
      * *
      * `record` (boolean) - causes the profiler to record a CPU profile while
      * it exercises the change detector. Example:
      * *
      * ```
      * ng.profiler.timeChangeDetection({record: true})
      * ```
     * @param {?} config
     * @return {?}
     */
    AngularProfiler.prototype.timeChangeDetection = function (config) {
        var /** @type {?} */ record = config && config['record'];
        var /** @type {?} */ profileName = 'Change Detection';
        // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
        var /** @type {?} */ isProfilerAvailable = isPresent(window.console.profile);
        if (record && isProfilerAvailable) {
            window.console.profile(profileName);
        }
        var /** @type {?} */ start = getDOM().performanceNow();
        var /** @type {?} */ numTicks = 0;
        while (numTicks < 5 || (getDOM().performanceNow() - start) < 500) {
            this.appRef.tick();
            numTicks++;
        }
        var /** @type {?} */ end = getDOM().performanceNow();
        if (record && isProfilerAvailable) {
            // need to cast to <any> because type checker thinks there's no argument
            // while in fact there is:
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
            ((window.console.profileEnd))(profileName);
        }
        var /** @type {?} */ msPerTick = (end - start) / numTicks;
        window.console.log("ran " + numTicks + " change detection cycles");
        window.console.log(msPerTick.toFixed(2) + " ms per check");
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
    };
    return AngularProfiler;
}());
function AngularProfiler_tsickle_Closure_declarations() {
    /** @type {?} */
    AngularProfiler.prototype.appRef;
}
//# sourceMappingURL=common_tools.js.map