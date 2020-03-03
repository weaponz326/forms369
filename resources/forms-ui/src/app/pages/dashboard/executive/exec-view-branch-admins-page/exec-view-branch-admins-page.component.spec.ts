import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewBranchAdminsPageComponent } from './exec-view-branch-admins-page.component';

describe('ExecViewBranchAdminsPageComponent', () => {
  let component: ExecViewBranchAdminsPageComponent;
  let fixture: ComponentFixture<ExecViewBranchAdminsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewBranchAdminsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewBranchAdminsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
