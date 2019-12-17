import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewBranchExecutivesPageComponent } from './admin-view-branch-executives-page.component';

describe('AdminViewBranchExecutivesPageComponent', () => {
  let component: AdminViewBranchExecutivesPageComponent;
  let fixture: ComponentFixture<AdminViewBranchExecutivesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewBranchExecutivesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewBranchExecutivesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
