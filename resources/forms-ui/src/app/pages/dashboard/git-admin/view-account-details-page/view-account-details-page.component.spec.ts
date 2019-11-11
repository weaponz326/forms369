import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountDetailsPageComponent } from './view-account-details-page.component';

describe('ViewAccountDetailsPageComponent', () => {
  let component: ViewAccountDetailsPageComponent;
  let fixture: ComponentFixture<ViewAccountDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAccountDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
