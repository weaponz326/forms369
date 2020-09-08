import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatorHomePageComponent } from './form-creator-home-page.component';

describe('FormCreatorHomePageComponent', () => {
  let component: FormCreatorHomePageComponent;
  let fixture: ComponentFixture<FormCreatorHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCreatorHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreatorHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
