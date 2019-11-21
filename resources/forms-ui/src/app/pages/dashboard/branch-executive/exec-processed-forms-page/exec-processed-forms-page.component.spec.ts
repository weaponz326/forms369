import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecProcessedFormsPageComponent } from './exec-processed-forms-page.component';

describe('ExecProcessedFormsPageComponent', () => {
  let component: ExecProcessedFormsPageComponent;
  let fixture: ComponentFixture<ExecProcessedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecProcessedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecProcessedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
