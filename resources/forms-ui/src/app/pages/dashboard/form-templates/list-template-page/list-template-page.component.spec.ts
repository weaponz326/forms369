import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTemplatePageComponent } from './list-template-page.component';

describe('ListTemplatePageComponent', () => {
  let component: ListTemplatePageComponent;
  let fixture: ComponentFixture<ListTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTemplatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
