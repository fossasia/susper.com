/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplateRef, ViewContainerRef, ElementRef, ComponentRef, EmbeddedViewRef, Injector } from '@angular/core';
export interface ComponentType<T> {
    new (...args: any[]): T;
}
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
export declare abstract class Portal<T> {
    private _attachedHost;
    /** Attach this portal to a host. */
    attach(host: PortalHost): T;
    /** Detach this portal from its host */
    detach(): void;
    /** Whether this portal is attached to a host. */
    readonly isAttached: boolean;
    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host: PortalHost | null): void;
}
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export declare class ComponentPortal<T> extends Portal<ComponentRef<T>> {
    /** The type of the component that will be instantiated for attachment. */
    component: ComponentType<T>;
    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalHost.
     * The origin is necessary when the host is outside of the Angular application context.
     */
    viewContainerRef?: ViewContainerRef | null;
    /** [Optional] Injector used for the instantiation of the component. */
    injector?: Injector | null;
    constructor(component: ComponentType<T>, viewContainerRef?: ViewContainerRef | null, injector?: Injector | null);
}
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export declare class TemplatePortal<C> extends Portal<C> {
    /** The embedded template that will be used to instantiate an embedded View in the host. */
    templateRef: TemplateRef<C>;
    /** Reference to the ViewContainer into which the template will be stamped out. */
    viewContainerRef: ViewContainerRef;
    context: C | undefined;
    constructor(template: TemplateRef<any>, viewContainerRef: ViewContainerRef, context?: C);
    readonly origin: ElementRef;
    /**
     * Attach the the portal to the provided `PortalHost`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    attach(host: PortalHost, context?: C | undefined): C;
    detach(): void;
}
/**
 * A `PortalHost` is an space that can contain a single `Portal`.
 */
export interface PortalHost {
    attach(portal: Portal<any>): any;
    detach(): any;
    dispose(): void;
    hasAttached(): boolean;
}
/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
export declare abstract class BasePortalHost implements PortalHost {
    /** The portal currently attached to the host. */
    private _attachedPortal;
    /** A function that will permanently dispose this host. */
    private _disposeFn;
    /** Whether this host has already been permanently disposed. */
    private _isDisposed;
    /** Whether this host has an attached portal. */
    hasAttached(): boolean;
    attach(portal: Portal<any>): any;
    abstract attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    abstract attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    detach(): void;
    dispose(): void;
    setDisposeFn(fn: () => void): void;
    private _invokeDisposeFn();
}
