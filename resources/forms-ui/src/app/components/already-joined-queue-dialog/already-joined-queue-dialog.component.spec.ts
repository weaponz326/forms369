import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyJoinedQueueDialogComponent } from './already-joined-queue-dialog.component';

describe('AlreadyJoinedQueueDialogComponent', () => {
  let component: AlreadyJoinedQueueDialogComponent;
  let fixture: ComponentFixture<AlreadyJoinedQueueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyJoinedQueueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyJoinedQueueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
