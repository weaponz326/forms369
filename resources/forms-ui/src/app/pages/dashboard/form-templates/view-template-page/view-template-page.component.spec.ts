import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplatePageComponent } from './view-template-page.component';

describe('ViewTemplatePageComponent', () => {
  let component: ViewTemplatePageComponent;
  let fixture: ComponentFixture<ViewTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTemplatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
