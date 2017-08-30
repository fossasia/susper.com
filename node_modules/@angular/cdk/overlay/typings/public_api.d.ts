/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Provider } from '@angular/core';
export declare const OVERLAY_PROVIDERS: Provider[];
export declare class OverlayModule {
}
export { Overlay } from './overlay';
export { OverlayContainer } from './overlay-container';
export { FullscreenOverlayContainer } from './fullscreen-overlay-container';
export { OverlayRef } from './overlay-ref';
export { OverlayState } from './overlay-state';
export { ConnectedOverlayDirective, OverlayOrigin } from './overlay-directives';
export { ViewportRuler } from '@angular/cdk/scrolling';
export { ComponentType } from '@angular/cdk/portal';
export * from './position/connected-position';
export * from './scroll/index';
export { PositionStrategy } from './position/position-strategy';
export { GlobalPositionStrategy } from './position/global-position-strategy';
export { ConnectedPositionStrategy } from './position/connected-position-strategy';
export { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';
