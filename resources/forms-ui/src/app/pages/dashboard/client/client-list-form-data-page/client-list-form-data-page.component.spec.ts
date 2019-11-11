import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListFormDataPageComponent } from './client-list-form-data-page.component';

describe('ClientListFormDataPageComponent', () => {
  let component: ClientListFormDataPageComponent;
  let fixture: ComponentFixture<ClientListFormDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListFormDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListFormDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
