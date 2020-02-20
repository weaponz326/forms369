import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormNewEntryPageComponent } from './client-form-new-entry-page.component';

describe('ClientFormNewEntryPageComponent', () => {
  let component: ClientFormNewEntryPageComponent;
  let fixture: ComponentFixture<ClientFormNewEntryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormNewEntryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormNewEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
