import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBranchExecutiveListsPageComponent } from './view-branch-executive-lists-page.component';

describe('ViewBranchExecutiveListsPageComponent', () => {
  let component: ViewBranchExecutiveListsPageComponent;
  let fixture: ComponentFixture<ViewBranchExecutiveListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBranchExecutiveListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBranchExecutiveListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
