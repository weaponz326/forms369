import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecAccountsListPageComponent } from './exec-accounts-list-page.component';

describe('ExecAccountsListPageComponent', () => {
  let component: ExecAccountsListPageComponent;
  let fixture: ComponentFixture<ExecAccountsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecAccountsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecAccountsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
