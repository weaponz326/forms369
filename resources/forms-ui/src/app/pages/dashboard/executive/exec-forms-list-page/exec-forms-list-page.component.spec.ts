import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecFormsListPageComponent } from './exec-forms-list-page.component';

describe('ExecFormsListPageComponent', () => {
  let component: ExecFormsListPageComponent;
  let fixture: ComponentFixture<ExecFormsListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecFormsListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecFormsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
