/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone, OpaqueToken } from '@angular/core';
/**
 * @stable
 */
export declare const EVENT_MANAGER_PLUGINS: OpaqueToken;
/**
 * @stable
 */
export declare class EventManager {
    private _zone;
    private _plugins;
    private _eventNameToPlugin;
    constructor(plugins: EventManagerPlugin[], _zone: NgZone);
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    addGlobalEventListener(target: string, eventName: string, handler: Function): Function;
    getZone(): NgZone;
}
export declare abstract class EventManagerPlugin {
    manager: EventManager;
    abstract supports(eventName: string): boolean;
    abstract addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    addGlobalEventListener(element: string, eventName: string, handler: Function): Function;
}
