import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecSubmittedFormsListPageComponent } from './exec-submitted-forms-list-page.component';

describe('ExecSubmittedFormsListPageComponent', () => {
  let component: ExecSubmittedFormsListPageComponent;
  let fixture: ComponentFixture<ExecSubmittedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecSubmittedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecSubmittedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
