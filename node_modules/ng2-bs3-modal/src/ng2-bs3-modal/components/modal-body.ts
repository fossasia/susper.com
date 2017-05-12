import { Component, Input, Output, EventEmitter, Type } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
    selector: 'modal-body',
    template: `
        <div class="modal-body">
            <ng-content></ng-content>
        </div>
    `
})
export class ModalBodyComponent {
}