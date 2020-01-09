import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDeskClientsFormPageComponent } from './front-desk-clients-form-page.component';

describe('FrontDeskClientsFormPageComponent', () => {
  let component: FrontDeskClientsFormPageComponent;
  let fixture: ComponentFixture<FrontDeskClientsFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDeskClientsFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDeskClientsFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
