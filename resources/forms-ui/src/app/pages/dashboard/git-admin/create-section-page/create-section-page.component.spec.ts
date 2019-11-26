import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSectionPageComponent } from './create-section-page.component';

describe('CreateSectionPageComponent', () => {
  let component: CreateSectionPageComponent;
  let fixture: ComponentFixture<CreateSectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
