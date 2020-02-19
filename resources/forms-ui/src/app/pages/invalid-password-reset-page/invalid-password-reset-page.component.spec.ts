import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidPasswordResetPageComponent } from './invalid-password-reset-page.component';

describe('InvalidPasswordResetPageComponent', () => {
  let component: InvalidPasswordResetPageComponent;
  let fixture: ComponentFixture<InvalidPasswordResetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidPasswordResetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidPasswordResetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
