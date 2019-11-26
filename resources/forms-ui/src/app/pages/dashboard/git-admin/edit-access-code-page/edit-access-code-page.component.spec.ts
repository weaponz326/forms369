import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessCodePageComponent } from './edit-access-code-page.component';

describe('EditAccessCodePageComponent', () => {
  let component: EditAccessCodePageComponent;
  let fixture: ComponentFixture<EditAccessCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccessCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccessCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
