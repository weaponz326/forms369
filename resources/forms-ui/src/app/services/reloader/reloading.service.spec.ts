import { TestBed } from '@angular/core/testing';

import { ReloadingService } from './reloading.service';

describe('ReloadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReloadingService = TestBed.get(ReloadingService);
    expect(service).toBeTruthy();
  });
});
