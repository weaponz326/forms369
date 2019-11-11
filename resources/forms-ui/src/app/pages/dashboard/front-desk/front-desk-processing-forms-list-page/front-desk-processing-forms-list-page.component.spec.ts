import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskProcessingFormsListPageComponent } from './front-desk-processing-forms-list-page.component';

describe('FrontDeskProcessingFormsListPageComponent', () => {
  let component: FrontDeskProcessingFormsListPageComponent;
  let fixture: ComponentFixture<FrontDeskProcessingFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskProcessingFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskProcessingFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
