import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecClientsFormsDataPageComponent } from './exec-clients-forms-data-page.component';

describe('ExecClientsFormsDataPageComponent', () => {
  let component: ExecClientsFormsDataPageComponent;
  let fixture: ComponentFixture<ExecClientsFormsDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecClientsFormsDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecClientsFormsDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
