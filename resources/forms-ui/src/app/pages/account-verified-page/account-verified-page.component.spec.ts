import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerifiedPageComponent } from './account-verified-page.component';

describe('AccountVerifiedPageComponent', () => {
  let component: AccountVerifiedPageComponent;
  let fixture: ComponentFixture<AccountVerifiedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountVerifiedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVerifiedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
