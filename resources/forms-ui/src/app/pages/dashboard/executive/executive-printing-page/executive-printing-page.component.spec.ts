import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivePrintingPageComponent } from './executive-printing-page.component';

describe('ExecutivePrintingPageComponent', () => {
  let component: ExecutivePrintingPageComponent;
  let fixture: ComponentFixture<ExecutivePrintingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutivePrintingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutivePrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
