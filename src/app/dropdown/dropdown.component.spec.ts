import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have dropdown-menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div .side-menu')).toBeTruthy();
  });

  it('should have dropdown-menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div .dropdown-menu')).toBeTruthy();
  });

  it('should have menu-row items', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div .menu-row')).toBeTruthy();
  });
});
