import { Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
var PositionResolver = (function () {
    function PositionResolver() {
    }
    /**
     * @param {?} options
     * @return {?}
     */
    PositionResolver.prototype.create = function (options) {
        var /** @type {?} */ isWindow = this.isElementWindow(options.windowElement);
        var /** @type {?} */ resolver = {
            axis: options.axis,
            container: this.defineContainer(options.windowElement, isWindow),
            isWindow: isWindow,
        };
        return resolver;
    };
    /**
     * @param {?} windowElement
     * @param {?} isContainerWindow
     * @return {?}
     */
    PositionResolver.prototype.defineContainer = function (windowElement, isContainerWindow) {
        var /** @type {?} */ container = (isContainerWindow || !windowElement.nativeElement)
            ? windowElement
            : windowElement.nativeElement;
        return container;
    };
    /**
     * @param {?} windowElement
     * @return {?}
     */
    PositionResolver.prototype.isElementWindow = function (windowElement) {
        var /** @type {?} */ isWindow = Object.prototype.toString.call(windowElement).includes('Window');
        return isWindow;
    };
    /**
     * @param {?} isContainerWindow
     * @param {?} windowElement
     * @return {?}
     */
    PositionResolver.prototype.getDocumentElement = function (isContainerWindow, windowElement) {
        return isContainerWindow
            ? windowElement.document.documentElement
            : null;
    };
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    PositionResolver.prototype.calculatePoints = function (element, resolver) {
        return resolver.isWindow
            ? this.calculatePointsForWindow(element, resolver)
            : this.calculatePointsForElement(element, resolver);
    };
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    PositionResolver.prototype.calculatePointsForWindow = function (element, resolver) {
        var axis = resolver.axis, container = resolver.container, isWindow = resolver.isWindow;
        var /** @type {?} */ offsetHeightKey = axis.offsetHeightKey();
        var /** @type {?} */ clientHeightKey = axis.clientHeightKey();
        var /** @type {?} */ topKey = axis.topKey();
        // container's height
        var /** @type {?} */ height = this.height(container, isWindow, offsetHeightKey, clientHeightKey);
        // scrolled until now / current y point
        var /** @type {?} */ scrolledUntilNow = height + this.pageYOffset(this.getDocumentElement(isWindow, container), axis, isWindow);
        // total height / most bottom y point
        var /** @type {?} */ nativeElementHeight = this.height(element.nativeElement, isWindow, offsetHeightKey, clientHeightKey);
        var /** @type {?} */ totalToScroll = this.offsetTop(element.nativeElement, axis, isWindow) + nativeElementHeight;
        return { height: height, scrolledUntilNow: scrolledUntilNow, totalToScroll: totalToScroll };
    };
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    PositionResolver.prototype.calculatePointsForElement = function (element, resolver) {
        var axis = resolver.axis, container = resolver.container, isWindow = resolver.isWindow;
        var /** @type {?} */ offsetHeightKey = axis.offsetHeightKey();
        var /** @type {?} */ clientHeightKey = axis.clientHeightKey();
        var /** @type {?} */ scrollTop = axis.scrollTopKey();
        var /** @type {?} */ scrollHeight = axis.scrollHeightKey();
        var /** @type {?} */ topKey = axis.topKey();
        var /** @type {?} */ height = this.height(container, isWindow, offsetHeightKey, clientHeightKey);
        // perhaps use this.container.offsetTop instead of 'scrollTop'
        var /** @type {?} */ scrolledUntilNow = container[scrollTop];
        var /** @type {?} */ containerTopOffset = 0;
        var /** @type {?} */ offsetTop = this.offsetTop(container, axis, isWindow);
        if (offsetTop !== void 0) {
            containerTopOffset = offsetTop;
        }
        var /** @type {?} */ totalToScroll = container[scrollHeight];
        return { height: height, scrolledUntilNow: scrolledUntilNow, totalToScroll: totalToScroll };
    };
    /**
     * @param {?} elem
     * @param {?} isWindow
     * @param {?} offsetHeightKey
     * @param {?} clientHeightKey
     * @return {?}
     */
    PositionResolver.prototype.height = function (elem, isWindow, offsetHeightKey, clientHeightKey) {
        if (isNaN(elem[offsetHeightKey])) {
            return this.getDocumentElement(isWindow, elem)[clientHeightKey];
        }
        else {
            return elem[offsetHeightKey];
        }
    };
    /**
     * @param {?} elem
     * @param {?} axis
     * @param {?} isWindow
     * @return {?}
     */
    PositionResolver.prototype.offsetTop = function (elem, axis, isWindow) {
        var /** @type {?} */ topKey = axis.topKey();
        // elem = elem.nativeElement;
        if (!elem.getBoundingClientRect) {
            return;
        }
        return elem.getBoundingClientRect()[topKey] + this.pageYOffset(elem, axis, isWindow);
    };
    /**
     * @param {?} elem
     * @param {?} axis
     * @param {?} isWindow
     * @return {?}
     */
    PositionResolver.prototype.pageYOffset = function (elem, axis, isWindow) {
        var /** @type {?} */ pageYOffset = axis.pageYOffsetKey();
        var /** @type {?} */ scrollTop = axis.scrollTopKey();
        var /** @type {?} */ offsetTop = axis.offsetTopKey();
        if (isNaN(window[pageYOffset])) {
            return this.getDocumentElement(isWindow, elem)[scrollTop];
        }
        else if (elem.ownerDocument) {
            return elem.ownerDocument.defaultView[pageYOffset];
        }
        else {
            return elem[offsetTop];
        }
    };
    return PositionResolver;
}());
PositionResolver.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
PositionResolver.ctorParameters = function () { return []; };
var ScrollRegister = (function () {
    function ScrollRegister() {
    }
    /**
     * @param {?} options
     * @return {?}
     */
    ScrollRegister.prototype.attachEvent = function (options) {
        var /** @type {?} */ scroller$ = Observable.fromEvent(options.container, 'scroll')
            .sampleTime(options.throttleDuration)
            .filter(options.filterBefore)
            .mergeMap(function (ev) { return Observable.of(options.mergeMap(ev)); })
            .subscribe(options.scrollHandler);
        return scroller$;
    };
    return ScrollRegister;
}());
ScrollRegister.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ScrollRegister.ctorParameters = function () { return []; };
var ScrollResolver = (function () {
    function ScrollResolver() {
        this.lastScrollPosition = 0;
    }
    /**
     * @param {?} container
     * @param {?} config
     * @param {?} scrollingDown
     * @return {?}
     */
    ScrollResolver.prototype.shouldScroll = function (container, config, scrollingDown) {
        var /** @type {?} */ distance = config.distance;
        var /** @type {?} */ remaining;
        var /** @type {?} */ containerBreakpoint;
        if (scrollingDown) {
            remaining = container.totalToScroll - container.scrolledUntilNow;
            containerBreakpoint = container.height * distance.down + 1;
        }
        else {
            remaining = container.scrolledUntilNow;
            containerBreakpoint = container.height * distance.up + 1;
        }
        var /** @type {?} */ shouldScroll = remaining <= containerBreakpoint;
        this.lastScrollPosition = container.scrolledUntilNow;
        return shouldScroll;
    };
    /**
     * @param {?} container
     * @return {?}
     */
    ScrollResolver.prototype.isScrollingDown = function (container) {
        return this.lastScrollPosition < container.scrolledUntilNow;
    };
    /**
     * @param {?} container
     * @param {?} config
     * @return {?}
     */
    ScrollResolver.prototype.getScrollStats = function (container, config) {
        var /** @type {?} */ isScrollingDown = this.isScrollingDown(container);
        var /** @type {?} */ shouldScroll = this.shouldScroll(container, config, isScrollingDown);
        return { isScrollingDown: isScrollingDown, shouldScroll: shouldScroll };
    };
    return ScrollResolver;
}());
ScrollResolver.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ScrollResolver.ctorParameters = function () { return []; };
var AxisResolver = (function () {
    /**
     * @param {?=} vertical
     */
    function AxisResolver(vertical) {
        if (vertical === void 0) { vertical = true; }
        this.vertical = vertical;
    }
    /**
     * @return {?}
     */
    AxisResolver.prototype.clientHeightKey = function () { return this.vertical ? 'clientHeight' : 'clientWidth'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.offsetHeightKey = function () { return this.vertical ? 'offsetHeight' : 'offsetWidth'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.scrollHeightKey = function () { return this.vertical ? 'scrollHeight' : 'scrollWidth'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.pageYOffsetKey = function () { return this.vertical ? 'pageYOffset' : 'pageXOffset'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.offsetTopKey = function () { return this.vertical ? 'offsetTop' : 'offsetLeft'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.scrollTopKey = function () { return this.vertical ? 'scrollTop' : 'scrollLeft'; };
    /**
     * @return {?}
     */
    AxisResolver.prototype.topKey = function () { return this.vertical ? 'top' : 'left'; };
    return AxisResolver;
}());
var InfiniteScrollDirective = (function () {
    /**
     * @param {?} element
     * @param {?} zone
     * @param {?} positionResolver
     * @param {?} scrollRegister
     * @param {?} scrollerResolver
     */
    function InfiniteScrollDirective(element, zone, positionResolver, scrollRegister, scrollerResolver) {
        this.element = element;
        this.zone = zone;
        this.positionResolver = positionResolver;
        this.scrollRegister = scrollRegister;
        this.scrollerResolver = scrollerResolver;
        this.scrolled = new EventEmitter();
        this.scrolledUp = new EventEmitter();
        this.infiniteScrollDistance = 2;
        this.infiniteScrollUpDistance = 1.5;
        this.infiniteScrollThrottle = 300;
        this.infiniteScrollDisabled = false;
        this.infiniteScrollContainer = null;
        this.scrollWindow = true;
        this.immediateCheck = false;
        this.horizontal = false;
        this.alwaysCallback = false;
    }
    /**
     * @return {?}
     */
    InfiniteScrollDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (typeof window !== 'undefined') {
            this.zone.runOutsideAngular(function () {
                var /** @type {?} */ containerElement = _this.resolveContainerElement();
                var /** @type {?} */ resolver = _this.positionResolver.create({
                    axis: new AxisResolver(!_this.horizontal),
                    windowElement: containerElement,
                });
                var /** @type {?} */ options = {
                    container: resolver.container,
                    filterBefore: function () { return !_this.infiniteScrollDisabled; },
                    mergeMap: function () { return _this.positionResolver.calculatePoints(_this.element, resolver); },
                    scrollHandler: function (container) { return _this.handleOnScroll(container); },
                    throttleDuration: _this.infiniteScrollThrottle
                };
                _this.disposeScroller = _this.scrollRegister.attachEvent(options);
            });
        }
    };
    /**
     * @param {?} container
     * @return {?}
     */
    InfiniteScrollDirective.prototype.handleOnScroll = function (container) {
        var /** @type {?} */ distance = {
            down: this.infiniteScrollDistance,
            up: this.infiniteScrollUpDistance
        };
        var /** @type {?} */ scrollStats = this.scrollerResolver.getScrollStats(container, { distance: distance });
        if (this.shouldTriggerEvents(scrollStats.shouldScroll)) {
            var /** @type {?} */ infiniteScrollEvent = {
                currentScrollPosition: container.scrolledUntilNow
            };
            if (scrollStats.isScrollingDown) {
                this.onScrollDown(infiniteScrollEvent);
            }
            else {
                this.onScrollUp(infiniteScrollEvent);
            }
        }
    };
    /**
     * @param {?} shouldScroll
     * @return {?}
     */
    InfiniteScrollDirective.prototype.shouldTriggerEvents = function (shouldScroll) {
        return (this.alwaysCallback || shouldScroll) && !this.infiniteScrollDisabled;
    };
    /**
     * @return {?}
     */
    InfiniteScrollDirective.prototype.ngOnDestroy = function () {
        if (this.disposeScroller) {
            this.disposeScroller.unsubscribe();
        }
    };
    /**
     * @param {?=} data
     * @return {?}
     */
    InfiniteScrollDirective.prototype.onScrollDown = function (data) {
        var _this = this;
        if (data === void 0) { data = { currentScrollPosition: 0 }; }
        this.zone.run(function () { return _this.scrolled.emit(data); });
    };
    /**
     * @param {?=} data
     * @return {?}
     */
    InfiniteScrollDirective.prototype.onScrollUp = function (data) {
        var _this = this;
        if (data === void 0) { data = { currentScrollPosition: 0 }; }
        this.zone.run(function () { return _this.scrolledUp.emit(data); });
    };
    /**
     * @return {?}
     */
    InfiniteScrollDirective.prototype.resolveContainerElement = function () {
        var /** @type {?} */ selector = this.infiniteScrollContainer;
        var /** @type {?} */ hasWindow = window && window.hasOwnProperty('document');
        var /** @type {?} */ containerIsString = selector && hasWindow && typeof (this.infiniteScrollContainer) === 'string';
        var /** @type {?} */ container = containerIsString
            ? window.document.querySelector(selector)
            : selector;
        if (!selector) {
            container = this.scrollWindow ? window : this.element;
        }
        return container;
    };
    return InfiniteScrollDirective;
}());
InfiniteScrollDirective.decorators = [
    { type: Directive, args: [{
                selector: '[infiniteScroll], [infinite-scroll], [data-infinite-scroll]'
            },] },
];
/**
 * @nocollapse
 */
InfiniteScrollDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: NgZone, },
    { type: PositionResolver, },
    { type: ScrollRegister, },
    { type: ScrollResolver, },
]; };
InfiniteScrollDirective.propDecorators = {
    'scrolled': [{ type: Output },],
    'scrolledUp': [{ type: Output },],
    'infiniteScrollDistance': [{ type: Input },],
    'infiniteScrollUpDistance': [{ type: Input },],
    'infiniteScrollThrottle': [{ type: Input },],
    'infiniteScrollDisabled': [{ type: Input },],
    'infiniteScrollContainer': [{ type: Input },],
    'scrollWindow': [{ type: Input },],
    'immediateCheck': [{ type: Input },],
    'horizontal': [{ type: Input },],
    'alwaysCallback': [{ type: Input },],
};
var InfiniteScrollModule = (function () {
    function InfiniteScrollModule() {
    }
    return InfiniteScrollModule;
}());
InfiniteScrollModule.decorators = [
    { type: NgModule, args: [{
                declarations: [InfiniteScrollDirective],
                exports: [InfiniteScrollDirective],
                imports: [],
                providers: [
                    PositionResolver,
                    ScrollRegister,
                    ScrollResolver
                ]
            },] },
];
/**
 * @nocollapse
 */
InfiniteScrollModule.ctorParameters = function () { return []; };
/**
 * Angular library starter.
 * Build an Angular library compatible with AoT compilation & Tree shaking.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular-library-starter
 */
/**
 * Entry point for all public APIs of the package.
 */
/**
 * Generated bundle index. Do not edit.
 */
export { InfiniteScrollModule, InfiniteScrollDirective as ɵa, PositionResolver as ɵb, ScrollRegister as ɵc, ScrollResolver as ɵd };
//# sourceMappingURL=ngx-infinite-scroll.es5.js.map
