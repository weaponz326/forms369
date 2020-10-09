import { TestBed } from '@angular/core/testing';

import { AbuseReportsService } from './abuse-reports.service';

describe('AbuseReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbuseReportsService = TestBed.get(AbuseReportsService);
    expect(service).toBeTruthy();
  });
});
