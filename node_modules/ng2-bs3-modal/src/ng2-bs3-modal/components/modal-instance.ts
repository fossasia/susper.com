import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';

declare var jQuery: any;

export class ModalInstance {

    private suffix: string = '.ng2-bs3-modal';
    private shownEventName: string = 'shown.bs.modal' + this.suffix;
    private hiddenEventName: string = 'hidden.bs.modal' + this.suffix;
    private $modal: any;

    shown: Observable<void>;
    hidden: Observable<ModalResult>;
    result: any;
    visible: boolean = false;

    constructor(private element: ElementRef) {
        this.init();
    }

    open(): Promise<any> {
        return this.show();
    }

    close(): Promise<any> {
        this.result = ModalResult.Close;
        return this.hide();
    }

    dismiss(): Promise<any> {
        this.result = ModalResult.Dismiss;
        return this.hide();
    }

    destroy(): Promise<any> {
        return this.hide().then(() => {
            if (this.$modal) {
                this.$modal.data('bs.modal', null);
                this.$modal.remove();
            }
        });
    }

    private show() {
        let promise = toPromise(this.shown);
        this.resetData();
        this.$modal.modal();
        return promise;
    }

    private hide(): Promise<ModalResult> {
        if (this.$modal && this.visible) {
            let promise = toPromise(this.hidden);
            this.$modal.modal('hide');
            return promise;
        }
        return Promise.resolve(this.result);
    }

    private init() {
        this.$modal = jQuery(this.element.nativeElement);
        this.$modal.appendTo('body');

        this.shown = Observable.fromEvent(this.$modal, this.shownEventName)
            .map(() => {
                this.visible = true;
            });

        this.hidden = Observable.fromEvent(this.$modal, this.hiddenEventName)
            .map(() => {
                let result = (!this.result || this.result === ModalResult.None)
                    ? ModalResult.Dismiss : this.result;

                this.result = ModalResult.None;
                this.visible = false;

                return result;
            });
    }

    private resetData() {
        this.$modal.removeData();
        this.$modal.data('backdrop', booleanOrValue(this.$modal.attr('data-backdrop')));
        this.$modal.data('keyboard', booleanOrValue(this.$modal.attr('data-keyboard')));
    }
}

function booleanOrValue(value) {
    if (value === 'true')
        return true;
    else if (value === 'false')
        return false;
    return value;
}

function toPromise<T>(observable: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        observable.subscribe(next => {
            resolve(next);
        });
    });
}

export enum ModalResult {
    None,
    Close,
    Dismiss
}