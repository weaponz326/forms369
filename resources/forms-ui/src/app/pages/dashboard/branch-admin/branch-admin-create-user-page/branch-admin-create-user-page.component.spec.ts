import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAdminCreateUserPageComponent } from './branch-admin-create-user-page.component';

describe('BranchAdminCreateUserPageComponent', () => {
  let component: BranchAdminCreateUserPageComponent;
  let fixture: ComponentFixture<BranchAdminCreateUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchAdminCreateUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAdminCreateUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
