import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewBranchExectivesPageComponent } from './exec-view-branch-exectives-page.component';

describe('ExecViewBranchExectivesPageComponent', () => {
  let component: ExecViewBranchExectivesPageComponent;
  let fixture: ComponentFixture<ExecViewBranchExectivesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewBranchExectivesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewBranchExectivesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
