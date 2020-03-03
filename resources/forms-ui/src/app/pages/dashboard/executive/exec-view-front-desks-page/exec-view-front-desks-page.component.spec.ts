import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewFrontDesksPageComponent } from './exec-view-front-desks-page.component';

describe('ExecViewFrontDesksPageComponent', () => {
  let component: ExecViewFrontDesksPageComponent;
  let fixture: ComponentFixture<ExecViewFrontDesksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewFrontDesksPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewFrontDesksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
