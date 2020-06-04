import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDraftFormsPageComponent } from './client-draft-forms-page.component';

describe('ClientDraftFormsPageComponent', () => {
  let component: ClientDraftFormsPageComponent;
  let fixture: ComponentFixture<ClientDraftFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDraftFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDraftFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
