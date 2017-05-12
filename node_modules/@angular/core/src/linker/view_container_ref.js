/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { unimplemented } from '../facade/errors';
import { isPresent } from '../facade/lang';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
/**
 *  Represents a container where one or more Views can be attached.
  * *
  * The container can contain two kinds of Views. Host Views, created by instantiating a
  * {@link Component} via {@link #createComponent}, and Embedded Views, created by instantiating an
  * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
  * *
  * The location of the View Container within the containing View is specified by the Anchor
  * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
  * have a single View Container.
  * *
  * Root elements of Views attached to this container become siblings of the Anchor Element in
  * the Rendered View.
  * *
  * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
  * with `ViewContainerRef` on the Element, or you obtain it via a {@link ViewChild} query.
 * @abstract
 */
export var ViewContainerRef = (function () {
    function ViewContainerRef() {
    }
    Object.defineProperty(ViewContainerRef.prototype, "element", {
        /**
         *  Anchor element that specifies the location of this container in the containing View.
          * <!-- TODO: rename to anchorElement -->
         * @return {?}
         */
        get: function () { return (unimplemented()); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return (unimplemented()); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
        /**
         * @return {?}
         */
        get: function () { return (unimplemented()); },
        enumerable: true,
        configurable: true
    });
    /**
     *  Destroys all Views in this container.
     * @abstract
     * @return {?}
     */
    ViewContainerRef.prototype.clear = function () { };
    /**
     *  Returns the {@link ViewRef} for the View located in this container at the specified index.
     * @abstract
     * @param {?} index
     * @return {?}
     */
    ViewContainerRef.prototype.get = function (index) { };
    Object.defineProperty(ViewContainerRef.prototype, "length", {
        /**
         *  Returns the number of Views currently attached to this container.
         * @return {?}
         */
        get: function () { return (unimplemented()); },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     *  Instantiates an Embedded View based on the {@link TemplateRef `templateRef`} and inserts it
      * into this container at the specified `index`.
      * *
      * If `index` is not specified, the new View will be inserted as the last View in the container.
      * *
      * Returns the {@link ViewRef} for the newly created View.
     * @abstract
     * @param {?} templateRef
     * @param {?=} context
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef.prototype.createEmbeddedView = function (templateRef, context, index) { };
    /**
     *  Instantiates a single {@link Component} and inserts its Host View into this container at the
      * specified `index`.
      * *
      * The component is instantiated using its {@link ComponentFactory} which can be
      * obtained via {@link ComponentFactoryResolver#resolveComponentFactory}.
      * *
      * If `index` is not specified, the new View will be inserted as the last View in the container.
      * *
      * You can optionally specify the {@link Injector} that will be used as parent for the Component.
      * *
      * Returns the {@link ComponentRef} of the Host View created for the newly instantiated Component.
     * @abstract
     * @param {?} componentFactory
     * @param {?=} index
     * @param {?=} injector
     * @param {?=} projectableNodes
     * @return {?}
     */
    ViewContainerRef.prototype.createComponent = function (componentFactory, index, injector, projectableNodes) { };
    /**
     *  Inserts a View identified by a {@link ViewRef} into the container at the specified `index`.
      * *
      * If `index` is not specified, the new View will be inserted as the last View in the container.
      * *
      * Returns the inserted {@link ViewRef}.
     * @abstract
     * @param {?} viewRef
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef.prototype.insert = function (viewRef, index) { };
    /**
     *  Moves a View identified by a {@link ViewRef} into the container at the specified `index`.
      * *
      * Returns the inserted {@link ViewRef}.
     * @abstract
     * @param {?} viewRef
     * @param {?} currentIndex
     * @return {?}
     */
    ViewContainerRef.prototype.move = function (viewRef, currentIndex) { };
    /**
     *  Returns the index of the View, specified via {@link ViewRef}, within the current container or
      * `-1` if this container doesn't contain the View.
     * @abstract
     * @param {?} viewRef
     * @return {?}
     */
    ViewContainerRef.prototype.indexOf = function (viewRef) { };
    /**
     *  Destroys a View attached to this container at the specified `index`.
      * *
      * If `index` is not specified, the last View in the container will be removed.
     * @abstract
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef.prototype.remove = function (index) { };
    /**
     *  Use along with {@link #insert} to move a View within the current container.
      * *
      * If the `index` param is omitted, the last {@link ViewRef} is detached.
     * @abstract
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef.prototype.detach = function (index) { };
    return ViewContainerRef;
}());
export var ViewContainerRef_ = (function () {
    /**
     * @param {?} _element
     */
    function ViewContainerRef_(_element) {
        this._element = _element;
        /** @internal */
        this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
        /** @internal */
        this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
        /** @internal */
        this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
        /** @internal */
        this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
    }
    /**
     * @param {?} index
     * @return {?}
     */
    ViewContainerRef_.prototype.get = function (index) { return this._element.nestedViews[index].ref; };
    Object.defineProperty(ViewContainerRef_.prototype, "length", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ views = this._element.nestedViews;
            return isPresent(views) ? views.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef_.prototype, "element", {
        /**
         * @return {?}
         */
        get: function () { return this._element.elementRef; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef_.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return this._element.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
        /**
         * @return {?}
         */
        get: function () { return this._element.parentInjector; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} templateRef
     * @param {?=} context
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef_.prototype.createEmbeddedView = function (templateRef, context, index) {
        if (context === void 0) { context = null; }
        if (index === void 0) { index = -1; }
        var /** @type {?} */ viewRef = templateRef.createEmbeddedView(context);
        this.insert(viewRef, index);
        return viewRef;
    };
    /**
     * @param {?} componentFactory
     * @param {?=} index
     * @param {?=} injector
     * @param {?=} projectableNodes
     * @return {?}
     */
    ViewContainerRef_.prototype.createComponent = function (componentFactory, index, injector, projectableNodes) {
        if (index === void 0) { index = -1; }
        if (injector === void 0) { injector = null; }
        if (projectableNodes === void 0) { projectableNodes = null; }
        var /** @type {?} */ s = this._createComponentInContainerScope();
        var /** @type {?} */ contextInjector = injector || this._element.parentInjector;
        var /** @type {?} */ componentRef = componentFactory.create(contextInjector, projectableNodes);
        this.insert(componentRef.hostView, index);
        return wtfLeave(s, componentRef);
    };
    /**
     * @param {?} viewRef
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef_.prototype.insert = function (viewRef, index) {
        if (index === void 0) { index = -1; }
        var /** @type {?} */ s = this._insertScope();
        if (index == -1)
            index = this.length;
        var /** @type {?} */ viewRef_ = (viewRef);
        this._element.attachView(viewRef_.internalView, index);
        return wtfLeave(s, viewRef_);
    };
    /**
     * @param {?} viewRef
     * @param {?} currentIndex
     * @return {?}
     */
    ViewContainerRef_.prototype.move = function (viewRef, currentIndex) {
        var /** @type {?} */ s = this._insertScope();
        if (currentIndex == -1)
            return;
        var /** @type {?} */ viewRef_ = (viewRef);
        this._element.moveView(viewRef_.internalView, currentIndex);
        return wtfLeave(s, viewRef_);
    };
    /**
     * @param {?} viewRef
     * @return {?}
     */
    ViewContainerRef_.prototype.indexOf = function (viewRef) {
        return this._element.nestedViews.indexOf(((viewRef)).internalView);
    };
    /**
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef_.prototype.remove = function (index) {
        if (index === void 0) { index = -1; }
        var /** @type {?} */ s = this._removeScope();
        if (index == -1)
            index = this.length - 1;
        var /** @type {?} */ view = this._element.detachView(index);
        view.destroy();
        // view is intentionally not returned to the client.
        wtfLeave(s);
    };
    /**
     * @param {?=} index
     * @return {?}
     */
    ViewContainerRef_.prototype.detach = function (index) {
        if (index === void 0) { index = -1; }
        var /** @type {?} */ s = this._detachScope();
        if (index == -1)
            index = this.length - 1;
        var /** @type {?} */ view = this._element.detachView(index);
        return wtfLeave(s, view.ref);
    };
    /**
     * @return {?}
     */
    ViewContainerRef_.prototype.clear = function () {
        for (var /** @type {?} */ i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    };
    return ViewContainerRef_;
}());
function ViewContainerRef__tsickle_Closure_declarations() {
    /** @type {?} */
    ViewContainerRef_.prototype._createComponentInContainerScope;
    /** @type {?} */
    ViewContainerRef_.prototype._insertScope;
    /** @type {?} */
    ViewContainerRef_.prototype._removeScope;
    /** @type {?} */
    ViewContainerRef_.prototype._detachScope;
    /** @type {?} */
    ViewContainerRef_.prototype._element;
}
//# sourceMappingURL=view_container_ref.js.map