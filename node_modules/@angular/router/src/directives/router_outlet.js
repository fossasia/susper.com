/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, ComponentFactoryResolver, Directive, EventEmitter, Output, ReflectiveInjector, ViewContainerRef } from '@angular/core';
import { RouterOutletMap } from '../router_outlet_map';
import { PRIMARY_OUTLET } from '../shared';
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
export var RouterOutlet = (function () {
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
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
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
        var /** @type {?} */ inj = ReflectiveInjector.fromResolvedProviders(providers, injector);
        this.activated = this.location.createComponent(factory, this.location.length, inj, []);
        this.activated.changeDetectorRef.detectChanges();
        this.activateEvents.emit(this.activated.instance);
    };
    RouterOutlet.decorators = [
        { type: Directive, args: [{ selector: 'router-outlet' },] },
    ];
    /** @nocollapse */
    RouterOutlet.ctorParameters = function () { return [
        { type: RouterOutletMap, },
        { type: ViewContainerRef, },
        { type: ComponentFactoryResolver, },
        { type: undefined, decorators: [{ type: Attribute, args: ['name',] },] },
    ]; };
    RouterOutlet.propDecorators = {
        'activateEvents': [{ type: Output, args: ['activate',] },],
        'deactivateEvents': [{ type: Output, args: ['deactivate',] },],
    };
    return RouterOutlet;
}());
function RouterOutlet_tsickle_Closure_declarations() {
    /** @type {?} */
    RouterOutlet.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RouterOutlet.ctorParameters;
    /** @type {?} */
    RouterOutlet.propDecorators;
    /** @type {?} */
    RouterOutlet.prototype.activated;
    /** @type {?} */
    RouterOutlet.prototype._activatedRoute;
    /** @type {?} */
    RouterOutlet.prototype.outletMap;
    /** @type {?} */
    RouterOutlet.prototype.activateEvents;
    /** @type {?} */
    RouterOutlet.prototype.deactivateEvents;
    /** @type {?} */
    RouterOutlet.prototype.parentOutletMap;
    /** @type {?} */
    RouterOutlet.prototype.location;
    /** @type {?} */
    RouterOutlet.prototype.resolver;
    /** @type {?} */
    RouterOutlet.prototype.name;
}
//# sourceMappingURL=router_outlet.js.map