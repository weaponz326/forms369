import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSettingsPageComponent } from './client-settings-page.component';

describe('ClientSettingsPageComponent', () => {
  let component: ClientSettingsPageComponent;
  let fixture: ComponentFixture<ClientSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSettingsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
