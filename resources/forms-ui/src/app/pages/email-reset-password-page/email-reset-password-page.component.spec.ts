import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResetPasswordPageComponent } from './email-reset-password-page.component';

describe('EmailResetPasswordPageComponent', () => {
  let component: EmailResetPasswordPageComponent;
  let fixture: ComponentFixture<EmailResetPasswordPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailResetPasswordPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailResetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
