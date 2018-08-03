import { NgModule, Input, Component, ViewChild, Type, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Ng2Bs3ModalModule, ModalComponent } from './ng2-bs3-modal';
import { createRoot, advance, ticks } from '../test/common';

describe('ModalComponent', () => {

    beforeEach(function () {
        jasmine.addMatchers(window['jasmine-jquery-matchers']);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: TestComponent },
                    { path: 'test2', component: TestComponent2 }
                ])
            ]
        });
    });

    afterEach(fakeAsync(() => {
        TestBed.resetTestingModule();
        ticks(300, 150); // backdrop, modal transitions
    }));

    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(TestComponent);
        expect(fixture.componentInstance instanceof TestComponent).toBe(true, 'should create AppComponent');
    });

    it('should render', () => {
        const fixture = createRoot(TestComponent);
        expect(document.querySelectorAll('.modal').length).toBe(1);
    });

    it('should cleanup when destroyed', fakeAsync(() => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.ngOnDestroy();
        tick();
        expect(document.querySelectorAll('.modal').length).toBe(0);
    }));

    it('should emit onClose when modal is closed and animation is enabled', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onClose.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.close();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onClose when modal is closed and animation is disabled', fakeAsync(() => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        const spy = jasmine.createSpy('');
        modal.onClose.subscribe(spy);
        modal.close();
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('should emit value passed to close when onClose emits', fakeAsync(() => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        const spy = jasmine.createSpy('').and.callFake(x => x);
        const value = 'hello';
        modal.onClose.subscribe(spy);
        modal.close(value);
        tick();
        expect(spy.calls.first().returnValue).toBe(value);
    }));

    it('should emit onDismiss when modal is dimissed and animation is disabled', fakeAsync(() => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        const spy = jasmine.createSpy('');
        modal.onDismiss.subscribe(spy);
        modal.open();
        modal.dismiss();
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss when modal is dismissed and animation is enabled', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss only once', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('').and.callFake(() => {});

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should emit onDismiss only once when showDefaultButtons is false', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('').and.callFake(() => {});

        fixture.componentInstance.animate = true;
        fixture.componentInstance.defaultButtons = false;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.close();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss when modal is dismissed a second time from backdrop', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should emit onDismiss when modal is dismissed a second time from backdrop and showDefaultButtons is false', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.componentInstance.defaultButtons = false;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should emit onOpen when modal is opened and animations have been enabled', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onOpen.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    describe('Routing', () => {
        it('should not throw an error when navigating on modal close',
            fakeAsync(inject([Router], (router: Router) => {
                // let zone = window['Zone']['ProxyZoneSpec'].assertPresent().getDelegate();
                const fixture = createRoot(RootComponent, router);
                const modal = fixture.componentInstance.glue.testComponent.modal;

                modal.onClose.subscribe(() => {
                    router.navigateByUrl('/test2');
                    advance(fixture);
                    let content = fixture.debugElement.nativeElement.querySelector('test-component2');
                    expect(content).toHaveText('hello');
                });

                modal.open();
                advance(fixture, 150); // backdrop transition
                advance(fixture, 300); // modal transition

                modal.close();
                advance(fixture, 300); // modal transition
                advance(fixture, 150); // backdrop transition
            })));
    });
});

class GlueService {
    testComponent: TestComponent;
}

@Component({
    selector: 'test-component',
    template: `
        <button type="button" class="btn btn-default" (click)="modal.open()" (onClose)="onClose()">Open me!</button>

        <modal #modal [animation]="animate">
            <modal-header [show-close]="true">
                <h4 class="modal-title">I'm a modal!</h4>
            </modal-header>
            <modal-body>
                Hello World!
            </modal-body>
            <modal-footer [show-default-buttons]="defaultButtons"></modal-footer>
        </modal>
    `
})
class TestComponent {
    @ViewChild(ModalComponent)
    modal: ModalComponent;
    animate: boolean = false;
    defaultButtons: boolean = true;

    constructor( @Inject(GlueService) glue: GlueService) {
        glue.testComponent = this;
    }
}

@Component({
    selector: 'test-component2',
    template: `{{message}}`,
})
class TestComponent2 {
    message: string = 'hello';
}

@Component({
    selector: 'app-component',
    template: `
        <router-outlet></router-outlet>
    `
})
class RootComponent {
    constructor( @Inject(GlueService) public glue: GlueService) {
    }
}

@NgModule({
    imports: [RouterTestingModule, Ng2Bs3ModalModule, CommonModule],
    providers: [GlueService],
    declarations: [TestComponent, TestComponent2, RootComponent],
    exports: [TestComponent, TestComponent2, RootComponent]
})
class TestModule {
}
