import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecRejectedFormsListPageComponent } from './exec-rejected-forms-list-page.component';

describe('ExecRejectedFormsListPageComponent', () => {
  let component: ExecRejectedFormsListPageComponent;
  let fixture: ComponentFixture<ExecRejectedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecRejectedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecRejectedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
