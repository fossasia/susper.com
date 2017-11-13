import { ElementRef } from '@angular/core';
import { ContainerRef, IPositionElements, IPositionStats, IResolver } from '../models';
export declare class PositionResolver {
    create(options: IPositionElements): IResolver;
    defineContainer(windowElement: ContainerRef, isContainerWindow: boolean): any;
    isElementWindow(windowElement: ContainerRef): boolean;
    getDocumentElement(isContainerWindow: boolean, windowElement: any): any;
    calculatePoints(element: ElementRef, resolver: IResolver): {
        height: any;
        scrolledUntilNow: any;
        totalToScroll: any;
    };
    calculatePointsForWindow(element: ElementRef, resolver: IResolver): IPositionStats;
    calculatePointsForElement(element: ElementRef, resolver: IResolver): {
        height: any;
        scrolledUntilNow: any;
        totalToScroll: any;
    };
    private height(elem, isWindow, offsetHeightKey, clientHeightKey);
    private offsetTop(elem, axis, isWindow);
    private pageYOffset(elem, axis, isWindow);
}
