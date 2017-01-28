/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operator/concatMap';
import { every } from 'rxjs/operator/every';
import { first } from 'rxjs/operator/first';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { reduce } from 'rxjs/operator/reduce';
import { applyRedirects } from './apply_redirects';
import { validateConfig } from './config';
import { createRouterState } from './create_router_state';
import { createUrlTree } from './create_url_tree';
import { recognize } from './recognize';
import { RouterConfigLoader } from './router_config_loader';
import { RouterOutletMap } from './router_outlet_map';
import { ActivatedRoute, advanceActivatedRoute, createEmptyState, equalParamsAndUrlSegments, inheritedParamsDataResolve } from './router_state';
import { NavigationCancelingError, PRIMARY_OUTLET } from './shared';
import { DefaultUrlHandlingStrategy } from './url_handling_strategy';
import { UrlTree, containsTree, createEmptyUrlTree } from './url_tree';
import { andObservables, forEach, merge, waitForMap, wrapIntoObservable } from './utils/collection';
/**
 *  *
 */
export var NavigationStart = (function () {
    /**
     * @param {?} id
     * @param {?} url
     */
    function NavigationStart(id, url) {
        this.id = id;
        this.url = url;
    }
    /**
     * @return {?}
     */
    NavigationStart.prototype.toString = function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationStart;
}());
function NavigationStart_tsickle_Closure_declarations() {
    /** @type {?} */
    NavigationStart.prototype.id;
    /** @type {?} */
    NavigationStart.prototype.url;
}
/**
 *  *
 */
export var NavigationEnd = (function () {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     */
    function NavigationEnd(id, url, urlAfterRedirects) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
    }
    /**
     * @return {?}
     */
    NavigationEnd.prototype.toString = function () {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
    };
    return NavigationEnd;
}());
function NavigationEnd_tsickle_Closure_declarations() {
    /** @type {?} */
    NavigationEnd.prototype.id;
    /** @type {?} */
    NavigationEnd.prototype.url;
    /** @type {?} */
    NavigationEnd.prototype.urlAfterRedirects;
}
/**
 *  *
 */
export var NavigationCancel = (function () {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} reason
     */
    function NavigationCancel(id, url, reason) {
        this.id = id;
        this.url = url;
        this.reason = reason;
    }
    /**
     * @return {?}
     */
    NavigationCancel.prototype.toString = function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationCancel;
}());
function NavigationCancel_tsickle_Closure_declarations() {
    /** @type {?} */
    NavigationCancel.prototype.id;
    /** @type {?} */
    NavigationCancel.prototype.url;
    /** @type {?} */
    NavigationCancel.prototype.reason;
}
/**
 *  *
 */
export var NavigationError = (function () {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} error
     */
    function NavigationError(id, url, error) {
        this.id = id;
        this.url = url;
        this.error = error;
    }
    /**
     * @return {?}
     */
    NavigationError.prototype.toString = function () {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
    };
    return NavigationError;
}());
function NavigationError_tsickle_Closure_declarations() {
    /** @type {?} */
    NavigationError.prototype.id;
    /** @type {?} */
    NavigationError.prototype.url;
    /** @type {?} */
    NavigationError.prototype.error;
}
/**
 *  *
 */
