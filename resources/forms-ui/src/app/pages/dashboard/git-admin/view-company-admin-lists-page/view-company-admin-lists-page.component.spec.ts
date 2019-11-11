import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyAdminListsPageComponent } from './view-company-admin-lists-page.component';

describe('ViewCompanyAdminListsPageComponent', () => {
  let component: ViewCompanyAdminListsPageComponent;
  let fixture: ComponentFixture<ViewCompanyAdminListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyAdminListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyAdminListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
