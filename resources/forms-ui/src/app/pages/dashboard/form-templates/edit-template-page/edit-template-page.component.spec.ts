import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplatePageComponent } from './edit-template-page.component';

describe('EditTemplatePageComponent', () => {
  let component: EditTemplatePageComponent;
  let fixture: ComponentFixture<EditTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTemplatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
