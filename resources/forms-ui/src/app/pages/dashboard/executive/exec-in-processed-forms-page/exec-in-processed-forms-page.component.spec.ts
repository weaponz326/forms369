import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecInProcessedFormsPageComponent } from './exec-in-processed-forms-page.component';

describe('ExecInProcessedFormsPageComponent', () => {
  let component: ExecInProcessedFormsPageComponent;
  let fixture: ComponentFixture<ExecInProcessedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecInProcessedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecInProcessedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
