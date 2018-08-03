import { Component, Input, Inject } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
    selector: 'modal-header',
    template: `
        <div class="modal-header">
            <button *ngIf="showClose" type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="modal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
            <ng-content></ng-content>
        </div>
    `
})
export class ModalHeaderComponent {
    @Input('show-close') showClose: boolean = false;
    constructor(private modal: ModalComponent) { }
}