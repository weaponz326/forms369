import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveHomePageComponent } from './executive-home-page.component';

describe('ExecutiveHomePageComponent', () => {
  let component: ExecutiveHomePageComponent;
  let fixture: ComponentFixture<ExecutiveHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
