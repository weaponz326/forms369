import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserAccountPageComponent } from './create-user-page.component';

describe('CreateUserAccountPageComponent', () => {
  let component: CreateUserAccountPageComponent;
  let fixture: ComponentFixture<CreateUserAccountPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserAccountPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
