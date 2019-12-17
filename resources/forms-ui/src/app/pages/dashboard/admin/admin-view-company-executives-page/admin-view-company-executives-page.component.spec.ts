import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewCompanyExecutivesPageComponent } from './admin-view-company-executives-page.component';

describe('AdminViewCompanyExecutivesPageComponent', () => {
  let component: AdminViewCompanyExecutivesPageComponent;
  let fixture: ComponentFixture<AdminViewCompanyExecutivesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewCompanyExecutivesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewCompanyExecutivesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
