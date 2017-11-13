/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { Injectable, NgModule, NgZone, RendererFactory2 } from '@angular/core';
import { BrowserModule, ɵDomRendererFactory2 } from '@angular/platform-browser';
import { AnimationDriver, ɵAnimationEngine, ɵAnimationStyleNormalizer, ɵDomAnimationEngine, ɵNoopAnimationDriver, ɵNoopAnimationEngine, ɵWebAnimationsDriver, ɵWebAnimationsStyleNormalizer, ɵsupportsWebAnimations } from '@angular/animations/browser';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class AnimationRendererFactory {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     */
    constructor(delegate, _engine, _zone) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
    }
    /**
     * @param {?} hostElement
     * @param {?} type
     * @return {?}
     */
    createRenderer(hostElement, type) {
        let /** @type {?} */ delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation'])
            return delegate;
        const /** @type {?} */ namespaceId = type.id;
        const /** @type {?} */ animationTriggers = (type.data['animation']);
        animationTriggers.forEach(trigger => this._engine.registerTrigger(trigger, namespaceify(namespaceId, trigger.name)));
        return new AnimationRenderer(delegate, this._engine, this._zone, namespaceId);
    }
}
AnimationRendererFactory.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AnimationRendererFactory.ctorParameters = () => [
    { type: RendererFactory2, },
    { type: ɵAnimationEngine, },
    { type: NgZone, },
];
class AnimationRenderer {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     * @param {?} _namespaceId
     */
    constructor(delegate, _engine, _zone, _namespaceId) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
        this._namespaceId = _namespaceId;
        this.destroyNode = null;
        this._flushPromise = null;
        this.destroyNode = this.delegate.destroyNode ? (n) => delegate.destroyNode(n) : null;
    }
    /**
     * @return {?}
     */
    get data() { return this.delegate.data; }
    /**
     * @return {?}
     */
    destroy() { this.delegate.destroy(); }
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    createElement(name, namespace) {
        return this.delegate.createElement(name, namespace);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    createComment(value) { return this.delegate.createComment(value); }
    /**
     * @param {?} value
     * @return {?}
     */
    createText(value) { return this.delegate.createText(value); }
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    selectRootElement(selectorOrNode) {
        return this.delegate.selectRootElement(selectorOrNode);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    parentNode(node) { return this.delegate.parentNode(node); }
    /**
     * @param {?} node
     * @return {?}
     */
    nextSibling(node) { return this.delegate.nextSibling(node); }
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    setAttribute(el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    }
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    removeAttribute(el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    }
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    addClass(el, name) { this.delegate.addClass(el, name); }
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    removeClass(el, name) { this.delegate.removeClass(el, name); }
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    setStyle(el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    }
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    removeStyle(el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    }
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    setValue(node, value) { this.delegate.setValue(node, value); }
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    appendChild(parent, newChild) {
        this._engine.onInsert(newChild, () => this.delegate.appendChild(parent, newChild));
        this._queueFlush();
    }
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    insertBefore(parent, newChild, refChild) {
        this._engine.onInsert(newChild, () => this.delegate.insertBefore(parent, newChild, refChild));
        this._queueFlush();
    }
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    removeChild(parent, oldChild) {
        this._engine.onRemove(oldChild, () => {
            // Note: if an component element has a leave animation, and the component
            // a host leave animation, the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            if (this.delegate.parentNode(oldChild)) {
                this.delegate.removeChild(parent, oldChild);
            }
        });
        this._queueFlush();
    }
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    setProperty(el, name, value) {
        if (name.charAt(0) == '@') {
            this._engine.setProperty(el, namespaceify(this._namespaceId, name.substr(1)), value);
            this._queueFlush();
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    }
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    listen(target, eventName, callback) {
        if (eventName.charAt(0) == '@') {
            const /** @type {?} */ element = resolveElementFromTarget(target);
            const [name, phase] = parseTriggerCallbackName(eventName.substr(1));
            return this._engine.listen(element, namespaceify(this._namespaceId, name), phase, (event) => {
                const /** @type {?} */ e = (event);
                if (e.triggerName) {
                    e.triggerName = deNamespaceify(this._namespaceId, e.triggerName);
                }
                this._zone.run(() => callback(event));
            });
        }
        return this.delegate.listen(target, eventName, callback);
    }
    /**
     * @return {?}
     */
    _queueFlush() {
        if (!this._flushPromise) {
            this._zone.runOutsideAngular(() => {
                this._flushPromise = Promise.resolve(null).then(() => {
                    this._flushPromise = ((null));
                    this._engine.flush();
                });
            });
        }
    }
}
/**
 * @param {?} target
 * @return {?}
 */
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
/**
 * @param {?} triggerName
 * @return {?}
 */
function parseTriggerCallbackName(triggerName) {
    const /** @type {?} */ dotIndex = triggerName.indexOf('.');
    const /** @type {?} */ trigger = triggerName.substring(0, dotIndex);
    const /** @type {?} */ phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function namespaceify(namespaceId, value) {
    return `${namespaceId}#${value}`;
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function deNamespaceify(namespaceId, value) {
    return value.replace(namespaceId + '#', '');
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class InjectableAnimationEngine extends ɵDomAnimationEngine {
    /**
     * @param {?} driver
     * @param {?} normalizer
     */
    constructor(driver, normalizer) {
        super(driver, normalizer);
    }
}
InjectableAnimationEngine.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
InjectableAnimationEngine.ctorParameters = () => [
    { type: AnimationDriver, },
    { type: ɵAnimationStyleNormalizer, },
];
/**
 * @return {?}
 */
function instantiateSupportedAnimationDriver() {
    if (ɵsupportsWebAnimations()) {
        return new ɵWebAnimationsDriver();
    }
    return new ɵNoopAnimationDriver();
}
/**
 * @return {?}
 */
function instantiateDefaultStyleNormalizer() {
    return new ɵWebAnimationsStyleNormalizer();
}
/**
 * @param {?} renderer
 * @param {?} engine
 * @param {?} zone
 * @return {?}
 */
function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
const BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: AnimationDriver, useFactory: instantiateSupportedAnimationDriver },
    { provide: ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: ɵAnimationEngine, useClass: InjectableAnimationEngine }, {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [ɵDomRendererFactory2, ɵAnimationEngine, NgZone]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
const BROWSER_NOOP_ANIMATIONS_PROVIDERS = [
    { provide: ɵAnimationEngine, useClass: ɵNoopAnimationEngine }, {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [ɵDomRendererFactory2, ɵAnimationEngine, NgZone]
    }
];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 */
class BrowserAnimationsModule {
}
BrowserAnimationsModule.decorators = [
    { type: NgModule, args: [{
                imports: [BrowserModule],
                providers: BROWSER_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
BrowserAnimationsModule.ctorParameters = () => [];
/**
 * \@experimental Animation support is experimental.
 */
class NoopAnimationsModule {
}
NoopAnimationsModule.decorators = [
    { type: NgModule, args: [{
                imports: [BrowserModule],
                providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
NoopAnimationsModule.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation browser package.
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BrowserAnimationsModule, NoopAnimationsModule, AnimationRenderer as ɵAnimationRenderer, AnimationRendererFactory as ɵAnimationRendererFactory, BROWSER_ANIMATIONS_PROVIDERS as ɵe, BROWSER_NOOP_ANIMATIONS_PROVIDERS as ɵf, InjectableAnimationEngine as ɵa, instantiateDefaultStyleNormalizer as ɵc, instantiateRendererFactory as ɵd, instantiateSupportedAnimationDriver as ɵb };
//# sourceMappingURL=animations.js.map
