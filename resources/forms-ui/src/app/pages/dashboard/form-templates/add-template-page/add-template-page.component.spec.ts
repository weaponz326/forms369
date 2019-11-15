import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplatePageComponent } from './add-template-page.component';

describe('AddTemplatePageComponent', () => {
  let component: AddTemplatePageComponent;
  let fixture: ComponentFixture<AddTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTemplatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
