import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecClientFormsPageComponent } from './exec-client-forms-page.component';

describe('ExecClientFormsPageComponent', () => {
  let component: ExecClientFormsPageComponent;
  let fixture: ComponentFixture<ExecClientFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecClientFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecClientFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
