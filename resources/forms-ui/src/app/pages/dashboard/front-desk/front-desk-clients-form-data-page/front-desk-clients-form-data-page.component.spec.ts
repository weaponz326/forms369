import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskClientsFormDataPageComponent } from './front-desk-clients-form-data-page.component';

describe('FrontDeskClientsFormDataPageComponent', () => {
  let component: FrontDeskClientsFormDataPageComponent;
  let fixture: ComponentFixture<FrontDeskClientsFormDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskClientsFormDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskClientsFormDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
