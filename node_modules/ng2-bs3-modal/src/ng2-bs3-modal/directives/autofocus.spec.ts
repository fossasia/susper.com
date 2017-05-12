import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { Ng2Bs3ModalModule, ModalComponent } from '../ng2-bs3-modal';
import { createRoot, advance } from '../../test/common';

describe('AutofocusDirective', () => {

    let fixture: ComponentFixture<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Ng2Bs3ModalModule],
            declarations: [TestComponent, MissingModalComponent]
        });
    });

    afterEach(fakeAsync(() => {
        TestBed.resetTestingModule();
        tick(300); // backdrop transition
        tick(150); // modal transition
    }));

    it('should not throw an error if a modal isn\'t present', () => {
        const fixture = createRoot(MissingModalComponent);
    });

    it('should autofocus on element when modal is opened', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.open();
        tick();
        expect(document.getElementById('text')).toBe(document.activeElement);
    }));

    it('should autofocus on element when modal is opened with animations', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.animation = true;
        fixture.detectChanges();
        fixture.componentInstance.open();
        tick(150); // backdrop transition
        tick(300); // modal transition
        expect(document.getElementById('text')).toBe(document.activeElement);
    }));
});

@Component({
    selector: 'test-component',
    template: `
        <modal #modal [animation]="animation">
            <modal-header [show-close]="true">
                <h4 class="modal-title">I'm a modal!</h4>
            </modal-header>
            <modal-body>
                <input type="text" id="text" autofocus />
            </modal-body>
            <modal-footer [show-default-buttons]="true"></modal-footer>
        </modal>
    `
})
class TestComponent {
    @ViewChild(ModalComponent)
    modal: ModalComponent;
    animation: boolean = false;

    open() {
        return this.modal.open();
    }
}

@Component({
    selector: 'missing-modal-component',
    template: `
        <input type="text" id="text" autofocus />
    `
})
class MissingModalComponent {
}