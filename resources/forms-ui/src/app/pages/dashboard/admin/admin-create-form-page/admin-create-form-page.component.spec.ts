import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateFormPageComponent } from './admin-create-form-page.component';

describe('AdminCreateFormPageComponent', () => {
  let component: AdminCreateFormPageComponent;
  let fixture: ComponentFixture<AdminCreateFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
