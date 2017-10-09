/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ViewContainerRef, InjectionToken } from '@angular/core';
import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
export declare const MAT_SNACK_BAR_DATA: InjectionToken<any>;
/** Possible values for horizontalPosition on MatSnackBarConfig. */
export declare type MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
/** Possible values for verticalPosition on MatSnackBarConfig. */
export declare type MatSnackBarVerticalPosition = 'top' | 'bottom';
/**
 * Configuration used when opening a snack-bar.
 */
export declare class MatSnackBarConfig {
    /** The politeness level for the MatAriaLiveAnnouncer announcement. */
    politeness?: AriaLivePoliteness;
    /** Message to be announced by the MatAriaLiveAnnouncer */
    announcementMessage?: string;
    /** The view container to place the overlay for the snack bar into. */
    viewContainerRef?: ViewContainerRef;
    /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
    duration?: number;
    /** Extra CSS classes to be added to the snack bar container. */
    extraClasses?: string[];
    /** Text layout direction for the snack bar. */
    direction?: Direction;
    /** Data being injected into the child component. */
    data?: any;
    /** The horizontal position to place the snack bar. */
    horizontalPosition?: MatSnackBarHorizontalPosition;
    /** The vertical position to place the snack bar. */
    verticalPosition?: MatSnackBarVerticalPosition;
}
