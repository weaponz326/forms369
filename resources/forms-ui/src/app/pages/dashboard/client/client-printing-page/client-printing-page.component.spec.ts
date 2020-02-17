import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPrintingPageComponent } from './client-printing-page.component';

describe('ClientPrintingPageComponent', () => {
  let component: ClientPrintingPageComponent;
  let fixture: ComponentFixture<ClientPrintingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPrintingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPrintingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
