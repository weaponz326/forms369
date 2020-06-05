import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFavoriteFormsPageComponent } from './client-favorite-forms-page.component';

describe('ClientFavoriteFormsPageComponent', () => {
  let component: ClientFavoriteFormsPageComponent;
  let fixture: ComponentFixture<ClientFavoriteFormsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFavoriteFormsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFavoriteFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
