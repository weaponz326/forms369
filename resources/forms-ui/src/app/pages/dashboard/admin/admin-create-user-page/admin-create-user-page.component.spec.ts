import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateUserPageComponent } from './admin-create-user-page.component';

describe('AdminCreateUserPageComponent', () => {
  let component: AdminCreateUserPageComponent;
  let fixture: ComponentFixture<AdminCreateUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
