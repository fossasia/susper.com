/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, NgModule, NgZone } from '@angular/core';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { Subject } from 'rxjs/Subject';
import { RxChain, map, startWith, takeUntil } from '@angular/cdk/rxjs';
import { coerceArray } from '@angular/cdk/coercion';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';

/**
 * Global registry for all dynamically-created, injected style tags.
 */
const styleElementForWebkitCompatibility = new Map();
/**
 * A utility for calling matchMedia queries.
 */
class MediaMatcher {
    /**
     * @param {?} platform
     */
    constructor(platform) {
        this.platform = platform;
        this._matchMedia = this.platform.isBrowser ?
            // matchMedia is bound to the window scope intentionally as it is an illegal invocation to
            // call it from a different scope.
            window.matchMedia.bind(window) :
            noopMatchMedia;
    }
    /**
     * Confirms the layout engine will trigger for the selector query provided and returns the
     * MediaQueryList for the query provided.
     * @param {?} query
     * @return {?}
     */
    matchMedia(query) {
        if (this.platform.WEBKIT) {
            createEmptyStyleRule(query);
        }
        return this._matchMedia(query);
    }
}
MediaMatcher.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MediaMatcher.ctorParameters = () => [
    { type: Platform, },
];
/**
 * For Webkit engines that only trigger the MediaQueryListListener when there is at least one CSS
 * selector for the respective media query.
 * @param {?} query
 * @return {?}
 */
function createEmptyStyleRule(query) {
    if (!styleElementForWebkitCompatibility.has(query)) {
        try {
            const /** @type {?} */ style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            if (!style.sheet) {
                const /** @type {?} */ cssText = `@media ${query} {.fx-query-test{ }}`;
                style.appendChild(document.createTextNode(cssText));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
            // Store in private global registry
            styleElementForWebkitCompatibility.set(query, style);
        }
        catch (e) {
            console.error(e);
        }
    }
}
/**
 * No-op matchMedia replacement for non-browser platforms.
 * @param {?} query
 * @return {?}
 */
function noopMatchMedia(query) {
    return {
        matches: query === 'all' || query === '',
        media: query,
        addListener: () => { },
        removeListener: () => { }
    };
}

/**
 * Utility for checking the matching state of \@media queries.
 */
class BreakpointObserver {
    /**
     * @param {?} mediaMatcher
     * @param {?} zone
     */
    constructor(mediaMatcher, zone) {
        this.mediaMatcher = mediaMatcher;
        this.zone = zone;
        /**
         * A map of all media queries currently being listened for.
         */
        this._queries = new Map();
        /**
         * A subject for all other observables to takeUntil based on.
         */
        this._destroySubject = new Subject();
    }
    /**
     * Completes the active subject, signalling to all other observables to complete.
     * @return {?}
     */
    ngOnDestroy() {
        this._destroySubject.next();
        this._destroySubject.complete();
    }
    /**
     * Whether the query currently is matched.
     * @param {?} value
     * @return {?}
     */
    isMatched(value) {
        let /** @type {?} */ queries = coerceArray(value);
        return queries.some(mediaQuery => this._registerQuery(mediaQuery).mql.matches);
    }
    /**
     * Gets an observable of results for the given queries that will emit new results for any changes
     * in matching of the given queries.
     * @param {?} value
     * @return {?}
     */
    observe(value) {
        let /** @type {?} */ queries = coerceArray(value);
        let /** @type {?} */ observables = queries.map(query => this._registerQuery(query).observable);
        return combineLatest(observables, (a, b) => {
            return {
                matches: !!((a && a.matches) || (b && b.matches)),
            };
        });
    }
    /**
     * Registers a specific query to be listened for.
     * @param {?} query
     * @return {?}
     */
    _registerQuery(query) {
        // Only set up a new MediaQueryList if it is not already being listened for.
        if (this._queries.has(query)) {
            return ((this._queries.get(query)));
        }
        let /** @type {?} */ mql = this.mediaMatcher.matchMedia(query);
        // Create callback for match changes and add it is as a listener.
        let /** @type {?} */ queryObservable = RxChain.from(fromEventPattern(
        // Listener callback methods are wrapped to be placed back in ngZone. Callbacks must be placed
        // back into the zone because matchMedia is only included in Zone.js by loading the
        // webapis-media-query.js file alongside the zone.js file.  Additionally, some browsers do not
        // have MediaQueryList inherit from EventTarget, which causes inconsistencies in how Zone.js
        // patches it.
        (listener) => {
            mql.addListener((e) => this.zone.run(() => listener(e)));
        }, (listener) => {
            mql.removeListener((e) => this.zone.run(() => listener(e)));
        }))
            .call(takeUntil, this._destroySubject)
            .call(startWith, mql)
            .call(map, (nextMql) => ({ matches: nextMql.matches }))
            .result();
        // Add the MediaQueryList to the set of queries.
        let /** @type {?} */ output = { observable: queryObservable, mql: mql };
        this._queries.set(query, output);
        return output;
    }
}
BreakpointObserver.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
BreakpointObserver.ctorParameters = () => [
    { type: MediaMatcher, },
    { type: NgZone, },
];

// PascalCase is being used as Breakpoints is used like an enum.
// tslint:disable-next-line:variable-name
const Breakpoints = {
    Handset: '(max-width: 599px) and (orientation: portrait), ' +
        '(max-width: 959px) and (orientation: landscape)',
    Tablet: '(min-width: 600px) and (max-width: 839px) and (orientation: portrait), ' +
        '(min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
    Web: '(min-width: 840px) and (orientation: portrait), ' +
        '(min-width: 1280px) and (orientation: landscape)',
    HandsetPortrait: '(max-width: 599px) and (orientation: portrait)',
    TabletPortrait: '(min-width: 600px) and (max-width: 839px) and (orientation: portrait)',
    WebPortrait: '(min-width: 840px) and (orientation: portrait)',
    HandsetLandscape: '(max-width: 959px) and (orientation: landscape)',
    TabletLandscape: '(min-width: 960px) and (max-width: 1279px) and (orientation: landscape)',
    WebLandscape: '(min-width: 1280px) and (orientation: landscape)',
};

class LayoutModule {
}
LayoutModule.decorators = [
    { type: NgModule, args: [{
                providers: [BreakpointObserver, MediaMatcher],
                imports: [PlatformModule],
            },] },
];
/**
 * @nocollapse
 */
LayoutModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { LayoutModule, BreakpointObserver, Breakpoints, MediaMatcher };
//# sourceMappingURL=layout.js.map
