import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPrintingPageComponent } from './form-printing-page.component';

describe('FormPrintingPageComponent', () => {
  let component: FormPrintingPageComponent;
  let fixture: ComponentFixture<FormPrintingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPrintingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
