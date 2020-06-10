import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSectorListPageComponent } from './view-sector-list-page.component';

describe('ViewSectorListPageComponent', () => {
  let component: ViewSectorListPageComponent;
  let fixture: ComponentFixture<ViewSectorListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSectorListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSectorListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
