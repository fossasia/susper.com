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
export declare const MD_SNACK_BAR_DATA: InjectionToken<any>;
/**
 * Configuration used when opening a snack-bar.
 */
export declare class MdSnackBarConfig {
    /** The politeness level for the MdAriaLiveAnnouncer announcement. */
    politeness?: AriaLivePoliteness;
    /** Message to be announced by the MdAriaLiveAnnouncer */
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
}
