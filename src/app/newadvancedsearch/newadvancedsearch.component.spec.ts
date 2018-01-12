import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewadvancedsearchComponent } from './newadvancedsearch.component';
import {FooterNavbarComponent} from '../footer-navbar/footer-navbar.component';

describe('NewadvancedsearchComponent', () => {
    let component: NewadvancedsearchComponent;
    let fixture: ComponentFixture < NewadvancedsearchComponent > ;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
                declarations: [NewadvancedsearchComponent,
                    FooterNavbarComponent,

                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewadvancedsearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
