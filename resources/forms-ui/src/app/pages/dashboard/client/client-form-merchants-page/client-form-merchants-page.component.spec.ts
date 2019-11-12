import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormMerchantsPageComponent } from './client-form-merchants-page.component';

describe('ClientFormMerchantsPageComponent', () => {
  let component: ClientFormMerchantsPageComponent;
  let fixture: ComponentFixture<ClientFormMerchantsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormMerchantsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormMerchantsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
