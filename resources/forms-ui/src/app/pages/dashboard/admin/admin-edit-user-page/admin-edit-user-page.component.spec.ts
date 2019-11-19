import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditUserPageComponent } from './admin-edit-user-page.component';

describe('AdminEditUserPageComponent', () => {
  let component: AdminEditUserPageComponent;
  let fixture: ComponentFixture<AdminEditUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
