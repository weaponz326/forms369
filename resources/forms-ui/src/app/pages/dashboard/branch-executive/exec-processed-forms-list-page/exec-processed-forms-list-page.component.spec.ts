import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecProcessedFormsListPageComponent } from './exec-processed-forms-list-page.component';

describe('ExecProcessedFormsListPageComponent', () => {
  let component: ExecProcessedFormsListPageComponent;
  let fixture: ComponentFixture<ExecProcessedFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecProcessedFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecProcessedFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
