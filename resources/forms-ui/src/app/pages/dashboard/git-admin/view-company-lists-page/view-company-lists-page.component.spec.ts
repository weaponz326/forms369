import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyListsPageComponent } from './view-company-lists-page.component';

describe('ViewCompanyListsPageComponent', () => {
  let component: ViewCompanyListsPageComponent;
  let fixture: ComponentFixture<ViewCompanyListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
