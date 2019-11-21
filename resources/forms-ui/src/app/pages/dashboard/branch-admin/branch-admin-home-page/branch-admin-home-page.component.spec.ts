import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAdminHomePageComponent } from './branch-admin-home-page.component';

describe('BranchAdminHomePageComponent', () => {
  let component: BranchAdminHomePageComponent;
  let fixture: ComponentFixture<BranchAdminHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchAdminHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAdminHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
