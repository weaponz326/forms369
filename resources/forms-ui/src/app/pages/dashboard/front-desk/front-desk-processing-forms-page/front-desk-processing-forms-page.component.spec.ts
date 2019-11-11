import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskProcessingFormsPageComponent } from './front-desk-processing-forms-page.component';

describe('FrontDeskProcessingFormsPageComponent', () => {
  let component: FrontDeskProcessingFormsPageComponent;
  let fixture: ComponentFixture<FrontDeskProcessingFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskProcessingFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskProcessingFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
