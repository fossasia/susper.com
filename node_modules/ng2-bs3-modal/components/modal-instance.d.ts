import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
export declare class ModalInstance {
    private element;
    private suffix;
    private shownEventName;
    private hiddenEventName;
    private $modal;
    shown: Observable<void>;
    hidden: Observable<ModalResult>;
    result: any;
    visible: boolean;
    constructor(element: ElementRef);
    open(): Promise<any>;
    close(): Promise<any>;
    dismiss(): Promise<any>;
    destroy(): Promise<any>;
    private show();
    private hide();
    private init();
    private resetData();
}
export declare enum ModalResult {
    None = 0,
    Close = 1,
    Dismiss = 2,
}
