import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSectionsPageComponent } from './view-sections-page.component';

describe('ViewSectionsPageComponent', () => {
  let component: ViewSectionsPageComponent;
  let fixture: ComponentFixture<ViewSectionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSectionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSectionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
