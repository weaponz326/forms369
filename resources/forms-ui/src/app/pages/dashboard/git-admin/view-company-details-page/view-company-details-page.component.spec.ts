import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyDetailsPageComponent } from './view-company-details-page.component';

describe('ViewCompanyDetailsPageComponent', () => {
  let component: ViewCompanyDetailsPageComponent;
  let fixture: ComponentFixture<ViewCompanyDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompanyDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompanyDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
