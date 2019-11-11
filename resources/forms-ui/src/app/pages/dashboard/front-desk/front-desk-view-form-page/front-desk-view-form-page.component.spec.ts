import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskViewFormPageComponent } from './front-desk-view-form-page.component';

describe('FrontDeskViewFormPageComponent', () => {
  let component: FrontDeskViewFormPageComponent;
  let fixture: ComponentFixture<FrontDeskViewFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskViewFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskViewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
