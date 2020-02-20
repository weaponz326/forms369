import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPdfPrintingPageComponent } from './client-pdf-printing-page.component';

describe('ClientPdfPrintingPageComponent', () => {
  let component: ClientPdfPrintingPageComponent;
  let fixture: ComponentFixture<ClientPdfPrintingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPdfPrintingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPdfPrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
