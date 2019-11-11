import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDesktopHomePageComponent } from './front-desk-home-page.component';

describe('FrontDesktopHomePageComponent', () => {
  let component: FrontDesktopHomePageComponent;
  let fixture: ComponentFixture<FrontDesktopHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontDesktopHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontDesktopHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
