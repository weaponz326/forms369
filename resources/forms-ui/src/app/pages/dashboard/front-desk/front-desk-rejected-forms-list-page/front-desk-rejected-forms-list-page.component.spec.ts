import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskRejectedFormsListPageComponent } from './front-desk-rejected-forms-list-page.component';

describe('FrontDeskRejectedFormsListPageComponent', () => {
  let component: FrontDeskRejectedFormsListPageComponent;
  let fixture: ComponentFixture<FrontDeskRejectedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskRejectedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskRejectedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
