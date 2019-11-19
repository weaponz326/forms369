import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewBranchesPageComponent } from './admin-view-branches-page.component';

describe('AdminViewBranchesPageComponent', () => {
  let component: AdminViewBranchesPageComponent;
  let fixture: ComponentFixture<AdminViewBranchesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewBranchesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewBranchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
