export { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
export { ObserversModule, ObserveContent } from '@angular/cdk/observers';
export { SelectionModel } from '@angular/cdk/collections';
export { Dir, Direction, Directionality, BidiModule } from './bidi/index';
export * from './option/index';
export { Portal, PortalHost, BasePortalHost, ComponentPortal, TemplatePortal } from './portal/portal';
export { PortalHostDirective, TemplatePortalDirective, PortalModule } from './portal/portal-directives';
export { DomPortalHost } from './portal/dom-portal-host';
export * from '@angular/cdk/platform';
export * from '@angular/cdk/overlay';
export { GestureConfig } from './gestures/gesture-config';
export { HammerInput, HammerManager } from './gestures/gesture-annotations';
export * from './ripple/index';
export { AriaLivePoliteness, LiveAnnouncer, LIVE_ANNOUNCER_ELEMENT_TOKEN, LIVE_ANNOUNCER_PROVIDER, InteractivityChecker, FocusTrap, FocusTrapFactory, FocusTrapDeprecatedDirective, FocusTrapDirective, isFakeMousedownFromScreenReader, A11yModule } from '@angular/cdk/a11y';
export { UniqueSelectionDispatcher, UniqueSelectionDispatcherListener, UNIQUE_SELECTION_DISPATCHER_PROVIDER } from './coordination/unique-selection-dispatcher';
export { MdLineModule, MdLine, MdLineSetter } from './line/line';
export * from './style/index';
export * from './keyboard/keycodes';
export * from './compatibility/compatibility';
export * from './animation/animation';
export * from './selection/index';
export { CompatibilityModule, NoConflictStyleCompatibilityMode } from './compatibility/compatibility';
export { MdCommonModule, MATERIAL_SANITY_CHECKS } from './common-behaviors/common-module';
export * from './datetime/index';
export { FloatPlaceholderType, PlaceholderOptions, MD_PLACEHOLDER_GLOBAL_OPTIONS } from './placeholder/placeholder-options';
export { ErrorStateMatcher, ErrorOptions, MD_ERROR_GLOBAL_OPTIONS, defaultErrorStateMatcher, showOnDirtyErrorStateMatcher } from './error/error-options';
/** @deprecated */
export declare class MdCoreModule {
}
