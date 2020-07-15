import { TestBed } from '@angular/core/testing';

import { QMSQueueingService } from './qmsqueueing.service';

describe('QMSQueueingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QMSQueueingService = TestBed.get(QMSQueueingService);
    expect(service).toBeTruthy();
  });
});
