import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminListsPageComponent } from './view-admin-lists-page.component';

describe('ViewAdminListsPageComponent', () => {
  let component: ViewAdminListsPageComponent;
  let fixture: ComponentFixture<ViewAdminListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdminListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdminListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
