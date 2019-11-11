import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormListsPageComponent } from './view-form-lists-page.component';

describe('ViewFormListsPageComponent', () => {
  let component: ViewFormListsPageComponent;
  let fixture: ComponentFixture<ViewFormListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFormListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
