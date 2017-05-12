/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { LocationStrategy } from '@angular/common';
import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router } from '../router';
import { ActivatedRoute } from '../router_state';
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
export var RouterLink = (function () {
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
        { type: Directive, args: [{ selector: ':not(a)[routerLink]' },] },
    ];
    /** @nocollapse */
    RouterLink.ctorParameters = function () { return [
        { type: Router, },
        { type: ActivatedRoute, },
    ]; };
    RouterLink.propDecorators = {
        'queryParams': [{ type: Input },],
        'fragment': [{ type: Input },],
        'preserveQueryParams': [{ type: Input },],
        'preserveFragment': [{ type: Input },],
        'skipLocationChange': [{ type: Input },],
        'replaceUrl': [{ type: Input },],
        'routerLink': [{ type: Input },],
        'onClick': [{ type: HostListener, args: ['click', [],] },],
    };
    return RouterLink;
}());
function RouterLink_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterLink.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RouterLink.ctorParameters;
    /** @type {?} */
    RouterLink.propDecorators;
    /** @type {?} */
    RouterLink.prototype.queryParams;
    /** @type {?} */
    RouterLink.prototype.fragment;
    /** @type {?} */
    RouterLink.prototype.preserveQueryParams;
    /** @type {?} */
    RouterLink.prototype.preserveFragment;
    /** @type {?} */
    RouterLink.prototype.skipLocationChange;
    /** @type {?} */
    RouterLink.prototype.replaceUrl;
    /** @type {?} */
    RouterLink.prototype.commands;
    /** @type {?} */
    RouterLink.prototype.router;
    /** @type {?} */
    RouterLink.prototype.route;
}
/**
 *  *
  * See {@link RouterLink} for more information.
  * *
  * *
 */
export var RouterLinkWithHref = (function () {
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
        { type: Directive, args: [{ selector: 'a[routerLink]' },] },
    ];
    /** @nocollapse */
    RouterLinkWithHref.ctorParameters = function () { return [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: LocationStrategy, },
    ]; };
    RouterLinkWithHref.propDecorators = {
        'target': [{ type: Input },],
        'queryParams': [{ type: Input },],
        'fragment': [{ type: Input },],
        'preserveQueryParams': [{ type: Input },],
        'preserveFragment': [{ type: Input },],
        'skipLocationChange': [{ type: Input },],
        'replaceUrl': [{ type: Input },],
        'href': [{ type: HostBinding },],
        'routerLink': [{ type: Input },],
        'onClick': [{ type: HostListener, args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey'],] },],
    };
    return RouterLinkWithHref;
}());
function RouterLinkWithHref_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterLinkWithHref.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RouterLinkWithHref.ctorParameters;
    /** @type {?} */
    RouterLinkWithHref.propDecorators;
    /** @type {?} */
    RouterLinkWithHref.prototype.target;
    /** @type {?} */
    RouterLinkWithHref.prototype.queryParams;
    /** @type {?} */
    RouterLinkWithHref.prototype.fragment;
    /** @type {?} */
    RouterLinkWithHref.prototype.preserveQueryParams;
    /** @type {?} */
    RouterLinkWithHref.prototype.preserveFragment;
    /** @type {?} */
    RouterLinkWithHref.prototype.skipLocationChange;
    /** @type {?} */
    RouterLinkWithHref.prototype.replaceUrl;
    /** @type {?} */
    RouterLinkWithHref.prototype.commands;
    /** @type {?} */
    RouterLinkWithHref.prototype.subscription;
    /** @type {?} */
    RouterLinkWithHref.prototype.href;
    /** @type {?} */
    RouterLinkWithHref.prototype.router;
    /** @type {?} */
    RouterLinkWithHref.prototype.route;
    /** @type {?} */
    RouterLinkWithHref.prototype.locationStrategy;
}
/**
 * @param {?} s
 * @return {?}
 */
function attrBoolValue(s) {
    return s === '' || !!s;
}
//# sourceMappingURL=router_link.js.map