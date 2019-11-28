import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecBranchesListPageComponent } from './exec-branches-list-page.component';

describe('ExecBranchesListPageComponent', () => {
  let component: ExecBranchesListPageComponent;
  let fixture: ComponentFixture<ExecBranchesListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecBranchesListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecBranchesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
