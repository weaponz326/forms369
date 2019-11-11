import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormViewPageComponent } from './admin-form-view-page.component';

describe('AdminFormViewPageComponent', () => {
  let component: AdminFormViewPageComponent;
  let fixture: ComponentFixture<AdminFormViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
