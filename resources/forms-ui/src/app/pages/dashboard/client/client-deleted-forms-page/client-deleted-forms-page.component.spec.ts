import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDeletedFormsPageComponent } from './client-deleted-forms-page.component';

describe('ClientDeletedFormsPageComponent', () => {
  let component: ClientDeletedFormsPageComponent;
  let fixture: ComponentFixture<ClientDeletedFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDeletedFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDeletedFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
