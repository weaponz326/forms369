import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinQueueDialogComponent } from './join-queue-dialog.component';

describe('JoinQueueDialogComponent', () => {
  let component: JoinQueueDialogComponent;
  let fixture: ComponentFixture<JoinQueueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinQueueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinQueueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
