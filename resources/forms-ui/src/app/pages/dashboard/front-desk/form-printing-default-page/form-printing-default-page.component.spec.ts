import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrintingDefaultPageComponent } from './form-printing-default-page.component';

describe('FormPrintingDefaultPageComponent', () => {
  let component: FormPrintingDefaultPageComponent;
  let fixture: ComponentFixture<FormPrintingDefaultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPrintingDefaultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPrintingDefaultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
