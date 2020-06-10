import { TestBed } from '@angular/core/testing';

import { SectorsService } from './sectors.service';

describe('SectorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectorsService = TestBed.get(SectorsService);
    expect(service).toBeTruthy();
  });
});
