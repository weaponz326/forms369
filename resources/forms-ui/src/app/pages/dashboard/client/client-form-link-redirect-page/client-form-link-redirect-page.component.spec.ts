import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormLinkRedirectPageComponent } from './client-form-link-redirect-page.component';

describe('ClientFormLinkRedirectPageComponent', () => {
  let component: ClientFormLinkRedirectPageComponent;
  let fixture: ComponentFixture<ClientFormLinkRedirectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormLinkRedirectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormLinkRedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
