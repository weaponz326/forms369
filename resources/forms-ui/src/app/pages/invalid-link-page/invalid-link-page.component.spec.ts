import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidLinkPageComponent } from './invalid-link-page.component';

describe('InvalidLinkPageComponent', () => {
  let component: InvalidLinkPageComponent;
  let fixture: ComponentFixture<InvalidLinkPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidLinkPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidLinkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
