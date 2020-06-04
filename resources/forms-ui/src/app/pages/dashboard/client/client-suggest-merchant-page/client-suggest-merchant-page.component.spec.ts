import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSuggestMerchantPageComponent } from './client-suggest-merchant-page.component';

describe('ClientSuggestMerchantPageComponent', () => {
  let component: ClientSuggestMerchantPageComponent;
  let fixture: ComponentFixture<ClientSuggestMerchantPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSuggestMerchantPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSuggestMerchantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
