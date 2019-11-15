import { TestBed } from '@angular/core/testing';

import { ListViewService } from './list-view.service';

describe('ListViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListViewService = TestBed.get(ListViewService);
    expect(service).toBeTruthy();
  });
});
