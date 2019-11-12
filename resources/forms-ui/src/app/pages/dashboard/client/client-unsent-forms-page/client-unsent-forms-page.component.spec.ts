import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUnsentFormsPageComponent } from './client-unsent-forms-page.component';

describe('ClientUnsentFormsPageComponent', () => {
  let component: ClientUnsentFormsPageComponent;
  let fixture: ComponentFixture<ClientUnsentFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUnsentFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUnsentFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
