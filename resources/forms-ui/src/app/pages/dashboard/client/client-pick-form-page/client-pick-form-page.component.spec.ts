import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPickFormPageComponent } from './client-pick-form-page.component';

describe('ClientPickFormPageComponent', () => {
  let component: ClientPickFormPageComponent;
  let fixture: ComponentFixture<ClientPickFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPickFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPickFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
