import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecSubmittedFormsPageComponent } from './exec-submitted-forms-page.component';

describe('ExecSubmittedFormsPageComponent', () => {
  let component: ExecSubmittedFormsPageComponent;
  let fixture: ComponentFixture<ExecSubmittedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecSubmittedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecSubmittedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
