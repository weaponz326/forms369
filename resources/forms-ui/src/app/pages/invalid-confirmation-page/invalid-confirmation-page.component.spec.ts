import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidConfirmationPageComponent } from './invalid-confirmation-page.component';

describe('InvalidConfirmationPageComponent', () => {
  let component: InvalidConfirmationPageComponent;
  let fixture: ComponentFixture<InvalidConfirmationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidConfirmationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
