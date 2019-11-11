import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBranchPageComponent } from './create-branch-page.component';

describe('CreateBranchPageComponent', () => {
  let component: CreateBranchPageComponent;
  let fixture: ComponentFixture<CreateBranchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBranchPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBranchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
