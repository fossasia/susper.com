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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PRIMARY_OUTLET } from './shared';
import { UrlSegment, equalSegments } from './url_tree';
import { merge, shallowEqual, shallowEqualArrays } from './utils/collection';
import { Tree, TreeNode } from './utils/tree';
/**
 *  *
  * *
  * ```
  * class MyComponent {
  * constructor(router: Router) {
  * const state: RouterState = router.routerState;
  * const root: ActivatedRoute = state.root;
  * const child = root.firstChild;
  * const id: Observable<string> = child.params.map(p => p.id);
  * //...
  * }
  * }
  * ```
  * *
  * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
  * segments,
  * the extracted parameters, and the resolved data.
  * *
  * See {@link ActivatedRoute} for more information.
  * *
 */
export var RouterState = (function (_super) {
    __extends(RouterState, _super);
    /**
     * @param {?} root
     * @param {?} snapshot
     */
    function RouterState(root, snapshot) {
        _super.call(this, root);
        this.snapshot = snapshot;
        setRouterStateSnapshot(this, root);
    }
    /**
     * @return {?}
     */
    RouterState.prototype.toString = function () { return this.snapshot.toString(); };
    return RouterState;
}(Tree));
function RouterState_tsickle_Closure_declarations() {
    /**
     * The current snapshot of the router state
     * @type {?}
     */
    RouterState.prototype.snapshot;
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyState(urlTree, rootComponent) {
    var /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    var /** @type {?} */ emptyUrl = new BehaviorSubject([new UrlSegment('', {})]);
    var /** @type {?} */ emptyParams = new BehaviorSubject({});
    var /** @type {?} */ emptyData = new BehaviorSubject({});
    var /** @type {?} */ emptyQueryParams = new BehaviorSubject({});
    var /** @type {?} */ fragment = new BehaviorSubject('');
    var /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new TreeNode(activated, []), snapshot);
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyStateSnapshot(urlTree, rootComponent) {
    var /** @type {?} */ emptyParams = {};
    var /** @type {?} */ emptyData = {};
    var /** @type {?} */ emptyQueryParams = {};
    var /** @type {?} */ fragment = '';
    var /** @type {?} */ activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
    return new RouterStateSnapshot('', new TreeNode(activated, []));
}
/**
 *  outlet.
  * An `ActivatedRoute` can also be used to traverse the router state tree.
  * *
  * *
  * ```
  * class MyComponent {
  * constructor(route: ActivatedRoute) {
  * const id: Observable<string> = route.params.map(p => p.id);
  * const url: Observable<string> = route.url.map(segments => segments.join(''));
  * // route.data includes both `data` and `resolve`
  * const user = route.data.map(d => d.user);
  * }
  * }
  * ```
  * *
 */
export var ActivatedRoute = (function () {
    /**
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} futureSnapshot
     */
    function ActivatedRoute(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
    }
    Object.defineProperty(ActivatedRoute.prototype, "routeConfig", {
        /**
         *  The configuration used to match this route
         * @return {?}
         */
        get: function () { return this._futureSnapshot.routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "root", {
        /**
         *  The root of the router state
         * @return {?}
         */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "parent", {
        /**
         *  The parent of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "firstChild", {
        /**
         *  The first child of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "children", {
        /**
         *  The children of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "pathFromRoot", {
        /**
         *  The path from the root of the router state tree to this route
         * @return {?}
         */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRoute.prototype.toString = function () {
        return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
    };
    return ActivatedRoute;
}());
function ActivatedRoute_tsickle_Closure_declarations() {
    /**
     * The current snapshot of this route
     * @type {?}
     */
    ActivatedRoute.prototype.snapshot;
    /** @type {?} */
    ActivatedRoute.prototype._futureSnapshot;
    /** @type {?} */
    ActivatedRoute.prototype._routerState;
    /**
     * An observable of the URL segments matched by this route
     * @type {?}
     */
    ActivatedRoute.prototype.url;
    /**
     * An observable of the matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRoute.prototype.params;
    /**
     * An observable of the query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.queryParams;
    /**
     * An observable of the URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.fragment;
    /**
     * An observable of the static and resolved data of this route.
     * @type {?}
     */
    ActivatedRoute.prototype.data;
    /**
     * The outlet name of the route. It's a constant
     * @type {?}
     */
    ActivatedRoute.prototype.outlet;
    /** @type {?} */
    ActivatedRoute.prototype.component;
}
/**
 * @param {?} route
 * @return {?}
 */
export function inheritedParamsDataResolve(route) {
    var /** @type {?} */ pathToRoot = route.pathFromRoot;
    var /** @type {?} */ inhertingStartingFrom = pathToRoot.length - 1;
    while (inhertingStartingFrom >= 1) {
        var /** @type {?} */ current = pathToRoot[inhertingStartingFrom];
        var /** @type {?} */ parent_1 = pathToRoot[inhertingStartingFrom - 1];
        // current route is an empty path => inherits its parent's params and data
        if (current.routeConfig && current.routeConfig.path === '') {
            inhertingStartingFrom--;
        }
        else if (!parent_1.component) {
            inhertingStartingFrom--;
        }
        else {
            break;
        }
    }
    return pathToRoot.slice(inhertingStartingFrom).reduce(function (res, curr) {
        var /** @type {?} */ params = merge(res.params, curr.params);
        var /** @type {?} */ data = merge(res.data, curr.data);
        var /** @type {?} */ resolve = merge(res.resolve, curr._resolvedData);
        return { params: params, data: data, resolve: resolve };
    }, /** @type {?} */ ({ params: {}, data: {}, resolve: {} }));
}
/**
 *  outlet
  * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
  * state tree.
  * *
  * *
  * ```
  * class MyComponent {
  * constructor(route: ActivatedRoute) {
  * const id: string = route.snapshot.params.id;
  * const url: string = route.snapshot.url.join('');
  * const user = route.snapshot.data.user;
  * }
  * }
  * ```
  * *
 */
export var ActivatedRouteSnapshot = (function () {
    /**
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} routeConfig
     * @param {?} urlSegment
     * @param {?} lastPathIndex
     * @param {?} resolve
     */
    function ActivatedRouteSnapshot(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._routeConfig = routeConfig;
        this._urlSegment = urlSegment;
        this._lastPathIndex = lastPathIndex;
        this._resolve = resolve;
    }
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "routeConfig", {
        /**
         *  The configuration used to match this route
         * @return {?}
         */
        get: function () { return this._routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "root", {
        /**
         *  The root of the router state
         * @return {?}
         */
        get: function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "parent", {
        /**
         *  The parent of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "firstChild", {
        /**
         *  The first child of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "children", {
        /**
         *  The children of this route in the router state tree
         * @return {?}
         */
        get: function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "pathFromRoot", {
        /**
         *  The path from the root of the router state tree to this route
         * @return {?}
         */
        get: function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRouteSnapshot.prototype.toString = function () {
        var /** @type {?} */ url = this.url.map(function (segment) { return segment.toString(); }).join('/');
        var /** @type {?} */ matched = this._routeConfig ? this._routeConfig.path : '';
        return "Route(url:'" + url + "', path:'" + matched + "')";
    };
    return ActivatedRouteSnapshot;
}());
function ActivatedRouteSnapshot_tsickle_Closure_declarations() {
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._routeConfig;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._urlSegment;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._lastPathIndex;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._resolve;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._resolvedData;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._routerState;
    /**
     * The URL segments matched by this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.url;
    /**
     * The matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.params;
    /**
     * The query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.queryParams;
    /**
     * The URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.fragment;
    /**
     * The static and resolved data of this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.data;
    /**
     * The outlet name of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.outlet;
    /**
     * The component of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.component;
}
/**
 *  *
  * *
  * ```
  * class MyComponent {
  * constructor(router: Router) {
  * const state: RouterState = router.routerState;
  * const snapshot: RouterStateSnapshot = state.snapshot;
  * const root: ActivatedRouteSnapshot = snapshot.root;
  * const child = root.firstChild;
  * const id: Observable<string> = child.params.map(p => p.id);
  * //...
  * }
  * }
  * ```
  * *
  * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
  * the "consumed" URL segments, the extracted parameters, and the resolved data.
  * *
 */
export var RouterStateSnapshot = (function (_super) {
    __extends(RouterStateSnapshot, _super);
    /**
     * @param {?} url
     * @param {?} root
     */
    function RouterStateSnapshot(url, root) {
        _super.call(this, root);
        this.url = url;
        setRouterStateSnapshot(this, root);
    }
    /**
     * @return {?}
     */
    RouterStateSnapshot.prototype.toString = function () { return serializeNode(this._root); };
    return RouterStateSnapshot;
}(Tree));
function RouterStateSnapshot_tsickle_Closure_declarations() {
    /**
     * The url from which this snapshot was created
     * @type {?}
     */
    RouterStateSnapshot.prototype.url;
}
/**
 * @param {?} state
 * @param {?} node
 * @return {?}
 */
function setRouterStateSnapshot(state, node) {
    node.value._routerState = state;
    node.children.forEach(function (c) { return setRouterStateSnapshot(state, c); });
}
/**
 * @param {?} node
 * @return {?}
 */
function serializeNode(node) {
    var /** @type {?} */ c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(", ") + " } " : '';
    return "" + node.value + c;
}
/**
 *  The expectation is that the activate route is created with the right set of parameters.
  * So we push new values into the observables only when they are not the initial values.
  * And we detect that by checking if the snapshot field is set.
 * @param {?} route
 * @return {?}
 */
export function advanceActivatedRoute(route) {
    if (route.snapshot) {
        if (!shallowEqual(route.snapshot.queryParams, route._futureSnapshot.queryParams)) {
            ((route.queryParams)).next(route._futureSnapshot.queryParams);
        }
        if (route.snapshot.fragment !== route._futureSnapshot.fragment) {
            ((route.fragment)).next(route._futureSnapshot.fragment);
        }
        if (!shallowEqual(route.snapshot.params, route._futureSnapshot.params)) {
            ((route.params)).next(route._futureSnapshot.params);
        }
        if (!shallowEqualArrays(route.snapshot.url, route._futureSnapshot.url)) {
            ((route.url)).next(route._futureSnapshot.url);
        }
        if (!equalParamsAndUrlSegments(route.snapshot, route._futureSnapshot)) {
            ((route.data)).next(route._futureSnapshot.data);
        }
        route.snapshot = route._futureSnapshot;
    }
    else {
        route.snapshot = route._futureSnapshot;
        // this is for resolved data
        ((route.data)).next(route._futureSnapshot.data);
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function equalParamsAndUrlSegments(a, b) {
    return shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
}
//# sourceMappingURL=router_state.js.map