import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSectorPageComponent } from './create-sector-page.component';

describe('CreateSectorPageComponent', () => {
  let component: CreateSectorPageComponent;
  let fixture: ComponentFixture<CreateSectorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSectorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSectorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
