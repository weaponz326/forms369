import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewSuperExectivesPageComponent } from './exec-view-super-exectives-page.component';

describe('ExecViewSuperExectivesPageComponent', () => {
  let component: ExecViewSuperExectivesPageComponent;
  let fixture: ComponentFixture<ExecViewSuperExectivesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewSuperExectivesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewSuperExectivesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
