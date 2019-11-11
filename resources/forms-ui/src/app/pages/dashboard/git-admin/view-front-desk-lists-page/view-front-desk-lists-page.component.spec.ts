import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFrontDeskListsPageComponent } from './view-front-desk-lists-page.component';

describe('ViewFrontDeskListsPageComponent', () => {
  let component: ViewFrontDeskListsPageComponent;
  let fixture: ComponentFixture<ViewFrontDeskListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFrontDeskListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFrontDeskListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
