/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Optional, OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
export declare const LIVE_ANNOUNCER_ELEMENT_TOKEN: InjectionToken<HTMLElement>;
/** Possible politeness levels. */
export declare type AriaLivePoliteness = 'off' | 'polite' | 'assertive';
export declare class LiveAnnouncer implements OnDestroy {
    private _liveElement;
    constructor(elementToken: any, platform: Platform);
    /**
     * Announces a message to screenreaders.
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element
     */
    announce(message: string, politeness?: AriaLivePoliteness): void;
    ngOnDestroy(): void;
    private _createLiveElement();
}
/** @docs-private */
export declare function LIVE_ANNOUNCER_PROVIDER_FACTORY(parentDispatcher: LiveAnnouncer, liveElement: any, platform: Platform): LiveAnnouncer;
/** @docs-private */
export declare const LIVE_ANNOUNCER_PROVIDER: {
    provide: typeof LiveAnnouncer;
    deps: (Optional[] | typeof Platform)[];
    useFactory: (parentDispatcher: LiveAnnouncer, liveElement: any, platform: Platform) => LiveAnnouncer;
};