export var RoutesRecognized = (function () {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    function RoutesRecognized(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    /**
     * @return {?}
     */
    RoutesRecognized.prototype.toString = function () {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return RoutesRecognized;
}());
function RoutesRecognized_tsickle_Closure_declarations() {
    /** @type {?} */
    RoutesRecognized.prototype.id;
    /** @type {?} */
    RoutesRecognized.prototype.url;
    /** @type {?} */
    RoutesRecognized.prototype.urlAfterRedirects;
    /** @type {?} */
    RoutesRecognized.prototype.state;
}
/**
 * @param {?} error
 * @return {?}
 */
function defaultErrorHandler(error) {
    throw error;
}
/**
 *  Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
export var DefaultRouteReuseStrategy = (function () {
    function DefaultRouteReuseStrategy() {
    }
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldDetach = function (route) { return false; };
    /**
     * @param {?} route
     * @param {?} detachedTree
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.store = function (route, detachedTree) { };
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldAttach = function (route) { return false; };
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.retrieve = function (route) { return null; };
    /**
     * @param {?} future
     * @param {?} curr
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
        return future.routeConfig === curr.routeConfig;
    };
    return DefaultRouteReuseStrategy;
}());
/**
 *  *
  * See {@link Routes} for more details and examples.
  * *
  * *
 */
export var Router = (function () {
    /**
     * @param {?} rootComponentType
     * @param {?} urlSerializer
     * @param {?} outletMap
     * @param {?} location
     * @param {?} injector
     * @param {?} loader
     * @param {?} compiler
     * @param {?} config
     */
    function Router(rootComponentType, urlSerializer, outletMap, location, injector, loader, compiler, config) {
        this.rootComponentType = rootComponentType;
        this.urlSerializer = urlSerializer;
        this.outletMap = outletMap;
        this.location = location;
        this.injector = injector;
        this.config = config;
        this.navigations = new BehaviorSubject(null);
        this.routerEvents = new Subject();
        this.navigationId = 0;
        /**
         * Error handler that is invoked when a navigation errors.
         *
         * See {@link ErrorHandler} for more information.
         */
        this.errorHandler = defaultErrorHandler;
        /**
         * Indicates if at least one navigation happened.
         */
        this.navigated = false;
        /**
         * Extracts and merges URLs. Used for Angular 1 to Angular 2 migrations.
         */
        this.urlHandlingStrategy = new DefaultUrlHandlingStrategy();
        this.routeReuseStrategy = new DefaultRouteReuseStrategy();
        this.resetConfig(config);
        this.currentUrlTree = createEmptyUrlTree();
        this.rawUrlTree = this.currentUrlTree;
        this.configLoader = new RouterConfigLoader(loader, compiler);
        this.currentRouterState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        this.processNavigations();
    }
    /**
     *  TODO: this should be removed once the constructor of the router made internal
     * @param {?} rootComponentType
     * @return {?}
     */
    Router.prototype.resetRootComponentType = function (rootComponentType) {
        this.rootComponentType = rootComponentType;
        // TODO: vsavkin router 4.0 should make the root component set to null
        // this will simplify the lifecycle of the router.
        this.currentRouterState.root.component = this.rootComponentType;
    };
    /**
     *  Sets up the location change listener and performs the initial navigation.
     * @return {?}
     */
    Router.prototype.initialNavigation = function () {
        this.setUpLocationChangeListener();
        this.navigateByUrl(this.location.path(true), { replaceUrl: true });
    };
    /**
     *  Sets up the location change listener.
     * @return {?}
     */
    Router.prototype.setUpLocationChangeListener = function () {
        var _this = this;
        // Zone.current.wrap is needed because of the issue with RxJS scheduler,
        // which does not work properly with zone.js in IE and Safari
        if (!this.locationSubscription) {
            this.locationSubscription = (this.location.subscribe(Zone.current.wrap(function (change) {
                var /** @type {?} */ rawUrlTree = _this.urlSerializer.parse(change['url']);
                var /** @type {?} */ lastNavigation = _this.navigations.value;
                // If the user triggers a navigation imperatively (e.g., by using navigateByUrl),
                // and that navigation results in 'replaceState' that leads to the same URL,
                // we should skip those.
                if (lastNavigation && lastNavigation.imperative &&
                    lastNavigation.rawUrl.toString() === rawUrlTree.toString()) {
                    return;
                }
                setTimeout(function () {
                    _this.scheduleNavigation(rawUrlTree, false, { skipLocationChange: change['pop'], replaceUrl: true });
                }, 0);
            })));
        }
    };
    Object.defineProperty(Router.prototype, "routerState", {
        /**
         *  The current route state
         * @return {?}
         */
        get: function () { return this.currentRouterState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "url", {
        /**
         *  The current url
         * @return {?}
         */
        get: function () { return this.serializeUrl(this.currentUrlTree); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "events", {
        /**
         *  An observable of router events
         * @return {?}
         */
        get: function () { return this.routerEvents; },
        enumerable: true,
        configurable: true
    });
    /**
     *  Resets the configuration used for navigation and generating links.
      * *
      * ### Usage
      * *
      * ```
      * router.resetConfig([
      * { path: 'team/:id', component: TeamCmp, children: [
      * { path: 'simple', component: SimpleCmp },
      * { path: 'user/:name', component: UserCmp }
      * ]}
      * ]);
      * ```
     * @param {?} config
     * @return {?}
     */
    Router.prototype.resetConfig = function (config) {
        validateConfig(config);
        this.config = config;
    };
    /**
     * @return {?}
     */
    Router.prototype.ngOnDestroy = function () { this.dispose(); };
    /**
     *  Disposes of the router
     * @return {?}
     */
    Router.prototype.dispose = function () {
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
            this.locationSubscription = null;
        }
    };
    /**
     *  Applies an array of commands to the current url tree and creates a new url tree.
      * *
      * When given an activate route, applies the given commands starting from the route.
      * When not given a route, applies the given command starting from the root.
      * *
      * ### Usage
      * *
      * ```
      * // create /team/33/user/11
      * router.createUrlTree(['/team', 33, 'user', 11]);
      * *
      * // create /team/33;expand=true/user/11
      * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
      * *
      * // you can collapse static segments like this (this works only with the first passed-in value):
      * router.createUrlTree(['/team/33/user', userId]);
      * *
      * // If the first segment can contain slashes, and you do not want the router to split it, you
      * // can do the following:
      * *
      * router.createUrlTree([{segmentPath: '/one/two'}]);
      * *
      * // create /team/33/(user/11//right:chat)
      * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
      * *
      * // remove the right secondary node
      * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
      * *
      * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
      * *
      * // navigate to /team/33/user/11/details
      * router.createUrlTree(['details'], {relativeTo: route});
      * *
      * // navigate to /team/33/user/22
      * router.createUrlTree(['../22'], {relativeTo: route});
      * *
      * // navigate to /team/44/user/22
      * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
      * ```
     * @param {?} commands
     * @param {?=} __1
     * @return {?}
     */
    Router.prototype.createUrlTree = function (commands, _a) {
        var _b = _a === void 0 ? {} : _a, relativeTo = _b.relativeTo, queryParams = _b.queryParams, fragment = _b.fragment, preserveQueryParams = _b.preserveQueryParams, preserveFragment = _b.preserveFragment;
        var /** @type {?} */ a = relativeTo || this.routerState.root;
        var /** @type {?} */ q = preserveQueryParams ? this.currentUrlTree.queryParams : queryParams;
        var /** @type {?} */ f = preserveFragment ? this.currentUrlTree.fragment : fragment;
        return createUrlTree(a, this.currentUrlTree, commands, q, f);
    };
    /**
     *  Navigate based on the provided url. This navigation is always absolute.
      * *
      * Returns a promise that:
      * - resolves to 'true' when navigation succeeds,
      * - resolves to 'false' when navigation fails,
      * - is rejected when an error happens.
      * *
      * ### Usage
      * *
      * ```
      * router.navigateByUrl("/team/33/user/11");
      * *
      * // Navigate without updating the URL
      * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
      * ```
      * *
      * In opposite to `navigate`, `navigateByUrl` takes a whole URL
      * and does not apply any delta to the current one.
     * @param {?} url
     * @param {?=} extras
     * @return {?}
     */
    Router.prototype.navigateByUrl = function (url, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        if (url instanceof UrlTree) {
            return this.scheduleNavigation(this.urlHandlingStrategy.merge(url, this.rawUrlTree), true, extras);
        }
        var /** @type {?} */ urlTree = this.urlSerializer.parse(url);
        return this.scheduleNavigation(this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree), true, extras);
    };
    /**
     *  Navigate based on the provided array of commands and a starting point.
      * If no starting route is provided, the navigation is absolute.
      * *
      * Returns a promise that:
      * - resolves to 'true' when navigation succeeds,
      * - resolves to 'false' when navigation fails,
      * - is rejected when an error happens.
      * *
      * ### Usage
      * *
      * ```
      * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
      * *
      * // Navigate without updating the URL
      * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
      * ```
      * *
      * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
      * URL.
     * @param {?} commands
     * @param {?=} extras
     * @return {?}
     */
    Router.prototype.navigate = function (commands, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        if (typeof extras.queryParams === 'object' && extras.queryParams !== null) {
            extras.queryParams = this.removeEmptyProps(extras.queryParams);
        }
        return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
    };
    /**
     *  Serializes a {@link UrlTree} into a string
     * @param {?} url
     * @return {?}
     */
    Router.prototype.serializeUrl = function (url) { return this.urlSerializer.serialize(url); };
    /**
     *  Parses a string into a {@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    Router.prototype.parseUrl = function (url) { return this.urlSerializer.parse(url); };
    /**
     *  Returns whether the url is activated
     * @param {?} url
     * @param {?} exact
     * @return {?}
     */
    Router.prototype.isActive = function (url, exact) {
        if (url instanceof UrlTree) {
            return containsTree(this.currentUrlTree, url, exact);
        }
        else {
            var /** @type {?} */ urlTree = this.urlSerializer.parse(url);
            return containsTree(this.currentUrlTree, urlTree, exact);
        }
    };
    /**
     * @param {?} params
     * @return {?}
     */
    Router.prototype.removeEmptyProps = function (params) {
        return Object.keys(params).reduce(function (result, key) {
            var /** @type {?} */ value = params[key];
            if (value !== null && value !== undefined) {
                result[key] = value;
            }
            return result;
        }, {});
    };
    /**
     * @return {?}
     */
    Router.prototype.processNavigations = function () {
        var _this = this;
        concatMap
            .call(this.navigations, function (nav) {
            if (nav) {
                _this.executeScheduledNavigation(nav);
                // a failed navigation should not stop the router from processing
                // further navigations => the catch
                return nav.promise.catch(function () { });
            }
            else {
                return (of(null));
            }
        })
            .subscribe(function () { });
    };
    /**
     * @param {?} rawUrl
     * @param {?} imperative
     * @param {?} extras
     * @return {?}
     */
    Router.prototype.scheduleNavigation = function (rawUrl, imperative, extras) {
        var /** @type {?} */ resolve = null;
        var /** @type {?} */ reject = null;
        var /** @type {?} */ promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var /** @type {?} */ id = ++this.navigationId;
        this.navigations.next({ id: id, imperative: imperative, rawUrl: rawUrl, extras: extras, resolve: resolve, reject: reject, promise: promise });
        // Make sure that the error is propagated even though `processNavigations` catch
        // handler does not rethrow
        return promise.catch(function (e) { return Promise.reject(e); });
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    Router.prototype.executeScheduledNavigation = function (_a) {
        var _this = this;
        var id = _a.id, rawUrl = _a.rawUrl, extras = _a.extras, resolve = _a.resolve, reject = _a.reject;
        var /** @type {?} */ url = this.urlHandlingStrategy.extract(rawUrl);
        var /** @type {?} */ urlTransition = !this.navigated || url.toString() !== this.currentUrlTree.toString();
        if (urlTransition && this.urlHandlingStrategy.shouldProcessUrl(rawUrl)) {
            this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
            Promise.resolve()
                .then(function (_) { return _this.runNavigate(url, rawUrl, extras.skipLocationChange, extras.replaceUrl, id, null); })
                .then(resolve, reject);
        }
        else if (urlTransition && this.rawUrlTree &&
            this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
            this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
            Promise.resolve()
                .then(function (_) { return _this.runNavigate(url, rawUrl, false, false, id, createEmptyState(url, _this.rootComponentType).snapshot); })
                .then(resolve, reject);
        }
        else {
            this.rawUrlTree = rawUrl;
            resolve(null);
        }
    };
    /**
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} shouldPreventPushState
     * @param {?} shouldReplaceUrl
     * @param {?} id
     * @param {?} precreatedState
     * @return {?}
     */
    Router.prototype.runNavigate = function (url, rawUrl, shouldPreventPushState, shouldReplaceUrl, id, precreatedState) {
        var _this = this;
        if (id !== this.navigationId) {
            this.location.go(this.urlSerializer.serialize(this.currentUrlTree));
            this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url), "Navigation ID " + id + " is not equal to the current navigation id " + this.navigationId));
            return Promise.resolve(false);
        }
        return new Promise(function (resolvePromise, rejectPromise) {
            // create an observable of the url and route state snapshot
            // this operation do not result in any side effects
            var /** @type {?} */ urlAndSnapshot$;
            if (!precreatedState) {
                var /** @type {?} */ redirectsApplied$ = applyRedirects(_this.injector, _this.configLoader, _this.urlSerializer, url, _this.config);
                urlAndSnapshot$ = mergeMap.call(redirectsApplied$, function (appliedUrl) {
                    return map.call(recognize(_this.rootComponentType, _this.config, appliedUrl, _this.serializeUrl(appliedUrl)), function (snapshot) {
                        _this.routerEvents.next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(appliedUrl), snapshot));
                        return { appliedUrl: appliedUrl, snapshot: snapshot };
                    });
                });
            }
            else {
                urlAndSnapshot$ = of({ appliedUrl: url, snapshot: precreatedState });
            }
            // run preactivation: guards and data resolvers
            var /** @type {?} */ preActivation;
            var /** @type {?} */ preactivationTraverse$ = map.call(urlAndSnapshot$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                preActivation =
                    new PreActivation(snapshot, _this.currentRouterState.snapshot, _this.injector);
                preActivation.traverse(_this.outletMap);
                return { appliedUrl: appliedUrl, snapshot: snapshot };
            });
            var /** @type {?} */ preactivationCheckGuards = mergeMap.call(preactivationTraverse$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                if (_this.navigationId !== id)
                    return of(false);
                return map.call(preActivation.checkGuards(), function (shouldActivate) {
                    return { appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate };
                });
            });
            var /** @type {?} */ preactivationResolveData$ = mergeMap.call(preactivationCheckGuards, function (p) {
                if (_this.navigationId !== id)
                    return of(false);
                if (p.shouldActivate) {
                    return map.call(preActivation.resolveData(), function () { return p; });
                }
                else {
                    return of(p);
                }
            });
            // create router state
            // this operation has side effects => route state is being affected
            var /** @type {?} */ routerState$ = map.call(preactivationResolveData$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot, shouldActivate = _a.shouldActivate;
                if (shouldActivate) {
                    var /** @type {?} */ state = createRouterState(_this.routeReuseStrategy, snapshot, _this.currentRouterState);
                    return { appliedUrl: appliedUrl, state: state, shouldActivate: shouldActivate };
                }
                else {
                    return { appliedUrl: appliedUrl, state: null, shouldActivate: shouldActivate };
                }
            });
            // applied the new router state
            // this operation has side effects
            var /** @type {?} */ navigationIsSuccessful;
            var /** @type {?} */ storedState = _this.currentRouterState;
            var /** @type {?} */ storedUrl = _this.currentUrlTree;
            routerState$
                .forEach(function (_a) {
                var appliedUrl = _a.appliedUrl, state = _a.state, shouldActivate = _a.shouldActivate;
                if (!shouldActivate || id !== _this.navigationId) {
                    navigationIsSuccessful = false;
                    return;
                }
                _this.currentUrlTree = appliedUrl;
                _this.rawUrlTree = _this.urlHandlingStrategy.merge(_this.currentUrlTree, rawUrl);
                _this.currentRouterState = state;
                if (!shouldPreventPushState) {
                    var /** @type {?} */ path = _this.urlSerializer.serialize(_this.rawUrlTree);
                    if (_this.location.isCurrentPathEqualTo(path) || shouldReplaceUrl) {
                        _this.location.replaceState(path);
                    }
                    else {
                        _this.location.go(path);
                    }
                }
                new ActivateRoutes(_this.routeReuseStrategy, state, storedState)
                    .activate(_this.outletMap);
                navigationIsSuccessful = true;
            })
                .then(function () {
                _this.navigated = true;
                if (navigationIsSuccessful) {
                    _this.routerEvents.next(new NavigationEnd(id, _this.serializeUrl(url), _this.serializeUrl(_this.currentUrlTree)));
                    resolvePromise(true);
                }
                else {
                    _this.resetUrlToCurrentUrlTree();
                    _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url), ''));
                    resolvePromise(false);
                }
            }, function (e) {
                if (e instanceof NavigationCancelingError) {
                    _this.resetUrlToCurrentUrlTree();
                    _this.navigated = true;
                    _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url), e.message));
                    resolvePromise(false);
                }
                else {
                    _this.routerEvents.next(new NavigationError(id, _this.serializeUrl(url), e));
                    try {
                        resolvePromise(_this.errorHandler(e));
                    }
                    catch (ee) {
                        rejectPromise(ee);
                    }
                }
                _this.currentRouterState = storedState;
                _this.currentUrlTree = storedUrl;
                _this.rawUrlTree = _this.urlHandlingStrategy.merge(_this.currentUrlTree, rawUrl);
                _this.location.replaceState(_this.serializeUrl(_this.rawUrlTree));
            });
        });
    };
    /**
     * @return {?}
     */
    Router.prototype.resetUrlToCurrentUrlTree = function () {
        var /** @type {?} */ path = this.urlSerializer.serialize(this.rawUrlTree);
        this.location.replaceState(path);
    };
    return Router;
}());
function Router_tsickle_Closure_declarations() {
    /** @type {?} */
    Router.prototype.currentUrlTree;
    /** @type {?} */
    Router.prototype.rawUrlTree;
    /** @type {?} */
    Router.prototype.navigations;
    /** @type {?} */
    Router.prototype.routerEvents;
    /** @type {?} */
    Router.prototype.currentRouterState;
    /** @type {?} */
    Router.prototype.locationSubscription;
    /** @type {?} */
    Router.prototype.navigationId;
    /** @type {?} */
    Router.prototype.configLoader;
    /**
     * Error handler that is invoked when a navigation errors.
     * *
     * See {@link ErrorHandler} for more information.
     * @type {?}
     */
    Router.prototype.errorHandler;
    /**
     * Indicates if at least one navigation happened.
     * @type {?}
     */
    Router.prototype.navigated;
    /**
     * Extracts and merges URLs. Used for Angular 1 to Angular 2 migrations.
     * @type {?}
     */
    Router.prototype.urlHandlingStrategy;
    /** @type {?} */
    Router.prototype.routeReuseStrategy;
    /** @type {?} */
    Router.prototype.rootComponentType;
    /** @type {?} */
    Router.prototype.urlSerializer;
    /** @type {?} */
    Router.prototype.outletMap;
    /** @type {?} */
    Router.prototype.location;
    /** @type {?} */
    Router.prototype.injector;
    /** @type {?} */
    Router.prototype.config;
}
var CanActivate = (function () {
    /**
     * @param {?} path
     */
    function CanActivate(path) {
        this.path = path;
    }
    Object.defineProperty(CanActivate.prototype, "route", {
        /**
         * @return {?}
         */
        get: function () { return this.path[this.path.length - 1]; },
        enumerable: true,
        configurable: true
    });
    return CanActivate;
}());
function CanActivate_tsickle_Closure_declarations() {
    /** @type {?} */
    CanActivate.prototype.path;
}
var CanDeactivate = (function () {
    /**
     * @param {?} component
     * @param {?} route
     */
    function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
    }
    return CanDeactivate;
}());
function CanDeactivate_tsickle_Closure_declarations() {
    /** @type {?} */
    CanDeactivate.prototype.component;
    /** @type {?} */
    CanDeactivate.prototype.route;
}
export var PreActivation = (function () {
    /**
     * @param {?} future
     * @param {?} curr
     * @param {?} injector
     */
    function PreActivation(future, curr, injector) {
        this.future = future;
        this.curr = curr;
        this.injector = injector;
        this.checks = [];
    }
    /**
     * @param {?} parentOutletMap
     * @return {?}
     */
    PreActivation.prototype.traverse = function (parentOutletMap) {
        var /** @type {?} */ futureRoot = this.future._root;
        var /** @type {?} */ currRoot = this.curr ? this.curr._root : null;
        this.traverseChildRoutes(futureRoot, currRoot, parentOutletMap, [futureRoot.value]);
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.checkGuards = function () {
        var _this = this;
        if (this.checks.length === 0)
            return of(true);
        var /** @type {?} */ checks$ = from(this.checks);
        var /** @type {?} */ runningChecks$ = mergeMap.call(checks$, function (s) {
            if (s instanceof CanActivate) {
                return andObservables(from([_this.runCanActivateChild(s.path), _this.runCanActivate(s.route)]));
            }
            else if (s instanceof CanDeactivate) {
                // workaround https://github.com/Microsoft/TypeScript/issues/7271
                var /** @type {?} */ s2 = (s);
                return _this.runCanDeactivate(s2.component, s2.route);
            }
            else {
                throw new Error('Cannot be reached');
            }
        });
        return every.call(runningChecks$, function (result) { return result === true; });
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.resolveData = function () {
        var _this = this;
        if (this.checks.length === 0)
            return of(null);
        var /** @type {?} */ checks$ = from(this.checks);
        var /** @type {?} */ runningChecks$ = concatMap.call(checks$, function (s) {
            if (s instanceof CanActivate) {
                return _this.runResolve(s.route);
            }
            else {
                return of(null);
            }
        });
        return reduce.call(runningChecks$, function (_, __) { return _; });
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} outletMap
     * @param {?} futurePath
     * @return {?}
     */
    PreActivation.prototype.traverseChildRoutes = function (futureNode, currNode, outletMap, futurePath) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) {
            _this.traverseRoutes(c, prevChildren[c.value.outlet], outletMap, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        forEach(prevChildren, function (v, k) { return _this.deactiveRouteAndItsChildren(v, outletMap._outlets[k]); });
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentOutletMap
     * @param {?} futurePath
     * @return {?}
     */
    PreActivation.prototype.traverseRoutes = function (futureNode, currNode, parentOutletMap, futurePath) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        var /** @type {?} */ outlet = parentOutletMap ? parentOutletMap._outlets[futureNode.value.outlet] : null;
        // reusing the node
        if (curr && future._routeConfig === curr._routeConfig) {
            if (!equalParamsAndUrlSegments(future, curr)) {
                this.checks.push(new CanDeactivate(outlet.component, curr), new CanActivate(futurePath));
            }
            else {
                // we need to set the data
                future.data = curr.data;
                future._resolvedData = curr._resolvedData;
            }
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.traverseChildRoutes(futureNode, currNode, outlet ? outlet.outletMap : null, futurePath);
            }
            else {
                this.traverseChildRoutes(futureNode, currNode, parentOutletMap, futurePath);
            }
        }
        else {
            if (curr) {
                this.deactiveRouteAndItsChildren(currNode, outlet);
            }
            this.checks.push(new CanActivate(futurePath));
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.traverseChildRoutes(futureNode, null, outlet ? outlet.outletMap : null, futurePath);
            }
            else {
                this.traverseChildRoutes(futureNode, null, parentOutletMap, futurePath);
            }
        }
    };
    /**
     * @param {?} route
     * @param {?} outlet
     * @return {?}
     */
    PreActivation.prototype.deactiveRouteAndItsChildren = function (route, outlet) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(route);
        var /** @type {?} */ r = route.value;
        forEach(prevChildren, function (v, k) {
            if (!r.component) {
                _this.deactiveRouteAndItsChildren(v, outlet);
            }
            else if (!!outlet) {
                _this.deactiveRouteAndItsChildren(v, outlet.outletMap._outlets[k]);
            }
            else {
                _this.deactiveRouteAndItsChildren(v, null);
            }
        });
        if (!r.component) {
            this.checks.push(new CanDeactivate(null, r));
        }
        else if (outlet && outlet.isActivated) {
            this.checks.push(new CanDeactivate(outlet.component, r));
        }
        else {
            this.checks.push(new CanDeactivate(null, r));
        }
    };
    /**
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.runCanActivate = function (future) {
        var _this = this;
        var /** @type {?} */ canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of(true);
        var /** @type {?} */ obs = map.call(from(canActivate), function (c) {
            var /** @type {?} */ guard = _this.getToken(c, future);
            var /** @type {?} */ observable;
            if (guard.canActivate) {
                observable = wrapIntoObservable(guard.canActivate(future, _this.future));
            }
            else {
                observable = wrapIntoObservable(guard(future, _this.future));
            }
            return first.call(observable);
        });
        return andObservables(obs);
    };
    /**
     * @param {?} path
     * @return {?}
     */
    PreActivation.prototype.runCanActivateChild = function (path) {
        var _this = this;
        var /** @type {?} */ future = path[path.length - 1];
        var /** @type {?} */ canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(function (p) { return _this.extractCanActivateChild(p); })
            .filter(function (_) { return _ !== null; });
        return andObservables(map.call(from(canActivateChildGuards), function (d) {
            var /** @type {?} */ obs = map.call(from(d.guards), function (c) {
                var /** @type {?} */ guard = _this.getToken(c, c.node);
                var /** @type {?} */ observable;
                if (guard.canActivateChild) {
                    observable = wrapIntoObservable(guard.canActivateChild(future, _this.future));
                }
                else {
                    observable = wrapIntoObservable(guard(future, _this.future));
                }
                return first.call(observable);
            });
            return andObservables(obs);
        }));
    };
    /**
     * @param {?} p
     * @return {?}
     */
    PreActivation.prototype.extractCanActivateChild = function (p) {
        var /** @type {?} */ canActivateChild = p._routeConfig ? p._routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    };
    /**
     * @param {?} component
     * @param {?} curr
     * @return {?}
     */
    PreActivation.prototype.runCanDeactivate = function (component, curr) {
        var _this = this;
        var /** @type {?} */ canDeactivate = curr && curr._routeConfig ? curr._routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of(true);
        var /** @type {?} */ canDeactivate$ = mergeMap.call(from(canDeactivate), function (c) {
            var /** @type {?} */ guard = _this.getToken(c, curr);
            var /** @type {?} */ observable;
            if (guard.canDeactivate) {
                observable = wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr));
            }
            else {
                observable = wrapIntoObservable(guard(component, curr, _this.curr));
            }
            return first.call(observable);
        });
        return every.call(canDeactivate$, function (result) { return result === true; });
    };
    /**
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.runResolve = function (future) {
        var /** @type {?} */ resolve = future._resolve;
        return map.call(this.resolveNode(resolve, future), function (resolvedData) {
            future._resolvedData = resolvedData;
            future.data = merge(future.data, inheritedParamsDataResolve(future).resolve);
            return null;
        });
    };
    /**
     * @param {?} resolve
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.resolveNode = function (resolve, future) {
        var _this = this;
        return waitForMap(resolve, function (k, v) {
            var /** @type {?} */ resolver = _this.getToken(v, future);
            return resolver.resolve ? wrapIntoObservable(resolver.resolve(future, _this.future)) :
                wrapIntoObservable(resolver(future, _this.future));
        });
    };
    /**
     * @param {?} token
     * @param {?} snapshot
     * @return {?}
     */
    PreActivation.prototype.getToken = function (token, snapshot) {
        var /** @type {?} */ config = closestLoadedConfig(snapshot);
        var /** @type {?} */ injector = config ? config.injector : this.injector;
        return injector.get(token);
    };
    return PreActivation;
}());
function PreActivation_tsickle_Closure_declarations() {
    /** @type {?} */
    PreActivation.prototype.checks;
    /** @type {?} */
    PreActivation.prototype.future;
    /** @type {?} */
    PreActivation.prototype.curr;
    /** @type {?} */
    PreActivation.prototype.injector;
}
var ActivateRoutes = (function () {
    /**
     * @param {?} routeReuseStrategy
     * @param {?} futureState
     * @param {?} currState
     */
    function ActivateRoutes(routeReuseStrategy, futureState, currState) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
    }
    /**
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.activate = function (parentOutletMap) {
        var /** @type {?} */ futureRoot = this.futureState._root;
        var /** @type {?} */ currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentOutletMap);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentOutletMap);
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} outletMap
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateChildRoutes = function (futureNode, currNode, outletMap) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) {
            _this.deactivateRoutes(c, prevChildren[c.value.outlet], outletMap);
            delete prevChildren[c.value.outlet];
        });
        forEach(prevChildren, function (v, k) { return _this.deactiveRouteAndItsChildren(v, outletMap); });
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} outletMap
     * @return {?}
     */
    ActivateRoutes.prototype.activateChildRoutes = function (futureNode, currNode, outletMap) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) { _this.activateRoutes(c, prevChildren[c.value.outlet], outletMap); });
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateRoutes = function (futureNode, currNode, parentOutletMap) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        // reusing the node
        if (future === curr) {
            // If we have a normal route, we need to go through an outlet.
            if (future.component) {
                var /** @type {?} */ outlet = getOutlet(parentOutletMap, future);
                this.deactivateChildRoutes(futureNode, currNode, outlet.outletMap);
            }
            else {
                this.deactivateChildRoutes(futureNode, currNode, parentOutletMap);
            }
        }
        else {
            if (curr) {
                this.deactiveRouteAndItsChildren(currNode, parentOutletMap);
            }
        }
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.activateRoutes = function (futureNode, currNode, parentOutletMap) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        // reusing the node
        if (future === curr) {
            // advance the route to push the parameters
            advanceActivatedRoute(future);
            // If we have a normal route, we need to go through an outlet.
            if (future.component) {
                var /** @type {?} */ outlet = getOutlet(parentOutletMap, future);
                this.activateChildRoutes(futureNode, currNode, outlet.outletMap);
            }
            else {
                this.activateChildRoutes(futureNode, currNode, parentOutletMap);
            }
        }
        else {
            // if we have a normal route, we need to advance the route
            // and place the component into the outlet. After that recurse.
            if (future.component) {
                advanceActivatedRoute(future);
                var /** @type {?} */ outlet = getOutlet(parentOutletMap, futureNode.value);
                if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
                    var /** @type {?} */ stored = ((this.routeReuseStrategy.retrieve(future.snapshot)));
                    this.routeReuseStrategy.store(future.snapshot, null);
                    outlet.attach(stored.componentRef, stored.route.value);
                    advanceActivatedRouteNodeAndItsChildren(stored.route);
                }
                else {
                    var /** @type {?} */ outletMap = new RouterOutletMap();
                    this.placeComponentIntoOutlet(outletMap, future, outlet);
                    this.activateChildRoutes(futureNode, null, outletMap);
                }
            }
            else {
                advanceActivatedRoute(future);
                this.activateChildRoutes(futureNode, null, parentOutletMap);
            }
        }
    };
    /**
     * @param {?} outletMap
     * @param {?} future
     * @param {?} outlet
     * @return {?}
     */
    ActivateRoutes.prototype.placeComponentIntoOutlet = function (outletMap, future, outlet) {
        var /** @type {?} */ resolved = ([{ provide: ActivatedRoute, useValue: future }, {
                provide: RouterOutletMap,
                useValue: outletMap
            }]);
        var /** @type {?} */ config = parentLoadedConfig(future.snapshot);
        var /** @type {?} */ resolver = null;
        var /** @type {?} */ injector = null;
        if (config) {
            injector = config.injectorFactory(outlet.locationInjector);
            resolver = config.factoryResolver;
            resolved.push({ provide: ComponentFactoryResolver, useValue: resolver });
        }
        else {
            injector = outlet.locationInjector;
            resolver = outlet.locationFactoryResolver;
        }
        outlet.activate(future, resolver, injector, ReflectiveInjector.resolve(resolved), outletMap);
    };
    /**
     * @param {?} route
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.deactiveRouteAndItsChildren = function (route, parentOutletMap) {
        if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
            this.detachAndStoreRouteSubtree(route, parentOutletMap);
        }
        else {
            this.deactiveRouteAndOutlet(route, parentOutletMap);
        }
    };
    /**
     * @param {?} route
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.detachAndStoreRouteSubtree = function (route, parentOutletMap) {
        var /** @type {?} */ outlet = getOutlet(parentOutletMap, route.value);
        var /** @type {?} */ componentRef = outlet.detach();
        this.routeReuseStrategy.store(route.value.snapshot, { componentRef: componentRef, route: route });
    };
    /**
     * @param {?} route
     * @param {?} parentOutletMap
     * @return {?}
     */
    ActivateRoutes.prototype.deactiveRouteAndOutlet = function (route, parentOutletMap) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(route);
        var /** @type {?} */ outlet = null;
        // getOutlet throws when cannot find the right outlet,
        // which can happen if an outlet was in an NgIf and was removed
        try {
            outlet = getOutlet(parentOutletMap, route.value);
        }
        catch (e) {
            return;
        }
        var /** @type {?} */ childOutletMap = outlet.outletMap;
        forEach(prevChildren, function (v, k) {
            if (route.value.component) {
                _this.deactiveRouteAndItsChildren(v, childOutletMap);
            }
            else {
                _this.deactiveRouteAndItsChildren(v, parentOutletMap);
            }
        });
        if (outlet && outlet.isActivated) {
            outlet.deactivate();
        }
    };
    return ActivateRoutes;
}());
function ActivateRoutes_tsickle_Closure_declarations() {
    /** @type {?} */
    ActivateRoutes.prototype.routeReuseStrategy;
    /** @type {?} */
    ActivateRoutes.prototype.futureState;
    /** @type {?} */
    ActivateRoutes.prototype.currState;
}
/**
 * @param {?} node
 * @return {?}
 */
