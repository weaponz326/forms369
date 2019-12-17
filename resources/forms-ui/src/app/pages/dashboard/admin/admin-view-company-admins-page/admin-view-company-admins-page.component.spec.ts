import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewCompanyAdminsPageComponent } from './admin-view-company-admins-page.component';

describe('AdminViewCompanyAdminsPageComponent', () => {
  let component: AdminViewCompanyAdminsPageComponent;
  let fixture: ComponentFixture<AdminViewCompanyAdminsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewCompanyAdminsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewCompanyAdminsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
