import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyPageComponent } from './edit-company-page.component';

describe('EditCompanyPageComponent', () => {
  let component: EditCompanyPageComponent;
  let fixture: ComponentFixture<EditCompanyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
