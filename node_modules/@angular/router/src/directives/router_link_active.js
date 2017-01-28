/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentChildren, Directive, ElementRef, Input, Renderer } from '@angular/core';
import { NavigationEnd, Router } from '../router';
import { RouterLink, RouterLinkWithHref } from './router_link';
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
export var RouterLinkActive = (function () {
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
        { type: Directive, args: [{
                    selector: '[routerLinkActive]',
                    exportAs: 'routerLinkActive',
                },] },
    ];
    /** @nocollapse */
    RouterLinkActive.ctorParameters = function () { return [
        { type: Router, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    RouterLinkActive.propDecorators = {
        'links': [{ type: ContentChildren, args: [RouterLink, { descendants: true },] },],
        'linksWithHrefs': [{ type: ContentChildren, args: [RouterLinkWithHref, { descendants: true },] },],
        'routerLinkActiveOptions': [{ type: Input },],
        'routerLinkActive': [{ type: Input },],
    };
    return RouterLinkActive;
}());
function RouterLinkActive_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterLinkActive.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RouterLinkActive.ctorParameters;
    /** @type {?} */
    RouterLinkActive.propDecorators;
    /** @type {?} */
    RouterLinkActive.prototype.links;
    /** @type {?} */
    RouterLinkActive.prototype.linksWithHrefs;
    /** @type {?} */
    RouterLinkActive.prototype.classes;
    /** @type {?} */
    RouterLinkActive.prototype.subscription;
    /** @type {?} */
    RouterLinkActive.prototype.routerLinkActiveOptions;
    /** @type {?} */
    RouterLinkActive.prototype.router;
    /** @type {?} */
    RouterLinkActive.prototype.element;
    /** @type {?} */
    RouterLinkActive.prototype.renderer;
}
//# sourceMappingURL=router_link_active.js.map