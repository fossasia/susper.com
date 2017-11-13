/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
/**
 * Interface used to register message elements and keep a count of how many registrations have
 * the same message and the reference to the message element used for the aria-describedby.
 */
export interface RegisteredMessage {
    messageElement: Element;
    referenceCount: number;
}
/** ID used for the body container where all messages are appended. */
export declare const MESSAGES_CONTAINER_ID = "cdk-describedby-message-container";
/** ID prefix used for each created message element. */
export declare const CDK_DESCRIBEDBY_ID_PREFIX = "cdk-describedby-message";
/** Attribute given to each host element that is described by a message element. */
export declare const CDK_DESCRIBEDBY_HOST_ATTRIBUTE = "cdk-describedby-host";
/**
 * Utility that creates visually hidden elements with a message content. Useful for elements that
 * want to use aria-describedby to further describe themselves without adding additional visual
 * content.
 * @docs-private
 */
export declare class AriaDescriber {
    private _platform;
    constructor(_platform: Platform);
    /**
     * Adds to the host element an aria-describedby reference to a hidden element that contains
     * the message. If the same message has already been registered, then it will reuse the created
     * message element.
     */
    describe(hostElement: Element, message: string): void;
    /** Removes the host element's aria-describedby reference to the message element. */
    removeDescription(hostElement: Element, message: string): void;
    /** Unregisters all created message elements and removes the message container. */
    ngOnDestroy(): void;
}
/** @docs-private */
export declare function ARIA_DESCRIBER_PROVIDER_FACTORY(parentDispatcher: AriaDescriber, platform: Platform): AriaDescriber;
/** @docs-private */
export declare const ARIA_DESCRIBER_PROVIDER: {
    provide: typeof AriaDescriber;
    deps: (Optional[] | typeof Platform)[];
    useFactory: (parentDispatcher: AriaDescriber, platform: Platform) => AriaDescriber;
};
