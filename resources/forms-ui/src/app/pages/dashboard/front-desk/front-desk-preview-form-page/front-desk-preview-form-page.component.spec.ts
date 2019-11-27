import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskPreviewFormPageComponent } from './front-desk-preview-form-page.component';

describe('FrontDeskPreviewFormPageComponent', () => {
  let component: FrontDeskPreviewFormPageComponent;
  let fixture: ComponentFixture<FrontDeskPreviewFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskPreviewFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskPreviewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
