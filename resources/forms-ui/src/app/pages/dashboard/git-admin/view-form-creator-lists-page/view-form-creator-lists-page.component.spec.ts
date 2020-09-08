import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormCreatorListsPageComponent } from './view-form-creator-lists-page.component';

describe('ViewFormCreatorListsPageComponent', () => {
  let component: ViewFormCreatorListsPageComponent;
  let fixture: ComponentFixture<ViewFormCreatorListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFormCreatorListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormCreatorListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