function advanceActivatedRouteNodeAndItsChildren(node) {
    advanceActivatedRoute(node.value);
    node.children.forEach(advanceActivatedRouteNodeAndItsChildren);
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function parentLoadedConfig(snapshot) {
    var /** @type {?} */ s = snapshot.parent;
    while (s) {
        var /** @type {?} */ c = s._routeConfig;
        if (c && c._loadedConfig)
            return c._loadedConfig;
        if (c && c.component)
            return null;
        s = s.parent;
    }
    return null;
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    var /** @type {?} */ s = snapshot.parent;
    while (s) {
        var /** @type {?} */ c = s._routeConfig;
        if (c && c._loadedConfig)
            return c._loadedConfig;
        s = s.parent;
    }
    return null;
}
/**
 * @param {?} node
 * @return {?}
 */
function nodeChildrenAsMap(node) {
    return node ? node.children.reduce(function (m, c) {
        m[c.value.outlet] = c;
        return m;
    }, {}) : {};
}
/**
 * @param {?} outletMap
 * @param {?} route
 * @return {?}
 */
function getOutlet(outletMap, route) {
    var /** @type {?} */ outlet = outletMap._outlets[route.outlet];
    if (!outlet) {
        var /** @type {?} */ componentName = ((route.component)).name;
        if (route.outlet === PRIMARY_OUTLET) {
            throw new Error("Cannot find primary outlet to load '" + componentName + "'");
        }
        else {
            throw new Error("Cannot find the outlet " + route.outlet + " to load '" + componentName + "'");
        }
    }
    return outlet;
}
//# sourceMappingURL=router.js.map