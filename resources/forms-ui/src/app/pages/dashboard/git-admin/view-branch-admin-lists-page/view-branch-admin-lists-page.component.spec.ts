import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBranchAdminListsPageComponent } from './view-branch-admin-lists-page.component';

describe('ViewBranchAdminListsComponent', () => {
  let component: ViewBranchAdminListsPageComponent;
  let fixture: ComponentFixture<ViewBranchAdminListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBranchAdminListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBranchAdminListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
