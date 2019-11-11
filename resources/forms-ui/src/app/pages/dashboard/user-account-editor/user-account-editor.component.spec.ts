import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountEditorComponent } from './user-account-editor.component';

describe('UserAccountEditorComponent', () => {
  let component: UserAccountEditorComponent;
  let fixture: ComponentFixture<UserAccountEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
