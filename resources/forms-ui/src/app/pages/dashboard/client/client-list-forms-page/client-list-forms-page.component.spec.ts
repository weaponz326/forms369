import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListFormsPageComponent } from './client-list-forms-page.component';

describe('ClientListFormsPageComponent', () => {
  let component: ClientListFormsPageComponent;
  let fixture: ComponentFixture<ClientListFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
