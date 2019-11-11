import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBranchListsPageComponent } from './view-branch-lists-page.component';

describe('ViewBranchListsPageComponent', () => {
  let component: ViewBranchListsPageComponent;
  let fixture: ComponentFixture<ViewBranchListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBranchListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBranchListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
