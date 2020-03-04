import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsCountryPickerComponent } from './forms-country-picker.component';

describe('FormsCountryPickerComponent', () => {
  let component: FormsCountryPickerComponent;
  let fixture: ComponentFixture<FormsCountryPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsCountryPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsCountryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
