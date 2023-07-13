import { TestBed } from '@angular/core/testing';

import { FsLibService } from './fs-lib.service';

describe('FsLibService', () => {
  let service: FsLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FsLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
