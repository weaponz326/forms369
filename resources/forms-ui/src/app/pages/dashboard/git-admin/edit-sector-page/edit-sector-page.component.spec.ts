import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectorPageComponent } from './edit-sector-page.component';

describe('EditSectorPageComponent', () => {
  let component: EditSectorPageComponent;
  let fixture: ComponentFixture<EditSectorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSectorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSectorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
