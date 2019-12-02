import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecInProcessedFormsListPageComponent } from './exec-in-processed-forms-list-page.component';

describe('ExecInProcessedFormsListPageComponent', () => {
  let component: ExecInProcessedFormsListPageComponent;
  let fixture: ComponentFixture<ExecInProcessedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecInProcessedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecInProcessedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
