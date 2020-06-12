import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidResetPinPageComponent } from './invalid-reset-pin-page.component';

describe('InvalidResetPinPageComponent', () => {
  let component: InvalidResetPinPageComponent;
  let fixture: ComponentFixture<InvalidResetPinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidResetPinPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidResetPinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
