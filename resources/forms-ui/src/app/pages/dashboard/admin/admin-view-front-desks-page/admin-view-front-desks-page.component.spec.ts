import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewFrontDesksPageComponent } from './admin-view-front-desks-page.component';

describe('AdminViewFrontDesksPageComponent', () => {
  let component: AdminViewFrontDesksPageComponent;
  let fixture: ComponentFixture<AdminViewFrontDesksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewFrontDesksPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewFrontDesksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
