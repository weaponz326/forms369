import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormsEntryPageComponent } from './client-forms-entry-page.component';

describe('ClientFormsEntryPageComponent', () => {
  let component: ClientFormsEntryPageComponent;
  let fixture: ComponentFixture<ClientFormsEntryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormsEntryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormsEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
