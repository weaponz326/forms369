import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormsDraftsPageComponent } from './client-forms-drafts-page.component';

describe('ClientFormsDraftsPageComponent', () => {
  let component: ClientFormsDraftsPageComponent;
  let fixture: ComponentFixture<ClientFormsDraftsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFormsDraftsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormsDraftsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
