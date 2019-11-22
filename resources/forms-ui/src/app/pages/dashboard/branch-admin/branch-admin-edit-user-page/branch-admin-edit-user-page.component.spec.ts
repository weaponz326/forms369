import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAdminEditUserPageComponent } from './branch-admin-edit-user-page.component';

describe('BranchAdminEditUserPageComponent', () => {
  let component: BranchAdminEditUserPageComponent;
  let fixture: ComponentFixture<BranchAdminEditUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchAdminEditUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAdminEditUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
