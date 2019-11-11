import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormEditPageComponent } from './admin-form-edit-page.component';

describe('AdminFormEditPageComponent', () => {
  let component: AdminFormEditPageComponent;
  let fixture: ComponentFixture<AdminFormEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
