import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivePdfPrintingPageComponent } from './executive-pdf-printing-page.component';

describe('ExecutivePdfPrintingPageComponent', () => {
  let component: ExecutivePdfPrintingPageComponent;
  let fixture: ComponentFixture<ExecutivePdfPrintingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutivePdfPrintingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutivePdfPrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
