import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecViewAccountDetailsPageComponent } from './exec-view-account-details-page.component';

describe('ExecViewAccountDetailsPageComponent', () => {
  let component: ExecViewAccountDetailsPageComponent;
  let fixture: ComponentFixture<ExecViewAccountDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecViewAccountDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecViewAccountDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
