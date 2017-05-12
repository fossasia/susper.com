/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RenderComponentType, Renderer, RootRenderer } from '@angular/core';
import { AnimationKeyframe, AnimationPlayer, AnimationStyles, DirectRenderer, RenderDebugInfo } from '../private_import_core';
import { AnimationDriver } from './animation_driver';
import { EventManager } from './events/event_manager';
import { DomSharedStylesHost } from './shared_styles_host';
export declare const NAMESPACE_URIS: {
    [ns: string]: string;
};
export declare abstract class DomRootRenderer implements RootRenderer {
    document: Document;
    eventManager: EventManager;
    sharedStylesHost: DomSharedStylesHost;
    animationDriver: AnimationDriver;
    appId: string;
    protected registeredComponents: Map<string, DomRenderer>;
    constructor(document: Document, eventManager: EventManager, sharedStylesHost: DomSharedStylesHost, animationDriver: AnimationDriver, appId: string);
    renderComponent(componentProto: RenderComponentType): Renderer;
}
export declare class DomRootRenderer_ extends DomRootRenderer {
    constructor(_document: any, _eventManager: EventManager, sharedStylesHost: DomSharedStylesHost, animationDriver: AnimationDriver, appId: string);
}
export declare const DIRECT_DOM_RENDERER: DirectRenderer;
export declare class DomRenderer implements Renderer {
    private _rootRenderer;
    private componentProto;
    private _animationDriver;
    private _contentAttr;
    private _hostAttr;
    private _styles;
    directRenderer: DirectRenderer;
    constructor(_rootRenderer: DomRootRenderer, componentProto: RenderComponentType, _animationDriver: AnimationDriver, styleShimId: string);
    selectRootElement(selectorOrNode: string | Element, debugInfo: RenderDebugInfo): Element;
    createElement(parent: Element | DocumentFragment, name: string, debugInfo: RenderDebugInfo): Element;
    createViewRoot(hostElement: Element): Element | DocumentFragment;
    createTemplateAnchor(parentElement: Element | DocumentFragment, debugInfo: RenderDebugInfo): Comment;
    createText(parentElement: Element | DocumentFragment, value: string, debugInfo: RenderDebugInfo): any;
    projectNodes(parentElement: Element | DocumentFragment, nodes: Node[]): void;
    attachViewAfter(node: Node, viewRootNodes: Node[]): void;
    detachView(viewRootNodes: (Element | Text | Comment)[]): void;
    destroyView(hostElement: Element | DocumentFragment, viewAllNodes: Node[]): void;
    listen(renderElement: any, name: string, callback: Function): Function;
    listenGlobal(target: string, name: string, callback: Function): Function;
    setElementProperty(renderElement: Element | DocumentFragment, propertyName: string, propertyValue: any): void;
    setElementAttribute(renderElement: Element, attributeName: string, attributeValue: string): void;
    setBindingDebugInfo(renderElement: Element, propertyName: string, propertyValue: string): void;
    setElementClass(renderElement: Element, className: string, isAdd: boolean): void;
    setElementStyle(renderElement: HTMLElement, styleName: string, styleValue: string): void;
    invokeElementMethod(renderElement: Element, methodName: string, args: any[]): void;
    setText(renderNode: Text, text: string): void;
    animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string, previousPlayers?: AnimationPlayer[]): AnimationPlayer;
}
export declare const COMPONENT_VARIABLE: string;
export declare const HOST_ATTR: string;
export declare const CONTENT_ATTR: string;
export declare function shimContentAttribute(componentShortId: string): string;
export declare function shimHostAttribute(componentShortId: string): string;
export declare function flattenStyles(compId: string, styles: Array<any | any[]>, target: string[]): string[];
export declare function isNamespaced(name: string): boolean;
export declare function splitNamespace(name: string): string[];
