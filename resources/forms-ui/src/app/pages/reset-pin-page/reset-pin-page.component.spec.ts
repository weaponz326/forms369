import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPinPageComponent } from './reset-pin-page.component';

describe('ResetPinPageComponent', () => {
  let component: ResetPinPageComponent;
  let fixture: ComponentFixture<ResetPinPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPinPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
