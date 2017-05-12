/**
 *  This class should not be used directly by an application developer. Instead, use
  * {@link Location}.
  * *
  * `PlatformLocation` encapsulates all calls to DOM apis, which allows the Router to be platform
  * agnostic.
  * This means that we can have different implementation of `PlatformLocation` for the different
  * platforms
  * that angular supports. For example, the default `PlatformLocation` is {@link
  * BrowserPlatformLocation},
  * however when you run your app in a WebWorker you use {@link WebWorkerPlatformLocation}.
  * *
  * The `PlatformLocation` class is used directly by all implementations of {@link LocationStrategy}
  * when
  * they need to interact with the DOM apis like pushState, popState, etc...
  * *
  * {@link LocationStrategy} in turn is used by the {@link Location} service which is used directly
  * by
  * the {@link Router} in order to navigate between routes. Since all interactions between {@link
  * Router} /
  * {@link Location} / {@link LocationStrategy} and DOM apis flow through the `PlatformLocation`
  * class
  * they are all platform independent.
  * *
 * @abstract
 */
export var PlatformLocation = (function () {
    function PlatformLocation() {
    }
    /**
     * @abstract
     * @return {?}
     */
    PlatformLocation.prototype.getBaseHrefFromDOM = function () { };
    /**
     * @abstract
     * @param {?} fn
     * @return {?}
     */
    PlatformLocation.prototype.onPopState = function (fn) { };
    /**
     * @abstract
     * @param {?} fn
     * @return {?}
     */
    PlatformLocation.prototype.onHashChange = function (fn) { };
    Object.defineProperty(PlatformLocation.prototype, "pathname", {
        /**
         * @return {?}
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlatformLocation.prototype, "search", {
        /**
         * @return {?}
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlatformLocation.prototype, "hash", {
        /**
         * @return {?}
         */
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    /**
     * @abstract
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    PlatformLocation.prototype.replaceState = function (state, title, url) { };
    /**
     * @abstract
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    PlatformLocation.prototype.pushState = function (state, title, url) { };
    /**
     * @abstract
     * @return {?}
     */
    PlatformLocation.prototype.forward = function () { };
    /**
     * @abstract
     * @return {?}
     */
    PlatformLocation.prototype.back = function () { };
    return PlatformLocation;
}());
//# sourceMappingURL=platform_location.js.map