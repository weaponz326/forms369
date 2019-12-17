import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewBranchAdminsPageComponent } from './admin-view-branch-admins-page.component';

describe('AdminViewBranchAdminsPageComponent', () => {
  let component: AdminViewBranchAdminsPageComponent;
  let fixture: ComponentFixture<AdminViewBranchAdminsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewBranchAdminsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewBranchAdminsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
