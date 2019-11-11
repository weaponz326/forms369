import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountListsPageComponent } from './view-account-lists-page.component';

describe('ViewAccountListsPageComponent', () => {
  let component: ViewAccountListsPageComponent;
  let fixture: ComponentFixture<ViewAccountListsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAccountListsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountListsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
