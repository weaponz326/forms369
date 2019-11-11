import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountCreatorComponent } from './user-account-creator.component';

describe('UserAccountCreatorComponent', () => {
  let component: UserAccountCreatorComponent;
  let fixture: ComponentFixture<UserAccountCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
