import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAuthPageComponent } from './client-auth-page.component';

describe('ClientAuthPageComponent', () => {
  let component: ClientAuthPageComponent;
  let fixture: ComponentFixture<ClientAuthPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAuthPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
