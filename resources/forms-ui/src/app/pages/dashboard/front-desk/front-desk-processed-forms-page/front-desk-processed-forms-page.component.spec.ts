import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskProcessedFormsPageComponent } from './front-desk-processed-forms-page.component';

describe('FrontDeskProcessedFormsPageComponent', () => {
  let component: FrontDeskProcessedFormsPageComponent;
  let fixture: ComponentFixture<FrontDeskProcessedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskProcessedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskProcessedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
