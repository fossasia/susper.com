/**
 * @license Angular v3.4.0
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs/BehaviorSubject'), require('rxjs/Subject'), require('rxjs/observable/from'), require('rxjs/observable/of'), require('rxjs/operator/concatMap'), require('rxjs/operator/every'), require('rxjs/operator/first'), require('rxjs/operator/map'), require('rxjs/operator/mergeMap'), require('rxjs/operator/reduce'), require('rxjs/Observable'), require('rxjs/operator/catch'), require('rxjs/operator/concatAll'), require('rxjs/util/EmptyError'), require('rxjs/observable/fromPromise'), require('rxjs/operator/last'), require('rxjs/operator/mergeAll'), require('@angular/platform-browser'), require('rxjs/operator/filter')) :
  typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'rxjs/BehaviorSubject', 'rxjs/Subject', 'rxjs/observable/from', 'rxjs/observable/of', 'rxjs/operator/concatMap', 'rxjs/operator/every', 'rxjs/operator/first', 'rxjs/operator/map', 'rxjs/operator/mergeMap', 'rxjs/operator/reduce', 'rxjs/Observable', 'rxjs/operator/catch', 'rxjs/operator/concatAll', 'rxjs/util/EmptyError', 'rxjs/observable/fromPromise', 'rxjs/operator/last', 'rxjs/operator/mergeAll', '@angular/platform-browser', 'rxjs/operator/filter'], factory) :
  (factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}),global.ng.common,global.ng.core,global.Rx,global.Rx,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ng.platformBrowser,global.Rx.Observable.prototype));
}(this, function (exports,_angular_common,_angular_core,rxjs_BehaviorSubject,rxjs_Subject,rxjs_observable_from,rxjs_observable_of,rxjs_operator_concatMap,rxjs_operator_every,rxjs_operator_first,rxjs_operator_map,rxjs_operator_mergeMap,rxjs_operator_reduce,rxjs_Observable,rxjs_operator_catch,rxjs_operator_concatAll,rxjs_util_EmptyError,rxjs_observable_fromPromise,l,rxjs_operator_mergeAll,_angular_platformBrowser,rxjs_operator_filter) { 'use strict';

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
  /**
   * @whatItDoes Name of the primary outlet.
   *
   * @stable
   */
  var /** @type {?} */ PRIMARY_OUTLET = 'primary';
  var NavigationCancelingError = (function (_super) {
      __extends(NavigationCancelingError, _super);
      /**
       * @param {?} message
       */
      function NavigationCancelingError(message) {
          _super.call(this, message);
          this.message = message;
          this.stack = (new Error(message)).stack;
      }
      /**
       * @return {?}
       */
      NavigationCancelingError.prototype.toString = function () { return this.message; };
      return NavigationCancelingError;
  }(Error));
  /**
   * @param {?} segments
   * @param {?} segmentGroup
   * @param {?} route
   * @return {?}
   */
  function defaultUrlMatcher(segments, segmentGroup, route) {
      var /** @type {?} */ path = route.path;
      var /** @type {?} */ parts = path.split('/');
      var /** @type {?} */ posParams = {};
      var /** @type {?} */ consumed = [];
      var /** @type {?} */ currentIndex = 0;
      for (var /** @type {?} */ i = 0; i < parts.length; ++i) {
          if (currentIndex >= segments.length)
              return null;
          var /** @type {?} */ current = segments[currentIndex];
          var /** @type {?} */ p = parts[i];
          var /** @type {?} */ isPosParam = p.startsWith(':');
          if (!isPosParam && p !== current.path)
              return null;
          if (isPosParam) {
              posParams[p.substring(1)] = current;
          }
          consumed.push(current);
          currentIndex++;
      }
      if (route.pathMatch === 'full' &&
          (segmentGroup.hasChildren() || currentIndex < segments.length)) {
          return null;
      }
      else {
          return { consumed: consumed, posParams: posParams };
      }
  }

  /**
   * @param {?} a
   * @param {?} b
   * @return {?}
   */
  function shallowEqualArrays(a, b) {
      if (a.length !== b.length)
          return false;
      for (var /** @type {?} */ i = 0; i < a.length; ++i) {
          if (!shallowEqual(a[i], b[i]))
              return false;
      }
      return true;
  }
  /**
   * @param {?} a
   * @param {?} b
   * @return {?}
   */
  function shallowEqual(a, b) {
      var /** @type {?} */ k1 = Object.keys(a);
      var /** @type {?} */ k2 = Object.keys(b);
      if (k1.length != k2.length) {
          return false;
      }
      var /** @type {?} */ key;
      for (var /** @type {?} */ i = 0; i < k1.length; i++) {
          key = k1[i];
          if (a[key] !== b[key]) {
              return false;
          }
      }
      return true;
  }
  /**
   * @param {?} a
   * @return {?}
   */
  function flatten(a) {
      var /** @type {?} */ target = [];
      for (var /** @type {?} */ i = 0; i < a.length; ++i) {
          for (var /** @type {?} */ j = 0; j < a[i].length; ++j) {
              target.push(a[i][j]);
          }
      }
      return target;
  }
  /**
   * @param {?} a
   * @return {?}
   */
  function last(a) {
      return a.length > 0 ? a[a.length - 1] : null;
  }
  /**
   * @param {?} m1
   * @param {?} m2
   * @return {?}
   */
  function merge(m1, m2) {
      var /** @type {?} */ m = {};
      for (var attr in m1) {
          if (m1.hasOwnProperty(attr)) {
              m[attr] = m1[attr];
          }
      }
      for (var attr in m2) {
          if (m2.hasOwnProperty(attr)) {
              m[attr] = m2[attr];
          }
      }
      return m;
  }
  /**
   * @param {?} map
   * @param {?} callback
   * @return {?}
   */
  function forEach(map, callback) {
      for (var prop in map) {
          if (map.hasOwnProperty(prop)) {
              callback(map[prop], prop);
          }
      }
  }
  /**
   * @param {?} obj
   * @param {?} fn
   * @return {?}
   */
  function waitForMap(obj, fn) {
      var /** @type {?} */ waitFor = [];
      var /** @type {?} */ res = {};
      forEach(obj, function (a, k) {
          if (k === PRIMARY_OUTLET) {
              waitFor.push(rxjs_operator_map.map.call(fn(k, a), function (_) {
                  res[k] = _;
                  return _;
              }));
          }
      });
      forEach(obj, function (a, k) {
          if (k !== PRIMARY_OUTLET) {
              waitFor.push(rxjs_operator_map.map.call(fn(k, a), function (_) {
                  res[k] = _;
                  return _;
              }));
          }
      });
      if (waitFor.length > 0) {
          var /** @type {?} */ concatted$ = rxjs_operator_concatAll.concatAll.call(rxjs_observable_of.of.apply(void 0, waitFor));
          var /** @type {?} */ last$ = l.last.call(concatted$);
          return rxjs_operator_map.map.call(last$, function () { return res; });
      }
      return rxjs_observable_of.of(res);
  }
  /**
   * @param {?} observables
   * @return {?}
   */
  function andObservables(observables) {
      var /** @type {?} */ merged$ = rxjs_operator_mergeAll.mergeAll.call(observables);
      return rxjs_operator_every.every.call(merged$, function (result) { return result === true; });
  }
  /**
   * @param {?} value
   * @return {?}
   */
  function wrapIntoObservable(value) {
      if (value instanceof rxjs_Observable.Observable) {
          return value;
      }
      if (value instanceof Promise) {
          return rxjs_observable_fromPromise.fromPromise(value);
      }
      return rxjs_observable_of.of(value);
  }

  /**
   * @experimental
   */
  var /** @type {?} */ ROUTES = new _angular_core.OpaqueToken('ROUTES');
  var LoadedRouterConfig = (function () {
      /**
       * @param {?} routes
       * @param {?} injector
       * @param {?} factoryResolver
       * @param {?} injectorFactory
       */
      function LoadedRouterConfig(routes, injector, factoryResolver, injectorFactory) {
          this.routes = routes;
          this.injector = injector;
          this.factoryResolver = factoryResolver;
          this.injectorFactory = injectorFactory;
      }
      return LoadedRouterConfig;
  }());
  var RouterConfigLoader = (function () {
      /**
       * @param {?} loader
       * @param {?} compiler
       */
      function RouterConfigLoader(loader, compiler) {
          this.loader = loader;
          this.compiler = compiler;
      }
      /**
       * @param {?} parentInjector
       * @param {?} loadChildren
       * @return {?}
       */
      RouterConfigLoader.prototype.load = function (parentInjector, loadChildren) {
          return rxjs_operator_map.map.call(this.loadModuleFactory(loadChildren), function (r) {
              var /** @type {?} */ ref = r.create(parentInjector);
              var /** @type {?} */ injectorFactory = function (parent) { return r.create(parent).injector; };
              return new LoadedRouterConfig(flatten(ref.injector.get(ROUTES)), ref.injector, ref.componentFactoryResolver, injectorFactory);
          });
      };
      /**
       * @param {?} loadChildren
       * @return {?}
       */
      RouterConfigLoader.prototype.loadModuleFactory = function (loadChildren) {
          var _this = this;
          if (typeof loadChildren === 'string') {
              return rxjs_observable_fromPromise.fromPromise(this.loader.load(loadChildren));
          }
          else {
              var /** @type {?} */ offlineMode_1 = this.compiler instanceof _angular_core.Compiler;
              return rxjs_operator_mergeMap.mergeMap.call(wrapIntoObservable(loadChildren()), function (t) { return offlineMode_1 ? rxjs_observable_of.of(/** @type {?} */ (t)) : rxjs_observable_fromPromise.fromPromise(_this.compiler.compileModuleAsync(t)); });
          }
      };
      return RouterConfigLoader;
  }());

  /**
   * @return {?}
   */
  function createEmptyUrlTree() {
      return new UrlTree(new UrlSegmentGroup([], {}), {}, null);
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @param {?} exact
   * @return {?}
   */
  function containsTree(container, containee, exact) {
      if (exact) {
          return equalQueryParams(container.queryParams, containee.queryParams) &&
              equalSegmentGroups(container.root, containee.root);
      }
      return containsQueryParams(container.queryParams, containee.queryParams) &&
          containsSegmentGroup(container.root, containee.root);
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @return {?}
   */
  function equalQueryParams(container, containee) {
      return shallowEqual(container, containee);
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @return {?}
   */
  function equalSegmentGroups(container, containee) {
      if (!equalPath(container.segments, containee.segments))
          return false;
      if (container.numberOfChildren !== containee.numberOfChildren)
          return false;
      for (var c in containee.children) {
          if (!container.children[c])
              return false;
          if (!equalSegmentGroups(container.children[c], containee.children[c]))
              return false;
      }
      return true;
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @return {?}
   */
  function containsQueryParams(container, containee) {
      return Object.keys(containee) <= Object.keys(container) &&
          Object.keys(containee).every(function (key) { return containee[key] === container[key]; });
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @return {?}
   */
  function containsSegmentGroup(container, containee) {
      return containsSegmentGroupHelper(container, containee, containee.segments);
  }
  /**
   * @param {?} container
   * @param {?} containee
   * @param {?} containeePaths
   * @return {?}
   */
  function containsSegmentGroupHelper(container, containee, containeePaths) {
      if (container.segments.length > containeePaths.length) {
          var /** @type {?} */ current = container.segments.slice(0, containeePaths.length);
          if (!equalPath(current, containeePaths))
              return false;
          if (containee.hasChildren())
              return false;
          return true;
      }
      else if (container.segments.length === containeePaths.length) {
          if (!equalPath(container.segments, containeePaths))
              return false;
          for (var c in containee.children) {
              if (!container.children[c])
                  return false;
              if (!containsSegmentGroup(container.children[c], containee.children[c]))
                  return false;
          }
          return true;
      }
      else {
          var /** @type {?} */ current = containeePaths.slice(0, container.segments.length);
          var /** @type {?} */ next = containeePaths.slice(container.segments.length);
          if (!equalPath(container.segments, current))
              return false;
          if (!container.children[PRIMARY_OUTLET])
              return false;
          return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next);
      }
  }
  /**
   *  *
    * *
    * ```
    * class MyComponent {
    * constructor(router: Router) {
    * const tree: UrlTree =
    * router.parseUrl('/team/33/(user/victor//support:help)?debug=true#fragment');
    * const f = tree.fragment; // return 'fragment'
    * const q = tree.queryParams; // returns {debug: 'true'}
    * const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    * const s: UrlSegment[] = g.segments; // returns 2 segments 'team' and '33'
    * g.children[PRIMARY_OUTLET].segments; // returns 2 segments 'user' and 'victor'
    * g.children['support'].segments; // return 1 segment 'help'
    * }
    * }
    * ```
    * *
    * *
    * Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
    * serialized tree.
    * UrlTree is a data structure that provides a lot of affordances in dealing with URLs
    * *
   */
  var UrlTree = (function () {
      /**
       * @param {?} root
       * @param {?} queryParams
       * @param {?} fragment
       */
      function UrlTree(root, queryParams, fragment) {
          this.root = root;
          this.queryParams = queryParams;
          this.fragment = fragment;
      }
      /**
       * @return {?}
       */
      UrlTree.prototype.toString = function () { return new DefaultUrlSerializer().serialize(this); };
      return UrlTree;
  }());
  /**
   *  *
    * See {@link UrlTree} for more information.
    * *
   */
  var UrlSegmentGroup = (function () {
      /**
       * @param {?} segments
       * @param {?} children
       */
      function UrlSegmentGroup(segments, children) {
          var _this = this;
          this.segments = segments;
          this.children = children;
          /** The parent node in the url tree */
          this.parent = null;
          forEach(children, function (v, k) { return v.parent = _this; });
      }
      /**
       *  Wether the segment has child segments
       * @return {?}
       */
      UrlSegmentGroup.prototype.hasChildren = function () { return this.numberOfChildren > 0; };
      Object.defineProperty(UrlSegmentGroup.prototype, "numberOfChildren", {
          /**
           *  Number of child segments
           * @return {?}
           */
          get: function () { return Object.keys(this.children).length; },
          enumerable: true,
          configurable: true
      });
      /**
       * @return {?}
       */
      UrlSegmentGroup.prototype.toString = function () { return serializePaths(this); };
      return UrlSegmentGroup;
  }());
  /**
   *  *
    * *
    * ```
    * class MyComponent {
    * constructor(router: Router) {
    * const tree: UrlTree = router.parseUrl('/team;id=33');
    * const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    * const s: UrlSegment[] = g.segments;
    * s[0].path; // returns 'team'
    * s[0].parameters; // returns {id: 33}
    * }
    * }
    * ```
    * *
    * *
    * A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
    * parameters associated with the segment.
    * *
   */
  var UrlSegment = (function () {
      /**
       * @param {?} path
       * @param {?} parameters
       */
      function UrlSegment(path, parameters) {
          this.path = path;
          this.parameters = parameters;
      }
      /**
       * @return {?}
       */
      UrlSegment.prototype.toString = function () { return serializePath(this); };
      return UrlSegment;
  }());
  /**
   * @param {?} a
   * @param {?} b
   * @return {?}
   */
  function equalSegments(a, b) {
      if (a.length !== b.length)
          return false;
      for (var /** @type {?} */ i = 0; i < a.length; ++i) {
          if (a[i].path !== b[i].path)
              return false;
          if (!shallowEqual(a[i].parameters, b[i].parameters))
              return false;
      }
      return true;
  }
  /**
   * @param {?} a
   * @param {?} b
   * @return {?}
   */
  function equalPath(a, b) {
      if (a.length !== b.length)
          return false;
      for (var /** @type {?} */ i = 0; i < a.length; ++i) {
          if (a[i].path !== b[i].path)
              return false;
      }
      return true;
  }
  /**
   * @param {?} segment
   * @param {?} fn
   * @return {?}
   */
  function mapChildrenIntoArray(segment, fn) {
      var /** @type {?} */ res = [];
      forEach(segment.children, function (child, childOutlet) {
          if (childOutlet === PRIMARY_OUTLET) {
              res = res.concat(fn(child, childOutlet));
          }
      });
      forEach(segment.children, function (child, childOutlet) {
          if (childOutlet !== PRIMARY_OUTLET) {
              res = res.concat(fn(child, childOutlet));
          }
      });
      return res;
  }
  /**
   *  *
    * make all URLs case insensitive by providing a custom UrlSerializer.
    * *
    * See {@link DefaultUrlSerializer} for an example of a URL serializer.
    * *
   * @abstract
   */
  var UrlSerializer = (function () {
      function UrlSerializer() {
      }
      /**
       *  Parse a url into a {@link UrlTree}
       * @abstract
       * @param {?} url
       * @return {?}
       */
      UrlSerializer.prototype.parse = function (url) { };
      /**
       *  Converts a {@link UrlTree} into a url
       * @abstract
       * @param {?} tree
       * @return {?}
       */
      UrlSerializer.prototype.serialize = function (tree) { };
      return UrlSerializer;
  }());
  /**
   *  *
    * *
    * Example URLs:
    * *
    * ```
    * /inbox/33(popup:compose)
    * /inbox/33;open=true/messages/44
    * ```
    * *
    * DefaultUrlSerializer uses parentheses to serialize secondary segments (e.g., popup:compose), the
    * colon syntax to specify the outlet, and the ';parameter=value' syntax (e.g., open=true) to
    * specify route specific parameters.
    * *
   */
  var DefaultUrlSerializer = (function () {
      function DefaultUrlSerializer() {
      }
      /**
       *  Parses a url into a {@link UrlTree}
       * @param {?} url
       * @return {?}
       */
      DefaultUrlSerializer.prototype.parse = function (url) {
          var /** @type {?} */ p = new UrlParser(url);
          return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
      };
      /**
       *  Converts a {@link UrlTree} into a url
       * @param {?} tree
       * @return {?}
       */
      DefaultUrlSerializer.prototype.serialize = function (tree) {
          var /** @type {?} */ segment = "/" + serializeSegment(tree.root, true);
          var /** @type {?} */ query = serializeQueryParams(tree.queryParams);
          var /** @type {?} */ fragment = tree.fragment !== null && tree.fragment !== undefined ? "#" + encodeURI(tree.fragment) : '';
          return "" + segment + query + fragment;
      };
      return DefaultUrlSerializer;
  }());
  /**
   * @param {?} segment
   * @return {?}
   */
  function serializePaths(segment) {
      return segment.segments.map(function (p) { return serializePath(p); }).join('/');
  }
  /**
   * @param {?} segment
   * @param {?} root
   * @return {?}
   */
  function serializeSegment(segment, root) {
      if (segment.hasChildren() && root) {
          var /** @type {?} */ primary = segment.children[PRIMARY_OUTLET] ?
              serializeSegment(segment.children[PRIMARY_OUTLET], false) :
              '';
          var /** @type {?} */ children_1 = [];
          forEach(segment.children, function (v, k) {
              if (k !== PRIMARY_OUTLET) {
                  children_1.push(k + ":" + serializeSegment(v, false));
              }
          });
          if (children_1.length > 0) {
              return primary + "(" + children_1.join('//') + ")";
          }
          else {
              return "" + primary;
          }
      }
      else if (segment.hasChildren() && !root) {
          var /** @type {?} */ children = mapChildrenIntoArray(segment, function (v, k) {
              if (k === PRIMARY_OUTLET) {
                  return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
              }
              else {
                  return [(k + ":" + serializeSegment(v, false))];
              }
          });
          return serializePaths(segment) + "/(" + children.join('//') + ")";
      }
      else {
          return serializePaths(segment);
      }
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function encode(s) {
      return encodeURIComponent(s);
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function decode(s) {
      return decodeURIComponent(s);
  }
  /**
   * @param {?} path
   * @return {?}
   */
  function serializePath(path) {
      return "" + encode(path.path) + serializeParams(path.parameters);
  }
  /**
   * @param {?} params
   * @return {?}
   */
  function serializeParams(params) {
      return pairs(params).map(function (p) { return (";" + encode(p.first) + "=" + encode(p.second)); }).join('');
  }
  /**
   * @param {?} params
   * @return {?}
   */
  function serializeQueryParams(params) {
      var /** @type {?} */ strParams = Object.keys(params).map(function (name) {
          var /** @type {?} */ value = params[name];
          return Array.isArray(value) ? value.map(function (v) { return (encode(name) + "=" + encode(v)); }).join('&') :
              encode(name) + "=" + encode(value);
      });
      return strParams.length ? "?" + strParams.join("&") : '';
  }
  var Pair = (function () {
      /**
       * @param {?} first
       * @param {?} second
       */
      function Pair(first, second) {
          this.first = first;
          this.second = second;
      }
      return Pair;
  }());
  /**
   * @param {?} obj
   * @return {?}
   */
  function pairs(obj) {
      var /** @type {?} */ res = [];
      for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              res.push(new Pair(prop, obj[prop]));
          }
      }
      return res;
  }
  var /** @type {?} */ SEGMENT_RE = /^[^\/()?;=&#]+/;
  /**
   * @param {?} str
   * @return {?}
   */
  function matchSegments(str) {
      SEGMENT_RE.lastIndex = 0;
      var /** @type {?} */ match = str.match(SEGMENT_RE);
      return match ? match[0] : '';
  }
  var /** @type {?} */ QUERY_PARAM_RE = /^[^=?&#]+/;
  /**
   * @param {?} str
   * @return {?}
   */
  function matchQueryParams(str) {
      QUERY_PARAM_RE.lastIndex = 0;
      var /** @type {?} */ match = str.match(SEGMENT_RE);
      return match ? match[0] : '';
  }
  var /** @type {?} */ QUERY_PARAM_VALUE_RE = /^[^?&#]+/;
  /**
   * @param {?} str
   * @return {?}
   */
  function matchUrlQueryParamValue(str) {
      QUERY_PARAM_VALUE_RE.lastIndex = 0;
      var /** @type {?} */ match = str.match(QUERY_PARAM_VALUE_RE);
      return match ? match[0] : '';
  }
  var UrlParser = (function () {
      /**
       * @param {?} url
       */
      function UrlParser(url) {
          this.url = url;
          this.remaining = url;
      }
      /**
       * @param {?} str
       * @return {?}
       */
      UrlParser.prototype.peekStartsWith = function (str) { return this.remaining.startsWith(str); };
      /**
       * @param {?} str
       * @return {?}
       */
      UrlParser.prototype.capture = function (str) {
          if (!this.remaining.startsWith(str)) {
              throw new Error("Expected \"" + str + "\".");
          }
          this.remaining = this.remaining.substring(str.length);
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseRootSegment = function () {
          if (this.remaining.startsWith('/')) {
              this.capture('/');
          }
          if (this.remaining === '' || this.remaining.startsWith('?') || this.remaining.startsWith('#')) {
              return new UrlSegmentGroup([], {});
          }
          return new UrlSegmentGroup([], this.parseChildren());
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseChildren = function () {
          if (this.remaining.length == 0) {
              return {};
          }
          if (this.peekStartsWith('/')) {
              this.capture('/');
          }
          var /** @type {?} */ paths = [];
          if (!this.peekStartsWith('(')) {
              paths.push(this.parseSegments());
          }
          while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
              this.capture('/');
              paths.push(this.parseSegments());
          }
          var /** @type {?} */ children = {};
          if (this.peekStartsWith('/(')) {
              this.capture('/');
              children = this.parseParens(true);
          }
          var /** @type {?} */ res = {};
          if (this.peekStartsWith('(')) {
              res = this.parseParens(false);
          }
          if (paths.length > 0 || Object.keys(children).length > 0) {
              res[PRIMARY_OUTLET] = new UrlSegmentGroup(paths, children);
          }
          return res;
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseSegments = function () {
          var /** @type {?} */ path = matchSegments(this.remaining);
          if (path === '' && this.peekStartsWith(';')) {
              throw new Error("Empty path url segment cannot have parameters: '" + this.remaining + "'.");
          }
          this.capture(path);
          var /** @type {?} */ matrixParams = {};
          if (this.peekStartsWith(';')) {
              matrixParams = this.parseMatrixParams();
          }
          return new UrlSegment(decode(path), matrixParams);
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseQueryParams = function () {
          var /** @type {?} */ params = {};
          if (this.peekStartsWith('?')) {
              this.capture('?');
              this.parseQueryParam(params);
              while (this.remaining.length > 0 && this.peekStartsWith('&')) {
                  this.capture('&');
                  this.parseQueryParam(params);
              }
          }
          return params;
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseFragment = function () {
          if (this.peekStartsWith('#')) {
              return decodeURI(this.remaining.substring(1));
          }
          return null;
      };
      /**
       * @return {?}
       */
      UrlParser.prototype.parseMatrixParams = function () {
          var /** @type {?} */ params = {};
          while (this.remaining.length > 0 && this.peekStartsWith(';')) {
              this.capture(';');
              this.parseParam(params);
          }
          return params;
      };
      /**
       * @param {?} params
       * @return {?}
       */
      UrlParser.prototype.parseParam = function (params) {
          var /** @type {?} */ key = matchSegments(this.remaining);
          if (!key) {
              return;
          }
          this.capture(key);
          var /** @type {?} */ value = '';
          if (this.peekStartsWith('=')) {
              this.capture('=');
              var /** @type {?} */ valueMatch = matchSegments(this.remaining);
              if (valueMatch) {
                  value = valueMatch;
                  this.capture(value);
              }
          }
          params[decode(key)] = decode(value);
      };
      /**
       * @param {?} params
       * @return {?}
       */
      UrlParser.prototype.parseQueryParam = function (params) {
          var /** @type {?} */ key = matchQueryParams(this.remaining);
          if (!key) {
              return;
          }
          this.capture(key);
          var /** @type {?} */ value = '';
          if (this.peekStartsWith('=')) {
              this.capture('=');
              var /** @type {?} */ valueMatch = matchUrlQueryParamValue(this.remaining);
              if (valueMatch) {
                  value = valueMatch;
                  this.capture(value);
              }
          }
          var /** @type {?} */ decodedKey = decode(key);
          var /** @type {?} */ decodedVal = decode(value);
          if (params.hasOwnProperty(decodedKey)) {
              // Append to existing values
              var /** @type {?} */ currentVal = params[decodedKey];
              if (!Array.isArray(currentVal)) {
                  currentVal = [currentVal];
                  params[decodedKey] = currentVal;
              }
              currentVal.push(decodedVal);
          }
          else {
              // Create a new value
              params[decodedKey] = decodedVal;
          }
      };
      /**
       * @param {?} allowPrimary
       * @return {?}
       */
      UrlParser.prototype.parseParens = function (allowPrimary) {
          var /** @type {?} */ segments = {};
          this.capture('(');
          while (!this.peekStartsWith(')') && this.remaining.length > 0) {
              var /** @type {?} */ path = matchSegments(this.remaining);
              var /** @type {?} */ next = this.remaining[path.length];
              // if is is not one of these characters, then the segment was unescaped
              // or the group was not closed
              if (next !== '/' && next !== ')' && next !== ';') {
                  throw new Error("Cannot parse url '" + this.url + "'");
              }
              var /** @type {?} */ outletName = void 0;
              if (path.indexOf(':') > -1) {
                  outletName = path.substr(0, path.indexOf(':'));
                  this.capture(outletName);
                  this.capture(':');
              }
              else if (allowPrimary) {
                  outletName = PRIMARY_OUTLET;
              }
              var /** @type {?} */ children = this.parseChildren();
              segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                  new UrlSegmentGroup([], children);
              if (this.peekStartsWith('//')) {
                  this.capture('//');
              }
          }
          this.capture(')');
          return segments;
      };
      return UrlParser;
  }());

  var NoMatch = (function () {
      /**
       * @param {?=} segmentGroup
       */
      function NoMatch(segmentGroup) {
          if (segmentGroup === void 0) { segmentGroup = null; }
          this.segmentGroup = segmentGroup;
      }
      return NoMatch;
  }());
  var AbsoluteRedirect = (function () {
      /**
       * @param {?} urlTree
       */
      function AbsoluteRedirect(urlTree) {
          this.urlTree = urlTree;
      }
      return AbsoluteRedirect;
  }());
  /**
   * @param {?} segmentGroup
   * @return {?}
   */
  function noMatch(segmentGroup) {
      return new rxjs_Observable.Observable(function (obs) { return obs.error(new NoMatch(segmentGroup)); });
  }
  /**
   * @param {?} newTree
   * @return {?}
   */
  function absoluteRedirect(newTree) {
      return new rxjs_Observable.Observable(function (obs) { return obs.error(new AbsoluteRedirect(newTree)); });
  }
  /**
   * @param {?} redirectTo
   * @return {?}
   */
  function namedOutletsRedirect(redirectTo) {
      return new rxjs_Observable.Observable(function (obs) { return obs.error(new Error("Only absolute redirects can have named outlets. redirectTo: '" + redirectTo + "'")); });
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function canLoadFails(route) {
      return new rxjs_Observable.Observable(function (obs) { return obs.error(new NavigationCancelingError("Cannot load children because the guard of the route \"path: '" + route.path + "'\" returned false")); });
  }
  /**
   * @param {?} injector
   * @param {?} configLoader
   * @param {?} urlSerializer
   * @param {?} urlTree
   * @param {?} config
   * @return {?}
   */
  function applyRedirects(injector, configLoader, urlSerializer, urlTree, config) {
      return new ApplyRedirects(injector, configLoader, urlSerializer, urlTree, config).apply();
  }
  var ApplyRedirects = (function () {
      /**
       * @param {?} injector
       * @param {?} configLoader
       * @param {?} urlSerializer
       * @param {?} urlTree
       * @param {?} config
       */
      function ApplyRedirects(injector, configLoader, urlSerializer, urlTree, config) {
          this.injector = injector;
          this.configLoader = configLoader;
          this.urlSerializer = urlSerializer;
          this.urlTree = urlTree;
          this.config = config;
          this.allowRedirects = true;
      }
      /**
       * @return {?}
       */
      ApplyRedirects.prototype.apply = function () {
          var _this = this;
          var /** @type {?} */ expanded$ = this.expandSegmentGroup(this.injector, this.config, this.urlTree.root, PRIMARY_OUTLET);
          var /** @type {?} */ urlTrees$ = rxjs_operator_map.map.call(expanded$, function (rootSegmentGroup) { return _this.createUrlTree(rootSegmentGroup, _this.urlTree.queryParams, _this.urlTree.fragment); });
          return rxjs_operator_catch._catch.call(urlTrees$, function (e) {
              if (e instanceof AbsoluteRedirect) {
                  // after an absolute redirect we do not apply any more redirects!
                  _this.allowRedirects = false;
                  // we need to run matching, so we can fetch all lazy-loaded modules
                  return _this.match(e.urlTree);
              }
              else if (e instanceof NoMatch) {
                  throw _this.noMatchError(e);
              }
              else {
                  throw e;
              }
          });
      };
      /**
       * @param {?} tree
       * @return {?}
       */
      ApplyRedirects.prototype.match = function (tree) {
          var _this = this;
          var /** @type {?} */ expanded$ = this.expandSegmentGroup(this.injector, this.config, tree.root, PRIMARY_OUTLET);
          var /** @type {?} */ mapped$ = rxjs_operator_map.map.call(expanded$, function (rootSegmentGroup) {
              return _this.createUrlTree(rootSegmentGroup, tree.queryParams, tree.fragment);
          });
          return rxjs_operator_catch._catch.call(mapped$, function (e) {
              if (e instanceof NoMatch) {
                  throw _this.noMatchError(e);
              }
              else {
                  throw e;
              }
          });
      };
      /**
       * @param {?} e
       * @return {?}
       */
      ApplyRedirects.prototype.noMatchError = function (e) {
          return new Error("Cannot match any routes. URL Segment: '" + e.segmentGroup + "'");
      };
      /**
       * @param {?} rootCandidate
       * @param {?} queryParams
       * @param {?} fragment
       * @return {?}
       */
      ApplyRedirects.prototype.createUrlTree = function (rootCandidate, queryParams, fragment) {
          var /** @type {?} */ root = rootCandidate.segments.length > 0 ?
              new UrlSegmentGroup([], (_a = {}, _a[PRIMARY_OUTLET] = rootCandidate, _a)) :
              rootCandidate;
          return new UrlTree(root, queryParams, fragment);
          var _a;
      };
      /**
       * @param {?} injector
       * @param {?} routes
       * @param {?} segmentGroup
       * @param {?} outlet
       * @return {?}
       */
      ApplyRedirects.prototype.expandSegmentGroup = function (injector, routes, segmentGroup, outlet) {
          if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
              return rxjs_operator_map.map.call(this.expandChildren(injector, routes, segmentGroup), function (children) { return new UrlSegmentGroup([], children); });
          }
          else {
              return this.expandSegment(injector, segmentGroup, routes, segmentGroup.segments, outlet, true);
          }
      };
      /**
       * @param {?} injector
       * @param {?} routes
       * @param {?} segmentGroup
       * @return {?}
       */
      ApplyRedirects.prototype.expandChildren = function (injector, routes, segmentGroup) {
          var _this = this;
          return waitForMap(segmentGroup.children, function (childOutlet, child) { return _this.expandSegmentGroup(injector, routes, child, childOutlet); });
      };
      /**
       * @param {?} injector
       * @param {?} segmentGroup
       * @param {?} routes
       * @param {?} segments
       * @param {?} outlet
       * @param {?} allowRedirects
       * @return {?}
       */
      ApplyRedirects.prototype.expandSegment = function (injector, segmentGroup, routes, segments, outlet, allowRedirects) {
          var _this = this;
          var /** @type {?} */ routes$ = rxjs_observable_of.of.apply(void 0, routes);
          var /** @type {?} */ processedRoutes$ = rxjs_operator_map.map.call(routes$, function (r) {
              var /** @type {?} */ expanded$ = _this.expandSegmentAgainstRoute(injector, segmentGroup, routes, r, segments, outlet, allowRedirects);
              return rxjs_operator_catch._catch.call(expanded$, function (e) {
                  if (e instanceof NoMatch)
                      return rxjs_observable_of.of(null);
                  else
                      throw e;
              });
          });
          var /** @type {?} */ concattedProcessedRoutes$ = rxjs_operator_concatAll.concatAll.call(processedRoutes$);
          var /** @type {?} */ first$ = rxjs_operator_first.first.call(concattedProcessedRoutes$, function (s) { return !!s; });
          return rxjs_operator_catch._catch.call(first$, function (e, _) {
              if (e instanceof rxjs_util_EmptyError.EmptyError) {
                  if (_this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
                      return rxjs_observable_of.of(new UrlSegmentGroup([], {}));
                  }
                  else {
                      throw new NoMatch(segmentGroup);
                  }
              }
              else {
                  throw e;
              }
          });
      };
      /**
       * @param {?} segmentGroup
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      ApplyRedirects.prototype.noLeftoversInUrl = function (segmentGroup, segments, outlet) {
          return segments.length === 0 && !segmentGroup.children[outlet];
      };
      /**
       * @param {?} injector
       * @param {?} segmentGroup
       * @param {?} routes
       * @param {?} route
       * @param {?} paths
       * @param {?} outlet
       * @param {?} allowRedirects
       * @return {?}
       */
      ApplyRedirects.prototype.expandSegmentAgainstRoute = function (injector, segmentGroup, routes, route, paths, outlet, allowRedirects) {
          if (getOutlet$1(route) !== outlet)
              return noMatch(segmentGroup);
          if (route.redirectTo !== undefined && !(allowRedirects && this.allowRedirects))
              return noMatch(segmentGroup);
          if (route.redirectTo === undefined) {
              return this.matchSegmentAgainstRoute(injector, segmentGroup, route, paths);
          }
          else {
              return this.expandSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes, route, paths, outlet);
          }
      };
      /**
       * @param {?} injector
       * @param {?} segmentGroup
       * @param {?} routes
       * @param {?} route
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      ApplyRedirects.prototype.expandSegmentAgainstRouteUsingRedirect = function (injector, segmentGroup, routes, route, segments, outlet) {
          if (route.path === '**') {
              return this.expandWildCardWithParamsAgainstRouteUsingRedirect(injector, routes, route, outlet);
          }
          else {
              return this.expandRegularSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes, route, segments, outlet);
          }
      };
      /**
       * @param {?} injector
       * @param {?} routes
       * @param {?} route
       * @param {?} outlet
       * @return {?}
       */
      ApplyRedirects.prototype.expandWildCardWithParamsAgainstRouteUsingRedirect = function (injector, routes, route, outlet) {
          var _this = this;
          var /** @type {?} */ newTree = this.applyRedirectCommands([], route.redirectTo, {});
          if (route.redirectTo.startsWith('/')) {
              return absoluteRedirect(newTree);
          }
          else {
              return rxjs_operator_mergeMap.mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
                  var /** @type {?} */ group = new UrlSegmentGroup(newSegments, {});
                  return _this.expandSegment(injector, group, routes, newSegments, outlet, false);
              });
          }
      };
      /**
       * @param {?} injector
       * @param {?} segmentGroup
       * @param {?} routes
       * @param {?} route
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      ApplyRedirects.prototype.expandRegularSegmentAgainstRouteUsingRedirect = function (injector, segmentGroup, routes, route, segments, outlet) {
          var _this = this;
          var _a = match(segmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
          if (!matched)
              return noMatch(segmentGroup);
          var /** @type {?} */ newTree = this.applyRedirectCommands(consumedSegments, route.redirectTo, /** @type {?} */ (positionalParamSegments));
          if (route.redirectTo.startsWith('/')) {
              return absoluteRedirect(newTree);
          }
          else {
              return rxjs_operator_mergeMap.mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
                  return _this.expandSegment(injector, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
              });
          }
      };
      /**
       * @param {?} injector
       * @param {?} rawSegmentGroup
       * @param {?} route
       * @param {?} segments
       * @return {?}
       */
      ApplyRedirects.prototype.matchSegmentAgainstRoute = function (injector, rawSegmentGroup, route, segments) {
          var _this = this;
          if (route.path === '**') {
              if (route.loadChildren) {
                  return rxjs_operator_map.map.call(this.configLoader.load(injector, route.loadChildren), function (r) {
                      ((route))._loadedConfig = r;
                      return rxjs_observable_of.of(new UrlSegmentGroup(segments, {}));
                  });
              }
              else {
                  return rxjs_observable_of.of(new UrlSegmentGroup(segments, {}));
              }
          }
          else {
              var _a = match(rawSegmentGroup, route, segments), matched = _a.matched, consumedSegments_1 = _a.consumedSegments, lastChild = _a.lastChild;
              if (!matched)
                  return noMatch(rawSegmentGroup);
              var /** @type {?} */ rawSlicedSegments_1 = segments.slice(lastChild);
              var /** @type {?} */ childConfig$ = this.getChildConfig(injector, route);
              return rxjs_operator_mergeMap.mergeMap.call(childConfig$, function (routerConfig) {
                  var /** @type {?} */ childInjector = routerConfig.injector;
                  var /** @type {?} */ childConfig = routerConfig.routes;
                  var _a = split(rawSegmentGroup, consumedSegments_1, rawSlicedSegments_1, childConfig), segmentGroup = _a.segmentGroup, slicedSegments = _a.slicedSegments;
                  if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
                      var /** @type {?} */ expanded$ = _this.expandChildren(childInjector, childConfig, segmentGroup);
                      return rxjs_operator_map.map.call(expanded$, function (children) { return new UrlSegmentGroup(consumedSegments_1, children); });
                  }
                  else if (childConfig.length === 0 && slicedSegments.length === 0) {
                      return rxjs_observable_of.of(new UrlSegmentGroup(consumedSegments_1, {}));
                  }
                  else {
                      var /** @type {?} */ expanded$ = _this.expandSegment(childInjector, segmentGroup, childConfig, slicedSegments, PRIMARY_OUTLET, true);
                      return rxjs_operator_map.map.call(expanded$, function (cs) { return new UrlSegmentGroup(consumedSegments_1.concat(cs.segments), cs.children); });
                  }
              });
          }
      };
      /**
       * @param {?} injector
       * @param {?} route
       * @return {?}
       */
      ApplyRedirects.prototype.getChildConfig = function (injector, route) {
          var _this = this;
          if (route.children) {
              return rxjs_observable_of.of(new LoadedRouterConfig(route.children, injector, null, null));
          }
          else if (route.loadChildren) {
              return rxjs_operator_mergeMap.mergeMap.call(runGuards(injector, route), function (shouldLoad) {
                  if (shouldLoad) {
                      if (((route))._loadedConfig) {
                          return rxjs_observable_of.of(((route))._loadedConfig);
                      }
                      else {
                          return rxjs_operator_map.map.call(_this.configLoader.load(injector, route.loadChildren), function (r) {
                              ((route))._loadedConfig = r;
                              return r;
                          });
                      }
                  }
                  else {
                      return canLoadFails(route);
                  }
              });
          }
          else {
              return rxjs_observable_of.of(new LoadedRouterConfig([], injector, null, null));
          }
      };
      /**
       * @param {?} route
       * @param {?} urlTree
       * @return {?}
       */
      ApplyRedirects.prototype.lineralizeSegments = function (route, urlTree) {
          var /** @type {?} */ res = [];
          var /** @type {?} */ c = urlTree.root;
          while (true) {
              res = res.concat(c.segments);
              if (c.numberOfChildren === 0) {
                  return rxjs_observable_of.of(res);
              }
              else if (c.numberOfChildren > 1 || !c.children[PRIMARY_OUTLET]) {
                  return namedOutletsRedirect(route.redirectTo);
              }
              else {
                  c = c.children[PRIMARY_OUTLET];
              }
          }
      };
      /**
       * @param {?} segments
       * @param {?} redirectTo
       * @param {?} posParams
       * @return {?}
       */
      ApplyRedirects.prototype.applyRedirectCommands = function (segments, redirectTo, posParams) {
          var /** @type {?} */ t = this.urlSerializer.parse(redirectTo);
          return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
      };
      /**
       * @param {?} redirectTo
       * @param {?} urlTree
       * @param {?} segments
       * @param {?} posParams
       * @return {?}
       */
      ApplyRedirects.prototype.applyRedirectCreatreUrlTree = function (redirectTo, urlTree, segments, posParams) {
          var /** @type {?} */ newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
          return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
      };
      /**
       * @param {?} redirectToParams
       * @param {?} actualParams
       * @return {?}
       */
      ApplyRedirects.prototype.createQueryParams = function (redirectToParams, actualParams) {
          var /** @type {?} */ res = {};
          forEach(redirectToParams, function (v, k) {
              if (v.startsWith(':')) {
                  res[k] = actualParams[v.substring(1)];
              }
              else {
                  res[k] = v;
              }
          });
          return res;
      };
      /**
       * @param {?} redirectTo
       * @param {?} group
       * @param {?} segments
       * @param {?} posParams
       * @return {?}
       */
      ApplyRedirects.prototype.createSegmentGroup = function (redirectTo, group, segments, posParams) {
          var _this = this;
          var /** @type {?} */ updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
          var /** @type {?} */ children = {};
          forEach(group.children, function (child, name) {
              children[name] = _this.createSegmentGroup(redirectTo, child, segments, posParams);
          });
          return new UrlSegmentGroup(updatedSegments, children);
      };
      /**
       * @param {?} redirectTo
       * @param {?} redirectToSegments
       * @param {?} actualSegments
       * @param {?} posParams
       * @return {?}
       */
      ApplyRedirects.prototype.createSegments = function (redirectTo, redirectToSegments, actualSegments, posParams) {
          var _this = this;
          return redirectToSegments.map(function (s) { return s.path.startsWith(':') ? _this.findPosParam(redirectTo, s, posParams) :
              _this.findOrReturn(s, actualSegments); });
      };
      /**
       * @param {?} redirectTo
       * @param {?} redirectToUrlSegment
       * @param {?} posParams
       * @return {?}
       */
      ApplyRedirects.prototype.findPosParam = function (redirectTo, redirectToUrlSegment, posParams) {
          var /** @type {?} */ pos = posParams[redirectToUrlSegment.path.substring(1)];
          if (!pos)
              throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + redirectToUrlSegment.path + "'.");
          return pos;
      };
      /**
       * @param {?} redirectToUrlSegment
       * @param {?} actualSegments
       * @return {?}
       */
      ApplyRedirects.prototype.findOrReturn = function (redirectToUrlSegment, actualSegments) {
          var /** @type {?} */ idx = 0;
          for (var _i = 0, actualSegments_1 = actualSegments; _i < actualSegments_1.length; _i++) {
              var s = actualSegments_1[_i];
              if (s.path === redirectToUrlSegment.path) {
                  actualSegments.splice(idx);
                  return s;
              }
              idx++;
          }
          return redirectToUrlSegment;
      };
      return ApplyRedirects;
  }());
  /**
   * @param {?} injector
   * @param {?} route
   * @return {?}
   */
  function runGuards(injector, route) {
      var /** @type {?} */ canLoad = route.canLoad;
      if (!canLoad || canLoad.length === 0)
          return rxjs_observable_of.of(true);
      var /** @type {?} */ obs = rxjs_operator_map.map.call(rxjs_observable_from.from(canLoad), function (c) {
          var /** @type {?} */ guard = injector.get(c);
          if (guard.canLoad) {
              return wrapIntoObservable(guard.canLoad(route));
          }
          else {
              return wrapIntoObservable(guard(route));
          }
      });
      return andObservables(obs);
  }
  /**
   * @param {?} segmentGroup
   * @param {?} route
   * @param {?} segments
   * @return {?}
   */
  function match(segmentGroup, route, segments) {
      var /** @type {?} */ noMatch = { matched: false, consumedSegments: /** @type {?} */ ([]), lastChild: 0, positionalParamSegments: {} };
      if (route.path === '') {
          if ((route.pathMatch === 'full') && (segmentGroup.hasChildren() || segments.length > 0)) {
              return { matched: false, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
          }
          else {
              return { matched: true, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
          }
      }
      var /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
      var /** @type {?} */ res = matcher(segments, segmentGroup, route);
      if (!res)
          return noMatch;
      return {
          matched: true,
          consumedSegments: res.consumed,
          lastChild: res.consumed.length,
          positionalParamSegments: res.posParams
      };
  }
  /**
   * @param {?} segmentGroup
   * @param {?} consumedSegments
   * @param {?} slicedSegments
   * @param {?} config
   * @return {?}
   */
  function split(segmentGroup, consumedSegments, slicedSegments, config) {
      if (slicedSegments.length > 0 &&
          containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, config)) {
          var /** @type {?} */ s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
          return { segmentGroup: mergeTrivialChildren(s), slicedSegments: [] };
      }
      else if (slicedSegments.length === 0 &&
          containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
          var /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
          return { segmentGroup: mergeTrivialChildren(s), slicedSegments: slicedSegments };
      }
      else {
          return { segmentGroup: segmentGroup, slicedSegments: slicedSegments };
      }
  }
  /**
   * @param {?} s
   * @return {?}
   */
  function mergeTrivialChildren(s) {
      if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
          var /** @type {?} */ c = s.children[PRIMARY_OUTLET];
          return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
      }
      else {
          return s;
      }
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @param {?} children
   * @return {?}
   */
  function addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
      var /** @type {?} */ res = {};
      for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
          var r = routes_1[_i];
          if (emptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet$1(r)]) {
              res[getOutlet$1(r)] = new UrlSegmentGroup([], {});
          }
      }
      return merge(children, res);
  }
  /**
   * @param {?} routes
   * @param {?} primarySegmentGroup
   * @return {?}
   */
  function createChildrenForEmptySegments(routes, primarySegmentGroup) {
      var /** @type {?} */ res = {};
      res[PRIMARY_OUTLET] = primarySegmentGroup;
      for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
          var r = routes_2[_i];
          if (r.path === '' && getOutlet$1(r) !== PRIMARY_OUTLET) {
              res[getOutlet$1(r)] = new UrlSegmentGroup([], {});
          }
      }
      return res;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @return {?}
   */
  function containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, routes) {
      return routes
          .filter(function (r) { return emptyPathRedirect(segmentGroup, slicedSegments, r) &&
          getOutlet$1(r) !== PRIMARY_OUTLET; })
          .length > 0;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @return {?}
   */
  function containsEmptyPathRedirects(segmentGroup, slicedSegments, routes) {
      return routes.filter(function (r) { return emptyPathRedirect(segmentGroup, slicedSegments, r); }).length > 0;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} r
   * @return {?}
   */
  function emptyPathRedirect(segmentGroup, slicedSegments, r) {
      if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === 'full')
          return false;
      return r.path === '' && r.redirectTo !== undefined;
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function getOutlet$1(route) {
      return route.outlet ? route.outlet : PRIMARY_OUTLET;
  }

  /**
   * @param {?} config
   * @param {?=} parentPath
   * @return {?}
   */
  function validateConfig(config, parentPath) {
      if (parentPath === void 0) { parentPath = ''; }
      // forEach doesn't iterate undefined values
      for (var /** @type {?} */ i = 0; i < config.length; i++) {
          var /** @type {?} */ route = config[i];
          var /** @type {?} */ fullPath = getFullPath(parentPath, route);
          validateNode(route, fullPath);
      }
  }
  /**
   * @param {?} route
   * @param {?} fullPath
   * @return {?}
   */
  function validateNode(route, fullPath) {
      if (!route) {
          throw new Error("\n      Invalid configuration of route '" + fullPath + "': Encountered undefined route.\n      The reason might be an extra comma.\n       \n      Example: \n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    ");
      }
      if (Array.isArray(route)) {
          throw new Error("Invalid configuration of route '" + fullPath + "': Array cannot be specified");
      }
      if (!route.component && (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
          throw new Error("Invalid configuration of route '" + fullPath + "': a componentless route cannot have a named outlet set");
      }
      if (route.redirectTo && route.children) {
          throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and children cannot be used together");
      }
      if (route.redirectTo && route.loadChildren) {
          throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and loadChildren cannot be used together");
      }
      if (route.children && route.loadChildren) {
          throw new Error("Invalid configuration of route '" + fullPath + "': children and loadChildren cannot be used together");
      }
      if (route.redirectTo && route.component) {
          throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and component cannot be used together");
      }
      if (route.path && route.matcher) {
          throw new Error("Invalid configuration of route '" + fullPath + "': path and matcher cannot be used together");
      }
      if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
          throw new Error("Invalid configuration of route '" + fullPath + "'. One of the following must be provided: component, redirectTo, children or loadChildren");
      }
      if (route.path === void 0 && route.matcher === void 0) {
          throw new Error("Invalid configuration of route '" + fullPath + "': routes must have either a path or a matcher specified");
      }
      if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
          throw new Error("Invalid configuration of route '" + fullPath + "': path cannot start with a slash");
      }
      if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
          var /** @type {?} */ exp = "The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.";
          throw new Error("Invalid configuration of route '{path: \"" + fullPath + "\", redirectTo: \"" + route.redirectTo + "\"}': please provide 'pathMatch'. " + exp);
      }
      if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
          throw new Error("Invalid configuration of route '" + fullPath + "': pathMatch can only be set to 'prefix' or 'full'");
      }
      if (route.children) {
          validateConfig(route.children, fullPath);
      }
  }
  /**
   * @param {?} parentPath
   * @param {?} currentRoute
   * @return {?}
   */
  function getFullPath(parentPath, currentRoute) {
      if (!currentRoute) {
          return parentPath;
      }
      if (!parentPath && !currentRoute.path) {
          return '';
      }
      else if (parentPath && !currentRoute.path) {
          return parentPath + "/";
      }
      else if (!parentPath && currentRoute.path) {
          return currentRoute.path;
      }
      else {
          return parentPath + "/" + currentRoute.path;
      }
  }

  /**
   * @license undefined
    * Copyright Google Inc. All Rights Reserved.
    * *
    * Use of this source code is governed by an MIT-style license that can be
    * found in the LICENSE file at https://angular.io/license
   */
  var Tree = (function () {
      /**
       * @param {?} root
       */
      function Tree(root) {
          this._root = root;
      }
      Object.defineProperty(Tree.prototype, "root", {
          /**
           * @return {?}
           */
          get: function () { return this._root.value; },
          enumerable: true,
          configurable: true
      });
      /**
       * @param {?} t
       * @return {?}
       */
      Tree.prototype.parent = function (t) {
          var /** @type {?} */ p = this.pathFromRoot(t);
          return p.length > 1 ? p[p.length - 2] : null;
      };
      /**
       * @param {?} t
       * @return {?}
       */
      Tree.prototype.children = function (t) {
          var /** @type {?} */ n = findNode(t, this._root);
          return n ? n.children.map(function (t) { return t.value; }) : [];
      };
      /**
       * @param {?} t
       * @return {?}
       */
      Tree.prototype.firstChild = function (t) {
          var /** @type {?} */ n = findNode(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
      };
      /**
       * @param {?} t
       * @return {?}
       */
      Tree.prototype.siblings = function (t) {
          var /** @type {?} */ p = findPath(t, this._root, []);
          if (p.length < 2)
              return [];
          var /** @type {?} */ c = p[p.length - 2].children.map(function (c) { return c.value; });
          return c.filter(function (cc) { return cc !== t; });
      };
      /**
       * @param {?} t
       * @return {?}
       */
      Tree.prototype.pathFromRoot = function (t) { return findPath(t, this._root, []).map(function (s) { return s.value; }); };
      return Tree;
  }());
  /**
   * @param {?} expected
   * @param {?} c
   * @return {?}
   */
  function findNode(expected, c) {
      if (expected === c.value)
          return c;
      for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
          var cc = _a[_i];
          var /** @type {?} */ r = findNode(expected, cc);
          if (r)
              return r;
      }
      return null;
  }
  /**
   * @param {?} expected
   * @param {?} c
   * @param {?} collected
   * @return {?}
   */
  function findPath(expected, c, collected) {
      collected.push(c);
      if (expected === c.value)
          return collected;
      for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
          var cc = _a[_i];
          var /** @type {?} */ cloned = collected.slice(0);
          var /** @type {?} */ r = findPath(expected, cc, cloned);
          if (r.length > 0)
              return r;
      }
      return [];
  }
  var TreeNode = (function () {
      /**
       * @param {?} value
       * @param {?} children
       */
      function TreeNode(value, children) {
          this.value = value;
          this.children = children;
      }
      /**
       * @return {?}
       */
      TreeNode.prototype.toString = function () { return "TreeNode(" + this.value + ")"; };
      return TreeNode;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$1 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
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
  var RouterState = (function (_super) {
      __extends$1(RouterState, _super);
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
  /**
   * @param {?} urlTree
   * @param {?} rootComponent
   * @return {?}
   */
  function createEmptyState(urlTree, rootComponent) {
      var /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
      var /** @type {?} */ emptyUrl = new rxjs_BehaviorSubject.BehaviorSubject([new UrlSegment('', {})]);
      var /** @type {?} */ emptyParams = new rxjs_BehaviorSubject.BehaviorSubject({});
      var /** @type {?} */ emptyData = new rxjs_BehaviorSubject.BehaviorSubject({});
      var /** @type {?} */ emptyQueryParams = new rxjs_BehaviorSubject.BehaviorSubject({});
      var /** @type {?} */ fragment = new rxjs_BehaviorSubject.BehaviorSubject('');
      var /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
      activated.snapshot = snapshot.root;
      return new RouterState(new TreeNode(activated, []), snapshot);
  }
  /**
   * @param {?} urlTree
   * @param {?} rootComponent
   * @return {?}
   */
  function createEmptyStateSnapshot(urlTree, rootComponent) {
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
  var ActivatedRoute = (function () {
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
  /**
   * @param {?} route
   * @return {?}
   */
  function inheritedParamsDataResolve(route) {
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
  var ActivatedRouteSnapshot = (function () {
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
  var RouterStateSnapshot = (function (_super) {
      __extends$1(RouterStateSnapshot, _super);
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
  function advanceActivatedRoute(route) {
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
  function equalParamsAndUrlSegments(a, b) {
      return shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
  }

  /**
   * @param {?} routeReuseStrategy
   * @param {?} curr
   * @param {?} prevState
   * @return {?}
   */
  function createRouterState(routeReuseStrategy, curr, prevState) {
      var /** @type {?} */ root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
      return new RouterState(root, curr);
  }
  /**
   * @param {?} routeReuseStrategy
   * @param {?} curr
   * @param {?=} prevState
   * @return {?}
   */
  function createNode(routeReuseStrategy, curr, prevState) {
      // reuse an activated route that is currently displayed on the screen
      if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
          var /** @type {?} */ value = prevState.value;
          value._futureSnapshot = curr.value;
          var /** @type {?} */ children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
          return new TreeNode(value, children);
      }
      else if (routeReuseStrategy.retrieve(curr.value)) {
          var /** @type {?} */ tree = ((routeReuseStrategy.retrieve(curr.value))).route;
          setFutureSnapshotsOfActivatedRoutes(curr, tree);
          return tree;
      }
      else {
          var /** @type {?} */ value = createActivatedRoute(curr.value);
          var /** @type {?} */ children = curr.children.map(function (c) { return createNode(routeReuseStrategy, c); });
          return new TreeNode(value, children);
      }
  }
  /**
   * @param {?} curr
   * @param {?} result
   * @return {?}
   */
  function setFutureSnapshotsOfActivatedRoutes(curr, result) {
      if (curr.value.routeConfig !== result.value.routeConfig) {
          throw new Error('Cannot reattach ActivatedRouteSnapshot created from a different route');
      }
      if (curr.children.length !== result.children.length) {
          throw new Error('Cannot reattach ActivatedRouteSnapshot with a different number of children');
      }
      result.value._futureSnapshot = curr.value;
      for (var /** @type {?} */ i = 0; i < curr.children.length; ++i) {
          setFutureSnapshotsOfActivatedRoutes(curr.children[i], result.children[i]);
      }
  }
  /**
   * @param {?} routeReuseStrategy
   * @param {?} curr
   * @param {?} prevState
   * @return {?}
   */
  function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
      return curr.children.map(function (child) {
          for (var _i = 0, _a = prevState.children; _i < _a.length; _i++) {
              var p = _a[_i];
              if (routeReuseStrategy.shouldReuseRoute(p.value.snapshot, child.value)) {
                  return createNode(routeReuseStrategy, child, p);
              }
          }
          return createNode(routeReuseStrategy, child);
      });
  }
  /**
   * @param {?} c
   * @return {?}
   */
  function createActivatedRoute(c) {
      return new ActivatedRoute(new rxjs_BehaviorSubject.BehaviorSubject(c.url), new rxjs_BehaviorSubject.BehaviorSubject(c.params), new rxjs_BehaviorSubject.BehaviorSubject(c.queryParams), new rxjs_BehaviorSubject.BehaviorSubject(c.fragment), new rxjs_BehaviorSubject.BehaviorSubject(c.data), c.outlet, c.component, c);
  }

  /**
   * @param {?} route
   * @param {?} urlTree
   * @param {?} commands
   * @param {?} queryParams
   * @param {?} fragment
   * @return {?}
   */
  function createUrlTree(route, urlTree, commands, queryParams, fragment) {
      if (commands.length === 0) {
          return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
      }
      var /** @type {?} */ nav = computeNavigation(commands);
      if (nav.toRoot()) {
          return tree(urlTree.root, new UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
      }
      var /** @type {?} */ startingPosition = findStartingPosition(nav, urlTree, route);
      var /** @type {?} */ segmentGroup = startingPosition.processChildren ?
          updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) :
          updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
      return tree(startingPosition.segmentGroup, segmentGroup, urlTree, queryParams, fragment);
  }
  /**
   * @param {?} command
   * @return {?}
   */
  function isMatrixParams(command) {
      return typeof command === 'object' && !command.outlets && !command.segmentPath;
  }
  /**
   * @param {?} oldSegmentGroup
   * @param {?} newSegmentGroup
   * @param {?} urlTree
   * @param {?} queryParams
   * @param {?} fragment
   * @return {?}
   */
  function tree(oldSegmentGroup, newSegmentGroup, urlTree, queryParams, fragment) {
      if (urlTree.root === oldSegmentGroup) {
          return new UrlTree(newSegmentGroup, stringify(queryParams), fragment);
      }
      return new UrlTree(replaceSegment(urlTree.root, oldSegmentGroup, newSegmentGroup), stringify(queryParams), fragment);
  }
  /**
   * @param {?} current
   * @param {?} oldSegment
   * @param {?} newSegment
   * @return {?}
   */
  function replaceSegment(current, oldSegment, newSegment) {
      var /** @type {?} */ children = {};
      forEach(current.children, function (c, outletName) {
          if (c === oldSegment) {
              children[outletName] = newSegment;
          }
          else {
              children[outletName] = replaceSegment(c, oldSegment, newSegment);
          }
      });
      return new UrlSegmentGroup(current.segments, children);
  }
  var Navigation = (function () {
      /**
       * @param {?} isAbsolute
       * @param {?} numberOfDoubleDots
       * @param {?} commands
       */
      function Navigation(isAbsolute, numberOfDoubleDots, commands) {
          this.isAbsolute = isAbsolute;
          this.numberOfDoubleDots = numberOfDoubleDots;
          this.commands = commands;
          if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
              throw new Error('Root segment cannot have matrix parameters');
          }
          var cmdWithOutlet = commands.find(function (c) { return typeof c === 'object' && c.outlets; });
          if (cmdWithOutlet && cmdWithOutlet !== last(commands)) {
              throw new Error('{outlets:{}} has to be the last command');
          }
      }
      /**
       * @return {?}
       */
      Navigation.prototype.toRoot = function () {
          return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
      };
      return Navigation;
  }());
  /**
   *  Transforms commands to a normalized `Navigation`
   * @param {?} commands
   * @return {?}
   */
  function computeNavigation(commands) {
      if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] === '/') {
          return new Navigation(true, 0, commands);
      }
      var /** @type {?} */ numberOfDoubleDots = 0;
      var /** @type {?} */ isAbsolute = false;
      var /** @type {?} */ res = commands.reduce(function (res, cmd, cmdIdx) {
          if (typeof cmd === 'object') {
              if (cmd.outlets) {
                  var /** @type {?} */ outlets_1 = {};
                  forEach(cmd.outlets, function (commands, name) {
                      outlets_1[name] = typeof commands === 'string' ? commands.split('/') : commands;
                  });
                  return res.concat([{ outlets: outlets_1 }]);
              }
              if (cmd.segmentPath) {
                  return res.concat([cmd.segmentPath]);
              }
          }
          if (!(typeof cmd === 'string')) {
              return res.concat([cmd]);
          }
          if (cmdIdx === 0) {
              cmd.split('/').forEach(function (urlPart, partIndex) {
                  if (partIndex == 0 && urlPart === '.') {
                  }
                  else if (partIndex == 0 && urlPart === '') {
                      isAbsolute = true;
                  }
                  else if (urlPart === '..') {
                      numberOfDoubleDots++;
                  }
                  else if (urlPart != '') {
                      res.push(urlPart);
                  }
              });
              return res;
          }
          return res.concat([cmd]);
      }, []);
      return new Navigation(isAbsolute, numberOfDoubleDots, res);
  }
  var Position = (function () {
      /**
       * @param {?} segmentGroup
       * @param {?} processChildren
       * @param {?} index
       */
      function Position(segmentGroup, processChildren, index) {
          this.segmentGroup = segmentGroup;
          this.processChildren = processChildren;
          this.index = index;
      }
      return Position;
  }());
  /**
   * @param {?} nav
   * @param {?} tree
   * @param {?} route
   * @return {?}
   */
  function findStartingPosition(nav, tree, route) {
      if (nav.isAbsolute) {
          return new Position(tree.root, true, 0);
      }
      if (route.snapshot._lastPathIndex === -1) {
          return new Position(route.snapshot._urlSegment, true, 0);
      }
      var /** @type {?} */ modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
      var /** @type {?} */ index = route.snapshot._lastPathIndex + modifier;
      return createPositionApplyingDoubleDots(route.snapshot._urlSegment, index, nav.numberOfDoubleDots);
  }
  /**
   * @param {?} group
   * @param {?} index
   * @param {?} numberOfDoubleDots
   * @return {?}
   */
  function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
      var /** @type {?} */ g = group;
      var /** @type {?} */ ci = index;
      var /** @type {?} */ dd = numberOfDoubleDots;
      while (dd > ci) {
          dd -= ci;
          g = g.parent;
          if (!g) {
              throw new Error('Invalid number of \'../\'');
          }
          ci = g.segments.length;
      }
      return new Position(g, false, ci - dd);
  }
  /**
   * @param {?} command
   * @return {?}
   */
  function getPath(command) {
      if (typeof command === 'object' && command.outlets)
          return command.outlets[PRIMARY_OUTLET];
      return "" + command;
  }
  /**
   * @param {?} commands
   * @return {?}
   */
  function getOutlets(commands) {
      if (!(typeof commands[0] === 'object'))
          return (_a = {}, _a[PRIMARY_OUTLET] = commands, _a);
      if (commands[0].outlets === undefined)
          return (_b = {}, _b[PRIMARY_OUTLET] = commands, _b);
      return commands[0].outlets;
      var _a, _b;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} startIndex
   * @param {?} commands
   * @return {?}
   */
  function updateSegmentGroup(segmentGroup, startIndex, commands) {
      if (!segmentGroup) {
          segmentGroup = new UrlSegmentGroup([], {});
      }
      if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
          return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
      }
      var /** @type {?} */ m = prefixedWith(segmentGroup, startIndex, commands);
      var /** @type {?} */ slicedCommands = commands.slice(m.commandIndex);
      if (m.match && m.pathIndex < segmentGroup.segments.length) {
          var /** @type {?} */ g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
          g.children[PRIMARY_OUTLET] =
              new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
          return updateSegmentGroupChildren(g, 0, slicedCommands);
      }
      else if (m.match && slicedCommands.length === 0) {
          return new UrlSegmentGroup(segmentGroup.segments, {});
      }
      else if (m.match && !segmentGroup.hasChildren()) {
          return createNewSegmentGroup(segmentGroup, startIndex, commands);
      }
      else if (m.match) {
          return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
      }
      else {
          return createNewSegmentGroup(segmentGroup, startIndex, commands);
      }
  }
  /**
   * @param {?} segmentGroup
   * @param {?} startIndex
   * @param {?} commands
   * @return {?}
   */
  function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
      if (commands.length === 0) {
          return new UrlSegmentGroup(segmentGroup.segments, {});
      }
      else {
          var /** @type {?} */ outlets_2 = getOutlets(commands);
          var /** @type {?} */ children_1 = {};
          forEach(outlets_2, function (commands, outlet) {
              if (commands !== null) {
                  children_1[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
              }
          });
          forEach(segmentGroup.children, function (child, childOutlet) {
              if (outlets_2[childOutlet] === undefined) {
                  children_1[childOutlet] = child;
              }
          });
          return new UrlSegmentGroup(segmentGroup.segments, children_1);
      }
  }
  /**
   * @param {?} segmentGroup
   * @param {?} startIndex
   * @param {?} commands
   * @return {?}
   */
  function prefixedWith(segmentGroup, startIndex, commands) {
      var /** @type {?} */ currentCommandIndex = 0;
      var /** @type {?} */ currentPathIndex = startIndex;
      var /** @type {?} */ noMatch = { match: false, pathIndex: 0, commandIndex: 0 };
      while (currentPathIndex < segmentGroup.segments.length) {
          if (currentCommandIndex >= commands.length)
              return noMatch;
          var /** @type {?} */ path = segmentGroup.segments[currentPathIndex];
          var /** @type {?} */ curr = getPath(commands[currentCommandIndex]);
          var /** @type {?} */ next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
          if (currentPathIndex > 0 && curr === undefined)
              break;
          if (curr && next && (typeof next === 'object') && next.outlets === undefined) {
              if (!compare(curr, next, path))
                  return noMatch;
              currentCommandIndex += 2;
          }
          else {
              if (!compare(curr, {}, path))
                  return noMatch;
              currentCommandIndex++;
          }
          currentPathIndex++;
      }
      return { match: true, pathIndex: currentPathIndex, commandIndex: currentCommandIndex };
  }
  /**
   * @param {?} segmentGroup
   * @param {?} startIndex
   * @param {?} commands
   * @return {?}
   */
  function createNewSegmentGroup(segmentGroup, startIndex, commands) {
      var /** @type {?} */ paths = segmentGroup.segments.slice(0, startIndex);
      var /** @type {?} */ i = 0;
      while (i < commands.length) {
          if (typeof commands[i] === 'object' && commands[i].outlets !== undefined) {
              var /** @type {?} */ children = createNewSegmentChildren(commands[i].outlets);
              return new UrlSegmentGroup(paths, children);
          }
          // if we start with an object literal, we need to reuse the path part from the segment
          if (i === 0 && isMatrixParams(commands[0])) {
              var /** @type {?} */ p = segmentGroup.segments[startIndex];
              paths.push(new UrlSegment(p.path, commands[0]));
              i++;
              continue;
          }
          var /** @type {?} */ curr = getPath(commands[i]);
          var /** @type {?} */ next = (i < commands.length - 1) ? commands[i + 1] : null;
          if (curr && next && isMatrixParams(next)) {
              paths.push(new UrlSegment(curr, stringify(next)));
              i += 2;
          }
          else {
              paths.push(new UrlSegment(curr, {}));
              i++;
          }
      }
      return new UrlSegmentGroup(paths, {});
  }
  /**
   * @param {?} outlets
   * @return {?}
   */
  function createNewSegmentChildren(outlets) {
      var /** @type {?} */ children = {};
      forEach(outlets, function (commands, outlet) {
          if (commands !== null) {
              children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
          }
      });
      return children;
  }
  /**
   * @param {?} params
   * @return {?}
   */
  function stringify(params) {
      var /** @type {?} */ res = {};
      forEach(params, function (v, k) { return res[k] = "" + v; });
      return res;
  }
  /**
   * @param {?} path
   * @param {?} params
   * @param {?} segment
   * @return {?}
   */
  function compare(path, params, segment) {
      return path == segment.path && shallowEqual(params, segment.parameters);
  }

  var NoMatch$1 = (function () {
      function NoMatch() {
      }
      return NoMatch;
  }());
  /**
   * @param {?} rootComponentType
   * @param {?} config
   * @param {?} urlTree
   * @param {?} url
   * @return {?}
   */
  function recognize(rootComponentType, config, urlTree, url) {
      return new Recognizer(rootComponentType, config, urlTree, url).recognize();
  }
  var Recognizer = (function () {
      /**
       * @param {?} rootComponentType
       * @param {?} config
       * @param {?} urlTree
       * @param {?} url
       */
      function Recognizer(rootComponentType, config, urlTree, url) {
          this.rootComponentType = rootComponentType;
          this.config = config;
          this.urlTree = urlTree;
          this.url = url;
      }
      /**
       * @return {?}
       */
      Recognizer.prototype.recognize = function () {
          try {
              var /** @type {?} */ rootSegmentGroup = split$1(this.urlTree.root, [], [], this.config).segmentGroup;
              var /** @type {?} */ children = this.processSegmentGroup(this.config, rootSegmentGroup, PRIMARY_OUTLET);
              var /** @type {?} */ root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
              var /** @type {?} */ rootNode = new TreeNode(root, children);
              var /** @type {?} */ routeState = new RouterStateSnapshot(this.url, rootNode);
              this.inheriteParamsAndData(routeState._root);
              return rxjs_observable_of.of(routeState);
          }
          catch (e) {
              return new rxjs_Observable.Observable(function (obs) { return obs.error(e); });
          }
      };
      /**
       * @param {?} routeNode
       * @return {?}
       */
      Recognizer.prototype.inheriteParamsAndData = function (routeNode) {
          var _this = this;
          var /** @type {?} */ route = routeNode.value;
          var /** @type {?} */ i = inheritedParamsDataResolve(route);
          route.params = Object.freeze(i.params);
          route.data = Object.freeze(i.data);
          routeNode.children.forEach(function (n) { return _this.inheriteParamsAndData(n); });
      };
      /**
       * @param {?} config
       * @param {?} segmentGroup
       * @param {?} outlet
       * @return {?}
       */
      Recognizer.prototype.processSegmentGroup = function (config, segmentGroup, outlet) {
          if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
              return this.processChildren(config, segmentGroup);
          }
          else {
              return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
          }
      };
      /**
       * @param {?} config
       * @param {?} segmentGroup
       * @return {?}
       */
      Recognizer.prototype.processChildren = function (config, segmentGroup) {
          var _this = this;
          var /** @type {?} */ children = mapChildrenIntoArray(segmentGroup, function (child, childOutlet) { return _this.processSegmentGroup(config, child, childOutlet); });
          checkOutletNameUniqueness(children);
          sortActivatedRouteSnapshots(children);
          return children;
      };
      /**
       * @param {?} config
       * @param {?} segmentGroup
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      Recognizer.prototype.processSegment = function (config, segmentGroup, segments, outlet) {
          for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
              var r = config_1[_i];
              try {
                  return this.processSegmentAgainstRoute(r, segmentGroup, segments, outlet);
              }
              catch (e) {
                  if (!(e instanceof NoMatch$1))
                      throw e;
              }
          }
          if (this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
              return [];
          }
          else {
              throw new NoMatch$1();
          }
      };
      /**
       * @param {?} segmentGroup
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      Recognizer.prototype.noLeftoversInUrl = function (segmentGroup, segments, outlet) {
          return segments.length === 0 && !segmentGroup.children[outlet];
      };
      /**
       * @param {?} route
       * @param {?} rawSegment
       * @param {?} segments
       * @param {?} outlet
       * @return {?}
       */
      Recognizer.prototype.processSegmentAgainstRoute = function (route, rawSegment, segments, outlet) {
          if (route.redirectTo)
              throw new NoMatch$1();
          if ((route.outlet ? route.outlet : PRIMARY_OUTLET) !== outlet)
              throw new NoMatch$1();
          if (route.path === '**') {
              var /** @type {?} */ params = segments.length > 0 ? last(segments).parameters : {};
              var /** @type {?} */ snapshot_1 = new ActivatedRouteSnapshot(segments, params, Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, getData(route), outlet, route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
              return [new TreeNode(snapshot_1, [])];
          }
          var _a = match$1(rawSegment, route, segments), consumedSegments = _a.consumedSegments, parameters = _a.parameters, lastChild = _a.lastChild;
          var /** @type {?} */ rawSlicedSegments = segments.slice(lastChild);
          var /** @type {?} */ childConfig = getChildConfig(route);
          var _b = split$1(rawSegment, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _b.segmentGroup, slicedSegments = _b.slicedSegments;
          var /** @type {?} */ snapshot = new ActivatedRouteSnapshot(consumedSegments, parameters, Object.freeze(this.urlTree.queryParams), this.urlTree.fragment, getData(route), outlet, route.component, route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
          if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
              var /** @type {?} */ children = this.processChildren(childConfig, segmentGroup);
              return [new TreeNode(snapshot, children)];
          }
          else if (childConfig.length === 0 && slicedSegments.length === 0) {
              return [new TreeNode(snapshot, [])];
          }
          else {
              var /** @type {?} */ children = this.processSegment(childConfig, segmentGroup, slicedSegments, PRIMARY_OUTLET);
              return [new TreeNode(snapshot, children)];
          }
      };
      return Recognizer;
  }());
  /**
   * @param {?} nodes
   * @return {?}
   */
  function sortActivatedRouteSnapshots(nodes) {
      nodes.sort(function (a, b) {
          if (a.value.outlet === PRIMARY_OUTLET)
              return -1;
          if (b.value.outlet === PRIMARY_OUTLET)
              return 1;
          return a.value.outlet.localeCompare(b.value.outlet);
      });
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function getChildConfig(route) {
      if (route.children) {
          return route.children;
      }
      else if (route.loadChildren) {
          return ((route))._loadedConfig.routes;
      }
      else {
          return [];
      }
  }
  /**
   * @param {?} segmentGroup
   * @param {?} route
   * @param {?} segments
   * @return {?}
   */
  function match$1(segmentGroup, route, segments) {
      if (route.path === '') {
          if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || segments.length > 0)) {
              throw new NoMatch$1();
          }
          else {
              return { consumedSegments: [], lastChild: 0, parameters: {} };
          }
      }
      var /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
      var /** @type {?} */ res = matcher(segments, segmentGroup, route);
      if (!res)
          throw new NoMatch$1();
      var /** @type {?} */ posParams = {};
      forEach(res.posParams, function (v, k) { posParams[k] = v.path; });
      var /** @type {?} */ parameters = merge(posParams, res.consumed[res.consumed.length - 1].parameters);
      return { consumedSegments: res.consumed, lastChild: res.consumed.length, parameters: parameters };
  }
  /**
   * @param {?} nodes
   * @return {?}
   */
  function checkOutletNameUniqueness(nodes) {
      var /** @type {?} */ names = {};
      nodes.forEach(function (n) {
          var /** @type {?} */ routeWithSameOutletName = names[n.value.outlet];
          if (routeWithSameOutletName) {
              var /** @type {?} */ p = routeWithSameOutletName.url.map(function (s) { return s.toString(); }).join('/');
              var /** @type {?} */ c = n.value.url.map(function (s) { return s.toString(); }).join('/');
              throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
          }
          names[n.value.outlet] = n.value;
      });
  }
  /**
   * @param {?} segmentGroup
   * @return {?}
   */
  function getSourceSegmentGroup(segmentGroup) {
      var /** @type {?} */ s = segmentGroup;
      while (s._sourceSegment) {
          s = s._sourceSegment;
      }
      return s;
  }
  /**
   * @param {?} segmentGroup
   * @return {?}
   */
  function getPathIndexShift(segmentGroup) {
      var /** @type {?} */ s = segmentGroup;
      var /** @type {?} */ res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
      while (s._sourceSegment) {
          s = s._sourceSegment;
          res += (s._segmentIndexShift ? s._segmentIndexShift : 0);
      }
      return res - 1;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} consumedSegments
   * @param {?} slicedSegments
   * @param {?} config
   * @return {?}
   */
  function split$1(segmentGroup, consumedSegments, slicedSegments, config) {
      if (slicedSegments.length > 0 &&
          containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) {
          var /** @type {?} */ s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
          s._sourceSegment = segmentGroup;
          s._segmentIndexShift = consumedSegments.length;
          return { segmentGroup: s, slicedSegments: [] };
      }
      else if (slicedSegments.length === 0 &&
          containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
          var /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
          s._sourceSegment = segmentGroup;
          s._segmentIndexShift = consumedSegments.length;
          return { segmentGroup: s, slicedSegments: slicedSegments };
      }
      else {
          var /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
          s._sourceSegment = segmentGroup;
          s._segmentIndexShift = consumedSegments.length;
          return { segmentGroup: s, slicedSegments: slicedSegments };
      }
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @param {?} children
   * @return {?}
   */
  function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
      var /** @type {?} */ res = {};
      for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
          var r = routes_1[_i];
          if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet$2(r)]) {
              var /** @type {?} */ s = new UrlSegmentGroup([], {});
              s._sourceSegment = segmentGroup;
              s._segmentIndexShift = segmentGroup.segments.length;
              res[getOutlet$2(r)] = s;
          }
      }
      return merge(children, res);
  }
  /**
   * @param {?} segmentGroup
   * @param {?} consumedSegments
   * @param {?} routes
   * @param {?} primarySegment
   * @return {?}
   */
  function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes, primarySegment) {
      var /** @type {?} */ res = {};
      res[PRIMARY_OUTLET] = primarySegment;
      primarySegment._sourceSegment = segmentGroup;
      primarySegment._segmentIndexShift = consumedSegments.length;
      for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
          var r = routes_2[_i];
          if (r.path === '' && getOutlet$2(r) !== PRIMARY_OUTLET) {
              var /** @type {?} */ s = new UrlSegmentGroup([], {});
              s._sourceSegment = segmentGroup;
              s._segmentIndexShift = consumedSegments.length;
              res[getOutlet$2(r)] = s;
          }
      }
      return res;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @return {?}
   */
  function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes) {
      return routes
          .filter(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r) &&
          getOutlet$2(r) !== PRIMARY_OUTLET; })
          .length > 0;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} routes
   * @return {?}
   */
  function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
      return routes.filter(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r); }).length > 0;
  }
  /**
   * @param {?} segmentGroup
   * @param {?} slicedSegments
   * @param {?} r
   * @return {?}
   */
  function emptyPathMatch(segmentGroup, slicedSegments, r) {
      if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === 'full')
          return false;
      return r.path === '' && r.redirectTo === undefined;
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function getOutlet$2(route) {
      return route.outlet ? route.outlet : PRIMARY_OUTLET;
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function getData(route) {
      return route.data ? route.data : {};
  }
  /**
   * @param {?} route
   * @return {?}
   */
  function getResolve(route) {
      return route.resolve ? route.resolve : {};
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   *  *
   */
  var RouterOutletMap = (function () {
      function RouterOutletMap() {
          /** @internal */
          this._outlets = {};
      }
      /**
       *  Adds an outlet to this map.
       * @param {?} name
       * @param {?} outlet
       * @return {?}
       */
      RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
      /**
       *  Removes an outlet from this map.
       * @param {?} name
       * @return {?}
       */
      RouterOutletMap.prototype.removeOutlet = function (name) { this._outlets[name] = undefined; };
      return RouterOutletMap;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   *  *
   * @abstract
   */
  var UrlHandlingStrategy = (function () {
      function UrlHandlingStrategy() {
      }
      /**
       *  Tells the router if this URL should be processed.
        * *
        * When it returns true, the router will execute the regular navigation.
        * When it returns false, the router will set the router state to an empty state.
        * As a result, all the active components will be destroyed.
        * *
       * @abstract
       * @param {?} url
       * @return {?}
       */
      UrlHandlingStrategy.prototype.shouldProcessUrl = function (url) { };
      /**
       *  Extracts the part of the URL that should be handled by the router.
        * The rest of the URL will remain untouched.
       * @abstract
       * @param {?} url
       * @return {?}
       */
      UrlHandlingStrategy.prototype.extract = function (url) { };
      /**
       *  Merges the URL fragment with the rest of the URL.
       * @abstract
       * @param {?} newUrlPart
       * @param {?} rawUrl
       * @return {?}
       */
      UrlHandlingStrategy.prototype.merge = function (newUrlPart, rawUrl) { };
      return UrlHandlingStrategy;
  }());
  /**
   * @experimental
   */
  var DefaultUrlHandlingStrategy = (function () {
      function DefaultUrlHandlingStrategy() {
      }
      /**
       * @param {?} url
       * @return {?}
       */
      DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) { return true; };
      /**
       * @param {?} url
       * @return {?}
       */
      DefaultUrlHandlingStrategy.prototype.extract = function (url) { return url; };
      /**
       * @param {?} newUrlPart
       * @param {?} wholeUrl
       * @return {?}
       */
      DefaultUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) { return newUrlPart; };
      return DefaultUrlHandlingStrategy;
  }());

  /**
   *  *
   */
  var NavigationStart = (function () {
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
  /**
   *  *
   */
  var NavigationEnd = (function () {
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
  /**
   *  *
   */
  var NavigationCancel = (function () {
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
  /**
   *  *
   */
  var NavigationError = (function () {
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
  /**
   *  *
   */
  var RoutesRecognized = (function () {
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
  var DefaultRouteReuseStrategy = (function () {
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
  var Router = (function () {
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
          this.navigations = new rxjs_BehaviorSubject.BehaviorSubject(null);
          this.routerEvents = new rxjs_Subject.Subject();
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
          rxjs_operator_concatMap.concatMap
              .call(this.navigations, function (nav) {
              if (nav) {
                  _this.executeScheduledNavigation(nav);
                  // a failed navigation should not stop the router from processing
                  // further navigations => the catch
                  return nav.promise.catch(function () { });
              }
              else {
                  return (rxjs_observable_of.of(null));
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
                  urlAndSnapshot$ = rxjs_operator_mergeMap.mergeMap.call(redirectsApplied$, function (appliedUrl) {
                      return rxjs_operator_map.map.call(recognize(_this.rootComponentType, _this.config, appliedUrl, _this.serializeUrl(appliedUrl)), function (snapshot) {
                          _this.routerEvents.next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(appliedUrl), snapshot));
                          return { appliedUrl: appliedUrl, snapshot: snapshot };
                      });
                  });
              }
              else {
                  urlAndSnapshot$ = rxjs_observable_of.of({ appliedUrl: url, snapshot: precreatedState });
              }
              // run preactivation: guards and data resolvers
              var /** @type {?} */ preActivation;
              var /** @type {?} */ preactivationTraverse$ = rxjs_operator_map.map.call(urlAndSnapshot$, function (_a) {
                  var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                  preActivation =
                      new PreActivation(snapshot, _this.currentRouterState.snapshot, _this.injector);
                  preActivation.traverse(_this.outletMap);
                  return { appliedUrl: appliedUrl, snapshot: snapshot };
              });
              var /** @type {?} */ preactivationCheckGuards = rxjs_operator_mergeMap.mergeMap.call(preactivationTraverse$, function (_a) {
                  var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                  if (_this.navigationId !== id)
                      return rxjs_observable_of.of(false);
                  return rxjs_operator_map.map.call(preActivation.checkGuards(), function (shouldActivate) {
                      return { appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate };
                  });
              });
              var /** @type {?} */ preactivationResolveData$ = rxjs_operator_mergeMap.mergeMap.call(preactivationCheckGuards, function (p) {
                  if (_this.navigationId !== id)
                      return rxjs_observable_of.of(false);
                  if (p.shouldActivate) {
                      return rxjs_operator_map.map.call(preActivation.resolveData(), function () { return p; });
                  }
                  else {
                      return rxjs_observable_of.of(p);
                  }
              });
              // create router state
              // this operation has side effects => route state is being affected
              var /** @type {?} */ routerState$ = rxjs_operator_map.map.call(preactivationResolveData$, function (_a) {
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
  var PreActivation = (function () {
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
              return rxjs_observable_of.of(true);
          var /** @type {?} */ checks$ = rxjs_observable_from.from(this.checks);
          var /** @type {?} */ runningChecks$ = rxjs_operator_mergeMap.mergeMap.call(checks$, function (s) {
              if (s instanceof CanActivate) {
                  return andObservables(rxjs_observable_from.from([_this.runCanActivateChild(s.path), _this.runCanActivate(s.route)]));
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
          return rxjs_operator_every.every.call(runningChecks$, function (result) { return result === true; });
      };
      /**
       * @return {?}
       */
      PreActivation.prototype.resolveData = function () {
          var _this = this;
          if (this.checks.length === 0)
              return rxjs_observable_of.of(null);
          var /** @type {?} */ checks$ = rxjs_observable_from.from(this.checks);
          var /** @type {?} */ runningChecks$ = rxjs_operator_concatMap.concatMap.call(checks$, function (s) {
              if (s instanceof CanActivate) {
                  return _this.runResolve(s.route);
              }
              else {
                  return rxjs_observable_of.of(null);
              }
          });
          return rxjs_operator_reduce.reduce.call(runningChecks$, function (_, __) { return _; });
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
              return rxjs_observable_of.of(true);
          var /** @type {?} */ obs = rxjs_operator_map.map.call(rxjs_observable_from.from(canActivate), function (c) {
              var /** @type {?} */ guard = _this.getToken(c, future);
              var /** @type {?} */ observable;
              if (guard.canActivate) {
                  observable = wrapIntoObservable(guard.canActivate(future, _this.future));
              }
              else {
                  observable = wrapIntoObservable(guard(future, _this.future));
              }
              return rxjs_operator_first.first.call(observable);
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
          return andObservables(rxjs_operator_map.map.call(rxjs_observable_from.from(canActivateChildGuards), function (d) {
              var /** @type {?} */ obs = rxjs_operator_map.map.call(rxjs_observable_from.from(d.guards), function (c) {
                  var /** @type {?} */ guard = _this.getToken(c, c.node);
                  var /** @type {?} */ observable;
                  if (guard.canActivateChild) {
                      observable = wrapIntoObservable(guard.canActivateChild(future, _this.future));
                  }
                  else {
                      observable = wrapIntoObservable(guard(future, _this.future));
                  }
                  return rxjs_operator_first.first.call(observable);
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
              return rxjs_observable_of.of(true);
          var /** @type {?} */ canDeactivate$ = rxjs_operator_mergeMap.mergeMap.call(rxjs_observable_from.from(canDeactivate), function (c) {
              var /** @type {?} */ guard = _this.getToken(c, curr);
              var /** @type {?} */ observable;
              if (guard.canDeactivate) {
                  observable = wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr));
              }
              else {
                  observable = wrapIntoObservable(guard(component, curr, _this.curr));
              }
              return rxjs_operator_first.first.call(observable);
          });
          return rxjs_operator_every.every.call(canDeactivate$, function (result) { return result === true; });
      };
      /**
       * @param {?} future
       * @return {?}
       */
      PreActivation.prototype.runResolve = function (future) {
          var /** @type {?} */ resolve = future._resolve;
          return rxjs_operator_map.map.call(this.resolveNode(resolve, future), function (resolvedData) {
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
              resolved.push({ provide: _angular_core.ComponentFactoryResolver, useValue: resolver });
          }
          else {
              injector = outlet.locationInjector;
              resolver = outlet.locationFactoryResolver;
          }
          outlet.activate(future, resolver, injector, _angular_core.ReflectiveInjector.resolve(resolved), outletMap);
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

  /**
   *  *
    * *
    * Consider the following route configuration:
    * `[{ path: 'user/:name', component: UserCmp }]`
    * *
    * When linking to this `user/:name` route, you can write:
    * `<a routerLink='/user/bob'>link to user component</a>`
    * *
    * *
    * The RouterLink directives let you link to specific parts of your app.
    * *
    * When the link is static, you can use the directive as follows:
    * `<a routerLink="/user/bob">link to user component</a>`
    * *
    * If you use dynamic values to generate the link, you can pass an array of path
    * segments, followed by the params for each segment.
    * *
    * For instance `['/team', teamId, 'user', userName, {details: true}]`
    * means that we want to generate a link to `/team/11/user/bob;details=true`.
    * *
    * Multiple static segments can be merged into one
    * (e.g., `['/team/11/user', userName, {details: true}]`).
    * *
    * The first segment name can be prepended with `/`, `./`, or `../`:
    * * If the first segment begins with `/`, the router will look up the route from the root of the
    * app.
    * * If the first segment begins with `./`, or doesn't begin with a slash, the router will
    * instead look in the children of the current activated route.
    * * And if the first segment begins with `../`, the router will go up one level.
    * *
    * You can set query params and fragment as follows:
    * *
    * ```
    * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
    * link to user component
    * </a>
    * ```
    * RouterLink will use these to generate this link: `/user/bob#education?debug=true`.
    * *
    * You can also tell the directive to preserve the current query params and fragment:
    * *
    * ```
    * <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
    * link to user component
    * </a>
    * ```
    * *
    * The router link directive always treats the provided input as a delta to the current url.
    * *
    * For instance, if the current url is `/user/(box//aux:team)`.
    * *
    * Then the following link `<a [routerLink]="['/user/jim']">Jim</a>` will generate the link
    * `/user/(jim//aux:team)`.
    * *
    * *
    * See {@link Router.createUrlTree} for more information.
    * *
   */
  var RouterLink = (function () {
      /**
       * @param {?} router
       * @param {?} route
       */
      function RouterLink(router, route) {
          this.router = router;
          this.route = route;
          this.commands = [];
      }
      Object.defineProperty(RouterLink.prototype, "routerLink", {
          /**
           * @param {?} data
           * @return {?}
           */
          set: function (data) {
              if (Array.isArray(data)) {
                  this.commands = data;
              }
              else {
                  this.commands = [data];
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @return {?}
       */
      RouterLink.prototype.onClick = function () {
          var /** @type {?} */ extras = {
              skipLocationChange: attrBoolValue(this.skipLocationChange),
              replaceUrl: attrBoolValue(this.replaceUrl),
          };
          this.router.navigateByUrl(this.urlTree, extras);
          return true;
      };
      Object.defineProperty(RouterLink.prototype, "urlTree", {
          /**
           * @return {?}
           */
          get: function () {
              return this.router.createUrlTree(this.commands, {
                  relativeTo: this.route,
                  queryParams: this.queryParams,
                  fragment: this.fragment,
                  preserveQueryParams: attrBoolValue(this.preserveQueryParams),
                  preserveFragment: attrBoolValue(this.preserveFragment),
              });
          },
          enumerable: true,
          configurable: true
      });
      RouterLink.decorators = [
          { type: _angular_core.Directive, args: [{ selector: ':not(a)[routerLink]' },] },
      ];
      /** @nocollapse */
      RouterLink.ctorParameters = function () { return [
          { type: Router, },
          { type: ActivatedRoute, },
      ]; };
      RouterLink.propDecorators = {
          'queryParams': [{ type: _angular_core.Input },],
          'fragment': [{ type: _angular_core.Input },],
          'preserveQueryParams': [{ type: _angular_core.Input },],
          'preserveFragment': [{ type: _angular_core.Input },],
          'skipLocationChange': [{ type: _angular_core.Input },],
          'replaceUrl': [{ type: _angular_core.Input },],
          'routerLink': [{ type: _angular_core.Input },],
          'onClick': [{ type: _angular_core.HostListener, args: ['click', [],] },],
      };
      return RouterLink;
  }());
  /**
   *  *
    * See {@link RouterLink} for more information.
    * *
    * *
   */
  var RouterLinkWithHref = (function () {
      /**
       * @param {?} router
       * @param {?} route
       * @param {?} locationStrategy
       */
      function RouterLinkWithHref(router, route, locationStrategy) {
          var _this = this;
          this.router = router;
          this.route = route;
          this.locationStrategy = locationStrategy;
          this.commands = [];
          this.subscription = router.events.subscribe(function (s) {
              if (s instanceof NavigationEnd) {
                  _this.updateTargetUrlAndHref();
              }
          });
      }
      Object.defineProperty(RouterLinkWithHref.prototype, "routerLink", {
          /**
           * @param {?} data
           * @return {?}
           */
          set: function (data) {
              if (Array.isArray(data)) {
                  this.commands = data;
              }
              else {
                  this.commands = [data];
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @param {?} changes
       * @return {?}
       */
      RouterLinkWithHref.prototype.ngOnChanges = function (changes) { this.updateTargetUrlAndHref(); };
      /**
       * @return {?}
       */
      RouterLinkWithHref.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
      /**
       * @param {?} button
       * @param {?} ctrlKey
       * @param {?} metaKey
       * @return {?}
       */
      RouterLinkWithHref.prototype.onClick = function (button, ctrlKey, metaKey) {
          if (button !== 0 || ctrlKey || metaKey) {
              return true;
          }
          if (typeof this.target === 'string' && this.target != '_self') {
              return true;
          }
          var /** @type {?} */ extras = {
              skipLocationChange: attrBoolValue(this.skipLocationChange),
              replaceUrl: attrBoolValue(this.replaceUrl),
          };
          this.router.navigateByUrl(this.urlTree, extras);
          return false;
      };
      /**
       * @return {?}
       */
      RouterLinkWithHref.prototype.updateTargetUrlAndHref = function () {
          this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
      };
      Object.defineProperty(RouterLinkWithHref.prototype, "urlTree", {
          /**
           * @return {?}
           */
          get: function () {
              return this.router.createUrlTree(this.commands, {
                  relativeTo: this.route,
                  queryParams: this.queryParams,
                  fragment: this.fragment,
                  preserveQueryParams: attrBoolValue(this.preserveQueryParams),
                  preserveFragment: attrBoolValue(this.preserveFragment),
              });
          },
          enumerable: true,
          configurable: true
      });
      RouterLinkWithHref.decorators = [
          { type: _angular_core.Directive, args: [{ selector: 'a[routerLink]' },] },
      ];
      /** @nocollapse */
      RouterLinkWithHref.ctorParameters = function () { return [
          { type: Router, },
          { type: ActivatedRoute, },
          { type: _angular_common.LocationStrategy, },
      ]; };
      RouterLinkWithHref.propDecorators = {
          'target': [{ type: _angular_core.Input },],
          'queryParams': [{ type: _angular_core.Input },],
          'fragment': [{ type: _angular_core.Input },],
          'preserveQueryParams': [{ type: _angular_core.Input },],
          'preserveFragment': [{ type: _angular_core.Input },],
          'skipLocationChange': [{ type: _angular_core.Input },],
          'replaceUrl': [{ type: _angular_core.Input },],
          'href': [{ type: _angular_core.HostBinding },],
          'routerLink': [{ type: _angular_core.Input },],
          'onClick': [{ type: _angular_core.HostListener, args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey'],] },],
      };
      return RouterLinkWithHref;
  }());
  /**
   * @param {?} s
   * @return {?}
   */
  function attrBoolValue(s) {
      return s === '' || !!s;
  }

  /**
   *  *
    * *
    * ```
    * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
    * ```
    * *
    * *
    * The RouterLinkActive directive lets you add a CSS class to an element when the link's route
    * becomes active.
    * *
    * Consider the following example:
    * *
    * ```
    * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
    * ```
    * *
    * When the url is either '/user' or '/user/bob', the active-link class will
    * be added to the `a` tag. If the url changes, the class will be removed.
    * *
    * You can set more than one class, as follows:
    * *
    * ```
    * <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
    * <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
    * ```
    * *
    * You can configure RouterLinkActive by passing `exact: true`. This will add the classes
    * only when the url matches the link exactly.
    * *
    * ```
    * <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
    * true}">Bob</a>
    * ```
    * *
    * You can assign the RouterLinkActive instance to a template variable and directly check
    * the `isActive` status.
    * ```
    * <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
    * Bob {{ rla.isActive ? '(already open)' : ''}}
    * </a>
    * ```
    * *
    * Finally, you can apply the RouterLinkActive directive to an ancestor of a RouterLink.
    * *
    * ```
    * <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
    * <a routerLink="/user/jim">Jim</a>
    * <a routerLink="/user/bob">Bob</a>
    * </div>
    * ```
    * *
    * This will set the active-link class on the div tag if the url is either '/user/jim' or
    * '/user/bob'.
    * *
    * *
   */
  var RouterLinkActive = (function () {
      /**
       * @param {?} router
       * @param {?} element
       * @param {?} renderer
       */
      function RouterLinkActive(router, element, renderer) {
          var _this = this;
          this.router = router;
          this.element = element;
          this.renderer = renderer;
          this.classes = [];
          this.routerLinkActiveOptions = { exact: false };
          this.subscription = router.events.subscribe(function (s) {
              if (s instanceof NavigationEnd) {
                  _this.update();
              }
          });
      }
      Object.defineProperty(RouterLinkActive.prototype, "isActive", {
          /**
           * @return {?}
           */
          get: function () { return this.hasActiveLink(); },
          enumerable: true,
          configurable: true
      });
      /**
       * @return {?}
       */
      RouterLinkActive.prototype.ngAfterContentInit = function () {
          var _this = this;
          this.links.changes.subscribe(function (s) { return _this.update(); });
          this.linksWithHrefs.changes.subscribe(function (s) { return _this.update(); });
          this.update();
      };
      Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
          /**
           * @param {?} data
           * @return {?}
           */
          set: function (data) {
              if (Array.isArray(data)) {
                  this.classes = (data);
              }
              else {
                  this.classes = data.split(' ');
              }
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @param {?} changes
       * @return {?}
       */
      RouterLinkActive.prototype.ngOnChanges = function (changes) { this.update(); };
      /**
       * @return {?}
       */
      RouterLinkActive.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
      /**
       * @return {?}
       */
      RouterLinkActive.prototype.update = function () {
          var _this = this;
          if (!this.links || !this.linksWithHrefs || !this.router.navigated)
              return;
          var /** @type {?} */ isActive = this.hasActiveLink();
          this.classes.forEach(function (c) {
              if (c) {
                  _this.renderer.setElementClass(_this.element.nativeElement, c, isActive);
              }
          });
      };
      /**
       * @param {?} router
       * @return {?}
       */
      RouterLinkActive.prototype.isLinkActive = function (router) {
          var _this = this;
          return function (link) {
              return router.isActive(link.urlTree, _this.routerLinkActiveOptions.exact);
          };
      };
      /**
       * @return {?}
       */
      RouterLinkActive.prototype.hasActiveLink = function () {
          return this.links.some(this.isLinkActive(this.router)) ||
              this.linksWithHrefs.some(this.isLinkActive(this.router));
      };
      RouterLinkActive.decorators = [
          { type: _angular_core.Directive, args: [{
                      selector: '[routerLinkActive]',
                      exportAs: 'routerLinkActive',
                  },] },
      ];
      /** @nocollapse */
      RouterLinkActive.ctorParameters = function () { return [
          { type: Router, },
          { type: _angular_core.ElementRef, },
          { type: _angular_core.Renderer, },
      ]; };
      RouterLinkActive.propDecorators = {
          'links': [{ type: _angular_core.ContentChildren, args: [RouterLink, { descendants: true },] },],
          'linksWithHrefs': [{ type: _angular_core.ContentChildren, args: [RouterLinkWithHref, { descendants: true },] },],
          'routerLinkActiveOptions': [{ type: _angular_core.Input },],
          'routerLinkActive': [{ type: _angular_core.Input },],
      };
      return RouterLinkActive;
  }());

  /**
   *  state.
    * *
    * *
    * ```
    * <router-outlet></router-outlet>
    * <router-outlet name='left'></router-outlet>
    * <router-outlet name='right'></router-outlet>
    * ```
    * *
    * A router outlet will emit an activate event any time a new component is being instantiated,
    * and a deactivate event when it is being destroyed.
    * *
    * ```
    * <router-outlet
    * (activate)='onActivate($event)'
    * (deactivate)='onDeactivate($event)'></router-outlet>
    * ```
    * *
   */
  var RouterOutlet = (function () {
      /**
       * @param {?} parentOutletMap
       * @param {?} location
       * @param {?} resolver
       * @param {?} name
       */
      function RouterOutlet(parentOutletMap, location, resolver, name) {
          this.parentOutletMap = parentOutletMap;
          this.location = location;
          this.resolver = resolver;
          this.name = name;
          this.activateEvents = new _angular_core.EventEmitter();
          this.deactivateEvents = new _angular_core.EventEmitter();
          parentOutletMap.registerOutlet(name ? name : PRIMARY_OUTLET, this);
      }
      /**
       * @return {?}
       */
      RouterOutlet.prototype.ngOnDestroy = function () { this.parentOutletMap.removeOutlet(this.name ? this.name : PRIMARY_OUTLET); };
      Object.defineProperty(RouterOutlet.prototype, "locationInjector", {
          /**
           * @return {?}
           */
          get: function () { return this.location.injector; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "locationFactoryResolver", {
          /**
           * @return {?}
           */
          get: function () { return this.resolver; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "isActivated", {
          /**
           * @return {?}
           */
          get: function () { return !!this.activated; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "component", {
          /**
           * @return {?}
           */
          get: function () {
              if (!this.activated)
                  throw new Error('Outlet is not activated');
              return this.activated.instance;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
          /**
           * @return {?}
           */
          get: function () {
              if (!this.activated)
                  throw new Error('Outlet is not activated');
              return this._activatedRoute;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * @return {?}
       */
      RouterOutlet.prototype.detach = function () {
          if (!this.activated)
              throw new Error('Outlet is not activated');
          this.location.detach();
          var /** @type {?} */ r = this.activated;
          this.activated = null;
          this._activatedRoute = null;
          return r;
      };
      /**
       * @param {?} ref
       * @param {?} activatedRoute
       * @return {?}
       */
      RouterOutlet.prototype.attach = function (ref, activatedRoute) {
          this.activated = ref;
          this._activatedRoute = activatedRoute;
          this.location.insert(ref.hostView);
      };
      /**
       * @return {?}
       */
      RouterOutlet.prototype.deactivate = function () {
          if (this.activated) {
              var /** @type {?} */ c = this.component;
              this.activated.destroy();
              this.activated = null;
              this._activatedRoute = null;
              this.deactivateEvents.emit(c);
          }
      };
      /**
       * @param {?} activatedRoute
       * @param {?} resolver
       * @param {?} injector
       * @param {?} providers
       * @param {?} outletMap
       * @return {?}
       */
      RouterOutlet.prototype.activate = function (activatedRoute, resolver, injector, providers, outletMap) {
          if (this.isActivated) {
              throw new Error('Cannot activate an already activated outlet');
          }
          this.outletMap = outletMap;
          this._activatedRoute = activatedRoute;
          var /** @type {?} */ snapshot = activatedRoute._futureSnapshot;
          var /** @type {?} */ component = (snapshot._routeConfig.component);
          var /** @type {?} */ factory = resolver.resolveComponentFactory(component);
          var /** @type {?} */ inj = _angular_core.ReflectiveInjector.fromResolvedProviders(providers, injector);
          this.activated = this.location.createComponent(factory, this.location.length, inj, []);
          this.activated.changeDetectorRef.detectChanges();
          this.activateEvents.emit(this.activated.instance);
      };
      RouterOutlet.decorators = [
          { type: _angular_core.Directive, args: [{ selector: 'router-outlet' },] },
      ];
      /** @nocollapse */
      RouterOutlet.ctorParameters = function () { return [
          { type: RouterOutletMap, },
          { type: _angular_core.ViewContainerRef, },
          { type: _angular_core.ComponentFactoryResolver, },
          { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['name',] },] },
      ]; };
      RouterOutlet.propDecorators = {
          'activateEvents': [{ type: _angular_core.Output, args: ['activate',] },],
          'deactivateEvents': [{ type: _angular_core.Output, args: ['deactivate',] },],
      };
      return RouterOutlet;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   *  *
   * @abstract
   */
  var RouteReuseStrategy = (function () {
      function RouteReuseStrategy() {
      }
      /**
       *  Determines if this route (and its subtree) should be detached to be reused later
       * @abstract
       * @param {?} route
       * @return {?}
       */
      RouteReuseStrategy.prototype.shouldDetach = function (route) { };
      /**
       *  Stores the detached route
       * @abstract
       * @param {?} route
       * @param {?} handle
       * @return {?}
       */
      RouteReuseStrategy.prototype.store = function (route, handle) { };
      /**
       *  Determines if this route (and its subtree) should be reattached
       * @abstract
       * @param {?} route
       * @return {?}
       */
      RouteReuseStrategy.prototype.shouldAttach = function (route) { };
      /**
       *  Retrieves the previously stored route
       * @abstract
       * @param {?} route
       * @return {?}
       */
      RouteReuseStrategy.prototype.retrieve = function (route) { };
      /**
       *  Determines if a route should be reused
       * @abstract
       * @param {?} future
       * @param {?} curr
       * @return {?}
       */
      RouteReuseStrategy.prototype.shouldReuseRoute = function (future, curr) { };
      return RouteReuseStrategy;
  }());

  var /** @type {?} */ getDOM = _angular_platformBrowser.__platform_browser_private__.getDOM;

  /**
   *  *
   * @abstract
   */
  var PreloadingStrategy = (function () {
      function PreloadingStrategy() {
      }
      /**
       * @abstract
       * @param {?} route
       * @param {?} fn
       * @return {?}
       */
      PreloadingStrategy.prototype.preload = function (route, fn) { };
      return PreloadingStrategy;
  }());
  /**
   *  *
    * *
    * ```
    * RouteModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
    * ```
    * *
   */
  var PreloadAllModules = (function () {
      function PreloadAllModules() {
      }
      /**
       * @param {?} route
       * @param {?} fn
       * @return {?}
       */
      PreloadAllModules.prototype.preload = function (route, fn) {
          return rxjs_operator_catch._catch.call(fn(), function () { return rxjs_observable_of.of(null); });
      };
      return PreloadAllModules;
  }());
  /**
   *  *
    * *
    * This strategy is enabled by default.
    * *
   */
  var NoPreloading = (function () {
      function NoPreloading() {
      }
      /**
       * @param {?} route
       * @param {?} fn
       * @return {?}
       */
      NoPreloading.prototype.preload = function (route, fn) { return rxjs_observable_of.of(null); };
      return NoPreloading;
  }());
  /**
   *  The preloader optimistically loads all router configurations to
    * make navigations into lazily-loaded sections of the application faster.
    * *
    * The preloader runs in the background. When the router bootstraps, the preloader
    * starts listening to all navigation events. After every such event, the preloader
    * will check if any configurations can be loaded lazily.
    * *
    * If a route is protected by `canLoad` guards, the preloaded will not load it.
    * *
   */
  var RouterPreloader = (function () {
      /**
       * @param {?} router
       * @param {?} moduleLoader
       * @param {?} compiler
       * @param {?} injector
       * @param {?} preloadingStrategy
       */
      function RouterPreloader(router, moduleLoader, compiler, injector, preloadingStrategy) {
          this.router = router;
          this.injector = injector;
          this.preloadingStrategy = preloadingStrategy;
          this.loader = new RouterConfigLoader(moduleLoader, compiler);
      }
      ;
      /**
       * @return {?}
       */
      RouterPreloader.prototype.setUpPreloading = function () {
          var _this = this;
          var /** @type {?} */ navigations = rxjs_operator_filter.filter.call(this.router.events, function (e) { return e instanceof NavigationEnd; });
          this.subscription = rxjs_operator_concatMap.concatMap.call(navigations, function () { return _this.preload(); }).subscribe(function (v) { });
      };
      /**
       * @return {?}
       */
      RouterPreloader.prototype.preload = function () { return this.processRoutes(this.injector, this.router.config); };
      /**
       * @return {?}
       */
      RouterPreloader.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
      /**
       * @param {?} injector
       * @param {?} routes
       * @return {?}
       */
      RouterPreloader.prototype.processRoutes = function (injector, routes) {
          var /** @type {?} */ res = [];
          for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
              var c = routes_1[_i];
              // we already have the config loaded, just recurce
              if (c.loadChildren && !c.canLoad && ((c))._loadedConfig) {
                  var /** @type {?} */ childConfig = ((c))._loadedConfig;
                  res.push(this.processRoutes(childConfig.injector, childConfig.routes));
              }
              else if (c.loadChildren && !c.canLoad) {
                  res.push(this.preloadConfig(injector, c));
              }
              else if (c.children) {
                  res.push(this.processRoutes(injector, c.children));
              }
          }
          return rxjs_operator_mergeAll.mergeAll.call(rxjs_observable_from.from(res));
      };
      /**
       * @param {?} injector
       * @param {?} route
       * @return {?}
       */
      RouterPreloader.prototype.preloadConfig = function (injector, route) {
          var _this = this;
          return this.preloadingStrategy.preload(route, function () {
              var /** @type {?} */ loaded = _this.loader.load(injector, route.loadChildren);
              return rxjs_operator_mergeMap.mergeMap.call(loaded, function (config) {
                  var /** @type {?} */ c = route;
                  c._loadedConfig = config;
                  return _this.processRoutes(config.injector, config.routes);
              });
          });
      };
      RouterPreloader.decorators = [
          { type: _angular_core.Injectable },
      ];
      /** @nocollapse */
      RouterPreloader.ctorParameters = function () { return [
          { type: Router, },
          { type: _angular_core.NgModuleFactoryLoader, },
          { type: _angular_core.Compiler, },
          { type: _angular_core.Injector, },
          { type: PreloadingStrategy, },
      ]; };
      return RouterPreloader;
  }());

  /**
   * @whatItDoes Contains a list of directives
   * @stable
   */
  var /** @type {?} */ ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive];
  /**
   * @whatItDoes Is used in DI to configure the router.
   * @stable
   */
  var /** @type {?} */ ROUTER_CONFIGURATION = new _angular_core.OpaqueToken('ROUTER_CONFIGURATION');
  /**
   * @docsNotRequired
   */
  var /** @type {?} */ ROUTER_FORROOT_GUARD = new _angular_core.OpaqueToken('ROUTER_FORROOT_GUARD');
  var /** @type {?} */ ROUTER_PROVIDERS = [
      _angular_common.Location,
      { provide: UrlSerializer, useClass: DefaultUrlSerializer },
      {
          provide: Router,
          useFactory: setupRouter,
          deps: [
              _angular_core.ApplicationRef, UrlSerializer, RouterOutletMap, _angular_common.Location, _angular_core.Injector, _angular_core.NgModuleFactoryLoader,
              _angular_core.Compiler, ROUTES, ROUTER_CONFIGURATION, [UrlHandlingStrategy, new _angular_core.Optional()],
              [RouteReuseStrategy, new _angular_core.Optional()]
          ]
      },
      RouterOutletMap,
      { provide: ActivatedRoute, useFactory: rootRoute, deps: [Router] },
      { provide: _angular_core.NgModuleFactoryLoader, useClass: _angular_core.SystemJsNgModuleLoader },
      RouterPreloader,
      NoPreloading,
      PreloadAllModules,
      { provide: ROUTER_CONFIGURATION, useValue: { enableTracing: false } },
  ];
  /**
   * @return {?}
   */
  function routerNgProbeToken() {
      return new _angular_core.NgProbeToken('Router', Router);
  }
  /**
   *  *
    * *
    * RouterModule can be imported multiple times: once per lazily-loaded bundle.
    * Since the router deals with a global shared resource--location, we cannot have
    * more than one router service active.
    * *
    * That is why there are two ways to create the module: `RouterModule.forRoot` and
    * `RouterModule.forChild`.
    * *
    * * `forRoot` creates a module that contains all the directives, the given routes, and the router
    * service itself.
    * * `forChild` creates a module that contains all the directives and the given routes, but does not
    * include the router service.
    * *
    * When registered at the root, the module should be used as follows
    * *
    * ```
    * imports: [RouterModule.forRoot(ROUTES)]
    * })
    * class MyNgModule {}
    * ```
    * *
    * For submodules and lazy loaded submodules the module should be used as follows:
    * *
    * ```
    * imports: [RouterModule.forChild(ROUTES)]
    * })
    * class MyNgModule {}
    * ```
    * *
    * *
    * Managing state transitions is one of the hardest parts of building applications. This is
    * especially true on the web, where you also need to ensure that the state is reflected in the URL.
    * In addition, we often want to split applications into multiple bundles and load them on demand.
    * Doing this transparently is not trivial.
    * *
    * The Angular 2 router solves these problems. Using the router, you can declaratively specify
    * application states, manage state transitions while taking care of the URL, and load bundles on
    * demand.
    * *
    * [Read this developer guide](https://angular.io/docs/ts/latest/guide/router.html) to get an
    * overview of how the router should be used.
    * *
   */
  var RouterModule = (function () {
      /**
       * @param {?} guard
       */
      function RouterModule(guard) {
      }
      /**
       *  Creates a module with all the router providers and directives. It also optionally sets up an
        * application listener to perform an initial navigation.
        * *
        * Options:
        * * `enableTracing` makes the router log all its internal events to the console.
        * * `useHash` enables the location strategy that uses the URL fragment instead of the history
        * API.
        * * `initialNavigation` disables the initial navigation.
        * * `errorHandler` provides a custom error handler.
       * @param {?} routes
       * @param {?=} config
       * @return {?}
       */
      RouterModule.forRoot = function (routes, config) {
          return {
              ngModule: RouterModule,
              providers: [
                  ROUTER_PROVIDERS,
                  provideRoutes(routes),
                  {
                      provide: ROUTER_FORROOT_GUARD,
                      useFactory: provideForRootGuard,
                      deps: [[Router, new _angular_core.Optional(), new _angular_core.SkipSelf()]]
                  },
                  { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
                  {
                      provide: _angular_common.LocationStrategy,
                      useFactory: provideLocationStrategy,
                      deps: [
                          _angular_common.PlatformLocation, [new _angular_core.Inject(_angular_common.APP_BASE_HREF), new _angular_core.Optional()], ROUTER_CONFIGURATION
                      ]
                  },
                  {
                      provide: PreloadingStrategy,
                      useExisting: config && config.preloadingStrategy ? config.preloadingStrategy :
                          NoPreloading
                  },
                  { provide: _angular_core.NgProbeToken, multi: true, useFactory: routerNgProbeToken },
                  provideRouterInitializer(),
              ],
          };
      };
      /**
       *  Creates a module with all the router directives and a provider registering routes.
       * @param {?} routes
       * @return {?}
       */
      RouterModule.forChild = function (routes) {
          return { ngModule: RouterModule, providers: [provideRoutes(routes)] };
      };
      RouterModule.decorators = [
          { type: _angular_core.NgModule, args: [{ declarations: ROUTER_DIRECTIVES, exports: ROUTER_DIRECTIVES },] },
      ];
      /** @nocollapse */
      RouterModule.ctorParameters = function () { return [
          { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [ROUTER_FORROOT_GUARD,] },] },
      ]; };
      return RouterModule;
  }());
  /**
   * @param {?} platformLocationStrategy
   * @param {?} baseHref
   * @param {?=} options
   * @return {?}
   */
  function provideLocationStrategy(platformLocationStrategy, baseHref, options) {
      if (options === void 0) { options = {}; }
      return options.useHash ? new _angular_common.HashLocationStrategy(platformLocationStrategy, baseHref) :
          new _angular_common.PathLocationStrategy(platformLocationStrategy, baseHref);
  }
  /**
   * @param {?} router
   * @return {?}
   */
  function provideForRootGuard(router) {
      if (router) {
          throw new Error("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
      }
      return 'guarded';
  }
  /**
   *  *
    * *
    * ```
    * imports: [RouterModule.forChild(ROUTES)],
    * providers: [provideRoutes(EXTRA_ROUTES)]
    * })
    * class MyNgModule {}
    * ```
    * *
   * @param {?} routes
   * @return {?}
   */
  function provideRoutes(routes) {
      return [
          { provide: _angular_core.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
          { provide: ROUTES, multi: true, useValue: routes },
      ];
  }
  /**
   * @param {?} ref
   * @param {?} urlSerializer
   * @param {?} outletMap
   * @param {?} location
   * @param {?} injector
   * @param {?} loader
   * @param {?} compiler
   * @param {?} config
   * @param {?=} opts
   * @param {?=} urlHandlingStrategy
   * @param {?=} routeReuseStrategy
   * @return {?}
   */
  function setupRouter(ref, urlSerializer, outletMap, location, injector, loader, compiler, config, opts, urlHandlingStrategy, routeReuseStrategy) {
      if (opts === void 0) { opts = {}; }
      var /** @type {?} */ router = new Router(null, urlSerializer, outletMap, location, injector, loader, compiler, flatten(config));
      if (urlHandlingStrategy) {
          router.urlHandlingStrategy = urlHandlingStrategy;
      }
      if (routeReuseStrategy) {
          router.routeReuseStrategy = routeReuseStrategy;
      }
      if (opts.errorHandler) {
          router.errorHandler = opts.errorHandler;
      }
      if (opts.enableTracing) {
          var /** @type {?} */ dom_1 = getDOM();
          router.events.subscribe(function (e) {
              dom_1.logGroup("Router Event: " + ((e.constructor)).name);
              dom_1.log(e.toString());
              dom_1.log(e);
              dom_1.logGroupEnd();
          });
      }
      return router;
  }
  /**
   * @param {?} router
   * @return {?}
   */
  function rootRoute(router) {
      return router.routerState.root;
  }
  /**
   * @param {?} router
   * @param {?} ref
   * @param {?} preloader
   * @param {?} opts
   * @return {?}
   */
  function initialRouterNavigation(router, ref, preloader, opts) {
      return function (bootstrappedComponentRef) {
          if (bootstrappedComponentRef !== ref.components[0]) {
              return;
          }
          router.resetRootComponentType(ref.componentTypes[0]);
          preloader.setUpPreloading();
          if (opts.initialNavigation === false) {
              router.setUpLocationChangeListener();
          }
          else {
              router.initialNavigation();
          }
      };
  }
  /**
   * A token for the router initializer that will be called after the app is bootstrapped.
   *
   * @experimental
   */
  var /** @type {?} */ ROUTER_INITIALIZER = new _angular_core.OpaqueToken('Router Initializer');
  /**
   * @return {?}
   */
  function provideRouterInitializer() {
      return [
          {
              provide: ROUTER_INITIALIZER,
              useFactory: initialRouterNavigation,
              deps: [Router, _angular_core.ApplicationRef, RouterPreloader, ROUTER_CONFIGURATION]
          },
          { provide: _angular_core.APP_BOOTSTRAP_LISTENER, multi: true, useExisting: ROUTER_INITIALIZER },
      ];
  }

  /**
   * @stable
   */
  var /** @type {?} */ VERSION = new _angular_core.Version('3.4.0');

  var /** @type {?} */ __router_private__ = {
      ROUTER_PROVIDERS: ROUTER_PROVIDERS,
      ROUTES: ROUTES,
      flatten: flatten,
  };

  exports.RouterLink = RouterLink;
  exports.RouterLinkWithHref = RouterLinkWithHref;
  exports.RouterLinkActive = RouterLinkActive;
  exports.RouterOutlet = RouterOutlet;
  exports.RouteReuseStrategy = RouteReuseStrategy;
  exports.NavigationCancel = NavigationCancel;
  exports.NavigationEnd = NavigationEnd;
  exports.NavigationError = NavigationError;
  exports.NavigationStart = NavigationStart;
  exports.Router = Router;
  exports.RoutesRecognized = RoutesRecognized;
  exports.ROUTER_CONFIGURATION = ROUTER_CONFIGURATION;
  exports.ROUTER_INITIALIZER = ROUTER_INITIALIZER;
  exports.RouterModule = RouterModule;
  exports.provideRoutes = provideRoutes;
  exports.RouterOutletMap = RouterOutletMap;
  exports.NoPreloading = NoPreloading;
  exports.PreloadAllModules = PreloadAllModules;
  exports.PreloadingStrategy = PreloadingStrategy;
  exports.RouterPreloader = RouterPreloader;
  exports.ActivatedRoute = ActivatedRoute;
  exports.ActivatedRouteSnapshot = ActivatedRouteSnapshot;
  exports.RouterState = RouterState;
  exports.RouterStateSnapshot = RouterStateSnapshot;
  exports.PRIMARY_OUTLET = PRIMARY_OUTLET;
  exports.UrlHandlingStrategy = UrlHandlingStrategy;
  exports.DefaultUrlSerializer = DefaultUrlSerializer;
  exports.UrlSegment = UrlSegment;
  exports.UrlSegmentGroup = UrlSegmentGroup;
  exports.UrlSerializer = UrlSerializer;
  exports.UrlTree = UrlTree;
  exports.VERSION = VERSION;
  exports.__router_private__ = __router_private__;

}));