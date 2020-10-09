import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAbuseReportsPageComponent } from './view-abuse-reports-page.component';

describe('ViewAbuseReportsPageComponent', () => {
  let component: ViewAbuseReportsPageComponent;
  let fixture: ComponentFixture<ViewAbuseReportsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAbuseReportsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAbuseReportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
