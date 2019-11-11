import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskSubmittedFormsPageComponent } from './front-desk-submitted-forms-page.component';

describe('FrontDeskSubmittedFormsPageComponent', () => {
  let component: FrontDeskSubmittedFormsPageComponent;
  let fixture: ComponentFixture<FrontDeskSubmittedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskSubmittedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskSubmittedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
