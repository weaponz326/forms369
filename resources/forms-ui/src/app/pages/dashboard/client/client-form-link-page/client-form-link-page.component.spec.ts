import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormLinkPageComponent } from './client-form-link-page.component';

describe('ClientFormLinkPageComponent', () => {
  let component: ClientFormLinkPageComponent;
  let fixture: ComponentFixture<ClientFormLinkPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormLinkPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormLinkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
