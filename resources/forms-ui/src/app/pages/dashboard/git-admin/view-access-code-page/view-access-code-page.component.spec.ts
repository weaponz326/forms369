import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccessCodePageComponent } from './view-access-code-page.component';

describe('ViewAccessCodePageComponent', () => {
  let component: ViewAccessCodePageComponent;
  let fixture: ComponentFixture<ViewAccessCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAccessCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccessCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
