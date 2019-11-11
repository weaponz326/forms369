import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExecutiveListsPageComponent } from './view-executive-lists-page.component';

describe('ViewExecutiveListsPageComponent', () => {
  let component: ViewExecutiveListsPageComponent;
  let fixture: ComponentFixture<ViewExecutiveListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExecutiveListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExecutiveListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
