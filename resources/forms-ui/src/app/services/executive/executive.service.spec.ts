import { TestBed } from '@angular/core/testing';

import { ExecutiveService } from './executive.service';

describe('ExecutiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecutiveService = TestBed.get(ExecutiveService);
    expect(service).toBeTruthy();
  });
});
