import { Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';

class PositionResolver {
    /**
     * @param {?} options
     * @return {?}
     */
    create(options) {
        const /** @type {?} */ isWindow = this.isElementWindow(options.windowElement);
        const /** @type {?} */ resolver = {
            axis: options.axis,
            container: this.defineContainer(options.windowElement, isWindow),
            isWindow,
        };
        return resolver;
    }
    /**
     * @param {?} windowElement
     * @param {?} isContainerWindow
     * @return {?}
     */
    defineContainer(windowElement, isContainerWindow) {
        const /** @type {?} */ container = (isContainerWindow || !windowElement.nativeElement)
            ? windowElement
            : windowElement.nativeElement;
        return container;
    }
    /**
     * @param {?} windowElement
     * @return {?}
     */
    isElementWindow(windowElement) {
        const /** @type {?} */ isWindow = Object.prototype.toString.call(windowElement).includes('Window');
        return isWindow;
    }
    /**
     * @param {?} isContainerWindow
     * @param {?} windowElement
     * @return {?}
     */
    getDocumentElement(isContainerWindow, windowElement) {
        return isContainerWindow
            ? windowElement.document.documentElement
            : null;
    }
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    calculatePoints(element, resolver) {
        return resolver.isWindow
            ? this.calculatePointsForWindow(element, resolver)
            : this.calculatePointsForElement(element, resolver);
    }
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    calculatePointsForWindow(element, resolver) {
        const { axis, container, isWindow } = resolver;
        const /** @type {?} */ offsetHeightKey = axis.offsetHeightKey();
        const /** @type {?} */ clientHeightKey = axis.clientHeightKey();
        const /** @type {?} */ topKey = axis.topKey();
        // container's height
        const /** @type {?} */ height = this.height(container, isWindow, offsetHeightKey, clientHeightKey);
        // scrolled until now / current y point
        const /** @type {?} */ scrolledUntilNow = height + this.pageYOffset(this.getDocumentElement(isWindow, container), axis, isWindow);
        // total height / most bottom y point
        const /** @type {?} */ nativeElementHeight = this.height(element.nativeElement, isWindow, offsetHeightKey, clientHeightKey);
        const /** @type {?} */ totalToScroll = this.offsetTop(element.nativeElement, axis, isWindow) + nativeElementHeight;
        return { height, scrolledUntilNow, totalToScroll };
    }
    /**
     * @param {?} element
     * @param {?} resolver
     * @return {?}
     */
    calculatePointsForElement(element, resolver) {
        const { axis, container, isWindow } = resolver;
        const /** @type {?} */ offsetHeightKey = axis.offsetHeightKey();
        const /** @type {?} */ clientHeightKey = axis.clientHeightKey();
        const /** @type {?} */ scrollTop = axis.scrollTopKey();
        const /** @type {?} */ scrollHeight = axis.scrollHeightKey();
        const /** @type {?} */ topKey = axis.topKey();
        const /** @type {?} */ height = this.height(container, isWindow, offsetHeightKey, clientHeightKey);
        // perhaps use this.container.offsetTop instead of 'scrollTop'
        const /** @type {?} */ scrolledUntilNow = container[scrollTop];
        let /** @type {?} */ containerTopOffset = 0;
        const /** @type {?} */ offsetTop = this.offsetTop(container, axis, isWindow);
        if (offsetTop !== void 0) {
            containerTopOffset = offsetTop;
        }
        const /** @type {?} */ totalToScroll = container[scrollHeight];
        return { height, scrolledUntilNow, totalToScroll };
    }
    /**
     * @param {?} elem
     * @param {?} isWindow
     * @param {?} offsetHeightKey
     * @param {?} clientHeightKey
     * @return {?}
     */
    height(elem, isWindow, offsetHeightKey, clientHeightKey) {
        if (isNaN(elem[offsetHeightKey])) {
            return this.getDocumentElement(isWindow, elem)[clientHeightKey];
        }
        else {
            return elem[offsetHeightKey];
        }
    }
    /**
     * @param {?} elem
     * @param {?} axis
     * @param {?} isWindow
     * @return {?}
     */
    offsetTop(elem, axis, isWindow) {
        const /** @type {?} */ topKey = axis.topKey();
        // elem = elem.nativeElement;
        if (!elem.getBoundingClientRect) {
            return;
        }
        return elem.getBoundingClientRect()[topKey] + this.pageYOffset(elem, axis, isWindow);
    }
    /**
     * @param {?} elem
     * @param {?} axis
     * @param {?} isWindow
     * @return {?}
     */
    pageYOffset(elem, axis, isWindow) {
        const /** @type {?} */ pageYOffset = axis.pageYOffsetKey();
        const /** @type {?} */ scrollTop = axis.scrollTopKey();
        const /** @type {?} */ offsetTop = axis.offsetTopKey();
        if (isNaN(window[pageYOffset])) {
            return this.getDocumentElement(isWindow, elem)[scrollTop];
        }
        else if (elem.ownerDocument) {
            return elem.ownerDocument.defaultView[pageYOffset];
        }
        else {
            return elem[offsetTop];
        }
    }
}
PositionResolver.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
PositionResolver.ctorParameters = () => [];

class ScrollRegister {
    /**
     * @param {?} options
     * @return {?}
     */
    attachEvent(options) {
        const /** @type {?} */ scroller$ = Observable.fromEvent(options.container, 'scroll')
            .sampleTime(options.throttleDuration)
            .filter(options.filterBefore)
            .mergeMap((ev) => Observable.of(options.mergeMap(ev)))
            .subscribe(options.scrollHandler);
        return scroller$;
    }
}
ScrollRegister.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ScrollRegister.ctorParameters = () => [];

class ScrollResolver {
    constructor() {
        this.lastScrollPosition = 0;
    }
    /**
     * @param {?} container
     * @param {?} config
     * @param {?} scrollingDown
     * @return {?}
     */
    shouldScroll(container, config, scrollingDown) {
        const /** @type {?} */ distance = config.distance;
        let /** @type {?} */ remaining;
        let /** @type {?} */ containerBreakpoint;
        if (scrollingDown) {
            remaining = container.totalToScroll - container.scrolledUntilNow;
            containerBreakpoint = container.height * distance.down + 1;
        }
        else {
            remaining = container.scrolledUntilNow;
            containerBreakpoint = container.height * distance.up + 1;
        }
        const /** @type {?} */ shouldScroll = remaining <= containerBreakpoint;
        this.lastScrollPosition = container.scrolledUntilNow;
        return shouldScroll;
    }
    /**
     * @param {?} container
     * @return {?}
     */
    isScrollingDown(container) {
        return this.lastScrollPosition < container.scrolledUntilNow;
    }
    /**
     * @param {?} container
     * @param {?} config
     * @return {?}
     */
    getScrollStats(container, config) {
        const /** @type {?} */ isScrollingDown = this.isScrollingDown(container);
        const /** @type {?} */ shouldScroll = this.shouldScroll(container, config, isScrollingDown);
        return { isScrollingDown, shouldScroll };
    }
}
ScrollResolver.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ScrollResolver.ctorParameters = () => [];

class AxisResolver {
    /**
     * @param {?=} vertical
     */
    constructor(vertical = true) {
        this.vertical = vertical;
    }
    /**
     * @return {?}
     */
    clientHeightKey() { return this.vertical ? 'clientHeight' : 'clientWidth'; }
    /**
     * @return {?}
     */
    offsetHeightKey() { return this.vertical ? 'offsetHeight' : 'offsetWidth'; }
    /**
     * @return {?}
     */
    scrollHeightKey() { return this.vertical ? 'scrollHeight' : 'scrollWidth'; }
    /**
     * @return {?}
     */
    pageYOffsetKey() { return this.vertical ? 'pageYOffset' : 'pageXOffset'; }
    /**
     * @return {?}
     */
    offsetTopKey() { return this.vertical ? 'offsetTop' : 'offsetLeft'; }
    /**
     * @return {?}
     */
    scrollTopKey() { return this.vertical ? 'scrollTop' : 'scrollLeft'; }
    /**
     * @return {?}
     */
    topKey() { return this.vertical ? 'top' : 'left'; }
}

class InfiniteScrollDirective {
    /**
     * @param {?} element
     * @param {?} zone
     * @param {?} positionResolver
     * @param {?} scrollRegister
     * @param {?} scrollerResolver
     */
    constructor(element, zone, positionResolver, scrollRegister, scrollerResolver) {
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
    ngOnInit() {
        if (typeof window !== 'undefined') {
            this.zone.runOutsideAngular(() => {
                const /** @type {?} */ containerElement = this.resolveContainerElement();
                const /** @type {?} */ resolver = this.positionResolver.create({
                    axis: new AxisResolver(!this.horizontal),
                    windowElement: containerElement,
                });
                const /** @type {?} */ options = {
                    container: resolver.container,
                    filterBefore: () => !this.infiniteScrollDisabled,
                    mergeMap: () => this.positionResolver.calculatePoints(this.element, resolver),
                    scrollHandler: (container) => this.handleOnScroll(container),
                    throttleDuration: this.infiniteScrollThrottle
                };
                this.disposeScroller = this.scrollRegister.attachEvent(options);
            });
        }
    }
    /**
     * @param {?} container
     * @return {?}
     */
    handleOnScroll(container) {
        const /** @type {?} */ distance = {
            down: this.infiniteScrollDistance,
            up: this.infiniteScrollUpDistance
        };
        const /** @type {?} */ scrollStats = this.scrollerResolver.getScrollStats(container, { distance });
        if (this.shouldTriggerEvents(scrollStats.shouldScroll)) {
            const /** @type {?} */ infiniteScrollEvent = {
                currentScrollPosition: container.scrolledUntilNow
            };
            if (scrollStats.isScrollingDown) {
                this.onScrollDown(infiniteScrollEvent);
            }
            else {
                this.onScrollUp(infiniteScrollEvent);
            }
        }
    }
    /**
     * @param {?} shouldScroll
     * @return {?}
     */
    shouldTriggerEvents(shouldScroll) {
        return (this.alwaysCallback || shouldScroll) && !this.infiniteScrollDisabled;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.disposeScroller) {
            this.disposeScroller.unsubscribe();
        }
    }
    /**
     * @param {?=} data
     * @return {?}
     */
    onScrollDown(data = { currentScrollPosition: 0 }) {
        this.zone.run(() => this.scrolled.emit(data));
    }
    /**
     * @param {?=} data
     * @return {?}
     */
    onScrollUp(data = { currentScrollPosition: 0 }) {
        this.zone.run(() => this.scrolledUp.emit(data));
    }
    /**
     * @return {?}
     */
    resolveContainerElement() {
        const /** @type {?} */ selector = this.infiniteScrollContainer;
        const /** @type {?} */ hasWindow = window && window.hasOwnProperty('document');
        const /** @type {?} */ containerIsString = selector && hasWindow && typeof (this.infiniteScrollContainer) === 'string';
        let /** @type {?} */ container = containerIsString
            ? window.document.querySelector(selector)
            : selector;
        if (!selector) {
            container = this.scrollWindow ? window : this.element;
        }
        return container;
    }
}
InfiniteScrollDirective.decorators = [
    { type: Directive, args: [{
                selector: '[infiniteScroll], [infinite-scroll], [data-infinite-scroll]'
            },] },
];
/**
 * @nocollapse
 */
InfiniteScrollDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: NgZone, },
    { type: PositionResolver, },
    { type: ScrollRegister, },
    { type: ScrollResolver, },
];
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

class InfiniteScrollModule {
}
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
InfiniteScrollModule.ctorParameters = () => [];

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
//# sourceMappingURL=ngx-infinite-scroll.js.map
