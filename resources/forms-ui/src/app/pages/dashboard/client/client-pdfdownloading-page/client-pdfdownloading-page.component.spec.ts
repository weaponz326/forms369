import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPDFDownloadingPageComponent } from './client-pdfdownloading-page.component';

describe('ClientPDFDownloadingPageComponent', () => {
  let component: ClientPDFDownloadingPageComponent;
  let fixture: ComponentFixture<ClientPDFDownloadingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPDFDownloadingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPDFDownloadingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
