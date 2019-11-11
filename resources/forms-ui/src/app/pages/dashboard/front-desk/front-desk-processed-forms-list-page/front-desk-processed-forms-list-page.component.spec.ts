import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskProcessedFormsListPageComponent } from './front-desk-processed-forms-list-page.component';

describe('FrontDeskProcessedFormsListPageComponent', () => {
  let component: FrontDeskProcessedFormsListPageComponent;
  let fixture: ComponentFixture<FrontDeskProcessedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskProcessedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskProcessedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
