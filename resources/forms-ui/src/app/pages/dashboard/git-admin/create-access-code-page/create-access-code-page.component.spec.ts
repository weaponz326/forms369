import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccessCodePageComponent } from './create-access-code-page.component';

describe('CreateAccessCodePageComponent', () => {
  let component: CreateAccessCodePageComponent;
  let fixture: ComponentFixture<CreateAccessCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccessCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccessCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
