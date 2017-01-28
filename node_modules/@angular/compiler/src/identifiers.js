/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, ChangeDetectionStrategy, ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, LOCALE_ID, NgModuleFactory, QueryList, RenderComponentType, Renderer, SecurityContext, SimpleChange, TRANSLATIONS_FORMAT, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AnimationGroupPlayer, AnimationKeyframe, AnimationSequencePlayer, AnimationStyles, AnimationTransition, AppView, ChangeDetectorStatus, CodegenComponentFactoryResolver, ComponentRef_, DebugAppView, DebugContext, NgModuleInjector, NoOpAnimationPlayer, StaticNodeDebugInfo, TemplateRef_, UNINITIALIZED, ValueUnwrapper, ViewContainer, ViewType, balanceAnimationKeyframes, clearStyles, collectAndResolveStyles, devModeEqual, prepareFinalAnimationStyles, reflector, registerModuleFactory, renderStyles, view_utils } from './private_import_core';
var /** @type {?} */ APP_VIEW_MODULE_URL = assetUrl('core', 'linker/view');
var /** @type {?} */ VIEW_UTILS_MODULE_URL = assetUrl('core', 'linker/view_utils');
var /** @type {?} */ CD_MODULE_URL = assetUrl('core', 'change_detection/change_detection');
var /** @type {?} */ ANIMATION_STYLE_UTIL_ASSET_URL = assetUrl('core', 'animation/animation_style_util');
export var Identifiers = (function () {
    function Identifiers() {
    }
    Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
        name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
        moduleUrl: assetUrl('core', 'metadata/di'),
        runtime: ANALYZE_FOR_ENTRY_COMPONENTS
    };
    Identifiers.ViewUtils = {
        name: 'ViewUtils',
        moduleUrl: assetUrl('core', 'linker/view_utils'),
        runtime: view_utils.ViewUtils
    };
    Identifiers.AppView = { name: 'AppView', moduleUrl: APP_VIEW_MODULE_URL, runtime: AppView };
    Identifiers.DebugAppView = {
        name: 'DebugAppView',
        moduleUrl: APP_VIEW_MODULE_URL,
        runtime: DebugAppView
    };
    Identifiers.ViewContainer = {
        name: 'ViewContainer',
        moduleUrl: assetUrl('core', 'linker/view_container'),
        runtime: ViewContainer
    };
    Identifiers.ElementRef = {
        name: 'ElementRef',
        moduleUrl: assetUrl('core', 'linker/element_ref'),
        runtime: ElementRef
    };
    Identifiers.ViewContainerRef = {
        name: 'ViewContainerRef',
        moduleUrl: assetUrl('core', 'linker/view_container_ref'),
        runtime: ViewContainerRef
    };
    Identifiers.ChangeDetectorRef = {
        name: 'ChangeDetectorRef',
        moduleUrl: assetUrl('core', 'change_detection/change_detector_ref'),
        runtime: ChangeDetectorRef
    };
    Identifiers.RenderComponentType = {
        name: 'RenderComponentType',
        moduleUrl: assetUrl('core', 'render/api'),
        runtime: RenderComponentType
    };
    Identifiers.QueryList = {
        name: 'QueryList',
        moduleUrl: assetUrl('core', 'linker/query_list'),
        runtime: QueryList
    };
    Identifiers.TemplateRef = {
        name: 'TemplateRef',
        moduleUrl: assetUrl('core', 'linker/template_ref'),
        runtime: TemplateRef
    };
    Identifiers.TemplateRef_ = {
        name: 'TemplateRef_',
        moduleUrl: assetUrl('core', 'linker/template_ref'),
        runtime: TemplateRef_
    };
    Identifiers.CodegenComponentFactoryResolver = {
        name: 'CodegenComponentFactoryResolver',
        moduleUrl: assetUrl('core', 'linker/component_factory_resolver'),
        runtime: CodegenComponentFactoryResolver
    };
    Identifiers.ComponentFactoryResolver = {
        name: 'ComponentFactoryResolver',
        moduleUrl: assetUrl('core', 'linker/component_factory_resolver'),
        runtime: ComponentFactoryResolver
    };
    Identifiers.ComponentFactory = {
        name: 'ComponentFactory',
        runtime: ComponentFactory,
        moduleUrl: assetUrl('core', 'linker/component_factory')
    };
    Identifiers.ComponentRef_ = {
        name: 'ComponentRef_',
        runtime: ComponentRef_,
        moduleUrl: assetUrl('core', 'linker/component_factory')
    };
    Identifiers.ComponentRef = {
        name: 'ComponentRef',
        runtime: ComponentRef,
        moduleUrl: assetUrl('core', 'linker/component_factory')
    };
    Identifiers.NgModuleFactory = {
        name: 'NgModuleFactory',
        runtime: NgModuleFactory,
        moduleUrl: assetUrl('core', 'linker/ng_module_factory')
    };
    Identifiers.NgModuleInjector = {
        name: 'NgModuleInjector',
        runtime: NgModuleInjector,
        moduleUrl: assetUrl('core', 'linker/ng_module_factory')
    };
    Identifiers.RegisterModuleFactoryFn = {
        name: 'registerModuleFactory',
        runtime: registerModuleFactory,
        moduleUrl: assetUrl('core', 'linker/ng_module_factory_loader')
    };
    Identifiers.ValueUnwrapper = { name: 'ValueUnwrapper', moduleUrl: CD_MODULE_URL, runtime: ValueUnwrapper };
    Identifiers.Injector = {
        name: 'Injector',
        moduleUrl: assetUrl('core', 'di/injector'),
        runtime: Injector
    };
    Identifiers.ViewEncapsulation = {
        name: 'ViewEncapsulation',
        moduleUrl: assetUrl('core', 'metadata/view'),
        runtime: ViewEncapsulation
    };
    Identifiers.ViewType = {
        name: 'ViewType',
        moduleUrl: assetUrl('core', 'linker/view_type'),
        runtime: ViewType
    };
    Identifiers.ChangeDetectionStrategy = {
        name: 'ChangeDetectionStrategy',
        moduleUrl: CD_MODULE_URL,
        runtime: ChangeDetectionStrategy
    };
    Identifiers.StaticNodeDebugInfo = {
        name: 'StaticNodeDebugInfo',
        moduleUrl: assetUrl('core', 'linker/debug_context'),
        runtime: StaticNodeDebugInfo
    };
    Identifiers.DebugContext = {
        name: 'DebugContext',
        moduleUrl: assetUrl('core', 'linker/debug_context'),
        runtime: DebugContext
    };
    Identifiers.Renderer = {
        name: 'Renderer',
        moduleUrl: assetUrl('core', 'render/api'),
        runtime: Renderer
    };
    Identifiers.SimpleChange = { name: 'SimpleChange', moduleUrl: CD_MODULE_URL, runtime: SimpleChange };
    Identifiers.UNINITIALIZED = { name: 'UNINITIALIZED', moduleUrl: CD_MODULE_URL, runtime: UNINITIALIZED };
    Identifiers.ChangeDetectorStatus = {
        name: 'ChangeDetectorStatus',
        moduleUrl: CD_MODULE_URL,
        runtime: ChangeDetectorStatus
    };
    Identifiers.checkBinding = {
        name: 'checkBinding',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.checkBinding
    };
    Identifiers.devModeEqual = { name: 'devModeEqual', moduleUrl: CD_MODULE_URL, runtime: devModeEqual };
    Identifiers.inlineInterpolate = {
        name: 'inlineInterpolate',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.inlineInterpolate
    };
    Identifiers.interpolate = {
        name: 'interpolate',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.interpolate
    };
    Identifiers.castByValue = {
        name: 'castByValue',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.castByValue
    };
    Identifiers.EMPTY_ARRAY = {
        name: 'EMPTY_ARRAY',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.EMPTY_ARRAY
    };
    Identifiers.EMPTY_MAP = {
        name: 'EMPTY_MAP',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.EMPTY_MAP
    };
    Identifiers.createRenderElement = {
        name: 'createRenderElement',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.createRenderElement
    };
    Identifiers.selectOrCreateRenderHostElement = {
        name: 'selectOrCreateRenderHostElement',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.selectOrCreateRenderHostElement
    };
    Identifiers.pureProxies = [
        null,
        { name: 'pureProxy1', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy1 },
        { name: 'pureProxy2', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy2 },
        { name: 'pureProxy3', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy3 },
        { name: 'pureProxy4', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy4 },
        { name: 'pureProxy5', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy5 },
        { name: 'pureProxy6', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy6 },
        { name: 'pureProxy7', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy7 },
        { name: 'pureProxy8', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy8 },
        { name: 'pureProxy9', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy9 },
        { name: 'pureProxy10', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.pureProxy10 },
    ];
    Identifiers.SecurityContext = {
        name: 'SecurityContext',
        moduleUrl: assetUrl('core', 'security'),
        runtime: SecurityContext,
    };
    Identifiers.AnimationKeyframe = {
        name: 'AnimationKeyframe',
        moduleUrl: assetUrl('core', 'animation/animation_keyframe'),
        runtime: AnimationKeyframe
    };
    Identifiers.AnimationStyles = {
        name: 'AnimationStyles',
        moduleUrl: assetUrl('core', 'animation/animation_styles'),
        runtime: AnimationStyles
    };
    Identifiers.NoOpAnimationPlayer = {
        name: 'NoOpAnimationPlayer',
        moduleUrl: assetUrl('core', 'animation/animation_player'),
        runtime: NoOpAnimationPlayer
    };
    Identifiers.AnimationGroupPlayer = {
        name: 'AnimationGroupPlayer',
        moduleUrl: assetUrl('core', 'animation/animation_group_player'),
        runtime: AnimationGroupPlayer
    };
    Identifiers.AnimationSequencePlayer = {
        name: 'AnimationSequencePlayer',
        moduleUrl: assetUrl('core', 'animation/animation_sequence_player'),
        runtime: AnimationSequencePlayer
    };
    Identifiers.prepareFinalAnimationStyles = {
        name: 'prepareFinalAnimationStyles',
        moduleUrl: ANIMATION_STYLE_UTIL_ASSET_URL,
        runtime: prepareFinalAnimationStyles
    };
    Identifiers.balanceAnimationKeyframes = {
        name: 'balanceAnimationKeyframes',
        moduleUrl: ANIMATION_STYLE_UTIL_ASSET_URL,
        runtime: balanceAnimationKeyframes
    };
    Identifiers.clearStyles = {
        name: 'clearStyles',
        moduleUrl: ANIMATION_STYLE_UTIL_ASSET_URL,
        runtime: clearStyles
    };
    Identifiers.renderStyles = {
        name: 'renderStyles',
        moduleUrl: ANIMATION_STYLE_UTIL_ASSET_URL,
        runtime: renderStyles
    };
    Identifiers.collectAndResolveStyles = {
        name: 'collectAndResolveStyles',
        moduleUrl: ANIMATION_STYLE_UTIL_ASSET_URL,
        runtime: collectAndResolveStyles
    };
    Identifiers.LOCALE_ID = {
        name: 'LOCALE_ID',
        moduleUrl: assetUrl('core', 'i18n/tokens'),
        runtime: LOCALE_ID
    };
    Identifiers.TRANSLATIONS_FORMAT = {
        name: 'TRANSLATIONS_FORMAT',
        moduleUrl: assetUrl('core', 'i18n/tokens'),
        runtime: TRANSLATIONS_FORMAT
    };
    Identifiers.setBindingDebugInfo = {
        name: 'setBindingDebugInfo',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.setBindingDebugInfo
    };
    Identifiers.setBindingDebugInfoForChanges = {
        name: 'setBindingDebugInfoForChanges',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.setBindingDebugInfoForChanges
    };
    Identifiers.AnimationTransition = {
        name: 'AnimationTransition',
        moduleUrl: assetUrl('core', 'animation/animation_transition'),
        runtime: AnimationTransition
    };
    // This is just the interface!
    Identifiers.InlineArray = { name: 'InlineArray', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: null };
    Identifiers.inlineArrays = [
        { name: 'InlineArray2', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.InlineArray2 },
        { name: 'InlineArray2', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.InlineArray2 },
        { name: 'InlineArray4', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.InlineArray4 },
        { name: 'InlineArray8', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.InlineArray8 },
        { name: 'InlineArray16', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.InlineArray16 },
    ];
    Identifiers.EMPTY_INLINE_ARRAY = {
        name: 'EMPTY_INLINE_ARRAY',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.EMPTY_INLINE_ARRAY
    };
    Identifiers.InlineArrayDynamic = {
        name: 'InlineArrayDynamic',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.InlineArrayDynamic
    };
    Identifiers.subscribeToRenderElement = {
        name: 'subscribeToRenderElement',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.subscribeToRenderElement
    };
    Identifiers.createRenderComponentType = {
        name: 'createRenderComponentType',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: view_utils.createRenderComponentType
    };
    Identifiers.noop = { name: 'noop', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: view_utils.noop };
    return Identifiers;
}());
function Identifiers_tsickle_Closure_declarations() {
    /** @type {?} */
    Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS;
    /** @type {?} */
    Identifiers.ViewUtils;
    /** @type {?} */
    Identifiers.AppView;
    /** @type {?} */
    Identifiers.DebugAppView;
    /** @type {?} */
    Identifiers.ViewContainer;
    /** @type {?} */
    Identifiers.ElementRef;
    /** @type {?} */
    Identifiers.ViewContainerRef;
    /** @type {?} */
    Identifiers.ChangeDetectorRef;
    /** @type {?} */
    Identifiers.RenderComponentType;
    /** @type {?} */
    Identifiers.QueryList;
    /** @type {?} */
    Identifiers.TemplateRef;
    /** @type {?} */
    Identifiers.TemplateRef_;
    /** @type {?} */
    Identifiers.CodegenComponentFactoryResolver;
    /** @type {?} */
    Identifiers.ComponentFactoryResolver;
    /** @type {?} */
    Identifiers.ComponentFactory;
    /** @type {?} */
    Identifiers.ComponentRef_;
    /** @type {?} */
    Identifiers.ComponentRef;
    /** @type {?} */
    Identifiers.NgModuleFactory;
    /** @type {?} */
    Identifiers.NgModuleInjector;
    /** @type {?} */
    Identifiers.RegisterModuleFactoryFn;
    /** @type {?} */
    Identifiers.ValueUnwrapper;
    /** @type {?} */
    Identifiers.Injector;
    /** @type {?} */
    Identifiers.ViewEncapsulation;
    /** @type {?} */
    Identifiers.ViewType;
    /** @type {?} */
    Identifiers.ChangeDetectionStrategy;
    /** @type {?} */
    Identifiers.StaticNodeDebugInfo;
    /** @type {?} */
    Identifiers.DebugContext;
    /** @type {?} */
    Identifiers.Renderer;
    /** @type {?} */
    Identifiers.SimpleChange;
    /** @type {?} */
    Identifiers.UNINITIALIZED;
    /** @type {?} */
    Identifiers.ChangeDetectorStatus;
    /** @type {?} */
    Identifiers.checkBinding;
    /** @type {?} */
    Identifiers.devModeEqual;
    /** @type {?} */
    Identifiers.inlineInterpolate;
    /** @type {?} */
    Identifiers.interpolate;
    /** @type {?} */
    Identifiers.castByValue;
    /** @type {?} */
    Identifiers.EMPTY_ARRAY;
    /** @type {?} */
    Identifiers.EMPTY_MAP;
    /** @type {?} */
    Identifiers.createRenderElement;
    /** @type {?} */
    Identifiers.selectOrCreateRenderHostElement;
    /** @type {?} */
    Identifiers.pureProxies;
    /** @type {?} */
    Identifiers.SecurityContext;
    /** @type {?} */
    Identifiers.AnimationKeyframe;
    /** @type {?} */
    Identifiers.AnimationStyles;
    /** @type {?} */
    Identifiers.NoOpAnimationPlayer;
    /** @type {?} */
    Identifiers.AnimationGroupPlayer;
    /** @type {?} */
    Identifiers.AnimationSequencePlayer;
    /** @type {?} */
    Identifiers.prepareFinalAnimationStyles;
    /** @type {?} */
    Identifiers.balanceAnimationKeyframes;
    /** @type {?} */
    Identifiers.clearStyles;
    /** @type {?} */
    Identifiers.renderStyles;
    /** @type {?} */
    Identifiers.collectAndResolveStyles;
    /** @type {?} */
    Identifiers.LOCALE_ID;
    /** @type {?} */
    Identifiers.TRANSLATIONS_FORMAT;
    /** @type {?} */
    Identifiers.setBindingDebugInfo;
    /** @type {?} */
    Identifiers.setBindingDebugInfoForChanges;
    /** @type {?} */
    Identifiers.AnimationTransition;
    /** @type {?} */
    Identifiers.InlineArray;
    /** @type {?} */
    Identifiers.inlineArrays;
    /** @type {?} */
    Identifiers.EMPTY_INLINE_ARRAY;
    /** @type {?} */
    Identifiers.InlineArrayDynamic;
    /** @type {?} */
    Identifiers.subscribeToRenderElement;
    /** @type {?} */
    Identifiers.createRenderComponentType;
    /** @type {?} */
    Identifiers.noop;
}
/**
 * @param {?} pkg
 * @param {?=} path
 * @param {?=} type
 * @return {?}
 */
export function assetUrl(pkg, path, type) {
    if (path === void 0) { path = null; }
    if (type === void 0) { type = 'src'; }
    if (path == null) {
        return "@angular/" + pkg + "/index";
    }
    else {
        return "@angular/" + pkg + "/" + type + "/" + path;
    }
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function resolveIdentifier(identifier) {
    return reflector.resolveIdentifier(identifier.name, identifier.moduleUrl, identifier.runtime);
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function createIdentifier(identifier) {
    var /** @type {?} */ reference = reflector.resolveIdentifier(identifier.name, identifier.moduleUrl, identifier.runtime);
    return { reference: reference };
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function identifierToken(identifier) {
    return { identifier: identifier };
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function createIdentifierToken(identifier) {
    return identifierToken(createIdentifier(identifier));
}
/**
 * @param {?} enumType
 * @param {?} name
 * @return {?}
 */
export function createEnumIdentifier(enumType, name) {
    var /** @type {?} */ resolvedEnum = reflector.resolveEnum(resolveIdentifier(enumType), name);
    return { reference: resolvedEnum };
}
//# sourceMappingURL=identifiers.js.map