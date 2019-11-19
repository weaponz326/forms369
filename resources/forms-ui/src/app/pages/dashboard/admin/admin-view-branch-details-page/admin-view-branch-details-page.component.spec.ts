import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewBranchDetailsPageComponent } from './admin-view-branch-details-page.component';

describe('AdminViewBranchDetailsPageComponent', () => {
  let component: AdminViewBranchDetailsPageComponent;
  let fixture: ComponentFixture<AdminViewBranchDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewBranchDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewBranchDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
