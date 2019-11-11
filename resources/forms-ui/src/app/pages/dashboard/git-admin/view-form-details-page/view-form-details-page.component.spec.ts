import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormDetailsPageComponent } from './view-form-details-page.component';

describe('ViewFormDetailsPageComponent', () => {
  let component: ViewFormDetailsPageComponent;
  let fixture: ComponentFixture<ViewFormDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFormDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
