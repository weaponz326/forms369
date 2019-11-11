import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskSubmittedFormsListPageComponent } from './front-desk-submitted-forms-list-page.component';

describe('FrontDeskSubmittedFormsListPageComponent', () => {
  let component: FrontDeskSubmittedFormsListPageComponent;
  let fixture: ComponentFixture<FrontDeskSubmittedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskSubmittedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskSubmittedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
