import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormsHistoryPageComponent } from './client-forms-history-page.component';

describe('ClientFormsHistoryPageComponent', () => {
  let component: ClientFormsHistoryPageComponent;
  let fixture: ComponentFixture<ClientFormsHistoryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormsHistoryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormsHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
