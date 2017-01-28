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
 * Entry point from which you should import all public core APIs.
 */
export { ANALYZE_FOR_ENTRY_COMPONENTS, Attribute, ContentChild, ContentChildren, Query, ViewChild, ViewChildren, Component, Directive, HostBinding, HostListener, Input, Output, Pipe, AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule, ViewEncapsulation } from './metadata';
export { Version, VERSION } from './version';
export { Class } from './util';
export { forwardRef, resolveForwardRef, Injector, ReflectiveInjector, ResolvedReflectiveFactory, ReflectiveKey, OpaqueToken, Inject, Optional, Injectable, Self, SkipSelf, Host } from './di';
export { createPlatform, assertPlatform, destroyPlatform, getPlatform, PlatformRef, ApplicationRef, enableProdMode, isDevMode, createPlatformFactory, NgProbeToken } from './application_ref';
export { APP_ID, PACKAGE_ROOT_URL, PLATFORM_INITIALIZER, APP_BOOTSTRAP_LISTENER } from './application_tokens';
export { APP_INITIALIZER, ApplicationInitStatus } from './application_init';
export { NgZone } from './zone';
export { RenderComponentType, Renderer, RootRenderer } from './render';
export { COMPILER_OPTIONS, Compiler, CompilerFactory, ModuleWithComponentFactories, ComponentFactory, ComponentRef, ComponentFactoryResolver, ElementRef, NgModuleFactory, NgModuleRef, NgModuleFactoryLoader, getModuleFactory, QueryList, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, TemplateRef, ViewContainerRef, EmbeddedViewRef, ViewRef } from './linker';
export { DebugElement, DebugNode, asNativeElements, getDebugNode } from './debug/debug_node';
export { Testability, TestabilityRegistry, setTestabilityGetter } from './testability/testability';
export { ChangeDetectionStrategy, ChangeDetectorRef, CollectionChangeRecord, DefaultIterableDiffer, IterableDiffers, KeyValueChangeRecord, KeyValueDiffers, SimpleChange, WrappedValue } from './change_detection';
export { platformCore } from './platform_core_providers';
export { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from './i18n/tokens';
export { ApplicationModule } from './application_module';
export { wtfCreateScope, wtfLeave, wtfStartTimeRange, wtfEndTimeRange } from './profile/profile';
export { Type } from './type';
export { EventEmitter } from './facade/async';
export { ErrorHandler } from './error_handler';
export { __core_private__ } from './core_private_export';
export { AUTO_STYLE, AnimationEntryMetadata, AnimationStateMetadata, AnimationStateDeclarationMetadata, AnimationStateTransitionMetadata, AnimationMetadata, AnimationKeyframesSequenceMetadata, AnimationStyleMetadata, AnimationAnimateMetadata, AnimationWithStepsMetadata, AnimationSequenceMetadata, AnimationGroupMetadata, animate, group, sequence, style, state, keyframes, transition, trigger } from './animation/metadata';
export { AnimationTransitionEvent } from './animation/animation_transition_event';
export { AnimationPlayer } from './animation/animation_player';
export { Sanitizer, SecurityContext } from './security';
//# sourceMappingURL=core.js.map