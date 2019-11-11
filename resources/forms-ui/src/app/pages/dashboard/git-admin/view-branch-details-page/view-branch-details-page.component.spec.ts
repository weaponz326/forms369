import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBranchDetailsPageComponent } from './view-branch-details-page.component';

describe('ViewBranchDetailsPageComponent', () => {
  let component: ViewBranchDetailsPageComponent;
  let fixture: ComponentFixture<ViewBranchDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBranchDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBranchDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
