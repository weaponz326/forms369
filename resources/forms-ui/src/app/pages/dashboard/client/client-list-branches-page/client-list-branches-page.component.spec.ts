import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListBranchesPageComponent } from './client-list-branches-page.component';

describe('ClientListBranchesPageComponent', () => {
  let component: ClientListBranchesPageComponent;
  let fixture: ComponentFixture<ClientListBranchesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListBranchesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListBranchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
