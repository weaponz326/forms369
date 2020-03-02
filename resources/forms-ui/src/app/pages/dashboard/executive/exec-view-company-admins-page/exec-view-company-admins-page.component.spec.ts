import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewCompanyAdminsPageComponent } from './exec-view-company-admins-page.component';

describe('ExecViewCompanyAdminsPageComponent', () => {
  let component: ExecViewCompanyAdminsPageComponent;
  let fixture: ComponentFixture<ExecViewCompanyAdminsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewCompanyAdminsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewCompanyAdminsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
