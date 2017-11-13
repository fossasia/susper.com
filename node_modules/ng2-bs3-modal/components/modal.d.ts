import { OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { ModalInstance } from './modal-instance';
export declare class ModalComponent implements OnDestroy {
    private element;
    private overrideSize;
    instance: ModalInstance;
    visible: boolean;
    animation: boolean;
    backdrop: string | boolean;
    keyboard: boolean;
    size: string;
    cssClass: string;
    onClose: EventEmitter<any>;
    onDismiss: EventEmitter<any>;
    onOpen: EventEmitter<any>;
    readonly fadeClass: boolean;
    readonly dataKeyboardAttr: boolean;
    readonly dataBackdropAttr: string | boolean;
    constructor(element: ElementRef);
    ngOnDestroy(): Promise<any>;
    routerCanDeactivate(): any;
    open(size?: string): Promise<void>;
    close(value?: any): Promise<void>;
    dismiss(): Promise<void>;
    getCssClasses(): string;
    private isSmall();
    private isLarge();
}
export declare class ModalSize {
    static Small: string;
    static Large: string;
    static validSize(size: string): boolean;
}
