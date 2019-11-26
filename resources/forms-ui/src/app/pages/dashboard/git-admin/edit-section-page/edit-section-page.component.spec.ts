import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectionPageComponent } from './edit-section-page.component';

describe('EditSectionPageComponent', () => {
  let component: EditSectionPageComponent;
  let fixture: ComponentFixture<EditSectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
