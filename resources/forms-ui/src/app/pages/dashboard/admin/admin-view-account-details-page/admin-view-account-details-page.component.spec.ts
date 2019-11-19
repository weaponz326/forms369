import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAccountDetailsPageComponent } from './admin-view-account-details-page.component';

describe('AdminViewAccountDetailsPageComponent', () => {
  let component: AdminViewAccountDetailsPageComponent;
  let fixture: ComponentFixture<AdminViewAccountDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewAccountDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewAccountDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
