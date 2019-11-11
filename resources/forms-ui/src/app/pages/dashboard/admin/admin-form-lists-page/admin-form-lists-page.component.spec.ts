import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormListsPageComponent } from './admin-form-lists-page.component';

describe('AdminFormListsPageComponent', () => {
  let component: AdminFormListsPageComponent;
  let fixture: ComponentFixture<AdminFormListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
